// "Por que você pensa demais antes de dormir?" — cenas 2D
import { TAU, lerp, clamp, sstep, win, kf, easeInOut, easeIn, easeOut, easeBack, rng, impulse } from '../../../motor/base.js';
import { glow, sparkle, speedLines, circle, line, rrect, ellipse, shape, cloud, poly } from '../../../motor/desenho.js';
import { paginasVoando } from '../../../motor/efeitos.js';
import { gui, davi, bia, leo } from '../../../personagens/elenco.js';
import { Q, quarto, cama, travesseiro, cobertor, criadoMudo, detetive, lupa, lanterna, caderno, quadro, nuvem, icone, salaReuniao, relogio3, mesaReuniao, rede } from '../../../cenarios/lugares.js';

const W = 1080, H = 1920;
const piscada = (t, f = 3.3, o = 0) => (((t + o) % f) < 0.12 ? 1 : 0);
const respira = (P, t, o = 0, a = 0.012) => { P.squash = Math.sin(t * 2.2 + o) * a; };
const SX = 520, SY = Q.colchao + 126;           // sentado na cama
const DEITA = [650, 1425];                        // quadril deitado
const cabecaDeitado = (px, py, a) => [px + 174 * Math.sin(a), py - 174 * Math.cos(a)];
function desenhaRot(c, P, t, px, py, a) { c.save(); c.translate(px, py); c.rotate(a); c.translate(0, 126); P.x = 0; P.y = 0; P.draw(c, t); c.restore(); }
const celularMao = (c, s) => { c.save(); c.rotate(-0.3 * s); rrect(c, -16, -50, 32, 56, 6, '#1a1a22', { lw: 4 }); rrect(c, -11, -44, 22, 42, 3, '#7ac8ff', { stroke: null }); c.restore(); };
// estado do cérebro detetive (expressão séria)
const serio = (t, extra = {}) => ({ olhar: [0.3, 0.1], piscar: piscada(t, 3.1, 0.4), boca: 'reta', bravo: true, sob: [6, 6], tam: 0.92, ...extra });

// cena do quarto com o Gui deitado (reutilizada)
function quartoDeitado(st, t, G, { escuro = 0, luz = 0, exp = null, extraFrente = null, travesseiroSobre = 0, chuta = 0 } = {}) {
  quarto(st, t, { escuro });
  st.mundo(c => {
    criadoMudo(c, t, { luz, celular: true });
    cama(c, t);
    if (travesseiroSobre < 0.5) travesseiro(c, 440, 1452);
    G.reset(); G.semPernas = true; G.exp = 'fechado'; G.boca = 'sorriso'; G.blush = 0.2; G.ik(-1, -50, -150); G.ik(1, 50, -150); respira(G, t, 0, 0.02);
    exp?.(G);
    desenhaRot(c, G, t, DEITA[0], DEITA[1], -Math.PI / 2);
    cobertor(c, t + chuta * Math.sin(t * 20) * 0.3, 'deitado', 560);
    if (travesseiroSobre >= 0.5) travesseiro(c, 470, 1400, -0.15 + Math.sin(t * 7) * 0.04, 1.05);
    extraFrente?.(c);
  });
}

