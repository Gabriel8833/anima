// Cenários: reino de Eldoria, floresta amaldiçoada, clareira do altar e cume com vista das montanhas.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { V, rng, fbm, noise2, lerp, sstep, taperTube, std, cloudTex, softTex, skyDome, glowSprite, makeSoldier } from './lib.js';

// ================= Floresta =================
export const FOREST = { fog: 0x0f2a2d, sky: 0x10292c, mist: 0x6aa6a0 };

function makeTree(r, x, z, h, geos, leafGeos) {
  const n = 7, pts = [];
  let px = x, pz = z;
  const lx = (r() - 0.5) * 1.2, lz = (r() - 0.5) * 1.2;
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    if (i > 0) { px += (r() - 0.5) * 0.9 + lx * 0.25; pz += (r() - 0.5) * 0.9 + lz * 0.25; }
    pts.push(V(px, i === 0 ? -0.6 : u * h, pz));
  }
  const base = lerp(0.32, 0.62, r());
  geos.push(taperTube(pts, base, base * 0.12, 9, 28));
  for (let k = 0; k < 5; k++) {
    const a = k / 5 * Math.PI * 2 + r();
    const c = Math.cos(a), s = Math.sin(a);
    geos.push(taperTube([V(x, 1.0, z), V(x + c * 0.8, 0.35, z + s * 0.8), V(x + c * 1.7, 0.02, z + s * 1.7), V(x + c * 2.4, -0.25, z + s * 2.4)], base * 0.55, 0.04, 6, 10));
  }
  const curve = new THREE.CatmullRomCurve3(pts);
  const nb = 3 + Math.floor(r() * 4);
  for (let k = 0; k < nb; k++) {
    const u = 0.4 + r() * 0.55;
    const p = curve.getPointAt(u);
    const a = r() * Math.PI * 2, c = Math.cos(a), s = Math.sin(a);
    const L = lerp(2.2, 4.5, r()) * (1.2 - u * 0.5);
    const bp = [p.clone(),
      p.clone().add(V(c * L * 0.35, L * 0.32, s * L * 0.35)),
      p.clone().add(V(c * L * 0.65 + (r() - 0.5), L * 0.42, s * L * 0.65 + (r() - 0.5))),
      p.clone().add(V(c * L, L * 0.25 - r() * 0.6, s * L))];
    geos.push(taperTube(bp, base * 0.32 * (1.15 - u * 0.5), 0.015, 6, 14));
    const bc = new THREE.CatmullRomCurve3(bp);
    for (let j = 0; j < 2; j++) {
      const q = bc.getPointAt(0.45 + r() * 0.4);
      const a2 = a + (r() - 0.5) * 2.2, l2 = L * 0.4;
      geos.push(taperTube([q, q.clone().add(V(Math.cos(a2) * l2 * 0.5, l2 * 0.35, Math.sin(a2) * l2 * 0.5)), q.clone().add(V(Math.cos(a2) * l2, l2 * 0.2 - 0.3, Math.sin(a2) * l2))], 0.05, 0.01, 5, 8));
    }
    if (r() < 0.55) {
      const e = bp[3];
      const lg = new THREE.IcosahedronGeometry(lerp(0.6, 1.3, r()), 1);
      lg.scale(1.3, 0.75, 1.2); lg.translate(e.x, e.y + 0.2, e.z);
      leafGeos.push(lg);
    }
  }
}

