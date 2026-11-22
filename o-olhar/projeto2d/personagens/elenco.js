// Elenco original de "Por que olhamos para cima quando tentamos lembrar?"
// RAFA (protagonista, ~20 anos): cabelo castanho-escuro com topete, camiseta azul, calça escura, tênis branco, olhos grandes.
import { TAU, clamp, lerp, mix } from '../motor/base.js';
import { OUT, shape, circle, ellipse, poly, line, rrect, glow } from '../motor/desenho.js';
import { Personagem } from '../motor/personagem.js';

// Personagem com olhos grandes (esclera + íris + pupila que se move), pálpebras e sobrancelhas independentes.
export class Cartoon extends Personagem {
  reset() {
    super.reset();
    Object.assign(this, { sob: [0, 0], sobA: [0, 0], palp: 0, aperta: 0, pupila: 1, blush: 0.22, rostoX: 0, rostoY: 0, frente: [false, false], olhoTam: 1 });
    return this;
  }
  // cinemática inversa do braço: leva a mão até (x, y) em coordenadas locais do corpo (pés em 0,0; cabeça em 0,-300)
  ik(side, tx, ty, dentro = false) {
    const S = [side * 46, -212];
    const X = (tx - S[0]) * side, Y = ty - S[1];
    const d = clamp(Math.hypot(X, Y), 6, 122.5);
    const phi = Math.atan2(X, Y);
    const al = Math.acos(clamp((64 * 64 + d * d - 60 * 60) / (2 * 64 * d), -1, 1));
    const op = [phi + al, phi - al].sort((p, q) => Math.sin(q) - Math.sin(p));
    const a = dentro ? op[1] : op[0];
    const Ex = Math.sin(a) * 64, Ey = Math.cos(a) * 64, Tx = Math.sin(phi) * d, Ty = Math.cos(phi) * d;
    const a2 = Math.atan2(Tx - Ex, Ty - Ey);
    const o = { a, b: a - a2 };
    if (side < 0) this.bracoE = o; else this.bracoD = o;
    return this;
  }
  // posição de um olho no mundo (para a câmera mergulhar nele)
  olhoMundo(side = 1) { return this.toWorld(side * 28 + this.rostoX, -300 - 8 + this.headY + this.rostoY); }
  rosto(c, t) {
    const d = this.d, [lx, ly] = this.olhar, e = this.exp, k = this.olhoTam;
    const fx = lx * 7 + this.rostoX, fy = ly * 6 + this.rostoY;
    if (this.blush > 0) { c.save(); c.globalAlpha *= this.blush; c.fillStyle = '#ff8f9a'; for (const s of [-1, 1]) { c.beginPath(); c.ellipse(s * 46 + fx * 0.7, 22 + fy, 14, 8, 0, 0, TAU); c.fill(); } c.restore(); }
    for (const s of [-1, 1]) {
      const i = s < 0 ? 0 : 1, x = s * 28 + fx, y = -8 + fy, rx = 21 * k, ry = 25 * k;
      if (this.piscar > 0.5 || e === 'fechado') { shape(c, c => { c.moveTo(x - 17, y + 2); c.quadraticCurveTo(x, y + 12, x + 17, y + 2); }, null, { lw: 5 }); continue; }
      if (e === 'feliz') { shape(c, c => { c.moveTo(x - 16, y + 6); c.quadraticCurveTo(x, y - 14, x + 16, y + 6); }, null, { lw: 6 }); continue; }
      ellipse(c, x, y, rx, ry, '#ffffff', { lw: 4.5 });
      c.save(); c.beginPath(); c.ellipse(x, y, rx - 2, ry - 2, 0, 0, TAU); c.clip();
      const px = x + lx * 11 * k, py = y + ly * 13 * k, ir = 12.5 * k;
      circle(c, px, py, ir, d.olhos || '#6a4428', { stroke: null });
      circle(c, px, py, 6.5 * k * this.pupila, '#140c10', { stroke: null });
      circle(c, px + 4 * k, py - 5 * k, 3.6 * k, '#ffffff', { stroke: null });
      const pal = clamp(this.palp), ap = clamp(this.aperta);
      c.fillStyle = d.pele;
      const yTop = y - ry + 2 * ry * pal * 0.92, yBot = y + ry - 2 * ry * ap * 0.42;
      if (pal > 0.01) c.fillRect(x - rx - 3, y - ry - 3, 2 * rx + 6, yTop - (y - ry - 3));
      if (ap > 0.01) c.fillRect(x - rx - 3, yBot, 2 * rx + 6, y + ry + 3 - yBot);
      c.restore();
      const hw = yy => rx * Math.sqrt(Math.max(0, 1 - ((yy - y) / ry) ** 2));
      if (pal > 0.01) line(c, [[x - hw(yTop) - 1, yTop], [x + hw(yTop) + 1, yTop]], OUT, 5);
      if (ap > 0.01) line(c, [[x - hw(yBot), yBot], [x + hw(yBot), yBot]], OUT, 4);
    }
    // sobrancelhas
    const sb = d.sobrancelha || OUT;
    for (const s of [-1, 1]) {
      const i = s < 0 ? 0 : 1, x = s * 28 + fx;
      let a = 0, dy = 0;
      if (e === 'raiva') a = s * 0.4;
      if (e === 'preocupado' || e === 'medo') { a = -s * 0.35; dy = -6; }
      if (e === 'choque') dy = -12;
      c.save(); c.translate(x, -42 * k + fy + dy + this.sob[i]); c.rotate(a + this.sobA[i]); line(c, [[-14, 0], [14, 0]], sb, d.sobrancelhaW || 8); c.restore();
    }
    // nariz
    shape(c, c => { c.moveTo(fx * 1.15 - 6, 16 + fy); c.quadraticCurveTo(fx * 1.15, 22 + fy, fx * 1.15 + 6, 16 + fy); }, null, { lw: 4 });
    // boca
    const m = this.boca, mx = fx * 0.9, my = 36 + fy * 0.8;
    if (m === 'sorriso') shape(c, c => { c.moveTo(mx - 17, my - 2); c.quadraticCurveTo(mx, my + 15, mx + 17, my - 2); }, null, { lw: 5 });
    else if (m === 'reta') line(c, [[mx - 10, my + 2], [mx + 10, my + 2]], OUT, 5);
    else if (m === 'lado') shape(c, c => { c.moveTo(mx + 2, my + 4); c.quadraticCurveTo(mx + 12, my + 1, mx + 20, my - 4); }, null, { lw: 5 });
    else if (m === 'torto') line(c, [[mx - 18, my + 4], [mx - 8, my + 7], [mx + 2, my + 2], [mx + 12, my + 5], [mx + 18, my - 2]], OUT, 5);
    else if (m === 'tremendo') line(c, [[mx - 16, my + 4], [mx - 8, my], [mx, my + 4], [mx + 8, my], [mx + 16, my + 4]], OUT, 4);
    else if (m === 'triste') shape(c, c => { c.moveTo(mx - 14, my + 8); c.quadraticCurveTo(mx, my - 4, mx + 14, my + 8); }, null, { lw: 5 });
    else if (m === 'bico') { ellipse(c, mx - 2, my + 3, 6, 5, '#b3262f', { lw: 4 }); }
    else {
      const big = { aberta: [15, 16], o: [8, 10], grito: [20, 24], meia: [12, 7] }[m] || [12, 12];
      ellipse(c, mx, my + 6, big[0], big[1], '#8e1f2a', { lw: 5 });
      c.save(); c.beginPath(); c.ellipse(mx, my + 6, big[0] - 2, big[1] - 2, 0, 0, TAU); c.clip();
      c.fillStyle = '#ff7a86'; c.beginPath(); c.ellipse(mx, my + 6 + big[1] * 0.8, big[0] * 0.8, big[1] * 0.55, 0, 0, TAU); c.fill();
      c.restore();
    }
    if (this.suor > 0) { c.save(); c.globalAlpha *= this.suor; shape(c, c => { c.moveTo(64, -46); c.quadraticCurveTo(78, -20, 64, -14); c.quadraticCurveTo(52, -20, 64, -46); }, '#8fd8ff', { lw: 4 }); c.restore(); }
  }
}

