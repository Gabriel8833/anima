// "A prisão dentro de você" — história original. Você e O Outro (que no fim se revela parte de você).
import { TAU, lerp, clamp, sstep, win, easeInOut, easeOut, rng, mix, shake, impulse } from '../../../motor/base.js';
import { glow, rrect, line, circle, ellipse, poly, vgrad, shape, sparkle, cloud } from '../../../motor/desenho.js';
import { protagonista, outro, marreta, pasta, passante, celular } from '../../../personagens/elenco.js';
import { trem, escritorio, mesaEscritorio, apartamento, porao, tvVelha, outdoor, rachaduras, rua, banheiro, espelho, pia, predio, JANELA } from '../../../cenarios/lugares.js';
import { ruaChuva } from '../../../cenarios/cidade.js';

const W = 1080, H = 1920;
// figurantes com roupas apagadas (paleta adulta e sombria)
const apagar = p => { for (const k of ['roupa', 'roupaSombra', 'manga', 'enfeite', 'cinto', 'perna']) p.d[k] = mix(p.d[k], '#2e302a', 0.6); return p; };
const piscada = (t, f = 3.8, o = 0) => (((t + o) % f) < 0.13 ? 1 : 0);
function carimbo(st, txt, a) { st.text(txt, 880, 160, { size: 52, fill: '#d8c890', alpha: a, lw: 10 }); }
function deitado(c, P, t, x, y) { c.save(); c.translate(x, y); c.rotate(-Math.PI / 2); P.x = 0; P.y = 0; P.draw(c, t); c.restore(); }
// sombra gigante projetada na parede
function sombraGigante(c, P, t, dx, dy, k, a) { c.save(); c.globalAlpha *= a; c.translate(dx, dy); c.scale(k, k); c.filter = 'brightness(0)'; const ox = P.x, oy = P.y; P.x = 0; P.y = 0; P.draw(c, t); P.x = ox; P.y = oy; c.restore(); }

