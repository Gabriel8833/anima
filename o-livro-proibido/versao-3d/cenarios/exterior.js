// Cenários externos: reino, floresta encantada, círculo de pedras, observatório e campo de batalha.
import {
  THREE, V, rng, lerp, sstep, fbm, noise2, std, mesh, mergeGeometries, taperTube, cloudTex, skyDome, glowSprite,
  mistSprites, particles, magicCircleTex,
} from '../motor/base.js';

// ---------- peças de arquitetura ----------
function towerGeo(geos, roofs, x, y, z, r, h, roofH, seg = 14) {
  const t = new THREE.CylinderGeometry(r, r * 1.06, h, seg); t.translate(x, y + h / 2, z); geos.push(t);
  const cr = new THREE.CylinderGeometry(r * 1.14, r * 1.14, 0.12 * r + 0.6, seg); cr.translate(x, y + h, z); geos.push(cr);
  const roof = new THREE.ConeGeometry(r * 1.28, roofH, seg); roof.translate(x, y + h + roofH / 2 + 0.3, z); roofs.push(roof);
  return y + h + roofH + 0.3;
}
function wallGeo(geos, a, b, y, h, th) {
  const d = b.clone().sub(a), L = d.length();
  const w = new THREE.BoxGeometry(L, h, th); w.rotateY(-Math.atan2(d.z, d.x));
  const m = a.clone().add(b).multiplyScalar(0.5); w.translate(m.x, y + h / 2, m.z); geos.push(w);
  const n = Math.floor(L / 2.2);
  for (let i = 0; i < n; i++) { const p = a.clone().lerp(b, (i + 0.5) / n); const c = new THREE.BoxGeometry(1.1, 1.1, th * 1.1); c.rotateY(-Math.atan2(d.z, d.x)); c.translate(p.x, y + h + 0.55, p.z); geos.push(c); }
}
function castle(geos, roofs, cx, cy, cz, R, scale = 1, seed = 3) {
  const r = rng(seed), N = 8;
  for (let i = 0; i < N; i++) {
    const a = i / N * Math.PI * 2, b = (i + 1) / N * Math.PI * 2;
    const pa = V(cx + Math.cos(a) * R, 0, cz + Math.sin(a) * R), pb = V(cx + Math.cos(b) * R, 0, cz + Math.sin(b) * R);
    wallGeo(geos, pa, pb, cy, 10 * scale, 2.4 * scale);
    towerGeo(geos, roofs, pa.x, cy, pa.z, 3.4 * scale, lerp(18, 26, r()) * scale, 10 * scale);
  }
  const k = new THREE.BoxGeometry(R * 0.8, 26 * scale, R * 0.65); k.translate(cx, cy + 13 * scale, cz); geos.push(k);
  const kr = new THREE.ConeGeometry(R * 0.6, 14 * scale, 4); kr.rotateY(Math.PI / 4); kr.scale(1, 1, 0.82); kr.translate(cx, cy + 33 * scale, cz); roofs.push(kr);
  for (let i = 0; i < 5; i++) { const a = r() * 6.28, d = R * lerp(0.25, 0.6, r()); towerGeo(geos, roofs, cx + Math.cos(a) * d, cy, cz + Math.sin(a) * d, lerp(2.2, 3.6, r()) * scale, lerp(32, 50, r()) * scale, 13 * scale, 12); }
}
function mesa(cx, cz, R, H, seed) {
  const g = new THREE.CylinderGeometry(R * 0.92, R * 1.4, H, 48, 14, false);
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const a = Math.atan2(z, x), f = 1 + fbm(a * 3 + seed, y * 0.06 + seed, 4) * 0.22 + noise2(a * 12, y * 0.25) * 0.05;
    if (Math.abs(y - H / 2) > 0.01) { x *= f; z *= f; }
    pos.setXYZ(i, x + cx, y + H / 2 - 2, z + cz);
  }
  g.deleteAttribute('uv'); g.deleteAttribute('normal');
  const m = g.toNonIndexed(); m.computeVertexNormals(); return m;
}
// Torre de mago: esguia, com espiral, janelas acesas e cristal flutuante no topo
function wizardTower(scene, x, z, baseY, h, color, seed) {
  const r = rng(seed), stone = [], roofs = [], glow = [];
  const top = towerGeo(stone, roofs, x, baseY, z, 3, h, 16, 16);
  for (let i = 0; i < 3; i++) { const b = new THREE.CylinderGeometry(3.6, 3.6, 0.8, 16); b.translate(x, baseY + h * (0.3 + i * 0.25), z); stone.push(b); }
  for (let i = 0; i < 14; i++) { const a = r() * 6.28, y = baseY + lerp(6, h - 3, r()); const w = new THREE.BoxGeometry(0.7, 1.4, 0.3); w.rotateY(-a); w.translate(x + Math.cos(a) * 3.05, y, z + Math.sin(a) * 3.05); glow.push(w); }
  scene.add(mesh(mergeGeometries(stone), std(0x8d8597, 0.9)));
  scene.add(mesh(mergeGeometries(roofs), std(0x2a2448, 0.7)));
  scene.add(mesh(mergeGeometries(glow), new THREE.MeshBasicMaterial({ color: 0xffd28a }), false));
  const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(2.2, 0), new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 2.5, roughness: 0.2 }));
  crystal.scale.set(0.7, 1.4, 0.7); crystal.position.set(x, top + 6, z); scene.add(crystal);
  const g = glowSprite(color, 40, 0.75); g.position.copy(crystal.position); scene.add(g);
  const l = new THREE.PointLight(color, 300, 120, 1.4); l.position.copy(crystal.position); scene.add(l);
  return { crystal, glow: g, light: l, baseY: crystal.position.y };
}

