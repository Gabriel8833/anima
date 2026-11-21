// CENA 1 — O RASTRO (0–12 s): a última página fica em branco; rastro de luz roxa; Kael fecha o livro.
// CENA 2 — O CONFRONTO (12–24 s): Morvath surge da fumaça, Eldrin entra; os dois querem o livro.
import { kf, lerp, clamp, sstep, win, easeInOut, easeOut, shake, mix } from '../../../motor/base.js';
import { glow, sparkle, rune } from '../../../motor/desenho.js';
import { energiaVermelha, fumaca, portal, poeira, aura } from '../../../motor/efeitos.js';
import { exclamacao, interrogacao } from '../../../motor/balao.js';
import { kael, morvath, eldrin, cajado } from '../../../personagens/magos.js';
import { camara } from '../../../cenarios/fundos.js';
import { livro, livroFechado, altar, vela } from '../../../cenarios/objetos.js';

const LIVRO = [760, 1150];
const segura = (k) => (c, side, t) => livroFechado(c, -46, -30, 0.42, t, { brilho: 0.4 + k * 0.4 });

export const c1 = {
  nome: 'O rastro', inicio: 0, fim: 12,
  criar(st) {
    const K = kael();
    return {
      desenhar(t) {
        const red = 1 - sstep(0.3, 3.0, t);
        K.reset(); K.x = 470; K.y = 1600; K.s = 1.25;
        if (t < 10) { K.bracos(0.2, 0.1, 0.2, 0.1); }
        else { K.bracos(0.35, 1.55, 0.35, 1.55); K.maoD = segura(sstep(10.2, 10.8, t)); }
        K.olhar = t < 7 ? [Math.sin(t * 2.2) * 0.6, -0.1] : [0.9, 0.3];
        K.headTilt = t > 3.6 && t < 5 ? Math.sin(t * 14) * 0.08 : 0;
        K.exp = t < 9.2 ? (t > 5.6 && t < 5.72 ? 'fechado' : 'preocupado') : 'choque';
        K.boca = t < 9.2 ? 'reta' : (t < 10.4 ? 'o' : 'reta');
        if (t > 10.4) { K.exp = 'determinado'; K.olhar = [0, 0]; }
        let cam;
        if (t < 3.6) cam = [LIVRO[0], LIVRO[1] - 30, lerp(2.5, 2.2, t / 3.6)];
        else if (t < 7) { const [hx, hy] = K.cabeca(); cam = [hx + 60, hy + 120, lerp(1.7, 1.9, (t - 3.6) / 3.4)]; }
        else if (t < 10) cam = kf(t, [[7, [620, 1350, 1.4]], [9.2, [900, 1340, 1.45]], [10, [700, 1260, 1.4]]], easeInOut);
        else { const [hx, hy] = K.cabeca(); cam = [hx, hy + 160, 1.7]; }
        st.setCam(cam[0], cam[1], cam[2]);
        camara(st, t, red * 0.8);
        st.mundo(c => {
          for (let i = 0; i < 5; i++) vela(c, 80 + i * 240, 540 + (i % 2) * 120, 0.75, t, mix('#7fd0ff', '#ff3a2a', red), i);
          altar(c, LIVRO[0], 1600, 1, mix('#6fd8ff', '#ff2a1a', red), 0.8);
          // rastro de pegadas roxas até a parede, e resto de portal
          const tr = sstep(6.6, 7.6, t);
          for (let i = 0; i < 7; i++) { const px = 840 + i * 70, py = 1640 + (i % 2) * 24; glow(c, px, py, 50, '#b066ff', tr * (0.5 + 0.5 * Math.sin(t * 4 + i))); sparkle(c, px, py - 10, 10, '#e6c8ff', tr); }
          portal(c, 1080, 1250, 90, 140, t, tr * (0.25 + 0.1 * Math.sin(t * 9)));
          K.draw(c, t);
          if (t < 10) {
            energiaVermelha(c, LIVRO[0], LIVRO[1] - 20, t, red, 600);
            livro(c, LIVRO[0], LIVRO[1], 1, t, { brilho: 0.6 + red * 0.5, cor: red > 0.4 ? '#ff3a2a' : '#c8b0ff', tinta: 1 - sstep(0.6, 3.0, t) });
            for (let i = 0; i < 8; i++) { const u = clamp((t - 0.6 - i * 0.2) / 2.2); rune(c, LIVRO[0] + 40 + i * 14 + Math.sin(i + t) * 40, LIVRO[1] - 20 - u * 420, 13, 300 + i, '#ff4a3a', Math.sin(u * Math.PI)); }
          }
          const [cx, cy] = K.cabeca();
          interrogacao(c, cx + 100, cy - 80, t - 4.2);
          exclamacao(c, cx + 110, cy - 70, t - 9.25);
          if (t > 10.2) aura(c, cx, cy + 300, 120, '#9fd8ff', t, sstep(10.2, 10.8, t) * 0.6);
        });
      },
    };
  },
};

