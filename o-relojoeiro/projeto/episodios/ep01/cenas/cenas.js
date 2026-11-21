// "E se você fosse O Relojoeiro?" — 6 cenas (história original)
import { kf, lerp, clamp, sstep, win, easeInOut, easeOut, easeIn, shake, impulse } from '../../../motor/base.js';
import { glow, sparkle, rrect, line, circle, poly, vgrad } from '../../../motor/desenho.js';
import { exclamacao } from '../../../motor/balao.js';
import { voce, esposa, filho, nico, mascarado, gangster, relogioBolso, xicara, carta, pinca, bolsaDinheiro } from '../../../personagens/elenco.js';
import { relogio, casa, relojoaria, bancada, cofreBanco, garagem, carroEscuro, plantaPlano, ruaChuva, chuva, bar, jornal } from '../../../cenarios/cidade.js';

function despertador(c, x, y, t, toca) { const sh = toca ? Math.sin(t * 60) * 4 : 0; c.save(); c.translate(x + sh, y); relogio(c, 0, 0, 40, t, { moldura: '#c0302a' }); for (const s of [-1, 1]) circle(c, s * 30, -40, 14, '#d8b040', { lw: 4 }); if (toca) for (const s of [-1, 1]) line(c, [[s * 50, -50], [s * 70, -66]], '#ffd23a', 5); c.restore(); }
function contas(c, x, y, n) { for (let i = 0; i < n; i++) { c.save(); c.translate(x + (i % 3) * 14, y - i * 10); c.rotate((i % 2 ? 0.1 : -0.08)); rrect(c, -50, -30, 100, 60, 3, '#f6f2ea', { lw: 3 }); c.font = '900 16px Inter, sans-serif'; c.textAlign = 'center'; c.fillStyle = '#d02a2a'; c.fillText('VENCIDO', 0, 6); c.restore(); } }

// ---------- 1. Uma vida comum ----------
export const c1 = {
  nome: 'Uma vida comum', inicio: 0, fim: 15,
  criar(st) {
    const V = voce('comum');
    return {
      desenhar(t) {
        V.reset(); V.s = 1.05;
        if (t < 6) {
          const cafe = t > 3;
          st.setCam(cafe ? 420 : 560, 1260, cafe ? 1.45 : 1.3);
          casa(st, t, { noite: 1 - sstep(0.5, 3, t) * 0.8 });
          st.mundo(c => {
            despertador(c, 760, 1340, t, t < 1.6);
            V.x = cafe ? 360 : 560; V.y = 1660;
            if (!cafe) { const esp = win(t, 0.8, 1.3, 2.2, 2.7); V.bracos(lerp(0.2, 2.8, esp), 0.1, lerp(0.2, 2.8, esp), 0.1); V.exp = esp > 0.5 ? 'fechado' : 'normal'; V.boca = esp > 0.5 ? 'aberta' : 'reta'; V.olhar = [0.4, 0]; }
            else { const gole = win(t, 3.8, 4.1, 4.8, 5.1); V.maoD = xicara(); V.bracos(0.3, 0.2, lerp(0.5, 0.9, gole), lerp(1.3, 2.3, gole)); V.exp = gole > 0.5 ? 'fechado' : 'preocupado'; V.boca = 'reta'; V.olhar = [0.6, 0.3]; }
            V.draw(c, t);
          });
          return;
        }
        if (t < 10.5) {
          st.setCam(lerp(480, 560, (t - 6) / 4.5), 1280, lerp(1.3, 1.45, (t - 6) / 4.5));
          relojoaria(st, t);
          st.mundo(c => {
            V.lupa = true; V.x = 520; V.y = 1560; V.semPernas = true; V.maoD = pinca(); V.bracos(0.6, 1.5, 0.7 + Math.sin(t * 6) * 0.05, 1.5);
            V.olhar = t < 8.8 ? [0, 0.7] : [0.7, 0.4]; V.exp = t < 8.8 ? 'normal' : 'preocupado'; V.boca = 'reta'; V.headTilt = t > 8.8 ? 0.08 : 0; V.draw(c, t);
            bancada(c, 540, 1420, t);
            contas(c, 780, 1410, Math.floor(sstep(7.5, 9.5, t) * 6) + 1);
            relogio(c, 420, 1400, 26, t * 3, { moldura: '#c8a040' });
          });
          return;
        }
        // à noite, instalando cofres de banco
        st.setCam(560, 1240, lerp(1.0, 1.15, (t - 10.5) / 4.5));
        cofreBanco(st, t);
        st.mundo(c => {
          V.x = 330; V.y = 1680; V.bracos(0.3, 0.2, 1.4, 0.4); V.olhar = [0.8, -0.2]; V.exp = 'fechado'; V.boca = 'reta'; V.squash = 0.04;
          if (t > 13.2) { V.exp = 'preocupado'; V.olhar = [0, 0.4]; V.bracoD = { a: 0.2, b: 0.1 }; }
          V.draw(c, t);
        });
      },
    };
  },
};

