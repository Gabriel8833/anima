// "E se você pudesse voltar à sua infância?" — versão 2D (sem falas; só a narração)
import { TAU, lerp, clamp, sstep, win, easeInOut, easeOut, rng, shake, impulse } from '../../../motor/base.js';
import { glow, rrect, line, circle, ellipse, sparkle, cloud } from '../../../motor/desenho.js';
import { crianca, adulto, amigoI, controle2, xicara } from '../../../personagens/elenco.js';
import { quartoInfancia, cobertaInf, quartoAtual, cobertaAtual, cozinha2d, bairro, portaoGrade, bolaDesenho, relogioParede } from '../../../cenarios/lugares.js';

const piscada = (t, f = 3.6, o = 0) => (((t + o) % f) < 0.13 ? 1 : 0);
function deitado(c, P, t, x, y) { c.save(); c.translate(x, y); c.rotate(-Math.PI / 2); P.x = 0; P.y = 0; P.draw(c, t); c.restore(); }

// ---------- 1. O despertar ----------
export const c1 = {
  inicio: 0, fim: 10,
  criar(st) {
    const A = adulto(), C = crianca();
    return {
      desenhar(t) {
        if (t < 3.4) {
          // o adulto dorme na cama da infância; a câmera se aproxima e ele abre os olhos
          const k = easeInOut(clamp(t / 3));
          st.setCam(lerp(200, 90, k), lerp(1300, 1400, k), lerp(1.2, 2.6, k));
          quartoInfancia(st, t, { hora: [7, 10] });
          st.mundo(c => {
            A.reset(); const abre = sstep(2.4, 2.8, t); A.exp = abre > 0.5 ? 'choque' : 'fechado'; A.boca = 'reta'; A.olhar = [Math.sin(t * 5) * 0.8 * abre, 0]; A.bracos(0.2, 0.1, 0.2, 0.1);
            deitado(c, A, t, 380, 1470); cobertaInf(c, 0, 190);
          });
          return;
        }
        if (t < 5.6) {
          // olha as próprias mãos: são mãos de criança
          C.reset(); C.x = 0; C.y = 1520; C.semPernas = true; const maos = sstep(3.5, 3.9, t);
          C.bracos(lerp(0.3, 1.3, maos), lerp(0.2, 2.0, maos), lerp(0.3, 1.3, maos), lerp(0.2, 2.0, maos)); C.olhar = [0, 0.8]; C.exp = t > 4.6 ? 'choque' : 'normal'; C.boca = t > 4.6 ? 'o' : 'reta'; C.piscar = piscada(t);
          const [hx, hy] = C.cabeca(); st.setCam(hx, hy + 90, 2.3);
          quartoInfancia(st, t);
          st.mundo(c => { C.draw(c, t); cobertaInf(c, 0, 40); });
          return;
        }
        // o quarto inteiro: a câmera passa pelos brinquedos, pôsteres e a TV de tubo
        const k = easeInOut(clamp((t - 5.6) / 4.4));
        C.reset(); C.x = 0; C.y = 1520; C.semPernas = true; C.exp = 'feliz'; C.boca = 'aberta'; C.olhar = [lerp(-0.8, 0.9, k), -0.2]; C.bracos(0.8, 0.4, 0.8, 0.4); C.jump = Math.abs(Math.sin(t * 5)) * 12; C.piscar = piscada(t);
        st.setCam(lerp(-200, 1120, k), lerp(1180, 1250, k), lerp(1.15, 1.25, Math.sin(k * Math.PI)), lerp(-0.04, 0.04, k));
        quartoInfancia(st, t);
        st.mundo(c => { C.draw(c, t); cobertaInf(c, 0, 40); });
      },
    };
  },
};

