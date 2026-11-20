// Motor — esqueleto humanoide, túnica de mago, rosto expressivo e biblioteca de poses.
import { THREE, V, rng, lerp, std, mesh, glowSprite } from './base.js';

const cap = (r, len, mat, seg = 10) => mesh(new THREE.CapsuleGeometry(r, len, 4, seg), mat);
const at = (m, x, y, z) => { m.position.set(x, y, z); return m; };
const JOINTS = ['pivot', 'body', 'hips', 'torso', 'head', 'shL', 'shR', 'elL', 'elR', 'handL', 'handR', 'hipL', 'hipR', 'knL', 'knR', 'bootL', 'bootR', 'skirt'];

// Esqueleto (frente = +z; altura ~1,8 m). Personagens adicionam roupa, cabelo e rosto por cima.
export function humanoid({ skin, legs, boots, sleeve = skin, hands = skin }) {
  const root = new THREE.Group();
  const pivot = new THREE.Group(); pivot.position.y = 0.95; root.add(pivot);       // rolar / inclinar / levitar
  const body = new THREE.Group(); body.position.y = -0.95; pivot.add(body);
  const hips = new THREE.Group(); hips.position.y = 0.95; body.add(hips);
  const torso = new THREE.Group(); hips.add(torso);
  const head = new THREE.Group(); head.position.y = 0.6; torso.add(head);
  const h = { root, pivot, body, hips, torso, head, skin };
  head.add(cap(0.05, 0.08, skin));
  const skull = mesh(new THREE.SphereGeometry(0.12, 32, 24), skin); skull.position.y = 0.15; skull.scale.set(0.93, 1.1, 1.0); head.add(skull); h.skull = skull;
  for (const s of [-1, 1]) {
    const side = s < 0 ? 'L' : 'R';
    const sh = new THREE.Group(); sh.position.set(0.2 * s, 0.47, 0); torso.add(sh);
    sh.add(at(cap(0.055, 0.2, sleeve), 0, -0.15, 0));
    const el = new THREE.Group(); el.position.y = -0.31; sh.add(el);
    el.add(at(cap(0.043, 0.18, hands === skin ? skin : sleeve), 0, -0.13, 0));
    const hand = new THREE.Group(); hand.position.y = -0.29; el.add(hand);
    const hm = mesh(new THREE.SphereGeometry(0.048, 12, 10), hands); hm.scale.set(0.85, 1.15, 0.65); hand.add(hm);
    const th = mesh(new THREE.CapsuleGeometry(0.014, 0.04, 3, 6), hands); th.position.set(-0.035 * s, -0.01, 0.025); th.rotation.z = 0.6 * s; hand.add(th);
    const hip = new THREE.Group(); hip.position.set(0.1 * s, -0.04, 0); hips.add(hip);
    hip.add(at(cap(0.07, 0.3, legs), 0, -0.22, 0));
    const kn = new THREE.Group(); kn.position.y = -0.45; hip.add(kn);
    kn.add(at(cap(0.06, 0.28, legs), 0, -0.2, 0));
    const boot = new THREE.Group(); boot.position.y = -0.43; kn.add(boot);
    const bm = mesh(new THREE.CapsuleGeometry(0.06, 0.13, 4, 8), boots); bm.rotation.x = Math.PI / 2; bm.position.set(0, -0.01, 0.04); boot.add(bm);
    Object.assign(h, { ['sh' + side]: sh, ['el' + side]: el, ['hand' + side]: hand, ['hip' + side]: hip, ['kn' + side]: kn, ['boot' + side]: boot });
  }
  return h;
}

