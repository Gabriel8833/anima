// Personagens originais de "E se você sentisse um vazio que não consegue explicar?"
// VOCÊ (jovem, ~20 anos): cabelo castanho-escuro bagunçado com franja, moletom cinza com capuz, jeans, tênis branco.
import { TAU, rng, mix } from '../motor/base.js';
import { OUT, shape, circle, ellipse, poly, line, rrect, glow } from '../motor/desenho.js';
import { Personagem } from '../motor/personagem.js';

function cabeloBagunçado(cor) {
  return (c) => {
    shape(c, c => { c.moveTo(-80, 4); c.quadraticCurveTo(-92, -92, -10, -98); c.quadraticCurveTo(70, -104, 84, -30); c.lineTo(80, 4); c.lineTo(64, -30); c.lineTo(50, -18); c.lineTo(34, -44); c.lineTo(10, -26); c.lineTo(-8, -50); c.lineTo(-30, -28); c.lineTo(-48, -46); c.lineTo(-62, -20); c.closePath(); }, cor);
    for (const [x, y, a] of [[-20, -98, -0.5], [14, -102, 0.3], [40, -94, 0.8]]) { c.save(); c.translate(x, y); c.rotate(a); shape(c, c => { c.moveTo(-8, 4); c.quadraticCurveTo(0, -26, 14, -20); c.quadraticCurveTo(6, -8, 8, 4); c.closePath(); }, cor, { lw: 4 }); c.restore(); }
  };
}
const capuz = (cor) => (c) => { shape(c, c => { c.moveTo(-60, -238); c.quadraticCurveTo(0, -204, 60, -238); c.quadraticCurveTo(68, -210, 38, -198); c.quadraticCurveTo(0, -188, -38, -198); c.quadraticCurveTo(-68, -210, -60, -238); c.closePath(); }, cor, { lw: 5 }); for (const s of [-1, 1]) line(c, [[s * 12, -208], [s * 15, -170]], '#e8e4dc', 4); rrect(c, -36, -150, 72, 34, 8, cor, { lw: 4 }); };

export const voce = () => new Personagem({ pele: '#f0c8a4', olhos: '#3a2a1e', sobrancelha: '#3a2418', sobrancelhaW: 8, roupa: '#7a8494', roupaSombra: '#5a6474', manga: '#7a8494', enfeite: '#5a6474', cinto: '#6a7484', semFaixa: true, barra: -108, larguraBarra: 70, perna: '#3a4a6a', sapato: '#eeeae2',
  extraTras: capuz('#6a7484'), cabeloFrente: cabeloBagunçado('#3a2418') });

// amigos (cena 2 e 5)
export const amigo = (tipo = 0) => {
  const v = [
    { pele: '#c89070', roupa: '#d0603a', cabelo: '#1a1210', perna: '#2a2a34' },
    { pele: '#f6d6bc', roupa: '#4a9a8a', cabelo: '#c8862a', perna: '#4a4a5a' },
    { pele: '#8a5a3a', roupa: '#e8c040', cabelo: '#1a1210', perna: '#3a4a6a' },
  ][tipo % 3];
  return new Personagem({ pele: v.pele, olhos: '#2a2a2a', sobrancelha: v.cabelo, roupa: v.roupa, roupaSombra: mix(v.roupa, '#000000', 0.3), manga: v.roupa, enfeite: mix(v.roupa, '#000000', 0.25), cinto: mix(v.roupa, '#000000', 0.25), semFaixa: true, barra: -110, larguraBarra: 68, perna: v.perna, sapato: '#2a2a2a',
    cabeloFrente: tipo === 1
      ? (c) => { shape(c, c => { c.moveTo(-80, 30); c.quadraticCurveTo(-90, -96, 0, -96); c.quadraticCurveTo(90, -96, 80, 30); c.quadraticCurveTo(70, -40, 20, -56); c.quadraticCurveTo(-40, -40, -60, -10); c.quadraticCurveTo(-70, 10, -80, 30); c.closePath(); }, v.cabelo); }
      : tipo === 2 ? (c) => { for (let i = 0; i < 9; i++) circle(c, -64 + i * 16, -70 - Math.sin(i / 8 * Math.PI) * 26, 22, v.cabelo, { stroke: null }); shape(c, c => c.arc(0, -10, 82, Math.PI * 1.08, Math.PI * 1.92), null, { stroke: OUT, lw: 6 }); }
      : (c) => { shape(c, c => { c.moveTo(-76, -10); c.quadraticCurveTo(-80, -92, 0, -94); c.quadraticCurveTo(80, -92, 76, -10); c.quadraticCurveTo(50, -60, 0, -58); c.quadraticCurveTo(-50, -60, -76, -10); c.closePath(); }, v.cabelo); } });
};

