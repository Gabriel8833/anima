// "Por que você entra em um cômodo e esquece o que foi fazer?" — cenas 2D
import { TAU, lerp, clamp, sstep, win, kf, easeInOut, easeIn, easeOut, easeBack, impulse } from '../../../motor/base.js';
import { glow, sparkle, speedLines, circle, line, rrect, ellipse, shape, cloud, poly, limb } from '../../../motor/desenho.js';
import { teo, dedos } from '../../../personagens/elenco.js';
import { escritorio, cadeira, mesa, monitor, prancheta, rotulo, detetive, cerebroP } from '../../../cenarios/lugares.js';
import { CASA, casa, porta, carregador, celularBateria, cracha, portaSaida, telaAzul } from '../../../cenarios/casa.js';

const W = 1080, H = 1920;
const tempos = await (await fetch(new URL('../tempos.json', import.meta.url))).json();
const S = id => { const f = tempos.narracao.find(n => n.id === id); return [f.inicio, f.fim]; };
const piscada = (t, f = 3.2, o = 0) => (((t + o) % f) < 0.12 ? 1 : 0);
const respira = (P, t, o = 0) => { P.squash = Math.sin(t * 2.4 + o) * 0.012; };
const fala = (t, [a, b]) => (t > a && t < b ? ['grito', 'aberta', 'meia', 'aberta', 'o'][Math.floor(t * 11) % 5] : null);
const ini = id => S(id)[0] - 0.25;
const B = [0, ini('2a'), ini('3a'), ini('4a'), ini('5a'), ini('6a'), ini('7a'), tempos.duracao];
const CH = CASA.chao, KX = 1480;   // posição na cozinha

function teoPe(T, t, x) { T.reset(); T.x = x; T.y = CH; T.piscar = piscada(t); respira(T, t); T.ik(-1, -70, -140); T.ik(1, 70, -140); return T; }
function anda(T, t, vel = 14, br = 1) { T.walk = t * vel; T.ik(-1, -60 + Math.sin(t * vel) * 40 * br, -150); T.ik(1, 60 - Math.sin(t * vel) * 40 * br, -150); }
const cer = (t, ex = {}) => ({ olhar: [0.5, 0], piscar: piscada(t, 2.8), boca: 'sorriso', tam: 0.95, pernas: { sentado: true, balanca: 0.3 }, maoE: [-200, 150], maoD: [200, 150], ...ex });
function balaoPens(c, x, y, r, a, hx, hy, conteudo) {
  if (a <= 0.01) return; const k = easeBack(clamp(a));
  c.save(); c.globalAlpha = clamp(a * 1.5);
  circle(c, lerp(hx, x, 0.25), lerp(hy, y, 0.25) + 40, 14 * k, '#ffffff', { lw: 4 }); circle(c, lerp(hx, x, 0.5), lerp(hy, y, 0.5) + 50, 22 * k, '#ffffff', { lw: 4 });
  c.translate(x, y); c.scale(k, k); cloud(c, 0, 40, r, '#ffffff', { stroke: '#2b1f2a', seed: 7 });
  c.save(); c.beginPath(); c.ellipse(0, -10, r * 0.95, r * 0.6, 0, 0, TAU); c.clip(); conteudo(c); c.restore();
  c.restore();
}

