// Elenco original de "Por que olhamos para cima quando tentamos lembrar?"
// RAFA (protagonista, ~20 anos): cabelo castanho-escuro com topete, camiseta azul, calça escura, tênis branco, olhos grandes.
import { TAU, clamp, lerp, mix } from '../motor/base.js';
import { OUT, shape, circle, ellipse, poly, line, rrect, glow } from '../motor/desenho.js';
import { Personagem, ARM } from '../motor/personagem.js';

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
    const U = ARM.up, Lw = ARM.low, d = clamp(Math.hypot(X, Y), 6, U + Lw - 1.5);
    const phi = Math.atan2(X, Y);
    const al = Math.acos(clamp((U * U + d * d - Lw * Lw) / (2 * U * d), -1, 1));
    const op = [phi + al, phi - al].sort((p, q) => Math.sin(q) - Math.sin(p));
    const a = dentro ? op[1] : op[0];
    const Ex = Math.sin(a) * U, Ey = Math.cos(a) * U, Tx = Math.sin(phi) * d, Ty = Math.cos(phi) * d;
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

export function base({ pele, roupa, perna, sapato, olhos = '#6a4428', sob = '#2a1a10', barra = -126, largura = 56, curta = true, cabeloFrente, cabeloTras, extra, extraFrente }) {
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

// ================== "Coçar a cabeça" ==================
// CAIO — protagonista: cabelo castanho-escuro bagunçado, camiseta azul, calça preta, tênis branco
const CAB_CAIO = '#3a2416';
export function bagunca(c, p, t) {
  const v = p.vento || 0, w = Math.sin(t * 9) * 4 * v;
  shape(c, c => { c.moveTo(-80, 6); c.lineTo(-94, -40); c.lineTo(-76, -48); c.lineTo(-90, -86); c.lineTo(-48, -78); c.lineTo(-44 + w, -122); c.lineTo(-10, -92); c.lineTo(14 - w, -132); c.lineTo(30, -92); c.lineTo(72 + w, -112); c.lineTo(62, -66); c.lineTo(96, -54); c.lineTo(80, 6); c.lineTo(60, -36); c.lineTo(34, -50); c.lineTo(8, -34); c.lineTo(-18, -52); c.lineTo(-46, -32); c.lineTo(-62, -40); c.closePath(); }, CAB_CAIO);
  ellipse(c, -26, -84, 18, 5, 'rgba(255,255,255,0.16)', { stroke: null }, -0.4);
}
export const caio = () => base({ pele: '#eebd96', roupa: '#2c78dc', perna: '#1e1e24', sapato: '#f7f7f2', olhos: '#6a3e1e', sob: CAB_CAIO, cabeloFrente: bagunca,
  extra: (c) => { shape(c, c => { c.moveTo(-26, -236); c.quadraticCurveTo(0, -214, 26, -236); }, null, { stroke: '#1b56a8', lw: 6 }); } });
// BETO — barba cheia, camisa xadrez vermelha
export const beto = () => { const P = base({ pele: '#d39a72', roupa: '#c8443a', perna: '#3a3a44', sapato: '#3a2a20', olhos: '#3a2214', sob: '#2a1a10', curta: false, cabeloFrente: (c) => shape(c, c => { c.moveTo(-78, -6); c.quadraticCurveTo(-80, -92, 0, -94); c.quadraticCurveTo(80, -92, 78, -6); c.quadraticCurveTo(50, -58, 0, -56); c.quadraticCurveTo(-50, -58, -78, -6); c.closePath(); }, '#2a1a10'),
  extra: (c) => { for (let i = -1; i <= 1; i++) line(c, [[i * 30, -236], [i * 30, -130]], '#9a2a24', 5); line(c, [[-50, -190], [50, -190]], '#9a2a24', 5); } });
  const r = P.rosto.bind(P); P.rosto = (c, t) => { r(c, t); const fx = P.olhar[0] * 7, fy = P.olhar[1] * 6; shape(c, c => { c.moveTo(-70, 0); c.quadraticCurveTo(-66, 92, 0, 100); c.quadraticCurveTo(66, 92, 70, 0); c.quadraticCurveTo(50, 30, 34, 26); c.quadraticCurveTo(fx, 60 + fy, -34, 26); c.quadraticCurveTo(-50, 30, -70, 0); c.closePath(); }, '#2a1a10', { lw: 4 }); shape(c, c => { c.moveTo(fx - 14, 44 + fy); c.quadraticCurveTo(fx, 52 + fy, fx + 14, 44 + fy); }, null, { stroke: '#f0a0a0', lw: 4 }); }; return P; };
// ANA — coque cacheado, blusa verde-água
export const ana = () => base({ pele: '#8d5a3c', roupa: '#2fb5a5', perna: '#3a4a7a', sapato: '#f7f7f2', olhos: '#2a1610', sob: '#1a0e08', cabeloFrente: (c) => { for (let i = 0; i < 9; i++) { const a = Math.PI * (1.05 + i * 0.11); circle(c, Math.cos(a) * 76, -4 + Math.sin(a) * 76, 22, '#1e120c', { lw: 4 }); } for (const [x, y] of [[-20, -110], [10, -122], [30, -104]]) circle(c, x, y, 22, '#1e120c', { lw: 4 }); } });
// DONA LU — coque grisalho, óculos, cardigã roxo
export const lu = () => { const P = base({ pele: '#f0cfb2', roupa: '#8a5cc7', perna: '#4a4050', sapato: '#5a3a2a', olhos: '#4a6a8a', sob: '#a8a8b0', curta: false, cabeloFrente: (c) => { shape(c, c => { c.moveTo(-78, 0); c.quadraticCurveTo(-88, -90, 0, -92); c.quadraticCurveTo(88, -90, 78, 0); c.quadraticCurveTo(60, -50, 0, -56); c.quadraticCurveTo(-60, -50, -78, 0); c.closePath(); }, '#cfcfd6'); circle(c, 0, -104, 28, '#cfcfd6'); } });
  const r = P.rosto.bind(P); P.rosto = (c, t) => { r(c, t); const fx = P.olhar[0] * 7, fy = P.olhar[1] * 6; for (const s of [-1, 1]) circle(c, s * 28 + fx, -8 + fy, 29, null, { stroke: '#a83a5a', lw: 5 }); line(c, [[fx - 2, -10 + fy], [fx + 2, -10 + fy]], '#a83a5a', 5); }; return P; };

// dedos que coçam (desenhados na mão): ang = direção para onde os dedos apontam
export const dedos = (pele, ang = Math.PI * 0.75, mexe = 1, vel = 22) => (c, s, t) => {
  for (let k = 0; k < 4; k++) {
    const a = ang + (k - 1.5) * 0.32, w = Math.sin(t * vel + k * 1.4) * 5 * mexe;
    c.save(); c.rotate(s > 0 ? a : Math.PI - a); ellipse(c, 0, 18 + w, 6.5, 11, pele, { lw: 3.5 }); c.restore();
  }
  circle(c, 0, 0, 15, pele, { lw: 4 });
};
// dedos batucando na mesa
export const batuca = (pele) => (c, s, t) => {
  for (let k = 0; k < 4; k++) { const up = Math.max(0, Math.sin(t * 14 - k * 0.9)) * 10; ellipse(c, -15 + k * 10 * s, 12 - up, 5.5, 10, pele, { lw: 3 }); }
  circle(c, 0, 0, 15, pele, { lw: 4 });
};
export const lapis = () => (c, s) => { c.save(); c.rotate(0.5 * s); rrect(c, -4, -46, 8, 44, 2, '#f4c430', { lw: 3 }); shape(c, c => { c.moveTo(-4, -2); c.lineTo(4, -2); c.lineTo(0, 10); c.closePath(); }, '#f2d7b0', { lw: 2.5 }); rrect(c, -4, -52, 8, 8, 2, '#e2575c', { lw: 2.5 }); c.restore(); };

// ================== "Pensar demais antes de dormir" ==================
// GUI — protagonista (~22 anos): cabelo castanho-escuro bagunçado, camiseta azul-escura, calça de pijama cinza, chinelo
export const gui = () => base({ pele: '#eab894', roupa: '#1f3a6e', perna: '#9aa0aa', sapato: '#5a7ab0', olhos: '#5a3a1e', sob: '#3a2416', cabeloFrente: bagunca,
  extra: (c) => { shape(c, c => { c.moveTo(-26, -236); c.quadraticCurveTo(0, -214, 26, -236); }, null, { stroke: '#142a52', lw: 6 }); } });

// ================== "Café com leite" (2D) ==================
function cabeloMenino(cor) { return (c, p, t) => { const w = Math.sin(t * 10) * 3 * (p.vento || 0); shape(c, c => { c.moveTo(-80, 4); c.quadraticCurveTo(-92, -70, -52, -90); c.lineTo(-40 + w, -108); c.lineTo(-18, -94); c.lineTo(4 - w, -112); c.lineTo(20, -94); c.lineTo(48 + w, -104); c.lineTo(54, -84); c.quadraticCurveTo(92, -66, 80, 4); c.quadraticCurveTo(66, -44, 36, -48); c.lineTo(14, -34); c.lineTo(-6, -50); c.lineTo(-30, -36); c.quadraticCurveTo(-60, -48, -80, 4); c.closePath(); }, cor); ellipse(c, -30, -76, 16, 5, 'rgba(255,255,255,0.18)', { stroke: null }, -0.4); }; }
const bermuda = (cor) => (c) => { rrect(c, -62, -134, 124, 50, 12, cor, { lw: 5 }); line(c, [[0, -126], [0, -90]], mix(cor, '#000000', 0.3), 4); };
function menino({ pele, roupa, bermudaCor, chinelo = '#2c78dc', cabelo, extra = null, s = 0.75, olhos = '#3a2214' }) {
  const P = base({ pele, roupa, perna: pele, sapato: chinelo, olhos, sob: '#1a1210', barra: -116, largura: 62, cabeloFrente: cabelo, extra: (c, p, t) => { bermuda(bermudaCor)(c); extra?.(c, p, t); } });
  P.s = s; const r = P.reset.bind(P); P.reset = () => { r(); P.s = s; return P; }; return P;
}
// JUNINHO — protagonista (~10 anos): cabelo escuro, camiseta vermelha simples, bermuda jeans, chinelo azul
export const juninho = () => menino({ pele: '#e0a878', roupa: '#e2473a', bermudaCor: '#3a6ab0', chinelo: '#2c78dc', cabelo: cabeloMenino('#1e140e') });
// MARCÃO — o dono da bola: maior, boné virado, camiseta verde
export const marcao = () => menino({ s: 0.84, pele: '#c8906a', roupa: '#2aa060', bermudaCor: '#2a2a30', chinelo: '#f2f2ea', olhos: '#2a1610', cabelo: (c) => { shape(c, c => { c.moveTo(-82, -20); c.quadraticCurveTo(-84, -100, 0, -104); c.quadraticCurveTo(84, -100, 82, -20); c.closePath(); }, '#e2473a'); rrect(c, -120, -40, 70, 20, 10, '#b8302a', { lw: 4 }); } });
// TIAGO — cacheado, camiseta amarela de gola verde
export const tiago = () => menino({ s: 0.76, pele: '#8a5a3c', roupa: '#f4d03a', bermudaCor: '#2a5ab0', chinelo: '#f4c430', olhos: '#1a0e08', cabelo: cacheado('#1a0e08'), extra: (c) => shape(c, c => { c.moveTo(-26, -236); c.quadraticCurveTo(0, -214, 26, -236); }, null, { stroke: '#2aa060', lw: 8 }) });
// LUCAS — loiro tigela, camiseta azul-clara
export const lucasK = () => menino({ s: 0.72, pele: '#f2cdb0', roupa: '#5ab0e8', bermudaCor: '#e2a040', chinelo: '#e2473a', olhos: '#3a6a9a', cabelo: tigela('#e8c25a') });
// BRUNO — cabelo arrepiado, camiseta laranja
export const bruno = () => menino({ s: 0.74, pele: '#d8a07a', roupa: '#f07a2a', bermudaCor: '#5a5a62', chinelo: '#35a868', cabelo: cabeloMenino('#2a1a10') });
// MÃE — coque, avental, chinelo na mão
export const mae = () => base({ pele: '#d8a07a', roupa: '#8a5ab0', perna: '#3a4a6a', sapato: '#5a3a2a', olhos: '#2a1610', sob: '#2a1610', curta: true,
  cabeloFrente: (c) => { shape(c, c => { c.moveTo(-80, 6); c.quadraticCurveTo(-90, -92, 0, -94); c.quadraticCurveTo(90, -92, 80, 6); c.quadraticCurveTo(60, -50, 0, -56); c.quadraticCurveTo(-60, -50, -80, 6); c.closePath(); }, '#2a1a10'); circle(c, 0, -106, 30, '#2a1a10'); },
  extra: (c) => { rrect(c, -56, -200, 112, 150, 14, '#f6f2ea', { lw: 5 }); rrect(c, -30, -150, 60, 34, 6, '#f6f2ea', { lw: 4 }); } });
export const chinelo = (cor = '#2c78dc') => (c, s, t) => { c.save(); c.rotate(-0.4 * s); rrect(c, -18, -78, 36, 80, 16, cor, { lw: 4 }); line(c, [[-10, -58], [0, -46], [10, -58]], '#f6f2ea', 5); c.restore(); };
export const bolaMao = (c) => { circle(c, 0, -30, 30, '#f6f2ea', { lw: 4 }); for (let k = 0; k < 5; k++) { const a = k / 5 * TAU; circle(c, Math.cos(a) * 16, -30 + Math.sin(a) * 16, 6, '#1a1a1e', { stroke: null }); } };

// ================== "O pior Natal da minha vida" — cartoon adulto ==================
// detalhes de rosto adulto: olheiras, nariz marcado, rugas, barba por fazer, bigode, batom, brincos
function rostoAdulto(P, o = {}) {
  const r = P.rosto.bind(P);
  P.rosto = (c, t) => {
    const fx = P.olhar[0] * 7 + P.rostoX, fy = P.olhar[1] * 6 + P.rostoY;
    if (o.barba) { c.save(); c.globalAlpha = 0.28; c.fillStyle = o.barba; c.beginPath(); c.moveTo(-64, 10); c.quadraticCurveTo(-58, 70, 0, 76); c.quadraticCurveTo(58, 70, 64, 10); c.quadraticCurveTo(30, 34, 0, 30); c.quadraticCurveTo(-30, 34, -64, 10); c.fill(); c.restore(); }
    if (P.vermelho > 0) { c.save(); c.globalAlpha = 0.55 * P.vermelho; c.fillStyle = '#e0302a'; c.beginPath(); c.arc(0, 0, 70, 0, TAU); c.fill(); c.restore(); for (const s of [-1, 1]) { c.save(); c.globalAlpha = P.vermelho; c.translate(s * 44, -56); line(c, [[-8, -6], [0, 0], [8, -6]], '#a01a1a', 4); line(c, [[0, 0], [0, 8]], '#a01a1a', 4); c.restore(); } }
    r(c, t);
    if (P.wink) { const k = P.olhoTam, x = 28 + fx, y = -8 + fy; ellipse(c, x, y, 23 * k, 28 * k, P.d.pele, { stroke: null }); shape(c, c => { c.moveTo(x - 16, y + 2); c.quadraticCurveTo(x, y + 12, x + 16, y + 2); }, null, { lw: 5 }); }
    if (o.olheira) for (const s of [-1, 1]) shape(c, c => { c.moveTo(s * 28 + fx - 16, 18 + fy); c.quadraticCurveTo(s * 28 + fx, 26 + fy, s * 28 + fx + 16, 18 + fy); }, null, { stroke: o.olheira, lw: 4 });
    if (o.rugas) { for (const s of [-1, 1]) line(c, [[s * 54 + fx, -6 + fy], [s * 60 + fx, 2 + fy]], 'rgba(60,30,20,0.5)', 3); line(c, [[fx - 18, -58 + fy], [fx + 18, -58 + fy]], 'rgba(60,30,20,0.35)', 3); }
    // nariz adulto maior
    shape(c, c => { c.moveTo(fx * 1.15 - 4, -2 + fy); c.quadraticCurveTo(fx * 1.15 + 12, 18 + fy, fx * 1.15 + 2, 24 + fy); c.quadraticCurveTo(fx * 1.15 - 6, 26 + fy, fx * 1.15 - 12, 21 + fy); }, null, { lw: 4 });
    if (o.bigode) shape(c, c => { c.moveTo(fx - 30, 34 + fy); c.quadraticCurveTo(fx - 14, 18 + fy, fx, 27 + fy); c.quadraticCurveTo(fx + 14, 18 + fy, fx + 30, 34 + fy); c.quadraticCurveTo(fx, 30 + fy, fx - 30, 34 + fy); c.closePath(); }, o.bigode, { lw: 4 });
    if (o.batom && !['aberta', 'grito', 'meia', 'o'].includes(P.boca)) shape(c, c => { c.moveTo(fx * 0.9 - 16, 36 + fy * 0.8); c.quadraticCurveTo(fx * 0.9, 46 + fy * 0.8, fx * 0.9 + 16, 36 + fy * 0.8); }, null, { stroke: o.batom, lw: 7 });
    if (o.oculos) { for (const s of [-1, 1]) rrect(c, s * 28 + fx - 26, -26 + fy, 52, 38, 10, null, { stroke: o.oculos, lw: 5 }); line(c, [[fx - 2, -10 + fy], [fx + 2, -10 + fy]], o.oculos, 5); }
    if (o.brincos) for (const s of [-1, 1]) circle(c, s * 74, 30, 9, o.brincos, { lw: 3 });
  };
  return P;
}
function adulto(opts, ex = {}) { const P = base(opts); P.d.cab = ex.cab ?? 0.74; P.olhoTamBase = ex.olho ?? 0.8; const r = P.reset.bind(P); P.reset = () => { r(); P.olhoTam = P.olhoTamBase; P.blush = ex.blush ?? 0.12; if (ex.s) P.s = ex.s; return P; }; P.reset(); return rostoAdulto(P, ex); }
const cabBag = (cor) => (c, p, t) => { shape(c, c => { c.moveTo(-82, 10); c.lineTo(-96, -36); c.lineTo(-80, -46); c.lineTo(-94, -84); c.lineTo(-54, -80); c.lineTo(-52, -118); c.lineTo(-18, -92); c.lineTo(6, -126); c.lineTo(26, -92); c.lineTo(66, -110); c.lineTo(60, -70); c.lineTo(96, -60); c.lineTo(82, 10); c.lineTo(66, -34); c.lineTo(40, -40); c.lineTo(28, -60); c.lineTo(8, -40); c.lineTo(-14, -60); c.lineTo(-30, -38); c.lineTo(-58, -50); c.closePath(); }, cor); };
// VINI — protagonista (~20 anos): cabelo escuro bagunçado, olheiras, camiseta escura, jeans
export const vini = () => adulto({ pele: '#e2b08c', roupa: '#2a2c34', perna: '#3a5480', sapato: '#e8e4dc', olhos: '#3a2a1e', sob: '#1a1210', cabeloFrente: cabBag('#1c140e'),
  extra: (c) => { shape(c, c => { c.moveTo(-26, -236); c.quadraticCurveTo(0, -214, 26, -236); }, null, { stroke: '#18181e', lw: 6 }); } }, { olheira: 'rgba(90,60,90,0.55)', barba: '#2a1a10', s: 1.05 });
// TIO DO PAVÊ (~50): careca no topo, bigode, barriga, camisa polo vermelha, bermuda e chinelo
export const tio = () => adulto({ pele: '#d39a72', roupa: '#a8343a', perna: '#d39a72', sapato: '#2a2a30', olhos: '#2a1a10', sob: '#4a3a30', largura: 92, barra: -118,
  cabeloFrente: (c) => { ellipse(c, -20, -56, 24, 9, '#ffffff', { stroke: null, alpha: 0.3 }); for (const s of [-1, 1]) shape(c, c => { c.moveTo(s * 80, 14); c.quadraticCurveTo(s * 86, -36, s * 62, -50); c.quadraticCurveTo(s * 58, -12, s * 68, 16); c.closePath(); }, '#5a4a40'); },
  extra: (c) => { rrect(c, -64, -138, 128, 50, 12, '#c8b48a', { lw: 5 }); ellipse(c, 0, -170, 70, 54, '#a8343a', { lw: 5 }); line(c, [[-8, -236], [-8, -206]], '#7a2228', 4); } }, { bigode: '#4a3a30', rugas: true, s: 1.1, olho: 0.74, blush: 0.25 });
// TIA: cabelo volumoso com luzes, brincos, batom, vestido verde-petróleo
export const tia = () => adulto({ pele: '#eac0a0', roupa: '#1f7a74', perna: '#eac0a0', sapato: '#8a2a3a', olhos: '#3a2a1e', sob: '#5a3a1a', barra: -70, largura: 84,
  cabeloFrente: (c) => { shape(c, c => { c.moveTo(-96, 50); c.quadraticCurveTo(-120, -110, 0, -112); c.quadraticCurveTo(120, -110, 96, 50); c.quadraticCurveTo(84, -30, 30, -60); c.quadraticCurveTo(-20, -40, -70, -50); c.quadraticCurveTo(-90, 0, -96, 50); c.closePath(); }, '#8a5a2a'); for (const [x, y] of [[-50, -80], [10, -96], [60, -74]]) line(c, [[x, y], [x + 16, y + 30]], '#d8a85a', 6); } },
  { batom: '#c02a40', brincos: '#e8c040', rugas: true, s: 1.02 });
// A VELHA DA UVA-PASSA: coque grisalho, óculos, xale roxo
export const velha = () => adulto({ pele: '#e8c4a8', roupa: '#5a3a6a', perna: '#e8c4a8', sapato: '#3a2a20', olhos: '#4a3a3a', sob: '#b8b8c0', barra: -60, largura: 86,
  cabeloFrente: (c) => { shape(c, c => { c.moveTo(-80, 0); c.quadraticCurveTo(-88, -92, 0, -94); c.quadraticCurveTo(88, -92, 80, 0); c.quadraticCurveTo(60, -50, 0, -58); c.quadraticCurveTo(-60, -50, -80, 0); c.closePath(); }, '#c8c8d0'); circle(c, 0, -104, 30, '#c8c8d0'); },
  extra: (c) => { shape(c, c => { c.moveTo(-58, -236); c.quadraticCurveTo(0, -150, 58, -236); c.lineTo(70, -150); c.quadraticCurveTo(0, -110, -70, -150); c.closePath(); }, '#7a5a8a', { lw: 5 }); } }, { oculos: '#3a2a2a', rugas: true, s: 0.95 });
// MÃE: coque, avental
export const maeN = () => adulto({ pele: '#d8a07a', roupa: '#7a3a5a', perna: '#3a4060', sapato: '#3a2a20', olhos: '#2a1610', sob: '#2a1610', barra: -96, largura: 74,
  cabeloFrente: (c) => { shape(c, c => { c.moveTo(-82, 10); c.quadraticCurveTo(-92, -94, 0, -96); c.quadraticCurveTo(92, -94, 82, 10); c.quadraticCurveTo(60, -50, 0, -58); c.quadraticCurveTo(-60, -50, -82, 10); c.closePath(); }, '#2a1a10'); circle(c, 30, -100, 28, '#2a1a10'); },
  extra: (c) => { rrect(c, -54, -206, 108, 150, 14, '#efe6d6', { lw: 5 }); } }, { rugas: true, s: 1.0 });
// AVÔ: careca, bigode branco, cardigã marrom
export const avo = () => adulto({ pele: '#e0b090', roupa: '#7a5a3a', perna: '#4a4a52', sapato: '#2a2020', olhos: '#3a2a2a', sob: '#e8e8ec', curta: false,
  cabeloFrente: (c) => { ellipse(c, -20, -56, 24, 9, '#ffffff', { stroke: null, alpha: 0.3 }); for (const s of [-1, 1]) shape(c, c => { c.moveTo(s * 80, 12); c.quadraticCurveTo(s * 84, -30, s * 64, -44); c.quadraticCurveTo(s * 60, -10, s * 68, 14); c.closePath(); }, '#e8e8ec'); } }, { bigode: '#f2f2f4', rugas: true, s: 1.0, olho: 0.74 });
// PRIMO (~8 anos): cabelo espetado, camiseta com rena
export const primo = () => { const P = base({ pele: '#e2b08c', roupa: '#2f8f4a', perna: '#e2b08c', sapato: '#e2473a', olhos: '#3a2a1e', sob: '#3a2414', barra: -116, largura: 62, cabeloFrente: cabBag('#5a3a1a'), extra: (c) => { rrect(c, -62, -134, 124, 50, 12, '#3a3a44', { lw: 5 }); circle(c, 0, -180, 18, '#a8743a', { lw: 3 }); circle(c, 0, -170, 6, '#e2473a', { stroke: null }); } }); P.d.cab = 0.92; const r = P.reset.bind(P); P.reset = () => { r(); P.s = 0.72; P.olhoTam = 0.95; return P; }; P.reset(); return P; };
// PAPAI NOEL (design próprio)
export const noel = () => adulto({ pele: '#f0c4a4', roupa: '#b81e2a', perna: '#b81e2a', sapato: '#1a1a1e', olhos: '#2a3a5a', sob: '#f4f4f6', largura: 96, barra: -110, curta: false,
  cabeloFrente: (c) => { shape(c, c => { c.moveTo(-84, -20); c.quadraticCurveTo(-60, -150, 40, -130); c.quadraticCurveTo(110, -120, 130, -40); c.lineTo(84, -30); c.closePath(); }, '#b81e2a'); rrect(c, -92, -40, 184, 30, 14, '#f4f4f6', { lw: 5 }); circle(c, 132, -36, 20, '#f4f4f6', { lw: 4 }); },
  extra: (c) => { rrect(c, -70, -150, 140, 22, 4, '#1a1a1e', { lw: 4 }); rrect(c, -16, -152, 32, 26, 4, '#e8c040', { lw: 3 }); } }, { s: 1.08, olho: 0.72, blush: 0.4 });
export function barbaNoel(P) { const r = P.rosto.bind(P); P.rosto = (c, t) => { r(c, t); const fx = P.olhar[0] * 7, fy = P.olhar[1] * 6; shape(c, c => { c.moveTo(-74, 0); c.quadraticCurveTo(-80, 120, 0, 150); c.quadraticCurveTo(80, 120, 74, 0); c.quadraticCurveTo(50, 30, 30, 26); c.quadraticCurveTo(fx, 60 + fy, -30, 26); c.quadraticCurveTo(-50, 30, -74, 0); c.closePath(); }, '#f4f4f6', { lw: 5 }); shape(c, c => { c.moveTo(fx - 30, 34 + fy); c.quadraticCurveTo(fx - 14, 20 + fy, fx, 28 + fy); c.quadraticCurveTo(fx + 14, 20 + fy, fx + 30, 34 + fy); c.closePath(); }, '#ffffff', { lw: 4 }); if (['aberta', 'grito', 'meia', 'o', 'triste'].includes(P.boca)) ellipse(c, fx * 0.9, 50 + fy, 12, 8, '#8e1f2a', { lw: 4 }); }; return P; }
// objetos nas mãos
export const travessa = (tipo) => (c, s, t) => {
  c.save(); c.translate(-s * 30, -8);
  ellipse(c, 0, 0, 90, 26, '#f2efe8', { lw: 5 });
  if (tipo === 'pave') { rrect(c, -70, -50, 140, 50, 10, '#f2e2b8', { lw: 5 }); for (let i = 0; i < 3; i++) line(c, [[-64, -38 + i * 14], [64, -38 + i * 14]], ['#8a5a2a', '#f8f0d8', '#c89a5a'][i], 6); for (let i = 0; i < 5; i++) circle(c, -50 + i * 25, -54, 7, '#5a3218', { lw: 2 }); }
  if (tipo === 'arroz') { shape(c, c => { c.moveTo(-80, -4); c.quadraticCurveTo(0, -70, 80, -4); c.closePath(); }, '#f6f2e6', { lw: 5 }); for (let i = 0; i < 14; i++) { const r = Math.sin(i * 12.9) * 0.5 + 0.5, q = Math.sin(i * 7.3) * 0.5 + 0.5; ellipse(c, -60 + r * 120, -8 - q * 34 * (1 - Math.abs(r - 0.5) * 1.6), 6, 4.5, '#3a1a2a', { stroke: null }); } }
  c.restore();
};
export const pratoMao = (n = 3, farofa = 1, passa = 0) => (c, s) => {
  c.save(); c.translate(-s * 26, -6); ellipse(c, 0, 0, 74, 20, '#f6f4ee', { lw: 5 });
  if (farofa > 0) ellipse(c, 18, -8, 34 * farofa, 10 * farofa, '#e0b060', { stroke: null });
  for (let i = 0; i < n; i++) rrect(c, -46 + i * 20, -22 - (i % 2) * 6, 26, 18, 6, '#8a4a2a', { lw: 3 });
  if (passa) ellipse(c, 0, -14, 7, 5, '#3a1a2a', { stroke: null });
  c.restore();
};
export const presente = () => (c, s) => { c.save(); c.translate(-s * 40, -20); rrect(c, -40, -40, 80, 70, 4, '#2a6a4a', { lw: 4 }); rrect(c, -6, -40, 12, 70, 0, '#e8c040', { stroke: null }); rrect(c, -40, -12, 80, 12, 0, '#e8c040', { stroke: null }); for (const s2 of [-1, 1]) ellipse(c, s2 * 16, -48, 16, 10, '#e8c040', { lw: 3 }); c.restore(); };
export const garfo = () => (c, s) => { c.save(); c.rotate(-0.5 * s); line(c, [[0, 0], [0, -60]], '#c8c8d0', 6); for (let k = -1; k <= 1; k++) line(c, [[k * 6, -60], [k * 6, -80]], '#c8c8d0', 4); rrect(c, -8, -78, 26, 16, 6, '#8a4a2a', { lw: 3 }); c.restore(); };

// ================== "Saudade" ==================
// NICO — criança (~10): cabelo castanho curto, camiseta vermelha, bermuda jeans, tênis branco
const CAB_NICO = '#5a3a22';
export const nico = () => menino({ pele: '#e6b48e', roupa: '#d8302a', bermudaCor: '#3a6ab0', chinelo: '#f6f6f2', cabelo: cabeloMenino(CAB_NICO), olhos: '#5a3a1e' });
// NICO adulto (~20): mesmos traços, cabelo castanho, moletom cinza-azulado, jeans, tênis branco
export const nicoAdulto = () => adulto({ pele: '#e6b48e', roupa: '#4a5670', perna: '#34507a', sapato: '#f2f2ec', olhos: '#5a3a1e', sob: '#1a1210', curta: false, cabeloFrente: cabeloMenino(CAB_NICO),
  extra: (c) => { shape(c, c => { c.moveTo(-40, -238); c.quadraticCurveTo(0, -200, 40, -238); }, null, { stroke: '#3a4458', lw: 8 }); line(c, [[-14, -226], [-18, -180]], '#d8dce6', 4); line(c, [[14, -226], [18, -180]], '#d8dce6', 4); } }, { s: 1.0, olho: 0.86, blush: 0.15, cab: 0.82 });
// de costas: cobre o rosto com o cabelo
export function costas(c, P) { const [hx, hy] = P.cabeca(); const r = 76 * P.s * (P.d.cab || 1); circle(c, hx, hy - 4 * P.s, r, CAB_NICO, { lw: 5 }); ellipse(c, hx - r * 0.3, hy - r * 0.5, r * 0.3, r * 0.12, 'rgba(255,255,255,0.15)', { stroke: null }, -0.4); }

// ================== "Pais envelhecendo" ==================
const CAB_FILHO = '#151517';
// FILHO: criança (~7), adolescente, adulto — cabelo preto curto, camiseta azul
export const filhoCrianca = () => menino({ s: 0.66, pele: '#e8b892', roupa: '#2f7fe0', bermudaCor: '#e2a040', chinelo: '#f2f2ec', cabelo: cabeloMenino(CAB_FILHO), olhos: '#3a2414' });
export const filhoJovem = () => { const P = menino({ s: 0.86, pele: '#e8b892', roupa: '#2f7fe0', bermudaCor: '#3a5a8a', chinelo: '#f2f2ec', cabelo: cabeloMenino(CAB_FILHO), olhos: '#3a2414' }); P.d.cab = 0.9; return P; };
export const filhoAdulto = () => adulto({ pele: '#e8b892', roupa: '#2a5aa8', perna: '#2a3448', sapato: '#f2f2ec', olhos: '#3a2414', sob: '#101014', cabeloFrente: cabeloMenino(CAB_FILHO) }, { s: 1.0, olho: 0.86, blush: 0.15, cab: 0.82 });
// PAI: cabelo preto curto, barba discreta — jovem ou grisalho
const cabPai = (cor, mechas = 0) => (c) => { shape(c, c => { c.moveTo(-80, 0); c.quadraticCurveTo(-86, -90, 0, -94); c.quadraticCurveTo(86, -90, 80, 0); c.quadraticCurveTo(54, -54, 0, -56); c.quadraticCurveTo(-54, -54, -80, 0); c.closePath(); }, cor); for (let k = 0; k < mechas; k++) line(c, [[-60 + k * 30, -70 + (k % 2) * 8], [-48 + k * 30, -52]], '#e8e8ec', 4); };
export const paiFam = (velho = false) => adulto({ pele: '#d9a37a', roupa: velho ? '#7a5a44' : '#c8443a', perna: '#3a3a44', sapato: '#3a2a20', olhos: '#3a2414', sob: velho ? '#9a9aa0' : '#1a1210', cabeloFrente: cabPai(velho ? '#8a8a90' : '#1a1410', velho ? 5 : 0), curta: !velho }, { barba: velho ? '#c8c8cc' : '#1a1410', rugas: velho, s: 1.06, olho: 0.8, blush: 0.12 });
// MÃE: cabelo castanho escuro, coque solto — jovem ou com fios brancos
const cabMae = (cor, brancos = 0) => (c) => { shape(c, c => { c.moveTo(-86, 40); c.quadraticCurveTo(-96, -96, 0, -98); c.quadraticCurveTo(96, -96, 86, 40); c.quadraticCurveTo(70, -40, 10, -58); c.quadraticCurveTo(-60, -40, -86, 40); c.closePath(); }, cor); circle(c, 40, -100, 30, cor); for (let k = 0; k < brancos; k++) line(c, [[-50 + k * 26, -84], [-60 + k * 30, -30]], 'rgba(240,240,244,0.85)', 4); };
export const maeFam = (velha = false) => adulto({ pele: '#eec4a2', roupa: velha ? '#6a7a9a' : '#e2775c', perna: '#3a4060', sapato: '#5a3a2a', olhos: '#4a2a1a', sob: '#3a2414', barra: -90, largura: 76, cabeloFrente: cabMae('#4a2a1a', velha ? 4 : 0) }, { rugas: velha, s: 1.0, olho: 0.86, blush: 0.2 });
