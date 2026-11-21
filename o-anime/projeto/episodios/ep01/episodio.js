// E SE VOCÊ ACHASSE QUE ESTAVA EM UM ANIME? — Contos Épicos
import { sstep, win, clamp, easeBack } from '../../motor/base.js';
import { W, H } from '../../motor/estudio.js';
import { blocosLegenda, desenharLegenda } from '../../motor/serie.js';
import { c1, c2, c3, c4, c5, c6 } from './cenas/cenas.js';

const tempos = await (await fetch(new URL('./tempos.json', import.meta.url))).json();
const LEG = blocosLegenda(tempos);
const IMAG = [[6.5, 11.6], [16.3, 18.6], [20.9, 22.6], [23.8, 25.6], [33.4, 39.4], [61, 65]];
const REAL = [[11.6, 15], [18.6, 20.2], [25.6, 30], [39.4, 44.4], [65, 68]];
const dentro = (t, L) => L.find(([a, b]) => t >= a && t < b);

function etiqueta(st, t, txt, cor, fundo, a) {
  if (a <= 0.01) return; const c = st.c;
  c.save(); c.globalAlpha = a; c.font = '900 34px Inter, sans-serif'; const w = c.measureText(txt).width + 50;
  c.fillStyle = fundo; c.beginPath(); c.roundRect(40, 120, w, 62, 31); c.fill(); c.lineWidth = 4; c.strokeStyle = cor; c.stroke();
  c.fillStyle = cor; c.textBaseline = 'middle'; c.fillText(txt, 65, 152); c.restore();
}

export default {
  tempos, duracao: tempos.duracao,
  cenas: [c1, c2, c3, c4, c5, c6],
  composicao(st, t, idx) {
    const c = st.c;
    const im = dentro(t, IMAG), re = dentro(t, REAL);
    // imaginação: cores saturadas; realidade da cena 5: fria e apagada
    if (im) { c.save(); c.globalCompositeOperation = 'soft-light'; c.globalAlpha = 0.3; c.fillStyle = '#ff60c0'; c.fillRect(0, 0, W, H); c.restore(); }
    if (t > 65 && t < 77.4) { c.save(); c.globalCompositeOperation = 'multiply'; c.globalAlpha = 0.25; c.fillStyle = '#9aa0b0'; c.fillRect(0, 0, W, H); c.restore(); }
    st.vignette(t > 65 ? 0.55 : 0.3);
    st.overlay('#000', 1 - sstep(0, 0.4, t));
    // transições: flash branco ao entrar na imaginação, corte seco ao voltar para a realidade
    for (const [a] of IMAG) st.overlay('#ffffff', win(t, a - 0.05, a, a + 0.02, a + 0.25) * 0.85);
    for (const a of [14.8, 29.8, 47.8, 64.8]) st.wipe(clamp((t - a) / 0.2) + clamp((t - a - 0.25) / 0.2), '#120a1a', 1);
    st.grain(idx, im ? 0.03 : 0.05);
    if (im) etiqueta(st, t, '✨ NA CABEÇA DELE', '#ffe14a', 'rgba(40,10,60,0.85)', Math.min(sstep(im[0], im[0] + 0.2, t), 1 - sstep(im[1] - 0.15, im[1], t)));
    if (re) etiqueta(st, t, '📍 NA VIDA REAL', '#ffffff', 'rgba(30,30,36,0.85)', Math.min(sstep(re[0], re[0] + 0.2, t), 1 - sstep(re[1] - 0.15, re[1], t)));
    // título
    const pop = easeBack(clamp((t - 0.5) / 0.45));
    st.text('E SE VOCÊ ACHASSE QUE', W / 2, 300, { size: 70, fill: '#ffffff', alpha: win(t, 0.5, 0.9, 5.2, 5.7), scale: 0.6 + 0.4 * pop, lw: 16 });
    st.text('ESTAVA EM UM ANIME?', W / 2, 410, { size: 92, fill: '#ffb020', alpha: win(t, 0.8, 1.2, 5.2, 5.7), scale: 0.6 + 0.4 * easeBack(clamp((t - 0.8) / 0.45)), lw: 20, glow: 'rgba(255,120,40,0.7)' });
    // corte para preto (o disparo é só som)
    if (t >= 77.4) st.overlay('#000', t < 78.0 ? 1 : 0);
    const f0 = tempos.texto_final_tela[0];
    if (t > f0) {
      st.text('NA VIDA REAL,', W / 2, 860, { size: 74, fill: '#ffffff', alpha: sstep(f0, f0 + 0.4, t), lw: 14 });
      st.text('VOCÊ NÃO TEM PROTEÇÃO', W / 2, 970, { size: 74, fill: '#ffffff', alpha: sstep(f0 + 0.3, f0 + 0.7, t), lw: 14 });
      st.text('DE PROTAGONISTA.', W / 2, 1080, { size: 90, fill: '#ff4a3a', alpha: sstep(f0 + 0.6, f0 + 1.0, t), lw: 16 });
    }
  },
  legenda(st, t) { if (t < tempos.preto_final) desenharLegenda(st, t, LEG, tempos, 1560); },
};
