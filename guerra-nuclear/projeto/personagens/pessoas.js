// Personagens. O protagonista ("você") tem sempre cabelo escuro bagunçado e moletom amarelo;
// depois da guerra o moletom fica sujo e ele usa máscara de gás e mochila.
import { TAU, lerp } from '../motor/base.js';
import { OUT, shape, circle, ellipse, poly, line, rrect, glow } from '../motor/desenho.js';
import { Personagem } from '../motor/personagem.js';

const CABELO = '#2e2420';

function mascaraGas(c, cor = '#5a5a52') {
  for (const s of [-1, 1]) line(c, [[s * 56, 20], [s * 76, -20]], '#3a3a34', 7);
  shape(c, c => { c.moveTo(-50, 6); c.quadraticCurveTo(-56, 60, -20, 78); c.lineTo(20, 78); c.quadraticCurveTo(56, 60, 50, 6); c.quadraticCurveTo(0, -6, -50, 6); c.closePath(); }, cor);
  for (const s of [-1, 1]) { c.save(); c.translate(s * 40, 66); c.rotate(s * 0.5); rrect(c, -16, -12, 32, 34, 8, '#8a6a3a', { lw: 4 }); for (let i = 0; i < 3; i++) line(c, [[-10, -4 + i * 9], [10, -4 + i * 9]], '#5a4020', 3); c.restore(); }
  circle(c, 0, 50, 16, '#3a3a34', { lw: 4 }); for (let i = 0; i < 4; i++) line(c, [[-8 + i * 5, 40], [-8 + i * 5, 60]], '#6a6a60', 2);
}
function sujeira(c, seed = 1) { c.save(); c.globalAlpha *= 0.35; c.fillStyle = '#6a4a2a'; for (const [x, y, r] of [[-30, -60, 9], [24, -20, 7], [-10, 26, 6], [40, 40, 8]]) { c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); } c.restore(); }

export function voce() {
  return new Personagem({
    pele: '#ffe2c8', olhos: '#4a3220', sobrancelha: '#2e2420', roupa: '#f2c230', roupaSombra: '#d09a1a', manga: '#f2c230', enfeite: '#e8a820', cinto: '#e0a820',
    semFaixa: true, barra: -116, larguraBarra: 62, perna: '#3a5a8a', sapato: '#e8e4dc',
    cabeloTras: (c, p) => { if (p.mochila) { rrect(c, -78, -250, 156, 160, 26, '#7a5a3a'); rrect(c, -60, -130, 120, 40, 10, '#5a3e24', { lw: 4 }); ellipse(c, 0, -258, 70, 18, '#4a5a3a', { lw: 4 }); } },
    atrasCabeca: (c) => shape(c, c => { c.moveTo(-78, 50); c.quadraticCurveTo(-96, -40, -40, -78); c.lineTo(40, -78); c.quadraticCurveTo(96, -40, 78, 50); c.quadraticCurveTo(0, 74, -78, 50); c.closePath(); }, '#e0ae20'),
    extraTras: (c, p) => {
      shape(c, c => c.roundRect(-34, -186, 68, 40, 10), '#e0ae20', { lw: 4 });
      line(c, [[-14, -234], [-16, -196]], '#ffffff', 4); line(c, [[14, -234], [16, -196]], '#ffffff', 4);
      if (p.mochila) { line(c, [[-40, -232], [-30, -150]], '#5a3e24', 10); line(c, [[40, -232], [30, -150]], '#5a3e24', 10); }
      if (p.sujo) sujeira(c);
    },
    cabeloFrente: (c, p) => {
      shape(c, c => { c.moveTo(-76, 0); c.quadraticCurveTo(-92, -86, -10, -90); c.quadraticCurveTo(76, -94, 80, -10); c.lineTo(66, -30); c.lineTo(52, -14); c.lineTo(40, -44); c.lineTo(18, -26); c.lineTo(2, -50); c.lineTo(-18, -30); c.lineTo(-40, -48); c.lineTo(-58, -22); c.closePath(); }, CABELO);
      shape(c, c => { c.moveTo(-14, -88); c.quadraticCurveTo(-30, -118, 6, -112); c.quadraticCurveTo(-6, -100, 2, -88); c.closePath(); }, CABELO, { lw: 5 });
      if (p.sujo) { c.save(); c.globalAlpha *= 0.3; c.fillStyle = '#6a4a2a'; c.beginPath(); c.arc(-40, 20, 10, 0, TAU); c.arc(46, -6, 7, 0, TAU); c.fill(); c.restore(); }
      if (p.mascara) mascaraGas(c);
    },
  });
}

