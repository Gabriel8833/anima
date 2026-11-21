// Cenários ilustrados (camadas com paralaxe). Cada função desenha o fundo inteiro de um lugar.
import { TAU, lerp, clamp, sstep, rng, mix, rgba } from '../motor/base.js';
import { OUT, shape, circle, ellipse, poly, rrect, line, glow, rays, sparkle, star5, cloud, vgrad, rune, magicCircle } from '../motor/desenho.js';
import { poeira } from '../motor/efeitos.js';
import { estante, vela, altar } from './objetos.js';

const W = 1080, H = 1920;
function estrelas(c, n, x0, y0, w, h, t, a = 1, seed = 4) {
  const r = rng(seed);
  for (let i = 0; i < n; i++) { const x = x0 + r() * w, y = y0 + r() * h, s = 1 + r() * 3, tw = 0.5 + 0.5 * Math.sin(t * (1 + r() * 2) + i); c.globalAlpha = a * (0.4 + 0.6 * tw); c.fillStyle = '#fff'; c.fillRect(x, y, s, s); if (s > 3.4) sparkle(c, x, y, 8, '#fff', a * tw); }
  c.globalAlpha = 1;
}
function montanhas(c, y, amp, cor, seed, x0 = -1500, x1 = 2600, neve = null) {
  const r = rng(seed), pts = [[x0, y + 600]]; let x = x0;
  while (x < x1) { pts.push([x, y - r() * amp * 0.3]); x += 120 + r() * 160; pts.push([x, y - amp * (0.5 + r() * 0.5)]); x += 120 + r() * 160; }
  pts.push([x1, y + 600]);
  poly(c, pts, cor, { stroke: null });
  if (neve) for (let i = 2; i < pts.length - 1; i += 2) { const [px, py] = pts[i]; if (py < y - amp * 0.7) poly(c, [[px, py], [px - 50, py + 60], [px - 18, py + 50], [px, py + 70], [px + 22, py + 52], [px + 50, py + 60]], neve, { stroke: null }); }
}
function arvoreRedonda(c, x, y, s, cor, tronco = '#6a4a3a', contorno = true) {
  rrect(c, x - 10 * s, y - 60 * s, 20 * s, 64 * s, 6, tronco, contorno ? { lw: 4 } : { stroke: null });
  circle(c, x, y - 90 * s, 56 * s, cor, contorno ? { lw: 5 } : { stroke: null });
  circle(c, x - 22 * s, y - 106 * s, 16 * s, rgba('#ffffff', 0.18), { stroke: null });
}
function torre(c, x, base, w, h, telhado, parede = '#e8dccb', janelas = '#ffd36a', seed = 1, bandeira = '#d9534f', t = 0) {
  rrect(c, x - w / 2, base - h, w, h, 4, parede, { lw: 5 });
  for (let i = 0; i < 3; i++) rrect(c, x - w / 2 - 6 + i * (w + 12) / 3, base - h - 18, (w + 12) / 3 - 8, 22, 3, parede, { lw: 4 });
  poly(c, [[x - w / 2 - 14, base - h - 10], [x, base - h - w * 1.3], [x + w / 2 + 14, base - h - 10]], telhado, { lw: 5 });
  const r = rng(seed);
  for (let i = 0; i < Math.floor(h / 70); i++) if (r() < 0.75) rrect(c, x - 9, base - h + 40 + i * 70, 18, 28, 9, janelas, { lw: 3 });
  if (bandeira) { const tip = base - h - w * 1.3; line(c, [[x, tip], [x, tip - 50]], OUT, 4); const f = Math.sin(t * 6 + x) * 6; poly(c, [[x, tip - 50], [x + 46, tip - 42 + f], [x, tip - 30]], bandeira, { lw: 3 }); }
}

