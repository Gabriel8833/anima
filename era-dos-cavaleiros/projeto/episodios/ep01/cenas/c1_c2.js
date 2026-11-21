// CENA 1 — SEU NASCIMENTO (0–12 s) e CENA 2 — SUA INFÂNCIA (12–25 s)
import { kf, lerp, clamp, sstep, win, easeInOut, easeOut } from '../../../motor/base.js';
import { sparkle } from '../../../motor/desenho.js';
import { exclamacao } from '../../../motor/balao.js';
import { setaVoce, iconeRiscado } from '../../../motor/extras.js';
import { voce, bebe, pai, mae, amigo, aldeao, balde, vassoura, colher, lenha, cesta, espadaMadeira } from '../../../personagens/pessoas.js';
import { vila, casaInterior, galinha } from '../../../cenarios/medieval.js';

export const c1 = {
  nome: 'Seu nascimento', inicio: 0, fim: 12,
  criar(st) {
    const V = [aldeao(0), aldeao(1), aldeao(2), aldeao(3)], P = pai(), M = mae();
    return {
      desenhar(t) {
        const cam = t < 9 ? kf(t, [[0, [540, 640, 1.0]], [5, [540, 1260, 1.0]], [9, [480, 1270, 1.05]]], easeInOut) : kf(t, [[9, [480, 1270, 1.05]], [11.2, [250, 1240, 1.9]]], easeInOut);
        st.setCam(cam[0], cam[1], cam[2]);
        vila(st, t);
        st.mundo(c => {
          galinha(c, 640, 1560, 1, t, 0); galinha(c, 760, 1590, 0.9, t, 2);
          // mãe com o bebê ("você") e o pai na porta de casa
          M.reset(); M.x = 170; M.y = 1560; M.bracos(0.45, 1.45, 0.45, 1.45); M.exp = 'feliz'; M.boca = 'sorriso'; M.olhar = [0.3, 0.6]; M.draw(c, t);
          P.reset(); P.x = 360; P.y = 1560; P.exp = t > 9.6 ? 'feliz' : 'normal'; P.boca = 'sorriso'; P.olhar = [-0.7, 0.3]; P.bracos(0.2, 0.2, lerp(0.2, 1.0, win(t, 9.6, 10, 11.5, 12)), lerp(0.2, 1.6, win(t, 9.6, 10, 11.5, 12))); P.draw(c, t);
          const [mx, my] = M.mao(1); bebe(c, mx - 40, my - 30, 1.0, t, t > 10.2 && t < 11.2 ? 1 : 0);
          setaVoce(c, mx - 50, my - 90, t, 9.3);
          // aldeões passando
          const rotas = [[-250, 1350, 1640, 0, 1], [1350, -250, 1610, 1, -1], [-300, 900, 1660, 2, 1], [1300, 600, 1590, 3, -1]];
          rotas.forEach(([x0, x1, y, i, dir], k) => {
            const h = V[k]; h.reset(); h.x = lerp(x0, x1, clamp(t / (k === 2 ? 14 : 12))); h.y = y; h.s = 0.9; h.walk = t * (k === 2 ? 5 : 7) + k; h.olhar = [dir * 0.7, 0];
            h.exp = 'normal'; h.boca = k === 1 ? 'sorriso' : 'reta'; if (k === 1) { h.maoD = cesta(); h.bracos(0.15, 0.1, 0.5, 1.2); }
            h.draw(c, t);
          });
        });
        st.camada(0, c => { iconeRiscado(c, 250, 760, 'celular', t, 6.6); iconeRiscado(c, 540, 700, 'carro', t, 7.2); iconeRiscado(c, 830, 760, 'lampada', t, 7.9); });
      },
    };
  },
};

