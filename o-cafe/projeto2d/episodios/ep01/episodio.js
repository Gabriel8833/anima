// E SE VOCÊ VOLTASSE PRA INFÂNCIA SENDO O CAFÉ COM LEITE? — 2D
import { sstep, win, clamp } from '../../motor/base.js';
import { c1, c2, c3, c4, c5, c6, c7 } from './cenas/cenas.js';
import { blocosLegenda, desenharLegenda } from '../../motor/serie.js';

const tempos = await (await fetch(new URL('./tempos.json', import.meta.url))).json();
tempos.tela_preta = 999;
const LEG = blocosLegenda(tempos);
const cortes = [c2, c3, c4, c5, c6, c7].map(c => c.inicio);
const S = id => tempos.narracao.find(n => n.id === id);

export default {
  tempos, duracao: tempos.duracao,
  cenas: [c1, c2, c3, c4, c5, c6, c7],
  composicao(st, t, idx) {
    st.vignette(0.25);
    st.grain(idx, 0.035);
    st.overlay('#000', 1 - sstep(0, 0.5, t));
    for (const a of cortes) st.wipe((t - a + 0.25) / 0.25, '#f4c430', 1);
    // cortes rápidos dentro da montagem
    for (const id of ['4b', '4c']) { const a = S(id).inicio - 0.1; st.overlay('#ffffff', win(t, a - 0.08, a, a, a + 0.12) * 0.8); }
    st.overlay('#000', sstep(tempos.duracao - 1.4, tempos.duracao, t));
  },
  legenda(st, t) { desenharLegenda(st, t, LEG, tempos, 1660); },
};
