// Os quatro magos da série. A aparência de cada um fica definida só aqui (igual em todas as cenas).
import { TAU, lerp } from '../motor/base.js';
import { OUT, shape, circle, ellipse, poly, line, glow, star5 } from '../motor/desenho.js';
import { Personagem } from '../motor/personagem.js';

// KAEL — jovem mago (~22 anos), cabelo prateado, olhos azuis, roupas azuis com detalhes prateados.
export const kael = () => new Personagem({
  pele: '#fff7f0', olhos: '#2f7bff', sobrancelha: '#9aa6b8',
  roupa: '#2f6fd6', roupaSombra: '#1c4aa0', manga: '#2f6fd6', enfeite: '#e8eef8', broche: '#9fe0ff', capa: '#1f4fa8',
  perna: '#26324f', sapato: '#3a4460',
  cabeloTras: (c) => shape(c, c => { c.moveTo(-70, -300); c.quadraticCurveTo(-86, -250, -64, -228); c.lineTo(64, -228); c.quadraticCurveTo(86, -250, 70, -300); c.closePath(); }, '#d9e1ee'),
  cabeloFrente: (c) => {
    // topete prateado com mechas pontudas
    shape(c, c => {
      c.moveTo(-76, 4); c.quadraticCurveTo(-90, -70, -30, -82); c.quadraticCurveTo(10, -102, 52, -80);
      c.quadraticCurveTo(92, -60, 78, 4); c.lineTo(66, -22); c.lineTo(58, -8); c.lineTo(40, -40);
      c.lineTo(22, -22); c.lineTo(6, -46); c.lineTo(-14, -24); c.lineTo(-28, -44); c.lineTo(-50, -20); c.lineTo(-62, -30); c.closePath();
    }, '#e6ecf5');
    line(c, [[-20, -70], [10, -60]], '#ffffff', 5, 0.8);
    line(c, [[30, -72], [52, -58]], '#b9c4d6', 4, 0.8);
  },
});

// MORVATH — mago das sombras: capuz e vestes negras, olhos vermelhos brilhantes.
export const morvath = () => new Personagem({
  pele: '#d8d2dc', olhos: '#ff2a2a', sobrancelha: '#1a1420', sobrancelhaW: 8,
  roupa: '#231c2b', roupaSombra: '#110c16', enfeite: '#c0182c', cinto: '#3a1a24', broche: '#ff2a3a', capa: '#140f1a',
  perna: '#1a1420', sapato: '#100c14',
  atrasCabeca: (c) => shape(c, c => { c.moveTo(-96, 40); c.quadraticCurveTo(-110, -70, -20, -112); c.lineTo(0, -138); c.lineTo(20, -112); c.quadraticCurveTo(110, -70, 96, 40); c.quadraticCurveTo(0, 70, -96, 40); c.closePath(); }, '#1d1724'),
  cabeloFrente: (c) => {
    // borda do capuz em volta do rosto (com sombra sobre a testa)
    shape(c, c => { c.moveTo(-96, 40); c.quadraticCurveTo(-110, -70, -20, -112); c.lineTo(0, -138); c.lineTo(20, -112); c.quadraticCurveTo(110, -70, 96, 40); c.lineTo(78, 40); c.quadraticCurveTo(84, -60, 0, -72); c.quadraticCurveTo(-84, -60, -78, 40); c.closePath(); }, '#1d1724');
    c.save(); c.globalAlpha *= 0.35; c.fillStyle = '#000'; c.beginPath(); c.ellipse(0, -48, 70, 26, 0, 0, TAU); c.fill(); c.restore();
    line(c, [[-78, 38], [-70, -40], [0, -70], [70, -40], [78, 38]], '#c0182c', 4, 0.9);
  },
});

