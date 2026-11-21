// O ÚLTIMO DESPERTAR — Episódio 1: O Garoto Sem Poder (canal Contos Épicos)
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
    st.vignette(0.32 + sstep(48, 50, t) * 0.25);
    for (const [a, cor, dir] of [[8.6, '#f2deb0', 1], [17.6, '#f2deb0', -1], [26.6, '#2f5ab8', 1], [36.6, '#2a2a5a', -1]])
      st.wipe(clamp((t - a) / 0.35) + clamp((t - a - 0.4) / 0.35), cor, dir);
    st.overlay('#ffffff', win(t, 49.45, 49.55, 49.6, 49.75));   // estalo antes do apagão
    st.grain(idx, 0.03);
    // marca da série logo no início (sem atrasar o gancho)
    const ta = win(t, 0.2, 0.5, 2.8, 3.3);
    st.text('O ÚLTIMO DESPERTAR', W / 2, 250, { size: 84, fill: '#e6dcff', alpha: ta, scale: 0.7 + 0.3 * easeBack(clamp((t - 0.2) / 0.4)), lw: 18, glow: 'rgba(150,110,255,0.8)' });
    st.text('EPISÓDIO 1 · O GAROTO SEM PODER', W / 2, 340, { size: 44, fill: '#ffffff', alpha: ta, lw: 10 });
    for (const [a, txt] of [[18.2, '8 ANOS'], [21.2, '12 ANOS'], [24.2, '15 ANOS'], [37.2, 'A AVALIAÇÃO']]) faixa(st, t, a, txt, 2.4);
    if (t >= tempos.preto_final) {
      st.overlay('#000', 1);
      const f0 = tempos.texto_final_tela[0];
      st.text('O ÚLTIMO DESPERTAR', W / 2, 860, { size: 96, fill: '#e6dcff', alpha: sstep(f0, f0 + 0.4, t), scale: 0.8 + 0.2 * easeBack(clamp((t - f0) / 0.5)), lw: 18, glow: 'rgba(150,110,255,0.8)' });
      st.text('EPISÓDIO 2 EM BREVE', W / 2, 990, { size: 64, fill: '#ffffff', alpha: sstep(f0 + 0.4, f0 + 0.8, t), lw: 12 });
      st.text('CONTOS ÉPICOS', W / 2, 1110, { size: 40, fill: '#ffd23a', alpha: sstep(f0 + 0.8, f0 + 1.2, t), lw: 8 });
    }
  },
  legenda(st, t) { if (t < tempos.preto_final) desenharLegenda(st, t, LEG, tempos, 1520); },
};
