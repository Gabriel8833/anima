// Motor 2D — primitivas de desenho no estilo cartoon (contorno escuro, cor chapada, brilhos suaves).
import { TAU, rng, rgba, lerp, clamp } from './base.js';

export const OUT = '#2b1f2a';   // cor do contorno
export const LW = 6;            // espessura do contorno

// Preenche e contorna o caminho construído por fn(c)
export function shape(c, fn, fill, { stroke = OUT, lw = LW, alpha = 1, rule = 'nonzero' } = {}) {
  c.save(); if (alpha < 1) c.globalAlpha *= alpha;
  c.beginPath(); fn(c);
  if (fill) { c.fillStyle = fill; c.fill(rule); }
  if (stroke) { c.lineWidth = lw; c.strokeStyle = stroke; c.lineJoin = 'round'; c.lineCap = 'round'; c.stroke(); }
  c.restore();
}
export const circle = (c, x, y, r, fill, o) => shape(c, c => c.arc(x, y, r, 0, TAU), fill, o);
export const ellipse = (c, x, y, rx, ry, fill, o, rot = 0) => shape(c, c => c.ellipse(x, y, Math.abs(rx), Math.abs(ry), rot, 0, TAU), fill, o);
export const rrect = (c, x, y, w, h, r, fill, o) => shape(c, c => c.roundRect(x, y, w, h, r), fill, o);
export const poly = (c, pts, fill, o, close = true) => shape(c, c => { pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y))); if (close) c.closePath(); }, fill, o);
export function line(c, pts, color = OUT, w = LW, alpha = 1) {
  c.save(); c.globalAlpha *= alpha; c.beginPath(); pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
  c.strokeStyle = color; c.lineWidth = w; c.lineCap = 'round'; c.lineJoin = 'round'; c.stroke(); c.restore();
}
// curva suave por pontos (quadráticas pelos pontos médios)
function smoothPath(c, pts) {
  c.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length - 1; i++) { const mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2; c.quadraticCurveTo(pts[i][0], pts[i][1], mx, my); }
  const l = pts[pts.length - 1]; c.lineTo(l[0], l[1]);
}
// Membro "macarrão": traço grosso com contorno
export function limb(c, pts, w, color, { outline = OUT, lw = LW } = {}) {
  c.save(); c.lineCap = 'round'; c.lineJoin = 'round';
  c.beginPath(); smoothPath(c, pts); c.strokeStyle = outline; c.lineWidth = w + lw * 2; c.stroke();
  c.beginPath(); smoothPath(c, pts); c.strokeStyle = color; c.lineWidth = w; c.stroke();
  c.restore();
}
// Nuvem fofa (círculos unidos com contorno único)
export function cloud(c, x, y, s, fill, { stroke = null, lw = LW, alpha = 1, seed = 1 } = {}) {
  const r = rng(seed), bumps = [];
  const n = 5 + Math.floor(r() * 3);
  for (let i = 0; i < n; i++) { const u = i / (n - 1); bumps.push([x + (u - 0.5) * s * 2.2, y - Math.sin(u * Math.PI) * s * 0.45 + (r() - 0.5) * s * 0.1, s * (0.42 + Math.sin(u * Math.PI) * 0.35 + r() * 0.12)]); }
  c.save(); c.globalAlpha *= alpha;
  if (stroke) { c.beginPath(); bumps.forEach(([bx, by, br]) => { c.moveTo(bx + br + lw, by); c.arc(bx, by, br + lw, 0, TAU); }); c.rect(x - s * 1.4, y, s * 2.8, s * 0.35 + lw); c.fillStyle = stroke; c.fill(); }
  c.beginPath(); bumps.forEach(([bx, by, br]) => { c.moveTo(bx + br, by); c.arc(bx, by, br, 0, TAU); }); c.rect(x - s * 1.3, y, s * 2.6, s * 0.35); c.fillStyle = fill; c.fill();
  c.restore();
}

