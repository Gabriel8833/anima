// Mundo 3D estilizado (visual de desenho): materiais toon com contorno, carro, cidade, torre de rádio e ondas.
import { THREE, V, rng, lerp, clamp, mesh, skyDome, softTex, glowSprite } from './base.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

// ---------- materiais de desenho ----------
const grad = (() => { const d = new Uint8Array([90, 170, 255]); const t = new THREE.DataTexture(d, 3, 1, THREE.RedFormat); t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true; return t; })();
const cache = {};
export function toon(color, extra = {}) { const k = color + JSON.stringify(extra); return cache[k] ??= new THREE.MeshToonMaterial({ color, gradientMap: grad, ...extra }); }
const contornoMat = new THREE.MeshBasicMaterial({ color: 0x1a1420, side: THREE.BackSide });
// malha com contorno (casca invertida)
export function peca(geo, mat, { contorno = 0.04, sombra = true } = {}) {
  const g = new THREE.Group(); const m = mesh(geo, mat, sombra); g.add(m);
  if (contorno > 0) { const o = new THREE.Mesh(geo, contornoMat); o.scale.setScalar(1); o.userData.contorno = contorno; o.onBeforeRender = () => {}; geo.computeBoundingBox(); const b = geo.boundingBox, sz = new THREE.Vector3(); b.getSize(sz); o.scale.set(1 + contorno * 2 / Math.max(sz.x, 0.01), 1 + contorno * 2 / Math.max(sz.y, 0.01), 1 + contorno * 2 / Math.max(sz.z, 0.01)); g.add(o); g.userData.contorno = o; }
  g.userData.malha = m; return g;
}
export const caixa = (w, h, d, r = 0.08) => new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2 - 0.001, h / 2 - 0.001, d / 2 - 0.001));
// textura de texto/emoji em canvas
const texCache = {};
export function texTexto(txt, { w = 512, h = 256, cor = '#ffffff', fundo = null, tam = 120, borda = null } = {}) {
  const k = [txt, w, h, cor, fundo, tam, borda].join('|'); if (texCache[k]) return texCache[k];
  const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d');
  if (fundo) { x.fillStyle = fundo; x.beginPath(); x.roundRect(6, 6, w - 12, h - 12, 40); x.fill(); if (borda) { x.lineWidth = 10; x.strokeStyle = borda; x.stroke(); } }
  x.font = `900 ${tam}px Inter, "Noto Color Emoji", sans-serif`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = cor; x.fillText(txt, w / 2, h / 2 + tam * 0.05);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return (texCache[k] = t);
}
export function placa(txt, largura, opts = {}) { const t = texTexto(txt, opts); const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false, depthTest: opts.depthTest ?? true })); s.scale.set(largura, largura * (opts.h ?? 256) / (opts.w ?? 512), 1); return s; }

