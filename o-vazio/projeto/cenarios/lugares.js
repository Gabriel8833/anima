// Cenários de "O Vazio": quarto, rua movimentada, festa, sala com TV, prédio à noite, bairro ao amanhecer, colina com nascer do sol.
import { TAU, lerp, clamp, sstep, rng, mix, rgba } from '../motor/base.js';
import { OUT, shape, circle, ellipse, poly, rrect, line, glow, rays, cloud, vgrad } from '../motor/desenho.js';

const W = 1080, H = 1920;
const CINZA = '#7a7e88';
const dz = (cor, k) => mix(cor, CINZA, k); // dessatura

// silhueta de cidade (usada em janelas e no horizonte)
export function skyline(c, x0, base, larg, t, { noite = 1, cor = '#141828', seed = 5, escala = 1 } = {}) {
  const r = rng(seed);
  let x = x0;
  while (x < x0 + larg) {
    const w = (60 + r() * 90) * escala, h = (120 + r() * 380) * escala;
    rrect(c, x, base - h, w, h + 4, 2, cor, { stroke: null });
    if (noite > 0) for (let yy = base - h + 16 * escala; yy < base - 14; yy += 26 * escala) for (let xx = x + 10 * escala; xx < x + w - 12; xx += 22 * escala) if (r() < 0.45) { c.globalAlpha = noite * (0.6 + 0.4 * Math.sin(t * 0.5 + xx + yy)); c.fillStyle = r() < 0.7 ? '#ffd890' : '#bfe0ff'; c.fillRect(xx, yy, 9 * escala, 12 * escala); c.globalAlpha = 1; }
    x += w + 6;
  }
}

