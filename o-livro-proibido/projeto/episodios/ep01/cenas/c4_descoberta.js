// CENA 4 — A DESCOBERTA (34–46 s): eclipse, Kael entra no templo, toca o mapa e os símbolos azuis acendem.
import { kf, lerp, clamp, sstep, win, easeInOut, easeOut, shake } from '../../../motor/base.js';
import { glow, sparkle, rune, circle, speedLines } from '../../../motor/desenho.js';
import { aura } from '../../../motor/efeitos.js';
import { exclamacao } from '../../../motor/balao.js';
import { kael } from '../../../personagens/magos.js';
import { templo, paredeMapa } from '../../../cenarios/fundos.js';

const TOQUE = 41.3;
const MAPA = { x: 720, y: 1110, w: 560, h: 430 };
const orbeLuz = (k) => (c, side, t) => { if (k <= 0) return; glow(c, 0, -20, 120 * k, '#58b4ff', 0.9); circle(c, 0, -20, 20 * k, '#e6f6ff', { lw: 4 }); };

export default {
  nome: 'A descoberta', inicio: 34, fim: 46,
  criar(st) {
    const K = kael();
    let toque = [0.2, 0.7];
    function poseKael(t) {
      K.reset(); K.s = 1.25; K.y = 1580;
      const wk = clamp((t - 36.8) / 3.8);
      K.x = lerp(-180, 400, wk);
      if (t > 36.8 && t < 40.6) K.walk = (t - 36.8) * 9;
      const luz = win(t, 37, 37.4, 40.4, 40.9);
      K.bracos(lerp(0.15, 0.6, luz), lerp(0.1, 1.2, luz), 0.15, 0.1); K.maoE = orbeLuz(luz);
      const reach = sstep(40.5, TOQUE, t) * (1 - sstep(44.4, 45, t) * 0.5);
      K.bracoD = { a: lerp(0.15, 1.55, reach), b: lerp(0.1, -0.05, reach) };
      K.olhar = t < 40.4 ? [Math.sin(t * 1.8) * 0.8, -0.2] : [0.6, -0.2];
      K.exp = t < TOQUE + 0.25 ? 'preocupado' : 'choque'; K.boca = t < TOQUE + 0.25 ? 'reta' : (t < 43 ? 'aberta' : 'o');
      if (t > 43) { K.brilhoOlhos = 0.5 + 0.3 * Math.sin(t * 6); K.olhar = [0.3, -0.3]; }
      const hop = win(t, TOQUE + 0.25, TOQUE + 0.4, TOQUE + 0.5, TOQUE + 0.8); K.jump = hop * 30;
    }
    poseKael(TOQUE);
    { const [hx, hy] = K.mao(1); toque = [(hx - (MAPA.x - MAPA.w / 2)) / MAPA.w, (hy - (MAPA.y - MAPA.h / 2)) / MAPA.h]; }
    return {
      desenhar(t) {
        poseKael(t);
        const ecl = sstep(34.3, 36.6, t);
        const revela = t > TOQUE ? easeOut(clamp((t - TOQUE) / 2.0)) : 0;
        const marca = sstep(TOQUE + 1.6, TOQUE + 2.2, t);
        // câmera
        let cam;
        if (t < 37) cam = kf(t, [[34, [560, 300, 1.25]], [36.2, [560, 330, 1.3]], [37, [540, 900, 1.0]]], easeInOut);
        else if (t < 40) cam = [Math.max(200, K.x + 170), 1260, 1.35];
        else if (t < 43) cam = kf(t, [[40, [520, 1230, 1.35]], [41.3, [590, 1200, 1.45]], [43, [600, 1190, 1.4]]], easeInOut);
        else if (t < 44.6) { const [hx, hy] = K.cabeca(); cam = [hx + 10, hy + 10, lerp(2.2, 2.6, (t - 43) / 1.6)]; }
        else { const mx = MAPA.x - MAPA.w / 2 + 0.72 * MAPA.w, my = MAPA.y - MAPA.h / 2 + 0.3 * MAPA.h; cam = [mx, my, lerp(2.0, 3.0, easeOut((t - 44.6) / 1.4))]; }
        const shk = shake(t, win(t, TOQUE, TOQUE + 0.05, TOQUE + 0.2, TOQUE + 0.6) * 0.8);
        st.setCam(cam[0], cam[1], cam[2], 0, shk);
        templo(st, t, ecl);
        st.mundo(c => {
          paredeMapa(c, MAPA.x, MAPA.y, MAPA.w, MAPA.h, t, revela, toque, marca);
          K.draw(c, t);
          const [hx, hy] = K.mao(1);
          if (t > TOQUE) { glow(c, hx, hy, 260 * win(t, TOQUE, TOQUE + 0.1, TOQUE + 0.6, TOQUE + 1.6), '#9fe8ff', 1); aura(c, MAPA.x, MAPA.y, 300, '#9fe8ff', t, revela * 0.9, 20, 3); }
          const [cx, cy] = K.cabeca(); if (t < 43) exclamacao(c, cx + 110, cy - 70, t - TOQUE - 0.3);
          if (t > 43 && t < 44.6) for (let i = 0; i < 6; i++) sparkle(c, cx + Math.cos(i + t * 2) * 140, cy + Math.sin(i * 1.7 + t * 2) * 110, 12, '#bfefff', 0.8);
        });
        if (t > 44.6) st.camada(0, c => speedLines(c, 540, 960, 70, 420, 1400, 0.45, t));
      },
    };
  },
};
