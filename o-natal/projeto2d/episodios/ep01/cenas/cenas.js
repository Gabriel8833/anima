// "O pior Natal da minha vida" — cenas 2D (cartoon adulto)
import { TAU, lerp, clamp, sstep, win, kf, easeInOut, easeIn, easeOut, easeBack, rng, impulse } from '../../../motor/base.js';
import { glow, sparkle, speedLines, circle, line, rrect, ellipse, shape, cloud, poly, limb } from '../../../motor/desenho.js';
import { vini, tio, tia, velha, maeN, avo, primo, noel, barbaNoel, travessa, pratoMao, presente, garfo } from '../../../personagens/elenco.js';
import { SALA, sala, arvore, mesaCeia, placa, telaErro, estadio } from '../../../cenarios/lugares.js';

const W = 1080, H = 1920;
const tempos = await (await fetch(new URL('../tempos.json', import.meta.url))).json();
const S = id => { const f = tempos.narracao.find(n => n.id === id); return [f.inicio, f.fim]; };
const piscada = (t, f = 3.2, o = 0) => (((t + o) % f) < 0.12 ? 1 : 0);
const respira = (P, t, o = 0) => { P.squash = Math.sin(t * 2.3 + o) * 0.012; };
const fala = (t, [a, b], forte = false) => (t > a && t < b ? (forte ? ['grito', 'aberta', 'grito', 'meia'] : ['aberta', 'meia', 'o', 'meia', 'reta'])[Math.floor(t * 11) % (forte ? 4 : 5)] : null);
const CH = SALA.chao, MESA_Y = 1560;
const ini = id => S(id)[0] - 0.15;
const B = [0, ini('2a'), ini('3a'), ini('4a'), ini('5a'), ini('6a'), ini('7a'), tempos.duracao];

function sentado(P, x, yAssento) { P.semPernas = true; P.x = x; P.y = yAssento + 118 * P.s; }
function familiaMesa(cc, t, { tia: Ta, mae: Ma, tio: Ti } = {}, comendo = 1) {
  [[Ta, 360], [Ma, 560], [Ti, 760]].forEach(([P, x], i) => { if (!P) return; P.reset(); sentado(P, x, MESA_Y - 40); P.piscar = piscada(t, 3 + i * 0.4, i); respira(P, t, i); P.ik(-1, -70, -150); P.ik(1, 70 + Math.sin(t * 5 + i) * 10 * comendo, -150 - Math.abs(Math.sin(t * 5 + i)) * 50 * comendo); P.boca = comendo && Math.sin(t * 9 + i) > 0 ? 'meia' : 'reta'; P.olhar = [Math.sin(t * 0.7 + i) * 0.8, 0.3]; P.draw(cc, t); });
}
function linhasRaiva(c, x, y, t, a = 1, n = 9, r0 = 120) { for (let i = 0; i < n; i++) { const an = -Math.PI / 2 + (i - (n - 1) / 2) * 0.3; const r1 = r0 + 50 + Math.sin(t * 30 + i) * 12; line(c, [[x + Math.cos(an) * r0, y + Math.sin(an) * r0], [x + Math.cos(an) * r1, y + Math.sin(an) * r1]], '#f2e6d6', 7, a); } }

