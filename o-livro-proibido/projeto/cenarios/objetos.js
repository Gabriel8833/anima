// Objetos recorrentes: o Livro Proibido, altares, colunas, estantes, velas, porta de pedra.
import { THREE, V, rng, lerp, std, mesh, glowSprite, mergeGeometries, drawRune } from '../motor/base.js';

// Textura de página: linhas de "escrita" rúnica e um diagrama circular.
function pageTex(seed) {
  const c = document.createElement('canvas'); c.width = 256; c.height = 360; const x = c.getContext('2d');
  x.fillStyle = '#000'; x.fillRect(0, 0, 256, 360);
  const r = rng(seed);
  x.strokeStyle = '#fff'; x.lineCap = 'round'; x.lineWidth = 2.2;
  for (let line = 0; line < 13; line++) {
    let px = 26; const y = 32 + line * 24;
    if (line >= 4 && line <= 8 && seed % 2) { if (line === 6) { x.lineWidth = 3; x.beginPath(); x.arc(128, y, 52, 0, 6.28); x.stroke(); x.beginPath(); x.arc(128, y, 30, 0, 6.28); x.stroke(); for (let i = 0; i < 6; i++) drawRune(x, 128 + Math.cos(i) * 42, y + Math.sin(i) * 42, 7, r); x.lineWidth = 2.2; } continue; }
    while (px < 225) { drawRune(x, px, y, 6 + r() * 2, r); px += 14 + r() * 6; if (r() < 0.12) px += 12; }
  }
  const t = new THREE.CanvasTexture(c); return t;
}

// O Livro: capa, miolo, páginas com runas brilhantes e uma página que vira sozinha.
export function makeBook() {
  const g = new THREE.Group();
  const leather = std(0x3a1410, 0.6), goldM = std(0xd2a53c, 0.3, 1), paper = std(0x8a7c62, 0.95);
  const W = 0.36, Hh = 0.5;
  const halves = [];
  for (const s of [-1, 1]) {
    const half = new THREE.Group(); g.add(half); halves.push(half);
    const cover = mesh(new THREE.BoxGeometry(W, 0.018, Hh), leather); cover.position.set(s * W / 2, 0, 0); half.add(cover);
    for (const cz of [-1, 1]) { const corner = mesh(new THREE.BoxGeometry(0.06, 0.022, 0.06), goldM); corner.position.set(s * (W - 0.03), 0, cz * (Hh / 2 - 0.03)); half.add(corner); }
    const block = mesh(new THREE.BoxGeometry(W - 0.03, 0.05, Hh - 0.03), paper); block.position.set(s * (W / 2 - 0.005), 0.034, 0); half.add(block);
    const texM = new THREE.MeshStandardMaterial({ color: 0x8a7c62, roughness: 0.95, emissive: 0x7fd8ff, emissiveMap: pageTex(s > 0 ? 3 : 4), emissiveIntensity: 1 });
    const page = mesh(new THREE.PlaneGeometry(W - 0.06, Hh - 0.06), texM, false); page.rotation.x = -Math.PI / 2; page.position.set(s * (W / 2 - 0.005), 0.0605, 0); half.add(page);
    half.userData.pageMat = texM;
  }
  const spine = mesh(new THREE.CylinderGeometry(0.03, 0.03, Hh, 12, 1, false, 0, Math.PI), leather); spine.rotation.x = Math.PI / 2; spine.rotation.y = Math.PI; spine.position.y = -0.005; g.add(spine);
  const emblem = mesh(new THREE.TorusGeometry(0.05, 0.01, 6, 20), goldM); emblem.rotation.x = Math.PI / 2; emblem.position.set(0.18, -0.012, 0); halves[1].add(emblem);
  // página que vira (pivô na lombada, segmentada para curvar)
  const pg = new THREE.PlaneGeometry(W - 0.04, Hh - 0.04, 12, 1); pg.rotateX(-Math.PI / 2); pg.translate((W - 0.04) / 2, 0, 0);
  const turnTex = pageTex(5);
  const turnMat = new THREE.MeshStandardMaterial({ color: 0xb8a888, roughness: 0.9, side: THREE.DoubleSide, emissive: 0xff2a1a, emissiveMap: turnTex, emissiveIntensity: 0 });
  const turn = mesh(pg, turnMat, false); turn.position.y = 0.062; g.add(turn);
  turn.userData.base = Float32Array.from(pg.attributes.position.array);
  const light = new THREE.PointLight(0x7fd8ff, 3, 5, 1.6); light.position.y = 0.3; g.add(light);
  const glow = glowSprite(0x9fe4ff, 1.2, 0.5); glow.position.y = 0.1; g.add(glow);
  g.userData = { halves, turn, turnMat, light, glow, W };
  setBookOpen(g, 1);
  return g;
}
export function setBookOpen(b, k) {
  const a = lerp(Math.PI / 2 - 0.02, 0.12, k);
  b.userData.halves[0].rotation.z = -a; b.userData.halves[1].rotation.z = a;
}
// u 0..1: página vira da direita para a esquerda, curvando
export function turnPage(b, u, color = null) {
  const t = b.userData.turn, base = t.userData.base, p = t.geometry.attributes.position;
  const ang = Math.PI * u, bend = Math.sin(Math.PI * u) * 0.9;
  for (let i = 0; i < p.count; i++) {
    const x = base[i * 3], z = base[i * 3 + 2];
    const d = x / (b.userData.W - 0.04);
    const a = ang + bend * d * 0.6 - 0.06;
    const r = x;
    p.setXYZ(i, Math.cos(a) * r, Math.sin(a) * r + 0.003, z);
  }
  p.needsUpdate = true; t.geometry.computeVertexNormals();
}
export function bookGlow(b, k, color = 0x7fd8ff) {
  const u = b.userData;
  u.halves.forEach(h => { h.userData.pageMat.emissive.set(color); h.userData.pageMat.emissiveIntensity = k * 1.6; });
  u.light.color.set(color); u.light.intensity = k * 6; u.glow.material.color.set(color); u.glow.material.opacity = k * 0.6;
}

