// ELENCO FIXO DA SÉRIE "O ÚLTIMO DESPERTAR" — use estas funções em todos os episódios para manter o visual.
//
// KAEL (16): cabelo preto bagunçado com UMA MECHA BRANCA na frente, olhos cinza-azulados, jaqueta cinza (#5a6270)
// com gola branca, calça cinza-escura, botas marrons e PULSEIRA PRETA no pulso esquerdo. É o único de cinza;
// os alunos da academia usam uniforme azul com dourado.
// Variante "crianca": o mesmo cabelo com a mecha, camiseta cinza larga, short.
import { TAU, lerp } from '../motor/base.js';
import { OUT, shape, circle, ellipse, poly, line, rrect, glow } from '../motor/desenho.js';
import { Personagem } from '../motor/personagem.js';

const PRETO = '#1a1820';
function cabeloKael(c, p) {
  shape(c, c => { c.moveTo(-78, 6); c.quadraticCurveTo(-94, -84, -14, -92); c.quadraticCurveTo(78, -98, 82, -6); c.lineTo(68, -26); c.lineTo(58, -8); c.lineTo(44, -40); c.lineTo(26, -20); c.lineTo(12, -46); c.lineTo(-8, -24); c.lineTo(-26, -48); c.lineTo(-44, -20); c.lineTo(-60, -32); c.closePath(); }, PRETO);
  for (const [x, y, a] of [[-50, -84, -0.6], [10, -100, 0.1], [56, -78, 0.7]]) { c.save(); c.translate(x, y); c.rotate(a); poly(c, [[-14, 6], [0, -26], [14, 6]], PRETO, { lw: 5 }); c.restore(); }
  // mecha branca
  shape(c, c => { c.moveTo(-30, -86); c.quadraticCurveTo(-36, -60, -26, -44); c.lineTo(-10, -28); c.quadraticCurveTo(-14, -60, -8, -88); c.closePath(); }, '#f2f2f6', { lw: 4 });
}
const pulseira = (c, p) => { if (p.semPulseira) return; const [x, y] = [0, 0]; };
export function kael(fase = 'jovem') {
  const base = { pele: '#ffe2cc', olhos: '#5a7a96', sobrancelha: PRETO, sobrancelhaW: 7, cabeloFrente: cabeloKael };
  if (fase === 'crianca') return new Personagem({ ...base, roupa: '#7a828e', roupaSombra: '#5a626e', manga: '#7a828e', enfeite: '#9aa2ae', cinto: '#5a626e', semFaixa: true, barra: -112, larguraBarra: 70, perna: '#3a3e48', sapato: '#6a4022' });
  return new Personagem({
    ...base, roupa: '#5a6270', roupaSombra: '#424a58', manga: '#5a6270', enfeite: '#f2f2f6', cinto: '#3a2a1a', semFaixa: true, barra: -104, larguraBarra: 70, perna: '#2e323c', sapato: '#6a4022',
    extraTras: (c) => { for (const s of [-1, 1]) poly(c, [[s * 8, -236], [s * 40, -232], [s * 26, -200]], '#f2f2f6', { lw: 4 }); line(c, [[0, -230], [0, -112]], '#3a404c', 5); },
  });
}
// pulseira preta: desenhar na mão esquerda (maoE) — retorna um item de mão
export const pulseiraPreta = (marca = 0) => (c, s, t) => { rrect(c, -18, -30, 36, 14, 6, '#141418', { lw: 4 }); if (marca > 0) { glow(c, 0, -23, 60, '#b08aff', marca * 0.6); line(c, [[-10, -23], [10, -23]], '#d8c8ff', 3, marca); } };

// ---------- alunos e moradores de Aether ----------
// uniforme da academia: azul com dourado
const UNI = { roupa: '#2f5ab8', roupaSombra: '#1f4090', manga: '#2f5ab8', enfeite: '#f2c230', cinto: '#f2c230', semFaixa: false, barra: -100, larguraBarra: 72, perna: '#1e2a48', sapato: '#2a2a2a' };
// DRAVEN: valentão do fogo — cabelo laranja espetado, cicatriz na sobrancelha
export const draven = () => new Personagem({ ...UNI, pele: '#f6d0b0', olhos: '#c0302a', sobrancelha: '#c84a1a', sobrancelhaW: 8,
  cabeloFrente: (c) => { for (let i = 0; i < 7; i++) { const a = -2.6 + i * 0.36; poly(c, [[Math.cos(a) * 60, -10 + Math.sin(a) * 60], [Math.cos(a) * 110, -20 + Math.sin(a) * 110], [Math.cos(a + 0.3) * 60, -10 + Math.sin(a + 0.3) * 60]], '#e8662a', { lw: 4 }); } shape(c, c => { c.moveTo(-76, 0); c.quadraticCurveTo(-86, -84, 0, -86); c.quadraticCurveTo(86, -84, 76, 0); c.quadraticCurveTo(60, -50, 0, -50); c.quadraticCurveTo(-60, -50, -76, 0); c.closePath(); }, '#e8662a'); line(c, [[32, -40], [40, -22]], '#c06a5a', 4); } });
