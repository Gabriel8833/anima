// Cenários medievais ilustrados (camadas com paralaxe): vila, casa, estrada, pátio de treino, campo de batalha, castelo ao pôr do sol.
import { TAU, lerp, clamp, sstep, rng, mix, rgba } from '../motor/base.js';
import { OUT, shape, circle, ellipse, poly, rrect, line, glow, rays, sparkle, cloud, vgrad } from '../motor/desenho.js';
import { poeira } from '../motor/efeitos.js';

const W = 1080, H = 1920;

// ---------- peças ----------
export function casa(c, x, base, w, h, { parede = '#f2e6cc', viga = '#6a4022', telhado = '#b8553a', fumaca = true, t = 0, seed = 1, porta = true } = {}) {
  const r = rng(seed);
  rrect(c, x - w / 2, base - h, w, h, 4, parede, { lw: 6 });
  // enxaimel (vigas de madeira)
  for (const k of [0.33, 0.66]) line(c, [[x - w / 2, base - h * k], [x + w / 2, base - h * k]], viga, 9);
  for (const k of [0, 0.5, 1]) line(c, [[x - w / 2 + w * k, base - h], [x - w / 2 + w * k, base]], viga, 9);
  line(c, [[x - w / 2, base - h], [x - w / 2 + w * 0.5, base - h * 0.33]], viga, 7); line(c, [[x + w / 2, base - h], [x + w / 2 - w * 0.5, base - h * 0.33]], viga, 7);
  poly(c, [[x - w / 2 - 34, base - h + 6], [x, base - h - w * 0.62], [x + w / 2 + 34, base - h + 6]], telhado, { lw: 6 });
  for (let i = 0; i < 4; i++) line(c, [[x - w / 2 + 10 + i * w / 4, base - h - 4], [x - w / 2 + 40 + i * w / 4, base - h - w * 0.3]], mix(telhado, '#000000', 0.2), 4, 0.7);
  if (porta) shape(c, c => { c.moveTo(x - 30, base); c.lineTo(x - 30, base - 90); c.arc(x, base - 90, 30, Math.PI, 0); c.lineTo(x + 30, base); c.closePath(); }, '#7a4a26');
  rrect(c, x + w * 0.22, base - h * 0.62, 44, 44, 6, '#ffd890', { lw: 5 }); line(c, [[x + w * 0.22 + 22, base - h * 0.62], [x + w * 0.22 + 22, base - h * 0.62 + 44]], OUT, 4);
  // chaminé com fumaça
  rrect(c, x + w * 0.2, base - h - w * 0.45, 34, 80, 4, '#9a8a7a', { lw: 5 });
  if (fumaca) for (let i = 0; i < 5; i++) { const u = (t * 0.35 + i / 5) % 1; c.save(); c.globalAlpha = 0.5 * (1 - u); circle(c, x + w * 0.2 + 17 + Math.sin(u * 6 + i) * 14 + u * 40, base - h - w * 0.45 - u * 220, 16 + u * 26, '#e8e4ec', { stroke: null }); c.restore(); }
}
export function galinha(c, x, y, s, t, i = 0) {
  const p = Math.sin(t * 9 + i) > 0.6 ? 1 : 0;
  c.save(); c.translate(x, y); c.scale(s, s);
  line(c, [[-8, -10], [-8, 0]], '#e0a020', 4); line(c, [[8, -10], [8, 0]], '#e0a020', 4);
  ellipse(c, 0, -34, 34, 26, '#ffffff', { lw: 5 });
  c.save(); c.translate(24, -52); c.rotate(p * 0.7);
  circle(c, 0, 0, 16, '#ffffff', { lw: 5 }); poly(c, [[12, -2], [28, 4], [12, 8]], '#f0a020', { lw: 3 }); poly(c, [[-6, -14], [0, -26], [6, -14]], '#e0302a', { lw: 3 }); circle(c, 4, -4, 3, OUT, { stroke: null });
  c.restore(); c.restore();
}
export function cerca(c, x0, x1, y, cor = '#8a5a30') {
  line(c, [[x0, y - 70], [x1, y - 70]], cor, 12); line(c, [[x0, y - 34], [x1, y - 34]], cor, 12);
  for (let x = x0; x <= x1; x += 80) rrect(c, x - 9, y - 100, 18, 104, 4, cor, { lw: 5 });
}
export function arvore(c, x, y, s, cor = '#3f8f4f') { rrect(c, x - 14 * s, y - 90 * s, 28 * s, 94 * s, 6, '#7a4a2a', { lw: 5 }); for (const [dx, dy, r] of [[0, -150, 70], [-50, -110, 52], [50, -110, 52]]) circle(c, x + dx * s, y + dy * s, r * s, cor, { lw: 5 }); circle(c, x - 20 * s, y - 170 * s, 16 * s, rgba('#ffffff', 0.2), { stroke: null }); }
export function castelo(c, x, base, s = 1, { parede = '#d8ccb8', telhado = '#3b4fa8', janelas = '#ffd36a', bandeira = '#d23a2a', t = 0 } = {}) {
  c.save(); c.translate(x, base); c.scale(s, s);
  rrect(c, -230, -260, 460, 260, 6, parede, { lw: 7 });
  for (let i = 0; i < 10; i++) rrect(c, -236 + i * 48, -284, 34, 30, 3, parede, { lw: 5 });
  shape(c, c => { c.moveTo(-44, 0); c.lineTo(-44, -110); c.arc(0, -110, 44, Math.PI, 0); c.lineTo(44, 0); c.closePath(); }, '#3a2a2a');
  for (const [tx, w, h] of [[-250, 100, 420], [250, 100, 420], [0, 120, 560], [-110, 70, 360], [110, 70, 380]]) {
    rrect(c, tx - w / 2, -h, w, h, 4, parede, { lw: 6 });
    poly(c, [[tx - w / 2 - 16, -h], [tx, -h - w * 1.3], [tx + w / 2 + 16, -h]], telhado, { lw: 6 });
    for (let k = 0; k < Math.floor(h / 110); k++) rrect(c, tx - 10, -h + 50 + k * 110, 20, 32, 10, janelas, { lw: 4 });
    const tip = -h - w * 1.3, f = Math.sin(t * 6 + tx) * 8; line(c, [[tx, tip], [tx, tip - 60]], OUT, 5); poly(c, [[tx, tip - 60], [tx + 56, tip - 50 + f], [tx, tip - 36]], bandeira, { lw: 4 });
  }
  c.restore();
}
function morros(c, y, cor, seed, amp = 120) { const r = rng(seed); shape(c, c => { c.moveTo(-1200, y + 900); c.lineTo(-1200, y); let x = -1200; while (x < 2400) { const nx = x + 300 + r() * 200; c.quadraticCurveTo((x + nx) / 2, y - amp * (0.4 + r() * 0.6), nx, y); x = nx; } c.lineTo(2400, y + 900); c.closePath(); }, cor, { stroke: null }); }
function nuvens(c, t, n, y0, cor, seed, vel = 10) { for (let i = 0; i < n; i++) cloud(c, ((i * 380 + t * vel) % 2000) - 500, y0 + (i % 3) * 110, 120 + (i % 2) * 40, cor, { seed: seed + i }); }

