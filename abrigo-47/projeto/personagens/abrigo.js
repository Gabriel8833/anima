// Personagens originais do ABRIGO 47 (futuro retrô dos anos 50).
// Protagonista ("você"): cabelo ruivo com topete e óculos redondos, sempre. Criança com camisa listrada;
// adulto com o macacão verde-água e laranja do Abrigo 47 e o PulsoTec no pulso.
import { TAU, lerp, clamp } from '../motor/base.js';
import { OUT, shape, circle, ellipse, poly, line, rrect, glow, star5 } from '../motor/desenho.js';
import { Personagem } from '../motor/personagem.js';

const RUIVO = '#d8662a', PELE = '#ffe4cc';
const AMBAR = '#ffb43a';

function cabeloVoce(c, p) {
  shape(c, c => { c.moveTo(-76, 6); c.quadraticCurveTo(-90, -80, -10, -90); c.quadraticCurveTo(80, -96, 80, -10); c.lineTo(64, -30); c.quadraticCurveTo(30, -52, -10, -46); c.quadraticCurveTo(-50, -40, -66, -14); c.closePath(); }, RUIVO);
  shape(c, c => { c.moveTo(-30, -84); c.quadraticCurveTo(-20, -134, 40, -120); c.quadraticCurveTo(10, -110, 20, -86); c.closePath(); }, RUIVO, { lw: 5 });
  // óculos redondos
  for (const s of [-1, 1]) circle(c, s * 27 + p.olhar[0] * 6, -4 + p.olhar[1] * 4, 24, null, { stroke: '#3a2a1a', lw: 5 });
  line(c, [[-4 + p.olhar[0] * 6, -6], [4 + p.olhar[0] * 6, -6]], '#3a2a1a', 5);
  if (p.sujo) { c.save(); c.globalAlpha *= 0.3; c.fillStyle = '#6a4a2a'; c.beginPath(); c.arc(-44, 26, 9, 0, TAU); c.arc(48, 8, 7, 0, TAU); c.fill(); c.restore(); }
}
export function voce(fase = 'adulto') {
  if (fase === 'crianca') return new Personagem({
    pele: PELE, olhos: '#3a6a4a', sobrancelha: '#a04a1a', roupa: '#e8e0d0', roupaSombra: '#c8bca8', manga: '#e8e0d0', enfeite: '#d04a3a', cinto: '#4a3a2a', semFaixa: true, barra: -116, larguraBarra: 62, perna: '#4a6a9a', sapato: '#5a3a22',
    extraTras: (c) => { for (let i = 0; i < 4; i++) line(c, [[-44, -220 + i * 26], [44, -220 + i * 26]], '#d04a3a', 7); },
    cabeloFrente: (c, p) => cabeloVoce(c, p),
  });
  return new Personagem({
    pele: PELE, olhos: '#3a6a4a', sobrancelha: '#a04a1a', roupa: '#2a9a9a', roupaSombra: '#1a7a7a', manga: '#2a9a9a', enfeite: '#ff8a2a', cinto: '#ff8a2a', semFaixa: false, barra: -40, larguraBarra: 76, perna: '#2a9a9a', sapato: '#3a3a3a',
    extraTras: (c, p) => {
      rrect(c, 8, -214, 40, 34, 6, '#ff8a2a', { lw: 4 }); c.save(); c.font = '900 22px Inter, sans-serif'; c.textAlign = 'center'; c.fillStyle = '#ffffff'; c.fillText('47', 28, -190); c.restore();
      if (p.mochila) { line(c, [[-40, -232], [-30, -150]], '#5a3e24', 10); line(c, [[40, -232], [30, -150]], '#5a3e24', 10); }
      if (p.sujo) { c.save(); c.globalAlpha *= 0.3; c.fillStyle = '#6a4a2a'; for (const [x, y, r] of [[-30, -100, 12], [30, -60, 10], [-20, -180, 8]]) { c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); } c.restore(); }
    },
    cabeloTras: (c, p) => { if (p.mochila) { rrect(c, -76, -250, 152, 160, 26, '#7a5a3a'); rrect(c, -58, -130, 116, 40, 10, '#5a3e24', { lw: 4 }); } },
    cabeloFrente: (c, p) => cabeloVoce(c, p),
  });
}
// pais (anos 50)
export const paiRetro = () => new Personagem({
  pele: '#f6d6bc', olhos: '#2a2a2a', sobrancelha: '#4a3020', roupa: '#8a7a5a', roupaSombra: '#6a5a3a', enfeite: '#5a4a30', cinto: '#3a2a1a', semFaixa: true, barra: -100, larguraBarra: 70, perna: '#5a5040', sapato: '#2a2018',
  extraTras: (c) => poly(c, [[-8, -232], [8, -232], [12, -170], [0, -156], [-12, -170]], '#c0302a', { lw: 4 }),
  cabeloFrente: (c) => { ellipse(c, 0, -62, 110, 18, '#5a4a3a'); shape(c, c => { c.moveTo(-60, -66); c.quadraticCurveTo(-58, -132, 0, -134); c.quadraticCurveTo(58, -132, 60, -66); c.closePath(); }, '#5a4a3a'); rrect(c, -60, -84, 120, 16, 4, '#2a2018', { lw: 4 }); },
});
export const maeRetro = () => new Personagem({
  pele: '#ffe0cc', olhos: '#2a4a6a', sobrancelha: '#8a3a1a', roupa: '#e04a5a', roupaSombra: '#b8303e', enfeite: '#ffffff', cinto: '#ffffff', semFaixa: true, larguraBarra: 96,
  extraTras: (c) => { c.save(); c.fillStyle = '#ffffff'; for (const [x, y] of [[-30, -120], [20, -90], [-10, -60], [40, -140], [-50, -80], [10, -180]]) { c.beginPath(); c.arc(x, y, 7, 0, TAU); c.fill(); } c.restore(); },
  cabeloFrente: (c) => { shape(c, c => { c.moveTo(-82, 20); c.quadraticCurveTo(-96, -90, 0, -94); c.quadraticCurveTo(96, -90, 82, 20); c.quadraticCurveTo(60, -50, 0, -56); c.quadraticCurveTo(-60, -50, -82, 20); c.closePath(); }, '#a04a1a'); for (const s of [-1, 1]) circle(c, s * 80, 20, 20, '#a04a1a'); },
});
// supervisora do abrigo
export const supervisora = () => new Personagem({
  pele: '#f2d0b4', olhos: '#2a2a2a', sobrancelha: '#7a7a7a', sobrancelhaW: 8, roupa: '#1a6a6a', roupaSombra: '#0e4a4a', manga: '#1a6a6a', enfeite: '#ffc040', cinto: '#ffc040', barra: -40, larguraBarra: 76, perna: '#1a6a6a', sapato: '#2a2a2a', broche: '#ffc040',
  cabeloFrente: (c) => { shape(c, c => { c.moveTo(-76, 0); c.quadraticCurveTo(-88, -88, 0, -90); c.quadraticCurveTo(88, -88, 76, 0); c.quadraticCurveTo(60, -50, 0, -54); c.quadraticCurveTo(-60, -50, -76, 0); c.closePath(); }, '#b8b8b8'); circle(c, 0, -100, 30, '#b8b8b8'); },
});

