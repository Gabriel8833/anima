// As 6 cenas de "E se você fosse o rei de Miami?" (história original de ascensão e queda).
import { kf, lerp, clamp, sstep, win, easeInOut, easeOut, easeIn, shake, impulse } from '../../../motor/base.js';
import { glow, sparkle, rrect, line, circle, rays, speedLines } from '../../../motor/desenho.js';
import { explosao } from '../../../motor/efeitos.js';
import { exclamacao, interrogacao } from '../../../motor/balao.js';
import { voce, pessoa, contato, chefao, policial, mala, prato, envelope, telefone } from '../../../personagens/miami.js';
import { avenida, esportivo, limusine, cozinha, beco, clube, mansaoFora, escritorio, cameraSeguranca, pilhaDinheiro, notasVoando } from '../../../cenarios/miami80.js';

const brilhoOlhos = (c, P, t, a, cor = '#ffd23a') => { if (a <= 0) return; const [hx, hy] = P.cabeca(); for (const s of [-1, 1]) sparkle(c, hx + s * 26 * P.s, hy - 4 * P.s, 14 * P.s, cor, a); };

// ---------- 1. Chegada a Miami ----------
export const c1 = {
  nome: 'Chegada a Miami', inicio: 0, fim: 13,
  criar(st) {
    const V = voce('chegada'), P = [pessoa(0), pessoa(1), pessoa(2)];
    return {
      desenhar(t) {
        V.reset(); V.s = 1.05; V.y = 1660; V.x = lerp(-150, 480, clamp(t / 5.5)); if (t < 5.5) V.walk = t * 6;
        V.maoD = mala(); V.bracos(0.2, 0.1, 0.25, 0.1);
        const olhaCima = sstep(5.6, 6.4, t);
        V.olhar = [lerp(0.7, 0, olhaCima), -0.9 * olhaCima]; V.headTilt = -0.12 * olhaCima;
        V.exp = t > 9 ? 'feliz' : (olhaCima > 0.5 ? 'choque' : 'normal'); V.boca = t > 9 ? 'sorriso' : (olhaCima > 0.5 ? 'aberta' : 'reta');
        let cam;
        if (t < 5.5) cam = [lerp(200, 520, t / 5.5), 1300, 1.05];
        else if (t < 9) cam = [520, lerp(1200, 900, easeInOut((t - 5.5) / 3.5)), lerp(1.0, 0.85, (t - 5.5) / 3.5)];
        else { const [hx, hy] = V.cabeca(); cam = [hx, hy + 120, lerp(1.7, 1.95, (t - 9) / 4)]; }
        st.setCam(cam[0], cam[1], cam[2]);
        avenida(st, t);
        st.mundo(c => {
          esportivo(c, 1600 - t * 260, 1820, 0.9, { cor: '#ffffff', roda: -t * 8, flip: -1 });
          P.forEach((p, i) => { p.reset(); p.s = 0.95; p.y = 1600 + (i % 2) * 30; const dir = i % 2 ? -1 : 1; p.x = [-300, 1300, 900][i] + t * [160, -110, -60][i]; p.walk = t * (i === 0 ? 4 : 6); p.olhar = [dir * 0.8, 0]; p.exp = 'feliz'; p.boca = 'sorriso'; if (i === 0) p.jump = Math.abs(Math.sin(t * 3)) * 12; p.draw(c, t); });
          V.draw(c, t);
          brilhoOlhos(c, V, t, t > 9 ? 0.9 : 0, '#ff6aa8');
        });
      },
    };
  },
};