// ================= 1. O GANCHO =================
export const c1 = {
  inicio: B[0], fim: B[1],
  criar(st) {
    const T = teo();
    return {
      desenhar(t) {
        const abre = easeOut(clamp((t - 1.85) / 0.4)), atravessa = clamp((t - 2.25) / 0.7), freia = t > 2.95;
        let x = t < 2.2 ? lerp(560, 1120, easeInOut(clamp((t - 0.3) / 1.9))) : lerp(1120, KX, easeOut(atravessa));
        const z = t < 3.0 ? 2.5 : lerp(2.5, 3.3, easeInOut(clamp((t - 3.0) / 2.2)));
        st.setCam(x + (freia ? 0 : 60), 1460, z, 0, freia && t < 3.2 ? [Math.sin(t * 60) * 0.4, 0] : [0, 0]);
        casa(st, t, { abre });
        st.mundo(c => {
          teoPe(T, t, x);
          if (!freia) { anda(T, t, 16); T.lean = 0.12; T.exp = 'normal'; T.sobA = [0.3, -0.3]; T.sob = [4, 4]; T.boca = 'sorriso'; T.olhar = [1, 0]; if (t > 1.8 && t < 2.3) T.ik(1, 140, -220); }
          else {
            T.lean = -0.16 * Math.exp(-(t - 2.95) * 6); T.jump = 0;
            T.exp = 'normal'; T.boca = 'reta'; T.olhoTam = 1.05; T.olhar = [0, 0];
            T.piscar = (t > 3.3 && t < 3.42) || (t > 3.6 && t < 3.72) ? 1 : 0;
            if (t > 3.85) T.olhar = [-1, 0]; if (t > 4.25) T.olhar = [1, 0]; if (t > 4.65) { T.olhar = [0, 0]; T.squash = 0; }
            T.sob = [-8, -14];
          }
          T.draw(c, t);
          if (freia && t < 3.4) for (let k = 0; k < 4; k++) line(c, [[x - 80 - k * 30, CH - 10 - k * 6], [x - 200 - k * 50, CH - 10 - k * 6]], '#ffffff', 6, 1 - (t - 2.95) / 0.45);
        });
      },
    };
  },
};

// ================= 2. O CÉREBRO PEDE DEMISSÃO =================
export const c2 = {
  inicio: B[1], fim: B[2],
  criar(st) {
    const T = teo();
    return {
      desenhar(t) {
        const c = st.c;
        const [a0, a1] = S('2a'), [b0, b1] = S('2b');
        if (t < b0 - 0.1) {
          // imaginando a missão épica
          st.setCam(KX, 1300, 1.65);
          casa(st, t, { abre: 1 });
          st.mundo(cc => {
            teoPe(T, t, KX); T.olhar = [0.2, -1]; T.headY = -6; T.rostoY = -6; T.boca = 'sorriso'; T.exp = 'normal'; T.blush = 0.4; T.ik(1, 20, -238); T.frente = [false, true];
            T.draw(cc, t);
            const [hx, hy] = T.cabeca();
            balaoPens(cc, KX + 40, 1000, 260, sstep(a0, a0 + 0.4, t), hx + 40, hy - 80, b => {
              b.fillStyle = '#ffd36a'; b.fillRect(-300, -220, 600, 400);
              b.save(); b.translate(0, -20); b.rotate(t * 0.5); b.globalAlpha = 0.35; b.fillStyle = '#ffffff'; for (let i = 0; i < 10; i++) { b.rotate(TAU / 10); b.beginPath(); b.moveTo(0, 0); b.lineTo(-30, -400); b.lineTo(30, -400); b.closePath(); b.fill(); } b.restore();
              celularBateria(b, -160, -10, 0.8, t);
              const u = ((t - a0) * 0.5) % 1;
              b.save(); b.translate(lerp(-60, 140, u), -40 + Math.sin(t * 6) * 10);
              shape(b, c => { c.moveTo(-20, -40); c.quadraticCurveTo(-110, -20 + Math.sin(t * 12) * 14, -130, 30); c.lineTo(-10, 0); c.closePath(); }, '#e2473a', { lw: 4 });
              circle(b, 0, -40, 26, '#eebc96', { lw: 4 }); rrect(b, -20, -18, 40, 50, 10, '#2f7fe0', { lw: 4 }); line(b, [[18, -10], [50, -40]], '#eebc96', 10); b.restore();
              carregador(b, 190, -30, 0.7); glow(b, 190, -30, 80, '#fff2a0', 0.8);
            });
          });
          return;
        }
        // o cérebro larga tudo e pede demissão
        st.setCam(500, 1130, 1.25);
        const larga = t > b0 + 1.0, sai = clamp((t - b0 - 1.6) / 0.9), bate = sstep(b1 - 0.35, b1 - 0.2, t);
        escritorio(st, t);
        st.mundo(cc => {
          portaSaida(cc, 830, 1580, sai > 0 && bate < 1 ? 1 : 0);
          cadeira(cc, 330, 1440);
          mesa(cc, 460, 1440, 640);
          if (!larga) {
            detetive(cc, 330, 1130, 0.62, t, cer(t, { boca: 'tremendo', aflito: true, suor: 1, olhar: [Math.sin(t * 9), 0.4], maoE: [-200 + Math.sin(t * 20) * 60, 60 + Math.cos(t * 20) * 50], maoD: [200 + Math.cos(t * 18) * 60, 80 + Math.sin(t * 18) * 50], segura: [(c, x, y) => prancheta(c, x, y), null] }));
            glow(cc, 600, 700, 500, '#ff3a3a', 0.25 + 0.25 * Math.sin(t * 14));
          } else {
            const tira = clamp((t - b0 - 1.0) / 0.4);
            const bx = lerp(330, 830, easeIn(sai)), by = sai > 0 ? 1290 : 1130;
            if (bate < 1) detetive(cc, bx, by, 0.62, t, { olhar: [1, 0], piscar: piscada(t), boca: 'reta', bravo: false, sob: [6, 6], tam: 0.9,
              pernas: sai > 0 ? { walk: t * 12 } : { sentado: true }, maoE: tira < 1 ? [lerp(-60, -300, tira), lerp(120, -80, tira)] : [-200, 150], maoD: [200, 150], segura: tira < 1 ? [(c, x, y) => cracha(c, x, y), null] : null });
            if (tira >= 1) { const u = clamp((t - b0 - 1.4) / 0.6); cracha(cc, lerp(140, 60, u), lerp(1080, 1440, u) - Math.sin(u * Math.PI) * 120); }
            prancheta(cc, 520, 1440);
          }
        });
        if (bate > 0 && bate < 1) st.overlay('#ffffff', 0.25);
      },
    };
  },
};