// ELDRIN — mago ancião: barba branca, roupas douradas, cajado luminoso.
export const eldrin = () => new Personagem({
  pele: '#ffefe2', olhos: '#5a7a96', sobrancelha: '#ffffff', sobrancelhaW: 11, blush: 0.35,
  roupa: '#e3a92e', roupaSombra: '#b07a14', enfeite: '#fff3cf', cinto: '#9a6a12', broche: '#ffffff', capa: '#a8761a',
  perna: '#6a4a1a', sapato: '#4a3010',
  cabeloTras: (c) => shape(c, c => { c.moveTo(-80, -300); c.quadraticCurveTo(-96, -230, -60, -214); c.lineTo(60, -214); c.quadraticCurveTo(96, -230, 80, -300); c.closePath(); }, '#f4f2ee'),
  cabeloFrente: (c, p) => {
    // tufos laterais, careca no topo com diadema
    for (const s of [-1, 1]) shape(c, c => { c.moveTo(s * 50, -54); c.quadraticCurveTo(s * 96, -40, s * 82, 10); c.quadraticCurveTo(s * 70, -10, s * 60, -8); c.closePath(); }, '#f4f2ee');
    shape(c, c => { c.moveTo(-58, -46); c.quadraticCurveTo(0, -66, 58, -46); }, null, { stroke: '#e3b23c', lw: 9 });
    circle(c, 0, -58, 9, '#9fe4ff', { lw: 4 });
    // barba volumosa (a boca é redesenhada por cima)
    shape(c, c => { c.moveTo(-62, 14); c.quadraticCurveTo(-74, 90, -30, 128); c.quadraticCurveTo(-10, 112, 0, 150); c.quadraticCurveTo(10, 112, 30, 128); c.quadraticCurveTo(74, 90, 62, 14); c.quadraticCurveTo(0, 50, -62, 14); c.closePath(); }, '#f6f4f0');
    line(c, [[-20, 70], [-14, 110]], '#d6d2ca', 4); line(c, [[18, 74], [14, 108]], '#d6d2ca', 4);
    // bigode
    for (const s of [-1, 1]) shape(c, c => { c.moveTo(0, 20); c.quadraticCurveTo(s * 30, 8, s * 44, 32); c.quadraticCurveTo(s * 24, 28, 0, 30); c.closePath(); }, '#ffffff', { lw: 4 });
    const m = p.boca;
    if (m === 'aberta' || m === 'grito' || m === 'o') ellipse(c, 0, 44, m === 'o' ? 7 : 12, m === 'o' ? 8 : 11, '#8a2028', { lw: 4 });
  },
});

// ZARETH — feiticeiro misterioso: cabelo escuro, roupas roxas, tatuagem rúnica sob o olho.
export const zareth = () => new Personagem({
  pele: '#f2c9a4', olhos: '#9a4cff', sobrancelha: '#1c1424',
  roupa: '#7a3fc4', roupaSombra: '#552a94', enfeite: '#d9c4ff', cinto: '#3a1a6a', broche: '#e070ff', capa: '#3c1c6e',
  perna: '#2a1a3a', sapato: '#1c1228',
  cabeloTras: (c, p, t) => {
    shape(c, c => { c.moveTo(-74, -310); c.quadraticCurveTo(-92, -230, -70, -190); c.lineTo(70, -190); c.quadraticCurveTo(92, -230, 74, -310); c.closePath(); }, '#1f1828');
    // rabo de cavalo
    const sw = Math.sin(t * 3) * 6;
    shape(c, c => { c.moveTo(40, -300); c.quadraticCurveTo(120 + sw, -260, 100 + sw, -150); c.quadraticCurveTo(80, -220, 50, -260); c.closePath(); }, '#1f1828');
  },
  cabeloFrente: (c) => {
    shape(c, c => { c.moveTo(-76, 0); c.quadraticCurveTo(-86, -76, -10, -84); c.quadraticCurveTo(70, -90, 78, -10); c.quadraticCurveTo(50, -50, 20, -46); c.quadraticCurveTo(-20, -40, -40, 10); c.quadraticCurveTo(-56, -10, -76, 0); c.closePath(); }, '#2a2034');
    line(c, [[0, -70], [30, -64]], '#4a3a5a', 4);
    // tatuagem rúnica
    c.save(); c.translate(34, 22); line(c, [[0, -8], [0, 8]], '#b066ff', 4); line(c, [[-6, 0], [6, 0]], '#b066ff', 3); c.restore();
    glow(c, 34, 22, 18, '#b066ff', 0.6);
  },
});

// Cajado de Eldrin (desenhado preso à mão)
export const cajado = (brilho = 1) => (c, side, t) => {
  c.save(); c.rotate(side * -0.05);
  shape(c, c => { c.moveTo(-6, 130); c.quadraticCurveTo(4, 40, -4, -120); c.lineTo(8, -120); c.quadraticCurveTo(14, 40, 6, 130); c.closePath(); }, '#7a4a22');
  for (const a of [-0.6, 0, 0.6]) line(c, [[2, -118], [2 + Math.sin(a) * 26, -150], [2 + Math.sin(a) * 14, -168]], '#7a4a22', 7);
  const f = 1 + 0.08 * Math.sin(t * 9);
  glow(c, 2, -150, 70 * brilho * f, '#ffd060', 0.9);
  circle(c, 2, -150, 15, '#fff4c8', { lw: 4 });
  c.restore();
};
// Pergaminho segurado com as duas mãos (desenhado na mão direita)
export const pergaminho = (brilho = 0) => (c) => {
  c.save(); c.translate(-46, -10);
  shape(c, c => c.roundRect(-50, -40, 100, 70, 6), '#f1deb0');
  for (let i = 0; i < 4; i++) line(c, [[-34, -24 + i * 14], [30 - (i % 2) * 18, -24 + i * 14]], brilho > 0.3 ? '#4fa8ff' : '#a08050', 4);
  for (const y of [-40, 30]) shape(c, c => c.roundRect(-58, y - 7, 116, 14, 7), '#c9a46a');
  glow(c, 0, -6, 120 * brilho, '#58b4ff', brilho);
  c.restore();
};