// ---------- 2. As pequenas coisas ----------
export const c2 = {
  inicio: 10, fim: 20,
  criar(st) {
    const C = crianca(), A = [0, 1, 2].map(amigoI);
    return {
      desenhar(t) {
        C.reset(); C.piscar = piscada(t);
        if (t < 15) {
          // corre pela cozinha, toma café de pé e sai pela porta
          const para = t > 11.9 && t < 13.5;
          let x; if (t < 11.9) x = lerp(-500, 420, (t - 10) / 1.9); else if (para) x = 420; else x = lerp(420, 1400, (t - 13.5) / 1.5);
          C.x = x; C.y = 1720; C.flip = 1; if (!para) { C.walk = t * 16; C.lean = 0.12; C.bracos(1.0 + Math.sin(t * 16) * 0.5, 0.8, 1.0 - Math.sin(t * 16) * 0.5, 0.8); } else { C.maoD = xicara(); C.bracos(0.3, 0.2, 1.0 + Math.abs(Math.sin(t * 4)) * 0.4, 2.2); }
          C.exp = 'feliz'; C.boca = para ? 'sorriso' : 'aberta'; C.olhar = [0.8, 0];
          st.setCam(clamp(x, 200, 900), 1290, 1.25);
          cozinha2d(st, t);
          st.mundo(c => { rrect(c, 240, 1500, 380, 30, 6, '#a8784a', { lw: 5 }); for (const xx of [260, 600]) rrect(c, xx - 8, 1530, 16, 190, 4, '#8a5a3a', { lw: 4 }); c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha = 0.3; c.fillStyle = '#fff4d8'; c.fillRect(1180, 900, 240, 820); c.restore(); rrect(c, 1180, 900, 240, 820, 6, null, { stroke: '#6a4a2a', lw: 10 }); C.draw(c, t); });
          return;
        }
        // a rua do bairro, crianças brincando, ele corre para os amigos
        const u = clamp((t - 15) / 5); C.x = lerp(-300, 380, u); C.y = 1720; C.walk = t * 16; C.lean = 0.12; C.bracos(1.0 + Math.sin(t * 16) * 0.5, 0.8, 1.0 - Math.sin(t * 16) * 0.5, 0.8); C.exp = 'feliz'; C.boca = 'aberta'; C.olhar = [0.8, 0];
        st.setCam(lerp(200, 520, u), 1270, 1.2);
        bairro(st, t, { sol: 0.9 });
        st.mundo(c => {
          // bicicleta encostada
          for (const dx of [-60, 60]) circle(c, 1080 + dx, 1680, 46, null, { stroke: '#1a1a1a', lw: 8 }); line(c, [[1020, 1680], [1080, 1600], [1140, 1680]], '#d8302a', 8);
          A.forEach((a, i) => { a.reset(); a.x = [760, 900, 640][i]; a.y = 1700 - (i % 2) * 20; a.flip = -1; a.exp = 'feliz'; a.boca = Math.sin(t * 8 + i) > 0 ? 'aberta' : 'sorriso'; a.olhar = [0.8, 0]; a.piscar = piscada(t, 3, i); if (i === 0) a.bracos(0.3, 0.2, 2.6 + Math.sin(t * 9) * 0.3, 0.3); else { a.walk = t * 8 + i; a.jump = Math.abs(Math.sin(t * 6 + i)) * 14; } a.draw(c, t); });
          bolaDesenho(c, 820 + Math.sin(t * 3) * 60, 1690 - Math.abs(Math.sin(t * 6)) * 60, 24, t * 5);
          C.draw(c, t);
        });
      },
    };
  },
};

