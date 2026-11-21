// E SE VOCÊ TIVESSE DEPENDÊNCIA EMOCIONAL EM UM RELACIONAMENTO TÓXICO? — Contos Épicos
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
    // quente no começo, frio no sofrimento, suave no final
    const quente = (1 - sstep(13, 17, t)) + (t > 46.6 && t < 51.6 ? 0.5 : 0) + sstep(74, 86, t) * 0.5;
    const frio = sstep(13, 20, t) * (1 - sstep(72, 84, t) * 0.7);
    c.save();
    c.globalCompositeOperation = 'soft-light'; c.globalAlpha = 0.35 * clamp(quente); c.fillStyle = '#ffa850'; c.fillRect(0, 0, W, H);
    c.globalCompositeOperation = 'multiply'; c.globalAlpha = 0.32 * frio; c.fillStyle = '#8a9ed0'; c.fillRect(0, 0, W, H);
    c.restore();
    st.vignette(0.3 + frio * 0.25);
    st.overlay('#000', 1 - sstep(0, 0.6, t));
    for (const [a, cor, dir] of [[13.9, '#1a1420', 1], [26.1, '#10141e', -1], [41.7, '#0c1018', 1], [56.9, '#06080e', -1], [70.1, '#1a1a2a', 1]])
      st.wipe(clamp((t - a) / 0.3) + clamp((t - a - 0.35) / 0.3), cor, dir);
    for (const a of [4.2, 7.6, 11, 18.6, 22.4, 31, 33.4, 61.6, 66.4, 80.6]) st.overlay('#000', win(t, a - 0.2, a - 0.05, a + 0.05, a + 0.25));
    st.grain(idx, 0.045);
    const pop = easeBack(clamp((t - 0.5) / 0.45));
    st.text('E SE VOCÊ TIVESSE', W / 2, 250, { size: 64, fill: '#ffffff', alpha: win(t, 0.5, 0.9, 3.6, 4.1), scale: 0.6 + 0.4 * pop, lw: 14 });
    st.text('DEPENDÊNCIA EMOCIONAL', W / 2, 350, { size: 76, fill: '#ff9a8a', alpha: win(t, 0.7, 1.1, 3.6, 4.1), scale: 0.6 + 0.4 * easeBack(clamp((t - 0.7) / 0.45)), lw: 16 });
    st.text('EM UM RELACIONAMENTO TÓXICO?', W / 2, 446, { size: 56, fill: '#ffffff', alpha: win(t, 0.9, 1.3, 3.6, 4.1), lw: 12 });
    st.overlay('#000', sstep(87.2, 87.6, t));
    if (t >= tempos.preto_final) {
      st.overlay('#000', 1);
      const f0 = tempos.texto_final_tela[0];
      st.text('NÃO SE ABANDONE', W / 2, 860, { size: 82, fill: '#ffffff', alpha: sstep(f0, f0 + 0.4, t), lw: 14 });
      st.text('TENTANDO IMPEDIR QUE', W / 2, 970, { size: 66, fill: '#ffffff', alpha: sstep(f0 + 0.25, f0 + 0.65, t), lw: 12 });
      st.text('ALGUÉM VÁ EMBORA.', W / 2, 1080, { size: 82, fill: '#ffd0a0', alpha: sstep(f0 + 0.5, f0 + 0.9, t), lw: 14 });
    }
  },
  legenda(st, t) { if (t < tempos.preto_final) desenharLegenda(st, t, LEG, tempos, 1560); },
};