// ---------- carro ----------
// tipo de antena: 'mastro' (comprida), 'curta', 'barbatana', 'escondida' ou null
export function carro({ cor = 0xe8402a, antena = 'mastro', transparente = 0 } = {}) {
  const g = new THREE.Group();
  const ext = transparente ? { transparent: true, opacity: 1 - transparente, depthWrite: false } : {};
  const mc = toon(cor, ext), mv = toon(0x2a3a4a, { ...ext, ...(transparente ? {} : {}) }), mp = toon(0x1a1a1e), mr = toon(0xcfd4dc);
  const corpo = peca(caixa(4.4, 0.72, 1.86, 0.28), mc, { contorno: transparente ? 0 : 0.04 }); corpo.position.y = 0.72; g.add(corpo);
  const cabine = peca(caixa(2.3, 0.66, 1.62, 0.3), mc, { contorno: transparente ? 0 : 0.04 }); cabine.position.set(-0.25, 1.36, 0); g.add(cabine);
  const vidro = mesh(caixa(2.36, 0.46, 1.66, 0.22), toon(0x3a5a78, transparente ? { transparent: true, opacity: 0.35 * (1 - transparente), depthWrite: false } : { transparent: true, opacity: 0.85 }), false); vidro.position.set(-0.25, 1.4, 0); g.add(vidro);
  for (const s of [-1, 1]) { const f = mesh(caixa(0.12, 0.16, 0.36, 0.05), toon(0xfff4c0, { emissive: 0xfff0b0, emissiveIntensity: 0.8 }), false); f.position.set(2.18, 0.82, s * 0.62); g.add(f); const tr = mesh(caixa(0.1, 0.14, 0.34, 0.05), toon(0xd02020, { emissive: 0xa01010, emissiveIntensity: 0.6 }), false); tr.position.set(-2.18, 0.86, s * 0.62); g.add(tr); }
  const rodas = [];
  for (const [x, z] of [[1.35, 0.86], [-1.35, 0.86], [1.35, -0.86], [-1.35, -0.86]]) {
    const r = new THREE.Group(); r.position.set(x, 0.38, z);
    const pneu = peca(new THREE.CylinderGeometry(0.38, 0.38, 0.28, 24), mp, { contorno: 0.03 }); pneu.rotation.x = Math.PI / 2; r.add(pneu);
    const aro = mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.3, 6), mr, false); aro.rotation.x = Math.PI / 2; r.add(aro);
    g.add(r); rodas.push(r);
  }
  const roofY = 1.69;
  const ant = new THREE.Group(); ant.position.set(-0.95, roofY, 0); g.add(ant);
  const preta = toon(0x1a1a1e);
  if (antena === 'mastro') { ant.add(mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.08, 12), preta)); const m = mesh(new THREE.CylinderGeometry(0.014, 0.022, 0.95, 8), preta); m.position.set(-0.16, 0.46, 0); m.rotation.z = 0.34; ant.add(m); const b = mesh(new THREE.SphereGeometry(0.03, 10, 8), preta); b.position.set(-0.32, 0.92, 0); ant.add(b); ant.userData.topo = V(-0.32, 0.92, 0); }
  else if (antena === 'curta') { ant.add(mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.08, 12), preta)); const m = mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.32, 10), preta); m.position.set(-0.04, 0.18, 0); m.rotation.z = 0.25; ant.add(m); ant.userData.topo = V(-0.08, 0.34, 0); }
  else if (antena === 'barbatana') { const sh = new THREE.Shape(); sh.moveTo(0.22, 0); sh.quadraticCurveTo(0.05, 0.08, -0.12, 0.2); sh.quadraticCurveTo(-0.2, 0.18, -0.22, 0); sh.closePath(); const geo = new THREE.ExtrudeGeometry(sh, { depth: 0.12, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.03, bevelSegments: 3 }); geo.translate(0, 0, -0.06); const f = peca(geo, toon(0x1e1e24, transparente ? {} : {}), { contorno: 0.015 }); ant.add(f); ant.userData.fin = f; ant.userData.topo = V(-0.1, 0.2, 0); }
  else if (antena === 'escondida') { const m = mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8), preta); m.position.set(0.5, -0.45, 0); m.rotation.z = Math.PI / 2; ant.add(m); ant.userData.topo = V(0.5, -0.45, 0); }
  g.userData = { rodas, antena: ant, roofY, cor };
  return g;
}
export function rodar(car, dist) { for (const r of car.userData.rodas) r.rotation.z = -dist / 0.38; }
export function topoAntena(car) { const p = car.userData.antena.userData.topo.clone(); car.userData.antena.localToWorld(p); return p; }