// ---------- quarto ----------
// luz: 0 = noite escura, 0.5 = madrugada azul, 1 = manhã com sol
export function quarto(st, t, { luz = 0.4, telaPc = 0, cidade = 1 } = {}) {
  const noite = 1 - luz;
  st.camada(0.9, c => {
    vgrad(c, -400, -200, 1900, 2400, [[0, mix('#e8dcc8', '#1a2034', noite)], [1, mix('#d4c4a8', '#10141e', noite)]]);
    // janela com a cidade
    const wx = 560, wy = 420, ww = 420, wh = 520;
    rrect(c, wx, wy, ww, wh, 8, mix('#bfe4f6', '#0c1426', noite), { lw: 10 });
    c.save(); c.beginPath(); c.rect(wx, wy, ww, wh); c.clip();
    vgrad(c, wx, wy, ww, wh, [[0, mix('#9ad0f0', '#0a1020', noite)], [1, mix('#ffe2b0', '#1e2a48', noite)]]);
    if (luz > 0.6) glow(c, wx + 300, wy + 380, 240, '#fff2c0', (luz - 0.6) * 2);
    skyline(c, wx - 40, wy + wh + 4, ww + 80, t, { noite: noite * cidade, cor: mix('#8a9ab0', '#0e1220', noite), seed: 11, escala: 0.8 });
    c.restore();
    line(c, [[wx + ww / 2, wy], [wx + ww / 2, wy + wh]], OUT, 8); line(c, [[wx, wy + wh / 2], [wx + ww, wy + wh / 2]], OUT, 8);
    // cortina
    for (const s of [0, 1]) shape(c, c => { const x = s ? wx + ww + 10 : wx - 70; c.moveTo(x, wy - 40); c.lineTo(x + 60, wy - 40); c.quadraticCurveTo(x + 40 + Math.sin(t) * 4, wy + 300, x + 66, wy + wh + 80); c.lineTo(x, wy + wh + 80); c.closePath(); }, mix('#6a8ac0', '#1e2a44', noite));
    // pôster e prateleira
    rrect(c, 80, 460, 220, 300, 6, mix('#e86a5a', '#3a2232', noite), { lw: 6 }); circle(c, 190, 580, 60, mix('#ffd23a', '#4a3a2a', noite), { lw: 5 }); poly(c, [[110, 730], [190, 620], [270, 730]], mix('#3a5a9a', '#1a2234', noite), { lw: 5 });
    rrect(c, -260, 880, 280, 18, 4, mix('#8a6a4a', '#2a2018', noite)); for (let i = 0; i < 5; i++) rrect(c, -240 + i * 46, 800 + (i % 2) * 12, 34, 80 - (i % 2) * 12, 4, ['#c84a4a', '#4a7ac8', '#e8a040', '#5aa070', '#9a5ab0'][i], { lw: 4, alpha: 1 - noite * 0.5 });
  });
  st.camada(1, c => {
    vgrad(c, -600, 1480, 2300, 900, [[0, mix('#a87a54', '#1a1a26', noite)], [1, mix('#8a5e3e', '#10101a', noite)]]);
    ellipse(c, 540, 1760, 420, 60, mix('#5a7ab0', '#1a2438', noite), { lw: 5 }); // tapete
  });
  if (luz > 0.7) st.camada(0.95, c => rays(c, 760, 600, 2.0, 4, 1300, 260, '#fff2c0', (luz - 0.7) * 0.8, t, 2));
}
// cama (vista frontal, no mundo) — x de 120 a 760
export function cama(c, noite = 1) {
  rrect(c, 100, 1300, 50, 340, 10, mix('#8a5a3a', '#2a1e1a', noite), { lw: 6 });
  rrect(c, 120, 1500, 660, 120, 14, mix('#e8e4dc', '#3a4058', noite), { lw: 6 });
  rrect(c, 120, 1610, 660, 40, 8, mix('#8a5a3a', '#2a1e1a', noite), { lw: 6 });
}
export function cobertor(c, noite = 1, x0 = 300) { shape(c, c => { c.moveTo(x0, 1500); c.quadraticCurveTo(x0 + 160, 1460, 790, 1480); c.lineTo(790, 1620); c.lineTo(x0 - 10, 1620); c.closePath(); }, mix('#4a7ac8', '#22305a', noite)); }
export function criadoMudo(c, x, t, noite, toca, luzCel) {
  rrect(c, x - 70, 1500, 140, 160, 8, mix('#8a6a4a', '#2a2018', noite), { lw: 6 });
  const sh = toca ? Math.sin(t * 70) * 3 : 0;
  rrect(c, x - 22 + sh, 1474, 44, 26, 6, '#1a1a22', { lw: 4 }); if (luzCel) { rrect(c, x - 18 + sh, 1478, 36, 18, 3, '#bfe0ff', { stroke: null }); glow(c, x, 1470, 160, '#9ad0ff', 0.5); }
  if (toca) for (const s of [-1, 1]) line(c, [[x + s * 34, 1470], [x + s * 50, 1456]], '#bfe0ff', 4);
}
// mesa com computador
export function escrivaninha(c, x, t, { noite = 1, tela = 0, flash = 0 } = {}) {
  rrect(c, x - 40, 1280, 380, 250, 8, '#1a1a22', { lw: 6 }); rrect(c, x - 26, 1294, 352, 222, 4, mix('#2a3448', '#5ab0ff', tela * 0.6 + flash * 0.4), { stroke: null });
  if (tela > 0) { glow(c, x + 150, 1400, 420, mix('#6ab0ff', '#ff6aa0', flash), 0.45 * tela); for (let i = 0; i < 4; i++) rrect(c, x + 10 + i * 80, 1420 - Math.abs(Math.sin(t * 5 + i)) * 60, 50, 50, 6, ['#ff6a6a', '#ffd23a', '#6aff9a', '#ff9a3a'][i], { stroke: null, alpha: tela }); }
  rrect(c, x + 120, 1530, 40, 60, 0, '#1a1a22', { stroke: null });
  rrect(c, x - 140, 1580, 580, 34, 6, mix('#8a6a4a', '#2a2018', noite), { lw: 6 }); for (const xx of [x - 120, x + 400]) rrect(c, xx, 1614, 22, 120, 4, mix('#6a4a30', '#1e1610', noite), { lw: 5 });
}

