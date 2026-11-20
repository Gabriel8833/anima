// CENA 5 — A GUERRA DOS MAGOS: esfera negra × escudo dourado, portal roxo, onda azul derrubando a torre.
import { THREE, V, kf, lerp, clamp, sstep, win, easeInOut, easeOut, easeIn, linear, updateParticles, impulse, shake, glowSprite } from '../../../motor/base.js';
import { resetPose, pose, walk, idle, expr, flutterCape, wp } from '../../../motor/rig.js';
import { HandGlow, Aura, DarkOrb, Shield, Portal, EnergyWave, Explosion, Lightning } from '../../../motor/fx.js';
import { makeKael, makeMorvath, makeEldrin, makeZareth, makeStaff, staffGlow } from '../../../personagens/magos.js';
import { buildBattlefield } from '../../../cenarios/exterior.js';

// Posições e momentos-chave (segundos absolutos)
const M = V(-8, 0, -6), E = V(8, 0, -6), Zp = V(0, 0, -14), K = V(0, 0, 8);
const SH = V(8, 0, -6);
const EV = {
  orbCharge: 46.3, orbLaunch: 48.8, shieldUp: 48.4, impact: 49.65,
  portalOpen: 51.0, zarStep: 51.9, zarBolt: 52.9,
  kaelPush: 54.6, towerHit: 55.5,
  orb2: 57.0, boom: [49.65, 53.25, 55.5, 57.6, 58.4, 59.3], strikes: [46.25, 51.3, 57.2, 58.75, 59.9],
};
const ORB_FROM = V(-8, 3.6, -6);
const HIT_DIR = V(-1, 0.45, 0).normalize();
const ORB_TO = SH.clone().add(HIT_DIR.clone().multiplyScalar(3.4));

