// CENA 2 — O LIVRO SAGRADO: biblioteca subterrânea, livro flutuando sobre o altar, runas brilhando.
import { THREE, V, kf, lerp, sstep, easeInOut, linear, particles, updateParticles, lightShaft, mistSprites, animateMist, glowSprite } from '../../../motor/base.js';
import { RuneRing } from '../../../motor/fx.js';
import { buildHall } from '../../../cenarios/salao.js';
import { makeBook, makeAltar, setBookOpen, turnPage, bookGlow, flickerCandles } from '../../../cenarios/objetos.js';

export default {
  nome: 'O livro sagrado', inicio: 11, fim: 22,
  criar(st) {
    const L = buildHall({ radius: 13, height: 13, columns: 10, shelves: true, hole: 0.5, fog: 0x0a1020, fogD: 0.035, ambient: [0x6a8ab8, 0x2a1c10, 1.0], candles: 20, seed: 2 });
    const S = L.scene;
    const altar = makeAltar(0x6fd8ff); S.add(altar);
    const book = makeBook(); book.scale.setScalar(1.5); S.add(book);
    st.metal(book, 1);
    const runes = new RuneRing(16, 0x8fe0ff, 1.25, 0.28, 3); S.add(runes.group);
    const shaft = lightShaft(1.4, 2.4, 16, 0x9fc8ff, 0.18); shaft.position.set(0, 8, 0); S.add(shaft);
    const spot = new THREE.SpotLight(0xa8ccff, 150, 30, 0.25, 0.6, 1.3); spot.position.set(0, 16, 0); spot.target.position.set(0, 0, 0); spot.castShadow = true; S.add(spot, spot.target);
    const dust = particles(300, 0xcfe4ff, 0.04, { opacity: 0.8 }); S.add(dust);
    const motes = particles(160, 0x8fe0ff, 0.05); S.add(motes);
    const mist = mistSprites(S, 24, [-10, 10, -10, 10], { color: 0x3a5a8a, y: [0.2, 1.5], seed: 2, opacity: [0.06, 0.14] });
    return {
      atualizar(t) {
        const tau = t - 11;
        flickerCandles(L.candles, t); animateMist(mist, t);
        const by = altar.userData.top + 0.75 + Math.sin(t * 1.4) * 0.08;
        book.position.set(0, by, 0); book.rotation.set(0.15 + Math.sin(t * 0.9) * 0.04, t * 0.25, Math.sin(t * 1.1) * 0.04);
        setBookOpen(book, 1); book.userData.turn.visible = false;
        bookGlow(book, 0.8 + 0.2 * Math.sin(t * 2.3), 0x7fd8ff);
        altar.userData.runeMat.opacity = 0.45 + 0.25 * Math.sin(t * 2);
        runes.update(V(0, by + 0.2, 0), t, sstep(0, 1.5, tau), st.camera, { speed: 0.35, bob: 0.2, tilt: 0.25 });
        updateParticles(dust, (s) => { const y = (s[1] * 14 + t * (0.1 + s[3] * 0.15)) % 14; const r = 2.2 * Math.sqrt(s[0]) * (1 - y / 30); return [Math.cos(s[2] * 6.28 + t * 0.1) * r, y, Math.sin(s[2] * 6.28 + t * 0.1) * r]; });
        updateParticles(motes, (s) => { const life = (t * (0.15 + s[3] * 0.2) + s[4]) % 1; const a = s[0] * 6.28 + life * 3; const r = 0.3 + s[1] * 0.5 + life * 0.6; return [Math.cos(a) * r, by + 0.1 + life * 2.6, Math.sin(a) * r]; });
        motes.material.opacity = 0.9 * sstep(7.5, 8.5, tau) + 0.3;
        if (tau < 4.5) {
          const u = tau / 4.5;
          st.cam(kf(u, [[0, [0.5, 11.5, 8.5]], [1, [1.2, 4.8, 7.6]]], easeInOut), [0, kf(u, [[0, 2.5], [1, by]]), 0], 50, 0.0, [0, 0], 0.05, 200);
        } else if (tau < 8) {
          const u = (tau - 4.5) / 3.5, a = lerp(1.35, 0.25, easeInOut(u));
          st.cam([Math.cos(a) * 4.6, 2.3 + u * 0.3, Math.sin(a) * 4.6], [0, by - 0.1, 0], 46, 0.0, [0, 0], 0.05, 200);
        } else {
          const u = (tau - 8) / 3;
          st.cam(kf(u, [[0, [0.4, by + 1.8, 1.9]], [1, [0.15, by + 1.15, 1.0]]], easeInOut), [0, by, 0], 40, 0.03, [0, 0], 0.02, 200);
        }
        return S;
      },
    };
  },
};
