// CENA 1 — O MUNDO DO AMANHÃ (0–14 s) · CENA 2 — AS SIRENES (14–28 s) · CENA 3 — A VIDA NO ABRIGO (28–44 s)
import { kf, lerp, clamp, sstep, win, easeInOut, easeOut, shake, impulse } from '../../../motor/base.js';
import { glow, sparkle, vgrad, shape, rrect, circle } from '../../../motor/desenho.js';
import { exclamacao } from '../../../motor/balao.js';
import { faixa } from '../../../motor/extras.js';
import { voce, paiRetro, maeRetro, supervisora, atomito, roboProfessor, pulsotec, bolo } from '../../../personagens/abrigo.js';
import { cidadeRetro, carroRetro, tvComercial, montanhaAbrigo, portaAbrigo, interiorAbrigo } from '../../../cenarios/retro.js';
import { cogumeloNuclear } from '../../../cenarios/mundo.js';

export const c1 = {
  nome: 'O mundo do amanhã', inicio: 0, fim: 14,
  criar(st) {
    const K = voce('crianca'), P = paiRetro(), M = maeRetro();
    return {
      desenhar(t) {
        if (t < 7) {
          st.setCam(lerp(380, 640, t / 7), 1280, 1.0);
          cidadeRetro(st, t);
          st.mundo(c => {
            carroRetro(c, -500 + t * 330, 1650, 0.9, { cor: '#e85a6a', roda: t * 8 });
            carroRetro(c, 1700 - t * 280, 1810, 0.95, { cor: '#5ac8d0', roda: -t * 8 });
            atomito(c, lerp(1100, 860, t / 7), 1560, 0.75, t, { acena: 1 });
            for (const [p, x0, dx] of [[P, 120, 60], [K, 260, 60], [M, 380, 60]]) {
              p.reset(); p.x = x0 + t * dx; p.y = 1560; p.s = p === K ? 0.72 : 0.95; p.walk = t * 6; p.olhar = [0.7, 0]; p.exp = 'feliz'; p.boca = 'sorriso';
              if (p === K) { p.jump = Math.abs(Math.sin(t * 6)) * 14; p.boca = 'aberta'; p.olhar = [0.9, -0.3]; }
              p.draw(c, t);
            }
          });
          return;
        }
        // comercial de TV da AtomLar
        st.setCam(540, 960, 1);
        const c = st.c;
        const z = lerp(1.15, 1.0, easeOut(clamp((t - 7) / 1.2)));
        c.save(); c.translate(540, 960); c.scale(z, z); c.translate(-540, -960);
        tvComercial(c, t, cc => {
          vgrad(cc, 130, 450, 660, 580, [[0, '#9ad8d8'], [1, '#f2e8c8']]);
          shape(cc, k => { k.moveTo(100, 1030); k.quadraticCurveTo(460, 700, 820, 1030); k.closePath(); }, '#8aa86a', { stroke: null });
          cc.save(); cc.translate(460, 1030); cc.scale(0.42, 0.42); cc.translate(-540, -1500); portaAbrigo(cc, 540, 1500, 0.95, t); cc.restore();
          atomito(cc, 260, 1010, 0.42, t, { acena: 1 });
          for (const [p, x] of [[P, 560], [M, 640], [K, 720]]) { p.reset(); p.x = x; p.y = 1010; p.s = p === K ? 0.3 : 0.38; p.exp = 'feliz'; p.boca = 'aberta'; p.bracos(0.3, 0.2, p === K ? 2.4 : 0.3, 0.2); p.draw(cc, t); }
          cc.save(); cc.textAlign = 'center'; cc.fillStyle = '#c0302a'; cc.font = '900 58px Inter, sans-serif'; cc.fillText('ABRIGOS ATOMLAR', 460, 540); cc.fillStyle = '#2a4a6a'; cc.font = '700 34px Inter, sans-serif'; cc.fillText('O FUTURO É SUBTERRÂNEO!', 460, 590); cc.restore();
          for (let i = 0; i < 5; i++) sparkle(cc, 200 + i * 130, 640 + Math.sin(t * 3 + i) * 20, 14, '#ffffff', 0.8);
        });
        c.restore();
      },
    };
  },
};

