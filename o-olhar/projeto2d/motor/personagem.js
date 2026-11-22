// Motor 2D — personagem cartoon: cabeça redonda grande, braços "macarrão", túnica, rosto expressivo.
// Coordenadas locais: pés em (0,0), cabeça em (0,-300), raio da cabeça 74. Frente voltada para a câmera.
import { TAU, lerp, clamp } from './base.js';
import { OUT, LW, shape, circle, ellipse, limb, line, glow, poly } from './desenho.js';

const HEAD_Y = -300, HEAD_R = 74;
export const ARM = { up: 64, low: 60 };

export class Personagem {
  constructor(def) { this.d = def; this.reset(); }
  reset() {
    Object.assign(this, {
      x: 0, y: 0, s: 1, flip: 1, semPernas: false, capacete: false, lean: 0, squash: 0, jump: 0, walk: null, headTilt: 0, headY: 0, alpha: 1,
      bracoE: { a: 0.15, b: 0.1 }, bracoD: { a: 0.15, b: 0.1 },
      olhar: [0, 0], exp: 'normal', boca: 'reta', piscar: 0, suor: 0, tremor: 0, blush: 0.45, brilhoOlhos: 0,
      maoE: null, maoD: null, capaVento: 0.3, t: 0,
    });
    return this;
  }
  // pose de braço: a = abertura (0 = para baixo, π/2 = horizontal, π = para cima); b = dobra do cotovelo (para dentro)
  bracos(aE, bE, aD = aE, bD = bE) { this.bracoE = { a: aE, b: bE }; this.bracoD = { a: aD, b: bD }; return this; }
  armPts(side) {
    const p = side < 0 ? this.bracoE : this.bracoD;
    const S = [side * 46, -212];
    const E = [S[0] + Math.sin(p.a) * side * ARM.up, S[1] + Math.cos(p.a) * ARM.up];
    const a2 = p.a - p.b;
    const H = [E[0] + Math.sin(a2) * side * ARM.low, E[1] + Math.cos(a2) * ARM.low];
    return { S, E, H, a2 };
  }
  // posição da mão no mundo (para efeitos)
  mao(side) {
    const { H } = this.armPts(side);
    return this.toWorld(H[0], H[1]);
  }
  toWorld(lx, ly) {
    const fx = lx * this.flip * this.s, fy = (ly * (1 - this.squash)) * this.s;
    const ca = Math.cos(this.lean), sa = Math.sin(this.lean);
    return [this.x + fx * ca - fy * sa, this.y - this.jump + fx * sa + fy * ca + this.bob()];
  }
  bob() { return this.walk != null ? -Math.abs(Math.sin(this.walk)) * 10 * this.s : 0; }
  cabeca() { return this.toWorld(0, HEAD_Y + this.headY); }