// ================= 1. O INVESTIGADOR NOTURNO (0 – 8.8) =================
export const c1 = {
  inicio: 0, fim: 8.8,
  criar(st) {
    const G = gui();
    return {
      desenhar(t) {
        const luz = 1 - sstep(3.95, 4.05, t);
        const deita = easeInOut(clamp((t - 4.3) / 1.2));
        // câmera: plano médio sentado -> lateral da cama
        const u = easeInOut(clamp((t - 4.2) / 1.6));
        let cam = [lerp(560, 560, u), lerp(1330, 1290, u), lerp(1.45, 1.9, u)];
        if (t > 6.0) cam = [lerp(560, 600, easeInOut(clamp((t - 6.0) / 1.5))), lerp(1290, 1200, easeInOut(clamp((t - 6.0) / 1.5))), 1.9];
        const z = easeIn(clamp((t - 8.0) / 0.45));
        if (z > 0) cam = [lerp(cam[0], 560, z), lerp(cam[1], 1080, z), lerp(1.9, 5.2, z)];
        st.setCam(cam[0], cam[1], cam[2]);
        quarto(st, t, { escuro: 0.5 * (1 - luz) });
        st.mundo(c => {
          criadoMudo(c, t, { luz, celular: t > 3.2 });
          cama(c, t);
          travesseiro(c, 440, 1452);
          G.reset(); G.semPernas = true; G.piscar = piscada(t); respira(G, t);
          G.ik(-1, -70, -150); G.ik(1, 70, -150); G.olhar = [0, 0.2];
          if (t < 1.6) { // bocejo e espreguiçada
            const k = win(t, 0.2, 0.6, 1.2, 1.6); G.ik(-1, lerp(-70, -112, k), lerp(-150, -330, k)); G.ik(1, lerp(70, 112, k), lerp(-150, -330, k));
            G.exp = 'fechado'; G.boca = k > 0.3 ? 'grito' : 'reta'; G.headTilt = -0.06 * k; G.headY = -6 * k; G.squash = -0.03 * k;
          } else if (t < 2.6) { // esfrega os olhos
            G.frente = [true, true]; const r = Math.sin(t * 16) * 5; G.ik(-1, -28 + r, -306); G.ik(1, 28 - r, -306); G.exp = 'fechado'; G.boca = 'reta';
          } else if (t < 4.2) { // celular no criado-mudo e apaga o abajur
            const k = easeInOut(clamp((t - 2.6) / 0.5)), volta = easeInOut(clamp((t - 4.05) / 0.3));
            G.lean = -0.32 * k * (1 - volta); G.olhar = [-1, 0.3];
            if (t < 3.3) { G.maoE = t < 3.2 ? celularMao : null; G.ik(-1, lerp(-70, -169, k), lerp(-150, -268, k)); }
            else { const k2 = easeInOut(clamp((t - 3.4) / 0.4)); G.ik(-1, lerp(-169, -182, k2), lerp(-268, -258, k2)); }
            G.boca = 'sorriso';
          } else { G.exp = deita > 0.6 ? 'fechado' : 'normal'; G.boca = 'sorriso'; }
          if (deita > 0) {
            G.ik(-1, -50, -150); G.ik(1, 50, -150);
            const px = lerp(SX, DEITA[0], deita), py = lerp(Q.colchao, DEITA[1], deita);
            desenhaRot(c, G, t, px, py, -Math.PI / 2 * deita);
          } else { G.x = SX; G.y = SY; G.draw(c, t); }
          cobertor(c, t, deita > 0.7 ? 'deitado' : 'sentado', deita > 0.7 ? 560 : 470);
          // o cérebro detetive aparece
          const ap = easeBack(clamp((t - 6.0) / 0.35));
          if (ap > 0.01) {
            quadro(c, 700, 1020, clamp((t - 7.2) / 0.6) * 0.62, t);
            const pegou = t > 6.95;
            detetive(c, 520, 1110 + Math.sin(t * 3) * 6, 0.3 * ap, t, serio(t, { chapeu: clamp((t - 6.35) / 0.4), olhar: t > 7.3 ? [0.8, -0.2] : [0, 0.2], pernas: { sentado: true, balanca: 0.6 },
              maoE: [-210, 140], maoD: pegou ? [230, 20] : [210, 150], segura: pegou ? [null, (c, x, y) => lupa(c, x, y, -0.5)] : null }));
            if (t > 6.0 && t < 6.5) { const a = 1 - sstep(6.0, 6.5, t); for (let i = 0; i < 10; i++) { const an = i / 10 * TAU; line(c, [[520 + Math.cos(an) * 90, 1080 + Math.sin(an) * 90], [520 + Math.cos(an) * 150, 1080 + Math.sin(an) * 150]], '#ffe46a', 6, a); } }
          }
        });
        if (luz < 1) st.overlay('#0a0c2a', 0.25 * (1 - luz));
        if (z > 0.6) speedLines(st.c, W / 2, H / 2, 60, 300, 1300, (z - 0.6) * 1.5, t, '#ffffff');
      },
    };
  },
};