// Túnica longa com saia que balança, mangas largas e acabamentos.
export function robe(h, { color, trim, trim2 = trim, sleeveColor = color, hood = null, mantle = null }) {
  const mat = std(color, 0.85, 0, { side: THREE.DoubleSide });
  const top = [[0.07, 0.58], [0.15, 0.55], [0.2, 0.47], [0.205, 0.3], [0.185, 0.1], [0.175, -0.02]].map(([r, y]) => new THREE.Vector2(r, y));
  const up = mesh(new THREE.LatheGeometry(top, 24), mat); up.scale.z = 0.75; h.torso.add(up);
  const skirt = new THREE.Group(); h.hips.add(skirt); h.skirt = skirt;
  const sk = [[0.18, 0.0], [0.21, -0.2], [0.26, -0.45], [0.32, -0.7], [0.37, -0.88]].map(([r, y]) => new THREE.Vector2(r, y));
  const sm = mesh(new THREE.LatheGeometry(sk, 28), mat); sm.scale.z = 0.82; skirt.add(sm);
  const tm = std(trim, 0.35, 0.8);
  const hem = mesh(new THREE.TorusGeometry(0.37, 0.018, 6, 40), tm); hem.rotation.x = Math.PI / 2; hem.scale.y = 0.82; hem.position.y = -0.875; skirt.add(hem);
  const belt = mesh(new THREE.TorusGeometry(0.18, 0.025, 6, 32), tm); belt.rotation.x = Math.PI / 2; belt.scale.y = 0.76; belt.position.y = 0.0; h.torso.add(belt);
  const gem = mesh(new THREE.OctahedronGeometry(0.03), std(trim2, 0.2, 0.6)); gem.position.set(0, 0, 0.14); h.torso.add(gem);
  const collar = mesh(new THREE.TorusGeometry(0.09, 0.022, 6, 24), tm); collar.rotation.x = Math.PI / 2; collar.position.y = 0.56; h.torso.add(collar);
  // faixa vertical frontal
  const band = mesh(new THREE.BoxGeometry(0.05, 0.86, 0.01), tm); band.position.set(0, -0.44, 0.235); band.rotation.x = -0.12; skirt.add(band);
  // mangas largas
  const sl = std(sleeveColor, 0.85, 0, { side: THREE.DoubleSide });
  for (const side of ['L', 'R']) {
    const upS = mesh(new THREE.CylinderGeometry(0.075, 0.08, 0.32, 14, 1, true), sl); upS.position.y = -0.15; h['sh' + side].add(upS);
    const foS = mesh(new THREE.CylinderGeometry(0.08, 0.125, 0.27, 16, 1, true), sl); foS.position.y = -0.12; h['el' + side].add(foS);
    const cuff = mesh(new THREE.TorusGeometry(0.124, 0.007, 6, 20), tm); cuff.rotation.x = Math.PI / 2; cuff.position.y = -0.255; h['el' + side].add(cuff);
  }
  if (hood) {
    const hm = std(hood.color ?? color, 0.9, 0, { side: THREE.DoubleSide });
    const hd = mesh(new THREE.SphereGeometry(0.165, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.62), hm);
    hd.position.set(0, 0.2, -0.05); hd.rotation.x = -0.8; hd.scale.set(1, 1.15, 1.1); h.head.add(hd); h.hood = hd;
    const back = mesh(new THREE.ConeGeometry(0.17, 0.35, 16, 1, true), hm); back.position.set(0, 0.06, -0.08); back.rotation.x = Math.PI + 0.45; h.head.add(back);
  }
  if (mantle) {
    const mm = std(mantle.color, 0.9, 0, { side: THREE.DoubleSide });
    const g = new THREE.CylinderGeometry(0.24, 0.42, 1.3, 20, 8, true, Math.PI * 0.6, Math.PI * 0.8);
    const cape = mesh(g, mm); cape.position.set(0, -0.12, -0.02); h.torso.add(cape); h.cape = cape;
    cape.userData.base = Float32Array.from(g.attributes.position.array);
  }
  return h;
}
export function flutterCape(h, t, amt = 1) {
  if (!h.cape) return;
  const p = h.cape.geometry.attributes.position, b = h.cape.userData.base;
  for (let i = 0; i < p.count; i++) {
    const y = b[i * 3 + 1], d = (0.65 - y) / 1.3;
    const w = Math.sin(t * 4 + y * 5 + b[i * 3] * 3) * 0.05 * d * amt;
    p.setXYZ(i, b[i * 3] + w * 0.3, y, b[i * 3 + 2] - Math.abs(w) - d * d * 0.08 * amt);
  }
  p.needsUpdate = true; h.cape.geometry.computeVertexNormals();
}

