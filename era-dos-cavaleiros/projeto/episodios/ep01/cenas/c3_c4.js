// CENA 3 — O SONHO DE SER CAVALEIRO (25–38 s) e CENA 4 — O TREINAMENTO (38–51 s)
import { kf, lerp, clamp, sstep, win, easeInOut, easeOut, easeIn, shake, impulse } from '../../../motor/base.js';
import { sparkle, star5, glow, rrect, shape, speedLines } from '../../../motor/desenho.js';
import { exclamacao } from '../../../motor/balao.js';
import { balaoPensamento, tontura } from '../../../motor/extras.js';
import { voce, cavaleiro, mestre, espada, espadaMadeira, escudo, lancaBandeira } from '../../../personagens/pessoas.js';
import { cavalo, SELA } from '../../../personagens/cavalo.js';
import { estrada, patio, boneco } from '../../../cenarios/medieval.js';

const olhosBrilhando = (c, P, t, a) => { if (a <= 0) return; const [hx, hy] = P.cabeca(); for (const s of [-1, 1]) star5(c, hx + s * 26 * P.s, hy - 4 * P.s, 16 * P.s * (1 + 0.15 * Math.sin(t * 10)), '#ffe04a', { lw: 3, alpha: a }); };

export const c3 = {
  nome: 'O sonho', inicio: 25, fim: 38,
  criar(st) {
    const C = voce('crianca'), K = cavaleiro('mentor'), SONHO = voce('cavaleiro');
    return {
      desenhar(t) {
        const kx = lerp(1500, -500, clamp((t - 28.2) / 5.6));
        let cam;
        if (t < 28.5) cam = [380, 1280, lerp(1.5, 1.6, (t - 25) / 3.5)];
        else if (t < 33) cam = [lerp(560, 440, (t - 28.5) / 4.5), 1260, 0.95];
        else cam = [330, 1150, lerp(1.35, 1.5, (t - 33) / 5)];
        st.setCam(cam[0], cam[1], cam[2]);
        estrada(st, t);
        st.mundo(c => {
          // menino na cerca
          C.reset(); C.s = 0.78; C.x = 330; C.y = 1500;
          const encanto = sstep(29.4, 29.8, t) * (1 - sstep(33.2, 33.6, t));
          if (t < 27.8) { C.olhar = [Math.sin(t) * 0.3, 0.2]; C.exp = 'normal'; C.boca = 'reta'; C.bracos(0.6, 1.4, 0.6, 1.4); }
          else if (t < 33.2) { C.olhar = [Math.max(-0.9, Math.min(0.9, (kx - 330) / 400)), 0]; C.exp = encanto > 0.5 ? 'feliz' : 'choque'; C.boca = encanto > 0.5 ? 'aberta' : 'o'; C.jump = encanto * Math.abs(Math.sin(t * 8)) * 18; C.bracos(lerp(0.3, 2.4, encanto), 0.2, lerp(0.3, 2.4, encanto), 0.2); }
          else {
            const pop = sstep(35.6, 35.9, t), punho = sstep(36.4, 36.8, t);
            C.olhar = [0.3, -0.7 * (1 - pop)]; C.exp = punho > 0.5 ? 'determinado' : (pop > 0.5 ? 'preocupado' : 'feliz'); C.boca = punho > 0.5 ? 'sorriso' : (pop > 0.5 ? 'reta' : 'aberta');
            C.headTilt = pop > 0 && punho < 0.5 ? Math.sin(t * 16) * 0.1 : 0;
            C.bracos(0.2, 0.1, lerp(0.3, 2.7, punho), lerp(0.2, 0.9, punho));
          }
          C.draw(c, t);
          olhosBrilhando(c, C, t, t > 28.5 && t < 33.2 ? encanto : 0);
          const [hx, hy] = C.cabeca(); exclamacao(c, hx + 90, hy - 60, t - 27.8);
          // o cavaleiro passa a cavalo
          if (t > 28.2 && t < 34) cavalo(c, kx, 1660, 0.95, t, { fase: t * 6, galope: 0, flip: -1, manta: '#2f5ab8', montaria: (cc) => {
            K.reset(); K.x = SELA[0]; K.y = SELA[1] + 150; K.semPernas = true; K.capaVento = 0.6; K.bracos(0.3, 0.8, 0.5, 1.4); K.maoD = lancaBandeira('#2f5ab8');
            K.olhar = [0.6, 0.2]; K.headTilt = win(t, 30.3, 30.6, 31.0, 31.3) * 0.2; K.exp = 'normal'; K.boca = 'sorriso'; K.draw(cc, t);
          } });
          // o sonho no balão de pensamento
          const ab = sstep(33.6, 34.2, t) * (1 - sstep(35.6, 35.8, t));
          balaoPensamento(c, 520, 860, 300, t, ab, cc => {
            cc.fillStyle = '#fff6d0'; cc.fillRect(-400, -300, 800, 600); glow(cc, 0, -60, 300, '#ffd060', 0.6);
            cavalo(cc, -30, 170, 0.6, t, { fase: t * 8, galope: 1, manta: '#c0302a', cor: '#f2ece2', montaria: (c2) => { SONHO.reset(); SONHO.x = SELA[0]; SONHO.y = SELA[1] + 150; SONHO.semPernas = true; SONHO.capacete = true; SONHO.capaVento = 1; SONHO.bracos(0.3, 0.8, 2.6, 0.2); SONHO.maoD = espada(0, 0.6); SONHO.exp = 'feliz'; SONHO.boca = 'aberta'; SONHO.draw(c2, t); } });
            for (let i = 0; i < 5; i++) sparkle(cc, -220 + i * 110, -170 + (i % 2) * 40, 18, '#ffd23a', 0.9);
          });
          if (t > 35.6 && t < 36.2) for (let i = 0; i < 10; i++) sparkle(c, 520 + Math.cos(i) * 260 * (t - 35.4) * 2, 860 + Math.sin(i) * 160 * (t - 35.4) * 2, 20, '#ffffff', 1 - (t - 35.6) / 0.6);
        });
      },
    };
  },
};

