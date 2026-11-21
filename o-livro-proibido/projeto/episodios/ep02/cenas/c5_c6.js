// CENA 5 — O SELO (52–64 s): Kael usa o livro para selar a criatura e encontra a runa de Zareth.
// CENA 6 — A PÁGINA ARRANCADA (64–73 s): Zareth no penhasco com a última página.
import { kf, lerp, clamp, sstep, win, easeInOut, easeOut, easeIn, shake, impulse } from '../../../motor/base.js';
import { glow, sparkle, rays, magicCircle, rune, speedLines } from '../../../motor/desenho.js';
import { correntes, aura, poeira } from '../../../motor/efeitos.js';
import { exclamacao } from '../../../motor/balao.js';
import { kael, morvath, eldrin, zareth, cajado } from '../../../personagens/magos.js';
import { criatura } from '../../../personagens/criatura.js';
import { camara, penhasco } from '../../../cenarios/fundos.js';
import { livro, altar, paginaRasgada } from '../../../cenarios/objetos.js';

const ALT = [540, 1470];
const EV = { ergue: 52.4, selo: 55.0, suga: 56.6, flash: 58.6, simbolo: 61.6, percebe: 62.8 };

export const c5 = {
  nome: 'O selo', inicio: 52, fim: 64,
  criar(st) {
    const K = kael(), M = morvath(), E = eldrin();
    function poses(t) {
      const up = sstep(EV.ergue, EV.ergue + 0.6, t) * (1 - sstep(EV.flash + 0.2, EV.flash + 0.8, t));
      K.reset(); K.x = 540; K.y = 1720; K.s = 1.12; K.capaVento = 1.2 * up + 0.3;
      K.bracos(lerp(0.35, 2.5, up), lerp(1.55, 0.3, up), lerp(0.35, 2.5, up), lerp(1.55, 0.3, up));
      K.olhar = [0, -0.9 * up]; K.exp = up > 0.3 ? 'determinado' : 'preocupado'; K.boca = up > 0.3 && t < EV.flash ? 'grito' : 'reta';
      if (t > EV.flash + 0.3) { K.squash = 0.06; K.olhar = [0, 0.7]; }
      if (t > EV.percebe) { K.exp = 'choque'; K.boca = 'o'; K.olhar = [0, 0.4]; K.brilhoOlhos = 0.6; }
      M.reset(); M.x = 170; M.y = 1660; M.s = 1.05; M.brilhoOlhos = 1;
      E.reset(); E.x = 910; E.y = 1660; E.s = 1.05; E.maoE = cajado(0.6); E.bracos(0.35, 0.6, 0.3, 0.6);
      const calma = sstep(EV.flash + 0.6, EV.flash + 1.2, t);
      M.olhar = [lerp(0.6, 1, calma), lerp(-0.6, 0, calma)]; E.olhar = [lerp(-0.6, -1, calma), lerp(-0.6, 0, calma)];
      M.exp = calma > 0.5 ? 'preocupado' : 'choque'; E.exp = calma > 0.5 ? 'preocupado' : 'choque'; M.boca = 'reta'; E.boca = 'reta';
    }
    return {
      desenhar(t) {
        poses(t);
        const sel = sstep(EV.selo, EV.selo + 0.8, t), sug = easeIn(clamp((t - EV.suga) / (EV.flash - EV.suga)));
        const [kx, ky] = K.cabeca();
        const hands = () => { const a = K.mao(-1), b = K.mao(1); return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; };
        let cam;
        if (t < 55) cam = [kx, lerp(ky + 80, ky + 20, (t - 52) / 3), lerp(1.4, 1.6, (t - 52) / 3)];
        else if (t < EV.flash) cam = [540, 1250, 0.92];
        else if (t < 61) cam = [540, 1350, 1.0];
        else if (t < EV.percebe) { const [hx, hy] = hands(); cam = [hx, hy - 10, lerp(3.2, 3.6, (t - 61) / 1.8)]; }
        else cam = [kx, ky + 30, lerp(2.4, 2.7, (t - EV.percebe) / 1.2)];
        st.setCam(cam[0], cam[1], cam[2], 0, shake(t, win(t, EV.selo, EV.selo + 0.3, EV.flash - 0.2, EV.flash) * 0.8 + impulse(t, EV.flash, 1.6), 24));
        camara(st, t, 0.85 * (1 - sstep(EV.flash, EV.flash + 1, t)));
        st.mundo(c => {
          const [bx, by] = hands();
          if (t < EV.flash) {
            const s = lerp(1.05, 0.02, sug);
            magicCircle(c, ALT[0], 1560, 560, '#7fd8ff', sel, t, 9, 0.28);
            criatura(c, lerp(ALT[0], bx, sug * sug), lerp(ALT[1], by + 380 * s, sug * sug), s, t, { olhos: 1 - sug * 0.5, boca: win(t, EV.selo, EV.selo + 0.3, EV.suga, EV.suga + 0.5) * 0.9, raiva: 1, alpha: 1 - sstep(0.85, 1, sug) });
            correntes(c, lerp(ALT[0], bx, sug), lerp(ALT[1] - 380, by, sug), 380 * (1 - sug * 0.9), 260 * (1 - sug * 0.9), t, sel * (1 - sstep(0.9, 1, sug)));
          }
          altar(c, ALT[0], 1700, 0.8, t < EV.flash ? '#7fd8ff' : '#6fd8ff', 0.8);
          M.draw(c, t); E.draw(c, t); K.draw(c, t);
          const up = sstep(EV.ergue, EV.ergue + 0.6, t) * (1 - sstep(EV.flash + 0.2, EV.flash + 0.8, t));
          if (up > 0.05 && t < EV.flash + 0.8) rays(c, bx, by, Math.PI, 7, 900, 500, '#9fe8ff', up * 0.35, t, 11);
          livro(c, bx, by - 10, 0.45, t, { brilho: 1, cor: t > EV.simbolo ? '#c8a0ff' : '#7fd8ff', flutuar: false, simbolo: sstep(EV.simbolo, EV.simbolo + 0.8, t) });
          if (t < EV.flash) aura(c, bx, by, 160, '#bfefff', t, up);
          exclamacao(c, kx + 110, ky - 70, t - EV.percebe - 0.1, '#c070ff');
        });
        st.overlay('#e6f8ff', win(t, EV.flash - 0.05, EV.flash, EV.flash + 0.05, EV.flash + 0.5));
        if (t > EV.percebe) st.camada(0, c => speedLines(c, 540, 960, 60, 450, 1400, 0.35, t, '#e6c8ff'));
      },
    };
  },
};