// passantes da rua (gerados por semente, todos diferentes)
export function passante(i) {
  const r = rng(40 + i * 7);
  const peles = ['#f6d6bc', '#e8b890', '#c89070', '#8a5a3a', '#f0c8a4'], roupas = ['#c84a4a', '#4a7ac8', '#e8a040', '#5aa070', '#9a5ab0', '#e8e0d0', '#3a3a4a', '#d87aa0'], cabelos = ['#1a1210', '#5a3418', '#c8862a', '#8a8a8a', '#2a1a12'];
  const roupa = roupas[Math.floor(r() * roupas.length)], cab = cabelos[Math.floor(r() * cabelos.length)], longo = r() < 0.45;
  return new Personagem({ pele: peles[Math.floor(r() * peles.length)], olhos: '#2a2a2a', sobrancelha: cab, roupa, roupaSombra: mix(roupa, '#000000', 0.3), manga: roupa, enfeite: mix(roupa, '#000000', 0.25), cinto: mix(roupa, '#000000', 0.25), semFaixa: true, barra: longo ? -70 : -110, larguraBarra: longo ? 80 : 68, perna: ['#2a2a34', '#3a4a6a', '#5a4a3a'][Math.floor(r() * 3)], sapato: '#2a2a2a',
    cabeloFrente: longo
      ? (c) => { shape(c, c => { c.moveTo(-80, 50); c.quadraticCurveTo(-92, -96, 0, -96); c.quadraticCurveTo(92, -96, 80, 50); c.quadraticCurveTo(66, -40, 0, -56); c.quadraticCurveTo(-66, -40, -80, 50); c.closePath(); }, cab); }
      : (c) => { shape(c, c => { c.moveTo(-76, -6); c.quadraticCurveTo(-80, -92, 0, -94); c.quadraticCurveTo(80, -92, 76, -6); c.quadraticCurveTo(50, -58, 0, -56); c.quadraticCurveTo(-50, -58, -76, -6); c.closePath(); }, cab); } });
}

// vizinha idosa (cena 5): coque grisalho, cardigã lilás, regador
export const vizinha = () => new Personagem({ pele: '#f2d2b6', olhos: '#3a3a2a', sobrancelha: '#9a9aa2', roupa: '#a88ac0', roupaSombra: '#8a6aa0', manga: '#a88ac0', enfeite: '#f6f2ea', cinto: '#8a6aa0', semFaixa: true, barra: -50, larguraBarra: 84, perna: '#6a5a5a', sapato: '#5a3a2a',
  cabeloFrente: (c) => { shape(c, c => { c.moveTo(-78, 0); c.quadraticCurveTo(-88, -90, 0, -92); c.quadraticCurveTo(88, -90, 78, 0); c.quadraticCurveTo(60, -50, 0, -56); c.quadraticCurveTo(-60, -50, -78, 0); c.closePath(); }, '#c8c8d0'); circle(c, 0, -104, 28, '#c8c8d0'); for (const s of [-1, 1]) { circle(c, s * 26, -4, 20, null, { stroke: OUT, lw: 4 }); } line(c, [[-6, -4], [6, -4]], OUT, 4); } });