// ---------- 1. Reino ao entardecer ----------
// v.vermelho (0..1): céu e cristais tomados pelo feitiço vermelho; v.sigilo (0..1): símbolo gigante no céu
export function reino(st, t, foco = 0, v = {}) {
  const vr = v.vermelho || 0, sg = v.sigilo || 0;
  const cristal = (cor, i) => mix(cor, '#ff2a1a', sstep(i * 0.18, i * 0.18 + 0.3, vr));
  st.camada(0, c => {
    const ceu = [['#26245e', '#1a0610'], ['#6a3f8e', '#5a0a1a'], ['#e0708a', '#a01a1a'], ['#ffb070', '#d0402a'], ['#ffd890', '#ff7a4a']];
    vgrad(c, 0, 0, W, H, [0, 0.38, 0.62, 0.8, 1].map((p, i) => [p, mix(ceu[i][0], ceu[i][1], vr)]));
    estrelas(c, 60, 0, 0, W, 500, t, 0.8);
    glow(c, 540, 1180, 700, mix('#ffcf70', '#ff3a1a', vr), 0.75); circle(c, 540, 1180, 120, mix('#fff0b8', '#ff6a4a', vr), { stroke: null });
    if (sg > 0) { magicCircle(c, 540, 560, 420 * (0.6 + 0.4 * sg), '#ff3a2a', sg, t * 0.6, 77); glow(c, 540, 560, 600, '#ff2010', sg * 0.4); }
  });
  st.camada(0.15, c => { [[-300, 420], [500, 300], [1200, 500], [200, 700], [900, 760], [1700, 360]].forEach(([x, y], i) => cloud(c, x + t * 8, y, 140, i % 2 ? '#f7a9c0' : '#ffd0b0', { seed: i + 1, alpha: 0.9 })); });
  st.camada(0.3, c => montanhas(c, 1250, 420, '#7a5aa8', 2, -1500, 2600, '#e8dcff'));
  st.camada(0.5, c => {
    montanhas(c, 1330, 260, '#5a4a9a', 5);
    // torres de magos distantes
    [[-250, '#58b4ff'], [1350, '#b070ff']].forEach(([x, cor0], i) => { const cor = cristal(cor0, i * 2 + 1); rrect(c, x - 25, 760, 50, 580, 6, '#8a7aa8', { lw: 4 }); poly(c, [[x - 40, 770], [x, 660], [x + 40, 770]], '#4a3a7a', { lw: 4 }); const cy = 600 + Math.sin(t * 1.5 + i) * 15; glow(c, x, cy, 140, cor, 0.9); poly(c, [[x, cy - 40], [x + 22, cy], [x, cy + 40], [x - 22, cy]], cor, { lw: 4 }); });
  });
  st.camada(0.75, c => {
    shape(c, c => { c.moveTo(-1400, 1500); c.quadraticCurveTo(-400, 1300, 200, 1380); c.quadraticCurveTo(540, 1240, 900, 1360); c.quadraticCurveTo(1600, 1300, 2500, 1480); c.lineTo(2500, 2600); c.lineTo(-1400, 2600); c.closePath(); }, mix('#4f9a5a', '#5a2a2a', vr), { stroke: null });
    // castelo principal no morro
    const b = 1300;
    rrect(c, 330, b - 260, 420, 270, 6, '#e8dccb', { lw: 6 });
    for (let i = 0; i < 9; i++) rrect(c, 324 + i * 48, b - 284, 34, 30, 3, '#e8dccb', { lw: 4 });
    shape(c, c => { c.moveTo(500, b); c.lineTo(500, b - 90); c.arc(540, b - 90, 40, Math.PI, 0); c.lineTo(580, b); c.closePath(); }, '#3a2a3a');
    for (let i = 0; i < 6; i++) rrect(c, 360 + i * 64, b - 200, 20, 30, 10, '#ffd36a', { lw: 3 });
    torre(c, 330, b, 90, 360, '#3b4fa8', '#e8dccb', '#ffd36a', 1, '#d9534f', t);
    torre(c, 750, b, 90, 380, '#3b4fa8', '#e8dccb', '#ffd36a', 2, '#d9534f', t);
    torre(c, 540, b - 250, 80, 330, '#2f3f98', '#f0e6d8', '#ffd36a', 3, '#5bc0de', t);
    torre(c, 440, b - 250, 56, 170, '#3b4fa8', '#e8dccb', '#ffd36a', 4, null, t);
    torre(c, 640, b - 250, 56, 200, '#3b4fa8', '#e8dccb', '#ffd36a', 5, null, t);
    // torres de magos próximas com cristais
    [[-80, '#58b4ff', 980], [1180, '#ffc040', 1000]].forEach(([x, cor0, base], i) => { const cor = cristal(cor0, i * 2);
      torre(c, x, base + 300, 70, 640, '#5a3a8a', '#cfc4e0', cor, 7 + i, null, t);
      const cy = base - 470 + Math.sin(t * 1.4 + i) * 18;
      glow(c, x, cy, 220, cor, 0.85); poly(c, [[x, cy - 60], [x + 32, cy], [x, cy + 60], [x - 32, cy]], cor, { lw: 5 }); line(c, [[x - 6, cy - 34], [x - 14, cy]], '#ffffff', 5, 0.8);
      for (let k = 0; k < 4; k++) sparkle(c, x + Math.cos(t * 2 + k * 1.6) * 70, cy + Math.sin(t * 2 + k * 1.6) * 30, 10, '#ffffff', 0.9);
    });
    // pássaros
    for (let i = 0; i < 5; i++) { const bx = (i * 260 + t * 70) % 1600 - 250, by = 700 + Math.sin(i * 3) * 120, f = Math.sin(t * 10 + i) * 10; line(c, [[bx - 18, by - f], [bx, by], [bx + 18, by - f]], '#3a2a4a', 4); }
  });
  st.camada(1.15, c => {
    shape(c, c => { c.moveTo(-1400, 1700); c.quadraticCurveTo(0, 1560, 540, 1640); c.quadraticCurveTo(1200, 1560, 2500, 1700); c.lineTo(2500, 2800); c.lineTo(-1400, 2800); c.closePath(); }, mix('#3d7d4a', '#4a2222', vr), { stroke: null });
    const r = rng(9);
    for (let i = 0; i < 26; i++) { const x = -1000 + i * 140 + r() * 60, y = 1680 + r() * 160; arvoreRedonda(c, x, y, 1.3 + r() * 0.6, mix(r() < 0.5 ? '#2f7a44' : '#3f8f4f', '#5a2a3a', vr * 0.8)); }
  });
}

