// Cenários de "Por que você pensa demais antes de dormir?"
import { TAU, lerp, clamp, sstep, rng, mix, rgba, easeOut, easeBack, win } from '../motor/base.js';
import { OUT, shape, circle, ellipse, poly, rrect, line, glow, cloud, vgrad, sparkle, limb } from '../motor/desenho.js';
import { cerebroP } from './base.js';
export { cerebroP };

// ================= QUARTO À NOITE (visão lateral da cama) =================
export const Q = { chao: 1700, colchao: 1480, cab: 330, pe: 1020 };

function cidade(c, x, y, w, h, t, noite) {
  vgrad(c, x, y, w, h, [[0, '#0e1430'], [1, mix('#2a2a5a', '#3a3a7a', noite)]]);
  for (let i = 0; i < 18; i++) sparkle(c, x + (i * 67) % w, y + (i * 41) % (h * 0.5), 4, '#ffffff', 0.3 + 0.5 * Math.abs(Math.sin(t * 1.5 + i)));
  circle(c, x + w * 0.75, y + h * 0.22, 40, '#f4f0d0', { stroke: null }); circle(c, x + w * 0.75 + 16, y + h * 0.22 - 10, 36, '#0e1430', { stroke: null }); glow(c, x + w * 0.75, y + h * 0.22, 120, '#c8d8ff', 0.35);
  const r = rng(12); let xx = x - 20;
  while (xx < x + w) { const bw = 60 + r() * 70, bh = 120 + r() * 200; rrect(c, xx, y + h - bh, bw, bh + 4, 2, '#151a38', { stroke: null }); for (let yy = y + h - bh + 16; yy < y + h - 10; yy += 26) for (let k = xx + 10; k < xx + bw - 12; k += 22) if (r() < 0.3) { c.fillStyle = r() < 0.8 ? '#ffd890' : '#9fd0ff'; c.globalAlpha = 0.6 + 0.4 * Math.sin(t + k); c.fillRect(k, yy, 9, 12); c.globalAlpha = 1; } xx += bw + 5; }
}
function janela(c, x, y, w, h, t) {
  rrect(c, x - 14, y - 14, w + 28, h + 28, 8, '#d8d4f0', { lw: 6 });
  c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip(); cidade(c, x, y, w, h, t, 0.5); c.restore();
  line(c, [[x + w / 2, y], [x + w / 2, y + h]], '#d8d4f0', 12); line(c, [[x, y + h / 2], [x + w, y + h / 2]], '#d8d4f0', 12);
  for (const s of [-1, 1]) {
    const cx = s < 0 ? x - 30 : x + w + 30, v = Math.sin(t * 1.3 + s) * 16 + Math.sin(t * 3.1) * 5;
    shape(c, c => { c.moveTo(cx - 60, y - 50); c.lineTo(cx + 60, y - 50); c.quadraticCurveTo(cx + 40 + v, y + h * 0.6, cx + 70 + v * 1.6, y + h + 70); c.lineTo(cx - 70 + v, y + h + 70); c.quadraticCurveTo(cx - 40 + v * 0.5, y + h * 0.6, cx - 60, y - 50); c.closePath(); }, '#5a6ac8', { lw: 6 });
    for (let k = -1; k <= 1; k++) line(c, [[cx + k * 26, y - 40], [cx + k * 32 + v, y + h + 60]], '#4a58a8', 5);
  }
  rrect(c, x - 130, y - 70, w + 260, 20, 10, '#3a3a5a', { lw: 5 });
}
export function criadoMudo(c, t, { luz = 1, celular = false } = {}) {
  rrect(c, 110, 1420, 200, 280, 10, '#8a5a3a', { lw: 6 });
  for (let k = 0; k < 2; k++) { rrect(c, 126, 1440 + k * 120, 168, 104, 6, '#a8744a', { lw: 4 }); rrect(c, 190, 1484 + k * 120, 40, 12, 6, '#5a3a2a', { lw: 3 }); }
  // abajur
  ellipse(c, 190, 1414, 50, 12, '#3a3a50', { lw: 4 }); line(c, [[190, 1410], [190, 1290]], '#3a3a50', 9);
  shape(c, c => { c.moveTo(130, 1300); c.lineTo(250, 1300); c.lineTo(222, 1210); c.lineTo(158, 1210); c.closePath(); }, luz > 0.5 ? '#ffe08a' : '#b8a878', { lw: 5 });
  circle(c, 238, 1400, 8, '#e2575c', { lw: 3 });
  if (luz > 0.01) { glow(c, 190, 1270, 420, '#ffcf80', 0.55 * luz); c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha = 0.16 * luz; c.fillStyle = '#ffd890'; c.beginPath(); c.moveTo(130, 1300); c.lineTo(250, 1300); c.lineTo(420, 1700); c.lineTo(-40, 1700); c.closePath(); c.fill(); c.restore(); }
  if (celular) { rrect(c, 248, 1402, 50, 14, 4, '#1a1a22', { lw: 3 }); if (Math.sin(t * 2) > 0.95) glow(c, 272, 1404, 30, '#9fd0ff', 0.6); }
}
export function cama(c, t) {
  rrect(c, Q.cab - 40, 1130, 60, 570, 14, '#6a4a8a', { lw: 6 });
  rrect(c, Q.cab - 50, 1110, 80, 40, 14, '#7a5a9a', { lw: 5 });
  rrect(c, Q.pe - 20, 1380, 50, 320, 12, '#6a4a8a', { lw: 6 });
  rrect(c, Q.cab, 1480, Q.pe - Q.cab, 110, 18, '#e8e4f6', { lw: 6 });
  rrect(c, Q.cab, 1580, Q.pe - Q.cab, 60, 8, '#5a3a7a', { lw: 6 });
}
export function travesseiro(c, x = 440, y = 1450, rot = 0, s = 1) {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  shape(c, c => { c.moveTo(-90, -20); c.quadraticCurveTo(-100, -50, -60, -48); c.quadraticCurveTo(0, -60, 60, -48); c.quadraticCurveTo(100, -50, 90, -20); c.quadraticCurveTo(100, 20, 60, 34); c.quadraticCurveTo(0, 44, -60, 34); c.quadraticCurveTo(-100, 20, -90, -20); c.closePath(); }, '#ffffff', { lw: 5 });
  c.restore();
}
// cobertor: deitado (cobre o corpo) ou sentado (sobre as pernas)
export function cobertor(c, t, modo = 'sentado', x0 = 470) {
  const o = Math.sin(t * 1.2) * 3;
  if (modo === 'sentado') shape(c, c => { c.moveTo(x0, 1470); c.quadraticCurveTo(x0 + 120, 1440 + o, 700, 1462); c.quadraticCurveTo(860, 1480, Q.pe + 10, 1470); c.lineTo(Q.pe + 20, 1610); c.lineTo(x0 - 20, 1610); c.closePath(); }, '#4a6ad0', { lw: 6 });
  else shape(c, c => { c.moveTo(x0, 1500); c.quadraticCurveTo(x0 + 20, 1370 + o, x0 + 120, 1376 + o); c.quadraticCurveTo(800, 1360 - o, Q.pe + 10, 1420); c.lineTo(Q.pe + 20, 1610); c.lineTo(x0 - 20, 1610); c.closePath(); }, '#4a6ad0', { lw: 6 });
  c.save(); c.globalAlpha = 0.25; for (let k = 0; k < 4; k++) line(c, [[x0 + 80 + k * 120, 1480], [x0 + 60 + k * 120, 1600]], '#ffffff', 5); c.restore();
}
// fundo do quarto (parede, janela, chão, cômoda)
export function quarto(st, t, { escuro = 0 } = {}) {
  st.mundo(c => {
    vgrad(c, -1400, -400, 4000, 2100, [[0, mix('#2a3470', '#141a40', escuro)], [1, mix('#3a4488', '#1c2250', escuro)]]);
    for (let x = -1400; x < 2600; x += 130) { c.fillStyle = 'rgba(255,255,255,0.04)'; c.fillRect(x, -400, 56, 2100); }
    rrect(c, -1400, 1660, 4000, 40, 0, '#4a4a78', { lw: 6 });
    vgrad(c, -1400, 1700, 4000, 900, [[0, mix('#4a3a5a', '#2a2238', escuro)], [1, mix('#3a2a48', '#1a1428', escuro)]]);
    for (let y = 1760; y < 2600; y += 80) line(c, [[-1400, y], [2600, y]], 'rgba(0,0,0,0.15)', 3);
    ellipse(c, 640, 1900, 560, 90, '#5a4a8a', { lw: 6 });
    janela(c, 430, 520, 380, 520, t);
    // quadrinhos e prateleira
    rrect(c, 900, 640, 160, 200, 6, '#e2a05c', { lw: 6 }); rrect(c, 916, 656, 128, 168, 3, '#2a3a6a', { stroke: null }); for (let i = 0; i < 5; i++) sparkle(c, 940 + (i * 23) % 90, 690 + (i * 31) % 110, 6, '#ffe8a0', 0.8);
    rrect(c, 40, 820, 260, 22, 4, '#6a4a3a', { lw: 5 }); for (let i = 0; i < 5; i++) rrect(c, 60 + i * 34, 740 - (i % 2) * 14, 28, 80 + (i % 2) * 14, 3, ['#e2575c', '#f4c430', '#35a868', '#8a5cc7', '#2c78dc'][i], { lw: 3 });
    // cômoda à direita e porta à esquerda
    rrect(c, 1160, 1300, 340, 400, 10, '#7a5a3a', { lw: 6 }); for (let k = 0; k < 3; k++) { rrect(c, 1176, 1320 + k * 124, 308, 108, 6, '#946a44', { lw: 4 }); rrect(c, 1300, 1366 + k * 124, 60, 12, 6, '#4a3020', { lw: 3 }); }
    rrect(c, -560, 700, 320, 1000, 10, '#5a4a7a', { lw: 6 }); circle(c, -280, 1220, 14, '#d8b040', { lw: 3 });
  });
}

