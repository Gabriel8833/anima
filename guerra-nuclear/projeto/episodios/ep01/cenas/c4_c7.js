// CENA 4 — 30 DIAS DEPOIS (35–47 s) · CENA 5 — A NOVA HUMANIDADE (47–59 s)
// CENA 6 — O PERIGO (59–70 s) · CENA 7 — O FINAL (70–82,2 s)
import { kf, lerp, clamp, sstep, win, easeInOut, easeOut, easeIn, shake, impulse } from '../../../motor/base.js';
import { glow, sparkle, circle, rrect } from '../../../motor/desenho.js';
import { exclamacao, interrogacao } from '../../../motor/balao.js';
import { voce, sobrevivente, crianca, estranho, geiger, lata, garrafa, cano } from '../../../personagens/pessoas.js';
import { ruinas, cinzas, escotilha, carro, acampamento, fogueira, mapaZonas, ruaAbandonada, colina, radiacao } from '../../../cenarios/mundo.js';

const sobrevivenciaVoce = (V) => { V.mascara = true; V.mochila = true; V.sujo = true; };

export const c4 = {
  nome: '30 dias depois', inicio: 35, fim: 47,
  criar(st) {
    const V = voce();
    return {
      desenhar(t) {
        if (t < 37) { st.c.fillStyle = '#000'; st.c.fillRect(0, 0, 1080, 1920); const n = Math.ceil(clamp((t - 35.2) / 0.9) * 17); st.text('30 DIAS DEPOIS...'.slice(0, n), 540, 960, { size: 92, fill: '#f2c230', lw: 14 }); return; }
        const abre = clamp((t - 37.5) / 0.8), sobe = clamp((t - 38.3) / 1.4);
        let cam;
        if (t < 41) cam = [540, lerp(1350, 1300, (t - 37) / 4), lerp(1.45, 1.3, (t - 37) / 4)];
        else cam = [lerp(540, 820, (t - 41) / 6), 1250, lerp(1.05, 0.95, (t - 41) / 6)];
        st.setCam(cam[0], cam[1], cam[2]);
        ruinas(st, t);
        st.mundo(c => {
          carro(c, 1000, 1700, 0.95, { cor: '#5a8ab0', ferrugem: 0.9, quebrado: true, ang: 0.05 });
          carro(c, -150, 1640, 0.85, { cor: '#c05a3a', ferrugem: 0.8, quebrado: true, ang: -0.08 });
          V.reset(); sobrevivenciaVoce(V); V.s = 1.05;
          if (t < 41) {
            V.x = 540; V.y = lerp(2050, 1660, easeOut(sobe));
            V.bracos(lerp(2.6, 0.3, sobe), lerp(0.4, 0.2, sobe), lerp(2.6, 0.7, sobe), lerp(0.4, 1.4, sobe));
            V.olhar = [Math.sin((t - 39.6) * 1.8) * 0.9 * sstep(39.6, 40, t), -0.2]; V.exp = sobe > 0.9 ? 'choque' : 'normal'; V.boca = 'reta';
            if (sobe > 0.6) V.maoD = geiger(0.5 + sstep(39.8, 40.4, t) * 0.3);
            // recorte: só a parte acima do chão aparece
            c.save(); c.beginPath(); c.rect(-2000, -2000, 5000, 3660); c.clip(); V.draw(c, t); c.restore();
            escotilha(c, 540, 1660, abre);
          } else {
            escotilha(c, 540, 1660, 1);
            V.x = lerp(560, 1100, (t - 41) / 6); V.y = 1680; V.walk = t * 6; V.maoD = geiger(0.75); V.bracos(0.3, 0.3, 0.7, 1.4);
            V.olhar = [0.4, 0.5 * Math.sin(t)]; V.exp = 'preocupado'; V.boca = 'reta';
            V.draw(c, t);
            const [gx, gy] = V.mao(1); radiacao(c, gx + 60, gy - 110, 34, 0.5 + 0.5 * Math.sin(t * 8));
          }
        });
        st.camada(0, c => cinzas(c, t, 0.9, 80));
      },
    };
  },
};

