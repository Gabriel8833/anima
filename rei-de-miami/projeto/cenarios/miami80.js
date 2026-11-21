// Cenários de Miami nos anos 80: avenida da praia (pôr do sol ou noite), cozinha de lanchonete, beco,
// clube neon, mansão (externa) e escritório; carros esportivo e limusine; luzes de polícia.
import { TAU, lerp, clamp, sstep, easeOut, rng, mix, rgba } from '../motor/base.js';
import { OUT, shape, circle, ellipse, poly, rrect, line, glow, rays, sparkle, cloud, vgrad } from '../motor/desenho.js';

const W = 1080, H = 1920;

export function palmeira(c, x, base, s, t, cor = '#3a8a5a') {
  c.save(); c.translate(x, base); c.scale(s, s);
  shape(c, cc => { cc.moveTo(-14, 0); cc.quadraticCurveTo(-30, -200, 10, -420); cc.lineTo(30, -416); cc.quadraticCurveTo(0, -200, 14, 0); cc.closePath(); }, '#9a6a3a');
  for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * 0.5 + Math.sin(t * 1.5 + i) * 0.05; shape(c, cc => { cc.moveTo(20, -420); cc.quadraticCurveTo(20 + Math.cos(a - 0.4) * 120, -420 + Math.sin(a - 0.4) * 120 - 20, 20 + Math.cos(a) * 200, -420 + Math.sin(a) * 120 + 60); cc.quadraticCurveTo(20 + Math.cos(a + 0.2) * 100, -420 + Math.sin(a + 0.2) * 60, 20, -420); cc.closePath(); }, cor, { lw: 4 }); }
  c.restore();
}
function predioDeco(c, x, base, w, h, cor, neon, t, seed, noite) {
  rrect(c, x - w / 2, base - h, w, h, 6, cor, { lw: 5 });
  for (const k of [0.2, 0.5, 0.8]) line(c, [[x - w / 2, base - h * k], [x + w / 2, base - h * k]], mix(cor, '#ffffff', 0.4), 6);
  rrect(c, x - w * 0.3, base - h - 50, w * 0.6, 54, 10, cor, { lw: 5 });
  const r = rng(seed);
  for (let yy = base - h + 30; yy < base - 40; yy += 56) for (let xx = x - w / 2 + 18; xx < x + w / 2 - 30; xx += 42) rrect(c, xx, yy, 26, 34, 6, noite && r() < 0.6 ? '#ffe08a' : '#bfe8f0', { lw: 3 });
  if (neon) { const pisca = Math.sin(t * 5 + seed) > -0.8; line(c, [[x - w / 2 + 10, base - h + 10], [x + w / 2 - 10, base - h + 10]], pisca ? neon : '#5a3a5a', 8); if (pisca) glow(c, x, base - h + 10, w * 0.7, neon, noite ? 0.6 : 0.25); }
}
// ---------- avenida da praia ----------
export function avenida(st, t, { noite = 0 } = {}) {
  st.camada(0, c => {
    vgrad(c, 0, 0, W, H, [[0, mix('#3a2a7a', '#0e0a2a', noite)], [0.45, mix('#ff6aa8', '#3a1a5a', noite)], [0.7, mix('#ffa86a', '#7a2a6a', noite)], [1, mix('#ffe0a0', '#c04a7a', noite)]]);
    glow(c, 540, 1200, 600, mix('#ffd070', '#ff4aa8', noite), 0.8 - noite * 0.4); circle(c, 540, 1200 + noite * 300, 140, mix('#fff0b0', '#ff6aa8', noite), { stroke: null });
    for (let i = 0; i < 6; i++) line(c, [[200, 1150 + i * 30], [880, 1150 + i * 30]], mix('#ff8a6a', '#3a1a5a', noite), 10, 0.8);
  });
  st.camada(0.25, c => { vgrad(c, -1000, 1300, 3100, 200, [[0, mix('#3ab8d8', '#1a2a5a', noite)], [1, mix('#2a8ab0', '#0e1a3a', noite)]]); for (let i = 0; i < 10; i++) line(c, [[-400 + i * 200 + (t * 30) % 200, 1340 + (i % 3) * 30], [-340 + i * 200 + (t * 30) % 200, 1340 + (i % 3) * 30]], '#ffffff', 4, 0.5); });
  st.camada(0.5, c => { const cores = ['#f6c8d8', '#bfe8e0', '#f6e0b0', '#d8c8f0', '#f0d0c0']; const neons = ['#ff4aa8', '#3af0e0', null, '#ff4aa8', '#ffd23a']; for (let i = 0; i < 11; i++) predioDeco(c, -500 + i * 200, 1420, 180, 300 + (i * 83) % 260, cores[i % 5], neons[i % 5], t, i, noite); });
  st.camada(0.8, c => { for (let i = 0; i < 6; i++) palmeira(c, -300 + i * 320, 1460, 0.9, t, mix('#3a8a5a', '#1a3a3a', noite)); });
  st.camada(1, c => {
    rrect(c, -1500, 1460, 4100, 70, 0, mix('#f2e0c8', '#5a4a6a', noite), { stroke: null });
    rrect(c, -1500, 1530, 4100, 900, 0, mix('#5a5a6a', '#2a2a3a', noite), { stroke: null });
    for (let i = -10; i < 20; i++) rrect(c, i * 220, 1700, 120, 16, 4, mix('#f2f2f2', '#ff6aa8', noite * 0.6), { stroke: null });
    // letreiro original da cidade
    c.save(); c.font = '900 italic 120px Inter, sans-serif'; c.textAlign = 'center'; c.lineWidth = 16; c.strokeStyle = OUT; c.strokeText('Miami', 540, 1070); const g = c.createLinearGradient(0, 980, 0, 1080); g.addColorStop(0, '#3af0e0'); g.addColorStop(1, '#ff4aa8'); c.fillStyle = g; c.fillText('Miami', 540, 1070); c.restore();
  });
}
// ---------- carros dos anos 80 ----------
export function esportivo(c, x, y, s, { cor = '#e02a3a', roda = 0, flip = 1 } = {}) {
  c.save(); c.translate(x, y); c.scale(s * flip, s);
  shape(c, cc => { cc.moveTo(-220, -40); cc.lineTo(-220, -80); cc.lineTo(-120, -100); cc.lineTo(-40, -150); cc.lineTo(60, -150); cc.lineTo(140, -100); cc.lineTo(230, -84); cc.lineTo(236, -40); cc.closePath(); }, cor);
  shape(c, cc => { cc.moveTo(-30, -104); cc.lineTo(-20, -142); cc.lineTo(54, -142); cc.lineTo(110, -104); cc.closePath(); }, '#2a3a4a', { lw: 4 });
  line(c, [[-210, -64], [226, -64]], '#ffffff', 5, 0.7); rrect(c, 210, -84, 24, 14, 4, '#ffe08a', { lw: 3 });
  for (const wx of [-130, 140]) { c.save(); c.translate(wx, -36); c.rotate(roda); circle(c, 0, 0, 34, '#1a1a1a', { lw: 5 }); circle(c, 0, 0, 18, '#c8ccd4', { lw: 3 }); line(c, [[-14, 0], [14, 0]], '#7a7a88', 3); c.restore(); }
  c.restore();
}
export function limusine(c, x, y, s, { roda = 0, flip = 1 } = {}) {
  c.save(); c.translate(x, y); c.scale(s * flip, s);
  shape(c, cc => { cc.moveTo(-330, -40); cc.lineTo(-330, -100); cc.lineTo(-200, -110); cc.lineTo(-150, -170); cc.lineTo(200, -170); cc.lineTo(250, -110); cc.lineTo(340, -100); cc.lineTo(340, -40); cc.closePath(); }, '#1a1a22');
  for (let i = 0; i < 4; i++) rrect(c, -130 + i * 86, -160, 70, 46, 6, '#3a3a4a', { lw: 3 });
  line(c, [[-320, -70], [330, -70]], '#c8ccd4', 5);
  for (const wx of [-220, 240]) { c.save(); c.translate(wx, -36); c.rotate(roda); circle(c, 0, 0, 34, '#111111', { lw: 5 }); circle(c, 0, 0, 18, '#c8ccd4', { lw: 3 }); c.restore(); }
  c.restore();
}
// ---------- cozinha da lanchonete ----------
export function cozinha(st, t) {
  st.camada(0.9, c => {
    vgrad(c, -400, -200, 1900, 2400, [[0, '#e8f0e8'], [1, '#c8d8d0']]);
    for (let y = 0; y < 1500; y += 80) for (let x = -400 + ((y / 80) % 2) * 40; x < 1500; x += 80) rrect(c, x, y, 76, 76, 4, '#f2f6f2', { stroke: '#c8d4cc', lw: 3 });
    rrect(c, 600, 500, 380, 260, 10, '#ffd890', { lw: 8 }); c.save(); c.font = '900 48px Inter, sans-serif'; c.textAlign = 'center'; c.fillStyle = '#c0302a'; c.fillText('PEDIDOS', 790, 580); c.restore();
    for (let i = 0; i < 4; i++) rrect(c, 630 + i * 86, 620, 60, 110, 4, '#ffffff', { lw: 3 });
    for (let i = 0; i < 3; i++) { const u = (t * 0.6 + i / 3) % 1; c.save(); c.globalAlpha = 0.4 * (1 - u); circle(c, 300 + i * 60, 1150 - u * 300, 30 + u * 30, '#ffffff', { stroke: null }); c.restore(); }
  });
  st.camada(1, c => {
    rrect(c, -400, 1300, 1900, 300, 10, '#c8ccd4', { lw: 7 }); rrect(c, 140, 1320, 420, 120, 30, '#8ab0c8', { lw: 6 }); ellipse(c, 350, 1340, 180, 20, '#bfe6f6', { lw: 3 });
    for (let i = 0; i < 6; i++) ellipse(c, 700 + (i % 3) * 30, 1290 - i * 18, 70, 14, '#ffffff', { lw: 4 });
    vgrad(c, -400, 1600, 1900, 800, [[0, '#9aa8a8'], [1, '#7a8888']]);
  });
}
// ---------- beco à noite ----------
export function beco(st, t) {
  st.camada(0.9, c => {
    vgrad(c, -400, -200, 1900, 2400, [[0, '#120e22'], [1, '#2a1a3a']]);
    for (let y = 0; y < 1500; y += 70) for (let x = -400 + ((y / 70) % 2) * 60; x < 1500; x += 120) rrect(c, x, y, 116, 66, 4, '#3a2a3a', { stroke: '#22182a', lw: 3 });
    const pisca = Math.sin(t * 7) > -0.6; rrect(c, 120, 600, 340, 120, 16, '#1a1020', { lw: 6 }); c.save(); c.font = '900 italic 70px Inter, sans-serif'; c.textAlign = 'center'; c.fillStyle = pisca ? '#ff4aa8' : '#5a2a4a'; c.fillText('BAR', 290, 685); c.restore(); if (pisca) glow(c, 290, 660, 300, '#ff4aa8', 0.5);
    rrect(c, 700, 1100, 160, 360, 8, '#3a3040', { lw: 6 }); glow(c, 780, 1100, 120, '#ffe08a', 0.4);
  });
  st.camada(1, c => { vgrad(c, -400, 1480, 1900, 900, [[0, '#2a2238'], [1, '#14101e']]); for (let i = 0; i < 4; i++) ellipse(c, 100 + i * 260, 1620 + (i % 2) * 80, 90, 14, '#3a3a5a', { stroke: null }); });
}
// ---------- clube neon ----------
export function clube(st, t) {
  st.camada(0.9, c => {
    vgrad(c, -400, -200, 1900, 2400, [[0, '#1a0a2a'], [1, '#3a1a4a']]);
    for (let i = 0; i < 8; i++) { const a = -0.8 + i * 0.23 + Math.sin(t * 0.8 + i) * 0.2; c.save(); c.globalCompositeOperation = 'lighter'; c.translate(540, 200); c.rotate(a); const g = c.createLinearGradient(0, 0, 0, 1400); g.addColorStop(0, rgba(i % 2 ? '#ff4aa8' : '#3af0e0', 0.35)); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.beginPath(); c.moveTo(-10, 0); c.lineTo(10, 0); c.lineTo(120, 1400); c.lineTo(-120, 1400); c.closePath(); c.fill(); c.restore(); }
    circle(c, 540, 200, 60, '#c8ccd4', { lw: 5 }); for (let i = 0; i < 12; i++) sparkle(c, 540 + Math.cos(i + t) * 50, 200 + Math.sin(i * 1.7 + t) * 50, 8, '#ffffff', 0.8);
    c.save(); c.font = '900 italic 90px Inter, sans-serif'; c.textAlign = 'center'; c.fillStyle = '#3af0e0'; c.fillText('Club Neon', 540, 500); c.restore(); glow(c, 540, 470, 400, '#3af0e0', 0.3);
    rrect(c, -300, 900, 1700, 520, 40, '#5a1a4a', { lw: 7 });
  });
  st.camada(1, c => { for (let y = 1480; y < 2400; y += 120) for (let x = -400 + ((y / 120) % 2) * 120; x < 1500; x += 240) rrect(c, x, y, 120, 120, 0, (Math.floor(t * 4 + x / 240 + y / 120) % 3) ? '#2a1a3a' : '#ff4aa8', { stroke: null }); rrect(c, 200, 1420, 680, 50, 12, '#1a1a1a', { lw: 6 }); });
}
// ---------- mansão (externa) ----------
export function mansaoFora(st, t, { noite = 0, policia = 0 } = {}) {
  st.camada(0, c => { vgrad(c, 0, 0, W, H, [[0, mix('#3a8ad8', '#0a0a22', noite)], [0.6, mix('#9ad8f0', '#2a1a4a', noite)], [1, mix('#f6e8c8', '#4a2a5a', noite)]]); });
  st.camada(0.4, c => { for (let i = 0; i < 6; i++) palmeira(c, -300 + i * 360, 1360, 1.0, t, mix('#3a8a5a', '#12302a', noite)); });
  st.camada(0.7, c => {
    // mansão branca com colunas
    rrect(c, 40, 760, 1000, 640, 10, mix('#f6f2ea', '#4a4a6a', noite), { lw: 7 });
    poly(c, [[0, 770], [540, 560], [1080, 770]], mix('#e8a86a', '#3a2a3a', noite), { lw: 7 });
    for (let i = 0; i < 6; i++) rrect(c, 120 + i * 170, 800, 44, 600, 8, mix('#ffffff', '#5a5a7a', noite), { lw: 5 });
    for (let i = 0; i < 5; i++) for (let k = 0; k < 2; k++) rrect(c, 182 + i * 170, 860 + k * 260, 80, 160, 30, noite > 0.5 ? '#ffd890' : '#bfe8f0', { lw: 4 });
    rrect(c, 470, 1180, 140, 220, 60, '#6a3a1a', { lw: 6 });
  });
  st.camada(1, c => {
    vgrad(c, -1500, 1400, 4100, 1000, [[0, mix('#7ac87a', '#1a3a2a', noite)], [1, mix('#5aa85a', '#0e2a1a', noite)]]);
    // piscina e chafariz
    ellipse(c, 540, 1600, 380, 70, mix('#3ad8e8', '#1a4a6a', noite)); for (let i = 0; i < 6; i++) line(c, [[300 + i * 90, 1590], [340 + i * 90, 1590]], '#ffffff', 4, 0.6);
    rrect(c, 520, 1470, 40, 110, 10, '#e8e0d0', { lw: 5 }); for (let i = 0; i < 6; i++) { const u = (t * 1.2 + i / 6) % 1; circle(c, 540 + (i % 2 ? 1 : -1) * u * 70, 1470 - Math.sin(u * Math.PI) * 120, 8, '#bff0f6', { stroke: null }); }
    // portão com a inicial
    for (const s of [-1, 1]) { rrect(c, 540 + s * 480 - 30, 1380, 60, 360, 6, '#e8e0d0', { lw: 6 }); circle(c, 540 + s * 480, 1370, 34, '#f2c230', { lw: 5 }); }
    if (policia > 0) { const k = clamp(policia); c.save(); c.globalAlpha = k; c.fillStyle = Math.sin(t * 10) > 0 ? '#ff2a3a' : '#2a6aff'; c.globalCompositeOperation = 'lighter'; c.globalAlpha = 0.25 * k; c.fillRect(-1500, -500, 4100, 3000); c.restore(); }
  });
}
// ---------- escritório da mansão ----------
export function escritorio(st, t, { noite = 0, policia = 0, monitores = 0 } = {}) {
  st.camada(0.9, c => {
    vgrad(c, -400, -200, 1900, 2400, [[0, mix('#f2e6d0', '#2a1e2a', noite)], [1, mix('#e0ccb0', '#1a1420', noite)]]);
    // janela grande com o mar
    rrect(c, 140, 300, 800, 620, 16, mix('#9ad8f0', '#1a1a4a', noite), { lw: 10 });
    c.save(); c.beginPath(); c.rect(150, 310, 780, 600); c.clip(); vgrad(c, 150, 700, 780, 220, [[0, mix('#3ab8d8', '#0e1a3a', noite)], [1, mix('#2a8ab0', '#060a1e', noite)]]); palmeira(c, 260, 930, 0.6, t, mix('#3a8a5a', '#12302a', noite)); palmeira(c, 820, 930, 0.7, t, mix('#3a8a5a', '#12302a', noite)); if (noite > 0.5) for (let i = 0; i < 20; i++) sparkle(c, 170 + (i * 97) % 760, 330 + (i * 61) % 300, 5, '#ffffff', 0.6); c.restore();
    line(c, [[540, 300], [540, 920]], OUT, 8);
    // persianas à noite
    if (noite > 0.5) for (let i = 0; i < 12; i++) line(c, [[150, 320 + i * 50], [930, 320 + i * 50]], '#3a2a3a', 14, 0.85);
    // quadro com moldura dourada e cofre
    rrect(c, -260, 400, 320, 260, 10, '#e3b23c', { lw: 7 }); rrect(c, -240, 420, 280, 220, 6, '#2a8ab0', { lw: 4 });
    // monitores de segurança
    if (monitores > 0) { for (let i = 0; i < 4; i++) { const mx = 960 + (i % 2) * 230, my = 520 + Math.floor(i / 2) * 200; rrect(c, mx, my, 210, 170, 10, '#2a2a2a', { lw: 6 }); rrect(c, mx + 12, my + 12, 186, 146, 4, '#1a3a2a', { lw: 3 }); c.save(); c.globalAlpha = 0.25; c.fillStyle = '#000'; for (let y = my + 12; y < my + 158; y += 6) c.fillRect(mx + 12, y + (t * 40) % 6, 186, 2); c.restore(); } }
  });
  st.camada(1, c => {
    vgrad(c, -400, 1480, 1900, 900, [[0, mix('#c83a4a', '#4a1020', noite)], [1, mix('#8a1a2a', '#2a0810', noite)]]);
    // mesa de mármore
    rrect(c, 180, 1360, 720, 60, 12, mix('#f2eee8', '#4a4458', noite), { lw: 7 }); rrect(c, 220, 1420, 640, 200, 10, mix('#2a2a2a', '#141414', noite), { lw: 6 });
    if (policia > 0) { c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha = 0.3 * policia; c.fillStyle = Math.sin(t * 10) > 0 ? '#ff2a3a' : '#2a6aff'; c.fillRect(-400, -200, 1900, 2600); c.restore(); }
  });
}
// pequena tela de câmera de segurança com uma silhueta cochichando
export function cameraSeguranca(c, x, y, t, i) { const s = Math.sin(t * 2 + i); c.save(); c.beginPath(); c.rect(x, y, 186, 146); c.clip(); for (const dx of [50, 130]) { circle(c, x + dx + s * 6, y + 70, 22, '#6aff9a', { stroke: null, alpha: 0.6 }); rrect(c, x + dx - 26 + s * 6, y + 92, 52, 60, 12, '#6aff9a', { stroke: null, alpha: 0.5 }); } c.restore(); }
// dinheiro: pilhas e notas voando
export function pilhaDinheiro(c, x, y, n = 5) { for (let i = 0; i < n; i++) { rrect(c, x - 60 + (i % 2) * 6, y - i * 18, 120, 22, 4, '#5ab05a', { lw: 4 }); rrect(c, x - 18 + (i % 2) * 6, y - i * 18, 36, 22, 2, '#e8e0b0', { lw: 2 }); } }
export function notasVoando(c, t, a = 1, n = 18) { const r = rng(3); for (let i = 0; i < n; i++) { const x0 = r() * 1200 - 60, y = ((r() * 2000 + t * (120 + r() * 80)) % 2100) - 100; c.save(); c.globalAlpha = a; c.translate(x0 + Math.sin(t * 2 + i) * 40, y); c.rotate(Math.sin(t * 3 + i) * 0.8); c.scale(1, Math.abs(Math.sin(t * 4 + i)) * 0.8 + 0.2); rrect(c, -40, -18, 80, 36, 4, '#7ac07a', { lw: 3 }); circle(c, 0, 0, 9, '#e8e0b0', { stroke: null }); c.restore(); } }
