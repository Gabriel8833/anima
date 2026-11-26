// Cenários: sala de estar (com teto e ventilador), biblioteca dentro do cérebro, tela final.
import { TAU, lerp, clamp, sstep, rng, mix, rgba, easeOut } from '../motor/base.js';
import { OUT, shape, circle, ellipse, poly, rrect, line, glow, rays, cloud, vgrad, sparkle } from '../motor/desenho.js';

const W = 1080, H = 1920;

// ================= SALA =================
export const SALA = { piso: 1486, chao: 1730 };

function janela(c, x, y, w, h, t) {
  rrect(c, x - 16, y - 16, w + 32, h + 32, 10, '#fff3e2', { lw: 6 });
  c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip();
  vgrad(c, x, y, w, h, [[0, '#7cc6f2'], [1, '#cdeefc']]);
  cloud(c, x + ((t * 18) % (w + 300)) - 150, y + 120, 70, '#ffffff', { seed: 3 });
  cloud(c, x + ((t * 10 + 200) % (w + 300)) - 150, y + 230, 50, '#ffffff', { seed: 7, alpha: 0.9 });
  ellipse(c, x + w * 0.5, y + h + 30, w, 120, '#7cc46a', { stroke: null });
  // árvore balançando
  const b = Math.sin(t * 1.6) * 0.04;
  c.save(); c.translate(x + w * 0.7, y + h); c.rotate(b);
  rrect(c, -14, -260, 28, 260, 6, '#8a5a3a', { lw: 5 });
  for (const [dx, dy, r] of [[-60, -300, 80], [50, -320, 90], [0, -400, 90], [-20, -250, 70]]) circle(c, dx, dy, r, '#4aa860', { lw: 5 });
  c.restore();
  c.restore();
  line(c, [[x + w / 2, y], [x + w / 2, y + h]], '#fff3e2', 14); line(c, [[x, y + h / 2], [x + w, y + h / 2]], '#fff3e2', 14);
  rrect(c, x - 30, y + h + 10, w + 60, 26, 6, '#fff3e2', { lw: 5 });
  // cortinas com leve vento
  for (const s of [-1, 1]) {
    const cx = s < 0 ? x - 40 : x + w + 40, v = Math.sin(t * 2 + s) * 10;
    shape(c, c => { c.moveTo(cx - 60, y - 50); c.lineTo(cx + 60, y - 50); c.quadraticCurveTo(cx + 40 + v, y + h * 0.6, cx + 70 + v * 1.5, y + h + 60); c.lineTo(cx - 70 + v, y + h + 60); c.quadraticCurveTo(cx - 40 + v, y + h * 0.6, cx - 60, y - 50); c.closePath(); }, '#e2575c', { lw: 6 });
    for (let k = -1; k <= 1; k++) line(c, [[cx + k * 26, y - 40], [cx + k * 32 + v, y + h + 50]], '#c03e46', 5);
  }
  rrect(c, x - 140, y - 70, w + 280, 22, 10, '#8a5a3a', { lw: 5 });
}

function relogio(c, x, y, t, r = 64) {
  circle(c, x, y, r, '#2f7fe0', { lw: 6 }); circle(c, x, y, r * 0.82, '#fffaf0', { lw: 4 });
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; line(c, [[x + Math.cos(a) * r * 0.66, y + Math.sin(a) * r * 0.66], [x + Math.cos(a) * r * 0.74, y + Math.sin(a) * r * 0.74]], OUT, 4); }
  const h = -Math.PI / 2 + 4.2, m = -Math.PI / 2 + t * 0.4, s = -Math.PI / 2 + Math.floor(t) * TAU / 60;
  line(c, [[x, y], [x + Math.cos(h) * r * 0.38, y + Math.sin(h) * r * 0.38]], OUT, 7);
  line(c, [[x, y], [x + Math.cos(m) * r * 0.58, y + Math.sin(m) * r * 0.58]], OUT, 5);
  line(c, [[x, y], [x + Math.cos(s) * r * 0.64, y + Math.sin(s) * r * 0.64]], '#e2575c', 3);
  circle(c, x, y, 6, OUT, { stroke: null });
}

