// "Por que coçamos a cabeça quando estamos confusos?" — cenas 2D
import { TAU, lerp, clamp, sstep, win, kf, easeInOut, easeIn, easeOut, easeBack, rng, impulse } from '../../../motor/base.js';
import { glow, sparkle, speedLines, circle, line, rrect, ellipse, shape, cloud } from '../../../motor/desenho.js';
import { caio, beto, ana, lu, dedos, batuca, lapis } from '../../../personagens/elenco.js';
import { ESC, salaEstudo, cadeira, pernasSentado, mesa, objetosMesa, interrogacao, lampada, mundoCerebro, ficha, esteira, mesaCerebro, arquivo, cerebroP, xicaraC, poltrona, telaFinal } from '../../../cenarios/lugares.js';

const W = 1080, H = 1920;
const piscada = (t, f = 3.3, o = 0) => (((t + o) % f) < 0.12 ? 1 : 0);
const respira = (P, t, o = 0) => { P.squash = Math.sin(t * 2.2 + o) * 0.012; };
const CX = 540, CY = ESC.mesa + 126;               // Caio sentado (pés escondidos; quadril no assento)
const HEAD = [CX, CY - 300];
const ALVO_COCA = (t, vel = 14, amp = 1) => [56 + Math.cos(t * vel) * 8 * amp, -345 + Math.sin(t * vel) * 6 * amp];
const bez = (a, b, c, u) => [(1 - u) ** 2 * a[0] + 2 * (1 - u) * u * b[0] + u * u * c[0], (1 - u) ** 2 * a[1] + 2 * (1 - u) * u * b[1] + u * u * c[1]];

function caioBase(C, t) {
  C.reset(); C.x = CX; C.y = CY; C.semPernas = true; C.piscar = piscada(t); respira(C, t);
  C.ik(-1, -72, -150); C.ik(1, 72, -150); C.olhar = [0, 0.8];
  return C;
}
// coçar: liga o braço direito à cabeça com dedos mexendo
function coca(C, t, k, vel = 14, amp = 1) {
  const a = ALVO_COCA(t, vel, amp * sstep(0.85, 1, k));
  const p = k < 1 ? bez([72, -150], [150, -250], a, easeInOut(k)) : a;
  C.ik(1, p[0], p[1]);
  if (k > 0.55) C.frente = [C.frente[0], true];
  C.maoD = k > 0.85 ? dedos(C.d.pele, 0.9, 1, vel * 1.6) : null;
  C.vento = k > 0.85 ? amp : 0;
}
// desenha a cena da escrivaninha com o Caio sentado
function cenaMesa(st, t, C, { prova = false, lapisMesa = false, extra = null, depois = null } = {}) {
  salaEstudo(st, t);
  st.mundo(c => {
    cadeira(c, CX);
    pernasSentado(c, CX, C.d.perna, C.d.sapato, t, 1);
    C.draw(c, t);
    extra?.(c);
    mesa(c, t);
    objetosMesa(c, t, { prova, lapisNaMesa: lapisMesa });
    C.drawArms(c, t);
    depois?.(c);
  });
}
function interrogacoes(c, t, n, a = 1, cx = HEAD[0], cy = HEAD[1], gira = 0.6) {
  for (let i = 0; i < n; i++) {
    const r = 150 + (i % 3) * 55, an = i * 2.4 + t * gira * (i % 2 ? 1 : -0.8), pop = easeBack(clamp((t - (i * 0.37 % 1)) * 3));
    interrogacao(c, cx + Math.cos(an) * r, cy - 70 - Math.abs(Math.sin(an)) * r * 0.6, 0.32 + (i % 3) * 0.08, a * pop, Math.sin(t * 3 + i) * 0.3, ['#f4c430', '#ff8fb1', '#7ac8ff'][i % 3]);
  }
}

