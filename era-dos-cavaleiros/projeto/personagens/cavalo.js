// Cavalo cartoon animado (passo ou galope), virado para a direita; flip = -1 vira para a esquerda.
// montaria(c) desenha o cavaleiro sentado: é chamada entre as pernas de trás e o corpo do cavalo.
import { TAU, lerp } from '../motor/base.js';
import { OUT, shape, circle, ellipse, limb, line, poly, rrect } from '../motor/desenho.js';

export const SELA = [-6, -248]; // ponto da sela (local, s = 1)

export function cavalo(c, x, y, s, t, { cor = '#f2ece2', crina = '#c8b8a0', fase = 0, galope = 0, flip = 1, manta = '#2f5ab8', enfeite = '#f2d060', montaria = null, parado = false } = {}) {
  const amp = parado ? 0 : lerp(0.35, 0.8, galope), bob = parado ? 0 : Math.abs(Math.sin(fase)) * lerp(6, 18, galope);
  c.save(); c.translate(x, y); c.scale(s * flip, s);
  c.save(); c.globalAlpha *= 0.22; c.fillStyle = '#000'; c.beginPath(); c.ellipse(0, 4, 190, 18, 0, 0, TAU); c.fill(); c.restore();
  const perna = (hx, hy, ph, cl) => {
    const a = Math.sin(fase + ph) * amp, k = Math.max(0, Math.sin(fase + ph + 1.2)) * amp * 1.4;
    const jx = hx + Math.sin(a) * 70, jy = hy + Math.cos(a) * 70;
    const fx = jx + Math.sin(a - k) * 66, fy = Math.min(-8, jy + Math.cos(a - k) * 66);
    limb(c, [[hx, hy], [jx, jy], [fx, fy]], 26, cl);
    rrect(c, fx - 16, fy - 4, 32, 16, 5, '#3a2a22', { lw: 4 });
  };
  c.translate(0, -bob);
  // pernas de trás (lado de lá)
  perna(-96, -140, Math.PI + 0.6, shade(cor)); perna(92, -140, 0.6, shade(cor));
  // cauda
  const ct = Math.sin(t * 4 + fase) * 16;
  shape(c, c => { c.moveTo(-150, -200); c.quadraticCurveTo(-230, -190 + ct, -220, -90 + ct); c.quadraticCurveTo(-200, -150, -140, -170); c.closePath(); }, crina);
  if (montaria) montaria(c, bob);
  // pernas da frente (lado de cá)
  perna(-86, -140, 0, cor); perna(100, -140, Math.PI, cor);
  // corpo
  ellipse(c, 0, -190, 158, 72, cor);
  // manta e sela
  if (manta) { shape(c, c => { c.moveTo(-70, -250); c.lineTo(60, -250); c.lineTo(70, -150); c.quadraticCurveTo(0, -136, -80, -150); c.closePath(); }, manta); line(c, [[-78, -160], [68, -160]], enfeite, 6); }
  rrect(c, -50, -270, 92, 30, 10, '#6a3a1a', { lw: 5 });
  // pescoço e cabeça
  const hb = Math.sin(fase * 2) * 4;
  shape(c, c => { c.moveTo(90, -230); c.quadraticCurveTo(140, -300, 170, -350 + hb); c.lineTo(214, -320 + hb); c.quadraticCurveTo(190, -250, 150, -160); c.closePath(); }, cor);
  shape(c, c => { c.moveTo(96, -244); c.quadraticCurveTo(130, -320, 166, -366 + hb); c.lineTo(150, -330 + hb); c.quadraticCurveTo(120, -280, 110, -230); c.closePath(); }, crina, { lw: 5 });
  c.save(); c.translate(214, -334 + hb); c.rotate(0.55);
  ellipse(c, 10, 0, 66, 34, cor);
  ellipse(c, 60, 4, 22, 24, shade(cor), { lw: 4 });
  circle(c, 66, -4, 4, OUT, { stroke: null });
  ellipse(c, -6, -14, 8, 10, OUT, { stroke: null }); circle(c, -4, -18, 3, '#fff', { stroke: null });
  poly(c, [[-26, -26], [-18, -62], [-6, -28]], cor, { lw: 4 });
  line(c, [[-10, 16], [50, 22]], '#6a3a1a', 5);
  c.restore();
  c.restore();
}
function shade(hex) { const n = parseInt(hex.slice(1), 16), r = (n >> 16) * 0.82, g = ((n >> 8) & 255) * 0.82, b = (n & 255) * 0.82; return '#' + [r, g, b].map(v => Math.round(v).toString(16).padStart(2, '0')).join(''); }
