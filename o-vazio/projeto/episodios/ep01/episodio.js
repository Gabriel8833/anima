// E SE VOCÊ SENTISSE UM VAZIO QUE NÃO CONSEGUE EXPLICAR? — Contos Épicos
import { sstep, win, clamp, easeBack, lerp } from '../../motor/base.js';
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
    // cor: fria e escura no começo, esquentando aos poucos no final (sem exagero)
    const frio = t < 35 || (t >= 37.8 && t < 62) ? 1 : t < 37.8 ? 0.3 : 1 - sstep(62, 70, t);
    const quente = sstep(64, 80, t);
    c.save();
    c.globalCompositeOperation = 'multiply'; c.globalAlpha = 0.3 * frio; c.fillStyle = '#8aa0d8'; c.fillRect(0, 0, W, H);
    c.globalCompositeOperation = 'soft-light'; c.globalAlpha = 0.35 * quente; c.fillStyle = '#ffb050'; c.fillRect(0, 0, W, H);
    c.restore();
    st.vignette(0.5 - quente * 0.2);
    st.overlay('#000', 1 - sstep(0, 0.6, t));
    for (const [a, cor, dir] of [[14.6, '#0a0e1a', 1], [29.6, '#0a0e1a', -1], [44.6, '#04060e', 1], [61.6, '#1a1a30', -1], [77.6, '#ffe0b0', 1]])
      st.wipe(clamp((t - a) / 0.3) + clamp((t - a - 0.35) / 0.3), cor, dir);
    // cortes rápidos da montagem (cena 3): flashes
    for (const a of [32.6, 35, 37.8, 40.4, 42.6]) st.overlay('#ffffff', win(t, a - 0.05, a, a + 0.02, a + 0.18) * 0.5);
    st.overlay('#000', win(t, 4.4, 4.5, 4.6, 4.8) * 0); // (sem corte brusco)
    st.overlay('#000', win(t, 8.7, 8.9, 9.0, 9.3));
    st.overlay('#000', win(t, 20.0, 20.15, 20.25, 20.45) + win(t, 24.4, 24.55, 24.65, 24.85));
    st.overlay('#000', win(t, 50.1, 50.3, 50.35, 50.6) + win(t, 55.3, 55.5, 55.55, 55.8));
    st.overlay('#000', win(t, 66.3, 66.45, 66.55, 66.75) + win(t, 70.3, 70.45, 70.55, 70.75) + win(t, 73.8, 73.95, 74.05, 74.25));
    st.grain(idx, 0.045);
    // título
    const pop = easeBack(clamp((t - 0.5) / 0.45));
    st.text('E SE VOCÊ SENTISSE', W / 2, 260, { size: 74, fill: '#ffffff', alpha: win(t, 0.5, 0.9, 4.0, 4.5), scale: 0.6 + 0.4 * pop, lw: 16 });
    st.text('UM VAZIO QUE NÃO', W / 2, 360, { size: 92, fill: '#9ad0ff', alpha: win(t, 0.8, 1.2, 4.0, 4.5), scale: 0.6 + 0.4 * easeBack(clamp((t - 0.8) / 0.45)), lw: 18 });
    st.text('CONSEGUE EXPLICAR?', W / 2, 466, { size: 92, fill: '#9ad0ff', alpha: win(t, 1.0, 1.4, 4.0, 4.5), scale: 0.6 + 0.4 * easeBack(clamp((t - 1.0) / 0.45)), lw: 18 });
    // texto final sobre o nascer do sol
    const f0 = tempos.texto_final_tela[0];
    if (t > f0 - 0.5) {
      const g = c.createLinearGradient(0, 0, 0, 800); g.addColorStop(0, `rgba(10,8,20,${0.55 * sstep(f0 - 0.5, f0 + 0.5, t)})`); g.addColorStop(1, 'rgba(10,8,20,0)'); c.fillStyle = g; c.fillRect(0, 0, W, 800);
      st.text('VOCÊ JÁ SENTIU UM VAZIO', W / 2, 330, { size: 70, fill: '#ffffff', alpha: sstep(f0, f0 + 0.6, t), lw: 14 });
      st.text('QUE NÃO CONSEGUE EXPLICAR?', W / 2, 430, { size: 70, fill: '#ffe2a8', alpha: sstep(f0 + 0.4, f0 + 1.0, t), lw: 14 });
    }
    st.overlay('#000', sstep(89.4, 90, t) * 0.6);
  },
  legenda(st, t) { if (t < tempos.preto_final) desenharLegenda(st, t, LEG, tempos, 1540); },
};