// ---------- 1. Uma vida vazia (rotina repetida) ----------
export const c1 = {
  nome: 'Uma vida vazia', inicio: 0, fim: 14.6,
  criar(st) {
    const V = protagonista(), P = [0, 1, 2, 3, 4, 5].map(i => apagar(passante(i + 50)));
    // a rotina passa duas vezes: a segunda, mais rápida
    const blocos = [[0, 'acorda', 'SEG 06:00'], [2.6, 'trem', 'SEG 07:12'], [4.6, 'escritorio', 'SEG 14:30'], [6.6, 'casa', 'SEG 21:40'], [8.4, 'acorda', 'TER 06:00'], [9.6, 'trem', 'TER 07:12'], [10.7, 'escritorio', 'TER 14:30'], [11.8, 'casa', 'TER 21:40']];
    return {
      desenhar(t) {
        let b = blocos[0]; for (const x of blocos) if (t >= x[0]) b = x;
        const [t0, tipo, hora] = b, dt = t - t0;
        V.reset(); V.piscar = piscada(t); V.exp = 'normal'; V.boca = 'reta';
        if (tipo === 'acorda') {
          st.setCam(470, 940, 1.5);
          st.mundo(c => {
            vgrad(c, -400, -200, 1900, 2400, [[0, '#2a2e28'], [1, '#161a14']]);
            rrect(c, 130, 640, 820, 640, 20, '#3a3a34', { lw: 6 }); rrect(c, 150, 660, 780, 600, 14, '#c8c4b4', { lw: 5 }); rrect(c, 170, 800, 200, 320, 40, '#e0dccc', { lw: 5 });
            V.s = 1.5; V.exp = dt < 0.6 ? 'fechado' : 'normal'; V.olhar = [0, 0]; V.bracos(0.2, 0.1, 0.2, 0.1);
            deitado(c, V, t, 760, 960);
            shape(c, c => { c.moveTo(560, 660); c.quadraticCurveTo(540, 960, 560, 1260); c.lineTo(930, 1260); c.lineTo(930, 660); c.closePath(); }, '#8a9080');
            rrect(c, 160, 1320, 160, 140, 8, '#2a2a26', { lw: 5 }); c.save(); c.font = '900 44px Inter'; c.textAlign = 'center'; c.fillStyle = dt < 0.6 ? '#ff4a3a' : '#c84a3a'; c.fillText('06:00', 240, 1405); c.restore();
            if (dt < 0.6) glow(c, 240, 1390, 160, '#ff4a3a', 0.5);
          });
        } else if (tipo === 'trem') {
          st.setCam(540, 1270, 1.25);
          trem(st, t);
          st.mundo(c => {
            const sway = Math.sin(t * 3) * 0.04;
            P.forEach((p, i) => { p.reset(); p.blush = 0; p.x = [120, 300, 760, 940, 220, 860][i]; p.y = i < 4 ? 1690 : 1640; p.s = i < 4 ? 1 : 0.92; p.flip = i % 2 ? -1 : 1; p.lean = sway; p.exp = 'normal'; p.boca = 'reta'; p.olhar = [0, 0.7]; p.maoD = celular(1); p.bracos(2.7, 0.2, 0.8, 2.2); p.piscar = piscada(t, 4, i); if (i >= 4) p.draw(c, t); });
            V.x = 540; V.y = 1690; V.lean = sway; V.maoD = pasta(); V.bracos(2.7, 0.2, 0.2, 0.1); V.olhar = [0, 0.1]; V.draw(c, t);
            P.slice(0, 4).forEach(p => p.draw(c, t));
          });
        } else if (tipo === 'escritorio') {
          st.setCam(540, 1290, 1.35);
          escritorio(st, t);
          st.mundo(c => {
            V.x = 540; V.y = 1760; V.semPernas = true; V.olhar = [0, -0.3]; V.bracos(0.6, 2.0, 0.6 + Math.sin(t * 14) * 0.05, 2.0);
            V.draw(c, t); mesaEscritorio(c, 540);
            rrect(c, 690, 1480, 110, 60, 6, '#e8e4d8', { lw: 3 }); for (let i = 0; i < Math.min(8, 2 + Math.floor(dt * 4)); i++) rrect(c, 690, 1474 - i * 8, 110, 8, 2, '#f6f2ea', { lw: 2 });
          });
        } else {
          st.setCam(560, 1280, 1.35);
          apartamento(st, t, { noite: 0.7 });
          st.mundo(c => {
            V.x = lerp(220, 560, clamp(dt / 1.2)); V.y = 1700; if (dt < 1.2) V.walk = t * 5; V.olhar = [0.3, 0.3]; V.maoD = pasta(); V.bracos(0.2, 0.1, 0.2, 0.1); V.headTilt = 0.05;
            V.draw(c, t);
          });
        }
        carimbo(st, hora, 0.9);
      },
    };
  },
};