  draw(c, t = 0) {
    const d = this.d; this.t = t;
    if (this.alpha <= 0.01) return;
    c.save();
    c.globalAlpha *= this.alpha;
    const tr = this.tremor ? Math.sin(t * 60) * this.tremor * 3 : 0;
    c.translate(this.x + tr, this.y - this.jump + this.bob());
    c.rotate(this.lean);
    c.scale(this.s * this.flip, this.s * (1 - this.squash));
    // sombra no chão
    if (!this.semPernas) { c.save(); c.globalAlpha *= 0.22; c.fillStyle = '#000'; c.beginPath(); c.ellipse(0, 4, 95, 16, 0, 0, TAU); c.fill(); c.restore(); }
    const w = this.walk;
    const sway = w != null ? Math.sin(w) * 6 : 0;
    // capa
    if (d.capa) {
      const v = this.capaVento, f = Math.sin(t * 5) * 8 * v;
      shape(c, c => { c.moveTo(-44, -222); c.quadraticCurveTo(-96 - v * 30, -120, -100 - v * 40 + f, -30); c.quadraticCurveTo(0, -12 + f * 0.5, 100 + v * 40 - f, -30); c.quadraticCurveTo(96 + v * 30, -120, 44, -222); c.closePath(); }, d.capa);
    }
    d.cabeloTras?.(c, this, t);
    // pernas
    if (!this.semPernas) for (const side of [-1, 1]) {
      const ph = w != null ? w + (side > 0 ? Math.PI : 0) : 0;
      const fx = side * 22 + (w != null ? Math.sin(ph) * 18 : 0), lift = w != null ? Math.max(0, Math.cos(ph)) * 14 : 0;
      limb(c, [[side * 18, (d.barra ?? -36) - 30], [fx, -10 - lift]], 18, d.perna || '#3a3048');
      ellipse(c, fx + side * 4, -6 - lift, 18, 10, d.sapato || '#2b2230');
    }
    // túnica
    const B = d.barra ?? -36, L = d.larguraBarra ?? 86;
    const robe = c => { c.moveTo(-40, -234); c.quadraticCurveTo(0, -246, 40, -234); c.lineTo(52, -204); c.lineTo(46, -150); c.lineTo(L + sway, B); c.quadraticCurveTo(0, B + 14, -L + sway, B); c.lineTo(-46, -150); c.lineTo(-52, -204); c.closePath(); };
    shape(c, robe, d.roupa);
    c.save(); c.beginPath(); robe(c); c.clip();
    c.fillStyle = d.roupaSombra || 'rgba(0,0,0,0.18)'; c.globalAlpha *= 0.55; c.beginPath(); c.moveTo(14, -246); c.lineTo(100, -246); c.lineTo(100, 0); c.lineTo(30 + sway, 0); c.closePath(); c.fill();
    c.restore();
    if (d.enfeite) {
      if (!d.semFaixa) line(c, [[0, -236], [sway * 0.5, B + 6]], d.enfeite, 9);
      shape(c, c => { c.moveTo(-L + 2 + sway, B - 8); c.quadraticCurveTo(0, B + 6, L - 2 + sway, B - 8); }, null, { stroke: d.enfeite, lw: 10 });
      shape(c, c => c.roundRect(-48, -160, 96, 18, 6), d.cinto || d.enfeite);
      d.broche && circle(c, 0, -151, 11, d.broche, { lw: 4 });
    }
    d.extraTras?.(c, this, t);
    // braços e mãos (os marcados em this.frente são desenhados depois da cabeça)
    for (const side of [-1, 1]) if (!this.frente?.[side < 0 ? 0 : 1]) this.desenharBraco(c, side, t);
    // cabeça
    c.save(); c.translate(0, HEAD_Y + 65 + this.headY); c.rotate(this.headTilt); c.translate(0, -65);
    d.atrasCabeca?.(c, this, t);
    circle(c, 0, 0, HEAD_R, d.pele);
    // sombra leve na cabeça
    c.save(); c.beginPath(); c.arc(0, 0, HEAD_R - 3, 0, TAU); c.clip(); c.globalAlpha *= 0.12; c.fillStyle = '#5a3a5a'; c.beginPath(); c.arc(-26, 22, HEAD_R, 0, TAU); c.rect(-200, -200, 400, 400); c.fill('evenodd'); c.restore();
    this.rosto(c, t);
    d.cabeloFrente?.(c, this, t);
    c.restore();
    for (const side of [-1, 1]) if (this.frente?.[side < 0 ? 0 : 1]) this.desenharBraco(c, side, t);
    d.extraFrente?.(c, this, t);
    c.restore();
  }
  desenharBraco(c, side, t) {
    const d = this.d;
    const { S, E, H, a2 } = this.armPts(side);
    limb(c, [S, E, H], 27, d.manga || d.roupa);
    if (d.mangaCurta) limb(c, [S, [lerp(S[0], E[0], 0.62), lerp(S[1], E[1], 0.62)]], 36, d.roupa);
    if (d.enfeite && !d.semPunho) { c.save(); c.translate(lerp(E[0], H[0], 0.82), lerp(E[1], H[1], 0.82)); c.rotate(-side * a2); ellipse(c, 0, 0, 17, 7, d.enfeite, { lw: 4 }); c.restore(); }
    circle(c, H[0], H[1], 15, d.pele);
    const item = side < 0 ? this.maoE : this.maoD;
    if (item) { c.save(); c.translate(H[0], H[1]); item(c, side, t); c.restore(); }
  }