// ---------- 2. Biblioteca subterrânea ----------
export function biblioteca(st, t, { livroFn } = {}) {
  st.camada(0.85, c => {
    vgrad(c, -400, -200, 1900, 2400, [[0, '#1c2348'], [1, '#2f3f6e']]);
    // janela em arco ao centro, com lua
    shape(c, c => { c.moveTo(380, 820); c.lineTo(380, 420); c.arc(540, 420, 160, Math.PI, 0); c.lineTo(700, 820); c.closePath(); }, '#7fb0e8', { lw: 10 });
    circle(c, 600, 380, 50, '#fffbe0', { stroke: null }); glow(c, 600, 380, 160, '#cfe8ff', 0.7);
    line(c, [[540, 260], [540, 820]], OUT, 8); line(c, [[380, 560], [700, 560]], OUT, 8);
    estante(c, -380, 300, 700, 1300, 11); estante(c, 760, 300, 700, 1300, 12);
    estante(c, 330, 860, 420, 600, 13);
  });
  st.camada(0.95, c => {
    rays(c, 620, 420, 0.32, 6, 1400, 300, '#bfe0ff', 0.22, t);
    vgrad(c, -400, 1460, 1900, 900, [[0, '#4a3550'], [1, '#2a1f33']]);
    ellipse(c, 540, 1560, 420, 80, '#6a2f4a', { stroke: null }); ellipse(c, 540, 1560, 360, 62, '#8a3f5a', { stroke: null });
    for (let i = 0; i < 7; i++) vela(c, 80 + i * 150 + (i % 2) * 40, 520 + (i % 3) * 170, 0.8, t, '#ffb040', i);
  });
  st.camada(1, c => {
    altar(c, 540, 1600, 1, '#6fd8ff', 0.6 + 0.3 * Math.sin(t * 2));
    livroFn?.(c);
    poeira(c, 0, 200, W, 1500, t, '#cfe8ff', 0.7, 40, 2);
  });
}