export const c2 = {
  nome: 'As sirenes', inicio: 14, fim: 28,
  criar(st) {
    const K = voce('crianca'), P = paiRetro(), M = maeRetro();
    const FECHA = [25.2, 27.2], FLASH = 26.6;
    return {
      desenhar(t) {
        const alarme = sstep(14.3, 15, t);
        if (t < 17.5) {
          st.setCam(380, 1300, lerp(1.4, 1.6, (t - 14) / 3.5), 0, shake(t, 0.15));
          cidadeRetro(st, t);
          st.mundo(c => {
            for (const [p, x] of [[P, 220], [K, 380], [M, 540]]) { p.reset(); p.x = x; p.y = 1560; p.s = p === K ? 0.72 : 0.95; p.olhar = [0, -0.8]; p.exp = 'choque'; p.boca = 'o'; if (p === K) { p.bracos(0.4, 0.2, 1.2, 0.4); } p.draw(c, t); }
            const [hx, hy] = K.cabeca(); exclamacao(c, hx + 80, hy - 60, t - 14.6, '#ff4a2a');
          });
          st.overlay('#ff2a1a', alarme * 0.18 * (Math.sin(t * 8) > 0 ? 1 : 0.3));
          return;
        }
        const k = easeInOut(clamp((t - FECHA[0]) / (FECHA[1] - FECHA[0])));
        const flash = t > FLASH ? Math.exp(-(t - FLASH) * 2) : 0;
        st.setCam(lerp(360, 540, sstep(17.5, 23, t)), lerp(1300, 1200, sstep(22, 25, t)), lerp(1.0, 1.2, sstep(23, 26, t)), 0, shake(t, impulse(t, FLASH + 0.3, 1.4, 1.0) + 0.1));
        montanhaAbrigo(st, t, { alarme: 0.6 + flash * 0.4, flash: flash * 0.8 });
        st.camada(0.15, c => cogumeloNuclear(c, 930, 1250, 0.4, clamp((t - FLASH - 0.2) / 3), t));
        st.mundo(c => {
          portaAbrigo(c, 540, 1500, k, t);
          atomito(c, 840, 1520, 0.6, t, { acena: 1, feliz: 0 });
          const u = clamp((t - 17.5) / 7.6);
          [[P, -60], [M, -200], [K, -330]].forEach(([p, off], i) => {
            p.reset(); p.s = p === K ? 0.72 : 0.95; p.y = 1540; p.x = lerp(-300 + off, 540, Math.min(1, u * 1.15 - i * 0.05)); p.walk = t * 12; p.lean = 0.12;
            p.exp = 'medo'; p.boca = 'grito'; p.olhar = [0.9, 0]; p.bracos(1.0, 1.4, 1.0, 1.4);
            const entra = clamp((t - (24.2 + i * 0.5)) / 0.6); p.alpha = 1 - entra; p.s *= 1 - entra * 0.3;
            if (p.alpha > 0.01) p.draw(c, t);
          });
        });
        st.overlay('#ffffff', flash * 0.9);
        st.overlay('#ff2a1a', 0.12 * (Math.sin(t * 8) > 0 ? 1 : 0.3) * (1 - flash));
      },
    };
  },
};