// ================= 3. A SITUAÇÃO CLÁSSICA =================
export const c3 = {
  inicio: B[2], fim: B[3],
  criar(st) {
    const T = teo();
    return {
      desenhar(t) {
        const [a0, a1] = S('3a'), [b0, b1] = S('3b');
        let z = 1.9;
        if (t > b0) z = lerp(2.6, 3.2, sstep(b0, b1, t));
        st.setCam(KX, 1440, z, 0, t > b0 && t < b0 + 0.2 ? [Math.sin(t * 60) * 0.5, 0] : [0, 0]);
        casa(st, t, { abre: 1 });
        st.mundo(cc => {
          teoPe(T, t, KX); T.exp = 'normal'; T.boca = 'reta'; T.palp = 0.3;
          const q = t - B[2];
          if (q > 0.3) { T.frente = [false, false]; T.ik(-1, -66, -128); T.ik(1, 66, -128); T.lean = 0; }      // mãos na cintura
          if (q > 0.6 && q < 2.0) { T.olhar = [Math.sin((q - 0.6) * 4.5) > 0 ? -1 : 1, 0]; T.rostoX = T.olhar[0] * 6; T.headTilt = T.olhar[0] * -0.05; }
          if (q >= 2.0 && q < 2.9) { T.frente = [false, true]; T.ik(1, 56 + Math.cos(t * 16) * 8, -345 + Math.sin(t * 16) * 6); T.maoD = dedos(T.d.pele, 0.9, 1, 24); T.olhar = [0.3, -0.5]; T.boca = 'lado'; }
          if (q >= 2.9 && q < 3.5) { T.olhar = [0, -1]; T.headY = -6; T.rostoY = -8; T.boca = 'o'; }
          if (q >= 3.5 && t < b0) { T.ik(-1, -62, -112); T.ik(1, 62, -112); T.olhar = [0, 0.9]; T.boca = 'meia'; }
          const fV = fala(t, [b0, b1]);
          if (t >= b0) { T.exp = 'preocupado'; T.boca = fV || 'tremendo'; T.olhoTam = 1.12; T.pupila = 0.6; T.suor = 1; T.frente = [true, true]; T.ik(-1, -72, -330); T.ik(1, 72, -330); T.tremor = 0.4; }
          T.draw(cc, t);
          // bolsos vazios para fora
          if (q >= 3.5 && t < b0) for (const s of [-1, 1]) { shape(cc, c => { c.moveTo(KX + s * 52, CH - 132); c.quadraticCurveTo(KX + s * 80, CH - 100, KX + s * 56, CH - 84); c.closePath(); }, '#f6f2ea', { lw: 4 }); }
        });
      },
    };
  },
};

