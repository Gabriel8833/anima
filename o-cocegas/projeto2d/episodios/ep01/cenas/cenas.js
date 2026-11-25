// "Por que você não consegue fazer cócegas em si mesmo?" — cenas 2D
import { TAU, lerp, clamp, sstep, win, kf, easeInOut, easeIn, easeOut, easeBack, impulse } from '../../../motor/base.js';
import { glow, sparkle, speedLines, circle, line, rrect, ellipse, shape, cloud, poly, limb } from '../../../motor/desenho.js';
import { teo, bia, dedos } from '../../../personagens/elenco.js';
import { sala, mesaFrente, escritorio, cadeira, mesa, botao, monitor, corpoTela, maoTela, medidor, prancheta, rotulo, detetive, xicaraC } from '../../../cenarios/lugares.js';

const W = 1080, H = 1920;
const tempos = await (await fetch(new URL('../tempos.json', import.meta.url))).json();
const S = id => { const f = tempos.narracao.find(n => n.id === id); return [f.inicio, f.fim]; };
const piscada = (t, f = 3.2, o = 0) => (((t + o) % f) < 0.12 ? 1 : 0);
const respira = (P, t, o = 0) => { P.squash = Math.sin(t * 2.3 + o) * 0.012; };
const ini = id => S(id)[0] - 0.25;
const B = [0, ini('2a'), ini('3a'), ini('4a'), ini('5a'), ini('6a'), tempos.duracao];
const TX = 760, TY = 1540;     // Téo sentado no sofá (quadril no assento)

function teoSofa(T, t) { T.reset(); T.semPernas = true; T.x = TX; T.y = TY; T.piscar = piscada(t); respira(T, t); T.ik(-1, -76, -150); T.ik(1, 76, -150); return T; }
function pernas(c, T, t, chute = 0) { for (const s of [-1, 1]) { const k = chute ? Math.sin(t * 18 + s) * 20 * chute : 0; limb(c, [[T.x + s * 40 + k * 0.5, 1500], [T.x + s * 42 + k, 1700]], 30, T.d.perna); ellipse(c, T.x + s * 50 + k, 1712, 32, 17, T.d.sapato, { lw: 5 }); } for (const s of [-1, 1]) { const k = chute ? Math.sin(t * 18 + s) * 20 * chute : 0; c.save(); c.translate(T.x + s * 38 + k * 0.5, 1460); ellipse(c, 0, 0, 44, 60, T.d.perna, { lw: 6 }); ellipse(c, -6 * s, -14, 14, 20, 'rgba(255,255,255,0.08)', { stroke: null }); c.restore(); } }
// cócegas na própria axila (uma mão) ou nas laterais (duas mãos)
function cocegaSi(T, t, modo, k = 1) {
  if (modo === 1) { T.ik(-1, lerp(-76, -128, k), lerp(-150, -330, k)); T.frente = [false, true]; T.ik(1, lerp(76, -36, k) + Math.sin(t * 18) * 6 * k, lerp(-150, -205, k)); T.maoD = k > 0.8 ? dedos(T.d.pele, 2.2, 1, 26) : null; }
  if (modo === 2) { T.frente = [true, true]; T.ik(-1, -58 + Math.sin(t * 18) * 5, -190); T.ik(1, 58 - Math.sin(t * 18) * 5, -190); T.maoE = dedos(T.d.pele, 0.6, 1, 26); T.maoD = dedos(T.d.pele, 0.6, 1, 26); }
}
// mergulho na cabeça -> mundo de dentro (círculo que se abre)
function mergulho(st, t, t0, dur, dentro) {
  const u = clamp((t - t0) / dur); if (u <= 0) return;
  const c = st.c, r = easeIn(u) * 1400;
  c.save(); c.beginPath(); c.arc(W / 2, H / 2 - 200, r, 0, TAU); c.clip(); dentro(); c.restore();
  c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha = 0.6 * (1 - u); c.strokeStyle = '#ffd0f0'; c.lineWidth = 30; c.beginPath(); c.arc(W / 2, H / 2 - 200, r, 0, TAU); c.stroke(); c.restore();
}
// o cérebro no escritório
const cer = (t, ex = {}) => ({ olhar: [0.6, -0.2], piscar: piscada(t, 2.9), boca: 'sorriso', tam: 0.95, pernas: { sentado: true, balanca: 0.4 }, maoE: [-200, 150], maoD: [200, 150], ...ex });
function cenaEscritorio(st, t, o, tela, { botaoK = 0, luz = 0, extra = null } = {}) {
  escritorio(st, t);
  st.mundo(c => {
    monitor(c, 720, 880, 560, 420, tela);
    cadeira(c, 330, 1440, Math.sin(t * 0.8) * 0.02);
    detetive(c, 330, 1130, 0.64, t, o);
    mesa(c, 520, 1440, 780);
    botao(c, 720, 1430, botaoK, luz);
    extra?.(c);
  });
}