export function buildForest({ seed = 1, keepOut, area, count, groundSize = 260, withMist = 60, mistArea = area, center = [0, 0] }) {
  const group = new THREE.Group();
  const r = rng(seed);
  const geos = [], leaf = [];
  let placed = 0, tries = 0;
  const trees = [];
  while (placed < count && tries < count * 30) {
    tries++;
    const x = lerp(area[0], area[1], r()), z = lerp(area[2], area[3], r());
    if (keepOut(x, z)) continue;
    if (trees.some(t => (t[0] - x) ** 2 + (t[1] - z) ** 2 < 6.5)) continue;
    trees.push([x, z]);
    makeTree(r, x, z, lerp(9, 15, r()), geos, leaf);
    placed++;
  }
  const bark = std(0x2a3431, 0.95);
  const trunks = new THREE.Mesh(mergeGeometries(geos), bark);
  trunks.castShadow = true; trunks.receiveShadow = true; group.add(trunks);
  if (leaf.length) {
    const lm = new THREE.Mesh(mergeGeometries(leaf), std(0x163834, 0.9, 0, { flatShading: true }));
    lm.castShadow = true; group.add(lm);
  }
  // chão com trilha (cores por vértice)
  const gg = new THREE.PlaneGeometry(groundSize, groundSize, 160, 160);
  gg.rotateX(-Math.PI / 2); gg.translate(center[0], 0, center[1]);
  const pos = gg.attributes.position, cols = [];
  const moss = new THREE.Color(0x1d322c), moss2 = new THREE.Color(0x15241f), dirt = new THREE.Color(0x3b3a30);
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i);
    const k = keepOut(x, z) ? 1 : 0;
    const n = fbm(x * 0.15, z * 0.15);
    pos.setY(i, (1 - k) * (n * 0.35 + 0.1) + fbm(x * 0.8, z * 0.8, 2) * 0.05);
    const c = moss.clone().lerp(moss2, sstep(-0.3, 0.4, n));
    if (k) c.lerp(dirt, 0.55 + 0.25 * noise2(x * 0.7, z * 0.7));
    cols.push(c.r, c.g, c.b);
  }
  gg.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
  gg.computeVertexNormals();
  const ground = new THREE.Mesh(gg, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 }));
  ground.receiveShadow = true; group.add(ground);
  // pedras, samambaias e cogumelos luminosos
  const rocks = [], ferns = [], shrooms = [];
  for (let i = 0; i < count * 1.6; i++) {
    const x = lerp(area[0], area[1], r()), z = lerp(area[2], area[3], r());
    const near = keepOut(x, z);
    const t = r();
    if (t < 0.25 && !near) {
      const g = new THREE.DodecahedronGeometry(lerp(0.2, 0.9, r()), 0);
      g.scale(1, 0.6, 1.1); g.rotateY(r() * 6); g.translate(x, 0.05, z); rocks.push(g);
    } else if (!near && t < 0.85) {
      for (let k = 0; k < 5; k++) {
        const g = new THREE.ConeGeometry(0.06, lerp(0.4, 0.9, r()), 4);
        g.translate(0, 0.25, 0); g.rotateZ((r() - 0.5) * 1.2); g.rotateX((r() - 0.5) * 1.2);
        g.translate(x + (r() - 0.5) * 0.4, 0, z + (r() - 0.5) * 0.4); ferns.push(g);
      }
    } else if (!near) {
      for (let k = 0; k < 3; k++) {
        const g = new THREE.SphereGeometry(0.06, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2);
        g.translate(x + (r() - 0.5) * 0.3, 0.12 + r() * 0.08, z + (r() - 0.5) * 0.3); shrooms.push(g);
      }
    }
  }
  if (rocks.length) { const m = new THREE.Mesh(mergeGeometries(rocks), std(0x3c4644, 0.95, 0, { flatShading: true })); m.castShadow = m.receiveShadow = true; group.add(m); }
  if (ferns.length) group.add(new THREE.Mesh(mergeGeometries(ferns), std(0x1e4a3e, 0.9)));
  if (shrooms.length) group.add(new THREE.Mesh(mergeGeometries(shrooms), new THREE.MeshStandardMaterial({ color: 0x4fe0c8, emissive: 0x22b8a4, emissiveIntensity: 1.4 })));
  // névoa
  const mist = [];
  for (let i = 0; i < withMist; i++) {
    const m = new THREE.Sprite(new THREE.SpriteMaterial({ map: cloudTex(), color: FOREST.mist, transparent: true, opacity: lerp(0.08, 0.2, r()), depthWrite: false }));
    const s = lerp(6, 16, r()); m.scale.set(s * 1.8, s * 0.6, 1);
    m.position.set(lerp(mistArea[0], mistArea[1], r()), lerp(0.3, 3.0, r()), lerp(mistArea[2], mistArea[3], r()));
    m.userData = { base: m.position.clone(), sp: lerp(0.15, 0.5, r()), ph: r() * 6 };
    group.add(m); mist.push(m);
  }
  return { group, mist, trees };
}

