// Salões de pedra subterrâneos: biblioteca, cripta, câmara do livro e templo abandonado.
import { THREE, V, rng, lerp, fbm, std, mesh, mergeGeometries, lightShaft, mistSprites, glowSprite, skyDome } from '../motor/base.js';
import { columnGeo, shelfGeos, makeCandle, makeAltar } from './objetos.js';

// Salão circular configurável.
export function buildHall({
  radius = 12, height = 9, columns = 10, colR = 0.45, shelves = false, broken = 0, hole = 0, sky = null,
  stone = 0x4e4a46, floor = 0x3a3733, fog = 0x0a0c12, fogD = 0.04, ambient = [0x4a5a7a, 0x120e0a, 0.5], candleColor = 0xffb060, candles = 18,
  vines = 0, seed = 1, doorGap = 0, colOffset = 0,
} = {}) {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(fog, fogD); scene.background = new THREE.Color(fog);
  const hl = new THREE.HemisphereLight(ambient[0], ambient[1], ambient[2]); scene.add(hl);
  const R = rng(seed);
  const stoneM = std(stone, 0.95), floorM = std(floor, 0.9);
  // chão com lajotas (cores por vértice)
  const fg = new THREE.CircleGeometry(radius + 2, 64, 0, Math.PI * 2); fg.rotateX(-Math.PI / 2);
  const ring = new THREE.RingGeometry(1.5, radius, 64, 8); ring.rotateX(-Math.PI / 2);
  const fm = mesh(fg, floorM); fm.receiveShadow = true; scene.add(fm);
  const tiles = mesh(new THREE.RingGeometry(1.6, radius - 0.5, 48, 6), std(0x2e2c2a, 0.8, 0, { wireframe: true, transparent: true, opacity: 0.25 }), false);
  tiles.rotation.x = -Math.PI / 2; tiles.position.y = 0.01; scene.add(tiles);
  // parede cilíndrica com blocos irregulares
  const wg = new THREE.CylinderGeometry(radius, radius, height, 72, 18, true, doorGap / 2, Math.PI * 2 - doorGap);
  const wp = wg.attributes.position;
  for (let i = 0; i < wp.count; i++) { const x = wp.getX(i), y = wp.getY(i), z = wp.getZ(i); const a = Math.atan2(z, x); const k = 1 + fbm(a * 8, y * 0.5) * 0.02 + (Math.floor(y * 1.6) % 2 ? 0.004 : 0); wp.setXYZ(i, x * k, y + height / 2, z * k); }
  wg.computeVertexNormals();
  const wall = mesh(wg, std(stone, 0.95, 0, { side: THREE.BackSide })); scene.add(wall);
  // teto (cúpula) com abertura opcional
  if (hole < 1) {
    const cg = new THREE.SphereGeometry(radius, 48, 16, 0, Math.PI * 2, hole ? 0.18 * hole * Math.PI : 0, Math.PI / 2 - (hole ? 0.18 * hole * Math.PI : 0));
    cg.scale(1, 0.45, 1); cg.translate(0, height, 0);
    scene.add(mesh(cg, std(stone, 0.95, 0, { side: THREE.BackSide })));
  }
  // colunas e arcos
  const geos = [];
  for (let i = 0; i < columns; i++) {
    const a = i / columns * Math.PI * 2 + colOffset, r = radius - 1.6;
    geos.push(...columnGeo(Math.cos(a) * r, Math.sin(a) * r, height - 1.2, colR, broken && R() < broken ? 1 : 0, seed * 10 + i));
    const b = (i + 0.5) / columns * Math.PI * 2 + colOffset;
    const arch = new THREE.TorusGeometry((Math.PI * 2 * r / columns) / 2, 0.22, 6, 16, Math.PI);
    arch.rotateY(-b + Math.PI / 2); arch.translate(Math.cos(b) * r, height - 1.0, Math.sin(b) * r);
    if (!broken || R() > broken) geos.push(arch);
  }
  // escombros
  for (let i = 0; i < (broken ? 40 : 8); i++) { const g = new THREE.DodecahedronGeometry(lerp(0.15, 0.6, R()), 0); const a = R() * 6.28, r = lerp(3, radius - 1, R()); g.translate(Math.cos(a) * r, 0.1, Math.sin(a) * r); geos.push(g.toNonIndexed ? g : g); }
  const indexed = geos.filter(g => g.index), nonidx = geos.filter(g => !g.index);
  if (indexed.length) { const m = mesh(mergeGeometries(indexed), stoneM); scene.add(m); }
  if (nonidx.length) { const m = mesh(mergeGeometries(nonidx), std(0x46423e, 0.95, 0, { flatShading: true })); scene.add(m); }
  // estantes
  if (shelves) {
    const wood = [], books = [];
    const n = Math.floor(columns);
    for (let i = 0; i < n; i++) {
      const b = (i + 0.5) / n * Math.PI * 2, r = radius - 0.6;
      for (const lvl of [0, 4.3]) {
        if (lvl > 0 && height < 8.5) continue;
        const s = shelfGeos(Math.cos(b) * r, Math.sin(b) * r, -b - Math.PI / 2, (Math.PI * 2 * (radius - 1.6) / n) * 0.75, 3.8, seed * 100 + i * 2 + lvl);
        s.wood.forEach(g => { g.translate(0, lvl, 0); wood.push(g); }); s.books.forEach(g => { g.translate(0, lvl, 0); books.push(g); });
      }
    }
    scene.add(mesh(mergeGeometries(wood), std(0x3a2616, 0.85)));
    scene.add(mesh(mergeGeometries(books), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.8 })));
    // passarela circular
    const walk = new THREE.Mesh(new THREE.RingGeometry(radius - 1.3, radius - 0.2, 64), std(0x3a2616, 0.85, 0, { side: THREE.DoubleSide }));
    walk.rotation.x = -Math.PI / 2; walk.position.y = 4.2; scene.add(walk);
  }
  // trepadeiras
  if (vines) {
    const vg = [];
    for (let i = 0; i < vines; i++) {
      const a = R() * 6.28, r = radius - 0.15, x = Math.cos(a) * r, z = Math.sin(a) * r, len = lerp(2, height * 0.8, R());
      const pts = []; for (let k = 0; k <= 6; k++) pts.push(V(x * (1 - 0.003 * k), height - k / 6 * len, z * (1 - 0.003 * k)).add(V(Math.sin(k * 1.7 + i) * 0.15, 0, Math.cos(k * 1.3 + i) * 0.15)));
      vg.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 16, 0.04, 4));
      for (let k = 0; k < 8; k++) { const p = pts[Math.floor(R() * 6)]; const l = new THREE.IcosahedronGeometry(lerp(0.12, 0.3, R()), 0); l.translate(p.x, p.y - R() * 0.5, p.z); vg.push(l.index ? l : l); }
    }
    const idx = vg.filter(g => g.index), ni = vg.filter(g => !g.index);
    scene.add(mesh(mergeGeometries(idx), std(0x1f3a22, 0.9)));
    if (ni.length) scene.add(mesh(mergeGeometries(ni), std(0x24452a, 0.9, 0, { flatShading: true })));
  }
  // velas em candelabros nas colunas
  const candleList = [];
  for (let i = 0; i < candles; i++) {
    const a = (i + 0.25) / candles * Math.PI * 2, r = radius - 2.4;
    const c = makeCandle(0.3, candleColor, i % 3 === 0); c.position.set(Math.cos(a) * r, 1.6 + (i % 2) * 0.3, Math.sin(a) * r); scene.add(c); candleList.push(c);
    const holder = mesh(new THREE.CylinderGeometry(0.08, 0.05, 0.08, 8), std(0x2a2620, 0.5, 0.7)); holder.position.set(c.position.x, c.position.y - 0.19, c.position.z); scene.add(holder);
  }
  let skyMesh = null;
  if (sky) { skyMesh = skyDome(sky); scene.add(skyMesh); }
  return { scene, hl, candles: candleList, sky: skyMesh, radius, height };
}

