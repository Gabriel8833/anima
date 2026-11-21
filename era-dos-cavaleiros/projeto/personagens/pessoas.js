// Personagens do vídeo. O protagonista ("você") mantém sempre o mesmo rosto, cabelo castanho com topete,
// sardas e lenço vermelho, em todas as fases da vida.
import { TAU, lerp } from '../motor/base.js';
import { OUT, shape, circle, ellipse, poly, line, rrect, glow } from '../motor/desenho.js';
import { Personagem } from '../motor/personagem.js';

const CABELO = '#7a4a26', PELE = '#ffe6d2', LENCO = '#d23a2a';

// ---------- peças de cabelo / cabeça ----------
function cabeloProtagonista(c) {
  shape(c, c => { c.moveTo(-76, 6); c.quadraticCurveTo(-90, -74, -20, -86); c.quadraticCurveTo(60, -96, 80, -20); c.lineTo(76, 4); c.lineTo(62, -24); c.lineTo(50, -6); c.lineTo(36, -36); c.lineTo(16, -18); c.lineTo(4, -40); c.lineTo(-16, -20); c.lineTo(-30, -42); c.lineTo(-48, -16); c.lineTo(-62, -28); c.closePath(); }, CABELO);
  // topete
  shape(c, c => { c.moveTo(-6, -82); c.quadraticCurveTo(-10, -122, 22, -120); c.quadraticCurveTo(4, -110, 12, -86); c.closePath(); }, CABELO, { lw: 5 });
  line(c, [[-30, -70], [0, -64]], '#a06a3a', 4, 0.8);
  // sardas
  c.save(); c.fillStyle = '#c98a5a'; for (const s of [-1, 1]) for (const [x, y] of [[36, 10], [46, 16], [40, 22], [52, 8]]) { c.beginPath(); c.arc(s * x, y, 2.6, 0, TAU); c.fill(); } c.restore();
}
function capacete(c, pluma = '#d23a2a', t = 0) {
  shape(c, c => { c.moveTo(-82, 10); c.quadraticCurveTo(-86, -92, 0, -96); c.quadraticCurveTo(86, -92, 82, 10); c.lineTo(66, 10); c.quadraticCurveTo(70, -40, 0, -46); c.quadraticCurveTo(-70, -40, -66, 10); c.closePath(); }, '#c3cad4');
  line(c, [[0, -96], [0, -46]], '#8a929e', 6); rrect(c, -8, -46, 16, 60, 6, '#c3cad4', { lw: 4 });
  for (const x of [-60, 60]) circle(c, x, -24, 5, '#8a929e', { lw: 3 });
  const f = Math.sin(t * 5) * 8;
  shape(c, c => { c.moveTo(0, -94); c.quadraticCurveTo(-30, -150 + f, -90, -140 + f); c.quadraticCurveTo(-40, -120, -10, -92); c.closePath(); }, pluma);
}
const lenco = (c) => { shape(c, c => c.ellipse(0, -232, 50, 16, 0, 0, TAU), LENCO, { lw: 5 }); poly(c, [[10, -226], [44, -190], [26, -186], [4, -220]], LENCO, { lw: 4 }); };
const sobreveste = (cor, emblema = '#e3b23c', tipo = 'cruz') => (c) => {
  shape(c, c => c.roundRect(-42, -228, 84, 190, 10), cor, { lw: 5 });
  if (tipo === 'cruz') { rrect(c, -8, -200, 16, 90, 4, emblema, { lw: 3 }); rrect(c, -30, -172, 60, 16, 4, emblema, { lw: 3 }); }
  else if (tipo === 'leao') { circle(c, 0, -160, 26, emblema, { lw: 4 }); poly(c, [[-16, -170], [0, -186], [16, -170]], cor, { lw: 3 }); }
  else { poly(c, [[-22, -190], [22, -190], [0, -130]], emblema, { lw: 4 }); }
  rrect(c, -46, -150, 92, 16, 6, '#5a3a22', { lw: 4 });
};