export function animateMist(mist, t) {
  for (const m of mist) {
    const u = m.userData;
    m.position.x = u.base.x + Math.sin(t * u.sp * 0.3 + u.ph) * 2 + t * u.sp * 0.4;
    m.position.y = u.base.y + Math.sin(t * 0.4 + u.ph) * 0.2;
  }
}

export function forestLights(scene, { moon = 1.3, hemi = 0.9, shadowCenter = V(0, 0, 0), shadowSize = 30 } = {}) {
  scene.fog = new THREE.FogExp2(FOREST.fog, 0.05);
  scene.background = new THREE.Color(FOREST.sky);
  const hl = new THREE.HemisphereLight(0x5f97a0, 0x0b1714, hemi); scene.add(hl);
  const dl = new THREE.DirectionalLight(0xa6dbe0, moon);
  dl.position.copy(shadowCenter).add(V(-12, 30, 8)); dl.target.position.copy(shadowCenter);
  dl.castShadow = true; dl.shadow.mapSize.set(2048, 2048);
  const c = dl.shadow.camera; c.left = c.bottom = -shadowSize; c.right = c.top = shadowSize; c.near = 1; c.far = 90;
  dl.shadow.bias = -0.0008; dl.shadow.normalBias = 0.03;
  scene.add(dl, dl.target);
  return { hl, dl };
}

// Olhos amarelos nas sombras
export function makeEyes(scene, list) {
  const mat = new THREE.MeshBasicMaterial({ color: 0xffd23a, fog: false });
  return list.map(([x, y, z, ph, rot = 0]) => {
    const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = rot;
    for (const s of [-1, 1]) {
      const e = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 6), mat); e.position.x = s * 0.07; e.scale.set(1.3, 0.8, 0.5); g.add(e);
    }
    const gl = glowSprite(0xffc020, 0.5, 0.55); g.add(gl);
    g.userData.ph = ph; scene.add(g); return g;
  });
}
export function animateEyes(eyes, t, on = 1) {
  for (const e of eyes) {
    const ph = e.userData.ph;
    const cyc = (t * 0.7 + ph) % 3.0;
    const open = cyc < 0.25 ? 0 : (cyc < 0.4 ? (cyc - 0.25) / 0.15 : (cyc > 2.75 ? 0.1 : 1));
    const appear = sstep(0, 0.6, on * 3 - ph * 0.3);
    const k = Math.max(0.02, open * appear);
    e.children[0].scale.y = 0.8 * k; e.children[1].scale.y = 0.8 * k;
    e.children[2].material.opacity = 0.55 * k;
    e.visible = appear > 0.01;
  }
}

// Criatura da floresta (silhueta escura)
export function makeCreature() {
  const g = new THREE.Group();
  const m = std(0x050807, 1);
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.7, 14, 10), m); body.scale.set(1.6, 0.8, 0.8); body.position.y = 1.4; g.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 8), m); head.position.set(1.15, 1.55, 0); g.add(head);
  const eyeM = new THREE.MeshBasicMaterial({ color: 0xffd23a, fog: false });
  for (const s of [-1, 1]) { const e = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 6), eyeM); e.position.set(1.43, 1.6, s * 0.12); g.add(e); }
  const gl = glowSprite(0xffc020, 0.7, 0.5); gl.position.set(1.45, 1.6, 0); g.add(gl);
  g.legs = [];
  for (const [lx, lz] of [[0.7, 0.35], [0.7, -0.35], [-0.7, 0.35], [-0.7, -0.35]]) {
    const leg = new THREE.Group(); leg.position.set(lx, 1.3, lz); g.add(leg);
    leg.add(new THREE.Mesh(taperTube([V(0, 0, 0), V(0.25, -0.6, 0), V(0.05, -1.3, 0)], 0.13, 0.04, 6, 8), m));
    g.legs.push(leg);
  }
  const spines = [];
  for (let i = 0; i < 6; i++) { const c = new THREE.ConeGeometry(0.06, 0.4, 5); c.translate(0, 0.2, 0); c.rotateZ(-0.6); c.translate(-0.8 + i * 0.3, 1.9, 0); spines.push(c); }
  g.add(new THREE.Mesh(mergeGeometries(spines), m));
  g.traverse(o => { if (o.isMesh) o.castShadow = true; });
  return g;
}
export function animateCreature(c, t) {
  c.legs.forEach((l, i) => { l.rotation.z = Math.sin(t * 6 + (i % 2 ? Math.PI : 0) + (i > 1 ? 1.5 : 0)) * 0.45; });
  c.children[0].position.y = 1.4 + Math.sin(t * 12) * 0.04;
}

