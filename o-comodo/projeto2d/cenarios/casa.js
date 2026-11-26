// Dois cômodos em corte (sala | porta | cozinha) e peças das cenas dentro da cabeça.
import { TAU, lerp, clamp, sstep, rng, mix, easeOut, easeBack } from '../motor/base.js';
import { OUT, shape, circle, ellipse, poly, rrect, line, glow, cloud, vgrad, sparkle, limb } from '../motor/desenho.js';

export const CASA = { chao: 1760, piso: 1500, porta: 1200, teto: 380 };
const P = CASA.porta;

// a parede-divisória com a porta (em corte). abre: 0 fechada … 1 aberta
export function porta(c, abre, t) {
  // batente e verga
  rrect(c, P - 60, CASA.teto, 120, 700, 0, '#e8dcc8', { lw: 6 });
  rrect(c, P - 70, 1060, 140, 30, 4, '#8a5a3a', { lw: 5 });
  for (const s of [-1, 1]) rrect(c, P + s * 50 - 12, 1080, 24, 690, 4, '#8a5a3a', { lw: 5 });
  // folha da porta girando para a cozinha
  const fx = lerp(P - 38, P + 260, easeOut(abre)), sq = Math.sin(abre * Math.PI) * 30;
  shape(c, c => { c.moveTo(P + 38, 1092); c.lineTo(fx, 1092 + sq); c.lineTo(fx, 1756 - sq); c.lineTo(P + 38, 1756); c.closePath(); }, '#b8743a', { lw: 6 });
  if (abre < 0.5) { rrect(c, P - 30, 1130, 60, 220, 4, 'rgba(0,0,0,0.12)', { stroke: null }); rrect(c, P - 30, 1400, 60, 300, 4, 'rgba(0,0,0,0.12)', { stroke: null }); }
  circle(c, lerp(P - 20, fx - 30, abre), 1420, 12, '#e8c040', { lw: 4 });
}
// sala (esquerda) e cozinha (direita)
export function casa(st, t, { abre = 0, divisoria = 0, celular = true } = {}) {
  st.mundo(c => {
    // ---- sala ----
    vgrad(c, -1400, -400, 2600 + 0, 1900, [[0, '#f8d58e'], [1, '#f0bf6a']]);
    for (let x = -1400; x < P; x += 110) { c.fillStyle = 'rgba(255,255,255,0.12)'; c.fillRect(x, -400, 46, 1900); }
    // janela, quadro, luminária
    rrect(c, -380, 640, 320, 400, 8, '#bfe6f6', { lw: 8 }); line(c, [[-220, 640], [-220, 1040]], OUT, 8); line(c, [[-380, 840], [-60, 840]], OUT, 8);
    cloud(c, -280 + ((t * 20) % 200), 720, 40, '#ffffff', { seed: 2 });
    rrect(c, 200, 700, 200, 150, 6, '#e2575c', { lw: 6 }); rrect(c, 216, 716, 168, 118, 3, '#fff3d8', { stroke: null }); circle(c, 300, 775, 34, '#f4c430', { lw: 4 });
    line(c, [[900, 1500], [900, 1050]], '#3a3a44', 10); shape(c, c => { c.moveTo(840, 1050); c.lineTo(960, 1050); c.lineTo(930, 960); c.lineTo(870, 960); c.closePath(); }, '#ffe08a', { lw: 5 }); glow(c, 900, 1040, 260, '#ffd890', 0.4);
    // sofá com o celular
    rrect(c, 120, 1240, 560, 190, 40, '#2c78dc', { lw: 6 }); rrect(c, 100, 1380, 600, 130, 26, '#3a8af0', { lw: 6 });
    for (const s of [-1, 1]) rrect(c, 400 + s * 300 - 44, 1310, 88, 200, 30, '#2c78dc', { lw: 6 });
    if (celular) { c.save(); c.translate(560, 1372); c.rotate(-0.2); rrect(c, -26, -48, 52, 92, 8, '#1a1a22', { lw: 4 }); rrect(c, -20, -40, 40, 72, 3, '#2a3a5a', { stroke: null }); rrect(c, -12, -20, 24, 40, 4, null, { stroke: '#e2473a', lw: 3 }); rrect(c, -9, 10, 8 * (Math.floor(t * 2) % 2), 6, 1, '#e2473a', { stroke: null }); c.restore(); if (Math.floor(t * 2) % 2) glow(c, 560, 1360, 60, '#ff4a3a', 0.5); }
    // ---- cozinha ----
    vgrad(c, P, -400, 2600, 1900, [[0, '#9fe0d4'], [1, '#7ac8bc']]);
    for (let y = 900; y < 1500; y += 60) for (let x = P + 60; x < P + 2600; x += 60) rrect(c, x + ((y / 60) % 2) * 30, y, 56, 56, 2, 'rgba(255,255,255,0.18)', { stroke: null });
    rrect(c, P + 260, 980, 220, 520, 14, '#f2f2ec', { lw: 6 }); line(c, [[P + 260, 1180], [P + 480, 1180]], OUT, 5); rrect(c, P + 440, 1060, 14, 70, 6, '#9a9aa8', { lw: 3 }); rrect(c, P + 440, 1220, 14, 90, 6, '#9a9aa8', { lw: 3 });
    rrect(c, P + 560, 1240, 600, 260, 8, '#e2a05c', { lw: 6 }); rrect(c, P + 540, 1220, 640, 34, 6, '#f2f2ec', { lw: 5 });
    for (let k = 0; k < 3; k++) { rrect(c, P + 580 + k * 190, 1280, 170, 200, 6, '#f0b06c', { lw: 4 }); rrect(c, P + 650 + k * 190, 1300, 30, 10, 4, '#5a3a2a', { lw: 3 }); }
    rrect(c, P + 600, 760, 500, 200, 8, '#e2a05c', { lw: 6 }); for (let k = 0; k < 2; k++) rrect(c, P + 620 + k * 240, 780, 220, 160, 6, '#f0b06c', { lw: 4 });
    rrect(c, P + 760, 1140, 120, 80, 10, '#e2473a', { lw: 4 });
    // chão
    vgrad(c, -1400, CASA.piso, 4400, 1100, [[0, '#c98b55'], [1, '#a86a3c']]);
    for (let y = 1560; y < 2600; y += 80) line(c, [[-1400, y], [3000, y]], '#b77a48', 3);
    c.fillStyle = 'rgba(255,255,255,0.15)'; for (let x = P + 40; x < P + 2400; x += 120) for (let y = CASA.piso; y < 2600; y += 120) if (((x + y) / 120) % 2 < 1) c.fillRect(x, y, 120, 120);
    porta(c, abre, t);
    // divisória visual entre os "episódios"
    if (divisoria > 0) { c.save(); c.globalAlpha = divisoria; c.globalCompositeOperation = 'lighter'; const g = c.createLinearGradient(P - 40, 0, P + 40, 0); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.5, 'rgba(255,255,255,0.8)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(P - 40, CASA.teto, 80, 1500); c.restore(); for (let k = 0; k < 8; k++) sparkle(c, P + Math.sin(t * 3 + k) * 20, 500 + k * 160 + Math.sin(t * 2 + k) * 30, 12, '#ffffff', divisoria); }
  });
}
// ícone do carregador (o objetivo esquecido)
export function carregador(c, x, y, s = 1) {
  c.save(); c.translate(x, y); c.scale(s, s);
  rrect(c, -30, -40, 60, 54, 10, '#f2f2ec', { lw: 5 }); for (const d of [-12, 12]) rrect(c, d - 4, -62, 8, 22, 2, '#c8c8d0', { lw: 3 });
  shape(c, c => { c.moveTo(0, 14); c.bezierCurveTo(0, 70, 70, 40, 60, 100); }, null, { stroke: '#f2f2ec', lw: 9 }); shape(c, c => { c.moveTo(0, 14); c.bezierCurveTo(0, 70, 70, 40, 60, 100); }, null, { stroke: OUT, lw: 3 });
  c.restore();
}
export function celularBateria(c, x, y, s = 1, t = 0) { c.save(); c.translate(x, y); c.scale(s, s); rrect(c, -40, -74, 80, 148, 12, '#1a1a22', { lw: 5 }); rrect(c, -30, -60, 60, 116, 4, '#2a3a5a', { stroke: null }); rrect(c, -18, -30, 36, 60, 5, null, { stroke: '#e2473a', lw: 4 }); rrect(c, -8, -38, 16, 8, 2, '#e2473a', { stroke: null }); if (Math.floor(t * 3) % 2) rrect(c, -12, 18, 24, 8, 2, '#e2473a', { stroke: null }); c.restore(); }
export function cracha(c, x, y) { c.save(); c.translate(x, y); line(c, [[0, -60], [0, -10]], '#2c78dc', 5); rrect(c, -34, -12, 68, 84, 8, '#ffffff', { lw: 4 }); circle(c, 0, 16, 14, '#ff9eb8', { lw: 3 }); rrect(c, -20, 40, 40, 8, 3, '#9aa0b8', { stroke: null }); c.restore(); }
export function portaSaida(c, x, y, abre = 0) {
  rrect(c, x - 110, y - 420, 220, 420, 6, '#2a2a3a', { lw: 6 });
  c.save(); c.translate(x - 110, y - 420); c.scale(1 - abre * 0.8, 1); rrect(c, 0, 0, 220, 420, 6, '#5a6a9a', { lw: 6 }); circle(c, 190, 220, 10, '#e8c040', { lw: 3 }); c.restore();
  rrect(c, x - 70, y - 500, 140, 60, 8, '#2aa060', { lw: 5 });
  // pictograma de pessoa correndo
  c.save(); c.translate(x, y - 470); c.strokeStyle = '#ffffff'; c.lineWidth = 6; c.lineCap = 'round'; circle(c, 14, -14, 7, '#ffffff', { stroke: null }); c.beginPath(); c.moveTo(8, -6); c.lineTo(0, 10); c.lineTo(-14, 18); c.moveTo(0, 10); c.lineTo(10, 22); c.moveTo(4, -2); c.lineTo(-12, 2); c.moveTo(4, -2); c.lineTo(18, 6); c.stroke(); c.restore();
}
// tela azul de erro (estilo computador antigo, sem logotipos)
export function telaAzul(c, x, y, s, a, t) {
  if (a <= 0.01) return;
  c.save(); c.globalAlpha = a; c.translate(x, y); c.scale(s, s);
  rrect(c, -300, -200, 600, 400, 14, '#2a2a3a', { lw: 8 });
  rrect(c, -280, -180, 560, 360, 4, '#1a2ab0', { stroke: null });
  rrect(c, -90, -150, 180, 40, 2, '#c8c8d0', { stroke: null });
  c.font = '900 30px "Courier New", monospace'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#1a2ab0'; c.fillText('ERRO', 0, -129);
  for (let k = 0; k < 6; k++) rrect(c, -240, -80 + k * 36, 480 - (k % 3) * 90, 14, 2, '#e8ecff', { stroke: null });
  if (Math.floor(t * 2) % 2) rrect(c, -240, 150, 22, 14, 1, '#e8ecff', { stroke: null });
  c.restore();
}