// ================= CÉREBRO DETETIVE =================
export const lupa = (c, x, y, ang = -0.6) => { c.save(); c.translate(x, y); c.rotate(ang); rrect(c, -8, 0, 16, 70, 6, '#5a3a2a', { lw: 4 }); circle(c, 0, -40, 40, 'rgba(200,235,255,0.45)', { stroke: '#c8a040', lw: 10 }); ellipse(c, -12, -54, 12, 6, '#ffffff', { stroke: null, alpha: 0.8 }, -0.5); c.restore(); };
export const lanterna = (ligada, ang = -0.4) => (c, x, y) => {
  c.save(); c.translate(x, y); c.rotate(ang);
  if (ligada > 0.01) { c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha = 0.35 * ligada; const g = c.createLinearGradient(0, 0, 900, 0); g.addColorStop(0, '#fff6c0'); g.addColorStop(1, 'rgba(255,246,192,0)'); c.fillStyle = g; c.beginPath(); c.moveTo(40, -16); c.lineTo(900, -240); c.lineTo(900, 240); c.lineTo(40, 16); c.closePath(); c.fill(); c.restore(); glow(c, 46, 0, 50, '#fff6c0', ligada); }
  rrect(c, -40, -16, 80, 32, 8, '#3a3a50', { lw: 4 }); rrect(c, 30, -22, 22, 44, 6, '#5a5a70', { lw: 4 });
  c.restore();
};
export const caderno = (aberto) => (c, x, y) => { c.save(); c.translate(x, y - 20); if (aberto > 0.5) { rrect(c, -60, -36, 60, 72, 4, '#fffaf0', { lw: 4 }); rrect(c, 0, -36, 60, 72, 4, '#fffaf0', { lw: 4 }); for (let i = 0; i < 4; i++) line(c, [[8, -22 + i * 14], [50, -22 + i * 14]], '#9aa0b8', 3); } else rrect(c, -30, -40, 60, 80, 4, '#8a3a3a', { lw: 4 }); c.restore(); };
export function chapeu(c, x, y, s = 1, rot = 0) {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  ellipse(c, 0, 0, 200, 40, '#7a5a3a', { lw: 7 });
  shape(c, c => { c.moveTo(-120, 0); c.quadraticCurveTo(-130, -140, -40, -150); c.quadraticCurveTo(0, -120, 40, -150); c.quadraticCurveTo(130, -140, 120, 0); c.closePath(); }, '#8a6a42', { lw: 7 });
  rrect(c, -122, -50, 244, 34, 6, '#3a2a20', { lw: 5 });
  c.restore();
}
// o: opções do cerebroP + { chapeu: 0..1 (posição: 1 = na cabeça), pernas:{walk, sentado, balanca}, gravata }
export function detetive(c, x, y, s, t, o = {}) {
  c.save(); c.translate(x, y); c.scale(s, s);
  const p = o.pernas || {};
  for (const sd of [-1, 1]) {
    let a = [sd * 70, 160], b;
    if (p.sentado) b = [sd * 80 + Math.sin(t * 3 + sd) * 10 * (p.balanca || 0), 320];
    else { const ph = (p.walk ?? 0) + (sd > 0 ? Math.PI : 0); b = [sd * 60 + (p.walk != null ? Math.sin(ph) * 40 : 0), 330 - (p.walk != null ? Math.max(0, Math.cos(ph)) * 30 : 0)]; }
    limb(c, [a, b], 24, '#ff9eb8'); ellipse(c, b[0] + sd * 12, b[1] + 6, 30, 16, '#3a2a20', { lw: 5 });
  }
  cerebroP(c, 0, 0, 1, t, o);
  if (o.gravata) { poly(c, [[-14, 150], [14, 150], [22, 230], [0, 260], [-22, 230]], '#e2575c', { lw: 5 }); }
  if ((o.chapeu ?? 0) > 0.01) { const h = o.chapeu; chapeu(c, 10, lerp(-700, -205, easeOut(clamp(h))), 1, lerp(0.6, -0.08, clamp(h)) + (o.chapeuRot || 0)); }
  c.restore();
}

