// CENA 1 — O ENCONTRO (0–12 s): os três seguem o rastro roxo até o penhasco; Zareth os espera.
// CENA 2 — A REVELAÇÃO (12–24 s): a página projeta no céu o feitiço que exige os quatro magos.
// CENA 3 — TRAIÇÃO E ESCOLHA (24–38 s): Morvath rouba a página, a sombra o domina, Kael o salva.
import { kf, lerp, clamp, sstep, win, easeInOut, easeOut, shake, impulse } from '../../../motor/base.js';
import { glow, sparkle, rune, magicCircle } from '../../../motor/desenho.js';
import { fumaca, correntes, explosao, aura } from '../../../motor/efeitos.js';
import { exclamacao } from '../../../motor/balao.js';
import { kael, morvath, eldrin, zareth, cajado } from '../../../personagens/magos.js';
import { penhasco } from '../../../cenarios/fundos.js';
import { paginaRasgada } from '../../../cenarios/objetos.js';

const GY = 1500;
const pagina = (k = 0.6) => (c, side, t) => paginaRasgada(c, 0, -60, 0.45, t, k, 0.1);
const SIMB = [['#58b4ff', Math.PI], ['#ff2a3a', -Math.PI / 2], ['#ffc040', 0], ['#a040ff', Math.PI / 2]];
const ACENDE = [16.6, 17.3, 18.0, 18.7];