export const c4 = {
  nome: 'O treinamento', inicio: 38, fim: 51,
  criar(st) {
    const J = voce('jovem'), A = voce('cavaleiro'), T = mestre();
    const HITS = [39.0, 39.7, 40.4, 41.1], CLASH = [41.9, 42.5];
    return {
      desenhar(t) {
        let cam, sh = 0;
        if (t < 41.5) cam = [540, 1300, 1.25];
        else if (t < 44.5) cam = [560, 1300, 1.3];
        else if (t < 47.5) cam = [lerp(200, 900, (t - 44.5) / 3), 1300, 1.05];
        else cam = [560, 1270, lerp(1.3, 1.45, (t - 47.5) / 3.5)];
        sh = HITS.reduce((s, h) => s + impulse(t, h, 0.4, 0.3), 0) + CLASH.reduce((s, h) => s + impulse(t, h, 0.6, 0.3), 0) + impulse(t, 43.2, 1.2) + impulse(t, 48.6, 0.8);
        st.setCam(cam[0], cam[1], cam[2], 0, shake(t, sh));
        patio(st, t);
        st.mundo(c => {
          if (t < 41.5) {
            const ph = ((t - 38.3) / 0.7) % 1, hit = HITS.reduce((m, h) => Math.max(m, win(t, h - 0.05, h, h + 0.15, h + 0.5)), 0);
            boneco(c, 660, 1640, 1.0, t, hit);
            J.reset(); J.s = 0.9; J.x = 400; J.y = 1640; J.maoD = espadaMadeira(lerp(-0.5, 1.6, Math.min(1, ph * 2.2))); J.bracos(0.3, 0.4, lerp(2.6, 1.2, Math.min(1, ph * 2.2)), 0.2);
            J.exp = 'determinado'; J.boca = hit > 0.3 ? 'grito' : 'reta'; J.olhar = [0.8, 0]; J.lean = hit * 0.08; J.draw(c, t);
            T.reset(); T.x = 920; T.y = 1640; T.flip = -1; T.bracos(0.6, 2.1, 0.6, 2.1); T.olhar = [0.8, 0]; T.exp = 'normal'; T.boca = 'reta'; T.headTilt = Math.sin(t * 3) * 0.06; T.draw(c, t);
            if (hit > 0.5) for (let i = 0; i < 5; i++) sparkle(c, 640 + Math.cos(i * 1.3) * 60, 1470 + Math.sin(i * 1.3) * 50, 14, '#e8c870', hit);
          } else if (t < 44.5) {
            const queda = sstep(43.0, 43.3, t) * (1 - sstep(44.2, 44.5, t));
            const g = Math.sin((t - 41.5) * 7);
            J.reset(); J.s = 0.9; J.x = 400 - queda * 60; J.y = 1640; J.maoD = espadaMadeira(lerp(0.2, 1.3, (g + 1) / 2)); J.bracos(0.3, 0.4, lerp(1.4, 2.4, (g + 1) / 2), 0.3);
            J.lean = -queda * 1.2; J.squash = queda * 0.15; J.exp = queda > 0.5 ? 'fechado' : 'determinado'; J.boca = queda > 0.5 ? 'o' : 'reta'; J.olhar = [0.8, 0]; J.draw(c, t);
            T.reset(); T.x = 700; T.y = 1640; T.flip = -1; T.maoD = espadaMadeira(lerp(1.3, 0.2, (g + 1) / 2) + sstep(42.8, 43.1, t) * 0.8); T.bracos(0.3, 0.4, lerp(2.4, 1.4, (g + 1) / 2), 0.3); T.olhar = [0.8, 0];
            T.exp = t > 43.3 ? 'feliz' : 'determinado'; T.boca = t > 43.3 ? 'aberta' : 'reta'; T.draw(c, t);
            for (const tc of CLASH) if (t > tc && t < tc + 0.3) for (let i = 0; i < 5; i++) sparkle(c, 555 + Math.cos(i * 1.3) * 50, 1330 + Math.sin(i * 1.3) * 50, 20, '#ffe04a', 1 - (t - tc) / 0.3);
            const [hx, hy] = J.cabeca(); tontura(c, hx, hy - 90, t, queda);
          } else if (t < 47.5) {
            // aprendendo a montar
            const x = lerp(-100, 1250, (t - 44.5) / 3);
            T.reset(); T.x = 540; T.y = 1580; T.s = 0.85; T.bracos(0.6, 2.1, 0.6, 2.1); T.olhar = [Math.max(-0.9, Math.min(0.9, (x - 540) / 300)), 0]; T.exp = 'feliz'; T.boca = 'aberta'; T.draw(c, t);
            cavalo(c, x, 1700, 0.95, t, { fase: t * 9, galope: 0.7, cor: '#9a6a3a', crina: '#3a2618', manta: '#9a7a52', enfeite: '#e8dcb0', montaria: (cc, bob) => {
              J.reset(); J.x = SELA[0]; J.y = SELA[1] + 150; J.semPernas = true; J.lean = Math.sin(t * 14) * 0.18; J.jump = Math.abs(Math.sin(t * 9)) * 30; J.bracos(0.8, 1.0, 0.8, 1.0); J.exp = 'medo'; J.boca = 'grito'; J.suor = 1; J.draw(cc, t);
            } });
          } else {
            // vestindo a armadura (pesada!)
            const peito = clamp((t - 47.8) / 0.4), elmo = clamp((t - 48.3) / 0.35), vestido = t > 48.65;
            const P = vestido ? A : J;
            P.reset(); P.s = 1.0; P.x = 560; P.y = 1640; P.capacete = vestido;
            const peso = vestido ? sstep(48.7, 49.2, t) : 0;
            P.lean = Math.sin(t * 3.2) * 0.16 * peso; P.squash = 0.08 * peso; P.tremor = 0.5 * peso; P.suor = peso; P.bracos(0.25, 0.1, 0.25, 0.1);
            P.exp = vestido ? 'medo' : 'normal'; P.boca = vestido ? 'tremendo' : 'reta'; P.olhar = vestido ? [0, 0] : [0, -0.8];
            P.draw(c, t);
            if (!vestido) {
              if (peito < 1) rrect(c, 500, lerp(700, 1380, easeIn(peito)), 120, 150, 20, '#b8c0cc', { lw: 6 });
              rrect(c, 515, lerp(500, 1210, easeIn(elmo)) - 40, 90, 90, 40, '#c3cad4', { lw: 6 });
            }
            T.reset(); T.x = 900; T.y = 1640; T.flip = -1; T.olhar = [0.8, 0]; T.exp = t > 49 ? 'feliz' : 'normal'; T.boca = t > 49 ? 'aberta' : 'sorriso'; T.bracos(0.4, 1.8, 0.4, 1.8); T.jump = t > 49 ? Math.abs(Math.sin(t * 10)) * 10 : 0; T.draw(c, t);
          }
        });
      },
    };
  },
};