// ================= 2. AS VERGONHAS DO PASSADO (8.8 – 18.0) =================
export const c2 = {
  inicio: 8.8, fim: 18.0,
  criar(st) {
    const G = gui(), m = gui(), P = [davi(), bia(), leo()];
    return {
      desenhar(t) {
        const escuro = 0.5 + 0.4 * sstep(8.8, 10.2, t);
        const [hx, hy] = cabecaDeitado(DEITA[0], DEITA[1], -Math.PI / 2);
        if (t < 13.4) {
          const u = easeInOut(clamp((t - 8.8) / 1.0));
          st.setCam(lerp(560, 520, u), lerp(1080, 1230, u), lerp(5.2, 1.65, easeOut(u)));
          quartoDeitado(st, t, G, { escuro, exp: G => { G.exp = 'fechado'; G.boca = t > 11.8 ? 'tremendo' : 'reta'; G.sob = t > 11.8 ? [-6, -6] : [0, 0]; }, extraFrente: c => {
            for (let i = 0; i < 8; i++) { const an = i / 8 * TAU + t * 0.6; sparkle(c, hx + Math.cos(an) * 170, hy + Math.sin(an) * 90, 7, '#bfe0ff', 0.4 + 0.4 * Math.sin(t * 3 + i)); }
            // nuvem com a lembrança constrangedora
            const a = sstep(10.0, 10.5, t) * (1 - sstep(13.1, 13.4, t));
            nuvem(c, 560, 1000, 240, a, cc => {
              cc.fillStyle = '#bfe4f6'; cc.fillRect(-300, -220, 600, 400); cc.fillStyle = '#9ad06a'; cc.fillRect(-300, 70, 600, 200); rrect(cc, -300, 60, 600, 18, 0, '#c8c0b0', { stroke: null });
              const k = clamp((t - 10.4) / 1.2), cai = easeIn(clamp((t - 11.5) / 0.35));
              m.reset(); m.s = 0.36; m.x = lerp(-230, -60, k) + cai * 30; m.y = 70; m.walk = cai < 0.01 ? t * 12 : null; m.exp = cai > 0.5 ? 'choque' : 'normal'; m.boca = cai > 0.5 ? 'grito' : 'sorriso'; m.olhar = [1, 0];
              m.lean = cai * 1.25; m.ik(-1, -60 - cai * 60, -150 - cai * 120); m.ik(1, 60 + cai * 60, -150 - cai * 120);
              cc.save(); cc.translate(-90, 76); cc.rotate(0); rrect(cc, -16, -10, 32, 14, 5, '#7a7a8a', { lw: 3 }); cc.restore();
              m.draw(cc, t);
              P.forEach((p, i) => { p.reset(); p.s = 0.32; p.x = 90 + i * 70; p.y = 70; const ri = t > 11.8; p.exp = ri ? 'feliz' : 'normal'; p.boca = ri ? 'aberta' : 'reta'; p.olhar = [-1, 0]; p.jump = ri ? Math.abs(Math.sin(t * 9 + i)) * 14 : 0; if (ri && i !== 1) { p.ik(-1, -130, -230); } if (ri && i === 1) { p.frente = [true, false]; p.ik(-1, -20, -270); } p.draw(cc, t); });
              if (t > 11.8) { cc.save(); cc.font = '900 34px Inter, sans-serif'; cc.fillStyle = '#e2575c'; cc.textAlign = 'center'; for (let i = 0; i < 3; i++) cc.fillText('HA', 100 + i * 70, -150 - Math.abs(Math.sin(t * 8 + i)) * 16); cc.restore(); }
            }, { bolinhas: [[hx + 60, hy - 120, 14], [hx + 90, hy - 170, 22]] });
            if (a > 0.5) { c.save(); c.translate(380, 820); c.rotate(-0.12); rrect(c, -70, -30, 140, 60, 12, '#f4c430', { lw: 5 }); c.font = '900 40px Inter, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#2b1f2a'; c.fillText('2017', 0, 2); c.restore(); }
          } });
          return;
        }
        if (t < 15.4) {
          // acorda assustado, vira o rosto e põe o travesseiro na cabeça
          const tr = t > 14.2;
          st.setCam(hx + 40, hy - 20, 2.6, 0, t < 13.7 ? [Math.sin(t * 50) * 0.4, 0] : [0, 0]);
          quartoDeitado(st, t, G, { escuro, travesseiroSobre: tr ? 1 : 0, chuta: tr ? 1 : 0, exp: G => {
            G.exp = 'choque'; G.boca = 'grito'; G.olhar = [0, 0]; G.blush = 0.7; G.sob = [-10, -10];
            if (t > 13.8) { G.exp = 'preocupado'; G.boca = 'tremendo'; G.rostoX = -12; G.headTilt = -0.25; G.olhar = [-1, 0]; }
            if (tr) { G.frente = [true, true]; G.ik(-1, -60, -330); G.ik(1, 60, -330); }
          } });
          return;
        }
        // o detetive analisa a lembrança no quadro
        st.setCam(lerp(600, 640, clamp((t - 15.4) / 2.6)), 1040, 2.15);
        quartoDeitado(st, t, G, { escuro, travesseiroSobre: 1, extraFrente: c => {
          quadro(c, 700, 1020, 0.62, t, { escrita: clamp((t - 16.5) / 1.3), destaque: sstep(16.0, 16.3, t) });
          const lx = lerp(560, 660, easeInOut(clamp((t - 15.4) / 0.8))), ly = lerp(1060, 945, easeInOut(clamp((t - 15.4) / 0.8)));
          const esc = clamp((t - 16.5) / 1.3);
          detetive(c, 520, 1110 + Math.sin(t * 3) * 5, 0.3, t, serio(t, { chapeu: 1, olhar: [1, -0.4], tam: 1.05, pernas: { sentado: true, balanca: 0.2 },
            maoD: [(lx - 520) / 0.3, (ly - 1110) / 0.3], segura: [null, (c, x, y) => lupa(c, x, y, -0.8)], maoE: t > 16.4 ? [lerp(420, 700, esc), lerp(330, 300, esc) + Math.sin(t * 30) * 8] : [-200, 150] }));
        } });
      },
    };
  },
};