// LYRA: antiga amiga — cabelo azul-gelo em rabo de cavalo, poder de gelo
export const lyra = () => new Personagem({ ...UNI, pele: '#ffe6d6', olhos: '#3ab0d8', sobrancelha: '#7ac0d8',
  cabeloTras: (c) => shape(c, c => { c.moveTo(40, -330); c.quadraticCurveTo(130, -290, 110, -170); c.quadraticCurveTo(90, -250, 50, -280); c.closePath(); }, '#9ad8f0'),
  cabeloFrente: (c) => shape(c, c => { c.moveTo(-78, 10); c.quadraticCurveTo(-88, -86, 0, -90); c.quadraticCurveTo(88, -86, 78, 10); c.quadraticCurveTo(54, -40, 10, -50); c.quadraticCurveTo(-40, -30, -78, 10); c.closePath(); }, '#9ad8f0') });
// TOMI: antigo amigo — cabelo loiro em topete, poder do raio
export const tomi = () => new Personagem({ ...UNI, pele: '#f2c9a4', olhos: '#2a2a2a', sobrancelha: '#c8a040',
  cabeloFrente: (c) => { shape(c, c => { c.moveTo(-76, -6); c.quadraticCurveTo(-80, -90, 0, -92); c.quadraticCurveTo(80, -90, 76, -6); c.quadraticCurveTo(50, -54, 0, -54); c.quadraticCurveTo(-50, -54, -76, -6); c.closePath(); }, '#f2d060'); poly(c, [[-10, -88], [20, -130], [14, -96], [40, -110], [20, -80]], '#f2d060', { lw: 4 }); } });
// MIRA: aluna da telecinese — cabelo roxo curto com franja
export const mira = () => new Personagem({ ...UNI, pele: '#e8b890', olhos: '#9a5ad8', sobrancelha: '#4a2a6a',
  cabeloFrente: (c) => shape(c, c => { c.moveTo(-82, 20); c.quadraticCurveTo(-92, -90, 0, -92); c.quadraticCurveTo(92, -90, 82, 20); c.lineTo(70, 20); c.quadraticCurveTo(66, -40, 0, -36); c.quadraticCurveTo(-66, -40, -70, 20); c.closePath(); }, '#6a3aa8') });
// EXAMINADORA: mestra da academia — cabelo grisalho em coque, túnica longa dourada
export const examinadora = () => new Personagem({ pele: '#f2d0b4', olhos: '#2a2a2a', sobrancelha: '#9a9a9a', sobrancelhaW: 8, roupa: '#d8a83a', roupaSombra: '#b08420', enfeite: '#2f5ab8', cinto: '#2f5ab8', broche: '#9ad8f0',
  cabeloFrente: (c) => { shape(c, c => { c.moveTo(-76, 0); c.quadraticCurveTo(-88, -88, 0, -90); c.quadraticCurveTo(88, -88, 76, 0); c.quadraticCurveTo(60, -50, 0, -54); c.quadraticCurveTo(-60, -50, -76, 0); c.closePath(); }, '#b8b8b8'); circle(c, 0, -100, 30, '#b8b8b8'); } });
// moradores genéricos com cores variadas
export function morador(tipo = 0) {
  const T = [['#c05a3a', '#7a4a2a', '#f2c9a4'], ['#3a9a6a', '#2a2a2a', '#ffe0cc'], ['#8a5ab8', '#d8a040', '#d8a07a'], ['#3a7ad0', '#5a3a22', '#f6d6bc'], ['#d8a03a', '#1a1a1a', '#e8c0a0']][tipo % 5];
  return new Personagem({ pele: T[2], olhos: '#2a2a2a', roupa: T[0], roupaSombra: T[0], enfeite: '#f2e6c8', cinto: '#4a3a2a', semFaixa: true, barra: tipo % 2 ? -60 : -100, larguraBarra: 78, perna: '#3a3a44', sapato: '#2a2a2a',
    cabeloFrente: (c) => shape(c, c => { c.moveTo(-76, 0); c.quadraticCurveTo(-88, -88, 0, -90); c.quadraticCurveTo(88, -88, 76, 0); c.quadraticCurveTo(60, -50, 0, -54); c.quadraticCurveTo(-60, -50, -76, 0); c.closePath(); }, T[1]) });
}
// criança genérica (para as cenas da infância)
export function criancaAether(tipo = 0) { const p = morador(tipo + 1); p.d = { ...p.d, barra: -112, larguraBarra: 64 }; return p; }
