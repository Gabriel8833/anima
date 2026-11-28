// Cenários de "Saudade": quarto com janela, almoço de domingo, quadra, caixa de lembranças, fotos e o álbum da memória.
import { TAU, lerp, clamp, sstep, rng, mix, easeOut, easeBack } from '../motor/base.js';
import { OUT, shape, circle, ellipse, poly, rrect, line, glow, cloud, vgrad, sparkle, limb } from '../motor/desenho.js';
import { arvore as arvoreR, bicicleta } from './rua.js';
export { bicicleta };
export { RUA, CASA, bairro, ruaFrente, ruaChao, casaFrente, arvore, poeira, bolaDesenho, quartoInfancia } from './rua.js';

// parede do quarto com janela grande (o exterior é desenhado por fora() dentro do recorte)
export function paredeJanela(c, t, fora, { quente = 1 } = {}) {
  const wx = 140, wy = 520, ww = 800, wh = 760;
  c.save(); c.beginPath(); c.rect(wx, wy, ww, wh); c.clip(); fora(c); c.restore();
  // parede ao redor (por cima)
  c.save(); c.beginPath(); c.rect(-1200, -600, 3500, 3200); c.rect(wx, wy, ww, wh); c.clip('evenodd');
  vgrad(c, -1200, -600, 3500, 3200, [[0, mix('#5a6a86', '#e8b878', quente)], [1, mix('#3a4660', '#c8915a', quente)]]);
  c.restore();
  rrect(c, wx - 20, wy - 20, ww + 40, wh + 40, 8, null, { stroke: mix('#2a3448', '#8a5a3a', quente), lw: 26 });
  line(c, [[wx + ww / 2, wy], [wx + ww / 2, wy + wh]], mix('#2a3448', '#8a5a3a', quente), 14);
  rrect(c, wx - 60, wy + wh + 10, ww + 120, 50, 8, mix('#8a96aa', '#f2e2c4', quente), { lw: 6 });
  // cortinas
  for (const s of [-1, 1]) { const cx = s < 0 ? wx - 40 : wx + ww + 40, v = Math.sin(t * 1.1 + s) * 12; shape(c, c => { c.moveTo(cx - 70, wy - 60); c.lineTo(cx + 70, wy - 60); c.quadraticCurveTo(cx + 50 + v, wy + wh * 0.6, cx + 80 + v, wy + wh + 120); c.lineTo(cx - 80 + v, wy + wh + 120); c.quadraticCurveTo(cx - 50, wy + wh * 0.6, cx - 70, wy - 60); c.closePath(); }, mix('#4a5a7a', '#e2775c', quente), { lw: 6 }); }
  if (quente > 0.3) { c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha = 0.18 * quente; c.fillStyle = '#ffd080'; c.beginPath(); c.moveTo(wx, wy); c.lineTo(wx + ww, wy); c.lineTo(wx + ww + 500, 2200); c.lineTo(wx - 300, 2200); c.closePath(); c.fill(); c.restore(); }
}
export function ceuDourado(c, x, y, w, h, t, sol = 1) {
  vgrad(c, x, y, w, h, [[0, mix('#4a5a8a', '#ffb070', sol)], [0.6, mix('#8a8aa8', '#ffd8a0', sol)], [1, mix('#b8b0c0', '#fff0c8', sol)]]);
  glow(c, x + w * 0.7, y + h * 0.55, 400, '#ffcf80', 0.6 * sol); circle(c, x + w * 0.7, y + h * 0.55, 60, '#fff2c8', { stroke: null, alpha: sol });
  for (let i = 0; i < 4; i++) cloud(c, x + ((t * 12 + i * 260) % (w + 300)) - 150, y + 120 + i * 90, 60 + i * 10, 'rgba(255,240,220,0.7)', { seed: i + 2 });
}
// mesa do almoço de domingo
export function mesaDomingo(c, x, y, t) {
  shape(c, c => { c.moveTo(x - 440, y); c.lineTo(x + 440, y); c.lineTo(x + 470, y + 170); c.quadraticCurveTo(x, y + 200, x - 470, y + 170); c.closePath(); }, '#f2f2e6', { lw: 6 });
  for (let k = -4; k <= 4; k++) line(c, [[x + k * 100, y], [x + k * 108, y + 180]], '#e2575c', 5, 0.5);
  for (let k = -4; k <= 4; k++) line(c, [[x - 450, y + 30 + 0 * k], [x + 450, y + 30]], '#e2575c', 0, 0);
  ellipse(c, x, y - 4, 120, 26, '#f6f2ea', { lw: 5 }); shape(c, c => { c.moveTo(x - 90, y - 6); c.quadraticCurveTo(x, y - 90, x + 90, y - 6); c.closePath(); }, '#c86a2a', { lw: 5 });
  for (const dx of [-260, 260]) { ellipse(c, x + dx, y - 4, 80, 20, '#f6f2ea', { lw: 4 }); shape(c, c => { c.moveTo(x + dx - 60, y - 6); c.quadraticCurveTo(x + dx, y - 50, x + dx + 60, y - 6); c.closePath(); }, dx < 0 ? '#f6f2e6' : '#7a3a1a', { lw: 4 }); }
  for (const dx of [-370, -130, 130, 370]) { rrect(c, x + dx - 14, y - 70, 28, 64, 4, 'rgba(255,190,90,0.7)', { lw: 3 }); }
  for (let i = 0; i < 3; i++) { const u = (t * 0.4 + i / 3) % 1; c.save(); c.globalAlpha = (1 - u) * 0.5; line(c, [[x - 20 + i * 20, y - 100 - u * 80], [x - 14 + i * 20 + Math.sin(t * 2 + i) * 8, y - 130 - u * 80]], '#ffffff', 6); c.restore(); }
}
// quadra antiga, vazia
export function quadra(st, t, { frio = 1 } = {}) {
  st.mundo(c => {
    vgrad(c, -1200, -400, 3500, 1900, [[0, mix('#ffb070', '#7a8aa8', frio)], [1, mix('#ffe0b0', '#b8c0cc', frio)]]);
    for (let i = 0; i < 3; i++) cloud(c, ((t * 8 + i * 500) % 2400) - 600, 300 + i * 120, 90, 'rgba(255,255,255,0.4)', { seed: i });
    rrect(c, -1200, 900, 3500, 620, 0, mix('#e8c8a0', '#9aa0aa', frio), { lw: 6 });
    for (let x = -1200; x < 2300; x += 200) line(c, [[x, 900], [x, 1520]], 'rgba(0,0,0,0.1)', 4);
    c.save(); c.globalAlpha = 0.5; c.font = '900 90px Inter, sans-serif'; c.fillStyle = mix('#e2473a', '#7a6a7a', frio); c.fillText('★', 120, 1200); circle(c, 760, 1160, 50, null, { stroke: mix('#2c78dc', '#6a7a8a', frio), lw: 12 }); c.restore();
    vgrad(c, -1200, 1520, 3500, 1100, [[0, mix('#c89a6a', '#7a828c', frio)], [1, mix('#a8784a', '#5a6068', frio)]]);
    c.save(); c.globalAlpha = 0.45; line(c, [[-1200, 1640], [2300, 1640]], '#f2f2f2', 8); circle(c, 540, 1900, 200, null, { stroke: '#f2f2f2', lw: 8 }); c.restore();
    for (let i = 0; i < 8; i++) { const r = rng(i); line(c, [[-600 + r() * 2200, 1600 + r() * 600], [-560 + r() * 2200, 1620 + r() * 600]], 'rgba(0,0,0,0.25)', 3); }
    // trave enferrujada
    line(c, [[880, 1720], [880, 1400], [1240, 1400], [1240, 1720]], mix('#f2f2f2', '#a8a8a8', frio), 14);
    c.save(); c.globalAlpha = 0.3; for (let k = 0; k < 6; k++) line(c, [[900 + k * 56, 1410], [900 + k * 56, 1710]], '#ffffff', 2); c.restore();
    // alambrado
    c.save(); c.globalAlpha = 0.35; c.strokeStyle = '#2a2a30'; c.lineWidth = 3; for (let x = -1200; x < 2300; x += 50) { c.beginPath(); c.moveTo(x, 600); c.lineTo(x + 300, 900); c.moveTo(x + 300, 600); c.lineTo(x, 900); c.stroke(); } c.restore();
    for (let x = -1200; x < 2300; x += 400) rrect(c, x, 560, 16, 360, 4, '#4a4a52', { stroke: null });
  });
}
export function bolaVelha(c, x, y, r = 30) { circle(c, x, y, r, '#d8d0c0', { lw: 4 }); for (let k = 0; k < 5; k++) { const a = k / 5 * TAU; circle(c, x + Math.cos(a) * r * 0.55, y + Math.sin(a) * r * 0.55, r * 0.2, '#5a5a5a', { stroke: null }); } ellipse(c, x - 6, y + r * 0.6, r * 0.5, r * 0.18, 'rgba(0,0,0,0.15)', { stroke: null }); }
// polaroid com as quatro crianças (vivo = 0..1: a foto ganha movimento)
export function foto(c, x, y, s, t, { rot = 0, vivo = 0, brilho = 0, sepia = 0.4 } = {}) {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  if (brilho > 0) glow(c, 0, 0, 260, '#ffe8a0', brilho);
  rrect(c, -150, -170, 300, 340, 6, '#f6f0e2', { lw: 5 });
  c.save(); c.beginPath(); c.rect(-128, -148, 256, 240); c.clip();
  vgrad(c, -128, -148, 256, 240, [[0, '#ffc888'], [1, '#ffe8c0']]);
  rrect(c, -128, 30, 256, 70, 0, '#c8a070', { stroke: null });
  const cores = ['#d8302a', '#f4d03a', '#5ab0e8', '#f07a2a'], peles = ['#e6b48e', '#8a5a3c', '#f2cdb0', '#d8a07a'];
  for (let i = 0; i < 4; i++) { const px = -84 + i * 56, pj = vivo * Math.abs(Math.sin(t * 6 + i)) * 14; rrect(c, px - 18, 0 - pj, 36, 46, 10, cores[i], { lw: 3 }); circle(c, px, -24 - pj, 20, peles[i], { lw: 3 }); shape(c, c => c.arc(px, -22 - pj, 9, 0.2, Math.PI - 0.2), null, { lw: 2.5 }); for (const sd of [-1, 1]) circle(c, px + sd * 7, -28 - pj, 2.5, '#2b1f2a', { stroke: null }); if (i % 2) line(c, [[px + 18, 10 - pj], [px + 34, -14 - pj + vivo * Math.sin(t * 8) * 8]], peles[i], 7); }
  if (sepia > 0) { c.save(); c.globalCompositeOperation = 'multiply'; c.globalAlpha = sepia; c.fillStyle = '#c8a070'; c.fillRect(-128, -148, 256, 240); c.restore(); }
  c.restore();
  c.restore();
}
export function caixaLembrancas(c, x, y, abre = 0) {
  rrect(c, x - 170, y - 140, 340, 150, 8, '#b88a5a', { lw: 6 }); line(c, [[x - 170, y - 90], [x + 170, y - 90]], '#9a6a3a', 4);
  c.save(); c.translate(x - 170 + abre * 260, y - 140 - abre * 70); c.rotate(abre * 0.5); rrect(c, -6, -30, 352, 36, 6, '#c89a6a', { lw: 6 }); c.restore();
  if (abre > 0.5) { rrect(c, x - 140, y - 150, 80, 26, 4, '#f6f0e2', { lw: 3 }); rrect(c, x + 30, y - 154, 100, 20, 8, '#e2473a', { lw: 3 }); }
}
export const carrinho = (c, x, y, s = 1) => { c.save(); c.translate(x, y); c.scale(s, s); rrect(c, -50, -30, 100, 34, 10, '#2c78dc', { lw: 4 }); shape(c, c => { c.moveTo(-30, -30); c.lineTo(-16, -52); c.lineTo(20, -52); c.lineTo(34, -30); c.closePath(); }, '#2c78dc', { lw: 4 }); for (const s2 of [-1, 1]) circle(c, s2 * 30, 6, 12, '#2a2a30', { lw: 3 }); c.restore(); };
export const pulseira = (c, x, y, s = 1) => { c.save(); c.translate(x, y); c.scale(s, s); for (let k = 0; k < 12; k++) { const a = k / 12 * TAU; circle(c, Math.cos(a) * 34, Math.sin(a) * 18, 7, ['#e2473a', '#f4d03a', '#2c78dc', '#35a868'][k % 4], { lw: 2 }); } c.restore(); };

