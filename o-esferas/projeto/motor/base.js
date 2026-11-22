// Motor — utilitários de matemática, ruído, geometria, texturas e materiais.
import * as THREE from 'three';
export { THREE };
export { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

export const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, u) => a + (b - a) * u;
export const sstep = (a, b, x) => { const u = clamp((x - a) / (b - a)); return u * u * (3 - 2 * u); };
export const easeInOut = u => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
export const easeOut = u => 1 - Math.pow(1 - u, 3);
export const easeIn = u => u * u * u;
export const linear = u => u;
// janela: sobe em [a,b], desce em [c,d]
export const win = (x, a, b, c, d) => sstep(a, b, x) * (1 - sstep(c, d, x));

// Keyframes: kf(t, [[t0, v0], [t1, v1], ...]); v pode ser número ou array.
export function kf(t, keys, ease = easeInOut) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [t0, v0] = keys[i], [t1, v1] = keys[i + 1];
    if (t < t1) {
      const u = ease((t - t0) / (t1 - t0));
      return Array.isArray(v0) ? v0.map((a, j) => lerp(a, v1[j], u)) : lerp(v0, v1, u);
    }
  }
  return keys[keys.length - 1][1];
}

export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function hash2(x, y) { const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return s - Math.floor(s); }
export function noise2(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  return lerp(lerp(hash2(xi, yi), hash2(xi + 1, yi), u), lerp(hash2(xi, yi + 1), hash2(xi + 1, yi + 1), u), v) * 2 - 1;
}
export function fbm(x, y, oct = 4) {
  let s = 0, a = 0.5, f = 1;
  for (let i = 0; i < oct; i++) { s += a * noise2(x * f, y * f); f *= 2.03; a *= 0.5; }
  return s;
}
export function shake(t, amp, freq = 18) {
  return [
    amp * (Math.sin(t * freq) * 0.6 + Math.sin(t * freq * 2.31 + 1.3) * 0.4),
    amp * (Math.sin(t * freq * 1.17 + 2.1) * 0.6 + Math.sin(t * freq * 2.73 + 0.4) * 0.4),
  ];
}
// impulso que decai após o instante te
export const impulse = (t, te, amp, dur = 0.5) => (t > te ? amp * Math.exp(-(t - te) / dur * 3) : 0);

// Tubo afunilado ao longo de uma curva (troncos, chifres, raízes, cajados).
export function taperTube(pts, r0, r1, rs = 7, ts = null) {
  const curve = new THREE.CatmullRomCurve3(pts);
  ts = ts || Math.max(6, pts.length * 4);
  const g = new THREE.TubeGeometry(curve, ts, 1, rs, false);
  const pos = g.attributes.position, c = new THREE.Vector3(), p = new THREE.Vector3();
  for (let i = 0; i <= ts; i++) {
    const u = i / ts; curve.getPointAt(u, c);
    const r = lerp(r0, r1, Math.pow(u, 0.8));
    for (let j = 0; j <= rs; j++) {
      const k = i * (rs + 1) + j;
      p.fromBufferAttribute(pos, k).sub(c).multiplyScalar(r).add(c);
      pos.setXYZ(k, p.x, p.y, p.z);
    }
  }
  return g;
}

