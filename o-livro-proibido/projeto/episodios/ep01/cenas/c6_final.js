// CENA 6 — O FINAL MISTERIOSO (61–73 s): a porta abre, o livro aberto, a página vira sozinha, energia vermelha, olhos de Kael.
import { kf, lerp, clamp, sstep, win, easeInOut, easeOut, easeIn, shake, mix } from '../../../motor/base.js';
import { glow, sparkle, vgrad, rrect, circle } from '../../../motor/desenho.js';
import { energiaVermelha, poeira } from '../../../motor/efeitos.js';
import { kael } from '../../../personagens/magos.js';
import { camara } from '../../../cenarios/fundos.js';
import { livro, altar, portaPedra, vela } from '../../../cenarios/objetos.js';

const EV = { abre: [61.4, 63.8], anda: [64.2, 66.6], vira: [68.9, 70.2], vermelho: 69.7, olhos: 70.6, preto: 73.0 };
const LIVRO = [760, 1150];
const orbeLuz = (k) => (c) => { if (k <= 0) return; glow(c, 0, -20, 110 * k, '#58b4ff', 0.9); circle(c, 0, -20, 18 * k, '#e6f6ff', { lw: 4 }); };

export default {
  nome: 'O final misterioso', inicio: 61, fim: 73,
  criar(st) {
    const K = kael();
    function poseKael(t) {
      K.reset(); K.s = 1.25; K.y = 1600;
      if (t < 64.2) { K.x = 540; K.y = 1560; K.s = lerp(0.95, 1.05, (t - 61) / 3.2); K.exp = 'determinado'; K.boca = 'reta'; K.bracos(0.6, 1.2, 0.15, 0.1); K.maoE = orbeLuz(1); return; }
      const wk = clamp((t - EV.anda[0]) / (EV.anda[1] - EV.anda[0]));
      K.x = lerp(-120, 470, easeOut(wk));
      if (t < EV.anda[1]) K.walk = (t - EV.anda[0]) * 9;
      K.maoE = orbeLuz(1 - sstep(66.2, 66.8, t));
      K.bracos(lerp(0.6, 0.2, sstep(66.2, 66.8, t)), lerp(1.2, 0.2, sstep(66.2, 66.8, t)), 0.15, 0.1);
      K.olhar = [0.8, lerp(-0.3, 0.3, sstep(66.8, 67.6, t))];
      K.headTilt = sstep(66.8, 67.6, t) * 0.12;
      const medo = sstep(EV.vira[0] + 0.3, EV.olhos, t);
      K.exp = medo > 0.5 ? 'medo' : 'preocupado'; K.boca = medo > 0.5 ? 'tremendo' : 'reta';
      if (t > EV.olhos) { K.olhar = [0, 0]; K.headTilt = 0; K.tremor = sstep(EV.olhos, 71.5, t); K.suor = sstep(EV.olhos + 0.2, EV.olhos + 0.6, t); K.boca = 'tremendo'; }
      K.blush = 0.45 * (1 - medo * 0.6);
    }
    return {
      desenhar(t) {
        poseKael(t);
        const red = sstep(EV.vermelho - 0.3, EV.vermelho + 0.6, t);
        const vir = easeInOut(clamp((t - EV.vira[0]) / (EV.vira[1] - EV.vira[0])));
        let cam;
        if (t < 64.2) cam = [540, lerp(1150, 1100, (t - 61) / 3.2), lerp(0.95, 1.08, (t - 61) / 3.2)];
        else if (t < 66.8) cam = [lerp(330, 580, (t - 64.2) / 2.6), 1260, 1.3];
        else if (t < 68.8) cam = kf(t, [[66.8, [610, 1200, 1.45]], [68.8, [640, 1160, 1.7]]], easeInOut);
        else if (t < EV.olhos) cam = kf(t, [[68.8, [LIVRO[0], LIVRO[1] - 10, 2.2]], [EV.olhos, [LIVRO[0], LIVRO[1] - 60, 2.6]]], easeInOut);
        else { const [hx, hy] = K.cabeca(); const u = easeIn(clamp((t - EV.olhos) / (EV.preto - EV.olhos))); cam = [hx, hy - 4, lerp(2.4, 7.5, u)]; }
        st.setCam(cam[0], cam[1], cam[2], 0, shake(t, red * 0.25 + (t > 61.4 && t < 63.8 ? 0.2 : 0), 20));
        if (t < 64.2) {
          // porta se abrindo, luz do corredor atrás
          const k = easeInOut(clamp((t - EV.abre[0]) / (EV.abre[1] - EV.abre[0])));
          camara(st, t, 0);
          st.mundo(c => {
            vgrad(c, 280, 800, 520, 780, [[0, '#ffe2a8'], [1, '#ffb060']]);
            glow(c, 540, 1300, 500, '#ffd080', k * 0.8);
            K.draw(c, t);
            portaPedra(c, 540, 1580, 520, 780, k);
            rrect(c, 250, 760, 580, 60, 8, '#5a5666');
            poeira(c, 280, 800, 520, 780, t, '#ffe8c0', k, 30, 4);
          });
          st.camada(0, c => { for (let i = 0; i < 4; i++) vela(c, 90 + i * 300, 320 + (i % 2) * 80, 0.7, t, '#7fd0ff', i); });
          return;
        }
        camara(st, t, red);
        st.mundo(c => {
          for (let i = 0; i < 5; i++) vela(c, 80 + i * 240, 540 + (i % 2) * 120, 0.75, t, mix('#7fd0ff', '#ff3a2a', red), i);
          altar(c, LIVRO[0], 1600, 1, mix('#6fd8ff', '#ff2a1a', red), 0.8);
          K.draw(c, t);
          if (t > EV.olhos) { const [hx, hy] = K.cabeca(); for (const s of [-1, 1]) glow(c, hx + s * 26 * K.s, hy - 4 * K.s, 40, '#ff2a1a', 0.6 * red); }
          energiaVermelha(c, LIVRO[0], LIVRO[1] - 20, t, red, 720);
          livro(c, LIVRO[0], LIVRO[1], 1, t, { brilho: 1 + red * 0.3, cor: red > 0.5 ? '#ff3a2a' : '#7fd8ff', virar: vir });
        });
        st.overlay('#ff1000', red * 0.12 + (t > EV.olhos ? sstep(EV.olhos, EV.preto, t) * 0.15 : 0));
      },
    };
  },
};
