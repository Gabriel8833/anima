// Motor 2D — estúdio: tela 1080×1920, câmera, transições, títulos, legendas e o laço de quadros.
import { clamp, sstep, lerp, easeOut, rng } from './base.js';

export const W = 1080, H = 1920;

export function createStudio({ scale = 1 } = {}) {
  const cv = document.createElement('canvas'); cv.width = W * scale; cv.height = H * scale; document.body.appendChild(cv);
  const c = cv.getContext('2d');
  const grain = [0, 1, 2, 3].map(i => {
    const g = document.createElement('canvas'); g.width = 270; g.height = 480; const x = g.getContext('2d');
    const d = x.createImageData(270, 480), r = rng(50 + i);
    for (let k = 0; k < d.data.length; k += 4) { const v = r() * 255; d.data[k] = d.data[k + 1] = d.data[k + 2] = v; d.data[k + 3] = 255; }
    x.putImageData(d, 0, 0); return g;
  });
  const st = {
    c, canvas: cv, scale,
    // Câmera: centro (x,y) no mundo, zoom, rotação, tremor [dx,dy]. Use dentro de st.mundo(...)
    cam: { x: 540, y: 960, zoom: 1, rot: 0, shk: [0, 0] },
    setCam(x, y, zoom = 1, rot = 0, shk = [0, 0]) { Object.assign(this.cam, { x, y, zoom, rot, shk }); },
    // desenha uma camada com paralaxe p (0 = fixa na tela, 1 = acompanha a câmera)
    camada(p, fn) {
      const k = this.cam, z = 1 + (k.zoom - 1) * p;
      c.save(); c.translate(W / 2 + k.shk[0] * 12, H / 2 + k.shk[1] * 12); c.rotate(k.rot * p + k.shk[0] * 0.004); c.scale(z, z);
      c.translate(-(540 + (k.x - 540) * p), -(960 + (k.y - 960) * p)); fn(c); c.restore();
    },
    mundo(fn) { this.camada(1, fn); },
    overlay(color, a) { if (a <= 0.001) return; c.save(); c.globalAlpha = clamp(a); c.fillStyle = color; c.fillRect(0, 0, W, H); c.restore(); },
    vignette(s = 0.45) { const g = c.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.75); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${s})`); c.fillStyle = g; c.fillRect(0, 0, W, H); },
    grain(i, a = 0.035) { c.save(); c.globalAlpha = a; c.globalCompositeOperation = 'overlay'; c.drawImage(grain[i % 4], 0, 0, W, H); c.restore(); },
    // cortina diagonal (transição "swipe"): u 0→1 cobre, cor
    wipe(u, color = '#000', dir = 1) {
      if (u <= 0 || u >= 2) return;
      c.save(); c.fillStyle = color; c.beginPath();
      const a = u <= 1 ? easeOut(u) : 1, b = u <= 1 ? 0 : easeOut(u - 1);
      const x0 = lerp(-400, W + 400, b), x1 = lerp(-400, W + 400, a);
      if (dir < 0) { c.translate(W, 0); c.scale(-1, 1); }
      c.moveTo(x0 - 300, 0); c.lineTo(x1, 0); c.lineTo(x1 - 300, H); c.lineTo(x0 - 600, H); c.closePath(); c.fill(); c.restore();
    },
    text(str, x, y, { size = 80, font = '"Inter", sans-serif', weight = 900, fill = '#fff', alpha = 1, stroke = '#120c14', lw = null, scale = 1, spacing = 0, shadow = true, glow = null } = {}) {
      if (alpha <= 0.001) return;
      c.save(); c.globalAlpha = clamp(alpha); c.translate(x, y); c.scale(scale, scale);
      c.font = `${weight} ${size}px ${font}`; c.textAlign = 'center'; c.textBaseline = 'middle'; if (spacing) c.letterSpacing = `${spacing}px`;
      const tw = c.measureText(str).width; if (tw > W - 100) { const k = (W - 100) / tw; c.scale(k, k); }
      c.lineJoin = 'round';
      if (glow) { c.shadowColor = glow; c.shadowBlur = size * 0.5; }
      else if (shadow) { c.shadowColor = 'rgba(0,0,0,0.45)'; c.shadowOffsetY = size * 0.07; c.shadowBlur = 0; }
      if (stroke) { c.lineWidth = lw ?? size * 0.2; c.strokeStyle = stroke; c.strokeText(str, 0, 0); }
      c.shadowColor = 'transparent'; c.fillStyle = fill; c.fillText(str, 0, 0); c.restore();
    },
  };
  return st;
}

// Episódio = { duracao, cenas: [{ inicio, fim, criar(st) -> { desenhar(t) } }], composicao(st, t, idx), legendas: [...] }
export function runEpisode(st, ep, { legendas = true } = {}) {
  const built = new Map();
  const get = cena => { if (!built.has(cena)) built.set(cena, cena.criar(st)); return built.get(cena); };
  window.renderFrame = (t, idx = 0, q = 0.92) => {
    const c = st.c;
    c.setTransform(st.scale, 0, 0, st.scale, 0, 0);
    c.fillStyle = '#000'; c.fillRect(0, 0, W, H);
    const cena = ep.cenas.find(k => t >= k.inicio && t < k.fim);
    if (cena) { st.setCam(540, 960, 1, 0, [0, 0]); get(cena).desenhar(t); }
    ep.composicao?.(st, t, idx);
    if (legendas && ep.legenda) ep.legenda(st, t);
    return st.canvas.toDataURL('image/jpeg', q);
  };
  for (const k of ep.cenas) window.renderFrame((k.inicio + k.fim) / 2);
  window.ready = true;
}
