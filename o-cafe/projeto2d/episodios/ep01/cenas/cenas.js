// "E se você voltasse pra infância sendo o café com leite?" — cenas 2D
import { TAU, lerp, clamp, sstep, win, kf, easeInOut, easeIn, easeOut, easeBack, rng, impulse } from '../../../motor/base.js';
import { glow, sparkle, speedLines, circle, line, rrect, ellipse, shape, cloud, poly, limb } from '../../../motor/desenho.js';
import { juninho, marcao, tiago, lucasK, bruno, mae, chinelo, bolaMao } from '../../../personagens/elenco.js';
import { RUA, CASA, quartoInfancia, cobertaInf, bairro, bolaDesenho, calendario2010, despertador, criadoMudo, bicicleta, cachorro, arvore, casaFrente, gradeJanela, ruaFrente, ruaChao, confete, poeira, estrelasTontura } from '../../../cenarios/lugares.js';

const W = 1080, H = 1920;
const tempos = await (await fetch(new URL('../tempos.json', import.meta.url))).json();
const S = id => { const f = tempos.narracao.find(n => n.id === id); return [f.inicio, f.fim]; };
const piscada = (t, f = 3.1, o = 0) => (((t + o) % f) < 0.12 ? 1 : 0);
const respira = (P, t, o = 0) => { P.squash = Math.sin(t * 2.6 + o) * 0.015; };
const fala = (t, [a, b]) => (t > a && t < b ? ['grito', 'aberta', 'meia', 'aberta', 'o'][Math.floor(t * 11) % 5] : null);
const CH = RUA.chao;
// limites das cenas (cada cena começa um pouco antes da primeira fala)
const ini = id => S(id)[0] - 0.2;
const B = [0, ini('2a'), ini('3a'), ini('4a'), ini('5a'), ini('6a'), ini('7a'), tempos.duracao];

function rot(c, P, t, x, y, a, piv = 0) { c.save(); c.translate(x, y); c.rotate(a); c.translate(0, piv); P.x = 0; P.y = 0; P.draw(c, t); c.restore(); }
const cinco = (pele) => (c, s, t) => { for (let k = 0; k < 5; k++) { const a = -Math.PI / 2 + (k - 2) * 0.38; c.save(); c.rotate(a + Math.PI / 2); ellipse(c, 0, -22, 6.5, 13, pele, { lw: 3.5 }); c.restore(); } circle(c, 0, 0, 16, pele, { lw: 4 }); };
function cena(st, t, sol, desenha, { traves = true, casa = true, bike = true, arvoreX = -420 } = {}) {
  bairro(st, t, { sol });
  ruaChao(st, t, sol);
  ruaFrente(st, t, { sol, traves, casa, bike, arvoreX });
  st.mundo(desenha);
}
function linhasGrito(c, x, y, t, a = 1, n = 7, r0 = 120) { for (let i = 0; i < n; i++) { const an = -Math.PI / 2 + (i - (n - 1) / 2) * 0.32; const r1 = r0 + 40 + Math.sin(t * 30 + i) * 10; line(c, [[x + Math.cos(an) * r0, y + Math.sin(an) * r0], [x + Math.cos(an) * r1, y + Math.sin(an) * r1]], '#2b1f2a', 7, a); } }
// sentado no chão (pernas para frente)
function sentadoChao(c, P, t, x, y) { P.semPernas = true; P.x = x; P.y = y + 87; for (const s of [-1, 1]) { limb(c, [[x + s * 26, y - 6], [x + s * 64, y + 26]], 22, P.d.pele); ellipse(c, x + s * 74, y + 20, 18, 26, P.d.sapato, { lw: 4 }); } P.draw(c, t); }

