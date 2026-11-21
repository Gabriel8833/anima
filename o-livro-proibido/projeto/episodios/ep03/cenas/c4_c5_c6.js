// CENA 4 — O RITUAL (38–54 s): os quatro magos unem as magias; a criatura tenta escapar e racha em luz.
// CENA 5 — O FIM DO LIVRO (54–64 s): o livro se desfaz em páginas de luz; o céu volta ao amanhecer.
// CENA 6 — EPÍLOGO (64–74 s): os quatro magos olham o nascer do sol.
import { kf, lerp, clamp, sstep, win, easeInOut, easeOut, easeIn, shake, impulse } from '../../../motor/base.js';
import { glow, sparkle, magicCircle, rays } from '../../../motor/desenho.js';
import { feixe, explosao, paginasVoando, poeira, aura } from '../../../motor/efeitos.js';
import { kael, morvath, eldrin, zareth, cajado } from '../../../personagens/magos.js';
import { criatura } from '../../../personagens/criatura.js';
import { penhasco, reino } from '../../../cenarios/fundos.js';
import { livro, paginaRasgada } from '../../../cenarios/objetos.js';

const GY = 1500, LV = [540, 900];
const LIGA = { K: 43.2, M: 44.2, E: 45.2, Z: 46.2 };
const CORES = { K: '#58b4ff', M: '#ff2a3a', E: '#ffc040', Z: '#a040ff' };