// ---------- o protagonista em cada fase ----------
export function voce(fase = 'crianca') {
  const base = { pele: PELE, olhos: '#3a5a8a', sobrancelha: '#5a3418', perna: '#6a4a30', sapato: '#4a3020', semFaixa: true };
  const fases = {
    crianca: { roupa: '#5a9a4a', roupaSombra: '#3a7a2a', enfeite: '#e8dcb0', cinto: '#6a4022', barra: -112, larguraBarra: 66, extraTras: lenco },
    jovem: { roupa: '#9a7a52', roupaSombra: '#7a5a3a', enfeite: '#d8c8a0', cinto: '#5a3a22', barra: -100, larguraBarra: 72, extraTras: lenco },
    cavaleiro: { roupa: '#b8c0cc', roupaSombra: '#8a929e', enfeite: '#8a929e', manga: '#aab2be', cinto: '#5a3a22', barra: -78, larguraBarra: 82, perna: '#9aa2ae', sapato: '#5a606a', capa: '#b02a24', extraTras: (c, p) => { sobreveste('#c0302a', '#f2d060', 'cruz')(c); lenco(c); } },
  };
  return new Personagem({ ...base, ...fases[fase], cabeloFrente: (c, p, t) => (p.capacete ? capacete(c, LENCO, t) : cabeloProtagonista(c)) });
}
// bebê enrolado em manta (para o colo da mãe)
export function bebe(c, x, y, s, t, chorando = 0) {
  c.save(); c.translate(x, y); c.scale(s, s); c.rotate(-0.35 + Math.sin(t * 2) * 0.05);
  ellipse(c, 0, 20, 60, 42, '#f0e0b0', { lw: 5 });
  circle(c, -34, -4, 32, PELE, { lw: 5 });
  shape(c, c => { c.moveTo(-40, -36); c.quadraticCurveTo(-46, -60, -24, -58); c.quadraticCurveTo(-34, -50, -30, -36); c.closePath(); }, CABELO, { lw: 4 });
  if (chorando > 0.5) { ellipse(c, -34, 6, 9, 10, '#b3262f', { lw: 4 }); line(c, [[-50, -10], [-42, -6]], OUT, 4); line(c, [[-26, -6], [-18, -10]], OUT, 4); }
  else { line(c, [[-50, -8], [-42, -6]], OUT, 4); line(c, [[-26, -6], [-18, -8]], OUT, 4); shape(c, c => { c.moveTo(-40, 8); c.quadraticCurveTo(-34, 14, -28, 8); }, null, { lw: 4 }); }
  c.restore();
}

