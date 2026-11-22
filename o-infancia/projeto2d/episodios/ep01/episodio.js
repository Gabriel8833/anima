// E SE VOCÊ PUDESSE VOLTAR À SUA INFÂNCIA? — versão 2D (sem legendas na imagem)
import { sstep, win, clamp } from '../../motor/base.js';
import { W, H } from '../../motor/estudio.js';
import { c1, c2, c3, c4, c5 } from './cenas/cenas.js';
import { blocosLegenda, desenharLegenda } from '../../motor/serie.js';

const tempos = await (await fetch(new URL('./tempos.json', import.meta.url))).json();
tempos.tela_preta = 999;
const LEG = blocosLegenda(tempos);

export default {
  tempos, duracao: tempos.duracao,
  cenas: [c1, c2, c3, c4, c5],
  composicao(st, t, idx) {
    const c = st.c;
    const memoria = sstep(3.2, 3.8, t) * (1 - sstep(48.0, 48.8, t)), presente = sstep(48.0, 48.8, t);
    c.save();
    c.globalCompositeOperation = 'soft-light'; c.globalAlpha = 0.4 * memoria; c.fillStyle = '#ffb040'; c.fillRect(0, 0, W, H);
    c.globalCompositeOperation = 'multiply'; c.globalAlpha = 0.3 * presente; c.fillStyle = '#7a8ab8'; c.fillRect(0, 0, W, H);
    c.restore();
    if (memoria > 0) { const g = c.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.75); g.addColorStop(0, 'rgba(255,220,160,0)'); g.addColorStop(1, `rgba(255,210,140,${0.25 * memoria})`); c.fillStyle = g; c.fillRect(0, 0, W, H); }
    st.vignette(0.3 + presente * 0.25);
    st.overlay('#000', 1 - sstep(0, 1.0, t));
    st.overlay('#fff4d8', win(t, 3.0, 3.35, 3.45, 3.9) * 0.95);
    for (const a of [10, 15, 20, 32, 35.6, 44]) st.overlay('#000', win(t, a - 0.4, a - 0.05, a + 0.05, a + 0.45) * 0.85);
    st.overlay('#fff4d8', win(t, 47.6, 48.3, 48.5, 49.2));
    st.grain(idx, 0.035);
    st.overlay('#000', sstep(57.6, 60, t));
  },
  legenda(st, t) { desenharLegenda(st, t, LEG, tempos, 1560); },
};