// pessoas da cidade (vida normal)
export function civil(tipo = 0) {
  const T = [
    { pele: '#f2c9a4', roupa: '#3a4a6a', sombra: '#2a3450', perna: '#2a2a34', cabelo: '#4a3020', estilo: 'curto', gravata: '#c0302a' },
    { pele: '#ffe0cc', roupa: '#c05a7a', sombra: '#9a4060', perna: '#3a3a4a', cabelo: '#8a4a20', estilo: 'longo' },
    { pele: '#d8a07a', roupa: '#5a9a6a', sombra: '#3a7a4a', perna: '#4a4a5a', cabelo: '#1a1a1a', estilo: 'bone', bone: '#d04a3a' },
    { pele: '#f6d6bc', roupa: '#8a7aa8', sombra: '#6a5a88', perna: '#3a3a44', cabelo: '#c8c8c8', estilo: 'calvo' },
    { pele: '#ffe6d2', roupa: '#f08a3a', sombra: '#d06a1a', perna: '#3a5a8a', cabelo: '#d8a040', estilo: 'rabo' },
  ][tipo % 5];
  return new Personagem({
    pele: T.pele, olhos: '#2a2a2a', roupa: T.roupa, roupaSombra: T.sombra, enfeite: T.sombra, cinto: T.sombra, semFaixa: true, barra: T.estilo === 'longo' ? -60 : -116, larguraBarra: T.estilo === 'longo' ? 80 : 62, perna: T.perna, sapato: '#2a2a2a',
    extraTras: (c) => { if (T.gravata) { poly(c, [[-8, -232], [8, -232], [12, -170], [0, -156], [-12, -170]], T.gravata, { lw: 4 }); } },
    cabeloTras: (c) => { if (T.estilo === 'longo') shape(c, c => { c.moveTo(-76, -320); c.quadraticCurveTo(-96, -220, -70, -180); c.lineTo(70, -180); c.quadraticCurveTo(96, -220, 76, -320); c.closePath(); }, T.cabelo); },
    cabeloFrente: (c) => {
      if (T.estilo === 'calvo') { for (const s of [-1, 1]) shape(c, c => { c.moveTo(s * 56, -46); c.quadraticCurveTo(s * 84, -30, s * 76, 6); c.lineTo(s * 64, -12); c.closePath(); }, T.cabelo); return; }
      if (T.estilo === 'bone') { shape(c, c => { c.moveTo(-74, -24); c.quadraticCurveTo(-74, -96, 0, -98); c.quadraticCurveTo(74, -96, 74, -24); c.closePath(); }, T.bone); ellipse(c, 40, -24, 60, 12, T.bone); return; }
      shape(c, c => { c.moveTo(-76, 0); c.quadraticCurveTo(-88, -88, 0, -90); c.quadraticCurveTo(88, -88, 76, 0); c.quadraticCurveTo(60, -50, 0, -54); c.quadraticCurveTo(-60, -50, -76, 0); c.closePath(); }, T.cabelo);
      if (T.estilo === 'rabo') shape(c, c => { c.moveTo(50, -70); c.quadraticCurveTo(120, -60, 100, 20); c.quadraticCurveTo(90, -30, 60, -40); c.closePath(); }, T.cabelo);
    },
  });
}
export function crianca(tipo = 0) {
  const p = civil(tipo ? 4 : 2); p.d = { ...p.d, barra: -116, larguraBarra: 60, roupa: tipo ? '#4a9ad0' : '#e0503a', roupaSombra: tipo ? '#2a7ab0' : '#b0301a' };
  return p;
}
// sobreviventes do mundo pós-guerra (máscaras, ponchos, roupas remendadas)
export function sobrevivente(tipo = 0) {
  const T = [
    { roupa: '#8a6a4a', sombra: '#6a4a30', mascara: true, capuz: '#6a5a4a' },
    { roupa: '#6a7a5a', sombra: '#4a5a3a', mascara: false, lenco: '#a04a2a', cabelo: '#4a3020' },
    { roupa: '#9a8a6a', sombra: '#7a6a4a', mascara: true, capuz: null, cabelo: '#2a2a2a' },
    { roupa: '#7a5a5a', sombra: '#5a3a3a', mascara: false, lenco: '#d0a040', cabelo: '#c8c8c8' },
  ][tipo % 4];
  return new Personagem({
    pele: '#e8c0a0', olhos: '#2a2a2a', roupa: T.roupa, roupaSombra: T.sombra, enfeite: '#5a4a3a', cinto: '#3a2a1a', semFaixa: true, barra: -70, larguraBarra: 84, perna: '#4a4038', sapato: '#2a2018',
    atrasCabeca: (c) => { if (T.capuz) shape(c, c => { c.moveTo(-86, 50); c.quadraticCurveTo(-100, -60, 0, -100); c.quadraticCurveTo(100, -60, 86, 50); c.quadraticCurveTo(0, 74, -86, 50); c.closePath(); }, T.capuz); },
    extraTras: (c) => { for (const [x, y] of [[-26, -200], [20, -120]]) rrect(c, x, y, 22, 22, 3, '#5a4a3a', { lw: 3 }); },
    cabeloFrente: (c) => {
      if (T.capuz) shape(c, c => { c.moveTo(-86, 50); c.quadraticCurveTo(-100, -60, 0, -100); c.quadraticCurveTo(100, -60, 86, 50); c.lineTo(70, 40); c.quadraticCurveTo(76, -50, 0, -66); c.quadraticCurveTo(-76, -50, -70, 40); c.closePath(); }, T.capuz);
      else shape(c, c => { c.moveTo(-76, 0); c.quadraticCurveTo(-88, -88, 0, -90); c.quadraticCurveTo(88, -88, 76, 0); c.quadraticCurveTo(60, -50, 0, -54); c.quadraticCurveTo(-60, -50, -76, 0); c.closePath(); }, T.cabelo);
      if (T.lenco) shape(c, c => { c.moveTo(-60, 20); c.quadraticCurveTo(0, 90, 60, 20); c.quadraticCurveTo(0, 50, -60, 20); }, T.lenco);
      if (T.mascara) mascaraGas(c, '#4a4a44');
      rrect(c, -64, -60, 128, 26, 12, '#6a6050', { lw: 4 }); for (const s of [-1, 1]) circle(c, s * 30, -47, 14, '#d8a040', { lw: 4 });
    },
  });
}
// o estranho na escuridão: capuz escuro, óculos que brilham, cano de ferro
export function estranho() {
  return new Personagem({
    pele: '#5a4a44', olhos: '#ff6a2a', roupa: '#2a2420', roupaSombra: '#1a1410', enfeite: '#3a2a20', cinto: '#3a2a20', semFaixa: true, barra: -50, larguraBarra: 92, perna: '#1a1614', sapato: '#100c0a', capa: '#1a1410',
    atrasCabeca: (c) => shape(c, c => { c.moveTo(-92, 60); c.quadraticCurveTo(-106, -70, 0, -112); c.quadraticCurveTo(106, -70, 92, 60); c.quadraticCurveTo(0, 84, -92, 60); c.closePath(); }, '#1e1814'),
    cabeloFrente: (c, p, t) => {
      shape(c, c => { c.moveTo(-92, 60); c.quadraticCurveTo(-106, -70, 0, -112); c.quadraticCurveTo(106, -70, 92, 60); c.lineTo(72, 50); c.quadraticCurveTo(78, -50, 0, -70); c.quadraticCurveTo(-78, -50, -72, 50); c.closePath(); }, '#1e1814');
      shape(c, c => { c.moveTo(-60, 20); c.quadraticCurveTo(0, 96, 60, 20); c.lineTo(60, 70); c.lineTo(-60, 70); c.closePath(); }, '#2a2420');
      rrect(c, -66, -20, 132, 30, 12, '#3a3430', { lw: 4 });
      for (const s of [-1, 1]) { circle(c, s * 30, -5, 18, '#ff8a2a', { lw: 5 }); glow(c, s * 30, -5, 60, '#ff6a1a', p.brilhoOlhos || 0.8); }
    },
  });
}

