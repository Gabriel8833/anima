// COMO CONTROLAR SUA ADRENALINA EM UMA SITUAÇÃO DE PERIGO — Contos Épicos
import { sstep, win, clamp, easeBack } from '../../motor/base.js';
import { W, H } from '../../motor/estudio.js';
import { blocosLegenda } from '../../motor/serie.js';
import { c1, c2, c3, c4, c5, c6, c7, c8 } from './cenas/cenas.js';

const tempos = await (await fetch(new URL('./tempos.json', import.meta.url))).json();
const LEG = blocosLegenda(tempos);
const CHAVE = ['ADRENALINA', 'MEDO', 'CONTROLE', 'PERIGO', 'RESPIRAR', 'SEGURO', 'SEGURANÇA', 'PRIORIDADE', 'BRIGA', 'HERÓI', 'IMPULSO', 'RISCOS', 'VÍTIMA', '190', '192', '193', 'SAMU', 'BOMBEIROS', 'DESESPERO', 'DEZ SEGUNDOS'];
// momentos de reação (pulso vermelho) e de "o que fazer" (tom mais calmo)
const REACAO = [[3.4, 13.6], [13.6, 20.8], [30.3, 36.9], [43.9, 50.2], [58.1, 64.1], [73.8, 81.0]];
const DICA = [[20.8, 30.3], [36.9, 43.9], [50.2, 58.1], [64.1, 73.8], [81.0, 85.6], [96.2, 106.2]];
const em = (t, L) => L.find(([a, b]) => t >= a && t < b);

export default {
  tempos, duracao: tempos.duracao,
  cenas: [c1, c2, c3, c4, c5, c6, c7, c8],
  composicao(st, t, idx) {
    const c = st.c;
    const r = em(t, REACAO), d = em(t, DICA);
    if (r) { const b = Math.pow(Math.max(0, Math.sin(t * 2.4 * Math.PI)), 6); const g = c.createRadialGradient(W / 2, H / 2, H * 0.25, W / 2, H / 2, H * 0.75); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(200,20,30,${0.25 + 0.3 * b})`); c.fillStyle = g; c.fillRect(0, 0, W, H); }
    if (d) { c.save(); c.globalCompositeOperation = 'soft-light'; c.globalAlpha = 0.3; c.fillStyle = '#7ad8c8'; c.fillRect(0, 0, W, H); c.restore(); }
    st.vignette(0.35);
    st.overlay('#000', 1 - sstep(0, 0.4, t));
    for (const [a, dir] of [[13.3, 1], [30.0, -1], [43.6, 1], [57.8, -1], [73.5, 1], [85.3, -1], [105.9, 1]]) st.wipe(clamp((t - a) / 0.3) + clamp((t - a - 0.35) / 0.3), '#0e1014', dir);
    st.overlay('#ffffff', win(t, 3.38, 3.42, 3.46, 3.7) * 0.9);
    st.grain(idx, 0.035);
    const pop = easeBack(clamp((t - 0.3) / 0.45));
    st.text('COMO CONTROLAR SUA', W / 2, 280, { size: 72, fill: '#ffffff', alpha: win(t, 0.3, 0.7, 3.0, 3.3), scale: 0.6 + 0.4 * pop, lw: 16 });
    st.text('ADRENALINA', W / 2, 400, { size: 140, fill: '#ff4a3a', alpha: win(t, 0.5, 0.9, 3.0, 3.3), scale: 0.6 + 0.4 * easeBack(clamp((t - 0.5) / 0.45)), lw: 22, glow: 'rgba(255,60,40,0.6)' });
    if (t > 9.9 && t < 11.3) st.text('ADRENALINA', W / 2, 360, { size: 150, fill: '#ff4a3a', alpha: win(t, 9.9, 10.1, 11.0, 11.3), scale: 0.8 + 0.2 * easeBack(clamp((t - 9.9) / 0.3)), lw: 22, glow: 'rgba(255,60,40,0.7)' });
    st.overlay('#000', sstep(117.2, 117.6, t));
    if (t >= tempos.preto_final) {
      st.overlay('#000', 1);
      const f0 = tempos.texto_final_tela[0];
      st.text('O MEDO É UMA REAÇÃO.', W / 2, 880, { size: 76, fill: '#ffffff', alpha: sstep(f0, f0 + 0.4, t), lw: 14 });
      st.text('O QUE VOCÊ FAZ DEPOIS', W / 2, 1010, { size: 70, fill: '#7ad8c8', alpha: sstep(f0 + 0.4, f0 + 0.8, t), lw: 14 });
      st.text('É UMA ESCOLHA.', W / 2, 1110, { size: 86, fill: '#7ad8c8', alpha: sstep(f0 + 0.6, f0 + 1.0, t), lw: 16 });
    }
  },
  legenda(st, t) {
    if (t >= tempos.preto_final) return;
    const b = LEG.find(x => t >= x.a && t < x.b); if (!b) return;
    const up = b.txt.toUpperCase(), dest = CHAVE.some(k => up.includes(k));
    st.text(b.txt, W / 2, 1580, { size: dest ? 104 : 94, fill: dest ? '#ffd23a' : '#ffffff', scale: 0.75 + 0.25 * easeBack(clamp((t - b.a) / 0.15)), lw: 20 });
  },
};