// ---------- reunião ----------
const MINIS = [0, 1, 2, 3, 4];
function miniPos(i, t) {
  if (t < 21.8) { // entrando com documentos
    const t0 = 19.0 + i * 0.35, u = clamp((t - t0) / 1.4), dir = i % 2 ? -1 : 1;
    const x0 = dir > 0 ? -150 : 1230, x1 = [200, 860, 330, 700, 520][i];
    return [lerp(x0, x1, easeOut(u)), 1890, u < 1 ? t * 14 : null, dir];
  }
  // correndo de um lado para o outro
  const sp = 520 + i * 60, ph = (t * sp / 1400 + i * 0.27) % 2, dir = ph < 1 ? 1 : -1, x = ph < 1 ? lerp(-200, 1280, ph) : lerp(1280, -200, ph - 1);
  return [x, 1890 - (i % 2) * 20, t * 18, dir];
}
const pasta = (k) => (c, x, y) => { rrect(c, x - 50, y - 90, 100, 76, 6, ['#f2b84a', '#7ac8ff', '#ff8fb1', '#8fe0a0', '#c8a0f0'][k % 5], { lw: 4 }); };

// ================= 3. A REUNIÃO DE EMERGÊNCIA (18.0 – 28.8) =================
export const c3 = {
  inicio: 18.0, fim: 28.8,
  criar(st) {
    const G = gui(), Gq = gui();
    return {
      desenhar(t) {
        const c = st.c;
        // câmera
        const pts = [[18.0, [540, 1360, 1.0]], [19.2, [540, 1380, 1.05]], [21.9, [560, 1400, 1.1]], [22.6, [540, 1430, 2.05]], [24.6, [540, 1420, 2.2]], [25.2, [-60, 1700, 1.55]], [26.7, [1100, 1700, 1.55]], [27.1, [760, 800, 2.5]], [27.9, [760, 800, 2.7]], [28.2, [540, 1380, 2.0]], [28.8, [540, 1380, 3.1]]];
        const cm = kf(t, pts, easeInOut);
        st.setCam(cm[0], cm[1], cm[2], 0, t > 21.0 && t < 21.6 ? [Math.sin(t * 50) * 0.3, 0] : [0, 0]);
        salaReuniao(st, t);
        st.mundo(cc => {
          // o Gui de pijama no meio da reunião
          G.reset(); G.x = 540; G.y = 1646; G.semPernas = true; G.piscar = piscada(t, 2.4); respira(G, t);
          G.ik(-1, -76, -150); G.ik(1, 76, -150);
          G.olhar = [Math.sin(t * 2.2) > 0 ? 1 : -1, 0]; G.sob = [-12, -4]; G.boca = 'meia'; G.rostoX = G.olhar[0] * 5; G.olhoTam = 1.08;
          if (t > 21.0 && t < 21.8) { G.exp = 'choque'; G.boca = 'o'; G.jump = impulse(t, 21.0, 20, 0.2); }
          if (t > 27.9) { G.olhar = [0, 0]; G.palp = 0.45; G.boca = 'triste'; G.sob = [2, 2]; G.exp = 'preocupado'; G.lean = 0; G.squash = 0.04; G.olhoTam = 1; }
          G.draw(cc, t);
          mesaReuniao(cc, t, win(t, 21.0, 21.05, 21.6, 22.2));
          G.drawArms(cc, t);
          // chefe na ponta da mesa: aponta para o relógio e grita ordens
          const grita = t > 24.6;
          detetive(cc, 950, 1390, 0.32, t, serio(t, { chapeu: 1, pernas: { sentado: false }, boca: grita ? (Math.floor(t * 8) % 2 ? 'grito' : 'o') : 'reta', olhar: grita ? [-0.6, -0.8] : [-0.8, 0.3],
            maoE: grita ? [-300, -260 + Math.sin(t * 14) * 30] : [-200, 150], maoD: grita ? [240, 40 + Math.sin(t * 9) * 50] : [210, 150], tremor: grita ? 0.4 : 0 }));
          if (grita) for (let i = 0; i < 5; i++) { const an = -2.2 + i * 0.3; line(cc, [[950 + Math.cos(an) * 110, 1330 + Math.sin(an) * 110], [950 + Math.cos(an) * (140 + Math.sin(t * 20 + i) * 14), 1330 + Math.sin(an) * (140 + Math.sin(t * 20 + i) * 14)]], '#ffffff', 6); }
          // mini cérebro aponta o gráfico do futuro despencando
          const ap = sstep(19.4, 19.7, t);
          if (ap > 0) { detetive(cc, 300, 1395, 0.27, t, { olhar: [-0.6, -0.8], piscar: piscada(t, 2.2), boca: t > 20.7 ? 'grito' : 'o', aflito: t > 20.7, gravata: true, maoE: [-260, -200], maoD: [200, 150], suor: t > 20.7 ? 1 : 0 }); line(cc, [[300 - 70, 1340], [430, 900]], '#5a3a2a', 6); }
          // outro mini bate na mesa
          const bate = t > 20.9 ? Math.abs(Math.sin((t - 20.9) * 12)) : 0;
          if (t > 20.4) detetive(cc, 740, 1395, 0.27, t, { olhar: [0, 0.6], piscar: 0, boca: 'grito', bravo: true, gravata: true, maoE: [-200, lerp(-100, 150, bate)], maoD: [200, lerp(-100, 150, bate)], tremor: 0.3 });
          // minis correndo pelo chão com papéis
          MINIS.forEach(i => {
            const [x, y, w, dir] = miniPos(i, t);
            detetive(cc, x, y - 330 * 0.27, 0.27, t, { olhar: [dir, 0], piscar: piscada(t, 2.5, i), boca: t > 21.8 ? 'grito' : 'o', aflito: t > 21.8, gravata: true, pernas: { walk: w }, maoE: [-200, -60 + Math.sin(t * 18) * 30], maoD: [210, 40], segura: [null, (c, xx, yy) => pasta(i)(c, xx, yy)] });
          });
          if (t > 24.8) { paginasVoando(cc, 300, 1800, t - 24.8, 16, 500); paginasVoando(cc, 800, 1820, t - 25.6, 14, 450); }
        });
        // as paredes do quarto se abrem e revelam a sala (18.0 – 19.2)
        const k = easeInOut(clamp((t - 18.0) / 1.2));
        if (k < 1) {
          for (const sd of [-1, 1]) {
            c.save(); c.beginPath(); c.rect(sd < 0 ? 0 : W / 2, 0, W / 2, H); c.clip(); c.translate(sd * k * W * 0.6, 0);
            const s0 = st.cam; const keep = { ...s0 }; st.setCam(560, 1300, lerp(1.2, 0.9, k));
            quartoDeitado(st, t, Gq, { escuro: 0.9, travesseiroSobre: 1 });
            st.setCam(keep.x, keep.y, keep.zoom, keep.rot, keep.shk);
            c.restore();
          }
          rrect(c, W / 2 - k * W * 0.6 - 6, 0, 12, H, 0, '#141a40', { stroke: null }); rrect(c, W / 2 + k * W * 0.6 - 6, 0, 12, H, 0, '#141a40', { stroke: null });
        }
      },
    };
  },
};