// ================= 1. A CHEGADA =================
export const c1 = {
  inicio: B[0], fim: B[1],
  criar(st) {
    const V = vini(), Ta = tia(), Ma = maeN(), Ti = tio(), A = avo(), Pr = primo();
    return {
      desenhar(t) {
        const pts = [[0, [1650, 1240, 1.05]], [2.2, [620, 1300, 1.12]], [3.5, [-560, 1330, 1.25]], [4.6, [-590, 1440, 2.0]], [B[1], [-590, 1450, 2.35]]];
        if (globalThis.DBG) { st.setCam(500, 1200, 0.35); } else st.setCam(...kf(t, pts, easeInOut), 0, t > 5.0 && t < 5.4 ? [Math.sin(t * 50) * 0.3, 0] : [0, 0]);
        sala(st, t, { almofadas: 1 });
        st.mundo(c => {
          A.reset(); sentado(A, SALA.poltrona, 1520); A.exp = 'fechado'; A.boca = 'o'; A.ik(-1, -90, -130); A.ik(1, 90, -130); respira(A, t); A.draw(c, t);
          Pr.reset(); Pr.x = SALA.sofa + 80; Pr.y = 1520; Pr.jump = Math.abs(Math.sin(t * 6)) * 120; Pr.exp = 'feliz'; Pr.boca = 'grito'; Pr.ik(-1, -110, -330); Pr.ik(1, 110, -330); Pr.draw(c, t);
          familiaMesa(c, t, { tia: Ta, mae: Ma, tio: Ti });
          mesaCeia(c, SALA.mesa, MESA_Y, t);
          // ele entra sorrindo com o presente... e o sorriso morre
          const u = easeOut(clamp((t - 3.2) / 1.3));
          V.reset(); V.x = lerp(SALA.porta - 40, SALA.porta + 170, u); V.y = CH; V.walk = u > 0 && u < 1 ? t * 11 : null; V.piscar = piscada(t); respira(V, t);
          V.maoD = presente(); V.ik(1, 90, -200); V.ik(-1, -66, -150); V.exp = 'normal'; V.boca = 'sorriso'; V.olhar = [1, 0];
          const morre = sstep(4.6, 5.6, t);
          if (morre > 0) { V.boca = morre < 0.4 ? 'sorriso' : (morre < 0.8 ? 'reta' : 'tremendo'); V.sob = [-8 * morre, -8 * morre]; V.olhoTam = 0.8 + 0.12 * morre; V.pupila = 1 - 0.4 * morre; V.suor = sstep(5.2, 5.5, t); }
          if (t > 3.2) V.draw(c, t);
          // porta abrindo
          if (t > 2.8 && t < 4.4) { c.save(); c.globalAlpha = win(t, 2.8, 3.1, 4.0, 4.4) * 0.5; c.fillStyle = '#f2e6c8'; c.fillRect(SALA.porta - 150, 780, 300, 680); c.restore(); }
        });
        if (t > 4.9) { const c = st.c; c.save(); c.globalCompositeOperation = 'multiply'; c.globalAlpha = 0.35 * sstep(4.9, 5.3, t); c.fillStyle = '#c03020'; c.fillRect(0, 0, W, H); c.restore(); }
      },
    };
  },
};