// ================= 1. A CONFUSÃO COMEÇA (0 – 7.2) =================
export const c1 = {
  inicio: 0, fim: 7.2,
  criar(st) {
    const C = caio();
    return {
      desenhar(t) {
        caioBase(C, t);
        // escrevendo tranquilo
        const esc = t < 2.2;
        C.maoD = t < 3.9 ? lapis() : null;
        if (esc) { C.ik(1, 70 + Math.sin(t * 9) * 10, -150 + Math.abs(Math.sin(t * 13)) * -5); C.olhar = [0.6, 0.85]; C.boca = 'sorriso'; }
        else C.ik(1, 70, -150);
        // para; os olhos correm pelo livro (esquerda -> direita, duas linhas)
        if (t > 2.2) { const u = ((t - 2.25) / 0.55) % 1; C.olhar = t < 3.4 ? [lerp(-1, -0.25, u), 0.85] : [-0.5, 0.85]; C.boca = 'reta'; }
        // sobrancelhas se aproximam, cabeça vai para frente, boca entreaberta
        const fr = sstep(3.0, 3.6, t), inc = easeInOut(clamp((t - 3.4) / 0.5));
        C.sobA = [0.32 * fr, -0.32 * fr]; C.sob = [4 * fr, 4 * fr];
        C.headY = 6 * inc; C.rostoY = 4 * inc; C.lean = 0.03 * inc;
        if (t > 3.6) C.boca = 'meia';
        // larga o lápis e leva a mão até a cabeça
        if (t > 3.9) { const k = clamp((t - 3.9) / 1.5); coca(C, t, k); if (k < 0.4) C.ik(1, 72, lerp(-150, -170, k / 0.4)); C.olhar = [lerp(-0.5, 0.2, sstep(4.6, 5.2, t)), lerp(0.85, -0.3, sstep(4.6, 5.2, t))]; }
        // câmera: plano geral -> escrivaninha -> rosto
        const u1 = easeInOut(clamp(t / 4.0)), u2 = easeInOut(clamp((t - 5.0) / 1.8));
        st.setCam(lerp(lerp(540, 560, u1), 560, u2), lerp(lerp(1220, 1500, u1), 1450, u2), lerp(lerp(0.98, 1.55, u1), 2.15, u2));
        cenaMesa(st, t, C, { lapisMesa: t >= 3.9, depois: c => { if (t > 5.6) interrogacoes(c, t - 5.6, Math.min(4, 1 + Math.floor((t - 5.6) * 3))); } });
      },
    };
  },
};

// ================= 2. SERÁ QUE FUNCIONA? (7.2 – 12.6) =================
export const c2 = {
  inicio: 7.2, fim: 12.6,
  criar(st) {
    const C = caio();
    return {
      desenhar(t) {
        caioBase(C, t);
        const para = t > 9.2;
        if (!para) { coca(C, t, 1, 26, 1.3); C.olhoTam = 1.12; C.pupila = 0.8; C.sob = [-18, -2]; C.sobA = [0, 0.15]; C.olhar = [0.2, -0.2]; C.boca = 'o'; C.headTilt = Math.sin(t * 13) * 0.03; }
        else {
          // para e olha para cima: grande descoberta?
          const k = easeOut(clamp((t - 9.2) / 0.3));
          C.ik(1, lerp(56, 90, k), lerp(-345, -320, k)); C.frente = [false, true]; C.maoD = dedos(C.d.pele, 0.9, 0);
          C.olhar = [0, -1]; C.headY = -6 * k; C.rostoY = -8 * k; C.sob = [-16, -16]; C.boca = 'aberta'; C.olhoTam = 1.1;
          if (t > 10.75) { C.boca = 'triste'; C.exp = 'preocupado'; C.palp = 0.4; C.olhoTam = 1; C.sob = [-2, -2]; C.ik(1, lerp(90, 72, sstep(11.0, 11.5, t)), lerp(-320, -150, sstep(11.0, 11.5, t))); if (t > 11.3) C.frente = [false, false]; C.maoD = null; }
        }
        const zoomRap = easeOut(clamp((t - 8.4) / 0.3));
        let cam = [550, 1445, lerp(2.15, 3.2, zoomRap)];
        if (para) cam = [545, lerp(1445, 1400, easeInOut(clamp((t - 9.2) / 0.4))), 3.0];
        // mergulho no cabelo
        const mer = easeIn(clamp((t - 11.85) / 0.75));
        if (mer > 0) cam = [lerp(cam[0], 562, mer), lerp(cam[1], 1356, mer), lerp(cam[2], 46, mer ** 1.6)];
        st.setCam(cam[0], cam[1], cam[2], 0, t > 8.4 && t < 8.7 ? [Math.sin(t * 60) * 0.5, 0] : [0, 0]);
        const lp = easeBack(clamp((t - 9.45) / 0.3)), luz = (t > 10.0 && t < 10.12) || (t > 10.3 && t < 10.42) ? 1 : 0, queim = sstep(10.6, 10.7, t);
        cenaMesa(st, t, C, { lapisMesa: true, depois: c => {
          if (!para) interrogacoes(c, t, 5, 1, HEAD[0], HEAD[1], 2.2);
          else interrogacoes(c, t, 5, 1 - sstep(9.2, 9.5, t), HEAD[0], HEAD[1], 2.2);
          lampada(c, HEAD[0], HEAD[1] - 175 + Math.sin(t * 3) * 4, 0.55 * lp * (1 - sstep(11.6, 11.8, t)), luz, queim, t);
          if (t > 10.6 && t < 11.2) { const a = 1 - sstep(10.6, 11.2, t); for (let i = 0; i < 6; i++) { const an = i * 1.05 + 0.3; line(c, [[HEAD[0] + Math.cos(an) * 20, HEAD[1] - 186 + Math.sin(an) * 20], [HEAD[0] + Math.cos(an) * 46, HEAD[1] - 186 + Math.sin(an) * 46]], '#ffe46a', 4, a); } }
          if (t > 10.7 && t < 11.8) for (let i = 0; i < 3; i++) { const u = ((t - 10.7) * 0.9 + i / 3) % 1; c.save(); c.globalAlpha = (1 - u) * 0.7; circle(c, HEAD[0] + Math.sin(u * 6 + i) * 10, HEAD[1] - 210 - u * 70, 8 + u * 10, '#c8c8d0', { lw: 3 }); c.restore(); }
        } });
        // o cabelo se abre e revela o mundo de dentro
        if (mer > 0.3) {
          const c = st.c, r = easeIn(clamp((t - 12.15) / 0.45)) * 1300;
          if (r > 1) { c.save(); c.beginPath(); c.arc(W / 2, H / 2, r, 0, TAU); c.clip(); st.setCam(540, 1200, 1.5); mundoCerebro(st, t); c.restore(); for (let i = 0; i < 16; i++) { const an = i / 16 * TAU + t; line(c, [[W / 2 + Math.cos(an) * r, H / 2 + Math.sin(an) * r], [W / 2 + Math.cos(an + 0.2) * (r + 90), H / 2 + Math.sin(an + 0.2) * (r + 90)]], '#3a2416', 26); } }
        }
      },
    };
  },
};

