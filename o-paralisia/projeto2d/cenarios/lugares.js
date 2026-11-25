// Cenários de "Paralisia do sono": quarto escuro, a entidade (alucinação), o interior do cérebro.
import { TAU, lerp, clamp, sstep, rng, mix, rgba, noise1, easeInOut } from '../motor/base.js';
import { shape, circle, ellipse, poly, rrect, line, glow, vgrad, sparkle, limb } from '../motor/desenho.js';

export const Q = { chao: 1700, colchao: 1480, cab: 200, pe: 940, porta: 1330, fig: 1150 };
const ESC = '#06070c';

// ---------- quarto ----------
export function quarto(st, t, { luz = 0, porta = 0.18 } = {}) {
  st.mundo(c => {
    vgrad(c, -1400, -500, 4200, 2200, [[0, mix('#0b1020', '#1a2236', luz)], [1, mix('#101626', '#222c42', luz)]]);
    // parede envelhecida: manchas e rachaduras
    const r = rng(8);
    for (let i = 0; i < 26; i++) { c.save(); c.globalAlpha = 0.06 + r() * 0.06; c.fillStyle = r() < 0.5 ? '#000000' : '#3a4a66'; c.beginPath(); c.ellipse(-600 + r() * 2600, 200 + r() * 1300, 40 + r() * 160, 30 + r() * 120, r() * 3, 0, TAU); c.fill(); c.restore(); }
    c.save(); c.globalAlpha = 0.35; c.strokeStyle = '#04050a'; c.lineWidth = 3; for (const [x, y] of [[180, 620], [1500, 820], [700, 300]]) { c.beginPath(); c.moveTo(x, y); let xx = x, yy = y; for (let k = 0; k < 6; k++) { xx += (r() - 0.5) * 60; yy += 30 + r() * 30; c.lineTo(xx, yy); } c.stroke(); } c.restore();
    rrect(c, -1400, 1660, 4200, 40, 0, '#0a0c14', { stroke: null });
    vgrad(c, -1400, 1700, 4200, 900, [[0, '#0c0f18'], [1, '#05060a']]);
    for (let y = 1740; y < 2600; y += 70) line(c, [[-1400, y], [2800, y]], 'rgba(0,0,0,0.35)', 3);
    // janela com luar
    rrect(c, 560, 640, 340, 440, 4, '#05060a', { stroke: null });
    c.save(); c.beginPath(); c.rect(575, 655, 310, 410); c.clip(); vgrad(c, 575, 655, 310, 410, [[0, '#2a3a5a'], [1, '#141c30']]); circle(c, 800, 740, 34, '#c8d4ea', { stroke: null }); glow(c, 800, 740, 160, '#a8b8e0', 0.5);
    for (let i = 0; i < 4; i++) { const sw = Math.sin(t * 0.6 + i) * 8; line(c, [[600 + i * 40, 1065], [620 + i * 30 + sw, 820], [700 + i * 20 + sw * 1.5, 700]], '#05060a', 6); }
    c.restore();
    line(c, [[730, 655], [730, 1065]], '#05060a', 10); line(c, [[575, 860], [885, 860]], '#05060a', 10);
    // cortina se mexendo devagar
    const v = Math.sin(t * 0.7) * 14 + Math.sin(t * 1.9) * 4;
    shape(c, c => { c.moveTo(520, 600); c.lineTo(600, 600); c.quadraticCurveTo(610 + v, 900, 640 + v * 1.6, 1160); c.lineTo(520 + v, 1160); c.closePath(); }, '#0e1422', { stroke: null });
    // porta entreaberta à direita
    rrect(c, Q.porta - 120, 860, 240, 820, 2, '#020306', { stroke: null });
    c.save(); c.translate(Q.porta - 120, 860); c.scale(1 - porta, 1); rrect(c, 0, 0, 240, 820, 2, '#141a28', { stroke: null }); rrect(c, 20, 20, 200, 360, 2, 'rgba(255,255,255,0.03)', { stroke: null }); rrect(c, 20, 420, 200, 380, 2, 'rgba(255,255,255,0.03)', { stroke: null }); c.restore();
    rrect(c, Q.porta - 135, 845, 270, 20, 2, '#0a0e18', { stroke: null });
    // cômoda e cadeira com roupas (formas que enganam no escuro)
    rrect(c, -380, 1300, 300, 400, 6, '#0c1018', { stroke: null }); rrect(c, -360, 1330, 260, 100, 4, '#121826', { stroke: null });
    rrect(c, 1560, 1280, 26, 420, 4, '#0a0d16', { stroke: null }); rrect(c, 1540, 1440, 200, 30, 4, '#0a0d16', { stroke: null }); shape(c, c => { c.moveTo(1560, 1290); c.quadraticCurveTo(1640, 1280, 1650, 1440); c.lineTo(1560, 1440); c.closePath(); }, '#121826', { stroke: null });
  });
}
export function cama(c, t) {
  rrect(c, Q.cab - 40, 1140, 56, 560, 8, '#0e121c', { stroke: null });
  rrect(c, Q.pe - 16, 1400, 40, 300, 6, '#0e121c', { stroke: null });
  rrect(c, Q.cab, 1480, Q.pe - Q.cab, 100, 14, '#2a3246', { stroke: null });
  rrect(c, Q.cab, 1576, Q.pe - Q.cab, 60, 6, '#0c0f18', { stroke: null });
  shape(c, c => { c.moveTo(Q.cab + 20, 1450); c.quadraticCurveTo(Q.cab + 20, 1410, Q.cab + 90, 1408); c.quadraticCurveTo(Q.cab + 200, 1400, Q.cab + 230, 1440); c.quadraticCurveTo(Q.cab + 230, 1486, Q.cab + 120, 1490); c.quadraticCurveTo(Q.cab + 20, 1492, Q.cab + 20, 1450); c.closePath(); }, '#3a4258', { stroke: null });
}
export function cobertor(c, t, x0 = 470, respira = 0) {
  const o = Math.sin(t * (2 + respira * 4)) * (3 + respira * 6);
  shape(c, c => { c.moveTo(x0, 1500); c.quadraticCurveTo(x0 + 20, 1380 + o, x0 + 120, 1386 + o); c.quadraticCurveTo(760, 1376 - o * 0.5, Q.pe + 10, 1420); c.lineTo(Q.pe + 20, 1620); c.lineTo(x0 - 20, 1620); c.closePath(); }, '#1e2638', { stroke: '#05060a', lw: 4 });
  c.save(); c.globalAlpha = 0.3; for (let k = 0; k < 4; k++) line(c, [[x0 + 80 + k * 110, 1440], [x0 + 60 + k * 110, 1600]], '#000000', 6); c.restore();
}
// facho de luar entrando pela janela (aditivo)
export function luar(c, a = 1) {
  c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha = 0.12 * a;
  const g = c.createLinearGradient(700, 700, 300, 1700); g.addColorStop(0, '#c8d8ff'); g.addColorStop(1, 'rgba(200,216,255,0)');
  c.fillStyle = g; c.beginPath(); c.moveTo(575, 655); c.lineTo(885, 655); c.lineTo(620, 1700); c.lineTo(80, 1700); c.closePath(); c.fill(); c.restore();
}
// névoa discreta
export function nevoa(c, t, a = 1) {
  c.save(); c.globalAlpha = 0.07 * a; c.fillStyle = '#9aaad0';
  for (let i = 0; i < 6; i++) { const x = -400 + ((t * (14 + i * 4) + i * 420) % 2600), y = 1500 + Math.sin(t * 0.4 + i) * 60 + (i % 3) * 70; c.beginPath(); c.ellipse(x, y, 380, 70, 0, 0, TAU); c.fill(); }
  c.restore();
}