// ---------- 2. O encontro ----------
export const c2 = {
  nome: 'O encontro', inicio: 14.6, fim: 28.8,
  criar(st) {
    const V = protagonista(), O = outro();
    return {
      desenhar(t) {
        V.reset(); O.reset(); V.piscar = piscada(t, 5); O.piscar = piscada(t, 4.6, 1);
        if (t < 19) {
          // insônia: olhando o teto
          st.setCam(470, 930, lerp(1.6, 2.0, (t - 14.6) / 4.4));
          st.mundo(c => {
            vgrad(c, -400, -200, 1900, 2400, [[0, '#141a16'], [1, '#0a0c0a']]);
            rrect(c, 130, 640, 820, 640, 20, '#262822', { lw: 6 }); rrect(c, 150, 660, 780, 600, 14, '#5a5e54', { lw: 5 }); rrect(c, 170, 800, 200, 320, 40, '#6a6e64', { lw: 5 });
            V.s = 1.5; V.exp = 'normal'; V.olhar = [0, 0]; V.piscar = piscada(t, 2.2); V.bracos(0.2, 0.1, 0.2, 0.1); deitado(c, V, t, 760, 960);
            shape(c, c => { c.moveTo(560, 660); c.quadraticCurveTo(540, 960, 560, 1260); c.lineTo(930, 1260); c.lineTo(930, 660); c.closePath(); }, '#3a4036');
            c.save(); c.globalAlpha = 0.12; c.fillStyle = '#c8d8b0'; c.beginPath(); c.moveTo(900, 0); c.lineTo(1100, 0); c.lineTo(700, 1900); c.lineTo(400, 1900); c.closePath(); c.fill(); c.restore();
          });
          carimbo(st, t < 16.2 ? '03:12' : t < 17.6 ? '03:58' : '04:41', 1);
          return;
        }
        // a rua à noite: o Outro encostado no poste
        const close = t > 23;
        const fala = t > 24.4;
        O.x = 760; O.y = 1700; O.flip = -1; O.exp = 'malicia'; O.boca = fala && Math.sin(t * 10) > 0 ? 'aberta' : 'sorrisoMal'; O.olhar = [0.8, 0]; O.lean = close ? 0 : -0.06; O.bracos(0.4, 2.2, close ? 1.3 : 0.4, close ? 0.2 : 2.2);
        V.x = close ? 380 : lerp(120, 360, clamp((t - 19) / 2.2)); V.y = 1700; if (!close && t < 21.2) V.walk = t * 5; V.exp = 'normal'; V.boca = 'reta'; V.olhar = [0.8, 0]; V.maoD = pasta(); V.bracos(0.2, 0.1, 0.2, 0.1);
        if (t > 26.6) { V.olhar = [0, 0.8]; V.exp = 'preocupado'; }
        let cam;
        if (!close) cam = [lerp(400, 560, clamp((t - 19) / 3)), 1260, 1.25];
        else if (t < 26.6) { const [hx, hy] = O.cabeca(); cam = [hx - 60, hy + 80, 2.3]; }
        else { const [hx, hy] = V.cabeca(); cam = [hx + 40, hy + 120, 2.1]; }
        st.setCam(cam[0], cam[1], cam[2]);
        ruaChuva(st, t);
        st.mundo(c => {
          rrect(c, 880, 1000, 20, 700, 4, '#2a2a30', { lw: 4 }); glow(c, 860, 1020, 300, '#ffd890', 0.4);
          O.draw(c, t); V.draw(c, t);
          // ele puxa a gravata do protagonista com um dedo
          if (close && t < 26.6) { const [mx, my] = O.mao(1); glow(c, mx, my, 60, '#d8c890', 0.3); }
        });
      },
    };
  },
};

