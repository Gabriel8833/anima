// POR QUE VOCÊ PENSA DEMAIS ANTES DE DORMIR? — 2D, 60 s
import { sstep, win, clamp } from '../../motor/base.js';
import { c1, c2, c3, c4, c5 } from './cenas/cenas.js';
import { blocosLegenda, desenharLegenda } from '../../motor/serie.js';

const tempos = await (await fetch(new URL('./tempos.json', import.meta.url))).json();
tempos.tela_preta = 999;
const LEG = blocosLegenda(tempos);

export default {
  tempos, duracao: tempos.duracao,
  cenas: [c1, c2, c3, c4, c5],
  composicao(st, t, idx) {
    st.vignette(0.32);
    st.grain(idx, 0.03);
    st.overlay('#000', 1 - sstep(0, 0.6, t));
    st.overlay('#ffffff', win(t, 10.0, 10.12, 10.2, 10.45) * 0.5);   // flashback
    st.overlay('#ffffff', win(t, 13.3, 13.4, 13.45, 13.65) * 0.6);   // volta ao quarto
    st.overlay('#000', sstep(59.2, 60, t));
  },
  legenda(st, t) { desenharLegenda(st, t, LEG, tempos, 1640); },
};