export default {
  nome: 'A guerra dos magos', inicio: 46, fim: 61,
  criar(st) {
    const B = buildBattlefield(), S = B.scene;
    const kael = makeKael(), morv = makeMorvath(), eld = makeEldrin(), zar = makeZareth();
    [kael, morv, eld, zar].forEach(h => { S.add(h.root); st.metal(h.root, 0.6); });
    const staff = makeStaff(); S.add(staff);
    const orb = new DarkOrb().addTo(S);
    const orb2 = new DarkOrb().addTo(S);
    const shield = new Shield(0xffc040); S.add(shield.group);
    const portal = new Portal(0xa040ff).addTo(S);
    const wave = new EnergyWave(0x58b4ff).addTo(S);
    const booms = EV.boom.map((_, i) => new Explosion(i === 0 ? 0xff4060 : [0xff9a40, 0xb060ff, 0x58b4ff, 0xff9a40, 0xffc040, 0xff6040][i], i === 0 ? 3 : 4).addTo(S));
    const boomPos = [ORB_TO, V(4, 0.6, -2), V(-10, 4, -16), V(-3, 0.5, -1), V(6, 0.5, -11), V(-2, 0.5, -9)];
    const bolts = EV.strikes.map((_, i) => { const to = [V(-14, 0, -20), V(10, 0, -18), V(-4, 0, -3), V(12, 0, -2), V(-1, 0, -12)][i]; const l = new Lightning(to.clone().add(V((i - 2) * 6, 70, -10)), to, i + 3); S.add(l.group); return l; });
    const mAura = new Aura(200, 0x0a0008, 0.25, { additive: false, radius: 0.7, rise: 2.5, opacity: 0.7 }); S.add(mAura.group);
    const mHands = [new HandGlow(0xff2040, 0.5, 4), new HandGlow(0xff2040, 0.5, 4)]; mHands.forEach(h => S.add(h.group));
    const kHands = [new HandGlow(0x58b4ff, 0.7, 6), new HandGlow(0x58b4ff, 0.7, 6)]; kHands.forEach(h => S.add(h.group));
    const zHand = new HandGlow(0xb060ff, 0.6, 5); S.add(zHand.group);
    const zBolt = glowSprite(0xc070ff, 1.2, 0); S.add(zBolt);
    const zBoltL = new THREE.PointLight(0xb060ff, 0, 12, 1.4); S.add(zBoltL);

    return {
      atualizar(t) {
        // fogo e brasas
        B.fires.forEach((f, i) => { const k = 1 + 0.18 * Math.sin(t * 11 + i * 2) + 0.1 * Math.sin(t * 23 + i); f.f.scale.setScalar(f.base * k); f.l.intensity = f.li * k; });
        updateParticles(B.embers, (s) => { const life = (t * (0.15 + s[3] * 0.2) + s[4]) % 1; return [(s[0] - 0.5) * 70 + Math.sin(t + s[2] * 9) * 2 + life * 6, life * 18, (s[1] - 0.5) * 60 - 6]; });
        B.clouds.forEach((c, i) => { c.position.x = (c.userData.x0 ??= c.position.x) + t * 2; });
        let flash = 0;
        bolts.forEach((b, i) => { flash = Math.max(flash, b.update(t - EV.strikes[i])); });
        B.hl.intensity = 0.7 + flash * 1.5;

        // ---- MORVATH: carrega e lança a esfera ----
        resetPose(morv); morv.root.position.copy(M); morv.root.rotation.y = Math.PI / 2 - 0.25;
        const chg = sstep(EV.orbCharge, EV.orbCharge + 0.6, t) * (1 - sstep(EV.orbLaunch + 0.3, EV.orbLaunch + 0.8, t));
        pose(morv, 'raiseBoth', chg);
        const throwK = win(t, EV.orbLaunch - 0.15, EV.orbLaunch + 0.1, EV.orbLaunch + 0.6, EV.orbLaunch + 1.2);
        pose(morv, 'push', throwK);
        const throw2 = win(t, EV.orb2 - 0.4, EV.orb2, EV.orb2 + 0.5, EV.orb2 + 1.0);
        pose(morv, 'push', throw2);
        const stagger = win(t, EV.towerHit, EV.towerHit + 0.25, EV.towerHit + 0.9, EV.towerHit + 1.6);
        pose(morv, 'recoil', stagger); morv.pivot.rotation.z = -stagger * 0.25;
        idle(morv, t); flutterCape(morv, t, 1.4);
        expr(morv, { anger: 0.8, open: chg * 0.3 + throwK * 0.5, glow: 1 });
        morv.root.updateMatrixWorld(true);
        mHands[0].group.position.copy(wp(morv.handL)); mHands[1].group.position.copy(wp(morv.handR));
        mHands.forEach(h => h.update(0.6 + chg * 0.4, t));
        mAura.update(wp(morv.torso), t, 1);
        // esfera 1
        if (t < EV.orbLaunch) orb.update(ORB_FROM.clone().add(V(0, 0.4, 0)), lerp(0.1, 1.3, sstep(EV.orbCharge, EV.orbLaunch, t)), sstep(EV.orbCharge, EV.orbCharge + 0.4, t), t);
        else if (t < EV.impact) { const u = (t - EV.orbLaunch) / (EV.impact - EV.orbLaunch); const p = ORB_FROM.clone().add(V(0, 0.4, 0)).lerp(ORB_TO, easeIn(u * 0.6 + 0.4) * 1.0 - 0.0); p.y += Math.sin(u * Math.PI) * 1.2; orb.update(p, 1.3, 1, t); }
        else orb.update(ORB_TO, 1.3, 0, t);
        // esfera 2 (contra Kael, explode no chão)
        if (t > EV.orb2 - 0.4 && t < EV.boom[3]) { const u = clamp((t - EV.orb2) / (EV.boom[3] - EV.orb2)); const p = ORB_FROM.clone().lerp(boomPos[3], u); p.y += Math.sin(u * Math.PI) * 2; orb2.update(p, 0.8, 1, t); } else orb2.update(V(), 0, 0, t);

        // ---- ELDRIN: escudo dourado ----
        resetPose(eld); eld.root.position.copy(E); eld.root.rotation.y = -Math.PI / 2 + 0.25;
        const sUp = sstep(EV.shieldUp - 0.4, EV.shieldUp + 0.1, t);
        pose(eld, 'staffForward', sUp); pose(eld, { torso: [-0.1, 0, 0] }, win(t, EV.impact, EV.impact + 0.1, EV.impact + 0.4, EV.impact + 1)); idle(eld, t); flutterCape(eld, t, 1.2);
        expr(eld, { anger: 0.3 + sUp * 0.3, worry: 0.2 });
        eld.root.updateMatrixWorld(true);
        staff.position.copy(wp(eld.handR)); staff.rotation.set(0, 0, sUp * 0.5); staff.rotation.order = 'YXZ'; staff.rotation.y = eld.root.rotation.y;
        staffGlow(staff, 0.3 + sUp * 0.7 + win(t, EV.impact, EV.impact + 0.05, EV.impact + 0.3, EV.impact + 0.8), t);
        const shK = sUp * (1 - sstep(56.2, 56.8, t)) + sstep(57.8, 58.3, t) * 0.8;
        shield.update(SH.clone(), 3.4, shK, t, HIT_DIR, t - EV.impact);

        // ---- ZARETH: portal e raio roxo ----
        const pk = sstep(EV.portalOpen, EV.portalOpen + 0.8, t) * (1 - sstep(54.8, 55.6, t));
        portal.update(Zp.clone().add(V(0, 2.2, 0)), 0, 1.7, pk, t);
        const emerge = clamp((t - EV.zarStep) / 1.1);
        zar.root.visible = t > EV.zarStep - 0.05;
        resetPose(zar);
        zar.root.position.copy(Zp).add(V(0, 0, -0.6 + easeOut(emerge) * 2.2)); zar.root.rotation.y = 0;
        if (emerge > 0 && emerge < 1) walk(zar, emerge * Math.PI * 2 * 1.2, 1 - emerge);
        const zCast = win(t, EV.zarBolt - 0.4, EV.zarBolt, EV.zarBolt + 0.5, EV.zarBolt + 1.0);
        pose(zar, { shR: [-1.5, 0.0, 0.25], elR: [-0.05, 0, 0], handR: [1.0, 0, 0], torso: [0, -0.35, 0] }, zCast);
        idle(zar, t); flutterCape(zar, t, 1.2);
        expr(zar, { anger: 0.25, look: [0.3, 0] });
        zar.root.updateMatrixWorld(true);
        const zh = wp(zar.handR); zHand.group.position.copy(zh); zHand.update(zar.root.visible ? 0.5 + zCast * 0.5 : 0, t);
        const zb = clamp((t - EV.zarBolt) / 0.35);
        if (t > EV.zarBolt && t < EV.boom[1]) { const p = zh.clone().lerp(boomPos[1], zb); zBolt.position.copy(p); zBolt.material.opacity = 1; zBolt.scale.setScalar(1.4); zBoltL.position.copy(p); zBoltL.intensity = 60; } else { zBolt.material.opacity = 0; zBoltL.intensity = 0; }

        // ---- KAEL: chega e lança a onda azul ----
        resetPose(kael);
        kael.root.visible = t > 53.4;
        const kp = kf(t, [[53.4, [2.5, 0, 12]], [54.2, [0.6, 0, 9]]], easeOut);
        kael.root.position.set(kp[0], 0, kp[2]); kael.root.rotation.y = Math.PI + 0.25;
        if (t < 54.2) walk(kael, t * 9, 1, 1);
        const kc = sstep(54.0, EV.kaelPush, t);
        pose(kael, 'charge', kc * (1 - sstep(EV.kaelPush, EV.kaelPush + 0.1, t)));
        pose(kael, 'push', win(t, EV.kaelPush - 0.05, EV.kaelPush + 0.12, 56.2, 56.9));
        const dodge = win(t, 57.3, 57.6, 58.2, 58.8); pose(kael, 'recoil', dodge); kael.pivot.rotation.z = dodge * 0.3;
        idle(kael, t); flutterCape(kael, t, 1.5);
        expr(kael, { anger: 0.6, open: win(t, EV.kaelPush - 0.1, EV.kaelPush, EV.kaelPush + 0.5, EV.kaelPush + 0.9) * 0.6, fear: dodge * 0.5 });
        kael.root.updateMatrixWorld(true);
        const khl = wp(kael.handL), khr = wp(kael.handR);
        kHands[0].group.position.copy(khl); kHands[1].group.position.copy(khr);
        const kk = kael.root.visible ? 0.4 + kc * 0.6 : 0; kHands.forEach(h => h.update(kk, t));
        const wOrigin = khl.clone().add(khr).multiplyScalar(0.5);
        const wDir = V(-10, 4, -16).sub(V(0.6, 1.4, 9)).normalize();
        wave.update(kael.root.visible ? wOrigin : V(), wDir, t - EV.kaelPush, 1, 26);

        // ---- torre desabando ----
        const fall = Math.max(0, t - EV.towerHit);
        B.towerSegs.forEach((s, i) => {
          const h = s.userData.home;
          const k = fall > 0 ? Math.max(0, fall - (9 - Math.min(i, 9)) * 0.05) : 0;
          s.position.set(h.x - k * k * 0.6 * (i / 10) - k * 1.5 * (i / 10), Math.max(0.6 + (i % 3) * 0.4, h.y - 4.9 * k * k), h.z + k * 0.8 * (i / 10));
          s.rotation.set(k * (0.4 + i * 0.1), i, -k * (0.3 + i * 0.12));
        });
        booms.forEach((b, i) => b.update(boomPos[i], t - EV.boom[i]));

        // ---- câmeras ----
        const sh = impulse(t, EV.impact, 2.2) + impulse(t, EV.towerHit, 1.8) + impulse(t, EV.boom[3], 1.6) + impulse(t, EV.boom[4], 1.2) + impulse(t, EV.boom[5], 1.2) + flash * 0.6 + impulse(t, EV.boom[1], 0.8);
        const shk = shake(t, sh, 24);
        if (t < 48.6) {
          const u = (t - 46) / 2.6;
          st.cam(kf(u, [[0, [-5.6, 0.8, -2.6]], [1, [-6.3, 0.9, -3.6]]], easeInOut), [M.x, 2.6, M.z], 50, 0.04, shk, 0.05, 3000);
        } else if (t < 51.0) {
          const u = (t - 48.6) / 2.4;
          st.cam([lerp(-13.5, -12.5, u), lerp(2.2, 2.6, u), lerp(2.2, 0.8, u)], [5, 2.2, -6], 50, 0, shk, 0.05, 3000);
        } else if (t < 53.6) {
          const u = (t - 51) / 2.6;
          st.cam(kf(u, [[0, [1.5, 0.7, -5]], [1, [0.8, 0.9, -6.5]]], easeInOut), [0, 2.0, -12.5], 50, -0.03, shk, 0.05, 3000);
        } else if (t < 56.6) {
          const u = (t - 53.6) / 3;
          st.cam([lerp(1.8, 1.4, u), lerp(1.4, 1.7, u), lerp(12.4, 13.0, u)], [lerp(-1.5, -6, sstep(0.3, 0.8, u)), lerp(2.0, 6, sstep(0.3, 0.8, u)), -8], 52, 0.02, shk, 0.05, 3000);
        } else {
          const u = (t - 56.6) / 4.4;
          st.cam(kf(u, [[0, [16, 5, 20]], [1, [24, 20, 30]]], easeInOut), [0, 2, -5], 54, -0.03, shk, 0.05, 3000);
        }
        return S;
      },
    };
  },
};