// ---------- 3a. Floresta à noite ----------
export function floresta(st, t) {
  st.camada(0, c => { vgrad(c, 0, 0, W, H, [[0, '#0c1636'], [0.6, '#22346a'], [1, '#1a2a4a']]); estrelas(c, 80, 0, 0, W, 900, t, 0.9, 6); glow(c, 820, 380, 300, '#cfe0ff', 0.6); circle(c, 820, 380, 90, '#f6f8ff', { stroke: null }); circle(c, 790, 360, 20, '#dfe6f6', { stroke: null }); });
  st.camada(0.3, c => { const r = rng(3); for (let i = 0; i < 14; i++) { const x = -200 + i * 110, s = 2 + r(); rrect(c, x - 14 * s, 1300 - 300 * s, 28 * s, 300 * s, 6, '#1a2650', { stroke: null }); circle(c, x, 1300 - 330 * s, 90 * s, '#1d2c5a', { stroke: null }); } });
  st.camada(0.6, c => { const r = rng(5); for (let i = 0; i < 10; i++) { const x = -250 + i * 170, s = 2.4 + r(); rrect(c, x - 16 * s, 1500 - 300 * s, 32 * s, 300 * s, 6, '#162046', { lw: 4 }); circle(c, x, 1500 - 330 * s, 90 * s, '#18274f', { lw: 5 }); } });
  st.camada(1, c => {
    vgrad(c, -400, 1460, 1900, 800, [[0, '#1e3050'], [1, '#121c30']]);
    const r = rng(8);
    for (let i = 0; i < 9; i++) { const x = 60 + i * 120 + r() * 40, y = 1560 + r() * 180; c.fillStyle = '#e8f0ff'; rrect(c, x - 4, y - 20, 8, 22, 3, '#e8f0ff', { lw: 3 }); ellipse(c, x, y - 22, 20, 12, '#5fd8ff', { lw: 3 }); glow(c, x, y - 22, 50, '#5fd8ff', 0.6); }
    for (let i = 0; i < 20; i++) { const s = r(), x = (s * 1300 + Math.sin(t * 0.6 + i) * 60) % 1100, y = 700 + r() * 900 + Math.sin(t + i) * 30; sparkle(c, x, y, 7, '#c8f0ff', 0.6 + 0.4 * Math.sin(t * 3 + i)); }
  });
}

// ---------- 3b. Cripta de Morvath ----------
export function cripta(st, t) {
  st.camada(0.9, c => {
    vgrad(c, -400, -200, 1900, 2400, [[0, '#1a0c16'], [1, '#2e1424']]);
    for (let y = 0; y < 1500; y += 70) for (let x = -400 + ((y / 70) % 2) * 60; x < 1500; x += 120) rrect(c, x, y, 112, 62, 6, '#3a1a2a', { stroke: '#22101a', lw: 4 });
    shape(c, c => { c.moveTo(240, 1500); c.lineTo(240, 600); c.arc(540, 600, 300, Math.PI, 0); c.lineTo(840, 1500); c.closePath(); }, '#120810', { lw: 10 });
    for (const [x, y] of [[120, 700], [960, 700], [180, 1100], [900, 1100]]) { vela(c, x, y, 0.9, t, '#ff3a2a', x); }
    // teias
    for (const s of [-1, 1]) { const x = s < 0 ? -40 : 1120; for (let k = 0; k < 4; k++) line(c, [[x, 0], [x - s * (60 + k * 50), 60 + k * 60]], '#5a4a5a', 2, 0.6); }
  });
  st.camada(1, c => { vgrad(c, -400, 1480, 1900, 800, [[0, '#2a1420'], [1, '#14080e']]); glow(c, 540, 1300, 600, '#ff2030', 0.25); });
}

// ---------- 3c. Topo da torre de Eldrin (observatório) ----------
export function observatorio(st, t, constelacao = 0) {
  st.camada(0, c => {
    vgrad(c, 0, 0, W, H, [[0, '#060a24'], [0.7, '#1c2560'], [1, '#3a2f6a']]); estrelas(c, 220, 0, 0, W, 1400, t, 1, 9);
    glow(c, 200, 300, 220, '#ffe8b0', 0.5); circle(c, 200, 300, 70, '#fff4d0', { stroke: null });
    // constelação em forma de livro
    const P = [[300, 760], [540, 820], [780, 760], [780, 420], [540, 480], [300, 420], [300, 760]];
    const n = (P.length - 1) * constelacao;
    for (let i = 0; i < Math.floor(n); i++) line(c, [P[i], P[i + 1]], '#ffe08a', 5, 0.9);
    if (n % 1 > 0 && n < P.length - 1) { const i = Math.floor(n), u = n % 1; line(c, [P[i], [lerp(P[i][0], P[i + 1][0], u), lerp(P[i][1], P[i + 1][1], u)]], '#ffe08a', 5, 0.9); }
    if (constelacao > 0.8) line(c, [[540, 820], [540, 480]], '#ffe08a', 5, (constelacao - 0.8) * 5);
    P.slice(0, 6).forEach((p, i) => { if (constelacao * 6 > i) sparkle(c, p[0], p[1], 22, '#fff6c8', 1); });
    glow(c, 540, 620, 380, '#ffc860', constelacao * 0.35);
  });
  st.camada(1, c => {
    rrect(c, -300, 1450, 1700, 600, 0, '#7a6e8a', { lw: 6 });
    for (let i = 0; i < 12; i++) rrect(c, -280 + i * 140, 1390, 90, 70, 6, '#8a7e9a', { lw: 5 });
    // luneta de latão
    c.save(); c.translate(860, 1450); line(c, [[0, 0], [-40, -160]], '#7a5a2a', 12); line(c, [[0, 0], [40, -160]], '#7a5a2a', 12); c.rotate(-0.6); rrect(c, -40, -230, 260, 56, 26, '#d8a640', { lw: 5 }); rrect(c, 200, -238, 40, 72, 10, '#b88620', { lw: 5 }); c.restore();
  });
}