// ---------- pensamentos flutuantes ----------
const PENS = [[29.6, 0], [30.2, 1], [30.8, 2], [31.4, 3], [32.0, 4], [34.3, 1], [34.45, 0], [34.6, 4]];
function posPens(i, t, cx, cy, fug = 0) {
  const an = i * 0.79 + t * (0.35 + (i % 3) * 0.08), r = 330 + (i % 3) * 60;
  return [cx + Math.cos(an) * r + fug * Math.sin(t * 1.3 + i) * 200, cy - 250 + Math.sin(an) * 130 - (i % 2) * 70];
}

// ================= 4. O CICLO DE PENSAMENTOS (28.8 – 43.0) =================
export const c4 = {
  inicio: 28.8, fim: 43.0,
  criar(st) {
    const G = gui(), Gm = gui();
    return {
      desenhar(t) {
        const c = st.c;
        const corre = t > 34.8 && t < 42.3;
        // posição do Gui
        let gx = SX, gy = SY, sentado = true;
        const rota = [[34.8, 560], [35.9, 930], [37.0, 300], [38.2, 860], [39.4, 360], [40.5, 640], [42.3, 640]];
        if (corre) { gx = kf(t, rota.map(([a, v]) => [a, v]), easeInOut); gy = 1790; sentado = false; }
        if (t >= 42.3) { gx = 640; }
        // câmera
        let cam = [560, 1300, 1.35];
        if (t < 29.6) cam = [560, 1320, 1.25];
        if (corre) cam = [clamp(gx, 200, 940), 1420, 1.25];
        if (t > 40.5 && t < 42.3) cam = [640, 1430, lerp(1.25, 1.45, sstep(40.5, 42.0, t))];
        if (t >= 42.3) cam = [640, 1320, 1.4];
        st.setCam(cam[0], cam[1], cam[2]);
        quarto(st, t, { escuro: 0.8 });
        const cx = sentado ? (t >= 42.3 ? 640 : SX) : gx, cyH = sentado ? SY - 300 : gy - 300;
        const pega = t > 32.4 && t < 34.3, alvo = 0;
        st.mundo(cc => {
          criadoMudo(cc, t, { luz: 0, celular: true });
          cama(cc, t); travesseiro(cc, 440, 1452);
          // o detetive observa do alto da cabeceira com a lanterna
          detetive(cc, 300, 1020, 0.24, t, serio(t, { chapeu: 1, pernas: { sentado: true, balanca: 0.6 }, olhar: [0.8, 0.3], maoE: [-180, 120], maoD: [220, 40 + Math.sin(t * 2) * 30], segura: [(c, x, y) => caderno(1)(c, x, y), lanterna(1, 0.3 + Math.sin(t * 1.5) * 0.25)] }));
          G.reset(); G.piscar = piscada(t); respira(G, t);
          if (sentado) {
            G.x = t >= 42.3 ? 640 : SX; G.y = SY; G.semPernas = true;
            G.frente = [true, true]; G.ik(-1, -72, -322); G.ik(1, 72, -322); G.aperta = 0.6; G.exp = 'preocupado'; G.boca = 'tremendo'; G.headTilt = Math.sin(t * 2) * 0.04;
            if (pega) { G.frente = [true, false]; const [px, py] = posPens(alvo, t, cx, cyH); const k = easeInOut(clamp((t - 32.4) / 0.6)); G.ik(1, lerp(72, (px - G.x), k), lerp(-322, py - G.y, k)); G.aperta = 0; G.olhar = [1, -0.8]; G.exp = 'raiva'; G.boca = 'reta'; if (t > 33.7) G.ik(1, 130, -200); }
            if (t >= 42.3) { G.frente = [false, false]; G.ik(-1, -80, -150); G.ik(1, 80, -150); G.exp = 'normal'; G.palp = 0.5; G.boca = 'meia'; G.aperta = 0; G.olhar = [0.3, -0.6]; G.squash = Math.sin(t * 6) * 0.02 + impulse(t, 42.3, 0.1, 0.3); }
            G.draw(cc, t);
            cobertor(cc, t, 'sentado', 470);
          } else {
            G.x = gx; G.y = gy; G.semPernas = false;
            const vel = Math.abs(kf(t + 0.05, rota.map(([a, v]) => [a, v]), easeInOut) - gx);
            const dir = kf(t + 0.05, rota.map(([a, v]) => [a, v]), easeInOut) - gx >= 0 ? 1 : -1;
            if (vel > 1.5 && t < 40.5) { G.walk = t * 18; G.lean = 0.14 * dir; G.ik(-1, -60, -330 + Math.sin(t * 9) * 30); G.ik(1, 60, -330 - Math.sin(t * 9) * 30); G.jump = Math.abs(Math.sin(t * 9)) * 30; G.olhar = [dir, -0.8]; G.exp = 'raiva'; G.boca = 'aberta'; }
            else if (t < 40.5) { G.ik(-1, -110, -340); G.ik(1, 110, -340); G.jump = Math.abs(Math.sin(t * 7)) * 50; G.olhar = [0, -1]; G.boca = 'aberta'; }
            else { // para, cansado
              G.lean = 0.1; G.ik(-1, -50, -110); G.ik(1, 50, -110); G.palp = 0.45; G.boca = Math.floor(t * 5) % 2 ? 'aberta' : 'meia'; G.suor = 1; G.olhar = [Math.sin(t * 1.5), -0.7]; G.squash = Math.sin(t * 10) * 0.02;
            }
            G.draw(cc, t);
          }
          // nuvens de pensamento
          PENS.forEach(([t0, tipo], i) => {
            if (t < t0) return;
            if (i === alvo && t > 34.0) return; // a que ele espantou
            let [px, py] = posPens(i, t, cx, cyH, corre ? 1 : 0);
            if (i === alvo && pega && t > 33.0) { const k = clamp((t - 33.0) / 0.7); px += k * 40; py += Math.sin(t * 30) * 6; }
            const a = easeBack(clamp((t - t0) / 0.35));
            nuvem(cc, px, py, 82, a, ic => { ic.save(); ic.scale(0.9, 0.9); ic.translate(0, -16); icone(ic, tipo, t); ic.restore(); });
          });
          if (t > 34.0 && t < 34.6) { const [px, py] = posPens(alvo, 34.0, cx, cyH); for (let k = 0; k < 8; k++) { const an = k / 8 * TAU, d = (t - 34.0) * 400; circle(cc, px + Math.cos(an) * d, py + Math.sin(an) * d, 14, '#ffffff', { lw: 3, alpha: 1 - (t - 34.0) / 0.6 }); } }
          // o ciclo: setas girando ao redor dele
          const ci = sstep(40.8, 41.4, t);
          if (ci > 0) { cc.save(); cc.translate(cx, cyH - 60); cc.rotate(t * 1.4); cc.globalAlpha = ci * 0.8; for (let k = 0; k < 3; k++) { cc.rotate(TAU / 3); shape(cc, c => c.arc(0, 0, 420, 0.2, 1.6), null, { stroke: '#bfe0ff', lw: 12 }); poly(cc, [[420 * Math.cos(1.6) - 26, 420 * Math.sin(1.6) - 10], [420 * Math.cos(1.6) + 26, 420 * Math.sin(1.6) - 10], [420 * Math.cos(1.75), 420 * Math.sin(1.75) + 16]], '#bfe0ff', { stroke: null }); } cc.restore(); }
        });
        // volta do quarto: as paredes se fecham sobre a reunião
        const k = 1 - easeInOut(clamp((t - 28.8) / 0.8));
        if (k > 0) {
          c.save(); c.globalAlpha = k; c.fillStyle = '#3a3060'; c.fillRect(0, 0, W, H); c.restore();
        }
        st.overlay('#06081e', 0.18);
      },
    };
  },
};