function tv(c, x, y, t) {
  rrect(c, x - 230, y + 170, 460, 150, 10, '#8a5a3a', { lw: 6 });
  for (const s of [-1, 1]) rrect(c, x + s * 110 - 70, y + 196, 140, 100, 6, '#a87444', { lw: 4 });
  rrect(c, x - 200, y - 110, 400, 260, 12, '#1d1d26', { lw: 6 });
  c.save(); c.beginPath(); c.roundRect(x - 184, y - 96, 368, 232, 6); c.clip();
  vgrad(c, x - 184, y - 96, 368, 232, [[0, '#ffb35a'], [1, '#ff6f91']]);
  // desenho animado na TV: bolinha pulando em cima de uma colina
  ellipse(c, x, y + 150, 260, 80, '#6fd08c', { stroke: null });
  const bx = x - 120 + ((t * 80) % 240), by = y + 60 - Math.abs(Math.sin(t * 5)) * 90;
  circle(c, bx, by, 22, '#fff27a', { lw: 4 }); circle(c, bx + 6, by - 4, 4, OUT, { stroke: null });
  c.restore();
  glow(c, x, y + 20, 360, '#ffb0c8', 0.18);
  rrect(c, x - 16, y + 150, 32, 22, 4, '#2a2a34', { lw: 4 });
}

function luminaria(c, x, y, t) {
  line(c, [[x, y], [x, y - 520]], '#3a3a44', 10);
  ellipse(c, x, y + 4, 60, 14, '#3a3a44', { lw: 5 });
  shape(c, c => { c.moveTo(x - 50, y - 520); c.lineTo(x + 50, y - 520); c.lineTo(x + 80, y - 620); c.lineTo(x - 80, y - 620); c.closePath(); }, '#f7d87a', { lw: 6 });
  glow(c, x, y - 540, 320, '#ffd890', 0.35 + Math.sin(t * 2) * 0.03);
}

function sofa(c, x, y) {
  rrect(c, x - 320, y - 260, 640, 210, 46, '#6a5acd', { lw: 6 });
  rrect(c, x - 340, y - 110, 680, 140, 28, '#7b6ce0', { lw: 6 });
  for (const s of [-1, 1]) rrect(c, x + s * 340 - 50, y - 190, 100, 230, 34, '#6a5acd', { lw: 6 });
  for (const s of [-1, 1]) rrect(c, x + s * 150 - 130, y - 128, 260, 44, 18, '#8d80ea', { lw: 4 });
  rrect(c, x - 250, y - 230, 130, 110, 30, '#f4c430', { lw: 5 });
  rrect(c, x + 150, y - 225, 110, 100, 28, '#35a868', { lw: 5 });
  for (const s of [-1, 1]) rrect(c, x + s * 290 - 12, y + 30, 24, 40, 4, '#5a3a2a', { lw: 4 });
}

