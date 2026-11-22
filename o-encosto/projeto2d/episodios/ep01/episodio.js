// IMAGINE TER UM IRMÃO QUE É UM ENCOSTO PROFISSIONAL — versão 2D
import { sstep, win, clamp, easeBack } from '../../motor/base.js';
import { W, H } from '../../motor/estudio.js';
import { c1, c2, c3, c4 } from './cenas/cenas.js';

const tempos = await (await fetch(new URL('./tempos.json', import.meta.url))).json();
// legendas por fala, com a cor de quem fala
const COR = { N: '#ffffff', Lucas: '#7ab8ff', Pedro: '#ff7a6a', 'Mãe': '#e0a8ff' };
const LEG = [];
for (const f of tempos.falas) {
  const pal = f.texto.split(/\s+/), blocos = [];
  for (let i = 0; i < pal.length;) { let n = pal[i].length > 9 ? 1 : (pal[i + 1] && (pal[i] + pal[i + 1]).length < 14 ? 2 : 1); if (n === 2 && pal[i + 2] && (pal[i] + pal[i + 1] + pal[i + 2]).length < 13) n = 3; blocos.push(pal.slice(i, i + n).join(' ')); i += n; }
  const tot = blocos.reduce((s, b) => s + b.length + 2, 0); let a = f.inicio;
  for (const b of blocos) { const d = (f.fim - f.inicio) * (b.length + 2) / tot; LEG.push({ a, b: a + d, txt: b.toUpperCase(), cor: COR[f.quem] }); a += d; }
}
const grito = t => tempos.falas.some(f => /[A-Z]{5}/.test(f.texto) && f.quem !== 'Pedro' && t >= f.inicio && t < f.fim);

export default {
  tempos, duracao: tempos.duracao,
  cenas: [c1, c2, c3, c4],
  composicao(st, t, idx) {
    const c = st.ctx || st.c;
    if (grito(t)) st.overlay('#ff2a2a', 0.05 + 0.07 * Math.abs(Math.sin(t * 10)));
    const crime = win(t, 12.6, 13.0, 14.1, 14.4); if (crime > 0) st.vignette(0.75 * crime);
    const epico = win(t, 30.4, 30.8, 36.8, 37.3); if (epico > 0) { c.save(); c.fillStyle = '#000'; c.fillRect(0, 0, W, 150 * epico); c.fillRect(0, H - 150 * epico, W, 150 * epico); c.restore(); }
    st.vignette(0.3);
    st.overlay('#000', 1 - sstep(0, 0.5, t));
    for (const a of [11.0, 23.9, 30.4, 48.6]) st.overlay('#000', win(t, a - 0.3, a - 0.05, a + 0.05, a + 0.35));
    st.overlay('#ffffff', win(t, 30.3, 30.4, 30.45, 30.8) * 0.8);
    st.grain(idx, 0.035);
    st.overlay('#000', sstep(tempos.duracao - 1.0, tempos.duracao, t));
  },
  legenda(st, t) {
    const b = LEG.find(x => t >= x.a && t < x.b); if (!b) return;
    st.text(b.txt, W / 2, 1560, { size: 92, fill: b.cor, scale: 0.75 + 0.25 * easeBack(clamp((t - b.a) / 0.15)), lw: 20 });
  },
};