// ---------- objetos na mão ----------
export const celular = (luz = 1) => (c, s, t) => { c.save(); c.rotate(-0.2 * s); rrect(c, -20, -62, 40, 70, 8, '#1a1a22', { lw: 4 }); rrect(c, -15, -56, 30, 56, 4, luz > 0 ? '#bfe0ff' : '#2a2a34', { stroke: null }); if (luz > 0) { for (let i = 0; i < 3; i++) rrect(c, -11, -50 + ((i * 18 + t * 30) % 54), 22, 10, 3, ['#ff6a6a', '#6ab0ff', '#ffd23a'][i], { stroke: null }); glow(c, 0, -28, 140, '#9ad0ff', 0.35 * luz); } c.restore(); };
export const controle = () => (c) => { rrect(c, -34, -18, 68, 34, 16, '#2a2a34', { lw: 4 }); circle(c, -14, -2, 6, '#5a5a6a', { stroke: null }); for (const [x, y, k] of [[14, -8, '#ff5a5a'], [22, 0, '#5ab0ff']]) circle(c, x, y, 5, k, { stroke: null }); };
export const copo = () => (c) => { poly(c, [[-18, -50], [18, -50], [13, 6], [-13, 6]], '#d83a3a', { lw: 4 }); };
export const regador = () => (c, s, t) => { rrect(c, -30, -40, 60, 46, 8, '#5aa070', { lw: 4 }); line(c, [[28, -30], [70, -60]], '#5aa070', 8); shape(c, c => c.arc(-4, -48, 20, Math.PI, 0), null, { lw: 5 }); for (let i = 0; i < 6; i++) { const u = (t * 2 + i / 6) % 1; circle(c, 74 + u * 20, -60 + u * 90, 3, '#8ac8ff', { stroke: null, alpha: 1 - u }); } };
export const caneta = () => (c) => { line(c, [[0, 0], [10, -46]], '#2a4ab0', 6); };
export const xicara = () => (c, s, t) => { rrect(c, -22, -40, 44, 44, 8, '#f6f2ea', { lw: 4 }); shape(c, c => c.arc(26, -18, 12, -1.3, 1.3), null, { lw: 5 }); for (let i = 0; i < 2; i++) { const u = (t * 0.6 + i / 2) % 1; c.save(); c.globalAlpha = 0.5 * (1 - u); circle(c, -6 + i * 12 + Math.sin(u * 6) * 6, -50 - u * 50, 7 + u * 8, '#ffffff', { stroke: null }); c.restore(); } };

// ---------- o "vazio": contorno de uma peça de quebra-cabeça que falta no peito ----------
// Não some magicamente: no fim ele continua ali, mas iluminado por dentro (esperança realista).
export function pecaVazia(c, x, y, s, a, luz = 0, t = 0) {
  if (a <= 0.01) return;
  c.save(); c.translate(x, y); c.scale(s, s); c.globalAlpha *= a;
  const p = c => { c.moveTo(-30, -30); c.lineTo(-8, -30); c.arc(0, -36, 10, Math.PI * 0.8, Math.PI * 0.2, false); c.lineTo(30, -30); c.lineTo(30, -8); c.arc(36, 0, 10, Math.PI * 1.3, Math.PI * 0.7, true); c.lineTo(30, 30); c.lineTo(-30, 30); c.closePath(); };
  c.beginPath(); p(c); c.fillStyle = mix('#0e1220', '#ffcf80', luz); c.globalAlpha *= 0.75; c.fill(); c.globalAlpha /= 0.75;
  if (luz > 0) glow(c, 0, 0, 70, '#ffd890', luz * 0.7);
  c.setLineDash([8, 6]); c.lineDashOffset = -t * 20; c.lineWidth = 4; c.strokeStyle = mix('#9ab0d8', '#fff0c8', luz); c.beginPath(); p(c); c.stroke();
  c.restore();
}