// Rosto: olhos (íris colorida, opcionalmente brilhantes), pálpebras, sobrancelhas, nariz, boca.
export function face(h, { iris = 0x3d2a17, glow = false, brow = 0x3a2a1a, browSize = 1, skin = h.skin, lips = 0x9c5a50, age = 0 }) {
  const f = new THREE.Group(); f.position.y = 0.15; h.head.add(f); h.face = f;
  const white = std(0xf4f0ea, 0.35);
  const irisM = glow ? new THREE.MeshBasicMaterial({ color: iris }) : new THREE.MeshStandardMaterial({ color: iris, roughness: 0.25, emissive: iris, emissiveIntensity: 0.25 });
  const pupil = std(0x050505, 0.2);
  h.eyes = []; h.lids = []; h.brows = []; h.irisMat = irisM;
  for (const s of [-1, 1]) {
    const e = mesh(new THREE.SphereGeometry(0.022, 16, 12), glow ? std(0x220000, 0.5) : white, false); e.position.set(0.042 * s, 0.012, 0.098); e.scale.z = 0.6; f.add(e);
    const eg = new THREE.Group(); eg.position.set(0.042 * s, 0.012, 0.106); f.add(eg);
    const ir = mesh(new THREE.CircleGeometry(0.0125, 18), irisM, false); ir.position.z = 0.006; eg.add(ir);
    const pu = mesh(new THREE.CircleGeometry(0.0055, 12), glow ? irisM : pupil, false); pu.position.z = 0.0068; eg.add(pu);
    const hl = mesh(new THREE.CircleGeometry(0.0025, 8), new THREE.MeshBasicMaterial({ color: 0xffffff }), false); hl.position.set(0.004, 0.004, 0.0072); eg.add(hl);
    h.eyes.push(eg);
    if (glow) { const g = glowSprite(iris, 0.09, 0.9); g.position.set(0.042 * s, 0.012, 0.12); f.add(g); (h.eyeGlows = h.eyeGlows || []).push(g); }
    const lid = mesh(new THREE.SphereGeometry(0.0245, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.5), skin, false);
    lid.position.set(0.042 * s, 0.014, 0.097); lid.scale.set(1, 0.5, 0.8); f.add(lid); h.lids.push(lid);
    const br = mesh(new THREE.BoxGeometry(0.05 * browSize, 0.012 * browSize, 0.014), std(brow, 0.9), false); br.position.set(0.045 * s, 0.05, 0.106); br.userData.s = s; f.add(br); h.brows.push(br);
    const ear = mesh(new THREE.SphereGeometry(0.027, 10, 8), skin); ear.position.set(0.11 * s, 0, 0); ear.scale.set(0.45, 1, 0.8); f.add(ear);
  }
  const nose = mesh(new THREE.ConeGeometry(0.017, 0.045, 10), skin); nose.position.set(0, -0.012, 0.118); nose.rotation.x = -1.2; f.add(nose);
  const mouth = new THREE.Group(); mouth.position.set(0, -0.055, 0.108); f.add(mouth); h.mouth = mouth;
  const mo = mesh(new THREE.SphereGeometry(0.02, 12, 8), std(0x2a0d0d, 0.6), false); mo.scale.set(1.1, 0.12, 0.4); mouth.add(mo); h.mouthOpen = mo;
  const lip = mesh(new THREE.TorusGeometry(0.019, 0.004, 6, 16), std(lips, 0.6), false); lip.scale.set(1.15, 0.25, 0.5); mouth.add(lip); h.lip = lip;
  if (age) for (const s of [-1, 1]) { const w = mesh(new THREE.TorusGeometry(0.03, 0.002, 4, 12, 1.2), std(0x9a7a62, 0.8), false); w.position.set(0.075 * s, 0.0, 0.085); w.rotation.set(0, 0.6 * s, s > 0 ? 2.2 : -0.6); f.add(w); }
  return h;
}
// Expressão: look [x,y], blink 0–1, worry, anger, fear (olhos arregalados), open (boca)
export function expr(h, { look = [0, 0], blink = 0, worry = 0, anger = 0, fear = 0, open = 0, glow = 1 } = {}) {
  h.eyes.forEach(e => { e.position.x = Math.sign(e.position.x) * 0.042 + look[0] * 0.007; e.position.y = 0.012 + look[1] * 0.005; e.scale.setScalar(1 - fear * 0.18); });
  h.lids.forEach(l => { l.scale.y = 0.5 + blink * 0.55 - fear * 0.25 + anger * 0.15; l.position.y = 0.014 + fear * 0.006 - blink * 0.004; });
  h.brows.forEach(b => { const s = b.userData.s; b.rotation.z = -s * (worry * 0.35 + fear * 0.25) + s * anger * 0.4; b.position.y = 0.05 + fear * 0.014 + worry * 0.004 - anger * 0.008; });
  h.mouthOpen.scale.set(1.1 - open * 0.2, 0.12 + open * 1.1, 0.4);
  h.lip.scale.set(1.15 - open * 0.2, 0.25 + open * 1.0, 0.5);
  if (h.eyeGlows) h.eyeGlows.forEach(g => (g.material.opacity = 0.9 * glow));
}

