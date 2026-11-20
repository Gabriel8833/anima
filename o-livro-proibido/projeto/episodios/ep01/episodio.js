// EPISÓDIO 1 — O Livro Proibido: A Guerra dos Magos (estilo 2D cartoon)
// Para um novo episódio: copie esta pasta, troque as cenas em ./cenas e ajuste tempos.json.
import { sstep, win, clamp, easeBack } from '../../motor/base.js';
import { W, H } from '../../motor/estudio.js';
import { c1, c2 } from './cenas/c1_c2.js';
import c3, { PLANOS } from './cenas/c3_quatro_magos.js';
import c4 from './cenas/c4_descoberta.js';
import c5 from './cenas/c5_guerra.js';
import c6 from './cenas/c6_final.js';

const tempos = await (await fetch(new URL('./tempos.json', import.meta.url))).json();

// Legendas palavra por palavra (blocos de 1 a 3 palavras), distribuídas pelo tempo de cada fala.
function blocos() {
  const out = [];
  for (const f of tempos.narracao) {
    const palavras = f.texto.replace(/\.\.\./g, '…').split(/\s+/);
    const grupos = []; let g = [];
    for (const w of palavras) {
      g.push(w);
      const len = g.join(' ').length;
      if (len >= 11 || g.length === 3 || /[.,:;!?…]$/.test(w)) { grupos.push(g.join(' ')); g = []; }
    }
    if (g.length) grupos.push(g.join(' '));
    const total = grupos.reduce((s, x) => s + x.length + 3, 0);
    let t = f.inicio;
    for (const x of grupos) { const d = (f.fim - f.inicio) * (x.length + 3) / total; out.push({ a: t, b: t + d, txt: x.toUpperCase() }); t += d; }
  }
  return out;
}
const LEG = blocos();

export default {
  tempos, duracao: tempos.duracao,
  cenas: [c1, c2, c3, c4, c5, c6],
  composicao(st, t, idx) {
    st.vignette(0.4);
    // transições
    st.overlay('#000', 1 - sstep(0, 0.8, t));
    st.wipe(clamp((t - 10.6) / 0.4) + clamp((t - 11.0) / 0.4), '#1a1430', 1);                       // 1 → 2
    st.overlay('#ffffff', win(t, 21.8, 21.97, 22.03, 22.3) * 0.9);                                   // clarão → 3
    const cores = ['#58b4ff', '#ff2a3a', '#ffc040', '#a040ff'];
    PLANOS.slice(1, 4).forEach((p, i) => st.wipe(clamp((t - p + 0.3) / 0.3) + clamp((t - p) / 0.3), cores[i + 1], i % 2 ? -1 : 1));
    st.wipe(clamp((t - 33.6) / 0.4) + clamp((t - 34.0) / 0.4), '#0a0a1a', 1);                       // 3 → 4
    st.overlay('#ffffff', win(t, 45.8, 45.98, 46.02, 46.3));                                         // clarão → guerra
    st.overlay('#ffffff', win(t, 49.6, 49.65, 49.7, 49.95) * 0.7);                                   // impacto
    st.overlay('#000', win(t, 60.4, 60.95, 61.05, 61.6));                                            // guerra → câmara
    st.grain(idx, 0.03);
    // título do episódio
    const ta = win(t, 1.2, 1.7, 5.0, 5.6), pop = easeBack(clamp((t - 1.2) / 0.5));
    st.text('O LIVRO PROIBIDO', W / 2, 330, { size: 104, fill: '#ffe9a8', alpha: ta, scale: 0.6 + 0.4 * pop, glow: 'rgba(255,170,60,0.9)', lw: 18 });
    st.text('EPISÓDIO 1: A GUERRA DOS MAGOS', W / 2, 440, { size: 46, fill: '#ffffff', alpha: win(t, 1.8, 2.3, 5.0, 5.6), lw: 10 });
    // tela preta + CONTINUA...
    if (t >= tempos.tela_preta) {
      st.overlay('#000', 1);
      const a = tempos.continua[0];
      st.text('CONTINUA...', W / 2, H / 2, { size: 110, fill: '#ffffff', alpha: sstep(a, a + 0.5, t), scale: 0.7 + 0.3 * easeBack(clamp((t - a) / 0.5)), glow: 'rgba(255,40,30,0.8)', lw: 16 });
    }
  },
  legenda(st, t) {
    const b = LEG.find(x => t >= x.a && t < x.b);
    if (!b || t >= tempos.tela_preta) return;
    const k = easeBack(clamp((t - b.a) / 0.15));
    st.text(b.txt, W / 2, 1150, { size: 96, fill: '#ffffff', scale: 0.75 + 0.25 * k, lw: 20 });
  },
};