// ---------- 2. O começo ----------
export const c2 = {
  nome: 'O começo', inicio: 13, fim: 27,
  criar(st) {
    const V = voce('chegada'), K = contato();
    return {
      desenhar(t) {
        if (t < 19) {
          st.setCam(lerp(420, 480, (t - 13) / 6), 1260, 1.35);
          cozinha(st, t);
          st.mundo(c => {
            V.reset(); V.avental = true; V.x = 360; V.y = 1640; V.s = 1.05; V.maoD = prato(t);
            const esfrega = Math.sin(t * 8); V.bracos(0.6, 1.4 + esfrega * 0.2, 0.7 + esfrega * 0.2, 1.4);
            V.olhar = [0, 0.7]; V.exp = t > 16 ? 'preocupado' : 'normal'; V.boca = 'reta'; V.suor = sstep(15, 16, t); V.squash = 0.03;
            V.draw(c, t);
          });
          return;
        }
        st.setCam(lerp(440, 560, (t - 19) / 8), 1280, lerp(1.15, 1.35, (t - 19) / 8));
        beco(st, t);
        st.mundo(c => {
          const chega = clamp((t - 19.4) / 1.6);
          limusine(c, lerp(1700, 860, easeOut(chega)), 1720, 0.85, { roda: t < 21 ? -t * 8 : 0 });
          K.reset(); K.x = 760; K.y = 1640; K.s = 1.0; K.flip = -1; K.alpha = sstep(21, 21.4, t); K.olhar = [0.8, 0];
          const entrega = sstep(21.6, 22.2, t), pega = sstep(24.8, 25.3, t);
          K.bracoD = { a: lerp(0.2, 1.4, entrega * (1 - pega * 0.8)), b: 0.1 }; K.maoD = pega < 0.5 ? envelope() : null; K.exp = 'malicia'; K.boca = 'sorrisoMal';
          if (K.alpha > 0) K.draw(c, t);
          V.reset(); V.x = 360; V.y = 1660; V.s = 1.05; V.olhar = t < 22.4 ? [0.8, 0] : (t < 24.6 ? [Math.sin(t * 5) * 0.9, 0.1] : [0.6, 0.2]);
          V.exp = t < 22.4 ? 'normal' : (t < 24.6 ? 'preocupado' : 'determinado'); V.boca = 'reta'; V.suor = t > 22.4 && t < 24.6 ? 1 : 0;
          V.bracoD = { a: lerp(0.2, 1.3, win(t, 24.6, 25, 25.8, 26.4)), b: 0.1 }; V.maoD = pega > 0.5 ? envelope() : null;
          V.draw(c, t);
          const [hx, hy] = V.cabeca(); interrogacao(c, hx + 100, hy - 60, t - 22.6);
        });
      },
    };
  },
};

