// POR QUE OLHAMOS PARA CIMA QUANDO TENTAMOS LEMBRAR? — 2D, 60 s
import { sstep, win, clamp } from '../../motor/base.js';
import { W, H } from '../../motor/estudio.js';
import { c1, c2, c3, c4, c5, c6 } from './cenas/cenas.js';
import { blocosLegenda, desenharLegenda } from '../../motor/serie.js';

const tempos = await (await fetch(new URL('./tempos.json', import.meta.url))).json();
tempos.tela_preta = 57.2;
const LEG = blocosLegenda(tempos);

export default {
  tempos, duracao: tempos.duracao,
  cenas: [c1, c2, c3, c4, c5, c6],
  composicao(st, t, idx) {
    st.vignette(0.22);
    st.grain(idx, 0.03);
    st.overlay('#000', 1 - sstep(0, 0.5, t));
    st.overlay('#ffffff', win(t, 11.3, 11.4, 11.45, 11.6) * 0.8);          // corte para o rosto
    st.overlay('#fff4d0', win(t, 15.6, 15.85, 15.95, 16.3));               // saída da pupila
    st.wipe((t - 32.6) / 0.35, '#2f7fe0', 1);                        // volta para a sala
    st.overlay('#ffffff', win(t, 57.05, 57.15, 57.25, 57.45) * 0.9);       // corte para a tela final
    st.overlay('#000', sstep(59.5, 60, t));
  },
  legenda(st, t) { desenharLegenda(st, t, LEG, tempos, 1600); },
};