// ---------- família, amigos e aldeões ----------
export const pai = () => new Personagem({
  pele: '#f2c9a4', olhos: '#3a2a1a', sobrancelha: '#4a2a14', sobrancelhaW: 8, roupa: '#8a5a3a', roupaSombra: '#6a4026', enfeite: '#c8a878', cinto: '#4a2a14', semFaixa: true, barra: -92, larguraBarra: 80, perna: '#5a4a3a', sapato: '#3a2618',
  cabeloFrente: (c, p) => {
    shape(c, c => { c.moveTo(-74, -10); c.quadraticCurveTo(-80, -80, 0, -82); c.quadraticCurveTo(80, -80, 74, -10); c.quadraticCurveTo(50, -56, 0, -54); c.quadraticCurveTo(-50, -56, -74, -10); c.closePath(); }, '#5a3418');
    shape(c, c => { c.moveTo(-64, 10); c.quadraticCurveTo(-60, 78, 0, 86); c.quadraticCurveTo(60, 78, 64, 10); c.quadraticCurveTo(40, 34, 20, 40); c.quadraticCurveTo(0, 30, -20, 40); c.quadraticCurveTo(-40, 34, -64, 10); c.closePath(); }, '#5a3418');
    if (p.boca === 'aberta' || p.boca === 'sorriso') ellipse(c, 0, 46, 10, p.boca === 'aberta' ? 9 : 4, '#8a2028', { lw: 3 });
  },
});
export const mae = () => new Personagem({
  pele: '#ffe0cc', olhos: '#3a5a3a', sobrancelha: '#6a3a1a', roupa: '#b85a5a', roupaSombra: '#944040', enfeite: '#f2e6c8', cinto: '#7a3030', semFaixa: true,
  extraTras: (c) => shape(c, c => { c.moveTo(-36, -150); c.lineTo(36, -150); c.lineTo(52, -60); c.quadraticCurveTo(0, -48, -52, -60); c.closePath(); }, '#f6efe0'),
  atrasCabeca: (c) => shape(c, c => { c.moveTo(-84, 30); c.quadraticCurveTo(-96, -96, 0, -96); c.quadraticCurveTo(96, -96, 84, 30); c.quadraticCurveTo(70, 70, 40, 76); c.lineTo(-40, 76); c.quadraticCurveTo(-70, 70, -84, 30); c.closePath(); }, '#efe2c4'),
  cabeloFrente: (c) => { shape(c, c => { c.moveTo(-80, 10); c.quadraticCurveTo(-86, -88, 0, -90); c.quadraticCurveTo(86, -88, 80, 10); c.quadraticCurveTo(70, -50, 0, -56); c.quadraticCurveTo(-70, -50, -80, 10); c.closePath(); }, '#efe2c4'); shape(c, c => { c.moveTo(-40, -52); c.quadraticCurveTo(0, -66, 40, -52); c.quadraticCurveTo(0, -40, -40, -52); }, '#8a5030', { lw: 4 }); },
});
export const amigo = () => new Personagem({
  pele: '#f0c8a0', olhos: '#2a2a2a', roupa: '#5a7ad0', roupaSombra: '#3a5ab0', enfeite: '#e8dcb0', cinto: '#4a3020', semFaixa: true, barra: -112, larguraBarra: 66, perna: '#5a4a3a', sapato: '#3a2618',
  cabeloFrente: (c) => { shape(c, c => { c.moveTo(-78, -8); c.quadraticCurveTo(-80, -96, 0, -98); c.quadraticCurveTo(80, -96, 78, -8); c.lineTo(-78, -8); c.closePath(); }, '#d8a040'); rrect(c, -90, -16, 180, 18, 8, '#c08a30', { lw: 5 }); line(c, [[-20, -70], [20, -76]], '#f0c060', 4); },
});
export function aldeao(tipo = 0) {
  const tipos = [
    { pele: '#f2c9a4', roupa: '#7a8a4a', roupaSombra: '#5a6a30', chapeu: '#d8b860', barra: -92 },
    { pele: '#ffe0cc', roupa: '#6a7ab0', roupaSombra: '#4a5a90', lenco: '#e8d8b0', barra: -36 },
    { pele: '#e8b890', roupa: '#9a6a8a', roupaSombra: '#7a4a6a', careca: true, barra: -80 },
    { pele: '#f6d0b0', roupa: '#b88a4a', roupaSombra: '#8a6430', chapeu: '#7a4a2a', barra: -92 },
  ][tipo % 4];
  return new Personagem({
    pele: tipos.pele, olhos: '#2a2a2a', roupa: tipos.roupa, roupaSombra: tipos.roupaSombra, enfeite: '#e8dcb0', cinto: '#4a3020', semFaixa: true, barra: tipos.barra, larguraBarra: 78, perna: '#5a4a3a', sapato: '#3a2618',
    cabeloFrente: (c) => {
      if (tipos.chapeu) { ellipse(c, 0, -60, 110, 20, tipos.chapeu); shape(c, c => { c.moveTo(-56, -62); c.quadraticCurveTo(-50, -120, 0, -122); c.quadraticCurveTo(50, -120, 56, -62); c.closePath(); }, tipos.chapeu); }
      else if (tipos.lenco) shape(c, c => { c.moveTo(-80, 10); c.quadraticCurveTo(-86, -88, 0, -90); c.quadraticCurveTo(86, -88, 80, 10); c.quadraticCurveTo(70, -50, 0, -56); c.quadraticCurveTo(-70, -50, -80, 10); c.closePath(); }, tipos.lenco);
      else { for (const s of [-1, 1]) shape(c, c => { c.moveTo(s * 60, -40); c.quadraticCurveTo(s * 86, -20, s * 74, 10); c.lineTo(s * 64, -10); c.closePath(); }, '#d8d8d8'); }
    },
  });
}
// mestre de armas: velho cavaleiro de barba grisalha e cicatriz
export const mestre = () => new Personagem({
  pele: '#f0c8a0', olhos: '#2a2a2a', sobrancelha: '#9a9a9a', sobrancelhaW: 10, roupa: '#7a6a5a', roupaSombra: '#5a4a3a', enfeite: '#c8b898', cinto: '#3a2618', semFaixa: true, barra: -84, larguraBarra: 82, perna: '#4a4038', sapato: '#2a2018',
  cabeloFrente: (c, p) => {
    for (const s of [-1, 1]) shape(c, c => { c.moveTo(s * 56, -50); c.quadraticCurveTo(s * 86, -30, s * 76, 10); c.lineTo(s * 64, -14); c.closePath(); }, '#b8b8b8');
    shape(c, c => { c.moveTo(-62, 12); c.quadraticCurveTo(-56, 70, 0, 78); c.quadraticCurveTo(56, 70, 62, 12); c.quadraticCurveTo(30, 36, 0, 34); c.quadraticCurveTo(-30, 36, -62, 12); c.closePath(); }, '#c8c8c8');
    line(c, [[14, -40], [36, 10]], '#c06a5a', 5);
    if (p.boca === 'aberta' || p.boca === 'grito') ellipse(c, 0, 44, 11, 10, '#8a2028', { lw: 3 }); else if (p.boca === 'sorriso') shape(c, c => { c.moveTo(-12, 40); c.quadraticCurveTo(0, 50, 12, 40); }, null, { lw: 4 });
  },
});
// cavaleiros: mentor (azul e dourado), aliados (azul) e inimigos (vinho, elmo com chifres)
export function cavaleiro(tipo = 'mentor') {
  const cores = { mentor: ['#2f5ab8', '#f2d060', 'leao', '#2f5ab8'], aliado: ['#3a6ad0', '#ffffff', 'cruz', '#3a6ad0'], inimigo: ['#6a1a2a', '#1a1a1a', 'tri', null] }[tipo];
  return new Personagem({
    pele: tipo === 'inimigo' ? '#e8c0a0' : '#f6d6bc', olhos: '#2a2a2a', sobrancelha: '#3a2a1a', sobrancelhaW: 8,
    roupa: '#b8c0cc', roupaSombra: '#8a929e', enfeite: '#8a929e', manga: '#aab2be', cinto: '#3a2618', semFaixa: true, barra: -78, larguraBarra: 82, perna: '#9aa2ae', sapato: '#5a606a',
    capa: tipo === 'inimigo' ? '#3a0a14' : cores[0],
    extraTras: sobreveste(cores[0], cores[1], cores[2]),
    cabeloFrente: (c, p, t) => {
      if (tipo !== 'inimigo') { capacete(c, cores[3] === '#2f5ab8' ? '#f2d060' : '#ffffff', t); return; }
      shape(c, c => { c.moveTo(-82, 10); c.quadraticCurveTo(-86, -92, 0, -96); c.quadraticCurveTo(86, -92, 82, 10); c.lineTo(66, 10); c.quadraticCurveTo(70, -40, 0, -46); c.quadraticCurveTo(-70, -40, -66, 10); c.closePath(); }, '#4a4e58');
      for (const s of [-1, 1]) shape(c, c => { c.moveTo(s * 60, -70); c.quadraticCurveTo(s * 120, -100, s * 110, -150); c.quadraticCurveTo(s * 96, -110, s * 48, -86); c.closePath(); }, '#efe6d0');
    },
  });
}