// ---------- 3. A ascensão ----------
export const c3 = {
  nome: 'A ascensão', inicio: 27, fim: 41,
  criar(st) {
    const V = voce('rei'), B = [chefao(0), chefao(1)];
    return {
      desenhar(t) {
        if (t < 30.5) {
          // chegando de limusine ao clube, com flashes
          st.setCam(560, 1280, 1.2);
          avenida(st, t, { noite: 1 });
          st.mundo(c => {
            limusine(c, 640, 1760, 0.9, {});
            V.reset(); V.oculos = true; V.x = lerp(560, 400, sstep(27.6, 28.6, t)); V.y = 1680; V.s = 1.05; if (t > 27.6 && t < 28.6) V.walk = t * 6;
            V.exp = 'determinado'; V.boca = 'sorrisoMal'; V.bracos(0.3, 0.6, lerp(0.3, 1.0, sstep(29, 29.4, t)), lerp(0.6, 2.4, sstep(29, 29.4, t)));
            V.draw(c, t);
            for (const tf of [28.2, 28.7, 29.3, 29.9]) if (t > tf && t < tf + 0.15) glow(c, 200 + (tf * 300) % 700, 1200, 300, '#ffffff', 1);
          });
          return;
        }
        if (t < 34) {
          // dirigindo o esportivo vermelho pela avenida
          const x = lerp(-200, 1300, (t - 30.5) / 3.5);
          st.setCam(x + 60, 1300, 1.05);
          avenida(st, t);
          st.mundo(c => {
            V.reset(); V.oculos = true; V.semPernas = true; V.x = x + 10; V.y = 1660 - 60; V.s = 0.95; V.exp = 'feliz'; V.boca = 'aberta'; V.bracos(1.3, 1.6, 1.3, 1.6); V.olhar = [0.6, 0];
            V.draw(c, t);
            esportivo(c, x, 1720, 1.0, { cor: '#e02a3a', roda: t * 14 });
          });
          st.camada(0, c => speedLines(c, 540, 960, 30, 500, 1500, 0.2, t));
          return;
        }
        // reunião no clube e o dinheiro
        st.setCam(540, 1260, lerp(1.15, 1.3, (t - 34) / 7));
        clube(st, t);
        st.mundo(c => {
          B.forEach((b, i) => { b.reset(); b.x = i ? 880 : 200; b.y = 1640; b.s = 1.0; b.flip = i ? -1 : 1; b.olhar = [0.7, 0]; b.exp = t > 35.8 ? 'feliz' : 'normal'; b.boca = t > 35.8 ? 'sorriso' : 'reta'; if (i === 0) b.bracoD = { a: lerp(0.2, 1.4, win(t, 35, 35.4, 36.4, 36.8)), b: 0 }; b.draw(c, t); });
          V.reset(); V.oculos = t < 37.5; V.x = 540; V.y = 1660; V.s = 1.05; V.olhar = t < 37.5 ? [-0.6, 0] : [0, 0.6];
          V.bracoE = { a: lerp(0.2, 1.4, win(t, 35, 35.4, 36.4, 36.8)), b: 0 };
          if (t > 37.5) { const conta = Math.sin(t * 10); V.bracos(0.8, 1.4 + conta * 0.2, 0.8, 1.4 - conta * 0.2); }
          V.exp = t > 37.5 ? 'feliz' : 'determinado'; V.boca = t > 37.5 ? 'aberta' : 'sorrisoMal'; V.draw(c, t);
          if (t > 35.3 && t < 35.8) for (let i = 0; i < 5; i++) sparkle(c, 380 + Math.cos(i) * 40, 1420 + Math.sin(i) * 30, 14, '#ffd23a', 1);
          if (t > 37.5) { pilhaDinheiro(c, 400, 1420, Math.floor(sstep(37.5, 40, t) * 8) + 1); pilhaDinheiro(c, 680, 1420, Math.floor(sstep(38, 40.5, t) * 8) + 1); }
        });
        if (t > 38) st.camada(0, c => notasVoando(c, t, sstep(38, 38.6, t)));
      },
    };
  },
};