function gato(c, x, y, t) {
  const pisc = (t % 3.2) < 0.15;
  // rabo balançando
  const r = Math.sin(t * 2.4) * 0.6;
  shape(c, c => { c.moveTo(x + 60, y - 10); c.quadraticCurveTo(x + 130, y - 20 - r * 40, x + 120 + r * 40, y - 100); }, null, { stroke: OUT, lw: 22 });
  shape(c, c => { c.moveTo(x + 60, y - 10); c.quadraticCurveTo(x + 130, y - 20 - r * 40, x + 120 + r * 40, y - 100); }, null, { stroke: '#f29a4a', lw: 12 });
  ellipse(c, x, y - 30, 90, 46, '#f29a4a', { lw: 5 });
  const hb = Math.sin(t * 1.3) * 3;
  c.save(); c.translate(x - 70, y - 70 + hb);
  poly(c, [[-40, -20], [-30, -64], [-6, -34]], '#f29a4a', { lw: 5 }); poly(c, [[40, -20], [30, -64], [6, -34]], '#f29a4a', { lw: 5 });
  circle(c, 0, 0, 46, '#f29a4a', { lw: 5 });
  for (const s of [-1, 1]) { if (pisc) line(c, [[s * 18 - 8, -4], [s * 18 + 8, -4]], OUT, 4); else { ellipse(c, s * 18, -4, 7, 10, '#3a6a2a', { lw: 3 }); line(c, [[s * 18, -11], [s * 18, 3]], OUT, 3); } }
  poly(c, [[-5, 10], [5, 10], [0, 16]], '#e2575c', { lw: 2 });
  for (const s of [-1, 1]) for (const k of [-1, 1]) line(c, [[s * 22, 16 + k * 4], [s * 58, 12 + k * 10]], OUT, 2);
  c.restore();
}

function mesaCentro(c, x, y, t) {
  rrect(c, x - 200, y - 90, 400, 34, 10, '#c98b55', { lw: 6 });
  for (const s of [-1, 1]) rrect(c, x + s * 160 - 12, y - 58, 24, 80, 4, '#8a5a3a', { lw: 4 });
  // caneca soltando vapor
  rrect(c, x - 120, y - 150, 56, 60, 10, '#e2575c', { lw: 4 }); shape(c, c => c.arc(x - 62, y - 120, 14, -1.3, 1.3), null, { lw: 5 });
  for (let i = 0; i < 3; i++) { const u = (t * 0.5 + i / 3) % 1; c.save(); c.globalAlpha = (1 - u) * 0.6; line(c, [[x - 100 + i * 10, y - 160 - u * 70], [x - 92 + i * 10 + Math.sin(t * 3 + i) * 8, y - 190 - u * 70]], '#ffffff', 5); c.restore(); }
  // revista e controle
  c.save(); c.translate(x + 60, y - 98); c.rotate(-0.08); rrect(c, -60, -12, 120, 18, 3, '#5aa9e6', { lw: 4 }); c.restore();
  rrect(c, x - 20, y - 112, 50, 18, 6, '#2a2a34', { lw: 3 });
}

function planta(c, x, y, t) {
  for (let i = 0; i < 7; i++) {
    const a = -Math.PI / 2 + (i - 3) * 0.34 + Math.sin(t * 1.5 + i) * 0.05, L = 150 + (i % 3) * 30;
    c.save(); c.translate(x, y - 110); c.rotate(a + Math.PI / 2);
    shape(c, c => { c.moveTo(0, 0); c.quadraticCurveTo(-34, -L * 0.5, 0, -L); c.quadraticCurveTo(34, -L * 0.5, 0, 0); }, i % 2 ? '#3f9a56' : '#4fb468', { lw: 5 });
    c.restore();
  }
  shape(c, c => { c.moveTo(x - 70, y - 130); c.lineTo(x + 70, y - 130); c.lineTo(x + 52, y); c.lineTo(x - 52, y); c.closePath(); }, '#e0773a', { lw: 6 });
}

export function ventilador(c, x, y, t, vel = 1) {
  line(c, [[x, y - 400], [x, y - 40]], '#8a8a96', 12);
  ellipse(c, x, y - 400, 60, 16, '#fff6ea', { lw: 5 });
  const a = t * 7 * vel;
  for (let i = 0; i < 4; i++) {
    const an = a + i * TAU / 4, px = Math.cos(an) * 260, py = Math.sin(an) * 50;
    shape(c, c => { c.moveTo(x + Math.cos(an - 0.2) * 40, y + Math.sin(an - 0.2) * 10); c.lineTo(x + px - Math.sin(an) * 30, y + py); c.lineTo(x + px + Math.sin(an) * 30, y + py + 8); c.lineTo(x + Math.cos(an + 0.2) * 40, y + Math.sin(an + 0.2) * 10); c.closePath(); }, '#c98b55', { lw: 5 });
  }
  ellipse(c, x, y, 54, 30, '#e8e0d0', { lw: 5 }); ellipse(c, x, y + 30, 36, 24, '#fff7c8', { lw: 5 });
  glow(c, x, y + 40, 220, '#fff2b0', 0.4);
}