// ---------- Reino (cena 1) ----------
export function buildKingdom() {
  const scene = new THREE.Scene();
  const sunDir = V(-0.6, 0.06, -0.8).normalize();
  const sky = skyDome({ top: 0x141a3a, mid: 0x4a2f5e, horizon: 0xe08a52, bottom: 0x2a2030, sunDir, sunColor: 0xff9850, glow: 0.7, sunSize: 2, stars: 0.6 });
  scene.add(sky);
  scene.fog = new THREE.Fog(0x6a4a5e, 450, 3800);
  scene.add(new THREE.HemisphereLight(0xb08ab0, 0x2a2018, 0.9));
  const sun = new THREE.DirectionalLight(0xff9c62, 3.0);
  sun.position.copy(sunDir).multiplyScalar(500).add(V(0, 0, -150)); sun.target.position.set(0, 0, -150);
  sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
  const sc = sun.shadow.camera; sc.left = sc.bottom = -220; sc.right = sc.top = 220; sc.near = 50; sc.far = 1100; sun.shadow.bias = -0.0005;
  scene.add(sun, sun.target);
  // terreno com montanhas ao fundo
  const tg = new THREE.PlaneGeometry(3000, 3000, 220, 220); tg.rotateX(-Math.PI / 2);
  const tp = tg.attributes.position, tc = [];
  const grass = new THREE.Color(0x3d5a2e), grass2 = new THREE.Color(0x2c4424), rock = new THREE.Color(0x6a6070), snow = new THREE.Color(0xd8d4e0);
  for (let i = 0; i < tp.count; i++) {
    const x = tp.getX(i), z = tp.getZ(i), dist = Math.hypot(x, z + 150);
    let y = fbm(x * 0.004, z * 0.004, 5) * 35 * sstep(90, 280, dist);
    const mt = sstep(500, 1100, dist) * 260 * (0.5 + fbm(x * 0.0025, z * 0.0025, 5));
    y += mt;
    tp.setY(i, y);
    let c = grass.clone().lerp(grass2, sstep(-0.3, 0.5, fbm(x * 0.01, z * 0.01)));
    if (mt > 60) c.lerp(rock, sstep(60, 140, mt)); if (mt > 190) c.lerp(snow, sstep(190, 240, mt));
    tc.push(c.r, c.g, c.b);
  }
  tg.setAttribute('color', new THREE.Float32BufferAttribute(tc, 3)); tg.computeVertexNormals();
  const terrain = mesh(tg, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 })); scene.add(terrain);
  const hAt = (x, z) => { const dist = Math.hypot(x, z + 150); return fbm(x * 0.004, z * 0.004, 5) * 35 * sstep(90, 280, dist) + sstep(500, 1100, dist) * 260 * (0.5 + fbm(x * 0.0025, z * 0.0025, 5)); };
  // florestas (cones)
  const trees = [], r = rng(31);
  for (let i = 0; i < 2600; i++) {
    const x = lerp(-700, 700, r()), z = lerp(-900, 400, r());
    const dist = Math.hypot(x, z + 150);
    if (dist < 75 || fbm(x * 0.006, z * 0.006, 3) < -0.05 || dist > 800) continue;
    const y = hAt(x, z), s = lerp(4, 9, r());
    const g = new THREE.ConeGeometry(s * 0.35, s, 6); g.translate(x, y + s / 2 - 0.5, z); trees.push(g);
  }
  scene.add(mesh(mergeGeometries(trees), std(0x1f3424, 1, 0, { flatShading: true })));
  // castelo principal num penhasco e castelos menores
  const stoneGeos = [], roofGeos = [], rockGeos = [];
  rockGeos.push(mesa(0, -150, 48, 60, 1));
  castle(stoneGeos, roofGeos, 0, 58, -150, 32, 1, 5);
  const tall = towerGeo(stoneGeos, roofGeos, -8, 58, -158, 6.5, 90, 34, 18);
  [[-260, -420, 40, 80, 0.8], [300, -470, 46, 95, 0.9], [-110, -700, 38, 120, 0.75], [460, -240, 30, 55, 0.6], [-460, -200, 34, 65, 0.6]].forEach(([x, z, R, H, s], i) => {
    rockGeos.push(mesa(x, z, R, H, i + 3)); castle(stoneGeos, roofGeos, x, H - 2, z, R * 0.62, s, 10 + i);
  });
  scene.add(mesh(mergeGeometries(stoneGeos), std(0xcabba6, 0.9)));
  scene.add(mesh(mergeGeometries(roofGeos), std(0x30305a, 0.7)));
  scene.add(mesh(mergeGeometries(rockGeos), std(0x7a6a64, 0.95, 0, { flatShading: true })));
  // torres de magos
  const towers = [
    wizardTower(scene, 140, -60, hAt(140, -60) - 2, 95, 0x6fb8ff, 1),
    wizardTower(scene, -170, -260, hAt(-170, -260) - 2, 110, 0xb070ff, 2),
    wizardTower(scene, 90, -330, hAt(90, -330) - 2, 120, 0xffc860, 3),
    wizardTower(scene, -60, 40, hAt(-60, 40) - 2, 80, 0xff5050, 4),
  ];
  // janelas acesas no castelo
  const win = [];
  for (let i = 0; i < 160; i++) { const a = r() * 6.28, rr = lerp(5, 30, r()), y = 60 + r() * 40; const w = new THREE.BoxGeometry(0.8, 1.6, 0.8); w.translate(Math.cos(a) * rr, y, -150 + Math.sin(a) * rr); win.push(w); }
  scene.add(mesh(mergeGeometries(win), new THREE.MeshBasicMaterial({ color: 0xffc070 }), false));
  // nuvens dramáticas
  const clouds = [];
  for (let i = 0; i < 90; i++) {
    const c = new THREE.Sprite(new THREE.SpriteMaterial({ map: cloudTex(), color: i % 3 ? 0x9a6a8a : 0xffa070, transparent: true, opacity: lerp(0.35, 0.85, r()), depthWrite: false }));
    const s = lerp(80, 220, r()); c.scale.set(s * 2.2, s * 0.6, 1);
    c.position.set(lerp(-800, 800, r()), lerp(160, 320, r()), lerp(-1200, 400, r()));
    c.userData.vx = lerp(1, 4, r()); scene.add(c); clouds.push(c);
  }
  // pássaros / dragão distante? -> faíscas mágicas no ar
  const motes = particles(400, 0x9fd0ff, 1.6, { opacity: 0.8 });
  scene.add(motes);
  return { scene, sky, towers, clouds, motes, tallTop: tall, hAt };
}