// ================= 3. O QUE ESTÁ ACONTECENDO? (12.6 – 25.0) =================
const CHEGADAS = [...Array.from({ length: 9 }, (_, k) => 13.4 + k * 0.62), ...Array.from({ length: 12 }, (_, k) => 19.2 + k * 0.27)];
const BX = 540, BY = 1130, MESA_Y = 1330, PD = [800, MESA_Y], PE = [270, MESA_Y];
export const c3 = {
  inicio: 12.6, fim: 25.0,
  criar(st) {
    const R = rng(9), QUEDA = Array.from({ length: 30 }, () => [R(), R(), R()]);
    return {
      desenhar(t) {
        const c = st.c;
        const z = lerp(1.9, 1.32, easeOut(clamp((t - 12.6) / 1.2)));
        st.setCam(lerp(560, 610, clamp((t - 12.6) / 6)), lerp(1250, 1230, clamp((t - 12.6) / 2)), z + 0.06 * sstep(19.5, 24.8, t), 0, t > 23.5 ? [Math.sin(t * 40) * 0.25, 0] : [0, 0]);
        mundoCerebro(st, t);
        const rapido = t > 19.3;
        const ciclo = rapido ? 0.45 : 0.8, t0c = rapido ? 19.3 : 14.4;
        const chegou = CHEGADAS.filter(a => t > a + 1.1).length;
        let movidos = clamp(Math.floor((Math.min(t, 19.3) - 14.4) / 0.8), 0, 9) + (rapido ? Math.floor((Math.min(t, 22.0) - 19.3) / 0.45) : 0);
        movidos = Math.min(movidos, Math.max(0, chegou - 1));
        const caindo = t > 22.0;
        const pilhaD = Math.max(0, chegou - movidos);
        const fase = ((t - t0c) / ciclo) % 1, carregando = t > 14.4 && t < 22.0 && pilhaD > 0;
        // expressão e mãos do cérebro
        const o = { olhar: [0.5, 0.4], piscar: piscada(t, 2.8), boca: 'sorriso', tam: 1, sob: [0, 0] };
        const mD = [200, 170], mE = [-200, 170];
        if (carregando) { const p = bez([PD[0] - BX, 190], [0, -40], [PE[0] - BX + 20, 190], easeInOut(fase)); o.maoD = p; o.maoE = [-210, 160]; o.olhar = [clamp(p[0] / 200, -1, 1), 0.5]; o.segura = [null, (c, x, y) => ficha(c, x, y - 30, Math.sin(t * 5) * 0.2, 1, 0.8)]; }
        else { o.maoD = mD; o.maoE = mE; }
        if (t > 18.4) { o.tam = 1.15; o.pupila = 0.75; o.boca = 'o'; }
        if (rapido) { o.aflito = true; o.suor = 1; o.boca = 'tremendo'; }
        if (caindo) { o.boca = 'grito'; o.tam = 1.25; o.pupila = 0.55; o.maoD = [230, 120 + Math.sin(t * 20) * 20]; o.maoE = [-230, 120 - Math.sin(t * 20) * 20]; o.segura = null; o.olhar = [0.6, 0.8]; }
        if (t > 23.4) { o.maoD = [130, -190]; o.maoE = [-130, -190]; o.tremor = 1; o.olhar = [0, 0]; o.pupila = 0.5; o.boca = 'tremendo'; }
        st.mundo(cc => {
          cerebroP(cc, BX, BY + Math.sin(t * 2) * 6, 1.05, t, { ...o, semMaos: true });
          mesaCerebro(cc, 540, MESA_Y, 860);
          esteira(cc, 860, 1500, MESA_Y - 40, t, rapido ? 2.2 : 1);
          // fichas na esteira
          CHEGADAS.forEach((a, k) => { const u = (t - a) / 1.1; if (u > 0 && u < 1) ficha(cc, lerp(1460, 880, u), MESA_Y - 82 - Math.abs(Math.sin(u * 20)) * 4, Math.sin(u * 9) * 0.05, k, 0.9); });
          // pilha da direita (bagunça) e da esquerda (organizada)
          const bal = rapido ? Math.sin(t * 11) * 0.03 * Math.min(pilhaD, 10) : 0;
          for (let i = 0; i < pilhaD; i++) {
            if (caindo && i >= 2) {
              const q = QUEDA[i % 30], dt = t - 22.0 - (i - 2) * 0.05; if (dt < 0) { ficha(cc, PD[0] + Math.sin(i * 2.1) * 8, MESA_Y - 30 - i * 18, bal * i, i, 0.9); continue; }
              ficha(cc, PD[0] + (q[0] - 0.35) * 700 * dt, MESA_Y - 30 - i * 18 - 500 * dt * (0.4 + q[1]) + 1800 * dt * dt, dt * (q[2] - 0.5) * 12, i, 0.9);
              continue;
            }
            ficha(cc, PD[0] + Math.sin(i * 2.1) * 8 + bal * i * 30, MESA_Y - 30 - i * 18, Math.sin(i * 1.7) * 0.06 + bal * i, i, 0.9);
          }
          for (let i = 0; i < movidos; i++) ficha(cc, PE[0], MESA_Y - 30 - i * 16, (i % 2 ? 0.02 : -0.02), 3, 0.9);
          if (carregando && fase < 0.12) ficha(cc, PD[0], MESA_Y - 30 - pilhaD * 18, 0, 1, 0.9);
          // mãos por cima
          cerebroP(cc, BX, BY + Math.sin(t * 2) * 6, 1.05, t, { ...o, apenasMaos: true });
          if (t > 23.4) for (let i = 0; i < 4; i++) { const an = -Math.PI / 2 + (i - 1.5) * 0.5; line(cc, [[BX + Math.cos(an) * 300, BY - 40 + Math.sin(an) * 300], [BX + Math.cos(an) * 360, BY - 40 + Math.sin(an) * 360]], '#2b1f2a', 8); }
        });
      },
    };
  },
};

