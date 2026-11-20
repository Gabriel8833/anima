// CENA 1 — A ERA DA MAGIA (0–11 s): sobrevoo do reino.
// CENA 2 — O LIVRO SAGRADO (11–22 s): biblioteca subterrânea e o livro flutuando.
import { kf, lerp, sstep, win, easeInOut, linear } from '../../../motor/base.js';
import { sparkle } from '../../../motor/desenho.js';
import { poeira } from '../../../motor/efeitos.js';
import { reino, biblioteca } from '../../../cenarios/fundos.js';
import { livro } from '../../../cenarios/objetos.js';

export const c1 = {
  nome: 'A era da magia', inicio: 0, fim: 11,
  criar(st) {
    return {
      desenhar(t) {
        const [x, y, z] = t < 6
          ? kf(t, [[0, [180, 760, 0.72]], [6, [520, 980, 1.0]]], easeInOut)
          : kf(t, [[6, [520, 980, 1.0]], [11, [560, 1020, 1.5]]], easeInOut);
        st.setCam(x, y, z, lerp(-0.03, 0.02, t / 11));
        reino(st, t);
        st.camada(0, c => poeira(c, 0, 0, 1080, 1920, t, '#fff6d8', 0.5, 30, 1));
      },
    };
  },
};

export const c2 = {
  nome: 'O livro sagrado', inicio: 11, fim: 22,
  criar(st) {
    return {
      desenhar(t) {
        const tau = t - 11;
        const [x, y, z, r] = kf(tau, [[0, [540, 640, 1.0, 0]], [4.5, [540, 1160, 1.2, 0.02]], [8, [560, 1150, 1.6, -0.02]], [11, [540, 1185, 2.7, 0]]], easeInOut);
        st.setCam(x, y, z, r);
        const brilho = 0.85 + 0.15 * Math.sin(t * 2.4) + sstep(7.5, 9, tau) * 0.3;
        biblioteca(st, t, { livroFn: c => livro(c, 540, 1180, 1, t, { brilho, cor: '#7fd8ff' }) });
      },
    };
  },
};
