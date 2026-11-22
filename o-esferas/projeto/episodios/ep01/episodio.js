// POR QUE EXISTEM BOLAS NOS FIOS ELÉTRICOS? — Contos Épicos (3D estilizado)
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
const CHAVE = ['BOLAS', 'LARANJAS', 'BASQUETE', 'ESFERAS', 'SINALIZAÇÃO', 'AÉREA', 'VISÍVEIS', 'PILOTOS', 'HELICÓPTEROS', 'PERTO DEMAIS', 'COR', 'COLISÃO', 'PERIGOSA', 'ALTA TENSÃO'];
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
    const c = st.ctx;
    // cabine do helicóptero (moldura, painel e HUD)
    if (t >= 23.8 && t < 30.8) {
      c.save(); c.fillStyle = '#16181e';
      c.beginPath(); c.rect(0, 0, W, H); c.moveTo(80, 220); c.quadraticCurveTo(540, 120, 1000, 220); c.lineTo(1040, 1180); c.quadraticCurveTo(540, 1260, 40, 1180); c.closePath(); c.fill('evenodd');
      c.fillStyle = '#22252e'; c.fillRect(0, 1240, W, H - 1240); for (let i = 0; i < 4; i++) { c.beginPath(); c.arc(170 + i * 250, 1420, 70, 0, 7); c.fillStyle = '#0c0e12'; c.fill(); c.strokeStyle = '#5a6070'; c.lineWidth = 6; c.stroke(); c.strokeStyle = '#7af0a0'; c.beginPath(); c.moveTo(170 + i * 250, 1420); c.lineTo(170 + i * 250 + Math.cos(t * (i + 1) * 0.7) * 50, 1420 + Math.sin(t * (i + 1) * 0.7) * 50); c.stroke(); }
      c.strokeStyle = 'rgba(122,240,160,0.7)'; c.lineWidth = 4; c.beginPath(); c.moveTo(440, 700); c.lineTo(640, 700); c.moveTo(540, 640); c.lineTo(540, 760); c.stroke();
      c.font = '800 34px Inter'; c.fillStyle = 'rgba(122,240,160,0.9)'; c.textAlign = 'left'; c.fillText('ALT 120 m', 120, 320); c.fillText('VEL 160 km/h', 120, 366);
      c.restore();
      const al = win(t, 29.2, 29.35, 30.4, 30.8); if (al > 0) { st.overlay('#ff2020', al * (0.18 + 0.15 * Math.sin(t * 30))); txt(st, '⚠️ CABO À FRENTE!', W / 2, 520, { size: 84, fill: '#ff4a3a', alpha: al, scale: 0.8 + 0.2 * back(clamp((t - 29.2) / 0.3)) }); }
    }
    st.vignette(0.32);
    st.overlay('#000', 1 - sstep(0, 0.5, t));
    for (const a of [9.2, 15.8, 23.8, 30.8, 42.6]) st.overlay('#ffffff', win(t, a - 0.15, a - 0.02, a + 0.02, a + 0.3) * 0.85);
    st.grain(idx, 0.03);
    txt(st, 'POR QUE EXISTEM', W / 2, 270, { size: 80, alpha: win(t, 0.4, 0.8, 3.6, 4.1), scale: 0.6 + 0.4 * back(clamp((t - 0.4) / 0.45)) });
    txt(st, 'BOLAS NOS FIOS?', W / 2, 390, { size: 110, fill: '#ff8a2a', alpha: win(t, 0.6, 1.0, 3.6, 4.1), scale: 0.6 + 0.4 * back(clamp((t - 0.6) / 0.45)), lw: 22 });
    txt(st, '🏀 BASQUETE?! 🤔', W / 2, 360, { size: 86, fill: '#ffd23a', alpha: win(t, 6.2, 6.5, 8.6, 9.0), scale: 0.8 + 0.2 * back(clamp((t - 6.2) / 0.3)) });
    // rótulo da esfera
    const rot = win(t, 12.4, 12.8, 15.5, 15.8); if (rot > 0) { const k = back(clamp((t - 12.4) / 0.4)); c.save(); c.globalAlpha = rot; c.translate(W / 2, 360); c.scale(0.7 + 0.3 * k, 0.7 + 0.3 * k); c.fillStyle = 'rgba(20,24,40,0.88)'; c.beginPath(); c.roundRect(-430, -95, 860, 190, 40); c.fill(); c.strokeStyle = '#ff8a2a'; c.lineWidth = 8; c.stroke(); c.restore(); txt(st, 'ESFERA DE', W / 2, 320, { size: 60, alpha: rot }); txt(st, 'SINALIZAÇÃO AÉREA', W / 2, 400, { size: 68, fill: '#ff8a2a', alpha: rot }); }
    // cores x fundos
    if (t >= 30.8 && t < 42.6) {
      const nomes = ['CONTRA O CÉU', 'CONTRA A VEGETAÇÃO', 'CONTRA A PAISAGEM'], i = t < 34.6 ? 0 : t < 38.4 ? 1 : 2, a0 = [30.8, 34.6, 38.4][i];
      txt(st, nomes[i], W / 2, 330, { size: 74, fill: '#ffffff', alpha: sstep(a0, a0 + 0.3, t), scale: 0.8 + 0.2 * back(clamp((t - a0) / 0.3)) });
      ['LARANJA', 'BRANCA', 'VERMELHA'].forEach((n, j) => txt(st, n, 240 + j * 300, 1260, { size: 44, fill: ['#ff8a2a', '#ffffff', '#ff5a4a'][j], alpha: sstep(31.6 + j * 0.3, 32.0 + j * 0.3, t) }));
      txt(st, 'a cor depende do ambiente', W / 2, 1350, { size: 44, fill: '#cfe0ff', alpha: sstep(39.0, 39.4, t) });
    }
    txt(st, '🏀 ✖', W / 2 + 260, 700, { size: 90, alpha: win(t, 47.7, 47.9, 48.6, 48.9) });
    const f0 = tempos.texto_final_tela[0];
    if (t > f0) { st.overlay('#000', sstep(f0, f0 + 0.6, t) * 0.4); txt(st, 'VOCÊ JÁ TINHA', W / 2, 860, { size: 104, alpha: sstep(f0, f0 + 0.4, t), scale: 0.7 + 0.3 * back(clamp((t - f0) / 0.4)) }); txt(st, 'REPARADO NISSO? 👀', W / 2, 990, { size: 96, fill: '#ff8a2a', alpha: sstep(f0 + 0.3, f0 + 0.7, t), scale: 0.7 + 0.3 * back(clamp((t - f0 - 0.3) / 0.4)) }); }
  },
  legenda(st, t) {
    const b = LEG.find(x => t >= x.a && t < x.b); if (!b || t > tempos.texto_final_tela[0] + 0.2) return;
    const dest = CHAVE.some(k => b.txt.includes(k));
    txt(st, b.txt, W / 2, 1580, { size: dest ? 104 : 96, fill: dest ? '#ffd23a' : '#ffffff', scale: 0.75 + 0.25 * back(clamp((t - b.a) / 0.15)), lw: 20 });
  },
};
