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
export function desenharLegenda(st, t, blocos, tempos, y = 1150) {
  const b = blocos.find(x => t >= x.a && t < x.b);
  if (!b || t >= tempos.tela_preta) return;
  st.text(b.txt, W / 2, y, { size: 62, weight: 700, fill: '#e8ecf4', alpha: 0.92 * clamp((t - b.a) / 0.12), lw: 10, stroke: '#05060a', shadow: false, spacing: 3 });
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
  if (tempos.texto_final === 'FIM') {
    st.text('FIM', W / 2, H / 2 - 40, { size: 190, fill: '#ffe9a8', alpha: sstep(a, a + 0.6, t), scale: 0.7 + 0.3 * easeBack(clamp((t - a) / 0.6)), glow: 'rgba(255,190,80,0.9)', lw: 22 });
    st.text(tempos.titulo.toUpperCase(), W / 2, H / 2 + 110, { size: 52, fill: '#ffffff', alpha: sstep(a + 0.5, a + 1.0, t), lw: 10 });
    return;
  }
  st.text(tempos.texto_final || 'CONTINUA...', W / 2, H / 2, { size: 110, fill: '#ffffff', alpha: sstep(a, a + 0.5, t), scale: 0.7 + 0.3 * easeBack(clamp((t - a) / 0.5)), glow: 'rgba(255,40,30,0.8)', lw: 16 });
}
