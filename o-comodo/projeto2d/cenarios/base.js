// Cenários de "Por que coçamos a cabeça?": sala de estudos, escrivaninha, mundo do cérebro, tela final.
import { TAU, lerp, clamp, sstep, rng, mix, rgba, easeOut, easeBack } from '../motor/base.js';
import { OUT, shape, circle, ellipse, poly, rrect, line, glow, cloud, vgrad, sparkle, limb, star5 } from '../motor/desenho.js';

// ================= SALA DE ESTUDOS =================
export const ESC = { mesa: 1640, chao: 1900, x0: 110, x1: 970 };

function janelaNoite(c, x, y, w, h, t) {
  rrect(c, x - 14, y - 14, w + 28, h + 28, 8, '#fff3e2', { lw: 6 });
  c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip();
  vgrad(c, x, y, w, h, [[0, '#3a3a8a'], [0.7, '#c86a8a'], [1, '#f7a86a']]);
  for (let i = 0; i < 14; i++) { const sx = x + (i * 71) % w, sy = y + (i * 47) % (h * 0.6); sparkle(c, sx, sy, 5, '#ffffff', 0.4 + 0.5 * Math.abs(Math.sin(t * 2 + i))); }
  circle(c, x + w * 0.72, y + h * 0.28, 34, '#fff6d0', { stroke: null }); glow(c, x + w * 0.72, y + h * 0.28, 110, '#fff2c0', 0.5);
  for (let i = 0; i < 6; i++) { const bw = 50 + (i * 17) % 40, bh = 80 + (i * 53) % 120; rrect(c, x + i * 58 - 10, y + h - bh, bw, bh + 4, 2, '#2a2050', { stroke: null }); for (let k = 0; k < 3; k++) if ((i + k) % 2) { c.fillStyle = '#ffd890'; c.fillRect(x + i * 58 + 6, y + h - bh + 14 + k * 26, 10, 12); } }
  c.restore();
  line(c, [[x + w / 2, y], [x + w / 2, y + h]], '#fff3e2', 12); line(c, [[x, y + h / 2], [x + w, y + h / 2]], '#fff3e2', 12);
  rrect(c, x - 26, y + h + 8, w + 52, 22, 6, '#fff3e2', { lw: 5 });
}
function estante(c, x, y, t) {
  rrect(c, x, y, 300, 620, 8, '#a8744a', { lw: 6 });
  const cores = ['#e2575c', '#2c78dc', '#f4c430', '#35a868', '#8a5cc7', '#f29a4a'];
  for (let r = 0; r < 4; r++) {
    const yy = y + 20 + r * 150; rrect(c, x + 14, yy + 120, 272, 14, 2, '#8a5a3a', { lw: 4 });
    let xx = x + 22; let k = r * 3;
    while (xx < x + 260) { const w = 22 + (k * 7) % 14, h = 80 + (k * 13) % 36; rrect(c, xx, yy + 120 - h, w, h, 3, cores[k % 6], { lw: 3.5 }); xx += w + 3; k++; if (k % 7 === 3) xx += 20; }
  }
  // vasinho com planta pendente
  shape(c, c => { c.moveTo(x + 210, y - 60); c.lineTo(x + 270, y - 60); c.lineTo(x + 262, y); c.lineTo(x + 218, y); c.closePath(); }, '#e0773a', { lw: 4 });
  for (let i = 0; i < 3; i++) { const sw = Math.sin(t * 1.4 + i) * 8; line(c, [[x + 225 + i * 15, y - 50], [x + 215 + i * 22 + sw, y + 60 + i * 50]], '#3f9a56', 6); for (let k = 0; k < 4; k++) ellipse(c, x + 218 + i * 20 + sw * k / 4, y - 20 + k * 30 + i * 12, 10, 6, '#4fb468', { lw: 3 }); }
}
function mural(c, x, y, t) {
  rrect(c, x, y, 280, 220, 8, '#c98b55', { lw: 6 }); rrect(c, x + 14, y + 14, 252, 192, 4, '#e8b880', { stroke: null });
  const notas = [[30, 30, '#fff27a'], [120, 22, '#ff9ec0'], [196, 44, '#9ee0ff'], [50, 120, '#b8f0a0'], [150, 112, '#fff27a']];
  notas.forEach(([dx, dy, cor], i) => { const f = Math.sin(t * 2.3 + i * 2) * 0.06; c.save(); c.translate(x + dx + 30, y + dy); c.rotate(f + (i % 2 ? 0.08 : -0.06)); rrect(c, -30, 0, 60, 60, 2, cor, { lw: 3 }); line(c, [[-20, 20], [18, 20]], '#8a7a6a', 3); line(c, [[-20, 34], [10, 34]], '#8a7a6a', 3); circle(c, 0, 4, 6, '#e2575c', { lw: 2 }); c.restore(); });
}
function relogio(c, x, y, t, r = 56) {
  circle(c, x, y, r, '#f4c430', { lw: 6 }); circle(c, x, y, r * 0.8, '#fffaf0', { lw: 4 });
  const m = -Math.PI / 2 + t * 0.5, s = -Math.PI / 2 + Math.floor(t) * TAU / 60;
  line(c, [[x, y], [x + Math.cos(-0.6) * r * 0.36, y + Math.sin(-0.6) * r * 0.36]], OUT, 6);
  line(c, [[x, y], [x + Math.cos(m) * r * 0.56, y + Math.sin(m) * r * 0.56]], OUT, 5);
  line(c, [[x, y], [x + Math.cos(s) * r * 0.62, y + Math.sin(s) * r * 0.62]], '#e2575c', 3);
}