// ---------- 2. A notícia ----------
export const c2 = {
  nome: 'A notícia', inicio: 15, fim: 28,
  criar(st) {
    const V = voce('comum'), E = esposa(), F = filho();
    return {
      desenhar(t) {
        const noite = t > 24 ? 1 : 0;
        let cam;
        if (t < 20) cam = [lerp(480, 420, (t - 15) / 5), lerp(1260, 1150, sstep(16.6, 19.6, t)), lerp(1.3, 2.0, sstep(16.6, 19.8, t))];
        else if (t < 24) cam = [560, 1270, 1.1];
        else cam = [420, lerp(1220, 1180, (t - 24) / 4), lerp(1.4, 1.65, (t - 24) / 4)];
        st.setCam(cam[0], cam[1], cam[2]);
        casa(st, t, { noite, frio: sstep(16.6, 18, t) * 0.8 });
        st.mundo(c => {
          if (t > 20 && t < 24) {
            E.reset(); E.x = 820; E.y = 1640; E.s = 1.0; E.flip = -1; E.bracos(0.4, 1.4, 0.4, 1.4); E.exp = 'feliz'; E.boca = 'sorriso'; E.olhar = [0.5, 0.4]; E.draw(c, t);
            F.reset(); F.x = 600; F.y = 1640; F.s = 0.92; F.bracos(0.5, 1.6, 0.5, 1.6); F.exp = 'normal'; F.boca = 'reta'; F.olhar = [0, 0.6]; F.jump = Math.abs(Math.sin(t * 4)) * 4; F.draw(c, t);
          }
          V.reset(); V.s = 1.05; V.x = t < 20 ? 420 : (t < 24 ? 280 : 420); V.y = t < 24 ? 1660 : 1560; V.semPernas = t >= 24;
          if (t < 20) { V.maoD = carta(sstep(16.4, 16.6, t)); V.bracos(0.4, 1.5, 0.4, 1.5); V.exp = t < 16.6 ? 'normal' : 'choque'; V.boca = t < 16.6 ? 'reta' : 'o'; V.olhar = [0, 0.4]; V.tremor = sstep(17.5, 18, t) * 0.3; }
          else if (t < 24) { V.maoD = carta(1); V.bracos(0.3, 0.2, 0.3, 0.2); V.exp = 'preocupado'; V.boca = 'triste'; V.olhar = [0.9, 0]; }
          else { V.bracos(0.6, 1.9, 0.6, 1.9); V.exp = 'preocupado'; V.boca = 'triste'; V.olhar = [0, 0.7]; V.headTilt = 0.1; }
          V.draw(c, t);
          if (t >= 24) { rrect(c, 200, 1380, 680, 40, 10, '#4a3424', { lw: 6 }); c.save(); c.translate(560, 1360); carta(1)(c); c.restore(); relogio(c, 760, 1340, 34, t, { moldura: '#5a3a22' }); }
        });
      },
    };
  },
};

