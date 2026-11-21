// A Sombra do Livro: criatura gigante de sombra com chifres e olhos vermelhos.
import { TAU, clamp, lerp, rgba } from '../motor/base.js';
import { OUT, shape, ellipse, limb, line, glow, poly } from '../motor/desenho.js';
import { fumaca } from '../motor/efeitos.js';

// (x,y) = base da criatura; s = escala; olhos 0..1; boca 0..1 (aberta); alpha
export function criatura(c, x, y, s, t, { olhos = 1, boca = 0, alpha = 1, raiva = 0, rachado = 0 } = {}) {
  if (alpha <= 0.01 || s <= 0.01) return;
  c.save(); c.globalAlpha *= alpha; c.translate(x, y); c.scale(s, s);
  glow(c, 0, -300, 520, '#ff1030', 0.35 + raiva * 0.2);
  fumaca(c, 0, -40, 260, t, 0.9, '#12061a', 5);
  const corpo = '#1c0c26';
  // tentáculos/braços
  for (const sd of [-1, 1]) {
    const w = Math.sin(t * 2.2 + sd) * 40;
    limb(c, [[sd * 150, -340], [sd * 300, -300 + w], [sd * 380, -160 - w], [sd * 330, -40 + w * 0.5]], 70, corpo, { outline: '#3a0a1a', lw: 8 });
    for (let k = 0; k < 3; k++) limb(c, [[sd * 330, -40 + w * 0.5], [sd * (300 + k * 30), 10 + w * 0.3]], 18, corpo, { outline: '#3a0a1a', lw: 6 });
  }
  // corpo ondulado
  shape(c, c => {
    const N = 40;
    for (let i = 0; i <= N; i++) {
      const a = Math.PI + i / N * Math.PI, r = 260 + Math.sin(a * 6 + t * 3) * 14;
      c.lineTo(Math.cos(a) * r * 0.95, -300 + Math.sin(a) * r * 1.15);
    }
    for (let i = 0; i <= 12; i++) { const u = i / 12; c.lineTo(lerp(250, -250, u), -60 + Math.sin(u * 18 + t * 5) * 30); }
    c.closePath();
  }, corpo, { stroke: '#3a0a1a', lw: 9 });
  // chifres
  for (const sd of [-1, 1]) poly(c, [[sd * 110, -560], [sd * 230, -760 + Math.sin(t) * 10], [sd * 180, -560], [sd * 150, -520]], '#2a1830', { stroke: '#3a0a1a', lw: 8 });
  // olhos
  for (const sd of [-1, 1]) {
    c.save(); c.translate(sd * 90, -380); c.rotate(sd * (0.25 + raiva * 0.15));
    ellipse(c, 0, 0, 52, 26 * Math.max(0.08, olhos), '#ff2a1a', { stroke: '#3a0a1a', lw: 6 });
    ellipse(c, 0, 0, 12, 18 * Math.max(0.08, olhos), '#fff2c0', { stroke: null });
    c.restore(); glow(c, sd * 90, -380, 120, '#ff2a1a', olhos);
  }
  // boca com dentes
  if (boca > 0.02) {
    const h = 90 * boca;
    shape(c, c => { c.moveTo(-130, -250); c.quadraticCurveTo(0, -250 + h * 2.2, 130, -250); c.quadraticCurveTo(0, -250 + h * 0.6, -130, -250); c.closePath(); }, '#6a0a14', { stroke: '#3a0a1a', lw: 6 });
    for (let i = 0; i < 7; i++) { const x0 = -110 + i * 36; poly(c, [[x0, -250 + h * 0.1], [x0 + 14, -250 + h * 0.6], [x0 + 28, -250 + h * 0.15]], '#fff6e0', { lw: 3 }); }
  } else line(c, [[-110, -250], [-40, -236], [40, -236], [110, -250]], '#ff4a3a', 6);
  if (rachado > 0) {
    const R = [[[0, -540], [-40, -440], [10, -360], [-30, -260]], [[-200, -420], [-120, -380], [-140, -300], [-60, -240]], [[210, -400], [140, -350], [170, -260], [90, -180]], [[-60, -160], [20, -120], [-10, -60]], [[120, -520], [80, -460], [130, -420]]];
    R.forEach((pts, i) => { const k = clamp(rachado * 1.6 - i * 0.15); if (k <= 0) return; const p = pts.slice(0, Math.max(2, Math.ceil(pts.length * k))); line(c, p, '#ffffff', 14, 0.9); line(c, p, '#fff6c8', 6); glow(c, p[p.length - 1][0], p[p.length - 1][1], 120, '#ffffff', k); });
    glow(c, 0, -300, 600, '#ffffff', rachado * 0.5);
  }
  c.restore();
}