export default {
  nome: 'Ritual, fim do livro e epílogo', inicio: 38, fim: 74,
  criar(st) {
    const P = { K: kael(), M: morvath(), E: eldrin(), Z: zareth() };
    const X = { K: 150, M: 390, E: 690, Z: 930 };
    function poses(t) {
      for (const k in P) {
        const h = P[k]; h.reset(); h.s = 0.95; h.y = GY; h.x = X[k]; h.capaVento = 1;
        const up = sstep(LIGA[k] - 0.5, LIGA[k], t) * (1 - sstep(54.2, 55.5, t));
        h.bracos(0.3, 0.3, lerp(0.3, 2.3, up), lerp(0.4, 0.3, up));
        h.olhar = [(540 - X[k]) / 500, -0.9 * up];
        const forca = win(t, 47, 47.5, 53.2, 54);
        h.tremor = forca * 0.5; h.squash = forca * 0.05;
        h.exp = forca > 0.3 ? 'raiva' : 'determinado'; h.boca = forca > 0.3 ? 'dentes' : (up > 0.5 ? 'reta' : 'reta');
        if (t > 54.5) { h.exp = 'choque'; h.boca = 'o'; h.olhar = [0, -0.6]; }
        if (t > 60.5) { h.exp = 'feliz'; h.boca = k === 'Z' ? 'sorrisoMal' : 'sorriso'; h.olhar = [(540 - X[k]) / 700, 0]; h.tremor = 0; }
      }
      P.M.brilhoOlhos = t > 60.5 ? 0.3 : 1;
      P.E.maoE = cajado(0.6 + (P.E.bracoD.a > 1 ? 0.6 : 0));
      // Kael segura o livro no começo do ritual
      if (t < 39.2) { P.K.bracos(0.35, 1.55, 0.35, 1.55); }
      if (t > 64) {
        // epílogo: Kael com a última faísca de página
        P.K.bracos(0.35, 1.55, 0.35, 1.55); P.K.olhar = [0, 0.5]; P.K.exp = t > 68.4 ? 'feliz' : 'normal'; P.K.boca = 'sorriso';
        P.K.maoD = (c, s, tt) => { const k = 1 - sstep(68, 69.4, tt); if (k > 0) paginaRasgada(c, -46, -40, 0.35 * k + 0.05, tt, 0.2, 0.05); glow(c, -46, -40, 120, '#fff2c0', 0.4 + (1 - k) * 0.6 * win(tt, 68, 68.6, 69.2, 70)); };
        if (t > 69.6) { P.K.olhar = [0, -0.2]; P.K.exp = 'feliz'; }
      }
    }
    return {
      desenhar(t) {
        poses(t);
        const am = sstep(54.6, 58, t);
        const rach = sstep(51, 53.2, t), suga = easeIn(clamp((t - 53.2) / 0.8));
        const sh = win(t, 47, 47.4, 53.4, 54) * 0.7 + impulse(t, 47.6, 1.4) + impulse(t, 54, 2.6, 0.9);
        let cam;
        if (t < 43) cam = [540, 1150, 0.85];
        else if (t < 47) cam = [540, lerp(1150, 1050, (t - 43) / 4), lerp(0.85, 0.9, (t - 43) / 4)];
        else if (t < 51) cam = [540, 1000, 0.8];
        else if (t < 54) cam = [540, lerp(1000, 920, (t - 51) / 3), lerp(0.9, 1.5, easeIn((t - 51) / 3))];
        else if (t < 57) cam = [540, 1000, 0.8];
        else if (t < 60.5) cam = kf(t, [[57, [520, 1000, 1.0]], [60.5, [540, 960, 1.15]]], easeInOut);
        else if (t < 64) cam = [540, 1240, 1.0];
        else if (t < 69.6) { const [hx, hy] = P.K.cabeca(); cam = [hx + 20, hy + 160, lerp(1.8, 2.0, (t - 64) / 5.6)]; }
        else cam = kf(t, [[69.6, [540, 1300, 1.3]], [74, [540, 1000, 0.75]]], easeOut);
        st.setCam(cam[0], cam[1], cam[2], 0, shake(t, sh, 24));
        if (t >= 57 && t < 60.5) {
          // o reino voltando às cores
          reino(st, t, 0, { vermelho: 1 - sstep(57.2, 60, t), sigilo: 1 - sstep(57, 58.4, t) });
          st.camada(0, c => poeira(c, 0, 0, 1080, 1920, t, '#fff2c0', 0.8, 50, 3));
          return;
        }
        penhasco(st, t, { largo: true, amanhecer: am, sigilo: 1 });
        st.mundo(c => {
          // círculo mágico e o livro
          const circ = sstep(40, 42, t) * (1 - sstep(54, 54.6, t));
          magicCircle(c, LV[0], LV[1], 380, '#fff0c0', circ, t, 33);
          // criatura tentando escapar
          const cs = lerp(0.9, 0.02, suga), ca = sstep(47, 47.8, t) * (1 - sstep(53.8, 54, t));
          if (ca > 0) criatura(c, lerp(LV[0], LV[0], suga), lerp(1300, LV[1] + 300 * cs, suga), cs, t, { olhos: 1, boca: win(t, 47.6, 47.9, 49, 49.6) + rach * 0.8, raiva: 1, alpha: ca, rachado: rach });
          if (t < 54) {
            const v = clamp((t - 38.8) / 2.2), [kx, ky] = P.K.cabeca();
            const lx = lerp(kx, LV[0], easeInOut(v)), ly = lerp(ky + 140, LV[1], easeInOut(v));
            livro(c, lx, ly, lerp(0.4, 0.9, v), t, { brilho: 1 + sstep(52, 54, t) * 1.5, cor: t > 53 ? '#ffffff' : '#ffe9a8' });
          }
          for (const k in P) P[k].draw(c, t);
          // feixes das quatro magias
          for (const k in P) {
            const a = sstep(LIGA[k], LIGA[k] + 0.3, t) * (1 - sstep(54, 54.3, t));
            const [hx, hy] = P[k].mao(1);
            feixe(c, hx, hy, LV[0], LV[1], CORES[k], a, t + k.charCodeAt(0), t > 47 ? 46 : 32);
          }
          explosao(c, LV[0], LV[1], 420, t - 54, ['#ffffff', '#fff2a0', '#ffd060'], { fumaca: false });
          paginasVoando(c, LV[0], LV[1], t - 54.1, 48, 1000);
          if (t > 55) poeira(c, -300, 200, 1700, 1500, t, '#fff2c0', 0.7 * (1 - sstep(66, 70, t)), 40, 12);
          if (t > 60.5) for (const k in P) { const [hx, hy] = P[k].cabeca(); if (k !== 'K' || t < 64) aura(c, hx, hy, 140, '#fff6c8', t, 0.15, 6, 3); }
          // pássaros no amanhecer (epílogo)
          if (t > 66) for (let i = 0; i < 5; i++) { const bx = ((t - 66) * 90 + i * 210) % 1500 - 200, by = 700 + Math.sin(i * 2.3) * 120, f = Math.sin(t * 10 + i) * 10; c.save(); c.strokeStyle = '#3a2a4a'; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); c.moveTo(bx - 20, by - f); c.lineTo(bx, by); c.lineTo(bx + 20, by - f); c.stroke(); c.restore(); }
        });
        if (t > 52 && t < 54) st.camada(0, c => rays(c, 540, 960, 0, 10, 1600, 1600, '#ffffff', rach * 0.25, t, 5));
      },
    };
  },
};