// ================= 5. A REFLEXÃO FINAL (43.0 – 60) =================
export const c5 = {
  inicio: 43.0, fim: 60,
  criar(st) {
    const G = gui();
    return {
      desenhar(t) {
        const calma = sstep(45.0, 49.0, t);
        const deita = easeInOut(clamp((t - 51.4) / 1.4));
        // câmera
        let cam;
        if (t < 51.4) cam = [lerp(640, 560, sstep(43, 46, t)), 1300, lerp(1.4, 1.55, sstep(43, 51, t))];
        else if (t < 53.4) cam = [lerp(560, 540, deita), lerp(1300, 1290, deita), 1.55];
        else if (t < 56.8) { const u = easeInOut(clamp((t - 53.4) / 3.4)); cam = [lerp(540, 560, u), lerp(1290, 1260, u), lerp(1.55, 0.95, u)]; }
        else { const u = easeInOut(clamp((t - 56.8) / 3.2)); cam = [lerp(560, 360, u), lerp(1260, 1250, u), lerp(0.95, 2.1, u)]; }
        st.setCam(cam[0], cam[1], cam[2]);
        quarto(st, t, { escuro: lerp(0.8, 0.35, calma) });
        st.mundo(c => {
          criadoMudo(c, t, { luz: 0, celular: true });
          cama(c, t); travesseiro(c, 440, 1452);
          // detetive: tira o chapéu, fecha o caderno, desliga a lanterna e vai para a rede
          const tira = clamp((t - 49.0) / 0.6), fecha = t > 49.8, apaga = t > 50.6;
          const vai = easeInOut(clamp((t - 51.4) / 1.0));
          const [rx, ry] = rede(c, 168, 1215, 318, 1112, t);
          const bx = lerp(300, rx, vai), by = lerp(1020, ry - 70, vai) - Math.sin(vai * Math.PI) * 120;
          if (t < 52.4) detetive(c, bx, by, lerp(0.24, 0.2, vai), t, serio(t, { chapeu: 1 - tira, chapeuRot: 0, bravo: t < 49, boca: t > 49 ? 'sorriso' : 'reta', olhar: [0.8, 0.3], piscar: piscada(t, 2.4), pernas: { sentado: true, balanca: 0.4 },
            maoE: t > 49 && t < 49.6 ? [-60, -330] : [-180, 120], maoD: [220, 40], segura: [(c, x, y) => caderno(fecha ? 0 : 1)(c, x, y), lanterna(apaga ? 0 : 1, 0.3)] }));
          else { c.save(); c.translate(rx, ry - 40); c.rotate(-0.25 + Math.sin(t * 1.2) * 0.08); detetive(c, 0, 0, 0.18, t, { piscar: 1, boca: 'sorriso', maoE: [-180, 60], maoD: [180, 60], pernas: { sentado: true } }); c.restore(); }
          // o Gui respira fundo, solta os braços e deita
          G.reset(); G.semPernas = true; G.piscar = piscada(t, 3.6); G.blush = 0.3;
          const sobe = win(t, 43.6, 44.4, 44.6, 45.6);
          G.squash = -0.04 * sobe + Math.sin(t * 1.6) * 0.01;
          const solta = easeInOut(clamp((t - 44.6) / 1.0));
          G.frente = [solta < 0.5, solta < 0.5]; G.ik(-1, lerp(-72, -80, solta), lerp(-322, -150, solta)); G.ik(1, lerp(72, 80, solta), lerp(-322, -150, solta));
          G.exp = sobe > 0.2 ? 'fechado' : 'normal'; G.boca = sobe > 0.2 ? 'bico' : (t > 45.6 ? 'sorriso' : 'reta'); G.olhar = [0.4, -0.6]; G.palp = 0.15;
          if (t > 47.5) { G.boca = 'sorriso'; G.palp = 0.3; }
          if (deita > 0) { G.ik(-1, -50, -150); G.ik(1, 50, -150); G.exp = deita > 0.5 ? 'fechado' : 'normal'; G.squash = Math.sin(t * 1.4) * 0.02; const px = lerp(640, DEITA[0], deita), py = lerp(Q.colchao, DEITA[1], deita); desenhaRot(c, G, t, px, py, -Math.PI / 2 * deita); }
          else { G.x = 640; G.y = SY; G.draw(c, t); }
          cobertor(c, t, deita > 0.7 ? 'deitado' : 'sentado', deita > 0.7 ? 560 : 470);
          // os pensamentos somem um por um
          PENS.forEach(([t0, tipo], i) => {
            if (i === 0) return;
            const some = 45.6 + i * 0.45, a = 1 - sstep(some, some + 0.35, t);
            if (a <= 0) { if (t < some + 0.8) for (let k = 0; k < 5; k++) { const [px, py] = posPens(i, some, 640, SY - 300); sparkle(c, px + Math.cos(k * 1.3) * 60 * (t - some), py + Math.sin(k * 1.3) * 60 * (t - some), 12, '#ffffff', 1 - (t - some - 0.35) / 0.45); } return; }
            const [px, py] = posPens(i, 43 + (t - 43) * lerp(1, 0.3, calma), 640, SY - 300);
            nuvem(c, px, py, 82, a, ic => { ic.save(); ic.scale(0.9, 0.9); ic.translate(0, -16); icone(ic, tipo, t); ic.restore(); });
          });
          // zzz
          if (t > 53.6) { const [hx, hy] = cabecaDeitado(DEITA[0], DEITA[1], -Math.PI / 2); c.save(); c.font = '900 56px Inter, sans-serif'; c.fillStyle = '#d8e4ff'; c.textAlign = 'center'; for (let k = 0; k < 3; k++) { const u = ((t - 53.6) * 0.4 + k / 3) % 1; c.globalAlpha = Math.sin(u * Math.PI) * 0.9; c.fillText('z', hx + 40 + u * 120, hy - 120 - u * 160); } c.restore(); }
        });
        st.overlay('#06081e', lerp(0.18, 0.05, calma));
      },
    };
  },
};