// ================= 1. A INFÂNCIA =================
export const c1 = {
  inicio: B[0], fim: B[1],
  criar(st) {
    const J = juninho();
    return {
      desenhar(t) {
        const toca = t < 2.85 ? 1 : 0, acorda = t > 2.85, senta = easeInOut(clamp((t - 3.1) / 0.5));
        const [b1] = S('1b'), [c1a, c1b] = S('1c');
        // câmera
        const pts = [[0, [60, 1400, 1.55]], [2.8, [80, 1400, 1.6]], [3.6, [0, 1380, 1.7]], [4.3, [600, 640, 2.0]], [5.6, [610, 640, 2.1]], [6.2, [-60, 1300, 2.3]], [7.0, [-40, 1310, 2.4]], [9.4, [60, 1300, 1.6]], [11.0, [300, 1320, 1.4]], [13.6, [1200, 1330, 1.4]]];
        st.setCam(...kf(t, pts, easeInOut));
        quartoInfancia(st, t, { hora: [7, 0] });
        st.mundo(c => {
          calendario2010(c, 600, 540, sstep(4.9, 5.2, t));
          if (t > 4.3 && t < 5.0) { const k = Math.floor((t - 4.3) * 14) % 2; rrect(c, 600, 590 - k * 20, 170, 150, 4, k ? '#fffaf0' : '#f0e8d8', { lw: 4 }); }
          bicicleta(c, 760, 1700, t, { cor: '#e2473a', s: 0.9 });
          criadoMudo(c, 470, 1500); despertador(c, 470, 1500, t, toca);
          J.reset(); J.piscar = piscada(t); respira(J, t);
          if (t < 9.6) {
            // deitado / sentando na cama
            J.semPernas = true; J.exp = acorda ? (t < 3.6 ? 'choque' : 'normal') : 'fechado'; J.boca = acorda ? (t < 3.6 ? 'grito' : 'sorriso') : (Math.sin(t * 3) > 0 ? 'o' : 'meia');
            J.ik(-1, -66, -150); J.ik(1, 66, -150);
            if (t > 3.6) { J.olhar = t < 5.6 ? [0.9, -0.9] : [0, 0]; J.sob = [-10, -10]; }
            if (t > 5.6) { J.boca = 'aberta'; J.olhoTam = 1.1; J.blush = 0.5; J.exp = t > 6.4 ? 'feliz' : 'normal'; }
            if (t > c1a) { const pens = Math.sin((t - c1a) * 2.4); J.olhar = [pens > 0 ? 0.7 : -0.7, -0.8]; J.exp = 'normal'; J.boca = 'lado'; J.ik(1, 20, -238); J.frente = [false, true]; }
            if (t > 8.9) { J.exp = 'choque'; J.boca = 'aberta'; J.olhar = [1, 0]; }
            const a = -Math.PI / 2 * (1 - senta);
            rot(c, J, t, lerp(-90, -40, senta), lerp(1450, 1480, senta), a, 87);
            cobertaInf(c, 0, lerp(-130, -150, senta));
            if (!acorda) { c.save(); c.font = '900 50px Inter, sans-serif'; c.fillStyle = '#5a6ab0'; for (let k = 0; k < 3; k++) { const u = (t * 0.6 + k / 3) % 1; c.globalAlpha = Math.sin(u * Math.PI); c.fillText('z', -200 + u * 80, 1330 - u * 140); } c.restore(); }
            // pensamento: futebol x arrumar o quarto
            const pa = sstep(c1a + 0.2, c1a + 0.5, t) * (1 - sstep(9.3, 9.6, t));
            if (pa > 0) { c.save(); c.globalAlpha = pa; for (const [x, y, r] of [[40, 1280, 14], [80, 1230, 22]]) circle(c, x, y, r, '#ffffff', { lw: 4 }); cloud(c, 230, 1110, 190, '#ffffff', { stroke: '#2b1f2a', seed: 3 });
              const lado = Math.sin((t - c1a) * 2.4) > 0; bolaDesenho(c, 140, 1060 + (lado ? Math.sin(t * 10) * 10 : 0), lado ? 54 : 44, t * 3); c.font = '900 60px Inter, sans-serif'; c.fillStyle = '#2b1f2a'; c.textAlign = 'center'; c.fillText('x', 230, 1080);
              c.save(); c.translate(320, 1070); c.scale(lado ? 0.9 : 1.1, lado ? 0.9 : 1.1); line(c, [[-30, 40], [30, -50]], '#a8744a', 8); poly(c, [[-50, 30], [-10, 30], [-20, 70], [-60, 66]], '#e2473a', { lw: 4 }); c.restore(); c.restore(); }
          } else {
            // pula da cama e sai correndo para salvar o mundo
            J.semPernas = false; J.y = 1720;
            const pulo = clamp((t - 9.6) / 0.6), corre = clamp((t - 11.3) / 2.2);
            J.x = t < 11.3 ? lerp(-40, 300, easeOut(pulo)) : lerp(300, 1500, easeIn(corre));
            J.jump = Math.sin(pulo * Math.PI) * 220;
            J.exp = 'determinado'; J.boca = 'sorriso'; J.olhar = [1, 0]; J.sob = [6, 6]; J.sobA = [0.3, -0.3];
            if (t > 10.2 && t < 11.3) { J.ik(-1, -110, -170); J.ik(1, 40, -380); J.jump = impulse(t, 10.2, 20, 0.3); J.boca = 'aberta'; } // pose de super-herói
            if (t > 11.3) { J.walk = t * 22; J.lean = 0.22; J.ik(-1, -60 + Math.sin(t * 22) * 40, -170); J.ik(1, 60 - Math.sin(t * 22) * 40, -170); J.boca = 'grito'; }
            J.draw(c, t);
            if (t > 11.3) { for (let k = 0; k < 6; k++) line(c, [[J.x - 120 - k * 40, 1560 + k * 30], [J.x - 260 - k * 50, 1560 + k * 30]], '#ffffff', 6, 0.7); poeira(c, J.x - 60, 1720, t, 11.35, 0.8); }
            if (t > 10.2 && t < 11.3) { glow(c, J.x, 1500, 300, '#fff2a0', 0.5); for (let k = 0; k < 10; k++) { const an = k / 10 * TAU + t; line(c, [[J.x + Math.cos(an) * 200, 1500 + Math.sin(an) * 200], [J.x + Math.cos(an) * 280, 1500 + Math.sin(an) * 280]], '#fff2a0', 6); } }
          }
        });
      },
    };
  },
};