// ---------- cidade / estrada ----------
export function cidade(scene, { hora = 'dia', x0 = -260, x1 = 260, lados = [-1, 1] } = {}) {
  const dia = hora === 'dia';
  const ceu = dia ? { top: 0x3a8ae0, mid: 0x7ab8f0, horizon: 0xd8ecf8, bottom: 0x8a9aa8, sunColor: 0xfff2c0, sunDir: V(0.4, 0.5, -0.6) } : { top: 0x2a3a7a, mid: 0xc86a6a, horizon: 0xffc080, bottom: 0x6a5a6a, sunColor: 0xffb060, sunDir: V(0.7, 0.06, -0.7) };
  scene.add(skyDome({ ...ceu, sunSize: 3, glow: 0.5 }));
  scene.fog = new THREE.Fog(dia ? 0xd8ecf8 : 0xe8a878, 60, 420);
  scene.add(new THREE.HemisphereLight(dia ? 0xdfefff : 0xffd0a0, dia ? 0x5a6a5a : 0x5a4050, dia ? 1.3 : 1.0));
  const sol = new THREE.DirectionalLight(dia ? 0xfff6e0 : 0xffb070, dia ? 2.4 : 2.0); sol.position.set(ceu.sunDir.x * 60, Math.max(8, ceu.sunDir.y * 60), ceu.sunDir.z * 60);
  sol.castShadow = true; sol.shadow.mapSize.set(2048, 2048); Object.assign(sol.shadow.camera, { left: -30, right: 30, top: 30, bottom: -30, near: 1, far: 200 }); sol.shadow.bias = -0.0005;
  scene.add(sol); scene.add(sol.target); scene.userData.sol = sol;
  // chão, estrada, faixas, calçadas
  const L = x1 - x0, cx = (x0 + x1) / 2;
  const chao = mesh(new THREE.PlaneGeometry(L + 400, 800), toon(dia ? 0x7aa85a : 0x8a7a5a)); chao.rotation.x = -Math.PI / 2; chao.position.set(cx, -0.02, 0); scene.add(chao);
  const rua = mesh(new THREE.PlaneGeometry(L + 400, 9), toon(0x3a3c44)); rua.rotation.x = -Math.PI / 2; rua.position.set(cx, 0, 0); scene.add(rua);
  const faixa = new THREE.InstancedMesh(new THREE.PlaneGeometry(2.2, 0.18), toon(0xf6f2e0), Math.ceil((L + 400) / 6)); faixa.receiveShadow = true;
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0));
  for (let i = 0; i < faixa.count; i++) { m4.compose(V(x0 - 200 + i * 6, 0.01, 0), q, V(1, 1, 1)); faixa.setMatrixAt(i, m4); } scene.add(faixa);
  for (const s of [-1, 1]) { const c = mesh(new THREE.BoxGeometry(L + 400, 0.25, 3), toon(0xb8b4aa)); c.position.set(cx, 0.12, s * 6); scene.add(c); }
  // prédios coloridos com janelas
  const r = rng(11), cores = [0xe8a070, 0x70b0d8, 0xf0d070, 0xa0c880, 0xd88aa8, 0xc8c0b0, 0x9a8ad0];
  const jan = toon(dia ? 0x9ac8e8 : 0xffd890, dia ? {} : { emissive: 0xffc070, emissiveIntensity: 0.6 });
  for (let x = x0; x < x1; x += 9 + r() * 6) for (const s of lados) {
    if (r() < 0.15) { // árvore
      const tr = new THREE.Group(); tr.position.set(x, 0, s * (9 + r() * 3)); tr.add(peca(new THREE.CylinderGeometry(0.25, 0.3, 2.4, 8), toon(0x6a4a2a), { contorno: 0.03 })); tr.children[0].position.y = 1.2; const copa = peca(new THREE.SphereGeometry(1.8, 12, 10), toon(0x4a9a4a), { contorno: 0.05 }); copa.position.y = 3.4; tr.add(copa); scene.add(tr); continue;
    }
    const w = 6 + r() * 4, d = 6 + r() * 4, h = 6 + r() * 18;
    const b = peca(caixa(w, h, d, 0.2), toon(cores[Math.floor(r() * cores.length)]), { contorno: 0.06 }); b.position.set(x, h / 2, s * ((s > 0 ? 20 : 8) + d / 2 + r() * 4)); scene.add(b);
    const fz = -s; // fachada voltada para a rua
    for (let yy = 2; yy < h - 1.5; yy += 2.6) for (let xx = -w / 2 + 1.2; xx < w / 2 - 1; xx += 1.9) { const j = mesh(new THREE.PlaneGeometry(1.0, 1.3), jan, false); j.position.set(x + xx, yy, b.position.z + fz * (d / 2 + 0.02)); if (fz < 0) j.rotation.y = Math.PI; scene.add(j); }
  }
  // postes
  for (let x = x0; x < x1; x += 24) for (const s of [-1, 1]) { const p = mesh(new THREE.CylinderGeometry(0.08, 0.1, 6, 8), toon(0x4a4a52)); p.position.set(x + (s > 0 ? 12 : 0), 3, s * 5.6); scene.add(p); const l = mesh(new THREE.SphereGeometry(0.25, 10, 8), toon(0xfff0c0, { emissive: 0xffe0a0, emissiveIntensity: dia ? 0.2 : 1 }), false); l.position.set(p.position.x, 6.1, s * 5.0); scene.add(l); }
}

