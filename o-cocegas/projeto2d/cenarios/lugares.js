// Cenários de "Cócegas": sala (reaproveitada), escritório dentro do cérebro, telas e diagramas.
import { TAU, lerp, clamp, sstep, rng, mix, easeOut, easeBack, easeInOut } from '../motor/base.js';
import { OUT, shape, circle, ellipse, poly, rrect, line, glow, cloud, vgrad, sparkle, limb } from '../motor/desenho.js';
export { sala, mesaFrente, SALA } from './sala.js';
export { detetive } from './pensar.js';
export { xicaraC, cerebroP } from './base.js';

const txt = (c, s, x, y, size, cor = '#ffffff', al = 'center', w = 900) => { c.save(); c.font = `900 ${size}px Inter, sans-serif`; c.textAlign = al; c.textBaseline = 'middle'; c.fillStyle = cor; c.fillText(s, x, y, w); c.restore(); };

// escritório dentro da cabeça
export function escritorio(st, t) {
  st.mundo(c => {
    vgrad(c, -1200, -400, 3500, 2200, [[0, '#ff9ec4'], [0.55, '#c87ae0'], [1, '#7a4ac8']]);
    for (let i = 0; i < 10; i++) { const r = rng(i + 3); cloud(c, -300 + r() * 1700, 100 + r() * 1100, 80 + r() * 70, 'rgba(255,255,255,0.12)', { seed: i }); }
    // "dobras" do cérebro no teto
    for (let k = 0; k < 7; k++) shape(c, c => { const x = -200 + k * 230; c.moveTo(x, 200); c.quadraticCurveTo(x + 60, 120 + Math.sin(t + k) * 10, x + 120, 200); c.quadraticCurveTo(x + 180, 280, x + 230, 200); }, null, { stroke: 'rgba(255,255,255,0.25)', lw: 10 });
    vgrad(c, -1200, 1580, 3500, 1000, [[0, '#5a3a8a'], [1, '#3a2460']]);
    for (let x = -1200; x < 2300; x += 160) line(c, [[x, 1580], [x - 200, 2600]], 'rgba(255,255,255,0.06)', 4);
    // luzinhas piscando nas paredes
    for (let i = 0; i < 16; i++) { const x = -300 + (i * 157) % 1700, y = 380 + (i * 97) % 500; glow(c, x, y, 30, i % 2 ? '#7af0ff' : '#fff2a0', 0.4 + 0.5 * Math.abs(Math.sin(t * 2 + i))); circle(c, x, y, 5, '#ffffff', { stroke: null }); }
  });
}
export function cadeira(c, x, y, rot = 0) {
  c.save(); c.translate(x, y); c.rotate(rot);
  rrect(c, -130, -420, 260, 300, 50, '#2a2a3a', { lw: 6 }); rrect(c, -100, -395, 200, 240, 36, '#3a3a52', { stroke: null });
  rrect(c, -150, -130, 300, 60, 24, '#2a2a3a', { lw: 6 });
  c.restore();
  line(c, [[x, y - 70], [x, y + 60]], '#5a5a70', 16);
  for (const s of [-1, 0, 1]) { line(c, [[x, y + 60], [x + s * 120, y + 100]], '#5a5a70', 12); circle(c, x + s * 120, y + 108, 14, '#1a1a22', { lw: 4 }); }
}
export function mesa(c, x, y, w = 700) { rrect(c, x - w / 2, y, w, 40, 8, '#f6d55c', { lw: 6 }); rrect(c, x - w / 2 + 20, y + 40, w - 40, 160, 8, '#f2b84a', { lw: 6 }); }
export function botao(c, x, y, aperta = 0, luz = 0) {
  rrect(c, x - 70, y - 20, 140, 40, 10, '#3a3a50', { lw: 5 });
  ellipse(c, x, y - 20 + aperta * 14, 50, 18, '#d8302a', { lw: 5 }); rrect(c, x - 50, y - 46 + aperta * 14, 100, 26, 4, '#e8483a', { stroke: null }); ellipse(c, x, y - 46 + aperta * 14, 50, 18, '#ff6a5a', { lw: 5 });
  if (luz > 0) glow(c, x, y - 40, 160, '#ff6a5a', luz);
}
export function monitor(c, x, y, w, h, fn) {
  rrect(c, x - w / 2 - 20, y - h / 2 - 20, w + 40, h + 40, 18, '#2a2a3a', { lw: 7 });
  c.save(); c.beginPath(); c.roundRect(x - w / 2, y - h / 2, w, h, 8); c.clip();
  vgrad(c, x - w / 2, y - h / 2, w, h, [[0, '#14204a'], [1, '#1e3070']]);
  for (let yy = y - h / 2; yy < y + h / 2; yy += 8) { c.fillStyle = 'rgba(255,255,255,0.03)'; c.fillRect(x - w / 2, yy, w, 3); }
  c.translate(x, y); fn(c); c.restore();
  rrect(c, x - 30, y + h / 2 + 20, 60, 70, 4, '#2a2a3a', { lw: 5 });
}
// silhueta do corpo + mão vindo (dentro do monitor; coordenadas locais)
export function corpoTela(c, s = 1) {
  c.save(); c.scale(s, s);
  circle(c, 0, -160, 60, null, { stroke: '#7ac8ff', lw: 6 });
  shape(c, c => { c.moveTo(-80, -90); c.lineTo(80, -90); c.lineTo(70, 150); c.lineTo(-70, 150); c.closePath(); }, null, { stroke: '#7ac8ff', lw: 6 });
  line(c, [[-80, -80], [-170, -170]], '#7ac8ff', 6);
  c.restore();
}
export function maoTela(c, x, y, cor = '#ffd36a', tracejada = false, dedos = 0, t = 0) {
  c.save(); c.translate(x, y);
  if (tracejada) c.setLineDash([14, 10]);
  c.strokeStyle = cor; c.lineWidth = 7; c.lineJoin = 'round';
  c.beginPath(); c.moveTo(150, 30); c.lineTo(40, 30); c.quadraticCurveTo(10, 30, 10, 0); c.quadraticCurveTo(10, -30, 40, -30); c.lineTo(150, -30); c.stroke();
  for (let k = 0; k < 4; k++) { const w = Math.sin(t * 20 + k) * 8 * dedos; c.beginPath(); c.moveTo(14, -24 + k * 16); c.lineTo(-30 - (k === 0 || k === 3 ? 0 : 10), -26 + k * 16 + w); c.stroke(); }
  c.restore();
}
export function medidor(c, x, y, valor, rotulo, cor = '#ff6a5a') {
  rrect(c, x - 160, y - 30, 320, 60, 30, '#1a1a2a', { lw: 5 });
  rrect(c, x - 150, y - 20, 300 * clamp(valor), 40, 20, cor, { stroke: null });
  txt(c, rotulo, x, y - 62, 38, '#ffffff');
}
export function prancheta(c, x, y) { c.save(); c.translate(x, y - 20); c.rotate(-0.15); rrect(c, -50, -66, 100, 132, 8, '#a8744a', { lw: 4 }); rrect(c, -40, -54, 80, 112, 3, '#fffaf0', { stroke: null }); for (let i = 0; i < 5; i++) line(c, [[-30, -36 + i * 18], [26 - (i % 2) * 14, -36 + i * 18]], '#9aa0b8', 3); rrect(c, -20, -72, 40, 16, 4, '#c8c8d0', { lw: 3 }); c.restore(); }
export const rotulo = txt;