// quadro de investigação (cortiça, fotos, barbantes vermelhos). abre = 0..1; escrita = 0..1
export function quadro(c, x, y, abre, t, { escrita = 0, destaque = 0 } = {}) {
  if (abre <= 0.01) return;
  c.save(); c.translate(x, y); c.scale(easeBack(clamp(abre)), clamp(abre * 1.4));
  rrect(c, -330, -220, 660, 440, 14, '#6a4a2a', { lw: 7 }); rrect(c, -306, -196, 612, 392, 6, '#c8925a', { stroke: null });
  for (let i = 0; i < 30; i++) { const r = rng(i + 3); circle(c, -290 + r() * 580, -180 + r() * 360, 3, '#a8743a', { stroke: null }); }
  const fotos = [[-220, -100, 0], [-30, -130, 1], [170, -90, 2], [-170, 90, 3], [60, 70, 4], [230, 110, 5]];
  const pins = fotos.map(([fx, fy]) => [fx, fy - 56]);
  c.save(); c.strokeStyle = '#e02a2a'; c.lineWidth = 5; c.beginPath(); [[0, 1], [1, 2], [0, 3], [3, 4], [4, 1], [4, 5], [2, 5]].forEach(([a, b]) => { c.moveTo(...pins[a]); c.lineTo(...pins[b]); }); c.stroke(); c.restore();
  fotos.forEach(([fx, fy, k], i) => {
    c.save(); c.translate(fx, fy); c.rotate((i % 2 ? 0.08 : -0.07) + Math.sin(t * 2 + i) * 0.01);
    rrect(c, -62, -56, 124, 112, 3, '#fffaf0', { lw: 4 }); rrect(c, -52, -46, 104, 76, 2, ['#9fd0ff', '#ffd1a8', '#c8e6a0', '#e0c8f0', '#ffe08a', '#c8d0e0'][k], { stroke: null });
    if (k === 1 || (destaque > 0 && k === 1)) { // a foto do tombo
      circle(c, -10, -18, 12, '#eab894', { lw: 3 }); c.save(); c.translate(-6, 6); c.rotate(-1.1); rrect(c, -10, -16, 20, 34, 6, '#1f3a6e', { lw: 3 }); c.restore(); line(c, [[-50, 26], [50, 26]], '#7a7a8a', 4); for (const sx of [24, 40]) { circle(c, sx, -14, 7, '#c8906a', { lw: 2 }); line(c, [[sx, -6], [sx, 14]], '#5a5a6a', 4); }
    } else { circle(c, 0, -12, 14, '#5a5a6a', { stroke: null }); rrect(c, -18, 4, 36, 26, 8, '#5a5a6a', { stroke: null }); }
    c.font = '900 26px Inter, sans-serif'; c.textAlign = 'center'; c.fillStyle = '#e02a2a'; c.fillText('?', 40, 46);
    c.restore();
    circle(c, pins[i][0], pins[i][1], 9, '#e02a2a', { lw: 3 });
  });
  if (escrita > 0) { c.save(); c.strokeStyle = '#ffffff'; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); const n = Math.floor(escrita * 40); for (let k = 0; k < n; k++) { const xx = -280 + k * 9, yy = 170 + Math.sin(k * 1.7) * 8; k ? c.lineTo(xx, yy) : c.moveTo(xx, yy); } c.stroke(); c.restore(); }
  if (destaque > 0) { c.save(); c.globalAlpha = destaque; circle(c, -30, -130, 90, null, { stroke: '#e02a2a', lw: 8 }); c.restore(); }
  c.restore();
}