// ================= 2. O FUTEBOL =================
const LINHA = { m: 260, ti: 840, lu: 450, br: 540, ju: 630, dog: 720 };
export const c2 = {
  inicio: B[1], fim: B[2],
  criar(st) {
    const J = juninho(), M = marcao(), T = tiago(), L = lucasK(), Br = bruno();
    return {
      desenhar(t) {
        const c = st.c;
        const [a0, a1] = S('2a'), [b0, b1] = S('2b'), [c0, c1] = S('2c'), [d0, d1] = S('2d');
        if (t < a1 + 0.1) {
          // pedalando pela rua
          const u = clamp((t - B[1]) / (a1 - B[1])), bx = lerp(-500, 1000, easeOut(u));
          st.setCam(clamp(bx + 100, 0, 900), 1520, 1.3);
          cena(st, t, 0.75, cc => {
            [M, T, L, Br].forEach((k, i) => { k.reset(); k.x = 1250 + i * 120; k.y = CH; k.piscar = piscada(t, 3, i); k.olhar = [-1, 0]; k.boca = 'sorriso'; k.ik(-1, -110, -300 - Math.abs(Math.sin(t * 8 + i)) * 40); k.draw(cc, t); });
            const pedal = t * 9;
            J.reset(); J.semPernas = true; J.x = bx - 30; J.y = CH - 80 + Math.sin(t * 9) * 3; J.exp = 'feliz'; J.boca = 'aberta'; J.vento = 1; J.ik(-1, 60, -190); J.ik(1, 90, -190);
            if (Math.floor(t * 2) % 3 === 0) { J.ik(1, 110, -330); J.boca = 'grito'; }
            for (const s of [-1, 1]) { const a = pedal + (s > 0 ? Math.PI : 0); limb(cc, [[bx - 30 + s * 10, CH - 160], [bx - 10 + Math.cos(a) * 30, CH - 70 + Math.sin(a) * 30]], 22, J.d.pele); }
            bicicleta(cc, bx, CH, t, { gira: t * 9, cor: '#2c78dc' });
            J.draw(cc, t);
            if (Math.sin(t * 7) > 0.6) for (let k = 0; k < 3; k++) line(cc, [[bx + 90 + k * 14, CH - 230 - k * 10], [bx + 110 + k * 20, CH - 250 - k * 14]], '#ffe46a', 5);
          }, { bike: false });
          return;
        }
        // escolhendo os times
        const inferno = win(t, b0 + 1.6, b0 + 1.9, b1, b1 + 0.2);
        let cam = [550, 1540, 1.35];
        if (inferno > 0) cam = [LINHA.ju, 1560, lerp(1.35, 2.3, inferno)];
        if (t > d0 + 1.5 && t < d0 + 2.3) cam = [LINHA.ju, 1540, 2.8];
        st.setCam(cam[0], cam[1], cam[2], 0, inferno > 0.5 ? [Math.sin(t * 40) * 0.4, 0] : [0, 0]);
        cena(st, t, 0.75, cc => {
          const pega = (k, tp, dest) => { const u = easeInOut(clamp((t - tp) / 0.9)); return [u, u > 0 && u < 1]; };
          // capitães
          M.reset(); M.x = LINHA.m; M.y = CH; respira(M, t); M.piscar = piscada(t); M.olhar = [1, 0]; M.boca = 'reta'; M.sob = [4, 4]; M.sobA = [0.2, -0.2]; M.ik(-1, -60, -150); M.ik(1, 60, -150);
          T.reset(); T.x = LINHA.ti; T.y = CH; respira(T, t, 1); T.piscar = piscada(t, 2.8); T.olhar = [-1, 0]; T.boca = 'reta'; T.ik(-1, -60, -150); T.ik(1, 60, -150);
          if (t > c0 && t < c0 + 0.9) { M.ik(1, 150, -260); M.boca = 'aberta'; }
          if (t > c0 + 0.9 && t < c1) { T.ik(-1, -150, -260); T.boca = 'aberta'; }
          if (t > d0 + 0.3 && t < d0 + 1.4) { M.ik(1, 150, -230); M.boca = 'aberta'; M.olhar = [1, 0.6]; }
          const uL = easeInOut(clamp((t - c0 - 0.3) / 0.8)), uB = easeInOut(clamp((t - c0 - 1.1) / 0.8)), uD = easeInOut(clamp((t - d0 - 0.6) / 1.0));
          L.reset(); L.x = lerp(LINHA.lu, LINHA.m - 120, uL); L.y = CH + 10; L.walk = uL > 0 && uL < 1 ? t * 14 : null; L.piscar = piscada(t, 3.3, 1); L.boca = uL > 0 ? 'sorriso' : 'reta'; L.olhar = [uL > 0 ? -1 : 0, 0];
          Br.reset(); Br.x = lerp(LINHA.br, LINHA.ti + 120, uB); Br.y = CH + 10; Br.walk = uB > 0 && uB < 1 ? t * 14 : null; Br.piscar = piscada(t, 2.9, 2); Br.boca = uB > 0 ? 'sorriso' : 'reta'; Br.olhar = [uB > 0 ? 1 : 0, 0];
          [M, T, L, Br].forEach(k => k.draw(cc, t));
          const dx = lerp(LINHA.dog, LINHA.m - 220, uD);
          cachorro(cc, dx, CH + 20, t, { anda: uD > 0 && uD < 1 ? 1 : 0, flip: uD > 0 ? -1 : 1, s: 0.8 });
          if (uD > 0.95) for (let k = 0; k < 3; k++) sparkle(cc, dx - 40 + k * 40, CH - 180 - Math.abs(Math.sin(t * 6 + k)) * 20, 12, '#ffe46a', 1);
          // Juninho esperando
          J.reset(); J.x = LINHA.ju; J.y = CH + 10; respira(J, t, 2); J.piscar = piscada(t, 2.6); J.boca = 'sorriso'; J.olhar = [0, 0]; J.ik(-1, -62, -140); J.ik(1, 62, -140);
          if (t > c0) { J.boca = 'torto'; J.exp = 'preocupado'; J.suor = 1; J.olhar = [Math.sin(t * 3) > 0 ? -1 : 1, 0]; J.ik(1, 110, -330 + Math.sin(t * 12) * 20); }
          if (inferno > 0.3) { J.exp = 'medo'; J.boca = 'tremendo'; J.olhar = [0, 0]; J.tremor = 1; J.ik(1, 62, -140); }
          if (t > d0 + 1.4) { J.exp = 'choque'; J.boca = 'grito'; J.olhoTam = 1.2; J.pupila = 0.5; J.suor = 0; J.ik(-1, -90, -300); J.ik(1, 90, -300); J.frente = [false, false]; }
          J.draw(cc, t);
          if (inferno > 0) { cc.save(); cc.globalAlpha = inferno; for (let k = 0; k < 12; k++) { const x = -200 + k * 130, h = 140 + Math.sin(t * 9 + k) * 50; shape(cc, c => { c.moveTo(x - 60, 1900); c.quadraticCurveTo(x - 30, 1900 - h * 0.6, x, 1900 - h); c.quadraticCurveTo(x + 30, 1900 - h * 0.6, x + 60, 1900); c.closePath(); }, k % 2 ? '#ff6a1a' : '#ffb01a', { lw: 4 }); } cc.restore(); }
        });
        if (inferno > 0) { c.save(); c.globalCompositeOperation = 'multiply'; c.globalAlpha = 0.5 * inferno; c.fillStyle = '#ff2a10'; c.fillRect(0, 0, W, H); c.restore(); }
      },
    };
  },
};