// ---------- Floresta encantada ----------
function makeTree(r, x, z, h, geos, leaf) {
  const pts = []; let px = x, pz = z;
  for (let i = 0; i <= 7; i++) { if (i) { px += (r() - 0.5) * 0.8; pz += (r() - 0.5) * 0.8; } pts.push(V(px, i ? i / 7 * h : -0.6, pz)); }
  const base = lerp(0.3, 0.6, r());
  geos.push(taperTube(pts, base, base * 0.12, 9, 28));
  for (let k = 0; k < 5; k++) { const a = k / 5 * 6.28 + r(), c = Math.cos(a), s = Math.sin(a); geos.push(taperTube([V(x, 1, z), V(x + c * 0.8, 0.35, z + s * 0.8), V(x + c * 1.7, 0.02, z + s * 1.7), V(x + c * 2.4, -0.25, z + s * 2.4)], base * 0.55, 0.04, 6, 10)); }
  const curve = new THREE.CatmullRomCurve3(pts);
  for (let k = 0; k < 3 + Math.floor(r() * 4); k++) {
    const u = 0.4 + r() * 0.55, p = curve.getPointAt(u), a = r() * 6.28, c = Math.cos(a), s = Math.sin(a), L = lerp(2.2, 4.5, r()) * (1.2 - u * 0.5);
    const bp = [p.clone(), p.clone().add(V(c * L * 0.35, L * 0.32, s * L * 0.35)), p.clone().add(V(c * L * 0.65, L * 0.42, s * L * 0.65)), p.clone().add(V(c * L, L * 0.25 - r() * 0.6, s * L))];
    geos.push(taperTube(bp, base * 0.3, 0.015, 6, 14));
    const lg = new THREE.IcosahedronGeometry(lerp(0.9, 1.8, r()), 1); lg.scale(1.3, 0.8, 1.2); lg.translate(bp[3].x, bp[3].y + 0.3, bp[3].z); leaf.push(lg);
  }
}
export function buildForest({ seed = 3, clearR = 5, count = 90, area = 34 } = {}) {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0b1830, 0.045); scene.background = new THREE.Color(0x0b1830);
  const hl = new THREE.HemisphereLight(0x5a7ab0, 0x0a0e18, 0.8); scene.add(hl);
  const moon = new THREE.DirectionalLight(0x9ab8ff, 1.4); moon.position.set(-10, 25, 6); moon.castShadow = true; moon.shadow.mapSize.set(2048, 2048);
  const c = moon.shadow.camera; c.left = c.bottom = -16; c.right = c.top = 16; scene.add(moon);
  const r = rng(seed), geos = [], leaf = [], placed = [];
  let tries = 0;
  while (placed.length < count && tries++ < count * 30) {
    const x = lerp(-area, area, r()), z = lerp(-area, area, r());
    if (Math.hypot(x, z) < clearR || placed.some(p => (p[0] - x) ** 2 + (p[1] - z) ** 2 < 7)) continue;
    placed.push([x, z]); makeTree(r, x, z, lerp(9, 15, r()), geos, leaf);
  }
  scene.add(mesh(mergeGeometries(geos), std(0x2a2a36, 0.95)));
  scene.add(mesh(mergeGeometries(leaf), std(0x1a2e40, 0.9, 0, { flatShading: true })));
  const gg = new THREE.PlaneGeometry(area * 2.6, area * 2.6, 120, 120); gg.rotateX(-Math.PI / 2);
  const gp = gg.attributes.position; for (let i = 0; i < gp.count; i++) { const x = gp.getX(i), z = gp.getZ(i); gp.setY(i, Math.hypot(x, z) < clearR ? 0 : fbm(x * 0.15, z * 0.15) * 0.4 + 0.1); }
  gg.computeVertexNormals();
  scene.add(mesh(gg, std(0x172230, 1)));
  // cogumelos e flores luminosas
  const sh = [];
  for (let i = 0; i < 160; i++) { const a = r() * 6.28, d = lerp(clearR * 0.6, area, r()); const g = new THREE.SphereGeometry(lerp(0.04, 0.09, r()), 8, 4, 0, 6.28, 0, Math.PI / 2); g.translate(Math.cos(a) * d, 0.12, Math.sin(a) * d); sh.push(g); }
  scene.add(mesh(mergeGeometries(sh), new THREE.MeshStandardMaterial({ color: 0x7fd8ff, emissive: 0x3aa8ff, emissiveIntensity: 1.6 }), false));
  const mist = mistSprites(scene, 50, [-area, area, -area, area], { color: 0x5a7ab8, seed: 4 });
  const fireflies = particles(140, 0x9fe0ff, 0.06); scene.add(fireflies);
  return { scene, hl, moon, mist, fireflies };
}

