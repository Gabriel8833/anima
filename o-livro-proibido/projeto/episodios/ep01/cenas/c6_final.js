// CENA 6 — O FINAL MISTERIOSO: a porta se abre, o livro aberto, a página vira sozinha, energia vermelha, olhos de Kael.
import { THREE, V, kf, lerp, clamp, sstep, win, easeInOut, easeOut, easeIn, linear, particles, updateParticles, lightShaft, mistSprites, animateMist, shake, std, mesh } from '../../../motor/base.js';
import { resetPose, pose, walk, idle, expr, flutterCape, wp } from '../../../motor/rig.js';
import { HandGlow, RuneRing } from '../../../motor/fx.js';
import { makeKael } from '../../../personagens/magos.js';
import { buildHall, makeStoneDoor, openDoor } from '../../../cenarios/salao.js';
import { makeBook, makeAltar, setBookOpen, turnPage, bookGlow, flickerCandles } from '../../../cenarios/objetos.js';

const R = 9, DOOR_Z = 8.7;
const EV = { open: [61.3, 63.8], walk: [63.6, 67.6], turn: [68.9, 70.2], red: 69.7, eyes: 70.6, black: 73.0 };

export default {
  nome: 'O final misterioso', inicio: 61, fim: 73,
  criar(st) {
    const Hh = buildHall({ radius: R, height: 7, columns: 8, colR: 0.4, fog: 0x070a12, fogD: 0.05, ambient: [0x34466a, 0x080608, 0.35], candleColor: 0x7fd0ff, candles: 12, seed: 11, doorGap: 0.36, colOffset: Math.PI / 8 });
    const S = Hh.scene;
    const altar = makeAltar(0x6fd8ff); S.add(altar);
    const book = makeBook(); book.scale.setScalar(1.5); S.add(book); st.metal(book, 1);
    const door = makeStoneDoor(3.0, 4.2); door.position.set(0, 0, DOOR_Z); door.rotation.y = Math.PI; S.add(door);
    // corredor iluminado atrás da porta
    const corridor = mesh(new THREE.BoxGeometry(3.6, 4.8, 10), std(0x3a342e, 0.95, 0, { side: THREE.BackSide })); corridor.position.set(0, 2.4, DOOR_Z + 5.2); S.add(corridor);
    const torch = new THREE.PointLight(0xffb070, 80, 14, 1.4); torch.position.set(0, 3, DOOR_Z + 4); S.add(torch);
    const doorShaft = lightShaft(1.4, 2.4, 7, 0xffc890, 0); doorShaft.rotation.x = Math.PI / 2 + 0.15; doorShaft.position.set(0, 1.6, DOOR_Z - 3.3); S.add(doorShaft);
    const doorDust = particles(220, 0xc8b8a0, 0.06, { additive: false, opacity: 0.6 }); S.add(doorDust);
    const kael = makeKael(); S.add(kael.root); st.metal(kael.root, 0.6);
    const kGlow = new HandGlow(0x58b4ff, 0.5, 4); S.add(kGlow.group);
    const runes = new RuneRing(12, 0x8fe0ff, 1.1, 0.22, 9); S.add(runes.group);
    const redRunes = new RuneRing(14, 0xff2a20, 0.9, 0.24, 12); S.add(redRunes.group);
    const red = particles(700, 0xff2a1a, 0.08); S.add(red);
    const dark = particles(400, 0x120000, 0.16, { additive: false, opacity: 0.8 }); S.add(dark);
    const redLight = new THREE.PointLight(0xff2010, 0, 14, 1.3); S.add(redLight);
    const faceRed = new THREE.PointLight(0xff2010, 0, 3, 1.5); S.add(faceRed);
    const mist = mistSprites(S, 24, [-7, 7, -7, 7], { color: 0x34466a, y: [0.1, 1.0], seed: 13, opacity: [0.06, 0.14] });

    return {
      atualizar(t) {
        flickerCandles(Hh.candles, t); animateMist(mist, t);
        // porta
        const op = easeInOut(clamp((t - EV.open[0]) / (EV.open[1] - EV.open[0])));
        openDoor(door, op);
        door.userData.glyph.opacity = 0.5 + 0.4 * Math.sin(t * 5) * (1 - op);
        doorShaft.material.opacity = op * 0.35;
        updateParticles(doorDust, (s) => { if (t < EV.open[0]) return null; const dt = t - EV.open[0]; const life = (dt * (0.2 + s[3] * 0.3) + s[4]) % 1; return [(s[0] - 0.5) * 3.2 * op, 0.1 + s[1] * 4.2 - life * 0.6, DOOR_Z - 0.3 - life * 2.5 * s[2]]; });
        // livro
        const by = altar.userData.top + 0.75 + Math.sin(t * 1.4) * 0.06;
        book.position.set(0, by, 0); book.rotation.set(0.2, Math.PI, 0); setBookOpen(book, 1);
        const pu = easeInOut(clamp((t - EV.turn[0]) / (EV.turn[1] - EV.turn[0])));
        turnPage(book, pu);
        const redK = sstep(EV.red - 0.4, EV.red + 0.6, t);
        bookGlow(book, lerp(0.85, 1.4, redK) + 0.15 * Math.sin(t * (2 + redK * 10)), redK > 0.5 ? 0xff2a1a : 0x7fd8ff);
        book.userData.turnMat.emissiveIntensity = sstep(EV.turn[0] + 0.4, EV.turn[1], t) * 2.5;
        altar.userData.runeMat.color.set(redK > 0.5 ? 0xff2a1a : 0x6fd8ff); altar.userData.runeMat.opacity = 0.5 + redK * 0.4;
        runes.update(V(0, by + 0.3, 0), t, 0.8 * (1 - redK), st.camera, { speed: 0.3, bob: 0.15, tilt: 0.2 });
        redRunes.update(V(0, by + 0.6 + redK * 0.4, 0), t * 1.8, redK, st.camera, { speed: 0.9, bob: 0.25, tilt: 0.4 });
        updateParticles(red, (s) => { if (redK <= 0) return null; const life = (t * (0.35 + s[3] * 0.5) + s[4]) % 1; const a = s[0] * 6.283 + life * 7; const r = (0.15 + life * 1.6) * (0.4 + s[1]); return [Math.cos(a) * r, by + 0.1 + life * 3.5, Math.sin(a) * r]; });
        red.material.opacity = redK;
        updateParticles(dark, (s) => { if (redK <= 0) return null; const life = (t * (0.2 + s[3] * 0.3) + s[4]) % 1; const a = -s[0] * 6.283 - life * 5; const r = (0.2 + life * 2.2) * (0.4 + s[1]); return [Math.cos(a) * r, by + life * 4, Math.sin(a) * r]; });
        dark.material.opacity = redK * 0.7;
        redLight.position.set(0, by + 0.6, 0); redLight.intensity = redK * (6 + 2.5 * Math.sin(t * 17) + 1.5 * Math.sin(t * 31));
        Hh.hl.intensity = 0.35 * (1 - redK * 0.6);
        Hh.candles.forEach(c => { if (c.userData.light) c.userData.light.intensity *= 1 - redK * 0.7; });
        // Kael
        resetPose(kael);
        const kp = kf(t, [[EV.walk[0], [0, 0, DOOR_Z + 0.8]], [EV.walk[1], [0, 0, 1.35]]], linear);
        kael.root.position.set(kp[0], 0, kp[2]); kael.root.rotation.y = Math.PI;
        const walking = t > EV.walk[0] && t < EV.walk[1];
        if (walking) walk(kael, (t - EV.walk[0]) * Math.PI * 2 * 0.8, 1 - sstep(EV.walk[1] - 0.4, EV.walk[1], t));
        const lightK = win(t, 61.5, 62.0, 66.5, 67.2);
        if (lightK > 0) pose(kael, { shL: [-0.8, 0, -0.3], elL: [-1.0, 0, 0], handL: [0.6, 0, 0] }, lightK);
        const recoil = sstep(EV.red, EV.red + 0.6, t);
        pose(kael, { shL: [-0.5, 0, -0.35], shR: [-0.5, 0, 0.35], elL: [-0.6, 0, 0], elR: [-0.6, 0, 0], torso: [-0.12, 0, 0] }, recoil);
        kael.head.rotation.x = sstep(66.8, 67.8, t) * 0.32 - recoil * 0.12;
        idle(kael, t); flutterCape(kael, t, walking ? 1 : 0.3);
        expr(kael, {
          look: [0, -sstep(66.8, 67.8, t) * 0.6 + recoil * 0.3], worry: 0.4 + sstep(EV.turn[0], EV.turn[0] + 0.5, t) * 0.4,
          fear: sstep(EV.turn[0] + 0.3, EV.eyes, t), open: sstep(EV.red, EV.eyes + 0.5, t) * 0.35,
          blink: win(t, 65.0, 65.05, 65.1, 65.16),
        });
        kael.root.updateMatrixWorld(true);
        kGlow.group.position.copy(wp(kael.handL)).add(V(0, 0.08, -0.05)); kGlow.update(lightK, t);
        const head = wp(kael.head);
        faceRed.position.set(head.x, head.y + 0.1, head.z - 0.6); faceRed.intensity = redK * (0.4 + 0.2 * Math.sin(t * 23));
        // câmeras
        if (t < 64.2) {
          const u = (t - 61) / 3.2;
          st.cam([lerp(0.6, 0.3, u), lerp(1.2, 1.35, u), lerp(1.8, 3.2, u)], [0, 2.1, DOOR_Z], 46, 0.0, shake(t, 0.25 * win(t, 61.3, 61.5, 63.5, 63.8), 30), 0.05, 200);
        } else if (t < 66.8) {
          const u = (t - 64.2) / 2.6;
          st.cam([kael.root.position.x + lerp(0.9, 0.7, u), lerp(1.3, 1.7, u), kael.root.position.z + 2.3], [0, by, 0], 44, 0.02, [0, 0], 0.05, 200);
        } else if (t < 68.8) {
          const u = (t - 66.8) / 2;
          st.cam(kf(u, [[0, [-1.9, 1.75, -1.0]], [1, [-1.5, 1.8, -0.6]]], easeInOut), [0, 1.75, 0.9], 42, -0.02, [0, 0], 0.05, 200);
        } else if (t < EV.eyes) {
          const u = (t - 68.8) / (EV.eyes - 68.8);
          st.cam(kf(u, [[0, [0.55, by + 0.9, -0.9]], [1, [0.35, by + 0.7, -0.7]]], easeInOut), [0, by, 0], 40, 0.03, shake(t, redK * 0.15, 12), 0.02, 200);
        } else {
          const u = easeIn(clamp((t - EV.eyes) / (EV.black - EV.eyes)));
          const eyeY = head.y + 0.16, d = lerp(0.75, 0.16, u);
          st.cam([head.x + lerp(0.08, 0.02, u), eyeY + 0.01, head.z - d], [head.x, eyeY, head.z], lerp(36, 30, u), 0, shake(t, 0.06 + u * 0.08, 9), 0.01, 200);
        }
        return S;
      },
    };
  },
};
