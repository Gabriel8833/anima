// Objetos recorrentes: o Livro Proibido, altar, velas, estantes, porta de pedra, bola de cristal.
import { TAU, lerp, clamp, rng, rgba } from '../motor/base.js';
import { OUT, shape, circle, ellipse, poly, line, glow, rrect, rune, sparkle } from '../motor/desenho.js';

// O Livro aberto, visto de frente e de cima. s = escala; brilho 0..1; cor do brilho; virar 0..1 (página virando)
export function livro(c, x, y, s, t, { brilho = 1, cor = '#7fd8ff', virar = 0, flutuar = true, tinta = 1, simbolo = 0 } = {}) {
  const fy = flutuar ? Math.sin(t * 1.6) * 10 * s : 0;
  c.save(); c.translate(x, y + fy); c.scale(s, s);
  glow(c, 0, -10, 260, cor, 0.55 * brilho);
  // sombra/capa
  shape(c, c => { c.moveTo(-190, 10); c.quadraticCurveTo(-100, -10, 0, 18); c.quadraticCurveTo(100, -10, 190, 10); c.lineTo(178, 64); c.quadraticCurveTo(90, 44, 0, 72); c.quadraticCurveTo(-90, 44, -178, 64); c.closePath(); }, '#6a2230');
  for (const sx of [-1, 1]) {
    // bloco de páginas
    shape(c, c => { c.moveTo(0, 50); c.quadraticCurveTo(sx * 90, 22, sx * 172, 44); c.lineTo(sx * 180, -2); c.quadraticCurveTo(sx * 92, -24, 0, 6); c.closePath(); }, '#f4e6c4');
    line(c, [[sx * 172, 44], [sx * 176, 30], [sx * 178, 14]], '#c9b48a', 3);
    // linhas de runas
    for (let i = 0; i < 6; i++) {
      const yy = -2 + i * 7.5, x0 = sx * 22, x1 = sx * (150 - (i === 5 ? 50 : 0));
      c.save(); c.globalAlpha *= (sx > 0 ? tinta : 1) * (0.35 + brilho * 0.65); c.strokeStyle = brilho > 0.2 ? cor : '#8a7a5a'; c.lineWidth = 4; c.setLineDash([10, 6]); c.beginPath(); c.moveTo(x0, yy + 6 - Math.abs(x0) * 0.02); c.quadraticCurveTo((x0 + x1) / 2, yy - 6, x1, yy + 4); c.stroke(); c.restore();
    }
  }
  line(c, [[0, 6], [0, 50]], '#c9b48a', 3);
  // runa de Zareth aparecendo na página direita
  if (simbolo > 0) { c.save(); c.globalAlpha *= simbolo; glow(c, 92, 16, 90, '#b066ff', 0.9); line(c, [[92, -10], [92, 42]], '#9a3aff', 9); line(c, [[70, 16], [114, 16]], '#9a3aff', 7); c.beginPath(); c.arc(92, 16, 16, 0, TAU); c.strokeStyle = '#9a3aff'; c.lineWidth = 5; c.stroke(); c.restore(); }
  // cantos dourados e marcador
  for (const sx of [-1, 1]) poly(c, [[sx * 190, 10], [sx * 164, 4], [sx * 178, 64]], '#e3b23c', { lw: 4 });
  shape(c, c => { c.moveTo(-8, 60); c.lineTo(-8, 110); c.lineTo(0, 100); c.lineTo(8, 110); c.lineTo(8, 60); c.closePath(); }, '#c0182c', { lw: 4 });
  // página virando (direita → esquerda)
  if (virar > 0 && virar < 1) {
    const ang = virar * Math.PI, w = Math.cos(ang) * 172, lift = Math.sin(ang) * 120;
    shape(c, c => { c.moveTo(0, 6); c.quadraticCurveTo(w * 0.5, -lift - 20, w, -lift * 0.7 - 2); c.lineTo(w * 1.02, -lift * 0.7 + 40); c.quadraticCurveTo(w * 0.5, -lift + 30, 0, 50); c.closePath(); }, '#fbf0d6');
    glow(c, w * 0.6, -lift * 0.5, 120, '#ff3020', virar * 0.8);
  }
  aura(c, 0, -60, 150, cor, t, brilho * 0.8);
  c.restore();
}
function aura(c, x, y, r, cor, t, a) {
  for (let i = 0; i < 8; i++) { const an = i / 8 * TAU + t * 0.6; rune(c, x + Math.cos(an) * r * 1.2, y + Math.sin(an) * r * 0.45 - 40, 13, 200 + i, cor, a * (0.6 + 0.4 * Math.sin(t * 3 + i))); }
}