// sala completa em coordenadas de mundo. Teto acima de y=200, piso abaixo de y=1486.
export function sala(st, t, { tvX = -120 } = {}) {
  st.mundo(c => {
    vgrad(c, -1600, -1800, 4400, 2000, [[0, '#f9efe2'], [1, '#f1e0cb']]);
    for (let x = -1600; x < 2800; x += 360) line(c, [[x, -1800], [x, 200]], '#e8d4bc', 4);
    ventilador(c, 620, -120, t);
    rrect(c, -1600, 172, 4400, 44, 0, '#fffaf2', { lw: 6 });
    vgrad(c, -1600, 216, 4400, 1270, [[0, '#f6c98a'], [1, '#eeb274']]);
    for (let x = -1600; x < 2800; x += 110) { c.fillStyle = 'rgba(255,255,255,0.1)'; c.fillRect(x, 216, 46, 1270); }
    rrect(c, -1600, 1440, 4400, 46, 0, '#fffaf2', { lw: 6 });
    vgrad(c, -1600, 1486, 4400, 1100, [[0, '#cf9160'], [1, '#a86a3c']]);
    for (let y = 1560; y < 2600; y += 90) line(c, [[-1600, y], [2800, y]], '#b77a48', 3);
    janela(c, 1060, 470, 340, 560, t);
    // quadros
    rrect(c, 330, 520, 170, 210, 6, '#2f7fe0', { lw: 6 }); rrect(c, 348, 538, 134, 174, 3, '#fff3d8', { lw: 3 });
    circle(c, 415, 600, 32, '#f4c430', { lw: 4 }); poly(c, [[360, 700], [415, 640], [470, 700]], '#35a868', { lw: 4 });
    rrect(c, 540, 560, 130, 130, 6, '#e2575c', { lw: 6 }); rrect(c, 556, 576, 98, 98, 3, '#bfe4f6', { lw: 3 });
    for (let i = 0; i < 3; i++) ellipse(c, 605, 650 - i * 22, 30 - i * 8, 10, '#7a4a24', { stroke: null });
    relogio(c, 800, 600, t);
    // estante com livros
    rrect(c, -560, 520, 260, 26, 4, '#8a5a3a', { lw: 5 });
    const cores = ['#e2575c', '#2f7fe0', '#f4c430', '#35a868', '#8a5cc7'];
    for (let i = 0; i < 7; i++) rrect(c, -545 + i * 32, 520 - 90 - (i % 3) * 14, 28, 90 + (i % 3) * 14, 3, cores[i % 5], { lw: 4 });
    tv(c, tvX, 1170, t);
    luminaria(c, 1110, 1470, t);
    sofa(c, 640, 1500);
    gato(c, 380, 1390, t);
    planta(c, -420, 1520, t);
    ellipse(c, 600, 1820, 640, 110, '#3fa39a', { lw: 6 }); ellipse(c, 600, 1820, 520, 80, '#5cc2b5', { stroke: null });
    for (let i = 0; i < 8; i++) circle(c, 600 + Math.cos(i / 8 * TAU) * 420, 1820 + Math.sin(i / 8 * TAU) * 62, 8, '#f4f0d8', { stroke: null });
  });
}
export function mesaFrente(st, t, x = -60) { st.mundo(c => mesaCentro(c, x, 1860, t)); }