// ---------- 3. Uma oportunidade perigosa ----------
export const c3 = {
  nome: 'Uma oportunidade perigosa', inicio: 28, fim: 43,
  criar(st) {
    const V = voce('comum'), M = [mascarado(0), mascarado(1)], N = nico();
    const ALARME = 33.2;
    return {
      desenhar(t) {
        const alarme = sstep(ALARME, ALARME + 0.2, t) * (1 - sstep(37, 38, t));
        let cam;
        if (t < 32) cam = [480, 1250, 1.2];
        else if (t < 36.5) cam = [620, 1230, 0.95];
        else { cam = [380, 1260, lerp(1.6, 2.1, (t - 36.5) / 6.5)]; }
        st.setCam(cam[0], cam[1], cam[2], 0, shake(t, impulse(t, ALARME, 0.6)));
        cofreBanco(st, t, { alarme });
        st.mundo(c => {
          if (t > 32 && t < 37) {
            // a quadrilha tenta, o alarme dispara e eles fogem
            const foge = clamp((t - ALARME - 0.3) / 2.0);
            [M[0], M[1], N].forEach((p, i) => {
              p.reset(); p.s = 1.0; p.y = 1680 + (i % 2) * 20; p.x = lerp(640 + i * 150, -400 - i * 160, easeIn(foge)); p.flip = -1;
              if (foge > 0) { p.walk = t * 12; p.lean = -0.15; p.exp = 'medo'; p.boca = 'grito'; p.bracos(1.0, 1.4, 1.0, 1.4); }
              else { p.bracos(1.2, 0.4, 1.3, 0.3); p.exp = 'determinado'; p.boca = 'reta'; }
              p.olhar = [0.8, 0];
              if (p === N && t > 34.6 && t < 35.4) { p.olhar = [-0.9, 0]; p.exp = 'choque'; }
              p.draw(c, t);
            });
          }
          V.reset(); V.s = 1.05; V.x = 300; V.y = 1680;
          if (t < 32) { V.squash = 0.06; V.bracos(0.3, 0.2, 1.4, 0.4); V.exp = 'normal'; V.boca = 'reta'; V.olhar = [0.8, -0.2]; }
          else if (t < 36.5) { V.exp = 'choque'; V.boca = 'o'; V.olhar = [0.9, 0]; V.bracos(0.3, 0.1, 0.3, 0.1); V.alpha = 1; }
          else { const ideia = sstep(38.6, 39.2, t); V.exp = ideia > 0.5 ? 'malicia' : 'normal'; V.boca = ideia > 0.5 ? 'sorrisoMal' : 'reta'; V.olhar = [0.7, -0.4]; V.maoD = t > 40 ? relogioBolso() : null; V.bracoD = { a: lerp(0.2, 1.2, sstep(40, 40.5, t)), b: lerp(0.1, 1.6, sstep(40, 40.5, t)) }; }
          V.draw(c, t);
          const [hx, hy] = V.cabeca(); exclamacao(c, hx + 100, hy - 70, t - 38.8, '#ffd23a');
        });
      },
    };
  },
};