// ================= 1. A PERGUNTA =================
export const c1 = {
  inicio: B[0], fim: B[1],
  criar(st) {
    const T = teo();
    return {
      desenhar(t) {
        const [a0, a1] = S('1a'), [b0, b1] = S('1b');
        const z = easeInOut(clamp((t - 4.8) / 1.6));
        st.setCam(lerp(lerp(620, 740, clamp(t / 4)), 760, z), lerp(1360, 1250, z), lerp(lerp(1.15, 1.45, clamp(t / 4)), 2.6, z));
        sala(st, t);
        st.mundo(c => {
          teoSofa(T, t);
          T.olhar = [-0.9, 0.7]; T.headTilt = -0.12; T.rostoX = -6; T.boca = 'reta'; T.palp = 0.35;
          const k = easeInOut(clamp((t - 0.8) / 1.4));
          if (t < b0 - 0.1) cocegaSi(T, t, 1, k);
          else { cocegaSi(T, t, 2); T.olhar = [0, 0.8]; T.headTilt = 0; T.rostoX = 0; }
          if (t > 5.4) { T.olhar = [0, 0]; T.palp = 0.2; T.sob = [-14, 0]; T.sobA = [0.1, -0.2]; T.boca = 'lado'; T.headTilt = 0.08; }
          T.draw(c, t);
          pernas(c, T, t); T.drawArms(c, t);
          if (t > 2.4 && t < 6.2) { const a = win(t, 2.4, 2.7, 5.8, 6.2); for (let i = 0; i < 3; i++) { const [hx, hy] = T.cabeca(); c.save(); c.globalAlpha = a * (0.5 + 0.5 * Math.sin(t * 3 + i)); c.font = '900 60px Inter, sans-serif'; c.fillStyle = '#2b1f2a'; c.fillText('.', hx + 90 + i * 26, hy - 70); c.restore(); } }
        });
        mesaFrente(st, t, 250);
        mergulho(st, t, B[1] - 0.55, 0.55, () => { st.setCam(560, 1150, 1.15); escritorio(st, t); });
      },
    };
  },
};