// ================= 4. COMPORTAMENTO DE DESLOCAMENTO (25.0 – 37.0) =================
export const c4 = {
  inicio: 25.0, fim: 37.0,
  criar(st) {
    const C = caio(), P = [beto(), ana(), lu()];
    return {
      desenhar(t) {
        const c = st.c;
        if (t < 33.0) {
          // Caio diante da prova; a mão vai para a cabeça e não para mais
          const s = 0.5 * easeInOut(clamp((t - 26.4) / 0.6));
          const desenhaCaio = () => {
            caioBase(C, t); C.olhar = [Math.sin(t * 1.7) * 0.4, 0.9]; C.exp = 'preocupado'; C.sob = [-4, -4]; C.boca = 'meia';
            const k = clamp((t - 25.5) / 0.9); if (k > 0) coca(C, t, k, 12, 1);
            const u = easeInOut(clamp((t - 25.0) / 1.4));
            st.setCam(lerp(540, 575, u) - 70 * s, lerp(1500, 1420, u), lerp(1.55, 2.2, u));
            cenaMesa(st, t, C, { prova: true, lapisMesa: true });
          };
          if (s < 0.01) { desenhaCaio(); return; }
          const xd = W * (1 - s);
          c.save(); c.beginPath(); c.rect(0, 0, xd, H); c.clip(); c.translate(-W * s / 2, 0); desenhaCaio(); c.restore();
          // lado direito: o cérebro organiza os arquivos
          c.save(); c.beginPath(); c.rect(xd, 0, W - xd, H); c.clip(); c.translate(W * (1 - s) / 2, 0);
          st.setCam(590, 1060, 0.8); mundoCerebro(st, t);
          const fase = ((t - 26.4) / 1.1) % 1, gaveta = Math.floor((t - 26.4) / 1.1) % 4;
          const mao = bez([-60, -260], [260, -320], [420, 60], easeInOut(clamp(fase * 1.4)));
          st.mundo(cc => {
            for (let i = 0; i < 7; i++) { const an = i / 7 * TAU + t * 1.3; ficha(cc, 420 + Math.cos(an) * 420, 880 + Math.sin(an) * 160, Math.sin(an) * 0.3, i, 0.9); }
            arquivo(cc, 820, 1000, [0, 1, 2, 3].map(k => k === gaveta ? win(fase, 0.5, 0.65, 0.85, 1) : 0), t);
            cerebroP(cc, 450, 1080, 0.8, t, { olhar: [mao[0] / 300, mao[1] / 300], piscar: piscada(t, 2.6), boca: 'bico', sob: [-6, -6], maoE: [-200, 160 + Math.sin(t * 6) * 10], maoD: mao, segura: fase < 0.75 ? [null, (c, x, y) => ficha(c, x, y - 28, 0.2, gaveta, 0.8)] : null });
          });
          c.restore();
          // divisória e ligação luminosa entre o corpo e a cabeça "de dentro"
          rrect(c, xd - 8, -10, 16, H + 20, 0, '#ffffff', { lw: 5 });
          const cam1z = 2.2, hxS = (W / 2 - W * s / 2) + (HEAD[0] + 40 - 540) * cam1z, hyS = H / 2 + (HEAD[1] - 60 - 1420) * cam1z;
          const bxS = W / 2 + W * (1 - s) / 2 + (450 - 590) * 0.8, byS = H / 2 + (1080 - 1060) * 0.8 - 150;
          const lig = sstep(27.0, 27.8, t);
          if (lig > 0) {
            const P = u => bez([hxS, hyS], [W * 0.5, Math.min(hyS, byS) - 380], [bxS, byS], u);
            const pts = []; for (let k = 0; k <= 30 * lig; k++) pts.push(P(k / 30));
            c.save(); c.globalCompositeOperation = 'lighter'; line(c, pts, 'rgba(122,240,255,0.35)', 24); line(c, pts, '#7af0ff', 8); c.restore();
            for (let k = 0; k < 4; k++) { const [x, y] = P(((t * 0.7 + k / 4) % 1) * lig); glow(c, x, y, 50, '#fff2a0', 1); }
          }
          return;
        }
        // outras pessoas, outros pequenos gestos
        for (let k = 0; k < 3; k++) {
          const u = easeOut(clamp((t - 33.0 - k * 0.35) / 0.45)); if (u <= 0) continue;
          const dir = k % 2 ? 1 : -1, ox = (1 - u) * W * dir;
          c.save(); c.beginPath(); c.rect(0, k * 640, W, 640); c.clip(); c.translate(ox, k * 640 + 320 - 960);
          st.setCam(540, 1492, 2.0);
          st.mundo(cc => {
            vgrad2(cc, ['#ffd1a8', '#c8e6a0', '#c8c0f0'][k]);
            const Q = P[k]; Q.reset(); Q.x = CX; Q.y = CY; Q.semPernas = true; respira(Q, t, k); Q.piscar = piscada(t, 3 + k * 0.4, k);
            Q.ik(-1, -72, -150); Q.ik(1, 72, -150);
            if (k === 0) { const d = ((t * 1.6) % 1); Q.frente = [false, true]; Q.ik(1, lerp(26, 12, d), lerp(-268, -214, d)); Q.olhar = [0.6, -0.8]; Q.sob = [-4, -14]; Q.boca = 'reta'; Q.headTilt = 0.05; }
            if (k === 1) { Q.maoD = batuca(Q.d.pele); Q.ik(1, 96, -150); Q.frente = [true, false]; Q.ik(-1, -50, -262); Q.olhar = [Math.sin(t * 1.2) * 0.9, 0.2]; Q.headTilt = -0.12; Q.palp = 0.3; Q.boca = 'lado'; }
            if (k === 2) { Q.frente = [false, true]; Q.ik(1, 8 + Math.cos(t * 9) * 9, -230 + Math.sin(t * 9) * 5); Q.olhar = [-0.4, -0.7]; Q.aperta = 0.5; Q.sob = [-10, 0]; Q.boca = 'bico'; }
            Q.draw(cc, t);
            mesa(cc, t, { x0: 160, x1: 920 });
            if (k === 1) { rrect(cc, 260, ESC.mesa - 90, 180, 60, 8, '#3a3a44', { lw: 5 }); }
            if (k === 2) { rrect(cc, 680, ESC.mesa - 70, 110, 40, 6, '#f4c430', { lw: 4 }); }
            Q.drawArms(cc, t);
          });
          c.restore();
        }
        for (let k = 1; k < 3; k++) rrect(c, -10, k * 640 - 7, W + 20, 14, 0, '#ffffff', { lw: 5 });
      },
    };
  },
};
function vgrad2(c, cor) { c.fillStyle = cor; c.fillRect(-600, 600, 2300, 1500); for (let x = -600; x < 1700; x += 120) { c.fillStyle = 'rgba(255,255,255,0.12)'; c.fillRect(x, 600, 50, 1500); } }

