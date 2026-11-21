// ABRIGO 47 — vídeo narrado em 2D cartoon, futuro retrô pós-apocalíptico com elementos de jogo
import { sstep, win, clamp, easeBack } from '../../motor/base.js';
import { W, H } from '../../motor/estudio.js';
import { blocosLegenda, desenharLegenda } from '../../motor/serie.js';
import { faixa, avisoJogo } from '../../motor/extras.js';
import { c1, c2, c3 } from './cenas/c1_c3.js';
import { c4, c5, c6, c7 } from './cenas/c4_c7.js';

const tempos = await (await fetch(new URL('./tempos.json', import.meta.url))).json();
const LEG = blocosLegenda(tempos);

export default {
  tempos, duracao: tempos.duracao,
  cenas: [c1, c2, c3, c4, c5, c6, c7],
  composicao(st, t, idx) {
    st.vignette(0.32);
    st.overlay('#000', 1 - sstep(0, 0.5, t));
    for (const [a, cor, dir] of [[6.6, '#5a3a2a', 1], [13.6, '#2a9a9a', -1], [17.1, '#c0502a', 1], [27.6, '#000000', -1], [31.1, '#2a9a9a', 1], [34.6, '#2a9a9a', -1], [38.1, '#2a9a9a', 1], [43.6, '#ff8a2a', -1], [57.6, '#c89a5a', 1], [73.6, '#5a3a22', -1], [93.6, '#c0502a', 1], [98.6, '#3a2a1a', -1], [103.6, '#3a2a1a', 1]])
      st.wipe(clamp((t - a) / 0.35) + clamp((t - a - 0.4) / 0.35), cor, dir);
    st.grain(idx, 0.035);
    // título
    const ta = win(t, 0.4, 0.8, 5.6, 6.2), pop = easeBack(clamp((t - 0.4) / 0.45));
    st.text('ABRIGO 47', W / 2, 330, { size: 150, fill: '#ffb43a', alpha: ta, scale: 0.6 + 0.4 * pop, lw: 24, glow: 'rgba(255,180,58,0.6)' });
    st.text('E SE VOCÊ NASCESSE NO FIM DO MUNDO?', W / 2, 450, { size: 50, fill: '#ffffff', alpha: win(t, 0.9, 1.3, 5.6, 6.2), lw: 12 });
    for (const [a, txt] of [[28.3, 'ANO 1'], [31.6, 'ANO 6'], [35.1, 'ANO 10'], [38.6, 'ANO 20']]) faixa(st, t, a, txt, 2.6);
    avisoJogo(st, t, 46.8, 'NOVA MISSÃO', "CONSERTAR A BOMBA D'ÁGUA", 3.0);
    avisoJogo(st, t, 101.6, 'NOVA MISSÃO', 'ENCONTRAR O ABRIGO 12', 2.4, 260);
    // tela preta + pergunta final
    if (t >= tempos.preto_final) {
      st.overlay('#000', 1);
      const f0 = tempos.texto_final_tela[0], k = d => 0.6 + 0.4 * easeBack(clamp((t - f0 - d) / 0.45));
      st.text('VOCÊ SAIRIA', W / 2, 860, { size: 110, fill: '#ffffff', alpha: sstep(f0, f0 + 0.3, t), scale: k(0), lw: 20 });
      st.text('DO ABRIGO?', W / 2, 1000, { size: 130, fill: '#ffb43a', alpha: sstep(f0 + 0.3, f0 + 0.6, t), scale: k(0.3) * (1 + 0.03 * Math.sin(t * 6)), lw: 22, glow: 'rgba(255,180,58,0.6)' });
      st.text('COMENTE AQUI EMBAIXO!', W / 2, 1160, { size: 52, fill: '#ffffff', alpha: sstep(f0 + 1.2, f0 + 1.6, t), lw: 12 });
    }
  },
  legenda(st, t) { if (t < tempos.preto_final && !(t > 83.4 && t < 88)) desenharLegenda(st, t, LEG, tempos, 1520); },
};