// ---------- rua movimentada (dia) ----------
// cinza: 0 = colorida, 1 = sem cor (sensação de solidão)
export function rua(st, t, { cinza = 0, cam = 0 } = {}) {
  st.camada(0, c => { vgrad(c, 0, 0, W, H, [[0, dz('#8ac0e8', cinza)], [1, dz('#d8e8f0', cinza)]]); for (let i = 0; i < 3; i++) cloud(c, ((i * 500 + t * 10) % 1700) - 300, 220 + i * 90, 120, dz('#ffffff', cinza * 0.5), { seed: i + 2, alpha: 0.8 }); });
  st.camada(0.45, c => { const r = rng(21); for (let i = 0; i < 12; i++) { const x = -800 + i * 260, h = 500 + r() * 400; rrect(c, x, 1200 - h, 240, h, 4, dz(['#c8b8a8', '#a8b8c8', '#d8c8b0', '#b8a8b8'][i % 4], cinza), { lw: 5 }); for (let k = 0; k < 12; k++) if (r() < 0.7) rrect(c, x + 24 + (k % 3) * 70, 1200 - h + 40 + Math.floor(k / 3) * 90, 44, 56, 3, dz('#5a7a9a', cinza), { lw: 3 }); } });
  st.camada(0.8, c => {
    const lojas = ['#d0603a', '#3a8a6a', '#e8a040', '#5a6ad0', '#c84a7a', '#4a9ab0'];
    for (let i = 0; i < 9; i++) { const x = -900 + i * 380, cor = dz(lojas[i % 6], cinza); rrect(c, x, 1050, 360, 430, 4, dz('#efe6d8', cinza), { lw: 6 }); rrect(c, x + 30, 1220, 300, 230, 4, dz('#bfe0f0', cinza), { lw: 5 }); for (let k = 0; k < 6; k++) poly(c, [[x + k * 60, 1110], [x + k * 60 + 60, 1110], [x + k * 60 + 60, 1170], [x + k * 60 + 30, 1190], [x + k * 60, 1170]], k % 2 ? cor : dz('#f6f2ea', cinza), { lw: 4 }); }
  });
  st.camada(1, c => {
    vgrad(c, -2000, 1480, 5000, 900, [[0, dz('#c8beb0', cinza)], [1, dz('#a89e90', cinza)]]);
    for (let x = -2000; x < 3000; x += 160) line(c, [[x, 1490], [x - 60, 1800]], dz('#b0a698', cinza), 3);
    rrect(c, -2000, 1800, 5000, 30, 0, dz('#8a8478', cinza), { stroke: null });
    for (const x of [-700, 100, 900, 1700]) { rrect(c, x - 8, 1000, 16, 490, 4, dz('#3a4a3a', cinza), { lw: 4 }); circle(c, x, 990, 22, dz('#f6e8b0', cinza), { lw: 4 }); }
  });
}
export function mesaCafe(c, x, y, cinza = 0) { ellipse(c, x, y, 150, 26, dz('#f6f2ea', cinza), { lw: 5 }); rrect(c, x - 8, y + 20, 16, 150, 4, dz('#3a3a3a', cinza), { lw: 4 }); ellipse(c, x, y + 172, 60, 12, dz('#3a3a3a', cinza), { lw: 4 }); for (const dx of [-60, 50]) { rrect(c, x + dx - 16, y - 40, 32, 36, 6, dz('#f6f2ea', cinza), { lw: 4 }); } }