  rosto(c, t) {
    const d = this.d, ox = this.olhar[0] * 12, oy = this.olhar[1] * 8;
    const e = this.exp, pisc = this.piscar;
    // bochechas
    if (this.blush > 0) { c.save(); c.globalAlpha *= this.blush; c.fillStyle = '#ff8fa0'; for (const s of [-1, 1]) { c.beginPath(); c.ellipse(s * 44 + ox * 0.6, 22 + oy, 15, 9, 0, 0, TAU); c.fill(); } c.restore(); }
    for (const s of [-1, 1]) {
      const x = s * 26 + ox, y = -4 + oy;
      if (pisc > 0.5 || e === 'fechado') { shape(c, c => { c.moveTo(x - 13, y); c.quadraticCurveTo(x, y + 9, x + 13, y); }, null, { lw: 5 }); continue; }
      if (e === 'feliz') { shape(c, c => { c.moveTo(x - 13, y + 5); c.quadraticCurveTo(x, y - 12, x + 13, y + 5); }, null, { lw: 6 }); continue; }
      if (e === 'choque' || e === 'medo') {
        ellipse(c, x, y, 17, 20, '#ffffff', { lw: 4 });
        const pr = e === 'medo' ? 4.5 : 6.5;
        ellipse(c, x + this.olhar[0] * 4, y + this.olhar[1] * 3, pr, pr * 1.1, d.olhos || OUT, { stroke: null });
        continue;
      }
      // normal / raiva / malicia / determinado
      const ry = e === 'malicia' ? 8 : 12;
      ellipse(c, x, y + (e === 'malicia' ? 3 : 0), 9, ry, d.olhos || OUT, { stroke: OUT, lw: 3 });
      circle(c, x + 3, y - 4, 3, '#ffffff', { stroke: null });
      if (e === 'malicia') line(c, [[x - 13, y - 5], [x + 13, y - 5]], OUT, 5);
    }
    if (this.brilhoOlhos > 0) for (const s of [-1, 1]) glow(c, s * 26 + ox, -4 + oy, 34, d.olhos || '#ff2020', this.brilhoOlhos);
    // sobrancelhas
    const sb = d.sobrancelha || OUT, bw = d.sobrancelhaW || 6;
    for (const s of [-1, 1]) {
      const x = s * 26 + ox, y = -30 + oy;
      let a = 0, dy = 0;
      if (e === 'raiva' || e === 'determinado') a = s * 0.45 * (e === 'raiva' ? 1 : 0.6);
      if (e === 'medo' || e === 'preocupado') { a = -s * 0.4; dy = -6; }
      if (e === 'choque') dy = -10;
      if (e === 'malicia' && s > 0) { a = -0.3; dy = -6; } else if (e === 'malicia') a = 0.3;
      c.save(); c.translate(x, y + dy); c.rotate(a); line(c, [[-12, 0], [12, 0]], sb, bw); c.restore();
    }
    // boca
    const m = this.boca, mx = ox * 0.7, my = 30 + oy * 0.6;
    if (m === 'sorriso') shape(c, c => { c.moveTo(mx - 16, my - 2); c.quadraticCurveTo(mx, my + 14, mx + 16, my - 2); }, null, { lw: 5 });
    else if (m === 'reta') line(c, [[mx - 10, my + 2], [mx + 10, my + 2]], OUT, 5);
    else if (m === 'sorrisoMal') shape(c, c => { c.moveTo(mx - 14, my + 2); c.quadraticCurveTo(mx + 4, my + 10, mx + 18, my - 8); }, null, { lw: 5 });
    else if (m === 'tremendo') line(c, [[mx - 16, my + 4], [mx - 8, my], [mx, my + 4], [mx + 8, my], [mx + 16, my + 4]], OUT, 4);
    else if (m === 'triste') shape(c, c => { c.moveTo(mx - 14, my + 8); c.quadraticCurveTo(mx, my - 4, mx + 14, my + 8); }, null, { lw: 5 });
    else {
      const big = { aberta: [15, 16], o: [8, 10], grito: [20, 24], dentes: [22, 12] }[m] || [12, 12];
      ellipse(c, mx, my + 6, big[0], big[1], '#b3262f', { lw: 5 });
      c.save(); c.beginPath(); c.ellipse(mx, my + 6, big[0] - 2, big[1] - 2, 0, 0, TAU); c.clip();
      c.fillStyle = '#ff7a86'; c.beginPath(); c.ellipse(mx, my + 6 + big[1] * 0.8, big[0] * 0.8, big[1] * 0.55, 0, 0, TAU); c.fill();
      if (m === 'dentes') { c.fillStyle = '#fff'; c.fillRect(mx - big[0], my - 6, big[0] * 2, 8); }
      c.restore();
    }
    // gota de suor
    if (this.suor > 0) { c.save(); c.globalAlpha *= this.suor; shape(c, c => { c.moveTo(62, -40); c.quadraticCurveTo(76, -14, 62, -8); c.quadraticCurveTo(50, -14, 62, -40); }, '#8fd8ff', { lw: 4 }); c.restore(); }
  }
}