// ================= 2. O TIO DO PAVÊ =================
export const c2 = {
  inicio: B[1], fim: B[2],
  criar(st) {
    const V = vini(), Ti = tio(), Ta = tia(), Ma = maeN();
    return {
      desenhar(t) {
        const [a0, a1] = S('2a'), [b0, b1] = S('2b'), [c0, c1] = S('2c');
        const VX = -360;
        let cam;
        if (t < a1 - 1.0) cam = [lerp(-420, -300, (t - B[1]) / 4), 1420, 1.6];
        else if (t < b1) cam = [lerp(-200, -150, sstep(a1 - 1, b1, t)), 1395, lerp(2.0, 2.6, sstep(a1 - 1, b0, t))];
        else if (t < c1) cam = [VX, 1440, 3.0];
        else cam = [-140, 1400, 2.6];
        st.setCam(cam[0], cam[1], cam[2], 0, t > c0 && t < c1 ? [Math.sin(t * 60) * 0.5, 0] : [0, 0]);
        sala(st, t);
        st.mundo(c => {
          familiaMesa(c, t, { tia: Ta, mae: Ma });
          mesaCeia(c, SALA.mesa, MESA_Y, t);
          V.reset(); V.x = VX; V.y = CH; V.piscar = piscada(t); respira(V, t); V.ik(-1, -66, -150); V.ik(1, 66, -150);
          V.exp = 'normal'; V.boca = 'sorriso'; V.olhar = [0.4, 0];
          // o tio surge por trás com o pavê
          const chega = easeOut(clamp((t - a0 - 2.4) / 1.0));
          Ti.reset(); Ti.x = lerp(300, -150, chega); Ti.y = CH - 6; Ti.walk = chega > 0 && chega < 1 ? t * 10 : null; Ti.piscar = piscada(t, 2.8); respira(Ti, t, 1);
          Ti.maoD = travessa('pave'); Ti.ik(1, 80, -200); Ti.ik(-1, -70, -160); Ti.olhar = [-1, 0]; Ti.boca = 'sorriso'; Ti.sobA = [-0.15, 0.15]; Ti.sob = [-8, -8];
          if (t > a1 - 1.0) { Ti.olhar = [0, 0]; Ti.headTilt = 0.08; Ti.boca = 'sorriso'; Ti.lean = -0.06; }
          const fT = fala(t, [b0, b1]);
          if (fT) { Ti.boca = fT; }
          if (t > b1 - 0.35 && t < c0) { Ti.wink = true; Ti.boca = 'sorriso'; }
          if (t > b1 - 0.1) { Ti.exp = 'feliz'; Ti.boca = 'aberta'; Ti.jump = Math.abs(Math.sin(t * 14)) * 10; Ti.ik(-1, -30, -170); Ti.olhar = [0, 0]; }
          // reação: "PORRA, TIO!"
          if (t > b0) { V.olhar = [1, 0]; V.palp = 0.45; V.boca = 'reta'; V.sobA = [0.3, -0.3]; }
          const fV = fala(t, [c0, c1], true);
          if (fV || (t > c0 && t < c1 + 0.1)) { V.boca = fV || 'grito'; V.exp = 'raiva'; V.palp = 0; V.vermelho = 1; V.tremor = 1; V.ik(-1, -120, -260); V.ik(1, 120, -260); }
          if (t >= c1 + 0.1) { V.exp = 'raiva'; V.vermelho = 0.5; V.boca = 'tremendo'; }
          if (t < c0 || t >= c1) { V.draw(c, t); Ti.draw(c, t); } else { Ti.draw(c, t); V.draw(c, t); }
          if (t > c0 && t < c1 + 0.1) linhasRaiva(c, VX, CH - 360, t, 1, 9, 150);
          placa(c, -120, 1080, easeBack(clamp((t - b0 - 0.3) / 0.3)) * (1 - sstep(c0 - 0.1, c0, t)), ['PIADA VENCIDA', 'DESDE 2009'], -0.08);
        });
      },
    };
  },
};

// ================= 3. A TIA INVESTIGADORA =================
export const c3 = {
  inicio: B[2], fim: B[3],
  criar(st) {
    const V = vini(), Ta = tia(), Ti = tio(), Ma = maeN();
    return {
      desenhar(t) {
        const c = st.c;
        const [a0, a1] = S('3a'), [b0, b1] = S('3b'), [c0, c1] = S('3c');
        const VX = -360;
        let cam;
        if (t < b0) cam = [lerp(-150, -250, sstep(a0, a1, t)), 1410, lerp(1.6, 2.1, sstep(a0, a1, t))];
        else if (t < b1) cam = [-170, 1380, 2.7];
        else if (t < c1) cam = [VX, 1440, t < c0 ? 3.4 : 3.0];
        else cam = [-260, 1420, 2.3];
        st.setCam(cam[0], cam[1], cam[2], 0, t > c0 && t < c1 ? [Math.sin(t * 60) * 0.5, 0] : [0, 0]);
        sala(st, t);
        st.mundo(cc => {
          familiaMesa(cc, t, { mae: Ma, tio: Ti });
          mesaCeia(cc, SALA.mesa, MESA_Y, t);
          V.reset(); V.x = VX; V.y = CH; V.piscar = piscada(t); respira(V, t); V.ik(-1, -66, -150); V.ik(1, 66, -150);
          V.exp = 'raiva'; V.boca = 'tremendo'; V.vermelho = lerp(0.5, 0, sstep(a0, a0 + 1.5, t)); V.olhar = [1, 0];
          // a tia se aproxima perigosamente
          const u = easeInOut(clamp((t - a0) / 3.6));
          Ta.reset(); Ta.x = lerp(250, -200, u); Ta.y = CH - 4; Ta.walk = u > 0 && u < 1 ? t * 9 : null; Ta.piscar = piscada(t, 3.6); respira(Ta, t, 2);
          Ta.maoD = pratoMao(2, 1); Ta.ik(1, 80, -190); Ta.ik(-1, -70, -150); Ta.olhar = [-1, 0.1]; Ta.boca = 'sorriso'; Ta.palp = 0.3; Ta.sobA = [-0.2, 0.2]; Ta.lean = -0.1 * u;
          if (t > a0 + 1.0) { V.exp = 'preocupado'; V.boca = 'torto'; V.lean = 0.05 * u; V.suor = 1; V.vermelho = 0; }
          const fT = fala(t, [b0, b1]); if (fT) { Ta.boca = fT; Ta.olhar = [-1, 0]; }
          // trava: tela de erro
          if (t > b1 && t < c0) { V.exp = 'normal'; V.piscar = 0; V.olhar = [0, 0]; V.pupila = 0.35; V.olhoTam = 0.95; V.boca = 'reta'; V.squash = 0; V.suor = 0; }
          const fV = fala(t, [c0, c1], true);
          if (fV) { V.boca = fV; V.exp = 'raiva'; V.vermelho = 1; V.tremor = 1; V.ik(-1, -120, -270); V.ik(1, 120, -270); V.olhar = [1, 0]; }
          if (t > c1 - 0.3) { Ta.exp = 'preocupado'; Ta.frente = [true, false]; Ta.ik(-1, -10, -190); Ta.boca = Math.floor(t * 9) % 2 ? 'o' : 'meia'; }
          if (t > c1) { V.olhar = [0, 0]; V.exp = 'preocupado'; V.boca = 'triste'; V.vermelho = 0.3; V.tremor = 0; V.ik(-1, -66, -150); V.ik(1, 66, -150); }
          V.draw(cc, t); Ta.draw(cc, t);
          if (fV) linhasRaiva(cc, VX, CH - 360, t, 1, 9, 150);
        });
        if (t > b1 && t < c0 + 0.05) telaErro(c, W / 2, 560, sstep(b1, b1 + 0.1, t), t);
      },
    };
  },
};

