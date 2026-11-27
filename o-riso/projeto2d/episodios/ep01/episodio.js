// POR QUE SENTIMOS VONTADE DE RIR EM MOMENTOS SÉRIOS? — 2D
import { sstep, win, clamp } from '../../motor/base.js';
import { c1, c2, c3, c4, c5, c6, c7 } from './cenas/cenas.js';
import { blocosLegenda, desenharLegenda } from '../../motor/serie.js';

const tempos = await (await fetch(new URL('./tempos.json', import.meta.url))).json();
tempos.tela_preta = tempos.duracao - 1.2;
const LEG = blocosLegenda(tempos);

export default {
  tempos, duracao: tempos.duracao,
  cenas: [c1, c2, c3, c4, c5, c6, c7],
  composicao(st, t, idx) {
    st.vignette(0.25);
    st.grain(idx, 0.03);
    st.overlay('#000', 1 - sstep(0, 0.3, t));
    for (const a of [c3.inicio, c6.inicio, c7.inicio]) st.wipe((t - a + 0.25) / 0.25, '#e2473a', 1);
    for (const a of [c2.inicio, c4.inicio]) st.overlay('#ffffff', win(t, a - 0.06, a, a, a + 0.12) * 0.5);
  },
  legenda(st, t) { desenharLegenda(st, t, LEG, tempos, 1650); },
};