// nuvem de pensamento (com conteúdo recortado)
export function nuvem(c, x, y, r, a, conteudo, { bolinhas = null } = {}) {
  if (a <= 0.01) return;
  c.save(); c.globalAlpha *= clamp(a * 1.5);
  if (bolinhas) bolinhas.forEach(([bx, by, br]) => circle(c, bx, by, br * a, '#ffffff', { lw: 5 }));
  const k = easeBack(clamp(a)); c.translate(x, y); c.scale(k, k);
  cloud(c, 0, 30, r, '#ffffff', { stroke: OUT, seed: 6 });
  if (conteudo) { c.save(); c.beginPath(); c.ellipse(0, -20, r * 1.0, r * 0.62, 0, 0, TAU); c.clip(); conteudo(c); c.restore(); }
  c.restore();
}
// ícones dos pensamentos (cena 4)
export function icone(c, tipo, t) {
  if (tipo === 0) { rrect(c, -60, -40, 120, 80, 8, '#3a3a50', { lw: 5 }); rrect(c, -50, -30, 100, 56, 3, '#7ac8ff', { stroke: null }); rrect(c, -76, 40, 152, 14, 6, '#5a5a70', { lw: 4 }); for (let i = 0; i < 3; i++) line(c, [[-40, -18 + i * 16], [10 + i * 10, -18 + i * 16]], '#1a2a4a', 4); } // trabalho
  if (tipo === 1) { for (let i = 0; i < 3; i++) { ellipse(c, -20 + i * 20, 30 - i * 20, 40, 14, '#f4c430', { lw: 4 }); } circle(c, 30, -20, 34, '#f4c430', { lw: 5 }); c.font = '900 40px Inter, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#8a6a10'; c.fillText('$', 30, -18); } // dinheiro
  if (tipo === 2) { const b = 1 + Math.sin(t * 6) * 0.05; c.save(); c.scale(b, b); shape(c, c => { c.moveTo(0, 40); c.bezierCurveTo(-80, -10, -40, -70, 0, -30); c.bezierCurveTo(40, -70, 80, -10, 0, 40); c.closePath(); }, '#e2575c', { lw: 5 }); line(c, [[0, -30], [-10, -6], [8, 6], [-4, 30]], '#ffffff', 5); c.restore(); } // relacionamento
  if (tipo === 3) { rrect(c, -50, -50, 100, 100, 4, '#f6ead0', { lw: 5 }); rrect(c, -40, -40, 80, 64, 2, '#c8a878', { stroke: null }); circle(c, 0, -14, 14, '#8a6a4a', { stroke: null }); shape(c, c => c.arc(0, 0, 70, -0.6 - t, 1.6 - t), null, { stroke: '#5a5a70', lw: 6 }); } // passado
  if (tipo === 4) { shape(c, c => { c.moveTo(-34, -50); c.lineTo(34, -50); c.lineTo(0, 0); c.lineTo(34, 50); c.lineTo(-34, 50); c.lineTo(0, 0); c.closePath(); }, '#9fd0ff', { lw: 5 }); const u = (t * 0.3) % 1; poly(c, [[-26 * (1 - u), -44 + 44 * u], [26 * (1 - u), -44 + 44 * u], [0, -4]], '#f4c430', { stroke: null }); poly(c, [[-26 * u, 46], [26 * u, 46], [0, 46 - 40 * u]], '#f4c430', { stroke: null }); rrect(c, -44, -60, 88, 12, 4, '#8a5a3a', { lw: 4 }); rrect(c, -44, 50, 88, 12, 4, '#8a5a3a', { lw: 4 }); } // futuro
}