// ================= 2. O CÉREBRO ESTRAGA-PRAZERES =================
export const c2 = {
  inicio: B[1], fim: B[2],
  criar(st) {
    return {
      desenhar(t) {
        const [a0, a1] = S('2a'), [b0, b1] = S('2b');
        const aperta = win(t, b1 - 1.6, b1 - 1.45, b1 - 1.2, b1 - 1.0), prev = sstep(b1 - 1.4, b1 - 1.1, t);
        const u = easeInOut(clamp((t - B[1]) / 2));
        st.setCam(lerp(560, 540, u), lerp(1150, 1110, u), lerp(1.15, 1.42, u) + (t > b0 + 1 ? 0.12 * sstep(b0 + 1, b1, t) : 0));
        const o = cer(t, { maoE: [-170, 60], maoD: [210, 150], segura: [(c, x, y) => prancheta(c, x, y), null], olhar: [1, -0.4], boca: 'reta' });
        if (t > a0 + 1.2) { o.sob = [0, -26]; o.boca = 'bico'; }
        if (t > b1 - 1.7) { o.maoD = [lerp(210, 520, easeOut(clamp((t - (b1 - 1.7)) / 0.25))), lerp(150, 520, easeOut(clamp((t - (b1 - 1.7)) / 0.25)))]; o.boca = 'sorriso'; o.olhar = [0.8, 0.6]; }
        cenaEscritorio(st, t, o, c => {
          corpoTela(c, 0.9);
          const ph = ((t - B[1]) * 0.45) % 1;
          maoTela(c, lerp(220, -80, easeInOut(ph)), -120 + Math.sin(ph * Math.PI) * -30, '#ffd36a', false, ph > 0.8 ? 1 : 0, t);
          if (prev > 0) { c.save(); c.globalAlpha = prev; maoTela(c, -80, -120, '#7af0ff', true, 0, t); circle(c, -110, -120, 70 + Math.sin(t * 6) * 6, null, { stroke: '#7af0ff', lw: 5 }); rotulo(c, 'PREVISÃO', 0, 170, 54, '#7af0ff'); c.restore(); }
        }, { botaoK: aperta, luz: prev * 0.6 });
      },
    };
  },
};

// ================= 3. QUANDO OUTRA PESSOA FAZ CÓCEGAS =================
export const c3 = {
  inicio: B[2], fim: B[3],
  criar(st) {
    const T = teo(), Bi = bia();
    return {
      desenhar(t) {
        const c = st.c;
        const [a0, a1] = S('3a'), [b0, b1] = S('3b');
        const toque = a1 - 1.2, foge = clamp((t - b0) / 2.4);
        let cam = [lerp(820, 900, sstep(B[2], toque, t)), 1360, 1.45];
        if (t > toque) cam = [lerp(860, 640, foge), lerp(1340, 1380, foge), 1.6 + Math.sin(t * 3) * 0.05];
        st.setCam(cam[0], cam[1], cam[2], Math.sin(t * 4) * 0.02 * (t > toque ? 1 : 0), t > toque && t < toque + 0.4 ? [Math.sin(t * 60) * 0.6, 0] : [0, 0]);
        sala(st, t);
        st.mundo(cc => {
          teoSofa(T, t); T.olhar = [-0.3, 0.5]; T.boca = 'reta'; T.palp = 0.3;
          // a amiga chega na ponta dos pés
          const vem = easeInOut(clamp((t - B[2] - 0.2) / 2.6));
          Bi.reset(); Bi.x = lerp(1260, 960, vem); Bi.y = 1760; Bi.walk = vem > 0 && vem < 1 ? t * 6 : null; Bi.jump = vem < 1 ? Math.abs(Math.sin(t * 6)) * 14 : 0; Bi.piscar = piscada(t, 3, 1);
          Bi.olhar = [-1, 0.3]; Bi.boca = 'lado'; Bi.palp = 0.35; Bi.sobA = [-0.2, 0.2];
          Bi.ik(-1, -110, -250 + Math.sin(t * 12) * 10); Bi.ik(1, 90, -260); Bi.maoE = dedos(Bi.d.pele, 1.8, 1, 24);
          if (t > toque) { Bi.ik(-1, -170, -170 + Math.sin(t * 20) * 14); Bi.exp = 'feliz'; Bi.boca = 'aberta'; Bi.x = lerp(960, 780, foge); Bi.lean = -0.12; }
          if (t > toque) {
            // salto, risada, tenta fugir
            T.exp = 'feliz'; T.boca = Math.floor(t * 10) % 2 ? 'grito' : 'aberta'; T.jump = Math.abs(Math.sin((t - toque) * 9)) * 70 + impulse(t, toque, 90, 0.35); T.palp = 0;
            T.x = lerp(TX, 520, foge); T.lean = -0.15 * Math.sin(t * 9) - 0.1 * foge; T.ik(-1, -120, -300 + Math.sin(t * 14) * 40); T.ik(1, 40, -200); T.frente = [false, true]; T.blush = 0.8; T.tremor = 0.6;
          }
          T.draw(cc, t);
          pernas(cc, T, t, t > toque ? 1 : 0); T.drawArms(cc, t);
          Bi.draw(cc, t);
          if (t > toque) { const [hx, hy] = T.cabeca(); for (let i = 0; i < 2; i++) { const u = ((t * 1.6) + i * 0.5) % 1; ellipse(cc, hx + (i ? 50 : -50) + (i ? 1 : -1) * u * 40, hy + 10 + u * 60, 8, 12, '#8fd8ff', { lw: 3, alpha: 1 - u }); } cc.save(); cc.font = '900 60px Inter, sans-serif'; cc.fillStyle = '#e2473a'; cc.textAlign = 'center'; for (let i = 0; i < 3; i++) cc.fillText('HA', hx - 140 + i * 140, hy - 170 - Math.abs(Math.sin(t * 8 + i)) * 26); cc.restore(); }
        });
        mesaFrente(st, t, 250);
        // janelinha: o cérebro reage com tudo
        const pip = sstep(b0, b0 + 0.3, t);
        if (pip > 0) {
          const k = easeBack(pip); c.save(); c.translate(820, 360); c.scale(k, k);
          circle(c, 0, 0, 200, '#c87ae0', { lw: 10 }); c.beginPath(); c.arc(0, 0, 195, 0, TAU); c.clip();
          glow(c, 0, 0, 220, Math.floor(t * 6) % 2 ? '#ff3a3a' : '#ffd23a', 0.7);
          detetive(c, 0, 10, 0.42, t, { olhar: [0, 0], tam: 1.25, pupila: 0.5, boca: 'grito', maoE: [-280, -200 + Math.sin(t * 20) * 40], maoD: [280, -200 - Math.sin(t * 20) * 40], tremor: 1, pernas: { walk: t * 20 } });
          c.restore(); circle(c, 820, 360, 200 * k, null, { stroke: '#2b1f2a', lw: 8 });
        }
      },
    };
  },
};

