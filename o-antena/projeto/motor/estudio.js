// Motor — "estúdio": renderizador, câmera, composição 2D (vinheta, granulação, transições, títulos) e o laço de quadros.
import { THREE, clamp, sstep, rng } from './base.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export const W = 1080, H = 1920;

export function createStudio({ scale = 1 } = {}) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1); renderer.setSize(W * scale, H * scale);
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.outputColorSpace = THREE.SRGBColorSpace;
  const out = document.createElement('canvas'); out.width = W * scale; out.height = H * scale; document.body.appendChild(out);
  const ctx = out.getContext('2d');
  const camera = new THREE.PerspectiveCamera(50, W / H, 0.05, 6000);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  const grain = [0, 1, 2, 3].map(i => {
    const c = document.createElement('canvas'); c.width = 270; c.height = 480; const x = c.getContext('2d');
    const d = x.createImageData(270, 480), r = rng(50 + i);
    for (let k = 0; k < d.data.length; k += 4) { const v = r() * 255; d.data[k] = d.data[k + 1] = d.data[k + 2] = v; d.data[k + 3] = 255; }
    x.putImageData(d, 0, 0); return c;
  });
  const studio = {
    renderer, camera, ctx, out, env, scale,
    // Posiciona a câmera: pos/target [x,y,z], fov, roll (rad), shake [x,y]
    cam(pos, target, fov = 50, roll = 0, shk = [0, 0], near = 0.05, far = 6000) {
      camera.fov = fov; camera.near = near; camera.far = far; camera.updateProjectionMatrix();
      camera.position.set(pos[0], pos[1], pos[2]); camera.lookAt(target[0], target[1], target[2]);
      camera.rotateZ(roll + shk[0] * 0.02); camera.rotateX(shk[1] * 0.02);
    },
    // Ativa reflexos de ambiente em materiais metálicos de um objeto
    metal(root, k = 1) { root.traverse(o => { if (o.isMesh && o.material.metalness > 0.5) { o.material.envMap = env; o.material.envMapIntensity = k; o.material.needsUpdate = true; } }); },
    overlay(color, a) { if (a <= 0.001) return; ctx.save(); ctx.globalAlpha = clamp(a); ctx.fillStyle = color; ctx.fillRect(0, 0, W, H); ctx.restore(); },
    vignette(strength = 0.55) {
      const g = ctx.createRadialGradient(W / 2, H * 0.48, H * 0.25, W / 2, H * 0.5, H * 0.72);
      g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${strength})`);
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    },
    grain(i, a = 0.05) { ctx.save(); ctx.globalAlpha = a; ctx.globalCompositeOperation = 'overlay'; ctx.drawImage(grain[i % 4], 0, 0, W, H); ctx.restore(); },
    // Barras de cinema horizontais (abrem/fecham)
    bars(k) { if (k <= 0) return; const h = 150 * k; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, h); ctx.fillRect(0, H - h, W, h); },
    text(str, x, y, { size = 80, font = 'Cinzel, "DejaVu Serif", serif', weight = 700, fill = '#fff', alpha = 1, glow = null, spacing = 0, stroke = 'rgba(0,0,0,0.85)', scale = 1 } = {}) {
      if (alpha <= 0.001) return;
      ctx.save(); ctx.globalAlpha = clamp(alpha); ctx.translate(x, y); ctx.scale(scale, scale);
      ctx.font = `${weight} ${size}px ${font}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      if (spacing) ctx.letterSpacing = `${spacing}px`;
      const tw = ctx.measureText(str).width; if (tw > W - 120) { const k = (W - 120) / tw; ctx.scale(k, k); }
      if (glow) { ctx.shadowColor = glow; ctx.shadowBlur = size * 0.6; }
      if (stroke) { ctx.lineWidth = size * 0.08; ctx.strokeStyle = stroke; ctx.lineJoin = 'round'; ctx.strokeText(str, 0, 0); }
      ctx.fillStyle = fill; ctx.fillText(str, 0, 0);
      ctx.restore();
    },
  };
  return studio;
}

// Executa um episódio: cada cena tem { inicio, fim, criar(studio) -> { atualizar(t) -> THREE.Scene } }
export function runEpisode(studio, ep) {
  const built = new Map();
  const get = (c) => { if (!built.has(c)) built.set(c, c.criar(studio)); return built.get(c); };
  const { renderer, camera, ctx } = studio;
  window.renderFrame = (t, idx = 0, q = 0.92) => {
    ctx.setTransform(studio.scale, 0, 0, studio.scale, 0, 0);
    const cena = ep.cenas.find(c => t >= c.inicio && t < c.fim);
    if (cena) {
      const sc = get(cena).atualizar(t);
      renderer.render(sc, camera);
      ctx.drawImage(renderer.domElement, 0, 0, W, H);
    } else { ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H); }
    ep.composicao?.(studio, t, idx);
    if (studio.legendas) ep.legenda?.(studio, t);
    return studio.out.toDataURL('image/jpeg', q);
  };
  // pré-compila todas as cenas (evita travadas no meio da renderização)
  for (const c of ep.cenas) window.renderFrame((c.inicio + c.fim) / 2);
  window.ready = true;
}
