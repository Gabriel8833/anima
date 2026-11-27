// MISANDRIA — animação 2D explicativa
import { sstep, win, clamp } from '../../motor/base.js';
import { c1, c2, c3, c4, c5, c6 } from './cenas/cenas.js';
import { blocosLegenda, desenharLegenda } from '../../motor/serie.js';

const tempos = await (await fetch(new URL('./tempos.json', import.meta.url))).json();
tempos.tela_preta = tempos.duracao - 1.0;
const LEG = blocosLegenda(tempos);

export default {
  tempos, duracao: tempos.duracao,
  cenas: [c1, c2, c3, c4, c5, c6],
  composicao(st, t, idx) {
    st.vignette(0.3);
    st.grain(idx, 0.03);
    st.overlay('#ffffff', win(t, c1.fim - 0.4, c1.fim - 0.05, c1.fim + 0.05, c1.fim + 0.4) * 0.9 * (t < c1.fim ? 0 : 1));
    st.overlay('#ffffff', win(t, 2.2, 2.4, 2.4, 2.7));
    for (const a of [c2.inicio, c3.inicio, c5.inicio, c6.inicio]) st.wipe((t - a + 0.25) / 0.25, '#2f7fe0', 1);
    st.overlay('#000', win(t, c4.inicio - 0.25, c4.inicio, c4.inicio, c4.inicio + 0.25));
  },
  legenda(st, t) { desenharLegenda(st, t, LEG, tempos, 1690); },
};