// ---------- 4. O império ----------
export const c4 = {
  nome: 'O império', inicio: 41, fim: 55,
  criar(st) {
    const V = voce('rei'), S = [pessoa(3), pessoa(3)];
    return {
      desenhar(t) {
        if (t < 45) {
          st.setCam(540, lerp(1500, 1150, easeInOut((t - 41) / 4)), lerp(1.3, 0.85, easeInOut((t - 41) / 4)));
          mansaoFora(st, t);
          st.mundo(c => {
            esportivo(c, 820, 1760, 0.8, { cor: '#e02a3a' });
            S.forEach((s, i) => { s.reset(); s.x = i ? 1020 : 60; s.y = 1730; s.s = 0.95; s.bracos(0.5, 2.0, 0.5, 2.0); s.exp = 'normal'; s.boca = 'reta'; s.draw(c, t); });
          });
          st.camada(1, c => { c.save(); c.font = '900 italic 64px Inter, sans-serif'; c.textAlign = 'center'; c.fillStyle = '#f2c230'; c.strokeStyle = '#2b1f2a'; c.lineWidth = 10; c.strokeText('R', 540, 1395); c.fillText('R', 540, 1395); c.restore(); });
          return;
        }
        st.setCam(540, lerp(1250, 1200, (t - 45) / 10), lerp(1.0, 1.3, easeInOut((t - 45) / 10)));
        escritorio(st, t);
        st.mundo(c => {
          S.forEach((s, i) => { s.reset(); s.x = i ? 990 : 90; s.y = 1640; s.s = 1.0; s.bracos(0.5, 2.0, 0.5, 2.0); s.exp = 'normal'; s.boca = 'reta'; s.olhar = [i ? -0.3 : 0.3, 0]; s.draw(c, t); });
          V.reset(); V.oculos = t < 49; V.x = 540; V.y = 1500; V.s = 1.05; V.lean = -0.05; V.semPernas = true;
          const liga = win(t, 49, 49.4, 51.4, 51.8);
          V.bracos(0.6, 1.3, lerp(0.6, 2.2, liga), lerp(1.3, 2.4, liga)); V.maoD = liga > 0.5 ? telefone() : null;
          V.exp = 'feliz'; V.boca = liga > 0.5 ? (Math.sin(t * 12) > 0 ? 'aberta' : 'sorriso') : (t > 52 ? 'aberta' : 'sorrisoMal'); V.olhar = [0, liga > 0.5 ? -0.2 : 0];
          if (t > 52) V.jump = Math.abs(Math.sin(t * 8)) * 6;
          V.draw(c, t);
          // mesa por cima das pernas, com dinheiro
          rrect(c, 180, 1360, 720, 60, 12, '#f2eee8', { lw: 7 }); rrect(c, 220, 1420, 640, 200, 10, '#2a2a2a', { lw: 6 });
          pilhaDinheiro(c, 300, 1350, 6); pilhaDinheiro(c, 780, 1350, 5);
          brilhoOlhos(c, V, t, t > 52.5 ? 0.8 : 0);
        });
      },
    };
  },
};

// ---------- 5. A paranoia ----------
export const c5 = {
  nome: 'A paranoia', inicio: 55, fim: 69,
  criar(st) {
    const V = voce('rei'), G = pessoa(3);
    const SUSTO = 66.2;
    return {
      desenhar(t) {
        let cam;
        if (t < 59) cam = [800, 1150, lerp(1.2, 1.4, (t - 55) / 4)];
        else if (t < 63) cam = [520, 1150, 1.4];
        else if (t < 66) cam = [540, 1300, 1.35];
        else cam = [600, 1260, 1.1];
        st.setCam(cam[0], cam[1], cam[2], 0, shake(t, impulse(t, SUSTO, 1.2)));
        escritorio(st, t, { noite: 1, monitores: 1 });
        st.mundo(c => {
          for (let i = 0; i < 4; i++) cameraSeguranca(c, 972 + (i % 2) * 230, 532 + Math.floor(i / 2) * 200, t, i);
          V.reset(); V.s = 1.05; V.desarrumado = true;
          if (t < 59) { V.x = 760; V.y = 1640; V.olhar = [0.9, -0.5]; V.exp = 'preocupado'; V.boca = 'reta'; V.suor = sstep(56.5, 57, t); V.bracos(0.6, 1.8, 0.6, 1.8); }
          else if (t < 63) { V.x = 540; V.y = 1640; V.olhar = [Math.sin(t * 3) * 0.9, -0.3]; V.exp = 'medo'; V.boca = 'tremendo'; V.bracos(0.2, 0.1, 2.3, 1.4); V.suor = 1; }
          else { V.x = 540; V.y = 1500; V.semPernas = true; V.olhar = t < 66 ? [0, 0.6] : [0.9, 0]; V.exp = t < SUSTO ? 'medo' : 'choque'; V.boca = t < SUSTO ? 'reta' : 'grito'; V.suor = 1; V.tremor = t < 66 ? 0.3 : 0; V.jump = win(t, SUSTO, SUSTO + 0.1, SUSTO + 0.2, SUSTO + 0.4) * 40;
            V.bracoD = { a: lerp(0.3, 1.5, sstep(66.6, 67, t)), b: 0 }; }
          V.draw(c, t);
          if (t > 63) { rrect(c, 180, 1360, 720, 60, 12, '#4a4458', { lw: 7 }); rrect(c, 220, 1420, 640, 200, 10, '#141414', { lw: 6 }); const toca = t < 66 && Math.sin(t * 30) > 0; c.save(); c.translate(780 + (toca ? 3 : 0), 1340); rrect(c, -50, -40, 100, 40, 10, '#2a2a2a', { lw: 4 }); rrect(c, -60, -64, 120, 26, 12, '#2a2a2a', { lw: 4 }); c.restore(); if (toca) for (const s of [-1, 1]) line(c, [[780 + s * 70, 1290], [780 + s * 90, 1270]], '#ffd23a', 5); }
          if (t > SUSTO) { G.reset(); G.x = 940; G.y = 1640; G.s = 1.0; G.alpha = sstep(SUSTO - 0.2, SUSTO, t); G.olhar = [-0.7, 0]; G.exp = t > 67 ? 'choque' : 'normal'; G.boca = t > 67 ? 'o' : 'reta'; G.bracos(0.2, 0.1, 2.6, 0.2); G.draw(c, t); }
          const [hx, hy] = V.cabeca(); exclamacao(c, hx + 100, hy - 70, t - SUSTO - 0.05, '#ff4a2a');
        });
        st.vignette(0.3 + sstep(58, 66, t) * 0.35);
      },
    };
  },
};