// ---------- 3. O porão ----------
export const c3 = {
  nome: 'O porão', inicio: 28.8, fim: 42.8,
  criar(st) {
    const V = protagonista(), O = outro(), H = [0, 1, 2, 3, 4].map(i => apagar(passante(i + 70)));
    return {
      desenhar(t) {
        V.reset(); O.reset(); V.piscar = piscada(t, 4.4); O.piscar = piscada(t, 5, 2);
        if (t < 32) {
          // descendo a escada atrás do Outro
          const u = (t - 28.8) / 3.2;
          st.setCam(lerp(200, 420, u), lerp(1000, 1250, u), 1.25);
          porao(st, t, { balanco: 1 });
          st.camada(0.85, c => {
            O.x = lerp(-60, 380, u) + 160; O.y = lerp(900, 1500, u) + 110; O.s = 0.95; O.walk = t * 5; O.exp = 'malicia'; O.boca = 'sorrisoMal'; O.olhar = [-0.6, 0]; O.bracos(0.2, 0.3, 0.2, 0.3); O.draw(c, t);
            V.x = lerp(-180, 240, u) + 60; V.y = lerp(780, 1360, u); V.s = 0.95; V.walk = t * 5; V.exp = 'preocupado'; V.boca = 'reta'; V.olhar = [0.4, 0.4]; V.bracos(0.4, 0.3, 0.4, 0.3); V.draw(c, t);
          });
          return;
        }
        // o círculo de homens; alguém quebra uma TV; depois é a vez dele
        const vez = t > 37;
        const golpe1 = 34.4, golpe2 = 39.0;
        st.setCam(540, lerp(1260, 1300, (t - 32) / 10.8), vez ? lerp(1.3, 1.6, sstep(37, 41, t)) : 1.2, 0, shake(t, impulse(t, golpe1, 0.6) + impulse(t, golpe2, 1.0)));
        porao(st, t, { balanco: 0.6, vermelho: sstep(38.8, 39.4, t) * 0.7 });
        st.mundo(c => {
          // homens ao redor (fundo)
          H.forEach((h, i) => { h.reset(); h.blush = 0; h.x = [90, 260, 820, 990, 540][i]; h.y = i === 4 ? 1560 : 1640; h.s = 0.9; h.flip = i < 2 ? 1 : -1; const grita = t > golpe1 && t < golpe1 + 1.6 || t > golpe2; h.exp = grita ? 'raiva' : 'normal'; h.boca = grita ? 'grito' : 'reta'; h.olhar = [h.flip * 0.6, 0.3]; h.bracos(grita ? 2.4 : 0.3, 0.4, grita ? 2.4 : 0.3, 0.4); h.jump = grita ? Math.abs(Math.sin(t * 8 + i)) * 14 : 0; h.piscar = piscada(t, 4, i); if (!vez || i !== 4) h.draw(c, t); });
          if (!vez) {
            // um homem quebra a primeira TV
            const ergue = sstep(32.6, 34.2, t) * (1 - sstep(34.4, 34.6, t));
            tvVelha(c, 760, 1700, 1, t > golpe1 ? t - golpe1 : 0, t);
            const Hm = H[4]; Hm.reset(); Hm.blush = 0; Hm.x = 560; Hm.y = 1700; Hm.s = 1; Hm.maoD = marreta(); Hm.exp = 'raiva'; Hm.boca = t > golpe1 ? 'grito' : 'dentes'; Hm.olhar = [0.8, 0.3]; Hm.bracos(0.3, 0.2, lerp(1.2, 3.0, ergue), 0.2); Hm.draw(c, t);
            V.x = 260; V.y = 1720; V.s = 1; V.exp = t > golpe1 ? 'choque' : 'preocupado'; V.boca = t > golpe1 ? 'o' : 'reta'; V.olhar = [0.9, 0.2]; V.draw(c, t);
            O.x = 900; O.y = 1720; O.flip = -1; O.exp = 'malicia'; O.boca = 'sorrisoMal'; O.olhar = [0.9, 0]; O.bracos(0.4, 2.2, 0.4, 2.2); O.draw(c, t);
            if (t > golpe1 && t < golpe1 + 0.5) glow(c, 760, 1610, 300, '#e8f8ff', 1 - (t - golpe1) / 0.5);
            return;
          }
          // a vez dele
          const ergue = sstep(37.6, 38.8, t) * (1 - sstep(39.0, 39.15, t)), alivio = sstep(40.2, 40.8, t);
          tvVelha(c, 720, 1700, 1, t > golpe2 ? t - golpe2 : 0, t);
          O.x = 980; O.y = 1700; O.flip = -1; O.exp = 'malicia'; O.boca = 'sorrisoMal'; O.olhar = [0.9, 0]; O.bracos(0.4, 2.2, 0.4, 2.2); O.draw(c, t);
          V.x = 470; V.y = 1700; V.maoD = alivio < 0.5 ? marreta() : null; V.exp = alivio > 0.5 ? 'feliz' : 'raiva'; V.boca = alivio > 0.5 ? 'sorriso' : (t > golpe2 ? 'grito' : 'dentes'); V.olhar = [0.8, 0.3];
          V.bracos(0.3, 0.2, alivio > 0.5 ? 0.3 : lerp(1.2, 3.0, ergue), 0.2); V.squash = alivio * Math.sin(t * 8) * 0.02; V.suor = alivio;
          V.draw(c, t);
          if (t > golpe2 && t < golpe2 + 0.5) glow(c, 720, 1610, 360, '#e8f8ff', 1 - (t - golpe2) / 0.5);
          // mãos nas costas (pertencimento)
          if (alivio > 0.5) { const Hm = H[4]; Hm.reset(); Hm.blush = 0; Hm.x = 290; Hm.y = 1720; Hm.exp = 'feliz'; Hm.boca = 'sorriso'; Hm.olhar = [0.8, 0]; Hm.bracos(0.3, 0.2, 1.3, 0.6); Hm.draw(c, t); }
        });
      },
    };
  },
};