// ================== "E se você tivesse ego demais?" ==================
// VOCÊ: jovem de cabelo castanho com topete arrumado, jaqueta vinho sobre camiseta branca, calça bege, tênis branco.
// p.coroa = { s, rachada, brilho }: a coroa dourada do ego (cresce a cada cena).
export function coroa(c, x, y, s, { rachada = 0, brilho = 1, opaca = 0 } = {}) {
  if (s <= 0.01) return;
  c.save(); c.translate(x, y); c.scale(s, s);
  const ouro = mix(mix('#ffcf3a', '#b89a5a', opaca), '#8a7a5a', rachada * 0.6), sombra = mix('#d89a1a', '#7a6a4a', opaca);
  if (brilho > 0) glow(c, 0, -30, 120, '#ffd86a', 0.35 * brilho * (1 - opaca));
  shape(c, c => { c.moveTo(-64, 0); c.lineTo(-72, -62); c.lineTo(-38, -30); c.lineTo(-20, -78); c.lineTo(0, -38); c.lineTo(20, -78); c.lineTo(38, -30); c.lineTo(72, -62); c.lineTo(64, 0); c.closePath(); }, ouro, { lw: 5 });
  rrect(c, -66, -14, 132, 18, 4, sombra, { lw: 4 });
  for (const [px, py, cor] of [[-72, -62, '#e84a5a'], [-20, -78, '#4ab0e8'], [20, -78, '#4ab0e8'], [72, -62, '#e84a5a']]) circle(c, px, py, 7, mix(cor, '#6a6a6a', opaca), { lw: 3 });
  circle(c, 0, -6, 9, mix('#e84a5a', '#6a6a6a', opaca), { lw: 3 });
  if (rachada > 0) { c.globalAlpha *= rachada; line(c, [[-10, -70], [-2, -46], [-14, -28], [-4, -6]], '#3a2a1a', 4); line(c, [[30, -50], [40, -30], [34, -10]], '#3a2a1a', 3); }
  c.restore();
}
function topete(c, p) {
  const cor = '#4a2a18';
  shape(c, c => { c.moveTo(-80, 6); c.quadraticCurveTo(-92, -80, -30, -96); c.quadraticCurveTo(-10, -130, 40, -120); c.quadraticCurveTo(84, -112, 82, -60); c.quadraticCurveTo(86, -20, 80, 6); c.quadraticCurveTo(70, -40, 40, -60); c.quadraticCurveTo(0, -70, -40, -56); c.quadraticCurveTo(-70, -40, -80, 6); c.closePath(); }, cor);
  for (let i = 0; i < 3; i++) shape(c, c => { c.moveTo(-30 + i * 22, -100 + i * 2); c.quadraticCurveTo(10 + i * 20, -124 + i * 6, 50 + i * 10, -100 + i * 8); }, null, { stroke: '#6a4028', lw: 4 });
  if (p.desarrumado) for (const [x, a] of [[-40, -0.6], [10, 0.4], [50, 0.9]]) { c.save(); c.translate(x, -98); c.rotate(a); shape(c, c => { c.moveTo(-6, 4); c.quadraticCurveTo(0, -26, 14, -18); c.quadraticCurveTo(6, -6, 8, 4); c.closePath(); }, cor, { lw: 4 }); c.restore(); }
  const k = p.coroa; if (k && k.s > 0.01) coroa(c, 0, -104, k.s, k);
}
export const ego = () => new Personagem({ pele: '#f2c6a0', olhos: '#3a2418', sobrancelha: '#4a2a18', sobrancelhaW: 9, roupa: '#a8343a', roupaSombra: '#7a2228', manga: '#a8343a', enfeite: '#7a2228', cinto: '#a8343a', semFaixa: true, barra: -100, larguraBarra: 72, perna: '#c8b48a', sapato: '#f6f2ea',
  extraTras: (c) => { poly(c, [[-26, -236], [26, -236], [0, -170]], '#f6f2ea', { lw: 4 }); for (const s of [-1, 1]) poly(c, [[s * 26, -238], [s * 44, -230], [s * 14, -160], [s * 4, -176]], '#8a2a30', { lw: 4 }); },
  cabeloFrente: topete });

// objetos
export const trofeu = () => (c) => { rrect(c, -26, -14, 52, 18, 4, '#7a5a2a', { lw: 4 }); rrect(c, -8, -40, 16, 28, 3, '#e8b030', { lw: 3 }); shape(c, c => { c.moveTo(-34, -96); c.lineTo(34, -96); c.quadraticCurveTo(32, -40, 0, -40); c.quadraticCurveTo(-32, -40, -34, -96); c.closePath(); }, '#ffcf3a', { lw: 4 }); glow(c, 0, -70, 90, '#ffe08a', 0.4); };
export const folha = () => (c) => { c.save(); c.rotate(-0.2); rrect(c, -40, -100, 80, 104, 4, '#f6f2ea', { lw: 4 }); for (let i = 0; i < 5; i++) line(c, [[-28, -84 + i * 18], [24 - (i % 2) * 18, -84 + i * 18]], '#8a8a9a', 3); c.restore(); };

