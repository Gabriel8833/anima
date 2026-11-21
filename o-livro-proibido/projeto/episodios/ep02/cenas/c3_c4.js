// CENA 3 — O CÉU VERMELHO (24–36 s): o feitiço se espalha pelo reino.
// CENA 4 — A CRIATURA (36–52 s): a sombra sai do livro; os três magos lutam juntos, mas ela fica mais forte.
import { kf, lerp, clamp, sstep, win, easeInOut, easeOut, easeIn, shake, impulse } from '../../../motor/base.js';
import { glow, sparkle } from '../../../motor/desenho.js';
import { raio, flashRaio, orbeNegro, escudo, explosao, feixe, fumaca, poeira, aura } from '../../../motor/efeitos.js';
import { kael, morvath, eldrin, cajado } from '../../../personagens/magos.js';
import { criatura } from '../../../personagens/criatura.js';
import { reino, camara } from '../../../cenarios/fundos.js';
import { livro, altar, vela } from '../../../cenarios/objetos.js';

export const c3 = {
  nome: 'O céu vermelho', inicio: 24, fim: 36,
  criar(st) {
    return {
      desenhar(t) {
        const vr = sstep(24.3, 31.5, t), sg = sstep(25.5, 29, t);
        const cam = kf(t, [[24, [520, 980, 1.0]], [30, [540, 820, 0.88]], [36, [560, 1040, 1.55]]], easeInOut);
        const fl = Math.max(flashRaio(t - 31.5), flashRaio(t - 33.8), flashRaio(t - 35.0));
        st.setCam(cam[0], cam[1], cam[2], 0, shake(t, fl * 0.6));
        reino(st, t, 0, { vermelho: vr, sigilo: sg });
        st.camada(0.75, c => {
          raio(c, 640, -300, 560, 1000, 3, flashRaio(t - 31.5), '#ff8a6a');
          raio(c, 300, -300, 380, 1050, 8, flashRaio(t - 33.8), '#ff8a6a');
          raio(c, 900, -300, 760, 1050, 12, flashRaio(t - 35.0), '#ff8a6a');
        });
        st.overlay('#ffffff', fl * 0.25);
      },
    };
  },
};