// ---------- 4. A primeira decisão ----------
export const c4 = {
  nome: 'A primeira decisão', inicio: 43, fim: 58,
  criar(st) {
    const V = voce('comum'), N = nico();
    const ABRE = 54.0;
    return {
      desenhar(t) {
        if (t < 47) {
          st.setCam(lerp(420, 560, (t - 43) / 4), 1270, 1.2);
          garagem(st, t);
          st.mundo(c => {
            carroEscuro(c, 760, 1740, 0.9, { flip: -1, farol: 0 });
            N.reset(); N.x = 780; N.y = 1660; N.s = 1.0; N.flip = -1; N.olhar = [0.8, 0]; N.exp = t > 45 ? 'normal' : 'preocupado'; N.boca = 'reta';
            N.bracoD = { a: lerp(0.3, 1.4, win(t, 45.8, 46.2, 46.8, 47.2)), b: 0 }; N.draw(c, t);
            V.reset(); V.x = lerp(80, 470, clamp((t - 43) / 2.4)); V.y = 1680; V.s = 1.05; if (t < 45.4) V.walk = t * 6; V.olhar = [0.8, 0]; V.exp = 'determinado'; V.boca = t > 45.4 && t < 46 ? 'aberta' : 'reta';
            V.bracoD = { a: lerp(0.2, 1.4, win(t, 45.8, 46.2, 46.8, 47.2)), b: 0 }; V.draw(c, t);
          });
          return;
        }
        if (t < 51.5) {
          st.setCam(540, 1200, lerp(1.1, 1.3, (t - 47) / 4.5));
          relojoaria(st, t, { noite: 1 });
          st.mundo(c => {
            V.reset(); V.x = 300; V.y = 1560; V.s = 1.05; V.semPernas = true; V.olhar = [0.7, 0.5]; V.exp = 'determinado'; V.boca = Math.sin(t * 10) > 0 ? 'aberta' : 'reta'; V.bracoD = { a: 1.3 + Math.sin(t * 3) * 0.1, b: 0.2 }; V.draw(c, t);
            N.reset(); N.x = 820; N.y = 1560; N.s = 1.0; N.semPernas = true; N.flip = -1; N.olhar = [0.6, 0.5]; N.exp = 'choque'; N.boca = 'o'; N.headTilt = Math.sin(t * 5) * 0.05; N.draw(c, t);
            rrect(c, 160, 1400, 760, 40, 10, '#5a3a22', { lw: 6 }); plantaPlano(c, 540, 1300, t, 1);
          });
          return;
        }
        if (t < ABRE) {
          // close no relógio de bolso chegando ao segundo exato
          st.setCam(540, 960, 1);
          const c = st.c; vgrad(c, 0, 0, 1080, 1920, [[0, '#14121a'], [1, '#2a2430']]); glow(c, 540, 960, 500, '#ffd890', 0.25);
          c.save(); c.translate(540, 960); c.scale(9, 9); relogioBolso()(c, 1, (ABRE - t) * -1 + 0.6); c.restore();
          return;
        }
        st.setCam(540, lerp(1100, 1200, (t - ABRE) / 4), lerp(0.9, 1.25, (t - ABRE) / 4));
        cofreBanco(st, t, { aberto: easeOut(clamp((t - ABRE) / 1.4)) });
        st.mundo(c => {
          N.reset(); N.x = 220; N.y = 1680; N.s = 1.0; N.maoD = bolsaDinheiro(); N.bracos(0.3, 0.2, 0.4, 0.3); N.exp = 'feliz'; N.boca = 'aberta'; N.olhar = [0.7, -0.3]; N.jump = Math.abs(Math.sin(t * 8)) * 16 * sstep(55, 55.5, t); N.draw(c, t);
          V.reset(); V.x = 760; V.y = 1680; V.s = 1.05; V.flip = -1; V.maoD = relogioBolso(); V.bracoD = { a: 1.2, b: 1.6 }; V.olhar = [0.7, -0.3];
          V.exp = t > 55.4 ? 'malicia' : 'choque'; V.boca = t > 55.4 ? 'sorrisoMal' : 'o'; V.draw(c, t);
          const [hx, hy] = V.cabeca(); glow(c, hx, hy, 220, '#ffe08a', sstep(54.6, 55.4, t) * 0.5);
        });
      },
    };
  },
};