// ================= 3. O CAFÉ COM LEITE =================
export const c3 = {
  inicio: B[2], fim: B[3],
  criar(st) {
    const J = juninho(), M = marcao(), T = tiago(), L = lucasK(), Br = bruno();
    return {
      desenhar(t) {
        const c = st.c;
        const [a0, a1] = S('3a'), [b0, b1] = S('3b'), [c0, c1] = S('3c'), [d0, d1] = S('3d'), [e0, e1] = S('3e'), [f0, f1] = S('3f');
        let cam = [600, 1540, 1.35], sh = [0, 0];
        // comemorando como se tivesse sido contratado por um clube gigante
        if (t < a1) cam = [LINHA.ju, 1520, lerp(1.4, 1.9, sstep(a0, a1, t))];
        else if (t < b1) cam = [lerp(400, 900, (t - a1) / (b1 - a1)), 1540, 1.3];
        else if (t < c1 + 0.1) cam = [lerp(1000, 1650, easeInOut(clamp((t - c0) / 1.0))), 1560, 1.35];
        else if (t < d1) { cam = t < d0 + 0.5 ? [1300, 1560, 2.6] : [1260, 1600, 1.5]; if (t > d0 + 0.3 && t < d0 + 0.7) sh = [Math.sin(t * 60) * 0.6, 0]; }
        else if (t < e1) { cam = [900, 1490, lerp(2.3, 2.6, (t - e0) / (e1 - e0))]; sh = [Math.sin(t * 45) * 0.35, 0]; }
        else cam = [lerp(1150, 1100, (t - f0) / 3), 1540, lerp(1.6, 1.25, easeInOut(clamp((t - f0) / 2)))];
        st.setCam(cam[0], cam[1], cam[2], 0, sh);
        cena(st, t, 0.7, cc => {
          const todos = [M, T, L, Br];
          todos.forEach((k, i) => { k.reset(); k.y = CH + (i % 2) * 14; k.piscar = piscada(t, 3 + i * 0.3, i); respira(k, t, i); k.ik(-1, -60, -150); k.ik(1, 60, -150); k.boca = 'reta'; });
          J.reset(); J.y = CH + 20; J.piscar = piscada(t, 2.7); respira(J, t);
          let bola = null;
          if (t < a1) {
            M.x = 260; T.x = 840; L.x = 140; Br.x = 960; T.ik(-1, -150, -230); T.olhar = [-1, 0]; T.boca = t < a0 + 0.8 ? 'aberta' : 'reta'; T.sobA = [0.2, -0.2];
            J.x = LINHA.ju; const k = clamp((t - a0 - 0.6) / 0.3);
            J.exp = 'feliz'; J.boca = 'grito'; J.jump = k > 0 ? Math.abs(Math.sin((t - a0) * 6)) * 120 : 0; J.ik(-1, -110, -350); J.ik(1, 110, -350); J.blush = 0.7; J.vento = 1;
            bola = null;
          } else if (t < c0) {
            // jogando: ninguém marca o Juninho
            const ph = (t - a1);
            M.x = 600 + Math.sin(ph * 2) * 260; T.x = 750 + Math.cos(ph * 2.3) * 280; L.x = 450 + Math.sin(ph * 1.7 + 1) * 300; Br.x = 900 + Math.cos(ph * 1.9) * 200;
            todos.forEach((k, i) => { k.walk = t * 15 + i; k.lean = 0.08; k.olhar = [1, 0.4]; k.boca = 'aberta'; });
            J.x = 620 + ph * 120; J.walk = t * 15; J.ik(-1, -110, -330 + Math.sin(t * 12) * 30); J.ik(1, 110, -330 - Math.sin(t * 12) * 30); J.boca = 'grito'; J.olhar = [1, 0];
            bola = [700 + Math.sin(ph * 2.2) * 300, CH - 20 - Math.abs(Math.sin(t * 6)) * 40];
          } else if (t < d0) {
            // chuta, faz o gol... e ninguém liga
            M.x = 1000; T.x = 1150; L.x = 1300; Br.x = 1820; todos.forEach(k => { k.olhar = [-1, 0]; k.palp = 0.4; });
            const u = clamp((t - c0) / 0.5);
            J.x = 1320; J.ik(1, 60, -150); J.olhar = [1, 0]; J.boca = 'sorriso';
            bola = [lerp(1380, 1810, easeOut(u)), CH - 20 - Math.sin(u * Math.PI) * 140];
            if (u >= 1) { J.exp = 'feliz'; J.boca = 'grito'; J.ik(-1, -110, -350); J.ik(1, 110, -350); J.jump = Math.abs(Math.sin((t - c0) * 8)) * 70; Br.ik(1, 60, -140); Br.olhar = [1, 0.5]; bola = [lerp(1810, 1300, clamp((t - c0 - 0.8) / 0.6)), CH - 20]; }
          } else if (t < d1 + 0.15) {
            // a bolada
            M.x = 1000; T.x = 1150; L.x = 900; Br.x = 1700;
            const u = clamp((t - d0) / 0.35), cai = easeOut(clamp((t - d0 - 0.35) / 0.4));
            J.x = 1300; J.olhar = [1, 0];
            if (u < 1) { bola = [lerp(1700, 1310, u), CH - 200]; J.exp = 'choque'; J.boca = 'o'; }
            else { J.exp = 'fechado'; J.boca = 'grito'; bola = [lerp(1310, 1600, clamp((t - d0 - 0.35) / 0.8)), CH - 200 + 160 * clamp((t - d0 - 0.35) / 0.8)]; }
          } else {
            M.x = 900; T.x = 1080; L.x = 760; Br.x = 1500;
          }
          // desenho
          if (t > d0 + 0.35 && t < e1) {
            const cai = easeOut(clamp((t - d0 - 0.35) / 0.4));
            todos.forEach(k => k.draw(cc, t));
            J.exp = t < e0 ? 'fechado' : 'normal'; J.boca = 'tremendo'; J.olhar = [Math.sin(t * 9), Math.cos(t * 9)];
            rot(cc, J, t, 1300 + cai * 40, CH + 20, -Math.PI / 2 * cai * 0.95);
            estrelasTontura(cc, 1300 + cai * 40 - 220, CH - 30, t, cai);
            if (bola) bolaDesenho(cc, bola[0], bola[1], 22, t * 10);
            if (t > d0 + 0.3 && t < d0 + 0.6) { for (let k = 0; k < 8; k++) { const an = k / 8 * TAU; line(cc, [[1310 + Math.cos(an) * 50, CH - 200 + Math.sin(an) * 50], [1310 + Math.cos(an) * 110, CH - 200 + Math.sin(an) * 110]], '#ffffff', 8); } }
          }
          if (t >= e0 - 0.15 && t < e1) {
            // "NÃO VALE, ELE É CAFÉ COM LEITE!" (Marcão grita; os outros reforçam)
            const fM = fala(t, [e0, e1]);
            M.x = 900; M.boca = fM || 'reta'; M.exp = 'raiva'; M.olhar = [1, 0.4]; M.ik(-1, -130, -300 + Math.sin(t * 14) * 30); M.ik(1, 150, -240); M.jump = Math.abs(Math.sin(t * 7)) * 14; M.blush = 0.9;
            T.x = 1080; T.boca = fala(t + 0.1, [e0 + 0.4, e1]) || 'reta'; T.exp = 'raiva'; T.ik(-1, -120, -320); T.ik(1, 120, -320);
            M.draw(cc, t); T.draw(cc, t);
            const pal = sstep(e1 - 0.8, e1 - 0.6, t) * (1 - sstep(e1 - 0.1, e1, t));
            linhasGrito(cc, 900, CH - 260, t, 0.6 + pal * 0.4, pal > 0 ? 11 : 7, 130);
            if (pal > 0) { M.tremor = 1; glow(cc, 900, CH - 240, 260, '#ff4a2a', pal * 0.5); }
          } else if (t < d0 + 0.35 || t >= e1) {
            if (t >= f0 - 0.2) {
              // vira enfeite de campo: parado de trave, com um passarinho na cabeça
              todos.forEach((k, i) => { const ph = t * (1.5 + i * 0.2) + i; k.x = 1100 + Math.sin(ph) * 380; k.walk = t * 14 + i; k.boca = 'aberta'; k.olhar = [Math.cos(ph), 0.4]; });
              J.x = 1300; J.exp = 'normal'; J.palp = 0.5; J.boca = 'reta'; J.olhar = [0, 0]; J.ik(-1, -50, -110); J.ik(1, 50, -110); J.squash = 0;
              todos.slice(0, 2).forEach(k => k.draw(cc, t)); J.draw(cc, t); todos.slice(2).forEach(k => k.draw(cc, t));
              c.save(); cc.save(); cc.translate(1420, CH + 10); rrect(cc, -40, -12, 80, 24, 12, '#e2473a', { lw: 4 }); cc.restore(); c.restore();
              const [hx, hy] = J.cabeca(), u = easeOut(clamp((t - f0 - 0.6) / 0.7));
              const px = lerp(hx - 400, hx + 4, u), py = lerp(hy - 400, hy - 100, u) - Math.sin(u * Math.PI) * 60;
              ellipse(cc, px, py, 26, 18, '#9aa0b0', { lw: 4 }); circle(cc, px + 20, py - 14, 12, '#9aa0b0', { lw: 4 }); poly(cc, [[px + 30, py - 16], [px + 44, py - 12], [px + 30, py - 8]], '#f4c430', { lw: 2 }); circle(cc, px + 22, py - 16, 3, '#2b1f2a', { stroke: null });
              if (u < 1) for (const s of [-1, 1]) ellipse(cc, px - 4, py - 14 + s * Math.sin(t * 40) * 14, 20, 8, '#c8ccd8', { lw: 3 });
              bolaDesenho(cc, 1100 + Math.sin(t * 2.2) * 420, CH - 20 - Math.abs(Math.sin(t * 6)) * 50, 22, t * 6);
            } else {
              todos.forEach(k => k.draw(cc, t)); J.draw(cc, t);
              if (bola) bolaDesenho(cc, bola[0], bola[1], 22, t * 8);
              if (t < a1) { confete(cc, J.x, CH - 300, t, a0 + 0.7, 40); for (let k = 0; k < 6; k++) { const ft = (t * 3 + k * 0.37) % 1; if (ft < 0.12) { const x = J.x - 500 + k * 200, y = 1200 + (k % 3) * 80; glow(cc, x, y, 120, '#ffffff', 1); } } }
            }
          }
        });
      },
    };
  },
};