export const c5 = {
  nome: 'A nova humanidade', inicio: 47, fim: 59,
  criar(st) {
    const V = voce(), S = [sobrevivente(0), sobrevivente(1), sobrevivente(2), sobrevivente(3)], K = crianca(1);
    return {
      desenhar(t) {
        let cam;
        if (t < 51) cam = [lerp(380, 640, (t - 47) / 4), 1240, 0.95];
        else if (t < 55) cam = [560, 1300, 1.4];
        else cam = kf(t, [[55, [520, 1280, 1.2]], [57.2, [760, 1180, 1.5]], [59, [780, 1170, 1.9]]], easeInOut);
        st.setCam(cam[0], cam[1], cam[2]);
        acampamento(st, t);
        st.mundo(c => {
          mapaZonas(c, 780, 1170, t, 1);
          fogueira(c, 180, 1690, 0.9, t);
          if (t < 51) {
            S.forEach((s, i) => { s.reset(); s.s = 0.95; s.y = 1600 + (i % 2) * 60; const dir = i % 2 ? -1 : 1; s.x = [100, 900, -100, 640][i] + (t - 47) * 80 * dir; s.walk = t * 6 + i; s.olhar = [dir * 0.7, 0]; s.maoD = i % 2 ? lata() : garrafa(); s.bracos(0.2, 0.1, 0.6, 1.3); s.exp = 'normal'; s.boca = 'reta'; s.draw(c, t); });
            K.reset(); K.s = 0.7; K.x = 480; K.y = 1640; K.exp = 'feliz'; K.boca = 'sorriso'; K.bracos(0.2, 0.1, 2.6 + Math.sin(t * 10) * 0.25, 0.3); K.draw(c, t);
            V.reset(); sobrevivenciaVoce(V); V.x = lerp(-200, 300, (t - 47) / 4); V.y = 1700; V.s = 1.05; V.walk = t * 6; V.olhar = [0.6, 0]; V.exp = 'choque'; V.draw(c, t);
          } else {
            // troca: uma lata por água
            const T = S[0]; T.reset(); T.x = 760; T.y = 1660; T.s = 1.0; T.olhar = [-0.7, 0]; T.exp = 'normal'; T.boca = 'reta';
            const troca = sstep(52.4, 53.0, t);
            T.bracoD = { a: lerp(0.3, 1.3, win(t, 51.8, 52.3, 53.4, 54)), b: 0.1 }; T.flip = -1; T.maoD = troca > 0.5 ? lata() : garrafa();
            if (t > 55) { T.bracoD = { a: lerp(0.3, 2.3, sstep(55.4, 55.9, t)), b: 0.2 }; T.maoD = null; T.olhar = [0.4, -0.6]; }
            T.draw(c, t);
            V.reset(); sobrevivenciaVoce(V); V.x = 380; V.y = 1680; V.s = 1.05; V.olhar = [0.8, 0];
            V.bracoD = { a: lerp(0.3, 1.3, win(t, 51.6, 52.1, 53.4, 54)), b: 0.1 }; V.maoD = troca > 0.5 ? garrafa() : lata();
            V.exp = t > 53.2 && t < 55 ? 'feliz' : 'normal'; V.headTilt = win(t, 53.3, 53.5, 53.7, 53.9) * 0.15;
            if (t > 55.6) { V.olhar = [0.6, -0.6]; V.exp = 'preocupado'; }
            V.draw(c, t);
          }
        });
        st.camada(0, c => cinzas(c, t, 0.5, 40));
      },
    };
  },
};