// símbolos que flutuam no teto
export function simbolo(c, x, y, tipo, s, a, rot = 0, cor = '#2f7fe0') {
  if (a <= 0.01 || s <= 0.01) return;
  c.save(); c.globalAlpha *= clamp(a); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  if (tipo === 'lamp') { glow(c, 0, -10, 90, '#fff2a0', 0.6); circle(c, 0, -14, 36, '#ffe46a', { lw: 5 }); rrect(c, -18, 18, 36, 26, 5, '#9a9aa8', { lw: 5 }); line(c, [[-10, -14], [0, 2], [10, -14]], '#e0a020', 4); }
  else { c.font = '900 110px Inter, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round'; c.lineWidth = 16; c.strokeStyle = OUT; c.strokeText(tipo, 0, 0); c.fillStyle = cor; c.fillText(tipo, 0, 0); }
  c.restore();
}

// balão de fala com ícone (claquete + interrogação) — sem texto falado
export function balaoPergunta(c, x, y, a, t, cauda = -1) {
  if (a <= 0.01) return;
  const k = 0.5 + 0.5 * easeOut(clamp(a));
  c.save(); c.globalAlpha *= clamp(a * 1.5); c.translate(x, y); c.scale(k, k);
  shape(c, c => { c.roundRect(-150, -90, 300, 180, 70); c.moveTo(cauda * 20, 86); c.lineTo(cauda * 90, 150); c.lineTo(cauda * 70, 84); }, '#ffffff', { lw: 6 });
  // claquete
  c.save(); c.translate(-50, 10); c.rotate(-0.08);
  rrect(c, -50, -20, 100, 64, 6, '#2a2a34', { lw: 4 });
  c.save(); c.translate(-50, -22); c.rotate(-0.25 - Math.max(0, Math.sin(t * 6)) * 0.25); rrect(c, 0, -18, 104, 20, 4, '#f4f0e8', { lw: 4 }); for (let i = 0; i < 4; i++) poly(c, [[10 + i * 24, -17], [22 + i * 24, -17], [14 + i * 24, 1], [2 + i * 24, 1]], '#2a2a34', { stroke: null }); c.restore();
  c.restore();
  c.font = '900 120px Inter, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineWidth = 14; c.strokeStyle = OUT; c.lineJoin = 'round';
  const b = Math.sin(t * 7) * 6; c.strokeText('?', 70, 6 + b); c.fillStyle = '#e2575c'; c.fillText('?', 70, 6 + b);
  c.restore();
}

// ================= BIBLIOTECA DO CÉREBRO =================
export const BIB = { chao: 1700, col0: -840, colW: 150, row0: 1490, rowH: 112, cols: 19, rows: 36, arco: [390, 690, 1000] };
const CORES_G = ['#f2a65a', '#ef6f6c', '#6cc4a1', '#5aa9e6', '#c38fe0', '#f6d55c', '#ff8fb1'];
const R = rng(77); const GAV = [];
for (let j = 0; j < BIB.rows; j++) for (let i = 0; i < BIB.cols; i++) {
  const x = BIB.col0 + i * BIB.colW, y = BIB.row0 - j * BIB.rowH;
  if (x + 140 > BIB.arco[0] && x < BIB.arco[1] && y + 100 > BIB.arco[2]) continue;
  GAV.push({ i, j, x, y, cor: CORES_G[Math.floor(R() * CORES_G.length)], luz: R() < 0.12, f: R() * 6 });
}
export const gavetaPos = (i, j) => [BIB.col0 + i * BIB.colW + 70, BIB.row0 - j * BIB.rowH + 50];