// ================= 4. A EXPLICAÇÃO =================
export const c4 = {
  inicio: B[3], fim: B[4],
  criar(st) {
    const T = teo();
    return {
      desenhar(t) {
        const c = st.c;
        const [a0, a1] = S('4a'), [b0, b1] = S('4b');
        if (t < b0 - 0.1) {
          st.setCam(KX + 40, 1320, 1.6);
          casa(st, t, { abre: 1 });
          st.mundo(cc => {
            teoPe(T, t, KX); T.exp = 'preocupado'; T.boca = 'tremendo'; T.olhar = [0.3, -0.8]; T.frente = [false, true]; T.ik(1, 14, -236 + Math.sin(t * 10) * 4); T.suor = 0.8;
            const nao = t > a0 + 2.4;
            if (nao) { T.olhar = [1, -0.2]; T.exp = 'normal'; T.boca = 'o'; T.suor = 0; T.frente = [false, false]; T.ik(1, 66, -128); }
            T.draw(cc, t);
            const [hx, hy] = T.cabeca();
            // imagina o cérebro "velhinho"
            balaoPens(cc, KX + 20, 1000, 230, sstep(a0, a0 + 0.4, t) * (1 - sstep(a0 + 2.2, a0 + 2.5, t)), hx + 30, hy - 80, b => {
              b.fillStyle = '#e8e4f0'; b.fillRect(-300, -220, 600, 400);
              cerebroP(b, 0, -30, 0.48, t, { olhar: [0, 0.3], palp: 0.5, boca: 'tremendo', tremor: 1, maoE: [-200, 160], maoD: [230, 120], segura: [null, (c, x, y) => { line(c, [[x, y - 20], [x, y + 160]], '#8a5a3a', 12); shape(c, c => c.arc(x - 24, y - 20, 24, Math.PI, 0), null, { stroke: '#8a5a3a', lw: 12 }); }] });
              b.save(); b.globalAlpha = 0.45; b.fillStyle = '#9a9aa8'; b.beginPath(); b.ellipse(0, -60, 120, 90, 0, 0, TAU); b.fill(); b.restore();
              for (const s of [-1, 1]) circle(b, s * 30, -36, 20, null, { stroke: '#3a3a44', lw: 4 });
              for (let k = 0; k < 3; k++) { b.save(); b.globalAlpha = 0.7; b.font = '900 34px Inter, sans-serif'; b.fillStyle = '#5a5a6a'; b.fillText('~', -110 + k * 90, -140 - Math.abs(Math.sin(t * 3 + k)) * 10); b.restore(); }
            });
            // o cérebro de verdade aparece e diz "não"
            const ap = easeBack(clamp((t - a0 - 2.4) / 0.35));
            if (ap > 0) { cc.save(); cc.translate(KX - 260, 1250); cc.scale(ap, ap); cc.rotate(Math.sin(t * 9) * 0.12); detetive(cc, 0, 0, 0.36, t, { olhar: [1, 0], piscar: piscada(t), boca: 'sorriso', sob: [0, -14], maoE: [-200, 150], maoD: [240, -220 + Math.sin(t * 14) * 10], pernas: { sentado: true, balanca: 1 } }); cc.restore(); glow(cc, KX - 260, 1250, 140, '#ffd0f0', 0.3 * ap); }
          });
          return;
        }
        if (t < b0 + 1.9) {
          // o cérebro observando duas portas
          st.setCam(540, 1150, 1.18);
          escritorio(st, t);
          st.mundo(cc => {
            for (const [x, cor] of [[480, '#f8d58e'], [880, '#9fe0d4']]) { rrect(cc, x - 130, 900, 260, 540, 8, cor, { lw: 7 }); rrect(cc, x - 104, 930, 208, 510, 6, '#b8743a', { lw: 5 }); circle(cc, x + 70, 1200, 12, '#e8c040', { lw: 3 }); }
            const aponta = Math.sin(t * 2) > 0;
            detetive(cc, 250, 1300, 0.5, t, { olhar: [aponta ? 0.6 : 1, -0.2], piscar: piscada(t), boca: 'o', sob: [0, -12], pernas: {}, maoE: [-200, 150], maoD: aponta ? [330, -120] : [520, -100] });
          });
          return;
        }
        // a travessia: um cômodo vira outro
        const u = clamp((t - b0 - 1.9) / 2.0);
        const x = lerp(860, 1540, easeInOut(u));
        st.setCam(x, 1350, 1.3);
        casa(st, t, { abre: 1, divisoria: win(x, 1120, 1200, 1260, 1420) });
        st.mundo(cc => { teoPe(T, t, x); anda(T, t, 13); T.exp = 'normal'; T.boca = 'sorriso'; T.olhar = [1, 0]; if (x > 1260) { T.boca = 'reta'; T.olhar = [0, 0]; T.olhoTam = 1.05; } T.draw(cc, t); });
      },
    };
  },
};