// ---------- 4. A transformação ----------
export const c4 = {
  nome: 'A transformação', inicio: 42.8, fim: 57.4,
  criar(st) {
    const V = protagonista(), O = outro(), C = [apagar(passante(80)), apagar(passante(81))];
    return {
      desenhar(t) {
        V.reset(); O.reset(); V.piscar = piscada(t, 4.1); O.piscar = piscada(t, 5);
        if (t < 47.2) {
          // vitrines e outdoors; ele arranca a gravata
          const u = (t - 42.8) / 4.4;
          V.x = lerp(160, 520, u); O.x = V.x + 190; V.y = O.y = 1700; V.walk = O.walk = t * 4.5; O.flip = 1;
          O.exp = 'malicia'; O.boca = Math.sin(t * 9) > 0 ? 'aberta' : 'sorrisoMal'; O.olhar = [-0.7, 0]; O.bracos(0.3, 0.3, lerp(0.4, 2.0, win(t, 43.6, 43.9, 45.0, 45.3)), 0.1);
          const tira = sstep(45.6, 46.2, t); V.mudado = false; V.exp = 'determinado'; V.boca = 'reta'; V.olhar = [0.3, -0.5]; V.bracos(0.2, 0.2, lerp(0.2, 2.6, win(t, 45.4, 45.7, 46.3, 46.6)), lerp(0.2, 1.8, win(t, 45.4, 45.7, 46.3, 46.6)));
          st.setCam(V.x + 100, 1220, 1.15);
          rua(st, t, { cinza: 0.6 });
          st.mundo(c => {
            outdoor(c, -200, 740, 520, 260, 'COMPRE.', 'você merece mais', '#c8302a'); outdoor(c, 420, 700, 540, 280, 'SEJA ALGUÉM.', 'parcele em 12x', '#2a5a3a'); outdoor(c, 1040, 760, 480, 240, 'NOVO.', 'o antigo já não serve', '#c8302a');
            V.draw(c, t); O.draw(c, t);
            if (tira > 0) { const g = clamp((t - 46.2) / 0.8); c.save(); c.translate(V.x + 60 + g * 30, 1500 + g * g * 180); c.rotate(g * 2); poly(c, [[-8, -40], [8, -40], [16, 30], [0, 46], [-16, 30]], '#7a1e28', { lw: 3 }); c.restore(); }
          });
          return;
        }
        if (t < 51.6) {
          // larga o emprego: sai do escritório com uma caixa; o Outro espera encostado
          V.mudado = true; V.x = lerp(380, 1000, clamp((t - 47.2) / 4)); V.y = 1700; V.walk = t * 5; V.exp = 'determinado'; V.boca = 'reta'; V.olhar = [0.8, 0]; V.bracos(1.0, 1.6, 1.0, 1.6);
          st.setCam(560, 1280, 1.3);
          escritorio(st, t);
          st.mundo(c => {
            C.forEach((p, i) => { p.reset(); p.blush = 0; p.x = [160, 860][i]; p.y = 1640; p.s = 0.92; p.flip = i ? -1 : 1; p.exp = 'choque'; p.boca = 'o'; p.olhar = [(V.x > p.x ? 0.8 : -0.8), 0]; p.draw(c, t); });
            O.x = 960; O.y = 1700; O.flip = -1; O.lean = -0.1; O.exp = 'malicia'; O.boca = 'sorrisoMal'; O.olhar = [0.8, 0]; O.bracos(0.4, 2.2, 0.4, 2.2); O.alpha = 1 - sstep(50.6, 51.4, t) * 0.0; O.draw(c, t);
            V.draw(c, t); const [lx, ly] = V.mao(-1), [rx, ry] = V.mao(1); rrect(c, (lx + rx) / 2 - 80, (ly + ry) / 2 - 40, 160, 90, 4, '#b89a6a', { lw: 4 }); line(c, [[(lx + rx) / 2 - 20, (ly + ry) / 2 - 40], [(lx + rx) / 2 + 10, (ly + ry) / 2 - 90]], '#2a2a2e', 6);
          });
          return;
        }
        // o Outro como figura dominante: sombra gigante, prédios de luxo, luz vermelha
        const k = clamp((t - 51.6) / 5.8);
        V.mudado = true; V.x = 420; V.y = 1700; V.exp = 'normal'; V.boca = 'reta'; V.olhar = [0, -0.4]; V.bracos(0.12, 0.1, 0.12, 0.1); V.piscar = 0;
        O.x = 660; O.y = 1700; O.flip = -1; O.exp = 'malicia'; O.boca = 'sorrisoMal'; O.olhar = [0.8, 0]; O.bracos(0.4, 0.2, lerp(0.4, 1.35, sstep(52.6, 53.2, t)), 0.6);
        st.setCam(540, lerp(1300, 1200, k), lerp(1.3, 1.0, k));
        predio(st, t);
        st.mundo(c => {
          vgrad(c, -1400, 1480, 3900, 900, [[0, '#1a1a1e'], [1, '#0a0a0c']]);
          sombraGigante(c, O, t, 760, 1500, lerp(1.2, 3.2, easeOut(k)), 0.55);
          V.draw(c, t); O.draw(c, t);
          glow(c, 660, 1400, 500, '#c8302a', 0.25 + 0.1 * Math.sin(t * 3));
        });
      },
    };
  },
};

