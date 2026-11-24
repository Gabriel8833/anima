// O PIOR NATAL DA MINHA VIDA — 2D (cartoon adulto)
import { sstep, win, clamp } from '../../motor/base.js';
import { c1, c2, c3, c4, c5, c6, c7 } from './cenas/cenas.js';
import { blocosLegenda, desenharLegenda } from '../../motor/serie.js';

const tempos = await (await fetch(new URL('./tempos.json', import.meta.url))).json();
tempos.tela_preta = tempos.duracao - 0.12;
const LEG = blocosLegenda(tempos);
const S = id => tempos.narracao.find(n => n.id === id);

export default {
  tempos, duracao: tempos.duracao,
  cenas: [c1, c2, c3, c4, c5, c6, c7],
  composicao(st, t, idx) {
    const c = st.c;
    // gradação de cor quente/madura
    c.save(); c.globalCompositeOperation = 'soft-light'; c.globalAlpha = 0.3; c.fillStyle = '#ff9a4a'; c.fillRect(0, 0, 1080, 1920); c.restore();
    st.vignette(0.5);
    st.grain(idx, 0.045);
    st.overlay('#000', 1 - sstep(0, 0.4, t));
    // cortes secos com flash curto nas piadas
    for (const id of ['2c', '3c', '4b', '6c']) { const a = S(id).inicio; st.overlay('#ffffff', win(t, a - 0.04, a, a + 0.02, a + 0.12) * 0.6); }
    for (const a of [c2, c3, c4, c5, c6, c7].map(k => k.inicio)) st.overlay('#000', win(t, a - 0.08, a, a, a + 0.08) * 0.9);
    if (t >= tempos.duracao - 0.12) st.overlay('#000', 1);
  },
  legenda(st, t) { desenharLegenda(st, t, LEG, tempos, 1680); },
};
