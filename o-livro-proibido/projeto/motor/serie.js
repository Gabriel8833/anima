// Peças comuns a todos os episódios: legendas palavra por palavra, título de abertura e "CONTINUA...".
import { sstep, win, clamp, easeBack } from './base.js';
import { W, H } from './estudio.js';

// Blocos de 1 a 3 palavras distribuídos pelo tempo de cada fala de tempos.json
export function blocosLegenda(tempos) {
  const out = [];
  for (const f of tempos.narracao) {
    const palavras = f.texto.replace(/\.\.\./g, '…').split(/\s+/);
    const grupos = []; let g = [];
    for (const w of palavras) { g.push(w); if (g.join(' ').length >= 11 || g.length === 3 || /[.,:;!?…]$/.test(w)) { grupos.push(g.join(' ')); g = []; } }
    if (g.length) grupos.push(g.join(' '));
    const total = grupos.reduce((s, x) => s + x.length + 3, 0);
    let t = f.inicio;
    for (const x of grupos) { const d = (f.fim - f.inicio) * (x.length + 3) / total; out.push({ a: t, b: t + d, txt: x.toUpperCase() }); t += d; }
  }
  return out;
}
export function desenharLegenda(st, t, blocos, tempos) {
  const b = blocos.find(x => t >= x.a && t < x.b);
  if (!b || t >= tempos.tela_preta) return;
  st.text(b.txt, W / 2, 1150, { size: 96, fill: '#ffffff', scale: 0.75 + 0.25 * easeBack(clamp((t - b.a) / 0.15)), lw: 20 });
}
export function tituloAbertura(st, t, tempos, a = 1.2, b = 5.0) {
  const pop = easeBack(clamp((t - a) / 0.5));
  st.text(tempos.titulo.toUpperCase(), W / 2, 330, { size: 104, fill: '#ffe9a8', alpha: win(t, a, a + 0.5, b, b + 0.6), scale: 0.6 + 0.4 * pop, glow: 'rgba(255,170,60,0.9)', lw: 18 });
  st.text(tempos.episodio.toUpperCase(), W / 2, 440, { size: 46, fill: '#ffffff', alpha: win(t, a + 0.6, a + 1.1, b, b + 0.6), lw: 10 });
}
export function telaFinal(st, t, tempos) {
  if (t < tempos.tela_preta) return;
  st.overlay('#000', 1);
  const a = tempos.continua[0];
  st.text('CONTINUA...', W / 2, H / 2, { size: 110, fill: '#ffffff', alpha: sstep(a, a + 0.5, t), scale: 0.7 + 0.3 * easeBack(clamp((t - a) / 0.5)), glow: 'rgba(255,40,30,0.8)', lw: 16 });
}