// ---------- 5. A revelação ----------
export const c5 = {
  nome: 'A revelação', inicio: 57.4, fim: 71.6,
  criar(st) {
    const V = protagonista(), O = outro(), R = protagonista(), Ro = outro();
    return {
      desenhar(t) {
        V.reset(); O.reset(); V.mudado = true; V.piscar = piscada(t, 4); O.piscar = piscada(t, 5);
        if (t < 61.4) {
          // os dois diante do espelho... mas o espelho mostra só um
          const nota = sstep(59.4, 59.8, t);
          V.x = 300; V.y = 1700; V.exp = nota > 0.5 ? 'choque' : 'normal'; V.boca = nota > 0.5 ? 'o' : 'reta'; V.olhar = [0.9, -0.1];
          O.x = 500; O.y = 1700; O.flip = 1; O.exp = 'malicia'; O.boca = 'sorrisoMal'; O.olhar = [-0.8, 0]; O.bracos(0.4, 2.2, 0.4, 2.2);
          st.setCam(560, 1250, lerp(1.3, 1.55, (t - 57.4) / 4));
          banheiro(st, t, { frio: 1 });
          st.mundo(c => {
            espelho(c, 640, 940, 360, 580, t, c => { R.reset(); R.mudado = true; R.x = 820; R.y = 1520; R.s = 0.92; R.flip = -1; R.exp = V.exp; R.boca = V.boca; R.olhar = V.olhar; R.draw(c, t); }, { frio: 1 });
            pia(c, 820, 1520, 1);
            O.draw(c, t); V.draw(c, t);
          });
          return;
        }
        if (t < 65.4) {
          // flashes: as lembranças, agora sem o Outro
          const cenas = [[61.4, 'rua'], [62.4, 'porao'], [63.4, 'outdoor'], [64.4, 'espelho']];
          let qual = cenas[0]; for (const x of cenas) if (t >= x[0]) qual = x;
          const sem = ((t - qual[0]) % 1) > 0.45; // primeiro com ele, depois vazio
          st.setCam(540, 1270, 1.3);
          if (qual[1] === 'rua' || qual[1] === 'outdoor') ruaChuva(st, t); else if (qual[1] === 'porao') porao(st, t, { vermelho: 0.6 }); else banheiro(st, t, { frio: 1 });
          st.mundo(c => {
            V.x = 380; V.y = 1700; V.exp = qual[1] === 'porao' ? 'raiva' : 'normal'; V.boca = qual[1] === 'porao' ? 'grito' : 'aberta'; V.olhar = [0.8, 0]; V.bracos(0.4, 0.4, qual[1] === 'porao' ? 2.8 : 1.3, 0.3); if (qual[1] === 'porao') V.maoD = marreta();
            V.draw(c, t);
            if (!sem) { O.x = 720; O.y = 1700; O.flip = -1; O.exp = 'malicia'; O.boca = 'sorrisoMal'; O.olhar = [0.8, 0]; O.draw(c, t); }
            else { c.save(); c.globalAlpha = 0.25; c.strokeStyle = '#c8302a'; c.setLineDash([12, 10]); c.lineWidth = 5; c.strokeRect(620, 1300, 200, 420); c.restore(); }
          });
          st.overlay('#ffffff', win((t - qual[0]) % 1, 0.43, 0.45, 0.47, 0.55) * 0.5);
          return;
        }
        // o Outro entra em você: as duas figuras se fundem
        const funde = easeInOut(clamp((t - 65.6) / 3.6));
        st.setCam(540, lerp(1240, 1200, funde), lerp(1.5, 2.1, funde), 0, shake(t, impulse(t, 69.2, 0.7)));
        banheiro(st, t, { frio: 1 });
        st.mundo(c => {
          V.x = 540; V.y = 1700; V.exp = funde > 0.9 ? 'determinado' : 'choque'; V.boca = funde > 0.9 ? 'reta' : 'o'; V.olhar = [0, -0.1]; V.tremor = win(t, 66, 66.5, 68.8, 69.3) * 0.25;
          O.x = lerp(820, 540, funde); O.y = 1700; O.flip = -1; O.exp = 'malicia'; O.boca = 'sorrisoMal'; O.olhar = [0.8, 0]; O.alpha = 1 - funde; O.s = lerp(1, 1.05, funde);
          V.draw(c, t); O.draw(c, t);
          if (t > 69.2 && t < 70) glow(c, 540, 1450, 600, '#c8302a', 1 - (t - 69.2) / 0.8);
        });
      },
    };
  },
};