// ---------- cabelos ----------
const CAB_RAFA = '#3b2417';
function topete(c) {
  shape(c, c => { c.moveTo(-78, 8); c.quadraticCurveTo(-94, -78, -32, -98); c.quadraticCurveTo(38, -116, 78, -62); c.quadraticCurveTo(92, -30, 78, 8); c.quadraticCurveTo(72, -34, 48, -46); c.quadraticCurveTo(22, -30, -2, -54); c.quadraticCurveTo(-26, -34, -52, -44); c.quadraticCurveTo(-70, -26, -78, 8); c.closePath(); }, CAB_RAFA);
  shape(c, c => { c.moveTo(-40, -92); c.quadraticCurveTo(0, -150, 76, -118); c.quadraticCurveTo(46, -110, 40, -84); c.closePath(); }, CAB_RAFA, { lw: 5 });
  ellipse(c, -20, -80, 22, 6, 'rgba(255,255,255,0.18)', { stroke: null }, -0.3);
}
function cacheado(cor) { return (c) => { for (let i = 0; i < 11; i++) { const a = Math.PI * (1.0 + i * 0.1); circle(c, Math.cos(a) * 78, -6 + Math.sin(a) * 78, 25, cor, { lw: 4 }); } for (const [x, y] of [[-34, -64], [0, -76], [34, -64]]) circle(c, x, y, 24, cor, { lw: 4 }); }; }
function rabo(cor) {
  return {
    tras: (c, p, t) => { c.save(); c.translate(0, -360); c.rotate(Math.sin(t * 3) * 0.12); shape(c, c => { c.moveTo(-26, -40); c.quadraticCurveTo(-60, 40, -14, 110); c.quadraticCurveTo(14, 60, 26, -40); c.closePath(); }, cor); c.restore(); },
    frente: (c) => { shape(c, c => { c.moveTo(-80, 6); c.quadraticCurveTo(-90, -92, 0, -96); c.quadraticCurveTo(90, -92, 80, 6); c.quadraticCurveTo(54, -56, 4, -58); c.quadraticCurveTo(-46, -50, -80, 6); c.closePath(); }, cor); circle(c, 0, -94, 14, '#e8504a', { lw: 4 }); },
  };
}
function grisalho(c) {
  shape(c, c => { c.moveTo(-80, 10); c.quadraticCurveTo(-84, -40, -60, -56); c.quadraticCurveTo(-56, -20, -66, 12); c.closePath(); }, '#c8c8cc');
  shape(c, c => { c.moveTo(80, 10); c.quadraticCurveTo(84, -40, 60, -56); c.quadraticCurveTo(56, -20, 66, 12); c.closePath(); }, '#c8c8cc');
  ellipse(c, -18, -56, 22, 9, '#ffffff', { stroke: null, alpha: 0.3 });
}
function tigela(cor) { return (c) => shape(c, c => { c.moveTo(-82, -4); c.quadraticCurveTo(-86, -100, 0, -100); c.quadraticCurveTo(86, -100, 82, -4); c.lineTo(60, -28); c.lineTo(-60, -28); c.closePath(); }, cor); }

