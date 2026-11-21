// E SE VOCÊ SOBREVIVESSE A UMA GUERRA NUCLEAR? — vídeo narrado em 2D cartoon
import { sstep, win, clamp, easeBack } from '../../motor/base.js';
import { W, H } from '../../motor/estudio.js';
import { blocosLegenda, desenharLegenda } from '../../motor/serie.js';
import { c1, c2, c3 } from './cenas/c1_c2_c3.js';
import { c4, c5, c6, c7 } from './cenas/c4_c7.js';

const tempos = await (await fetch(new URL('./tempos.json', import.meta.url))).json();
const LEG = blocosLegenda(tempos);

export default {
  tempos, duracao: tempos.duracao,
  cenas: [c1, c2, c3, c4, c5, c6, c7],
  composicao(st, t, idx) {
    st.vignette(0.35);
    st.overlay('#000', 1 - sstep(0, 0.5, t));
    for (const [a, cor, dir] of [[5.6, '#f2c230', 1], [11.6, '#2a1a14', -1], [23.6, '#8a5a3a', 1], [46.6, '#3a2418', -1], [58.6, '#1a1210', 1], [69.6, '#120a0a', -1]])
      st.wipe(clamp((t - a) / 0.35) + clamp((t - a - 0.4) / 0.35), cor, dir);
    st.overlay('#000', win(t, 34.4, 34.9, 35.0, 35.2));
    st.grain(idx, 0.045);
    // título
    const ta = win(t, 0.4, 0.8, 4.4, 4.9), pop = easeBack(clamp((t - 0.4) / 0.45));
    st.text('E SE VOCÊ SOBREVIVESSE', W / 2, 300, { size: 78, fill: '#ffffff', alpha: ta, scale: 0.6 + 0.4 * pop, lw: 18 });
    st.text('A UMA GUERRA NUCLEAR?', W / 2, 410, { size: 92, fill: '#f2c230', alpha: win(t, 0.7, 1.1, 4.4, 4.9), scale: 0.6 + 0.4 * easeBack(clamp((t - 0.7) / 0.45)), lw: 20 });
    // tela preta final + pergunta
    if (t >= tempos.preto_final) {
      st.overlay('#000', 1);
      const f0 = tempos.texto_final_tela[0];
      const k = d => 0.6 + 0.4 * easeBack(clamp((t - f0 - d) / 0.45));
      st.text('VOCÊ SOBREVIVERIA', W / 2, 860, { size: 96, fill: '#ffffff', alpha: sstep(f0, f0 + 0.3, t), scale: k(0), lw: 18 });
      st.text('AO FIM DO MUNDO?', W / 2, 990, { size: 110, fill: '#f2c230', alpha: sstep(f0 + 0.3, f0 + 0.6, t), scale: k(0.3) * (1 + 0.03 * Math.sin(t * 6)), lw: 20, glow: 'rgba(242,194,48,0.6)' });
      st.text('COMENTE AQUI EMBAIXO!', W / 2, 1150, { size: 52, fill: '#ffffff', alpha: sstep(f0 + 1.2, f0 + 1.6, t), lw: 12 });
    }
  },
  legenda(st, t) { if (t < tempos.preto_final) desenharLegenda(st, t, LEG, tempos, 1500); },
};
