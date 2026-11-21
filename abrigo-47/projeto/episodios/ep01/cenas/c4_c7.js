// CENA 4 — LÁ FORA (44–58 s) · CENA 5 — O ERMO (58–74 s) · CENA 6 — PORTO SUCATA (74–94 s) · CENA 7 — O SINAL (94–110,6 s)
import { kf, lerp, clamp, sstep, win, easeInOut, easeOut, easeIn, shake, impulse } from '../../../motor/base.js';
import { glow, sparkle, rays, line, vgrad, rrect } from '../../../motor/desenho.js';
import { exclamacao, interrogacao } from '../../../motor/balao.js';
import { voce, supervisora, xerifeRobo, saqueador, mutante, pulsotec, pistolaLaser, pecaBomba } from '../../../personagens/abrigo.js';
import { sobrevivente } from '../../../personagens/sobreviventes.js';
import { interiorAbrigo, portaAbrigo, ermo, carroRetro, cidadeSucata, montanhaAbrigo, hudVida, numeroFlutuante, caixaEscolha, telaPulsotec } from '../../../cenarios/retro.js';
import { lata } from '../../../personagens/sobreviventes.js';

const preparar = (A) => { A.reset(); A.mochila = true; A.maoE = pulsotec(); };

export const c4 = {
  nome: 'Lá fora', inicio: 44, fim: 58,
  criar(st) {
    const A = voce('adulto'), S = supervisora();
    return {
      desenhar(t) {
        if (t < 48) {
          st.setCam(540, 1250, lerp(1.2, 1.35, (t - 44) / 4));
          interiorAbrigo(st, t, { sala: 'corredor', alarme: 0.6 });
          st.mundo(c => {
            S.reset(); S.x = 780; S.y = 1660; S.s = 1.0; S.flip = -1; S.bracos(0.2, 0.1, lerp(0.2, 1.5, sstep(44.6, 45.1, t)), 0); S.olhar = [0.8, 0]; S.exp = 'determinado'; S.boca = win(t, 45.2, 45.3, 46.4, 46.6) > 0.5 && Math.sin(t * 14) > 0 ? 'aberta' : 'reta'; S.draw(c, t);
            preparar(A); A.x = 330; A.y = 1660; A.s = 1.05; A.olhar = [0.7, 0]; A.exp = t > 45.3 ? 'choque' : 'normal'; A.boca = t > 45.3 ? 'tremendo' : 'reta'; A.suor = sstep(46, 46.5, t); A.draw(c, t);
            const [hx, hy] = A.cabeca(); exclamacao(c, hx + 100, hy - 70, t - 45.3);
          });
          return;
        }
        if (t < 52.5) {
          // a porta se abre para a luz
          const k = 1 - easeInOut(clamp((t - 48.4) / 2.2));
          st.setCam(540, lerp(1200, 1260, (t - 48) / 4.5), lerp(1.0, 1.25, (t - 48) / 4.5));
          interiorAbrigo(st, t, { sala: 'corredor' });
          st.mundo(c => {
            vgrad(c, 340, 1110, 400, 390, [[0, '#fff6d8'], [1, '#ffe0a0']]);
            portaAbrigo(c, 540, 1500, k, t);
            glow(c, 540, 1300, 600, '#fff6d0', (1 - k) * 0.9);
            if (k < 0.8) rays(c, 540, 1180, 0, 8, 900, 400, '#fff6d0', (1 - k) * 0.35, t, 3);
            preparar(A); A.x = 540; A.y = 1720 - sstep(50.6, 52.4, t) * 40; A.s = lerp(1.1, 0.9, sstep(50.6, 52.4, t)); if (t > 50.6) A.walk = t * 5; A.olhar = [0, -0.4]; A.exp = (1 - k) > 0.6 ? 'fechado' : 'preocupado'; A.boca = 'reta';
            A.bracos(0.3, 0.3, lerp(0.3, 1.9, sstep(49.6, 50.2, t)), lerp(0.3, 2.4, sstep(49.6, 50.2, t)));
            A.draw(c, t);
          });
          st.overlay('#fff6d8', sstep(52.0, 52.5, t));
          return;
        }
        // primeira vez sob o sol
        st.setCam(lerp(540, 600, (t - 52.5) / 5.5), lerp(1300, 1150, (t - 52.5) / 5.5), lerp(1.6, 0.9, easeOut((t - 52.5) / 5.5)));
        ermo(st, t);
        st.mundo(c => {
          carroRetro(c, 960, 1700, 0.95, { cor: '#5ac8d0', ferrugem: 0.9, ang: 0.06 });
          preparar(A); A.x = 520; A.y = 1660; A.s = 1.05; A.sujo = false;
          const ve = sstep(53.4, 54.2, t);
          A.bracos(0.3, 0.3, lerp(1.9, 0.6, ve), lerp(2.4, 1.4, ve)); A.exp = ve > 0.5 ? 'choque' : 'fechado'; A.boca = ve > 0.5 ? 'aberta' : 'reta'; A.olhar = [Math.sin(t * 1.2) * 0.8 * ve, -0.3];
          A.draw(c, t);
          for (let i = 0; i < 4; i++) sparkle(c, 760 + i * 60, 520 + (i % 2) * 40, 14, '#ffffff', 0.6);
        });
        st.overlay('#fff6d8', 1 - sstep(52.5, 53.3, t));
      },
    };
  },
};

