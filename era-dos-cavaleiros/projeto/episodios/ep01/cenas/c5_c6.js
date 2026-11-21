// CENA 5 — A PRIMEIRA BATALHA (51–66 s) e CENA 6 — O FINAL (66–80 s)
import { kf, lerp, clamp, sstep, win, easeInOut, easeOut, shake, impulse } from '../../../motor/base.js';
import { sparkle, speedLines, glow } from '../../../motor/desenho.js';
import { explosao, poeira } from '../../../motor/efeitos.js';
import { flecha } from '../../../motor/extras.js';
import { voce, cavaleiro, espada, escudo, lancaBandeira } from '../../../personagens/pessoas.js';
import { cavalo, SELA } from '../../../personagens/cavalo.js';
import { campo, porDoSol } from '../../../cenarios/medieval.js';

const CHOQUES = [62.0, 62.8, 63.6], BLOQUEIO = 64.3;

export const c5 = {
  nome: 'A primeira batalha', inicio: 51, fim: 66,
  criar(st) {
    const A = voce('cavaleiro'), AL = [cavaleiro('aliado'), cavaleiro('aliado')], IN = Array.from({ length: 7 }, () => cavaleiro('inimigo')), E = cavaleiro('inimigo');
    return {
      desenhar(t) {
        const sh = CHOQUES.reduce((s, h) => s + impulse(t, h, 0.9, 0.3), 0) + impulse(t, BLOQUEIO, 1.8) + (t > 57.5 && t < 61.5 ? 0.35 : 0) + win(t, 54.6, 55, 56, 56.6) * 0.3;
        let cam;
        if (t < 54.5) cam = [540, 1250, lerp(1.25, 1.4, (t - 51) / 3.5)];
        else if (t < 56.5) cam = [540, 1180, 1.05];
        else if (t < 57.5) cam = [540, 1484, 2.1];
        else if (t < 61.5) { const hx = lerp(-200, 1300, (t - 57.5) / 4); cam = [hx + 60, 1240, 1.0]; }
        else cam = [560, 1260, 1.25];
        st.setCam(cam[0], cam[1], cam[2], 0, shake(t, sh, 24));
        campo(st, t, sstep(58, 61, t));
        st.mundo(c => {
          // exército inimigo surgindo no morro
          const sobe = sstep(54.5, 55.8, t);
          if (t < 57.5) IN.forEach((h, i) => { h.reset(); h.s = 0.42; h.x = 120 + i * 140; h.y = lerp(1460, 1330, sobe) + (i % 2) * 10; h.bracos(0.3, 0.3, 2.6, 0.2); h.maoD = espada(0); h.exp = 'raiva'; h.boca = 'dentes'; h.capaVento = 1; h.alpha = sobe; h.draw(c, t); });
          if (t < 57.5) {
            // você na linha de frente, com aliados
            AL.forEach((h, i) => { h.reset(); h.s = 1.0; h.x = i ? 880 : 200; h.y = 1640; h.maoD = lancaBandeira('#3a6ad0'); h.bracos(0.3, 0.3, 0.6, 1.2); h.olhar = [0, -0.3]; h.exp = 'determinado'; h.boca = 'reta'; h.capaVento = 0.8; h.draw(c, t); });
            A.reset(); A.s = 1.12; A.x = 540; A.y = 1700; A.capacete = true; A.capaVento = 0.9;
            A.maoD = espada(0); A.maoE = escudo(); A.bracos(0.4, 0.9, 0.6, 1.0);
            A.exp = t > 55 ? 'medo' : 'preocupado'; A.boca = 'tremendo'; A.suor = sstep(53.4, 53.8, t); A.olhar = t > 54.6 ? [0, -0.6] : [0, 0]; A.tremor = t > 56.5 ? 0.6 : 0;
            A.draw(c, t);
          } else if (t < 61.5) {
            // a investida a cavalo
            const x = lerp(-200, 1300, (t - 57.5) / 4);
            for (const [dx, dy, cor] of [[-380, -60, '#9a6a3a'], [-640, 30, '#5a3a2a']]) cavalo(c, x + dx, 1640 + dy, 0.85, t, { fase: t * 14 + dx, galope: 1, cor, crina: '#2a1a12', manta: '#3a6ad0', enfeite: '#ffffff', montaria: (cc) => { const h = AL[dx < -500 ? 1 : 0]; h.reset(); h.x = SELA[0]; h.y = SELA[1] + 150; h.semPernas = true; h.capaVento = 1.2; h.bracos(0.3, 0.8, 2.4, 0.2); h.maoD = espada(0); h.exp = 'raiva'; h.boca = 'grito'; h.draw(cc, t); } });
            cavalo(c, x, 1720, 1.0, t, { fase: t * 14, galope: 1, manta: '#c0302a', montaria: (cc) => { A.reset(); A.x = SELA[0]; A.y = SELA[1] + 150; A.semPernas = true; A.capacete = true; A.capaVento = 1.4; A.bracos(0.4, 0.9, 2.5, 0.15); A.maoD = espada(0, 0.3); A.maoE = escudo(); A.exp = 'raiva'; A.boca = 'grito'; A.draw(cc, t); } });
            poeira(c, x - 900, 1500, 900, 300, t * 3, '#c8b898', 0.9, 30, 4);
          } else {
            // o choque das espadas
            const blq = win(t, BLOQUEIO - 0.15, BLOQUEIO, BLOQUEIO + 0.4, BLOQUEIO + 0.9);
            const g = Math.sin((t - 61.5) * 8);
            E.reset(); E.s = 1.05; E.x = 760; E.y = 1680; E.flip = -1; E.maoD = espada(lerp(-0.2, 1.0, (g + 1) / 2)); E.maoE = escudo('#6a1a2a', '#1a1a1a'); E.bracos(0.4, 0.9, lerp(2.5, 1.4, (g + 1) / 2), 0.2); E.exp = 'raiva'; E.boca = 'dentes'; E.olhar = [0.8, 0]; E.capaVento = 1;
            if (t > BLOQUEIO - 0.3 && t < BLOQUEIO + 0.6) { E.bracoD = { a: 2.8, b: 0.4 }; E.lean = -0.1; }
            A.reset(); A.s = 1.08; A.x = 350 - blq * 40; A.y = 1690; A.capacete = true; A.capaVento = 1; A.maoD = espada(lerp(1.0, -0.2, (g + 1) / 2)); A.maoE = escudo();
            A.bracos(lerp(0.4, 1.6, blq), lerp(0.9, 1.5, blq), lerp(1.4, 2.5, (g + 1) / 2), 0.2); A.lean = -blq * 0.2; A.squash = blq * 0.08;
            A.exp = t > 64.9 ? 'determinado' : (blq > 0.3 || Math.sin(t * 5) > 0.3 ? 'medo' : 'determinado'); A.boca = blq > 0.3 ? 'grito' : 'dentes'; A.olhar = [0.8, 0];
            E.draw(c, t); A.draw(c, t);
            for (const tc of CHOQUES) explosao(c, 560, 1330, 70, t - tc, ['#ffffff', '#fff2a0', '#ffc040'], { fumaca: false });
            explosao(c, 470, 1380, 140, t - BLOQUEIO, ['#ffffff', '#ffe08a', '#ff9a40'], { fumaca: false });
          }
          // flechas cruzando o céu
          if (t > 58) for (let i = 0; i < 8; i++) { const u = ((t - 58) * 0.7 + i / 8) % 1; flecha(c, lerp(1400, -300, u) + i * 30, 700 + i * 60 - Math.sin(u * Math.PI) * 200, Math.PI - 0.5 + u * 1.0); }
        });
        if (t > 57.5 && t < 61.5) st.camada(0, c => speedLines(c, 540, 960, 50, 500, 1500, 0.35, t));
      },
    };
  },
};

