// Personagens originais. Protagonista ("você"): cabelo preto penteado para trás, cavanhaque e corrente de ouro.
// Fase "chegada": camisa florida; fase "rei": terno branco com camisa verde-água.
import { TAU, lerp } from '../motor/base.js';
import { OUT, shape, circle, ellipse, poly, line, rrect, glow } from '../motor/desenho.js';
import { Personagem } from '../motor/personagem.js';

const CABELO = '#1a1418', PELE = '#f0c49c';

function cabeloVoce(c, p) {
  shape(c, c => { c.moveTo(-78, 4); c.quadraticCurveTo(-92, -92, 0, -94); c.quadraticCurveTo(92, -92, 78, 4); c.quadraticCurveTo(74, -44, 40, -56); c.quadraticCurveTo(0, -40, -40, -56); c.quadraticCurveTo(-74, -44, -78, 4); c.closePath(); }, CABELO);
  for (let i = 0; i < 3; i++) line(c, [[-40 + i * 30, -84], [-10 + i * 30, -58]], '#3a3038', 4, 0.8);
  // cavanhaque
  shape(c, c => { c.moveTo(-16, 52); c.quadraticCurveTo(0, 74, 16, 52); c.quadraticCurveTo(0, 60, -16, 52); }, CABELO, { lw: 4 });
  line(c, [[-14, 18], [14, 18]], CABELO, 5);
  if (p.oculos) { for (const s of [-1, 1]) rrect(c, s * 27 - 24, -18, 48, 30, 10, '#1a1a1a', { lw: 4 }); line(c, [[-4, -6], [4, -6]], '#1a1a1a', 5); }
}
const corrente = (c) => { shape(c, c => { c.moveTo(-34, -236); c.quadraticCurveTo(0, -180, 34, -236); }, null, { stroke: '#f2c230', lw: 6 }); circle(c, 0, -198, 10, '#f2c230', { lw: 3 }); };

