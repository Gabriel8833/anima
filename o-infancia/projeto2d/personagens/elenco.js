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

// ================== "Dependência emocional" ==================
// LUCAS: cabelo castanho cacheado, suéter mostarda com gola branca, jeans, tênis branco.
// A cor do suéter vai se apagando conforme ele "desaparece" (corLucas(L, k), k = 0 normal … 1 cinza).
export const lucas = () => new Personagem({ pele: '#e8b894', olhos: '#3a2418', sobrancelha: '#4a2a18', sobrancelhaW: 8, roupa: '#e0a030', roupaSombra: '#b87a18', manga: '#e0a030', enfeite: '#b87a18', cinto: '#e0a030', semFaixa: true, barra: -106, larguraBarra: 70, perna: '#3a4a6a', sapato: '#f2eee6',
  extraTras: (c) => { shape(c, c => { c.moveTo(-34, -238); c.quadraticCurveTo(0, -214, 34, -238); c.lineTo(30, -226); c.quadraticCurveTo(0, -204, -30, -226); c.closePath(); }, '#f6f2ea', { lw: 4 }); },
  cabeloFrente: (c) => { const cor = '#5a3420'; shape(c, c => { c.moveTo(-80, 6); c.quadraticCurveTo(-90, -90, 0, -94); c.quadraticCurveTo(90, -90, 80, 6); c.quadraticCurveTo(60, -40, 0, -50); c.quadraticCurveTo(-60, -40, -80, 6); c.closePath(); }, cor); for (let i = 0; i < 9; i++) { const a = Math.PI * (1.05 + i * 0.1); circle(c, Math.cos(a) * 74, -12 + Math.sin(a) * 70, 22, cor, { lw: 4 }); } for (const [x, y] of [[-40, -36], [-10, -44], [24, -40], [52, -30]]) circle(c, x, y, 16, cor, { lw: 4 }); } });
export function corLucas(L, k) { const r = mix('#e0a030', '#8e8c88', k), s = mix('#b87a18', '#6e6c6a', k); L.d.roupa = r; L.d.manga = r; L.d.cinto = r; L.d.roupaSombra = s; L.d.enfeite = s; }
// SOFIA: cabelo longo castanho-escuro repartido de lado, blusa coral, calça jeans escura.
export const sofia = () => new Personagem({ pele: '#f2cdb0', olhos: '#4a2a1a', sobrancelha: '#2a1a14', sobrancelhaW: 7, roupa: '#e8705a', roupaSombra: '#c0503e', manga: '#e8705a', enfeite: '#c0503e', cinto: '#e8705a', semFaixa: true, barra: -96, larguraBarra: 70, perna: '#2e3a5a', sapato: '#f2eee6',
  cabeloTras: (c) => { shape(c, c => { c.moveTo(-86, -300); c.quadraticCurveTo(-110, -200, -92, -150); c.lineTo(92, -150); c.quadraticCurveTo(110, -200, 86, -300); c.closePath(); }, '#2a1a14'); },
  cabeloFrente: (c) => { shape(c, c => { c.moveTo(-82, 60); c.quadraticCurveTo(-96, -96, 10, -96); c.quadraticCurveTo(92, -94, 84, 60); c.quadraticCurveTo(74, -30, 40, -54); c.quadraticCurveTo(-10, -40, -50, -20); c.quadraticCurveTo(-70, 10, -82, 60); c.closePath(); }, '#2a1a14'); line(c, [[20, -90], [-20, -50]], '#4a2e24', 4); } });
// lágrima escorrendo
export function lagrima(c, P, t, a = 1, lado = 1) { if (a <= 0.01) return; const [hx, hy] = P.cabeca(); const u = (t * 0.7) % 1; const x = hx + lado * 26 * P.s * P.flip, y = hy + (6 + u * 50) * P.s; c.save(); c.globalAlpha *= a * (1 - u * 0.6); shape(c, c => { c.moveTo(x, y - 10); c.quadraticCurveTo(x + 8, y + 4, x, y + 10); c.quadraticCurveTo(x - 8, y + 4, x, y - 10); }, '#9ad4ff', { lw: 3 }); c.restore(); ellipse(c, x, hy + 2 * P.s, 12 * P.s, 4 * P.s, '#bfe4ff', { stroke: null, alpha: a * 0.6 }); }