// ---------- 3d. Círculo de pedras (Zareth) ----------
export function circuloPedras(st, t, magia = 0) {
  st.camada(0, c => { vgrad(c, 0, 0, W, H, [[0, '#120828'], [0.6, '#3a1a5e'], [1, '#6a3a7a']]); estrelas(c, 120, 0, 0, W, 1000, t, 0.9, 12); glow(c, 300, 420, 260, '#e0d0ff', 0.5); circle(c, 300, 420, 80, '#f2ecff', { stroke: null }); });
  st.camada(0.4, c => montanhas(c, 1350, 220, '#2a1640', 14));
  st.camada(1, c => {
    vgrad(c, -400, 1380, 1900, 900, [[0, '#3a2450'], [1, '#1c1028']]);
    magicCircle(c, 540, 1560, 420, '#c070ff', magia, t, 5, 0.3);
    [[-60, 1420, 0.9], [200, 1380, 0.7], [880, 1380, 0.7], [1140, 1420, 0.9]].forEach(([x, y, s], i) => { shape(c, c => c.roundRect(x - 60 * s, y - 360 * s, 120 * s, 380 * s, [40 * s, 40 * s, 8, 8]), '#7a7290', {}); for (let k = 0; k < 3; k++) rune(c, x, y - (300 - k * 80) * s, 16 * s, i * 5 + k, '#c070ff', magia); });
    for (let i = 0; i < 6; i++) cloud(c, (i * 260 + t * 30) % 1500 - 200, 1640 + (i % 2) * 90, 160, rgba('#b8a0e0', 0.35), { seed: i + 20 });
  });
}