// Pedestal de pedra
export function altar(c, x, y, s = 1, runa = '#6fd8ff', a = 0.8) {
  c.save(); c.translate(x, y); c.scale(s, s);
  rrect(c, -170, -40, 340, 50, 10, '#6a6878');
  rrect(c, -120, -90, 240, 56, 10, '#7a7888');
  rrect(c, -70, -300, 140, 214, 8, '#8a8898');
  rrect(c, -110, -330, 220, 44, 10, '#9a98a8');
  for (let i = 0; i < 3; i++) rune(c, -40 + i * 40, -200 + (i % 2) * 30, 14, 40 + i, runa, a);
  line(c, [[-50, -250], [-30, -230], [-44, -210]], '#5a5868', 4);
  c.restore();
}
// Vela flutuante
export function vela(c, x, y, s, t, cor = '#ffb040', i = 0) {
  const f = 1 + 0.15 * Math.sin(t * 13 + i * 2.3), by = Math.sin(t * 1.3 + i) * 8;
  c.save(); c.translate(x, y + by); c.scale(s, s);
  glow(c, 0, -60, 90 * f, cor, 0.7);
  rrect(c, -14, -40, 28, 70, 6, '#f5ecd8', { lw: 4 });
  shape(c, c => { c.moveTo(0, -78 * f); c.quadraticCurveTo(14, -52, 0, -44); c.quadraticCurveTo(-14, -52, 0, -78 * f); }, cor, { lw: 3 });
  ellipse(c, 0, -52, 4, 6, '#ffffff', { stroke: null });
  c.restore();
}
// Estante cheia de livros coloridos
const BOOKC = ['#d9534f', '#f0ad4e', '#5cb85c', '#5bc0de', '#9b59b6', '#e67e22', '#3a6fd6', '#c0392b', '#16a085'];
export function estante(c, x, y, w, h, seed = 1) {
  const r = rng(seed);
  rrect(c, x, y, w, h, 6, '#7a4a2e');
  const rows = Math.floor(h / 150);
  for (let i = 0; i < rows; i++) {
    const yy = y + 16 + i * (h - 20) / rows, rh = (h - 20) / rows - 16;
    c.fillStyle = '#4a2a1a'; c.fillRect(x + 12, yy, w - 24, rh);
    let px = x + 16;
    while (px < x + w - 30) {
      const bw = 16 + r() * 18, bh = rh * (0.7 + r() * 0.28);
      if (r() < 0.08) { px += 20; continue; }
      rrect(c, px, yy + rh - bh, bw, bh, 3, BOOKC[Math.floor(r() * BOOKC.length)], { lw: 3 });
      line(c, [[px + 4, yy + rh - bh + 14], [px + bw - 4, yy + rh - bh + 14]], '#ffffff', 2, 0.6);
      px += bw + 2;
    }
    rrect(c, x + 4, yy + rh, w - 8, 14, 3, '#9a6a44', { lw: 4 });
  }
}
// Porta de pedra dupla (k = abertura 0..1)
export function portaPedra(c, x, y, w, h, k, glifo = '#6fd8ff') {
  const half = w / 2, off = k * half * 0.95;
  for (const s of [-1, 1]) {
    c.save(); c.beginPath(); c.rect(x - w / 2 - 10, y - h - 10, w + 20, h + 20); c.clip();
    const x0 = s < 0 ? x - half - off : x + off;
    rrect(c, x0, y - h, half, h, 6, '#6e6a7a');
    for (let i = 1; i < 5; i++) line(c, [[x0 + 6, y - h + i * h / 5], [x0 + half - 6, y - h + i * h / 5]], '#5a5666', 4);
    shape(c, c => c.arc(s < 0 ? x0 + half : x0, y - h * 0.55, half * 0.55, s < 0 ? Math.PI / 2 : -Math.PI / 2, s < 0 ? Math.PI * 1.5 : Math.PI / 2), null, { stroke: glifo, lw: 8 });
    c.restore();
  }
  glow(c, x, y - h * 0.55, half * 1.2, glifo, 0.35 * (1 - k));
}
// Bola de cristal com imagem do livro dentro
export function bolaCristal(c, x, y, r, t, a = 1, cor = '#ff2a3a') {
  rrect(c, x - r * 0.7, y + r * 0.7, r * 1.4, r * 0.5, 10, '#3a2a3a');
  glow(c, x, y, r * 2.2, cor, 0.6 * a);
  circle(c, x, y, r, '#2a1030');
  c.save(); c.beginPath(); c.arc(x, y, r - 4, 0, TAU); c.clip();
  c.globalAlpha = a; livro(c, x, y + r * 0.15, r / 320, t, { brilho: 1, cor, flutuar: false });
  c.restore();
  ellipse(c, x - r * 0.35, y - r * 0.4, r * 0.2, r * 0.12, 'rgba(255,255,255,0.6)', { stroke: null }, -0.6);
}