// ================== "A prisão dentro de você" (história original) ==================
// VOCÊ: ~30 anos, cabelo castanho penteado de lado, camisa branca, gravata vinho, calça cinza (vida de escritório).
//   p.mudado: sem gravata, mangas dobradas, cabelo bagunçado e barba por fazer (depois da fusão).
// O OUTRO: o mesmo rosto, mas cabelo bagunçado, barba por fazer, cicatriz na sobrancelha, jaqueta verde-oliva aberta e camiseta preta.
const PELE_V = '#e6bc9a', CAB_V = '#4a3020';
function barbaRala(c, a = 1) { c.save(); c.globalAlpha *= 0.45 * a; c.fillStyle = '#4a3a30'; c.beginPath(); c.moveTo(-62, 14); c.quadraticCurveTo(-56, 72, 0, 78); c.quadraticCurveTo(56, 72, 62, 14); c.quadraticCurveTo(40, 40, 0, 44); c.quadraticCurveTo(-40, 40, -62, 14); c.fill(); c.restore(); }
function cabeloArrumado(c) { shape(c, c => { c.moveTo(-80, 0); c.quadraticCurveTo(-90, -94, -10, -96); c.quadraticCurveTo(80, -96, 82, -20); c.lineTo(78, 0); c.quadraticCurveTo(70, -48, 20, -58); c.lineTo(-24, -70); c.quadraticCurveTo(-64, -50, -80, 0); c.closePath(); }, CAB_V); line(c, [[-24, -94], [-30, -70]], '#2e1c12', 4); }
function cabeloBaguncado(c) { shape(c, c => { c.moveTo(-82, 10); c.lineTo(-92, -50); c.lineTo(-70, -64); c.lineTo(-80, -96); c.lineTo(-40, -90); c.lineTo(-30, -118); c.lineTo(0, -98); c.lineTo(24, -120); c.lineTo(40, -92); c.lineTo(80, -100); c.lineTo(70, -66); c.lineTo(94, -44); c.lineTo(80, 10); c.lineTo(60, -30); c.lineTo(36, -16); c.lineTo(22, -46); c.lineTo(-4, -22); c.lineTo(-22, -50); c.lineTo(-46, -20); c.lineTo(-60, -36); c.closePath(); }, CAB_V); }
export const protagonista = () => new Personagem({ pele: PELE_V, olhos: '#2a3a2a', sobrancelha: '#2e1c12', sobrancelhaW: 8, roupa: '#ece8de', roupaSombra: '#c8c2b4', manga: '#ece8de', enfeite: '#c8c2b4', cinto: '#3a3a3e', semFaixa: true, barra: -110, larguraBarra: 66, perna: '#4a4c52', sapato: '#1a1a1e', blush: 0,
  extraTras: (c, p) => { if (!p.mudado) { poly(c, [[-12, -238], [12, -238], [8, -222], [-8, -222]], '#6a1a22', { lw: 3 }); poly(c, [[-8, -222], [8, -222], [16, -150], [0, -134], [-16, -150]], '#7a1e28', { lw: 3 }); } else { line(c, [[-14, -236], [0, -210], [14, -236]], '#c8c2b4', 4); } },
  cabeloFrente: (c, p) => { if (p.mudado) { cabeloBaguncado(c); barbaRala(c, 0.8); } else cabeloArrumado(c); } });
export const outro = () => new Personagem({ pele: PELE_V, olhos: '#2a3a2a', sobrancelha: '#2e1c12', sobrancelhaW: 9, roupa: '#4a5236', roupaSombra: '#343a26', manga: '#4a5236', enfeite: '#343a26', cinto: '#1a1a1e', semFaixa: true, barra: -104, larguraBarra: 76, perna: '#2a2a30', sapato: '#2a1e18', blush: 0,
  extraTras: (c) => { poly(c, [[-30, -238], [30, -238], [26, -110], [-26, -110]], '#16161a', { lw: 4 }); for (const s of [-1, 1]) poly(c, [[s * 30, -240], [s * 50, -232], [s * 40, -150], [s * 24, -190]], '#3a4228', { lw: 4 }); },
  cabeloFrente: (c) => { cabeloBaguncado(c); barbaRala(c, 1); line(c, [[-40, -40], [-30, -22]], '#a8786a', 3); } });