// ================= 5. COMO O CÉREBRO FUNCIONA =================
function cartao(c, x, y, rot = 0) { c.save(); c.translate(x, y); c.rotate(rot); rrect(c, -90, -60, 180, 120, 8, '#fffaf0', { lw: 5 }); rrect(c, -70, -36, 34, 34, 4, null, { stroke: '#2b1f2a', lw: 4 }); carregador(c, 30, -10, 0.55); c.restore(); }
export const c5 = {
  inicio: B[4], fim: B[5],
  criar(st) {
    const T = teo();
    return {
      desenhar(t) {
        const c = st.c;
        const [a0, a1] = S('5a'), [b0, b1] = S('5b');
        const T_PORTA = a0 + 3.6, T_VOLTA = T_PORTA + 1.3;
        if (t > T_PORTA && t < T_VOLTA) {
          const u = clamp((t - T_PORTA) / 1.3), x = lerp(980, 1440, easeInOut(u));
          st.setCam(x, 1350, 1.4);
          casa(st, t, { abre: 1, divisoria: win(x, 1120, 1200, 1260, 1400) });
          st.mundo(cc => { teoPe(T, t, x); anda(T, t, 13); T.olhar = [1, 0]; T.boca = 'sorriso'; T.draw(cc, t); });
          return;
        }
        const novo = t > T_VOLTA;
        st.setCam(540, 1180, 1.22);
        escritorio(st, t);
        if (novo) { c.save(); c.globalCompositeOperation = 'hue'; c.globalAlpha = 0.5; c.fillStyle = '#3ab8a8'; c.fillRect(0, 0, W, H); c.restore(); }
        st.mundo(cc => {
          const procura = t > b0;
          const gav = procura ? win(t, b0 + 0.3, b0 + 0.6, b0 + 1.8, b0 + 2.1) : 0;
          // mesa de trabalho da memória com o cartão da tarefa
          rrect(cc, 280, 1320, 600, 36, 8, '#f6d55c', { lw: 6 }); rrect(cc, 300, 1356, 560, 160, 8, '#f2b84a', { lw: 6 });
          rrect(cc, 320 + gav * 0, 1380 + gav * 0, 240, 100, 6, '#f6d55c', { lw: 4 }); if (gav > 0) { rrect(cc, 320, 1380 + 0, 240 + gav * 60, 100, 6, '#e8c040', { lw: 4 }); rrect(cc, 340, 1392, 200, 40, 4, '#5a3a2a', { stroke: null, alpha: 0.4 }); }
          cartao(cc, 640, 1250, -0.06);
          // divisória do "novo episódio" escondendo parte do cartão
          const div = sstep(T_VOLTA, T_VOLTA + 0.7, t);
          if (div > 0) { rrect(cc, lerp(1200, 600, easeOut(div)), 1000, 120, 520, 10, '#5a6a9a', { lw: 6 }); for (let k = 0; k < 4; k++) line(cc, [[lerp(1200, 600, easeOut(div)) + 20, 1060 + k * 110], [lerp(1200, 600, easeOut(div)) + 100, 1060 + k * 110]], '#7a8ab8', 6); }
          // o cérebro
          let o = cer(t, { pernas: {}, boca: 'sorriso', olhar: [1, 0.6], maoE: [-200, 150], maoD: [230, 140] });
          let bx = 250, by = 1180;
          if (novo) { o.olhar = [1, 0]; o.boca = 'o'; o.sob = [-10, -10]; }
          if (procura) {
            const q = t - b0;
            if (q < 2.1) { o.olhar = [0.6, 1]; o.maoD = [320, 260]; o.boca = 'bico'; }
            else if (q < 3.6) { by = 1300; bx = 420; o.olhar = [0, 1]; o.maoE = [-260, 100]; o.maoD = [260, 100]; o.boca = 'o'; }   // olha debaixo da mesa
            else { o.olhar = [Math.sin(t * 4), 0]; o.maoD = [120, -260 + Math.sin(t * 16) * 10]; o.boca = 'lado'; o.aflito = true; }
          }
          if (procura && t - b0 >= 2.1 && t - b0 < 3.6) { detetive(cc, bx, by, 0.5, t, { ...o, pernas: { sentado: true } }); rrect(cc, 280, 1320, 600, 36, 8, '#f6d55c', { lw: 6 }); }
          else detetive(cc, bx, by, 0.5, t, o);
          if (div > 0.99 && Math.sin(t * 5) > 0.7) sparkle(cc, 560, 1210, 16, '#ffffff', 1);
        });
      },
    };
  },
};

