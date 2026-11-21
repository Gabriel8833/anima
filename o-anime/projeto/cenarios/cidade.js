// Cenários de "O Relojoeiro": casa, relojoaria (cheia de relógios animados), cofre do banco, garagem,
// sala de planejamento, rua na chuva, bar escuro; jornal e partículas de chuva.
import { TAU, lerp, clamp, sstep, rng, mix, rgba } from '../motor/base.js';
import { OUT, shape, circle, ellipse, poly, rrect, line, glow, rays, sparkle, cloud, vgrad } from '../motor/desenho.js';

const W = 1080, H = 1920;
// relógio de parede animado
export function relogio(c, x, y, r, t, { moldura = '#7a5232', parado = false, vel = 1 } = {}) {
  circle(c, x, y, r, moldura, { lw: 5 }); circle(c, x, y, r * 0.82, '#f6f2e8', { lw: 3 });
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; line(c, [[x + Math.cos(a) * r * 0.68, y + Math.sin(a) * r * 0.68], [x + Math.cos(a) * r * 0.76, y + Math.sin(a) * r * 0.76]], OUT, 3); }
  const s = parado ? -1.2 : t * 1.05 * vel, m = parado ? 2.3 : t * 0.09 * vel;
  line(c, [[x, y], [x + Math.cos(m) * r * 0.5, y + Math.sin(m) * r * 0.5]], OUT, 5); line(c, [[x, y], [x + Math.cos(s) * r * 0.7, y + Math.sin(s) * r * 0.7]], '#c0302a', 3);
  circle(c, x, y, 5, OUT, { stroke: null });
}
function relogioPendulo(c, x, y, t, noite = 0) {
  rrect(c, x - 60, y - 340, 120, 340, 12, mix('#7a4a2a', '#2a1a12', noite), { lw: 6 }); relogio(c, x, y - 270, 46, t);
  const a = Math.sin(t * 3) * 0.3; line(c, [[x, y - 210], [x + Math.sin(a) * 100, y - 210 + Math.cos(a) * 100]], '#c8a040', 4); circle(c, x + Math.sin(a) * 100, y - 210 + Math.cos(a) * 100, 16, '#d8b040', { lw: 4 });
}
// ---------- casa (cozinha) ----------
export function casa(st, t, { noite = 0, frio = 0 } = {}) {
  st.camada(0.9, c => {
    vgrad(c, -400, -200, 1900, 2400, [[0, mix('#e8d8c0', '#2a2638', noite)], [1, mix('#d8c4a4', '#1a1828', noite)]]);
    rrect(c, 580, 480, 360, 380, 10, mix('#ffd8a0', '#1a2a4a', noite), { lw: 10 }); line(c, [[760, 480], [760, 860]], OUT, 8); line(c, [[580, 670], [940, 670]], OUT, 8);
    if (noite < 0.6) { c.save(); c.beginPath(); c.rect(590, 490, 340, 360); c.clip(); c.globalAlpha *= 1 - noite; poly(c, [[590, 850], [620, 720], [720, 710], [760, 760], [930, 760], [930, 850]], '#c8703a', { lw: 4 }); rrect(c, 840, 740, 16, 80, 8, '#4a7a3a', { lw: 3 }); c.restore(); line(c, [[760, 480], [760, 860]], OUT, 8); line(c, [[580, 670], [940, 670]], OUT, 8); }
    if (noite) { circle(c, 860, 560, 34, '#f6f2d8', { stroke: null }); glow(c, 860, 560, 100, '#f6f2d8', 0.5); }
    else rays(c, 760, 560, -0.5, 4, 1000, 200, '#fff6d0', 0.22, t, 2);
    relogio(c, 260, 520, 70, t, { moldura: '#5a3a22' });
    rrect(c, 120, 820, 360, 20, 4, '#7a5232'); for (let i = 0; i < 4; i++) rrect(c, 140 + i * 82, 760, 54, 60, 8, ['#c8a080', '#a8c0d0', '#d8b860', '#b8805a'][i], { lw: 4 });
    // porta-retrato da família
    rrect(c, -200, 560, 200, 160, 8, '#c8a040', { lw: 6 }); rrect(c, -186, 574, 172, 132, 4, mix('#bfe6f6', '#3a3a4a', frio), { lw: 3 });
  });
  st.camada(1, c => { vgrad(c, -400, 1480, 1900, 900, [[0, mix('#b88a5a', '#3a2a24', noite)], [1, mix('#9a6a40', '#2a1e18', noite)]]); rrect(c, 200, 1380, 680, 40, 10, mix('#c8925a', '#4a3424', noite), { lw: 6 }); for (const x of [240, 840]) rrect(c, x - 12, 1420, 24, 200, 6, mix('#8a5a30', '#3a2418', noite), { lw: 5 }); });
  if (frio > 0) st.camada(0, c => { c.save(); c.globalAlpha = frio * 0.25; c.fillStyle = '#2a3a5a'; c.fillRect(0, 0, W, H); c.restore(); });
}
// ---------- relojoaria ----------
export function relojoaria(st, t, { noite = 0 } = {}) {
  st.camada(0.9, c => {
    vgrad(c, -400, -200, 1900, 2400, [[0, mix('#d8c0a0', '#1e1a22', noite)], [1, mix('#b89a74', '#14121a', noite)]]);
    // parede de relógios
    const r = rng(4);
    for (let i = 0; i < 22; i++) { const x = -200 + (i % 7) * 230 + r() * 40, y = 300 + Math.floor(i / 7) * 260 + r() * 40; relogio(c, x, y, 50 + r() * 30, t * (0.8 + r() * 0.5) + i, { moldura: ['#7a5232', '#c8a040', '#5a3a22', '#8a8a9a'][i % 4] }); }
    relogioPendulo(c, 980, 1460, t, noite);
    // vitrine
    rrect(c, -300, 1100, 900, 40, 6, mix('#7a5232', '#2a1a12', noite), { lw: 6 }); rrect(c, -300, 1140, 900, 340, 6, mix('#8a6040', '#22160e', noite), { lw: 6 });
    c.save(); c.font = '900 italic 70px Inter, sans-serif'; c.textAlign = 'center'; c.fillStyle = mix('#7a3a1a', '#6a5a4a', noite); c.fillText('Relojoaria', 540, 230); c.restore();
  });
  st.camada(1, c => { vgrad(c, -400, 1480, 1900, 900, [[0, mix('#8a6a4a', '#1e1814', noite)], [1, mix('#6a4a30', '#120e0a', noite)]]); });
  if (noite) st.camada(0, c => { const g = c.createRadialGradient(540, 1100, 100, 540, 1100, 900); g.addColorStop(0, 'rgba(255,200,120,0.18)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(0, 0, W, H); });
}
// bancada de trabalho com lâmpada (por cima das pernas)
export function bancada(c, x, y, t, noite = 0) {
  rrect(c, x - 300, y, 600, 40, 8, '#7a5232', { lw: 6 }); rrect(c, x - 280, y + 40, 560, 200, 6, '#5a3a22', { lw: 6 });
  line(c, [[x + 220, y], [x + 260, y - 160], [x + 160, y - 220]], '#3a3a3a', 8); shape(c, cc => { cc.moveTo(x + 120, y - 200); cc.lineTo(x + 200, y - 240); cc.lineTo(x + 210, y - 190); cc.closePath(); }, '#2a6a5a', { lw: 4 });
  glow(c, x + 150, y - 160, 260, '#ffe0a0', 0.5 + noite * 0.3);
  for (let i = 0; i < 4; i++) circle(c, x - 200 + i * 70, y - 6, 12, '#d8b040', { lw: 3 });
}
// ---------- cofre do banco ----------
export function cofreBanco(st, t, { alarme = 0, aberto = 0 } = {}) {
  st.camada(0.9, c => {
    vgrad(c, -400, -200, 1900, 2400, [[0, '#2a3038'], [1, '#1a1e24']]);
    for (let x = -400; x < 1500; x += 160) rrect(c, x, -200, 150, 1700, 4, '#323a44', { stroke: '#22282e', lw: 4 });
    // porta circular do cofre
    const cx = 540, cy = 900;
    circle(c, cx, cy, 380, '#5a626e', { lw: 10 });
    if (aberto > 0) { c.save(); c.beginPath(); c.arc(cx, cy, 330, 0, TAU); c.clip(); c.fillStyle = '#ffe8a0'; c.fillRect(cx - 330, cy - 330, 660, 660); for (let i = 0; i < 8; i++) rrect(c, cx - 260 + (i % 4) * 130, cy - 40 + Math.floor(i / 4) * 80, 110, 60, 6, '#e3b23c', { lw: 4 }); glow(c, cx, cy, 500, '#ffe08a', aberto * 0.7); c.restore(); }
    c.save(); c.translate(cx + aberto * 520, cy); c.scale(1 - aberto * 0.75, 1);
    circle(c, 0, 0, 330, '#8a929e', { lw: 8 }); circle(c, 0, 0, 260, '#9aa2ae', { lw: 5 });
    for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; circle(c, Math.cos(a) * 300, Math.sin(a) * 300, 16, '#6a727e', { lw: 4 }); }
    c.rotate(t * 0.2 * (1 - aberto)); for (let i = 0; i < 3; i++) { c.save(); c.rotate(i * TAU / 3); rrect(c, -14, 30, 28, 150, 10, '#5a626e', { lw: 4 }); circle(c, 0, 190, 26, '#5a626e', { lw: 4 }); c.restore(); }
    circle(c, 0, 0, 60, '#c8ccd4', { lw: 6 });
    c.restore();
    if (alarme > 0) { const pisca = Math.sin(t * 10) > 0; for (const x of [140, 940]) { circle(c, x, 260, 34, pisca ? '#ff2a1a' : '#5a1a14', { lw: 5 }); if (pisca) glow(c, x, 260, 200, '#ff2a1a', 0.6 * alarme); } }
  });
  st.camada(1, c => { vgrad(c, -400, 1480, 1900, 900, [[0, '#3a4048'], [1, '#22262c']]); });
  if (alarme > 0) st.camada(0, c => { c.save(); c.globalAlpha = alarme * 0.15 * (Math.sin(t * 10) > 0 ? 1 : 0.3); c.fillStyle = '#ff1a10'; c.fillRect(0, 0, W, H); c.restore(); });
}
// ---------- garagem subterrânea ----------
export function garagem(st, t) {
  st.camada(0.9, c => {
    vgrad(c, -400, -200, 1900, 2400, [[0, '#1e2228'], [1, '#2a2e34']]);
    for (let x = -300; x < 1500; x += 420) { rrect(c, x, 200, 90, 1300, 6, '#4a4e56', { lw: 6 }); rrect(c, x, 1100, 90, 40, 0, '#d8b040', { stroke: null }); }
    for (let x = -200; x < 1500; x += 420) { const f = Math.sin(t * 13 + x) > -0.85 ? 1 : 0.2; rrect(c, x, 120, 180, 26, 8, f > 0.5 ? '#f2f6e8' : '#4a4e46', { lw: 4 }); glow(c, x + 90, 140, 260, '#e8f0d0', 0.35 * f); }
    c.save(); c.font = '900 80px Inter, sans-serif'; c.textAlign = 'center'; c.fillStyle = '#4a4e56'; c.fillText('P-3', 540, 520); c.restore();
  });
  st.camada(1, c => { vgrad(c, -400, 1480, 1900, 900, [[0, '#3a3e44'], [1, '#26292e']]); for (let x = -400; x < 1500; x += 300) line(c, [[x, 1500], [x - 200, 2400]], '#e8e0c0', 6, 0.6); });
}
// carro escuro (sedan)
export function carroEscuro(c, x, y, s, { cor = '#2a2e38', farol = 1, flip = 1 } = {}) {
  c.save(); c.translate(x, y); c.scale(s * flip, s);
  shape(c, cc => { cc.moveTo(-210, -40); cc.lineTo(-210, -100); cc.lineTo(-120, -112); cc.lineTo(-70, -170); cc.lineTo(80, -170); cc.lineTo(130, -112); cc.lineTo(210, -100); cc.lineTo(214, -40); cc.closePath(); }, cor);
  shape(c, cc => { cc.moveTo(-56, -116); cc.lineTo(-40, -158); cc.lineTo(70, -158); cc.lineTo(110, -116); cc.closePath(); }, '#1a1e26', { lw: 4 });
  rrect(c, 194, -94, 22, 18, 4, '#ffe8a0', { lw: 3 }); if (farol) { c.save(); c.globalCompositeOperation = 'lighter'; const g = c.createLinearGradient(216, 0, 700, 0); g.addColorStop(0, 'rgba(255,240,180,0.4)'); g.addColorStop(1, 'rgba(255,240,180,0)'); c.fillStyle = g; c.beginPath(); c.moveTo(216, -90); c.lineTo(700, -160); c.lineTo(700, 0); c.closePath(); c.fill(); c.restore(); }
  for (const wx of [-120, 130]) { circle(c, wx, -36, 34, '#111111', { lw: 5 }); circle(c, wx, -36, 16, '#7a7e88', { lw: 3 }); }
  c.restore();
}
// planta do cofre presa na mesa (sala dos fundos)
export function plantaPlano(c, x, y, t, k = 1) {
  c.save(); c.globalAlpha *= k; rrect(c, x - 300, y - 200, 600, 400, 8, '#3a5a9a', { lw: 6 });
  c.strokeStyle = '#d8e8ff'; c.lineWidth = 3; for (let i = 0; i < 8; i++) { c.beginPath(); c.moveTo(x - 280 + i * 70, y - 180); c.lineTo(x - 280 + i * 70, y + 180); c.stroke(); } for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(x - 280, y - 160 + i * 64); c.lineTo(x + 280, y - 160 + i * 64); c.stroke(); }
  c.lineWidth = 6; c.strokeRect(x - 220, y - 120, 260, 200); c.beginPath(); c.arc(x + 140, y + 20, 70, 0, TAU); c.stroke();
  for (const [px, py] of [[x - 180, y - 80], [x + 20, y + 40], [x + 140, y + 20]]) circle(c, px, py, 12, '#ff3a2a', { lw: 3 });
  line(c, [[x - 180, y - 80], [x + 20, y + 40], [x + 140, y + 20]], '#ff3a2a', 4);
  c.restore();
}
// ---------- rua na chuva (noite) ----------
export function ruaChuva(st, t) {
  st.camada(0, c => { vgrad(c, 0, 0, W, H, [[0, '#0a0c14'], [0.7, '#1a1e2e'], [1, '#2a2a3a']]); });
  st.camada(0.4, c => { const r = rng(6); for (let i = 0; i < 10; i++) { const x = -400 + i * 200, h = 400 + r() * 500; rrect(c, x, 1420 - h, 180, h, 4, '#14161e', { stroke: '#0a0c12', lw: 4 }); for (let k = 0; k < 14; k++) if (r() < 0.25) rrect(c, x + 20 + (k % 4) * 40, 1420 - h + 30 + Math.floor(k / 4) * 60, 24, 34, 3, '#ffd890', { stroke: null }); } });
  st.camada(1, c => {
    vgrad(c, -1500, 1460, 4100, 900, [[0, '#1e2230'], [1, '#12141c']]);
    for (let i = 0; i < 6; i++) ellipse(c, -500 + i * 400, 1640 + (i % 2) * 80, 160, 18, '#3a4a6a', { stroke: null, alpha: 0.6 });
    for (const x of [80, 1000]) { rrect(c, x - 10, 1000, 20, 470, 4, '#2a2a30', { lw: 4 }); line(c, [[x, 1000], [x + (x < 540 ? 80 : -80), 990]], '#2a2a30', 8); const lx = x + (x < 540 ? 80 : -80); circle(c, lx, 1000, 18, '#ffe8a0', { lw: 3 }); c.save(); c.globalCompositeOperation = 'lighter'; const g = c.createLinearGradient(0, 1000, 0, 1470); g.addColorStop(0, 'rgba(255,230,160,0.3)'); g.addColorStop(1, 'rgba(255,230,160,0)'); c.fillStyle = g; c.beginPath(); c.moveTo(lx - 10, 1010); c.lineTo(lx + 10, 1010); c.lineTo(lx + 160, 1470); c.lineTo(lx - 160, 1470); c.closePath(); c.fill(); c.restore(); }
  });
}
export function chuva(c, t, a = 1) { const r = rng(9); c.save(); c.globalAlpha = a * 0.5; c.strokeStyle = '#a8b8d8'; c.lineWidth = 3; for (let i = 0; i < 90; i++) { const x = r() * 1300 - 100, y = ((r() * 2000 + t * 1400) % 2100) - 100; c.beginPath(); c.moveTo(x, y); c.lineTo(x - 12, y + 50); c.stroke(); } c.restore(); }
// ---------- bar escuro ----------
export function bar(st, t) {
  st.camada(0.9, c => {
    vgrad(c, -400, -200, 1900, 2400, [[0, '#1a1210'], [1, '#2a1a14']]);
    for (let i = 0; i < 3; i++) { circle(c, 200 + i * 340, 300, 30, '#ffd890', { lw: 4 }); glow(c, 200 + i * 340, 320, 300, '#ffb060', 0.35); line(c, [[200 + i * 340, 0], [200 + i * 340, 270]], '#1a1a1a', 4); }
    rrect(c, -300, 900, 1700, 40, 6, '#5a3a22', { lw: 6 }); for (let i = 0; i < 12; i++) rrect(c, -200 + i * 120, 780, 40, 110, 10, ['#3a6a3a', '#8a3a2a', '#c8a040'][i % 3], { lw: 4 });
    // fumaça no ar
    for (let i = 0; i < 5; i++) cloud(c, ((i * 300 + t * 20) % 1600) - 300, 600 + (i % 2) * 120, 160, rgba('#c8b8a8', 0.1), { seed: i + 3 });
  });
  st.camada(1, c => { vgrad(c, -400, 1480, 1900, 900, [[0, '#3a2418'], [1, '#22140e']]); rrect(c, 260, 1380, 560, 40, 10, '#5a3a22', { lw: 6 }); });
}
// jornal com manchete
export function jornal(c, x, y, s, t, titulo) {
  c.save(); c.translate(x, y); c.rotate(-0.08 + Math.sin(t) * 0.02); c.scale(s, s);
  rrect(c, -300, -380, 600, 760, 6, '#f2ead8', { lw: 7 });
  c.font = '900 italic 54px Inter, sans-serif'; c.textAlign = 'center'; c.fillStyle = '#2a2a2a'; c.fillText('Diário da Cidade', 0, -300);
  line(c, [[-270, -270], [270, -270]], '#2a2a2a', 4);
  c.font = '900 56px Inter, sans-serif'; titulo.forEach((tx, i) => c.fillText(tx, 0, -190 + i * 66));
  rrect(c, -240, -40, 480, 260, 4, '#c8c0b0', { lw: 4 }); circle(c, 0, 90, 70, '#e8e0d0', { lw: 5 }); line(c, [[0, 90], [0, 40]], OUT, 5); line(c, [[0, 90], [30, 110]], OUT, 5);
  for (let i = 0; i < 5; i++) line(c, [[-250, 260 + i * 22], [250 - (i % 2) * 60, 260 + i * 22]], '#8a8a8a', 4);
  c.restore();
}
// ---------- deserto (cidade árida do sudoeste) ----------
// hora: 0 = dia, 1 = pôr do sol, 2 = noite
export function cacto(c, x, y, s = 1, cor = '#5a8a3a') {
  c.save(); c.translate(x, y); c.scale(s, s);
  rrect(c, -22, -200, 44, 200, 22, cor, { lw: 5 });
  shape(c, c => { c.moveTo(-22, -90); c.lineTo(-60, -90); c.quadraticCurveTo(-74, -90, -74, -110); c.lineTo(-74, -150); c.quadraticCurveTo(-60, -166, -48, -150); c.lineTo(-48, -112); c.lineTo(-22, -112); c.closePath(); }, cor, { lw: 5 });
  shape(c, c => { c.moveTo(22, -120); c.lineTo(56, -120); c.lineTo(56, -170); c.quadraticCurveTo(68, -186, 80, -170); c.lineTo(80, -120); c.quadraticCurveTo(80, -98, 60, -98); c.lineTo(22, -98); c.closePath(); }, cor, { lw: 5 });
  c.restore();
}
export function deserto(st, t, { hora = 0, estrada = true } = {}) {
  const tarde = clamp(hora), noite = clamp(hora - 1);
  const top = mix(mix('#e8a030', '#b8402a', tarde), '#0a0c20', noite), bot = mix(mix('#ffe08a', '#ffa850', tarde), '#2a2034', noite);
  st.camada(0, c => {
    vgrad(c, 0, 0, W, H, [[0, top], [0.75, bot], [1, bot]]);
    if (noite < 0.5) { const sy = lerp(360, 980, tarde); glow(c, 780, sy, 520, mix('#fff2c0', '#ff7a30', tarde), 0.75); circle(c, 780, sy, 84, mix('#fff8e0', '#ffc070', tarde), { stroke: null }); }
    else { const r = rng(3); c.save(); c.fillStyle = '#ffffff'; for (let i = 0; i < 70; i++) { c.globalAlpha = 0.3 + 0.6 * r(); c.fillRect(r() * W, r() * 1000, 3, 3); } c.restore(); circle(c, 300, 300, 46, '#f2eed8', { stroke: null }); glow(c, 300, 300, 160, '#f2eed8', 0.4); }
    for (let i = 0; i < 3; i++) { const x = ((i * 420 + t * 14) % 1500) - 200; ellipse(c, x, 260 + i * 120, 180, 16, '#ffffff', { stroke: null, alpha: 0.18 * (1 - noite) }); }
  });
  const mesa = mix(mix('#c8703a', '#8a3424', tarde), '#1a1428', noite), mesa2 = mix(mix('#a85a30', '#6a2a20', tarde), '#120e1e', noite);
  st.camada(0.25, c => {
    shape(c, c => { c.moveTo(-600, 1460); c.lineTo(-500, 1260); c.lineTo(-180, 1240); c.lineTo(-120, 1300); c.lineTo(80, 1300); c.lineTo(140, 1460); c.closePath(); }, mesa, { lw: 5 });
    shape(c, c => { c.moveTo(520, 1460); c.lineTo(640, 1180); c.lineTo(980, 1170); c.lineTo(1040, 1250); c.lineTo(1240, 1250); c.lineTo(1340, 1460); c.closePath(); }, mesa, { lw: 5 });
    for (const [x, y] of [[-420, 1300], [700, 1220]]) line(c, [[x, y], [x + 200, y + 10]], mesa2, 6, 0.8);
  });
  st.camada(0.55, c => {
    const casa = mix(mix('#e8c08a', '#c88a5a', tarde), '#2a2236', noite), jan = noite > 0.5 ? '#ffd890' : mix('#5a3a2a', '#3a2420', tarde);
    for (const [x, w, h] of [[-300, 220, 120], [-40, 180, 100], [820, 240, 130], [1120, 180, 110]]) { rrect(c, x, 1470 - h, w, h, 6, casa, { lw: 5 }); for (let k = 0; k < 2; k++) rrect(c, x + 30 + k * (w - 90), 1470 - h + 30, 30, 34, 3, jan, { lw: 3 }); for (let k = 0; k < 4; k++) circle(c, x + 20 + k * (w - 40) / 3, 1470 - h + 14, 6, mix('#8a5a3a', '#1a1420', noite), { stroke: null }); }
    cacto(c, 240, 1470, 0.6, mix('#4a7a3a', '#141a1e', noite)); cacto(c, 1300, 1470, 0.7, mix('#4a7a3a', '#141a1e', noite));
    // poste e fios
    rrect(c, 640, 1100, 14, 370, 3, mix('#6a4a2a', '#141018', noite), { stroke: null }); line(c, [[600, 1120], [700, 1120]], mix('#6a4a2a', '#141018', noite), 6); shape(c, c => { c.moveTo(-400, 1130); c.quadraticCurveTo(120, 1200, 640, 1124); c.quadraticCurveTo(1100, 1200, 1600, 1130); }, null, { stroke: mix('#3a2a1a', '#0a080e', noite), lw: 3 });
  });
  st.camada(1, c => {
    vgrad(c, -1500, 1460, 4100, 900, [[0, mix(mix('#e0a868', '#b8683a', tarde), '#2a2030', noite)], [1, mix(mix('#c08048', '#8a4a2a', tarde), '#18121e', noite)]]);
    if (estrada) { shape(c, c => { c.moveTo(380, 1462); c.lineTo(700, 1462); c.lineTo(1500, 2400); c.lineTo(-400, 2400); c.closePath(); }, mix(mix('#5a4a44', '#4a3434', tarde), '#16121a', noite), { stroke: null }); for (let i = 0; i < 6; i++) { const k = ((i / 6) + t * 0.05) % 1, y = 1470 + k * k * 900; rrect(c, 540 - 4 - k * 14, y, 8 + k * 28, 12 + k * 50, 2, '#e8c040', { stroke: null, alpha: 1 - noite * 0.5 }); } }
    const r = rng(12); for (let i = 0; i < 14; i++) { const x = -500 + r() * 2100, y = 1500 + r() * 500; if (x > 300 && x < 800) continue; ellipse(c, x, y, 14 + r() * 20, 8 + r() * 8, mix('#a86a3a', '#100c14', noite), { lw: 3 }); }
    for (const x of [-260, 1320]) cacto(c, x, 1720, 1.1, mix('#5a8a3a', '#141a1e', noite));
  });
}
// calor tremendo no ar (sobre tudo)
export function calor(c, t, a = 1) { c.save(); c.globalAlpha = 0.08 * a; c.strokeStyle = '#ffffff'; c.lineWidth = 3; for (let i = 0; i < 8; i++) { const y = 1300 + i * 30; c.beginPath(); for (let x = 0; x <= W; x += 40) c.lineTo(x, y + Math.sin(x * 0.02 + t * 6 + i) * 6); c.stroke(); } c.restore(); }