// objetos
export const marreta = () => (c, s, t) => { c.save(); c.rotate(-0.4); rrect(c, -6, -150, 12, 170, 4, '#6a4a2a', { lw: 4 }); rrect(c, -34, -186, 68, 40, 6, '#5a5a62', { lw: 4 }); c.restore(); };
export const pasta = () => (c) => { rrect(c, -36, 0, 72, 52, 6, '#3a2a1e', { lw: 4 }); shape(c, c => c.arc(0, 2, 14, Math.PI, 0), null, { lw: 4 }); };

// ================== "Inveja e comparação" — Lucas e Rafael ==================
// LUCAS: pele negra, cabelo curto degradê, camisa polo azul (depois com crachá), calça jeans, tênis branco.
// RAFAEL: pele morena clara, cabelo cacheado preso por boné vermelho virado para trás, camiseta vermelha, bermuda cinza, chinelo/tênis.
export const lucasB = () => new Personagem({ pele: '#8a5a3a', olhos: '#1a1210', sobrancelha: '#1a1210', sobrancelhaW: 8, roupa: '#2a6ad0', roupaSombra: '#1a4aa0', manga: '#2a6ad0', enfeite: '#1a4aa0', cinto: '#2a6ad0', semFaixa: true, barra: -108, larguraBarra: 68, perna: '#34466a', sapato: '#f2eee6',
  extraTras: (c, p) => { poly(c, [[-20, -238], [0, -220], [20, -238]], '#f2eee6', { lw: 3 }); if (p.cracha) { line(c, [[-20, -232], [0, -170], [20, -232]], '#1a1a1a', 3); rrect(c, -16, -172, 32, 42, 4, '#ffffff', { lw: 3 }); rrect(c, -10, -164, 20, 12, 2, '#2a6ad0', { stroke: null }); } },
  cabeloFrente: (c) => { shape(c, c => { c.moveTo(-74, -20); c.quadraticCurveTo(-76, -88, 0, -92); c.quadraticCurveTo(76, -88, 74, -20); c.quadraticCurveTo(60, -62, 0, -66); c.quadraticCurveTo(-60, -62, -74, -20); c.closePath(); }, '#1a1210'); line(c, [[-36, -82], [-30, -72]], '#3a2a20', 3); } });
export const rafael = () => new Personagem({ pele: '#c8906a', olhos: '#2a1a12', sobrancelha: '#2a1a12', sobrancelhaW: 9, roupa: '#d03a34', roupaSombra: '#a02420', manga: '#d03a34', enfeite: '#a02420', cinto: '#d03a34', semFaixa: true, barra: -108, larguraBarra: 70, perna: '#7a7a82', sapato: '#2a2a30',
  cabeloFrente: (c) => { for (const [x, y] of [[-70, -10], [-74, 16], [70, -10], [74, 16]]) circle(c, x, y, 16, '#2a1a12', { lw: 4 }); shape(c, c => { c.moveTo(-82, -20); c.quadraticCurveTo(-84, -100, 0, -104); c.quadraticCurveTo(84, -100, 82, -20); c.closePath(); }, '#c02a2a'); rrect(c, -86, -32, 172, 22, 8, '#a01e1e', { lw: 4 }); rrect(c, -40, -40, 80, 26, 10, '#a01e1e', { lw: 4 }); } });
