// CENA 3 — OS QUATRO MAGOS: cada um descobre uma pista em um lugar diferente (4 planos de 3 s).
import { THREE, V, kf, lerp, sstep, win, easeInOut, easeOut, linear, std, mesh, particles, updateParticles, animateMist, glowSprite, magicCircleTex, runeSheet } from '../../../motor/base.js';
import { resetPose, pose, idle, expr, flutterCape, wp } from '../../../motor/rig.js';
import { HandGlow, Aura, Portal, RuneRing } from '../../../motor/fx.js';
import { makeKael, makeMorvath, makeEldrin, makeZareth, makeStaff, staffGlow } from '../../../personagens/magos.js';
import { buildForest, buildStoneCircle, buildObservatory } from '../../../cenarios/exterior.js';
import { buildHall } from '../../../cenarios/salao.js';
import { flickerCandles } from '../../../cenarios/objetos.js';

const T0 = 22; // início da cena
export const PLANOS = [22, 25, 28, 31, 34];

function scroll() {
  const c = document.createElement('canvas'); c.width = 256; c.height = 320; const x = c.getContext('2d');
  x.fillStyle = '#c9b48a'; x.fillRect(0, 0, 256, 320);
  for (let i = 0; i < 1800; i++) { x.fillStyle = `rgba(90,60,30,${Math.random() * 0.08})`; x.fillRect(Math.random() * 256, Math.random() * 320, 3, 3); }
  x.drawImage(runeSheet(8).image, 20, 30, 216, 216);
  const g = new THREE.CylinderGeometry(0.5, 0.5, 0.42, 24, 1, true, -0.55, 1.1);
  const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ map: new THREE.CanvasTexture(c), side: THREE.DoubleSide, roughness: 0.9, emissive: 0x58b4ff, emissiveMap: runeSheet(8), emissiveIntensity: 0 }));
  m.rotation.z = Math.PI / 2;
  const grp = new THREE.Group(); grp.add(m); m.position.y = -0.5;
  for (const s of [-1, 1]) { const r = mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.5, 10), std(0x5a3a1c, 0.7)); r.rotation.z = Math.PI / 2; r.position.set(0, -0.5 + Math.cos(0.55) * 0.5, s * Math.sin(0.55) * 0.5); grp.add(r); }
  grp.userData.mat = m.material;
  return grp;
}