const ALT = [540, 1470];         // base da criatura (atrás do altar)
const EV = { surge: 36.3, olhos: 38.4, ruge: 38.8, orbe: 39.3, absorve: 40.2, golpe: 43.6, feixes: 45.4, quebra: 48.6, voa: 50.3 };
export const c4 = {
  nome: 'A criatura', inicio: 36, fim: 52,
  criar(st) {
    const K = kael(), M = morvath(), E = eldrin();
    const escala = t => lerp(0, 0.85, easeOut(clamp((t - EV.surge) / 2.1))) + 0.08 * sstep(EV.absorve, EV.absorve + 0.4, t) + 0.2 * sstep(EV.quebra, EV.quebra + 0.6, t);
    function poses(t) {
      const susto = win(t, EV.ruge, EV.ruge + 0.2, EV.ruge + 0.8, EV.ruge + 1.3), queda = win(t, EV.quebra, EV.quebra + 0.15, EV.quebra + 0.8, EV.quebra + 1.4);
      const fe = win(t, EV.feixes - 0.3, EV.feixes, 47.9, 48.5);
      M.reset(); M.x = 170; M.y = 1660; M.s = 1.05; M.brilhoOlhos = 1; M.capaVento = 1;
      const th = win(t, EV.orbe - 0.5, EV.orbe - 0.2, EV.orbe + 0.3, EV.orbe + 0.7);
      M.bracos(lerp(0.2, 2.6, th), 0, lerp(lerp(0.2, 2.6, th), 1.9, fe), lerp(0, 0.3, fe));
      M.olhar = [0.6, -0.6]; M.exp = t > EV.absorve && t < 42 ? 'choque' : 'raiva'; M.boca = t > EV.absorve && t < 42 ? 'o' : 'dentes';
      E.reset(); E.x = 910; E.y = 1660; E.s = 1.05; E.capaVento = 1; E.maoE = cajado(0.6 + win(t, 42.6, 43, 44.6, 45) * 0.8);
      E.bracos(lerp(0.3, 1.9, win(t, 42.6, 43, 44.6, 45)), lerp(0.5, 0.2, win(t, 42.6, 43, 44.6, 45)), lerp(0.3, 1.9, fe), lerp(0.6, 0.3, fe));
      E.olhar = [-0.6, -0.6]; E.exp = 'determinado'; E.boca = fe > 0.3 ? 'grito' : 'reta';
      K.reset(); K.x = 540; K.y = 1720; K.s = 1.12; K.capaVento = 1;
      const pega = sstep(EV.voa + 0.6, EV.voa + 1.0, t);
      K.bracos(lerp(lerp(0.2, 2.5, fe), 0.8, pega), lerp(lerp(0.1, 0.2, fe), 1.2, pega), lerp(lerp(0.2, 2.5, fe), 0.8, pega), lerp(lerp(0.1, 0.2, fe), 1.2, pega));
      K.olhar = [0, -0.9]; K.exp = susto > 0.3 || queda > 0.3 ? 'choque' : 'determinado'; K.boca = fe > 0.3 ? 'grito' : (susto > 0.3 ? 'aberta' : 'reta');
      for (const P of [M, E, K]) { P.lean = (P === M ? -1 : P === E ? 1 : 0) * (susto * 0.12 + queda * 0.25); P.jump = queda * 50; P.squash = susto * 0.05; }
    }
    return {
      desenhar(t) {
        poses(t);
        const s = escala(t), cy = ALT[1] - 380 * s;
        const sh = impulse(t, EV.ruge, 1.4, 0.8) + impulse(t, EV.golpe, 2.0) + impulse(t, EV.quebra, 2.2) + win(t, EV.feixes, EV.feixes + 0.2, 47.8, 48.3) * 0.5;
        let cam;
        if (t < 39) cam = kf(t, [[36, [540, 1300, 1.05]], [39, [540, 1180, 0.9]]], easeInOut);
        else if (t < 42) cam = [lerp(360, 420, (t - 39) / 3), 1280, 1.1];
        else if (t < 45) cam = [540, 1300, 0.95];
        else if (t < 48) cam = [540, 1250, lerp(0.92, 1.0, (t - 45) / 3)];
        else cam = kf(t, [[48, [540, 1200, 0.85]], [50.3, [540, 1250, 0.9]], [52, [540, 1380, 1.35]]], easeInOut);
        st.setCam(cam[0], cam[1], cam[2], 0, shake(t, sh, 24));
        camara(st, t, 0.85);
        st.mundo(c => {
          criatura(c, ALT[0], ALT[1], s, t, { olhos: sstep(EV.olhos, EV.olhos + 0.3, t), boca: Math.max(win(t, EV.ruge, EV.ruge + 0.2, EV.ruge + 0.9, EV.ruge + 1.3), win(t, EV.quebra - 0.2, EV.quebra, 49.6, 50.2)), raiva: sstep(EV.absorve, EV.absorve + 0.5, t), alpha: sstep(EV.surge, EV.surge + 0.6, t) });
          if (t > EV.absorve && t < EV.absorve + 0.8) glow(c, ALT[0], cy, 500, '#a020ff', (1 - (t - EV.absorve) / 0.8) * 0.8);
          altar(c, ALT[0], 1700, 0.8, '#ff2a1a', 0.8);
          // o livro voa até as mãos de Kael
          const v = clamp((t - EV.voa) / 0.9), [kx, ky] = K.cabeca();
          if (t < EV.voa + 0.9) livro(c, lerp(ALT[0], kx, easeInOut(v)), lerp(1420, ky + 150, easeInOut(v)) - Math.sin(v * Math.PI) * 150, lerp(0.7, 0.45, v), t, { brilho: 1, cor: v > 0 ? '#7fd8ff' : '#ff3a2a' });
          M.draw(c, t); E.draw(c, t); K.draw(c, t);
          if (t > EV.voa + 0.9) livro(c, kx, ky + 150, 0.45, t, { brilho: 1, cor: '#7fd8ff', flutuar: false });
          // esfera de Morvath absorvida
          const [mhx, mhy] = M.mao(-1);
          if (t > EV.orbe - 0.5 && t < EV.absorve) { const u = clamp((t - EV.orbe) / (EV.absorve - EV.orbe)); orbeNegro(c, lerp(mhx, ALT[0], u), lerp(mhy - 60, cy, u), lerp(70, 20, u * u), t, 1); }
          // escudo de Eldrin protegendo os três
          escudo(c, 540, 1730, 560, t, win(t, 42.7, 43.1, 44.7, 45.1), t - EV.golpe, Math.PI * 1.5);
          // três feixes combinados
          const fe = win(t, EV.feixes, EV.feixes + 0.25, 47.8, EV.quebra);
          const alvo = [ALT[0], cy + 20];
          feixe(c, ...M.mao(1), ...alvo, '#ff2a3a', fe, t, 34);
          feixe(c, ...E.mao(1), ...alvo, '#ffc040', fe, t, 34);
          const [k1x, k1y] = K.mao(-1), [k2x, k2y] = K.mao(1);
          feixe(c, (k1x + k2x) / 2, (k1y + k2y) / 2, ...alvo, '#58b4ff', fe, t, 40);
          explosao(c, alvo[0], alvo[1], 260, t - EV.quebra, ['#ffffff', '#ff6a8a', '#7a1aa8']);
          poeira(c, -200, 300, 1500, 1400, t * 2, '#ff9a7a', 0.6, 30, 9);
        });
      },
    };
  },
};