// ---------- festa ----------
export function festa(st, t) {
  st.camada(0, c => { vgrad(c, 0, 0, W, H, [[0, '#120a20'], [1, '#2a1438']]); });
  st.camada(0.6, c => {
    const cores = ['#ff3a8a', '#3ab0ff', '#ffd23a', '#7aff6a'];
    for (let i = 0; i < 4; i++) { const a = Math.sin(t * 1.6 + i * 1.7) * 0.5; c.save(); c.globalCompositeOperation = 'lighter'; c.translate(100 + i * 300, 200); c.rotate(a); const g = c.createLinearGradient(0, 0, 0, 1400); g.addColorStop(0, rgba(cores[i], 0.45)); g.addColorStop(1, rgba(cores[i], 0)); c.fillStyle = g; c.beginPath(); c.moveTo(-20, 0); c.lineTo(20, 0); c.lineTo(220, 1400); c.lineTo(-220, 1400); c.closePath(); c.fill(); c.restore(); }
    circle(c, 540, 260, 60, '#c8c8d8', { lw: 5 }); for (let i = 0; i < 10; i++) { const a = i / 10 * TAU + t * 2; circle(c, 540 + Math.cos(a) * 40, 260 + Math.sin(a) * 30, 7, '#ffffff', { stroke: null, alpha: 0.5 + 0.5 * Math.sin(t * 8 + i) }); }
    // multidão dançando (silhuetas)
    for (let i = 0; i < 12; i++) { const x = -300 + i * 150, j = Math.abs(Math.sin(t * 7 + i * 1.3)) * 30; c.fillStyle = '#0a0612'; c.beginPath(); c.arc(x, 1120 - j, 46, 0, TAU); c.fill(); c.beginPath(); c.roundRect(x - 50, 1160 - j, 100, 360, 30); c.fill(); for (const s of [-1, 1]) { c.save(); c.translate(x + s * 40, 1190 - j); c.rotate(s * (2.4 + Math.sin(t * 7 + i) * 0.4)); c.fillRect(-10, 0, 20, 110); c.restore(); } }
  });
  st.camada(1, c => { vgrad(c, -800, 1480, 2700, 900, [[0, '#2a1a3a'], [1, '#140a1e']]); for (let i = 0; i < 6; i++) ellipse(c, -200 + i * 280, 1600, 90, 14, ['#ff3a8a', '#3ab0ff', '#ffd23a'][i % 3], { stroke: null, alpha: 0.25 + 0.2 * Math.sin(t * 6 + i) }); });
}

// ---------- sala com TV (madrugada) ----------
export function sala(st, t) {
  st.camada(0.9, c => { vgrad(c, -400, -200, 1900, 2400, [[0, '#121624'], [1, '#0a0c14']]); rrect(c, 640, 1060, 420, 250, 8, '#0a0a10', { lw: 6 }); rrect(c, 654, 1074, 392, 222, 4, ['#5a8aff', '#ff6a5a', '#6ad08a', '#ffd23a'][Math.floor(t * 2.5) % 4], { stroke: null }); glow(c, 850, 1180, 600, '#8ab0ff', 0.45); rrect(c, 700, 1310, 300, 160, 6, '#1a1a22', { lw: 5 }); });
  st.camada(1, c => { vgrad(c, -600, 1480, 2300, 900, [[0, '#14141e'], [1, '#0a0a12']]); });
}
export function sofa(c, x) { rrect(c, x - 280, 1370, 560, 140, 30, '#3a3a5a', { lw: 6 }); rrect(c, x - 300, 1460, 600, 150, 20, '#4a4a6a', { lw: 6 }); for (const s of [-1, 1]) rrect(c, x + s * 300 - 40, 1420, 80, 190, 24, '#3a3a5a', { lw: 6 }); }