function base({ pele, roupa, perna, sapato, olhos = '#6a4428', sob = '#2a1a10', barra = -126, largura = 56, curta = true, cabeloFrente, cabeloTras, extra, extraFrente }) {
  const sombra = mix(roupa, '#000000', 0.25);
  return new Cartoon({ pele, olhos, sobrancelha: sob, sobrancelhaW: 9, roupa, roupaSombra: sombra, manga: curta ? pele : roupa, mangaCurta: curta, semPunho: true, semFaixa: true, barra, larguraBarra: largura, perna, sapato, cabeloFrente, cabeloTras, extraTras: extra, extraFrente });
}

// RAFA — protagonista (design fixo em todas as cenas)
export const rafa = () => base({ pele: '#f0c39c', roupa: '#2f7fe0', perna: '#2a2f45', sapato: '#f7f7f2', olhos: '#7a4a24', sob: CAB_RAFA, cabeloFrente: topete,
  extra: (c) => { shape(c, c => { c.moveTo(-26, -236); c.quadraticCurveTo(0, -214, 26, -236); }, null, { stroke: '#1d5cb0', lw: 6 }); } });
// DAVI — amigo: cabelo cacheado, camiseta verde
export const davi = () => base({ pele: '#a8714a', roupa: '#35a868', perna: '#3a4a7a', sapato: '#e84a3a', olhos: '#3a2214', sob: '#1a1210', cabeloFrente: cacheado('#1e1410') });
// BIA — rabo de cavalo ruivo, blusa amarela
export const bia = () => { const r = rabo('#b4542a'); return base({ pele: '#f3d0b0', roupa: '#f4c430', perna: '#5a6a9a', sapato: '#f7f7f2', olhos: '#4a7a3a', sob: '#8a3a1a', barra: -96, largura: 80, cabeloFrente: r.frente, cabeloTras: r.tras }); };
// SEU JORGE — grisalho, bigode, óculos, cardigã laranja
export const jorge = () => base({ pele: '#d9a27c', roupa: '#e0773a', perna: '#5a4a3a', sapato: '#4a3020', olhos: '#4a3020', sob: '#9a9aa0', curta: false, cabeloFrente: grisalho,
  extraFrente: null });
