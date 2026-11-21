// Cenários do ABRIGO 47: cidade retrô-futurista, comercial de TV, montanha com a porta do abrigo,
// interior do abrigo, porta abrindo para a luz, o Ermo e a cidade de sucata.
import { TAU, lerp, clamp, sstep, easeOut, rng, mix, rgba } from '../motor/base.js';
import { OUT, shape, circle, ellipse, poly, rrect, line, glow, rays, sparkle, cloud, vgrad, star5 } from '../motor/desenho.js';

const W = 1080, H = 1920;
const AMBAR = '#ffb43a';

// carro retrô com rabo de peixe
export function carroRetro(c, x, y, s, { cor = '#e85a6a', ferrugem = 0, t = 0, roda = 0, ang = 0 } = {}) {
  c.save(); c.translate(x, y); c.rotate(ang); c.scale(s, s);
  const cf = mix(cor, '#8a5a3a', ferrugem);
  shape(c, c => { c.moveTo(-200, -40); c.lineTo(-210, -110); c.lineTo(-170, -96); c.quadraticCurveTo(-120, -110, -70, -112); c.quadraticCurveTo(-40, -170, 40, -170); c.quadraticCurveTo(90, -168, 110, -112); c.quadraticCurveTo(190, -108, 200, -70); c.lineTo(200, -40); c.closePath(); }, cf);
  shape(c, c => { c.moveTo(-50, -114); c.quadraticCurveTo(-30, -160, 30, -160); c.quadraticCurveTo(80, -158, 96, -114); c.closePath(); }, ferrugem > 0.5 ? '#3a3a3a' : '#bff0f6', { lw: 5 });
  line(c, [[-190, -70], [190, -70]], '#e8e8f0', 8);
  if (ferrugem > 0) { c.save(); c.globalAlpha = ferrugem * 0.7; c.fillStyle = '#7a3e1a'; for (const [px, py, r] of [[-130, -70, 22], [60, -60, 26], [150, -80, 14]]) { c.beginPath(); c.arc(px, py, r, 0, TAU); c.fill(); } c.restore(); }
  for (const wx of [-120, 120]) { c.save(); c.translate(wx, -36); c.rotate(roda); circle(c, 0, 0, 32, '#2a2a2a', { lw: 5 }); circle(c, 0, 0, 16, ferrugem > 0.5 ? '#6a4a3a' : '#e8e8f0', { lw: 3 }); c.restore(); }
  c.restore();
}
function predioGoogie(c, x, base, w, h, cor, seed, destruido = 0, luzes = 0.6) {
  const r = rng(seed);
  if (destruido) {
    const top = []; let xx = x - w / 2; while (xx < x + w / 2) { top.push([xx, base - h * (0.5 + r() * 0.5)]); xx += 30 + r() * 40; } top.push([x + w / 2, base - h * (0.5 + r() * 0.4)]);
    poly(c, [[x - w / 2, base], ...top, [x + w / 2, base]], cor);
    const minY = Math.min(...top.map(p => p[1]));
    for (let yy = minY + 40; yy < base - 60; yy += 64) for (let xw = x - w / 2 + 18; xw < x + w / 2 - 26; xw += 44) if (r() < 0.8) rrect(c, xw, yy, 26, 36, 8, '#2a2018', { lw: 3 });
    return;
  }
  rrect(c, x - w / 2, base - h, w, h, 30, cor, { lw: 5 });
  for (let yy = base - h + 40; yy < base - 60; yy += 64) for (let xw = x - w / 2 + 18; xw < x + w / 2 - 26; xw += 44) rrect(c, xw, yy, 26, 36, 10, r() < luzes ? '#fff2c0' : '#bfe8f0', { lw: 3 });
  // antena / disco no topo
  line(c, [[x, base - h], [x, base - h - 70]], OUT, 6); ellipse(c, x, base - h - 70, w * 0.35, 14, '#e8e0d0');
}
// ---------- 1. Cidade do amanhã (anos 50) ----------
export function cidadeRetro(st, t) {
  st.camada(0, c => { vgrad(c, 0, 0, W, H, [[0, '#5ac8d0'], [0.6, '#bff0e8'], [1, '#fff4d8']]); glow(c, 820, 300, 220, '#fff6c0', 0.8); });
  st.camada(0.15, c => { for (let i = 0; i < 6; i++) cloud(c, ((i * 360 + t * 12) % 2000) - 500, 300 + (i % 3) * 120, 120, '#ffffff', { seed: i + 3 }); // monotrilho
    line(c, [[-200, 900], [1300, 860]], '#e8e0d0', 18); const mx = ((t * 160) % 1800) - 400; rrect(c, mx, 820 - (mx + 200) * 0.027, 240, 60, 30, '#ff8a6a', { lw: 5 }); });
  st.camada(0.4, c => { const cores = ['#f2a86a', '#7ad0c8', '#f2d06a', '#e88a9a', '#9ab8e8']; for (let i = 0; i < 11; i++) predioGoogie(c, -500 + i * 200, 1380, 170, 380 + (i * 97) % 420, cores[i % 5], i + 5); });
  st.camada(1, c => {
    rrect(c, -1500, 1460, 4100, 70, 0, '#e8dcc8', { stroke: null });
    rrect(c, -1500, 1530, 4100, 900, 0, '#6a6a72', { stroke: null });
    for (let i = -10; i < 20; i++) rrect(c, i * 220, 1700, 120, 16, 4, '#f2f2f2', { stroke: null });
    // lanchonete-disco voador
    rrect(c, 640, 1250, 30, 210, 6, '#c8ccd4', { lw: 5 }); rrect(c, 940, 1250, 30, 210, 6, '#c8ccd4', { lw: 5 });
    ellipse(c, 805, 1250, 260, 70, '#e85a6a'); ellipse(c, 805, 1210, 150, 70, '#bff0f6');
    c.save(); c.font = '900 40px Inter, sans-serif'; c.textAlign = 'center'; c.fillStyle = '#ffffff'; c.fillText('LANCHE ÓRBITA', 805, 1262); c.restore();
    for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + t * 2; circle(c, 805 + Math.cos(a) * 250, 1250 + Math.sin(a) * 64, 9, Math.sin(t * 8 + i) > 0 ? '#ffd23a' : '#fff6d0', { lw: 3 }); }
  });
}
// ---------- 1b. TV de tubo com o comercial da AtomLar ----------
export function tvComercial(c, t, conteudo) {
  vgrad(c, 0, 0, W, H, [[0, '#5a3a2a'], [1, '#3a2418']]);
  for (let y = 0; y < H; y += 60) line(c, [[0, y], [W, y]], '#4a2e1e', 4, 0.6);
  rrect(c, 60, 380, 960, 1100, 60, '#8a5a32', { lw: 10 });
  rrect(c, 110, 430, 700, 620, 80, '#1a1a1a', { lw: 8 });
  c.save(); c.beginPath(); c.roundRect(130, 450, 660, 580, 70); c.clip();
  conteudo(c);
  // efeito de TV antiga: sépia, linhas e brilho
  c.save(); c.globalCompositeOperation = 'multiply'; c.fillStyle = '#e8d8b8'; c.fillRect(130, 450, 660, 580); c.restore();
  c.save(); c.globalAlpha = 0.18; c.fillStyle = '#000'; for (let y = 450; y < 1030; y += 6) c.fillRect(130, y + (t * 60) % 6, 660, 2); c.restore();
  const g = c.createRadialGradient(460, 740, 200, 460, 740, 420); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.5)'); c.fillStyle = g; c.fillRect(130, 450, 660, 580);
  c.restore();
  for (const [y, cor] of [[560, '#c8a060'], [700, '#c8a060']]) circle(c, 900, y, 46, cor, { lw: 6 });
  for (let i = 0; i < 8; i++) line(c, [[850, 820 + i * 22], [950, 820 + i * 22]], '#4a2e1e', 6);
  for (const x of [170, 910]) rrect(c, x - 14, 1480, 28, 120, 6, '#5a3a22', { lw: 6 });
}
// ---------- 2. Montanha com a porta blindada do Abrigo 47 ----------
export function portaAbrigo(c, x, base, k, t) {
  // k: 0 = aberta, 1 = fechada (as duas folhas deslizam)
  rrect(c, x - 230, base - 420, 460, 420, 20, '#5a5a62', { lw: 8 });
  c.save(); c.beginPath(); c.rect(x - 200, base - 390, 400, 390); c.clip();
  c.fillStyle = '#1a1a1e'; c.fillRect(x - 200, base - 390, 400, 390);
  glow(c, x, base - 200, 300, '#fff0c0', 0.3 * (1 - k));
  for (const sd of [-1, 1]) {
    const off = (1 - k) * 200;
    c.save(); c.translate(sd < 0 ? x - 200 - off : x + off, base - 390);
    rrect(c, 0, 0, 200, 390, 4, '#9a9aa4', { lw: 6 });
    for (let i = 0; i < 6; i++) poly(c, [[i * 40 - 20, 340], [i * 40, 340], [i * 40 + 30, 390], [i * 40 + 10, 390]], '#f2c230', { stroke: null });
    for (let i = 0; i < 6; i++) poly(c, [[i * 40, 340], [i * 40 + 20, 340], [i * 40 + 50, 390], [i * 40 + 30, 390]], '#2a2a2a', { stroke: null });
    c.restore();
  }
  c.restore();
  rrect(c, x - 90, base - 500, 180, 70, 12, '#2a9a9a', { lw: 6 });
  c.save(); c.font = '900 52px Inter, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#ffffff'; c.fillText('47', x, base - 464); c.restore();
  const pisca = Math.sin(t * 6) > 0;
  for (const sd of [-1, 1]) { circle(c, x + sd * 200, base - 470, 18, pisca ? '#ff4a2a' : '#7a2a1a', { lw: 4 }); if (pisca) glow(c, x + sd * 200, base - 470, 70, '#ff4a2a', 0.6); }
}
export function montanhaAbrigo(st, t, { alarme = 0, flash = 0 } = {}) {
  st.camada(0, c => { vgrad(c, 0, 0, W, H, [[0, mix('#5ac8d0', '#c0502a', alarme)], [0.6, mix('#bff0e8', '#ff9a4a', alarme)], [1, mix('#fff4d8', '#ffd890', alarme)]]); glow(c, 900, 1100, 700, '#ffffff', flash); });
  st.camada(0.2, c => { for (let i = 0; i < 5; i++) cloud(c, ((i * 380 + t * 12) % 2000) - 500, 320 + (i % 3) * 120, 130, mix('#ffffff', '#d07a4a', alarme), { seed: i + 13 }); });
  st.camada(0.6, c => { shape(c, cc => { cc.moveTo(-600, 1500); cc.quadraticCurveTo(200, 700, 540, 640); cc.quadraticCurveTo(900, 700, 1700, 1500); cc.closePath(); }, mix('#8aa86a', '#7a6a4a', alarme), { stroke: null }); for (let i = 0; i < 8; i++) { const x = -100 + i * 170; circle(c, x, 1200 + Math.abs(i - 4) * 50, 50, '#5a8a4a', { lw: 5 }); } });
  st.camada(1, c => {
    vgrad(c, -1500, 1500, 4100, 900, [[0, mix('#9ab87a', '#8a7a5a', alarme)], [1, mix('#7a9a5a', '#6a5a3a', alarme)]]);
    shape(c, cc => { cc.moveTo(160, 1500); cc.quadraticCurveTo(540, 1000, 920, 1500); cc.closePath(); }, '#7a7a6a');
  });
}
// ---------- 3. Interior do abrigo ----------
export function interiorAbrigo(st, t, { alarme = 0, sala = 'corredor' } = {}) {
  st.camada(0.9, c => {
    vgrad(c, -400, -200, 1900, 2400, [[0, '#c8d4d0'], [1, '#a8b8b4']]);
    for (let x = -400; x < 1500; x += 200) { rrect(c, x, -200, 190, 1700, 4, '#b8c6c2', { stroke: '#8a9a96', lw: 4 }); for (let y = 0; y < 1500; y += 300) circle(c, x + 20, y, 6, '#7a8a86', { stroke: null }); }
    rrect(c, -400, 300, 1900, 60, 0, '#2a9a9a', { stroke: null }); rrect(c, -400, 360, 1900, 16, 0, '#ff8a2a', { stroke: null });
    if (sala === 'corredor') { for (const x of [160, 920]) { circle(c, x, 760, 110, '#3a4a4a', { lw: 10 }); circle(c, x, 760, 86, '#5ac8d0', { lw: 5 }); glow(c, x, 760, 120, '#bff0f6', 0.3); } c.save(); c.font = '900 64px Inter, sans-serif'; c.textAlign = 'center'; c.fillStyle = '#2a9a9a'; c.fillText('ABRIGO 47', 540, 560); c.restore(); }
    if (sala === 'aula') { rrect(c, 260, 520, 560, 360, 14, '#2a4a3a', { lw: 10 }); c.save(); c.font = '700 48px Inter, sans-serif'; c.textAlign = 'left'; c.fillStyle = '#f2f2e8'; c.fillText('REGRA Nº 1:', 300, 610); c.fillText('NINGUÉM SAI.', 300, 690); c.restore(); radiacaoSimples(c, 700, 790, 50); }
    if (sala === 'agua') { rrect(c, 300, 520, 480, 640, 40, '#8a9a9a', { lw: 8 }); const nivel = clamp(1 - alarme); c.save(); c.beginPath(); c.roundRect(330, 560, 420, 560, 30); c.clip(); c.fillStyle = '#5ab0e0'; c.fillRect(330, 560 + 560 * (1 - nivel), 420, 560 * nivel); c.restore(); rrect(c, 330, 560, 420, 560, 30, null, { lw: 5 }); c.save(); c.font = '900 52px Inter, sans-serif'; c.textAlign = 'center'; c.fillStyle = '#2a2a2a'; c.fillText('ÁGUA', 540, 500); c.restore(); }
    // luzes de teto
    for (const x of [140, 540, 940]) { rrect(c, x - 70, -60, 140, 30, 10, alarme > 0.5 && Math.sin(t * 8) > 0 ? '#ff4a2a' : '#fff6d0', { lw: 4 }); glow(c, x, -40, 260, alarme > 0.5 && Math.sin(t * 8) > 0 ? '#ff4a2a' : '#fff6d0', 0.4); }
  });
  st.camada(1, c => { vgrad(c, -400, 1480, 1900, 900, [[0, '#8a9a98'], [1, '#6a7a78']]); for (let x = -400; x < 1500; x += 120) line(c, [[x, 1480], [x - 80, 2400]], '#7a8a88', 4); });
  if (alarme > 0) st.camada(0, c => { c.save(); c.globalAlpha = alarme * 0.18 * (Math.sin(t * 8) > 0 ? 1 : 0.3); c.fillStyle = '#ff2a1a'; c.fillRect(0, 0, W, H); c.restore(); });
}
function radiacaoSimples(c, x, y, r) { circle(c, x, y, r, '#f2d030', { lw: 5 }); for (let i = 0; i < 3; i++) { const a0 = -Math.PI / 2 + i * TAU / 3 - 0.5; shape(c, cc => { cc.moveTo(x, y); cc.arc(x, y, r * 0.8, a0, a0 + 1.0); cc.closePath(); }, '#1a1a1a', { stroke: null }); } }
// ---------- 4/5. O Ermo (deserto com a cidade retrô em ruínas) ----------
export function ermo(st, t, { tarde = 0 } = {}) {
  st.camada(0, c => { vgrad(c, 0, 0, W, H, [[0, mix('#e0a050', '#7a3a4a', tarde)], [0.6, mix('#f2c878', '#e07a4a', tarde)], [1, mix('#ffe6b0', '#ffb060', tarde)]]); glow(c, 760, 520, 300, '#fff6d0', 0.8); circle(c, 760, 520, 90, '#fff6d0', { stroke: null }); });
  st.camada(0.2, c => { for (let i = 0; i < 4; i++) cloud(c, ((i * 420 + t * 10) % 2000) - 500, 380 + (i % 2) * 140, 120, rgba('#fff0d0', 0.6), { seed: i + 41 }); });
  st.camada(0.4, c => { const cores = ['#b88a5a', '#9a8a6a', '#a87a5a']; for (let i = 0; i < 11; i++) predioGoogie(c, -500 + i * 200, 1380, 170, 360 + (i * 97) % 400, cores[i % 3], i + 50, 1); });
  st.camada(0.7, c => {
    shape(c, cc => { cc.moveTo(-1200, 1480); cc.quadraticCurveTo(0, 1360, 600, 1440); cc.quadraticCurveTo(1300, 1360, 2400, 1480); cc.lineTo(2400, 2000); cc.lineTo(-1200, 2000); cc.closePath(); }, '#d8b078', { stroke: null });
    // estátua caída do mascote (cabeça)
    c.save(); c.translate(1060, 1440); c.rotate(0.5); circle(c, 0, 0, 120, '#c8b89a'); rrect(c, -80, -50, 160, 100, 24, '#8a7a5a', { lw: 5 }); c.restore();
    for (const x of [-300, 300, 820]) { line(c, [[x, 1460], [x, 1300]], '#6a4a2a', 10); line(c, [[x - 30, 1340], [x + 30, 1330]], '#6a4a2a', 8); }
  });
  st.camada(1, c => {
    vgrad(c, -1500, 1480, 4100, 900, [[0, '#e8c48a'], [1, '#c89a5a']]);
    const r = rng(7); for (let i = 0; i < 30; i++) { const x = -1200 + r() * 3600, y = 1520 + r() * 400; poly(c, [[x, y], [x + 30 + r() * 40, y - 16 - r() * 24], [x + 70 + r() * 40, y]], '#b88a5a', { lw: 4 }); }
    for (let i = 0; i < 10; i++) { const x = -900 + i * 320; line(c, [[x, 1560], [x - 6, 1520]], '#7a8a4a', 5); line(c, [[x + 8, 1560], [x + 14, 1524]], '#7a8a4a', 5); }
  });
}
// ---------- 6. Cidade de sucata ----------
export function cidadeSucata(st, t) {
  ermo(st, t, { tarde: 0.4 });
  st.camada(0.85, c => {
    for (const [x, w, h, cor] of [[-120, 340, 320, '#9a5a2a'], [300, 300, 280, '#7a7a6a'], [760, 360, 340, '#8a4a2a'], [1180, 300, 280, '#6a6a5a']]) {
      rrect(c, x - w / 2, 1480 - h, w, h, 4, cor, { lw: 6 });
      for (let k = 1; k < 5; k++) line(c, [[x - w / 2 + k * w / 5, 1480 - h], [x - w / 2 + k * w / 5, 1480]], mix(cor, '#000000', 0.25), 4);
      rrect(c, x - w / 2 + 20, 1480 - h + 30, 60, 50, 6, '#ffd890', { lw: 4 });
    }
    // placa da cidade
    rrect(c, 340, 980, 420, 110, 12, '#5a3a22', { lw: 7 });
    c.save(); c.font = '900 56px Inter, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = AMBAR; c.fillText('PORTO SUCATA', 550, 1036); c.restore();
    for (let i = 0; i < 16; i++) { const x = -300 + i * 100, y = 1120 + Math.sin(i * 0.9) * 26; circle(c, x, y, 10, '#ffd060', { lw: 3 }); glow(c, x, y, 36, '#ffb040', 0.5); }
  });
}
// ---------- HUD de jogo ----------
export function hudVida(c, x, y, vida, t, rotulo = 'VIDA') {
  c.save(); c.font = '900 34px Inter, sans-serif'; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillStyle = AMBAR; c.strokeStyle = '#1a1208'; c.lineWidth = 8; c.strokeText(rotulo, x, y); c.fillText(rotulo, x, y); c.restore();
  rrect(c, x + 110, y - 18, 300, 36, 8, '#1a1208', { lw: 4 });
  const n = Math.round(clamp(vida) * 12); for (let i = 0; i < n; i++) rrect(c, x + 116 + i * 24.5, y - 12, 20, 24, 3, i < 4 && vida < 0.4 ? '#ff4a2a' : AMBAR, { stroke: null });
}
export function numeroFlutuante(st, x, y, texto, dt, cor = '#ff4a2a') {
  if (dt < 0 || dt > 1) return;
  st.text(texto, x, y - dt * 120, { size: 70, fill: cor, alpha: 1 - Math.max(0, dt - 0.6) / 0.4, scale: 0.7 + 0.3 * Math.min(1, dt / 0.15), lw: 14 });
}
export function caixaEscolha(c, t, t0, opcoes, escolhida = -1, tEsc = 99) {
  const dt = t - t0; if (dt < 0) return;
  const k = Math.min(1, dt / 0.3);
  c.save(); c.globalAlpha = k;
  rrect(c, 90, 1180, 900, 120 * opcoes.length + 40, 20, 'rgba(20,14,6,0.88)', { stroke: AMBAR, lw: 6 });
  opcoes.forEach((o, i) => {
    const sel = i === escolhida && t > tEsc;
    if (sel) rrect(c, 110, 1200 + i * 120, 860, 100, 14, AMBAR, { stroke: null });
    c.font = '900 50px Inter, sans-serif'; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillStyle = sel ? '#1a1208' : AMBAR;
    c.fillText(`${i + 1}. ${o}`, 140, 1250 + i * 120);
  });
  c.restore();
}
// tela do PulsoTec em close (âmbar monocromático)
export function telaPulsotec(c, t, { sinal = 0, rad = 0 } = {}) {
  vgrad(c, 0, 0, W, H, [[0, '#3a2a1a'], [1, '#1a120a']]);
  rrect(c, 90, 360, 900, 1100, 60, '#8a7a5a', { lw: 10 });
  rrect(c, 150, 430, 780, 760, 30, '#1a1208', { lw: 8 });
  c.save(); c.beginPath(); c.roundRect(160, 440, 760, 740, 26); c.clip();
  glow(c, 540, 800, 600, AMBAR, 0.15);
  c.font = '900 48px Inter, sans-serif'; c.textAlign = 'left'; c.fillStyle = AMBAR;
  c.fillText('PULSOTEC  ·  ABRIGO 47', 200, 520);
  line(c, [[200, 550], [880, 550]], AMBAR, 4);
  // mapa com marcador
  for (let i = 0; i < 6; i++) line(c, [[200, 620 + i * 90], [880, 620 + i * 90]], rgba(AMBAR, 0.25), 2);
  for (let i = 0; i < 8; i++) line(c, [[200 + i * 97, 580], [200 + i * 97, 1100]], rgba(AMBAR, 0.25), 2);
  star5(c, 330, 900, 26, AMBAR, { stroke: null });
  c.fillText('47', 300, 970);
  if (sinal > 0) { const pisca = Math.sin(t * 8) > 0; c.globalAlpha = sinal; circle(c, 740, 700, 22, pisca ? AMBAR : '#5a3a10', { stroke: null }); for (let k = 0; k < 3; k++) { const rr = ((t * 80 + k * 40) % 120); c.strokeStyle = rgba(AMBAR, 1 - rr / 120); c.lineWidth = 4; c.beginPath(); c.arc(740, 700, 22 + rr, 0, TAU); c.stroke(); } c.font = '900 40px Inter, sans-serif'; c.fillText('SINAL: ABRIGO 12', 560, 790); c.globalAlpha = 1; }
  c.font = '900 40px Inter, sans-serif'; c.fillText(`RAD: ${Math.round(rad * 100)}`, 200, 1140);
  c.restore();
  c.save(); c.globalAlpha = 0.15; c.fillStyle = '#000'; for (let y = 440; y < 1180; y += 6) c.fillRect(160, y, 760, 2); c.restore();
  for (const [x, y] of [[250, 1310], [540, 1310], [830, 1310]]) circle(c, x, y, 50, '#6a5a3a', { lw: 6 });
}