// ---------- 5. O nascimento do Relojoeiro ----------
export const c5 = {
  nome: 'O nascimento do Relojoeiro', inicio: 58, fim: 73,
  criar(st) {
    const V = voce('comum'), R = voce('relojoeiro'), E = esposa(), F = filho();
    const VIRA = 69.6;
    return {
      desenhar(t) {
        if (t < 62) {
          st.setCam(760, 1250, 1.3);
          relojoaria(st, t, { noite: 1 });
          st.mundo(c => {
            V.reset(); V.x = 700; V.y = 1680; V.s = 1.05; V.maoD = bolsaDinheiro(); V.bracos(0.3, 0.2, lerp(0.4, 1.3, sstep(59, 59.6, t)), 0.3); V.olhar = [Math.sin(t * 3) * 0.9, 0]; V.exp = 'preocupado'; V.boca = 'reta'; V.suor = 1; V.draw(c, t);
            if (t > 60) { rrect(c, 920, 1120, 120, 340, 12, '#2a1a12', { lw: 6 }); for (let i = 0; i < 4; i++) rrect(c, 940, 1420 - i * 40 - sstep(60, 61.4, t) * 0, 80, 34, 4, '#5ab05a', { lw: 3 }); }
          });
          return;
        }
        if (t < 66.5) {
          st.setCam(540, 1250, 1.15);
          casa(st, t, { noite: 0.5 });
          st.mundo(c => {
            F.reset(); F.x = 160; F.y = 1640; F.s = 0.92; F.olhar = [0.8, 0]; F.exp = 'preocupado'; F.boca = 'reta'; F.draw(c, t);
            E.reset(); E.x = 800; E.y = 1650; E.s = 1.0; E.flip = -1; E.bracos(0.7, 2.2, 0.7, 2.2); E.olhar = [0.8, 0]; E.exp = 'preocupado'; E.boca = t < 63.6 ? (Math.sin(t * 12) > 0 ? 'aberta' : 'reta') : 'reta'; E.draw(c, t);
            V.reset(); V.x = 480; V.y = 1660; V.s = 1.05; V.olhar = [0.8, 0]; V.exp = t > 63.6 ? 'feliz' : 'normal'; V.boca = t > 63.6 ? 'sorriso' : 'reta'; V.bracos(0.3, 0.2, lerp(0.3, 1.2, sstep(63.8, 64.2, t)), 0.4); V.draw(c, t);
          });
          return;
        }
        // o espelho: o reflexo muda primeiro
        st.setCam(540, lerp(1220, 1150, (t - 66.5) / 6.5), lerp(1.2, 1.55, easeInOut((t - 66.5) / 6.5)));
        casa(st, t, { noite: 1, frio: 0.5 });
        st.mundo(c => {
          const vira = sstep(VIRA, VIRA + 0.5, t);
          rrect(c, 560, 980, 380, 640, 20, '#c8a040', { lw: 8 });
          c.save(); c.beginPath(); c.roundRect(580, 1000, 340, 600, 14); c.clip(); c.fillStyle = '#2a3040'; c.fillRect(580, 1000, 340, 600);
          const refl = sstep(67.6, 68.6, t) > 0.5 ? R : V; refl.reset(); refl.x = 750; refl.y = 1660; refl.s = 1.0; refl.flip = -1; refl.olhar = [0.9, 0]; refl.exp = refl === R ? 'malicia' : 'preocupado'; refl.boca = refl === R ? 'sorrisoMal' : 'reta'; refl.draw(c, t);
          glow(c, 750, 1300, 300, '#8ab0ff', 0.15); c.restore();
          const P = vira > 0.5 ? R : V; P.reset(); P.x = 330; P.y = 1680; P.s = 1.05; P.olhar = [0.9, 0]; P.exp = vira > 0.5 ? 'determinado' : 'choque'; P.boca = vira > 0.5 ? 'reta' : 'o'; P.draw(c, t);
          if (t > VIRA - 0.1 && t < VIRA + 0.4) glow(c, 330, 1400, 400, '#ffffff', 1 - Math.abs(t - VIRA - 0.15) / 0.3);
        });
      },
    };
  },
};