// ================= 4. A UVA-PASSA DO DEMÔNIO =================
export const c4 = {
  inicio: B[3], fim: B[4],
  criar(st) {
    const V = vini(), Ve = velha();
    return {
      desenhar(t) {
        const c = st.c;
        const [a0, a1] = S('4a'), [b0, b1] = S('4b');
        const closeArroz = t > a1 - 1.8 && t < b0;
        const u = easeInOut(clamp((t - a0 - 0.3) / 2.6));
        const vx = lerp(SALA.cozinha, SALA.cozinha - 380, u);
        let cam;
        if (t < a1 - 1.8) cam = [lerp(2250, 2000, u), lerp(1320, 1380, u), lerp(1.35, 1.7, u)];
        else if (closeArroz) cam = [vx - 26, CH - 196, lerp(4.2, 4.8, sstep(a1 - 1.8, b0, t))];
        else cam = [-360, 1440, lerp(2.4, 2.8, sstep(b0, b1, t))];
        st.setCam(...cam);
        sala(st, t);
        st.mundo(cc => {
          // luz dramática atrás dela e sombra gigante na parede
          if (t < b0) {
            glow(cc, SALA.cozinha, 1100, 700, '#fff0c0', 0.8);
            const sombra = true;
            Ve.reset(); Ve.x = vx; Ve.y = CH; Ve.walk = u > 0 && u < 1 ? t * 6 : null; Ve.piscar = piscada(t, 4); Ve.maoD = travessa('arroz'); Ve.ik(1, 70, -200); Ve.ik(-1, -50, -190); Ve.frente = [false, false];
            Ve.olhar = [-1, 0.2]; Ve.palp = 0.35; Ve.boca = 'sorriso'; Ve.sobA = [-0.25, 0.25];
            cc.save(); cc.globalAlpha = 0.6; cc.filter = 'brightness(0)'; cc.translate(vx - 300, 1460); cc.scale(2.3, 2.3); cc.translate(-vx, -CH); Ve.draw(cc, t); cc.restore();
            Ve.draw(cc, t);
            if (closeArroz) { const [hx, hy] = Ve.mao(1); for (let k = 0; k < 5; k++) { const an = k * 1.3 + t; glow(cc, hx - 30 + Math.cos(an) * 60, hy - 30 + Math.sin(an) * 20, 30, '#ff3a2a', 0.5); } }
          } else {
            // o horror: "ISSO NÃO É COMIDA..."
            V.reset(); V.x = -360; V.y = CH; V.piscar = 0; respira(V, t);
            const pass = clamp((t - (b1 - 1.0)) / 1.0);
            V.maoD = pratoMao(2, 1, pass >= 1 ? 1 : 0); V.ik(1, 60, -200); V.ik(-1, -110, -280);
            const fV = fala(t, [b0, b1], true);
            V.exp = 'medo'; V.boca = fV || 'grito'; V.olhoTam = 0.95; V.pupila = 0.4; V.tremor = 0.8; V.suor = 1; V.olhar = [0.3, 0.6];
            V.draw(cc, t);
            const [px, py] = V.mao(1);
            if (pass > 0 && pass < 1) { const yy = lerp(py - 420, py - 30, easeIn(pass)); ellipse(cc, px - 26, yy, 9, 7, '#3a1a2a', { lw: 2 }); glow(cc, px - 26, yy, 40, '#ff3a2a', 0.5); for (let k = 0; k < 3; k++) line(cc, [[px - 40 + k * 14, yy - 30], [px - 40 + k * 14, yy - 60]], '#ffffff', 3, 0.5); }
          }
        });
        if (closeArroz || t < b0) { c.save(); c.globalCompositeOperation = 'multiply'; c.globalAlpha = closeArroz ? 0.45 : 0.25; c.fillStyle = '#b02010'; c.fillRect(0, 0, W, H); c.restore(); }
        if (t > b1 - 1.0 && t < b1) { c.save(); c.globalAlpha = 0.2; c.fillStyle = '#ffffff'; c.fillRect(0, 0, W, H); c.restore(); }
      },
    };
  },
};

