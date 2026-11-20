// A Espada Lendária — animação procedural (Three.js). window.renderFrame(t) desenha o quadro do instante t.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  V, clamp, lerp, sstep, kf, easeInOut, easeOut, easeIn, linear, rng, shake, softTex, glowSprite, std,
  makeArthur, arthurFace, resetPose, walk, makeSoldier, soldierPose, makeKnight, makeExcalion, swordGlow, particles,
} from './lib.js';
import {
  buildKingdom, waveBanner, buildForest, animateMist, forestLights, makeEyes, animateEyes, makeCreature,
  animateCreature, buildRidge, FOREST,
} from './world.js';

const W = 1080, H = 1920;
const params = new URLSearchParams(location.search);
const SCALE = parseFloat(params.get('scale') || '1');
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1);
renderer.setSize(W * SCALE, H * SCALE);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;
const out = document.createElement('canvas'); out.width = W * SCALE; out.height = H * SCALE;
document.body.appendChild(out);
const ctx = out.getContext('2d');
const camera = new THREE.PerspectiveCamera(50, W / H, 0.05, 6000);

const pmrem = new THREE.PMREMGenerator(renderer);
const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
const timeline = await (await fetch('build/timeline.json')).json();
const EV = await (await fetch('events.json')).json();

function setCam(pos, target, fov = 50, roll = 0, shk = [0, 0]) {
  camera.fov = fov; camera.updateProjectionMatrix();
  camera.position.set(pos[0], pos[1], pos[2]);
  camera.lookAt(target[0], target[1], target[2]);
  camera.rotateZ(roll + shk[0] * 0.02);
  camera.rotateX(shk[1] * 0.02);
}
const wp = (o) => { o.updateWorldMatrix(true, false); return o.getWorldPosition(new THREE.Vector3()); };
function useEnv(root, k = 1) { root.traverse(o => { if (o.isMesh && o.material.metalness > 0.5) { o.material.envMap = envTex; o.material.envMapIntensity = k; o.material.needsUpdate = true; } }); }

// ============ Cena 1: Reino ============
const K = buildKingdom();
K.soldiers.forEach(s => useEnv(s.root, 0.9));

function scene1(t) {
  K.banners.forEach((b, i) => waveBanner(b, t + i * 0.37, 0.55, 5));
  K.flags.forEach(f => waveBanner(f, t, 1.6, 7));
  K.soldiers.forEach(s => {
    s.root.position.set(s.home.x, 0, s.home.z - 1.5 * t);
    soldierPose(s, t * Math.PI * 2 * 1.0);
    s.root.visible = s.root.position.z > K.gateZ - 1;
    if (s.cape) s.cape.rotation.x = 0.15 + Math.sin(t * 6 + s.phaseOff * 10) * 0.08;
  });
  if (t < EV.cuts[0]) {
    const u = t / EV.cuts[0];
    setCam(kf(u, [[0, [34, 152, 330]], [1, [10, 108, 110]]], linear), kf(u, [[0, [0, 92, -150]], [1, [0, 78, -150]]]), 62, lerp(0.07, 0.0, u));
  } else if (t < EV.cuts[1]) {
    const u = (t - EV.cuts[0]) / (EV.cuts[1] - EV.cuts[0]);
    setCam(kf(u, [[0, [3.6, 0.6, -68]], [1, [3.1, 0.75, -71]]], linear), [-0.6, 3.6, -92], 46, 0, shake(t, 0.3, 9));
  } else if (t < EV.cuts[2]) {
    const u = (t - EV.cuts[1]) / (EV.cuts[2] - EV.cuts[1]);
    setCam(kf(u, [[0, [18, 12, -71]], [1, [15.5, 13, -75]]], linear), [9.5, 15.5, -87], 34, -0.05);
  } else {
    const u = (t - EV.cuts[2]) / (6 - EV.cuts[2]);
    const pos = kf(u, [[0, [62, 42, -18]], [0.55, [26, 86, -82]], [1, [13, 104, -114]]], easeInOut);
    const tgt = kf(u, [[0, [0, 62, -150]], [0.5, [-3, 96, -155]], [1, [-6, 182, -160]]], easeInOut);
    setCam(pos, tgt, 56, lerp(-0.04, 0.02, u));
  }
  camera.far = 6000; camera.near = 0.3; camera.updateProjectionMatrix();
  return K.scene;
}

// ============ Floresta (cenas 2 e 3) ============
const px = z => Math.sin(z * 0.06) * 1.4;
const F = new THREE.Scene();
const forest = buildForest({ seed: 3, keepOut: (x, z) => Math.abs(x - px(z)) < 2.4, area: [-30, 30, -80, 24], count: 165, groundSize: 200, center: [0, -30], withMist: 70, mistArea: [-24, 24, -60, 15] });
F.add(forest.group);
const FL = forestLights(F, { moon: 1.5, hemi: 1.0, shadowCenter: V(0, 0, -5), shadowSize: 22 });
const fSoldiers = [];
for (let i = 0; i < 6; i++) {
  const s = makeSoldier(100 + i, { cape: 0x5a1a1e });
  s.z0 = -(Math.floor(i / 2)) * 2.0 - (i % 2) * 0.6; s.side = i % 2 ? 0.7 : -0.7;
  useEnv(s.root, 0.35); F.add(s.root); fSoldiers.push(s);
}
const creature = makeCreature(); F.add(creature);
const fEyes = makeEyes(F, [
  [-8, 1.3, -4, 0.1, 1.0], [-11, 0.8, -7, 0.9, 1.0], [-7.5, 2.1, -8.5, 1.7, 0.8], [-13, 1.6, -2.5, 2.3, 1.2], [-10, 0.6, -10, 1.2, 0.8],
  [7, 1.4, -12, 0.5, -0.5], [9, 0.9, -18, 1.4, -0.4], [6, 2.0, -24, 2.0, -0.3], [-5, 1.0, -28, 0.7, 0], [5, 1.2, 2, 1.1, -2.5], [-6, 1.8, -3, 2.6, 2.4],
]);
const arthur = makeArthur(); F.add(arthur.root);
// raio de luz
function shaftTex() {
  const c = document.createElement('canvas'); c.width = 256; c.height = 256; const x = c.getContext('2d');
  const r = rng(5);
  for (let i = 0; i < 40; i++) { const xx = r() * 256, w = 4 + r() * 18; const g = x.createLinearGradient(0, 0, 0, 256); g.addColorStop(0, `rgba(255,255,255,${0.15 + r() * 0.35})`); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(xx, 0, w, 256); }
  const t = new THREE.CanvasTexture(c); return t;
}
const SHAFT_Z = -3.0;
const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 1.6, 14, 32, 1, true),
  new THREE.MeshBasicMaterial({ map: shaftTex(), color: 0xcfeee6, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false }));