// ---------- Texturas procedurais ----------
const texCache = {};
function canvasTex(key, w, h, draw, srgb = false) {
  if (texCache[key]) return texCache[key];
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  return (texCache[key] = t);
}
export const softTex = () => canvasTex('soft', 128, 128, (x) => {
  const g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.35, 'rgba(255,255,255,0.55)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g; x.fillRect(0, 0, 128, 128);
});
export const cloudTex = () => canvasTex('cloud', 256, 256, (x) => {
  const r = rng(7);
  for (let i = 0; i < 40; i++) {
    const px = 128 + (r() - 0.5) * 140, py = 128 + (r() - 0.5) * 70, rad = 30 + r() * 50;
    const g = x.createRadialGradient(px, py, 0, px, py, rad);
    g.addColorStop(0, 'rgba(255,255,255,0.35)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g; x.fillRect(0, 0, 256, 256);
  }
});
// raios verticais para feixes de luz volumétrica
export const shaftTex = () => canvasTex('shaft', 256, 256, (x) => {
  const r = rng(5);
  for (let i = 0; i < 40; i++) {
    const xx = r() * 256, w = 4 + r() * 18, g = x.createLinearGradient(0, 0, 0, 256);
    g.addColorStop(0, `rgba(255,255,255,${0.15 + r() * 0.35})`); g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g; x.fillRect(xx, 0, w, 256);
  }
});
// Glifo rúnico aleatório (desenhado em branco; tingir pelo material)
export function drawRune(x, cx, cy, s, r) {
  x.beginPath();
  const n = 2 + Math.floor(r() * 3);
  for (let i = 0; i < n; i++) {
    const a = r() * 6.28, b = r() * 6.28;
    x.moveTo(cx + Math.cos(a) * s, cy + Math.sin(a) * s);
    if (r() < 0.5) x.lineTo(cx + Math.cos(b) * s, cy + Math.sin(b) * s);
    else x.quadraticCurveTo(cx, cy, cx + Math.cos(b) * s, cy + Math.sin(b) * s);
  }
  if (r() < 0.5) { x.moveTo(cx + s * 0.35, cy); x.arc(cx, cy, s * 0.35, 0, 6.28); }
  x.stroke();
}
export const runeSheet = (seed = 1) => canvasTex('runes' + seed, 512, 512, (x) => {
  const r = rng(seed);
  x.strokeStyle = '#fff'; x.lineWidth = 6; x.lineCap = 'round'; x.shadowColor = '#fff'; x.shadowBlur = 10;
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) drawRune(x, 64 + i * 128, 64 + j * 128, 44, r);
});
// círculo mágico (anel de runas)
export const magicCircleTex = (seed = 2) => canvasTex('circle' + seed, 512, 512, (x) => {
  const r = rng(seed);
  x.strokeStyle = '#fff'; x.lineCap = 'round'; x.shadowColor = '#fff'; x.shadowBlur = 12;
  x.lineWidth = 6; x.beginPath(); x.arc(256, 256, 240, 0, 6.28); x.stroke();
  x.lineWidth = 3; x.beginPath(); x.arc(256, 256, 200, 0, 6.28); x.stroke();
  x.beginPath(); x.arc(256, 256, 120, 0, 6.28); x.stroke();
  for (let k = 0; k < 2; k++) { x.beginPath(); for (let i = 0; i <= 6; i++) { const a = i / 6 * 6.28 + k * 0.52; x[i ? 'lineTo' : 'moveTo'](256 + Math.cos(a) * 200, 256 + Math.sin(a) * 200); } x.stroke(); }
  x.lineWidth = 4;
  for (let i = 0; i < 14; i++) { const a = i / 14 * 6.28; drawRune(x, 256 + Math.cos(a) * 220, 256 + Math.sin(a) * 220, 12, r); }
});

// ---------- Materiais ----------
const matCache = {};
export function std(color, rough = 0.85, metal = 0, extra = {}) {
  const key = [color, rough, metal, JSON.stringify(extra)].join('|');
  if (!matCache[key]) matCache[key] = new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal, ...extra });
  return matCache[key];
}
export const additive = (color, opacity = 1, map = softTex(), extra = {}) => new THREE.MeshBasicMaterial({
  color, map, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false, ...extra,
});
export function glowSprite(color, size, opacity = 1) {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: softTex(), color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
  s.scale.set(size, size, 1);
  return s;
}
export function mesh(geo, mat, shadow = true) { const m = new THREE.Mesh(geo, mat); m.castShadow = shadow; m.receiveShadow = shadow; return m; }