// ---------- luz ----------
const glowCache = new Map();
function glowSprite(color) {
  if (glowCache.has(color)) return glowCache.get(color);
  const cv = document.createElement('canvas'); cv.width = cv.height = 256; const x = cv.getContext('2d');
  const g = x.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, rgba(color, 1)); g.addColorStop(0.25, rgba(color, 0.55)); g.addColorStop(0.6, rgba(color, 0.15)); g.addColorStop(1, rgba(color, 0));
  x.fillStyle = g; x.fillRect(0, 0, 256, 256); glowCache.set(color, cv); return cv;
}
// brilho aditivo
export function glow(c, x, y, r, color, a = 1) {
  if (a <= 0.001 || r <= 0) return;
  c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha *= clamp(a); c.drawImage(glowSprite(color), x - r, y - r, r * 2, r * 2); c.restore();
}
// raios de luz diagonais (como luz entrando por janela)
export function rays(c, x, y, ang, n, len, spread, color, a, t = 0, seed = 3) {
  const r = rng(seed);
  c.save(); c.globalCompositeOperation = 'lighter'; c.translate(x, y); c.rotate(ang);
  for (let i = 0; i < n; i++) {
    const off = (r() - 0.5) * spread, w = 20 + r() * 70, al = a * (0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * (0.6 + r()) + i * 2)));
    const g = c.createLinearGradient(0, 0, 0, len); g.addColorStop(0, rgba(color, al)); g.addColorStop(1, rgba(color, 0));
    c.fillStyle = g; c.beginPath(); c.moveTo(off - w * 0.3, 0); c.lineTo(off + w * 0.3, 0); c.lineTo(off + w * 1.4, len); c.lineTo(off - w * 1.4, len); c.closePath(); c.fill();
  }
  c.restore();
}
// estrela de brilho (4 pontas)
export function sparkle(c, x, y, s, color = '#ffffff', a = 1) {
  if (a <= 0.01 || s <= 0) return;
  c.save(); c.globalAlpha *= clamp(a); c.fillStyle = color; c.beginPath();
  c.moveTo(x, y - s); c.quadraticCurveTo(x, y, x + s, y); c.quadraticCurveTo(x, y, x, y + s); c.quadraticCurveTo(x, y, x - s, y); c.quadraticCurveTo(x, y, x, y - s);
  c.fill(); c.restore(); glow(c, x, y, s * 1.6, color, a * 0.5);
}
export function star5(c, x, y, r, fill, o) {
  shape(c, c => { for (let i = 0; i <= 10; i++) { const a = i / 10 * TAU - Math.PI / 2, rr = i % 2 ? r * 0.45 : r; c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } c.closePath(); }, fill, o);
}
// gradiente vertical num retângulo
export function vgrad(c, x, y, w, h, stops) {
  const g = c.createLinearGradient(0, y, 0, y + h); stops.forEach(([p, col]) => g.addColorStop(p, col)); c.fillStyle = g; c.fillRect(x, y, w, h);
}
// glifo rúnico simples
export function rune(c, x, y, s, seed, color = '#9fe4ff', a = 1, w = 4) {
  if (a <= 0.01) return;
  const r = rng(seed);
  c.save(); c.globalAlpha *= clamp(a); c.strokeStyle = color; c.lineWidth = w; c.lineCap = 'round'; c.beginPath();
  const n = 2 + Math.floor(r() * 3);
  for (let i = 0; i < n; i++) { const a1 = r() * TAU, a2 = r() * TAU; c.moveTo(x + Math.cos(a1) * s, y + Math.sin(a1) * s); if (r() < 0.5) c.lineTo(x + Math.cos(a2) * s, y + Math.sin(a2) * s); else c.quadraticCurveTo(x, y, x + Math.cos(a2) * s, y + Math.sin(a2) * s); }
  if (r() < 0.5) { c.moveTo(x + s * 0.35, y); c.arc(x, y, s * 0.35, 0, TAU); }
  c.stroke(); c.restore(); glow(c, x, y, s * 2.2, color, a * 0.45);
}
// círculo mágico girando
export function magicCircle(c, x, y, r, color, a, t, seed = 2, squash = 1) {
  if (a <= 0.01) return;
  c.save(); c.translate(x, y); c.scale(1, squash); c.globalAlpha *= clamp(a); c.strokeStyle = color; c.lineCap = 'round';
  c.lineWidth = 6; c.beginPath(); c.arc(0, 0, r, 0, TAU); c.stroke();
  c.lineWidth = 3; c.beginPath(); c.arc(0, 0, r * 0.82, 0, TAU); c.stroke(); c.beginPath(); c.arc(0, 0, r * 0.45, 0, TAU); c.stroke();
  c.rotate(t * 0.6);
  for (let k = 0; k < 2; k++) { c.beginPath(); for (let i = 0; i <= 3; i++) { const an = i / 3 * TAU + k * Math.PI / 3; c.lineTo(Math.cos(an) * r * 0.82, Math.sin(an) * r * 0.82); } c.stroke(); }
  c.restore();
  c.save(); c.translate(x, y); c.scale(1, squash);
  for (let i = 0; i < 10; i++) { const an = i / 10 * TAU - t * 0.4; rune(c, Math.cos(an) * r * 0.91, Math.sin(an) * r * 0.91, r * 0.055, seed * 31 + i, color, a, 3); }
  c.restore();
  glow(c, x, y, r * 1.4, color, a * 0.35);
}
// linhas de velocidade / foco (radiais)
export function speedLines(c, cx, cy, n, r0, r1, a, t, color = '#ffffff', seed = 9) {
  if (a <= 0.01) return;
  const r = rng(seed + Math.floor(t * 12));
  c.save(); c.globalAlpha *= clamp(a); c.fillStyle = color;
  for (let i = 0; i < n; i++) { const an = r() * TAU, w = 0.004 + r() * 0.012, rr0 = r0 * (0.9 + r() * 0.4); c.beginPath(); c.moveTo(cx + Math.cos(an) * rr0, cy + Math.sin(an) * rr0); c.lineTo(cx + Math.cos(an - w) * r1, cy + Math.sin(an - w) * r1); c.lineTo(cx + Math.cos(an + w) * r1, cy + Math.sin(an + w) * r1); c.fill(); }
  c.restore();
}
