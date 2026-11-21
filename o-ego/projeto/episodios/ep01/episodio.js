// E SE VOCÊ TIVESSE EGO DEMAIS? — Contos Épicos
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
    // começa vivo e quente; vai esfriando até o fim
    const vivo = 1 - sstep(25, 50, t), frio = sstep(30, 62, t);
    c.save();
    c.globalCompositeOperation = 'soft-light'; c.globalAlpha = 0.35 * vivo; c.fillStyle = '#ffb040'; c.fillRect(0, 0, W, H);
    c.globalCompositeOperation = 'multiply'; c.globalAlpha = 0.3 * frio; c.fillStyle = '#8aa0d0'; c.fillRect(0, 0, W, H);
    c.restore();
    st.vignette(0.3 + frio * 0.25);
    st.overlay('#000', 1 - sstep(0, 0.5, t));
    for (const [a, cor, dir] of [[14.6, '#2a1a1a', 1], [29.6, '#1a1a2a', -1], [44.6, '#0a0c18', 1], [61.6, '#06080e', -1], [75.0, '#0a0e1a', 1]])
      st.wipe(clamp((t - a) / 0.3) + clamp((t - a - 0.35) / 0.3), cor, dir);
    for (const a of [5, 10, 34.4, 38.6, 50.5, 55.5, 80.4, 84.4]) st.overlay('#000', win(t, a - 0.2, a - 0.05, a + 0.05, a + 0.25));
    st.grain(idx, 0.04);
    const pop = easeBack(clamp((t - 0.5) / 0.45));
    st.text('E SE VOCÊ TIVESSE', W / 2, 300, { size: 82, fill: '#ffffff', alpha: win(t, 0.5, 0.9, 4.2, 4.7), scale: 0.6 + 0.4 * pop, lw: 18 });
    st.text('EGO DEMAIS?', W / 2, 430, { size: 140, fill: '#ffcf3a', alpha: win(t, 0.8, 1.2, 4.2, 4.7), scale: 0.6 + 0.4 * easeBack(clamp((t - 0.8) / 0.45)), lw: 24, glow: 'rgba(255,200,60,0.7)' });
    st.overlay('#000', sstep(87.2, 87.6, t));
    if (t >= tempos.preto_final) {
      st.overlay('#000', 1);
      const f0 = tempos.texto_final_tela[0];
      st.text('SEU EGO ESTÁ PROTEGENDO', W / 2, 840, { size: 66, fill: '#ffffff', alpha: sstep(f0, f0 + 0.3, t), lw: 12 });
      st.text('SUA AUTOESTIMA...', W / 2, 940, { size: 66, fill: '#ffffff', alpha: sstep(f0 + 0.2, f0 + 0.5, t), lw: 12 });
      st.text('OU DESTRUINDO', W / 2, 1060, { size: 74, fill: '#ffcf3a', alpha: sstep(f0 + 0.5, f0 + 0.8, t), lw: 14 });
      st.text('SUAS RELAÇÕES?', W / 2, 1160, { size: 74, fill: '#ffcf3a', alpha: sstep(f0 + 0.6, f0 + 0.9, t), lw: 14 });
    }
  },
  legenda(st, t) { if (t < tempos.preto_final) desenharLegenda(st, t, LEG, tempos, 1540); },
};