// ---------- 4. Templo abandonado sob o eclipse ----------
export function templo(st, t, eclipse = 0) {
  st.camada(0.6, c => {
    vgrad(c, -200, -300, 1500, 1200, [[0, '#070a1e'], [1, '#1a2048']]); estrelas(c, 90, -200, -300, 1500, 1000, t, 0.9, 15);
    const ex = 560, ey = 230;
    glow(c, ex, ey, 420, mix('#fff2c0', '#ff7a3a', eclipse), 0.8);
    circle(c, ex, ey, 110, mix('#fff2c0', '#ffb070', eclipse), { stroke: null });
    if (eclipse > 0) { c.save(); c.globalAlpha = eclipse; circle(c, ex + lerp(220, 0, eclipse), ey + lerp(-60, 0, eclipse), 104, '#0a0612', { stroke: '#ff9a4a', lw: 6 }); c.restore(); }
  });
  st.camada(0.9, c => {
    // paredes com buraco no teto
    shape(c, c => { c.moveTo(-500, -400); c.lineTo(1600, -400); c.lineTo(1600, 1600); c.lineTo(-500, 1600); c.closePath(); c.moveTo(220, 520); c.lineTo(150, 120); c.lineTo(320, -40); c.lineTo(560, 20); c.lineTo(780, -60); c.lineTo(930, 180); c.lineTo(860, 520); c.closePath(); }, '#4a4a64', { rule: 'evenodd' });
    for (let y = -300; y < 1500; y += 90) for (let x = -480 + ((y / 90) % 2) * 80; x < 1600; x += 160) { if (x > 130 && x < 940 && y < 520) continue; rrect(c, x, y, 150, 82, 6, '#55556e', { stroke: '#3a3a52', lw: 4 }); }
    // trepadeiras
    const r = rng(4);
    for (let i = 0; i < 9; i++) { const x = r() * 1100 - 20, len = 300 + r() * 600; line(c, [[x, -100], [x + 30, len * 0.4], [x - 20, len * 0.7], [x + 10, len]], '#2f6a3a', 8); for (let k = 0; k < 6; k++) ellipse(c, x + (r() - 0.5) * 40, r() * len, 16, 10, '#3f8a4a', { lw: 3 }, r() * 3); }
    rays(c, 560, 100, 0, 5, 1700, 500, mix('#d8e4ff', '#ffb080', eclipse), lerp(0.28, 0.14, eclipse), t, 7);
  });
  st.camada(1, c => {
    vgrad(c, -500, 1500, 2100, 800, [[0, '#3a3a50'], [1, '#22222f']]);
    // colunas quebradas
    for (const [x, h] of [[-120, 900], [1260, 700]]) { rrect(c, x - 70, 1500 - h, 140, h, 8, '#7a7a92'); for (let k = 0; k < 4; k++) line(c, [[x - 40 + k * 26, 1500 - h + 20], [x - 40 + k * 26, 1490]], '#62627a', 5); poly(c, [[x - 80, 1500 - h], [x - 40, 1500 - h - 50], [x + 10, 1500 - h - 20], [x + 50, 1500 - h - 70], [x + 80, 1500 - h]], '#7a7a92'); }
    for (let i = 0; i < 6; i++) { const rr = rng(i + 30); poly(c, [[100 + i * 170, 1560], [130 + i * 170, 1520 - rr() * 30], [170 + i * 170, 1540], [180 + i * 170, 1570]], '#6a6a82', { lw: 4 }); }
  });
}
// Parede com o mapa entalhado; brilho = raio da revelação (0..1) a partir do ponto de toque
export function paredeMapa(c, x, y, w, h, t, revela = 0, toque = [0.45, 0.6], marca = 0) {
  rrect(c, x - w / 2 - 20, y - h / 2 - 20, w + 40, h + 40, 12, '#6a6a82', { lw: 7 });
  rrect(c, x - w / 2, y - h / 2, w, h, 8, '#8a8aa2', { lw: 5 });
  const desenhaMapa = (cor, lw) => {
    c.save(); c.translate(x - w / 2, y - h / 2); c.strokeStyle = cor; c.lineWidth = lw; c.lineCap = 'round'; c.lineJoin = 'round';
    const r = rng(21);
    for (const [cx, cy, R] of [[0.3, 0.38, 0.22], [0.7, 0.32, 0.17], [0.55, 0.72, 0.2]]) { c.beginPath(); for (let i = 0; i <= 40; i++) { const a = i / 40 * TAU, rr = R * (0.75 + 0.25 * Math.sin(a * 3 + cx * 9) + (r() - 0.5) * 0.1); c.lineTo((cx + Math.cos(a) * rr) * w, (cy + Math.sin(a) * rr * 0.8) * h); } c.closePath(); c.stroke(); }
    for (let i = 0; i < 12; i++) { const px = (0.15 + r() * 0.7) * w, py = (0.2 + r() * 0.6) * h; c.beginPath(); c.moveTo(px - 14, py + 10); c.lineTo(px, py - 12); c.lineTo(px + 14, py + 10); c.stroke(); }
    c.setLineDash([12, 14]); c.beginPath(); c.moveTo(0.22 * w, 0.55 * h); c.bezierCurveTo(0.4 * w, 0.2 * h, 0.55 * w, 0.5 * h, 0.72 * w, 0.3 * h); c.stroke(); c.setLineDash([]);
    c.restore();
  };
  desenhaMapa('#6a6a82', 5);
  if (revela > 0) {
    c.save(); c.beginPath(); c.arc(x - w / 2 + toque[0] * w, y - h / 2 + toque[1] * h, revela * Math.hypot(w, h), 0, TAU); c.clip();
    desenhaMapa('#7fd8ff', 6); glow(c, x, y, Math.max(w, h) * 0.6, '#58b4ff', 0.25);
    c.restore();
    c.save(); c.globalAlpha = Math.max(0, 1 - revela) * 0.9; c.strokeStyle = '#cfefff'; c.lineWidth = 8; c.beginPath(); c.arc(x - w / 2 + toque[0] * w, y - h / 2 + toque[1] * h, revela * Math.hypot(w, h), 0, TAU); c.stroke(); c.restore();
  }
  if (marca > 0) { const mx = x - w / 2 + 0.72 * w, my = y - h / 2 + 0.3 * h; glow(c, mx, my, 120, '#9fe8ff', marca); star5(c, mx, my, 34 * (0.9 + 0.1 * Math.sin(t * 8)), '#e6fbff', { stroke: '#58b4ff', lw: 5, alpha: marca }); c.save(); c.globalAlpha = marca; c.strokeStyle = '#9fe8ff'; c.lineWidth = 5; c.beginPath(); c.arc(mx, my, 50 + (t * 60) % 60, 0, TAU); c.stroke(); c.restore(); }
}