// ---------- a entidade: silhueta alta, magra, braços longos (contorno que "ferve" quadro a quadro) ----------
// o: { inclina (rad), passo (fase), alpha, distorce, braco }
export function entidade(c, x, y, t, o = {}) {
  const a = o.alpha ?? 1; if (a <= 0.01) return;
  const fr = Math.floor(t * 8), j = (k, amp = 4) => noise1(fr * 3.1 + k * 7.7) * amp; // tremor do traço
  const H = 780, sw = Math.sin((o.passo ?? 0)) , bal = Math.sin(t * 0.9) * 0.04;
  c.save(); c.globalAlpha *= a; c.translate(x, y);
  { const g = c.createRadialGradient(0, -H * 0.6, 40, 0, -H * 0.6, H * 0.75); g.addColorStop(0, 'rgba(70,90,140,0.35)'); g.addColorStop(1, 'rgba(70,90,140,0)'); c.fillStyle = g; c.fillRect(-H, -H * 1.4, H * 2, H * 1.5); }
  // sombra projetada na parede (longa, irregular)
  c.save(); c.globalAlpha *= 0.35; c.fillStyle = '#000000'; c.beginPath(); c.moveTo(-40, 0); c.lineTo(-360, -H * 1.15); c.lineTo(-250, -H * 1.2); c.lineTo(40, 0); c.closePath(); c.fill(); c.restore();
  c.rotate(bal);
  const hip = -H * 0.48, sh = -H * 0.86;
  // pernas finas
  for (const s of [-1, 1]) { const k = s * sw * 26; limb(c, [[s * 16 + j(s), hip], [s * 22 + k + j(s + 2), hip * 0.5], [s * 18 + k * 1.4 + j(s + 4), 0]], 16, ESC, { outline: ESC, lw: 0 }); }
  // tronco estreito e longo
  poly(c, [[-26 + j(1), hip], [26 + j(2), hip], [44 + j(3), sh + 40], [36 + j(4), sh], [-36 + j(5), sh], [-44 + j(6), sh + 40]], ESC, { stroke: null });
  // braços desproporcionais, quase até o chão, balançando devagar
  for (const s of [-1, 1]) {
    const bb = (o.braco ?? 0) * s, mv = Math.sin(t * 0.8 + s) * 0.06 + sw * 0.08 * s;
    const S = [s * 38, sh + 16], E = [s * (62 + bb * 20) + j(s * 3), sh + 260 + mv * 200], Hn = [s * (70 + bb * 60) + j(s * 5), -40 + mv * 300];
    limb(c, [S, E, Hn], 12, ESC, { outline: ESC, lw: 0 });
    for (let f = 0; f < 4; f++) line(c, [Hn, [Hn[0] + s * (f - 1.5) * 10 + j(f + s * 9, 3), Hn[1] + 70 + f * 6]], ESC, 5);
  }
  // pescoço fino e cabeça escondida
  c.save(); c.translate(0, sh); c.rotate(o.inclina ?? 0);
  line(c, [[0, 0], [j(11, 3), -70]], ESC, 12);
  c.save(); c.translate(j(12, 3), -120);
  ellipse(c, 0, 0, 40, 56, ESC, { stroke: null });
  if (o.distorce > 0) { const d = o.distorce; for (let k = 0; k < 5; k++) { c.save(); c.globalAlpha *= 0.35 * d; ellipse(c, Math.sin(t * 13 + k) * 30 * d, Math.cos(t * 9 + k) * 22 * d, 40 + k * 6 * d, 56 - k * 4 * d, ESC, { stroke: null }); c.restore(); } for (const s of [-1, 1]) { c.save(); c.globalAlpha *= 0.6 * d; glow(c, s * 13, -4, 14, '#7a1018', 0.8 * d); c.restore(); } }
  c.restore();
  c.restore();
  // recorte de luz fria num lado da silhueta
  c.save(); c.globalAlpha *= 0.55; line(c, [[-44, sh + 40], [-28, hip]], '#8aa0d0', 3); line(c, [[-36, sh], [-44, sh + 40]], '#8aa0d0', 3); c.restore();
  c.restore();
}