// parede e chão (atrás de tudo)
export function salaEstudo(st, t) {
  st.mundo(c => {
    vgrad(c, -1200, -800, 3500, 2320, [[0, '#9fd3c7'], [1, '#86c2b4']]);
    for (let x = -1200; x < 2300; x += 120) { c.fillStyle = 'rgba(255,255,255,0.08)'; c.fillRect(x, -800, 50, 2320); }
    rrect(c, -1200, 1480, 3500, 40, 0, '#fffaf2', { lw: 6 });
    vgrad(c, -1200, 1520, 3500, 1100, [[0, '#c98b55'], [1, '#9a6038']]);
    for (let y = 1580; y < 2600; y += 80) line(c, [[-1200, y], [2300, y]], '#b07a48', 3);
    ellipse(c, 540, 2010, 620, 110, '#e2575c', { lw: 6 }); ellipse(c, 540, 2010, 500, 80, '#f07a7e', { stroke: null });
    janelaNoite(c, 60, 470, 300, 420, t);
    mural(c, 410, 560, t);
    relogio(c, 560, 420, t);
    estante(c, 750, 420, t);
    // pôster
    rrect(c, -330, 520, 220, 300, 6, '#2c78dc', { lw: 6 }); star5(c, -220, 640, 60, '#f4c430', { lw: 5 }); rrect(c, -290, 730, 140, 22, 6, '#fff3e2', { stroke: null });
    // planta no chão
    for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (i - 2.5) * 0.36 + Math.sin(t * 1.5 + i) * 0.05, L = 170 + (i % 3) * 30; c.save(); c.translate(1150, 1760); c.rotate(a + Math.PI / 2); shape(c, c => { c.moveTo(0, 0); c.quadraticCurveTo(-36, -L * 0.5, 0, -L); c.quadraticCurveTo(36, -L * 0.5, 0, 0); }, i % 2 ? '#3f9a56' : '#4fb468', { lw: 5 }); c.restore(); }
    shape(c, c => { c.moveTo(1080, 1740); c.lineTo(1220, 1740); c.lineTo(1200, 1880); c.lineTo(1100, 1880); c.closePath(); }, '#f4c430', { lw: 6 });
  });
}
// cadeira (atrás do personagem)
export function cadeira(c, x, y = 1640) {
  rrect(c, x - 130, y - 330, 260, 300, 40, '#e2575c', { lw: 6 });
  rrect(c, x - 100, y - 300, 200, 230, 30, '#f07a7e', { stroke: null });
  line(c, [[x, y], [x, ESC.chao - 30]], '#3a3a44', 16);
  for (const s of [-1, 1]) { line(c, [[x, ESC.chao - 30], [x + s * 110, ESC.chao - 10]], '#3a3a44', 12); circle(c, x + s * 110, ESC.chao - 4, 14, '#2a2a30', { lw: 4 }); }
}
// pernas sentado (vistas por baixo da mesa)
export function pernasSentado(c, x, cor, sapato, t, balanca = 0) {
  for (const s of [-1, 1]) {
    const sw = s > 0 ? Math.sin(t * 4) * 14 * balanca : 0;
    limb(c, [[x + s * 30, ESC.mesa + 10], [x + s * 36 + sw, ESC.chao - 30]], 30, cor);
    ellipse(c, x + s * 42 + sw, ESC.chao - 18, 30, 16, sapato, { lw: 5 });
    line(c, [[x + s * 30 + sw, ESC.chao - 22], [x + s * 56 + sw, ESC.chao - 22]], '#c8c8cc', 3);
  }
}
// tampo e pés da mesa (na frente do corpo)
export function mesa(c, t, { x0 = ESC.x0, x1 = ESC.x1 } = {}) {
  for (const x of [x0 + 30, x1 - 54]) rrect(c, x, ESC.mesa + 20, 24, ESC.chao - ESC.mesa - 30, 4, '#8a5a3a', { lw: 5 });
  shape(c, c => { c.moveTo(x0 + 30, ESC.mesa - 46); c.lineTo(x1 - 30, ESC.mesa - 46); c.lineTo(x1, ESC.mesa); c.lineTo(x0, ESC.mesa); c.closePath(); }, '#d9a06a', { lw: 6 });
  rrect(c, x0, ESC.mesa, x1 - x0, 30, 4, '#b07a48', { lw: 6 });
}
// objetos em cima da mesa: computador, livros, luminária, livro aberto, caderno
export function objetosMesa(c, t, { prova = false, lapisNaMesa = false } = {}) {
  const y = ESC.mesa - 30;
  // computador
  rrect(c, 160, y - 230, 230, 160, 12, '#2a2a34', { lw: 6 }); rrect(c, 172, y - 218, 206, 136, 4, '#1a2a4a', { stroke: null });
  for (let i = 0; i < 6; i++) { const L = 40 + ((i * 37 + Math.floor(t * 2) * 13) % 110); rrect(c, 186, y - 206 + i * 20, L, 8, 3, ['#6af0b0', '#7ac8ff', '#ffd36a'][i % 3], { stroke: null }); }
  if (Math.floor(t * 2.5) % 2) rrect(c, 190, y - 206 + 6 * 20 - 4, 10, 10, 1, '#ffffff', { stroke: null });
  rrect(c, 260, y - 70, 30, 40, 4, '#3a3a44', { lw: 4 }); rrect(c, 220, y - 34, 110, 14, 6, '#3a3a44', { lw: 4 });
  // pilha de livros
  const cores = ['#35a868', '#e2575c', '#f4c430', '#2c78dc'];
  cores.forEach((cor, i) => rrect(c, 860 + (i % 2) * 8, y - 30 - i * 32, 120 - i * 6, 30, 4, cor, { lw: 4 }));
  // luminária
  line(c, [[800, y - 10], [800, y - 190], [745, y - 255]], '#3a3a44', 10);
  ellipse(c, 800, y - 6, 46, 12, '#3a3a44', { lw: 4 });
  c.save(); c.translate(745, y - 255); c.rotate(0.5); shape(c, c => { c.moveTo(-50, 0); c.lineTo(50, 0); c.lineTo(30, -50); c.lineTo(-30, -50); c.closePath(); }, '#f4c430', { lw: 5 }); c.restore();
  c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha = 0.18 + Math.sin(t * 3) * 0.02; const g = c.createLinearGradient(0, y - 240, 0, y + 20); g.addColorStop(0, '#fff2b0'); g.addColorStop(1, 'rgba(255,242,176,0)'); c.fillStyle = g; c.beginPath(); c.moveTo(715, y - 235); c.lineTo(785, y - 255); c.lineTo(780, y + 10); c.lineTo(380, y + 10); c.closePath(); c.fill(); c.restore();
  glow(c, 745, y - 235, 120, '#fff2b0', 0.7);
  if (prova) {
    // prova cheia de perguntas
    shape(c, c => { c.moveTo(390, y - 26); c.lineTo(700, y - 26); c.lineTo(730, y + 22); c.lineTo(360, y + 22); c.closePath(); }, '#fffaf0', { lw: 4 });
    c.save(); c.font = '900 22px Inter, sans-serif'; c.fillStyle = '#e2575c'; c.textAlign = 'center'; c.fillText('PROVA', 545, y - 8); c.restore();
    for (let i = 0; i < 3; i++) line(c, [[400 + i * 6, y + 2 + i * 7], [690 + i * 10, y + 2 + i * 7]], '#9aa0b8', 2);
    return;
  }
  // livro aberto (páginas balançando)
  const f = Math.sin(t * 2.2) * 6;
  shape(c, c => { c.moveTo(330, y - 20); c.quadraticCurveTo(390, y - 34 - f, 450, y - 22); c.lineTo(460, y + 20); c.quadraticCurveTo(395, y + 8, 320, y + 20); c.closePath(); }, '#fffaf0', { lw: 4 });
  shape(c, c => { c.moveTo(450, y - 22); c.quadraticCurveTo(510, y - 34 + f, 570, y - 20); c.lineTo(580, y + 20); c.quadraticCurveTo(505, y + 8, 460, y + 20); c.closePath(); }, '#fffaf0', { lw: 4 });
  for (let i = 0; i < 3; i++) { line(c, [[340, y - 10 + i * 9], [440, y - 12 + i * 9]], '#9aa0b8', 2); line(c, [[470, y - 12 + i * 9], [565, y - 10 + i * 9]], '#9aa0b8', 2); }
  // caderno
  shape(c, c => { c.moveTo(600, y - 18); c.lineTo(720, y - 18); c.lineTo(736, y + 22); c.lineTo(590, y + 22); c.closePath(); }, '#fff27a', { lw: 4 });
  for (let i = 0; i < 3; i++) line(c, [[604, y - 6 + i * 9], [718 + i * 4, y - 6 + i * 9]], '#c8a83a', 2);
  if (lapisNaMesa) { c.save(); c.translate(680, y + 6); c.rotate(1.3); rrect(c, -4, -40, 8, 44, 2, '#f4c430', { lw: 3 }); c.restore(); }
}