// ---------- 6. A reflexão final: espelho rachado, o reflexo com outra expressão ----------
export const c6 = {
  nome: 'A reflexão final', inicio: 71.6, fim: 88,
  criar(st) {
    const V = protagonista(), R = protagonista();
    return {
      desenhar(t) {
        V.reset(); V.mudado = true; V.piscar = piscada(t, 4.6);
        const k = easeInOut(clamp((t - 74) / 13));
        V.x = 410; V.y = 1700; V.exp = 'preocupado'; V.boca = 'reta'; V.olhar = [0.9, -0.1]; V.bracos(0.15, 0.1, 0.15, 0.1); V.headTilt = 0.04;
        if (t > 80.4 && t < 83) { V.exp = 'fechado'; }
        st.setCam(lerp(580, 560, k), lerp(1200, 1150, k), lerp(1.7, 0.9, k));
        banheiro(st, t, { frio: 1 });
        st.mundo(c => {
          espelho(c, 620, 900, 380, 620, t, c => {
            R.reset(); R.mudado = true; R.x = 810; R.y = 1520; R.s = 0.95; R.flip = -1; R.olhar = [0.9, -0.1]; R.piscar = 0;
            // o reflexo não acompanha: sorri quando você não sorri
            R.exp = 'malicia'; R.boca = 'sorrisoMal'; R.draw(c, t);
            glow(c, 810, 1240, 200, '#c8302a', 0.15);
          }, { frio: 1 });
          rachaduras(c, 760, 1180, 1, 5);
          pia(c, 810, 1520, 1);
          V.draw(c, t);
        });
      },
    };
  },
};