// ================= SALA DE REUNIÃO MENTAL =================
export function salaReuniao(st, t, { caos = 1 } = {}) {
  st.mundo(c => {
    vgrad(c, -1400, -300, 4000, 2000, [[0, '#3a3060'], [1, '#4a3a78']]);
    for (let x = -1400; x < 2600; x += 200) rrect(c, x, -300, 12, 2000, 0, 'rgba(255,255,255,0.05)', { stroke: null });
    rrect(c, -1400, 1700, 4000, 900, 0, '#2a2240', { stroke: null });
    for (let y = 1740; y < 2600; y += 90) line(c, [[-1400, y], [2600, y]], 'rgba(255,255,255,0.06)', 4);
    // janelas grandes com a cidade
    for (const x of [-900, 1180]) { rrect(c, x, 420, 420, 760, 10, '#1a1a38', { lw: 6 }); c.save(); c.beginPath(); c.rect(x + 10, 430, 400, 740); c.clip(); cidade(c, x + 10, 430, 400, 740, t, 1); c.restore(); }
    // quadro com gráfico despencando
    rrect(c, 40, 640, 460, 340, 10, '#f6f2ea', { lw: 7 });
    line(c, [[80, 940], [80, 680]], OUT, 5); line(c, [[80, 940], [470, 940]], OUT, 5);
    const g = sstep(19.6, 20.8, t), pts = [[90, 900], [160, 850], [230, 870], [300, 780], [350, 760], [380, 900], [420, 930], [470, 1000]];
    const n = Math.max(2, Math.floor(lerp(4, pts.length, g)));
    line(c, pts.slice(0, n), '#e02a2a', 9);
    if (g > 0.9) { poly(c, [[456, 980], [490, 1010], [480, 966]], '#e02a2a', { stroke: null }); }
    // relógio gigante 03:00
    relogio3(c, 760, 760, 170, t);
  });
}
export function relogio3(c, x, y, r, t) {
  circle(c, x, y, r, '#f4c430', { lw: 8 }); circle(c, x, y, r * 0.86, '#fffaf0', { lw: 5 });
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; line(c, [[x + Math.cos(a) * r * 0.7, y + Math.sin(a) * r * 0.7], [x + Math.cos(a) * r * 0.8, y + Math.sin(a) * r * 0.8]], OUT, i % 3 ? 4 : 8); }
  line(c, [[x, y], [x + r * 0.42, y]], OUT, 12); line(c, [[x, y], [x, y - r * 0.64]], OUT, 8);
  const s = -Math.PI / 2 + Math.floor(t) * TAU / 60; line(c, [[x, y], [x + Math.cos(s) * r * 0.7, y + Math.sin(s) * r * 0.7]], '#e02a2a', 4);
  circle(c, x, y, 10, OUT, { stroke: null });
  rrect(c, x - 110, y + r + 24, 220, 80, 12, '#1a1a22', { lw: 6 });
  c.save(); c.font = '900 62px Inter, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#ff4a4a'; c.globalAlpha = Math.floor(t * 2) % 2 ? 1 : 0.75; c.fillText('03:00', x, y + r + 66); c.restore();
}
export function mesaReuniao(c, t, tremor = 0) {
  const sh = tremor ? Math.sin(t * 60) * 4 * tremor : 0;
  rrect(c, 20, 1500 + sh, 1040, 40, 10, '#8a5a3a', { lw: 7 });
  rrect(c, 40, 1540 + sh, 1000, 120, 8, '#6a4228', { lw: 6 });
  for (const x of [80, 960]) rrect(c, x, 1660, 40, 50, 4, '#4a2a18', { lw: 5 });
  // papéis e canecas sobre a mesa
  for (let i = 0; i < 5; i++) { c.save(); c.translate(120 + i * 190, 1496 + sh - (tremor ? Math.abs(Math.sin(t * 20 + i)) * 14 * tremor : 0)); c.rotate((i % 2 ? 0.1 : -0.08)); rrect(c, -40, -8, 80, 10, 2, '#fffaf0', { lw: 3 }); c.restore(); }
  for (const x of [300, 780]) { const j = tremor ? Math.abs(Math.sin(t * 22 + x)) * 20 * tremor : 0; rrect(c, x - 20, 1452 + sh - j, 40, 46, 8, '#ffffff', { lw: 4 }); }
}
// rede do cérebro dormindo
export function rede(c, x0, y0, x1, y1, t) {
  const sw = Math.sin(t * 1.2) * 14, mx = (x0 + x1) / 2 + sw, my = Math.max(y0, y1) + 90;
  line(c, [[x0, y0], [x0 + 20, y0 + 30]], '#c8b890', 4); line(c, [[x1, y1], [x1 - 20, y1 + 30]], '#c8b890', 4);
  shape(c, c => { c.moveTo(x0 + 20, y0 + 30); c.quadraticCurveTo(mx, my + 40, x1 - 20, y1 + 30); c.quadraticCurveTo(mx, my - 10, x0 + 20, y0 + 30); c.closePath(); }, '#e8d8a8', { lw: 5 });
  return [mx, my];
}