// ---------- prédio à noite (vista de fora) ----------
// janela do protagonista fica escura no meio de janelas acesas
export const JANELA = { x: 540, y: 1300, w: 300, h: 360 };
export function predio(st, t, { dentro } = {}) {
  st.camada(0, c => { vgrad(c, 0, 0, W, H, [[0, '#04060e'], [1, '#141a30']]); const r = rng(8); c.fillStyle = '#ffffff'; for (let i = 0; i < 60; i++) { c.globalAlpha = 0.2 + r() * 0.5; c.fillRect(r() * W, r() * 900, 2, 2); } c.globalAlpha = 1; });
  st.camada(0.3, c => skyline(c, -1600, 2000, 4300, t, { noite: 1, cor: '#0c1020', seed: 2, escala: 1.6 }));
  st.camada(1, c => {
    rrect(c, -1400, -400, 3900, 3600, 0, '#1e2234', { lw: 8 });
    const r = rng(14);
    for (let row = -3; row < 8; row++) for (let col = -5; col < 7; col++) {
      const x = JANELA.x - JANELA.w / 2 + col * 400, y = JANELA.y - JANELA.h / 2 + row * 480;
      const minha = row === 0 && col === 0, acesa = !minha && r() < 0.7;
      rrect(c, x - 14, y - 14, JANELA.w + 28, JANELA.h + 28, 4, '#2a3048', { stroke: null });
      rrect(c, x, y, JANELA.w, JANELA.h, 4, minha ? '#0a0e1a' : acesa ? ['#ffd890', '#ffe8b0', '#bfe0ff', '#ffc070'][Math.floor(r() * 4)] : '#141a2a', { lw: 5 });
      if (acesa && r() < 0.5) { c.fillStyle = 'rgba(40,24,20,0.6)'; const px = x + 60 + r() * 160; c.beginPath(); c.arc(px, y + 170, 30, 0, TAU); c.fill(); c.beginPath(); c.roundRect(px - 40, y + 200, 80, 160, 20); c.fill(); }
      if (minha && dentro) { c.save(); c.beginPath(); c.rect(x, y, JANELA.w, JANELA.h); c.clip(); dentro(c); c.restore(); }
      line(c, [[x + JANELA.w / 2, y], [x + JANELA.w / 2, y + JANELA.h]], '#2a3048', 6);
    }
  });
}

// ---------- bairro ao amanhecer ----------
// sol: 0 = azul antes do sol, 1 = dourado
export function bairro(st, t, { sol = 0.5 } = {}) {
  st.camada(0, c => { vgrad(c, 0, 0, W, H, [[0, mix('#2a3a6a', '#7ab0e0', sol)], [0.6, mix('#8a7aa8', '#ffd8a0', sol)], [1, mix('#e8a890', '#ffe8c0', sol)]]); glow(c, 820, lerp(1300, 900, sol), 600, '#ffcf80', 0.3 + sol * 0.5); circle(c, 820, lerp(1300, 900, sol), 70, mix('#ffb070', '#fff2c8', sol), { stroke: null }); });
  st.camada(0.4, c => skyline(c, -800, 1250, 2700, t, { noite: 0.4 * (1 - sol), cor: mix('#4a4a7a', '#c8a890', sol), seed: 33, escala: 0.9 }));
  st.camada(0.8, c => {
    const casas = ['#e8c0a0', '#a8c8b0', '#f0d890', '#c8b0d8', '#e8a8a0'];
    for (let i = 0; i < 7; i++) { const x = -700 + i * 400, cor = mix(mix(casas[i % 5], '#3a3a5a', 0.4), casas[i % 5], sol); rrect(c, x, 1150, 340, 330, 6, cor, { lw: 6 }); poly(c, [[x - 30, 1160], [x + 170, 1020], [x + 370, 1160]], mix('#5a3a4a', '#b0563a', sol), { lw: 6 }); rrect(c, x + 40, 1230, 90, 90, 4, (i % 2) ? '#ffe0a0' : mix('#3a4a6a', '#9ad0f0', sol), { lw: 5 }); rrect(c, x + 200, 1300, 90, 180, 6, mix('#4a3a3a', '#7a4a3a', sol), { lw: 5 }); for (let k = 0; k < 3; k++) cloud(c, x + 40 + k * 90, 1470, 50, mix('#2a4a3a', '#5aa070', sol), { seed: i + k }); }
  });
  st.camada(1, c => { vgrad(c, -2000, 1480, 5000, 900, [[0, mix('#8a8aa0', '#e0c8a8', sol)], [1, mix('#6a6a80', '#c8a888', sol)]]); for (let x = -2000; x < 3000; x += 180) line(c, [[x, 1490], [x - 50, 1800]], mix('#7a7a90', '#d0b898', sol), 3); });
  if (sol > 0.3) st.camada(0.95, c => rays(c, 820, 900, 3.2, 5, 1500, 380, '#fff2c0', (sol - 0.3) * 0.35, t, 4));
}
export function banco(c, x, y, sol = 1) { rrect(c, x - 200, y - 110, 400, 26, 6, mix('#5a3a2a', '#9a6a3a', sol), { lw: 5 }); rrect(c, x - 200, y - 50, 400, 30, 6, mix('#5a3a2a', '#9a6a3a', sol), { lw: 5 }); for (const s of [-1, 1]) rrect(c, x + s * 170 - 8, y - 20, 16, 100, 3, '#3a3a3a', { lw: 4 }); }