// pontos de interrogação
export function interrogacao(c, x, y, s, a, rot = 0, cor = '#f4c430') {
  if (a <= 0.01 || s <= 0.01) return;
  c.save(); c.globalAlpha *= clamp(a); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  c.font = '900 110px Inter, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round'; c.lineWidth = 16; c.strokeStyle = OUT; c.strokeText('?', 0, 0); c.fillStyle = cor; c.fillText('?', 0, 0);
  c.restore();
}
// lâmpada da ideia: luz 0..1, queimada 0..1
export function lampada(c, x, y, s, luz, queimada, t) {
  if (s <= 0.01) return;
  c.save(); c.translate(x, y); c.scale(s, s);
  if (luz > 0.01) { glow(c, 0, -20, 200, '#fff2a0', luz); for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; line(c, [[Math.cos(a) * 70, -20 + Math.sin(a) * 70], [Math.cos(a) * 96, -20 + Math.sin(a) * 96]], '#ffe46a', 7, luz); } }
  circle(c, 0, -20, 46, luz > 0.3 ? '#fff27a' : mix('#f6f2e0', '#9a9aa2', queimada), { lw: 6 });
  line(c, [[-14, -14], [-6, -34], [0, -16], [6, -34], [14, -14]], luz > 0.3 ? '#e0a020' : '#6a6a72', 4);
  rrect(c, -22, 22, 44, 30, 6, '#9a9aa8', { lw: 5 }); line(c, [[-22, 32], [22, 32]], '#6a6a72', 3); line(c, [[-22, 42], [22, 42]], '#6a6a72', 3);
  c.restore();
}

