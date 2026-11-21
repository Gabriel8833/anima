// E SE VOCÊ FOSSE O REI DE MIAMI? — história original de ascensão e queda, 2D cartoon
import { sstep, win, clamp, easeBack } from '../../motor/base.js';
import { W, H } from '../../motor/estudio.js';
import { blocosLegenda, desenharLegenda } from '../../motor/serie.js';
import { faixa } from '../../motor/extras.js';
import { c1, c2, c3, c4, c5, c6 } from './cenas/cenas.js';

const tempos = await (await fetch(new URL('./tempos.json', import.meta.url))).json();
const LEG = blocosLegenda(tempos);

export default {
  tempos, duracao: tempos.duracao,
  cenas: [c1, c2, c3, c4, c5, c6],
  composicao(st, t, idx) {
    st.vignette(0.32);
    st.overlay('#000', 1 - sstep(0, 0.5, t));
    for (const [a, cor, dir] of [[12.6, '#ff6aa8', 1], [18.6, '#1a0e22', -1], [26.6, '#3af0e0', 1], [30.1, '#ff6aa8', -1], [33.6, '#3af0e0', 1], [40.6, '#f2c230', -1], [44.6, '#f6f2ea', 1], [54.6, '#0a0a1a', -1], [68.6, '#2a6aff', 1], [72.6, '#ff2a3a', -1]])
      st.wipe(clamp((t - a) / 0.35) + clamp((t - a - 0.4) / 0.35), cor, dir);
    st.grain(idx, 0.035);
    const ta = win(t, 0.4, 0.8, 4.6, 5.1), pop = easeBack(clamp((t - 0.4) / 0.45));
    st.text('E SE VOCÊ FOSSE', W / 2, 300, { size: 84, fill: '#ffffff', alpha: ta, scale: 0.6 + 0.4 * pop, lw: 18 });
    st.text('O REI DE MIAMI?', W / 2, 420, { size: 120, fill: '#ff6aa8', alpha: win(t, 0.7, 1.1, 4.6, 5.1), scale: 0.6 + 0.4 * easeBack(clamp((t - 0.7) / 0.45)), lw: 22, glow: 'rgba(58,240,224,0.7)' });
    for (const [a, txt] of [[13.3, 'O COMEÇO'], [27.3, 'A ASCENSÃO'], [41.3, 'O IMPÉRIO'], [55.3, 'A PARANOIA'], [69.3, 'A QUEDA']]) faixa(st, t, a, txt, 2.4);
    if (t >= tempos.preto_final) {
      st.overlay('#000', 1);
      const f0 = tempos.texto_final_tela[0], k = d => 0.6 + 0.4 * easeBack(clamp((t - f0 - d) / 0.45));
      st.text('VALEU', W / 2, 860, { size: 150, fill: '#ffffff', alpha: sstep(f0, f0 + 0.3, t), scale: k(0), lw: 24 });
      st.text('A PENA?', W / 2, 1020, { size: 150, fill: '#ff6aa8', alpha: sstep(f0 + 0.3, f0 + 0.6, t), scale: k(0.3) * (1 + 0.03 * Math.sin(t * 6)), lw: 24, glow: 'rgba(255,106,168,0.6)' });
      st.text('COMENTE O QUE VOCÊ FARIA!', W / 2, 1180, { size: 50, fill: '#ffffff', alpha: sstep(f0 + 1.2, f0 + 1.6, t), lw: 12 });
    }
  },
  legenda(st, t) { if (t < tempos.preto_final) desenharLegenda(st, t, LEG, tempos, 1520); },
};