export const c6 = {
  nome: 'O perigo', inicio: 59, fim: 70,
  criar(st) {
    const V = voce(), E = estranho();
    const BARULHO = 62.4, OLHOS = 64.2;
    return {
      desenhar(t) {
        const sobe = sstep(64.6, 65.6, t);
        let cam;
        if (t < 62.4) cam = [lerp(300, 460, (t - 59) / 3.4), 1290, 1.15];
        else if (t < 64) { const [hx, hy] = [460, 1680 - 300 * 1.05]; cam = [hx, hy + 140, 1.9]; }
        else if (t < 68.4) cam = [600, 1300, lerp(1.1, 1.2, (t - 64) / 4.4)];
        else cam = [860, lerp(1560 - 300 * sobe, 1330, 0), lerp(2.3, 2.7, (t - 68.4) / 1.6)];
        st.setCam(cam[0], cam[1], cam[2], 0, shake(t, impulse(t, BARULHO, 0.6) + (t > 68.4 ? 0.1 : 0)));
        ruaAbandonada(st, t);
        st.mundo(c => {
          // o estranho atrás do carro
          E.reset(); E.x = 860; E.s = 1.1; E.y = lerp(1900, 1700, easeOut(sobe)); E.brilhoOlhos = sstep(OLHOS, OLHOS + 0.3, t);
          E.maoD = cano(lerp(0.4, -0.1, sstep(66, 67, t))); E.bracos(0.3, 0.3, lerp(0.4, 1.0, sstep(66, 67, t)), 0.6);
          E.x = lerp(860, 760, sstep(66.4, 68, t)); if (t > 66.4 && t < 68) E.walk = t * 4;
          E.exp = 'normal'; E.boca = 'reta';
          if (t > OLHOS - 0.2) { c.save(); c.globalAlpha = sstep(OLHOS - 0.2, OLHOS + 0.2, t); E.draw(c, t); c.restore(); }
          carro(c, 860, 1720, 1.0, { cor: '#6a7a5a', ferrugem: 1, quebrado: true, ang: 0.04 });
          // você
          V.reset(); sobrevivenciaVoce(V); V.s = 1.05; V.y = 1680;
          V.x = t < BARULHO ? lerp(200, 460, (t - 59) / 3.4) : lerp(460, 300, sstep(66.2, 68.5, t));
          if (t < BARULHO) V.walk = t * 5;
          if (t > 66.2 && t < 68.5) V.walk = -t * 4;
          V.olhar = t < BARULHO ? [Math.sin(t * 1.5) * 0.7, 0] : [0.9, 0];
          V.exp = t < BARULHO ? 'preocupado' : (t < OLHOS ? 'choque' : 'medo'); V.boca = 'reta'; V.suor = t > OLHOS ? 1 : 0; V.tremor = t > OLHOS ? 0.4 : 0;
          V.bracos(0.3, 0.3, t > OLHOS ? 1.0 : 0.3, t > OLHOS ? 1.6 : 0.3);
          V.draw(c, t);
          const [hx, hy] = V.cabeca();
          interrogacao(c, hx + 100, hy - 60, t - BARULHO); exclamacao(c, hx + 110, hy - 70, t - OLHOS - 0.1, '#ff5a2a');
          if (t > BARULHO && t < BARULHO + 0.5) for (let i = 0; i < 4; i++) sparkle(c, 980 + i * 20, 1560 - i * 30, 14, '#ffffff', 1 - (t - BARULHO) / 0.5);
        });
        st.vignette(0.35 + sstep(OLHOS, 66, t) * 0.4);
      },
    };
  },
};

export const c7 = {
  nome: 'O final', inicio: 70, fim: 82.2,
  criar(st) {
    const V = voce();
    return {
      desenhar(t) {
        const sinal = sstep(73.0, 74.0, t), porta = sstep(80.4, 82.0, t) * 0.35;
        let cam;
        if (t < 73) cam = [540, 1280, lerp(1.3, 1.1, (t - 70) / 3)];
        else if (t < 76.5) cam = [lerp(540, 700, (t - 73) / 3.5), 1200, 1.0];
        else cam = kf(t, [[76.5, [700, 1200, 1.0]], [82.2, [900, 1040, 3.2]]], easeIn);
        st.setCam(cam[0], cam[1], cam[2]);
        colina(st, t, { sinal, porta });
        st.mundo(c => {
          V.reset(); V.mascara = true; V.mochila = true; V.sujo = true; V.x = 420; V.y = 1640; V.s = 1.05; V.capaVento = 0.5;
          V.olhar = t < 73.4 ? [Math.sin(t * 0.8) * 0.5, -0.1] : [0.9, -0.6]; V.exp = t < 73.4 ? 'preocupado' : 'choque';
          const aponta = sstep(74.6, 75.2, t); V.bracos(0.3, 0.3, lerp(0.3, 2.0, aponta), lerp(0.3, 0.05, aponta));
          V.draw(c, t);
          const [hx, hy] = V.cabeca(); exclamacao(c, hx + 100, hy - 70, t - 73.5, '#5af0c0');
          for (const s of [-1, 1]) glow(c, hx + s * 26 * V.s, hy - 4 * V.s, 40, '#5af0c0', sinal * 0.4);
        });
      },
    };
  },
};
