// CENA 1 — O ÚLTIMO DIA NORMAL (0–12 s) · CENA 2 — O PRIMEIRO MÍSSIL (12–24 s) · CENA 3 — A EXPLOSÃO (24–35 s)
import { kf, lerp, clamp, sstep, win, easeInOut, easeOut, easeIn, shake, impulse, rng } from '../../../motor/base.js';
import { glow, sparkle, poly, speedLines, circle } from '../../../motor/desenho.js';
import { exclamacao } from '../../../motor/balao.js';
import { voce, civil, crianca, celular, caneca } from '../../../personagens/pessoas.js';
import { quarto, cidade, carro, ondaChoque, entradaMetro, abrigoEscuro } from '../../../cenarios/mundo.js';

const ALERTA = 9.6, FLASH = 13.0;
// ícone de alerta sobre a cabeça
function alertaIcone(c, x, y, t, t0) { const dt = t - t0; if (dt < 0) return; const k = Math.min(1, dt / 0.2); c.save(); c.translate(x, y - 40 * k); c.scale(k, k); poly(c, [[0, -44], [44, 34], [-44, 34]], Math.sin(t * 14) > 0 ? '#ff3a2a' : '#ffd23a', { lw: 6 }); c.fillStyle = '#2b1f2a'; c.fillRect(-5, -16, 10, 28); c.beginPath(); c.arc(0, 22, 6, 0, 7); c.fill(); c.restore(); }

export const c1 = {
  nome: 'O último dia normal', inicio: 0, fim: 12,
  criar(st) {
    const V = voce(), P = [civil(0), civil(1), civil(3)], K = [crianca(0), crianca(1)];
    return {
      desenhar(t) {
        if (t < 6) {
          // acorda, se espreguiça, toma café e pega o celular
          st.setCam(lerp(560, 420, sstep(3, 4.5, t)), 1260, lerp(1.25, 1.45, sstep(3, 4.5, t)));
          quarto(st, t);
          st.mundo(c => {
            V.reset(); V.x = lerp(700, 300, sstep(2.6, 3.8, t)); V.y = 1620; V.s = 1.05;
            if (t > 2.6 && t < 3.8) V.walk = t * 8;
            const esp = win(t, 0.3, 0.9, 2.0, 2.5);
            V.bracos(lerp(0.2, 2.8, esp), lerp(0.1, 0.1, esp), lerp(0.2, 2.8, esp), 0.1);
            V.exp = esp > 0.5 ? 'fechado' : 'normal'; V.boca = esp > 0.5 ? 'aberta' : 'reta';
            if (t > 3.8) {
              const gole = win(t, 4.0, 4.3, 4.8, 5.1);
              V.maoD = caneca(); V.maoE = celular(); V.bracos(0.4, 1.3, lerp(0.4, 0.9, gole), lerp(1.3, 2.3, gole));
              V.olhar = [-0.3, 0.6]; V.exp = gole > 0.5 ? 'fechado' : 'feliz'; V.boca = 'sorriso';
            }
            V.draw(c, t);
          });
          return;
        }
        // na rua: vida normal até o alerta
        const al = t > ALERTA;
        const cam = t < 10.4 ? [540, 1270, 1.0] : (() => { const [hx, hy] = [540, 1650 - 300 * 1.05]; return [hx, hy + 140, lerp(1.6, 2.0, sstep(10.4, 11.6, t))]; })();
        st.setCam(cam[0], cam[1], cam[2]);
        cidade(st, t);
        st.mundo(c => {
          // carros passando (param de repente no alerta)
          const freia = (x0, v) => al ? x0 + v * (ALERTA - 6) + v * 0.4 * (1 - Math.exp(-(t - ALERTA) * 3)) : x0 + v * (t - 6);
          carro(c, freia(-400, 380), 1640, 0.9, { cor: '#e04a3a', rodando: t * 8 * (al ? 0 : 1) });
          carro(c, freia(1500, -330), 1800, 0.95, { cor: '#3a7ad0', rodando: -t * 8 * (al ? 0 : 1) });
          // crianças brincando de bola
          K.forEach((k, i) => { k.reset(); k.s = 0.7; k.x = i ? 900 : 700; k.y = 1500; k.jump = al ? 0 : Math.abs(Math.sin(t * 5 + i * 1.6)) * 40; k.exp = al ? 'choque' : 'feliz'; k.boca = al ? 'o' : 'aberta'; k.olhar = [i ? -0.8 : 0.8, al ? -0.5 : 0]; k.draw(c, t); });
          if (!al) circle(c, 800 + Math.sin(t * 2.5) * 90, 1360 - Math.abs(Math.sin(t * 5)) * 120, 24, '#ffffff', { lw: 5 });
          // pedestres
          P.forEach((p, i) => {
            p.reset(); p.s = 0.95; p.y = 1560; const dir = i % 2 ? -1 : 1;
            p.x = (i === 0 ? 100 : i === 1 ? 980 : 260) + (al ? (ALERTA - 6) : (t - 6)) * 60 * dir;
            if (!al) p.walk = t * 7 + i; p.maoD = celular(al ? 1 : 0); p.bracos(0.2, 0.1, al ? 0.7 : 0.2, al ? 1.6 : 0.1);
            p.exp = al ? 'choque' : 'normal'; p.boca = al ? 'o' : 'reta'; p.olhar = al ? [0, 0.6] : [dir * 0.8, 0]; p.draw(c, t);
            const [hx, hy] = p.cabeca(); alertaIcone(c, hx, hy - 100, t, ALERTA + 0.15 * i);
          });
          V.reset(); V.x = lerp(200, 540, clamp((t - 6) / 3.4)); V.y = 1650; V.s = 1.05; if (!al) V.walk = t * 7;
          V.maoD = caneca(al ? 0 : 1); V.maoE = celular(al ? 1 : 0); V.bracos(al ? 0.8 : 0.3, al ? 1.6 : 0.6, 0.3, 0.6);
          V.exp = al ? 'choque' : 'feliz'; V.boca = al ? 'o' : 'sorriso'; V.olhar = al ? [-0.4, 0.6] : [0.6, 0];
          V.draw(c, t);
          const [hx, hy] = V.cabeca(); alertaIcone(c, hx, hy - 110, t, ALERTA - 0.1);
        });
        if (al) st.camada(0, c => {
          const k = sstep(ALERTA + 0.2, ALERTA + 0.5, t), pisca = Math.sin(t * 12) > 0;
          c.save(); c.globalAlpha = k; c.fillStyle = pisca ? '#d02a1a' : '#a01a10'; c.fillRect(0, 200, 1080, 150);
          c.font = '900 64px Inter, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#ffffff'; c.fillText('⚠ ALERTA DE EMERGÊNCIA ⚠', 540, 275); c.restore();
          c.save(); c.globalAlpha = 0.12 * k * (pisca ? 1 : 0); c.fillStyle = '#ff0000'; c.fillRect(0, 0, 1080, 1920); c.restore();
        });
      },
    };
  },
};

