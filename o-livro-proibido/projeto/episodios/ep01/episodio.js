// EPISÓDIO 1 — O Livro Proibido: A Guerra dos Magos
// Para um novo episódio: copie esta pasta, troque as cenas em ./cenas e ajuste tempos.json.
import { sstep, win, clamp } from '../../motor/base.js';
import { W, H } from '../../motor/estudio.js';
import c1 from './cenas/c1_era_da_magia.js';
import c2 from './cenas/c2_livro_sagrado.js';
import c3, { PLANOS } from './cenas/c3_quatro_magos.js';
import c4 from './cenas/c4_descoberta.js';
import c5 from './cenas/c5_guerra.js';
import c6 from './cenas/c6_final.js';

const tempos = await (await fetch(new URL('./tempos.json', import.meta.url))).json();

export default {
  tempos,
  duracao: tempos.duracao,
  cenas: [c1, c2, c3, c4, c5, c6],
  composicao(st, t, idx) {
    st.vignette(0.6);
    // barras de cinema no começo e no fim
    st.bars(1 - sstep(0.5, 2.5, t) + sstep(61, 62.5, t) * 0.6);
    // transições
    st.overlay('#000', 1 - sstep(0, 1.0, t));                                   // abre do preto
    st.overlay('#000', win(t, 10.4, 10.95, 11.05, 11.6));                       // cena 1 → 2
    st.overlay('#bfe6ff', win(t, 21.75, 21.98, 22.02, 22.35) * 0.9);            // clarão azul → cena 3
    const cores = ['#58b4ff', '#ff2040', '#ffc040', '#a040ff'];
    PLANOS.slice(1, 4).forEach((p, i) => st.overlay(cores[i + 1], win(t, p - 0.12, p - 0.02, p + 0.02, p + 0.2) * 0.75));
    st.overlay('#000', win(t, 33.6, 33.95, 34.05, 34.5));                       // cena 3 → 4
    st.overlay('#ffffff', win(t, 45.8, 45.98, 46.02, 46.3));                    // clarão → guerra
    st.overlay('#ffffff', win(t, 49.6, 49.65, 49.7, 49.95) * 0.7);              // impacto
    st.overlay('#000', win(t, 60.4, 60.95, 61.05, 61.6));                       // guerra → câmara
    st.overlay('#3a0000', sstep(69.8, 72.9, t) * 0.12);                         // tingimento vermelho no final
    st.grain(idx, 0.05);
    // título do episódio
    const ta = win(t, 1.3, 2.3, 4.9, 5.7);
    st.text('O LIVRO PROIBIDO', W / 2, H * 0.2, { size: 88, fill: '#f3e3b8', alpha: ta, glow: 'rgba(255,190,90,0.8)', spacing: 6, scale: 1 + (t - 1.3) * 0.01 });
    st.text('EPISÓDIO 1 · A GUERRA DOS MAGOS', W / 2, H * 0.2 + 92, { size: 38, fill: '#cfe4ff', alpha: win(t, 1.9, 2.8, 4.9, 5.7), spacing: 4, weight: 400, stroke: 'rgba(0,0,0,0.7)' });
    // tela preta + CONTINUA...
    if (t >= tempos.tela_preta) {
      st.overlay('#000', 1);
      const [a, b] = tempos.continua;
      st.text('CONTINUA...', W / 2, H / 2, { size: 92, fill: '#e8e0d0', alpha: sstep(a, a + 0.8, t), spacing: 10, glow: 'rgba(255,40,30,0.55)', stroke: null, scale: 1 + (t - a) * 0.012 });
    }
  },
};