// Porta de pedra dupla que se abre deslizando para os lados
export function makeStoneDoor(w = 3.2, h = 4.4) {
  const g = new THREE.Group();
  const stone = std(0x55514c, 0.95), glyph = new THREE.MeshBasicMaterial({ color: 0x5fd0ff, transparent: true, opacity: 0.5 });
  const halves = [];
  for (const s of [-1, 1]) {
    const half = new THREE.Group(); g.add(half);
    const slab = mesh(new THREE.BoxGeometry(w / 2, h, 0.4), stone); slab.position.set(s * w / 4, h / 2, 0); half.add(slab);
    const ring = mesh(new THREE.TorusGeometry(0.55, 0.05, 6, 32, Math.PI), glyph, false); ring.rotation.z = s > 0 ? -Math.PI / 2 : Math.PI / 2; ring.position.set(0.0, h * 0.55, 0.21); half.add(ring);
    halves.push(half);
  }
  const frame = mesh(new THREE.BoxGeometry(w + 1.2, 0.8, 0.9), stone); frame.position.y = h + 0.4; g.add(frame);
  for (const s of [-1, 1]) { const p = mesh(new THREE.BoxGeometry(0.6, h + 0.8, 0.9), stone); p.position.set(s * (w / 2 + 0.3), (h + 0.8) / 2, 0); g.add(p); }
  // parede ao redor
  const wallL = mesh(new THREE.BoxGeometry(14, 9, 0.8), std(0x3e3a36, 0.95)); wallL.position.set(0, 4.5, -0.25);
  const wallGeo = new THREE.BoxGeometry(14, 9, 0.8);
  g.userData = { halves, glyph, w };
  return g;
}
export function openDoor(d, k) {
  const { halves, w } = d.userData;
  halves[0].position.x = -k * w * 0.48; halves[1].position.x = k * w * 0.48;
}