// ================= 4. AS OUTRAS BRINCADEIRAS =================
export const c4 = {
  inicio: B[3], fim: B[4],
  criar(st) {
    const J = juninho(), K = [marcao(), tiago(), lucasK(), bruno()];
    return {
      desenhar(t) {
        const c = st.c;
        const [a0, a1] = S('4a'), [b0, b1] = S('4b'), [c0, c1] = S('4c');
        if (t < b0 - 0.1) {
          // queimada: primeiro eliminado
          st.setCam(560, 1540, 1.55, 0, t > a0 + 0.55 && t < a0 + 0.9 ? [Math.sin(t * 60) * 0.5, 0] : [0, 0]);
          cena(st, t, 0.7, cc => {
            K.forEach((k, i) => { k.reset(); k.x = [180, 300, 820, 940][i]; k.y = CH + (i % 2) * 10; k.piscar = piscada(t, 3, i); k.olhar = [i < 2 ? 1 : -1, 0]; k.boca = t > a0 + 0.9 ? 'aberta' : 'reta'; k.exp = t > a0 + 0.9 ? 'feliz' : 'normal'; if (i === 0) k.ik(1, t < a0 + 0.5 ? 140 : 160, t < a0 + 0.5 ? -300 : -220); k.draw(cc, t); });
            const u = clamp((t - a0 - 0.2) / 0.35), cai = clamp((t - a0 - 0.55) / 0.5);
            J.reset(); J.piscar = piscada(t); J.x = 560; J.y = CH + 20;
            if (cai <= 0) { J.exp = u > 0.5 ? 'choque' : 'normal'; J.boca = 'o'; J.olhar = [-1, 0]; J.ik(-1, -90, -260); J.ik(1, 90, -260); J.draw(cc, t); bolaDesenho(cc, lerp(330, 540, u), CH - 180, 24, t * 12); }
            else {
              const y = CH + 20 - Math.sin(clamp(cai * 1.6) * Math.PI) * 160 + impulse(t, a0 + 0.9, -10, 0.2);
              J.exp = 'choque'; J.boca = 'grito'; J.olhoTam = 1.2; J.ik(-1, -110, -250); J.ik(1, 110, -250);
              sentadoChao(cc, J, t, 560, y);
              if (cai > 0.6) { poeira(cc, 560, CH + 20, t, a0 + 0.85, 0.7); estrelasTontura(cc, 560, CH - 220, t, 1); }
              bolaDesenho(cc, lerp(560, 900, clamp((t - a0 - 0.55) / 0.8)), CH - 180 - Math.sin(clamp((t - a0 - 0.55) / 0.8) * Math.PI) * 200, 24, t * 12);
            }
          });
          return;
        }
        if (t < c0 - 0.1) {
          // esconde-esconde: ninguém procura
          st.setCam(-250, 1460, 1.3);
          cena(st, t, 0.65, cc => {
            const u = clamp((t - b0) / (b1 - b0));
            K.forEach((k, i) => { k.reset(); k.x = lerp(-250 + i * 90, 350 + i * 90, u); k.y = CH + (i % 2) * 10; k.walk = t * 12 + i; k.olhar = [1, 0]; k.boca = 'sorriso'; k.piscar = piscada(t, 3, i); k.draw(cc, t); });
            J.reset(); J.x = -470; J.y = CH - 40; J.piscar = piscada(t); J.frente = [false, true];
            J.olhar = [1, 0]; J.boca = u < 0.4 ? 'sorriso' : 'triste'; J.exp = u < 0.4 ? 'normal' : 'preocupado'; J.rostoX = 10;
            J.ik(1, 90, -250); J.x = -440 - sstep(b0 + 0.2, b0 + 0.5, t) * 32;
            J.draw(cc, t);
            rrect(cc, -490, 1000, 140, 520 + 250, 30, '#8a5a3a', { lw: 7 });
            for (let i = 0; i < 4; i++) { const ph = (t * 0.4 + i * 0.25) % 1; ellipse(cc, -520 + i * 120 + Math.sin(t * 2 + i) * 40, 1000 + ph * 700, 14, 8, '#4fb468', { lw: 3 }, ph * 6); }
            if (u > 0.5) { cc.save(); cc.globalAlpha = sstep(0.5, 0.7, u); cc.font = '900 40px Inter, sans-serif'; cc.fillStyle = '#2b1f2a'; cc.fillText('...', -600, 1420); cc.restore(); }
          }, { arvoreX: -420 });
          return;
        }
        // pega-pega: os outros parecem atletas olímpicos
        const u = clamp((t - c0) / (c1 - c0)), jx = lerp(-100, 900, u);
        const reclama = t > c0 + 1.3 && t < c0 + 3.0;
        st.setCam(clamp(jx + 120, 200, 900), 1540, 1.3);
        cena(st, t, 0.65, cc => {
          K.forEach((k, i) => {
            k.reset(); k.y = CH + (i % 2) * 14; k.piscar = piscada(t, 3, i);
            if (!reclama) { const ph = ((t - c0) * 0.9 + i * 0.25) % 1; k.x = lerp(-600, 1700, ph); k.walk = t * 30; k.lean = 0.25; k.boca = 'sorriso'; k.olhar = [1, 0]; k.ik(-1, -70 + Math.sin(t * 30) * 50, -170); k.ik(1, 70 - Math.sin(t * 30) * 50, -170); k.draw(cc, t); for (let q = 0; q < 4; q++) line(cc, [[k.x - 90 - q * 30, CH - 200 + q * 40], [k.x - 260 - q * 40, CH - 200 + q * 40]], '#ffffff', 5, 0.7); }
            else { k.x = jx + 260 + i * 110; k.olhar = [-1, 0]; k.exp = 'raiva'; k.boca = ['aberta', 'grito'][Math.floor(t * 8 + i) % 2]; k.ik(-1, -140, -260 + Math.sin(t * 12 + i) * 30); k.ik(1, 120, -300); k.draw(cc, t); }
          });
          J.reset(); J.x = jx; J.y = CH + 20; J.walk = t * 9; J.lean = 0.1; J.suor = 1; J.boca = 'aberta'; J.exp = 'preocupado'; J.olhar = [1, 0]; J.ik(-1, -70 + Math.sin(t * 9) * 30, -150); J.ik(1, 70 - Math.sin(t * 9) * 30, -150); J.squash = Math.sin(t * 18) * 0.02;
          if (reclama) { J.exp = 'choque'; J.boca = 'o'; J.walk = null; J.olhoTam = 1.2; J.ik(-1, -90, -280); J.ik(1, 90, -280); }
          J.draw(cc, t);
          if (reclama) linhasGrito(cc, jx + 420, CH - 280, t, 0.8, 9, 160);
        });
      },
    };
  },
};