function corredor(c, t) {
  const [x0, x1, y0] = BIB.arco, vx = (x0 + x1) / 2, vy = 1240;
  c.save(); c.beginPath(); c.moveTo(x0, BIB.chao); c.lineTo(x0, y0 + 80); c.quadraticCurveTo(vx, y0 - 90, x1, y0 + 80); c.lineTo(x1, BIB.chao); c.closePath(); c.clip();
  vgrad(c, x0, y0 - 100, x1 - x0, BIB.chao - y0 + 100, [[0, '#2a1450'], [1, '#4a2470']]);
  for (let k = 8; k >= 0; k--) {
    const u = k / 8, s = lerp(0.08, 1, Math.pow(1 - u, 1.6));
    const hw = (x1 - x0) / 2 * s, top = lerp(vy, y0, s), bot = lerp(vy, BIB.chao, s);
    for (const sd of [-1, 1]) {
      const xa = vx + sd * hw, xb = vx + sd * hw * 0.78;
      poly(c, [[xa, top], [xb, lerp(vy, top, 0.9)], [xb, lerp(vy, bot, 0.9)], [xa, bot]], mix('#7a3fa0', '#2a1450', u * 0.8), { lw: 2, stroke: '#1a0c30' });
      glow(c, (xa + xb) / 2, top + 20 * s, 30 * s + 6, '#ffd36a', 0.5 + 0.4 * Math.sin(t * 3 + k));
    }
  }
  c.restore();
  shape(c, c => { c.moveTo(x0, BIB.chao); c.lineTo(x0, y0 + 80); c.quadraticCurveTo(vx, y0 - 90, x1, y0 + 80); c.lineTo(x1, BIB.chao); }, null, { stroke: '#f6d55c', lw: 14 });
}