// ================= MUNDO DO CÉREBRO =================
const RN = rng(31);
const NOS = Array.from({ length: 22 }, () => [-300 + RN() * 1680, -200 + RN() * 1900]);
const ARESTAS = []; NOS.forEach((a, i) => { const d = NOS.map((b, j) => [Math.hypot(a[0] - b[0], a[1] - b[1]), j]).sort((p, q) => p[0] - q[0]); ARESTAS.push([i, d[1][1]], [i, d[2][1]]); });
export function mundoCerebro(st, t, { calma = 1 } = {}) {
  st.mundo(c => {
    vgrad(c, -900, -1200, 2900, 4000, [[0, '#ff9ec4'], [0.5, '#c87ae0'], [1, '#6a4ac8']]);
    for (let i = 0; i < 9; i++) { const r = rng(i + 5); cloud(c, -200 + r() * 1500, -100 + r() * 1800, 90 + r() * 80, 'rgba(255,255,255,0.12)', { seed: i }); }
    // rede de conexões com impulsos
    ARESTAS.forEach(([i, j], k) => {
      const a = NOS[i], b = NOS[j];
      line(c, [a, b], 'rgba(255,240,255,0.35)', 6);
      const u = ((t * (0.5 + (k % 5) * 0.12) + k * 0.37) % 1);
      glow(c, lerp(a[0], b[0], u), lerp(a[1], b[1], u), 34, k % 3 ? '#fff2a0' : '#7af0ff', 0.9);
    });
    NOS.forEach(([x, y], i) => { circle(c, x, y, 12, '#ffffff', { lw: 4 }); glow(c, x, y, 40, '#ffd0f0', 0.4 + 0.4 * Math.sin(t * 3 + i)); });
  });
}
// ficha de informação com ícone
export function ficha(c, x, y, rot, tipo, s = 1) {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  rrect(c, -60, -40, 120, 80, 6, '#fffaf0', { lw: 4 });
  rrect(c, -60, -40, 120, 18, 6, ['#ff8fb1', '#7ac8ff', '#ffd36a', '#8fe0a0'][tipo % 4], { lw: 4 });
  c.font = '900 40px Inter, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = OUT; c.fillText(['?', '!', '?', '…'][tipo % 4], -28, 12);
  line(c, [[0, 2], [44, 2]], '#9aa0b8', 4); line(c, [[0, 20], [34, 20]], '#9aa0b8', 4);
  c.restore();
}
// esteira rolante
export function esteira(c, x0, x1, y, t, vel = 1) {
  rrect(c, x0, y, x1 - x0, 40, 20, '#3a3a50', { lw: 6 });
  for (let x = x0 + 26; x < x1 - 10; x += 52) { c.save(); c.translate(x, y + 20); c.rotate(-t * 6 * vel); circle(c, 0, 0, 14, '#9a9ab0', { lw: 3 }); line(c, [[-10, 0], [10, 0]], '#5a5a70', 3); c.restore(); }
  for (let x = x0 + ((-t * 120 * vel) % 40 + 40) % 40; x < x1; x += 40) line(c, [[x, y + 2], [x + 14, y + 2]], '#ffd36a', 4);
  for (const x of [x0 + 40, x1 - 40]) rrect(c, x - 10, y + 40, 20, 200, 4, '#5a5a70', { lw: 4 });
}
export function mesaCerebro(c, x, y, w = 760) {
  rrect(c, x - w / 2, y, w, 40, 8, '#f6d55c', { lw: 6 });
  rrect(c, x - w / 2 + 20, y + 40, w - 40, 200, 8, '#f2b84a', { lw: 6 });
  for (const s of [-1, 1]) rrect(c, x + s * (w / 2 - 140) - 80, y + 70, 160, 60, 8, '#f6d55c', { lw: 4 });
}
// arquivo de gavetas (cena 4)
export function arquivo(c, x, y, abertas = [], t) {
  rrect(c, x - 110, y, 220, 420, 10, '#7ac8ff', { lw: 6 });
  for (let k = 0; k < 4; k++) { const ab = abertas[k] || 0; rrect(c, x - 96, y + 14 + k * 100 + ab * 0, 192, 88, 6, '#9fdcff', { lw: 4 }); if (ab > 0.01) { rrect(c, x - 100, y + 20 + k * 100, 200, 40 * ab + 10, 4, '#2a4a7a', { lw: 3 }); } rrect(c, x - 30, y + 48 + k * 100, 60, 14, 6, '#3a3a50', { lw: 3 }); }
}

