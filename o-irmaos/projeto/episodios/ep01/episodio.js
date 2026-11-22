// IMAGINE SER O FILHO QUE FAZ TUDO... E O QUE NÃO FAZ NADA — Contos Épicos (3D)
// Sem legendas na imagem (pedido do roteiro); o .srt é gerado separado por legendas.py.
import { sstep, win, clamp } from '../../motor/base.js';
import { W, H } from '../../motor/estudio.js';
import { c1, c2, c3, c4, c5, c6 } from './cenas.js';

const tempos = await (await fetch(new URL('./tempos.json', import.meta.url))).json();
await document.fonts.load('900 80px Inter');
const back = u => { const k = 1.9; return 1 + (k + 1) * Math.pow(u - 1, 3) + k * Math.pow(u - 1, 2); };
function txt(st, s, x, y, { size = 90, fill = '#fff', alpha = 1, scale = 1 } = {}) { if (alpha <= 0.01) return; const c = st.ctx; c.save(); c.globalAlpha = clamp(alpha); c.translate(x, y); c.scale(scale, scale); c.font = `900 ${size}px Inter, sans-serif`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round'; const w = c.measureText(s).width; if (w > W - 100) { const k = (W - 100) / w; c.scale(k, k); } c.lineWidth = size * 0.16; c.strokeStyle = '#120c14'; c.strokeText(s, 0, 0); c.fillStyle = fill; c.fillText(s, 0, 0); c.restore(); }

export default {
  tempos, duracao: tempos.duracao,
  cenas: [c1, c2, c3, c4, c5, c6],
  composicao(st, t, idx) {
    const c = st.ctx;
    // cena 1: tela dividida (esquerda fria/cansada, direita quente/folgada)
    const div = 1 - sstep(16.6, 17.2, t);
    if (st.metade && t < (st.metadeAte || 0)) c.drawImage(st.metade, 0, 0, W / 2, H);
    if (t < 17.2 && div > 0) { c.save(); c.globalAlpha = 0.18 * div; c.fillStyle = '#5a7ab0'; c.fillRect(0, 0, W / 2, H); c.fillStyle = '#ffb050'; c.fillRect(W / 2, 0, W / 2, H); c.restore(); c.save(); c.globalAlpha = div; c.fillStyle = '#f6f2ea'; c.fillRect(W / 2 - 5, 0, 10, H); c.restore(); }
    // tom de cada momento
    const reflexivo = sstep(104.8, 106.0, t) * (1 - sstep(145.6, 146.6, t));
    if (reflexivo > 0) { c.save(); c.globalCompositeOperation = 'multiply'; c.globalAlpha = 0.25 * reflexivo; c.fillStyle = '#8a9ad0'; c.fillRect(0, 0, W, H); c.restore(); }
    st.vignette(0.35 + reflexivo * 0.2);
    // câmera lenta épica: barras de cinema e brilho dourado
    const epico = win(t, 58.9, 59.4, 66.3, 66.8); if (epico > 0) { st.bars(epico); c.save(); c.globalCompositeOperation = 'soft-light'; c.globalAlpha = 0.35 * epico; c.fillStyle = '#ffc060'; c.fillRect(0, 0, W, H); c.restore(); }
    // o copo: zoom dramático (vinheta forte)
    const drama = win(t, 40.9, 41.3, 42.4, 42.6); if (drama > 0) st.vignette(0.7 * drama);
    // indignação: pulso vermelho
    const grito = win(t, 43.88, 44.0, 49.8, 50.1); if (grito > 0) st.overlay('#ff2a2a', grito * (0.08 + 0.08 * Math.abs(Math.sin(t * 10))));
    // censura: barras coloridas de TV no "seu filho da..."
    if (t > 102.85 && t < 103.55) { const cores = ['#c0c0c0', '#c0c000', '#00c0c0', '#00c000', '#c000c0', '#c00000', '#0000c0']; cores.forEach((k, i) => { c.fillStyle = k; c.fillRect(i * W / 7, 0, W / 7 + 1, H * 0.75); }); c.fillStyle = '#101010'; c.fillRect(0, H * 0.75, W, H * 0.25); }
    // congelamento final (efeito de foto)
    const fr = t >= 160.6 && t < 163.2; if (fr) { st.overlay('#ffffff', Math.max(0, 1 - (t - 160.6) / 0.25)); c.save(); c.globalCompositeOperation = 'saturation'; c.globalAlpha = 0.6; c.fillStyle = '#808080'; c.fillRect(0, 0, W, H); c.restore(); st.vignette(0.6); c.save(); c.strokeStyle = '#ffffff'; c.lineWidth = 14; c.strokeRect(40, 40, W - 80, H - 80); c.restore(); }
    // transições
    st.overlay('#000', 1 - sstep(0, 0.6, t));
    for (const a of [20.9, 51.6, 84.6, 105.2, 146.4]) st.overlay('#000', win(t, a - 0.35, a - 0.05, a + 0.05, a + 0.4));
    for (const a of [22.75, 24.4, 26.05, 27.7, 29.35, 31.0]) st.overlay('#ffffff', win(t, a - 0.06, a - 0.01, a + 0.01, a + 0.12) * 0.5);
    for (const a of [58.9, 66.8, 110, 120.6, 125.7, 133.8, 172.7]) st.overlay('#000', win(t, a - 0.25, a - 0.05, a + 0.05, a + 0.3));
    st.grain(idx, 0.025);
    // tela preta final
    const f0 = tempos.texto_final_tela[0];
    st.overlay('#000', sstep(f0 - 0.6, f0, t));
    if (t > f0) { txt(st, 'VOCÊ É O LUCAS', W / 2, 860, { size: 96, alpha: sstep(f0, f0 + 0.4, t), scale: 0.7 + 0.3 * back(clamp((t - f0) / 0.4)) }); txt(st, 'OU O PEDRO', W / 2, 980, { size: 96, fill: '#ff5a4a', alpha: sstep(f0 + 0.3, f0 + 0.7, t), scale: 0.7 + 0.3 * back(clamp((t - f0 - 0.3) / 0.4)) }); txt(st, 'DA SUA CASA?', W / 2, 1100, { size: 96, alpha: sstep(f0 + 0.6, f0 + 1.0, t), scale: 0.7 + 0.3 * back(clamp((t - f0 - 0.6) / 0.4)) }); }
  },
};