// ---------- 5. Campo de batalha ----------
export function batalha(st, t, clarao = 0) {
  st.camada(0, c => { vgrad(c, 0, 0, W, H, [[0, mix('#1a0a24', '#8a90c0', clarao * 0.6)], [0.5, mix('#5a1a3a', '#c0c0e0', clarao * 0.4)], [1, '#c0442a']]); });
  st.camada(0.15, c => { for (let i = 0; i < 9; i++) cloud(c, (i * 220 + t * 25) % 1700 - 300, 250 + (i % 3) * 140, 170, mix('#3a1a3a', '#6a4a7a', clarao), { seed: i + 40 }); });
  st.camada(0.35, c => {
    // castelo em chamas ao fundo
    shape(c, c => { c.moveTo(-400, 1300); c.lineTo(-400, 1150); for (let i = 0; i < 12; i++) { const x = -400 + i * 170; c.lineTo(x, 1150 - (i % 3) * 120 - 120); c.lineTo(x + 50, 1150 - (i % 3) * 120 - 160); c.lineTo(x + 100, 1150 - (i % 3) * 120 - 120); c.lineTo(x + 100, 1150); } c.lineTo(1700, 1150); c.lineTo(1700, 1300); c.closePath(); }, '#2a1424', { stroke: null });
    for (let i = 0; i < 7; i++) { const x = -200 + i * 230, f = 1 + 0.2 * Math.sin(t * 9 + i * 2); glow(c, x, 1050, 220 * f, '#ff6a20', 0.75); fogo(c, x, 1120, 1.4 * f, t, i); }
  });
  st.camada(0.7, c => { vgrad(c, -1000, 1300, 3100, 1000, [[0, '#4a2a2a'], [1, '#2a1818']]); const r = rng(3); for (let i = 0; i < 10; i++) { const x = -600 + i * 260 + r() * 80, h = 150 + r() * 260; poly(c, [[x, 1420], [x, 1420 - h], [x + 40, 1420 - h - 30], [x + 90, 1420 - h + 20], [x + 130, 1420 - h * 0.6], [x + 130, 1420]], '#5a4048', {}); } });
  st.camada(1, c => {
    vgrad(c, -1500, 1500, 4100, 900, [[0, '#5a3a34'], [1, '#2a1a1a']]);
    const r = rng(6); for (let i = 0; i < 14; i++) line(c, [[-1000 + r() * 3000, 1520 + r() * 300], [-1000 + r() * 3000, 1560 + r() * 300]], '#3a2420', 4);
  });
}
export function fogo(c, x, y, s, t, i = 0) {
  c.save(); c.translate(x, y); c.scale(s, s);
  const f = Math.sin(t * 12 + i) * 6;
  shape(c, c => { c.moveTo(-40, 0); c.quadraticCurveTo(-50, -60, -10, -110 + f); c.quadraticCurveTo(0, -70, 12, -130 - f); c.quadraticCurveTo(50, -60, 40, 0); c.closePath(); }, '#ff5a20', { lw: 4 });
  shape(c, c => { c.moveTo(-22, 0); c.quadraticCurveTo(-26, -40, 0, -76 + f); c.quadraticCurveTo(26, -40, 22, 0); c.closePath(); }, '#ffc040', { stroke: null });
  c.restore();
}
// torre que desaba (k 0..1)
export function torreCaindo(c, x, base, k, t) {
  c.save(); c.translate(x, base);
  const segs = 7;
  for (let i = 0; i < segs; i++) {
    const kk = Math.max(0, k * 1.4 - (segs - i) * 0.05), fall = kk * kk;
    c.save(); c.translate(fall * (40 + i * 30), Math.min(-i * 90, -i * 90 + fall * 900)); c.rotate(fall * (0.3 + i * 0.12));
    rrect(c, -70, -90, 140, 90, 6, '#8a7a8a', { lw: 5 });
    if (i % 2) rrect(c, -14, -70, 28, 40, 12, '#ffb040', { lw: 3 });
    c.restore();
  }
  const tk = Math.max(0, k * 1.4 - 0.05), tf = tk * tk;
  c.save(); c.translate(tf * 260, Math.min(-segs * 90, -segs * 90 + tf * 1000)); c.rotate(tf * 1.4); poly(c, [[-90, 0], [0, -150], [90, 0]], '#3a2a5a'); c.restore();
  c.restore();
}