export const c2 = {
  nome: 'O primeiro míssil', inicio: 12, fim: 24,
  criar(st) {
    const V = voce(), P = [civil(0), civil(1), civil(2), civil(3), civil(4)];
    return {
      desenhar(t) {
        const flash = Math.exp(-Math.max(0, t - FLASH) * 1.6) * (t > FLASH ? 1 : 0);
        const cog = clamp((t - FLASH - 0.3) / 6);
        const pan = sstep(FLASH, FLASH + 2, t) * 0.8 + sstep(19, 21, t) * 0.2;
        let cam;
        if (t < 15.5) cam = [540, 1310, lerp(1.9, 2.0, (t - 12) / 3.5)];
        else if (t < 19.5) cam = [540, lerp(1150, 1050, (t - 15.5) / 4), lerp(0.95, 0.85, (t - 15.5) / 4)];
        else cam = [540, 1300, 1.0];
        st.setCam(cam[0], cam[1], cam[2], 0, shake(t, impulse(t, FLASH + 0.6, 0.8, 1.0) + (t > 19.5 ? 0.2 : 0)));
        cidade(st, t, { panico: pan, cogumelo: cog, flash: flash * 0.9 });
        st.mundo(c => {
          const corre = t > 19.5;
          if (corre) P.forEach((p, i) => {
            const dir = i % 2 ? -1 : 1, x0 = [-200, 1300, 100, 950, -400][i];
            p.reset(); p.s = 0.95; p.y = 1560 + (i % 3) * 40; p.x = x0 + (t - 19.5) * 420 * dir; p.walk = t * 13 + i; p.lean = dir * 0.15;
            p.bracos(2.4, 0.5, 2.4, 0.5); p.exp = 'medo'; p.boca = 'grito'; p.olhar = [dir * 0.8, 0]; p.draw(c, t);
          });
          V.reset(); V.x = 540; V.y = 1650; V.s = 1.05;
          const protege = win(t, FLASH, FLASH + 0.2, 15.2, 16);
          V.bracos(0.3, 0.6, lerp(0.3, 2.2, protege), lerp(0.6, 2.0, protege));
          V.exp = t < FLASH ? 'normal' : (t < 19.5 ? 'choque' : 'medo'); V.boca = t < FLASH ? 'reta' : (t < 19.5 ? 'o' : 'grito');
          V.olhar = t < 19.5 ? [0, -0.8] : [0.8, 0]; V.suor = t > 17 ? 1 : 0;
          if (t > 21.6) { V.x = 540 + (t - 21.6) * 300; V.walk = t * 13; V.lean = 0.15; V.bracos(1.0, 1.4, 1.0, 1.4); }
          V.draw(c, t);
          const [hx, hy] = V.cabeca(); exclamacao(c, hx + 100, hy - 70, t - 21.2, '#ff5a2a');
        });
        st.overlay('#ffffff', flash * 0.95);
      },
    };
  },
};

