// A VITÓRIA DO OUTRO — Contos Épicos (desigualdade, comparação e inveja)
import { sstep, win, clamp, easeBack } from '../../motor/base.js';
import { W, H } from '../../motor/estudio.js';
import { blocosLegenda } from '../../motor/serie.js';
import { c1, c2, c3, c4, c5, c6 } from './cenas/cenas.js';

const tempos = await (await fetch(new URL('./tempos.json', import.meta.url))).json();
const LEG = blocosLegenda(tempos);
// palavras-chave destacadas em amarelo nas legendas
const CHAVE = ['SONHOS', 'OPORTUNIDADES', 'OPORTUNIDADE', 'JUNTOS', 'VIDA MELHOR', 'CONQUISTA', 'CONQUISTOU', 'CRITICAR', 'MESMO', 'COMPARAR', 'FRACASSANDO', 'CRITICANDO', 'DESIGUALDADES', 'HUMANO', 'FRACASSE', 'DIMINUIR', 'VITÓRIA', 'DERROTA', 'MOTO', 'REALIDADE'];
function legenda(st, t) {
  const b = LEG.find(x => t >= x.a && t < x.b); if (!b) return;
  const up = b.txt.toUpperCase(); const destaque = CHAVE.some(k => up.includes(k));
  st.text(b.txt, W / 2, 1560, { size: destaque ? 104 : 96, fill: destaque ? '#ffd23a' : '#ffffff', scale: 0.75 + 0.25 * easeBack(clamp((t - b.a) / 0.15)), lw: 20 });
}

export default {
  tempos, duracao: tempos.duracao,
  cenas: [c1, c2, c3, c4, c5, c6],
  composicao(st, t, idx) {
    const c = st.c;
    // tons: cidade quente e viva; quarto do Rafael mais frio; feed saturado; final suave
    const frio = (t > 34.4 && t < 48 ? 0.6 : 0) + (t > 56 && t < 64.4 ? 0.7 : 0) + (t > 71.2 && t < 79.2 ? 0.8 : 0);
    c.save(); c.globalCompositeOperation = 'multiply'; c.globalAlpha = 0.25 * frio; c.fillStyle = '#8a9ed0'; c.fillRect(0, 0, W, H);
    c.globalCompositeOperation = 'soft-light'; c.globalAlpha = 0.25 * (1 - Math.min(1, frio)); c.fillStyle = '#ffb860'; c.fillRect(0, 0, W, H); c.restore();
    st.vignette(0.35 + frio * 0.15);
    st.overlay('#000', 1 - sstep(0, 0.6, t));
    for (const [a, dir] of [[14.7, 1], [29.7, -1], [47.7, 1], [64.1, -1], [78.9, 1]]) st.wipe(clamp((t - a) / 0.3) + clamp((t - a - 0.35) / 0.3), '#14121a', dir);
    for (const a of [5, 10, 18.6, 22.6, 26.4, 34.4, 38, 45.4, 56, 71.2]) st.overlay('#000', win(t, a - 0.18, a - 0.05, a + 0.05, a + 0.22));
    st.grain(idx, 0.04);
    const pop = easeBack(clamp((t - 0.5) / 0.45));
    st.text('A VITÓRIA', W / 2, 300, { size: 120, fill: '#ffd23a', alpha: win(t, 0.5, 0.9, 4.2, 4.7), scale: 0.6 + 0.4 * pop, lw: 20 });
    st.text('DO OUTRO', W / 2, 420, { size: 96, fill: '#ffffff', alpha: win(t, 0.8, 1.2, 4.2, 4.7), scale: 0.6 + 0.4 * easeBack(clamp((t - 0.8) / 0.45)), lw: 18 });
    st.overlay('#000', sstep(87.4, 87.8, t));
    if (t >= tempos.preto_final) {
      st.overlay('#000', 1);
      const f0 = tempos.texto_final_tela[0];
      st.text('PARE DE COMPETIR', W / 2, 840, { size: 78, fill: '#ffffff', alpha: sstep(f0, f0 + 0.35, t), lw: 14 });
      st.text('COM A VIDA DOS OUTROS.', W / 2, 950, { size: 66, fill: '#ffffff', alpha: sstep(f0 + 0.2, f0 + 0.55, t), lw: 12 });
      st.text('COMECE A CONSTRUIR', W / 2, 1090, { size: 78, fill: '#ffd23a', alpha: sstep(f0 + 0.5, f0 + 0.85, t), lw: 14 });
      st.text('A SUA.', W / 2, 1200, { size: 96, fill: '#ffd23a', alpha: sstep(f0 + 0.7, f0 + 1.0, t), lw: 16 });
    }
  },
  legenda(st, t) { if (t < tempos.preto_final) legenda(st, t); },
};