// ================= Reino de Eldoria =================
function towerGeo(geos, roofs, x, y, z, r, h, roofH, seg = 14) {
  const t = new THREE.CylinderGeometry(r, r * 1.06, h, seg); t.translate(x, y + h / 2, z); geos.push(t);
  const cr = new THREE.CylinderGeometry(r * 1.12, r * 1.12, 0.12 * r + 0.6, seg); cr.translate(x, y + h, z); geos.push(cr);
  const roof = new THREE.ConeGeometry(r * 1.25, roofH, seg); roof.translate(x, y + h + roofH / 2 + 0.3, z); roofs.push(roof);
  return y + h + roofH + 0.3;
}
function wallGeo(geos, a, b, y, h, th) {
  const d = b.clone().sub(a), L = d.length();
  const w = new THREE.BoxGeometry(L, h, th);
  w.rotateY(-Math.atan2(d.z, d.x)); const m = a.clone().add(b).multiplyScalar(0.5);
  w.translate(m.x, y + h / 2, m.z); geos.push(w);
  const n = Math.floor(L / 2.2);
  for (let i = 0; i < n; i++) {
    const p = a.clone().lerp(b, (i + 0.5) / n);
    const c = new THREE.BoxGeometry(1.1, 1.1, th * 1.1); c.rotateY(-Math.atan2(d.z, d.x)); c.translate(p.x, y + h + 0.55, p.z); geos.push(c);
  }
}
function castle(geos, roofs, cx, cy, cz, R, scale = 1, seed = 3) {
  const r = rng(seed); const N = 7;
  const tops = [];
  for (let i = 0; i < N; i++) {
    const a = i / N * Math.PI * 2, b = (i + 1) / N * Math.PI * 2;
    const pa = V(cx + Math.cos(a) * R, 0, cz + Math.sin(a) * R), pb = V(cx + Math.cos(b) * R, 0, cz + Math.sin(b) * R);
    wallGeo(geos, pa, pb, cy, 9 * scale, 2.2 * scale);
    towerGeo(geos, roofs, pa.x, cy, pa.z, 3.2 * scale, lerp(16, 22, r()) * scale, 9 * scale);
  }
  const k = new THREE.BoxGeometry(R * 0.7, 22 * scale, R * 0.6); k.translate(cx + R * 0.15, cy + 11 * scale, cz + R * 0.1); geos.push(k);
  const kr = new THREE.ConeGeometry(R * 0.55, 12 * scale, 4); kr.rotateY(Math.PI / 4); kr.scale(1, 1, 0.85); kr.translate(cx + R * 0.15, cy + 28 * scale, cz + R * 0.1); roofs.push(kr);
  for (let i = 0; i < 4; i++) {
    const a = r() * Math.PI * 2, d = R * lerp(0.2, 0.55, r());
    tops.push(towerGeo(geos, roofs, cx + Math.cos(a) * d, cy, cz + Math.sin(a) * d, lerp(2, 3.4, r()) * scale, lerp(26, 38, r()) * scale, 11 * scale, 12));
  }
  return tops;
}
function mesa(cx, cz, R, H, seed) {
  const g = new THREE.CylinderGeometry(R * 0.92, R * 1.35, H, 48, 14, false);
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const a = Math.atan2(z, x);
    const n = fbm(a * 3 + seed, y * 0.06 + seed, 4);
    const f = 1 + n * 0.22 + noise2(a * 12, y * 0.25) * 0.05;
    if (Math.abs(y - H / 2) < 0.01) { x *= 1; z *= 1; } else { x *= f; z *= f; }
    pos.setXYZ(i, x + cx, y + H / 2 - 2, z + cz);
  }
  g.deleteAttribute('uv'); g.deleteAttribute('normal');
  const m = mergeGeometries([g.toNonIndexed()]); m.computeVertexNormals();
  return m;
}