// ---------- o cérebro com rosto e mãozinhas ----------
// o: { piscar, olhar:[x,y], tam, pupila, sob:[e,d], boca, suor, maoE:[x,y], maoD:[x,y], tremor, segura }
export function cerebroP(c, x, y, s, t, o = {}) {
  const ol = o.olhar || [0, 0], tam = o.tam || 1, sob = o.sob || [0, 0];
  c.save(); c.translate(x + (o.tremor ? Math.sin(t * 50) * 4 * o.tremor : 0), y); c.scale(s, s);
  const bumps = [[-150, -40, 90], [-80, -120, 100], [20, -140, 105], [120, -100, 95], [170, -10, 85], [110, 70, 90], [0, 90, 95], [-110, 70, 90], [-180, 10, 70]];
  const braco = (sd, alvo) => { if (!alvo) return; const S = [sd * 170, 40], H = alvo, E = [(S[0] + H[0]) / 2 + sd * 50, (S[1] + H[1]) / 2 + 40]; limb(c, [S, E, H], 26, '#ff9eb8'); circle(c, H[0], H[1], 24, '#ff9eb8', { lw: 5 }); if (o.segura?.[sd > 0 ? 1 : 0]) o.segura[sd > 0 ? 1 : 0](c, H[0], H[1]); };
  if (o.apenasMaos) { braco(-1, o.maoE); braco(1, o.maoD); c.restore(); return; }
  const atras = false;
  c.beginPath(); for (const [bx, by, br] of bumps) { c.moveTo(bx + br + 7, by); c.arc(bx, by, br + 7, 0, TAU); } c.fillStyle = OUT; c.fill();
  c.beginPath(); for (const [bx, by, br] of bumps) { c.moveTo(bx + br, by); c.arc(bx, by, br, 0, TAU); } c.fillStyle = '#ff9eb8'; c.fill();
  c.save(); c.globalAlpha = 0.25; c.fillStyle = '#ffffff'; c.beginPath(); c.ellipse(-90, -150, 70, 26, -0.4, 0, TAU); c.fill(); c.restore();
  for (const p of [[[-200, -10], [-150, -60], [-170, -110]], [[-60, -200], [-40, -130], [-90, -90]], [[60, -210], [40, -150], [90, -120]], [[200, -60], [150, -40], [170, 30]], [[-120, 120], [-80, 90], [-40, 130]], [[80, 130], [110, 90], [150, 110]]]) line(c, p, '#e0668a', 9);
  line(c, [[0, -240], [10, -170], [-6, -110]], '#e0668a', 10);
  for (const sd of [-1, 1]) {
    const ex = sd * 62, ey = -10, i = sd < 0 ? 0 : 1;
    if (o.piscar > 0.5) shape(c, c => { c.moveTo(ex - 30, ey); c.quadraticCurveTo(ex, ey + 20, ex + 30, ey); }, null, { lw: 8 });
    else { ellipse(c, ex, ey, 34 * tam, 42 * tam, '#ffffff', { lw: 7 }); const pr = 17 * (o.pupila || 1); circle(c, ex + ol[0] * 14, ey + ol[1] * 18, pr, '#2a1a30', { stroke: null }); circle(c, ex + ol[0] * 14 + 6, ey + ol[1] * 18 - 8, 6, '#ffffff', { stroke: null }); }
    c.save(); c.translate(ex, -64 * tam + sob[i]); c.rotate((o.bravo ? sd * 0.35 : 0) + (o.aflito ? -sd * 0.35 : 0)); line(c, [[-22, 0], [22, 0]], OUT, 9); c.restore();
  }
  const b = o.boca || 'sorriso';
  if (b === 'sorriso') shape(c, c => { c.moveTo(-34, 66); c.quadraticCurveTo(0, 100, 34, 66); }, null, { lw: 8 });
  else if (b === 'o') ellipse(c, 0, 80, 18, 22, '#8e1f2a', { lw: 7 });
  else if (b === 'grito') ellipse(c, 0, 82, 30, 30, '#8e1f2a', { lw: 7 });
  else if (b === 'tremendo') line(c, [[-34, 80], [-20, 72], [-6, 80], [8, 72], [22, 80], [34, 74]], OUT, 7);
  else if (b === 'reta') line(c, [[-22, 78], [22, 78]], OUT, 8);
  else if (b === 'bico') ellipse(c, 0, 78, 10, 9, '#8e1f2a', { lw: 6 });
  if (o.suor > 0) { c.save(); c.globalAlpha *= o.suor; shape(c, c => { c.moveTo(150, -110); c.quadraticCurveTo(172, -70, 150, -62); c.quadraticCurveTo(130, -70, 150, -110); }, '#8fd8ff', { lw: 5 }); c.restore(); }
  if (!o.semMaos) { braco(-1, o.maoE); braco(1, o.maoD); }
  c.restore();
}
export const xicaraC = (c, x, y) => { rrect(c, x - 26, y - 56, 52, 50, 10, '#ffffff', { lw: 5 }); shape(c, c => c.arc(x + 30, y - 32, 14, -1.3, 1.3), null, { lw: 6 }); ellipse(c, x, y - 54, 20, 5, '#7a4a24', { stroke: null }); };

