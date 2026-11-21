// A PRISÃO DENTRO DE VOCÊ — Contos Épicos (história original)
import { sstep, win, clamp, easeBack } from '../../motor/base.js';
import { W, H } from '../../motor/estudio.js';
import { blocosLegenda, desenharLegenda } from '../../motor/serie.js';
import { c1, c2, c3, c4, c5, c6 } from './cenas/cenas.js';

const tempos = await (await fetch(new URL('./tempos.json', import.meta.url))).json();
const LEG = blocosLegenda(tempos);

export default {
  tempos, duracao: tempos.duracao,
  cenas: [c1, c2, c3, c4, c5, c6],
  composicao(st, t, idx) {
    const c = st.c;
    // paleta: verde escuro, preto, amarelo envelhecido; vermelho nos momentos de ruptura
    c.save();
    c.globalCompositeOperation = 'multiply'; c.globalAlpha = 0.42; c.fillStyle = '#8aa070'; c.fillRect(0, 0, W, H);
    c.globalCompositeOperation = 'soft-light'; c.globalAlpha = 0.35; c.fillStyle = '#d8b040'; c.fillRect(0, 0, W, H);
    c.globalCompositeOperation = 'saturation'; c.globalAlpha = 0.35; c.fillStyle = '#808080'; c.fillRect(0, 0, W, H);
    c.restore();
    st.vignette(0.6);
    st.overlay('#000', 1 - sstep(0, 0.6, t));
    // cortes secos da rotina e transições de cena
    for (const a of [2.6, 4.6, 6.6, 8.4, 9.6, 10.7, 11.8, 19, 23, 26.6, 32, 37, 47.2, 51.6, 61.4, 65.4]) st.overlay('#000', win(t, a - 0.12, a - 0.04, a + 0.04, a + 0.16));
    for (const [a, dir] of [[14.3, 1], [28.5, -1], [42.5, 1], [57.1, -1], [71.3, 1]]) st.wipe(clamp((t - a) / 0.3) + clamp((t - a - 0.35) / 0.3), '#050605', dir);
    // frames "subliminares" do Outro em vermelho (antes da revelação)
    for (const a of [9.0, 21.0, 35.5]) st.overlay('#5a0a0a', win(t, a, a + 0.02, a + 0.05, a + 0.08) * 0.6);
    st.grain(idx, 0.09);
    // título
    const pop = easeBack(clamp((t - 0.5) / 0.45));
    st.text('A PRISÃO', W / 2, 300, { size: 130, fill: '#e8dcb0', alpha: win(t, 0.5, 0.9, 2.3, 2.6), scale: 0.6 + 0.4 * pop, lw: 18 });
    st.text('DENTRO DE VOCÊ', W / 2, 420, { size: 80, fill: '#c8302a', alpha: win(t, 0.8, 1.2, 2.3, 2.6), lw: 14 });
    st.overlay('#000', sstep(86.8, 88.0, t));
    if (t >= tempos.preto_final) {
      st.overlay('#000', 1);
      const f0 = tempos.texto_final_tela[0];
      st.text('A PRISÃO', W / 2, 900, { size: 120, fill: '#e8dcb0', alpha: sstep(f0, f0 + 0.5, t), lw: 16 });
      st.text('DENTRO DE VOCÊ', W / 2, 1020, { size: 76, fill: '#c8302a', alpha: sstep(f0 + 0.3, f0 + 0.8, t), lw: 12 });
    }
  },
  legenda(st, t) { if (t < tempos.preto_final) desenharLegenda(st, t, LEG, tempos, 1560); },
};