export const c6 = {
  nome: 'O final', inicio: 66, fim: 80,
  criar(st) {
    const A = voce('cavaleiro');
    return {
      desenhar(t) {
        A.reset(); A.s = 1.15; A.x = 540; A.y = 1640; A.capaVento = 0.9;
        A.maoD = espada(0.1); A.bracos(0.25, 0.1, 0.45, 0.9);
        if (t < 72) { A.olhar = [0.6, -0.7]; A.headTilt = -0.1; A.exp = 'normal'; A.boca = 'reta'; }
        else {
          const vira = sstep(72.4, 73.0, t), aponta = sstep(73.6, 74.1, t);
          A.olhar = [lerp(0.6, 0, vira), lerp(-0.7, 0, vira)]; A.headTilt = lerp(-0.1, 0.08, vira);
          A.exp = vira > 0.5 ? (aponta > 0.5 ? 'malicia' : 'feliz') : 'normal'; A.boca = vira > 0.5 ? 'sorriso' : 'reta';
          A.bracoE = { a: lerp(0.25, 1.5, aponta), b: lerp(0.1, -0.2, aponta) };
        }
        const cam = t < 72 ? kf(t, [[66, [540, 1120, 0.85]], [72, [540, 1250, 1.05]]], easeInOut) : (() => { const [hx, hy] = A.cabeca(); return [hx, hy + 140, lerp(1.6, 1.8, clamp((t - 72) / 4))]; })();
        st.setCam(cam[0], cam[1], cam[2]);
        porDoSol(st, t);
        st.mundo(c => { A.draw(c, t); poeira(c, -200, 600, 1500, 1100, t, '#fff0c0', 0.6, 25, 3); });
      },
    };
  },
};