// ---------- 3. A partida de futebol ----------
export const c3 = {
  inicio: 20, fim: 32,
  criar(st) {
    const C = crianca(), A = [0, 1, 2, 3].map(amigoI);
    const CHUTE = 29.4, BATE = 29.9;
    return {
      desenhar(t) {
        const kids = [C, ...A], base = [180, 420, 660, 900, 540];
        const susto = t > BATE + 0.1, escolha = t > 22.2 && t < 26.4, ninguem = t > 26.6 && t < CHUTE;
        let cam = [540, 1270, 1.15], shk = [0, 0];
        if (escolha) cam = [700, 1250, 1.45];
        if (t > CHUTE - 0.2 && t < BATE + 0.8) { cam = [1000, 1250, 1.35]; shk = shake(t, impulse(t, BATE, 0.9)); }
        st.setCam(cam[0], cam[1], cam[2], 0, shk);
        bairro(st, t, { sol: 0.85 });
        st.mundo(c => {
          portaoGrade(c, 1150, 1520, impulse(t, BATE, 1, 0.6) * Math.sin((t - BATE) * 30) * 10);
          // chinelos como trave
          for (const x of [70, 230]) rrect(c, x - 26, 1760, 52, 14, 6, '#2a8ad0', { lw: 3 });
          kids.forEach((k, i) => {
            k.reset(); k.x = base[i] + Math.sin(t * 1.6 + i) * (t < 22 ? 60 : 20); k.y = 1700 + (i % 2) * 30; k.flip = i % 2 ? -1 : 1; k.piscar = piscada(t, 3.3, i);
            if (t < 22 || (t > 27.8 && t < CHUTE)) k.walk = t * 10 + i;
            k.exp = 'feliz'; k.boca = Math.sin(t * 7 + i) > 0 ? 'aberta' : 'sorriso'; k.olhar = [k.flip * 0.7, 0];
          });
          if (escolha) { const ap = A[0], fug = A[2]; ap.bracos(0.3, 0.2, 1.55, 0.05); ap.flip = 1; ap.exp = 'malicia'; ap.boca = 'sorrisoMal'; ap.olhar = [0.9, 0];
            const foge = sstep(23.2, 23.7, t); fug.x += foge * 380; fug.flip = 1; if (foge > 0 && t < 25) { fug.walk = t * 16; fug.lean = 0.15; } fug.bracos(lerp(0.3, 2.4, foge) + Math.sin(t * 20) * 0.3 * foge, 0.3, lerp(0.3, 2.4, foge) - Math.sin(t * 20) * 0.3 * foge, 0.3); fug.exp = 'medo'; fug.boca = 'grito'; fug.olhar = [-0.9, 0]; fug.suor = 1; }
          if (ninguem) kids.forEach((k, i) => { if (i === 0) { k.bracos(0.6, 0.3, 0.6, 0.3); k.exp = 'feliz'; k.boca = 'aberta'; return; } k.flip = Math.sin(t * 3 + i) > 0 ? 1 : -1; k.bracos(0.3, 0.2, 1.55, 0.05); k.exp = 'malicia'; k.boca = 'sorrisoMal'; });
          if (t > CHUTE - 0.3 && t < BATE) { C.bracos(0.8, 0.3, 0.8, 0.3); C.lean = -0.15; }
          if (susto) kids.forEach(k => { k.walk = null; k.bracos(2.6, 1.8, 2.6, 1.8); k.exp = 'medo'; k.boca = 'grito'; k.olhar = [0.9, -0.2]; k.flip = 1; k.tremor = 0.2; k.suor = 1; });
          kids.forEach(k => k.draw(c, t));
          // bola
          let bx, by, rot = t * 6;
          if (t < 22) { bx = 300 + Math.sin(t * 2.4) * 380; by = 1690 - Math.abs(Math.sin(t * 5)) * 70; }
          else if (t < CHUTE) { bx = C.x + 60; by = 1700 - Math.abs(Math.sin(t * 5)) * 20; }
          else { const u = clamp((t - CHUTE) / (BATE - CHUTE)); const v = clamp((t - BATE) / 0.9); bx = lerp(C.x + 60, 1120, u) - v * 260; by = lerp(1700, 1420, u) - Math.sin(u * Math.PI) * 160 + v * v * 280 - (t > BATE ? Math.abs(Math.sin(v * 9)) * 80 * (1 - v) : 0); }
          bolaDesenho(c, bx, by, 26, rot);
          if (t > BATE && t < BATE + 0.4) for (let i = 0; i < 6; i++) line(c, [[1120 + Math.cos(i) * 40, 1420 + Math.sin(i) * 40], [1120 + Math.cos(i) * 90, 1420 + Math.sin(i) * 90]], '#ffffff', 6, 1 - (t - BATE) / 0.4);
        });
      },
    };
  },
};