export const c6 = {
  nome: 'A página arrancada', inicio: 64, fim: 73,
  criar(st) {
    const Z = zareth();
    function pose(t) {
      Z.reset(); Z.x = 420; Z.y = 1540; Z.s = 1.3; Z.capaVento = 1.4;
      const ergue = sstep(67.2, 68.2, t);
      Z.bracos(0.3, 0.3, lerp(0.5, 2.5, ergue), lerp(1.1, 0.2, ergue));
      Z.maoD = (c, side, tt) => paginaRasgada(c, 0, -60, 0.55, tt, 0.5 + ergue * 0.5, 0.1);
      const olha = sstep(70.0, 70.6, t);
      Z.olhar = [lerp(0.5, -0.2, olha), lerp(0.5, 0, olha)];
      Z.exp = olha > 0.5 ? 'malicia' : 'normal'; Z.boca = olha > 0.5 ? 'sorrisoMal' : 'reta';
      Z.brilhoOlhos = sstep(70.8, 72.2, t);
    }
    return {
      desenhar(t) {
        pose(t);
        const [hx, hy] = Z.cabeca();
        let cam;
        if (t < 67) cam = kf(t, [[64, [540, 1050, 0.95]], [67, [520, 1150, 1.1]]], easeInOut);
        else if (t < 70) cam = kf(t, [[67, [460, 1150, 1.4]], [70, [470, 1020, 1.6]]], easeInOut);
        else cam = [hx, hy + 20, lerp(2.4, 3.2, easeIn(clamp((t - 70) / 3)))];
        st.setCam(cam[0], cam[1], cam[2]);
        penhasco(st, t);
        st.mundo(c => {
          Z.draw(c, t);
          const [px, py] = Z.mao(1), ergue = sstep(67.2, 68.2, t);
          for (let i = 0; i < 8; i++) { const an = i / 8 * Math.PI * 2 + t * 1.5; rune(c, px + Math.cos(an) * 170, py - 60 + Math.sin(an) * 90, 15, 400 + i, '#ff4a3a', ergue); }
          if (t > 70.8) for (const sd of [-1, 1]) glow(c, hx + sd * 26 * Z.s, hy - 4 * Z.s, 50, '#ff2a1a', Z.brilhoOlhos * 0.8);
          glow(c, hx + 34 * Z.s, hy + 22 * Z.s, 70, '#c070ff', 0.4 + sstep(70.5, 72, t) * 0.6);
        });
        st.overlay('#2a0010', sstep(71.5, 73, t) * 0.35);
      },
    };
  },
};
