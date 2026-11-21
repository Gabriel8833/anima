// EPISÓDIO 3 (FINAL) — O Livro Proibido: O Último Feitiço
import { sstep, win, clamp } from '../../motor/base.js';
import { blocosLegenda, desenharLegenda, tituloAbertura, telaFinal } from '../../motor/serie.js';
import parte1 from './cenas/c1_c2_c3.js';
import parte2 from './cenas/c4_c5_c6.js';

const tempos = await (await fetch(new URL('./tempos.json', import.meta.url))).json();
const LEG = blocosLegenda(tempos);

export default {
  tempos, duracao: tempos.duracao,
  cenas: [parte1, parte2],
  composicao(st, t, idx) {
    st.vignette(0.4);
    st.overlay('#000', 1 - sstep(0, 0.6, t));
    st.wipe(clamp((t - 11.6) / 0.4) + clamp((t - 12.0) / 0.4), '#2a0a1a', 1);          // 1 → 2
    st.wipe(clamp((t - 23.6) / 0.4) + clamp((t - 24.0) / 0.4), '#1a0610', -1);         // 2 → 3
    st.wipe(clamp((t - 37.6) / 0.4) + clamp((t - 38.0) / 0.4), '#2a1a4a', 1);          // 3 → 4
    st.overlay('#ffffff', win(t, 53.8, 54.0, 54.2, 55.4));                              // o livro se desfaz
    st.overlay('#fff6d8', win(t, 56.7, 56.95, 57.05, 57.4) + win(t, 60.2, 60.45, 60.55, 60.9));
    st.overlay('#000', win(t, 63.6, 63.95, 64.05, 64.5));
    st.overlay('#000', sstep(73.2, 74.0, t));
    st.grain(idx, 0.03);
    tituloAbertura(st, t, tempos, 1.0, 4.6);
    telaFinal(st, t, tempos);
  },
  legenda(st, t) { desenharLegenda(st, t, LEG, tempos); },
};