const TIROS = [66.4, 67.2, 68.0, 68.8], GOLPE = 67.6, MORTE = 69.4;
export const c5 = {
  nome: 'O Ermo', inicio: 58, fim: 74,
  criar(st) {
    const A = voce('adulto');
    return {
      desenhar(t) {
        const vida = 1 - (t > GOLPE ? 0.15 : 0);
        let cam;
        if (t < 62) cam = [lerp(300, 700, (t - 58) / 4), 1300, 1.25];
        else if (t < 66) cam = [620, 1260, lerp(1.25, 1.0, sstep(62.8, 64.6, t))];
        else cam = [600, 1260, 1.0];
        st.setCam(cam[0], cam[1], cam[2], 0, shake(t, impulse(t, 63.6, 1.2, 1.0) + impulse(t, GOLPE, 1.4) + impulse(t, MORTE, 1.0)));
        ermo(st, t);
        st.mundo(c => {
          carroRetro(c, 760, 1700, 0.95, { cor: '#e85a6a', ferrugem: 0.8, ang: -0.04 });
          const surge = sstep(63.4, 64.6, t), morto = sstep(MORTE, MORTE + 0.6, t);
          if (t > 63.2) mutante(c, 900, lerp(1950, 1700, easeOut(surge)), 1.0, t, { ataque: win(t, GOLPE - 0.3, GOLPE, GOLPE + 0.2, GOLPE + 0.5), dano: TIROS.some(h => t > h + 0.15 && t < h + 0.3) ? 1 : 0, morto });
          preparar(A); A.sujo = true; A.s = 1.05; A.y = 1680;
          A.x = t < 62 ? lerp(220, 560, (t - 58) / 4) : lerp(560, 420, sstep(64, 65, t)); if (t < 60.4 || (t > 64 && t < 65)) A.walk = t * 6;
          const pega = sstep(60.6, 61.0, t);
          A.bracoD = { a: lerp(0.2, t < 62 ? 1.3 : 1.55, pega), b: lerp(0.1, 0, pega) };
          const tiro = TIROS.reduce((m, h) => Math.max(m, win(t, h - 0.02, h, h + 0.1, h + 0.25)), 0);
          if (t > 61) A.maoD = pistolaLaser(tiro);
          A.olhar = [0.8, 0]; A.exp = t < 63.6 ? 'normal' : (t < 66 ? 'choque' : (t > MORTE + 0.5 ? 'feliz' : 'determinado')); A.boca = t < 63.6 ? 'reta' : (t < 66 ? 'grito' : (t > MORTE + 0.5 ? 'aberta' : 'dentes'));
          const levou = win(t, GOLPE, GOLPE + 0.1, GOLPE + 0.3, GOLPE + 0.6); A.lean = -levou * 0.25;
          if (t > 71) { A.bracoD = { a: 2.6, b: 0.1 }; A.jump = Math.abs(Math.sin(t * 6)) * 20; }
          A.draw(c, t);
          const [hx, hy] = A.cabeca(); exclamacao(c, hx + 100, hy - 70, t - 63.8);
          const [gx, gy] = A.mao(1);
          for (const h of TIROS) if (t > h && t < h + 0.18) { line(c, [[gx + 110, gy - 20], [880, 1560]], '#ff4a2a', 16, 0.9); line(c, [[gx + 110, gy - 20], [880, 1560]], '#fff0d0', 6); glow(c, 880, 1560, 120, '#ff4a2a', 1); }
        });
        // HUD de jogo
        st.camada(0, c => { if (t > 58.4) hudVida(c, 60, 140, vida, t); });
        TIROS.forEach(h => numeroFlutuante(st, 760, 900, '-25', t - h - 0.1));
        numeroFlutuante(st, 380, 1050, '-15', t - GOLPE - 0.1);
        numeroFlutuante(st, 760, 840, '+50 XP', t - MORTE - 0.3, '#ffb43a');
        if (t > 60.8 && t < 62.6) st.text('PISTOLA LASER +1', 540, 520, { size: 60, fill: '#ffb43a', alpha: win(t, 60.8, 61, 62.3, 62.6), lw: 12 });
        if (t > 70.2) { const k = win(t, 70.2, 70.5, 73.4, 73.9); st.text('NÍVEL 2!', 540, 600, { size: 150, fill: '#ffb43a', alpha: k, scale: 0.8 + 0.2 * Math.min(1, (t - 70.2) / 0.3) + 0.03 * Math.sin(t * 8), lw: 22, glow: 'rgba(255,180,58,0.7)' }); }
      },
    };
  },
};

