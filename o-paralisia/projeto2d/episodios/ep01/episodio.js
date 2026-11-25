// PARALISIA DO SONO — curta de terror psicológico 2D
import { sstep, win, clamp, noise1 } from '../../motor/base.js';
import { c1, c2, c3, c4, c5, c6, c7 } from './cenas/cenas.js';
import { blocosLegenda, desenharLegenda } from '../../motor/serie.js';

const tempos = await (await fetch(new URL('./tempos.json', import.meta.url))).json();
tempos.tela_preta = tempos.duracao - 0.55;
const LEG = blocosLegenda(tempos);
const S = id => tempos.narracao.find(n => n.id === id);
const T_DIST = S('5b').inicio + 8.0;

function distorce(st, amp, t) {
  if (amp <= 0.001) return;
  const c = st.c, cv = c.canvas, n = 48, h = Math.ceil(cv.height / n);
  c.save(); c.setTransform(1, 0, 0, 1, 0, 0);
  for (let i = 0; i < n; i++) { const dx = (Math.sin(t * 23 + i * 0.7) + noise1(t * 11 + i)) * amp * cv.width * 0.016; if (Math.abs(dx) > 0.5) c.drawImage(cv, 0, i * h, cv.width, h, dx, i * h, cv.width, h); }
  c.restore();
}

export default {
  tempos, duracao: tempos.duracao,
  cenas: [c1, c2, c3, c4, c5, c6, c7],
  composicao(st, t, idx) {
    const c = st.c;
    // gradação fria e dessaturada
    c.save(); c.globalCompositeOperation = 'saturation'; c.globalAlpha = 0.55; c.fillStyle = '#808080'; c.fillRect(0, 0, 1080, 1920); c.restore();
    c.save(); c.globalCompositeOperation = 'multiply'; c.globalAlpha = 0.45; c.fillStyle = '#5a6a9a'; c.fillRect(0, 0, 1080, 1920); c.restore();
    // distorções da alucinação
    distorce(st, sstep(T_DIST, T_DIST + 0.3, t) * (1 - sstep(c6.inicio - 0.1, c6.inicio, t)) + win(t, 40.9, 41.0, 41.05, 41.15) * 0.6, t);
    st.vignette(0.7);
    st.grain(idx, 0.07);
    // leve tremulação de luz
    st.overlay('#000', 0.06 + 0.05 * Math.max(0, noise1(t * 3)));
    st.overlay('#000', 1 - sstep(0.15, 1.6, t));
    if (t >= tempos.duracao - 0.55) st.overlay('#000', 1);
  },
  legenda(st, t) { desenharLegenda(st, t, LEG, tempos, 1700); },
};