// Céu em gradiente com sol/lua e (opcional) eclipse e estrelas.
export function skyDome({ top, mid, horizon, bottom, sunDir = V(0, 0.2, -1), sunColor = 0x000000, sunSize = 1, glow = 0.3, stars = 0, radius = 3000 }) {
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: {
      top: { value: new THREE.Color(top) }, mid: { value: new THREE.Color(mid) }, horizon: { value: new THREE.Color(horizon) }, bottom: { value: new THREE.Color(bottom) },
      sunDir: { value: sunDir.clone().normalize() }, sunColor: { value: new THREE.Color(sunColor) }, sunSize: { value: sunSize }, glow: { value: glow },
      stars: { value: stars }, eclipse: { value: 0 },
    },
    vertexShader: `varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);} `,
    fragmentShader: `uniform vec3 top,mid,horizon,bottom,sunDir,sunColor; uniform float sunSize,glow,stars,eclipse; varying vec3 vDir;
      float h21(vec3 p){ return fract(sin(dot(p, vec3(12.9898,78.233,45.164)))*43758.5453); }
      void main(){ vec3 d = normalize(vDir); float h = d.y; vec3 c;
        if(h>0.0){ c = mix(horizon, mid, smoothstep(0.0,0.2,h)); c = mix(c, top, smoothstep(0.15,0.75,h)); }
        else { c = mix(horizon, bottom, smoothstep(0.0,0.12,-h)); }
        float sd = max(dot(d, sunDir), 0.0);
        float disk = smoothstep(1.0 - sunSize*0.0004, 1.0 - sunSize*0.0003, sd);
        float halo = pow(sd, 10.0)*glow + pow(sd, 90.0)*0.5;
        // eclipse: disco escuro com coroa
        float ring = smoothstep(1.0 - sunSize*0.00055, 1.0 - sunSize*0.0004, sd) - disk;
        vec3 sunC = sunColor * (disk*2.5 + halo);
        c += mix(sunC, sunColor*(ring*4.0 + halo*0.7) - disk*c*0.95, eclipse);
        if(stars > 0.0 && h > 0.0){ vec3 q = floor(d*420.0); float s = step(0.9965, h21(q)); c += vec3(s)*stars*smoothstep(0.0,0.3,h)*(0.6+0.4*h21(q+1.0)); }
        gl_FragColor = vec4(c,1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  });
  const m = new THREE.Mesh(new THREE.SphereGeometry(radius, 48, 24), mat);
  m.renderOrder = -10; m.frustumCulled = false;
  return m;
}

// Pontos de partículas com posições recalculadas a cada quadro.
export function particles(n, color, size, { additive: add = true, opacity = 1, map = softTex() } = {}) {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
  const mat = new THREE.PointsMaterial({ color, size, map, transparent: true, opacity, depthWrite: false,
    blending: add ? THREE.AdditiveBlending : THREE.NormalBlending, sizeAttenuation: true });
  const p = new THREE.Points(geo, mat); p.frustumCulled = false;
  const r = rng(n * 13 + size * 1000);
  p.userData.seeds = Array.from({ length: n }, () => [r(), r(), r(), r(), r()]);
  return p;
}
// Atualiza um sistema de partículas: fn(seed, i) -> [x,y,z] ou null (esconde).
export function updateParticles(p, fn) {
  const a = p.geometry.attributes.position;
  p.userData.seeds.forEach((s, i) => { const r = fn(s, i); if (r) a.setXYZ(i, r[0], r[1], r[2]); else a.setXYZ(i, 0, -9999, 0); });
  a.needsUpdate = true;
}

// Feixe de luz volumétrica (cone aditivo).
export function lightShaft(rTop, rBottom, height, color, opacity = 0.4) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBottom, height, 32, 1, true), additive(color, opacity, shaftTex()));
  m.renderOrder = 5;
  return m;
}

// Névoa em sprites
export function mistSprites(group, n, area, { color = 0x8899aa, y = [0.2, 3], size = [6, 16], opacity = [0.08, 0.2], seed = 3 } = {}) {
  const r = rng(seed), list = [];
  for (let i = 0; i < n; i++) {
    const m = new THREE.Sprite(new THREE.SpriteMaterial({ map: cloudTex(), color, transparent: true, opacity: lerp(opacity[0], opacity[1], r()), depthWrite: false }));
    const s = lerp(size[0], size[1], r()); m.scale.set(s * 1.8, s * 0.6, 1);
    m.position.set(lerp(area[0], area[1], r()), lerp(y[0], y[1], r()), lerp(area[2], area[3], r()));
    m.userData = { base: m.position.clone(), sp: lerp(0.15, 0.5, r()), ph: r() * 6 };
    group.add(m); list.push(m);
  }
  return list;
}
export function animateMist(list, t) {
  for (const m of list) { const u = m.userData; m.position.x = u.base.x + Math.sin(t * u.sp * 0.3 + u.ph) * 2 + t * u.sp * 0.4; m.position.y = u.base.y + Math.sin(t * 0.4 + u.ph) * 0.2; }
}
