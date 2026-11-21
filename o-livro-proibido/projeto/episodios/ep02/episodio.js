// EPISÓDIO 2 — O Livro Proibido: A Página Arrancada
import { sstep, win, clamp } from '../../motor/base.js';
import { blocosLegenda, desenharLegenda, tituloAbertura, telaFinal } from '../../motor/serie.js';
import { c1, c2 } from './cenas/c1_c2.js';
import { c3, c4 } from './cenas/c3_c4.js';
import { c5, c6 } from './cenas/c5_c6.js';

const tempos = await (await fetch(new URL('./tempos.json', import.meta.url))).json();
const LEG = blocosLegenda(tempos);

export default {
  tempos, duracao: tempos.duracao,
  cenas: [c1, c2, c3, c4, c5, c6],
  composicao(st, t, idx) {
    st.vignette(0.4);
    st.overlay('#000', 1 - sstep(0, 0.6, t));
    st.wipe(clamp((t - 11.6) / 0.4) + clamp((t - 12.0) / 0.4), '#1a1430', 1);       // 1 → 2
    st.overlay('#ff2010', win(t, 23.6, 23.95, 24.05, 24.5));                          // clarão vermelho → reino
    st.wipe(clamp((t - 35.6) / 0.4) + clamp((t - 36.0) / 0.4), '#3a0610', -1);       // reino → câmara
    st.overlay('#000', win(t, 63.5, 63.95, 64.05, 64.6));                             // → penhasco
    st.grain(idx, 0.03);
    tituloAbertura(st, t, tempos, 1.0, 4.6);
    telaFinal(st, t, tempos);
  },
  legenda(st, t) { desenharLegenda(st, t, LEG, tempos); },
};