export const c2 = {
  nome: 'Sua infância', inicio: 12, fim: 25,
  criar(st) {
    const C = voce('crianca'), P = pai(), M = mae(), F = amigo();
    return {
      desenhar(t) {
        if (t < 17) {
          // carregando baldes de água do poço, com o pai levando lenha
          const u = clamp((t - 12) / 5);
          C.reset(); C.s = 0.78; C.y = 1620; C.x = lerp(-60, 420, u); C.walk = t * 6; C.maoE = balde(); C.maoD = balde(); C.bracos(0.18, 0.05, 0.18, 0.05);
          C.exp = 'preocupado'; C.boca = 'tremendo'; C.suor = sstep(13.5, 14, t); C.tremor = 0.4; C.squash = 0.04; C.olhar = [0.6, 0.2];
          P.reset(); P.x = lerp(260, 760, u); P.y = 1600; P.walk = t * 6.5; P.maoD = lenha(); P.bracos(0.2, 0.2, 0.5, 1.3); P.olhar = [0.8, 0]; P.exp = 'normal'; P.boca = 'reta';
          if (t > 15.2) { P.olhar = [-0.9, 0]; P.boca = 'sorriso'; }
          st.setCam(C.x + 170, 1300, 1.3);
          vila(st, t);
          st.mundo(c => { P.draw(c, t); C.draw(c, t); galinha(c, 820, 1640, 0.9, t, 1); });
          return;
        }
        if (t < 21) {
          // dentro de casa: varrendo enquanto a mãe cozinha
          st.setCam(lerp(470, 500, (t - 17) / 4), 1300, 1.25);
          casaInterior(st, t);
          st.mundo(c => {
            M.reset(); M.x = 290; M.y = 1600; M.maoD = colher(Math.sin(t * 5) * 0.4); M.bracos(0.2, 0.2, 0.9, 0.9); M.olhar = [0.6, 0.3]; M.exp = 'feliz'; M.boca = 'sorriso'; M.draw(c, t);
            C.reset(); C.s = 0.78; C.x = lerp(780, 640, (t - 17) / 4); C.y = 1640; C.maoD = vassoura(Math.sin(t * 7) * 0.35); C.bracos(0.3, 0.6, 0.5, 0.9); C.olhar = [-0.5, 0.4]; C.exp = t > 19 ? 'feliz' : 'normal'; C.boca = t > 19 ? 'aberta' : 'sorriso'; C.draw(c, t);
          });
          return;
        }
        // brincando de espada de pau com o amigo
        st.setCam(540, 1300, 1.3);
        vila(st, t);
        const golpe = Math.sin((t - 21) * 6);
        st.mundo(c => {
          const gx = lerp(-150, 1250, clamp((t - 21.4) / 2.4));
          galinha(c, gx, 1700, 1.1, t * 2, 3);
          C.reset(); C.s = 0.78; C.x = 400 + golpe * 20; C.y = 1640; C.maoD = espadaMadeira(lerp(0.2, 1.2, (golpe + 1) / 2)); C.bracos(0.3, 0.3, lerp(1.2, 2.4, (golpe + 1) / 2), 0.4);
          C.jump = Math.max(0, Math.sin((t - 21) * 12)) * 16; C.exp = 'feliz'; C.boca = 'aberta'; C.olhar = [0.8, 0];
          F.reset(); F.s = 0.78; F.x = 690 - golpe * 20; F.y = 1640; F.flip = -1; F.maoD = espadaMadeira(lerp(0.2, 1.2, (1 - golpe) / 2)); F.bracos(0.3, 0.3, lerp(1.2, 2.4, (1 - golpe) / 2), 0.4);
          F.jump = Math.max(0, Math.sin((t - 21) * 12 + 1.5)) * 16; F.exp = 'feliz'; F.boca = 'aberta'; F.olhar = [0.8, 0];
          C.draw(c, t); F.draw(c, t);
          for (const tc of [22.2, 23.0, 23.8]) if (t > tc && t < tc + 0.35) for (let i = 0; i < 4; i++) sparkle(c, 545 + Math.cos(i * 1.6) * 40, 1340 + Math.sin(i * 1.6) * 40, 22, '#ffe04a', 1 - (t - tc) / 0.35);
        });
      },
    };
  },
};