// ---------- Poses ----------
export function resetPose(h) {
  for (const k of JOINTS) if (h[k]) h[k].rotation.set(0, 0, 0);
  h.body.position.y = -0.95; h.pivot.position.y = 0.95;
  h.shL.rotation.z = -0.1; h.shR.rotation.z = 0.1; h.elL.rotation.x = -0.15; h.elR.rotation.x = -0.15;
}
export function walk(h, phase, amt = 1, run = 0) {
  const s = Math.sin(phase), c = Math.cos(phase), legA = (0.42 + run * 0.35) * amt;
  h.hipL.rotation.x = -s * legA; h.hipR.rotation.x = s * legA;
  h.knL.rotation.x = Math.max(0, Math.sin(phase - 1.2)) * (0.7 + run * 0.6) * amt;
  h.knR.rotation.x = Math.max(0, Math.sin(phase + Math.PI - 1.2)) * (0.7 + run * 0.6) * amt;
  h.shL.rotation.x = s * (0.32 + run * 0.4) * amt; h.shR.rotation.x = -s * (0.32 + run * 0.4) * amt;
  h.elL.rotation.x = -(0.25 + run * 0.9) * amt; h.elR.rotation.x = -(0.25 + run * 0.9) * amt;
  h.body.position.y = -0.95 + Math.abs(c) * 0.03 * amt;
  h.hips.rotation.y = s * 0.07 * amt; h.torso.rotation.y = -s * 0.1 * amt; h.torso.rotation.x = run * 0.22 * amt;
  if (h.skirt) { h.skirt.rotation.x = -Math.abs(s) * 0.08 * amt - run * 0.1; h.skirt.rotation.z = s * 0.04 * amt; }
}
export function idle(h, t, k = 1) {
  h.torso.rotation.x += Math.sin(t * 1.6) * 0.015 * k; h.head.rotation.z += Math.sin(t * 0.9) * 0.02 * k;
  h.shL.rotation.z -= Math.sin(t * 1.6) * 0.02 * k; h.shR.rotation.z += Math.sin(t * 1.6) * 0.02 * k;
}
// Poses de feitiço: cada uma é um dicionário junta -> [x, y, z]
export const POSES = {
  push: { shL: [-1.45, 0, -0.15], shR: [-1.45, 0, 0.15], elL: [-0.15, 0, 0], elR: [-0.15, 0, 0], handL: [0.9, 0, 0], handR: [0.9, 0, 0], torso: [0.12, 0, 0] },
  charge: { shL: [-0.9, 0, 0.35], shR: [-0.9, 0, -0.35], elL: [-1.2, 0, 0], elR: [-1.2, 0, 0], torso: [-0.05, 0, 0], head: [0.2, 0, 0] },
  raiseBoth: { shL: [-2.7, 0, -0.35], shR: [-2.7, 0, 0.35], elL: [-0.2, 0, 0], elR: [-0.2, 0, 0], torso: [-0.12, 0, 0], head: [-0.25, 0, 0] },
  raiseR: { shR: [-2.75, 0, 0.15], elR: [-0.15, 0, 0], shL: [-0.5, 0, -0.3], elL: [-0.9, 0, 0], torso: [-0.08, 0, 0] },
  staffForward: { shR: [-1.3, 0, 0.1], elR: [-0.5, 0, 0], shL: [-1.1, 0, -0.2], elL: [-0.7, 0, 0], torso: [0.08, 0, 0] },
  reachR: { shR: [-1.35, 0, -0.1], elR: [-0.2, 0, 0], handR: [0.9, 0, 0] },
  hold: { shL: [-0.7, 0, 0.25], shR: [-0.7, 0, -0.25], elL: [-1.0, 0, 0], elR: [-1.0, 0, 0], head: [0.35, 0, 0] },
  spread: { shL: [-0.4, 0, -1.2], shR: [-0.4, 0, 1.2], elL: [-0.3, 0, 0], elR: [-0.3, 0, 0], torso: [-0.1, 0, 0], head: [-0.15, 0, 0] },
  recoil: { shL: [-1.2, 0, -0.6], shR: [-1.2, 0, 0.6], elL: [-1.4, 0, 0], elR: [-1.4, 0, 0], torso: [-0.25, 0, 0], head: [-0.2, 0, 0] },
};
export function pose(h, name, w = 1) {
  if (w <= 0) return;
  const p = typeof name === 'string' ? POSES[name] : name;
  for (const k in p) { const r = h[k].rotation; r.x = lerp(r.x, p[k][0], w); r.y = lerp(r.y, p[k][1], w); r.z = lerp(r.z, p[k][2], w); }
}
export const wp = (o) => { o.updateWorldMatrix(true, false); return o.getWorldPosition(new THREE.Vector3()); };
