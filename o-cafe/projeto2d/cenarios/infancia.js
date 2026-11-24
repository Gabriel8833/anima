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

// ================== cenários extras de "Ego" ==================
// balão de fala com rabiscos (sem texto) ou com texto curto
export function balaoFala(c, x, y, w, h, a, { cauda = -1, cor = '#ffffff', texto = null, tam = 34, cortes = 0 } = {}) {
  if (a <= 0.01) return;
  c.save(); c.globalAlpha *= a; c.translate(x, y); c.scale(0.6 + 0.4 * Math.min(1, a * 1.4), 0.6 + 0.4 * Math.min(1, a * 1.4));
  shape(c, c => { c.roundRect(-w / 2, -h / 2, w, h, h / 2.4); c.moveTo(cauda * w * 0.15, h / 2 - 2); c.lineTo(cauda * w * 0.32, h / 2 + 40); c.lineTo(cauda * w * 0.02, h / 2 - 2); }, cor, { lw: 5 });
  if (texto) { c.font = `900 ${tam}px Inter, sans-serif`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#2b1f2a'; c.fillText(texto, 0, 2); }
  else for (let i = 0; i < 2; i++) line(c, [[-w / 2 + 30, -12 + i * 24], [w / 2 - 30 - i * 40, -12 + i * 24]], '#8a8a9a', 6);
  if (cortes > 0) { c.globalAlpha *= cortes; line(c, [[-w / 2, -h / 2], [w / 2, h / 2]], '#d02a2a', 8); line(c, [[w / 2, -h / 2], [-w / 2, h / 2]], '#d02a2a', 8); }
  c.restore();
}
// espelho de parede (moldura + vidro). desenha o reflexo via callback recortado
export function espelho(c, x, y, w, h, t, reflexo, { frio = 0 } = {}) {
  rrect(c, x - 16, y - 16, w + 32, h + 32, 24, mix('#d8b060', '#8a8aa0', frio), { lw: 7 });
  c.save(); c.beginPath(); c.roundRect(x, y, w, h, 16); c.clip();
  vgrad(c, x, y, w, h, [[0, mix('#cfe6f0', '#3a4660', frio)], [1, mix('#a8c8d8', '#232a3c', frio)]]);
  reflexo?.(c);
  c.globalAlpha = 0.25; c.fillStyle = '#ffffff'; c.beginPath(); c.moveTo(x + 20, y); c.lineTo(x + 90, y); c.lineTo(x + 20, y + 140); c.closePath(); c.fill();
  c.restore();
}
export function pia(c, x, y, frio = 0) { rrect(c, x - 200, y, 400, 40, 10, mix('#f6f2ea', '#8a92a8', frio), { lw: 6 }); rrect(c, x - 170, y + 40, 340, 180, 10, mix('#c8b8a0', '#3a3e50', frio), { lw: 6 }); line(c, [[x, y], [x, y - 40], [x + 30, y - 40]], '#9a9aaa', 8); }
// banheiro (parede de azulejos)
export function banheiro(st, t, { frio = 0 } = {}) {
  st.camada(0.9, c => { vgrad(c, -400, -200, 1900, 2400, [[0, mix('#e8f0f0', '#2a3248', frio)], [1, mix('#c8dce0', '#161c2c', frio)]]); c.strokeStyle = mix('#b8ccd0', '#20283a', frio); c.lineWidth = 3; for (let x = -400; x < 1500; x += 90) { c.beginPath(); c.moveTo(x, -200); c.lineTo(x, 2200); c.stroke(); } for (let y = -200; y < 2200; y += 90) { c.beginPath(); c.moveTo(-400, y); c.lineTo(1500, y); c.stroke(); } if (frio < 0.5) glow(c, 540, 300, 500, '#fff6e0', 0.4); else { rrect(c, 470, 160, 140, 30, 10, '#bfe0ff', { lw: 4 }); glow(c, 540, 200, 600, '#9ad0ff', 0.3); } });
  st.camada(1, c => vgrad(c, -600, 1480, 2300, 900, [[0, mix('#d8d0c8', '#22263a', frio)], [1, mix('#b8b0a8', '#14161e', frio)]]));
}
// salão enorme e vazio (solidão)
export function salaoVazio(st, t) {
  st.camada(0.3, c => { vgrad(c, -1500, -1000, 4000, 4000, [[0, '#2a3044'], [1, '#141824']]); for (let i = 0; i < 6; i++) { const x = -900 + i * 520; rrect(c, x, 0, 260, 1300, 6, '#3a4a6a', { lw: 6 }); vgrad(c, x + 10, 10, 240, 1280, [[0, '#4a6a9a'], [1, '#2a3a5a']]); line(c, [[x + 130, 0], [x + 130, 1300]], '#2a3044', 8); } });
  st.camada(0.7, c => { for (let i = 0; i < 6; i++) { const x = -1100 + i * 600; c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha = 0.12; c.fillStyle = '#9ac0ff'; c.beginPath(); c.moveTo(x, 0); c.lineTo(x + 300, 0); c.lineTo(x + 600, 1700); c.lineTo(x + 200, 1700); c.closePath(); c.fill(); c.restore(); } });
  st.camada(1, c => { vgrad(c, -3000, 1480, 7000, 2000, [[0, '#3a4258'], [1, '#1a1e2a']]); for (let x = -3000; x < 4000; x += 300) line(c, [[x, 1490], [540 + (x - 540) * 3, 3400]], '#2e3448', 3); for (let i = 0; i < 6; i++) { const x = -1100 + i * 600; c.save(); c.globalAlpha = 0.1; c.fillStyle = '#bfd8ff'; c.beginPath(); c.moveTo(x + 200, 1700); c.lineTo(x + 600, 1700); c.lineTo(x + 900, 2600); c.lineTo(x + 300, 2600); c.closePath(); c.fill(); c.restore(); } });
}

// ================== cenários de "A prisão dentro de você" ==================
// vagão de trem lotado (janelas com luzes passando)
export function trem(st, t) {
  st.camada(0.9, c => {
    vgrad(c, -400, -200, 1900, 2400, [[0, '#4a5248'], [1, '#2a302a']]);
    for (let i = 0; i < 4; i++) { const x = -260 + i * 420; rrect(c, x, 620, 340, 400, 20, '#0c100e', { lw: 8 }); c.save(); c.beginPath(); c.roundRect(x, 620, 340, 400, 20); c.clip(); for (let k = 0; k < 4; k++) { const lx = ((k * 300 - t * 2400) % 1200 + 1200) % 1200 - 200; c.fillStyle = 'rgba(255,220,140,0.6)'; c.fillRect(x + lx, 640 + k * 90, 120, 6); } c.restore(); }
    rrect(c, -400, 560, 1900, 20, 0, '#8a8a80', { stroke: null });
    for (let i = 0; i < 10; i++) { const x = -300 + i * 190; line(c, [[x, 560], [x, 640]], '#9a9a90', 4); circle(c, x, 660, 20, null, { stroke: '#9a9a90', lw: 6 }); }
    rrect(c, -400, 300, 1900, 80, 0, '#d8d0a0', { stroke: null, alpha: 0.5 });
  });
  st.camada(1, c => { vgrad(c, -600, 1480, 2300, 900, [[0, '#3a3a34'], [1, '#22221e']]); for (const x of [120, 960]) rrect(c, x - 10, 300, 20, 1400, 6, '#b8b8a8', { lw: 4 }); });
}
// escritório: baias, monitores, luz fluorescente
export function escritorio(st, t) {
  st.camada(0.6, c => { vgrad(c, -1200, -400, 3400, 2800, [[0, '#6a7262'], [1, '#3e443a']]); for (let i = 0; i < 8; i++) { const x = -800 + i * 340; rrect(c, x, 140, 240, 24, 6, '#e8f0d8', { stroke: null }); glow(c, x + 120, 160, 220, '#e8f8d0', 0.35); }
    for (let r = 0; r < 3; r++) for (let i = 0; i < 9; i++) { const x = -900 + i * 300 + r * 60, y = 900 + r * 140; rrect(c, x, y, 250, 120, 4, '#7a8070', { lw: 4 }); rrect(c, x + 80, y - 70, 90, 66, 4, '#1a1e1a', { lw: 3 }); rrect(c, x + 86, y - 64, 78, 54, 2, '#7ab08a', { stroke: null, alpha: 0.6 }); } });
  st.camada(1, c => { vgrad(c, -1500, 1480, 4000, 900, [[0, '#4a4e44'], [1, '#2c2e28']]); });
}
export function mesaEscritorio(c, x) { rrect(c, x - 280, 1540, 560, 34, 4, '#8a8a7a', { lw: 5 }); rrect(c, x - 90, 1400, 180, 130, 6, '#1a1e1a', { lw: 5 }); rrect(c, x - 80, 1410, 160, 110, 3, '#8ac0a0', { stroke: null, alpha: 0.7 }); glow(c, x, 1460, 200, '#9ad0b0', 0.3); for (const s of [-1, 1]) rrect(c, x + s * 250 - 10, 1574, 20, 150, 4, '#5a5a50', { lw: 4 }); }
// apartamento de catálogo, vazio e frio
export function apartamento(st, t, { noite = 0.4 } = {}) {
  st.camada(0.9, c => {
    vgrad(c, -400, -200, 1900, 2400, [[0, mix('#c8c4b0', '#262a26', noite)], [1, mix('#a8a490', '#161a16', noite)]]);
    rrect(c, 600, 460, 380, 520, 6, mix('#9ab0a8', '#0e1412', noite), { lw: 8 }); line(c, [[790, 460], [790, 980]], '#2b1f2a', 6);
    rrect(c, 80, 760, 360, 40, 4, mix('#e8e4d8', '#3a3c36', noite), { lw: 5 }); for (let i = 0; i < 3; i++) rrect(c, 110 + i * 110, 680, 70, 80, 4, mix('#f0ece0', '#4a4c46', noite), { lw: 4 }); // estante "perfeita"
    rrect(c, 120, 1100, 300, 200, 6, mix('#b8b4a0', '#2a2c28', noite), { lw: 5 }); // quadro sem graça
  });
  st.camada(1, c => { vgrad(c, -600, 1480, 2300, 900, [[0, mix('#8a8470', '#1e201c', noite)], [1, mix('#6a6450', '#121410', noite)]]); });
}
// porão clandestino: concreto, canos, lâmpada balançando
export function porao(st, t, { balanco = 1, vermelho = 0 } = {}) {
  const lx = 540 + Math.sin(t * 1.6) * 120 * balanco;
  st.camada(0.85, c => {
    vgrad(c, -500, -300, 2100, 2600, [[0, '#1a1e18'], [1, '#0c0e0a']]);
    for (let y = 300; y < 1500; y += 110) line(c, [[-500, y], [1600, y]], '#22261e', 3);
    for (const y of [220, 300]) rrect(c, -500, y, 2100, 34, 16, '#3a3a30', { lw: 4 });
    // escada à esquerda
    for (let i = 0; i < 8; i++) rrect(c, -200 + i * 60, 600 + i * 110, 200, 24, 2, '#3a3a32', { lw: 4 });
    line(c, [[lx, 0], [lx, 520]], '#111', 3); circle(c, lx, 540, 22, '#ffe8a0', { lw: 4 });
    glow(c, lx, 560, 900, mix('#ffd88a', '#ff3a2a', vermelho), 0.55);
  });
  st.camada(1, c => { vgrad(c, -800, 1480, 2700, 900, [[0, '#2a2a22'], [1, '#121210']]); const g = c.createRadialGradient(lx, 1600, 50, lx, 1600, 700); g.addColorStop(0, 'rgba(255,220,150,0.25)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(-800, 1480, 2700, 900); });
}
// TV velha (quebra com o golpe)
export function tvVelha(c, x, y, s, quebra = 0, t = 0) {
  c.save(); c.translate(x, y); c.scale(s, s);
  rrect(c, -110, -170, 220, 170, 16, '#5a4a3a', { lw: 6 }); rrect(c, -90, -150, 150, 120, 20, quebra > 0 ? '#1a1a1a' : '#5a7a6a', { lw: 5 }); for (const k of [0, 1]) circle(c, 84, -130 + k * 40, 10, '#2a2a2a', { lw: 3 });
  if (quebra > 0) { for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + 0.3; line(c, [[-15, -90], [-15 + Math.cos(a) * 80, -90 + Math.sin(a) * 60]], '#d8e8e0', 3); } const r = rng(3); for (let i = 0; i < 14; i++) { const u = clamp(quebra * 1.5); const vx = (r() - 0.5) * 500, vy = -r() * 400; c.save(); c.globalAlpha = 1 - u; c.translate(-15 + vx * u, -90 + vy * u + 500 * u * u); c.rotate(i + u * 6); poly(c, [[-8, -6], [10, -2], [2, 10]], '#c8e0d8', { lw: 2 }); c.restore(); } }
  c.restore();
}
// outdoor de consumo
export function outdoor(c, x, y, w, h, txt, sub, cor = '#d8302a') { rrect(c, x, y, w, h, 6, '#1a1a1a', { lw: 6 }); rrect(c, x + 10, y + 10, w - 20, h - 20, 4, '#e8dcb0', { stroke: null }); c.font = `900 ${h * 0.32}px Inter`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = cor; c.fillText(txt, x + w / 2, y + h * 0.42); c.font = `700 ${h * 0.14}px Inter`; c.fillStyle = '#2a2a2a'; c.fillText(sub, x + w / 2, y + h * 0.76); glow(c, x + w / 2, y + h / 2, w * 0.7, '#fff2c0', 0.15); }
// rachaduras sobre um espelho
export function rachaduras(c, cx, cy, a = 1, seed = 2) { if (a <= 0.01) return; const r = rng(seed); c.save(); c.globalAlpha *= a; c.strokeStyle = '#e8f0f0'; c.lineWidth = 3; for (let i = 0; i < 9; i++) { let x = cx, y = cy, an = i / 9 * TAU + r() * 0.4; c.beginPath(); c.moveTo(x, y); for (let k = 0; k < 5; k++) { x += Math.cos(an) * (30 + r() * 50); y += Math.sin(an) * (30 + r() * 50); an += (r() - 0.5) * 0.8; c.lineTo(x, y); } c.stroke(); } c.beginPath(); c.arc(cx, cy, 18, 0, TAU); c.stroke(); c.restore(); }

// ================== cidade brasileira ==================
// morro com casinhas coloridas ao fundo, prédios, comércio com placas e fios no poste
export function cidadeBR(st, t, { hora = 0.6, morro = 1 } = {}) {
  // hora: 0 madrugada azul, 0.5 amanhecer, 1 dia
  st.camada(0, c => { vgrad(c, 0, 0, W, H, [[0, mix('#2a3a6a', '#7ac0f0', hora)], [0.6, mix('#e8a080', '#cfe8f6', hora)], [1, mix('#ffd0a0', '#f0f4f0', hora)]]); if (hora < 0.8) glow(c, 860, 1000, 600, '#ffc070', 0.5 * (1 - hora)); });
  if (morro) st.camada(0.3, c => {
    shape(c, c => { c.moveTo(-1200, 1300); c.quadraticCurveTo(-300, 700, 500, 820); c.quadraticCurveTo(1200, 900, 2200, 1300); c.closePath(); }, mix('#4a5a3a', '#6a8a4a', hora), { lw: 5 });
    const r = rng(17), cores = ['#e8705a', '#f0c040', '#5ab0d8', '#8ad070', '#e88ab0', '#f6f2ea', '#c8a070'];
    for (let i = 0; i < 70; i++) { const x = -900 + r() * 2900, top = 820 + Math.abs(x - 400) * 0.33; const y = top + r() * (1300 - top); const w = 60 + r() * 40, h = 46 + r() * 30; if (y + h > 1310) continue; rrect(c, x, y, w, h, 2, mix(mix(cores[i % 7], '#2a2a3a', 0.35), cores[i % 7], hora), { lw: 3 }); rrect(c, x + w * 0.3, y + h * 0.3, w * 0.3, h * 0.35, 1, hora < 0.4 && r() < 0.5 ? '#ffd890' : '#3a3a44', { stroke: null }); }
  });
  st.camada(0.55, c => { const r = rng(23); for (let i = 0; i < 9; i++) { const x = -800 + i * 300, h = 220 + r() * 220; rrect(c, x, 1260 - h, 260, h, 4, mix('#5a6070', '#c8c4bc', hora), { lw: 4 }); for (let k = 0; k < 10; k++) if (r() < 0.7) rrect(c, x + 26 + (k % 3) * 76, 1260 - h + 30 + Math.floor(k / 3) * 80, 44, 50, 2, hora < 0.4 && r() < 0.6 ? '#ffd890' : mix('#2a3040', '#8ab0c8', hora), { lw: 2 }); } });
  st.camada(0.85, c => {
    const placas = [['PADARIA', '#e8a040'], ['FARMÁCIA', '#3aa060'], ['MERCADINHO', '#d04a3a'], ['LOJA DO ZÉ', '#4a7ad0'], ['LANCHES', '#e8c040'], ['CELULARES', '#8a4ad0']];
    for (let i = 0; i < 10; i++) { const x = -1100 + i * 380, [nome, cor] = placas[i % 6]; rrect(c, x, 1100, 360, 380, 4, mix('#8a8070', '#efe4d0', hora), { lw: 6 }); rrect(c, x + 20, 1120, 320, 70, 6, mix(cor, '#3a3a3a', 0.4 * (1 - hora)), { lw: 4 }); c.font = '900 40px Inter'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#ffffff'; c.fillText(nome, x + 180, 1157); rrect(c, x + 40, 1230, 280, 250, 4, mix('#3a4050', '#9ab8c8', hora), { lw: 5 }); if (i % 3 === 1) { rrect(c, x + 60, 1260, 120, 80, 3, '#fff6d0', { lw: 3 }); c.font = '900 22px Inter'; c.fillStyle = '#d02a2a'; c.fillText('VAGA', x + 120, 1290); c.fillText('DE EMPREGO', x + 120, 1318); } }
    // postes e fios (a cara da cidade)
    for (let i = 0; i < 6; i++) { const x = -900 + i * 640; rrect(c, x - 9, 860, 18, 620, 3, '#5a5a5a', { lw: 3 }); }
    for (let k = 0; k < 4; k++) shape(c, cc => { cc.moveTo(-1000, 880 + k * 14); for (let i = 0; i < 6; i++) { const x = -900 + i * 640; cc.quadraticCurveTo(x - 320, 960 + k * 14, x, 880 + k * 14); } }, null, { stroke: '#2a2a2a', lw: 2 });
  });
  st.camada(1, c => { vgrad(c, -3000, 1480, 7000, 900, [[0, '#7a7a80'], [1, '#5a5a62']]); rrect(c, -3000, 1480, 7000, 60, 0, '#b8b0a4', { stroke: null }); for (let x = -3000; x < 4000; x += 200) rrect(c, x, 1700, 100, 12, 2, '#e8e0c0', { stroke: null }); });
}
// ônibus lotado (rostos nas janelas)
export function onibus(c, x, y, s, t, { lotado = 1, flip = 1 } = {}) {
  c.save(); c.translate(x, y); c.scale(s * flip, s);
  rrect(c, -520, -330, 1040, 300, 26, '#e8e0d0', { lw: 7 }); rrect(c, -520, -170, 1040, 50, 0, '#d84a2a', { stroke: null }); rrect(c, -520, -110, 1040, 18, 0, '#3a7ad0', { stroke: null });
  rrect(c, 380, -310, 120, 50, 6, '#1a1a1a', { lw: 4 }); c.save(); c.translate(440, -285); c.scale(flip, 1); c.font = '900 28px Inter'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#ffb020'; c.fillText('CENTRO', 0, 0); c.restore();
  const r = rng(6);
  for (let i = 0; i < 6; i++) { const wx = -480 + i * 140; rrect(c, wx, -300, 120, 110, 8, '#9ac0d8', { lw: 5 }); c.save(); c.beginPath(); c.roundRect(wx, -300, 120, 110, 8); c.clip(); for (let k = 0; k < (lotado ? 3 : 1); k++) { const fx = wx + 24 + k * 36 + Math.sin(t * 3 + i + k) * 3; circle(c, fx, -230 + (k % 2) * 10, 26, ['#8a5a3a', '#e8b890', '#c8906a', '#f2cfae'][(i + k) % 4], { lw: 3 }); circle(c, fx, -262 + (k % 2) * 10, 22, ['#1a1210', '#4a2a18', '#2a1a12'][(i + k) % 3], { stroke: null }); } c.restore(); }
  rrect(c, 360, -240, 90, 200, 6, '#6a8aa0', { lw: 5 });
  for (const wx of [-340, 300]) { circle(c, wx, -30, 54, '#1a1a1a', { lw: 5 }); circle(c, wx, -30, 22, '#8a8a8a', { lw: 3 }); }
  c.restore();
}
// barraca de vendedor ambulante
export function barraca(c, x, y, t) { rrect(c, x - 150, y - 130, 300, 130, 6, '#8a6a4a', { lw: 5 }); for (let i = 0; i < 9; i++) circle(c, x - 120 + (i % 5) * 60, y - 150 - Math.floor(i / 5) * 30, 22, ['#f0a020', '#e84a2a', '#8ac040'][i % 3], { lw: 3 }); line(c, [[x, y - 130], [x, y - 360]], '#5a5a5a', 6); shape(c, c => { c.moveTo(x - 200, y - 330); c.quadraticCurveTo(x, y - 440, x + 200, y - 330); c.closePath(); }, '#e8c040', { lw: 5 }); for (let k = 0; k < 4; k++) shape(c, c => { c.moveTo(x - 200 + k * 100, y - 330); c.quadraticCurveTo(x - 150 + k * 100, y - 390, x - 100 + k * 100, y - 330); }, null, { stroke: '#d0302a', lw: 4 }); }
// moto
export function moto(c, x, y, s, { cor = '#d02a2a', flip = 1, brilho = 0 } = {}) {
  c.save(); c.translate(x, y); c.scale(s * flip, s);
  for (const wx of [-150, 150]) { circle(c, wx, -60, 60, '#1a1a1a', { lw: 6 }); circle(c, wx, -60, 26, '#9a9aa2', { lw: 4 }); }
  shape(c, c => { c.moveTo(-150, -60); c.lineTo(-60, -150); c.lineTo(60, -150); c.lineTo(150, -60); c.lineTo(40, -90); c.closePath(); }, cor, { lw: 5 });
  rrect(c, -100, -190, 150, 44, 18, '#1a1a1a', { lw: 4 }); rrect(c, 40, -200, 80, 60, 20, cor, { lw: 5 }); line(c, [[110, -190], [150, -250], [190, -250]], '#2a2a2a', 8); circle(c, 170, -200, 16, '#fff6c0', { lw: 3 });
  if (brilho > 0) for (let i = 0; i < 3; i++) { c.save(); c.globalAlpha = brilho; c.translate(-80 + i * 90, -230 - i * 20); line(c, [[-10, 0], [10, 0]], '#ffffff', 4); line(c, [[0, -10], [0, 10]], '#ffffff', 4); c.restore(); }
  c.restore();
}
// quarto simples do Rafael (parede descascada, goteira, colchão)
export function quartoSimples(st, t, { luz = 0.5 } = {}) {
  const n = 1 - luz;
  st.camada(0.9, c => {
    vgrad(c, -400, -200, 1900, 2400, [[0, mix('#d8c8a8', '#2a2836', n)], [1, mix('#b8a888', '#18161e', n)]]);
    for (const [x, y, w, h] of [[120, 520, 200, 120], [700, 860, 160, 200], [300, 1180, 220, 90]]) shape(c, c => { c.moveTo(x, y); c.lineTo(x + w, y + 10); c.lineTo(x + w - 30, y + h); c.lineTo(x + 20, y + h - 10); c.closePath(); }, mix('#a89070', '#1e1c26', n), { lw: 3 });
    rrect(c, 600, 460, 300, 340, 6, mix('#9ac8e8', '#101828', n), { lw: 8 }); line(c, [[750, 460], [750, 800]], '#2b1f2a', 6);
    rrect(c, 120, 900, 300, 26, 4, mix('#8a6a4a', '#2a2018', n)); for (let i = 0; i < 3; i++) rrect(c, 140 + i * 90, 840, 60, 60, 4, ['#e8e0d0', '#d03a34', '#3a6ad0'][i], { lw: 3, alpha: 0.8 });
    // conta de luz presa na parede
    rrect(c, 460, 1000, 130, 160, 4, '#f6f2ea', { lw: 3 }); c.font = '900 22px Inter'; c.textAlign = 'center'; c.fillStyle = '#d02a2a'; c.fillText('CONTA', 525, 1050); c.fillText('DE LUZ', 525, 1076); c.fillStyle = '#2b1f2a'; c.fillText('VENCIDA', 525, 1120);
  });
  st.camada(1, c => { vgrad(c, -600, 1480, 2300, 900, [[0, mix('#8a7a64', '#1e1c24', n)], [1, mix('#6a5a46', '#121018', n)]]); rrect(c, 640, 1660, 90, 70, 10, '#5a7ab0', { lw: 4 }); const u = (t * 1.2) % 1; circle(c, 685, 1100 + u * 560, 7, '#9ad0ff', { stroke: null, alpha: 1 - u * 0.3 }); });
}
export function colchao(c, x, n = 0.5) { rrect(c, x - 300, 1560, 600, 90, 20, mix('#c8c0d8', '#3a3848', n), { lw: 6 }); rrect(c, x - 280, 1530, 160, 50, 20, mix('#f6f2ea', '#4a4858', n), { lw: 5 }); }
// card de post de rede social (tipo: moto, viagem, casa, formatura, carro)
export function post(c, x, y, w, tipo, { nome = '', texto = '', curtidas = 0, rot = 0, a = 1 } = {}) {
  if (a <= 0.01) return;
  const h = w * 1.25; c.save(); c.globalAlpha *= a; c.translate(x, y); c.rotate(rot);
  rrect(c, -w / 2, -h / 2, w, h, 18, '#ffffff', { lw: 4 });
  circle(c, -w / 2 + 40, -h / 2 + 40, 22, ['#8a5a3a', '#e8b890', '#c8906a', '#f2cfae', '#6a4a3a'][nome.length % 5], { lw: 3 });
  c.font = `800 ${w * 0.065}px Inter`; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillStyle = '#2b1f2a'; c.fillText(nome, -w / 2 + 74, -h / 2 + 40);
  const ix = -w / 2 + 16, iy = -h / 2 + 76, iw = w - 32, ih = h * 0.62;
  c.save(); c.beginPath(); c.roundRect(ix, iy, iw, ih, 10); c.clip();
  const cx = ix + iw / 2, cy = iy + ih / 2;
  if (tipo === 'viagem') { vgrad(c, ix, iy, iw, ih, [[0, '#4ab0f0'], [0.6, '#9ae0f0'], [0.61, '#2ac0c0'], [1, '#f0e0a0']]); circle(c, cx + iw * 0.3, iy + ih * 0.2, iw * 0.1, '#fff6a0', { stroke: null }); line(c, [[cx - iw * 0.3, cy + ih * 0.3], [cx - iw * 0.25, cy - ih * 0.1]], '#6a4a2a', 8); }
  else if (tipo === 'casa') { vgrad(c, ix, iy, iw, ih, [[0, '#9ad0f0'], [1, '#d8f0d0']]); rrect(c, cx - iw * 0.25, cy - ih * 0.05, iw * 0.5, ih * 0.4, 4, '#f0d890', { lw: 4 }); poly(c, [[cx - iw * 0.32, cy - ih * 0.05], [cx, cy - ih * 0.35], [cx + iw * 0.32, cy - ih * 0.05]], '#d0603a', { lw: 4 }); }
  else if (tipo === 'formatura') { vgrad(c, ix, iy, iw, ih, [[0, '#6a5ad0'], [1, '#d8c8f0']]); poly(c, [[cx - iw * 0.25, cy], [cx, cy - ih * 0.15], [cx + iw * 0.25, cy], [cx, cy + ih * 0.12]], '#1a1a22', { lw: 3 }); line(c, [[cx + iw * 0.2, cy], [cx + iw * 0.22, cy + ih * 0.25]], '#ffd23a', 4); }
  else if (tipo === 'carro') { vgrad(c, ix, iy, iw, ih, [[0, '#f0b060'], [1, '#f0e0c0']]); rrect(c, cx - iw * 0.35, cy, iw * 0.7, ih * 0.2, 14, '#2a2a3a', { lw: 4 }); rrect(c, cx - iw * 0.2, cy - ih * 0.15, iw * 0.4, ih * 0.18, 10, '#2a2a3a', { lw: 4 }); for (const s of [-1, 1]) circle(c, cx + s * iw * 0.22, cy + ih * 0.22, iw * 0.06, '#111', { lw: 3 }); }
  else { vgrad(c, ix, iy, iw, ih, [[0, '#a8d8f0'], [1, '#e8e4dc']]); moto(c, cx, cy + ih * 0.35, iw / 520, {}); circle(c, cx - iw * 0.28, cy - ih * 0.1, iw * 0.08, '#8a5a3a', { lw: 3 }); }
  c.restore();
  c.font = `600 ${w * 0.06}px Inter`; c.fillStyle = '#2b1f2a'; c.textAlign = 'left'; c.fillText(texto, -w / 2 + 20, iy + ih + 34);
  c.font = `700 ${w * 0.055}px Inter`; c.fillStyle = '#e8405a'; c.fillText(`❤ ${curtidas}`, -w / 2 + 20, iy + ih + 76);
  c.restore();
}

// ================== emergência ==================
// carro simples (amassado = 0..1)
export function carro(c, x, y, s, { cor = '#3a6ad0', flip = 1, amassado = 0, farol = 0 } = {}) {
  c.save(); c.translate(x, y); c.scale(s * flip, s);
  shape(c, cc => { cc.moveTo(-230, -40); cc.lineTo(-230, -110); cc.lineTo(-140, -120); cc.lineTo(-80, -190); cc.lineTo(90, -190); cc.lineTo(150, -120); cc.lineTo(230 - amassado * 60, -110 + amassado * 20); cc.lineTo(234 - amassado * 70, -40); cc.closePath(); }, cor, { lw: 6 });
  shape(c, cc => { cc.moveTo(-64, -126); cc.lineTo(-44, -176); cc.lineTo(76, -176); cc.lineTo(120, -126); cc.closePath(); }, '#9ac0d8', { lw: 4 });
  if (amassado > 0) { line(c, [[150 - amassado * 40, -120], [190 - amassado * 50, -80], [170 - amassado * 50, -50]], '#2b1f2a', 4); line(c, [[40, -170], [70, -140]], '#ffffff', 3); }
  rrect(c, 200 - amassado * 60, -100, 26, 20, 4, '#fff6c0', { lw: 3 });
  for (const wx of [-140, 140 - amassado * 30]) { circle(c, wx, -36, 40, '#1a1a1a', { lw: 5 }); circle(c, wx, -36, 16, '#8a8a8a', { lw: 3 }); }
  c.restore();
}
// fumaça cinza subindo
export function fumacaCinza(c, x, y, t, a = 1, escala = 1) { if (a <= 0.01) return; for (let i = 0; i < 7; i++) { const u = ((t * 0.35 + i / 7) % 1); cloud(c, x + Math.sin(t + i) * 30 * u, y - u * 420 * escala, (50 + u * 110) * escala, `rgba(120,120,128,${0.55 * a * (1 - u)})`, { seed: i + 2 }); } }
// cacos de vidro voando no impacto
export function cacos(c, x, y, dt) { if (dt < 0 || dt > 1.5) return; const r = rng(4); for (let i = 0; i < 18; i++) { const vx = (r() - 0.3) * 700, vy = -200 - r() * 500; const px = x + vx * dt, py = y + vy * dt + 900 * dt * dt; if (py > y + 140) continue; c.save(); c.translate(px, py); c.rotate(dt * 10 + i); poly(c, [[-8, -6], [10, -2], [2, 10]], '#d8f0f8', { lw: 2 }); c.restore(); } }
// cartão "O QUE FAZER" com itens marcados
export function cartaoDica(c, x, y, w, titulo, itens, t, t0, cor = '#2aa060') {
  const a = clamp((t - t0) / 0.4); if (a <= 0) return;
  c.save(); c.globalAlpha *= a; c.translate(x, y);
  const h = 110 + itens.length * 78;
  rrect(c, -w / 2, 0, w, h, 26, 'rgba(14,20,18,0.88)', { stroke: cor, lw: 6 });
  rrect(c, -w / 2, 0, w, 84, 26, cor, { stroke: null }); c.font = '900 44px Inter'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#ffffff'; c.fillText(titulo, 0, 44);
  itens.forEach(([txt, ti], i) => { const b = clamp((t - ti) / 0.3); if (b <= 0) return; c.save(); c.globalAlpha *= b; const yy = 130 + i * 78; circle(c, -w / 2 + 50, yy, 22, cor, { lw: 4 }); line(c, [[-w / 2 + 39, yy], [-w / 2 + 47, yy + 9], [-w / 2 + 62, yy - 10]], '#ffffff', 5); c.font = '800 38px Inter'; c.textAlign = 'left'; c.fillStyle = '#ffffff'; c.fillText(txt, -w / 2 + 90, yy + 2); c.restore(); });
  c.restore();
}
// rótulo do tipo de reação
export function cartaoTipo(c, num, nome, t, t0, cor = '#ff6a4a') { const a = clamp((t - t0) / 0.35) * (1 - clamp((t - t0 - 3.4) / 0.4)); if (a <= 0) return; c.save(); c.globalAlpha *= a; c.translate(540, 300); const s = 0.8 + 0.2 * Math.min(1, (t - t0) / 0.35); c.scale(s, s); rrect(c, -440, -90, 880, 180, 30, 'rgba(20,12,14,0.9)', { stroke: cor, lw: 7 }); c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = '900 40px Inter'; c.fillStyle = cor; c.fillText(`TIPO ${num}`, 0, -40); c.font = '900 56px Inter'; c.fillStyle = '#ffffff'; c.fillText(nome, 0, 28); c.restore(); }

// ================== "Encosto profissional" (2D): sala de dia, cozinha, frente da casa ==================
export function salaDia(st, t, { tvLuz = 1 } = {}) {
  st.camada(0.9, c => {
    vgrad(c, -400, -200, 1900, 2400, [[0, '#f0e2c8'], [1, '#e0ceb0']]);
    rrect(c, 640, 480, 360, 420, 8, '#bfe4f6', { lw: 10 }); line(c, [[820, 480], [820, 900]], '#2b1f2a', 8); line(c, [[640, 690], [1000, 690]], '#2b1f2a', 8);
    rrect(c, 80, 520, 240, 180, 8, '#f0c060', { lw: 6 }); rrect(c, 98, 538, 204, 144, 4, '#5aa0d0', { stroke: null });
    rrect(c, -380, 560, 300, 1000, 8, '#8a5a3a', { lw: 6 }); circle(c, -110, 1080, 12, '#d8b040', { lw: 3 }); // porta
    // TV num rack à direita
    rrect(c, 1060, 1180, 360, 200, 8, '#5a3a2a', { lw: 6 }); rrect(c, 1080, 920, 320, 240, 8, '#1a1a22', { lw: 6 }); rrect(c, 1094, 934, 292, 212, 4, `hsl(${(t * 70) % 360},60%,62%)`, { stroke: null });
    glow(c, 1240, 1040, 420, '#8ab0ff', 0.25 * tvLuz);
  });
  st.camada(1, c => { vgrad(c, -900, 1480, 2900, 900, [[0, '#c8925a'], [1, '#a87444']]); for (let x = -900; x < 2000; x += 120) line(c, [[x, 1490], [x - 40, 2300]], '#b88452', 3); ellipse(c, 560, 1720, 460, 70, '#b05a4a', { lw: 5 }); });
}
export function sofaDia(c, x) { rrect(c, x - 300, 1300, 600, 200, 40, '#5a6a9a', { lw: 6 }); rrect(c, x - 320, 1440, 640, 150, 26, '#6a7aaa', { lw: 6 }); for (const s of [-1, 1]) rrect(c, x + s * 320 - 46, 1380, 92, 220, 30, '#5a6a9a', { lw: 6 }); for (const s of [-1, 1]) rrect(c, x + s * 140 - 120, 1430, 240, 40, 16, '#7a8aba', { lw: 4 }); }
export function roupasChao(c) { const r = rng(5), cores = ['#d84a4a', '#4a8ad0', '#f0d050', '#5ab070', '#e8e0d0', '#9a5ab0']; for (let i = 0; i < 8; i++) { c.save(); c.translate(-200 + r() * 1400, 1640 + r() * 220); c.rotate(r() * 3); rrect(c, -50, -24, 100, 48, 12, cores[i % 6], { lw: 4 }); c.restore(); } }
export function cozinha2d(st, t) {
  st.camada(0.9, c => {
    vgrad(c, -400, -200, 1900, 2400, [[0, '#f4ecdc'], [1, '#e4d8c0']]);
    c.strokeStyle = '#e0d4bc'; c.lineWidth = 3; for (let x = -400; x < 1500; x += 90) { c.beginPath(); c.moveTo(x, 700); c.lineTo(x, 1300); c.stroke(); } for (let y = 700; y < 1300; y += 90) { c.beginPath(); c.moveTo(-400, y); c.lineTo(1500, y); c.stroke(); }
    rrect(c, -200, 420, 1300, 260, 10, '#8a5a3a', { lw: 6 }); for (let i = 0; i < 4; i++) rrect(c, -170 + i * 320, 450, 290, 200, 8, '#9a6a44', { lw: 4 });
    rrect(c, 820, 600, 260, 900, 14, '#f2f2f4', { lw: 6 }); line(c, [[850, 900], [850, 1000]], '#9a9aa2', 8);
  });
  st.camada(1, c => {
    vgrad(c, -900, 1480, 2900, 900, [[0, '#e8e4dc'], [1, '#c8c0b4']]);
    for (let x = -900; x < 2000; x += 140) line(c, [[x, 1490], [x - 60, 2300]], '#d0c8bc', 3);
    rrect(c, -200, 1240, 1000, 60, 10, '#d8d4cc', { lw: 6 }); rrect(c, -180, 1300, 960, 200, 8, '#8a6a4a', { lw: 6 });
    rrect(c, 120, 1236, 300, 30, 8, '#9aa0a8', { lw: 4 }); line(c, [[270, 1236], [270, 1140], [320, 1140]], '#b8bcc4', 10);
  });
}
// copo na pia (como "cena do crime")
export function copoPia(c, x, y, crime = 0, t = 0) {
  if (crime > 0) { c.save(); c.globalAlpha = crime; c.globalCompositeOperation = 'lighter'; const g = c.createLinearGradient(0, y - 700, 0, y); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(255,255,230,0.5)'); c.fillStyle = g; c.beginPath(); c.moveTo(x - 30, y - 700); c.lineTo(x + 30, y - 700); c.lineTo(x + 160, y + 20); c.lineTo(x - 160, y + 20); c.closePath(); c.fill(); c.restore(); }
  shape(c, c => { c.moveTo(x - 30, y - 90); c.lineTo(x + 30, y - 90); c.lineTo(x + 24, y); c.lineTo(x - 24, y); c.closePath(); }, 'rgba(210,240,255,0.7)', { lw: 4 });
  rrect(c, x - 22, y - 30, 44, 26, 4, 'rgba(150,210,255,0.6)', { stroke: null }); line(c, [[x - 18, y - 80], [x - 14, y - 20]], '#ffffff', 4);
  if (crime > 0) { c.save(); c.globalAlpha = crime; for (const [ox, oy, rot] of [[0, -150, 0.04], [0, -40, -0.05]]) { c.save(); c.translate(x + ox, y + oy); c.rotate(rot); for (let i = -6; i < 6; i++) { c.fillStyle = i % 2 ? '#1a1a1a' : '#f6d02a'; c.beginPath(); c.moveTo(i * 60, -16); c.lineTo(i * 60 + 60, -16); c.lineTo(i * 60 + 40, 16); c.lineTo(i * 60 - 20, 16); c.fill(); } c.restore(); } c.restore(); }
}
// raios girando (momento "épico")
export function raiosEpicos(c, cx, cy, t, a = 1) { if (a <= 0.01) return; c.save(); c.globalAlpha = a; c.translate(cx, cy); c.rotate(t * 0.8); for (let i = 0; i < 14; i++) { c.rotate(TAU / 14); c.fillStyle = i % 2 ? 'rgba(255,230,150,0.35)' : 'rgba(255,200,90,0.2)'; c.beginPath(); c.moveTo(0, 0); c.lineTo(-120, -1800); c.lineTo(120, -1800); c.closePath(); c.fill(); } c.restore(); }
export function lixeira(c, x, y) { rrect(c, x - 70, y - 160, 140, 160, 10, '#3a7a3a', { lw: 5 }); rrect(c, x - 80, y - 180, 160, 30, 8, '#2a5a2a', { lw: 5 }); }

// ================== "Voltar à infância" (2D) ==================
export function bolaDesenho(c, x, y, r = 26, rot = 0) { c.save(); c.translate(x, y); c.rotate(rot); circle(c, 0, 0, r, '#f6f2ea', { lw: 4 }); for (let k = 0; k < 5; k++) { const a = k / 5 * TAU; circle(c, Math.cos(a) * r * 0.55, Math.sin(a) * r * 0.55, r * 0.2, '#1a1a1e', { stroke: null }); } c.restore(); }
// TV de tubo: modo 'desligada' | 'jogo' | 'desenho'
export function tvTubo(c, x, y, t, modo = 'desligada', s = 1) {
  c.save(); c.translate(x, y); c.scale(s, s);
  rrect(c, -170, -300, 340, 300, 30, '#3a3a3e', { lw: 7 }); rrect(c, -148, -278, 240, 200, 40, '#1a1e22', { lw: 5 });
  for (let i = 0; i < 2; i++) circle(c, 130, -240 + i * 50, 12, '#9a9aa2', { lw: 3 });
  c.save(); c.beginPath(); c.roundRect(-146, -276, 236, 196, 38); c.clip();
  if (modo === 'jogo') { vgrad(c, -146, -276, 236, 196, [[0, '#5ab0ff'], [1, '#8ad0ff']]); c.fillStyle = '#3aa040'; c.fillRect(-146, -110, 236, 30); c.fillStyle = '#8a5a2a'; for (let i = 0; i < 5; i++) { const bx = ((i * 70 - t * 80) % 320 + 320) % 320 - 160; c.fillRect(bx, -170 + (i % 2) * 24, 40, 14); } const j = Math.abs(Math.sin(t * 3)) * 40; c.fillStyle = '#e8302a'; c.fillRect(-60, -136 - j, 18, 20); c.fillStyle = '#2a4ad0'; c.fillRect(-60, -120 - j, 18, 10); c.fillStyle = '#ffd23a'; for (let i = 0; i < 4; i++) { c.beginPath(); c.arc(((i * 60 - t * 80) % 280 + 280) % 280 - 140, -200, 7, 0, TAU); c.fill(); } }
  else if (modo === 'desenho') { vgrad(c, -146, -276, 236, 196, [[0, '#ffd8a0'], [1, '#ff9a6a']]); const bx = Math.sin(t * 2) * 50; circle(c, bx - 26, -180 - Math.abs(Math.sin(t * 5)) * 20, 36, '#9a6ad0', { lw: 4 }); circle(c, bx - 38, -188 - Math.abs(Math.sin(t * 5)) * 20, 6, '#fff', { stroke: null }); circle(c, bx - 14, -188 - Math.abs(Math.sin(t * 5)) * 20, 6, '#fff', { stroke: null }); }
  else { c.fillStyle = '#1a1e22'; c.fillRect(-146, -276, 236, 196); }
  c.fillStyle = 'rgba(0,0,0,0.18)'; for (let yy = -276; yy < -80; yy += 6) c.fillRect(-146, yy, 236, 2);
  c.restore();
  if (modo !== 'desligada') glow(c, -26, -178, 380, modo === 'jogo' ? '#8ac0ff' : '#ffb080', 0.35);
  c.restore();
}
export function relogioParede(c, x, y, h, m, r = 70) { circle(c, x, y, r, '#8a5a3a', { lw: 6 }); circle(c, x, y, r * 0.82, '#f6f2e6', { lw: 3 }); for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; line(c, [[x + Math.cos(a) * r * 0.66, y + Math.sin(a) * r * 0.66], [x + Math.cos(a) * r * 0.76, y + Math.sin(a) * r * 0.76]], '#2b1f2a', 4); } const ah = ((h % 12) + m / 60) / 12 * TAU - Math.PI / 2, am = m / 60 * TAU - Math.PI / 2; line(c, [[x, y], [x + Math.cos(ah) * r * 0.42, y + Math.sin(ah) * r * 0.42]], '#2b1f2a', 8); line(c, [[x, y], [x + Math.cos(am) * r * 0.64, y + Math.sin(am) * r * 0.64]], '#2b1f2a', 5); circle(c, x, y, 7, '#2b1f2a', { stroke: null }); }
// quarto de infância (anos 2000): pôsteres, brinquedos, TV de tubo, cama de solteiro com coberta azul
export function quartoInfancia(st, t, { noite = 0, tv = 'desligada', hora = [7, 10] } = {}) {
  const n = noite;
  st.camada(0.9, c => {
    vgrad(c, -600, -200, 2300, 2400, [[0, mix('#9ad0e8', '#1e2a44', n)], [1, mix('#7ab8d8', '#141c30', n)]]);
    rrect(c, -500, 460, 360, 380, 8, mix('#fff0c8', '#1a2448', n), { lw: 10 }); line(c, [[-320, 460], [-320, 840]], '#2b1f2a', 7); line(c, [[-500, 650], [-140, 650]], '#2b1f2a', 7);
    if (n > 0.5) for (let i = 0; i < 8; i++) circle(c, -480 + (i * 47) % 320, 480 + (i * 61) % 160, 3, '#ffffff', { stroke: null });
    if (n < 0.5) { c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha = 0.18 * (1 - n); c.fillStyle = '#ffe0a0'; c.beginPath(); c.moveTo(-500, 460); c.lineTo(-140, 460); c.lineTo(500, 1700); c.lineTo(-200, 1700); c.closePath(); c.fill(); c.restore(); }
    // pôsteres
    rrect(c, 40, 440, 220, 300, 6, mix('#d8302a', '#5a1a1a', n), { lw: 6 }); rrect(c, 70, 600, 160, 60, 14, mix('#ffd23a', '#5a4a1a', n), { lw: 4 }); circle(c, 100, 670, 20, '#111', { stroke: null }); circle(c, 200, 670, 20, '#111', { stroke: null });
    rrect(c, 300, 420, 200, 280, 6, mix('#1a2a6a', '#0a1028', n), { lw: 6 }); poly(c, [[400, 460], [440, 600], [360, 600]], '#e8e8f0', { lw: 4 }); poly(c, [[372, 600], [400, 660], [428, 600]], '#ff7a2a', { stroke: null });
    rrect(c, 900, 440, 220, 300, 6, mix('#2aa060', '#0a2a1a', n), { lw: 6 }); circle(c, 1010, 520, 30, '#e8b890', { lw: 4 }); rrect(c, 975, 552, 70, 100, 10, '#ffd23a', { lw: 4 }); circle(c, 1010, 700, 20, '#fff', { lw: 3 });
    relogioParede(c, 640, 360, hora[0], hora[1]);
    // prateleira com brinquedos
    rrect(c, 560, 860, 420, 18, 4, '#8a5a3a'); rrect(c, 590, 790, 70, 70, 6, '#d8302a', { lw: 4 }); rrect(c, 680, 800, 60, 60, 6, '#2a6ad0', { lw: 4 }); circle(c, 800, 830, 30, '#f0c030', { lw: 4 }); rrect(c, 860, 810, 90, 50, 10, '#2aa060', { lw: 4 });
  });
  st.camada(1, c => {
    vgrad(c, -900, 1480, 2900, 900, [[0, mix('#c8925a', '#3a2a24', n)], [1, mix('#a87444', '#221810', n)]]);
    ellipse(c, 640, 1740, 420, 60, mix('#e8a040', '#4a3a28', n), { lw: 5 });
    // cama
    rrect(c, -360, 1300, 60, 340, 12, mix('#8a5a3a', '#2a1e1a', n), { lw: 6 }); rrect(c, -340, 1480, 700, 130, 16, mix('#f6f2ea', '#4a5070', n), { lw: 6 }); rrect(c, -340, 1600, 700, 40, 8, mix('#8a5a3a', '#2a1e1a', n), { lw: 6 });
    rrect(c, -320, 1440, 180, 60, 26, mix('#ffffff', '#5a6080', n), { lw: 5 });
    // brinquedos no chão
    const r = rng(7); for (let i = 0; i < 7; i++) rrect(c, 380 + r() * 600, 1690 + r() * 120, 44, 44, 6, ['#d8302a', '#2a6ad0', '#f0c030', '#2aa060', '#9a5ab0'][i % 5], { lw: 4 });
    rrect(c, 820, 1760, 110, 40, 12, '#d8302a', { lw: 4 }); circle(c, 845, 1800, 14, '#111', { stroke: null }); circle(c, 905, 1800, 14, '#111', { stroke: null });
    bolaDesenho(c, 260, 1760, 30, 0.4);
    // rack + TV de tubo + videogame
    rrect(c, 1040, 1420, 400, 260, 10, mix('#6a4a30', '#2a1e14', n), { lw: 6 });
    tvTubo(c, 1220, 1420, t, tv, 1);
    rrect(c, 1080, 1700, 120, 34, 8, '#4a4a52', { lw: 4 });
  });
}
export function cobertaInf(c, noite = 0, x0 = -120) { shape(c, c => { c.moveTo(x0, 1480); c.quadraticCurveTo(x0 + 160, 1440, 370, 1462); c.lineTo(370, 1610); c.lineTo(x0 - 10, 1610); c.closePath(); }, mix('#3a7ad0', '#22305a', noite)); }
// quarto atual (adulto): frio, escuro, organizado, celular aceso
export function quartoAtual(st, t) {
  st.camada(0.9, c => { vgrad(c, -600, -200, 2300, 2400, [[0, '#2a3044'], [1, '#161a28']]); rrect(c, -500, 460, 380, 420, 8, '#0e1430', { lw: 10 }); for (let i = 0; i < 14; i++) rrect(c, -480 + (i * 53) % 340, 760 - (i * 37) % 200, 18, 24, 2, '#ffd890', { stroke: null }); line(c, [[-310, 460], [-310, 880]], '#2b1f2a', 7); rrect(c, 700, 560, 300, 200, 6, '#3a4058', { lw: 6 }); });
  st.camada(1, c => {
    vgrad(c, -900, 1480, 2900, 900, [[0, '#2a2e3a'], [1, '#181a22']]);
    rrect(c, -360, 1300, 60, 340, 12, '#22242c', { lw: 6 }); rrect(c, -340, 1480, 900, 130, 16, '#5a6278', { lw: 6 }); rrect(c, -340, 1600, 900, 40, 8, '#22242c', { lw: 6 }); rrect(c, -320, 1440, 200, 60, 26, '#7a8298', { lw: 5 });
    rrect(c, 640, 1460, 160, 200, 8, '#22242c', { lw: 6 }); rrect(c, 690, 1448, 60, 14, 3, '#1a1a1e', { lw: 3 }); glow(c, 720, 1446, 120, '#8ac8ff', 0.3 + 0.3 * Math.abs(Math.sin(t * 1.5)));
  });
}
export function cobertaAtual(c, x0 = 100) { shape(c, c => { c.moveTo(x0, 1480); c.quadraticCurveTo(x0 + 200, 1440, 560, 1462); c.lineTo(560, 1610); c.lineTo(x0 - 10, 1610); c.closePath(); }, '#3a4a6a'); }
// muro com portão de grade (para a bola bater)
export function portaoGrade(c, x, y, balanco = 0) { rrect(c, x - 260, y - 160, 520, 160, 6, '#e8e0d4', { lw: 6 }); c.save(); c.translate(x, y - 10); c.rotate(balanco * 0.04); for (let i = 0; i < 9; i++) rrect(c, -110 + i * 26, -220, 10, 220, 3, '#2a2a30', { stroke: null }); rrect(c, -116, -224, 232, 12, 4, '#2a2a30', { stroke: null }); rrect(c, -116, -40, 232, 12, 4, '#2a2a30', { stroke: null }); c.restore(); }
