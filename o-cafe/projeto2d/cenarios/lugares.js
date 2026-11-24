// Cenários de "Café com leite": quarto de 2010 e rua de bairro brasileiro no fim de tarde.
import { TAU, lerp, clamp, sstep, rng, mix, rgba, easeOut, easeBack } from '../motor/base.js';
import { OUT, shape, circle, ellipse, poly, rrect, line, glow, cloud, vgrad, sparkle, limb } from '../motor/desenho.js';
export { quartoInfancia, cobertaInf, bairro, bolaDesenho, tvTubo } from './infancia.js';

export const RUA = { chao: 1770, calcada: 1570 };

// ---------- quarto ----------
export function calendario2010(c, x, y, vira = 1) {
  rrect(c, x, y, 170, 200, 6, '#fffaf0', { lw: 5 }); rrect(c, x, y, 170, 50, 6, '#e2473a', { lw: 5 });
  for (const dx of [40, 130]) { circle(c, x + dx, y + 4, 7, '#c8c8cc', { lw: 3 }); }
  c.save(); c.font = '900 52px Inter, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#2b1f2a'; c.globalAlpha = clamp(vira); c.fillText('2010', x + 85, y + 100); c.restore();
  for (let r = 0; r < 3; r++) for (let k = 0; k < 6; k++) rrect(c, x + 14 + k * 25, y + 138 + r * 18, 16, 10, 2, '#c8c0d8', { stroke: null });
}
export function despertador(c, x, y, t, toca = 0) {
  const sh = toca ? Math.sin(t * 60) * 5 : 0;
  c.save(); c.translate(x + sh, y - Math.abs(Math.sin(t * 30)) * 6 * toca);
  for (const s of [-1, 1]) { circle(c, s * 34, -62, 18, '#f4c430', { lw: 4 }); line(c, [[s * 40, 0], [s * 50, 18]], OUT, 6); }
  circle(c, 0, -26, 50, '#e2473a', { lw: 6 }); circle(c, 0, -26, 38, '#fffaf0', { lw: 4 });
  line(c, [[0, -26], [0, -52]], OUT, 5); line(c, [[0, -26], [18, -20]], OUT, 5);
  c.restore();
  if (toca) for (let i = 0; i < 3; i++) { const a = win2(t * 6 + i); for (const s of [-1, 1]) shape(c, c => c.arc(x, y - 30, 70 + i * 22, s > 0 ? -0.6 : Math.PI - 0.6, s > 0 ? 0.6 : Math.PI + 0.6), null, { stroke: '#ffe46a', lw: 6, alpha: a * toca }); }
}
const win2 = v => 0.3 + 0.7 * Math.abs(Math.sin(v));
export function criadoMudo(c, x, y) { rrect(c, x - 80, y, 160, 220, 10, '#a8744a', { lw: 6 }); rrect(c, x - 64, y + 20, 128, 80, 6, '#c8925a', { lw: 4 }); rrect(c, x - 16, y + 54, 32, 10, 5, '#5a3a2a', { lw: 3 }); }

// ---------- bicicleta (vista de lado) ----------
export function bicicleta(c, x, y, t, { gira = 0, cor = '#2c78dc', s = 1, flip = 1 } = {}) {
  c.save(); c.translate(x, y); c.scale(s * flip, s);
  for (const wx of [-95, 95]) { circle(c, wx, -60, 60, null, { stroke: '#1a1a1e', lw: 10 }); circle(c, wx, -60, 8, '#9a9aa8', { lw: 3 }); for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI + gira; line(c, [[wx + Math.cos(a) * 54, -60 + Math.sin(a) * 54], [wx - Math.cos(a) * 54, -60 - Math.sin(a) * 54]], '#b8b8c4', 2); } }
  line(c, [[-95, -60], [-20, -60], [40, -150], [-50, -150], [-95, -60]], cor, 10); line(c, [[-20, -60], [-50, -150]], cor, 10); line(c, [[40, -150], [95, -60]], cor, 10);
  line(c, [[40, -150], [52, -190]], '#3a3a44', 8); line(c, [[30, -196], [76, -186]], '#3a3a44', 9);
  rrect(c, -78, -172, 60, 16, 8, '#2a2a30', { lw: 3 }); line(c, [[-50, -150], [-50, -160]], '#3a3a44', 6);
  circle(c, -20, -60, 14, '#5a5a62', { lw: 3 });
  c.restore();
}

