// Personagens da série. A aparência de cada um é definida só aqui, para ficar idêntica em todas as cenas.
import { THREE, V, rng, std, mesh, taperTube, glowSprite } from '../motor/base.js';
import { humanoid, robe, face } from '../motor/rig.js';

function hairCap(h, mat, { tufts = 14, seed = 1, size = 1 } = {}) {
  const c = mesh(new THREE.SphereGeometry(0.13, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.56), mat);
  c.position.set(0, 0.17, -0.012); c.rotation.x = -0.35; c.scale.set(1.0, 1.05, 1.07); h.head.add(c);
  const r = rng(seed);
  for (let i = 0; i < tufts; i++) {
    const a = r() * Math.PI * 2, el = 0.3 + r() * 0.8;
    const t = mesh(new THREE.SphereGeometry((0.026 + r() * 0.016) * size, 8, 6), mat);
    t.position.set(Math.cos(a) * Math.sin(el) * 0.127, 0.17 + Math.cos(el) * 0.13, Math.sin(a) * Math.sin(el) * 0.127 - 0.012);
    h.head.add(t);
  }
}

// KAEL — jovem mago (~22 anos), cabelo prateado, olhos azuis, roupas azuis com detalhes prateados.
export function makeKael() {
  const skin = std(0xf0cdb0, 0.65);
  const h = humanoid({ skin, legs: std(0x18233f, 0.9), boots: std(0x2b3248, 0.6, 0.3) });
  robe(h, { color: 0x1f4fae, trim: 0xd4dbe6, trim2: 0x7fd0ff, mantle: { color: 0x163b85 } });
  const hair = std(0xdfe5ee, 0.4, 0.35);
  hairCap(h, hair, { seed: 3, tufts: 14, size: 0.75 });
  // franja e mechas laterais até o queixo
  for (const [x, z, rz, len] of [[-0.1, 0.05, 0.25, 0.14], [0.1, 0.05, -0.25, 0.14], [-0.115, -0.02, 0.15, 0.16], [0.115, -0.02, -0.15, 0.16]]) {
    const m = mesh(new THREE.CapsuleGeometry(0.02, len, 4, 8), hair); m.position.set(x, 0.12, z); m.rotation.z = rz; h.head.add(m);
  }
  const fringe = mesh(new THREE.SphereGeometry(0.07, 12, 8), hair); fringe.position.set(0.03, 0.245, 0.08); fringe.scale.set(1.5, 0.5, 0.8); fringe.rotation.z = -0.2; h.head.add(fringe);
  const back = mesh(new THREE.SphereGeometry(0.12, 16, 12), hair); back.position.set(0, 0.1, -0.06); back.scale.set(1.05, 1.1, 0.8); h.head.add(back);
  face(h, { iris: 0x2f8cff, brow: 0xc8ced8, skin });
  h.name = 'Kael'; h.magic = 0x58b4ff;
  return h;
}

// MORVATH — mago das sombras: vestes negras, capuz, olhos vermelhos.
export function makeMorvath() {
  const skin = std(0xa8a2a6, 0.7);
  const h = humanoid({ skin, legs: std(0x0a090c, 0.9), boots: std(0x111014, 0.5, 0.4) });
  robe(h, { color: 0x0d0c11, trim: 0x6a0c16, trim2: 0xff2030, hood: { color: 0x09080c }, mantle: { color: 0x070609 } });
  face(h, { iris: 0xff2020, glow: true, brow: 0x111111, browSize: 1.25, skin, lips: 0x5a4048 });
  // olheiras / sombra no rosto
  const shade = mesh(new THREE.SphereGeometry(0.123, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.45), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.45 }), false);
  shade.position.set(0, 0.15, 0.005); shade.scale.set(0.95, 1.1, 1.0); // (sombra removida: o rosto precisa ler na câmera)
  h.root.scale.setScalar(1.06);
  h.name = 'Morvath'; h.magic = 0xff2040;
  return h;
}