// ---------- Círculo de pedras (Zareth) ----------
export function buildStoneCircle() {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x1a1028, 0.035);
  const sky = skyDome({ top: 0x05030c, mid: 0x1a0f30, horizon: 0x4a2a5e, bottom: 0x100818, sunDir: V(0.4, 0.35, -1), sunColor: 0xd8c8ff, sunSize: 3, glow: 0.25, stars: 1 });
  scene.add(sky);
  scene.add(new THREE.HemisphereLight(0x8a6ab8, 0x100818, 0.7));
  const moon = new THREE.DirectionalLight(0xc8b8ff, 1.2); moon.position.set(8, 20, -16); moon.castShadow = true; scene.add(moon);
  const gg = new THREE.PlaneGeometry(200, 200, 100, 100); gg.rotateX(-Math.PI / 2);
  const gp = gg.attributes.position; for (let i = 0; i < gp.count; i++) { const x = gp.getX(i), z = gp.getZ(i); gp.setY(i, sstep(9, 40, Math.hypot(x, z)) * fbm(x * 0.03, z * 0.03) * 8); }
  gg.computeVertexNormals(); scene.add(mesh(gg, std(0x221a2a, 1)));
  const r = rng(12), stones = [];
  for (let i = 0; i < 9; i++) {
    const a = i / 9 * 6.28, g = new THREE.BoxGeometry(lerp(1.0, 1.5, r()), lerp(3, 4.8, r()), 0.8, 2, 4, 2);
    const p = g.attributes.position; for (let k = 0; k < p.count; k++) p.setXYZ(k, p.getX(k) * (1 + (r() - 0.5) * 0.25), p.getY(k), p.getZ(k) * (1 + (r() - 0.5) * 0.25));
    g.computeVertexNormals(); g.rotateY(-a + Math.PI / 2); g.rotateZ((r() - 0.5) * 0.12); g.translate(Math.cos(a) * 6.5, 1.6, Math.sin(a) * 6.5); stones.push(g.toNonIndexed());
  }
  scene.add(mesh(mergeGeometries(stones), std(0x55505e, 0.95, 0, { flatShading: true })));
  const circle = new THREE.Mesh(new THREE.PlaneGeometry(9, 9), new THREE.MeshBasicMaterial({ map: magicCircleTex(7), color: 0xb060ff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
  circle.rotation.x = -Math.PI / 2; circle.position.y = 0.03; scene.add(circle);
  const mist = mistSprites(scene, 40, [-20, 20, -20, 20], { color: 0x8a6ab8, seed: 9, opacity: [0.1, 0.25] });
  return { scene, sky, circle, mist };
}

// ---------- Observatório no topo da torre (Eldrin) ----------
export function buildObservatory() {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0e1428, 0.006);
  const sky = skyDome({ top: 0x04060f, mid: 0x0f1834, horizon: 0x3a3a5e, bottom: 0x0a0c18, sunDir: V(-0.5, 0.25, -1), sunColor: 0xffe8b0, sunSize: 2.5, glow: 0.2, stars: 1.4 });
  scene.add(sky);
  scene.add(new THREE.HemisphereLight(0x6a7ab8, 0x1a140a, 0.6));
  const stone = std(0x8a7f70, 0.9);
  const plat = mesh(new THREE.CylinderGeometry(7, 7.4, 1, 40), stone); plat.position.y = -0.5; scene.add(plat);
  const tower = mesh(new THREE.CylinderGeometry(7.2, 8, 60, 40), stone); tower.position.y = -31; scene.add(tower);
  const par = [];
  for (let i = 0; i < 28; i++) { const a = i / 28 * 6.28; const g = new THREE.BoxGeometry(0.8, 1.1, 0.5); g.rotateY(-a); g.translate(Math.cos(a) * 6.8, 0.55, Math.sin(a) * 6.8); par.push(g); }
  scene.add(mesh(mergeGeometries(par), stone));
  // esfera armilar dourada
  const arm = new THREE.Group(); arm.position.set(-3.6, 2.6, -2.4); scene.add(arm);
  const goldM = std(0xd8aa40, 0.3, 1);
  const rings = [2.0, 1.7, 1.4].map((rad, i) => { const m = mesh(new THREE.TorusGeometry(rad, 0.045, 8, 64), goldM); arm.add(m); return m; });
  const orb = new THREE.Mesh(new THREE.SphereGeometry(0.35, 24, 16), new THREE.MeshStandardMaterial({ color: 0xfff0c0, emissive: 0xffc850, emissiveIntensity: 2 })); arm.add(orb);
  const og = glowSprite(0xffcc60, 3, 0.6); arm.add(og);
  const stand = mesh(new THREE.CylinderGeometry(0.12, 0.4, 2.2, 12), goldM); stand.position.set(-3.6, 1.1, -2.4); scene.add(stand);
  // constelação que forma um livro
  const P = [[-2, 0], [0, 0.4], [2, 0], [2, 2.6], [0, 3], [-2, 2.6], [-2, 0], [0, 0.4], [0, 3]].map(([x, y]) => V(x * 6, 40 + y * 6, -70));
  const lines = [];
  for (let i = 0; i < P.length - 1; i++) lines.push(new THREE.Mesh(taperTube([P[i], P[i].clone().lerp(P[i + 1], 0.5), P[i + 1]], 0.12, 0.12, 4, 6), new THREE.MeshBasicMaterial({ color: 0xffd880, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, fog: false })));
  lines.forEach(l => scene.add(l));
  const stars = P.slice(0, 6).map(p => { const s = glowSprite(0xffe8a0, 5, 0); s.position.copy(p); scene.add(s); return s; });
  return { scene, sky, arm, rings, orb, lines, stars };
}

// ---------- Campo de batalha (cena 5) ----------
export function buildBattlefield() {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x1a1424, 0.018);
  const sky = skyDome({ top: 0x07060e, mid: 0x221a34, horizon: 0x6a3a3a, bottom: 0x140e14, sunDir: V(0, 0.1, -1), sunColor: 0xff6a3a, sunSize: 0, glow: 0.4, stars: 0.2 });
  scene.add(sky);
  const hl = new THREE.HemisphereLight(0x5a5a8a, 0x2a140a, 0.7); scene.add(hl);
  const key = new THREE.DirectionalLight(0x8a9ad8, 1.1); key.position.set(-15, 30, 10); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
  const kc = key.shadow.camera; kc.left = kc.bottom = -30; kc.right = kc.top = 30; scene.add(key);
  const r = rng(77);
  // chão de pedra rachado
  const gg = new THREE.PlaneGeometry(260, 260, 140, 140); gg.rotateX(-Math.PI / 2);
  const gp = gg.attributes.position, gc = [];
  const c1 = new THREE.Color(0x3a3436), c2 = new THREE.Color(0x24201f), c3 = new THREE.Color(0x4a2a1a);
  for (let i = 0; i < gp.count; i++) { const x = gp.getX(i), z = gp.getZ(i), d = Math.hypot(x, z); gp.setY(i, sstep(25, 90, d) * fbm(x * 0.02, z * 0.02) * 14); const c = c1.clone().lerp(c2, sstep(-0.3, 0.4, fbm(x * 0.1, z * 0.1))); if (fbm(x * 0.3, z * 0.3) > 0.35) c.lerp(c3, 0.6); gc.push(c.r, c.g, c.b); }
  gg.setAttribute('color', new THREE.Float32BufferAttribute(gc, 3)); gg.computeVertexNormals();
  scene.add(mesh(gg, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 })));
  // ruínas ao redor
  const ruins = [];
  for (let i = 0; i < 26; i++) {
    const a = r() * 6.28, d = lerp(18, 45, r()), w = lerp(3, 8, r()), h = lerp(3, 14, r());
    const g = new THREE.BoxGeometry(w, h, lerp(1, 2, r())); g.rotateY(r() * 6.28); g.rotateZ((r() - 0.5) * 0.15); g.translate(Math.cos(a) * d, h / 2 - 0.5, Math.sin(a) * d); ruins.push(g);
  }
  for (let i = 0; i < 60; i++) { const g = new THREE.DodecahedronGeometry(lerp(0.3, 1.4, r()), 0); const a = r() * 6.28, d = lerp(5, 30, r()); g.translate(Math.cos(a) * d, 0.2, Math.sin(a) * d); ruins.push(g.index ? g : g); }
  const idx = ruins.filter(g => g.index), ni = ruins.filter(g => !g.index);
  scene.add(mesh(mergeGeometries(idx), std(0x5a5250, 0.95)));
  scene.add(mesh(mergeGeometries(ni), std(0x4a4442, 0.95, 0, { flatShading: true })));
  // castelo distante em chamas
  const geos = [], roofs = []; castle(geos, roofs, 0, 0, -140, 28, 1.1, 9);
  scene.add(mesh(mergeGeometries(geos), std(0x5a5060, 0.9))); scene.add(mesh(mergeGeometries(roofs), std(0x2a2030, 0.8)));
  // fogueiras
  const fires = [];
  for (let i = 0; i < 12; i++) {
    const a = r() * 6.28, d = lerp(14, 40, r()), p = V(Math.cos(a) * d, 0.5, Math.sin(a) * d);
    if (i < 3) p.set(lerp(-30, 30, r()), lerp(10, 30, r()), -140 + lerp(-20, 20, r()));
    const f = glowSprite(0xff7a2a, i < 3 ? 26 : 4, 0.9); f.position.copy(p); scene.add(f);
    const l = new THREE.PointLight(0xff6a20, i < 3 ? 600 : 40, i < 3 ? 120 : 18, 1.5); l.position.copy(p).add(V(0, 1, 0)); scene.add(l);
    fires.push({ f, l, base: i < 3 ? 26 : 4, li: i < 3 ? 600 : 40 });
  }
  const embers = particles(500, 0xff8a3a, 0.12); scene.add(embers);
  // torre que desaba (segmentos)
  const towerSegs = [];
  const tm = std(0x6a6066, 0.9);
  for (let i = 0; i < 9; i++) { const s = mesh(new THREE.CylinderGeometry(2.2, 2.3, 2.4, 14), tm); s.position.set(-10, 1.2 + i * 2.4, -16); s.userData.home = s.position.clone(); scene.add(s); towerSegs.push(s); }
  const troof = mesh(new THREE.ConeGeometry(2.8, 5, 14), std(0x2a2030, 0.8)); troof.position.set(-10, 1.2 + 9 * 2.4 + 1.3, -16); troof.userData.home = troof.position.clone(); scene.add(troof); towerSegs.push(troof);
  // nuvens de tempestade
  const clouds = [];
  for (let i = 0; i < 40; i++) { const c = new THREE.Sprite(new THREE.SpriteMaterial({ map: cloudTex(), color: 0x3a2e4a, transparent: true, opacity: 0.8, depthWrite: false, fog: false })); const s = lerp(60, 140, r()); c.scale.set(s * 2, s * 0.6, 1); c.position.set(lerp(-250, 250, r()), lerp(70, 130, r()), lerp(-300, 80, r())); scene.add(c); clouds.push(c); }
  return { scene, sky, hl, key, fires, embers, towerSegs, clouds };
}