export const c6 = {
  nome: 'Porto Sucata', inicio: 74, fim: 94,
  criar(st) {
    const A = voce('adulto'), T = sobrevivente(1), R = [saqueador(0), saqueador(1)], POVO = [sobrevivente(0), sobrevivente(3)];
    const ESC = 83.4, CLIQUE = 86.6, LUTA = [88.6, 89.4, 90.2], FOGEM = 91.4;
    return {
      desenhar(t) {
        const pausa = t > ESC && t < 88;
        let cam;
        if (t < 79) cam = [lerp(380, 560, (t - 74) / 5), 1270, 1.2];
        else if (t < 88) cam = [600, 1250, 0.95];
        else cam = [620, 1260, 1.05];
        st.setCam(cam[0], cam[1], cam[2], 0, shake(t, LUTA.reduce((s, h) => s + impulse(t, h, 0.7, 0.3), 0) + (t > 79.2 && t < 80 ? 0.3 : 0)));
        const tt = pausa ? ESC : t; // o mundo congela durante a escolha
        cidadeSucata(st, tt);
        st.mundo(c => {
          xerifeRobo(c, 920, 1640, 0.85, tt, { aponta: t > 79.4 ? 1 : win(t, 74.4, 74.8, 76, 76.4) });
          T.reset(); T.x = 640; T.y = 1660; T.s = 1.0; T.flip = -1; T.olhar = [0.7, 0]; T.exp = t > 79.2 && t < 92 ? 'medo' : 'feliz'; T.boca = t > 79.2 && t < 92 ? 'o' : 'sorriso';
          T.bracoD = { a: lerp(0.3, 1.3, win(t, 76.8, 77.2, 77.8, 78.2)), b: 0.1 }; T.maoD = t < 77.6 ? pecaBomba() : null; T.draw(c, tt);
          POVO.forEach((p, i) => { p.reset(); p.x = i ? 1150 : -60; p.y = 1600; p.s = 0.9; p.exp = t > 79.2 && t < 92 ? 'medo' : 'feliz'; p.boca = t > 92 ? 'aberta' : 'reta'; p.olhar = [i ? -0.8 : 0.8, 0]; if (t > 92) p.bracos(2.6, 0.2, 2.6, 0.2); p.jump = t > 92 ? Math.abs(Math.sin(t * 8 + i)) * 24 : 0; p.draw(c, tt); });
          // saqueadores
          if (t > 79.2) R.forEach((r, i) => {
            r.reset(); r.s = 1.0; r.y = 1660 + i * 30; r.flip = -1;
            const chega = clamp((t - 79.2) / 1.2), foge = clamp((t - FOGEM) / 1.4);
            r.x = lerp(1500 + i * 180, 1050 + i * 120, easeOut(chega)) + foge * 900; if ((t < 80.4 || t > FOGEM) && !pausa) r.walk = t * 11;
            r.bracos(0.3, 0.3, 2.4, 0.4); r.exp = t > FOGEM ? 'medo' : 'raiva'; r.boca = t > FOGEM ? 'grito' : 'dentes'; r.olhar = [0.8, 0];
            r.lean = LUTA.reduce((m, h) => Math.max(m, win(t, h, h + 0.05, h + 0.2, h + 0.4)), 0) * -0.2;
            r.draw(c, tt);
          });
          preparar(A); A.sujo = true; A.x = 400; A.y = 1680; A.s = 1.05; if (t < 76) A.walk = t * 6;
          A.olhar = t < 79.2 ? [0.7, 0] : [0.9, 0];
          A.bracoD = { a: lerp(0.2, 1.3, win(t, 76.8, 77.2, 77.8, 78.2)), b: 0.1 };
          if (t > 77.6) A.maoD = pecaBomba();
          if (t > 88) { A.maoD = pistolaLaser(LUTA.reduce((m, h) => Math.max(m, win(t, h - 0.02, h, h + 0.1, h + 0.25)), 0)); A.bracoD = { a: 1.55, b: 0 }; }
          A.exp = t < 79.2 ? 'feliz' : (t < 88 ? 'choque' : (t > 92 ? 'feliz' : 'determinado')); A.boca = t > 92 ? 'aberta' : (t > 88 ? 'dentes' : 'reta');
          A.draw(c, tt);
          if (t > 88) { const [gx, gy] = A.mao(1); for (const h of LUTA) if (t > h && t < h + 0.18) { line(c, [[gx + 110, gy - 20], [1060, 1400]], '#ff4a2a', 16, 0.9); line(c, [[gx + 110, gy - 20], [1060, 1400]], '#fff0d0', 6); glow(c, 1060, 1400, 120, '#ff4a2a', 1); } }
          const [hx, hy] = A.cabeca(); exclamacao(c, hx + 100, hy - 70, t - 79.4);
        });
        if (t > 77.6 && t < 80) st.text("PEÇA DA BOMBA D'ÁGUA +1", 540, 520, { size: 56, fill: '#ffb43a', alpha: win(t, 77.6, 77.8, 79.4, 79.8), lw: 12 });
        if (pausa) { st.overlay('#000', 0.45 * sstep(ESC, ESC + 0.3, t)); caixaEscolha(st.c, t, ESC, ['FUGIR COM A PEÇA', 'FICAR E LUTAR PELA CIDADE'], 1, CLIQUE); }
        if (t > 92) { st.text('+100 XP', 540, 520, { size: 80, fill: '#ffb43a', alpha: win(t, 92, 92.3, 93.6, 94), lw: 14 }); st.text('REPUTAÇÃO: HERÓI', 540, 620, { size: 56, fill: '#ffffff', alpha: win(t, 92.3, 92.6, 93.6, 94), lw: 12 }); }
      },
    };
  },
};