export const c2 = {
  nome: 'O confronto', inicio: 12, fim: 24,
  criar(st) {
    const K = kael(), M = morvath(), E = eldrin();
    function poses(t) {
      K.reset(); K.x = 540; K.y = 1620; K.s = 1.2; K.bracos(0.35, 1.55, 0.35, 1.55); K.maoD = segura(1);
      K.exp = t < 13.2 ? 'determinado' : 'choque'; K.boca = t < 13.2 ? 'reta' : 'o';
      K.olhar = t < 13.2 ? [0, 0] : [Math.sin((t - 13) * (t > 21 ? 9 : 2)) * 0.9, 0];
      if (t > 21) { K.exp = 'medo'; K.boca = 'tremendo'; K.suor = 1; K.tremor = sstep(22.5, 23.5, t) * 0.6; }
      M.reset(); M.x = 170; M.y = 1620; M.s = 1.15; M.alpha = sstep(12.3, 13.0, t); M.brilhoOlhos = 1; M.capaVento = 0.6;
      const ped = sstep(15.2, 15.8, t);
      M.bracos(0.2, 0.1, lerp(0.2, 1.5, ped), lerp(0.1, -0.1, ped)); M.olhar = [0.8, 0];
      M.exp = 'malicia'; M.boca = t > 15.5 && t < 18 ? (Math.sin(t * 14) > 0 ? 'dentes' : 'sorrisoMal') : 'sorrisoMal';
      E.reset(); E.s = 1.15; E.y = 1620; E.x = lerp(1250, 910, easeOut(clamp((t - 12.4) / 2.0)));
      if (t > 12.4 && t < 14.4) E.walk = (t - 12.4) * 8;
      const pare = sstep(18.2, 18.7, t);
      E.bracos(lerp(0.3, 1.4, pare), lerp(0.6, 0.05, pare), 0.3, 0.6); E.maoE = null; E.maoD = null; E.maoE = cajado(0.5 + pare * 0.4);
      E.bracos(0.35, 0.6, lerp(0.3, 1.45, pare), lerp(0.6, 0.0, pare));
      E.olhar = [-0.8, 0]; E.exp = 'determinado'; E.boca = t > 18.4 && t < 21 ? (Math.sin(t * 12) > 0 ? 'aberta' : 'reta') : 'reta';
    }
    return {
      desenhar(t) {
        poses(t);
        let cam;
        if (t < 15) cam = kf(t, [[12, [540, 1240, 0.95]], [15, [540, 1260, 1.02]]], easeInOut);
        else if (t < 18) { const [hx, hy] = M.cabeca(); cam = [hx + 120, hy + 150, lerp(1.8, 2.0, (t - 15) / 3)]; }
        else if (t < 21) { const [hx, hy] = E.cabeca(); cam = [hx - 120, hy + 150, lerp(1.8, 2.0, (t - 18) / 3)]; }
        else { const [hx, hy] = K.cabeca(); cam = [hx, hy + 170, lerp(1.6, 1.85, (t - 21) / 3)]; }
        const tremor = sstep(22.3, 24, t);
        st.setCam(cam[0], cam[1], cam[2], 0, shake(t, tremor * 0.9, 26));
        camara(st, t, 0);
        st.mundo(c => {
          for (let i = 0; i < 5; i++) vela(c, 80 + i * 240, 540 + (i % 2) * 120, 0.75, t, '#7fd0ff', i);
          fumaca(c, 170, 1560, 260, t, 0.9 * (1 - sstep(13.5, 15, t)) + 0.4);
          M.draw(c, t); E.draw(c, t); K.draw(c, t);
          const [mx, my] = M.mao(1); glow(c, mx, my, 80, '#ff2a3a', sstep(15.2, 15.8, t));
          const [ex, ey] = E.mao(1); glow(c, ex, ey, 70, '#ffd060', sstep(18.2, 18.7, t));
          const [cx, cy] = K.cabeca(); exclamacao(c, cx + 110, cy - 70, t - 13.2);
          poeira(c, -100, 300, 1300, 1300, t * 3, '#d8c8b8', tremor, 30, 6);
        });
        st.overlay('#ff1000', tremor * (0.1 + 0.08 * Math.sin(t * 20)));
      },
    };
  },
};
