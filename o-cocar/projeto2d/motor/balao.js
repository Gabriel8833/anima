// Sinais cartunescos sobre a cabeça: "!", "?", gotas, estrelinhas de tontura.
import { clamp, easeBack } from './base.js';
import { shape, line, sparkle } from './desenho.js';

export function exclamacao(c, x, y, dt, cor = '#ffd23a') {
  if (dt <= 0 || dt > 1.4) return;
  const k = easeBack(clamp(dt / 0.25)), a = 1 - clamp((dt - 1.0) / 0.4);
  c.save(); c.globalAlpha *= a; c.translate(x, y); c.scale(k, k); c.rotate(0.12);
  shape(c, c => { c.moveTo(-16, -110); c.lineTo(16, -110); c.lineTo(9, -30); c.lineTo(-9, -30); c.closePath(); }, cor, { lw: 6 });
  shape(c, c => c.arc(0, -6, 13, 0, Math.PI * 2), cor, { lw: 6 });
  for (const s of [-1, 1]) line(c, [[s * 34, -96], [s * 54, -116]], '#fff', 6);
  c.restore();
}
export function interrogacao(c, x, y, dt, cor = '#ffffff') {
  if (dt <= 0 || dt > 1.6) return;
  const k = easeBack(clamp(dt / 0.25)), a = 1 - clamp((dt - 1.2) / 0.4);
  c.save(); c.globalAlpha *= a; c.translate(x, y); c.scale(k, k);
  c.font = '900 120px Inter, sans-serif'; c.textAlign = 'center'; c.lineWidth = 14; c.strokeStyle = '#2b1f2a'; c.strokeText('?', 0, 0); c.fillStyle = cor; c.fillText('?', 0, 0);
  c.restore();
}