// ELDRIN — mago ancião: barba branca, roupas douradas, cajado luminoso.
export function makeEldrin() {
  const skin = std(0xe6c0a2, 0.75);
  const h = humanoid({ skin, legs: std(0x5a4420, 0.9), boots: std(0x4a3418, 0.7) });
  robe(h, { color: 0xc89b2f, trim: 0xf6e7b8, trim2: 0xffffff, mantle: { color: 0x8f6a1c } });
  const white = std(0xf2f0ea, 0.85);
  hairCap(h, white, { seed: 9, tufts: 10, size: 1.2 });
  const long = mesh(new THREE.CapsuleGeometry(0.1, 0.18, 6, 12), white); long.position.set(0, 0.04, -0.07); long.scale.set(1.1, 1, 0.6); h.head.add(long);
  face(h, { iris: 0x6a8fa8, brow: 0xffffff, browSize: 1.5, skin, age: 1 });
  // barba e bigode
  const beard = mesh(new THREE.ConeGeometry(0.1, 0.42, 16), white); beard.rotation.x = Math.PI; beard.position.set(0, -0.12, 0.085); beard.scale.z = 0.6; h.face.add(beard);
  const cheeks = mesh(new THREE.SphereGeometry(0.105, 16, 12, 0, Math.PI * 2, Math.PI * 0.45, Math.PI * 0.55), white); cheeks.position.set(0, -0.02, 0.015); h.face.add(cheeks);
  for (const s of [-1, 1]) { const m = mesh(new THREE.CapsuleGeometry(0.014, 0.05, 4, 8), white); m.position.set(0.025 * s, -0.04, 0.115); m.rotation.z = 1.2 * s; h.face.add(m); }
  h.mouth.position.z = 0.122;
  h.name = 'Eldrin'; h.magic = 0xffc040;
  return h;
}

// ZARETH — feiticeiro misterioso: cabelo escuro, roupas roxas, poderes desconhecidos.
export function makeZareth() {
  const skin = std(0xd6a985, 0.65);
  const h = humanoid({ skin, legs: std(0x1d1028, 0.9), boots: std(0x20122e, 0.6, 0.3) });
  robe(h, { color: 0x56288e, trim: 0xb9a0e6, trim2: 0xd060ff, mantle: { color: 0x2c1250 } });
  const hair = std(0x16121c, 0.55);
  hairCap(h, hair, { seed: 17, tufts: 16 });
  const tail = mesh(taperTube([V(0, 0.18, -0.12), V(0, 0.05, -0.16), V(0, -0.12, -0.14), V(0, -0.3, -0.1)], 0.05, 0.015, 8, 12), hair); h.head.add(tail);
  const lock = mesh(new THREE.CapsuleGeometry(0.026, 0.13, 4, 8), hair); lock.position.set(0.06, 0.17, 0.1); lock.rotation.set(0.4, 0, -0.35); h.head.add(lock);
  // capuz abaixado (gola)
  const cowl = mesh(new THREE.TorusGeometry(0.14, 0.06, 10, 24), std(0x3b1a63, 0.9)); cowl.rotation.x = Math.PI / 2 + 0.25; cowl.position.set(0, 0.54, -0.03); h.torso.add(cowl);
  face(h, { iris: 0xb46cff, brow: 0x16121c, skin });
  // tatuagem rúnica sob o olho
  const tat = mesh(new THREE.PlaneGeometry(0.018, 0.035), new THREE.MeshBasicMaterial({ color: 0xc070ff, transparent: true, opacity: 0.9 }), false);
  tat.position.set(-0.05, -0.02, 0.105); tat.rotation.y = -0.35; h.face.add(tat); h.tattoo = tat;
  h.name = 'Zareth'; h.magic = 0xa040ff;
  return h;
}

// Cajado de Eldrin (objeto separado; posicionado pela cena na mão do mago)
export function makeStaff() {
  const g = new THREE.Group();
  const pts = []; for (let i = 0; i <= 8; i++) pts.push(V(Math.sin(i * 1.3) * 0.015, -1.05 + i * 0.25, Math.cos(i * 1.7) * 0.015));
  g.add(mesh(taperTube(pts, 0.03, 0.022, 7, 40), std(0x5a3a1c, 0.8)));
  const top = V(0, 0.95, 0);
  for (let k = 0; k < 4; k++) { const a = k / 4 * 6.283; g.add(mesh(taperTube([V(0, 0.9, 0), V(Math.cos(a) * 0.07, 1.0, Math.sin(a) * 0.07), V(Math.cos(a) * 0.03, 1.12, Math.sin(a) * 0.03)], 0.016, 0.004, 5, 8), std(0x5a3a1c, 0.8))); }
  const orbM = new THREE.MeshStandardMaterial({ color: 0xfff1c0, emissive: 0xffc850, emissiveIntensity: 2, roughness: 0.1 });
  const orb = mesh(new THREE.SphereGeometry(0.055, 16, 12), orbM, false); orb.position.set(0, 1.03, 0); g.add(orb);
  const glow = glowSprite(0xffd060, 0.6, 0.8); glow.position.copy(orb.position); g.add(glow);
  const light = new THREE.PointLight(0xffc850, 4, 8, 1.5); light.position.copy(orb.position); g.add(light);
  g.userData = { orb, glow, light, orbM, tip: orb };
  return g;
}
export function staffGlow(s, k, t = 0) {
  const u = s.userData, f = 1 + 0.1 * Math.sin(t * 9);
  u.orbM.emissiveIntensity = 1 + k * 3; u.glow.material.opacity = 0.5 + k * 0.5; u.glow.scale.setScalar((0.5 + k * 1.2) * f); u.light.intensity = (2 + k * 18) * f;
}