// ================== "Pais envelhecendo": casa da família ==================
// quintal com a frente da casa (porta), cerca, árvore e luz dourada
export function quintal(st, t, { sol = 1 } = {}) {
  st.mundo(c => {
    ceuDourado(c, -1200, -400, 3500, 1700, t, sol);
    rrect(c, 380, 640, 900, 860, 8, mix('#c8b8a8', '#f2d6a8', sol), { lw: 7 }); poly(c, [[340, 660], [830, 420], [1320, 660]], mix('#7a5a5a', '#c8543a', sol), { lw: 7 });
    rrect(c, 500, 1060, 200, 440, 6, '#8a5a3a', { lw: 6 }); circle(c, 670, 1290, 10, '#d8b040', { lw: 3 });
    rrect(c, 860, 900, 300, 240, 6, mix('#9ab0c8', '#fff2c8', sol), { lw: 7 }); line(c, [[1010, 900], [1010, 1140]], '#8a5a3a', 6);
    for (let x = -1200; x < 380; x += 70) { rrect(c, x, 1300, 40, 220, 6, '#f2efe6', { lw: 4 }); } rrect(c, -1200, 1360, 1580, 20, 4, '#f2efe6', { lw: 4 });
    vgrad(c, -1200, 1500, 3500, 1100, [[0, mix('#7a9a6a', '#8ac86a', sol)], [1, mix('#5a7a4a', '#6aa84a', sol)]]);
    for (let i = 0; i < 60; i++) { const r = rng(i); line(c, [[-1200 + r() * 3400, 1520 + r() * 900], [-1196 + r() * 3400, 1500 + r() * 900]], 'rgba(0,80,0,0.2)', 3); }
    arvoreR(c, -200, 1520, t);
    if (sol > 0.3) { c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha = 0.12 * sol; c.fillStyle = '#ffd890'; c.beginPath(); c.moveTo(1800, -200); c.lineTo(2300, -200); c.lineTo(400, 2400); c.lineTo(-400, 2400); c.closePath(); c.fill(); c.restore(); }
  });
}
// interior: sala (sofá, abajur, quadro de família) — quente = 1 passado, 0 presente
export function salaCasa(st, t, { quente = 0 } = {}) {
  st.mundo(c => {
    vgrad(c, -1200, -400, 3500, 1900, [[0, mix('#c8ccd4', '#f2d6a8', quente)], [1, mix('#b0b4c0', '#e8c08a', quente)]]);
    for (let x = -1200; x < 2300; x += 120) { c.fillStyle = 'rgba(255,255,255,0.06)'; c.fillRect(x, -400, 50, 1900); }
    rrect(c, 700, 560, 380, 460, 8, mix('#9ab0c8', '#ffe8b8', quente), { lw: 8 }); line(c, [[890, 560], [890, 1020]], '#6a5a4a', 8);
    rrect(c, 160, 620, 300, 220, 6, '#8a6a4a', { lw: 6 }); rrect(c, 176, 636, 268, 188, 3, '#e8d8c0', { stroke: null });
    for (let i = 0; i < 3; i++) { circle(c, 240 + i * 70, 700 - (i === 2 ? -20 : 0), i === 2 ? 18 : 26, ['#d9a37a', '#eec4a2', '#e8b892'][i], { lw: 3 }); rrect(c, 222 + i * 70, 728 - (i === 2 ? -20 : 0), 36, 70, 8, ['#c8443a', '#e2775c', '#2f7fe0'][i], { stroke: null }); }
    line(c, [[1180, 1500], [1180, 1080]], '#3a3a44', 10); shape(c, c => { c.moveTo(1120, 1080); c.lineTo(1240, 1080); c.lineTo(1210, 990); c.lineTo(1150, 990); c.closePath(); }, '#ffe08a', { lw: 5 }); glow(c, 1180, 1060, 300, '#ffd890', 0.45);
    rrect(c, -1200, 1460, 3500, 40, 0, '#8a6a4a', { lw: 6 });
    vgrad(c, -1200, 1500, 3500, 1100, [[0, mix('#9a8a7a', '#c98b55', quente)], [1, mix('#7a6a5a', '#a86a3c', quente)]]);
    ellipse(c, 540, 1820, 560, 90, mix('#7a8aa8', '#d8603a', quente), { lw: 6 });
  });
}
export function sofaCasa(c, x, y = 1500) { rrect(c, x - 330, y - 270, 660, 210, 46, '#6a7a5a', { lw: 6 }); rrect(c, x - 350, y - 120, 700, 140, 28, '#7a8a6a', { lw: 6 }); for (const s of [-1, 1]) rrect(c, x + s * 350 - 50, y - 200, 100, 230, 34, '#6a7a5a', { lw: 6 }); }
// garagem / cozinha / banheiro (fundos simples com detalhes)
export function garagem(st, t) { st.mundo(c => { vgrad(c, -1200, -400, 3500, 1900, [[0, '#d8c0a0'], [1, '#c0a888']]); for (let k = 0; k < 6; k++) { rrect(c, -100 + k * 220, 700, 180, 30, 4, '#8a6a4a', { lw: 4 }); } for (let k = 0; k < 7; k++) line(c, [[-60 + k * 180, 730], [-40 + k * 180, 860]], '#5a5a62', 6); rrect(c, 760, 900, 360, 400, 6, '#a8744a', { lw: 6 }); vgrad(c, -1200, 1500, 3500, 1100, [[0, '#9a9a9a'], [1, '#7a7a7a']]); glow(c, 540, 500, 600, '#fff2c0', 0.4); }); }
export function cozinhaCasa(st, t, { quente = 1 } = {}) { st.mundo(c => { vgrad(c, -1200, -400, 3500, 1900, [[0, mix('#c8d8d4', '#f6e2b0', quente)], [1, mix('#b0c4c0', '#eacb90', quente)]]); for (let y = 800; y < 1300; y += 60) for (let x = -400; x < 1500; x += 60) rrect(c, x + ((y / 60) % 2) * 30, y, 56, 56, 2, 'rgba(255,255,255,0.25)', { stroke: null }); rrect(c, 560, 1180, 700, 320, 8, '#c8925a', { lw: 6 }); rrect(c, 540, 1160, 740, 30, 6, '#f2f2ec', { lw: 5 }); rrect(c, 700, 1100, 160, 60, 10, '#3a3a44', { lw: 4 }); for (let i = 0; i < 3; i++) { const u = (t * 0.5 + i / 3) % 1; line(c, [[760 + i * 20, 1090 - u * 100], [770 + i * 20 + Math.sin(t * 3 + i) * 10, 1060 - u * 100]], '#ffffff', 6, 1 - u); } rrect(c, 300, 560, 360, 300, 8, mix('#9ab0c8', '#fff2c8', quente), { lw: 7 }); vgrad(c, -1200, 1500, 3500, 1100, [[0, '#c8b8a0'], [1, '#a89880']]); }); }
export function banheiro(st, t) { st.mundo(c => { vgrad(c, -1200, -400, 3500, 1900, [[0, '#cfe0e4'], [1, '#b8ccd0']]); for (let y = 1000; y < 1500; y += 50) for (let x = -400; x < 1500; x += 50) rrect(c, x, y, 48, 48, 2, 'rgba(255,255,255,0.3)', { stroke: null }); rrect(c, 220, 1240, 640, 60, 10, '#f2f2f2', { lw: 6 }); rrect(c, 300, 1300, 480, 200, 8, '#e0e4e8', { lw: 5 }); vgrad(c, -1200, 1500, 3500, 1100, [[0, '#9aa8b0'], [1, '#7a8890']]); }); }
// mãos em close (jovem ou enrugadas)
export function maoClose(c, x, y, s, rot, pele, enrugada = 0) {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  shape(c, c => { c.moveTo(-60, 160); c.lineTo(-70, 20); c.quadraticCurveTo(-70, -40, -20, -46); c.lineTo(60, -40); c.quadraticCurveTo(84, -20, 70, 10); c.lineTo(60, 160); c.closePath(); }, pele, { lw: 6 });
  for (let k = 0; k < 4; k++) shape(c, c => c.roundRect(-46 + k * 26, -96, 24, 64, 12), pele, { lw: 5 });
  if (enrugada > 0) { c.save(); c.globalAlpha = enrugada; for (let k = 0; k < 4; k++) { line(c, [[-40 + k * 26, -60], [-28 + k * 26, -58]], 'rgba(90,50,30,0.6)', 3); line(c, [[-40 + k * 26, -72], [-28 + k * 26, -70]], 'rgba(90,50,30,0.5)', 3); } for (let k = 0; k < 3; k++) line(c, [[-40, 40 + k * 22], [40, 34 + k * 22]], 'rgba(90,50,30,0.25)', 3); circle(c, 20, 60, 6, 'rgba(140,90,50,0.35)', { stroke: null }); circle(c, -20, 90, 5, 'rgba(140,90,50,0.3)', { stroke: null }); c.restore(); }
  c.restore();
}
export const caixaPesada = (c, x, y) => { rrect(c, x - 70, y - 100, 140, 110, 6, '#c89a5a', { lw: 5 }); line(c, [[x - 70, y - 60], [x + 70, y - 60]], '#a87a3a', 4); };
export const sacola = (c, x, y) => { shape(c, c => { c.moveTo(x - 40, y); c.lineTo(x + 40, y); c.lineTo(x + 36, y + 90); c.lineTo(x - 36, y + 90); c.closePath(); }, '#f2efe6', { lw: 4 }); for (let k = 0; k < 3; k++) circle(c, x - 20 + k * 20, y - 6, 14, ['#e2473a', '#35a868', '#f4c430'][k], { lw: 3 }); };