// ---------- torre de rádio ----------
export function torre(scene, x, z, alt = 40) {
  const g = new THREE.Group(); g.position.set(x, 0, z);
  const n = 8; for (let i = 0; i < n; i++) { const s = mesh(new THREE.CylinderGeometry(lerp(1.6, 0.3, (i + 1) / n), lerp(1.6, 0.3, i / n), alt / n, 4, 1, true), toon(i % 2 ? 0xf6f2ea : 0xd8302a, { wireframe: true })); s.position.y = alt / n * (i + 0.5); g.add(s); }
  const luz = glowSprite(0xff3030, 4, 1); luz.position.y = alt + 0.6; g.add(luz); g.userData.luz = luz; g.userData.topo = V(x, alt, z);
  scene.add(g); return g;
}
// anéis de ondas que se expandem a partir de um ponto (horizontais) — "linhas luminosas"
export function ondasAneis(scene, centro, { n = 5, cor = 0x7af0ff, raioMax = 120 } = {}) {
  const anel = []; for (let i = 0; i < n; i++) { const m = new THREE.Mesh(new THREE.TorusGeometry(1, 0.025, 6, 96), new THREE.MeshBasicMaterial({ color: cor, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false, fog: false })); m.position.copy(centro); scene.add(m); anel.push(m); }
  return (t, vel = 0.35, ativo = 1) => anel.forEach((m, i) => { const u = (t * vel + i / n) % 1; const r = 1 + u * raioMax; m.scale.set(r, r, r); m.material.opacity = ativo * 0.9 * (1 - u); m.rotation.x = Math.PI / 2; m.scale.z = r * 0.25; });
}
// textura de pulsos (para tubos com fluxo)
let pulsoTex = null;
function texPulso() { if (pulsoTex) return pulsoTex; const c = document.createElement('canvas'); c.width = 256; c.height = 16; const x = c.getContext('2d'); const g = x.createLinearGradient(0, 0, 256, 0); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.7, 'rgba(255,255,255,0.15)'); g.addColorStop(0.92, 'rgba(255,255,255,1)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 256, 16); pulsoTex = new THREE.CanvasTexture(c); pulsoTex.wrapS = THREE.RepeatWrapping; return pulsoTex; }
// onda senoidal luminosa de A até B, com pulsos correndo
export function ondaSeno(scene, A, B, { cor = 0x7af0ff, amp = 0.6, ciclos = 6, raio = 0.05, repet = 4 } = {}) {
  const pts = [], dir = B.clone().sub(A), len = dir.length(); dir.normalize();
  const lado = new THREE.Vector3(0, 1, 0).cross(dir); if (lado.length() < 0.01) lado.set(1, 0, 0); lado.normalize();
  for (let i = 0; i <= 200; i++) { const u = i / 200; const p = A.clone().addScaledVector(dir, len * u).addScaledVector(lado, Math.sin(u * ciclos * Math.PI * 2) * amp * Math.min(1, (1 - u) * 4)); pts.push(p); }
  const tex = texPulso().clone(); tex.repeat.set(repet, 1); tex.needsUpdate = true;
  const mat = new THREE.MeshBasicMaterial({ color: cor, map: tex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false });
  const m = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 400, raio, 6), mat); scene.add(m);
  const base = new THREE.Mesh(m.geometry, new THREE.MeshBasicMaterial({ color: cor, transparent: true, opacity: 0.15, blending: THREE.AdditiveBlending, depthWrite: false, fog: false })); scene.add(base);
  return (t, a = 1) => { tex.offset.x = -t * 1.2; mat.opacity = a; base.material.opacity = 0.15 * a; m.visible = base.visible = a > 0.01; };
}
// partículas "poof"
export function poof(scene, pos, cor = 0xffffff) { const list = []; const r = rng(3); for (let i = 0; i < 12; i++) { const s = glowSprite(cor, 0.3, 0.8); s.userData.v = V(r() - 0.5, r() * 0.8, r() - 0.5).multiplyScalar(2); s.position.copy(pos); scene.add(s); list.push(s); } return (dt) => list.forEach(s => { const u = clamp(dt / 0.8); s.visible = dt > 0 && dt < 0.8; s.position.copy(pos).addScaledVector(s.userData.v, u); s.material.opacity = 0.8 * (1 - u); s.scale.setScalar(0.3 + u * 0.5); }); }