// ================= 5. O DONO DA BOLA =================
export const c5 = {
  inicio: B[4], fim: B[5],
  criar(st) {
    const J = juninho(), M = marcao(), K = [tiago(), lucasK(), bruno()];
    return {
      desenhar(t) {
        const [a0, a1] = S('5a'), [b0, b1] = S('5b'), [c0, c1] = S('5c'), [d0, d1] = S('5d');
        let cam = [540, 1520, lerp(1.6, 1.9, sstep(a0, a1, t))];
        if (t > b0) cam = [620, 1500, lerp(1.9, 2.2, sstep(b0, b1, t))];
        if (t > c0) cam = [700, 1510, 1.7];
        if (t > d0) cam = [lerp(560, 600, (t - d0) / 2), 1520, lerp(2.4, 2.1, sstep(d0, d1, t))];
        st.setCam(cam[0], cam[1], cam[2], 0, t > c0 && t < c0 + 0.3 ? [Math.sin(t * 60) * 0.5, 0] : [0, 0]);
        cena(st, t, lerp(0.65, 0.5, sstep(B[4], B[5], t)), cc => {
          const vaiEmbora = t > c0 + 1.0;
          K.forEach((k, i) => { k.reset(); k.x = [180, 920, 1040][i]; k.y = CH + 10; k.piscar = piscada(t, 3, i); k.olhar = [i ? -1 : 1, 0]; k.boca = 'reta'; if (t > d0) { const u = clamp((t - d0 - i * 0.2) / 1.6); k.x += (i ? 1 : -1) * u * 700; k.walk = u > 0 && u < 1 ? t * 12 : null; k.olhar = [i ? 1 : -1, 0]; k.exp = 'normal'; k.palp = 0.4; } k.draw(cc, t); });
          J.reset(); J.x = 540; J.y = CH + 20; J.piscar = piscada(t); respira(J, t);
          const temBola = t < c0 + 0.15;
          // segura a bola com orgulho
          J.maoD = temBola ? bolaMao : null; J.ik(1, 70, -250); J.ik(-1, -60, -170); J.exp = 'feliz'; J.boca = 'sorriso'; J.headY = -4; J.blush = 0.5;
          if (t > b0 + 1.2) { J.exp = 'normal'; J.olhar = [0.4, -0.4]; J.boca = 'sorriso'; }
          if (!temBola) { J.exp = 'choque'; J.boca = 'grito'; J.olhoTam = 1.25; J.pupila = 0.45; J.olhar = [1, 0]; J.blush = 0; J.headY = 0; }
          if (t > d0) { J.olhar = [0, 0]; J.tremor = 0.4; J.boca = 'o'; }
          if (t < c0) { const g = sstep(a0, a0 + 0.5, t) * (1 - sstep(b0 + 1, b0 + 1.4, t)); glow(cc, 540, CH - 260, 380, '#fff2a0', 0.6 * g); for (let k = 0; k < 12; k++) { const an = k / 12 * TAU + t * 0.6; line(cc, [[540 + Math.cos(an) * 220, CH - 260 + Math.sin(an) * 220], [540 + Math.cos(an) * 340, CH - 260 + Math.sin(an) * 340]], '#fff2a0', 10, g * 0.8); } }
          // o Marcão chega por trás
          M.reset(); M.y = CH; M.piscar = piscada(t, 3.4);
          const chega = easeInOut(clamp((t - b0) / 1.6));
          M.x = vaiEmbora ? lerp(760, 1500, clamp((t - c0 - 1.0) / 2.0)) : lerp(1300, 760, chega); M.walk = (chega > 0 && chega < 1) || vaiEmbora ? t * 11 : null;
          M.olhar = vaiEmbora ? [1, 0] : [-1, 0.3]; M.exp = 'normal'; M.palp = 0.35; M.sobA = [0.25, -0.25]; M.boca = 'sorrisoMal' === 'x' ? 'reta' : 'lado';
          const fM = fala(t, [c0, c1]);
          if (fM) { M.boca = fM; M.exp = 'raiva'; M.palp = 0; }
          if (t > c0 && t < c0 + 0.15) { M.ik(-1, -200, -250); }
          if (!temBola) { M.maoE = bolaMao; M.ik(-1, -80, -240); M.frente = [false, false]; }
          J.draw(cc, t); M.draw(cc, t);
          if (fM) linhasGrito(cc, M.x, CH - 300, t, 0.8, 7, 140);
          if (chega > 0 && !vaiEmbora && t < c0) { cc.save(); cc.globalAlpha = 0.3 * chega; ellipse(cc, 640, CH + 20, 160, 26, '#000000', { stroke: null }); cc.restore(); }
          if (t > d0) { const u = clamp((t - d0) / 1.8); cc.save(); cc.translate(lerp(-200, 1200, u), CH - 20 - Math.abs(Math.sin(t * 5)) * 60); cc.rotate(t * 4); shape(cc, c => { c.moveTo(-30, -20); c.quadraticCurveTo(0, -40, 30, -20); c.lineTo(24, 26); c.lineTo(-24, 26); c.closePath(); }, 'rgba(240,240,250,0.85)', { lw: 3 }); cc.restore(); }
        });
      },
    };
  },
};