// ---------- objetos de mão (desenhados na mão; ang = rotação) ----------
export const espadaMadeira = (ang = 0) => (c) => { c.save(); c.rotate(ang); rrect(c, -9, -150, 18, 140, 6, '#c8925a', { lw: 5 }); rrect(c, -30, -16, 60, 14, 6, '#8a5a30', { lw: 4 }); rrect(c, -7, -4, 14, 30, 5, '#6a4022', { lw: 4 }); c.restore(); };
export const espada = (ang = 0, brilho = 0) => (c, s, t) => {
  c.save(); c.rotate(ang);
  shape(c, c => { c.moveTo(-10, -10); c.lineTo(-10, -170); c.lineTo(0, -196); c.lineTo(10, -170); c.lineTo(10, -10); c.closePath(); }, '#e6ecf4');
  line(c, [[0, -20], [0, -170]], '#aab4c4', 3);
  rrect(c, -36, -18, 72, 14, 6, '#e3b23c', { lw: 4 }); rrect(c, -7, -6, 14, 32, 5, '#5a3418', { lw: 4 }); circle(c, 0, 30, 9, '#e3b23c', { lw: 4 });
  if (brilho > 0) glow(c, 0, -120, 120, '#ffffff', brilho);
  c.restore();
};
export const escudo = (cor = '#c0302a', emblema = '#f2d060') => (c) => {
  c.save(); c.translate(-18, -10);
  shape(c, c => { c.moveTo(-50, -60); c.lineTo(50, -60); c.lineTo(50, 0); c.quadraticCurveTo(40, 50, 0, 74); c.quadraticCurveTo(-40, 50, -50, 0); c.closePath(); }, cor);
  rrect(c, -8, -48, 16, 100, 4, emblema, { lw: 3 }); rrect(c, -34, -20, 68, 16, 4, emblema, { lw: 3 });
  c.restore();
};
export const balde = (agua = true) => (c) => { line(c, [[-26, 0], [0, -16], [26, 0]], '#5a4a3a', 4); shape(c, c => { c.moveTo(-28, 0); c.lineTo(28, 0); c.lineTo(22, 52); c.lineTo(-22, 52); c.closePath(); }, '#8a5a30'); line(c, [[-26, 18], [26, 18]], '#5a3418', 4); if (agua) ellipse(c, 0, 2, 26, 6, '#6ac0e8', { lw: 3 }); };
export const vassoura = (ang = 0) => (c) => { c.save(); c.rotate(ang); line(c, [[0, -120], [0, 110]], '#8a5a30', 10); shape(c, c => { c.moveTo(-10, 100); c.lineTo(10, 100); c.lineTo(34, 170); c.lineTo(-34, 170); c.closePath(); }, '#d8b860'); c.restore(); };
export const colher = (ang = 0) => (c) => { c.save(); c.rotate(ang); line(c, [[0, -10], [0, 110]], '#8a5a30', 9); ellipse(c, 0, 120, 14, 20, '#8a5a30'); c.restore(); };
export const lancaBandeira = (cor = '#2f5ab8', t0 = 0) => (c, s, t) => { line(c, [[0, 160], [0, -300]], '#7a4a22', 10); poly(c, [[-8, -300], [0, -340], [8, -300]], '#c3cad4', { lw: 4 }); const f = Math.sin(t * 6) * 10; poly(c, [[0, -290], [90, -270 + f], [0, -240]], cor, { lw: 4 }); };
export const cesta = () => (c) => { shape(c, c => { c.moveTo(-40, 0); c.lineTo(40, 0); c.lineTo(32, 46); c.lineTo(-32, 46); c.closePath(); }, '#b88a4a'); for (const [x, cor] of [[-16, '#d9534f'], [6, '#f0ad4e'], [22, '#5cb85c']]) circle(c, x, -4, 13, cor, { lw: 3 }); };
export const lenha = () => (c) => { for (let i = 0; i < 3; i++) { c.save(); c.translate(-46, -20 + i * 14); c.rotate(-0.08 + i * 0.06); rrect(c, -50, -10, 100, 20, 8, '#8a5a30', { lw: 4 }); c.restore(); } };