// ---------- 1. Vila (dia) ----------
export function vila(st, t) {
  st.camada(0, c => { vgrad(c, 0, 0, W, H, [[0, '#6ec4f0'], [0.6, '#bfe6f6'], [1, '#f6eed0']]); glow(c, 880, 260, 260, '#fff6c0', 0.9); circle(c, 880, 260, 70, '#fff8d8', { stroke: null }); });
  st.camada(0.15, c => nuvens(c, t, 7, 300, '#ffffff', 3, 12));
  st.camada(0.3, c => { morros(c, 1180, '#9ac87a', 4, 160); castelo(c, 560, 1120, 0.55, { t }); });
  st.camada(0.6, c => { morros(c, 1320, '#7ab85a', 7, 90); const r = rng(2); for (let i = 0; i < 9; i++) arvore(c, -300 + i * 210 + r() * 60, 1330, 0.7 + r() * 0.3, r() < 0.5 ? '#4f9a4f' : '#3f8a44'); });
  st.camada(1, c => {
    vgrad(c, -1000, 1480, 3100, 900, [[0, '#c8b080'], [1, '#a88a5a']]);
    for (let i = 0; i < 22; i++) { const r = rng(i + 9); ellipse(c, -800 + i * 130 + r() * 50, 1560 + r() * 300, 26, 9, '#b89a68', { stroke: null }); }
    casa(c, -260, 1500, 300, 260, { t, seed: 1, telhado: '#a8553a' });
    casa(c, 150, 1500, 260, 230, { t, seed: 2, telhado: '#8a6a3a' });
    casa(c, 930, 1500, 300, 250, { t, seed: 3, telhado: '#b8553a' });
    casa(c, 1320, 1500, 260, 230, { t, seed: 4, telhado: '#9a4a3a' });
    // poço
    rrect(c, 470, 1410, 140, 90, 10, '#9a9aa8', { lw: 6 }); line(c, [[480, 1410], [480, 1300]], '#7a4a22', 10); line(c, [[600, 1410], [600, 1300]], '#7a4a22', 10); poly(c, [[456, 1306], [540, 1250], [624, 1306]], '#a8553a', { lw: 5 });
  });
}
// ---------- 2. Interior da casa ----------
export function casaInterior(st, t) {
  st.camada(0.9, c => {
    vgrad(c, -400, -200, 1900, 2400, [[0, '#c8a070'], [1, '#a8804a']]);
    for (let x = -400; x < 1500; x += 140) line(c, [[x, -200], [x, 1500]], '#9a7040', 6, 0.6);
    line(c, [[-400, 560], [1500, 560]], '#6a4022', 22); line(c, [[-400, 300], [1500, 300]], '#6a4022', 22);
    // janela com luz
    rrect(c, 640, 700, 260, 260, 10, '#bfe8ff', { lw: 10 }); line(c, [[770, 700], [770, 960]], OUT, 8); line(c, [[640, 830], [900, 830]], OUT, 8);
    rays(c, 770, 760, -0.5, 5, 1100, 220, '#fff6d0', 0.25, t, 4);
    // lareira
    rrect(c, 40, 900, 400, 560, 14, '#9a8a7a', { lw: 7 }); rrect(c, 100, 1080, 280, 380, 120, '#2a1a14', { lw: 6 });
    for (let i = 0; i < 3; i++) { const f = Math.sin(t * 12 + i) * 8; shape(c, cc => { cc.moveTo(170 + i * 70, 1450); cc.quadraticCurveTo(150 + i * 70, 1360, 190 + i * 70, 1300 + f); cc.quadraticCurveTo(230 + i * 70, 1360, 210 + i * 70, 1450); cc.closePath(); }, i % 2 ? '#ffc040' : '#ff6a20', { lw: 4 }); }
    glow(c, 240, 1360, 300, '#ff9a40', 0.6);
    // caldeirão
    ellipse(c, 240, 1330, 90, 60, '#3a3a40'); ellipse(c, 240, 1290, 80, 16, '#8ac060', { lw: 4 });
    for (let i = 0; i < 3; i++) { const u = (t * 0.5 + i / 3) % 1; c.save(); c.globalAlpha = 0.5 * (1 - u); circle(c, 240 + Math.sin(u * 7 + i) * 20, 1270 - u * 200, 14 + u * 20, '#ffffff', { stroke: null }); c.restore(); }
    // prateleira com potes
    rrect(c, 520, 1060, 420, 18, 4, '#6a4022'); for (let i = 0; i < 5; i++) rrect(c, 540 + i * 80, 990, 50, 70, 10, ['#c8a080', '#a8c0d0', '#d8b860', '#b8805a', '#c0d8a0'][i], { lw: 4 });
  });
  st.camada(1, c => { vgrad(c, -400, 1480, 1900, 900, [[0, '#8a6a4a'], [1, '#6a4a30']]); for (let x = -400; x < 1500; x += 160) line(c, [[x, 1480], [x - 120, 2400]], '#6a4a30', 5); });
}
// ---------- 3. Estrada na saída da vila ----------
export function estrada(st, t) {
  st.camada(0, c => { vgrad(c, 0, 0, W, H, [[0, '#7cc8f0'], [0.7, '#d0eef8'], [1, '#fff4d8']]); glow(c, 200, 300, 240, '#fff6c0', 0.8); });
  st.camada(0.15, c => nuvens(c, t, 6, 360, '#ffffff', 21, 14));
  st.camada(0.35, c => { morros(c, 1200, '#a8d088', 12, 170); castelo(c, 820, 1150, 0.45, { t }); });
  st.camada(0.65, c => { morros(c, 1340, '#8ac06a', 15, 80); for (let i = 0; i < 6; i++) { const x = -200 + i * 300; shape(c, c => c.rect(x, 1320, 260, 120), i % 2 ? '#d8c060' : '#b8d070', { stroke: null }); for (let k = 0; k < 6; k++) line(c, [[x + 20 + k * 40, 1330], [x + 20 + k * 40, 1430]], rgba('#000000', 0.08), 6); } });
  st.camada(1, c => {
    vgrad(c, -1500, 1440, 4100, 1000, [[0, '#7ab85a'], [1, '#5a9a44']]);
    shape(c, c => c.rect(-1500, 1520, 4100, 160), '#c8a874', { stroke: null });
    for (let i = 0; i < 20; i++) ellipse(c, -1300 + i * 200, 1600 + (i % 2) * 40, 34, 8, '#b0905e', { stroke: null });
    cerca(c, -400, 1500, 1520);
    for (let i = 0; i < 14; i++) { const x = -500 + i * 150; line(c, [[x, 1720], [x - 10, 1690]], '#3f8a3f', 5); line(c, [[x + 8, 1720], [x + 14, 1686]], '#3f8a3f', 5); }
  });
}
// ---------- 4. Pátio de treino do castelo ----------
export function patio(st, t) {
  st.camada(0, c => { vgrad(c, 0, 0, W, H, [[0, '#86c8ee'], [1, '#e6f2f6']]); });
  st.camada(0.15, c => nuvens(c, t, 5, 260, '#ffffff', 31, 10));
  st.camada(0.6, c => {
    // muralhas do castelo
    rrect(c, -600, 760, 2300, 760, 0, '#c8bca8', { lw: 7 });
    for (let i = 0; i < 30; i++) rrect(c, -600 + i * 80, 720, 56, 50, 4, '#c8bca8', { lw: 5 });
    for (let y = 820; y < 1500; y += 70) for (let x = -600 + ((y / 70) % 2) * 60; x < 1700; x += 120) rrect(c, x, y, 116, 66, 4, '#d6cab6', { stroke: '#b0a490', lw: 3 });
    for (const x of [-300, 540, 1380]) { rrect(c, x - 80, 520, 160, 1000, 6, '#bcb09c', { lw: 6 }); poly(c, [[x - 96, 530], [x, 380], [x + 96, 530]], '#3b4fa8', { lw: 6 }); }
    for (const x of [140, 940]) { line(c, [[x, 760], [x, 1100]], OUT, 5); shape(c, c => c.roundRect(x - 60, 780, 120, 240, 6), '#c0302a'); rrect(c, x - 8, 830, 16, 140, 4, '#f2d060', { lw: 3 }); rrect(c, x - 40, 870, 80, 16, 4, '#f2d060', { lw: 3 }); }
  });
  st.camada(1, c => {
    vgrad(c, -1200, 1480, 3500, 900, [[0, '#d8c090'], [1, '#c0a070']]);
    for (let i = 0; i < 26; i++) { const r = rng(i + 40); ellipse(c, -900 + r() * 2900, 1540 + r() * 360, 30 + r() * 30, 8, '#c8ae7e', { stroke: null }); }
    // suporte de armas
    rrect(c, 760, 1260, 260, 20, 6, '#6a4022'); rrect(c, 770, 1260, 20, 240, 6, '#6a4022'); rrect(c, 990, 1260, 20, 240, 6, '#6a4022');
    for (let i = 0; i < 5; i++) { rrect(c, 800 + i * 40, 1180, 14, 300, 6, '#c8925a', { lw: 4 }); rrect(c, 790 + i * 40, 1290, 34, 12, 4, '#8a5a30', { lw: 3 }); }
  });
}
// boneco de treino de palha (balança quando apanha)
export function boneco(c, x, y, s, t, hit = 0) {
  c.save(); c.translate(x, y); c.scale(s, s); c.rotate(Math.sin(t * 20) * 0.12 * hit);
  rrect(c, -10, -260, 20, 260, 6, '#7a4a22', { lw: 5 });
  rrect(c, -110, -230, 220, 22, 8, '#7a4a22', { lw: 5 });
  ellipse(c, 0, -170, 70, 90, '#e8c870'); for (let i = 0; i < 4; i++) line(c, [[-50, -220 + i * 30], [50, -214 + i * 30]], '#c8a050', 4);
  circle(c, 0, -300, 50, '#e8c870'); line(c, [[-20, -310], [-8, -298]], OUT, 5); line(c, [[-8, -310], [-20, -298]], OUT, 5); line(c, [[8, -310], [20, -298]], OUT, 5); line(c, [[20, -310], [8, -298]], OUT, 5);
  ellipse(c, 0, -170, 30, 30, '#d23a2a', { lw: 4 }); ellipse(c, 0, -170, 12, 12, '#ffffff', { lw: 3 });
  c.restore();
}
// ---------- 5. Campo de batalha ----------
export function campo(st, t, fumacaK = 0) {
  st.camada(0, c => { vgrad(c, 0, 0, W, H, [[0, '#7a8aa0'], [0.6, '#b8b8b0'], [1, '#d8c8a0']]); });
  st.camada(0.15, c => nuvens(c, t, 8, 260, '#9aa0ae', 41, 22));
  st.camada(0.35, c => { morros(c, 1160, '#7a9a6a', 44, 200); castelo(c, 180, 1120, 0.35, { t, telhado: '#5a2a3a', bandeira: '#6a1a2a' }); });
  st.camada(0.6, c => { morros(c, 1300, '#6a8a54', 47, 120); for (let i = 0; i < 6; i++) { const x = -300 + i * 320, f = Math.sin(t * 5 + i) * 10; line(c, [[x, 1300], [x, 1080]], OUT, 6); poly(c, [[x, 1080], [x + 90, 1096 + f], [x, 1130]], i % 2 ? '#6a1a2a' : '#3a6ad0', { lw: 4 }); } });
  st.camada(1, c => {
    vgrad(c, -1500, 1440, 4100, 1000, [[0, '#8aa060'], [1, '#6a8048']]);
    for (let i = 0; i < 30; i++) { const r = rng(i + 70); ellipse(c, -1200 + r() * 3400, 1500 + r() * 400, 40, 10, '#7a9050', { stroke: null }); }
    if (fumacaK > 0) for (let i = 0; i < 8; i++) cloud(c, ((i * 300 + t * 60) % 2400) - 700, 1450 + (i % 3) * 80, 160, rgba('#c8b898', 0.55 * fumacaK), { seed: i + 80 });
  });
}
// ---------- 6. Castelo ao pôr do sol ----------
export function porDoSol(st, t) {
  st.camada(0, c => { vgrad(c, 0, 0, W, H, [[0, '#3a2a6a'], [0.35, '#a04a7a'], [0.6, '#ff8a5a'], [0.8, '#ffc070'], [1, '#ffe0a0']]); glow(c, 540, 1180, 600, '#ffd070', 0.85); circle(c, 540, 1180, 150, '#fff0b0', { stroke: null }); rays(c, 540, 1180, Math.PI, 10, 1600, 1600, '#fff0c0', 0.18, t, 9); });
  st.camada(0.15, c => nuvens(c, t, 6, 520, '#ffb0a0', 51, 8));
  st.camada(0.35, c => { morros(c, 1300, '#6a4a7a', 53, 200); castelo(c, 540, 1240, 1.0, { t, parede: '#c8a8a0', telhado: '#4a3a7a', janelas: '#ffd880' }); });
  st.camada(0.7, c => { morros(c, 1420, '#5a3a5a', 57, 110); });
  st.camada(1, c => { shape(c, c => { c.moveTo(-800, 1600); c.quadraticCurveTo(540, 1480, 1900, 1600); c.lineTo(1900, 2600); c.lineTo(-800, 2600); c.closePath(); }, '#4a3a3a'); for (let i = 0; i < 16; i++) { const x = -300 + i * 110; line(c, [[x, 1640], [x - 8, 1600]], '#3a5a3a', 5); line(c, [[x + 6, 1640], [x + 14, 1604]], '#3a5a3a', 5); } });
}
