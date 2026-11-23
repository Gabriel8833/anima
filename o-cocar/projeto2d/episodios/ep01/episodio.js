// POR QUE COÇAMOS A CABEÇA QUANDO ESTAMOS CONFUSOS? — 2D, 60 s
import { sstep, win, clamp } from '../../motor/base.js';
import { c1, c2, c3, c4, c5 } from './cenas/cenas.js';
import { blocosLegenda, desenharLegenda } from '../../motor/serie.js';

const tempos = await (await fetch(new URL('./tempos.json', import.meta.url))).json();
tempos.tela_preta = 56.6;
const LEG = blocosLegenda(tempos);

export default {
  tempos, duracao: tempos.duracao,
  cenas: [c1, c2, c3, c4, c5],
  composicao(st, t, idx) {
    st.vignette(0.2);
    st.grain(idx, 0.03);
    st.overlay('#000', 1 - sstep(0, 0.5, t));
    st.overlay('#ffffff', win(t, 24.8, 24.95, 25.05, 25.3) * 0.85);   // volta para fora
    st.wipe((t - 36.7) / 0.3, '#f4c430', -1);                         // volta para a sala
    st.overlay('#ffffff', win(t, 56.45, 56.55, 56.65, 56.85) * 0.9);   // tela final
    st.overlay('#000', sstep(59.7, 60, t));
  },
  legenda(st, t) { desenharLegenda(st, t, LEG, tempos, 1640); },
};