function bannerTex() {
  const c = document.createElement('canvas'); c.width = 128; c.height = 320;
  const x = c.getContext('2d');
  x.fillStyle = '#8e1a21'; x.fillRect(0, 0, 128, 320);
  x.fillStyle = '#e9cf8f';
  x.fillRect(58, 70, 12, 170); x.fillRect(30, 200, 68, 12); x.beginPath(); x.moveTo(52, 70); x.lineTo(64, 40); x.lineTo(76, 70); x.fill();
  x.beginPath(); x.arc(64, 252, 10, 0, 7); x.fill();
  x.fillStyle = '#5a0e13'; x.fillRect(0, 0, 128, 10); x.fillRect(0, 0, 8, 320); x.fillRect(120, 0, 8, 320);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
export function makeBanner(w, h, horizontal = false) {
  const g = new THREE.PlaneGeometry(w, h, horizontal ? 16 : 4, horizontal ? 4 : 16);
  g.translate(horizontal ? w / 2 : 0, horizontal ? 0 : -h / 2, 0);
  const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ map: bannerTex(), side: THREE.DoubleSide, roughness: 0.9 }));
  m.userData = { base: Float32Array.from(g.attributes.position.array), w, h, horizontal };
  m.castShadow = true;
  return m;
}
export function waveBanner(b, t, amp = 0.5, speed = 6) {
  const { base, w, h, horizontal } = b.userData; const p = b.geometry.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = base[i * 3], y = base[i * 3 + 1];
    const d = horizontal ? x / w : -y / h;
    p.setZ(i, Math.sin(d * 7 - t * speed + x * 0.5) * amp * d + Math.sin(d * 13 - t * speed * 1.7) * amp * 0.25 * d);
  }
  p.needsUpdate = true; b.geometry.computeVertexNormals();
}

export const KEEP = V(0, 55, -150); // posição do castelo principal

