// Personagens originais de "E se você fosse O Relojoeiro?".
// VOCÊ (50): cabelo grisalho ondulado, sobrancelhas grossas, barba curta grisalha, sem óculos.
//   Fase "comum": camisa clara, colete marrom, lupa presa na testa.
//   Fase "relojoeiro": casaco escuro longo, cabelo penteado para trás, cachecol vinho, olhar frio.
import { TAU, lerp } from '../motor/base.js';
import { OUT, shape, circle, ellipse, poly, line, rrect, glow } from '../motor/desenho.js';
import { Personagem } from '../motor/personagem.js';

const GRIS = '#9a9aa2', PELE = '#f2cfae';
function barba(c, p) {
  shape(c, c => { c.moveTo(-64, 6); c.quadraticCurveTo(-60, 74, 0, 82); c.quadraticCurveTo(60, 74, 64, 6); c.quadraticCurveTo(50, 40, 30, 44); c.quadraticCurveTo(0, 34, -30, 44); c.quadraticCurveTo(-50, 40, -64, 6); c.closePath(); }, GRIS);
  const m = p.boca;
  if (m === 'aberta' || m === 'grito' || m === 'o') ellipse(c, 0, 46, m === 'o' ? 7 : 12, m === 'o' ? 8 : 10, '#8a2028', { lw: 3 });
  else if (m === 'sorriso' || m === 'sorrisoMal') shape(c, c => { c.moveTo(-14, 42); c.quadraticCurveTo(m === 'sorrisoMal' ? 6 : 0, 52, 14, m === 'sorrisoMal' ? 36 : 42); }, null, { lw: 4 });
  else if (m === 'triste') shape(c, c => { c.moveTo(-12, 48); c.quadraticCurveTo(0, 40, 12, 48); }, null, { lw: 4 });
  else line(c, [[-10, 44], [10, 44]], OUT, 4);
}
function cabeloComum(c, p) {
  for (const s of [-1, 1]) shape(c, c => { c.moveTo(s * 40, -70); c.quadraticCurveTo(s * 96, -60, s * 82, 10); c.quadraticCurveTo(s * 70, -20, s * 60, -10); c.quadraticCurveTo(s * 70, -50, s * 30, -60); c.closePath(); }, GRIS);
  shape(c, c => { c.moveTo(-50, -66); c.quadraticCurveTo(-30, -100, 0, -92); c.quadraticCurveTo(30, -104, 52, -66); c.quadraticCurveTo(20, -78, 0, -74); c.quadraticCurveTo(-20, -80, -50, -66); c.closePath(); }, GRIS);
  if (p.lupa) { rrect(c, -56, -76, 112, 14, 6, '#4a3a2a', { lw: 4 }); circle(c, 30, -76, 22, '#bfe6f6', { stroke: '#6a5a3a', lw: 6 }); }
  barba(c, p);
}
function cabeloRelojoeiro(c, p) {
  shape(c, c => { c.moveTo(-78, 6); c.quadraticCurveTo(-92, -96, 0, -96); c.quadraticCurveTo(92, -96, 78, 6); c.quadraticCurveTo(76, -52, 0, -62); c.quadraticCurveTo(-76, -52, -78, 6); c.closePath(); }, '#7a7a84');
  for (let i = 0; i < 4; i++) line(c, [[-50 + i * 30, -88], [-36 + i * 30, -62]], '#5a5a64', 4, 0.8);
  barba(c, p);
}
export function voce(fase = 'comum') {
  const base = { pele: PELE, olhos: '#3a3a2a', sobrancelha: '#6a6a72', sobrancelhaW: 10 };
  if (fase === 'comum') return new Personagem({ ...base, roupa: '#e8e0d0', roupaSombra: '#c8c0b0', manga: '#e8e0d0', enfeite: '#7a5232', cinto: '#5a3a22', semFaixa: true, barra: -110, larguraBarra: 72, perna: '#5a5248', sapato: '#3a2618',
    extraTras: (c) => { shape(c, c => { c.moveTo(-44, -228); c.lineTo(-14, -228); c.lineTo(-8, -110); c.lineTo(-46, -112); c.closePath(); c.moveTo(44, -228); c.lineTo(14, -228); c.lineTo(8, -110); c.lineTo(46, -112); c.closePath(); }, '#7a5232', { lw: 4 }); line(c, [[18, -170], [36, -160]], '#d8b040', 3); },
    cabeloFrente: cabeloComum });
  return new Personagem({ ...base, roupa: '#26242a', roupaSombra: '#16141a', manga: '#26242a', enfeite: '#3a3640', cinto: '#16141a', semFaixa: true, barra: -40, larguraBarra: 86, perna: '#1a181e', sapato: '#0e0c10', capa: null,
    extraTras: (c) => { shape(c, c => { c.moveTo(-40, -238); c.quadraticCurveTo(0, -206, 40, -238); c.lineTo(36, -212); c.quadraticCurveTo(0, -186, -36, -212); c.closePath(); }, '#7a1e2a', { lw: 4 }); poly(c, [[16, -214], [40, -150], [24, -146], [8, -206]], '#7a1e2a', { lw: 4 }); for (const y of [-180, -140, -100]) circle(c, -14, y, 5, '#5a5660', { lw: 2 }); },
    cabeloFrente: cabeloRelojoeiro });
}
// esposa (Helena): cabelo castanho preso, blusa verde
export const esposa = () => new Personagem({ pele: '#f6d6bc', olhos: '#3a5a3a', sobrancelha: '#5a3418', roupa: '#5a9a7a', roupaSombra: '#3a7a5a', enfeite: '#e8e0d0', cinto: '#3a7a5a', semFaixa: true, barra: -60, larguraBarra: 84,
  cabeloFrente: (c) => { shape(c, c => { c.moveTo(-78, 10); c.quadraticCurveTo(-88, -88, 0, -90); c.quadraticCurveTo(88, -88, 78, 10); c.quadraticCurveTo(60, -50, 0, -54); c.quadraticCurveTo(-60, -50, -78, 10); c.closePath(); }, '#6a3a1a'); circle(c, 0, -100, 30, '#6a3a1a'); } });