// ---------- 6. Câmara do livro ----------
export function camara(st, t, vermelho = 0) {
  st.camada(0.9, c => {
    vgrad(c, -400, -200, 1900, 2400, [[0, mix('#0e1430', '#300808', vermelho)], [1, mix('#1e2a50', '#4a1010', vermelho)]]);
    for (let y = -100; y < 1500; y += 80) for (let x = -400 + ((y / 80) % 2) * 70; x < 1500; x += 140) rrect(c, x, y, 132, 72, 6, mix('#2a3458', '#4a1a1a', vermelho), { stroke: mix('#1a2040', '#2a0a0a', vermelho), lw: 4 });
    for (const x of [140, 940]) { rrect(c, x - 60, 300, 120, 1200, 8, mix('#3a4468', '#5a2222', vermelho)); }
  });
  st.camada(1, c => { vgrad(c, -400, 1500, 1900, 800, [[0, mix('#2a3050', '#3a1414', vermelho)], [1, '#10121c']]); });
}

// ---------- Penhasco sobre o reino, à noite (céu vermelho) ----------
export function penhasco(st, t, brilho = 0) {
  st.camada(0, c => {
    vgrad(c, 0, 0, W, H, [[0, '#12040c'], [0.45, '#4a0a1a'], [0.75, '#9a2a2a'], [1, '#ff7a4a']]);
    estrelas(c, 90, 0, 0, W, 900, t, 0.8, 21);
    magicCircle(c, 540, 520, 300, '#ff3a2a', 0.55, t * 0.5, 77); glow(c, 540, 520, 420, '#ff2010', 0.3);
  });
  st.camada(0.25, c => {
    montanhas(c, 1380, 260, '#3a0e1e', 31);
    // reino distante (silhueta com janelas vermelhas)
    shape(c, c => { c.moveTo(200, 1380); for (let i = 0; i < 9; i++) { const x = 200 + i * 80; c.lineTo(x, 1300 - (i % 3) * 60); c.lineTo(x + 20, 1260 - (i % 3) * 60 - (i === 4 ? 90 : 0)); c.lineTo(x + 40, 1300 - (i % 3) * 60); c.lineTo(x + 40, 1330); } c.lineTo(920, 1380); c.closePath(); }, '#1a0610', { stroke: null });
    for (let i = 0; i < 16; i++) { const x = 220 + (i * 47) % 680, y = 1290 + (i * 31) % 70; c.fillStyle = '#ff4a2a'; c.fillRect(x, y, 6, 10); }
  });
  st.camada(0.6, c => { for (let i = 0; i < 5; i++) cloud(c, (i * 330 + t * 40) % 1600 - 250, 1450 + (i % 2) * 60, 170, rgba('#ff8a6a', 0.25), { seed: i + 50 }); });
  st.camada(1, c => {
    shape(c, c => { c.moveTo(-300, 1500); c.lineTo(160, 1470); c.lineTo(420, 1490); c.lineTo(700, 1460); c.lineTo(900, 1500); c.lineTo(1000, 1640); c.lineTo(940, 2400); c.lineTo(-300, 2400); c.closePath(); }, '#3a2430');
    line(c, [[160, 1530], [240, 1600], [200, 1700]], '#2a1620', 5); line(c, [[620, 1520], [580, 1620]], '#2a1620', 5);
    for (let i = 0; i < 14; i++) { const k = (t * (0.6 + (i % 4) * 0.2) + i * 0.37) % 1; line(c, [[-100 + k * 1400, 900 + i * 60], [-40 + k * 1400, 900 + i * 60]], '#ffd0c0', 3, 0.25 * Math.sin(k * Math.PI)); }
  });
}