// parede de gavetas (fundo). acesas: Map "i,j" -> intensidade; aberta: { i, j, u }
export function paredeGavetas(c, t, { acesas = null, aberta = null, bagunca = 0, vis = null } = {}) {
  vgrad(c, -1200, -3600, 3500, 5400, [[0, '#2a1450'], [0.6, '#5a2a80'], [1, '#7a3a8a']]);
  for (const g of GAV) {
    if (vis && (g.x > vis.x1 || g.x + 140 < vis.x0 || g.y > vis.y1 || g.y + 100 < vis.y0)) continue;
    const key = g.i + ',' + g.j, L = acesas?.get(key) || 0;
    if (aberta && aberta.i === g.i && aberta.j === g.j) continue;
    const jit = bagunca * Math.sin(t * 9 + g.f * 3) * 3;
    rrect(c, g.x + jit, g.y, 140, 100, 8, L > 0 ? mix(g.cor, '#fffbe0', L * 0.6) : g.cor, { lw: 4 });
    rrect(c, g.x + 44, g.y + 22, 52, 22, 3, '#fff8e6', { lw: 3 });
    rrect(c, g.x + 52, g.y + 62, 36, 12, 6, '#5a3a2a', { lw: 3 });
    if (g.luz) glow(c, g.x + 120, g.y + 14, 22, '#fff2a0', 0.4 + 0.5 * Math.max(0, Math.sin(t * 2.5 + g.f)));
    if (L > 0.01) glow(c, g.x + 70, g.y + 50, 160, '#ffe27a', L * 0.9);
  }
  corredor(c, t);
  if (aberta) gavetaAberta(c, aberta.i, aberta.j, aberta.u, t);
}
export function gavetaAberta(c, i, j, u, t, cor = '#f6d55c') {
  const x = BIB.col0 + i * BIB.colW, y = BIB.row0 - j * BIB.rowH;
  rrect(c, x, y, 140, 100, 8, '#1a0c30', { lw: 4 });
  const s = 1 + u * 0.22, dy = u * 36;
  c.save(); c.translate(x + 70, y + 50 + dy); c.scale(s, s);
  rrect(c, -78, -36, 156, 30, 4, '#fff8e6', { lw: 3 });
  for (let k = 0; k < 4; k++) rrect(c, -64 + k * 32, -60 - (k % 2) * 8, 26, 40, 3, ['#fff8e6', '#ffe7b0', '#e8f4ff', '#fff8e6'][k], { lw: 3 });
  rrect(c, -70, -50, 140, 100, 8, cor, { lw: 4 });
  rrect(c, -26, -28, 52, 22, 3, '#fff8e6', { lw: 3 }); rrect(c, -18, 12, 36, 12, 6, '#5a3a2a', { lw: 3 });
  c.restore();
}
export function pisoBiblioteca(c, t) {
  vgrad(c, -1200, BIB.chao, 3500, 1200, [[0, '#8a4a6a'], [1, '#5a2a50']]);
  for (let k = -12; k <= 12; k++) line(c, [[540 + k * 60, BIB.chao], [540 + k * 260, BIB.chao + 1200]], 'rgba(255,255,255,0.08)', 4);
  for (let y = BIB.chao + 40, d = 40; y < BIB.chao + 1200; d *= 1.35, y += d) line(c, [[-1200, y], [2300, y]], 'rgba(255,255,255,0.08)', 4);
  rrect(c, -1200, BIB.chao - 14, 3500, 20, 0, '#3a1a40', { lw: 5 });
}
// escada móvel que desliza sozinha
export function escada(c, x, y0, y1) {
  for (const s of [-1, 1]) line(c, [[x + s * 50, y0], [x + s * 50 + 30, y1]], '#c98b55', 14);
  for (let y = y0 + 60; y < y1 - 20; y += 70) { const u = (y - y0) / (y1 - y0); line(c, [[x - 50 + 30 * u, y], [x + 50 + 30 * u, y]], '#a8744a', 10); }
  line(c, [[x - 120, y0], [x + 120, y0]], '#6a4a3a', 8);
  for (const s of [-1, 1]) circle(c, x + s * 50 + 30, y1 + 10, 14, '#3a3a44', { lw: 4 });
}
// livro voador / pilhas
export function livro(c, x, y, rot, cor, aberto = 0, t = 0) {
  c.save(); c.translate(x, y); c.rotate(rot);
  if (aberto > 0.5) { const f = Math.sin(t * 14) * 0.5; shape(c, c => { c.moveTo(0, 0); c.lineTo(-50, -14 + f * 20); c.lineTo(-50, 22 + f * 20); c.lineTo(0, 30); c.lineTo(50, 22 - f * 20); c.lineTo(50, -14 - f * 20); c.closePath(); }, cor, { lw: 4 }); line(c, [[0, 0], [0, 30]], '#fff8e6', 4); }
  else { rrect(c, -46, -16, 92, 32, 4, cor, { lw: 4 }); rrect(c, -46, -8, 92, 6, 2, '#fff8e6', { stroke: null }); }
  c.restore();
}
// conexões luminosas entre pontos (u: 0..1 quanto já foi traçado)
export function conexao(c, a, b, u, t, cor = '#7af0ff', arco = -160) {
  if (u <= 0.01) return;
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2 + arco;
  const P = s => [(1 - s) ** 2 * a[0] + 2 * (1 - s) * s * mx + s * s * b[0], (1 - s) ** 2 * a[1] + 2 * (1 - s) * s * my + s * s * b[1]];
  const pts = []; for (let k = 0; k <= 30 * u; k++) pts.push(P(k / 30));
  pts.push(P(u));
  c.save(); c.globalCompositeOperation = 'lighter';
  line(c, pts, rgba(cor, 0.35), 22); line(c, pts, cor, 7); line(c, pts, '#ffffff', 3);
  c.restore();
  for (let k = 0; k < 3; k++) { const s = ((t * 0.8 + k / 3) % 1) * u; const [x, y] = P(s); glow(c, x, y, 40, cor, 0.9); }
  const [ex, ey] = P(u); glow(c, ex, ey, 70, cor, 1);
}