// ================= 6. A ABA FECHADA =================
export const c6 = {
  inicio: B[5], fim: B[6],
  criar(st) {
    const T = teo();
    return {
      desenhar(t) {
        const [a0, a1] = S('6a');
        const fecha = clamp((t - a0 - 1.7) / 0.4), erro = sstep(a0 + 2.3, a0 + 2.45, t);
        st.setCam(KX, 1180, lerp(1.45, 1.6, sstep(a0, a1, t)), 0, erro > 0 && t < a0 + 2.7 ? [Math.sin(t * 60) * 0.4, 0] : [0, 0]);
        casa(st, t, { abre: 1 });
        st.mundo(cc => {
          teoPe(T, t, KX); T.olhar = [0, -0.8]; T.headY = -4; T.rostoY = -6; T.boca = 'reta';
          if (t > a0 + 2.3) { T.exp = 'raiva'; T.boca = 'aberta'; T.olhar = [0, -0.9]; T.frente = [false, false]; T.ik(-1, -130, -280); T.ik(1, 130, -280); T.blush = 0.6; }
          T.draw(cc, t);
          // a interface flutuante dentro da cabeça
          const ap = easeBack(clamp((t - B[5]) / 0.35));
          cc.save(); cc.translate(KX, 960); cc.scale(ap, ap);
          rrect(cc, -320, -200, 640, 400, 16, '#2a2a3a', { lw: 7 }); rrect(cc, -300, -140, 600, 320, 6, '#f2f4fa', { stroke: null });
          rrect(cc, -300, -184, 600, 44, 8, '#3a3a52', { stroke: null });
          // abas
          const w1 = 200 * (1 - fecha);
          if (w1 > 4) { rrect(cc, -290, -176, w1, 40, 10, '#f2f4fa', { stroke: null }); if (w1 > 60) { carregador(cc, -260, -160, 0.28); rrect(cc, -230, -164, Math.max(0, w1 - 90), 10, 4, '#9aa0b8', { stroke: null }); line(cc, [[-290 + w1 - 30, -168], [-290 + w1 - 18, -156]], '#5a5a70', 3); line(cc, [[-290 + w1 - 18, -168], [-290 + w1 - 30, -156]], '#5a5a70', 3); } }
          for (let k = 0; k < 2; k++) rrect(cc, -290 + w1 + 8 + k * 150, -172, 140, 32, 10, '#5a5a72', { stroke: null });
          // conteúdo da aba
          if (fecha < 1) { cc.save(); cc.globalAlpha = 1 - fecha; cartao(cc, 0, 10, 0); if (Math.floor(t * 3) % 2) circle(cc, -260, -50, 10, '#e2473a', { stroke: null }); cc.restore(); }
          else { for (let k = 0; k < 4; k++) rrect(cc, -240, -90 + k * 50, 480 - k * 60, 18, 6, '#dfe2ec', { stroke: null }); }
          // erro
          if (erro > 0) { cc.save(); cc.scale(easeBack(erro), easeBack(erro)); rrect(cc, -200, -60, 400, 170, 10, '#e8e8f0', { lw: 6 }); rrect(cc, -200, -60, 400, 40, 10, '#d83a3a', { lw: 6 }); circle(cc, -130, 50, 32, '#d83a3a', { lw: 4 }); cc.font = '900 44px Inter, sans-serif'; cc.textAlign = 'center'; cc.textBaseline = 'middle'; cc.fillStyle = '#ffffff'; cc.fillText('!', -130, 52); cc.fillStyle = '#1a1a22'; cc.fillText('ERRO', 30, 52); cc.restore(); }
          cc.restore();
          if (fecha > 0 && fecha < 1) { for (let k = 0; k < 6; k++) sparkle(cc, KX - 200 + k * 20, 790 + Math.sin(k) * 10, 10, '#ffffff', 1 - fecha); }
        });
      },
    };
  },
};

