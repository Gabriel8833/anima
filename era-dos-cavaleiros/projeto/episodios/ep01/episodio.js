// COMO SERIA SE VOCÊ NASCESSE NA ERA DOS CAVALEIROS? — vídeo narrado em 2D cartoon
import { sstep, win, clamp, easeBack } from '../../motor/base.js';
import { W, H } from '../../motor/estudio.js';
import { blocosLegenda, desenharLegenda } from '../../motor/serie.js';
import { faixa } from '../../motor/extras.js';
import { c1, c2 } from './cenas/c1_c2.js';
import { c3, c4 } from './cenas/c3_c4.js';
import { c5, c6 } from './cenas/c5_c6.js';

const tempos = await (await fetch(new URL('./tempos.json', import.meta.url))).json();
const LEG = blocosLegenda(tempos);
const CAPITULOS = [[5.2, 'SEU NASCIMENTO'], [12.3, 'SUA INFÂNCIA'], [25.3, 'SEU SONHO'], [38.3, 'SEU TREINAMENTO'], [51.3, 'SUA PRIMEIRA BATALHA'], [66.3, 'SEU DESTINO']];

export default {
  tempos, duracao: tempos.duracao,
  cenas: [c1, c2, c3, c4, c5, c6],
  composicao(st, t, idx) {
    st.vignette(0.3);
    st.overlay('#000', 1 - sstep(0, 0.5, t));
    for (const [a, cor, dir] of [[11.6, '#f2deb0', 1], [16.7, '#f2deb0', -1], [20.7, '#f2deb0', 1], [24.6, '#f2deb0', -1], [37.6, '#f2deb0', 1], [50.6, '#2a2a3a', -1], [65.6, '#2a1a3a', 1]])
      st.wipe(clamp((t - a) / 0.35) + clamp((t - a - 0.4) / 0.35), cor, dir);
    st.grain(idx, 0.025);
    // título de abertura
    const ta = win(t, 0.5, 0.9, 4.4, 4.9), pop = easeBack(clamp((t - 0.5) / 0.45));
    st.text('COMO SERIA SE VOCÊ', W / 2, 300, { size: 84, fill: '#ffffff', alpha: ta, scale: 0.6 + 0.4 * pop, lw: 18 });
    st.text('NASCESSE NA ERA', W / 2, 400, { size: 84, fill: '#ffffff', alpha: ta, scale: 0.6 + 0.4 * pop, lw: 18 });
    st.text('DOS CAVALEIROS?', W / 2, 510, { size: 100, fill: '#ffd23a', alpha: win(t, 0.8, 1.2, 4.4, 4.9), scale: 0.6 + 0.4 * easeBack(clamp((t - 0.8) / 0.45)), lw: 20 });
    for (const [a, txt] of CAPITULOS) faixa(st, t, a, txt);
    // pergunta final
    const [f0] = tempos.texto_final_tela;
    if (t > f0) {
      st.overlay('#000', sstep(f0, f0 + 0.5, t) * 0.55);
      const k = (d) => 0.6 + 0.4 * easeBack(clamp((t - f0 - d) / 0.45));
      st.text('VOCÊ SOBREVIVERIA', W / 2, 820, { size: 96, fill: '#ffffff', alpha: sstep(f0, f0 + 0.3, t), scale: k(0), lw: 20 });
      st.text('À IDADE MÉDIA?', W / 2, 950, { size: 120, fill: '#ffd23a', alpha: sstep(f0 + 0.3, f0 + 0.6, t), scale: k(0.3) * (1 + 0.03 * Math.sin(t * 6)), lw: 22 });
      st.text('COMENTE AQUI EMBAIXO!', W / 2, 1110, { size: 54, fill: '#ffffff', alpha: sstep(f0 + 1.2, f0 + 1.6, t), lw: 12 });
    }
  },
  legenda(st, t) { if (t < tempos.texto_final_tela[0]) desenharLegenda(st, t, LEG, tempos, 1500); },
};