// ================= 4. COMO O CÉREBRO FUNCIONA =================
export const c4 = {
  inicio: B[3], fim: B[4],
  criar(st) {
    return {
      desenhar(t) {
        const c = st.c;
        const [a0, a1] = S('4a'), [b0, b1] = S('4b'), [c0, c1] = S('4c');
        let cam = [560, 1150, 1.05];
        if (t > b0 - 0.2) cam = [620, 1000, lerp(1.25, 1.4, sstep(b0, c1, t))];
        st.setCam(...cam);
        const cmd = clamp((t - a0 - 1.0) / 1.6), copia = clamp((t - a0 - 3.0) / 1.4);
        const o = cer(t, { olhar: t < b0 ? [1, -0.3] : [0.7, -0.7], boca: 'sorriso', maoE: [-200, 150], maoD: t > b0 ? [300, -180] : [200, 150] });
        cenaEscritorio(st, t, o, cc => {
          if (t < b0) { corpoTela(cc, 0.9); maoTela(cc, 220, -120, '#ffd36a', false, 0, t); rotulo(cc, 'MÚSCULOS', 0, 170, 50, '#ffd36a'); return; }
          // previsão: onde e quando
          corpoTela(cc, 0.9);
          const p = clamp((t - b0) / 2.6), m = clamp((t - c0) / 2.2);
          maoTela(cc, lerp(220, -80, easeInOut(p)), -120, '#7af0ff', true, 0, t);
          circle(cc, -110, -120, 64 + Math.sin(t * 6) * 5, null, { stroke: '#7af0ff', lw: 5 });
          circle(cc, 190, -150, 36, null, { stroke: '#7af0ff', lw: 4 }); line(cc, [[190, -150], [190, -176]], '#7af0ff', 4); line(cc, [[190, -150], [190 + Math.cos(t * 3) * 22, -150 + Math.sin(t * 3) * 22]], '#7af0ff', 4);
          rotulo(cc, 'PREVISTO', -150, 170, 44, '#7af0ff');
          if (t > c0) { maoTela(cc, lerp(220, -80, easeInOut(m)), -120, '#ffd36a', false, m > 0.95 ? 1 : 0, t); rotulo(cc, 'REAL', 170, 170, 44, '#ffd36a'); }
          if (m >= 1) { const k = easeBack(clamp((t - c0 - 2.2) / 0.3)); cc.save(); cc.translate(150, -10); cc.scale(k, k); line(cc, [[-40, 0], [-10, 30], [50, -40]], '#6af07a', 16); cc.restore(); }
        }, { extra: cc => {
          // sinais: comando (amarelo) para o corpo e cópia (azul) para a previsão
          const A = [480, 1080], Bm = [1080, 1500], Cp = [600, 1090];
          if (cmd > 0) { const pts = []; for (let k = 0; k <= 20 * cmd; k++) { const u = k / 20; pts.push([lerp(A[0], Bm[0], u), lerp(A[1], Bm[1], u) - Math.sin(u * Math.PI) * 160]); } cc.save(); cc.globalCompositeOperation = 'lighter'; line(cc, pts, 'rgba(255,211,106,0.4)', 26); line(cc, pts, '#ffd36a', 9); cc.restore(); const q = pts[pts.length - 1]; glow(cc, q[0], q[1], 60, '#ffd36a', 1); if (t < b0) rotulo(cc, 'COMANDO', 860, 1270, 46, '#ffd36a'); }
          if (copia > 0) { const pts = []; for (let k = 0; k <= 20 * copia; k++) { const u = k / 20; pts.push([lerp(A[0] + 20, Cp[0] + 120, u), lerp(A[1], 1090 - 50, u) - Math.sin(u * Math.PI) * 120]); } cc.save(); cc.globalCompositeOperation = 'lighter'; line(cc, pts, 'rgba(122,240,255,0.4)', 26); line(cc, pts, '#7af0ff', 9); cc.restore(); if (t < b0) rotulo(cc, 'CÓPIA', 560, 960, 46, '#7af0ff'); }
          // surpresa diminuindo
          if (t > c0) { const v = lerp(0.95, 0.15, easeInOut(clamp((t - c0 - 2.0) / 1.4))); medidor(cc, 720, 1270, v, 'SURPRESA', v > 0.5 ? '#ff6a5a' : '#6af07a'); }
        } });
      },
    };
  },
};