export function buildKingdom() {
  const scene = new THREE.Scene();
  const sunDir = V(-0.75, 0.16, -0.62).normalize();
  scene.add(skyDome({ top: 0x35568a, mid: 0xd98b52, horizon: 0xffcf8a, bottom: 0x8a6a4a, sunDir, sunColor: 0xffb45a, glow: 0.55, sunSize: 1.4 }));
  scene.fog = new THREE.Fog(0xf0b880, 250, 2600);
  scene.add(new THREE.HemisphereLight(0xffd9a8, 0x5a4030, 1.1));
  const sun = new THREE.DirectionalLight(0xffbf70, 3.4);
  sun.position.copy(sunDir).multiplyScalar(400).add(V(0, 0, -100)); sun.target.position.set(0, 0, -100);
  sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
  const sc = sun.shadow.camera; sc.left = sc.bottom = -170; sc.right = sc.top = 170; sc.near = 50; sc.far = 900; sun.shadow.bias = -0.0005;
  scene.add(sun, sun.target);

  // terreno
  const tg = new THREE.PlaneGeometry(2400, 2400, 220, 220); tg.rotateX(-Math.PI / 2);
  const tp = tg.attributes.position, tc = [];
  const grass = new THREE.Color(0x7c8a3c), grass2 = new THREE.Color(0x5b6a30), road = new THREE.Color(0xa58b62);
  for (let i = 0; i < tp.count; i++) {
    const x = tp.getX(i), z = tp.getZ(i);
    const dist = Math.hypot(x, z + 150);
    let y = fbm(x * 0.004, z * 0.004, 5) * 40 + fbm(x * 0.02, z * 0.02, 3) * 4;
    y *= sstep(80, 260, dist);
    y += sstep(500, 1100, dist) * 140 * (0.6 + fbm(x * 0.002, z * 0.002));
    const onRoad = Math.abs(x - Math.sin(z * 0.02) * 4) < 5 && z > -105 && z < 200;
    if (onRoad) y = Math.min(y, 0.2);
    tp.setY(i, y);
    const c = grass.clone().lerp(grass2, sstep(-0.3, 0.5, fbm(x * 0.01, z * 0.01)));
    if (onRoad) c.copy(road);
    tc.push(c.r, c.g, c.b);
  }
  tg.setAttribute('color', new THREE.Float32BufferAttribute(tc, 3)); tg.computeVertexNormals();
  const terrain = new THREE.Mesh(tg, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 }));
  terrain.receiveShadow = true; scene.add(terrain);

  const rock = std(0x9a8064, 0.95, 0, { flatShading: true });
  const stone = std(0xd8c2a0, 0.9), roof = std(0x2f4170, 0.7);
  const stoneGeos = [], roofGeos = [], rockGeos = [];
  // mesa principal + castelo
  rockGeos.push(mesa(0, -150, 45, 57, 1));
  const tops = castle(stoneGeos, roofGeos, 0, KEEP.y, -150, 30, 1, 5);
  // torre mais alta
  const tallTop = towerGeo(stoneGeos, roofGeos, -6, KEEP.y, -160, 6, 80, 32, 18);
  // castelos em outros penhascos
  const others = [[-230, -380, 40, 70, 0.8], [260, -430, 46, 90, 0.9], [-90, -640, 38, 110, 0.75], [420, -260, 30, 50, 0.6], [-420, -200, 34, 60, 0.6]];
  others.forEach(([x, z, R, H, s], i) => { rockGeos.push(mesa(x, z, R, H, i + 3)); castle(stoneGeos, roofGeos, x, H - 2, z, R * 0.62, s, 10 + i); });
  // muralha baixa + portão
  const gateZ = -92, wallR = 62;
  for (let i = -5; i < 5; i++) {
    if (i === -1 || i === 0) continue;
    const a = Math.PI / 2 + i * 0.13, b = Math.PI / 2 + (i + 1) * 0.13;
    wallGeo(stoneGeos, V(Math.cos(a) * wallR, 0, -150 + Math.sin(a) * wallR), V(Math.cos(b) * wallR, 0, -150 + Math.sin(b) * wallR), 0, 13, 3.5);
  }
  for (const s of [-1, 1]) towerGeo(stoneGeos, roofGeos, s * 9.5, 0, gateZ, 4.6, 22, 10);
  const arch = new THREE.BoxGeometry(15, 7, 5); arch.translate(0, 13.5, gateZ); stoneGeos.push(arch);
  const gateDark = new THREE.Mesh(new THREE.BoxGeometry(9, 10.5, 4), std(0x1a120c, 1)); gateDark.position.set(0, 5.2, gateZ - 1.5); scene.add(gateDark);
  const portcullis = new THREE.Mesh(new THREE.BoxGeometry(9.2, 2, 0.4), std(0x3a3028, 0.6, 0.6)); portcullis.position.set(0, 9.4, gateZ + 2.2); scene.add(portcullis);

  const stoneM = new THREE.Mesh(mergeGeometries(stoneGeos), stone); stoneM.castShadow = stoneM.receiveShadow = true; scene.add(stoneM);
  const roofM = new THREE.Mesh(mergeGeometries(roofGeos), roof); roofM.castShadow = true; scene.add(roofM);
  const rockM = new THREE.Mesh(mergeGeometries(rockGeos), rock); rockM.castShadow = rockM.receiveShadow = true; scene.add(rockM);

  // estandartes
  const banners = [];
  for (const s of [-1, 1]) {
    const b = makeBanner(3.2, 8); b.position.set(s * 9.5, 19, gateZ + 4.9); scene.add(b); banners.push(b);
  }
  for (let i = 0; i < 6; i++) {
    const a = Math.PI / 2 + (i < 3 ? -0.2 - i * 0.15 : 0.2 + (i - 3) * 0.15);
    const b = makeBanner(2.6, 6.5); b.position.set(Math.cos(a) * (wallR + 1.9), 12.5, -150 + Math.sin(a) * (wallR + 1.9)); b.rotation.y = -a + Math.PI / 2; scene.add(b); banners.push(b);
  }
  const flags = [];
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 14, 6), std(0x3a2a1a, 0.8)); pole.position.set(-6, tallTop + 6, -160); scene.add(pole);
  const flag = makeBanner(11, 4.5, true); flag.position.set(-6, tallTop + 10.5, -160); flag.rotation.y = 0.6; scene.add(flag); flags.push(flag);
  tops.forEach((y, i) => {
    if (i > 2) return;
  });

  // nuvens
  const clouds = [];
  const r = rng(99);
  for (let i = 0; i < 70; i++) {
    const c = new THREE.Sprite(new THREE.SpriteMaterial({ map: cloudTex(), color: 0xffd6a8, transparent: true, opacity: lerp(0.35, 0.8, r()), depthWrite: false }));
    const s = lerp(60, 160, r()); c.scale.set(s * 2, s * 0.7, 1);
    c.position.set(lerp(-500, 500, r()), lerp(110, 220, r()), lerp(-900, 300, r()));
    scene.add(c); clouds.push(c);
  }
  // nuvens próximas ao trajeto da câmera aérea (sensação de velocidade)
  for (let i = 0; i < 14; i++) {
    const c = new THREE.Sprite(new THREE.SpriteMaterial({ map: cloudTex(), color: 0xffe2bc, transparent: true, opacity: 0.55, depthWrite: false }));
    const s = lerp(25, 50, r()); c.scale.set(s * 2, s * 0.8, 1);
    c.position.set(lerp(-40, 70, r()), lerp(95, 140, r()), lerp(40, 260, r()));
    scene.add(c); clouds.push(c);
  }
  const sunGlow = glowSprite(0xffc070, 600, 0.55); sunGlow.position.copy(sunDir).multiplyScalar(1800); sunGlow.material.fog = false; scene.add(sunGlow);

  // exército marchando pela estrada até o portão
  const soldiers = [];
  for (let row = 0; row < 12; row++) for (let col = 0; col < 4; col++) {
    const s = makeSoldier(row * 4 + col + 1);
    s.root.rotation.y = Math.PI;
    s.home = V((col - 1.5) * 1.6, 0, gateZ + 6 + row * 2.2);
    scene.add(s.root); soldiers.push(s);
  }
  return { scene, banners, flags, soldiers, clouds, gateZ, tallTop, sun };
}