// Altar de pedra com degraus e runas
export function makeAltar(runeColor = 0x5fd0ff) {
  const g = new THREE.Group();
  const stone = std(0x5d5a56, 0.95, 0, { flatShading: true });
  const parts = [[2.6, 0.2, 2.6, 0.1], [1.9, 0.2, 1.9, 0.3], [0.9, 0.75, 0.9, 0.775], [1.3, 0.14, 1.3, 1.22]];
  parts.forEach(([w, h, d, y]) => { const m = mesh(new THREE.BoxGeometry(w, h, d), stone); m.position.y = y; g.add(m); });
  const rm = new THREE.MeshBasicMaterial({ color: runeColor, transparent: true, opacity: 0.6 });
  for (let k = 0; k < 4; k++) for (let i = 0; i < 3; i++) {
    const r = mesh(new THREE.BoxGeometry(0.05, 0.16, 0.01), rm, false);
    const a = k * Math.PI / 2; r.position.set(Math.sin(a) * 0.456 + Math.cos(a) * (i - 1) * 0.22, 0.8, Math.cos(a) * 0.456 - Math.sin(a) * (i - 1) * 0.22);
    r.rotation.y = a; r.rotation.z = (i - 1) * 0.4; g.add(r);
  }
  g.userData = { runeMat: rm, top: 1.29 };
  return g;
}

// Coluna clássica (opcionalmente quebrada)
export function columnGeo(x, z, h, r = 0.5, broken = 0, seed = 1) {
  const R = rng(seed), geos = [];
  const base = new THREE.BoxGeometry(r * 2.6, 0.4, r * 2.6); base.translate(x, 0.2, z); geos.push(base);
  const hh = h * (broken ? lerp(0.35, 0.75, R()) : 1);
  const sh = new THREE.CylinderGeometry(r * 0.92, r, hh, 16); sh.translate(x, 0.4 + hh / 2, z); geos.push(sh);
  if (!broken) { const cap = new THREE.BoxGeometry(r * 2.6, 0.45, r * 2.6); cap.translate(x, 0.4 + hh + 0.22, z); geos.push(cap); }
  return geos;
}

// Estante com livros (geometrias para mesclar)
export function shelfGeos(x, z, rotY, w = 3, h = 4, seed = 1) {
  const R = rng(seed), wood = [], books = [], cols = [];
  const m = new THREE.Matrix4().makeRotationY(rotY).setPosition(x, 0, z);
  const add = (arr, g) => { g.applyMatrix4(m); arr.push(g); };
  add(wood, new THREE.BoxGeometry(w, h, 0.08).translate(0, h / 2, -0.25));
  for (const s of [-1, 1]) add(wood, new THREE.BoxGeometry(0.1, h, 0.55).translate(s * w / 2, h / 2, 0));
  const rows = Math.floor(h / 0.6);
  const palette = [0x5a1e1a, 0x1e3a5a, 0x2e4a22, 0x4a3a1a, 0x3a1e4a, 0x6a5030, 0x222222];
  for (let i = 0; i <= rows; i++) {
    const y = i * (h / rows);
    add(wood, new THREE.BoxGeometry(w, 0.06, 0.55).translate(0, y + 0.03, 0));
    if (i === rows) break;
    let px = -w / 2 + 0.08;
    while (px < w / 2 - 0.12) {
      const bw = lerp(0.05, 0.12, R()), bh = lerp(0.3, 0.5, R());
      if (R() < 0.08) { px += 0.15; continue; }
      const g = new THREE.BoxGeometry(bw, bh, lerp(0.3, 0.42, R())).translate(px + bw / 2, y + 0.06 + bh / 2, 0.02);
      if (R() < 0.1) g.rotateZ(0.0);
      const c = new THREE.Color(palette[Math.floor(R() * palette.length)]).multiplyScalar(lerp(0.6, 1.2, R()));
      const n = g.attributes.position.count; const ca = new Float32Array(n * 3); for (let k = 0; k < n; k++) { ca[k * 3] = c.r; ca[k * 3 + 1] = c.g; ca[k * 3 + 2] = c.b; }
      g.setAttribute('color', new THREE.BufferAttribute(ca, 3));
      add(books, g); px += bw + 0.005;
    }
  }
  return { wood, books };
}

// Vela com chama
export function makeCandle(h = 0.25, color = 0xffb060, light = true) {
  const g = new THREE.Group();
  g.add(mesh(new THREE.CylinderGeometry(0.035, 0.04, h, 10), std(0xe8dcc0, 0.7)));
  const flame = glowSprite(color, 0.18, 0.95); flame.position.y = h / 2 + 0.05; flame.scale.set(0.09, 0.16, 1); g.add(flame);
  const halo = glowSprite(color, 0.7, 0.35); halo.position.y = h / 2 + 0.05; g.add(halo);
  if (light) { const l = new THREE.PointLight(color, 1.6, 6, 1.6); l.position.y = h / 2 + 0.1; g.add(l); g.userData.light = l; }
  g.userData.flame = flame; g.userData.ph = Math.random() * 6;
  return g;
}
export function flickerCandles(list, t) {
  list.forEach((c, i) => { const f = 1 + 0.15 * Math.sin(t * 13 + i * 2.3) + 0.08 * Math.sin(t * 29 + i); c.userData.flame.scale.set(0.09 * f, 0.16 * f, 1); if (c.userData.light) c.userData.light.intensity = 1.6 * f; });
}