// ---------- 6. O preço do poder ----------
export const c6 = {
  nome: 'O preço do poder', inicio: 73, fim: 88,
  criar(st) {
    const R = voce('relojoeiro'), G = [gangster(0), gangster(1), gangster(2)], E = esposa(), F = filho();
    return {
      desenhar(t) {
        R.reset(); R.s = 1.05; R.capaVento = 0;
        if (t < 77) {
          st.setCam(540, lerp(1300, 1240, (t - 73) / 4), lerp(1.0, 1.3, (t - 73) / 4));
          ruaChuva(st, t);
          st.mundo(c => { R.x = 540; R.y = lerp(1600, 1700, (t - 73) / 4); R.s = lerp(0.85, 1.1, (t - 73) / 4); R.walk = t * 5; R.exp = 'determinado'; R.boca = 'reta'; R.olhar = [0, 0]; R.draw(c, t); });
          st.camada(0, c => chuva(c, t, 1));
          return;
        }
        if (t < 80) {
          st.setCam(540, 960, 1);
          ruaChuva(st, t);
          st.camada(0, c => { const k = easeOut(clamp((t - 77) / 0.6)); jornal(c, 540, lerp(2400, 960, k), 1.2, t, ['O RELOJOEIRO', 'ATACA DE NOVO']); chuva(c, t, 0.6); });
          return;
        }
        if (t < 83.5) {
          st.setCam(560, 1250, 1.05);
          bar(st, t);
          st.mundo(c => {
            G.forEach((g, i) => { g.reset(); g.x = [760, 920, 1060][i]; g.y = 1660; g.s = 1.0; g.flip = -1; const medo = sstep(81, 81.4 + i * 0.2, t); g.lean = -medo * 0.12; g.x += medo * 40; g.exp = medo > 0.5 ? 'medo' : 'raiva'; g.boca = medo > 0.5 ? 'tremendo' : 'reta'; g.suor = medo; g.olhar = [0.8, 0]; g.bracos(lerp(0.3, 1.2, medo), lerp(0.2, 2.0, medo), 0.3, 0.2); g.draw(c, t); });
            R.x = lerp(80, 360, clamp((t - 80) / 1.6)); R.y = 1680; if (t < 81.6) R.walk = t * 5; R.exp = 'determinado'; R.boca = 'reta'; R.olhar = [0.8, 0]; R.draw(c, t);
          });
          return;
        }
        if (t < 86) {
          st.setCam(540, 1250, 1.2);
          casa(st, t, { noite: 1, frio: 1 });
          st.mundo(c => {
            E.reset(); E.x = 300; E.y = 1560; E.s = 1.0; E.semPernas = true; E.olhar = [0.7, 0.2]; E.exp = 'preocupado'; E.boca = 'triste'; E.draw(c, t);
            F.reset(); F.x = 800; F.y = 1560; F.s = 0.92; F.semPernas = true; F.flip = -1; F.olhar = [0.7, 0.4]; F.exp = 'preocupado'; F.boca = 'reta'; F.draw(c, t);
            rrect(c, 200, 1380, 680, 40, 10, '#4a3424', { lw: 6 }); rrect(c, 500, 1200, 80, 180, 10, '#3a2a1e', { lw: 5 }); // cadeira vazia
          });
          return;
        }
        // close final: o rosto frio e o relógio parado
        const [hx, hy] = [540, 1680 - 300 * 1.05];
        st.setCam(hx, hy + 120, lerp(1.9, 2.3, (t - 86) / 2));
        ruaChuva(st, t);
        st.mundo(c => { R.x = 540; R.y = 1680; R.maoD = relogioBolso(true); R.bracoD = { a: 1.0, b: 1.7 }; R.exp = 'determinado'; R.boca = 'reta'; R.olhar = [0, 0]; R.draw(c, t); });
        st.camada(0, c => chuva(c, t, 0.7));
      },
    };
  },
};