// filho (adolescente): cabelo castanho, moletom azul, fones de ouvido
export const filho = () => new Personagem({ pele: '#f6d6bc', olhos: '#3a3a2a', sobrancelha: '#5a3418', roupa: '#3a6ad0', roupaSombra: '#2a4ab0', manga: '#3a6ad0', enfeite: '#e8e8f0', cinto: '#2a4ab0', semFaixa: true, barra: -110, larguraBarra: 66, perna: '#3a3a44', sapato: '#e8e4dc',
  cabeloFrente: (c) => { shape(c, c => { c.moveTo(-78, 0); c.quadraticCurveTo(-88, -92, 0, -94); c.quadraticCurveTo(88, -92, 78, 0); c.lineTo(60, -26); c.lineTo(40, -10); c.lineTo(20, -36); c.lineTo(0, -16); c.lineTo(-24, -38); c.lineTo(-44, -12); c.lineTo(-60, -30); c.closePath(); }, '#7a4a22'); shape(c, c => c.arc(0, -10, 86, Math.PI * 1.05, Math.PI * 1.95), null, { stroke: '#2a2a2a', lw: 8 }); for (const s of [-1, 1]) rrect(c, s * 82 - 14, -24, 28, 44, 10, '#2a2a2a', { lw: 4 }); } });
// Nico: jovem ladrão nervoso, gorro vermelho e jaqueta verde-oliva
export const nico = () => new Personagem({ pele: '#e8b890', olhos: '#2a2a2a', sobrancelha: '#2a1a12', roupa: '#6a7a3a', roupaSombra: '#4a5a2a', manga: '#6a7a3a', enfeite: '#3a3a2a', cinto: '#3a3a2a', semFaixa: true, barra: -110, larguraBarra: 70, perna: '#2e3a5a', sapato: '#e8e4dc',
  cabeloFrente: (c) => { shape(c, c => { c.moveTo(-80, -10); c.quadraticCurveTo(-82, -100, 0, -104); c.quadraticCurveTo(82, -100, 80, -10); c.closePath(); }, '#c0302a'); rrect(c, -86, -22, 172, 24, 10, '#a02020', { lw: 5 }); circle(c, 0, -110, 16, '#c0302a', { lw: 4 }); } });
// ladrões mascarados (quadrilha que falha), gângsteres e guarda
export function mascarado(tipo = 0) { return new Personagem({ pele: '#2a2a30', olhos: '#ffffff', sobrancelha: '#2a2a30', roupa: '#2a2a34', roupaSombra: '#1a1a22', enfeite: '#1a1a22', cinto: '#1a1a22', semFaixa: true, barra: -110, larguraBarra: 70, perna: '#1a1a22', sapato: '#111111', blush: 0,
  cabeloFrente: (c) => { ellipse(c, 0, -2, 54, 20, '#f2cfae', { lw: 4 }); } }); }