// ================= Cume com vista para as montanhas (cena 6) =================
export function buildRidge() {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x123236, 0.0042);
  const sunDir = V(0.1, 0.05, -1);
  const sky = skyDome({ top: 0x08161a, mid: 0x163a3e, horizon: 0x3d7470, bottom: 0x0e2426, sunDir, sunColor: 0x2a6060, glow: 0.4, sunSize: 0.0 });
  scene.add(sky);
  const hl = new THREE.HemisphereLight(0x5f97a0, 0x0b1714, 0.9); scene.add(hl);
  const dl = new THREE.DirectionalLight(0xa6dbe0, 1.1); dl.position.set(-10, 25, 15); dl.castShadow = true; dl.shadow.mapSize.set(2048, 2048);
  const c = dl.shadow.camera; c.left = c.bottom = -15; c.right = c.top = 15; scene.add(dl);
  // rochedo onde Arthur está
  const rg = new THREE.DodecahedronGeometry(3, 1); rg.scale(1.6, 0.55, 1.4);
  const rp = rg.attributes.position;
  for (let i = 0; i < rp.count; i++) rp.setY(i, rp.getY(i) + noise2(rp.getX(i) * 0.8, rp.getZ(i) * 0.8) * 0.25);
  rg.computeVertexNormals();
  const outcrop = new THREE.Mesh(rg, std(0x3a4645, 0.95, 0, { flatShading: true })); outcrop.position.set(0, -0.15, 0); outcrop.receiveShadow = true; scene.add(outcrop);
  // encosta descendo para o vale
  const sg = new THREE.PlaneGeometry(600, 600, 160, 160); sg.rotateX(-Math.PI / 2);
  const sp = sg.attributes.position;
  for (let i = 0; i < sp.count; i++) {
    const x = sp.getX(i), z = sp.getZ(i);
    const fall = z < -4 ? -Math.pow((-z - 4) * 0.25, 1.35) : 0;
    sp.setY(i, -0.6 + Math.max(-60, fall) + fbm(x * 0.05, z * 0.05) * 1.5);
  }
  sg.computeVertexNormals();
  const slope = new THREE.Mesh(sg, std(0x16261f, 1)); slope.receiveShadow = true; scene.add(slope);
  // floresta ao redor e no vale (copas escuras distantes)
  const f = buildForest({ seed: 42, keepOut: (x, z) => Math.hypot(x, z) < 7 || z < -14 || (z < 6 && Math.abs(x) < 13), area: [-40, 40, -14, 30], count: 70, groundSize: 4, withMist: 0 });
  f.group.children.forEach(o => { if (o.geometry && o.geometry.type === 'PlaneGeometry') o.visible = false; });
  scene.add(f.group);
  const valley = [];
  const r = rng(5);
  for (let i = 0; i < 380; i++) {
    const x = lerp(-260, 260, r()), z = lerp(-30, -200, r());
    const y = -0.6 - Math.min(60, Math.pow(Math.max(0, -z - 4) * 0.25, 1.35));
    const g = new THREE.ConeGeometry(lerp(1.5, 3, r()), lerp(6, 11, r()), 5); g.translate(x, y + 3, z); valley.push(g);
  }
  scene.add(new THREE.Mesh(mergeGeometries(valley), std(0x122a26, 1, 0, { flatShading: true })));
  // montanhas
  const mts = [];
  for (let i = 0; i < 26; i++) {
    const x = lerp(-700, 700, i / 25) + (r() - 0.5) * 60, z = lerp(-330, -420, r());
    const g = new THREE.ConeGeometry(lerp(70, 140, r()), lerp(110, 210, r()), 7, 3);
    const p = g.attributes.position;
    for (let k = 0; k < p.count; k++) { const yy = p.getY(k); if (yy < g.parameters.height / 2 - 1) { p.setX(k, p.getX(k) * (1 + (r() - 0.5) * 0.3)); p.setZ(k, p.getZ(k) * (1 + (r() - 0.5) * 0.3)); } }
    g.translate(x, -60 + g.parameters.height / 2 - 10, z); mts.push(g);
  }
  const mg = mergeGeometries(mts.map(g => g.toNonIndexed())); mg.computeVertexNormals();
  scene.add(new THREE.Mesh(mg, std(0x1a3436, 1, 0, { flatShading: true })));
  // névoa do vale
  const mist = [];
  for (let i = 0; i < 40; i++) {
    const m = new THREE.Sprite(new THREE.SpriteMaterial({ map: cloudTex(), color: 0x5f9894, transparent: true, opacity: lerp(0.25, 0.5, r()), depthWrite: false }));
    const s = lerp(60, 140, r()); m.scale.set(s * 2.2, s * 0.5, 1);
    m.position.set(lerp(-400, 400, r()), lerp(-55, -20, r()), lerp(-120, -330, r()));
    m.userData = { base: m.position.clone(), sp: lerp(1, 3, r()), ph: r() * 6 };
    scene.add(m); mist.push(m);
  }
  // sombra gigantesca
  const shadow = new THREE.Group();
  const sm = new THREE.MeshBasicMaterial({ color: 0x030708, fog: false, transparent: true, opacity: 0.96 });
  const head = new THREE.Mesh(new THREE.SphereGeometry(30, 20, 14), sm); head.scale.set(1, 1.15, 0.9); head.position.y = 95; shadow.add(head);
  const shoulders = new THREE.Mesh(new THREE.SphereGeometry(60, 20, 14), sm); shoulders.scale.set(1.9, 0.75, 0.8); shoulders.position.y = 40; shadow.add(shoulders);
  const body = new THREE.Mesh(new THREE.CylinderGeometry(70, 90, 160, 16), sm); body.position.y = -50; shadow.add(body);
  for (const s of [-1, 1]) {
    shadow.add(new THREE.Mesh(taperTube([V(18 * s, 115, 0), V(40 * s, 135, 0), V(55 * s, 165, 5), V(48 * s, 195, 10)], 9, 0.5, 8, 16), sm));
  }
  const eyeM = new THREE.MeshBasicMaterial({ color: 0xff2414, fog: false, transparent: true });
  const eyes = [];
  for (const s of [-1, 1]) {
    const e = new THREE.Mesh(new THREE.SphereGeometry(5, 12, 8), eyeM); e.scale.set(1.7, 0.6, 0.5); e.position.set(12 * s, 98, 27); shadow.add(e);
    const g = glowSprite(0xff2a10, 70, 0); g.material.fog = false; g.position.set(11 * s, 98, 30); shadow.add(g); eyes.push(g);
  }
  shadow.position.set(0, -200, -460);
  scene.add(shadow);
  return { scene, sky, hl, dl, shadow, eyeM, eyes, mist };
}
