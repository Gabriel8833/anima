// Torres de transmissão, cabos com esferas de sinalização, paisagem, bola de basquete e helicóptero (3D estilizado).
import { THREE, V, rng, lerp, clamp, mesh, skyDome, glowSprite, fbm } from './base.js';
import { toon, peca, caixa } from './mundo.js';

const aco = () => toon(0x8a929e);
// barra fina entre dois pontos
function barra(a, b, r, mat) { const d = b.clone().sub(a), L = d.length(); const m = mesh(new THREE.CylinderGeometry(r, r, L, 5), mat); m.position.copy(a).add(b).multiplyScalar(0.5); m.quaternion.setFromUnitVectors(V(0, 1, 0), d.normalize()); return m; }
// torre treliçada de alta tensão (altura ~40)
export function torreTransmissao(alt = 40) {
  const g = new THREE.Group(), m = aco(), r = 0.12;
  const larg = y => lerp(5, 1.2, y / alt);
  const niveis = [0, 8, 16, 24, 30, 35, alt];
  const canto = (y, sx, sz) => V(sx * larg(y) / 2, y, sz * larg(y) / 2);
  const cs = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
  for (const [sx, sz] of cs) g.add(barra(canto(0, sx, sz), canto(alt, sx, sz), 0.22, m));
  for (let i = 0; i < niveis.length - 1; i++) { const y0 = niveis[i], y1 = niveis[i + 1]; for (let k = 0; k < 4; k++) { const [ax, az] = cs[k], [bx, bz] = cs[(k + 1) % 4]; g.add(barra(canto(y0, ax, az), canto(y1, bx, bz), r, m)); g.add(barra(canto(y0, bx, bz), canto(y1, ax, az), r, m)); g.add(barra(canto(y1, ax, az), canto(y1, bx, bz), r, m)); } }
  // braços (cruzetas) em dois níveis + pico para o cabo de guarda
  const bracos = [[24, 9], [32, 7]];
  for (const [y, L] of bracos) for (const sz of [-1, 1]) { g.add(barra(V(0, y, 0), V(0, y, sz * L), 0.18, m)); g.add(barra(V(0, y + 2.4, 0), V(0, y, sz * L), 0.12, m)); }
  g.add(barra(V(0, alt, 0), V(0, alt + 3, 0), 0.18, m));
  // isoladores
  const pontos = [];
  for (const [y, L] of bracos) for (const sz of [-1, 1]) { const iso = mesh(new THREE.CylinderGeometry(0.18, 0.18, 1.6, 8), toon(0x6aa0a8)); iso.position.set(0, y - 0.8, sz * L); g.add(iso); pontos.push(V(0, y - 1.6, sz * L)); }
  g.userData.pontos = pontos; g.userData.guarda = V(0, alt + 3, 0);
  return g;
}
// curva de catenária (aproximação parabólica) entre A e B
export function vao(A, B, flecha) { const pts = []; for (let i = 0; i <= 40; i++) { const u = i / 40; const p = A.clone().lerp(B, u); p.y -= 4 * flecha * u * (1 - u); pts.push(p); } return new THREE.CatmullRomCurve3(pts); }
export function cabo(curva, r = 0.06, cor = 0x2a2a30) { return mesh(new THREE.TubeGeometry(curva, 80, r, 6), toon(cor), false); }
// esfera de sinalização (laranja por padrão) com faixa e emendas
const texEsferaCache = {};
function texEsfera(cor) { if (texEsferaCache[cor]) return texEsferaCache[cor]; const c = document.createElement('canvas'); c.width = 256; c.height = 128; const x = c.getContext('2d'); x.fillStyle = cor; x.fillRect(0, 0, 256, 128); x.fillStyle = 'rgba(0,0,0,0.25)'; x.fillRect(0, 60, 256, 8); x.fillStyle = 'rgba(255,255,255,0.15)'; x.fillRect(0, 20, 256, 10); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return (texEsferaCache[cor] = t); }
export function esfera(cor = '#ff7a1a', r = 0.9) { const g = peca(new THREE.SphereGeometry(r, 32, 20), new THREE.MeshToonMaterial({ map: texEsfera(cor), gradientMap: toon(0xffffff).gradientMap }), { contorno: 0.05 }); const gr = mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.35, 8), toon(0x5a5a62)); gr.position.y = r + 0.1; g.add(gr); return g; }
// bola de basquete
let texBasq = null;
export function basquete(r = 0.9) {
  if (!texBasq) { const c = document.createElement('canvas'); c.width = 512; c.height = 256; const x = c.getContext('2d'); x.fillStyle = '#e8762a'; x.fillRect(0, 0, 512, 256); x.strokeStyle = '#1a1210'; x.lineWidth = 8; x.beginPath(); x.moveTo(0, 128); x.lineTo(512, 128); x.stroke(); for (const xx of [128, 384]) { x.beginPath(); x.moveTo(xx, 0); x.lineTo(xx, 256); x.stroke(); } for (const xx of [0, 256, 512]) { x.beginPath(); x.ellipse(xx, 128, 70, 128, 0, 0, Math.PI * 2); x.stroke(); } texBasq = new THREE.CanvasTexture(c); texBasq.colorSpace = THREE.SRGBColorSpace; }
  return peca(new THREE.SphereGeometry(r, 32, 20), new THREE.MeshToonMaterial({ map: texBasq, gradientMap: toon(0xffffff).gradientMap }), { contorno: 0.05 });
}
// paisagem aberta: morros, árvores, rio; linha de transmissão cruzando o vale ao longo de x
export function paisagem(scene, { torres = [-180, -60, 60, 180], z = 0, esferasCor = '#ff7a1a', esferasVisiveis = true, nevoa = 0.0022 } = {}) {
  scene.add(skyDome({ top: 0x2a78d8, mid: 0x6ab0ec, horizon: 0xdaeefa, bottom: 0x7a9a6a, sunColor: 0xfff2c8, sunDir: V(0.5, 0.45, -0.7), sunSize: 3, glow: 0.5 }));
  scene.fog = new THREE.FogExp2(0xcfe4f2, nevoa);
  scene.add(new THREE.HemisphereLight(0xe0f0ff, 0x5a7a4a, 1.3));
  const sol = new THREE.DirectionalLight(0xfff4e0, 2.4); sol.position.set(60, 90, 50); sol.castShadow = true; sol.shadow.mapSize.set(2048, 2048); Object.assign(sol.shadow.camera, { left: -120, right: 120, top: 120, bottom: -120, near: 1, far: 400 }); scene.add(sol);
  // terreno ondulado
  const geo = new THREE.PlaneGeometry(1600, 1600, 160, 160); geo.rotateX(-Math.PI / 2);
  const pa = geo.attributes.position; for (let i = 0; i < pa.count; i++) { const x = pa.getX(i), zz = pa.getZ(i); const vale = Math.min(1, Math.abs(zz - z) / 260); pa.setY(i, (fbm(x * 0.006, zz * 0.006, 4) - 0.45) * 60 * (0.25 + vale) - 2); } geo.computeVertexNormals();
  const chao = mesh(geo, toon(0x6aa84a)); scene.add(chao);
  const altura = (x, zz) => { const vale = Math.min(1, Math.abs(zz - z) / 260); return (fbm(x * 0.006, zz * 0.006, 4) - 0.45) * 60 * (0.25 + vale) - 2; };
  // árvores (instanciadas)
  const r = rng(5), n = 700, tronco = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.4, 0.5, 3, 5), toon(0x6a4a2a), n), copa = new THREE.InstancedMesh(new THREE.ConeGeometry(2.6, 7, 7), toon(0x3a7a3a), n);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion();
  for (let i = 0; i < n; i++) { let x, zz; do { x = (r() - 0.5) * 1200; zz = (r() - 0.5) * 1200; } while (Math.abs(zz - z) < 14); const y = altura(x, zz), s = 0.7 + r() * 0.9; m4.compose(V(x, y + 1.5 * s, zz), q, V(s, s, s)); tronco.setMatrixAt(i, m4); m4.compose(V(x, y + 6 * s, zz), q, V(s, s, s)); copa.setMatrixAt(i, m4); }
  tronco.castShadow = copa.castShadow = true; scene.add(tronco, copa);
  // torres e cabos
  const lista = torres.map(x => { const t = torreTransmissao(); t.position.set(x, altura(x, z) - 0.5, z); scene.add(t); return t; });
  const esferas = [];
  for (let i = 0; i < lista.length - 1; i++) {
    const A = lista[i], B = lista[i + 1];
    for (let k = 0; k < A.userData.pontos.length; k++) { const a = A.localToWorld(A.userData.pontos[k].clone()), b = B.localToWorld(B.userData.pontos[k].clone()); scene.add(cabo(vao(a, b, 9), 0.07)); }
    const ga = A.localToWorld(A.userData.guarda.clone()), gb = B.localToWorld(B.userData.guarda.clone()); const cg = vao(ga, gb, 7); scene.add(cabo(cg, 0.05));
    for (const u of [0.3, 0.5, 0.7]) { const e = esfera(esferasCor); const p = cg.getPoint(u); e.position.set(p.x, p.y - 1.0, p.z); e.visible = esferasVisiveis; scene.add(e); esferas.push(e); }
  }
  scene.updateMatrixWorld(true);
  return { torres: lista, esferas, altura, sol };
}
// helicóptero estilizado (amarelo/vermelho)
export function helicoptero() {
  const g = new THREE.Group();
  const corpo = peca(new THREE.SphereGeometry(1.6, 24, 16), toon(0xf0c030), { contorno: 0.05 }); corpo.scale.set(1.5, 1, 1); g.add(corpo);
  const vidro = mesh(new THREE.SphereGeometry(1.2, 20, 14, 0, Math.PI * 2, 0, Math.PI / 2), toon(0x6ab0e0, { transparent: true, opacity: 0.85 }), false); vidro.position.set(1.0, 0.3, 0); vidro.rotation.z = -0.6; g.add(vidro);
  const cauda = peca(new THREE.CylinderGeometry(0.22, 0.4, 4.6, 10), toon(0xd8302a), { contorno: 0.04 }); cauda.rotation.z = Math.PI / 2; cauda.position.set(-3.8, 0.3, 0); g.add(cauda);
  const deriva = peca(caixa(0.9, 1.4, 0.16, 0.06), toon(0xd8302a), { contorno: 0.03 }); deriva.position.set(-6.0, 0.9, 0); g.add(deriva);
  for (const s of [-1, 1]) { g.add(barra(V(-1.2, -1.6, s * 1.1), V(1.6, -1.6, s * 1.1), 0.08, toon(0x3a3a3a))); g.add(barra(V(-0.6, -1.6, s * 1.1), V(-0.4, -0.9, s * 0.7), 0.06, toon(0x3a3a3a))); g.add(barra(V(0.9, -1.6, s * 1.1), V(0.7, -0.9, s * 0.7), 0.06, toon(0x3a3a3a))); }
  const mastro = mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.7, 8), toon(0x3a3a3a)); mastro.position.set(0, 1.4, 0); g.add(mastro);
  const rotor = new THREE.Group(); rotor.position.set(0, 1.8, 0); for (let i = 0; i < 4; i++) { const p = mesh(new THREE.BoxGeometry(6.4, 0.06, 0.3), toon(0x2a2a2e)); p.position.x = 3.2; const h = new THREE.Group(); h.rotation.y = i * Math.PI / 2; h.add(p); rotor.add(h); } g.add(rotor);
  const disco = mesh(new THREE.CircleGeometry(6.4, 40), new THREE.MeshBasicMaterial({ color: 0x222222, transparent: true, opacity: 0.12, depthWrite: false }), false); disco.rotation.x = -Math.PI / 2; disco.position.y = 1.85; g.add(disco);
  const rotorT = new THREE.Group(); rotorT.position.set(-6.0, 1.0, 0.2); for (let i = 0; i < 2; i++) { const p = mesh(new THREE.BoxGeometry(0.1, 1.4, 0.06), toon(0x2a2a2e)); p.rotation.z = i * Math.PI / 2; rotorT.add(p); } g.add(rotorT);
  g.userData = { rotor, rotorT };
  return g;
}
export function girarRotores(h, t) { h.userData.rotor.rotation.y = t * 40; h.userData.rotorT.rotation.z = t * 50; }
