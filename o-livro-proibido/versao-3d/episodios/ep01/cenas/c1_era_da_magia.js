// CENA 1 — A ERA DA MAGIA: sobrevoo lento do reino, torres de magos com cristais.
import { V, kf, lerp, sstep, easeInOut, linear, updateParticles } from '../../../motor/base.js';
import { buildKingdom } from '../../../cenarios/exterior.js';

export default {
  nome: 'A era da magia', inicio: 0, fim: 11,
  criar(st) {
    const K = buildKingdom();
    const T = K.towers[0];
    return {
      atualizar(t) {
        K.clouds.forEach(c => { c.position.x += 0; c.material.rotation = 0; });
        K.clouds.forEach((c, i) => { c.position.x = (c.userData.x0 ??= c.position.x) + t * c.userData.vx; });
        K.towers.forEach((w, i) => {
          w.crystal.rotation.y = t * 0.6 + i; w.crystal.position.y = w.baseY + Math.sin(t * 1.2 + i) * 1.5;
          w.glow.position.copy(w.crystal.position); w.light.position.copy(w.crystal.position);
          w.glow.material.opacity = 0.65 + 0.15 * Math.sin(t * 3 + i);
        });
        updateParticles(K.motes, (s) => [lerp(-300, 300, s[0]) + Math.sin(t * 0.3 + s[3] * 6) * 10, 40 + s[1] * 160 + Math.sin(t * 0.5 + s[4] * 6) * 5, lerp(-500, 200, s[2])]);
        if (t < 6) {
          const u = t / 6;
          st.cam(kf(u, [[0, [250, 185, 330]], [1, [175, 150, 150]]], linear), kf(u, [[0, [0, 75, -150]], [1, [20, 95, -160]]], easeInOut), 50, lerp(0.04, 0.0, u), [0, 0], 1, 6000);
        } else {
          const u = (t - 6) / 5;
          const c = T.crystal.position, a = lerp(1.05, 0.45, easeInOut(u)), R = lerp(52, 44, u);
          st.cam([c.x + Math.cos(a) * R, c.y + lerp(6, 2, u), c.z + Math.sin(a) * R], [c.x - 14, c.y - lerp(14, 6, u), c.z - 10], 55, -0.03, [0, 0], 1, 6000);
        }
        return K.scene;
      },
    };
  },
};