export function gangster(tipo = 0) { const cor = ['#3a3a4a', '#4a2a2a', '#2a3a3a'][tipo % 3]; return new Personagem({ pele: ['#e8c0a0', '#c89070', '#f6d6bc'][tipo % 3], olhos: '#2a2a2a', sobrancelha: '#1a1a1a', sobrancelhaW: 9, roupa: cor, roupaSombra: '#1a1a1a', enfeite: '#1a1a1a', cinto: '#1a1a1a', semFaixa: true, barra: -80, larguraBarra: 80, perna: cor, sapato: '#111111',
  cabeloFrente: (c) => { shape(c, c => { c.moveTo(-76, -6); c.quadraticCurveTo(-80, -90, 0, -92); c.quadraticCurveTo(80, -90, 76, -6); c.quadraticCurveTo(50, -54, 0, -54); c.quadraticCurveTo(-50, -54, -76, -6); c.closePath(); }, '#1a1a1a'); if (tipo === 1) line(c, [[24, -40], [40, -10]], '#a05a4a', 4); } }); }
export const guarda = () => new Personagem({ pele: '#d8a07a', olhos: '#2a2a2a', sobrancelha: '#1a1a1a', roupa: '#3a4a6a', roupaSombra: '#2a3450', enfeite: '#f2c230', cinto: '#1a1a1a', semFaixa: true, barra: -100, larguraBarra: 74, perna: '#2a3450', sapato: '#111111', broche: '#f2c230',
  cabeloFrente: (c) => { shape(c, c => { c.moveTo(-82, -20); c.quadraticCurveTo(-80, -100, 0, -102); c.quadraticCurveTo(80, -100, 82, -20); c.closePath(); }, '#2a3450'); rrect(c, -92, -28, 184, 18, 8, '#1a2440', { lw: 4 }); } });

// ---------- objetos ----------
export const relogioBolso = (parado = false) => (c, s, t) => { line(c, [[0, -10], [-20, -60]], '#c8a040', 3); circle(c, 0, 0, 26, '#d8b040', { lw: 4 }); circle(c, 0, 0, 19, '#f6f2e8', { lw: 2 }); const a = parado ? -1.2 : t * 2; line(c, [[0, 0], [Math.cos(a) * 14, Math.sin(a) * 14]], OUT, 3); line(c, [[0, 0], [Math.cos(a / 12 - 2) * 9, Math.sin(a / 12 - 2) * 9]], OUT, 3); };
export const xicara = () => (c, s, t) => { rrect(c, -22, -40, 44, 44, 8, '#f6f2ea', { lw: 4 }); shape(c, c => c.arc(26, -18, 12, -1.3, 1.3), null, { lw: 5 }); for (let i = 0; i < 2; i++) { const u = (t * 0.6 + i / 2) % 1; c.save(); c.globalAlpha = 0.5 * (1 - u); circle(c, -6 + i * 12 + Math.sin(u * 6) * 6, -50 - u * 50, 7 + u * 8, '#ffffff', { stroke: null }); c.restore(); } };
export const carta = (vermelho = 0) => (c) => { rrect(c, -50, -70, 100, 130, 4, '#f6f2ea', { lw: 4 }); for (let i = 0; i < 5; i++) line(c, [[-36, -50 + i * 18], [30 - (i % 2) * 20, -50 + i * 18]], '#8a8a8a', 3); if (vermelho) { c.save(); c.translate(0, 30); c.rotate(-0.2); rrect(c, -40, -14, 80, 28, 4, null, { stroke: '#d02a2a', lw: 4 }); c.font = '900 18px Inter, sans-serif'; c.textAlign = 'center'; c.fillStyle = '#d02a2a'; c.fillText('DESPEJO', 0, 6); c.restore(); } };
export const pinca = () => (c) => { line(c, [[0, 0], [-8, -60]], '#c8ccd4', 4); line(c, [[4, 0], [6, -60]], '#c8ccd4', 4); };
export const lanterna = () => (c) => { rrect(c, -12, -50, 24, 60, 6, '#3a3a3a', { lw: 4 }); };
export const bolsaDinheiro = () => (c) => { shape(c, c => { c.moveTo(-50, 70); c.quadraticCurveTo(-60, 0, -24, -10); c.lineTo(24, -10); c.quadraticCurveTo(60, 0, 50, 70); c.closePath(); }, '#8a7a5a'); line(c, [[-24, -10], [0, -30], [24, -10]], '#5a4a3a', 5); c.save(); c.font = '900 40px Inter, sans-serif'; c.textAlign = 'center'; c.fillStyle = '#2a5a2a'; c.fillText('$', 0, 46); c.restore(); };
