// Cenários de AETHER e efeitos de poderes (fogo, água, gelo, raio, velocidade, telecinese, plantas).
import { TAU, lerp, clamp, sstep, easeOut, rng, mix, rgba, seeds } from '../motor/base.js';
import { OUT, shape, circle, ellipse, poly, rrect, line, glow, rays, sparkle, cloud, vgrad, star5, rune } from '../motor/desenho.js';

const W = 1080, H = 1920;
const S = seeds(120, 21);

function ilha(c, x, y, w, t, cor = '#7ab86a', seed = 1) {
  const fy = Math.sin(t * 0.8 + seed) * 10;
  c.save(); c.translate(0, fy);
  shape(c, cc => { cc.moveTo(x - w / 2, y); cc.lineTo(x + w / 2, y); cc.quadraticCurveTo(x + w * 0.3, y + w * 0.5, x, y + w * 0.8); cc.quadraticCurveTo(x - w * 0.3, y + w * 0.5, x - w / 2, y); cc.closePath(); }, '#8a6a5a');
  ellipse(c, x, y, w / 2, w * 0.08, cor);
  rrect(c, x - w * 0.12, y - w * 0.4, w * 0.24, w * 0.4, 6, '#e8e0f0', { lw: 5 }); poly(c, [[x - w * 0.16, y - w * 0.4], [x, y - w * 0.62], [x + w * 0.16, y - w * 0.4]], '#6a5ad8', { lw: 5 });
  for (let i = 0; i < 3; i++) { const u = (t * 0.4 + i / 3) % 1; c.save(); c.globalAlpha = 0.5 * (1 - u); circle(c, x + (i - 1) * 20, y + w * 0.8 + u * 120, 8, '#bfe8ff', { stroke: null }); c.restore(); }
  c.restore();
}
function torreCristal(c, x, base, h, cor, t, seed) {
  rrect(c, x - 40, base - h, 80, h, 8, '#e8e0f0', { lw: 6 });
  for (let k = 0; k < Math.floor(h / 90); k++) rrect(c, x - 12, base - h + 40 + k * 90, 24, 40, 12, '#ffd890', { lw: 3 });
  const cy = base - h - 70 + Math.sin(t * 1.5 + seed) * 12;
  glow(c, x, cy, 160, cor, 0.8); poly(c, [[x, cy - 60], [x + 30, cy], [x, cy + 60], [x - 30, cy]], cor, { lw: 5 }); line(c, [[x - 6, cy - 30], [x - 12, cy]], '#ffffff', 5, 0.8);
}
// ---------- 1. Cidade de Aether ----------
export function cidadeAether(st, t, { apagao = 0 } = {}) {
  st.camada(0, c => { vgrad(c, 0, 0, W, H, [[0, '#3a5ad8'], [0.5, '#8ab0f0'], [0.8, '#f0c8e8'], [1, '#fff0d8']]); glow(c, 820, 360, 260, '#fff6d8', 0.8); for (let i = 0; i < 3; i++) { c.save(); c.strokeStyle = rgba(['#ff8aa8', '#ffd86a', '#8af0c8'][i], 0.35); c.lineWidth = 26; c.beginPath(); c.arc(540, 1500, 900 + i * 30, Math.PI * 1.15, Math.PI * 1.85); c.stroke(); c.restore(); } });
  st.camada(0.15, c => { for (let i = 0; i < 6; i++) cloud(c, ((i * 380 + t * 10) % 2000) - 500, 320 + (i % 3) * 120, 120, '#ffffff', { seed: i + 2 }); ilha(c, 160, 700, 220, t, '#7ab86a', 1); ilha(c, 900, 560, 180, t, '#8ac87a', 2); ilha(c, 640, 860, 140, t, '#7ab86a', 3); });
  st.camada(0.4, c => { const cores = ['#8af0ff', '#ff8ad8', '#ffd86a', '#9a8aff']; for (let i = 0; i < 7; i++) torreCristal(c, -300 + i * 300, 1400, 360 + (i * 97) % 300, cores[i % 4], t, i); });
  st.camada(0.7, c => { for (let i = 0; i < 8; i++) { const x = -400 + i * 260; rrect(c, x, 1180, 220, 300, 10, ['#f2e6d0', '#e8d8f0', '#d8f0e8'][i % 3], { lw: 6 }); poly(c, [[x - 20, 1190], [x + 110, 1080], [x + 240, 1190]], ['#6a5ad8', '#d86a8a', '#3aa8a0'][i % 3], { lw: 6 }); rrect(c, x + 80, 1360, 60, 120, 30, '#7a4a2a', { lw: 4 }); rrect(c, x + 150, 1240, 44, 44, 8, '#ffd890', { lw: 4 }); } });
  st.camada(1, c => { vgrad(c, -1500, 1470, 4100, 900, [[0, '#d8c8b0'], [1, '#b8a890']]); for (let i = -10; i < 24; i++) rrect(c, i * 160, 1500 + (i % 2) * 40, 140, 30, 10, '#c8b8a0', { stroke: null }); });
  if (apagao > 0) st.overlay('#05040a', apagao * 0.85);
}
// ---------- 2. Quintal da casa (infância) ----------
export function quintal(st, t) {
  st.camada(0, c => { vgrad(c, 0, 0, W, H, [[0, '#6ab8f0'], [1, '#e8f6e8']]); glow(c, 200, 300, 240, '#fff6d8', 0.8); });
  st.camada(0.2, c => { for (let i = 0; i < 4; i++) cloud(c, ((i * 420 + t * 12) % 2000) - 500, 380 + (i % 2) * 140, 120, '#ffffff', { seed: i + 30 }); ilha(c, 820, 700, 200, t, '#8ac87a', 4); });
  st.camada(0.6, c => { rrect(c, 500, 900, 520, 560, 10, '#f2e6d0', { lw: 7 }); poly(c, [[470, 910], [760, 680], [1050, 910]], '#6a5ad8', { lw: 7 }); rrect(c, 700, 1240, 120, 220, 50, '#7a4a2a', { lw: 6 }); rrect(c, 560, 1000, 100, 100, 10, '#ffd890', { lw: 5 }); });
  st.camada(1, c => { vgrad(c, -1000, 1460, 3100, 900, [[0, '#7ac06a'], [1, '#5aa04a']]); for (let i = 0; i < 14; i++) { const x = -200 + i * 110; line(c, [[x, 1520], [x - 8, 1480]], '#4a8a3a', 5); line(c, [[x + 8, 1520], [x + 14, 1484]], '#4a8a3a', 5); } for (const x of [-80, 980]) { rrect(c, x - 14, 1300, 28, 180, 6, '#7a4a2a', { lw: 5 }); circle(c, x, 1260, 90, '#4f9a4f'); } });
}
// ---------- 3/4. Pátio da academia ----------
export function patioAcademia(st, t) {
  st.camada(0, c => { vgrad(c, 0, 0, W, H, [[0, '#4a7ae0'], [1, '#d8e8f8']]); });
  st.camada(0.15, c => { for (let i = 0; i < 5; i++) cloud(c, ((i * 380 + t * 10) % 2000) - 500, 260 + (i % 3) * 110, 120, '#ffffff', { seed: i + 40 }); });
  st.camada(0.5, c => {
    rrect(c, -300, 620, 1680, 860, 10, '#e8e0f0', { lw: 8 });
    for (const x of [-120, 540, 1200]) { rrect(c, x - 110, 380, 220, 1100, 10, '#d8d0e8', { lw: 7 }); poly(c, [[x - 130, 390], [x, 200], [x + 130, 390]], '#2f5ab8', { lw: 7 }); const cy = 160 + Math.sin(t * 1.4 + x) * 10; glow(c, x, cy, 120, '#8af0ff', 0.8); poly(c, [[x, cy - 46], [x + 24, cy], [x, cy + 46], [x - 24, cy]], '#8af0ff', { lw: 5 }); }
    shape(c, cc => { cc.moveTo(400, 1480); cc.lineTo(400, 1100); cc.arc(540, 1100, 140, Math.PI, 0); cc.lineTo(680, 1480); cc.closePath(); }, '#3a3a5a', { lw: 7 });
    for (const x of [170, 910]) { line(c, [[x, 700], [x, 1000]], OUT, 5); shape(c, cc => cc.roundRect(x - 60, 720, 120, 230, 6), '#2f5ab8'); star5(c, x, 820, 30, '#f2c230', { lw: 4 }); }
    c.save(); c.font = '900 60px Inter, sans-serif'; c.textAlign = 'center'; c.fillStyle = '#2f5ab8'; c.fillText('ACADEMIA DE AETHER', 540, 690); c.restore();
  });
  st.camada(1, c => { vgrad(c, -1500, 1480, 4100, 900, [[0, '#c8c0d8'], [1, '#a8a0b8']]); for (let y = 1500; y < 2400; y += 100) for (let x = -1400 + ((y / 100) % 2) * 100; x < 2400; x += 200) rrect(c, x, y, 196, 96, 4, '#bcb4cc', { stroke: '#a49cb4', lw: 3 }); });
}
// ---------- 5/6. Salão do teste com o grande cristal ----------
export function salaoTeste(st, t, { apagao = 0 } = {}) {
  st.camada(0.9, c => {
    vgrad(c, -400, -200, 1900, 2400, [[0, mix('#2a2a5a', '#050408', apagao)], [1, mix('#4a3a7a', '#08060e', apagao)]]);
    for (let i = 0; i < 7; i++) { const x = -260 + i * 270; rrect(c, x - 40, 200, 80, 1300, 8, mix('#6a6a9a', '#121018', apagao), { lw: 6 }); }
    // vitrais
    for (const x of [140, 940]) { shape(c, cc => { cc.moveTo(x - 90, 900); cc.lineTo(x - 90, 520); cc.arc(x, 520, 90, Math.PI, 0); cc.lineTo(x + 90, 900); cc.closePath(); }, mix('#8ab0f0', '#14121e', apagao), { lw: 8 }); if (apagao < 0.5) rays(c, x, 600, 0.3 * (x < 540 ? -1 : 1), 4, 1000, 180, '#cfe0ff', 0.2, t, x); }
    // arquibancada
    for (let k = 0; k < 3; k++) rrect(c, -400, 1180 + k * 80, 1900, 70, 0, mix('#5a4a8a', '#0e0c16', apagao), { stroke: OUT, lw: 5 });
    // tochas mágicas
    for (const x of [300, 780]) { rrect(c, x - 14, 700, 28, 120, 6, '#8a6a3a', { lw: 4 }); const k = 1 - apagao; if (k > 0.05) { glow(c, x, 680, 140 * k, '#8af0ff', 0.8 * k); ellipse(c, x, 680, 20 * k, 32 * k, '#bff8ff', { lw: 3 }); } }
  });
  st.camada(1, c => { vgrad(c, -400, 1460, 1900, 900, [[0, mix('#3a3060', '#06050a', apagao)], [1, mix('#2a2048', '#030205', apagao)]]); });
}
// o grande cristal de avaliação (rachando com k)
export function cristal(c, x, y, s, t, { brilho = 0.4, racha = 0, cor = '#8af0ff' } = {}) {
  c.save(); c.translate(x, y); c.scale(s, s);
  rrect(c, -130, 0, 260, 60, 10, '#6a6a8a', { lw: 6 }); rrect(c, -90, -40, 180, 50, 10, '#7a7a9a', { lw: 6 });
  const f = Math.sin(t * 2) * 6;
  glow(c, 0, -260 + f, 320, cor, brilho * 0.8);
  poly(c, [[0, -480 + f], [110, -270 + f], [60, -60 + f], [-60, -60 + f], [-110, -270 + f]], mix('#cfe8ff', cor, 0.4), { lw: 7 });
  poly(c, [[0, -480 + f], [30, -270 + f], [0, -60 + f], [-30, -270 + f]], rgba('#ffffff', 0.5), { stroke: null });
  if (racha > 0) {
    const R = [[[0, -300], [-30, -240], [10, -190], [-20, -120]], [[0, -300], [40, -340], [20, -400]], [[0, -300], [60, -280], [80, -220]], [[-20, -120], [-60, -90]], [[10, -190], [50, -150]]];
    R.forEach((pts, i) => { const k = clamp(racha * 1.8 - i * 0.2); if (k <= 0) return; const p = pts.slice(0, Math.max(2, Math.ceil(pts.length * k))).map(([a, b]) => [a, b + f]); line(c, p, '#1a0a2a', 9); line(c, p, '#b08aff', 4); });
    glow(c, 0, -300 + f, 200 * racha, '#7a4aff', racha * 0.6);
  }
  c.restore();
}
// ---------- efeitos de poderes ----------
export function chama(c, x, y, s, t, i = 0) { c.save(); c.translate(x, y); c.scale(s, s); const f = Math.sin(t * 12 + i) * 6; glow(c, 0, -50, 120, '#ff8a2a', 0.7); shape(c, cc => { cc.moveTo(-36, 0); cc.quadraticCurveTo(-46, -60, -8, -100 + f); cc.quadraticCurveTo(0, -66, 12, -120 - f); cc.quadraticCurveTo(46, -56, 36, 0); cc.closePath(); }, '#ff5a20', { lw: 4 }); shape(c, cc => { cc.moveTo(-18, 0); cc.quadraticCurveTo(-22, -40, 0, -70 + f); cc.quadraticCurveTo(22, -40, 18, 0); cc.closePath(); }, '#ffd040', { stroke: null }); c.restore(); }
export function arcoAgua(c, x0, y0, x1, y1, t, a = 1) { c.save(); c.globalAlpha *= a; const mx = (x0 + x1) / 2, my = Math.min(y0, y1) - 220; c.lineCap = 'round'; c.strokeStyle = OUT; c.lineWidth = 34; c.beginPath(); c.moveTo(x0, y0); c.quadraticCurveTo(mx, my, x1, y1); c.stroke(); c.strokeStyle = '#3ab0f0'; c.lineWidth = 24; c.stroke(); c.strokeStyle = '#bff0ff'; c.lineWidth = 8; c.stroke(); for (let i = 0; i < 6; i++) { const u = (t * 1.2 + i / 6) % 1, px = (1 - u) * (1 - u) * x0 + 2 * u * (1 - u) * mx + u * u * x1, py = (1 - u) * (1 - u) * y0 + 2 * u * (1 - u) * my + u * u * y1; circle(c, px + 10, py + 16, 7, '#bff0ff', { stroke: null }); } c.restore(); }
export function gelo(c, x, y, s, a = 1) { c.save(); c.globalAlpha *= a; c.translate(x, y); c.scale(s, s); glow(c, 0, -40, 120, '#9ae8ff', 0.7); for (const [dx, h, r] of [[-30, 90, -0.3], [0, 130, 0], [30, 100, 0.3]]) { c.save(); c.translate(dx, 0); c.rotate(r); poly(c, [[-16, 0], [0, -h], [16, 0]], '#cff4ff', { lw: 4 }); c.restore(); } c.restore(); }
export function raioMao(c, x0, y0, x1, y1, t, a = 1) { if (a <= 0) return; const r = rng(Math.floor(t * 20)); const pts = [[x0, y0]]; for (let i = 1; i < 6; i++) { const u = i / 6; pts.push([lerp(x0, x1, u) + (r() - 0.5) * 50, lerp(y0, y1, u) + (r() - 0.5) * 50]); } pts.push([x1, y1]); c.save(); c.globalAlpha *= a; line(c, pts, '#fff060', 14, 0.4); line(c, pts, '#fff060', 7); line(c, pts, '#ffffff', 3); glow(c, x1, y1, 90, '#fff060', 0.8); c.restore(); }
export function auraTele(c, x, y, r, t, a = 1) { if (a <= 0) return; glow(c, x, y, r * 1.4, '#b06aff', 0.5 * a); c.save(); c.globalAlpha *= a; c.strokeStyle = '#d0a0ff'; c.lineWidth = 4; for (let i = 0; i < 2; i++) { c.beginPath(); c.ellipse(x, y, r, r * 0.4, t * (i ? -1 : 1), 0, TAU); c.stroke(); } c.restore(); }
export function flor(c, x, y, k, t) { if (k <= 0) return; c.save(); c.translate(x, y); line(c, [[0, 0], [0, -80 * k]], '#3a8a3a', 6); if (k > 0.5) { const s = (k - 0.5) * 2; for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + t; ellipse(c, Math.cos(a) * 18 * s, -80 + Math.sin(a) * 18 * s, 14 * s, 9 * s, '#ff8ad8', { lw: 3 }, a); } circle(c, 0, -80, 10 * s, '#ffd23a', { lw: 3 }); glow(c, 0, -80, 60 * s, '#ff8ad8', 0.5); } c.restore(); }
// pedra que deveria se mover (e não se move)
export function pedra(c, x, y, s, tremor = 0, t = 0) { c.save(); c.translate(x + Math.sin(t * 60) * tremor * 2, y); c.scale(s, s); poly(c, [[-40, 0], [-34, -30], [-6, -44], [30, -34], [42, 0]], '#9a9aa8', { lw: 5 }); line(c, [[-14, -26], [10, -20]], '#7a7a88', 3); c.restore(); }