// ---------- objetos de mão ----------
export const celular = (alerta = 0) => (c, s, t) => { rrect(c, -18, -40, 36, 64, 8, '#2a2a34', { lw: 4 }); const pisca = alerta > 0 && Math.sin(t * 14) > 0; rrect(c, -13, -34, 26, 50, 4, alerta > 0 ? (pisca ? '#ff3a2a' : '#ffd23a') : '#8ad0f0', { lw: 2 }); if (alerta > 0) glow(c, 0, -10, 80, '#ff3a2a', 0.6 * alerta); };
export const caneca = (vapor = 1) => (c, s, t) => { rrect(c, -22, -40, 44, 46, 8, '#ffffff', { lw: 4 }); shape(c, c => c.arc(26, -18, 12, -1.3, 1.3), null, { lw: 5 }); ellipse(c, 0, -38, 18, 5, '#6a3a1a', { lw: 2 }); for (let i = 0; i < 2; i++) { const u = (t * 0.6 + i / 2) % 1; c.save(); c.globalAlpha = 0.5 * (1 - u) * vapor; circle(c, -6 + i * 12 + Math.sin(u * 6) * 6, -50 - u * 50, 7 + u * 8, '#ffffff', { stroke: null }); c.restore(); } };
export const geiger = (nivel = 0.5) => (c, s, t) => { rrect(c, -30, -46, 60, 70, 10, '#d8a040', { lw: 4 }); shape(c, c => c.arc(0, -16, 18, Math.PI, 0), '#f2ead8', { lw: 3 }); const a = Math.PI + (nivel + Math.sin(t * 23) * 0.08) * Math.PI; line(c, [[0, -16], [Math.cos(a) * 16, -16 + Math.sin(a) * 16]], '#d02a2a', 3); circle(c, 0, 10, 6, Math.sin(t * 30) > 0.6 ? '#ff3a2a' : '#5a2a2a', { lw: 2 }); };
export const lata = () => (c) => { rrect(c, -18, -30, 36, 46, 4, '#b8b8b0', { lw: 4 }); rrect(c, -18, -18, 36, 20, 2, '#d04a2a', { lw: 3 }); };
export const garrafa = () => (c) => { rrect(c, -14, -50, 28, 64, 8, '#8ad0f0', { lw: 4 }); rrect(c, -7, -62, 14, 14, 3, '#3a6ad0', { lw: 3 }); };
export const cano = (ang = 0) => (c) => { c.save(); c.rotate(ang); rrect(c, -8, -150, 16, 180, 6, '#6a5a50', { lw: 5 }); rrect(c, -14, -160, 28, 24, 4, '#5a4a40', { lw: 4 }); c.restore(); };
