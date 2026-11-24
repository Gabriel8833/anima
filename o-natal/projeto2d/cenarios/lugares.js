// Cenários de "O pior Natal da minha vida": sala decorada, mesa da ceia, estádio da fantasia, tela de erro.
import { TAU, lerp, clamp, sstep, rng, mix, rgba, easeOut, easeBack } from '../motor/base.js';
import { OUT, shape, circle, ellipse, poly, rrect, line, glow, cloud, vgrad, sparkle, limb, star5 } from '../motor/desenho.js';

export const SALA = { piso: 1460, chao: 1800, porta: -760, sofa: -260, mesa: 560, arvore: 1330, poltrona: 1820, cozinha: 2300 };
const CORES_LUZ = ['#ff4a4a', '#ffd23a', '#4ae07a', '#4aa8ff', '#ff8af0'];

function pisca(c, x0, y0, x1, y1, t, n = 14, sag = 40, fase = 0) {
  shape(c, c => { c.moveTo(x0, y0); c.quadraticCurveTo((x0 + x1) / 2, Math.max(y0, y1) + sag, x1, y1); }, null, { stroke: '#1e3a1e', lw: 3 });
  for (let i = 0; i <= n; i++) {
    const u = i / n, x = (1 - u) ** 2 * x0 + 2 * (1 - u) * u * (x0 + x1) / 2 + u * u * x1, y = (1 - u) ** 2 * y0 + 2 * (1 - u) * u * (Math.max(y0, y1) + sag) + u * u * y1;
    const cor = CORES_LUZ[(i + Math.floor(t * 3 + fase)) % 5], on = (Math.floor(t * 4) + i) % 3 !== 0;
    ellipse(c, x, y + 8, 6, 9, on ? cor : mix(cor, '#202020', 0.6), { lw: 2 });
    if (on) glow(c, x, y + 8, 28, cor, 0.55);
  }
}
export function arvore(c, x, y, t, balanca = 0) {
  c.save(); c.translate(x, y); c.rotate(balanca);
  rrect(c, -30, -60, 60, 70, 4, '#5a3a24', { lw: 5 });
  rrect(c, -90, -10, 180, 60, 10, '#8a2a2a', { lw: 5 });
  const camadas = [[-60, 300, 230], [-230, 250, 200], [-390, 200, 180], [-530, 140, 150]];
  for (const [yb, w, h] of camadas) shape(c, c => { c.moveTo(-w, yb); c.quadraticCurveTo(0, yb + 40, w, yb); c.lineTo(0, yb - h); c.closePath(); }, '#1f5a34', { lw: 6 });
  for (const [yb, w] of camadas) { c.save(); c.globalAlpha = 0.35; shape(c, c => { c.moveTo(0, yb - 120); c.lineTo(w * 0.9, yb); c.quadraticCurveTo(w * 0.4, yb + 20, 0, yb + 24); c.closePath(); }, '#0e3a20', { stroke: null }); c.restore(); }
  const r = rng(3);
  for (let i = 0; i < 26; i++) { const yy = -80 - r() * 560, w = lerp(280, 40, (-yy - 80) / 560), xx = (r() - 0.5) * 2 * w * 0.85; circle(c, xx, yy, 14, ['#c8243a', '#e8b030', '#c8c8d8', '#2a6ad0'][i % 4], { lw: 3 }); ellipse(c, xx - 4, yy - 5, 4, 3, '#ffffff', { stroke: null, alpha: 0.6 }); }
  pisca(c, -270, -120, 260, -150, t, 12, 50, 0); pisca(c, -200, -290, 190, -310, t, 10, 40, 2); pisca(c, -140, -440, 130, -460, t, 8, 30, 4);
  star5(c, 0, -690, 50, '#ffd23a', { lw: 5 }); glow(c, 0, -690, 160, '#ffe08a', 0.6 + 0.2 * Math.sin(t * 4));
  // presentes
  for (const [px, w, h, cor] of [[-200, 110, 80, '#2a6ad0'], [-60, 90, 110, '#c8243a'], [120, 130, 70, '#e8b030'], [250, 80, 60, '#5a2a8a']]) { rrect(c, px - w / 2, 50 - h, w, h, 4, cor, { lw: 4 }); rrect(c, px - 6, 50 - h, 12, h, 0, '#f2f2f2', { stroke: null, alpha: 0.8 }); }
  c.restore();
  glow(c, x, y - 300, 520, '#ffcf80', 0.22);
}
export function mesaCeia(c, x, y, t, { treme = 0, bagunca = 0 } = {}) {
  const j = k => treme ? Math.abs(Math.sin(t * 40 + k)) * 12 * treme : 0;
  rrect(c, x - 420, y, 840, 40, 6, '#5a3220', { lw: 6 });
  shape(c, c => { c.moveTo(x - 440, y - 6); c.lineTo(x + 440, y - 6); c.lineTo(x + 460, y + 160); c.quadraticCurveTo(x, y + 190, x - 460, y + 160); c.closePath(); }, '#8a1e2a', { lw: 6 });
  for (let k = -3; k <= 3; k++) line(c, [[x + k * 120, y], [x + k * 128, y + 170]], 'rgba(0,0,0,0.2)', 4);
  rrect(c, x - 460, y + 140, 920, 26, 4, '#e8c040', { stroke: null, alpha: 0.5 });
  // chester
  c.save(); c.translate(x - 30, y - 6 - j(1)); ellipse(c, 0, 0, 120, 26, '#f2efe8', { lw: 5 }); shape(c, c => { c.moveTo(-90, -4); c.quadraticCurveTo(-90, -100, 0, -100); c.quadraticCurveTo(90, -100, 90, -4); c.closePath(); }, '#b8682a', { lw: 5 }); ellipse(c, -30, -70, 30, 12, '#e09a4a', { stroke: null }); for (const s of [-1, 1]) { line(c, [[s * 80, -30], [s * 120, -60]], '#b8682a', 22); circle(c, s * 124, -64, 12, '#f6f2e6', { lw: 3 }); } c.restore();
  // farofa, arroz, pavê, garrafas, copos
  c.save(); c.translate(x - 270, y - 6 - j(2)); ellipse(c, 0, 0, 80, 22, '#f2efe8', { lw: 5 }); shape(c, c => { c.moveTo(-64, -2); c.quadraticCurveTo(0, -50, 64, -2); c.closePath(); }, '#e0b060', { lw: 4 }); c.restore();
  c.save(); c.translate(x + 230, y - 6 - j(3)); ellipse(c, 0, 0, 80, 22, '#f2efe8', { lw: 5 }); shape(c, c => { c.moveTo(-64, -2); c.quadraticCurveTo(0, -50, 64, -2); c.closePath(); }, '#f6f2e6', { lw: 4 }); c.restore();
  for (const [bx, cor, k] of [[x + 360, '#2a6a3a', 4], [x - 380, '#5a1a2a', 5]]) { c.save(); c.translate(bx, y - j(k)); rrect(c, -16, -110, 32, 110, 8, cor, { lw: 4 }); rrect(c, -8, -140, 16, 34, 4, cor, { lw: 4 }); rrect(c, -14, -70, 28, 30, 3, '#e8e0c8', { stroke: null }); c.restore(); }
  for (const gx of [x - 150, x + 110, x + 300]) { const jj = j(gx); shape(c, c => { c.moveTo(gx - 16, y - 60 - jj); c.lineTo(gx + 16, y - 60 - jj); c.lineTo(gx + 12, y - jj); c.lineTo(gx - 12, y - jj); c.closePath(); }, 'rgba(220,240,255,0.5)', { lw: 3 }); rrect(c, gx - 13, y - 34 - jj, 26, 30, 2, '#c84a3a', { stroke: null, alpha: 0.8 }); }
}
function sofa(c, x, y, t, pulo = 0) {
  rrect(c, x - 300, y - 270, 600, 200, 40, '#4a3a5a', { lw: 6 });
  rrect(c, x - 320, y - 110, 640, 130, 26, '#5a4a6a', { lw: 6 });
  for (const s of [-1, 1]) rrect(c, x + s * 320 - 50, y - 190, 100, 210, 30, '#4a3a5a', { lw: 6 });
  for (const s of [-1, 1]) rrect(c, x + s * 150 - 130, y - 130 + pulo * Math.abs(Math.sin(t * 9 + s)) * 10, 260, 40, 16, '#6a5a7a', { lw: 4 });
}
export function poltrona(c, x, y) {
  rrect(c, x - 170, y - 360, 340, 300, 50, '#6a2a24', { lw: 6 }); rrect(c, x - 190, y - 120, 380, 140, 30, '#7a3a30', { lw: 6 });
  for (const s of [-1, 1]) rrect(c, x + s * 190 - 50, y - 220, 100, 240, 36, '#6a2a24', { lw: 6 });
}
// sala completa (fundo); objetos principais desenhados aqui; personagens por cima
export function sala(st, t, { almofadas = 0, arvoreBal = 0, escuro = 0, semArvore = false } = {}) {
  st.mundo(c => {
    vgrad(c, -1600, -400, 4800, 1900, [[0, '#4a2e2a'], [1, '#5e3a30']]);
    for (let x = -1600; x < 3200; x += 140) { c.fillStyle = 'rgba(255,220,180,0.05)'; c.fillRect(x, -400, 60, 1860); }
    rrect(c, -1600, 1420, 4800, 44, 0, '#3a2018', { lw: 6 });
    vgrad(c, -1600, 1460, 4800, 1100, [[0, '#6a4228'], [1, '#4a2c1a']]);
    for (let y = 1520; y < 2600; y += 70) line(c, [[-1600, y], [3200, y]], 'rgba(0,0,0,0.18)', 3);
    for (let x = -1600; x < 3200; x += 260) line(c, [[x, 1460], [x - 120, 2600]], 'rgba(0,0,0,0.12)', 3);
    // porta de entrada
    rrect(c, SALA.porta - 170, 760, 340, 700, 8, '#3a2214', { lw: 7 }); rrect(c, SALA.porta - 150, 780, 300, 680, 4, '#5a3a24', { lw: 4 }); circle(c, SALA.porta + 110, 1140, 12, '#d8b040', { lw: 3 });
    // guirlanda e pisca-pisca no teto
    circle(c, SALA.porta, 900, 60, null, { stroke: '#1f5a34', lw: 26 }); circle(c, SALA.porta, 860, 12, '#c8243a', { lw: 3 });
    for (let k = 0; k < 5; k++) pisca(c, -1400 + k * 900, 300, -500 + k * 900, 300, t, 12, 90, k);
    // janela à noite com luzes dos vizinhos
    rrect(c, 320, 520, 480, 520, 8, '#2a1a14', { lw: 7 }); c.save(); c.beginPath(); c.rect(334, 534, 452, 492); c.clip();
    vgrad(c, 334, 534, 452, 492, [[0, '#0a1028'], [1, '#2a2050']]); for (let i = 0; i < 6; i++) { const bx = 334 + i * 80, bh = 120 + (i * 41) % 140; rrect(c, bx, 1026 - bh, 70, bh, 2, '#141830', { stroke: null }); pisca(c, bx, 1026 - bh, bx + 70, 1026 - bh, t, 4, 10, i); }
    for (let i = 0; i < 12; i++) sparkle(c, 340 + (i * 53) % 440, 560 + (i * 37) % 200, 4, '#ffffff', 0.5 + 0.5 * Math.sin(t * 2 + i));
    c.restore(); line(c, [[560, 534], [560, 1026]], '#2a1a14', 10); line(c, [[334, 780], [786, 780]], '#2a1a14', 10);
    // quadros de família tortos
    rrect(c, -360, 640, 200, 160, 6, '#8a6a3a', { lw: 6 }); rrect(c, -344, 656, 168, 128, 3, '#c8b898', { stroke: null }); for (let i = 0; i < 4; i++) circle(c, -320 + i * 40, 720, 16, '#8a7a6a', { stroke: null });
    c.save(); c.translate(1000, 700); c.rotate(0.08); rrect(c, -90, -70, 180, 140, 6, '#8a6a3a', { lw: 6 }); rrect(c, -74, -54, 148, 108, 3, '#9ab0c0', { stroke: null }); c.restore();
    // porta da cozinha (luz forte saindo) à direita
    rrect(c, SALA.cozinha - 180, 740, 360, 720, 8, '#2a1a10', { lw: 7 }); vgrad(c, SALA.cozinha - 160, 760, 320, 700, [[0, '#fff2c8'], [1, '#f2c880']]);
    // poltrona do avô, sofá, árvore
    poltrona(c, SALA.poltrona, 1640);
    sofa(c, SALA.sofa, 1640, t, almofadas);
    if (!semArvore) arvore(c, SALA.arvore, 1640, t, arvoreBal);
    // abajur
    line(c, [[1620, 1640], [1620, 1180]], '#2a2a30', 10); shape(c, c => { c.moveTo(1560, 1180); c.lineTo(1680, 1180); c.lineTo(1650, 1080); c.lineTo(1590, 1080); c.closePath(); }, '#e8c890', { lw: 5 }); glow(c, 1620, 1150, 300, '#ffd890', 0.4);
  });
}
// placa imaginária
export function placa(c, x, y, s, txt, rot = -0.1) {
  if (s <= 0.01) return;
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  line(c, [[0, 40], [0, 180]], '#6a4a2a', 14);
  rrect(c, -230, -70, 460, 120, 12, '#e8d8a8', { lw: 7 });
  c.font = '900 34px Inter, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#8a1e2a';
  const [l1, l2] = txt; c.fillText(l1, 0, -30); c.fillText(l2, 0, 12);
  c.restore();
}
// tela de erro do cérebro (espaço da tela)
export function telaErro(c, x, y, a, t) {
  if (a <= 0.01) return;
  c.save(); c.globalAlpha = clamp(a); c.translate(x + (Math.floor(t * 20) % 2 ? 4 : -4), y);
  rrect(c, -330, -150, 660, 300, 10, '#d8d8e0', { lw: 7 }); rrect(c, -330, -150, 660, 56, 10, '#1a3aa8', { lw: 7 });
  c.font = '900 34px Inter, sans-serif'; c.fillStyle = '#ffffff'; c.textBaseline = 'middle'; c.fillText('cerebro.exe', -300, -122);
  rrect(c, 270, -140, 44, 36, 4, '#d83a3a', { lw: 4 }); c.fillText('×', 281, -122);
  circle(c, -220, 20, 50, '#d83a3a', { lw: 5 }); c.font = '900 64px Inter, sans-serif'; c.textAlign = 'center'; c.fillText('!', -220, 24);
  c.textAlign = 'left'; c.fillStyle = '#1a1a22'; c.font = '900 48px Inter, sans-serif'; c.fillText('ERRO FATAL', -140, -10); c.font = '700 30px Inter, sans-serif'; c.fillText('Sistema travado.', -140, 44);
  for (let k = 0; k < 4; k++) { const yy = -150 + ((t * 700 + k * 97) % 300); c.globalAlpha = 0.25 * a; c.fillStyle = ['#ff2a6a', '#2affd0'][k % 2]; c.fillRect(-340, yy, 680, 8); }
  c.restore();
}
// estádio da fantasia do tio
export function estadio(st, t) {
  st.mundo(c => {
    vgrad(c, -1200, -400, 3500, 2200, [[0, '#0a0e28'], [1, '#1a2a50']]);
    for (const x of [-300, 1380]) { line(c, [[x, 1200], [x, 300]], '#4a4a5a', 18); rrect(c, x - 120, 220, 240, 100, 8, '#e8e8f0', { lw: 5 }); glow(c, x, 270, 520, '#e8f0ff', 0.6); }
    for (let r = 0; r < 9; r++) { const y = 700 + r * 70; rrect(c, -1200, y, 3500, 70, 0, r % 2 ? '#2a2a3e' : '#323248', { stroke: null }); for (let k = 0; k < 70; k++) { const x = -1180 + k * 50 + (r % 2) * 25; const cor = ['#e8b030', '#2aa060', '#ffffff', '#c8243a'][(k + r) % 4]; circle(c, x, y + 30 - Math.abs(Math.sin(t * 8 + k + r)) * 10, 14, cor, { stroke: null }); } }
    for (let i = 0; i < 14; i++) { const ft = (t * 2.5 + i * 0.29) % 1; if (ft < 0.1) glow(c, -900 + (i * 211) % 2600, 720 + (i * 97) % 560, 70, '#ffffff', 1); }
    vgrad(c, -1200, 1340, 3500, 1300, [[0, '#2a8a3a'], [1, '#1a6a2a']]);
    for (let k = 0; k < 12; k++) rrect(c, -1200 + k * 300, 1340, 150, 1300, 0, 'rgba(255,255,255,0.05)', { stroke: null });
    line(c, [[-1200, 1500], [2300, 1500]], '#e8f0e8', 8);
  });
}
