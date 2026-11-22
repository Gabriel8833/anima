// VOCÊ JÁ SE PERGUNTOU POR QUE O TETO DO CARRO TEM UMA ANTENA? — Contos Épicos (3D estilizado)
import { sstep, win, clamp, easeOut } from '../../motor/base.js';
import { W, H } from '../../motor/estudio.js';
import { c1, c2, c3, c4, c5 } from './cenas.js';

const tempos = await (await fetch(new URL('./tempos.json', import.meta.url))).json();
await document.fonts.load('900 80px Inter');
// blocos de legenda (1–3 palavras), distribuídos pelo número de letras
const LEG = [];
for (const f of tempos.narracao) {
  const pal = f.texto.split(/\s+/), blocos = [];
  for (let i = 0; i < pal.length;) { let n = pal[i].length > 9 ? 1 : (pal[i + 1] && (pal[i] + pal[i + 1]).length < 14 ? 2 : 1); if (n === 2 && pal[i + 2] && (pal[i] + pal[i + 1] + pal[i + 2]).length < 13) n = 3; blocos.push(pal.slice(i, i + n).join(' ')); i += n; }
  const tot = blocos.reduce((s, b) => s + b.length + 2, 0); let a = f.inicio;
  for (const b of blocos) { const d = (f.fim - f.inicio) * (b.length + 2) / tot; LEG.push({ a, b: a + d, txt: b.toUpperCase() }); a += d; }
}
const CHAVE = ['ANTENA', 'RÁDIO', 'TETO', 'ONDAS', 'BARBATANA', 'GPS', 'SATÉLITE', 'TUBARÃO', 'ENFEITAR', 'MÚSICA', 'NOTÍCIAS'];
function txt(st, s, x, y, { size = 90, fill = '#fff', alpha = 1, scale = 1, lw = 18 } = {}) {
  if (alpha <= 0.01) return; const c = st.ctx; c.save(); c.globalAlpha = clamp(alpha); c.translate(x, y); c.scale(scale, scale);
  c.font = `900 ${size}px Inter, "Noto Color Emoji", sans-serif`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const w = c.measureText(s).width; if (w > W - 100) { const k = (W - 100) / w; c.scale(k, k); }
  c.shadowColor = 'rgba(0,0,0,0.5)'; c.shadowBlur = 12; c.lineWidth = lw; c.strokeStyle = '#141018'; c.strokeText(s, 0, 0); c.shadowBlur = 0; c.fillStyle = fill; c.fillText(s, 0, 0); c.restore();
}
const back = u => { const k = 1.9; return 1 + (k + 1) * Math.pow(u - 1, 3) + k * Math.pow(u - 1, 2); };

export default {
  tempos, duracao: tempos.duracao,
  cenas: [c1, c2, c3, c4, c5],
  composicao(st, t, idx) {
    st.vignette(0.35);
    st.overlay('#000', 1 - sstep(0, 0.5, t));
    for (const a of [9.0, 20.4, 31.0, 42.4]) st.overlay('#ffffff', win(t, a - 0.15, a - 0.02, a + 0.02, a + 0.3) * 0.85);
    st.overlay('#ffffff', win(t, 10.45, 10.55, 10.65, 10.9) * 0.6); // atravessando o teto
    st.grain(idx, 0.03);
    // título
    txt(st, 'POR QUE O CARRO', W / 2, 280, { size: 78, alpha: win(t, 0.4, 0.8, 3.4, 3.9), scale: 0.6 + 0.4 * back(clamp((t - 0.4) / 0.45)) });
    txt(st, 'TEM ANTENA?', W / 2, 400, { size: 120, fill: '#ffd23a', alpha: win(t, 0.6, 1.0, 3.4, 3.9), scale: 0.6 + 0.4 * back(clamp((t - 0.6) / 0.45)), lw: 22 });
    // piada: "não é enfeite!"
    if (t > 6.5 && t < 8.6) { const a = win(t, 6.5, 6.7, 8.2, 8.6); txt(st, '✖ NÃO É ENFEITE!', W / 2, 360, { size: 88, fill: '#ff5a4a', alpha: a, scale: 0.8 + 0.2 * back(clamp((t - 6.5) / 0.3)) }); }
    // rótulos das saídas do rádio e das funções da barbatana (sempre dentro da tela)
    const cartao = (s, y, cor, a0, a1) => { const k = clamp((t - a0) / 0.35) * (1 - clamp((t - a1) / 0.3)); if (k <= 0) return; const c = st.ctx; c.save(); c.globalAlpha = k; c.translate(W / 2, y); const sc2 = 0.7 + 0.3 * back(clamp((t - a0) / 0.35)); c.scale(sc2, sc2); c.font = '900 64px Inter, "Noto Color Emoji", sans-serif'; const w = c.measureText(s).width + 90; c.fillStyle = 'rgba(16,20,40,0.88)'; c.beginPath(); c.roundRect(-w / 2, -58, w, 116, 58); c.fill(); c.lineWidth = 7; c.strokeStyle = cor; c.stroke(); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#fff'; c.fillText(s, 0, 4); c.restore(); };
    cartao('🎵 MÚSICA', 520, '#3a7ad0', 15.8, 20.2); cartao('📰 NOTÍCIAS', 660, '#d0603a', 16.9, 20.2); cartao('🌦️ INFORMAÇÕES', 800, '#2aa060', 18.0, 20.2);
    cartao('📻 RÁDIO', 380, '#ff9a3a', 36.0, 42.2); cartao('📍 GPS', 520, '#5ad08a', 37.0, 42.2); cartao('🛰️ SATÉLITE', 660, '#7aa8ff', 38.2, 42.2);
    // final
    const f0 = tempos.texto_final_tela[0];
    if (t > f0) { st.overlay('#000', sstep(f0, f0 + 0.6, t) * 0.45); txt(st, 'VOCÊ JÁ', W / 2, 860, { size: 120, alpha: sstep(f0, f0 + 0.4, t), scale: 0.7 + 0.3 * back(clamp((t - f0) / 0.4)) }); txt(st, 'SABIA DISSO? 🤔', W / 2, 1000, { size: 110, fill: '#ffd23a', alpha: sstep(f0 + 0.3, f0 + 0.7, t), scale: 0.7 + 0.3 * back(clamp((t - f0 - 0.3) / 0.4)) }); }
  },
  legenda(st, t) {
    const b = LEG.find(x => t >= x.a && t < x.b); if (!b || t > tempos.texto_final_tela[0] + 0.2) return;
    const dest = CHAVE.some(k => b.txt.includes(k));
    txt(st, b.txt, W / 2, 1580, { size: dest ? 104 : 96, fill: dest ? '#ffd23a' : '#ffffff', scale: 0.75 + 0.25 * back(clamp((t - b.a) / 0.15)), lw: 20 });
  },
};