// ================= 5. O CAOS FAMILIAR =================
export const c5 = {
  inicio: B[4], fim: B[5],
  criar(st) {
    const Pr = primo(), A = avo(), Ti = tio(), Tf = tio(), Ta = tia(), Ma = maeN();
    return {
      desenhar(t) {
        const c = st.c;
        const [a0, a1] = S('5a');
        const T1 = a0 + 3.6, T2 = a0 + 6.1, T3 = a0 + 8.0, T4 = a0 + 10.0;
        if (t < T1) {
          // primo pulando no sofá
          const whip = sstep(T1 - 0.35, T1, t);
          st.setCam(lerp(SALA.sofa + 40, SALA.arvore, whip), 1400, lerp(1.55, 1.3, whip));
          sala(st, t, { almofadas: 1, arvoreBal: whip > 0.5 ? Math.sin(t * 30) * 0.06 : 0 });
          st.mundo(cc => {
            Pr.reset(); Pr.x = SALA.sofa + Math.sin(t * 3) * 150; Pr.y = 1520; Pr.jump = Math.abs(Math.sin(t * 7)) * 180; Pr.exp = 'feliz'; Pr.boca = 'grito'; Pr.ik(-1, -110, -330 + Math.sin(t * 14) * 40); Pr.ik(1, 110, -330 - Math.sin(t * 14) * 40); Pr.lean = Math.sin(t * 7) * 0.2; Pr.draw(cc, t);
            for (let k = 0; k < 3; k++) { const dt = t - a0 - 0.6 - k * 0.9; if (dt > 0 && dt < 1.6) { cc.save(); cc.translate(SALA.sofa - 100 + k * 120 + dt * (300 + k * 200), 1400 - dt * 600 + dt * dt * 500); cc.rotate(dt * 8); rrect(cc, -60, -24, 120, 48, 16, ['#6a5a7a', '#c8243a', '#e8b030'][k], { lw: 4 }); cc.restore(); } }
          });
          if (whip > 0) speedLines(c, W / 2, H / 2, 50, 200, 1300, whip * 0.6, t, '#ffffff');
          return;
        }
        if (t < T2) {
          // o avô roncando: a cada ronco a mesinha treme
          st.setCam(SALA.poltrona - 60, 1360, 1.8, 0, [Math.sin(t * 40) * 0.15 * Math.max(0, Math.sin(t * 7)), 0]);
          sala(st, t);
          st.mundo(cc => {
            const ronco = Math.max(0, Math.sin((t - T1) * 7.5));
            A.reset(); sentado(A, SALA.poltrona, 1520); A.exp = 'fechado'; A.boca = ronco > 0.3 ? 'grito' : 'o'; A.headTilt = -0.15; A.headY = -6 * ronco; A.squash = -0.03 * ronco; A.ik(-1, -100, -130); A.ik(1, 100, -130); A.draw(cc, t);
            rrect(cc, 1460, 1470, 160, 20, 4, '#5a3220', { lw: 5 }); rrect(cc, 1530, 1490, 20, 150, 4, '#5a3220', { lw: 4 });
            for (let k = 0; k < 4; k++) { const j = ronco * Math.abs(Math.sin(t * 50 + k)) * 18; if (k < 2) { shape(cc, c => { c.moveTo(1480 + k * 50, 1410 - j); c.lineTo(1510 + k * 50, 1410 - j); c.lineTo(1506 + k * 50, 1470 - j); c.lineTo(1484 + k * 50, 1470 - j); c.closePath(); }, 'rgba(220,240,255,0.5)', { lw: 3 }); } else circle(cc, 1500 + k * 30, 1460 - j, 9, '#c89a5a', { lw: 2 }); }
            const [hx, hy] = A.cabeca();
            if (ronco > 0.2) for (let k = 0; k < 3; k++) shape(cc, c => { const r = 90 + k * 40 + ronco * 20; c.arc(hx, hy + 30, r, -2.6, -1.9); }, null, { stroke: '#f2e6d6', lw: 7, alpha: ronco * 0.8 });
          });
          return;
        }
        if (t < T3 || t >= T4) {
          // o tio bêbado contando a história (e tropeçando no chinelo)
          const tropeca = t >= T4;
          st.setCam(tropeca ? lerp(400, 300, (t - T4)) : 300, 1400, tropeca ? 1.5 : 1.75);
          sala(st, t);
          st.mundo(cc => {
            familiaMesa(cc, t, { tia: Ta, mae: Ma });
            mesaCeia(cc, SALA.mesa, MESA_Y, t);
            Ti.reset(); Ti.x = tropeca ? lerp(160, 360, clamp((t - T4) / 0.8)) : 160; Ti.y = CH + 20; Ti.piscar = piscada(t, 2.2); Ti.exp = 'normal'; Ti.palp = 0.5; Ti.blush = 0.9; Ti.vermelho = 0.25;
            Ti.lean = Math.sin(t * 2.2) * 0.08; Ti.boca = Math.floor(t * 8) % 2 ? 'aberta' : 'meia'; Ti.olhar = [0.6, -0.2];
            Ti.ik(1, 110 + Math.sin(t * 5) * 30, -280 + Math.cos(t * 5) * 30); Ti.ik(-1, -90, -190);
            if (tropeca) { const k = clamp((t - T4) / 0.8); Ti.walk = t * 10; Ti.lean = 0.4 * Math.sin(k * Math.PI); Ti.exp = 'choque'; Ti.palp = 0; Ti.boca = 'grito'; Ti.ik(-1, -130, -300); Ti.ik(1, 130, -300); Ti.olhar = [1, 0.6]; }
            Ti.draw(cc, t);
            if (tropeca) { const k = clamp((t - T4) / 0.8); cc.save(); cc.translate(lerp(240, 520, k), CH + 10 - Math.sin(k * Math.PI) * 160); cc.rotate(k * 9); rrect(cc, -36, -12, 72, 24, 12, '#2a2a30', { lw: 4 }); cc.restore(); }
          });
          return;
        }
        // fantasia: o craque de 1987 entrando no estádio
        const u = clamp((t - T3) / (T4 - T3));
        st.setCam(540, lerp(1500, 1420, u), lerp(1.6, 1.9, u));
        estadio(st, t);
        st.mundo(cc => {
          Tf.reset(); Tf.d.roupa = '#f2d230'; Tf.d.roupaSombra = '#c8a820'; Tf.x = lerp(380, 560, easeOut(u)); Tf.y = CH; Tf.walk = u < 0.6 ? t * 9 : null; Tf.exp = 'feliz'; Tf.boca = 'aberta'; Tf.olhar = [0, -0.5];
          Tf.ik(-1, -130, -340); Tf.ik(1, 130, -340); Tf.jump = u > 0.6 ? Math.abs(Math.sin(t * 8)) * 30 : 0;
          Tf.draw(cc, t);
          const r = rng(4); for (let i = 0; i < 40; i++) { const dt = t - T3 - (i % 8) * 0.1; if (dt < 0) continue; cc.save(); cc.translate(200 + r() * 700, 800 + dt * 400 + Math.sin(dt * 3 + i) * 30); cc.rotate(dt * 6 + i); rrect(cc, -8, -4, 16, 8, 2, ['#f2d230', '#2aa060', '#ffffff', '#c8243a'][i % 4], { stroke: null }); cc.restore(); }
        });
        const c2 = st.c; c2.save(); c2.globalAlpha = 0.25; c2.fillStyle = '#fff6d0'; c2.fillRect(0, 0, W, H); c2.restore();
      },
    };
  },
};