export const c3 = {
  nome: 'A vida no abrigo', inicio: 28, fim: 44,
  criar(st) {
    const K = voce('crianca'), J = voce('adulto'), A = voce('adulto'), P = paiRetro(), M = maeRetro(), S = supervisora();
    return {
      desenhar(t) {
        if (t < 31.5) {
          st.setCam(lerp(420, 600, (t - 28) / 3.5), 1300, 1.25);
          interiorAbrigo(st, t, { sala: 'corredor' });
          st.mundo(c => { for (const [p, x0] of [[P, 200], [K, 380], [M, 540]]) { p.reset(); p.x = x0 + (t - 28) * 70; p.y = 1600; p.s = p === K ? 0.72 : 0.95; p.walk = t * 6; p.olhar = [0.6, -0.3]; p.exp = p === K ? 'choque' : 'preocupado'; p.boca = p === K ? 'o' : 'reta'; p.draw(c, t); } });
          return;
        }
        if (t < 35) {
          st.setCam(560, 1200, 1.2);
          interiorAbrigo(st, t, { sala: 'aula' });
          st.mundo(c => {
            roboProfessor(c, 880, 1520, 1.0, t);
            K.reset(); K.s = 0.8; K.x = 380; K.y = 1620; K.olhar = [0.6, -0.5]; K.exp = t > 33.4 ? 'preocupado' : 'normal'; K.boca = 'reta';
            K.bracos(0.2, 0.1, lerp(0.2, 2.7, win(t, 32.2, 32.6, 33.2, 33.6)), 0.2); K.draw(c, t);
          });
          return;
        }
        if (t < 38.5) {
          // aniversário de 16 anos: você ganha o PulsoTec
          st.setCam(540, 1250, 1.3);
          interiorAbrigo(st, t, { sala: 'corredor' });
          st.mundo(c => {
            rrect(c, 360, 1440, 360, 30, 8, '#c8b8a0'); bolo(7)(c, 540, 1440, t);
            for (const [p, x] of [[P, 150], [M, 930]]) { p.reset(); p.x = x; p.y = 1640; p.s = 0.95; p.exp = 'feliz'; p.boca = 'aberta'; const pal = Math.abs(Math.sin(t * 9)); p.bracos(0.5, 1.6 + pal * 0.4, 0.5, 1.6 + pal * 0.4); p.olhar = [x < 540 ? 0.8 : -0.8, 0]; p.draw(c, t); }
            J.reset(); J.s = 0.92; J.x = 420; J.y = 1650; J.olhar = [0, 0.3]; const ganha = sstep(36.4, 36.8, t);
            J.bracos(lerp(0.2, 1.2, ganha), lerp(0.1, 1.6, ganha), 0.2, 0.1); J.maoE = ganha > 0.5 ? pulsotec() : null; J.exp = ganha > 0.5 ? 'feliz' : 'normal'; J.boca = ganha > 0.5 ? 'aberta' : 'sorriso'; J.draw(c, t);
            S.reset(); S.x = 690; S.y = 1650; S.s = 0.95; S.olhar = [-0.8, 0]; S.exp = 'feliz'; S.boca = 'sorriso'; S.bracos(0.2, 0.1, lerp(1.2, 0.3, sstep(36.4, 37, t)), 0.4); S.maoD = t < 36.5 ? pulsotec() : null; S.draw(c, t);
            if (t > 36.6) for (let i = 0; i < 6; i++) sparkle(c, 420 + Math.cos(i + t * 3) * 120, 1380 + Math.sin(i * 1.4 + t * 3) * 80, 14, '#ffd23a', win(t, 36.6, 36.8, 37.8, 38.3));
          });
          return;
        }
        // 20 anos depois: a água está acabando
        const nivel = sstep(39, 43.5, t);
        st.setCam(560, lerp(1200, 1150, (t - 38.5) / 5.5), lerp(1.05, 1.2, (t - 38.5) / 5.5));
        interiorAbrigo(st, t, { sala: 'agua', alarme: 0.2 + nivel * 0.75 });
        st.mundo(c => {
          A.reset(); A.x = 220; A.y = 1660; A.s = 1.05; A.maoE = pulsotec(); A.olhar = [0.6, -0.6]; A.exp = nivel > 0.5 ? 'medo' : 'preocupado'; A.boca = nivel > 0.5 ? 'o' : 'reta'; A.suor = nivel; A.draw(c, t);
          S.reset(); S.x = 880; S.y = 1660; S.s = 1.0; S.olhar = [-0.6, -0.6]; S.exp = 'preocupado'; S.boca = 'reta'; S.draw(c, t);
        });
      },
    };
  },
};
