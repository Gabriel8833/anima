// Cenários: quarto, cidade (normal e em pânico), cogumelo nuclear, onda de choque, metrô, ruínas,
// escotilha do abrigo, acampamento de sobreviventes, rua abandonada e colina com o abrigo misterioso.
import { TAU, lerp, clamp, sstep, easeOut, rng, mix, rgba } from '../motor/base.js';
import { OUT, shape, circle, ellipse, poly, rrect, line, glow, rays, sparkle, cloud, vgrad, star5 } from '../motor/desenho.js';

const W = 1080, H = 1920;

// ---------- peças ----------
export function carro(c, x, y, s, { cor = '#3a7ad0', ferrugem = 0, ang = 0, t = 0, rodando = 0, quebrado = false } = {}) {
  c.save(); c.translate(x, y); c.rotate(ang); c.scale(s, s);
  const corF = mix(cor, '#8a5a3a', ferrugem);
  shape(c, c => { c.moveTo(-170, -30); c.lineTo(-170, -90); c.quadraticCurveTo(-160, -110, -120, -112); c.lineTo(-80, -112); c.lineTo(-40, -170); c.lineTo(70, -170); c.lineTo(120, -112); c.lineTo(160, -106); c.quadraticCurveTo(180, -100, 180, -70); c.lineTo(180, -30); c.closePath(); }, corF);
  for (const [x0, x1] of [[-60, 0], [10, 70]]) shape(c, c => { c.moveTo(x0, -116); c.lineTo(x0 + (x0 < 0 ? 26 : 0), -158); c.lineTo(x1 - (x1 > 50 ? 26 : 0), -158); c.lineTo(x1, -116); c.closePath(); }, quebrado ? '#3a3a3a' : '#bfe6f6', { lw: 5 });
  if (quebrado) { line(c, [[-40, -150], [-20, -130], [-34, -120]], '#8a8a8a', 3); }
  rrect(c, 150, -96, 26, 18, 4, '#ffe08a', { lw: 3 }); rrect(c, -172, -96, 16, 18, 4, '#e04a2a', { lw: 3 });
  if (ferrugem > 0) { c.save(); c.globalAlpha = ferrugem * 0.7; c.fillStyle = '#7a3e1a'; for (const [px, py, r] of [[-120, -60, 20], [40, -50, 26], [120, -80, 14], [-30, -140, 10]]) { c.beginPath(); c.arc(px, py, r, 0, TAU); c.fill(); } c.restore(); }
  for (const wx of [-100, 110]) { c.save(); c.translate(wx, -30); c.rotate(rodando); circle(c, 0, 0, 34, '#2a2a2a', { lw: 5 }); circle(c, 0, 0, 14, quebrado ? '#6a4a3a' : '#b8b8b8', { lw: 3 }); line(c, [[-12, 0], [12, 0]], '#5a5a5a', 3); c.restore(); }
  c.restore();
}
function predio(c, x, base, w, h, { cor = '#9aa8b8', janela = '#cfe8f6', destruido = 0, seed = 1, luzes = 0 } = {}) {
  const r = rng(seed);
  if (!destruido) {
    rrect(c, x - w / 2, base - h, w, h, 4, cor, { lw: 5 });
    for (let yy = base - h + 30; yy < base - 60; yy += 60) for (let xx = x - w / 2 + 20; xx < x + w / 2 - 30; xx += 46) rrect(c, xx, yy, 28, 36, 3, r() < luzes ? '#ffe08a' : janela, { lw: 3 });
    return;
  }
  // prédio destruído: topo quebrado, vigas expostas, janelas escuras
  const top = []; let xx = x - w / 2; while (xx < x + w / 2) { top.push([xx, base - h * (0.55 + r() * 0.45)]); xx += 30 + r() * 40; } top.push([x + w / 2, base - h * (0.5 + r() * 0.4)]);
  poly(c, [[x - w / 2, base], ...top, [x + w / 2, base]], cor);
  for (let k = 0; k < 3; k++) { const p = top[Math.floor(r() * top.length)]; line(c, [[p[0], p[1]], [p[0] + (r() - 0.5) * 60, p[1] - 40 - r() * 40]], '#5a4030', 5); }
  const minY = Math.min(...top.map(p => p[1]));
  for (let yy = minY + 40; yy < base - 60; yy += 60) for (let xw = x - w / 2 + 20; xw < x + w / 2 - 30; xw += 46) if (r() < 0.8) rrect(c, xw, yy, 28, 36, 3, r() < luzes ? '#ffb040' : '#2a2420', { lw: 3 });
}
export function radiacao(c, x, y, r, a = 1) { c.save(); c.globalAlpha *= a; circle(c, x, y, r, '#f2d030', { lw: 6 }); for (let i = 0; i < 3; i++) { const a0 = -Math.PI / 2 + i * TAU / 3 - 0.5; shape(c, cc => { cc.moveTo(x + Math.cos(a0) * r * 0.2, y + Math.sin(a0) * r * 0.2); cc.arc(x, y, r * 0.8, a0, a0 + 1.0); cc.lineTo(x + Math.cos(a0 + 1) * r * 0.2, y + Math.sin(a0 + 1) * r * 0.2); cc.closePath(); }, '#1a1a1a', { stroke: null }); } circle(c, x, y, r * 0.14, '#1a1a1a', { stroke: null }); c.restore(); }