// ---------- colina com nascer do sol ----------
export function colina(st, t, { sol = 1, sx = 820 } = {}) {
  const sy = lerp(1300, 1000, sol);
  st.camada(0, c => {
    vgrad(c, 0, 0, W, H, [[0, mix('#3a4a80', '#6aa0d8', sol)], [0.45, mix('#c88aa0', '#ffc890', sol)], [0.7, '#ffd8a0'], [1, '#ffe8c8']]);
    glow(c, sx, sy, 900, '#ffcf70', 0.45 + 0.35 * sol); circle(c, sx, sy, 110, '#fff4d0', { stroke: null }); glow(c, sx, sy, 260, '#ffffff', 0.5);
    for (let i = 0; i < 4; i++) cloud(c, ((i * 380 + t * 8) % 1600) - 300, 380 + i * 120, 140, rgba('#ffe8d0', 0.6), { seed: i + 7 });
    // pássaros
    for (let i = 0; i < 5; i++) { const x = ((t * 40 + i * 70) % 1400) - 200, y = 620 + i * 26 + Math.sin(t * 2 + i) * 10, f = Math.sin(t * 10 + i) * 8; line(c, [[x - 14, y - f], [x, y], [x + 14, y - f]], '#3a2a3a', 3); }
  });
  st.camada(0.15, c => skyline(c, -600, 1330, 2400, t, { noite: 0.15, cor: mix('#6a5a8a', '#b08a90', sol), seed: 4, escala: 0.7 }));
  st.camada(0.25, c => rays(c, sx, sy, -Math.PI / 2, 9, 1400, TAU, '#fff2c0', 0.18 * sol, t, 6));
  st.camada(1, c => {
    shape(c, c => { c.moveTo(-1500, 1560); c.quadraticCurveTo(540, 1420, 2600, 1560); c.lineTo(2600, 3000); c.lineTo(-1500, 3000); c.closePath(); }, mix('#3a5a3a', '#6a9a4a', sol));
    const r = rng(5); for (let i = 0; i < 60; i++) { const x = -1400 + r() * 3900, y = 1560 + r() * 400; line(c, [[x, y], [x + 4, y - 22 - r() * 10]], mix('#2a4a2a', '#4a7a3a', sol), 4); }
    // árvore solitária
    rrect(c, 1180, 1240, 36, 320, 8, '#4a3020', { lw: 5 }); for (const [dx, dy, s] of [[-60, -40, 110], [60, -60, 120], [0, -140, 130]]) cloud(c, 1198 + dx, 1240 + dy, s, mix('#2a4a2a', '#4a8a3a', sol), { seed: 3 + dx });
  });
}