// ================= 5. A EXPLICAÇÃO ENGRAÇADA =================
export const c5 = {
  inicio: B[4], fim: B[5],
  criar(st) {
    const T = teo();
    return {
      desenhar(t) {
        const [a0, a1] = S('5a'), [b0, b1] = S('5b');
        if (t < a0 + 2.3) {
          st.setCam(760, 1300, 1.8);
          sala(st, t);
          st.mundo(c => { teoSofa(T, t); cocegaSi(T, t, 1, easeInOut(clamp((t - B[4]) / 0.7))); T.olhar = [-0.9, 0.7]; T.headTilt = -0.12; T.boca = 'reta'; T.palp = 0.45; T.sobA = [0.2, -0.2]; T.draw(c, t); pernas(c, T, t); T.drawArms(c, t); });
          mesaFrente(st, t, 250);
          return;
        }
        st.setCam(600, 1130, 1.35);
        const ombro = win(t, b0 + 2.3, b0 + 2.6, b1 - 0.2, b1 + 0.2);
        const gole = Math.max(0, Math.sin((t - a0) * 2.2));
        const o = cer(t, { olhar: [0.9, -0.3], boca: 'reta', piscar: piscada(t, 2.4), sob: [8, 8] });
        if (t < a1) { o.maoE = [60, 130]; o.maoD = [-60, 140]; }        // braços cruzados
        else { o.maoE = [-200, 150]; o.maoD = [lerp(200, 70, gole), lerp(150, 80, gole)]; o.segura = [null, (c, x, y) => xicaraC(c, x, y)]; }
        if (ombro > 0) { o.maoE = [lerp(-200, -310, ombro), lerp(150, -40, ombro)]; o.maoD = [lerp(200, 310, ombro), lerp(150, -40, ombro)]; o.sob = [-18, -18]; o.boca = 'reta'; }
        cenaEscritorio(st, t, o, cc => {
          corpoTela(cc, 0.9);
          maoTela(cc, -80, -120, '#7af0ff', true, 0, t); maoTela(cc, -80 + Math.sin(t * 20) * 3, -120, '#ffd36a', false, 1, t);
          if (t > b0) { const v = 1; rrect(cc, -250, 110, 500, 150, 12, 'rgba(0,0,0,0.3)', { stroke: null }); }
          cc.save(); cc.translate(170, -10); line(cc, [[-40, 0], [-10, 30], [50, -40]], '#6af07a', 16); cc.restore();
        }, { extra: cc => { if (t > b0) { medidor(cc, 720, 1270, 0.55 + Math.sin(t * 6) * 0.03, 'TOQUE', '#ffd36a'); medidor(cc, 720, 1390, 0.06, 'SURPRESA', '#6af07a'); } } });
      },
    };
  },
};

