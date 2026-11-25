// POR QUE VOCÊ NÃO CONSEGUE FAZER CÓCEGAS EM SI MESMO? — 2D
import { sstep, win, clamp } from '../../motor/base.js';
import { c1, c2, c3, c4, c5, c6 } from './cenas/cenas.js';
import { blocosLegenda, desenharLegenda } from '../../motor/serie.js';

const tempos = await (await fetch(new URL('./tempos.json', import.meta.url))).json();
tempos.tela_preta = 999;
const LEG = blocosLegenda(tempos);

export default {
  tempos, duracao: tempos.duracao,
  cenas: [c1, c2, c3, c4, c5, c6],
  composicao(st, t, idx) {
    st.vignette(0.22);
    st.grain(idx, 0.03);
    st.overlay('#000', 1 - sstep(0, 0.5, t));
    for (const a of [c3.inicio, c5.inicio, c6.inicio]) st.wipe((t - a + 0.25) / 0.25, '#ff9ec4', 1);
    const a4 = c4.inicio; st.overlay('#ffffff', win(t, a4 - 0.1, a4, a4, a4 + 0.15) * 0.5);
  },
  legenda(st, t) { desenharLegenda(st, t, LEG, tempos, 1640); },
};