// cadeirinha do cérebro descansando
export function poltrona(c, x, y) {
  rrect(c, x - 200, y - 260, 400, 280, 60, '#35a868', { lw: 6 });
  rrect(c, x - 240, y - 60, 480, 120, 40, '#4fc07e', { lw: 6 });
  for (const s of [-1, 1]) rrect(c, x + s * 230 - 50, y - 140, 100, 200, 40, '#35a868', { lw: 6 });
}

// ================= TELA FINAL =================
export function telaFinal(c, t, t0) {
  const W = 1080, H = 1920;
  const g = c.createRadialGradient(W / 2, H / 2, 100, W / 2, H / 2, 1200); g.addColorStop(0, '#ffcf4a'); g.addColorStop(1, '#f2803a'); c.fillStyle = g; c.fillRect(0, 0, W, H);
  c.save(); c.translate(W / 2, H / 2 - 80); c.rotate(t * 0.3); c.globalAlpha = 0.18; c.fillStyle = '#ffffff'; for (let i = 0; i < 14; i++) { c.rotate(TAU / 14); c.beginPath(); c.moveTo(0, 0); c.lineTo(-70, -1500); c.lineTo(70, -1500); c.closePath(); c.fill(); } c.restore();
  const pop = easeBack(clamp((t - t0) / 0.4)), boing = t > 59.45 ? Math.sin((t - 59.45) * 30) * Math.exp(-(t - 59.45) * 6) * 0.25 : 0;
  c.save(); c.translate(W / 2, H / 2 - 80 + Math.sin(t * 3) * 14); c.scale(Math.cos(t * 3.2) * pop * (1 + boing), pop * (1 - boing));
  c.font = '900 760px Inter, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  c.lineWidth = 60; c.strokeStyle = OUT; c.strokeText('?', 0, 0); c.fillStyle = '#ffffff'; c.fillText('?', 0, 0);
  c.restore();
  for (let k = 0; k < 8; k++) { const an = k / 8 * TAU - t; sparkle(c, W / 2 + Math.cos(an) * 440, H / 2 - 80 + Math.sin(an) * 520, 22, '#ffffff', pop * (0.5 + 0.5 * Math.sin(t * 5 + k))); }
}