shaft.position.set(px(SHAFT_Z) + 0.9, 6.8, SHAFT_Z); shaft.rotation.z = -0.12; F.add(shaft);
const spot = new THREE.SpotLight(0xd8f4ee, 0, 22, 0.22, 0.6, 1.2); spot.position.set(px(SHAFT_Z) + 1.75, 13.6, SHAFT_Z); spot.target.position.set(px(SHAFT_Z), 0, SHAFT_Z); F.add(spot, spot.target);
const motes = particles(160, 0xdff6f0, 0.035, { opacity: 0.9 }); F.add(motes);
const moteR = rng(77); const moteSeed = Array.from({ length: 160 }, () => [moteR(), moteR(), moteR(), moteR()]);

function forestCommon(t) {
  animateMist(forest.mist, t);
  camera.far = 400; camera.near = 0.03; camera.updateProjectionMatrix();
}

function scene2(t) {
  const tau = t - 6;
  forestCommon(t);
  arthur.root.visible = false; shaft.visible = false; motes.visible = false; spot.intensity = 0;
  const zc = -2 - 1.3 * tau;
  fSoldiers.forEach((s, i) => {
    s.root.visible = true;
    const z = zc + s.z0; s.root.position.set(px(z) + s.side, 0, z); s.root.rotation.y = Math.PI;
    soldierPose(s, tau * Math.PI * 2 * 0.85 + i);
    s.head.rotation.y = Math.sin(tau * 1.3 + i * 2) * 0.5 * sstep(2, 3, tau);
  });
  creature.visible = true;
  if (tau < 5.0) {
    const u = clamp((tau - 3.4) / 1.8);
    creature.position.set(lerp(-15, -9, u), 0, lerp(-1, -12, u)); creature.rotation.y = -1.1;
  } else {
    const u = clamp((tau - 5.0) / 2.0);
    creature.position.set(lerp(11, -7, u), 0, lerp(zc - 22, zc - 26, u)); creature.rotation.y = Math.PI + 0.2;
  }
  animateCreature(creature, t);
  animateEyes(fEyes, t, clamp((tau - 0.5) / 2));
  F.fog.density = 0.05 + sstep(5.8, 7, tau) * 0.06;
  const last = zc + fSoldiers[5].z0;
  if (t < EV.cuts[3]) {
    const u = tau / 3.6;
    setCam([px(zc) + 0.9, 0.45, zc + 6.6 - u * 0.6], [px(zc) - 0.2, 2.1, zc - 7], 56, 0.03, shake(t, 0.25, 3));
  } else if (t < EV.cuts[4]) {
    const u = (t - EV.cuts[3]) / (EV.cuts[4] - EV.cuts[3]);
    setCam([lerp(1.2, 0.7, u), 1.5, lerp(1.4, 0.6, u)], [-10, 1.25, -5.5], 44, 0, shake(t, 0.15, 2));
  } else {
    const u = (t - EV.cuts[4]) / (13 - EV.cuts[4]);
    setCam([px(last) + 1.7 - u * 0.3, 0.32, last + 2.6], [px(last) - 0.6, 2.5, last - 8], 50, -0.06, shake(t, 0.3, 3));
  }
  F.fog.color.set(FOREST.fog);
  return F;
}

function arthurWalkPose(h, tau, phaseSpeed = 0.9, amt = 1) {
  resetPose(h); walk(h, tau * Math.PI * 2 * phaseSpeed, amt);
  if (h.scarfTail) h.scarfTail.rotation.x = 0.1 + Math.sin(tau * 5.6) * 0.12;
}

function scene3(t) {
  const tau = t - 13;
  forestCommon(t);
  fSoldiers.forEach(s => (s.root.visible = false));
  creature.visible = false;
  animateEyes(fEyes, t, 0.4);
  F.fog.density = 0.05 + (1 - sstep(0, 1.0, tau)) * 0.06;
  arthur.root.visible = true;
  const z = 4 - 1.05 * tau;
  arthur.root.position.set(px(z), 0, z);
  arthur.root.rotation.y = Math.PI + Math.atan(Math.cos(z * 0.06) * 0.084);
  arthurWalkPose(arthur, tau);
  const glance = kf(tau, [[0, 0], [0.8, 0], [1.1, -1], [1.7, -1], [2.0, 0.9], [2.6, 0.9], [2.9, 0], [6.8, 0]]);
  const up = kf(tau, [[0, 0], [6.6, 0], [7.4, 1], [8, 1]]);
  arthur.head.rotation.y = -glance * 0.28;
  arthur.head.rotation.x = -up * 0.45 + 0.05;
  const blink = Math.max(sstep(0.95, 1.0, tau) * (1 - sstep(1.05, 1.12, tau)), sstep(2.95, 3.0, tau) * (1 - sstep(3.05, 3.12, tau)), sstep(5.0, 5.05, tau) * (1 - sstep(5.1, 5.17, tau)));
  arthurFace(arthur, { look: [glance, up * 0.8], blink, worry: lerp(0.8, 0.45, up), awe: up * 0.35 });
  arthur.torso.scale.set(1, 1 + Math.sin(tau * 4.2) * 0.012, 1);
  // raio de luz
  const L = sstep(5.6, 6.6, tau);
  shaft.visible = true; motes.visible = true;
  shaft.material.opacity = L * 0.55; spot.intensity = L * 260;
  shaft.material.map.offset.x = tau * 0.01;
  const mp = motes.geometry.attributes.position;
  moteSeed.forEach(([a, b, c, d], i) => {
    const y = ((b * 12 + tau * (0.15 + d * 0.2)) % 12);
    const rr = lerp(0.3, 1.5, 1 - y / 12) * Math.sqrt(a);
    mp.setXYZ(i, shaft.position.x + Math.cos(c * 6.28 + tau * 0.3) * rr - 0.12 * (y - 6) * 0.9, y, SHAFT_Z + Math.sin(c * 6.28 + tau * 0.3) * rr);
  });
  mp.needsUpdate = true; motes.material.opacity = L * 0.9;
  const head = wp(arthur.head);
  if (t < EV.cuts[5]) {
    const u = tau / 3.2;
    const d = lerp(1.05, 1.2, u);
    setCam([head.x + 0.2, head.y + 0.12, head.z - d], [head.x, head.y + 0.08, head.z], 36, 0.02, shake(t, 0.12, 2.5));
  } else if (t < EV.cuts[6]) {
    setCam([arthur.root.position.x - 1.7, 0.32, z - 0.7], [arthur.root.position.x, 0.28, z - 0.1], 42, 0, shake(t, 0.1, 3));
  } else {
    const u = (t - EV.cuts[6]) / (21 - EV.cuts[6]);
    setCam([px(-6) + lerp(2.6, 2.1, u), lerp(0.75, 0.9, u), lerp(-7.6, -7.2, u)], [arthur.root.position.x, 1.45 + u * 0.6, z], 46, 0.03);
  }
  return F;
}