// ================= 6. SUA MÃE =================
export const c6 = {
  inicio: B[5], fim: B[6],
  criar(st) {
    const J = juninho(), Mae = mae(), K = [marcao(), tiago(), lucasK(), bruno()];
    return {
      desenhar(t) {
        const c = st.c;
        const [a0, a1] = S('6a'), [b0, b1] = S('6b'), [c0, c1] = S('6c'), [d0, d1] = S('6d');
        const naJanela = t > a0 + 2.1 && t < c0;
        let cam;
        if (t < a0 + 2.1) cam = [700, 1530, 1.3];
        else if (t < c0) cam = [CASA.jx, CASA.jy + 20, lerp(2.0, 2.4, sstep(b0, b1, t))];
        else if (t < d0) cam = [1100, 1500, 1.9];
        else cam = [lerp(1100, 600, easeInOut(clamp((t - d0) / 2))), 1530, 1.3];
        st.setCam(cam[0], cam[1], cam[2], 0, t > b0 && t < b1 ? [Math.sin(t * 50) * 0.35, 0] : [0, 0]);
        const sol = lerp(0.5, 0.38, sstep(B[5], B[6], t));
        bairro(st, t, { sol }); ruaChao(st, t, sol); ruaFrente(st, t, { sol, casa: false });
        st.mundo(cc => {
          // a mãe na janela
          casaFrente(cc, t, easeOut(clamp((t - a0 - 2.1) / 0.5)));
          const ap = easeOut(clamp((t - a0 - 2.3) / 0.4));
          cc.save(); cc.beginPath(); cc.rect(CASA.jx - 168, CASA.jy - 158, 336, 296); cc.clip();
          Mae.reset(); Mae.x = CASA.jx; Mae.y = CASA.jy + 380 - ap * 120; Mae.piscar = piscada(t, 2.5); Mae.olhar = [-0.8, 0.4]; Mae.exp = 'raiva'; Mae.boca = 'reta'; Mae.sob = [6, 6];
          const fMae = fala(t, [b0, b1]);
          if (fMae) { Mae.boca = fMae; Mae.jump = Math.abs(Math.sin(t * 10)) * 8; Mae.blush = 0.9; }
          Mae.maoD = chinelo('#e2473a'); Mae.frente = [false, true]; Mae.ik(1, 110, -320 + Math.sin(t * 9) * 20); Mae.ik(-1, -60, -150);
          if (t > c1) { Mae.exp = 'raiva'; Mae.boca = 'tremendo'; }
          Mae.draw(cc, t);
          if (fMae) glow(cc, CASA.jx - 26, CASA.jy - 140, 30, '#ff2a2a', 0.9);
          cc.restore(); gradeJanela(cc);
          if (fMae) linhasGrito(cc, CASA.jx, CASA.jy - 120, t, 1, 9, 190);
          if (t > d0 && t < d1) for (let i = 0; i < 3; i++) { const u = ((t - d0) * 0.8 + i / 3) % 1; circle(cc, CASA.jx - 30 + i * 30, CASA.jy - 200 - u * 120, 14 + u * 14, '#f6f2ea', { lw: 3, alpha: 1 - u }); }
          // as crianças jogando
          K.forEach((k, i) => { k.reset(); const ph = t * (1.4 + i * 0.2) + i; k.x = 500 + Math.sin(ph) * 380; k.y = CH + (i % 2) * 14; k.walk = t * 14 + i; k.boca = 'aberta'; k.exp = 'feliz'; k.olhar = [Math.cos(ph), 0.4]; k.piscar = piscada(t, 3, i); k.draw(cc, t); });
          J.reset(); J.y = CH + 20; J.piscar = piscada(t, 2.8);
          if (t < c0) { const ph = t * 1.6; J.x = 700 + Math.sin(ph) * 300; J.walk = t * 14; J.exp = 'feliz'; J.boca = 'grito'; J.olhar = [Math.cos(ph), 0.4]; if (t > b0) { J.walk = null; J.exp = 'choque'; J.boca = 'o'; J.olhar = [1, -0.6]; J.x = 1000; } }
          else if (t < d0) {
            // "SÓ MAIS CINCO MINUTOS!" com a mão aberta
            J.x = 1000; J.olhar = [1, -0.7]; J.exp = 'normal'; J.sob = [-10, -10]; J.maoD = cinco(J.d.pele); J.ik(1, 120, -330); J.ik(-1, -60, -150);
            const fJ = fala(t, [c0 + 0.6, c1]); J.boca = fJ || 'sorriso';
          } else {
            // volta para o jogo como quem foge da prisão
            const u = clamp((t - d0) / 1.6); J.x = lerp(1000, 520, easeIn(u)); J.walk = t * (u < 0.3 ? 8 : 24); J.lean = u < 0.3 ? -0.05 : -0.2; J.flip = 1; J.olhar = u < 0.3 ? [1, 0] : [-1, 0]; J.exp = u < 0.3 ? 'preocupado' : 'feliz'; J.boca = u < 0.3 ? 'torto' : 'grito'; J.ik(-1, -70 + Math.sin(t * 24) * 40, -170); J.ik(1, 70 - Math.sin(t * 24) * 40, -170);
            if (u >= 1) { const ph = t * 1.6; J.x = 520 + Math.sin(ph) * 200; J.exp = 'feliz'; }
          }
          J.draw(cc, t);
          if (t > d0 && t < d0 + 1.6) for (let k = 0; k < 5; k++) line(cc, [[J.x + 100 + k * 30, CH - 150 + k * 30], [J.x + 260 + k * 40, CH - 150 + k * 30]], '#ffffff', 5, 0.7);
          bolaDesenho(cc, 600 + Math.sin(t * 2.1) * 360, CH - 20 - Math.abs(Math.sin(t * 6)) * 50, 22, t * 6);
        });
        if (naJanela && t > b0) { c.save(); c.globalCompositeOperation = 'multiply'; c.globalAlpha = 0.25; c.fillStyle = '#ff6040'; c.fillRect(0, 0, W, H); c.restore(); }
      },
    };
  },
};