// ---------- 4. A noite ----------
export const c4 = {
  inicio: 32, fim: 44,
  criar(st) {
    const C = crianca();
    return {
      desenhar(t) {
        C.reset(); C.piscar = piscada(t);
        if (t < 35.6) {
          // volta para casa ao entardecer, cansado mas feliz
          const u = clamp((t - 32) / 3.4); C.x = lerp(200, 760, u); C.y = 1720; C.walk = t * 6; C.exp = 'feliz'; C.boca = 'sorriso'; C.olhar = [0.6, 0.3]; C.headTilt = 0.08; C.bracos(0.3, 0.3, 0.3, 0.3); C.lean = 0.05;
          st.setCam(lerp(300, 640, u), 1280, 1.25);
          bairro(st, t, { sol: 0.05 });
          st.mundo(c => { rrect(c, 820, 1180, 160, 330, 6, '#ffe8b0', { lw: 6 }); glow(c, 900, 1350, 300, '#ffd890', 0.5); C.draw(c, t); });
          return;
        }
        // sentado no chão com o controle, a luz da TV no rosto; o relógio marca a noite; depois, o desenho
        const desenho = t > 39.6, relogio = t > 38.2 && t < 39.6;
        C.x = 1000; C.y = 1640; C.semPernas = true; C.flip = 1; C.maoD = desenho ? null : controle2(); C.maoE = null;
        C.bracos(desenho ? 0.3 : 0.9, desenho ? 0.2 : 1.4, desenho ? 0.3 : 0.9 + Math.sin(t * 12) * 0.05, desenho ? 0.2 : 1.4); C.exp = 'feliz'; C.boca = desenho ? 'aberta' : 'sorriso'; C.olhar = [0.9, -0.3]; C.lean = Math.sin(t * 1.6) * 0.05;
        if (relogio) st.setCam(640, 360, 3.2);
        else if (desenho) { const [hx, hy] = C.cabeca(); st.setCam(hx + 60, hy + 60, 2.4); }
        else st.setCam(lerp(900, 1060, (t - 35.6) / 2.6), 1400, lerp(1.4, 1.7, (t - 35.6) / 2.6));
        quartoInfancia(st, t, { noite: 1, tv: desenho ? 'desenho' : 'jogo', hora: [21, 38 + (t - 35.6) * 0.6] });
        st.mundo(c => { C.draw(c, t); const [hx, hy] = C.cabeca(); glow(c, hx + 60, hy, 220, desenho ? '#ffb080' : '#8ac0ff', 0.3 + 0.1 * Math.sin(t * 9)); });
      },
    };
  },
};

// ---------- 5. O retorno ----------
export const c5 = {
  inicio: 44, fim: 60,
  criar(st) {
    const C = crianca(), A = adulto();
    return {
      desenhar(t) {
        if (t < 48.4) {
          // deita e fecha os olhos; a câmera se aproxima do rosto
          const k = easeInOut(clamp((t - 44) / 4.2));
          st.setCam(lerp(160, 70, k), lerp(1300, 1400, k), lerp(1.2, 2.8, k));
          quartoInfancia(st, t, { noite: 1, hora: [22, 10] });
          st.mundo(c => { C.reset(); const fecha = sstep(45.6, 46.6, t); C.exp = fecha > 0.5 ? 'fechado' : 'feliz'; C.boca = 'sorriso'; C.bracos(0.2, 0.1, 0.2, 0.1); deitado(c, C, t, 300, 1470); cobertaInf(c, 1, 150); });
          return;
        }
        // presente: o mesmo homem, adulto, acorda no quarto escuro e fica pensativo
        const senta = sstep(50.0, 51.2, t);
        A.reset(); A.piscar = piscada(t, 4.2);
        A.exp = t < 49.2 ? 'fechado' : (senta > 0.5 ? 'preocupado' : 'normal'); A.boca = senta > 0.5 ? 'triste' : 'reta'; A.olhar = t < 53.4 ? [Math.sin(t * 0.9) * 0.8, -0.1] : [0.3, 0.5];
        let cam;
        if (t < 53.6) { const k = easeInOut(clamp((t - 48.4) / 5)); cam = [lerp(90, 60, k), lerp(1400, 1300, k), lerp(2.6, 1.9, k)]; }
        else { const k = easeInOut(clamp((t - 53.6) / 6.4)); cam = [lerp(60, 380, k), lerp(1300, 1180, k), lerp(1.9, 0.95, k)]; }
        st.setCam(cam[0], cam[1], cam[2]);
        quartoAtual(st, t);
        st.mundo(c => {
          if (senta < 0.5) { A.bracos(0.2, 0.1, 0.2, 0.1); deitado(c, A, t, 380, 1470); cobertaAtual(c, 190); }
          else { A.x = 0; A.y = 1540; A.semPernas = true; A.bracos(0.5, 1.6, 0.5, 1.6); A.lean = 0.04; A.headTilt = 0.06; A.draw(c, t); cobertaAtual(c, 80); }
        });
      },
    };
  },
};
