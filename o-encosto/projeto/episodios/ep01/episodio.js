// IMAGINE TER UM IRMÃO QUE É UM ENCOSTO PROFISSIONAL — Contos Épicos (3D)
import { sstep, win, clamp } from '../../motor/base.js';
import { W, H } from '../../motor/estudio.js';
import { c1, c2, c3, c4 } from './cenas.js';

const tempos = await (await fetch(new URL('./tempos.json', import.meta.url))).json();
const grito = t => tempos.falas.some(f => /[A-Z]{5}/.test(f.texto) && f.quem !== 'Pedro' && t >= f.inicio && t < f.fim);

export default {
  tempos, duracao: tempos.duracao,
  cenas: [c1, c2, c3, c4],
  composicao(st, t, idx) {
    const c = st.ctx;
    // gritos: pulso vermelho
    if (grito(t)) st.overlay('#ff2a2a', 0.05 + 0.07 * Math.abs(Math.sin(t * 10)));
    // o copo como "cena do crime"
    const crime = win(t, 12.6, 13.0, 14.1, 14.4); if (crime > 0) { st.vignette(0.75 * crime); c.save(); c.globalCompositeOperation = 'multiply'; c.globalAlpha = 0.25 * crime; c.fillStyle = '#7a8ab8'; c.fillRect(0, 0, W, H); c.restore(); }
    // milagre: barras de cinema, brilho dourado
    const epico = win(t, 30.4, 30.8, 36.8, 37.3); if (epico > 0) { st.bars(epico); c.save(); c.globalCompositeOperation = 'soft-light'; c.globalAlpha = 0.4 * epico; c.fillStyle = '#ffc060'; c.fillRect(0, 0, W, H); c.restore(); }
    st.vignette(0.3);
    st.overlay('#000', 1 - sstep(0, 0.5, t));
    for (const a of [11.0, 23.9, 30.4, 48.6]) st.overlay('#000', win(t, a - 0.3, a - 0.05, a + 0.05, a + 0.35));
    st.overlay('#ffffff', win(t, 30.3, 30.4, 30.45, 30.8) * 0.8);
    st.grain(idx, 0.025);
    st.overlay('#000', sstep(tempos.duracao - 1.0, tempos.duracao, t));
  },
};