export const caixa = () => (c) => { rrect(c, -70, -60, 140, 110, 4, '#c89a5a', { lw: 5 }); line(c, [[-70, -20], [70, -20]], '#a87a3a', 4); };
export const livro = () => (c) => { rrect(c, -46, -60, 92, 64, 4, '#3a7a5a', { lw: 4 }); line(c, [[0, -60], [0, 4]], '#2a5a3a', 3); };
export const capacete = () => (c) => { shape(c, c => c.arc(0, -30, 42, Math.PI, 0), '#1a1a22'); rrect(c, -42, -34, 84, 14, 4, '#1a1a22', { lw: 4 }); rrect(c, -30, -60, 60, 18, 6, '#6ab0e8', { lw: 3 }); };

// ================== "Adrenalina" — seis pessoas diferentes ==================
const CAB = {
  curto: (cor) => (c) => shape(c, c => { c.moveTo(-76, -6); c.quadraticCurveTo(-80, -92, 0, -94); c.quadraticCurveTo(80, -92, 76, -6); c.quadraticCurveTo(50, -58, 0, -56); c.quadraticCurveTo(-50, -58, -76, -6); c.closePath(); }, cor),
  longo: (cor) => (c) => shape(c, c => { c.moveTo(-82, 60); c.quadraticCurveTo(-96, -96, 0, -96); c.quadraticCurveTo(96, -96, 82, 60); c.quadraticCurveTo(68, -40, 0, -56); c.quadraticCurveTo(-68, -40, -82, 60); c.closePath(); }, cor),
  coque: (cor) => (c) => { shape(c, c => { c.moveTo(-78, 0); c.quadraticCurveTo(-88, -90, 0, -92); c.quadraticCurveTo(88, -90, 78, 0); c.quadraticCurveTo(60, -50, 0, -56); c.quadraticCurveTo(-60, -50, -78, 0); c.closePath(); }, cor); circle(c, 0, -104, 30, cor); },
  careca: () => (c) => { ellipse(c, -22, -54, 20, 9, '#ffffff', { stroke: null, alpha: 0.35 }); shape(c, c => { c.moveTo(-60, 14); c.quadraticCurveTo(-56, 74, 0, 80); c.quadraticCurveTo(56, 74, 60, 14); c.quadraticCurveTo(30, 40, 0, 42); c.quadraticCurveTo(-30, 40, -60, 14); c.closePath(); }, '#3a2a20'); },
  bone: (cor, aba) => (c) => { shape(c, c => { c.moveTo(-82, -20); c.quadraticCurveTo(-84, -100, 0, -104); c.quadraticCurveTo(84, -100, 82, -20); c.closePath(); }, cor); rrect(c, -10, -36, 120, 22, 10, aba, { lw: 4 }); },
  cacheado: (cor) => (c) => { for (let i = 0; i < 10; i++) { const a = Math.PI * (1.02 + i * 0.096); circle(c, Math.cos(a) * 76, -10 + Math.sin(a) * 76, 24, cor, { lw: 4 }); } for (const [x, y] of [[-30, -60], [0, -70], [30, -60]]) circle(c, x, y, 20, cor, { lw: 4 }); },
};
export function pessoa({ pele, roupa, perna = '#3a4a6a', sapato = '#2a2a2a', cabelo = 'curto', corCab = '#2a1a12', aba = '#1a1a1a', barra = -108, largura = 70, extra = null }) {
  const sombra = mix(roupa, '#000000', 0.28);
  return new Personagem({ pele, olhos: '#2a1a12', sobrancelha: cabelo === 'careca' ? '#3a2a20' : corCab, sobrancelhaW: 8, roupa, roupaSombra: sombra, manga: roupa, enfeite: sombra, cinto: roupa, semFaixa: true, barra, larguraBarra: largura, perna, sapato, extraTras: extra, cabeloFrente: CAB[cabelo](corCab, aba) });
}
// 1 chora: Júlia — cabelo longo castanho, blusa lilás
export const tipoChora = () => pessoa({ pele: '#f2cdb0', roupa: '#a87ad0', cabelo: 'longo', corCab: '#6a3a1a', barra: -90, largura: 76 });
// 2 perdido: Tiago — cacheado, moletom amarelo, mochila
export const tipoPerdido = () => pessoa({ pele: '#c8906a', roupa: '#e8b830', cabelo: 'cacheado', corCab: '#2a1a12', extra: (c) => { rrect(c, -60, -230, 22, 110, 8, '#3a5a8a', { lw: 4 }); rrect(c, 38, -230, 22, 110, 8, '#3a5a8a', { lw: 4 }); } });
// 3 agressivo: Marcos — careca de barba, camiseta cinza escura, braços fortes
export const tipoAgressivo = () => pessoa({ pele: '#b8805a', roupa: '#4a4a52', cabelo: 'careca', perna: '#2a2a30', largura: 80 });
// 4 paralisada: dona Célia — coque grisalho, cardigã verde-água
export const tipoParalisada = () => pessoa({ pele: '#f2d2b6', roupa: '#5ab0a0', cabelo: 'coque', corCab: '#c8c8d0', perna: '#6a5a5a', sapato: '#5a3a2a', barra: -50, largura: 84 });
// 5 impulsivo: Pedro — boné azul, camiseta laranja, bermuda
export const tipoImpulsivo = () => pessoa({ pele: '#e8b890', roupa: '#f07a2a', cabelo: 'bone', corCab: '#2a5ad0', aba: '#1a3a9a', perna: '#5a6a7a', sapato: '#f2eee6' });
// 6 calma: Ana — cabelo curto preto, jaqueta verde
export const tipoCalma = () => pessoa({ pele: '#8a5a3a', roupa: '#3a8a4a', cabelo: 'curto', corCab: '#1a1210', perna: '#2e3a5a', sapato: '#f2eee6', extra: (c) => { line(c, [[0, -236], [0, -110]], '#2a6a3a', 5); } });