export default {
  nome: 'Encontro, revelação e escolha', inicio: 0, fim: 38,
  criar(st) {
    const K = kael(), M = morvath(), E = eldrin(), Z = zareth();
    function poses(t) {
      // posições de chegada
      const wk = clamp((t - 0.4) / 4.6);
      K.reset(); K.s = 1.0; K.y = GY; K.x = lerp(-150, 450, easeOut(wk));
      E.reset(); E.s = 1.0; E.y = GY; E.x = lerp(-380, 250, easeOut(wk)); E.maoE = cajado(0.5); E.bracos(0.35, 0.6, 0.3, 0.6);
      M.reset(); M.s = 1.0; M.y = GY; M.x = lerp(-620, 60, easeOut(wk)); M.brilhoOlhos = 1;
      Z.reset(); Z.s = 1.0; Z.y = GY; Z.x = 880; Z.capaVento = 1;
      if (t < 5) for (const P of [K, E, M]) P.walk = t * 8;
      for (const P of [K, E, M]) P.olhar = [0.9, 0];
      K.exp = 'determinado'; E.exp = 'determinado'; M.exp = 'raiva';
      Z.olhar = [-0.9, 0]; Z.exp = t > 6.3 ? 'malicia' : 'normal'; Z.boca = t > 6.3 ? 'sorrisoMal' : 'reta';
      // Zareth ergue a página (cena 2)
      const ergue = sstep(12.6, 13.4, t) * (1 - sstep(25.4, 25.7, t));
      Z.bracos(0.3, 0.3, lerp(0.5, 2.5, ergue), lerp(1.1, 0.2, ergue)); Z.maoD = t < 25.6 ? pagina(0.5 + ergue * 0.5) : null;
      if (t > 20) { K.olhar = [0.7, -0.4]; E.olhar = [0.7, -0.4]; }
      // Morvath cobiça a página
      if (t > 22) { M.exp = 'malicia'; M.boca = 'sorrisoMal'; M.olhar = [1, -0.3]; }
      // cena 3: Morvath se teletransporta e rouba a página
      const some = sstep(24.3, 24.7, t), volta = sstep(24.9, 25.3, t);
      if (t > 24.3) { M.alpha = t < 24.9 ? 1 - some : volta; if (t > 24.9) M.x = 690; }
      if (t > 25.6) {
        const alto = sstep(25.6, 26.2, t);
        M.bracos(0.3, 0.1, lerp(1.3, 2.6, alto), 0.1); M.maoD = pagina(1);
        M.boca = t < 28.6 ? 'dentes' : 'grito'; M.exp = t < 29.4 ? 'malicia' : 'medo';
        const dom = sstep(28.2, 30, t) * (1 - sstep(35.3, 35.8, t));
        M.tremor = dom; M.brilhoOlhos = 1 + dom;
        const solta = sstep(34.6, 35.2, t);
        M.bracoE = { a: lerp(0.3, 1.5, solta), b: lerp(0.1, -0.05, solta) };
        if (t > 35.6) { M.exp = t > 36.8 ? 'feliz' : 'preocupado'; M.boca = t > 36.8 ? 'sorriso' : 'reta'; M.squash = 0.1 * (1 - sstep(36.6, 37.6, t)); M.brilhoOlhos = 0.5; }
        const empurra = win(t, 25.6, 25.8, 26.3, 27); Z.lean = empurra * 0.35; Z.jump = empurra * 60; Z.exp = empurra > 0.2 ? 'choque' : Z.exp; Z.boca = empurra > 0.2 ? 'o' : Z.boca;
        Z.x = lerp(880, 960, sstep(25.6, 26.2, t));
        // Kael corre e estende a mão
        const corre = clamp((t - 31.2) / 1.2);
        K.x = lerp(450, 545, easeOut(corre)); if (t > 31.2 && t < 32.4) K.walk = t * 12;
        const mao = sstep(32.4, 33.0, t);
        K.bracoD = { a: lerp(0.15, 1.5, mao), b: lerp(0.1, -0.05, mao) };
        K.exp = t > 29.4 && t < 31.2 ? 'choque' : 'determinado'; K.boca = t > 31.2 && t < 35.2 ? 'aberta' : (t > 36.8 ? 'sorriso' : 'reta');
        if (t > 36.8) K.exp = 'feliz';
        E.exp = t > 29.4 && t < 36 ? 'choque' : 'determinado';
      }
    }
    return {
      desenhar(t) {
        poses(t);
        const [mx, my] = M.cabeca(), [zx, zy] = Z.cabeca(), [kx, ky] = K.cabeca();
        const contato = [(K.mao(1)[0] + M.mao(-1)[0]) / 2, (K.mao(1)[1] + M.mao(-1)[1]) / 2];
        let cam;
        if (t < 6) cam = kf(t, [[0, [300, 1170, 0.95]], [6, [480, 1200, 0.85]]], easeInOut);
        else if (t < 9) cam = [zx - 80, zy + 150, lerp(1.8, 2.0, (t - 6) / 3)];
        else if (t < 12) cam = [340, 1230, lerp(1.15, 1.25, (t - 9) / 3)];
        else if (t < 16) cam = kf(t, [[12, [760, 1150, 1.3]], [14.4, [760, 1100, 1.3]], [16, [560, 760, 1.0]]], easeInOut);
        else if (t < 20) cam = [540, 720, lerp(1.0, 1.08, (t - 16) / 4)];
        else if (t < 22) cam = [330, 1240, 1.6];
        else if (t < 24) cam = [mx + 60, my + 150, 2.0];
        else if (t < 27) cam = [600, 1200, 0.9];
        else if (t < 31) cam = [mx, my + 200, lerp(1.5, 1.8, (t - 27) / 4)];
        else if (t < 35) cam = [640, 1240, 1.35];
        else if (t < 36.2) cam = [contato[0], contato[1], 2.4];
        else cam = [630, 1200, 1.5];
        const dom = sstep(28.2, 30, t) * (1 - sstep(35.3, 35.8, t));
        st.setCam(cam[0], cam[1], cam[2], 0, shake(t, dom * 0.6 + impulse(t, 25.6, 1.2) + impulse(t, 35.3, 1.6), 24));
        penhasco(st, t, { largo: true, sigilo: 1 - sstep(13.6, 15, t) * (1 - sstep(23.6, 24.4, t)) * 0.85 });
        st.mundo(c => {
          // rastro roxo
          for (let i = 0; i < 12; i++) { const px = -300 + i * 100; glow(c, px, GY + 10, 40, '#b066ff', 0.5 * (1 - sstep(10, 12, t)) * (0.6 + 0.4 * Math.sin(t * 4 + i))); }
          // círculo do feitiço no céu
          const circ = sstep(13.6, 15, t) * (1 - sstep(23.6, 24.4, t));
          if (circ > 0) {
            magicCircle(c, 540, 640, 330, '#fff0c0', circ, t * 0.5, 31);
            SIMB.forEach(([cor, an], i) => { const k = sstep(ACENDE[i], ACENDE[i] + 0.3, t) * circ, sx = 540 + Math.cos(an) * 330, sy = 640 + Math.sin(an) * 330; glow(c, sx, sy, 140, cor, k); rune(c, sx, sy, 40, 900 + i, cor, Math.max(0.25 * circ, k), 8); });
          }
          if (t > 24.3 && t < 25.5) fumaca(c, 60, GY - 60, 220, t, win(t, 24.3, 24.5, 24.9, 25.4) * 1.2);
          if (t > 24.8 && t < 26) fumaca(c, 690, GY - 60, 220, t, win(t, 24.8, 25.0, 25.5, 26));
          // sombra dominando Morvath
          if (dom > 0) { glow(c, 690, GY - 250, 420, '#ff1020', dom * 0.7); fumaca(c, 690, GY - 40, 320, t * 1.5, dom, '#200008', 7); }
          M.draw(c, t); E.draw(c, t); K.draw(c, t); Z.draw(c, t);
          if (dom > 0) correntes(c, 690, GY - 230, 170, 140, t, dom, '#ff2a1a', 3);
          if (t > 32.4 && t < 35.3) { const [hx, hy] = K.mao(1); glow(c, hx, hy, 140, '#58b4ff', sstep(32.4, 33, t)); }
          if (t > 35.1) { glow(c, contato[0], contato[1], 260 * win(t, 35.1, 35.3, 35.8, 36.6), '#ffffff', 1); }
          explosao(c, 690, GY - 300, 230, t - 35.35, ['#ffd0d0', '#7a1020', '#200008']);
          if (t > 25.4 && t < 26) glow(c, 880, GY - 300, 200, '#c070ff', win(t, 25.4, 25.6, 25.7, 26));
          exclamacao(c, kx + 100, ky - 70, t - 29.5);
          if (t > 36.6) aura(c, 620, GY - 300, 260, '#fff6c8', t, sstep(36.6, 37.2, t) * 0.6, 14, 2);
        });
        st.overlay('#ff1000', dom * (0.08 + 0.05 * Math.sin(t * 18)));
      },
    };
  },
};