export default {
  nome: 'Os quatro magos', inicio: 22, fim: 34,
  criar(st) {
    // --- Kael na floresta ---
    const F = buildForest({ seed: 5, clearR: 5 });
    const kael = makeKael(); F.scene.add(kael.root);
    const sc = scroll(); F.scene.add(sc);
    const kGlow = new HandGlow(0x58b4ff, 0.45, 2.5); F.scene.add(kGlow.group);
    const kRunes = new RuneRing(8, 0x8fd0ff, 0.45, 0.12, 5); F.scene.add(kRunes.group);
    // --- Morvath na cripta ---
    const C = buildHall({ radius: 7, height: 6, columns: 8, colR: 0.35, fog: 0x14060a, fogD: 0.07, ambient: [0x5a2a3a, 0x080204, 0.4], candleColor: 0xff4030, candles: 14, seed: 7 });
    const morv = makeMorvath(); C.scene.add(morv.root);
    const basin = new THREE.Group(); C.scene.add(basin);
    basin.add(mesh(new THREE.CylinderGeometry(0.7, 0.45, 0.9, 20), std(0x2a2628, 0.9)));
    const liquid = mesh(new THREE.CircleGeometry(0.62, 32), new THREE.MeshStandardMaterial({ color: 0x050205, roughness: 0.05, metalness: 0.6 }), false); liquid.rotation.x = -Math.PI / 2; liquid.position.y = 0.44; basin.add(liquid);
    const sigil = new THREE.Mesh(new THREE.PlaneGeometry(1.15, 1.15), new THREE.MeshBasicMaterial({ map: magicCircleTex(11), color: 0xff2030, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
    sigil.rotation.x = -Math.PI / 2; sigil.position.y = 0.455; basin.add(sigil);
    const redL = new THREE.PointLight(0xff2030, 0, 6, 1.4); redL.position.y = 0.8; basin.add(redL);
    basin.position.set(0, 0.45, 0);
    const mAura = new Aura(220, 0x0a0008, 0.22, { additive: false, radius: 0.6, rise: 2.2, opacity: 0.7 }); C.scene.add(mAura.group);
    // --- Eldrin no observatório ---
    const O = buildObservatory();
    const eld = makeEldrin(); O.scene.add(eld.root);
    const staff = makeStaff(); O.scene.add(staff);
    // --- Zareth no círculo de pedras ---
    const Z = buildStoneCircle();
    const zar = makeZareth(); Z.scene.add(zar.root);
    const portal = new Portal(0xa040ff).addTo(Z.scene);
    const zGlow = new HandGlow(0xb060ff, 0.6, 5); Z.scene.add(zGlow.group);
    const vision = glowSprite(0x7fd8ff, 0.5, 0); Z.scene.add(vision);
    const bookSil = mesh(new THREE.BoxGeometry(0.34, 0.05, 0.24), new THREE.MeshBasicMaterial({ color: 0x9fe4ff, transparent: true, opacity: 0 }), false); Z.scene.add(bookSil);
    [kael, morv, eld, zar].forEach(h => st.metal(h.root, 0.6));

    return {
      atualizar(t) {
        // ===== 3a: Kael lê um pergaminho que revela runas azuis =====
        if (t < PLANOS[1]) {
          const tau = t - T0;
          animateMist(F.mist, t);
          resetPose(kael); kael.root.position.set(0, 0, 0); kael.root.rotation.y = 0.35;
          pose(kael, 'hold', 1); idle(kael, t); flutterCape(kael, t, 0.4);
          kael.head.rotation.x = 0.3 - sstep(1.4, 2.0, tau) * 0.25;
          const reveal = sstep(0.4, 1.6, tau);
          expr(kael, { look: [0, -0.6 + reveal * 0.6], fear: sstep(1.4, 1.9, tau) * 0.55, worry: 0.2, blink: win(tau, 0.7, 0.75, 0.8, 0.86) });
          kael.root.updateMatrixWorld(true);
          const hl = wp(kael.handL), hr = wp(kael.handR), mid = hl.clone().add(hr).multiplyScalar(0.5);
          sc.position.copy(mid).add(V(0, 0.08, 0)); sc.rotation.set(0.9, 0.35, 0);
          sc.userData.mat.emissiveIntensity = reveal * 2.5;
          kGlow.group.position.copy(mid).add(V(0, 0.2, 0.15)); kGlow.update(reveal * 0.9, t);
          kRunes.update(mid.clone().add(V(0, 0.25 + reveal * 0.35, 0.1)), t, reveal, st.camera, { speed: 0.8, bob: 0.08 });
          updateParticles(F.fireflies, (s) => [Math.sin(t * 0.3 + s[0] * 9) * 6 * s[1], 0.5 + s[2] * 2.5 + Math.sin(t + s[3] * 6) * 0.2, Math.cos(t * 0.25 + s[0] * 7) * 6 * s[1]]);
          const u = tau / 3, head = wp(kael.head);
          st.cam(kf(u, [[0, [1.9, 1.5, 2.8]], [1, [1.1, 1.6, 1.8]]], easeInOut), [head.x - 0.05, head.y - 0.15, head.z], 40, 0.02, [0, 0], 0.03, 300);
          return F.scene;
        }
        // ===== 3b: Morvath vê o símbolo do livro na água negra =====
        if (t < PLANOS[2]) {
          const tau = t - PLANOS[1];
          flickerCandles(C.candles, t);
          resetPose(morv); morv.root.position.set(0, 0, -0.95); morv.root.rotation.y = 0;
          pose(morv, { shL: [-1.0, 0, -0.25], shR: [-1.0, 0, 0.25], elL: [-0.5, 0, 0], elR: [-0.5, 0, 0], handL: [1.2, 0, 0], handR: [1.2, 0, 0], torso: [0.35, 0, 0], head: [0.45, 0, 0] }, 1);
          flutterCape(morv, t, 0.3);
          const s = sstep(0.3, 1.5, tau);
          morv.head.rotation.x = 0.45 - sstep(1.2, 1.8, tau) * 0.4;
          expr(morv, { anger: 0.5, look: [0, -0.8 + sstep(1.2, 1.8, tau) * 0.8], open: sstep(1.6, 2.0, tau) * 0.15, glow: 0.6 + s * 0.4 });
          sigil.material.opacity = s; sigil.rotation.z = t * 0.6; redL.intensity = s * 14;
          mAura.update(V(0, 1.4, -0.9), t, 1);
          const u = tau / 3;
          st.cam(kf(u, [[0, [0.8, 1.15, 1.3]], [1, [0.45, 1.25, 0.85]]], easeInOut), [0, 1.62, -0.8], 44, -0.04, [0, 0], 0.03, 100);
          return C.scene;
        }
        // ===== 3c: Eldrin ergue o cajado e as estrelas formam o livro =====
        if (t < PLANOS[3]) {
          const tau = t - PLANOS[2];
          resetPose(eld); eld.root.position.set(0, 0, 0); eld.root.rotation.y = Math.PI;
          const raise = sstep(0.2, 1.0, tau);
          pose(eld, 'raiseR', raise); idle(eld, t); flutterCape(eld, t, 0.6);
          eld.head.rotation.x = -0.35 * raise;
          expr(eld, { look: [0, 0.8 * raise], worry: 0.2 });
          eld.root.updateMatrixWorld(true);
          staff.position.copy(wp(eld.handR)); staff.rotation.set(0, 0, 0.12 * (1 - raise)); staff.position.y += 0.3 * raise;
          staffGlow(staff, raise, t);
          O.arm.rotation.y = t * 0.3; O.rings.forEach((r, i) => { r.rotation.x = t * (0.4 + i * 0.3); r.rotation.y = t * (0.2 + i * 0.25); });
          O.lines.forEach((l, i) => (l.material.opacity = sstep(0.9 + i * 0.18, 1.2 + i * 0.18, tau)));
          O.stars.forEach((s, i) => (s.material.opacity = sstep(0.8 + i * 0.15, 1.0 + i * 0.15, tau) * (0.8 + 0.2 * Math.sin(t * 5 + i))));
          const u = tau / 3;
          st.cam(kf(u, [[0, [0.5, 0.8, 2.5]], [1, [0.7, 0.6, 3.1]]], easeInOut), kf(u, [[0, [0.45, 2.6, -4]], [1, [0.6, 10, -60]]], easeInOut), 55, 0.02, [0, 0], 0.05, 3000);
          return O.scene;
        }
        // ===== 3d: Zareth abre um pequeno portal e vê o livro =====
        const tau = t - PLANOS[3];
        animateMist(Z.mist, t);
        resetPose(zar); zar.root.position.set(0, 0, 1.2); zar.root.rotation.y = Math.PI;
        const op = sstep(0.3, 1.2, tau);
        pose(zar, { shR: [-1.45, 0, -0.05], elR: [-0.1, 0, 0], handR: [1.1, 0, 0], shL: [-0.3, 0, -0.2], elL: [-0.6, 0, 0] }, op); idle(zar, t); flutterCape(zar, t, 0.5);
        const turn = sstep(2.0, 2.6, tau);
        zar.head.rotation.y = turn * 0.9;
        expr(zar, { look: [turn * 0.9, 0], anger: 0.15, worry: 0 });
        zar.mouth.rotation.z = turn * 0.08; // sorriso de canto
        zar.root.updateMatrixWorld(true);
        zGlow.group.position.copy(wp(zar.handR)); zGlow.update(op, t);
        Z.circle.material.opacity = op * 0.8; Z.circle.rotation.z = t * 0.3;
        const pp = V(0, 1.7, -0.3);
        portal.update(pp, 0, 0.55, op, t);
        vision.position.copy(pp); vision.material.opacity = op * 0.6;
        bookSil.position.copy(pp).add(V(0, 0, 0.02)); bookSil.rotation.set(1.2, t * 0.8, 0); bookSil.material.opacity = sstep(1.0, 1.6, tau) * 0.9;
        const u = tau / 3;
        st.cam(kf(u, [[0, [-1.8, 1.4, -1.6]], [1, [-1.3, 1.55, -2.2]]], easeInOut), [0.2, 1.65, 0.6], 44, -0.02, [0, 0], 0.05, 3000);
        return Z.scene;
      },
    };
  },
};