// ================== "Encosto profissional" (2D) ==================
CAB.baguncado = (cor) => (c) => { shape(c, c => { c.moveTo(-80, 0); c.lineTo(-96, -44); c.lineTo(-74, -50); c.lineTo(-92, -92); c.lineTo(-44, -78); c.lineTo(-40, -124); c.lineTo(-6, -90); c.lineTo(20, -130); c.lineTo(34, -88); c.lineTo(78, -110); c.lineTo(66, -64); c.lineTo(98, -52); c.lineTo(80, 0); c.lineTo(58, -40); c.lineTo(30, -50); c.lineTo(4, -36); c.lineTo(-22, -54); c.lineTo(-50, -34); c.lineTo(-62, -40); c.closePath(); }, cor); };
// LUCAS: cabelo castanho curto, camiseta azul, calça escura, cansado (olheiras)
export const lucasE = () => pessoa({ pele: '#e2b08a', roupa: '#2a6ad0', perna: '#2a2e3a', sapato: '#3a3a3a', cabelo: 'curto', corCab: '#4a2c18', extra: (c, p) => { if (p.olheira !== false) for (const s of [-1, 1]) {} } });
// PEDRO: cabelo bagunçado, camiseta vermelha, bermuda cinza, chinelo
export const pedroE = () => pessoa({ pele: '#e8b890', roupa: '#d8302a', perna: '#e8b890', sapato: '#2a5ad0', cabelo: 'baguncado', corCab: '#2a1a10', barra: -112, extra: (c) => { rrect(c, -64, -128, 128, 46, 12, '#7a7e88', { lw: 5 }); line(c, [[0, -126], [0, -84]], '#5a5e68', 4); } });
// MÃE: coque castanho, blusa roxa, calça jeans
export const maeE = () => pessoa({ pele: '#d8a07a', roupa: '#8a5ab0', perna: '#3a4a6a', sapato: '#5a3a2a', cabelo: 'coque', corCab: '#3a2418', barra: -80, largura: 80 });
// objetos na mão
export const vassoura2 = () => (c, s, t) => { c.save(); c.rotate(0.15 * s); line(c, [[0, -40], [0, 150]], '#c8a060', 9); rrect(c, -50, 150, 100, 26, 6, '#d8302a', { lw: 4 }); for (let i = 0; i < 8; i++) line(c, [[-44 + i * 12, 176], [-46 + i * 12, 206]], '#e8c040', 5); c.restore(); };
export const pano2 = () => (c) => { rrect(c, -26, -14, 52, 30, 8, '#f0d050', { lw: 4 }); };
export const balde2 = () => (c) => { shape(c, c => { c.moveTo(-34, 0); c.lineTo(34, 0); c.lineTo(26, 62); c.lineTo(-26, 62); c.closePath(); }, '#3a8ad0', { lw: 4 }); shape(c, c => c.arc(0, 0, 32, Math.PI, 0), null, { stroke: '#9a9aa2', lw: 4 }); };
export const sacoLixo2 = () => (c) => { shape(c, c => { c.moveTo(-14, 0); c.quadraticCurveTo(-60, 20, -50, 80); c.quadraticCurveTo(0, 110, 50, 80); c.quadraticCurveTo(60, 20, 14, 0); c.closePath(); }, '#1a1a1e', { lw: 4 }); line(c, [[-8, 0], [0, -12], [8, 0]], '#3a3a42', 4); };
export const chips2 = () => (c) => { rrect(c, -24, -60, 48, 64, 6, '#f0b020', { lw: 4 }); rrect(c, -24, -60, 48, 16, 4, '#d8302a', { lw: 3 }); };