// ================= 7. FINAL =================
export const c7 = {
  inicio: B[6], fim: B[7],
  criar(st) {
    const J = juninho(), K = [marcao(), tiago(), lucasK(), bruno()];
    return {
      desenhar(t) {
        const c = st.c;
        const [a0, a1] = S('7a'), [b0, b1] = S('7b'), [c0, c1] = S('7c');
        const sol = lerp(0.38, 0.12, sstep(B[6], B[7] - 2, t));
        const u = easeInOut(clamp((t - c0) / (B[7] - c0 - 1)));
        st.setCam(lerp(560, 600, u), lerp(1500, 1320, u), lerp(2.1, 0.95, u) + (t < b0 ? 0 : 0));
        bairro(st, t, { sol }); ruaChao(st, t, sol); ruaFrente(st, t, { sol, casa: false, traves: true });
        st.mundo(cc => {
          // sentado no meio-fio
          J.reset(); J.semPernas = true; J.x = 560; J.y = RUA.calcada + 87; J.piscar = piscada(t, 3.4); respira(J, t);
          J.ik(-1, -70, -120); J.ik(1, 70, -120); J.olhar = [Math.sin(t * 1.1) * 0.6, 0.2];
          J.exp = 'feliz'; J.boca = 'aberta';
          if (t > a0 + 1.6) { J.exp = 'normal'; J.boca = 'sorriso'; }
          if (t > b0) { const k = sstep(b0, b0 + 2.5, t); J.palp = 0.35 * k; J.boca = 'sorriso'; J.sob = [-4 * k, -4 * k]; J.blush = 0.3; J.headTilt = 0.06 * k; }
          J.alpha = 1 - sstep(c1 - 0.5, c1 + 1.0, t);
          for (const s of [-1, 1]) { cc.save(); cc.globalAlpha = J.alpha; limb(cc, [[560 + s * 24, RUA.calcada - 6], [560 + s * 46, RUA.calcada + 22], [560 + s * 44, RUA.calcada + 80]], 18, J.d.pele); ellipse(cc, 560 + s * 52, RUA.calcada + 86, 22, 12, J.d.sapato, { lw: 4 }); cc.restore(); }
          J.draw(cc, t);
          K.forEach((k, i) => { k.reset(); const ph = t * (1.3 + i * 0.2) + i; k.x = 560 + Math.sin(ph) * 420; k.y = CH + 60 + (i % 2) * 30; k.walk = t * 13 + i; k.boca = 'aberta'; k.exp = 'feliz'; k.olhar = [Math.cos(ph), 0]; k.piscar = piscada(t, 3, i); k.alpha = 1 - sstep(c0 + 1.0 + i * 0.8, c0 + 2.0 + i * 0.8, t); k.draw(cc, t); });
          bolaDesenho(cc, 560 + Math.sin(t * 1.9) * 400 * (1 - sstep(c1, c1 + 2, t)), CH + 40 - Math.abs(Math.sin(t * 5)) * 50 * (1 - sstep(c1, c1 + 1, t)), 22, t * 5 * (1 - sstep(c1, c1 + 2, t)));
        });
        // luz dourada de fim de tarde
        c.save(); c.globalCompositeOperation = 'soft-light'; c.globalAlpha = 0.35 + 0.3 * sstep(b0, B[7], t); c.fillStyle = '#ff9a3a'; c.fillRect(0, 0, W, H); c.restore();
      },
    };
  },
};