// ================== "E se você achasse que estava em um anime?" ==================
// RENAN: cabelo preto-azulado espetado (estilo protagonista), jaqueta laranja com camiseta branca, calça preta, tênis vermelho.
// p.cachecol = true → cachecol vermelho esvoaçante (só na imaginação). p.bolsos = true → bolsos vazios para fora.
function espetos(c, p) {
  const cor = '#1e2440', luz = '#3a4a8a';
  shape(c, c => {
    c.moveTo(-82, 10);
    const pts = [[-96, -40], [-70, -50], [-100, -96], [-50, -84], [-56, -140], [-14, -100], [0, -156], [20, -102], [62, -140], [52, -84], [104, -98], [72, -48], [98, -36], [80, 10]];
    for (const [x, y] of pts) c.lineTo(x, y);
    c.lineTo(62, -24); c.lineTo(44, 4); c.lineTo(30, -30); c.lineTo(8, -4); c.lineTo(-10, -36); c.lineTo(-30, -2); c.lineTo(-48, -30); c.lineTo(-64, -6); c.closePath();
  }, cor);
  for (const [x0, y0, x1, y1] of [[-40, -96, -50, -126], [0, -110, 0, -140], [40, -96, 54, -124]]) line(c, [[x0, y0], [x1, y1]], luz, 5);
}
export const renan = () => new Personagem({ pele: '#f2c8a2', olhos: '#2a3a8a', sobrancelha: '#1e2440', sobrancelhaW: 10, roupa: '#e8702a', roupaSombra: '#b8501a', manga: '#e8702a', enfeite: '#1e2440', cinto: '#e8702a', semFaixa: true, barra: -104, larguraBarra: 72, perna: '#22222c', sapato: '#d8302a',
  extraTras: (c, p) => {
    poly(c, [[-24, -236], [24, -236], [0, -176]], '#f6f2ea', { lw: 4 });
    line(c, [[0, -176], [0, -110]], '#1e2440', 5);
    if (p.cachecol) { const f = Math.sin(p.t * 9) * 16; shape(c, c => { c.moveTo(-40, -236); c.quadraticCurveTo(0, -214, 40, -236); c.lineTo(34, -214); c.quadraticCurveTo(0, -196, -34, -214); c.closePath(); }, '#d8202a', { lw: 4 }); shape(c, c => { c.moveTo(30, -226); c.quadraticCurveTo(110, -250 + f, 200, -224 - f); c.quadraticCurveTo(150, -206 + f, 40, -206); c.closePath(); }, '#d8202a', { lw: 4 }); }
    if (p.bolsos) for (const s of [-1, 1]) shape(c, c => { c.moveTo(s * 54, -124); c.lineTo(s * 86, -118); c.lineTo(s * 80, -84); c.lineTo(s * 58, -92); c.closePath(); }, '#f6f2ea', { lw: 4 });
  },
  cabeloFrente: espetos });
// bandidos (cena 3): capuz, touca e bandana cobrindo a boca
export const bandido = (tipo = 0) => { const cor = ['#3a3a44', '#4a3a2a', '#2a3a3a'][tipo % 3], ban = ['#8a2a2a', '#2a4a8a', '#3a3a3a'][tipo % 3];
  return new Personagem({ pele: ['#c89070', '#e8b890', '#8a5a3a'][tipo % 3], olhos: '#1a1a1a', sobrancelha: '#1a1a1a', sobrancelhaW: 10, roupa: cor, roupaSombra: '#1a1a1a', manga: cor, enfeite: '#1a1a1a', cinto: cor, semFaixa: true, barra: -100, larguraBarra: 76, perna: '#1e1e26', sapato: '#111111', blush: 0,
    cabeloFrente: (c, p) => { shape(c, c => { c.moveTo(-82, -6); c.quadraticCurveTo(-84, -100, 0, -104); c.quadraticCurveTo(84, -100, 82, -6); c.closePath(); }, '#1a1a22'); rrect(c, -86, -18, 172, 20, 8, '#2a2a34', { lw: 4 }); if (!p.semBandana) shape(c, c => { c.moveTo(-74, 14); c.quadraticCurveTo(0, 4, 74, 14); c.lineTo(66, 54); c.quadraticCurveTo(0, 90, -66, 54); c.closePath(); }, ban, { lw: 4 }); } }); };
// assaltante da cena 5: capuz escuro, boné, rosto sério (sem caricatura)
export const assaltante = () => new Personagem({ pele: '#d8a882', olhos: '#1a1a1a', sobrancelha: '#1a1a1a', sobrancelhaW: 11, roupa: '#26262e', roupaSombra: '#121216', manga: '#26262e', enfeite: '#121216', cinto: '#26262e', semFaixa: true, barra: -96, larguraBarra: 78, perna: '#1a1a22', sapato: '#0e0e12', blush: 0,
  atrasCabeca: (c) => { circle(c, 0, 0, 92, '#1e1e26'); },
  cabeloFrente: (c) => { shape(c, c => { c.moveTo(-80, -10); c.quadraticCurveTo(-82, -96, 0, -98); c.quadraticCurveTo(82, -96, 80, -10); c.closePath(); }, '#2a2a34'); rrect(c, -20, -24, 130, 22, 10, '#1a1a22', { lw: 4 }); } });
export const arma = () => (c, s) => { c.save(); c.rotate(-Math.PI / 2 * s); rrect(c, -10, -14, 74, 22, 4, '#1a1a1e', { lw: 4 }); rrect(c, -10, 2, 24, 40, 4, '#1a1a1e', { lw: 4 }); c.restore(); };
export const garrafa = () => (c) => { rrect(c, -16, -70, 32, 70, 8, '#7ac8e8', { lw: 4 }); rrect(c, -8, -86, 16, 18, 3, '#2a6ab0', { lw: 3 }); };
export const fones = () => null;