// LÉO — cabelo tigela loiro, moletom roxo
export const leo = () => base({ pele: '#e6b48c', roupa: '#8a5cc7', perna: '#3a3a44', sapato: '#f2c230', olhos: '#3a5a9a', sob: '#b8902a', curta: false, cabeloFrente: tigela('#e8c25a') });

// bigode e óculos do Seu Jorge (desenhados por cima do rosto)
export function acessoriosJorge(P) {
  const rosto = P.rosto.bind(P);
  P.rosto = (c, t) => {
    rosto(c, t);
    const fx = P.olhar[0] * 7, fy = P.olhar[1] * 6;
    shape(c, c => { c.moveTo(fx - 26, 34 + fy); c.quadraticCurveTo(fx - 14, 18 + fy, fx, 28 + fy); c.quadraticCurveTo(fx + 14, 18 + fy, fx + 26, 34 + fy); c.quadraticCurveTo(fx, 30 + fy, fx - 26, 34 + fy); c.closePath(); }, '#b8b8bc', { lw: 4 });
    for (const s of [-1, 1]) circle(c, s * 28 + fx, -8 + fy, 28, null, { stroke: '#3a2a20', lw: 5 });
    line(c, [[fx - 2, -10 + fy], [fx + 2, -10 + fy]], '#3a2a20', 5);
  };
  return P;
}

// ---------- objetos ----------
export const copo = (pele) => (c, s, t) => {
  c.save(); c.translate(s * 4, -6);
  shape(c, c => { c.moveTo(-22, -74); c.lineTo(22, -74); c.lineTo(16, 10); c.lineTo(-16, 10); c.closePath(); }, 'rgba(210,240,255,0.65)', { lw: 4 });
  c.save(); c.beginPath(); c.moveTo(-21, -74); c.lineTo(21, -74); c.lineTo(15, 9); c.lineTo(-15, 9); c.closePath(); c.clip();
  c.fillStyle = '#ff9a3a'; c.beginPath(); c.moveTo(-30, -36 + Math.sin(t * 6) * 3); c.quadraticCurveTo(0, -36 - Math.sin(t * 6) * 4, 30, -36 + Math.sin(t * 6 + 1) * 3); c.lineTo(30, 20); c.lineTo(-30, 20); c.closePath(); c.fill();
  for (let i = 0; i < 3; i++) { const u = (t * 0.6 + i / 3) % 1; circle(c, -8 + i * 8, 4 - u * 40, 3, 'rgba(255,255,255,0.7)', { stroke: null }); }
  c.restore();
  line(c, [[-12, -66], [-9, -10]], '#ffffff', 4, 0.6);
  c.restore();
  circle(c, s * -8, 2, 11, pele, { lw: 4 });
};
export const papel = (rot = 0) => (c) => { c.save(); c.rotate(rot); rrect(c, -34, -88, 68, 88, 4, '#fff8e6', { lw: 4 }); for (let i = 0; i < 5; i++) line(c, [[-24, -74 + i * 14], [i === 4 ? 0 : 24, -74 + i * 14]], '#9aa0b8', 3); c.restore(); };
export const pasta = (aberta = 0) => (c) => { c.save(); rrect(c, -46, -70, 92, 66, 6, '#f2b84a', { lw: 4 }); if (aberta < 0.5) rrect(c, -46, -78, 40, 14, 4, '#f2b84a', { lw: 4 }); c.restore(); };
