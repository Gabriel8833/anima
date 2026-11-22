// GABRIEL GANLEY — UM SONHO QUE DEIXOU SUA MARCA (homenagem)
import { sstep, win, clamp, easeBack } from '../../motor/base.js';
import { W, H } from '../../motor/estudio.js';
import { blocosLegenda, desenharLegenda } from '../../motor/serie.js';
import { c1, c2, c3, c4, c5 } from './cenas/cenas.js';

const tempos = await (await fetch(new URL('./tempos.json', import.meta.url))).json();
const LEG = blocosLegenda(tempos);

export default {
  tempos, duracao: tempos.duracao,
  cenas: [c1, c2, c3, c4, c5],
  composicao(st, t, idx) {
    const c = st.c;
    const quente = (1 - sstep(60, 64, t)) + sstep(100, 110, t) * 0.6, frio = sstep(61, 65, t) * (1 - sstep(88, 96, t) * 0.7);
    c.save();
    c.globalCompositeOperation = 'soft-light'; c.globalAlpha = 0.3 * clamp(quente); c.fillStyle = '#ffb860'; c.fillRect(0, 0, W, H);
    c.globalCompositeOperation = 'saturation'; c.globalAlpha = 0.5 * frio; c.fillStyle = '#808080'; c.fillRect(0, 0, W, H);
    c.globalCompositeOperation = 'multiply'; c.globalAlpha = 0.2 * frio; c.fillStyle = '#8a9ab8'; c.fillRect(0, 0, W, H);
    c.restore();
    st.vignette(0.35 + frio * 0.2);
    st.overlay('#000', 1 - sstep(0, 0.8, t));
    for (const [a, cor] of [[13.7, '#0a0a0e'], [37.6, '#0a0a0e'], [61.4, '#000000'], [85.0, '#000000']]) st.overlay(cor, win(t, a - 0.3, a, a + 0.1, a + 0.5));
    for (const a of [4.2, 9, 20.6, 26.6, 32.4, 44.6, 50, 55.2, 68.4, 75.4, 92.4, 97.4, 101, 108.6]) st.overlay('#000', win(t, a - 0.25, a - 0.05, a + 0.05, a + 0.3));
    st.grain(idx, 0.04);
    st.text('GABRIEL GANLEY', W / 2, 300, { size: 104, fill: '#ffffff', alpha: win(t, 0.8, 1.4, 3.6, 4.1), lw: 18 });
    st.text('UM SONHO QUE DEIXOU SUA MARCA', W / 2, 400, { size: 50, fill: '#ffd060', alpha: win(t, 1.2, 1.8, 3.6, 4.1), lw: 10 });
    st.overlay('#000', sstep(115.4, 116.2, t));
    if (t >= tempos.preto_final) {
      st.overlay('#000', 1);
      const f0 = tempos.texto_final_tela[0];
      st.text('QUE OS SEUS SONHOS', W / 2, 840, { size: 72, fill: '#ffffff', alpha: sstep(f0, f0 + 0.6, t), lw: 12 });
      st.text('SEJAM GRANDES,', W / 2, 950, { size: 72, fill: '#ffffff', alpha: sstep(f0 + 0.4, f0 + 1.0, t), lw: 12 });
      st.text('MAS QUE SUA VIDA', W / 2, 1080, { size: 72, fill: '#ffd060', alpha: sstep(f0 + 0.9, f0 + 1.5, t), lw: 12 });
      st.text('SEJA AINDA MAIOR.', W / 2, 1190, { size: 72, fill: '#ffd060', alpha: sstep(f0 + 1.2, f0 + 1.8, t), lw: 12 });
    }
  },
  legenda(st, t) { if (t < tempos.preto_final) desenharLegenda(st, t, LEG, tempos, 1580); },
};