// ================== "Voltar à infância" (2D) — o mesmo personagem criança e adulto ==================
const listras = (c) => { for (let i = 0; i < 3; i++) rrect(c, -46, -200 + i * 28, 92, 10, 4, '#f6e8c8', { stroke: null }); };
export const crianca = () => { const p = pessoa({ pele: '#d8a47c', roupa: '#f08a2a', perna: '#d8a47c', sapato: '#f2eee6', cabelo: 'curto', corCab: '#3a2214', barra: -112, extra: (c) => { listras(c); rrect(c, -62, -126, 124, 44, 12, '#2a5ab0', { lw: 5 }); } }); p.s = 0.78; return p; };
export const adulto = () => { const p = pessoa({ pele: '#d8a47c', roupa: '#5a6070', perna: '#2a2e3a', sapato: '#3a3a3a', cabelo: 'curto', corCab: '#3a2214' }); const cab = p.d.cabeloFrente; p.d.cabeloFrente = (c, q, t) => { cab(c, q, t); shape(c, c => { c.moveTo(-58, 20); c.quadraticCurveTo(-52, 70, 0, 76); c.quadraticCurveTo(52, 70, 58, 20); c.quadraticCurveTo(30, 44, 0, 46); c.quadraticCurveTo(-30, 44, -58, 20); c.closePath(); }, 'rgba(74,48,32,0.55)', { stroke: null }); }; return p; };
export const amigoI = (i) => { const v = [['#2aa060', '#c8906a', '#1a1210', 'curto'], ['#e8c040', '#8a5a3a', '#1a1210', 'cacheado'], ['#3a6ad0', '#f2cdb0', '#8a5a2a', 'baguncado'], ['#d84a6a', '#e8b890', '#2a1a10', 'bone']][i % 4]; const p = pessoa({ pele: v[1], roupa: v[0], perna: v[1], sapato: '#f2eee6', cabelo: v[3], corCab: v[2], aba: '#1a1a1a', barra: -112, extra: (c) => rrect(c, -62, -126, 124, 44, 12, ['#3a3a44', '#5a4a3a', '#2a2a30', '#3a4a6a'][i % 4], { lw: 5 }) }); p.s = 0.74 + (i % 2) * 0.04; return p; };
export const bola2 = () => (c) => { circle(c, 0, -26, 26, '#f6f2ea', { lw: 4 }); for (let k = 0; k < 5; k++) { const a = k / 5 * Math.PI * 2; circle(c, Math.cos(a) * 14, -26 + Math.sin(a) * 14, 5, '#1a1a1e', { stroke: null }); } };
export const controle2 = () => (c) => { rrect(c, -38, -16, 76, 30, 14, '#5a5a62', { lw: 4 }); circle(c, -16, -2, 6, '#2a2a2a', { stroke: null }); circle(c, 16, -6, 5, '#e8302a', { stroke: null }); circle(c, 24, 2, 5, '#3a6ad0', { stroke: null }); };