// ============ Clareira (cenas 4 e 5) ============
const C = new THREE.Scene();
const clearing = buildForest({ seed: 9, keepOut: (x, z) => Math.hypot(x, z + 1) < 10.5, area: [-34, 34, -36, 32], count: 120, groundSize: 120, withMist: 45, mistArea: [-22, 22, -24, 20] });
C.add(clearing.group);
const CL = forestLights(C, { moon: 1.6, hemi: 1.0, shadowCenter: V(0, 0, -1), shadowSize: 14 });
C.fog.density = 0.042;
// altar
const altar = new THREE.Group(); altar.position.set(0, 0, -6); C.add(altar);
const stoneM = std(0x56605c, 0.95, 0, { flatShading: true });
const a1 = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.62, 1.2), stoneM); a1.position.y = 0.31; altar.add(a1);
const a2 = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.32, 0.82), stoneM); a2.position.y = 0.78; altar.add(a2);
const a0 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.18, 1.9), stoneM); a0.position.y = 0.05; altar.add(a0);
const moss = std(0x2c5a46, 1);
for (const [x, z, s] of [[-0.6, 0.45, 0.25], [0.7, -0.3, 0.3], [0.2, 0.62, 0.18]]) { const m = new THREE.Mesh(new THREE.SphereGeometry(s, 8, 6), moss); m.scale.y = 0.35; m.position.set(x, 0.62, z); altar.add(m); }
const runeMat = new THREE.MeshBasicMaterial({ color: 0x5fe0cc, transparent: true, opacity: 0.35 });
for (let i = 0; i < 5; i++) { const r = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.18, 0.01), runeMat); r.position.set(-0.5 + i * 0.25, 0.32, 0.605); r.rotation.z = (i % 2 ? 0.3 : -0.25); altar.add(r); }
altar.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
const SWORD_HOME = V(0, 1.18, -6);
const sword = makeExcalion(); useEnv(sword, 1.2); C.add(sword);
// tronco caído e pedra
const KDIR = Math.atan2(0.47, 0.88);
const log = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.33, 4.2, 12), std(0x2b2a24, 0.95));
log.rotation.z = Math.PI / 2; log.rotation.y = KDIR + Math.PI / 2; log.position.set(0.75, 0.25, 2.0); log.castShadow = log.receiveShadow = true; C.add(log);
const bigRock = new THREE.Mesh(new THREE.DodecahedronGeometry(1.1, 0), std(0x3c4644, 0.95, 0, { flatShading: true }));
bigRock.position.set(-3.6, 0.4, 0.6); bigRock.scale.set(1, 0.8, 1); bigRock.castShadow = bigRock.receiveShadow = true; C.add(bigRock);
const knight = makeKnight(); useEnv(knight.root, 0.6); C.add(knight.root);
const redLight = new THREE.PointLight(0xff2a14, 0, 8, 1.5); C.add(redLight);
const arthur2 = makeArthur(); C.add(arthur2.root);
// partículas
const sparks = particles(80, 0xffe2b0, 0.06); C.add(sparks);
const sparkR = rng(3); const sparkSeed = Array.from({ length: 80 }, () => [sparkR() - 0.5, sparkR(), sparkR() - 0.5, sparkR()]);
const debris = particles(140, 0x2a3a34, 0.09, { additive: false, opacity: 0.9 }); C.add(debris);
const dust = particles(1600, 0x070707, 0.11, { additive: false, opacity: 0.85 }); C.add(dust);
const embers = particles(260, 0xff3418, 0.05); C.add(embers);
const dR = rng(8); const dustSeed = Array.from({ length: 1600 }, () => [dR(), dR(), dR(), dR(), dR()]);
const gold = particles(1400, 0xffc456, 0.07); C.add(gold);
const gR = rng(12); const goldSeed = Array.from({ length: 1400 }, () => { const th = gR() * 6.283, ph = Math.acos(2 * gR() - 1); return [Math.sin(ph) * Math.cos(th), Math.abs(Math.cos(ph)) * 0.8 + 0.1, Math.sin(ph) * Math.sin(th), gR(), gR()]; });
const burstLight = new THREE.PointLight(0xffc04a, 0, 40, 1.2); burstLight.position.set(0, 1.6, -5.6); C.add(burstLight);
const burstBall = glowSprite(0xffd27a, 1, 0); burstBall.position.set(0, 1.6, -5.6); burstBall.material.fog = false; C.add(burstBall);
const ring = new THREE.Mesh(new THREE.RingGeometry(0.9, 1.0, 64), new THREE.MeshBasicMaterial({ color: 0xffd47a, transparent: true, opacity: 0, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
ring.rotation.x = -Math.PI / 2; ring.position.set(0, 0.3, -5.6); C.add(ring);

function knightBase(h) {
  resetPose(h);
  h.shL.rotation.z = -0.25; h.shR.rotation.z = 0.2; h.shR.rotation.x = -0.35; h.elR.rotation.x = -0.6; h.handR.rotation.x = -0.4;
  h.elL.rotation.x = -0.3; h.hipL.rotation.x = -0.12; h.hipR.rotation.x = 0.1; h.knL.rotation.x = 0.15; h.knR.rotation.x = 0.1;
}
const KN_START = V(0, 0, -1.2);
function knightAt(t) {
  const h = knight;
  knightBase(h);
  h.root.visible = true;
  let pos = KN_START.clone(), rotY = 0;
  // respiração
  h.torso.rotation.x = Math.sin(t * 2.2) * 0.03;
  // cabeça erguendo
  h.head.rotation.x = kf(t, [[21, 0.45], [21.25, 0.45], [21.9, -0.05]]);
  // passos à frente
  const stepU = clamp((t - 22.45) / 0.85);
  pos.z = lerp(KN_START.z, 0.3, easeInOut(stepU));
  if (stepU > 0 && stepU < 1) walk(h, stepU * Math.PI * 2, 0.8);
  // golpe horizontal
  if (t > 22.9 && t < 24.1) {
    const r = kf(t, [[22.9, 0], [23.4, 1], [23.55, 1], [23.9, 2], [24.1, 2]]);
    const k = r <= 1 ? easeInOut(r) : 1;
    h.shR.rotation.x = lerp(-0.35, -1.3, k);
    h.shR.rotation.z = lerp(0.2, 0.9, k);
    h.handR.rotation.x = lerp(-0.4, -1.55, k);
    h.torso.rotation.y = r <= 1 ? lerp(0, 1.2, k) : lerp(1.2, -1.15, easeOut(r - 1));
    if (r > 1) h.shR.rotation.z = lerp(0.9, 0.1, easeOut(r - 1));
  }
  // golpe de cima para baixo
  if (t >= 24.1 && t < 25.6) {
    const up = sstep(24.1, 24.5, t), down = easeIn(clamp((t - 24.55) / 0.2)), rec = sstep(25.0, 25.6, t);
    h.torso.rotation.y = lerp(-1.15, 0, sstep(24.1, 24.4, t));
    h.shR.rotation.x = lerp(lerp(-1.3, -2.95, up), -0.83, down);
    h.shR.rotation.x = lerp(h.shR.rotation.x, -0.5, rec);
    h.handR.rotation.x = -1.55;
    h.torso.rotation.x = down * 0.3 * (1 - rec);
    h.shL.rotation.x = lerp(0, -2.2, up) * (1 - down);
  }
  // investida e tropeço
  const dir = V(Math.sin(KDIR), 0, Math.cos(KDIR));
  if (t >= 25.6) {
    rotY = lerp(0, KDIR, sstep(25.5, 25.8, t));
    const run = clamp((t - 25.7) / 0.7);
    pos = V(0, 0, 0.3).add(dir.clone().multiplyScalar(1.55 * run));
    if (t < 26.4) { walk(h, (t - 25.7) * 9, 1, 1); h.shR.rotation.x = -0.9; h.handR.rotation.x = -1.0; }
    const fall = clamp((t - 26.4) / 0.45);
    if (fall > 0) {
      pos.add(dir.clone().multiplyScalar(1.7 * easeOut(fall)));
      h.pivot.rotation.x = easeIn(fall) * 1.42;
      h.hipL.rotation.x = -0.3 * fall; h.hipR.rotation.x = 0.5 * fall;
      h.shL.rotation.x = -1.6 * fall; h.shR.rotation.x = -1.8 * fall; h.handR.rotation.x = -0.4;
    }
    const rise = sstep(26.95, 27.5, t);
    if (rise > 0) {
      h.pivot.rotation.x = lerp(1.42, 0.25, rise);
      h.body.position.y = -0.55 - 0.42 * rise;
      h.hipL.rotation.x = lerp(-0.3, -1.5, rise); h.knL.rotation.x = lerp(0, 1.6, rise);
      h.hipR.rotation.x = lerp(0.5, 0.2, rise); h.knR.rotation.x = lerp(0, 1.9, rise);
      h.shL.rotation.x = lerp(-1.6, -0.3, rise); h.shR.rotation.x = lerp(-1.8, -0.9, rise);
      h.head.rotation.x = lerp(0, -0.35, sstep(27.0, 27.3, t)) + Math.sin(t * 30) * 0.02 * rise;
    }
  }
  h.root.position.copy(pos); h.root.rotation.y = rotY;
  // capa
  h.cape.rotation.x = 0.1 + Math.sin(t * 3) * 0.05 + (t > 25.7 && t < 26.4 ? 0.5 : 0);
  // olho
  const eyeK = sstep(EV.eyeOn - 0.1, EV.eyeOn + 0.4, t) * (1 - sstep(27.9, 28.5, t)) * (t > 27.2 && t < 27.9 ? (0.6 + 0.4 * Math.sin(t * 50)) : 1);
  h.eyeMat.color.setRGB(0.15 + eyeK * 0.85, 0.02 + eyeK * 0.08, 0.02);
  h.eyeGlow.material.opacity = eyeK; h.eyeGlow.scale.setScalar(0.25 + eyeK * 0.25);
  redLight.position.copy(wp(h.eye)); redLight.intensity = eyeK * 3;
  // dissolução
  const diss = sstep(EV.dissolve, EV.dissolve + 1.0, t);
  h.armorMats.forEach(m => { m.transparent = diss > 0; m.opacity = 1 - diss; m.depthWrite = diss < 0.5; });
  h.root.visible = diss < 0.999;
  return { pos, dir };
}

function arthurInFight(t) {
  const h = arthur2; resetPose(h); arthurFace(h, { look: [0, 0.6], worry: 0.75 });
  h.root.visible = true;
  let pos = V(0, 0, 4.4), rotY = Math.PI;
  // guarda
  h.hipL.rotation.x = -0.35; h.knL.rotation.x = 0.55; h.hipR.rotation.x = 0.2; h.knR.rotation.x = 0.45; h.body.position.y = -0.6;
  h.shL.rotation.x = -0.6; h.elL.rotation.x = -1.3; h.shR.rotation.x = -0.5; h.elR.rotation.x = -1.3;
  h.torso.rotation.x = 0.15 + Math.sin(t * 5) * 0.02;
  // abaixar (desvio)
  const duck = sstep(23.45, 23.65, t) * (1 - sstep(23.95, 24.2, t));
  if (duck > 0) {
    h.body.position.y = -0.6 - 0.42 * duck; h.hipL.rotation.x = lerp(-0.35, -1.5, duck); h.knL.rotation.x = lerp(0.55, 2.0, duck);
    h.hipR.rotation.x = lerp(0.2, -0.9, duck); h.knR.rotation.x = lerp(0.45, 2.1, duck); h.torso.rotation.x = lerp(0.15, 0.75, duck);
    h.shL.rotation.x = lerp(-0.6, -1.6, duck); h.shR.rotation.x = lerp(-0.5, -1.6, duck);
  }
  // rolar para o lado
  const roll = clamp((t - EV.roll) / 0.75);
  const side = V(1, 0, 0);
  if (roll > 0) {
    const ru = easeInOut(roll);
    pos.add(side.clone().multiplyScalar(1.7 * ru)); pos.z -= 0.6 * ru;
    if (roll < 1) {
      const curl = Math.sin(roll * Math.PI);
      h.pivot.rotation.z = -ru * Math.PI * 2; h.pivot.position.y = 0.55 - 0.15 * curl;
      h.hipL.rotation.x = h.hipR.rotation.x = -1.9 * curl; h.knL.rotation.x = h.knR.rotation.x = 2.2 * curl;
      h.shL.rotation.x = h.shR.rotation.x = -1.4 * curl; h.torso.rotation.x = 0.6 * curl;
    }
  }
  // esquiva da investida
  const dodge = clamp((t - 26.15) / 0.35);
  if (dodge > 0) {
    pos.add(V(1.5 * easeOut(dodge), 0, -0.4 * easeOut(dodge)));
    h.pivot.rotation.z = (t < 26.6 ? Math.sin(dodge * Math.PI) * 0.35 : 0);
  }
  // encara o cavaleiro caído, ofegante
  const kpos = knightPos;
  if (t > 25.2) rotY = Math.atan2(kpos.x - pos.x, kpos.z - pos.z) * sstep(25.2, 25.5, t) + Math.PI * (1 - sstep(25.2, 25.5, t));
  if (t > 27.0) { h.torso.rotation.x = 0.2 + Math.sin(t * 7) * 0.05; arthurFace(h, { look: [0, 0.2], worry: 0.5, awe: sstep(27.6, 28.2, t) * 0.5 }); }
  h.root.position.copy(pos); h.root.rotation.y = rotY;
  h.scarfTail.rotation.x = 0.2 + Math.sin(t * 6) * 0.15;
}
let knightPos = V();

function burstParticles(sys, seeds, t0, t, fn) {
  const p = sys.geometry.attributes.position;
  seeds.forEach((s, i) => { const r = fn(s, t - t0, i); p.setXYZ(i, r[0], r[1], r[2]); });
  p.needsUpdate = true;
}

function scene4(t) {
  animateMist(clearing.mist, t);
  camera.far = 300; camera.near = 0.03; camera.updateProjectionMatrix();
  C.fog.density = 0.042;
  CL.hl.intensity = 1.0; CL.dl.intensity = 1.6; CL.dl.color.set(0xa6dbe0); burstLight.intensity = 0; burstBall.material.opacity = 0; ring.material.opacity = 0; gold.visible = false;
  sword.position.copy(SWORD_HOME); sword.rotation.set(Math.PI, 0, 0); swordGlow(sword, 0.05);
  const k = knightAt(t); knightPos = k.pos;
  arthurInFight(t);
  // faíscas no choque com a pedra
  sparks.visible = t > EV.clash && t < EV.clash + 0.7;
  if (sparks.visible) burstParticles(sparks, sparkSeed, EV.clash, t, (s, dt) => [-2.7 + s[0] * 0.2 + s[0] * dt * 6, 1.4 + s[1] * dt * 5 - 6 * dt * dt, 0.9 + s[2] * dt * 6]);
  sparks.material.opacity = 1 - (t - EV.clash) / 0.7;
  // detritos do golpe no chão / queda
  const dT = t > EV.crash ? EV.crash : EV.slam;
  const hitP = t > EV.crash ? V(knightPos.x + Math.sin(KDIR) * 1.2, 0, knightPos.z + Math.cos(KDIR) * 1.2) : V(0.4, 0, 3.4);
  debris.visible = (t > EV.slam && t < EV.slam + 1.0) || (t > EV.crash && t < EV.crash + 1.0);
  if (debris.visible) burstParticles(debris, dustSeed.slice(0, 140), dT, t, (s, dt) => [hitP.x + (s[0] - 0.5) * dt * 5, Math.max(0, s[1] * dt * 6 - 9 * dt * dt), hitP.z + (s[2] - 0.5) * dt * 5]);
  // poeira negra
  const ds = t - EV.dissolve;
  dust.visible = ds > 0; embers.visible = ds > 0;
  if (ds > 0) {
    const base = knightPos;
    const fn = (s, dt) => {
      const h0 = s[1] * 2.4; const st = (1 - s[1]) * 0.6;
      const e = dt - st;
      if (e < 0) return [0, -50, 0];
      const sw = e * (0.8 + s[3]);
      return [base.x + (s[0] - 0.5) * 1.1 + Math.sin(e * 2 + s[4] * 6) * sw * 0.8 + e * 0.6, h0 + 0.2 + e * (1.2 + s[2] * 1.5), base.z + (s[2] - 0.5) * 1.0 + Math.cos(e * 2 + s[4] * 6) * sw * 0.8];
    };
    burstParticles(dust, dustSeed, EV.dissolve, t, fn);
    burstParticles(embers, dustSeed.slice(0, 260), EV.dissolve, t, (s, dt) => fn([s[4], s[1], s[2], s[3], s[0]], dt * 0.8));
    dust.material.opacity = 0.85 * (1 - sstep(1.0, 1.4, ds)); embers.material.opacity = 1 - sstep(0.8, 1.4, ds);
  }
  // câmeras
  let shk = [0, 0];
  const imp = (te, a, d = 0.45) => (t > te ? a * Math.exp(-(t - te) / d * 3) : 0);
  const amp = imp(EV.clash, 1.2, 0.4) + imp(EV.slam, 2.2) + imp(EV.crash, 2.0) + EV.knightSteps.reduce((s, x) => s + imp(x, 0.6, 0.3), 0);
  shk = shake(t, amp, 26);
  if (t < EV.cuts[7]) {
    const u = (t - 21) / 1.5;
    setCam([lerp(0.9, 0.7, u), lerp(0.3, 0.42, u), lerp(2.5, 2.1, u)], [0, lerp(2.6, 3.1, u), -1.2], 52, 0.04, shk);
  } else if (t < EV.cuts[8]) {
    const u = (t - EV.cuts[7]) / (EV.cuts[8] - EV.cuts[7]);
    setCam([lerp(11.5, 10.8, u), 1.5, lerp(2.6, 2.3, u)], [0, 1.5, 2.3], 46, 0, shk);
  } else if (t < EV.cuts[9]) {
    const u = (t - EV.cuts[8]) / (EV.cuts[9] - EV.cuts[8]);
    setCam([lerp(-3.4, -3.0, u), 0.55, lerp(7.0, 6.6, u)], [0.4, 1.7, 1.8], 50, -0.05, shk);
  } else if (t < EV.cuts[10]) {
    const u = (t - EV.cuts[9]) / (EV.cuts[10] - EV.cuts[9]);
    setCam([lerp(-4.6, -3.6, u), 1.0, lerp(2.4, 3.6, u)], [knightPos.x * 0.5 + 0.6, 1.2, knightPos.z * 0.5 + 1.6], 48, 0, shk);
  } else {
    const u = (t - EV.cuts[10]) / (29 - EV.cuts[10]);
    setCam([lerp(-1.8, -1.4, u), 0.75, lerp(6.6, 6.2, u)], [knightPos.x, 1.3, knightPos.z], 44, 0.03, shk);
  }
  return C;
}

// pose do braço para pegar a espada
function reachPose(h, tau) {
  const reach = sstep(3.5, 4.4, tau);
  h.shR.rotation.x = lerp(h.shR.rotation.x, -1.15, reach);
  h.shR.rotation.z = lerp(h.shR.rotation.z, -0.32, reach);
  h.elR.rotation.x = lerp(h.elR.rotation.x, -0.45, reach);
  const pull = easeIn(clamp((tau - 5.6) / 1.4));
  h.shR.rotation.x -= pull * 1.0; h.elR.rotation.x -= pull * 0.25;
  const raise = sstep(7.05, 7.9, tau);
  h.shR.rotation.x = lerp(h.shR.rotation.x, -2.25, raise); h.elR.rotation.x = lerp(h.elR.rotation.x, -0.5, raise); h.shR.rotation.z = lerp(h.shR.rotation.z, 0.1, raise);
}
const ARTHUR5_END = V(0.08, 0, -5.42);
function arthurAltarPose(tau) {
  const h = arthur2; resetPose(h);
  const wu = clamp(tau / 3.3);
  const start = V(0.35, 0, -2.4);
  const pos = start.clone().lerp(ARTHUR5_END, easeOut(wu));
  if (wu < 1) walk(h, tau * Math.PI * 2 * 0.75, 1 - sstep(2.6, 3.3, tau));
  h.root.position.copy(pos); h.root.rotation.y = Math.PI;
  reachPose(h, tau);
  h.torso.scale.set(1, 1 + sstep(4.2, 4.8, tau) * 0.03 * (1 - sstep(5.2, 5.6, tau)), 1);
  h.torso.rotation.x = 0.08 + sstep(3.5, 4.4, tau) * 0.12 - sstep(7.0, 7.5, tau) * 0.2;
  h.head.rotation.x = 0.25 * sstep(2.5, 3.5, tau) - sstep(7.0, 7.6, tau) * 0.5;
  h.scarfTail.rotation.x = 0.1 + Math.sin(tau * 4) * 0.1 + sstep(7.0, 7.2, tau) * 0.6 * (1 - sstep(7.5, 9, tau));
  const awe = sstep(6.9, 7.3, tau);
  arthurFace(h, { look: [0, -0.3 - awe * 0.4], worry: 0.4 * (1 - awe), awe, blink: sstep(4.5, 4.6, tau) * (1 - sstep(4.7, 4.8, tau)) });
  h.root.updateMatrixWorld(true);
  return h;
}
let gripOffset = null;
function computeGrip() {
  const h = arthurAltarPose(4.4);
  const hand = wp(h.handR);
  // espada invertida (lâmina para baixo): o cabo fica 0,07 acima da origem
  gripOffset = hand.clone().sub(SWORD_HOME.clone().add(V(0, 0.07, 0)));
}

function scene5(t) {
  const tau = t - 29;
  animateMist(clearing.mist, t);
  camera.far = 300; camera.near = 0.02; camera.updateProjectionMatrix();
  knight.root.visible = false; redLight.intensity = 0; dust.visible = embers.visible = sparks.visible = debris.visible = false;
  if (!gripOffset) computeGrip();
  const h = arthurAltarPose(tau);
  h.root.visible = true;
  // espada
  const hand = wp(h.handR);
  const flip = sstep(7.05, 7.9, tau);
  sword.rotation.set(Math.PI * (1 - flip), 0, 0);
  if (tau < 4.4) { sword.position.copy(SWORD_HOME); }
  else {
    const gripLocal = V(0, -0.07, 0).applyEuler(sword.rotation);
    sword.position.copy(hand).sub(gripLocal).sub(gripOffset.clone().multiplyScalar(1 - flip));
    sword.position.y = Math.max(sword.position.y, SWORD_HOME.y);
  }
  const pre = sstep(3.0, 7.0, tau) * (0.25 + 0.15 * Math.sin(tau * 9));
  const post = tau >= 7 ? 1 : 0;
  swordGlow(sword, Math.max(0.05, pre + post * (0.9 + 0.1 * Math.sin(tau * 13))), post * 0.15 * Math.sin(tau * 21));
  runeMat.opacity = 0.35 + sstep(3, 7, tau) * 0.5;
  // explosão de luz
  const b = tau - 7.0;
  if (b > 0) {
    const bp = wp(sword).add(V(0, 0.4, 0));
    burstLight.position.copy(bp); burstBall.position.copy(bp);
    burstLight.intensity = 400 * Math.exp(-b * 1.8) + 3;
    burstBall.material.opacity = Math.exp(-b * 1.8); burstBall.scale.setScalar(1.5 + b * 22);
    ring.material.opacity = Math.max(0, 0.9 - b * 0.7); ring.scale.setScalar(0.5 + b * 16);
    gold.visible = true;
    burstParticles(gold, goldSeed, 36, t, (s, dt) => {
      const sp = 4 + s[3] * 9; const d = sp * (1 - Math.exp(-dt * 2.2)) / 2.2 * 2;
      return [bp.x + s[0] * d + Math.sin(dt + s[4] * 6) * 0.2, Math.max(0.05, bp.y + s[1] * d * 0.6 - 0.3 * dt * dt * s[4] + Math.sin(dt * 2 + s[3] * 9) * 0.1), bp.z + s[2] * d];
    });
    gold.material.opacity = 1 - sstep(1.5, 3.0, b) * 0.6;
    const gk = Math.exp(-b * 1.2);
    CL.dl.color.setRGB(lerp(0.65, 1.0, gk), lerp(0.86, 0.78, gk), lerp(0.88, 0.4, gk));
    CL.hl.intensity = 0.85 + gk * 1.5;
    C.fog.density = 0.042 * (1 - gk * 0.5);
  } else {
    burstLight.intensity = 0; burstBall.material.opacity = 0; ring.material.opacity = 0; gold.visible = false;
    CL.dl.color.set(0xa6dbe0); CL.hl.intensity = 1.0 - sstep(0, 3, tau) * 0.25; C.fog.density = 0.042;
  }
  // câmeras
  const imp = (te, a, d = 0.6) => (t > te ? a * Math.exp(-(t - te) / d * 3) : 0);
  const shk = shake(t, imp(EV.burst, 2.4, 1.0) + (tau > 5.6 && tau < 7 ? 0.25 : 0), 22);
  const head = wp(h.head);
  if (t < EV.cuts[11]) {
    const u = tau / 3.4;
    setCam(kf(u, [[0, [1.9, 1.35, 0.6]], [1, [0.95, 1.38, -2.9]]], linear), [0, 1.15, -6], lerp(46, 40, u), 0.02);
  } else if (t < EV.cuts[12]) {
    const u = (t - EV.cuts[11]) / (EV.cuts[12] - EV.cuts[11]);
    setCam([lerp(0.8, 0.7, u), lerp(1.3, 1.34, u), lerp(-7.45, -7.3, u)], [0.02, 1.38, -5.6], 36, -0.02);
  } else if (t < EV.burst) {
    const u = (t - EV.cuts[12]) / (EV.burst - EV.cuts[12]);
    setCam([lerp(1.1, 0.95, u), lerp(0.55, 0.6, u), lerp(-8.0, -7.6, u)], [0, 1.45 + u * 0.3, -5.6], 44, 0.03, shk);
  } else if (t < EV.cuts[13]) {
    const u = easeOut((t - EV.burst) / (EV.cuts[13] - EV.burst));
    setCam([lerp(0.7, 2.8, u), lerp(1.3, 3.0, u), lerp(-7.4, -13.0, u)], [0, 1.6, -5.4], lerp(44, 52, u), 0, shk);
  } else {
    const u = (t - EV.cuts[13]) / (39 - EV.cuts[13]);
    setCam([head.x - 0.25, head.y + 0.1, head.z - lerp(1.25, 1.1, u)], [head.x, head.y + 0.02, head.z], 38, -0.03, shake(t, 0.1, 3));
  }
  return C;
}

// ============ Cena 6: o despertar ============
const R = buildRidge();
const arthur3 = makeArthur(); R.scene.add(arthur3.root);
const sword3 = makeExcalion(); useEnv(sword3, 1.2); R.scene.add(sword3);
const ROCK_Y = 1.32;
function scene6(t) {
  const tau = t - 39;
  camera.far = 3500; camera.near = 0.05; camera.updateProjectionMatrix();
  const h = arthur3; resetPose(h);
  h.root.position.set(0, ROCK_Y, 0); h.root.rotation.y = Math.PI + 0.35;
  h.shR.rotation.x = -1.0; h.shR.rotation.z = -0.35; h.elR.rotation.x = -0.9;
  h.shL.rotation.x = -0.9; h.shL.rotation.z = 0.25; h.elL.rotation.x = -1.0;
  h.torso.rotation.x = 0.05 + Math.sin(tau * 3.5) * 0.015;
  const turn = sstep(2.2, 4.2, tau);
  h.head.rotation.x = lerp(0.42, -0.12, turn);
  h.head.rotation.y = lerp(0.2, -0.38, turn);
  arthurFace(h, { look: [lerp(0.3, -0.8, turn), lerp(-0.7, 0.3, turn)], worry: lerp(0.1, 0.9, turn), awe: turn * 0.3 });
  h.scarfTail.rotation.x = 0.15 + Math.sin(tau * 3) * 0.2;
  h.root.updateMatrixWorld(true);
  const hand = wp(h.handR);
  sword3.position.copy(hand); sword3.rotation.set(-0.15, 0.35, 0.18);
  swordGlow(sword3, 0.85 + 0.12 * Math.sin(tau * 11), 0.1 * Math.sin(tau * 17));
  // sombra se ergue
  const rise = easeOut(clamp((tau - 0.3) / 4.2));
  R.shadow.position.y = lerp(-230, 40, rise);
  const eye = sstep(2.7, 3.2, tau);
  R.eyeM.opacity = eye; R.eyes.forEach(g => (g.material.opacity = eye * (0.85 + 0.15 * Math.sin(tau * 9))));
  // escurecer
  const dark = sstep(0.8, 4.5, tau);
  R.hl.intensity = lerp(0.9, 0.22, dark); R.dl.intensity = lerp(1.1, 0.15, dark);
  R.sky.material.uniforms.horizon.value.set(0x3d7470).lerp(new THREE.Color(0x1a2e30), dark * 0.7);
  R.sky.material.uniforms.mid.value.set(0x163a3e).lerp(new THREE.Color(0x0a1618), dark * 0.7);
  R.scene.fog.color.set(0x123236).lerp(new THREE.Color(0x081517), dark);
  R.mist.forEach(m => { m.position.x = m.userData.base.x + tau * m.userData.sp * 2; });
  // câmeras
  const end = EV.end - 39;
  if (tau < 3.8) {
    const u = tau / 3.8;
    setCam([lerp(0.55, 0.45, u), lerp(2.6, 2.5, u), lerp(4.6, 4.0, u)], [0.2, lerp(22, 26, u), -120], 56, 0.01, shake(t, 0.05 + eye * 0.15, 3));
  } else {
    const u = easeOut(clamp((tau - 3.8) / (end - 3.8)));
    setCam([lerp(0.45, 2.2, u), lerp(2.5, 8.5, u), lerp(4.0, 17, u)], [0.2, lerp(26, 18, u), -120], lerp(56, 62, u), 0, shake(t, 0.3 * (1 - u), 6));
  }
  return R.scene;
}

// ============ Composição 2D: transições, vinheta, legendas ============
const grain = [];
for (let i = 0; i < 4; i++) {
  const c = document.createElement('canvas'); c.width = 270; c.height = 480; const x = c.getContext('2d');
  const d = x.createImageData(270, 480); const r = rng(50 + i);
  for (let k = 0; k < d.data.length; k += 4) { const v = r() * 255; d.data[k] = d.data[k + 1] = d.data[k + 2] = v; d.data[k + 3] = 255; }
  x.putImageData(d, 0, 0); grain.push(c);
}
function wordTime(chunkId, word) {
  const c = timeline.find(e => e.id === chunkId);
  const i = c.text.toLowerCase().indexOf(word.toLowerCase());
  return c.start + (Math.max(0, i) / c.text.length) * (c.end - c.start);
}
const CAPS = [
  { end: 5.9, parts: [['Há mil anos…', 's1a', 'Há'], ['espada lendária', 's1a', 'espada']] },
  { end: 12.3, parts: [['poder…', 's2a', 'poder'], ['senhor de todos os reinos', 's2a', 'senhor']] },
  { end: 20.9, parts: [['fracassavam…', 's3a', 'fracassavam'], ['simples camponês', 's3b', 'simples']] },
  { end: 28.8, parts: [['guardião da floresta', 's4a', 'guardião']] },
  { end: 35.9, parts: [['não escolhia o mais forte…', 's5a', 'não']] },
  { end: 38.8, big: true, parts: [['DIGNO', 's5c', 'digno']] },
  { end: 44.55, parts: [['despertado…', 's6b', 'despertado'], ['adormecido', 's6b', 'adormecido']] },
].map(c => ({ ...c, parts: c.parts.map(([text, id, w]) => ({ text, t: wordTime(id, w) })) }));

function drawText(text, x, y, size, fill, alpha, scale, glow) {
  ctx.save();
  ctx.globalAlpha = alpha; ctx.translate(x, y); ctx.scale(scale, scale);
  ctx.font = `900 ${size}px "Inter", "Inter Display", sans-serif`;
  const tw = ctx.measureText(text).width * 1.1;
  if (tw > W - 140) { size *= (W - 140) / tw; ctx.font = `900 ${size}px "Inter", "Inter Display", sans-serif`; }
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.lineJoin = 'round';
  if (glow) { ctx.shadowColor = glow; ctx.shadowBlur = size * 0.5; }
  else { ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 4; }
  ctx.lineWidth = size * 0.16; ctx.strokeStyle = 'rgba(8,10,12,0.92)'; ctx.strokeText(text, 0, 0);
  ctx.shadowBlur = glow ? size * 0.35 : 0; ctx.shadowOffsetY = 0;
  ctx.fillStyle = fill; ctx.fillText(text, 0, 0);
  ctx.restore();
}
function captions(t) {
  for (const c of CAPS) {
    if (t < c.parts[0].t - 0.05 || t > c.end) continue;
    const fadeOut = 1 - sstep(c.end - 0.18, c.end, t);
    c.parts.forEach((p, i) => {
      const a = sstep(p.t - 0.05, p.t + 0.12, t) * fadeOut;
      if (a <= 0) return;
      const pop = 1 + (1 - easeOut(clamp((t - p.t + 0.05) / 0.22))) * 0.35;
      if (c.big) {
        const y = H * 0.70;
        drawText(p.text, W / 2, y, 210, '#ffd45e', a, pop * (1 + (t - p.t) * 0.03), 'rgba(255,190,60,0.95)');
      } else {
        const y = H * 0.70 + i * 104;
        const size = i === 0 ? 74 : 84;
        drawText(p.text, W / 2, y, size, i === 0 ? '#ffffff' : '#ffe39a', a, pop);
      }
    });
  }
}
function overlay(color, a) { if (a <= 0.001) return; ctx.save(); ctx.globalAlpha = clamp(a); ctx.fillStyle = color; ctx.fillRect(0, 0, W, H); ctx.restore(); }

function composite(t, frameIdx) {
  ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0);
  ctx.drawImage(renderer.domElement, 0, 0, W, H);
  // vinheta
  const g = ctx.createRadialGradient(W / 2, H * 0.48, H * 0.25, W / 2, H * 0.5, H * 0.72);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.55)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // transições
  overlay('#5f8f8a', sstep(12.2, 12.95, t) * (1 - sstep(13.0, 13.8, t)) * 0.95);          // fusão com a névoa
  overlay('#ffffff', sstep(28.82, 29.0, t) * (1 - sstep(29.0, 29.45, t)));                 // flash branco
  overlay('#ffd27a', Math.exp(-Math.max(0, t - EV.burst) * 3.5) * (t >= EV.burst ? 0.95 : 0)); // explosão
  overlay('#ffcf6e', sstep(38.72, 39.0, t) * (1 - sstep(39.0, 39.4, t)));                  // flash dourado
  if (t < 0.25) overlay('#000', 1 - t / 0.25);
  // granulação
  ctx.save(); ctx.globalAlpha = 0.05; ctx.globalCompositeOperation = 'overlay';
  ctx.drawImage(grain[frameIdx % 4], 0, 0, W, H); ctx.restore();
  captions(t);
  if (t >= EV.end) overlay('#000', 1);
}

const SCENES = [[6, scene1], [13, scene2], [21, scene3], [29, scene4], [39, scene5], [45.1, scene6]];
window.renderFrame = (t, frameIdx = 0, quality = 0.92) => {
  if (t < EV.end) {
    const fn = SCENES.find(s => t < s[0])[1];
    const sc = fn(t);
    renderer.render(sc, camera);
  }
  composite(t, frameIdx);
  return out.toDataURL('image/jpeg', quality);
};
// aquece shaders de todas as cenas
for (const t of [0.5, 7, 14, 22, 33, 37, 41]) window.renderFrame(t);
window.ready = true;