export const c7 = {
  nome: 'O sinal', inicio: 94, fim: 110.6,
  criar(st) {
    const A = voce('adulto');
    return {
      desenhar(t) {
        if (t < 99 || t > 104) {
          const fim = t > 104;
          st.setCam(fim ? lerp(540, 540, 0) : lerp(260, 460, (t - 94) / 5), fim ? lerp(1250, 1000, (t - 104) / 6.6) : 1300, fim ? lerp(1.3, 0.8, easeOut((t - 104) / 6.6)) : 1.25);
          montanhaAbrigo(st, t, { alarme: 0.75 });
          st.mundo(c => {
            portaAbrigo(c, 540, 1500, 1, t);
            preparar(A); A.sujo = true; A.s = 1.05; A.y = 1660; A.maoD = pecaBomba();
            if (!fim) { A.x = lerp(100, 420, clamp((t - 94) / 3)); if (t < 97) A.walk = t * 6; A.olhar = [0.8, -0.3]; const bate = t > 97.2 ? Math.abs(Math.sin(t * 10)) : 0; A.bracoD = { a: 1.4 + bate * 0.3, b: 0.4 }; A.exp = t > 98 ? 'preocupado' : 'feliz'; A.boca = 'reta'; }
            else { A.x = 540; A.olhar = [0.3, -0.5]; A.exp = 'determinado'; A.boca = 'sorriso'; A.capaVento = 1; A.maoD = null; A.bracos(0.2, 0.1, 0.3, 0.1); }
            A.draw(c, t);
            const [hx, hy] = A.cabeca(); if (!fim) interrogacao(c, hx + 100, hy - 60, t - 98);
          });
          return;
        }
        // close no PulsoTec
        st.setCam(540, 960, 1);
        const c = st.c, z = lerp(1.1, 1.0, easeOut(clamp((t - 99) / 0.8)));
        c.save(); c.translate(540, 960); c.scale(z, z); c.translate(-540, -960);
        telaPulsotec(c, t, { sinal: sstep(100.4, 100.8, t), rad: 0.32 });
        c.restore();
      },
    };
  },
};