export const c3 = {
  nome: 'A explosão', inicio: 24, fim: 35,
  criar(st) {
    const V = voce();
    const ENTRA = 31.4, IMPACTO = 32.0;
    return {
      desenhar(t) {
        if (t < IMPACTO) {
          const vx = lerp(0, 2600, clamp((t - 24) / (ENTRA - 24)));
          const onda = lerp(-1100, 2300, clamp((t - 24) / (IMPACTO - 24)));
          st.setCam(vx + 120, 1250, 0.95, 0, shake(t, 0.45 + sstep(29, 31.5, t) * 0.6, 22));
          cidade(st, t, { panico: 1 });
          st.mundo(c => {
            entradaMetro(c, 2750, 1640);
            // vidros caindo dos prédios
            const r = rng(Math.floor(t * 6));
            for (let i = 0; i < 10; i++) { const gx = vx - 400 + r() * 1100, gy = 900 + ((t * 700 + i * 140) % 700); poly(c, [[gx, gy], [gx + 18, gy + 30], [gx - 10, gy + 26]], '#bfe6f6', { lw: 3 }); }
            // carro capotando
            const cv = clamp((t - 27.6) / 1.6); if (cv > 0 && cv < 1) carro(c, vx - 500 + cv * 1400, 1700 - Math.sin(cv * Math.PI) * 380, 0.85, { cor: '#3a9a6a', ang: cv * 6.5 });
            carro(c, 1300, 1700, 0.9, { cor: '#e0a030', ang: sstep(29.5, 30, t) * -0.5 });
            V.reset(); V.x = vx; V.y = 1680; V.s = 1.05; V.walk = t * 15; V.lean = 0.18; V.bracos(1.1, 1.5, 1.1, 1.5);
            V.exp = 'medo'; V.boca = 'grito'; V.suor = 1; V.olhar = [t > 28.5 && t < 29.4 ? -0.9 : 0.9, 0];
            if (t > ENTRA - 0.4) { const u = clamp((t - (ENTRA - 0.4)) / 0.5); V.x = lerp(vx, 2750, u); V.y = 1680 + u * 160; V.alpha = 1 - u; V.squash = u * 0.2; }
            V.draw(c, t);
            ondaChoque(c, onda, t);
          });
          st.camada(0, c => speedLines(c, 540, 960, 50, 500, 1500, 0.3, t, '#ffe0b0'));
          return;
        }
        // dentro do abrigo: o mundo treme
        const luz = 1 - sstep(33.8, 34.8, t);
        st.setCam(540, 1300, 1.35, 0, shake(t, impulse(t, IMPACTO, 2.6, 1.4) + 0.15, 26));
        abrigoEscuro(st, t, luz);
        st.mundo(c => {
          V.reset(); V.x = 540; V.y = 1660; V.s = 1.05; V.squash = 0.12; V.tremor = 0.8; V.bracos(2.5, 2.2, 2.5, 2.2); V.exp = 'medo'; V.boca = 'tremendo'; V.suor = 1;
          V.draw(c, t);
          const r = rng(Math.floor(t * 8)); for (let i = 0; i < 18; i++) { const px = 300 + r() * 500, py = 300 + ((t * 500 + i * 70) % 1300); c.save(); c.globalAlpha = 0.6 * luz; c.fillStyle = '#c8b8a0'; c.fillRect(px, py, 6, 6); c.restore(); }
        });
        st.overlay('#c89a6a', Math.exp(-(t - IMPACTO) * 2.5) * 0.7);
        st.overlay('#000000', 1 - luz * 0.85 - 0.15);
      },
    };
  },
};