// ================= 6. A GUERRA DA COMIDA =================
export const c6 = {
  inicio: B[5], fim: B[6],
  criar(st) {
    const V = vini(), Ma = maeN(), Ta = tia(), Ti = tio();
    return {
      desenhar(t) {
        const [a0, a1] = S('6a'), [b0, b1] = S('6b'), [c0, c1] = S('6c');
        let cam = [240, 1430, lerp(1.7, 1.95, sstep(a0, a1, t))];
        if (t > b0) cam = [300, 1420, 2.0];
        if (t > c0) cam = [180, 1440, lerp(2.4, 2.7, sstep(c0, c1, t))];
        st.setCam(cam[0], cam[1], cam[2], 0, t > c0 && t < c1 ? [Math.sin(t * 55) * 0.35, 0] : [0, 0]);
        sala(st, t);
        st.mundo(cc => {
          familiaMesa(cc, t, { tia: Ta, tio: Ti });
          mesaCeia(cc, SALA.mesa, MESA_Y, t);
          const n = Math.min(3, Math.floor((t - a0) / 0.6)), far = clamp((t - a0 - 1.8) / 0.4);
          V.reset(); V.x = 180; V.y = CH; V.piscar = piscada(t); respira(V, t);
          V.maoE = pratoMao(Math.max(0, n), far); V.ik(-1, -40, -200);
          V.maoD = garfo(); V.ik(1, 150 + Math.sin(t * 6) * 20, -210 - Math.abs(Math.sin(t * 6)) * 30);
          V.exp = 'feliz'; V.boca = 'sorriso'; V.olhar = [0.6, 0.6]; V.blush = 0.4;
          // a mãe aparece atrás
          const ap = easeOut(clamp((t - b0 + 0.6) / 0.5));
          Ma.reset(); Ma.x = lerp(560, 400, ap); Ma.y = CH - 10; Ma.piscar = piscada(t, 2.7); Ma.olhar = [-1, 0.3]; Ma.boca = 'reta'; Ma.sobA = [0.25, -0.25]; Ma.frente = [false, false];
          Ma.ik(-1, -140, -250); Ma.ik(1, 70, -150);
          const fM = fala(t, [b0, b1]); if (fM) Ma.boca = fM;
          if (t > b0) { V.exp = 'normal'; V.boca = 'reta'; V.olhar = [0, 0]; V.ik(1, 150, -260); V.piscar = 0; V.pupila = 0.5; V.squash = 0; }
          const fV = fala(t, [c0, c1], true);
          if (t > c0) {
            // abraça o prato como um tesouro
            V.boca = fV || 'grito'; V.exp = 'raiva'; V.vermelho = 1; V.tremor = 0.8; V.maoD = null; V.maoE = pratoMao(3, 1); V.frente = [true, true]; V.ik(-1, -10, -190); V.ik(1, 40, -205); V.olhar = [1, 0]; V.lean = -0.08;
            Ma.exp = 'choque'; Ma.boca = 'o'; Ma.ik(-1, -70, -200);
          }
          if (ap > 0.01) Ma.draw(cc, t);
          V.draw(cc, t);
          if (t > c0 && t < c1) linhasRaiva(cc, 180, CH - 360, t, 1, 9, 150);
        });
      },
    };
  },
};