// lembrança: cena de cinema dentro de um cartão
export function lembranca(c, x, y, s, a, t) {
  if (a <= 0.01) return;
  c.save(); c.globalAlpha *= clamp(a); c.translate(x, y); c.scale(s, s);
  glow(c, 0, 0, 420, '#fff2b0', 0.5);
  rrect(c, -210, -170, 420, 320, 16, '#fffaf0', { lw: 7 });
  c.save(); c.beginPath(); c.roundRect(-190, -150, 380, 240, 8); c.clip();
  c.fillStyle = '#1a1030'; c.fillRect(-190, -150, 380, 240);
  rrect(c, -160, -136, 320, 140, 6, '#0d1838', { lw: 4 });
  for (let i = 0; i < 14; i++) { const sx = -150 + ((i * 53 + t * 40) % 300), sy = -126 + (i * 37) % 120; circle(c, sx, sy, 2, '#ffffff', { stroke: null }); }
  const nx = -120 + ((t * 70) % 260); c.save(); c.translate(nx, -66 + Math.sin(t * 3) * 10);
  poly(c, [[-34, 0], [24, -10], [40, 0], [24, 10]], '#e2575c', { lw: 3 }); poly(c, [[-10, -6], [-26, -24], [0, -8]], '#f4c430', { lw: 3 }); glow(c, -40, 0, 30, '#ffb05a', 0.9);
  c.restore();
  for (let k = 0; k < 7; k++) { rrect(c, -180 + k * 54, 30, 46, 50, 10, '#c0303a', { lw: 3 }); }
  circle(c, -70, 24, 22, '#3b2417', { lw: 3 }); circle(c, 40, 24, 22, '#1e1410', { lw: 3 });
  shape(c, c => { c.moveTo(110, 20); c.lineTo(150, 20); c.lineTo(144, 70); c.lineTo(116, 70); c.closePath(); }, '#ffffff', { lw: 3 });
  for (let k = 0; k < 5; k++) circle(c, 116 + k * 8, 16 - (k % 2) * 6, 9, '#fff3b0', { lw: 2 });
  c.restore();
  for (let k = 0; k < 4; k++) rrect(c, -150 + k * 80, 110, 60, 14, 6, '#c8c0d8', { stroke: null });
  c.restore();
}

// ================= TELA FINAL: cérebro piscando =================
export function cerebro(c, x, y, s, t, { piscar = 0, olhar = [0, 0] } = {}) {
  c.save(); c.translate(x, y); c.scale(s, s);
  const bumps = [[-150, -40, 90], [-80, -120, 100], [20, -140, 105], [120, -100, 95], [170, -10, 85], [110, 70, 90], [0, 90, 95], [-110, 70, 90], [-180, 10, 70]];
  c.beginPath(); for (const [bx, by, br] of bumps) { c.moveTo(bx + br + 7, by); c.arc(bx, by, br + 7, 0, TAU); } c.fillStyle = OUT; c.fill();
  c.beginPath(); for (const [bx, by, br] of bumps) { c.moveTo(bx + br, by); c.arc(bx, by, br, 0, TAU); } c.fillStyle = '#ff9eb8'; c.fill();
  for (const p of [[[-200, -10], [-150, -60], [-170, -110]], [[-60, -200], [-40, -130], [-90, -90]], [[60, -210], [40, -150], [90, -120]], [[200, -60], [150, -40], [170, 30]], [[0, -60], [10, 0], [-20, 40]], [[-120, 120], [-80, 90], [-40, 130]], [[80, 130], [110, 90], [150, 110]]]) line(c, p, '#e0668a', 9);
  line(c, [[0, -240], [10, -150], [-6, -60]], '#e0668a', 10);
  for (const sd of [-1, 1]) {
    const ex = sd * 62, ey = -10;
    if (piscar > 0.5) { shape(c, c => { c.moveTo(ex - 30, ey); c.quadraticCurveTo(ex, ey + 20, ex + 30, ey); }, null, { lw: 8 }); continue; }
    ellipse(c, ex, ey, 34, 42, '#ffffff', { lw: 7 }); circle(c, ex + olhar[0] * 14, ey + olhar[1] * 18, 17, '#2a1a30', { stroke: null }); circle(c, ex + olhar[0] * 14 + 6, ey + olhar[1] * 18 - 8, 6, '#ffffff', { stroke: null });
  }
  shape(c, c => { c.moveTo(-34, 70); c.quadraticCurveTo(0, 104, 34, 70); }, null, { lw: 8 });
  c.restore();
}
