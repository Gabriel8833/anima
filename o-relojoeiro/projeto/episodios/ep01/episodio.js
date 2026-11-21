// E SE VOCÊ FOSSE O RELOJOEIRO? — Contos Épicos (história original)
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
    st.vignette(0.35 + sstep(58, 73, t) * 0.2);
    st.overlay('#000', 1 - sstep(0, 0.5, t));
    for (const [a, cor, dir] of [[2.6, '#2a2020', 1], [5.6, '#c8a040', -1], [10.1, '#1a1e24', 1], [14.6, '#000000', -1], [19.6, '#2a2020', 1], [23.6, '#000000', -1], [27.6, '#1a1e24', 1], [42.6, '#1a1e24', -1], [46.6, '#c8a040', 1], [51.1, '#000000', -1], [57.6, '#2a1a12', 1], [61.6, '#2a2020', -1], [66.1, '#2a2020', 1], [72.6, '#0a0c14', -1], [79.6, '#1a1210', 1], [83.1, '#000000', -1], [85.6, '#0a0c14', 1]])
      st.wipe(clamp((t - a) / 0.3) + clamp((t - a - 0.35) / 0.3), cor, dir);
    st.overlay('#ffffff', win(t, 53.9, 54.0, 54.05, 54.4) * 0.7);
    // gradação de cor de cinema: amarelo quente no deserto e de dia, mais frio e verde à noite
    const quente = t < 10.1 ? 1 : t < 14.6 ? 0.25 : t < 24 ? 0.7 : t < 28 ? 0.3 : t < 43 ? 0.2 : t < 47 ? 1 : t < 58 ? 0.35 : t < 66.1 ? 0.45 : t < 73 ? 0.2 : t < 86 ? 0.25 : 0.9;
    { const c = st.c; c.save(); c.globalCompositeOperation = 'soft-light'; c.globalAlpha = 0.55 * quente; c.fillStyle = '#ffb000'; c.fillRect(0, 0, W, H); c.globalCompositeOperation = 'multiply'; c.globalAlpha = 0.22 * quente; c.fillStyle = '#ffd070'; c.fillRect(0, 0, W, H); c.globalAlpha = 0.18 * (1 - quente); c.fillStyle = '#9ac0b0'; c.fillRect(0, 0, W, H); c.restore(); }
    st.grain(idx, 0.05);
    const ta = win(t, 0.4, 0.8, 4.0, 4.5), pop = easeBack(clamp((t - 0.4) / 0.45));
    st.text('E SE VOCÊ FOSSE', W / 2, 300, { size: 84, fill: '#ffffff', alpha: ta, scale: 0.6 + 0.4 * pop, lw: 18 });
    st.text('O RELOJOEIRO?', W / 2, 420, { size: 120, fill: '#d8b040', alpha: win(t, 0.7, 1.1, 4.0, 4.5), scale: 0.6 + 0.4 * easeBack(clamp((t - 0.7) / 0.45)), lw: 22 });
    st.overlay('#000', sstep(87.4, 88.0, t));
    if (t >= tempos.preto_final) {
      st.overlay('#000', 1);
      const f0 = tempos.texto_final_tela[0];
      st.text('O PODER PODE REVELAR', W / 2, 900, { size: 74, fill: '#ffffff', alpha: sstep(f0, f0 + 0.4, t), lw: 14 });
      st.text('QUEM VOCÊ REALMENTE É.', W / 2, 1010, { size: 74, fill: '#d8b040', alpha: sstep(f0 + 0.3, f0 + 0.7, t), lw: 14 });
    }
  },
  legenda(st, t) { if (t < tempos.preto_final) desenharLegenda(st, t, LEG, tempos, 1520); },
};