// ---------- cachorro caramelo (vista de lado) ----------
export function cachorro(c, x, y, t, { anda = 0, flip = 1, s = 1, feliz = 1, lingua = 1 } = {}) {
  c.save(); c.translate(x, y); c.scale(s * flip, s);
  const ab = Math.sin(t * 16) * 0.6 * feliz, ph = t * 12 * anda, bob = anda ? Math.abs(Math.sin(ph)) * 4 : 0;
  shape(c, c => { c.moveTo(-70, -80 - bob); c.quadraticCurveTo(-110, -120 - ab * 30, -100 + ab * 20, -150); }, null, { stroke: OUT, lw: 20 }); shape(c, c => { c.moveTo(-70, -80 - bob); c.quadraticCurveTo(-110, -120 - ab * 30, -100 + ab * 20, -150); }, null, { stroke: '#d8964a', lw: 10 });
  for (const [lx, o] of [[-50, 0], [-30, Math.PI], [40, Math.PI], [60, 0]]) { const sw = anda ? Math.sin(ph + o) * 14 : 0; limb(c, [[lx, -60 - bob], [lx + sw, -8]], 16, '#d8964a'); ellipse(c, lx + sw + 4, -6, 12, 6, '#d8964a', { lw: 3 }); }
  ellipse(c, 0, -80 - bob, 82, 40, '#d8964a', { lw: 5 }); ellipse(c, 6, -64 - bob, 50, 16, '#f2d2a0', { stroke: null });
  c.save(); c.translate(76, -118 - bob + Math.sin(t * 3) * 2);
  shape(c, c => { c.moveTo(-18, -26); c.quadraticCurveTo(-40, -10, -28, 22); c.lineTo(-10, -10); c.closePath(); }, '#a86a2a', { lw: 4 });
  circle(c, 0, 0, 36, '#d8964a', { lw: 5 }); ellipse(c, 34, 12, 24, 18, '#f2d2a0', { lw: 4 }); circle(c, 54, 6, 8, OUT, { stroke: null });
  if ((t % 3) < 0.12) line(c, [[6, -8], [20, -8]], OUT, 4); else { circle(c, 14, -8, 7, OUT, { stroke: null }); circle(c, 16, -10, 2.5, '#fff', { stroke: null }); }
  if (lingua) shape(c, c => { c.moveTo(34, 26); c.quadraticCurveTo(40, 48 + Math.sin(t * 12) * 4, 50, 28); }, '#ff7a86', { lw: 3 });
  c.restore();
  c.restore();
}

// ---------- árvore grande ----------
export function arvore(c, x, y, t) {
  rrect(c, x - 70, y - 520, 140, 520, 30, '#8a5a3a', { lw: 7 }); line(c, [[x - 30, y - 400], [x - 10, y - 200]], '#6a4228', 5); line(c, [[x + 30, y - 300], [x + 14, y - 120]], '#6a4228', 5);
  const sw = Math.sin(t * 1.3) * 8;
  for (const [dx, dy, r] of [[-180, -620, 170], [160, -640, 180], [0, -800, 200], [-90, -520, 140], [120, -500, 140]]) circle(c, x + dx + sw * (dy / -600), y + dy, r, '#3f9a56', { lw: 7 });
  for (let i = 0; i < 6; i++) { const r = rng(i + 9); circle(c, x - 200 + r() * 400 + sw, y - 820 + r() * 340, 26, '#4fb468', { stroke: null }); }
}

// ---------- casa da mãe com janela ----------
export const CASA = { x: 1540, w: 640, jx: 1860, jy: 1000 };
export function casaFrente(c, t, abre = 0) {
  const { x, w, jx, jy } = CASA;
  rrect(c, x, 640, w, 860, 8, '#f2c46a', { lw: 7 });
  poly(c, [[x - 40, 660], [x + w / 2, 460], [x + w + 40, 660]], '#c8543a', { lw: 7 });
  rrect(c, x + 60, 1180, 170, 310, 6, '#8a5a3a', { lw: 6 }); circle(c, x + 205, 1340, 10, '#d8b040', { lw: 3 });
  // janela com grade (a mãe aparece aqui)
  rrect(c, jx - 170, jy - 160, 340, 300, 6, '#2a2a40', { lw: 7 });
  for (const s of [-1, 1]) { const a = abre; c.save(); c.translate(jx + s * 170, jy - 160); c.scale(1 - a * 0.85, 1); rrect(c, s > 0 ? -170 : 0, 0, 170, 300, 4, '#2c78dc', { lw: 5 }); for (let k = 1; k < 4; k++) line(c, [[s > 0 ? -170 : 0, k * 75], [s > 0 ? 0 : 170, k * 75]], '#1a5aa8', 4); c.restore(); }
  rrect(c, jx - 190, jy + 140, 380, 24, 6, '#fffaf0', { lw: 5 });
  // vaso no parapeito
  rrect(c, jx + 110, jy + 100, 50, 40, 6, '#e0773a', { lw: 4 }); for (let i = 0; i < 3; i++) circle(c, jx + 120 + i * 15, jy + 90 - (i % 2) * 10, 14, '#4fb468', { lw: 3 });
}
export function gradeJanela(c) { const { jx, jy } = CASA; for (let k = 0; k < 7; k++) line(c, [[jx - 150 + k * 50, jy - 160], [jx - 150 + k * 50, jy + 140]], '#3a3a44', 6); line(c, [[jx - 170, jy - 10], [jx + 170, jy - 10]], '#3a3a44', 6); }