// ---------- 6. A queda ----------
export const c6 = {
  nome: 'A queda', inicio: 69, fim: 84.4,
  criar(st) {
    const V = voce('rei'), PL = [policial(0), policial(1)], G = [pessoa(3), pessoa(3)];
    const PORTA = 77.6;
    return {
      desenhar(t) {
        const pol = sstep(69.2, 70, t);
        if (t < 73) {
          st.setCam(540, lerp(1250, 1150, (t - 69) / 4), lerp(0.95, 0.85, (t - 69) / 4));
          mansaoFora(st, t, { noite: 1, policia: pol });
          st.mundo(c => {
            for (const [x, f] of [[160, 1], [920, -1]]) { esportivo(c, x, 1800, 0.85, { cor: '#f2f2f2', flip: f }); rrect(c, x - 60, 1630, 120, 22, 8, Math.sin(t * 10) > 0 ? '#ff2a3a' : '#2a6aff', { lw: 4 }); glow(c, x, 1640, 200, Math.sin(t * 10) > 0 ? '#ff2a3a' : '#2a6aff', 0.6); }
            PL.forEach((p, i) => { p.reset(); p.x = lerp(i ? 1200 : -100, i ? 700 : 380, clamp((t - 70) / 2.4)); p.y = 1680; p.s = 1.0; p.walk = t * 10; p.olhar = [i ? -0.8 : 0.8, -0.3]; p.exp = 'determinado'; p.boca = 'reta'; p.draw(c, t); });
          });
          // holofote do helicóptero
          st.camada(0, c => { const a = Math.sin(t * 0.9) * 0.35; c.save(); c.globalCompositeOperation = 'lighter'; c.translate(540, -100); c.rotate(a); const g = c.createLinearGradient(0, 0, 0, 1800); g.addColorStop(0, 'rgba(255,255,230,0.45)'); g.addColorStop(1, 'rgba(255,255,230,0.05)'); c.fillStyle = g; c.beginPath(); c.moveTo(-30, 0); c.lineTo(30, 0); c.lineTo(260, 1800); c.lineTo(-260, 1800); c.closePath(); c.fill(); c.restore(); rrect(c, 470, 60, 140, 60, 26, '#2a2a3a', { lw: 5 }); line(c, [[420 + Math.sin(t * 40) * 60, 50], [660 - Math.sin(t * 40) * 60, 50]], '#5a5a6a', 6); });
          return;
        }
        const quebra = t > PORTA;
        let cam;
        if (t < 80.5) cam = [540, 1250, 1.15];
        else cam = kf(t, [[80.5, [540, 1350, 1.6]], [84.4, [540, 1200, 0.95]]], easeOut);
        st.setCam(cam[0], cam[1], cam[2], 0, shake(t, impulse(t, 75, 0.8) + impulse(t, 76.2, 0.9) + impulse(t, PORTA, 2.2)));
        escritorio(st, t, { noite: 1, policia: pol });
        st.mundo(c => {
          // porta sendo forçada
          rrect(c, 900, 1000, 260, 480, 10, '#5a3a1a', { lw: 7 });
          if (t < 80.5) G.forEach((g, i) => { const foge = clamp((t - 73.4 - i * 0.4) / 1.2); g.reset(); g.x = lerp(i ? 820 : 260, i ? 1300 : -300, foge); g.y = 1660; g.s = 1.0; g.walk = t * 12; g.exp = 'medo'; g.boca = 'grito'; g.olhar = [i ? 0.9 : -0.9, 0]; g.bracos(2.4, 0.4, 2.4, 0.4); g.draw(c, t); });
          V.reset(); V.s = 1.05; V.desarrumado = true;
          if (t < 80.5) {
            V.x = lerp(540, 700, sstep(73.4, 74.6, t)); V.y = 1660; if (t > 73.4 && t < 74.6) V.walk = t * 10;
            const empurra = sstep(74.6, 75, t) * (1 - sstep(PORTA, PORTA + 0.3, t));
            V.bracos(lerp(0.3, 1.5, empurra), 0.1, lerp(0.3, 1.5, empurra), 0.1); V.lean = empurra * 0.25 - (quebra ? sstep(PORTA, PORTA + 0.4, t) * 0.3 : 0);
            V.olhar = [0.9, 0]; V.exp = quebra ? 'choque' : 'raiva'; V.boca = 'grito'; V.suor = 1;
            if (quebra) { V.x = lerp(700, 540, sstep(PORTA, PORTA + 0.8, t)); V.bracos(lerp(1.5, 2.6, sstep(PORTA + 1.2, PORTA + 1.8, t)), 0.2, lerp(1.5, 2.6, sstep(PORTA + 1.2, PORTA + 1.8, t)), 0.2); }
            V.draw(c, t);
          } else {
            // sozinho, sentado, no fim de tudo
            V.x = 540; V.y = 1700; V.squash = 0.18; V.headTilt = 0.15; V.olhar = [0, 0.8]; V.exp = 'preocupado'; V.boca = 'triste'; V.bracos(0.5, 1.9, 0.5, 1.9);
            V.draw(c, t);
          }
          explosao(c, 1030, 1240, 220, t - PORTA, ['#ffffff', '#c8b8a0', '#8a7a6a']);
          if (quebra) PL.forEach((p, i) => { p.reset(); p.x = lerp(1150, i ? 960 : 1060, sstep(PORTA + 0.2, PORTA + 1.2, t)); p.y = 1680 + i * 20; p.s = 1.0; p.flip = -1; p.olhar = [0.9, 0]; p.exp = 'determinado'; p.boca = 'aberta'; p.bracoD = { a: 1.5, b: 0 }; if (t > 80.5) p.alpha = 1 - sstep(80.5, 81, t); p.draw(c, t); const [hx, hy] = p.mao(1); glow(c, hx - 60, hy, 160, '#ffffe0', 0.6 * p.alpha); });
        });
        if (t > 80.5) st.camada(0, c => notasVoando(c, t * 0.4, 0.6, 10));
        st.overlay('#000', sstep(83.6, 84.4, t));
      },
    };
  },
};