// ================= 7. O PEDIDO FINAL =================
export const c7 = {
  inicio: B[6], fim: B[7],
  criar(st) {
    const V = vini(), N = barbaNoel(noel()), Ta = tia(), Ti = tio(), Ma = maeN(), Pr = primo();
    return {
      desenhar(t) {
        const c = st.c;
        const [a0, a1] = S('7a'), [b0, b1] = S('7b');
        const tNoel = t > b0 + 1.2 && t < b0 + 2.2 || t > b1 + 0.0 && t < b1 + 1.9;
        let cam;
        if (t < a1) cam = [lerp(200, -230, easeInOut(clamp((t - a0) / 3.4))), lerp(1350, 1380, clamp((t - a0) / 3.4)), lerp(1.0, 2.1, easeInOut(clamp((t - a0) / 3.4)))];
        else if (!tNoel) cam = [-230, 1390, lerp(2.3, 2.9, sstep(a1, b1 + 3, t))];
        else cam = [SALA.arvore + 120, 1380, 1.55];
        st.setCam(...cam);
        sala(st, t);
        st.mundo(cc => {
          // a família continua o caos ao fundo
          familiaMesa(cc, t, { tia: Ta, mae: Ma, tio: Ti }, 1);
          if (Ti) { }
          mesaCeia(cc, SALA.mesa, MESA_Y, t);
          Pr.reset(); Pr.x = 200 + Math.sin(t * 1.5) * 300; Pr.y = CH + 40; Pr.walk = t * 14; Pr.exp = 'feliz'; Pr.boca = 'grito'; Pr.ik(-1, -110, -320); Pr.ik(1, 110, -320); Pr.draw(cc, t);
          // ele, derrotado no sofá
          V.reset(); sentado(V, SALA.sofa, 1500); V.piscar = piscada(t, 3.8); V.squash = 0.04; V.lean = 0.04;
          V.ik(-1, -80, -110); V.ik(1, 80, -110); V.exp = 'preocupado'; V.palp = 0.5; V.boca = 'triste'; V.olhar = [0, 0.4]; V.headTilt = 0.08;
          if (t > a0 + 1.5) V.olhar = [lerp(0, 1, sstep(a0 + 1.5, a0 + 3.2, t)), lerp(0.4, -0.2, sstep(a0 + 1.5, a0 + 3.2, t))];
          const fV = fala(t, [b0, b1]);
          if (fV) { V.boca = fV; V.palp = 0.2; V.olhar = [1, -0.3]; V.frente = [true, true]; V.ik(-1, -12, -230); V.ik(1, 12, -230); }
          if (t > b0 + 2.2 && t < b1 + 0.1) { V.palp = 0; V.olhoTam = 0.92; V.boca = 'sorriso'; V.blush = 0.4; V.olhar = [1, -0.2]; }
          if (t > b1 + 1.9) { V.olhar = [0, 0]; V.palp = 0.35; V.boca = 'reta'; V.exp = 'normal'; V.frente = [false, false]; V.ik(-1, -80, -110); V.ik(1, 80, -110); V.piscar = 0; V.squash = 0; }
          V.draw(cc, t);
          // Papai Noel ao lado da árvore: olha a família, sente pena, balança a cabeça e vai embora
          const ap = sstep(b0 + 1.2, b0 + 1.6, t), sai = clamp((t - b1 - 1.1) / 0.8);
          if (ap > 0) {
            N.reset(); N.x = SALA.arvore + 360 + sai * 400; N.y = CH; N.alpha = ap * (1 - sstep(0.6, 1, sai)); N.piscar = piscada(t, 3); N.ik(-1, -70, -150); N.ik(1, 70, -150);
            N.olhar = t < b1 ? [-1, 0.1] : (t < b1 + 0.5 ? [-1, 0.3] : [-1, 0]); N.exp = t > b1 + 0.35 ? 'preocupado' : 'normal'; N.boca = t > b1 + 0.35 ? 'triste' : 'reta';
            if (t > b1 + 0.5 && t < b1 + 1.1) N.headTilt = Math.sin((t - b1) * 18) * 0.15;
            if (sai > 0) { N.walk = t * 9; N.olhar = [1, 0]; }
            N.draw(cc, t);
          }
        });
        if (t > tempos.duracao - 0.12) st.overlay('#000', 1);
      },
    };
  },
};