// ---------- 1a. Quarto / cozinha ----------
export function quarto(st, t) {
  st.camada(0.9, c => {
    vgrad(c, -400, -200, 1900, 2400, [[0, '#f2e2c8'], [1, '#e8d0a8']]);
    // janela com a cidade
    rrect(c, 560, 520, 380, 440, 12, '#9fd8f6', { lw: 10 });
    c.save(); c.beginPath(); c.rect(565, 525, 370, 430); c.clip();
    for (let i = 0; i < 6; i++) predio(c, 590 + i * 70, 960, 64, 160 + (i * 53) % 180, { cor: '#b8c8d8', seed: i + 3 });
    c.restore();
    line(c, [[750, 520], [750, 960]], OUT, 8); line(c, [[560, 740], [940, 740]], OUT, 8);
    rays(c, 750, 600, -0.5, 4, 1000, 200, '#fff6d0', 0.2, t, 2);
    // quadro e planta
    rrect(c, 120, 600, 240, 180, 8, '#7ab0d0', { lw: 7 }); poly(c, [[140, 760], [230, 650], [300, 720], [340, 690], [340, 760]], '#5a9a6a', { stroke: null });
    rrect(c, 820, 1180, 90, 100, 14, '#c8704a', { lw: 5 }); for (const a of [-0.6, 0, 0.6]) shape(c, cc => cc.ellipse(865 + Math.sin(a) * 40, 1140 - Math.cos(a) * 30, 24, 60, a, 0, TAU), '#5aa06a', { lw: 4 });
  });
  st.camada(1, c => {
    vgrad(c, -400, 1480, 1900, 900, [[0, '#b88a5a'], [1, '#9a6a40']]);
    // balcão da cozinha com cafeteira
    rrect(c, -100, 1300, 520, 40, 8, '#d8d0c0', { lw: 6 }); rrect(c, -90, 1340, 500, 160, 6, '#a87a50', { lw: 6 });
    rrect(c, 60, 1200, 80, 100, 10, '#3a3a40', { lw: 5 }); ellipse(c, 100, 1290, 40, 8, '#6a3a1a', { lw: 3 });
    // cama
    rrect(c, 620, 1380, 420, 120, 16, '#5a7ab0', { lw: 6 }); rrect(c, 900, 1330, 120, 70, 20, '#ffffff', { lw: 5 }); rrect(c, 600, 1300, 30, 220, 8, '#8a5a30', { lw: 5 });
  });
}
// ---------- 1b. Cidade moderna (pânico 0..1 deixa o céu laranja e cobre de poeira) ----------
export function cidade(st, t, { panico = 0, cogumelo = 0, flash = 0 } = {}) {
  st.camada(0, c => {
    vgrad(c, 0, 0, W, H, [[0, mix('#5ab8f0', '#7a3a2a', panico)], [0.6, mix('#bfe6f6', '#e0702a', panico)], [1, mix('#f6f0e0', '#ffb04a', panico)]]);
  });
  st.camada(0.15, c => { for (let i = 0; i < 6; i++) cloud(c, ((i * 360 + t * 12) % 2000) - 500, 300 + (i % 3) * 120, 130, mix('#ffffff', '#c8784a', panico), { seed: i + 3, alpha: 1 - cogumelo * 0.7 }); });
  st.camada(0.1, c => { if (cogumelo > 0) cogumeloNuclear(c, 540, 1280, 0.85, cogumelo, t); glow(c, 540, 1250, 900, '#ffffff', flash); });
  st.camada(0.4, c => { for (let i = 0; i < 12; i++) predio(c, -500 + i * 190, 1380, 160, 360 + (i * 97) % 420, { cor: mix('#a8b8cc', '#8a6a5a', panico), janela: mix('#d8ecf8', '#5a4030', panico), seed: i + 10 }); });
  st.camada(0.7, c => { for (let i = 0; i < 9; i++) predio(c, -600 + i * 260, 1460, 220, 300 + (i * 61) % 260, { cor: mix(['#c8a888', '#9ab0a0', '#b8a0b0'][i % 3], '#7a5a4a', panico), janela: mix('#e8f4f8', '#4a3020', panico), seed: i + 30 }); });
  st.camada(1, c => {
    rrect(c, -1500, 1460, 4100, 70, 0, mix('#c8c8c8', '#8a7a6a', panico), { stroke: null }); // calçada
    rrect(c, -1500, 1530, 4100, 900, 0, mix('#5a5a62', '#4a3a34', panico), { stroke: null }); // rua
    for (let i = -10; i < 20; i++) rrect(c, i * 220, 1700, 120, 16, 4, mix('#f2f2f2', '#b8a080', panico), { stroke: null });
    for (const x of [-400, 400, 1200]) { rrect(c, x, 1180, 16, 290, 4, '#4a4a50', { lw: 4 }); rrect(c, x - 18, 1150, 52, 110, 10, '#2a2a30', { lw: 4 }); for (let k = 0; k < 3; k++) circle(c, x + 8, 1172 + k * 34, 12, ['#e04a2a', '#f2c230', '#4ac06a'][k], { lw: 3 }); }
    for (const x of [-120, 760]) { rrect(c, x - 10, 1340, 20, 130, 4, '#7a5a3a', { lw: 4 }); circle(c, x, 1300, 80, mix('#5aa06a', '#6a5a3a', panico)); }
  });
  if (panico > 0) st.camada(0, c => { c.save(); c.globalAlpha = panico * 0.3; c.fillStyle = '#ff8a3a'; c.fillRect(0, 0, W, H); c.restore(); });
}
// cogumelo nuclear animado (k 0..1 = crescimento)
export function cogumeloNuclear(c, x, base, s, k, t) {
  if (k <= 0) return;
  const h = 900 * s * easeOut(clamp(k)), capR = 330 * s * (0.3 + 0.7 * easeOut(clamp(k)));
  glow(c, x, base - h * 0.5, 900 * s * k, '#ffb040', 0.5);
  // coluna
  for (let i = 0; i < 9; i++) { const u = i / 8, yy = base - u * h, r = lerp(160, 80, u) * s * (0.6 + 0.4 * k); cloud(c, x + Math.sin(t * 2 + i) * 10, yy, r, mix('#ff9a3a', '#8a5a4a', u * 0.5 + 0.3), { seed: i + 1 }); }
  // chapéu girando
  for (let i = 0; i < 10; i++) { const an = i / 10 * TAU + t * 0.5, rx = Math.cos(an) * capR * 0.9, ry = Math.sin(an) * capR * 0.28; cloud(c, x + rx, base - h + ry, capR * 0.42, mix('#ffcf6a', '#a0604a', 0.4 + 0.4 * Math.sin(an)), { seed: i + 20 }); }
  cloud(c, x, base - h - capR * 0.2, capR * 0.6, '#ffe8a0', { seed: 33 });
  glow(c, x, base - h, capR * 1.4, '#fff0b0', 0.6);
  // anel de condensação
  c.save(); c.globalAlpha = 0.5 * k; c.strokeStyle = '#f2e6d8'; c.lineWidth = 16; c.beginPath(); c.ellipse(x, base - h * 0.55, capR * 1.3, capR * 0.18, 0, 0, TAU); c.stroke(); c.restore();
}
// parede de poeira da onda de choque (avança para a direita a partir de x)
export function ondaChoque(c, x, t) {
  c.save();
  glow(c, x + 100, 1100, 700, '#ffb060', 0.5);
  for (let i = 0; i < 16; i++) { const yy = 400 + i * 90, wob = Math.sin(t * 8 + i * 1.3) * 40; cloud(c, x + wob - (i % 2) * 80, yy, 220, i % 3 ? '#a8805a' : '#c89a6a', { stroke: OUT, seed: i + 60 }); }
  c.fillStyle = '#8a6040'; c.fillRect(x - 3000, 300, 3000 - 60, 1800);
  c.restore();
}
// entrada do metrô (escada para baixo)
export function entradaMetro(c, x, base) {
  rrect(c, x - 150, base - 280, 300, 40, 8, '#3a4a6a', { lw: 6 });
  c.font = '900 40px Inter, sans-serif'; c.textAlign = 'center'; c.fillStyle = '#ffffff'; c.fillText('METRÔ', x, base - 248);
  for (const s of [-1, 1]) rrect(c, x + s * 130 - 10, base - 240, 20, 240, 4, '#6a6a72', { lw: 5 });
  shape(c, cc => cc.rect(x - 120, base - 30, 240, 200), '#1a1a1e');
  for (let i = 0; i < 5; i++) line(c, [[x - 120, base - 20 + i * 36], [x + 120, base - 20 + i * 36]], '#3a3a40', 6);
}
// ---------- 3b. Escada escura do abrigo ----------
export function abrigoEscuro(st, t, luz = 1) {
  st.camada(1, c => {
    vgrad(c, -400, -200, 1900, 2400, [[0, '#1a1a1e'], [1, '#2a2620']]);
    for (let y = 0; y < 1600; y += 80) for (let x = -400 + ((y / 80) % 2) * 70; x < 1500; x += 140) rrect(c, x, y, 132, 72, 4, '#2e2a26', { stroke: '#1e1a16', lw: 3 });
    for (let i = 0; i < 8; i++) rrect(c, -200 + i * 40, 1500 - i * 90, 1400, 90, 0, '#3a342e', { stroke: '#22201c', lw: 4 });
    const f = luz * (Math.sin(t * 37) > -0.6 ? 1 : 0.2);
    rrect(c, 500, 300, 80, 30, 6, f > 0.5 ? '#ffe08a' : '#4a4030', { lw: 4 }); glow(c, 540, 330, 500, '#ffd080', f * 0.5);
  });
}
// ---------- 4. Ruínas (pós-guerra) ----------
export function ruinas(st, t, { noite = 0 } = {}) {
  st.camada(0, c => { vgrad(c, 0, 0, W, H, [[0, mix('#4a2a1e', '#1a0e0e', noite)], [0.55, mix('#b0582a', '#5a2a1a', noite)], [1, mix('#e0a050', '#7a4a2a', noite)]]); glow(c, 300, 900, 500, '#ffb050', 0.35 * (1 - noite)); });
  st.camada(0.15, c => { for (let i = 0; i < 7; i++) cloud(c, ((i * 330 + t * 18) % 2000) - 500, 260 + (i % 3) * 120, 160, mix('#6a3a2a', '#2a1814', noite), { seed: i + 70 }); });
  st.camada(0.4, c => { for (let i = 0; i < 12; i++) predio(c, -500 + i * 190, 1380, 160, 380 + (i * 97) % 420, { cor: mix('#6a4a3a', '#3a2a24', noite), destruido: 1, seed: i + 80, luzes: noite * 0.05 }); });
  st.camada(0.7, c => { for (let i = 0; i < 9; i++) predio(c, -600 + i * 260, 1460, 220, 320 + (i * 61) % 260, { cor: mix(['#8a6a4a', '#7a6a5a', '#8a5a4a'][i % 3], '#4a3a30', noite), destruido: 1, seed: i + 90 }); });
  st.camada(1, c => {
    rrect(c, -1500, 1460, 4100, 900, 0, mix('#7a6050', '#3a2a24', noite), { stroke: null });
    const r = rng(5); for (let i = 0; i < 30; i++) { const x = -1200 + r() * 3600, y = 1500 + r() * 400; poly(c, [[x, y], [x + 30 + r() * 40, y - 20 - r() * 30], [x + 70 + r() * 40, y]], mix('#8a7a6a', '#4a3a34', noite), { lw: 4 }); }
    for (let i = 0; i < 8; i++) line(c, [[-1000 + i * 420, 1530], [-940 + i * 420, 1600], [-990 + i * 420, 1680]], '#3a2a20', 5);
  });
}
export function cinzas(c, t, a = 1, n = 60) { const r = rng(4); for (let i = 0; i < n; i++) { const x0 = r() * 1200 - 60, sp = 40 + r() * 60, y = ((r() * 2000 + t * sp) % 2000) - 40, x = x0 + Math.sin(t + i) * 30; c.save(); c.globalAlpha = a * (0.4 + r() * 0.5); c.fillStyle = '#d8ccc0'; c.beginPath(); c.arc(x, y, 3 + r() * 4, 0, TAU); c.fill(); c.restore(); } }
// escotilha redonda do abrigo no chão (abre 0..1)
export function escotilha(c, x, y, k) {
  ellipse(c, x, y, 150, 44, '#3a3430'); ellipse(c, x, y - 6, 130, 34, '#120e0c', { lw: 4 });
  c.save(); c.translate(x - 130, y - 6); c.scale(1, lerp(1, -1.6, easeOut(k)));
  ellipse(c, 130, 0, 130, 34, '#8a8a80', { lw: 6 }); ellipse(c, 130, 0, 60, 16, '#6a6a60', { lw: 4 }); line(c, [[100, 0], [160, 0]], '#4a4a44', 6);
  c.restore();
}
// ---------- 5. Acampamento de sobreviventes ----------
export function acampamento(st, t) {
  ruinas(st, t, { noite: 0.35 });
  st.camada(0.85, c => {
    // barracos de metal enferrujado
    for (const [x, w, h, cor] of [[-150, 340, 300, '#9a5a2a'], [280, 300, 260, '#7a6a5a'], [800, 360, 320, '#8a4a2a'], [1200, 300, 260, '#6a5a4a']]) {
      rrect(c, x - w / 2, 1480 - h, w, h, 4, cor, { lw: 6 });
      for (let k = 1; k < 5; k++) line(c, [[x - w / 2 + k * w / 5, 1480 - h], [x - w / 2 + k * w / 5, 1480]], mix(cor, '#000000', 0.25), 4);
      poly(c, [[x - w / 2 - 20, 1480 - h], [x, 1480 - h - 60], [x + w / 2 + 20, 1480 - h]], mix(cor, '#5a5a5a', 0.4), { lw: 5 });
      rrect(c, x - 30, 1480 - 140, 60, 140, 4, '#2a1e16', { lw: 4 });
    }
    // varal de luzes
    for (let i = 0; i < 18; i++) { const x = -300 + i * 90, y = 1080 + Math.sin(i * 0.9) * 30; circle(c, x, y, 10, '#ffd060', { lw: 3 }); glow(c, x, y, 40, '#ffb040', 0.6 + 0.2 * Math.sin(t * 3 + i)); }
    line(c, Array.from({ length: 18 }, (_, i) => [-300 + i * 90, 1072 + Math.sin(i * 0.9) * 30]), '#2a2a2a', 3);
    // caixa d'água
    rrect(c, 520, 1000, 160, 180, 14, '#6a7a8a', { lw: 6 }); for (const xx of [530, 670]) rrect(c, xx - 8, 1180, 16, 300, 4, '#4a4a4a', { lw: 4 }); radiacao(c, 600, 1080, 34, 0);
  });
}
export function fogueira(c, x, y, s, t) {
  c.save(); c.translate(x, y); c.scale(s, s);
  rrect(c, -60, -60, 120, 80, 10, '#6a6a6a', { lw: 5 });
  for (let i = 0; i < 3; i++) { const f = Math.sin(t * 12 + i) * 8; shape(c, cc => { cc.moveTo(-30 + i * 30 - 20, -60); cc.quadraticCurveTo(-30 + i * 30 - 30, -120, -30 + i * 30, -170 + f); cc.quadraticCurveTo(-30 + i * 30 + 30, -120, -30 + i * 30 + 20, -60); cc.closePath(); }, i % 2 ? '#ffc040' : '#ff6a20', { lw: 4 }); }
  glow(c, 0, -100, 260, '#ff9a40', 0.7);
  c.restore();
}
// mural com o mapa de zonas perigosas
export function mapaZonas(c, x, y, t, a = 1) {
  c.save(); c.globalAlpha *= a;
  rrect(c, x - 200, y - 150, 400, 300, 10, '#d8c8a0', { lw: 7 });
  line(c, [[x - 160, y - 40], [x - 40, y + 20], [x + 80, y - 60], [x + 170, y + 10]], '#6a8aa0', 6);
  line(c, [[x - 120, y + 100], [x - 20, y + 40], [x + 120, y + 100]], '#8a6a4a', 5);
  for (const [dx, dy] of [[-90, -80], [100, 60], [40, -100]]) { circle(c, x + dx, y + dy, 34, rgba('#e02a2a', 0.35), { stroke: '#e02a2a', lw: 4 }); radiacao(c, x + dx, y + dy, 18); }
  star5(c, x - 30, y + 30, 18, '#4ac06a', { lw: 3 });
  c.restore();
}
// ---------- 6. Rua abandonada ao entardecer ----------
export function ruaAbandonada(st, t, poste = 1) {
  ruinas(st, t, { noite: 0.75 });
  st.camada(1, c => {
    const lig = poste * (Math.sin(t * 23) > -0.3 && Math.sin(t * 7) > -0.8 ? 1 : 0.1);
    rrect(c, 120, 1040, 18, 430, 4, '#4a4440', { lw: 5 }); line(c, [[129, 1040], [220, 1020]], '#4a4440', 10); rrect(c, 200, 1010, 60, 24, 8, lig > 0.5 ? '#ffe08a' : '#4a4030', { lw: 4 });
    if (lig > 0.5) { c.save(); c.globalCompositeOperation = 'lighter'; const g = c.createLinearGradient(0, 1030, 0, 1500); g.addColorStop(0, 'rgba(255,220,140,0.35)'); g.addColorStop(1, 'rgba(255,220,140,0)'); c.fillStyle = g; c.beginPath(); c.moveTo(210, 1030); c.lineTo(250, 1030); c.lineTo(400, 1500); c.lineTo(60, 1500); c.closePath(); c.fill(); c.restore(); }
  });
}
// ---------- 7. Colina à noite com o abrigo misterioso ----------
export function colina(st, t, { sinal = 0, porta = 0 } = {}) {
  st.camada(0, c => { vgrad(c, 0, 0, W, H, [[0, '#120a12'], [0.5, '#3a1a1a'], [0.8, '#7a3a1e'], [1, '#a0582a']]); const r = rng(9); for (let i = 0; i < 70; i++) { c.globalAlpha = 0.4 + 0.5 * Math.abs(Math.sin(t + i)); c.fillStyle = '#fff'; c.fillRect(r() * W, r() * 800, 2, 2); } c.globalAlpha = 1; });
  st.camada(0.3, c => {
    // montanha ao longe com a porta do abrigo
    shape(c, cc => { cc.moveTo(400, 1300); cc.quadraticCurveTo(700, 820, 1000, 900); cc.quadraticCurveTo(1300, 980, 1500, 1300); cc.closePath(); }, '#2a1a1a', { stroke: null });
    const px = 900, py = 1040;
    circle(c, px, py, 70, '#3a3434', { lw: 6 });
    if (porta > 0) { c.save(); c.beginPath(); c.arc(px, py, 64, 0, TAU); c.clip(); c.fillStyle = '#fff2c0'; c.fillRect(px - 64, py - 64, 128 * porta, 128); c.restore(); glow(c, px, py, 300 * porta, '#ffe8a0', porta); }
    for (let i = 0; i < 8; i++) { const an = i / 8 * TAU; circle(c, px + Math.cos(an) * 56, py + Math.sin(an) * 56, 7, '#5a5050', { lw: 3 }); }
    const pisca = sinal * (Math.sin(t * 5) > 0 ? 1 : 0.25);
    glow(c, px, py - 110, 180, '#5af0c0', pisca); circle(c, px, py - 110, 14, pisca > 0.5 ? '#bfffe8' : '#3a6a5a', { lw: 4 });
    if (sinal > 0) { c.save(); c.globalCompositeOperation = 'lighter'; const g = c.createLinearGradient(0, py - 110, 0, -400); g.addColorStop(0, `rgba(120,255,200,${0.35 * sinal})`); g.addColorStop(1, 'rgba(120,255,200,0)'); c.fillStyle = g; c.beginPath(); c.moveTo(px - 20, py - 110); c.lineTo(px + 20, py - 110); c.lineTo(px + 120, -400); c.lineTo(px - 120, -400); c.closePath(); c.fill(); c.restore(); }
  });
  st.camada(0.5, c => { for (let i = 0; i < 14; i++) predio(c, -500 + i * 150, 1460, 130, 260 + (i * 71) % 320, { cor: '#2a1a16', destruido: 1, seed: i + 120, luzes: 0.04 }); });
  st.camada(1, c => { shape(c, cc => { cc.moveTo(-600, 1560); cc.quadraticCurveTo(300, 1440, 900, 1520); cc.quadraticCurveTo(1300, 1580, 1700, 1700); cc.lineTo(1700, 2600); cc.lineTo(-600, 2600); cc.closePath(); }, '#3a2620'); for (let i = 0; i < 10; i++) line(c, [[-200 + i * 140, 1580], [-210 + i * 140, 1540]], '#4a3a24', 5); });
}
