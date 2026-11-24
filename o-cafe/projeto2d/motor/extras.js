// Elementos de tela para vídeos narrados: faixa de capítulo, seta "VOCÊ", ícones riscados, balão de pensamento.
import { clamp, easeBack, sstep, win, TAU } from './base.js';
import { OUT, shape, rrect, line, circle, poly, ellipse, cloud, sparkle } from './desenho.js';

// faixa de pergaminho com o nome do capítulo (no espaço da tela)
export function faixa(st, t, t0, texto, dur = 2.6) {
  const dt = t - t0; if (dt < 0 || dt > dur) return;
  const k = easeBack(clamp(dt / 0.35)), a = 1 - sstep(dur - 0.3, dur, dt);
  const c = st.c; c.save(); c.globalAlpha = a; c.translate(540, 250); c.scale(k, k);
  c.font = '900 58px Inter, sans-serif'; const w = Math.min(980, c.measureText(texto).width + 120);
  poly(c, [[-w / 2 - 50, -40], [-w / 2, -40], [-w / 2, 50], [-w / 2 - 50, 50], [-w / 2 - 26, 5]], '#b88a4a');
  poly(c, [[w / 2 + 50, -40], [w / 2, -40], [w / 2, 50], [w / 2 + 50, 50], [w / 2 + 26, 5]], '#b88a4a');
  rrect(c, -w / 2, -56, w, 104, 14, '#f2deb0', { lw: 7 });
  c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#5a3418'; c.fillText(texto, 0, -2);
  c.restore();
}
// seta com etiqueta apontando para algo (coordenadas de mundo)
export function setaVoce(c, x, y, t, t0, texto = 'VOCÊ') {
  const dt = t - t0; if (dt < 0) return;
  const k = easeBack(clamp(dt / 0.3)), b = Math.sin(t * 6) * 10;
  c.save(); c.translate(x, y - 150 + b); c.scale(k, k);
  poly(c, [[-26, 40], [26, 40], [0, 90]], '#ffd23a', { lw: 6 });
  rrect(c, -120, -40, 240, 84, 20, '#ffd23a', { lw: 7 });
  c.font = '900 54px Inter, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = OUT; c.fillText(texto, 0, 2);
  c.restore();
}
// ícone moderno (celular, carro, lâmpada) que aparece e é riscado
export function iconeRiscado(c, x, y, tipo, t, t0) {
  const dt = t - t0; if (dt < 0) return;
  const k = easeBack(clamp(dt / 0.3)), x2 = sstep(0.4, 0.6, dt);
  c.save(); c.translate(x, y); c.scale(k, k);
  circle(c, 0, 0, 92, '#ffffff', { lw: 7 });
  if (tipo === 'celular') { rrect(c, -34, -62, 68, 124, 14, '#3a3a4a', { lw: 5 }); rrect(c, -26, -50, 52, 90, 6, '#6ac0f0', { lw: 3 }); circle(c, 0, 50, 5, '#fff', { stroke: null }); }
  if (tipo === 'carro') { rrect(c, -66, -10, 132, 44, 14, '#e04a3a', { lw: 5 }); shape(c, c => { c.moveTo(-40, -10); c.lineTo(-24, -40); c.lineTo(28, -40); c.lineTo(44, -10); c.closePath(); }, '#e04a3a', { lw: 5 }); rrect(c, -18, -34, 20, 20, 3, '#bfe8ff', { lw: 3 }); rrect(c, 8, -34, 20, 20, 3, '#bfe8ff', { lw: 3 }); circle(c, -38, 36, 16, '#3a3a4a', { lw: 5 }); circle(c, 38, 36, 16, '#3a3a4a', { lw: 5 }); }
  if (tipo === 'lampada') { circle(c, 0, -14, 44, '#ffe46a', { lw: 5 }); rrect(c, -22, 26, 44, 34, 6, '#9a9aa8', { lw: 5 }); line(c, [[-12, -14], [0, 4], [12, -14]], '#e0a020', 4); }
  if (x2 > 0) { c.save(); c.globalAlpha = x2; line(c, [[-70, -70], [70, 70]], '#e02a2a', 22); line(c, [[70, -70], [-70, 70]], '#e02a2a', 22); c.restore(); }
  c.restore();
}
// balão de pensamento (mundo); conteudo(c) desenha dentro, centrado em (0,0)
export function balaoPensamento(c, x, y, r, t, a, conteudo) {
  if (a <= 0.01) return;
  c.save(); c.globalAlpha *= a;
  for (const [dx, dy, rr] of [[-r * 0.55, r * 1.25, 16], [-r * 0.4, r * 1.05, 26]]) circle(c, x + dx, y + dy, rr, '#ffffff', { lw: 5 });
  c.save(); c.translate(x, y); c.scale(easeBack(clamp(a)), easeBack(clamp(a)));
  cloud(c, 0, 40, r, '#ffffff', { stroke: OUT, seed: 5 });
  c.beginPath(); c.ellipse(0, -10, r * 0.95, r * 0.62, 0, 0, TAU); c.clip();
  conteudo(c);
  c.restore(); c.restore();
}
// estrelinhas de tontura girando
export function tontura(c, x, y, t, a = 1) { if (a <= 0.01) return; for (let i = 0; i < 4; i++) { const an = t * 6 + i * TAU / 4; sparkle(c, x + Math.cos(an) * 70, y + Math.sin(an) * 22, 14, '#ffe04a', a); } }
// flecha voando
export function flecha(c, x, y, ang) { c.save(); c.translate(x, y); c.rotate(ang); line(c, [[-60, 0], [40, 0]], '#7a4a22', 6); poly(c, [[40, -8], [62, 0], [40, 8]], '#9aa2ae', { lw: 3 }); poly(c, [[-60, 0], [-74, -10], [-50, 0], [-74, 10]], '#e8e0d0', { lw: 3 }); c.restore(); }
// aviso de missão / item no estilo de jogo (âmbar), no espaço da tela
export function avisoJogo(st, t, t0, titulo, texto, dur = 2.8, y = 330) {
  const dt = t - t0; if (dt < 0 || dt > dur) return;
  const k = easeBack(clamp(dt / 0.3)), a = 1 - sstep(dur - 0.3, dur, dt);
  const c = st.c; c.save(); c.globalAlpha = a; c.translate(540, y); c.scale(k, k);
  rrect(c, -460, -80, 920, 160, 16, 'rgba(20,14,6,0.9)', { stroke: '#ffb43a', lw: 6 });
  c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#ffb43a';
  c.font = '700 36px Inter, sans-serif'; c.fillText(titulo, 0, -34);
  c.font = '900 50px Inter, sans-serif'; const w = c.measureText(texto).width; if (w > 860) { c.scale(860 / w, 860 / w); } c.fillText(texto, 0, 26);
  c.restore();
}