// ---------- robôs ----------
// Atomito: mascote robô redondo com antena de átomo e rosto em tela
export function atomito(c, x, y, s, t, { acena = 1, feliz = 1 } = {}) {
  c.save(); c.translate(x, y); c.scale(s, s);
  c.save(); c.globalAlpha *= 0.22; c.fillStyle = '#000'; c.beginPath(); c.ellipse(0, 4, 90, 16, 0, 0, TAU); c.fill(); c.restore();
  ellipse(c, 0, -30, 60, 34, '#5a5a6a');
  rrect(c, -70, -200, 140, 150, 40, '#e8dcc4');
  rrect(c, -40, -150, 80, 60, 14, '#ff8a2a', { lw: 4 });
  const ac = Math.sin(t * 8) * 0.5 * acena;
  line(c, [[-70, -150], [-120, -110]], OUT, 14); line(c, [[-70, -150], [-120, -110]], '#9a9aa8', 8);
  line(c, [[70, -150], [110 + Math.cos(-1.2 + ac) * 50, -150 + Math.sin(-1.2 + ac) * 50 - 30]], OUT, 14); line(c, [[70, -150], [110 + Math.cos(-1.2 + ac) * 50, -150 + Math.sin(-1.2 + ac) * 50 - 30]], '#9a9aa8', 8);
  circle(c, 0, -280, 80, '#e8dcc4'); rrect(c, -54, -320, 108, 76, 18, '#2a3a3a', { lw: 4 });
  for (const sd of [-1, 1]) { if (feliz) shape(c, cc => { cc.moveTo(sd * 22 - 10, -284); cc.quadraticCurveTo(sd * 22, -300, sd * 22 + 10, -284); }, null, { stroke: AMBAR, lw: 6 }); else circle(c, sd * 22, -290, 8, AMBAR, { stroke: null }); }
  shape(c, cc => { cc.moveTo(-18, -268); cc.quadraticCurveTo(0, -254, 18, -268); }, null, { stroke: AMBAR, lw: 5 });
  line(c, [[0, -360], [0, -400]], OUT, 6);
  circle(c, 0, -414, 12, '#ff4a3a', { lw: 4 });
  for (let k = 0; k < 3; k++) { c.save(); c.translate(0, -414); c.rotate(k * Math.PI / 3 + t); c.strokeStyle = '#2a9a9a'; c.lineWidth = 4; c.beginPath(); c.ellipse(0, 0, 34, 12, 0, 0, TAU); c.stroke(); c.restore(); }
  c.restore();
}
// xerife robô da cidade de sucata
export function xerifeRobo(c, x, y, s, t, { aponta = 0 } = {}) {
  c.save(); c.translate(x, y); c.scale(s, s);
  c.save(); c.globalAlpha *= 0.22; c.fillStyle = '#000'; c.beginPath(); c.ellipse(0, 4, 90, 16, 0, 0, TAU); c.fill(); c.restore();
  for (const sd of [-1, 1]) { rrect(c, sd * 30 - 16, -150, 32, 150, 8, '#7a6a5a'); rrect(c, sd * 30 - 26, -20, 52, 24, 6, '#4a3a30'); }
  rrect(c, -80, -330, 160, 190, 20, '#b88a4a');
  star5(c, -30, -270, 26, '#ffd23a', { lw: 4 });
  line(c, [[-80, -300], [-120, -190]], OUT, 16); line(c, [[-80, -300], [-120, -190]], '#7a6a5a', 10);
  const a = lerp(0.3, 1.5, aponta); line(c, [[80, -300], [80 + Math.sin(a) * 110, -300 + Math.cos(a) * 110]], OUT, 16); line(c, [[80, -300], [80 + Math.sin(a) * 110, -300 + Math.cos(a) * 110]], '#7a6a5a', 10);
  rrect(c, -50, -430, 100, 90, 16, '#9a9aa8'); rrect(c, -36, -406, 72, 24, 8, '#2a2a2a', { lw: 4 }); glow(c, 0, -394, 50, AMBAR, 0.7); rrect(c, -30, -400, 60, 12, 6, AMBAR, { stroke: null });
  ellipse(c, 0, -432, 110, 16, '#6a4a2a'); shape(c, cc => { cc.moveTo(-56, -434); cc.quadraticCurveTo(-50, -500, 0, -502); cc.quadraticCurveTo(50, -500, 56, -434); cc.closePath(); }, '#6a4a2a');
  c.restore();
}
// robô professor (aula no abrigo)
export function roboProfessor(c, x, y, s, t) {
  c.save(); c.translate(x, y + Math.sin(t * 3) * 6); c.scale(s, s);
  glow(c, 0, -20, 80, '#5af0ff', 0.4); ellipse(c, 0, -10, 40, 14, '#5af0ff', { stroke: null });
  ellipse(c, 0, -160, 90, 110, '#c8ccd4'); rrect(c, -56, -210, 112, 60, 16, '#2a3a3a', { lw: 4 });
  for (const sd of [-1, 1]) circle(c, sd * 24, -180, 9, AMBAR, { stroke: null });
  line(c, [[-88, -150], [-150, -200]], '#7a7a88', 10); line(c, [[88, -150], [140, -120]], '#7a7a88', 10); line(c, [[140, -120], [180, -250]], '#5a3a22', 6);
  c.restore();
}
// saqueador: moicano, ombreira de pneu, rosto pintado
export function saqueador(tipo = 0) {
  return new Personagem({
    pele: tipo ? '#c89070' : '#e8b890', olhos: '#2a2a2a', sobrancelha: '#1a1a1a', sobrancelhaW: 9, roupa: '#5a3a2a', roupaSombra: '#3a2418', enfeite: '#8a8a8a', cinto: '#2a1a10', semFaixa: true, barra: -96, larguraBarra: 74, perna: '#3a3a3a', sapato: '#1a1a1a',
    extraTras: (c) => { ellipse(c, -40, -222, 30, 18, '#2a2a2a', { lw: 5 }); ellipse(c, -40, -222, 14, 8, '#5a5a5a', { lw: 3 }); for (let i = 0; i < 3; i++) poly(c, [[30 + i * 10, -236], [36 + i * 10, -262], [42 + i * 10, -236]], '#9a9aa8', { lw: 3 }); },
    cabeloFrente: (c) => { for (let i = 0; i < 6; i++) poly(c, [[-14, -60 - i * 4], [0, -130 - Math.sin(i) * 10], [14, -60 - i * 4]], tipo ? '#3ad06a' : '#e03a2a', { lw: 4 }); line(c, [[-40, 10], [-20, 30]], '#d02a2a', 6); line(c, [[20, 30], [40, 10]], '#d02a2a', 6); },
  });
}
// criatura mutante: escorpião-caranguejo gigante
export function mutante(c, x, y, s, t, { ataque = 0, dano = 0, morto = 0 } = {}) {
  c.save(); c.translate(x, y + morto * 40); c.scale(s, s * (1 - morto * 0.4)); c.rotate(morto * 0.2);
  const cor = dano > 0 ? '#ffffff' : '#9a6a3a', esc = '#6a4422';
  glow(c, 0, -120, 260, '#9aff5a', 0.25 * (1 - morto));
  for (let i = 0; i < 4; i++) for (const sd of [-1, 1]) { const ph = t * 10 + i + (sd > 0 ? Math.PI : 0), w = Math.sin(ph) * 14 * (1 - morto); line(c, [[sd * (40 + i * 30), -90], [sd * (110 + i * 34), -150 + w], [sd * (140 + i * 34), -10]], OUT, 16); line(c, [[sd * (40 + i * 30), -90], [sd * (110 + i * 34), -150 + w], [sd * (140 + i * 34), -10]], esc, 9); }
  // cauda com ferrão
  const ca = Math.sin(t * 3) * 0.2 + ataque * 0.9;
  c.save(); c.translate(-120, -130); c.rotate(-0.5 - ca);
  for (let i = 0; i < 4; i++) ellipse(c, -40 - i * 34, -i * 40, 34 - i * 3, 26 - i * 2, cor);
  poly(c, [[-170, -170], [-150, -230], [-130, -168]], '#e8e0a0', { lw: 4 }); glow(c, -150, -200, 50, '#9aff5a', 0.6);
  c.restore();
  ellipse(c, 0, -120, 140, 74, cor);
  for (let i = 0; i < 3; i++) line(c, [[-90 + i * 50, -170], [-80 + i * 50, -80]], esc, 5, 0.6);
  // garras
  for (const sd of [-1, 1]) { const g = Math.sin(t * 6 + sd) * 0.3 + ataque * 0.6; c.save(); c.translate(sd * 120, -140); c.rotate(sd * (-0.4 - g)); line(c, [[0, 0], [sd * 70, -60]], OUT, 22); line(c, [[0, 0], [sd * 70, -60]], cor, 14); c.translate(sd * 80, -70); ellipse(c, 0, 0, 44, 30, cor); poly(c, [[sd * 30, -10], [sd * 76, -30 - g * 30], [sd * 40, 10]], cor, { lw: 4 }); c.restore(); }
  // olhos em hastes
  for (const sd of [-1, 1]) { line(c, [[sd * 30, -180], [sd * 44, -240]], OUT, 8); circle(c, sd * 44, -250, 18, morto > 0.5 ? '#5a5a5a' : '#fff6a0', { lw: 4 }); if (morto < 0.5) circle(c, sd * 44 + 4, -250, 7, OUT, { stroke: null }); else { line(c, [[sd * 44 - 8, -258], [sd * 44 + 8, -242]], OUT, 4); line(c, [[sd * 44 + 8, -258], [sd * 44 - 8, -242]], OUT, 4); } }
  c.restore();
}