// ================= 6. FINAL =================
export const c6 = {
  inicio: B[5], fim: B[6],
  criar(st) {
    const T = teo();
    return {
      desenhar(t) {
        const c = st.c;
        const [a0, a1] = S('6a'), [b0, b1] = S('6b');
        const u = easeInOut(clamp((t - B[5]) / (B[6] - B[5] - 1)));
        st.setCam(760, lerp(1300, 1250, u), lerp(1.7, 2.9, u));
        sala(st, t);
        st.mundo(cc => {
          teoSofa(T, t);
          T.olhar = [0, 0]; T.exp = 'raiva'; T.boca = 'reta'; T.sob = [4, 4]; T.frente = [false, false];
          T.ik(-1, -20, -180); T.ik(1, 20, -190);   // braços cruzados
          if (t > b0) { T.boca = 'bico'; T.blush = 0.8; T.exp = 'normal'; T.sob = [-16, 4]; T.sobA = [0.15, -0.25]; T.aperta = 0.4; T.olhar = [0.2, 0]; T.headTilt = Math.sin(t * 3) * 0.04; }
          if (t > b1 + 0.6) { T.boca = 'torto'; T.olhar = [Math.sin(t * 9) * 0.4, -0.4]; }
          T.draw(cc, t);
          pernas(cc, T, t); T.drawArms(cc, t);
        });
        // janelinha: o cérebro rindo e tomando café
        const pip = sstep(a0 + 0.6, a0 + 0.9, t);
        if (pip > 0) {
          const k = easeBack(pip); c.save(); c.translate(810, 420); c.scale(k, k);
          rrect(c, -230, -200, 460, 400, 30, '#c87ae0', { lw: 10 }); c.beginPath(); c.roundRect(-222, -192, 444, 384, 24); c.clip();
          vgrad(c, -230, -200, 460, 400, [[0, '#ff9ec4'], [1, '#7a4ac8']]);
          const ri = Math.abs(Math.sin(t * 9));
          detetive(c, -20, 0, 0.4, t, { olhar: [0, 0], boca: t > b0 ? 'grito' : 'sorriso', piscar: t > b0 ? 1 : piscada(t, 2.5), squash: 0, maoE: [-200, 150 - ri * 30], maoD: [140, 40 + ri * 10], segura: [null, (cc, x, y) => xicaraC(cc, x, y)], pernas: { sentado: true, balanca: 1 }, tremor: t > b0 ? 0.5 : 0 });
          c.restore();
        }
        st.overlay('#000', sstep(B[6] - 0.8, B[6], t));
      },
    };
  },
};
function vgrad(c, x, y, w, h, stops) { const g = c.createLinearGradient(0, y, 0, y + h); stops.forEach(([p, col]) => g.addColorStop(p, col)); c.fillStyle = g; c.fillRect(x, y, w, h); }