// ---------- rua (primeiro plano: muro, calçada, poste, chinelos de trave) ----------
export function ruaFrente(st, t, { sol = 0.6, traves = true, arvoreX = -420, casa = true, bike = true } = {}) {
  st.mundo(c => {
    const tom = (a, b) => mix(b, a, sol);
    // muro com pichações leves e portões
    for (let x = -1300; x < 1520; x += 260) { rrect(c, x, 1300, 260, 200, 4, tom('#e8d8c0', '#9a8aa0'), { lw: 5 }); line(c, [[x, 1360], [x + 260, 1360]], tom('#d8c4a8', '#8a7a90'), 3); }
    rrect(c, -1300, 1286, 2820, 22, 4, tom('#c8b8a0', '#7a6a80'), { lw: 5 });
    c.save(); c.globalAlpha = 0.7; c.font = '900 64px Inter, sans-serif'; c.fillStyle = tom('#2c78dc', '#3a3a6a'); c.fillText('★', 300, 1440); c.fillStyle = tom('#e2473a', '#6a3a4a'); circle(c, -540, 1400, 40, null, { stroke: tom('#35a868', '#3a5a4a'), lw: 10 }); c.restore();
    if (casa) casaFrente(c, t, 0);
    // poste com fios
    rrect(c, 760, 600, 30, 900, 6, tom('#9a9aa8', '#5a5a6a'), { lw: 5 }); rrect(c, 700, 640, 150, 20, 6, tom('#9a9aa8', '#5a5a6a'), { lw: 4 });
    shape(c, c => { c.moveTo(-1300, 700); c.quadraticCurveTo(-300, 780, 775, 650); c.quadraticCurveTo(1500, 760, 2400, 690); }, null, { stroke: '#2a2a30', lw: 4 });
    if (sol < 0.5) glow(c, 775, 670, 200, '#ffd890', (0.5 - sol) * 1.6);
    // calçada e meio-fio
    vgrad(c, -1300, 1490, 3600, 80, [[0, tom('#d8d0c4', '#8a8498')], [1, tom('#c8c0b4', '#7a7488')]]);
    for (let x = -1300; x < 2300; x += 120) line(c, [[x, 1490], [x, 1570]], tom('#b8b0a4', '#6a6478'), 3);
    rrect(c, -1300, 1564, 3600, 18, 3, tom('#e8e0d4', '#9a94a8'), { lw: 4 });
    if (arvoreX != null) arvore(c, arvoreX, 1520, t);
    if (bike) bicicleta(c, 1080, 1500, t, { cor: '#2c78dc' });
    // chinelos de trave
    if (traves) for (const gx of [80, 300, 1700, 1920]) { c.save(); c.translate(gx, 1790); rrect(c, -40, -12, 80, 24, 12, gx < 500 ? '#f4c430' : '#e2473a', { lw: 4 }); line(c, [[-10, -8], [8, 0], [-10, 8]], '#f6f2ea', 4); c.restore(); }
  });
}
// asfalto da rua (abaixo de tudo)
export function ruaChao(st, t, sol = 0.6) {
  st.mundo(c => { vgrad(c, -1300, 1580, 3600, 1200, [[0, mix('#5a5a70', '#9a9090', sol)], [1, mix('#4a4a60', '#7a7272', sol)]]); for (let x = -1300; x < 2300; x += 260) rrect(c, x, 2020, 140, 14, 4, mix('#8a8a90', '#e8e0c8', sol), { stroke: null }); for (let i = 0; i < 20; i++) { const r = rng(i); circle(c, -1200 + r() * 3400, 1620 + r() * 700, 4, 'rgba(0,0,0,0.15)', { stroke: null }); } });
}
export function confete(c, x, y, t, t0, n = 30) {
  const dt = t - t0; if (dt < 0 || dt > 3) return;
  const r = rng(5);
  for (let i = 0; i < n; i++) { const vx = (r() - 0.5) * 900, vy = -700 - r() * 600, px = x + vx * dt, py = y + vy * dt + 900 * dt * dt; c.save(); c.translate(px, py); c.rotate(dt * 10 + i); c.globalAlpha = 1 - sstep(2, 3, dt); rrect(c, -9, -5, 18, 10, 2, ['#f4c430', '#e2473a', '#2c78dc', '#35a868', '#ff8fb1'][i % 5], { stroke: null }); c.restore(); }
}
export function poeira(c, x, y, t, t0, dur = 0.6) { const dt = t - t0; if (dt < 0 || dt > dur) return; for (let k = 0; k < 6; k++) { const a = Math.PI + k / 5 * Math.PI, d = dt * 260; circle(c, x + Math.cos(a) * d, y + Math.sin(a) * d * 0.3, 18 + dt * 30, '#e8e0d0', { lw: 3, alpha: 1 - dt / dur }); } }
export function estrelasTontura(c, x, y, t, a = 1) { if (a <= 0.01) return; for (let i = 0; i < 4; i++) { const an = t * 6 + i * TAU / 4; sparkle(c, x + Math.cos(an) * 70, y + Math.sin(an) * 20, 14, '#ffe04a', a); } }
