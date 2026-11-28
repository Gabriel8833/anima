// COMO É PERCEBER QUE SEUS PAIS TAMBÉM ESTÃO ENVELHECENDO? — curta 2D
import { sstep, win, clamp } from '../../motor/base.js';
import { c1, c2, c3, c4, c5, c6, c7 } from './cenas/cenas.js';
import { blocosLegenda, desenharLegenda } from '../../motor/serie.js';

const tempos = await (await fetch(new URL('./tempos.json', import.meta.url))).json();
tempos.tela_preta = tempos.duracao - 1.4;
const LEG = blocosLegenda(tempos);

export default {
  tempos, duracao: tempos.duracao,
  cenas: [c1, c2, c3, c4, c5, c6, c7],
  composicao(st, t, idx) {
    st.vignette(0.36);
    st.grain(idx, 0.03);
    st.overlay('#000', 1 - sstep(0, 1.0, t));
    for (const a of [c2.inicio, c3.inicio, c5.inicio, c7.inicio]) st.overlay('#fff4dc', win(t, a - 0.3, a, a, a + 0.35) * 0.5);
    for (const a of [c4.inicio, c6.inicio]) st.overlay('#000', win(t, a - 0.3, a, a, a + 0.3) * 0.5);
  },
  legenda(st, t) { desenharLegenda(st, t, LEG, tempos, 1650); },
};