// ---------- itens ----------
export const pulsotec = (tela = '#ffb43a') => (c, s, t) => { rrect(c, -30, -46, 60, 44, 8, '#8a7a5a', { lw: 4 }); rrect(c, -22, -40, 44, 30, 4, '#2a1e10', { lw: 2 }); glow(c, 0, -25, 30, tela, 0.6); for (let i = 0; i < 3; i++) line(c, [[-16, -34 + i * 9], [8 - i * 6, -34 + i * 9]], tela, 3); };
export const pistolaLaser = (tiro = 0) => (c, s, t) => {
  c.save(); c.rotate(-1.5 * s);
  rrect(c, -16, -10, 30, 50, 8, '#8a5a3a', { lw: 4 });
  rrect(c, -20, -40, 110, 34, 16, '#c8ccd4'); for (let i = 0; i < 3; i++) ellipse(c, 10 + i * 24, -23, 6, 18, '#ff8a2a', { lw: 3 });
  poly(c, [[-20, -40], [-40, -64], [0, -40]], '#c8ccd4', { lw: 4 }); rrect(c, 88, -32, 24, 18, 6, '#ff4a3a', { lw: 3 });
  if (tiro > 0) { glow(c, 120, -23, 90, '#ff4a3a', tiro); }
  c.restore();
};
export const pecaBomba = () => (c) => { rrect(c, -36, -40, 72, 56, 10, '#9a9aa8', { lw: 5 }); circle(c, 0, -12, 18, '#5a5a66', { lw: 4 }); for (const sd of [-1, 1]) rrect(c, sd * 36 - (sd > 0 ? 0 : 20), -24, 20, 24, 4, '#ff8a2a', { lw: 3 }); };
export const bolo = (velas = 10) => (c, x, y, t) => { rrect(c, x - 90, y - 70, 180, 70, 12, '#f2c2d0'); rrect(c, x - 90, y - 70, 180, 18, 8, '#ffffff', { lw: 4 }); const n = Math.min(velas, 7); for (let i = 0; i < n; i++) { const vx = x - 70 + i * (140 / Math.max(1, n - 1)); rrect(c, vx - 4, y - 104, 8, 34, 3, '#5ab0f0', { lw: 3 }); glow(c, vx, y - 112, 22, '#ffb040', 0.9); ellipse(c, vx, y - 112, 5, 9, '#ffd040', { stroke: null }); } };