// ================= 7. A REVIRAVOLTA E O FINAL =================
export const c7 = {
  inicio: B[6], fim: B[7],
  criar(st) {
    const T = teo();
    return {
      desenhar(t) {
        const c = st.c;
        const [a0, a1] = S('7a'), [b0, b1] = S('7b'), [c0, c1] = S('7c');
        const volta = clamp((t - b0 - 0.1) / 2.1), x = lerp(KX, 760, easeInOut(volta));
        const lembra = t > b0 + 2.4, azul = sstep(c0 + 0.5, c0 + 0.75, t);
        let cam = [lerp(KX, x, 0.8), 1400, 1.5];
        if (lembra) cam = [760, 1380, lerp(1.7, 1.9, sstep(b0 + 2.4, c0, t))];
        if (t > c0 + 1.2) cam = [760, lerp(1330, 1360, sstep(c0 + 1.2, c1, t)), lerp(1.9, 2.4, sstep(c0 + 1.2, c1 + 0.8, t))];
        if (t > c1 + 0.8) cam = [760, 1440, lerp(2.4, 3.6, easeOut(clamp((t - c1 - 0.8) / 0.3)))];
        st.setCam(...cam);
        casa(st, t, { abre: 1, divisoria: win(x, 1080, 1180, 1220, 1320) });
        st.mundo(cc => {
          teoPe(T, t, x);
          if (t < b0) { T.olhar = [-1, 0]; T.boca = 'lado'; T.palp = 0.3; T.rostoX = -6; T.sobA = [0.2, -0.2]; }
          else if (volta < 1) { anda(T, t, 13); T.olhar = [-1, 0]; T.boca = 'reta'; T.lean = -0.08; }
          if (lembra) { T.exp = 'choque'; T.boca = 'aberta'; T.olhoTam = 1.15; T.olhar = [-1, 0.3]; T.ik(-1, -170, -250); T.jump = impulse(t, b0 + 2.4, 30, 0.3); T.blush = 0.5; }
          if (azul > 0) { T.exp = 'raiva'; T.boca = 'reta'; T.olhar = [0, 0]; T.olhoTam = 1; T.ik(-1, -70, -140); T.blush = 0.7; T.sob = [6, 6]; }
          T.draw(cc, t);
          const [hx, hy] = T.cabeca();
          if (lembra && azul < 1) { const k = easeBack(clamp((t - b0 - 2.5) / 0.3)); glow(cc, hx, hy - 190, 140 * k, '#fff2a0', 0.8); circle(cc, hx, hy - 200, 40 * k, '#ffe46a', { lw: 5 }); rrect(cc, hx - 18 * k, hy - 166, 36 * k, 26 * k, 5, '#9a9aa8', { lw: 4 }); }
          telaAzul(cc, hx, hy - 250, 0.55 * easeBack(azul), azul, t);
        });
        // computador antigo desligando
        const off = clamp((t - (B[7] - 1.2)) / 0.9);
        if (off > 0) {
          const h = H * (1 - easeIn(clamp(off * 1.6))) / 2, w2 = W * (1 - easeIn(clamp((off - 0.6) / 0.4))) / 2;
          c.fillStyle = '#000'; c.fillRect(0, 0, W, H / 2 - Math.max(h, 3)); c.fillRect(0, H / 2 + Math.max(h, 3), W, H);
          if (off > 0.6) { c.fillRect(0, 0, W / 2 - w2, H); c.fillRect(W / 2 + w2, 0, W, H); }
          if (off > 0.55) { c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = '#ffffff'; c.fillRect(W / 2 - w2, H / 2 - 4, w2 * 2, 8); c.restore(); }
          if (off >= 1) st.overlay('#000', 1);
        }
      },
    };
  },
};