export function voce(fase = 'chegada') {
  if (fase === 'chegada') return new Personagem({
    pele: PELE, olhos: '#3a2a1a', sobrancelha: CABELO, sobrancelhaW: 8, roupa: '#e85a4a', roupaSombra: '#c03a2a', manga: '#e85a4a', enfeite: '#f2e6c8', cinto: '#4a3a2a', semFaixa: true, barra: -116, larguraBarra: 64, perna: '#c8b898', sapato: '#5a3a22',
    extraTras: (c, p) => { c.save(); for (const [x, y] of [[-26, -200], [20, -170], [-10, -140], [30, -220]]) { for (let k = 0; k < 5; k++) { const a = k / 5 * TAU; ellipse(c, x + Math.cos(a) * 9, y + Math.sin(a) * 9, 7, 4, '#ffd23a', { stroke: null }, a); } circle(c, x, y, 4, '#ffffff', { stroke: null }); } c.restore(); if (p.avental) { shape(c, cc => cc.roundRect(-46, -200, 92, 160, 10), '#f6f2ea', { lw: 5 }); } corrente(c); },
    cabeloFrente: cabeloVoce,
  });
  return new Personagem({
    pele: PELE, olhos: '#3a2a1a', sobrancelha: CABELO, sobrancelhaW: 8, roupa: '#f6f2ea', roupaSombra: '#d8d0c0', manga: '#f6f2ea', enfeite: '#d8d0c0', cinto: '#d8d0c0', semFaixa: true, barra: -96, larguraBarra: 72, perna: '#f6f2ea', sapato: '#2a2a2a',
    extraTras: (c, p) => {
      poly(c, [[-30, -234], [30, -234], [0, -150]], '#2ab0a8', { lw: 4 });
      for (const s of [-1, 1]) poly(c, [[s * 30, -234], [s * 46, -232], [s * 10, -140], [s * 2, -160]], '#e8e0d0', { lw: 4 });
      corrente(c);
      if (p.desarrumado) { line(c, [[-20, -200], [10, -170]], '#c8b8a8', 4); }
    },
    cabeloFrente: cabeloVoce,
  });
}
// gente da cidade e do submundo
export function pessoa(tipo = 0) {
  const T = [
    { pele: '#f2c9a4', roupa: '#2ab0d8', sombra: '#1a8ab0', perna: '#f6f2ea', cabelo: '#d8a040', estilo: 'longo', barra: -60 },       // patinadora
    { pele: '#d8a07a', roupa: '#f2f2f2', sombra: '#d0d0d0', perna: '#3a6ad0', cabelo: '#2a1a1a', estilo: 'curto', barra: -116 },      // turista
    { pele: '#f6d6bc', roupa: '#ff6aa8', sombra: '#d84a88', perna: '#3a3a4a', cabelo: '#8a4a20', estilo: 'volume', barra: -60 },
    { pele: '#e8b890', roupa: '#3a3a3a', sombra: '#222222', perna: '#2a2a2a', cabelo: '#1a1a1a', estilo: 'curto', barra: -60, oculos: true, gravata: '#1a1a1a' }, // segurança
  ][tipo % 4];
  return new Personagem({
    pele: T.pele, olhos: '#2a2a2a', roupa: T.roupa, roupaSombra: T.sombra, enfeite: T.sombra, cinto: T.sombra, semFaixa: true, barra: T.barra, larguraBarra: T.barra > -100 ? 82 : 62, perna: T.perna, sapato: '#2a2a2a',
    extraTras: (c) => { if (T.gravata) poly(c, [[-8, -232], [8, -232], [12, -170], [0, -156], [-12, -170]], T.gravata, { lw: 4 }); },
    cabeloTras: (c) => { if (T.estilo === 'longo' || T.estilo === 'volume') shape(c, c => { c.moveTo(-86, -330); c.quadraticCurveTo(-110, -220, -76, -180); c.lineTo(76, -180); c.quadraticCurveTo(110, -220, 86, -330); c.closePath(); }, T.cabelo); },
    cabeloFrente: (c) => {
      shape(c, c => { c.moveTo(-76, 0); c.quadraticCurveTo(-90, -92, 0, -94); c.quadraticCurveTo(90, -92, 76, 0); c.quadraticCurveTo(60, -50, 0, -54); c.quadraticCurveTo(-60, -50, -76, 0); c.closePath(); }, T.cabelo);
      if (T.oculos) { for (const s of [-1, 1]) rrect(c, s * 27 - 24, -18, 48, 28, 10, '#111111', { lw: 4 }); line(c, [[-4, -6], [4, -6]], '#111111', 5); }
    },
  });
}
// o homem do carro (contato do submundo): chapéu, óculos, terno roxo
export function contato() {
  return new Personagem({
    pele: '#e8c0a0', olhos: '#2a2a2a', sobrancelha: '#1a1a1a', roupa: '#5a2a7a', roupaSombra: '#3a1a5a', enfeite: '#3a1a5a', cinto: '#2a1a3a', semFaixa: true, barra: -80, larguraBarra: 78, perna: '#3a1a5a', sapato: '#1a1a1a',
    cabeloFrente: (c) => { ellipse(c, 0, -62, 110, 18, '#2a2a2a'); shape(c, c => { c.moveTo(-60, -66); c.quadraticCurveTo(-58, -132, 0, -134); c.quadraticCurveTo(58, -132, 60, -66); c.closePath(); }, '#2a2a2a'); rrect(c, -60, -84, 120, 14, 4, '#c8a040', { lw: 3 }); for (const s of [-1, 1]) rrect(c, s * 27 - 24, -18, 48, 28, 10, '#111111', { lw: 4 }); line(c, [[-14, 22], [14, 22]], '#3a2a2a', 5); },
  });
}
// homens poderosos da reunião
export function chefao(tipo = 0) {
  const cor = ['#2a3a5a', '#5a2a2a'][tipo % 2];
  return new Personagem({
    pele: tipo ? '#d8a07a' : '#f6d6bc', olhos: '#2a2a2a', sobrancelha: '#c8c8c8', sobrancelhaW: 9, roupa: cor, roupaSombra: '#1a1a2a', enfeite: '#1a1a2a', cinto: '#1a1a2a', semFaixa: true, barra: -80, larguraBarra: 80, perna: cor, sapato: '#1a1a1a',
    extraTras: (c) => { poly(c, [[-8, -232], [8, -232], [12, -170], [0, -156], [-12, -170]], '#c0302a', { lw: 4 }); },
    cabeloFrente: (c) => { for (const s of [-1, 1]) shape(c, c => { c.moveTo(s * 56, -50); c.quadraticCurveTo(s * 86, -30, s * 76, 10); c.lineTo(s * 64, -12); c.closePath(); }, '#c8c8c8'); line(c, [[-20, 22], [20, 22]], '#8a8a8a', 6); },
  });
}
// policial
export function policial(tipo = 0) {
  return new Personagem({
    pele: tipo ? '#d8a07a' : '#f2c9a4', olhos: '#2a2a2a', sobrancelha: '#2a2a2a', roupa: '#1a2a5a', roupaSombra: '#0e1a3a', enfeite: '#f2c230', cinto: '#1a1a1a', semFaixa: true, barra: -80, larguraBarra: 80, perna: '#1a2a5a', sapato: '#1a1a1a', broche: '#f2c230',
    cabeloFrente: (c) => { shape(c, c => { c.moveTo(-82, -20); c.quadraticCurveTo(-80, -100, 0, -102); c.quadraticCurveTo(80, -100, 82, -20); c.closePath(); }, '#1a2a5a'); rrect(c, -92, -28, 184, 18, 8, '#0e1a3a', { lw: 4 }); circle(c, 0, -62, 14, '#f2c230', { lw: 3 }); },
  });
}
// ---------- objetos de mão ----------
export const mala = () => (c) => { rrect(c, -50, 10, 100, 74, 10, '#8a5a30', { lw: 5 }); rrect(c, -16, -4, 32, 18, 6, null, { stroke: OUT, lw: 5 }); line(c, [[-50, 40], [50, 40]], '#5a3a1a', 4); };
export const prato = (k = 0) => (c) => { ellipse(c, -40, -10, 46, 14, '#f6f6f6', { lw: 4 }); for (let i = 0; i < 3; i++) circle(c, -40 + Math.sin(k * 6 + i) * 30, -30 - i * 10, 8, '#bfe6f6', { lw: 2 }); };
export const envelope = () => (c) => { rrect(c, -40, -30, 80, 52, 4, '#e8d8b0', { lw: 4 }); poly(c, [[-40, -30], [0, 0], [40, -30]], null, { lw: 3 }); };
export const telefone = () => (c) => { rrect(c, -14, -60, 28, 90, 10, '#2a2a2a', { lw: 4 }); };
export const maos = (n = 0) => (c) => {};