// ---------- interior do cérebro (orgânico, escuro, conexões pulsando) ----------
const RN = rng(41);
const FIOS = Array.from({ length: 34 }, () => { const x = -300 + RN() * 1700, y = -100 + RN() * 2100; return [[x, y], [x + (RN() - 0.5) * 500, y + (RN() - 0.5) * 400], [x + (RN() - 0.5) * 900, y + (RN() - 0.5) * 700]]; });
export function nervos(c, t, a = 1) {
  vgrad(c, -900, -800, 2900, 3600, [[0, '#04060e'], [0.5, '#0a1226'], [1, '#03040a']]);
  FIOS.forEach((p, i) => {
    shape(c, c => { c.moveTo(...p[0]); c.quadraticCurveTo(...p[1], ...p[2]); }, null, { stroke: `rgba(70,110,170,${0.18 * a})`, lw: 4 + (i % 3) * 2 });
    const u = ((t * (0.12 + (i % 5) * 0.03) + i * 0.17) % 1), q = (s) => [(1 - s) ** 2 * p[0][0] + 2 * (1 - s) * s * p[1][0] + s * s * p[2][0], (1 - s) ** 2 * p[0][1] + 2 * (1 - s) * s * p[1][1] + s * s * p[2][1]];
    const [gx, gy] = q(u); glow(c, gx, gy, 26, '#7ab8ff', 0.5 * a);
    circle(c, p[0][0], p[0][1], 6, `rgba(150,190,255,${0.35 * a})`, { stroke: null });
  });
}
// cérebro estilizado em linhas finas (lateral)
export function cerebroLinhas(c, x, y, s, t, brilho = 1) {
  c.save(); c.translate(x, y); c.scale(s, s);
  const pul = 0.6 + 0.4 * Math.sin(t * 1.6);
  c.save(); c.globalAlpha = 0.9; shape(c, c => { c.moveTo(-260, 40); c.bezierCurveTo(-300, -150, -120, -260, 40, -240); c.bezierCurveTo(220, -230, 300, -100, 270, 30); c.bezierCurveTo(250, 120, 120, 150, 40, 130); c.bezierCurveTo(-40, 160, -200, 150, -260, 40); c.closePath(); }, 'rgba(20,34,66,0.7)', { stroke: `rgba(120,170,240,${0.7 * brilho})`, lw: 5 }); c.restore();
  const R = rng(5); c.save(); c.strokeStyle = `rgba(120,170,240,${0.35 * brilho})`; c.lineWidth = 3; for (let k = 0; k < 14; k++) { c.beginPath(); let px = -220 + R() * 440, py = -180 + R() * 280; c.moveTo(px, py); for (let q = 0; q < 4; q++) { px += (R() - 0.5) * 90; py += (R() - 0.5) * 60; c.lineTo(px, py); } c.stroke(); } c.restore();
  glow(c, 0, -60, 300, '#3a6ac8', 0.35 * pul * brilho);
  c.restore();
}
// silhueta humana translúcida (deitada ou em pé) com nervos
export function silhueta(c, x, y, s, { deitada = false, musculos = 0.2, cor = '#7ab8ff' } = {}) {
  c.save(); c.translate(x, y); if (deitada) c.rotate(-Math.PI / 2); c.scale(s, s);
  c.globalAlpha = 0.85;
  const contorno = c => { c.arc(0, -560, 70, 0, TAU); c.moveTo(-90, -470); c.lineTo(90, -470); c.lineTo(110, -180); c.lineTo(70, -170); c.lineTo(60, 0); c.lineTo(10, 0); c.lineTo(0, -160); c.lineTo(-10, 0); c.lineTo(-60, 0); c.lineTo(-70, -170); c.lineTo(-110, -180); c.closePath(); };
  shape(c, contorno, `rgba(40,70,120,${0.15 + musculos * 0.4})`, { stroke: rgba(cor, 0.6), lw: 4 });
  line(c, [[0, -490], [0, -170]], rgba(cor, 0.5), 4);
  c.restore();
}