// ================= 5. A PIADA FINAL (37.0 – 60) =================
export const c5 = {
  inicio: 37.0, fim: 60,
  criar(st) {
    const C = caio();
    return {
      desenhar(t) {
        const c = st.c;
        if (t >= 56.6) { telaFinal(c, t, 56.6); return; }
        caioBase(C, t);
        let nQ = 0, aQ = 1;
        const concentra = t < 42.6;
        if (concentra) {
          coca(C, t, 1, 14 + (t - 37) * 1.5, 1); C.aperta = 0.35; C.sobA = [0.3, -0.3]; C.sob = [4, 4]; C.olhar = [-0.5, 0.85]; C.boca = t > 40 ? 'bico' : 'lado'; C.headTilt = Math.sin(t * 2) * 0.03;
          nQ = Math.floor(lerp(2, 16, (t - 37) / 5.6));
        } else {
          // para, abaixa a mão devagar
          const k = easeInOut(clamp((t - 42.6) / 0.9));
          const a = ALVO_COCA(42.6, 20); const p = bez(a, [150, -250], [72, -150], k);
          C.ik(1, p[0], p[1]); C.frente = [false, k < 0.6]; C.maoD = k < 0.2 ? dedos(C.d.pele, 0.9, 0) : null;
          C.olhar = [0, 0.3]; C.sob = [-4, -4];
          nQ = 16;
          // livro, caderno, a própria mão
          if (t > 43.5) C.olhar = [-0.9, 0.9];
          if (t > 44.1) C.olhar = [0.7, 0.9];
          if (t > 44.7) { const m = easeOut(clamp((t - 44.7) / 0.35)); C.ik(1, lerp(72, 96, m), lerp(-150, -262, m)); C.frente = [false, true]; C.maoD = dedos(C.d.pele, -0.6, 0); C.olhar = [0.9, 0.4]; }
          // congelado por dois segundos: esqueceu a pergunta
          if (t > 45.4) { C.piscar = 0; C.squash = 0; C.olhar = [0.9, 0.4]; C.pupila = 0.5; C.olhoTam = 1.15; C.sob = [-16, -4]; C.boca = 'o'; aQ = 1 - sstep(45.4, 47.2, t); }
          // olha para o espectador: sorriso sem graça
          if (t > 47.4) { const m = easeInOut(clamp((t - 47.4) / 0.5)); C.olhar = [0, 0]; C.pupila = 1; C.olhoTam = 1; C.boca = 'torto'; C.exp = 'preocupado'; C.blush = 0.6; C.suor = sstep(47.6, 48, t); C.sob = [-4, -10]; C.ik(1, lerp(96, 72, m), lerp(-262, -150, m)); C.frente = [false, false]; C.maoD = null; nQ = 0; }
          if (t > 51.7 && t < 53.6) { C.olhar = [0.1, -1]; C.rostoY = -6; }
          // volta a coçar
          if (t > 53.6) { const k2 = clamp((t - 53.6) / 1.2); coca(C, t, k2, 13, 1); C.olhar = [-0.5, 0.85]; C.boca = 'lado'; C.exp = 'normal'; C.suor = 1 - sstep(54, 55, t); C.blush = 0.3; C.sobA = [0.25, -0.25]; }
        }
        // câmera
        let cam;
        if (t < 42.6) { const an = (t - 37) * 1.1; cam = [HEAD[0] + 20 + Math.cos(an) * 45, HEAD[1] + 60 + Math.sin(an) * 30, lerp(1.9, 2.45, (t - 37) / 5.6), Math.sin(an) * 0.045]; }
        else if (t < 47.4) cam = [lerp(560, 575, clamp((t - 42.6) / 4.8)), 1470, lerp(2.0, 2.25, clamp((t - 42.6) / 4.8)), 0];
        else if (t < 49.6) cam = [545, lerp(1470, 1440, easeInOut(clamp((t - 47.4) / 0.6))), lerp(2.25, 2.75, easeInOut(clamp((t - 47.4) / 0.6))), 0];
        else { const u = easeInOut(clamp((t - 49.6) / 0.7)); cam = [545, lerp(1440, 1340, u), lerp(2.75, 1.85, u) + (t > 53.6 ? (t - 53.6) * 0.08 : 0), 0]; }
        if (t > 37 && t < 37.5) cam[2] *= lerp(1.12, 1, (t - 37) / 0.5);
        st.setCam(cam[0], cam[1], cam[2], cam[3]);
        cenaMesa(st, t, C, { lapisMesa: true, depois: cc => {
          interrogacoes(cc, t, nQ, aQ, HEAD[0], HEAD[1], 1.0);
          // o cérebro descansando numa nuvem, com café
          const ap = easeBack(clamp((t - 49.8) / 0.4));
          if (ap > 0) {
            const bx = HEAD[0] + 10, by = HEAD[1] - 300;
            cc.save(); cc.translate(bx, by); cc.scale(ap, ap);
            for (const [dx, dy, r] of [[-40, 210, 12], [-20, 180, 18]]) circle(cc, dx, dy, r, '#ffffff', { lw: 4 });
            cloud(cc, 0, 90, 190, '#ffffff', { stroke: '#2b1f2a', seed: 4 });
            cc.scale(0.36, 0.36); poltrona(cc, 0, 120);
            const gole = t < 51.4 || t > 53.8, dg = gole ? Math.max(0, Math.sin((t - 49.8) * 2.2)) : 0;
            const ombros = win(t, 52.0, 52.25, 53.0, 53.3);
            const o = { olhar: t > 51.6 && t < 53.8 ? [0, 1] : [0.6, -0.3], piscar: piscada(t, 2.5), boca: ombros > 0.3 ? 'reta' : 'sorriso', sob: [-14 * ombros, -14 * ombros],
              maoE: ombros > 0 ? [lerp(-200, -300, ombros), lerp(160, -40, ombros)] : [-200, 160], maoD: ombros > 0 ? [lerp(160, 300, ombros), lerp(70, -40, ombros)] : [lerp(190, 60, dg), lerp(140, 70, dg)],
              segura: ombros > 0.2 ? null : [null, (c, x, y) => xicaraC(c, x, y)] };
            cerebroP(cc, 0, -60 + Math.sin(t * 2) * 6, 1, t, o);
            if (gole && dg > 0.5) for (let i = 0; i < 3; i++) { const u = (t * 0.8 + i / 3) % 1; line(cc, [[60 + i * 14, -20 - u * 80], [66 + i * 14 + Math.sin(t * 4 + i) * 8, -50 - u * 80]], '#ffffff', 6, 1 - u); }
            cc.restore();
          }
        } });
      },
    };
  },
};