// Livro fechado (com fecho dourado)
export function livroFechado(c, x, y, s, t, { brilho = 0.6, cor = '#7fd8ff', rot = 0 } = {}) {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  glow(c, 0, 0, 200, cor, brilho * 0.6);
  rrect(c, -110, -150, 220, 300, 14, '#f4e6c4');
  rrect(c, -124, -160, 230, 316, 14, '#7a2434');
  rrect(c, -124, -160, 26, 316, 10, '#5a1826', { lw: 4 });
  for (const [px, py] of [[-110, -146], [92, -146], [-110, 142], [92, 142]]) circle(c, px, py, 12, '#e3b23c', { lw: 4 });
  circle(c, -4, 0, 46, '#e3b23c', { lw: 5 }); circle(c, -4, 0, 26, '#3a1020', { lw: 4 }); ellipse(c, -4, 0, 12, 18, cor, { lw: 3 }); glow(c, -4, 0, 60, cor, brilho);
  rrect(c, 90, -26, 40, 52, 8, '#e3b23c', { lw: 4 });
  c.restore();
}
// Página arrancada (borda rasgada, runas vermelhas)
export function paginaRasgada(c, x, y, s, t, brilho = 1, rot = 0) {
  c.save(); c.translate(x, y); c.rotate(rot + Math.sin(t * 3) * 0.05); c.scale(s, s);
  glow(c, 0, 0, 200, '#ff2a1a', brilho * 0.8);
  shape(c, c => { c.moveTo(-70, -95); c.lineTo(70, -95); c.lineTo(70, 95); for (let i = 0; i <= 10; i++) c.lineTo(70 - i * 14, 95 + (i % 2 ? -12 : 6)); c.lineTo(-70, -95); c.closePath(); }, '#f4e2c0');
  for (let i = 0; i < 7; i++) { c.save(); c.globalAlpha *= 0.5 + brilho * 0.5; c.strokeStyle = '#d8241a'; c.lineWidth = 5; c.setLineDash([12, 7]); c.beginPath(); c.moveTo(-52, -70 + i * 22); c.lineTo(52 - (i % 3) * 14, -70 + i * 22); c.stroke(); c.restore(); }
  c.restore();
}
