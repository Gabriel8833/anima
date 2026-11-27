// "Por que sentimos vontade de rir em momentos sérios?" — cenas 2D
import { TAU, lerp, clamp, sstep, win, kf, easeInOut, easeIn, easeOut, easeBack, rng, impulse } from '../../../motor/base.js';
import { glow, sparkle, speedLines, circle, line, rrect, ellipse, shape, cloud, poly, limb, vgrad } from '../../../motor/desenho.js';
import { kaua, bia, ana, lu, davi, leo, jorge, beto, caio, dedos } from '../../../personagens/elenco.js';
import { escritorio, cadeira, mesa, detetive } from '../../../cenarios/lugares.js';
import { salaAula, carteira, funeral, banco, centroControle, alavanca, placaRisada } from '../../../cenarios/casa.js';

const W = 1080, H = 1920;
const tempos = await (await fetch(new URL('../tempos.json', import.meta.url))).json();
tempos.duracao = 56.0;
const S = id => { const f = tempos.narracao.find(n => n.id === id); return [f.inicio, f.fim]; };
const piscada = (t, f = 3.2, o = 0) => (((t + o) % f) < 0.12 ? 1 : 0);
const respira = (P, t, o = 0) => { P.squash = Math.sin(t * 2.3 + o) * 0.012; };
const ini = id => S(id)[0] - 0.25;
const B = [0, ini('2a'), ini('3a'), ini('4a'), ini('5a'), ini('6a'), ini('7a'), tempos.duracao];
const DESK = 1600, SY = DESK + 96;          // aluno sentado atrás da carteira
const PX = 540;

function sentado(P, x, y = SY, s = 1) { P.reset(); P.s = s; P.semPernas = true; P.x = x; P.y = y; P.ik(-1, -70, -150); P.ik(1, 70, -150); return P; }
// colegas sérios
function colegas(cc, t, L, olharPara = null) {
  const fundo = [[L[0], 120, 0.8], [L[1], 380, 0.8], [L[2], 700, 0.8], [L[3], 960, 0.8]];
  fundo.forEach(([p, x, s], i) => { sentado(p, x, SY - 170, s); p.piscar = piscada(t, 3.5, i); respira(p, t, i); p.boca = 'reta'; p.palp = 0.3; p.olhar = olharPara != null ? [clamp((PX - x) / 300, -1, 1), 0.3] : [0.2, -0.2]; p.sobA = [0.12, -0.12]; p.draw(cc, t); carteira(cc, x, DESK - 170 * 1, 220); });
}
// moldura com o cérebro (janelinha)
function janelaCerebro(st, t, x, y, r, a, fn) {
  if (a <= 0.01) return; const c = st.c, k = easeBack(clamp(a));
  c.save(); c.translate(x, y); c.scale(k, k);
  circle(c, 0, 0, r, '#c87ae0', { lw: 10 }); c.beginPath(); c.arc(0, 0, r - 6, 0, TAU); c.clip();
  const g = c.createLinearGradient(0, -r, 0, r); g.addColorStop(0, '#ff9ec4'); g.addColorStop(1, '#7a4ac8'); c.fillStyle = g; c.fillRect(-r, -r, 2 * r, 2 * r);
  fn(c); c.restore(); circle(c, x, y, r * k, null, { stroke: '#2b1f2a', lw: 8 });
}
const oculosEscuros = (c, x, y, s) => { c.save(); c.translate(x, y); c.scale(s, s); for (const sd of [-1, 1]) rrect(c, sd * 62 - 46, -40, 92, 56, 20, '#141418', { lw: 6 }); line(c, [[-16, -16], [16, -16]], '#141418', 8); ellipse(c, -80, -26, 14, 6, 'rgba(255,255,255,0.5)', { stroke: null }); c.restore(); };
const narizPalhaco = (c, x, y, s) => { circle(c, x, y + 28 * s, 26 * s, '#e8302a', { lw: 5 }); ellipse(c, x - 8 * s, y + 20 * s, 7 * s, 5 * s, '#ffffff', { stroke: null, alpha: 0.7 }); };
const buzina = (c, x, y) => { shape(c, c => { c.moveTo(x, y); c.lineTo(x + 70, y - 34); c.lineTo(x + 70, y + 34); c.closePath(); }, '#f4c430', { lw: 5 }); circle(c, x - 18, y, 26, '#e8302a', { lw: 5 }); };

// ================= 1. O PIOR MOMENTO POSSÍVEL =================
export const c1 = {
  inicio: B[0], fim: B[1],
  criar(st) {
    const K = kaua(), L = [lu(), beto(), ana(), leo()], Pr = jorge(), V = [davi(), bia()];
    return {
      desenhar(t) {
        const treme = t > 2.2, sorri = t > 3.3, mao = t > 3.8;
        let cam;
        if (t < 1.0) cam = [PX, 1390, 2.6];
        else if (t < 2.0) cam = [540, 1250, 0.95];
        else if (t < 4.3) cam = [PX, 1390, lerp(2.4, 2.8, (t - 2) / 2.3)];
        else if (t < 5.0) cam = [PX + 8, 1380, 4.4];
        else cam = [PX, 1360, 1.5];
        st.setCam(cam[0], cam[1], cam[2], 0, t > 4.3 && t < 4.5 ? [Math.sin(t * 60) * 0.4, 0] : [0, 0]);
        salaAula(st, t);
        st.mundo(cc => {
          Pr.reset(); Pr.x = 880; Pr.y = 1500; Pr.piscar = piscada(t, 3); Pr.olhar = [-0.6, 0.3]; Pr.boca = Math.floor(t * 8) % 2 ? 'aberta' : 'meia'; Pr.sobA = [0.2, -0.2]; Pr.ik(-1, -170, -300 + Math.sin(t * 3) * 30); Pr.ik(1, 66, -150); Pr.draw(cc, t);
          colegas(cc, t, L);
          [[V[0], 240], [V[1], 840]].forEach(([p, x], i) => { sentado(p, x); p.piscar = piscada(t, 3.1, i + 2); respira(p, t, i); p.boca = 'reta'; p.palp = 0.3; p.olhar = [0.3, -0.2]; p.sobA = [0.12, -0.12]; p.draw(cc, t); carteira(cc, x, DESK); });
          sentado(K, PX); K.piscar = piscada(t); respira(K, t); K.olhar = [0.2, -0.2]; K.boca = 'reta';
          if (treme) { K.boca = 'tremendo'; K.tremor = 0.2; }
          if (sorri) { K.boca = 'sorriso'; }
          if (mao) { K.exp = 'normal'; K.olhoTam = 1.15; K.pupila = 0.6; K.frente = [false, true]; K.ik(1, 6, -246); K.sob = [-12, -12]; K.suor = sstep(4.5, 5, t); }
          if (t > 5.0) { K.olhar = [Math.sin((t - 5) * 5) > 0 ? -1 : 1, 0]; K.rostoX = K.olhar[0] * 5; }
          K.draw(cc, t); carteira(cc, PX, DESK);
        });
      },
    };
  },
};

// ================= 2. A LUTA CONTRA A RISADA =================
export const c2 = {
  inicio: B[1], fim: B[2],
  criar(st) {
    const K = kaua(), L = [lu(), beto(), ana(), leo()];
    return {
      desenhar(t) {
        const c = st.c, [a0, a1] = S('2a');
        const cerebro = t > a0 + 1.5 && t < a0 + 2.45;
        if (cerebro) {
          // o cérebro de óculos escuros apertando "RISADA"
          const ap = win(t, a0 + 1.75, a0 + 1.85, a0 + 2.05, a0 + 2.2);
          st.setCam(470, 1180, 1.45);
          escritorio(st, t);
          st.mundo(cc => {
            cadeira(cc, 360, 1440, Math.sin(t * 3) * 0.06);
            detetive(cc, 360, 1130, 0.62, t, { olhar: [0.6, 0.2], piscar: 0, boca: 'sorriso', sob: [8, -18], pernas: { sentado: true, balanca: 1 }, maoE: [-200, 140], maoD: [lerp(200, 380, ap), lerp(140, 300, ap)] });
            oculosEscuros(cc, 360, 1130 - 10 * 0.62, 0.62);
            mesa(cc, 520, 1440, 720);
            placaRisada(cc, 600, 1420, ap);
          });
          return;
        }
        const n = Math.floor((t - B[1]) / 0.42), sw = Math.sin(t * 13) * 0.25;
        st.setCam(PX + Math.sin(t * 7) * 6, 1390, lerp(2.3, 2.7, clamp((t - B[1]) / 3)), sw * 0.04);
        salaAula(st, t);
        st.mundo(cc => {
          colegas(cc, t, L);
          sentado(K, PX); K.piscar = 0; K.suor = 1; K.olhoTam = 1.08;
          const g = clamp(n / 7);
          const tent = n % 6;
          if (tent === 0) { K.boca = 'bico'; K.sob = [4, 4]; K.sobA = [0.2, -0.2]; }                              // morde os lábios
          if (tent === 1) { K.ik(-1, -40, -110); K.ik(1, 40, -110); K.boca = 'tremendo'; K.squash = 0.03; }        // aperta as pernas
          if (tent === 2) { K.olhar = [0, -1]; K.headY = -6; K.rostoY = -8; K.boca = 'sorriso'; }                 // olha para o teto
          if (tent === 3) { K.frente = [false, true]; K.ik(1, 10, -250); K.exp = 'fechado'; K.boca = 'o'; K.jump = Math.abs(Math.sin(t * 25)) * 6; } // finge tossir
          if (tent === 4) { K.bochecha = 1; K.boca = 'bico'; K.olhoTam = 1.2; }                                      // enche as bochechas
          if (tent === 5) { K.exp = 'fechado'; K.aperta = 1; K.boca = 'aberta'; K.tremor = 0.4; }                  // fecha os olhos com força
          if (g > 0.5 && K.boca === 'tremendo') K.boca = 'sorriso';
          K.vermelho = 0.3 * g;
          K.draw(cc, t); carteira(cc, PX, DESK);
        });
      },
    };
  },
};

// ================= 3. O FUNERAL E A PIADA IDIOTA =================
function patoBike(c, x, y, t) {
  c.save(); c.translate(x, y);
  for (const wx of [-60, 60]) { circle(c, wx, 40, 34, null, { stroke: '#2a2a30', lw: 7 }); c.save(); c.translate(wx, 40); c.rotate(t * 8); line(c, [[-30, 0], [30, 0]], '#9a9aa8', 2); line(c, [[0, -30], [0, 30]], '#9a9aa8', 2); c.restore(); }
  line(c, [[-60, 40], [0, 40], [30, -10], [-30, -10], [-60, 40]], '#2c78dc', 6); line(c, [[30, -10], [60, 40]], '#2c78dc', 6);
  ellipse(c, -6, -40, 44, 30, '#f4d03a', { lw: 4 }); circle(c, 30, -76, 24, '#f4d03a', { lw: 4 });
  shape(c, c => c.arc(30, -80, 28, Math.PI, 0), '#e2473a', { lw: 4 }); rrect(c, 30, -84, 30, 10, 3, '#9ad0ff', { lw: 2 });
  poly(c, [[50, -72], [72, -68], [50, -62]], '#f29a2a', { lw: 3 }); circle(c, 38, -76, 3, '#2b1f2a', { stroke: null });
  const p = t * 8; for (const s of [-1, 1]) line(c, [[-6, -16], [Math.cos(p + (s > 0 ? Math.PI : 0)) * 14, 40 + Math.sin(p + (s > 0 ? Math.PI : 0)) * 14]], '#f29a2a', 5);
  c.restore();
}
export const c3 = {
  inicio: B[2], fim: B[3],
  criar(st) {
    const K = kaua(), Vz = lu(), Ou = [beto(), ana()];
    return {
      desenhar(t) {
        const [a0, a1] = S('3a'), [b0, b1] = S('3b');
        const bal = sstep(b0, b0 + 0.35, t), olha = t > b0 + 0.5, sorri = sstep(b0 + 0.8, b0 + 1.4, t), baixa = t > b0 + 1.7, desconf = t > b0 + 2.1, finge = t > b0 + 2.4;
        st.setCam(lerp(520, 560, clamp((t - B[2]) / 7)), lerp(1300, 1340, bal), lerp(1.25, 1.8, sstep(a0, b0 + 0.5, t)));
        funeral(st, t);
        st.mundo(cc => {
          const BY = 1520;
          [[Vz, 300], [K, 560], [Ou[0], 820], [Ou[1], 1040]].forEach(([p, x], i) => {
            sentado(p, x, BY + 96 + 30, p === K ? 1 : 0.95); p.piscar = piscada(t, 3.4, i); respira(p, t, i);
            p.exp = 'preocupado'; p.boca = 'triste'; p.palp = 0.35; p.olhar = [0, 0.4]; p.lagrima = p !== K ? 0.8 : 0;
            if (p !== K) { p.frente = [false, true]; p.ik(1, 10, -250); }
          });
          if (desconf) { Vz.lagrima = 0; Vz.olhar = [1, 0]; Vz.palp = 0.5; Vz.sobA = [0.3, -0.1]; Vz.exp = 'normal'; Vz.boca = 'reta'; Vz.frente = [false, false]; Vz.ik(1, 70, -150); }
          K.exp = 'preocupado'; K.boca = 'triste';
          if (olha) { K.olhar = [0.3, -1]; K.headY = -4; }
          if (sorri > 0) { K.exp = 'normal'; K.boca = sorri > 0.6 ? 'sorriso' : 'reta'; K.olhoTam = 1.1; }
          if (baixa) { K.olhar = [0, 1]; K.headY = 4; K.boca = 'tremendo'; K.tremor = 0.6; K.suor = 1; }
          if (finge) { K.frente = [true, true]; K.ik(-1, -26, -306); K.ik(1, 26, -306); K.tremor = 1; K.exp = 'fechado'; }
          [Vz, K, ...Ou].forEach(p => p.draw(cc, t));
          banco(cc, 600, BY, 1300);
          // balão de pensamento: pato de capacete andando de bicicleta
          if (bal > 0) {
            const [hx, hy] = K.cabeca(), k = easeBack(bal);
            for (const [dx, dy, r] of [[40, -110, 12], [70, -160, 20]]) circle(cc, hx + dx, hy + dy, r * k, '#ffffff', { lw: 4 });
            cc.save(); cc.translate(hx + 120, hy - 330); cc.scale(k, k); cloud(cc, 0, 40, 210, '#ffffff', { stroke: '#2b1f2a', seed: 5 });
            cc.beginPath(); cc.ellipse(0, -10, 200, 130, 0, 0, TAU); cc.clip(); cc.fillStyle = '#c8ecff'; cc.fillRect(-220, -150, 440, 300); cc.fillStyle = '#9ad06a'; cc.fillRect(-220, 70, 440, 100);
            patoBike(cc, lerp(-150, 150, ((t - b0) * 0.4) % 1), 10, t); cc.restore();
          }
        });
      },
    };
  },
};

// ================= 4. O CORPO ENTREGANDO TUDO =================
export const c4 = {
  inicio: B[3], fim: B[4],
  criar(st) {
    const K = kaua(), Vz = lu();
    return {
      desenhar(t) {
        const [a0, a1] = S('4a'), [b0, b1] = S('4b');
        const q = t - B[3];
        const BY = 1520, ky = BY + 126;
        let cam;
        if (q < 0.9) cam = [PX, ky - 300 + 36, 6.0];             // boca
        else if (q < 1.7) cam = [PX, ky - 310, 5.0];             // olhos lacrimejando
        else if (q < 2.5) cam = [PX, 1360, 1.9];                 // tremendo como máquina
        else if (q < 3.6) cam = [PX, 1430, 2.4];                 // segura a barriga / punhos / respira
        else cam = [PX, 1330, lerp(2.0, 2.5, clamp((t - b0) / 1.8))];  // panela de pressão
        const zum = [0.9, 1.7, 2.5, 3.0, 3.6].some(a => q > a && q < a + 0.08);
        st.setCam(cam[0], cam[1], cam[2] * (zum ? 1.08 : 1), 0, q > 1.7 && q < 2.5 || t > b0 ? [Math.sin(t * 50) * 0.3, 0] : [0, 0]);
        funeral(st, t);
        st.mundo(cc => {
          sentado(Vz, 300, ky, 0.95); Vz.exp = 'normal'; Vz.boca = 'reta'; Vz.olhar = [1, 0]; Vz.palp = 0.5; Vz.sobA = [0.3, -0.1]; Vz.draw(cc, t);
          sentado(K, PX, ky); K.boca = 'tremendo'; K.olhar = [0, 0.8]; K.suor = 1; K.vermelho = 0.4;
          if (q >= 0.9) { K.lagrima = 1; K.exp = 'fechado'; K.aperta = 0.6; }
          if (q >= 1.7) { K.tremor = 2.5; K.exp = 'normal'; K.olhoTam = 1.15; K.pupila = 0.5; }
          if (q >= 2.5) { K.ik(-1, -30, -150); K.ik(1, 30, -150); K.frente = [true, true]; K.tremor = 1; }   // segura a barriga
          if (q >= 3.0) { K.ik(-1, -90, -170); K.ik(1, 90, -170); K.frente = [false, false]; K.squash = -0.05 * Math.sin((q - 3.0) * 6); K.bochecha = 0.6; } // punhos + respira
          if (t > b0) { K.vermelho = 1; K.tremor = 1.5; K.bochecha = 1; K.boca = 'bico'; K.olhoTam = 1.2; K.lagrima = 0.6; }
          K.draw(cc, t);
          banco(cc, 600, BY, 1300);
          // vapor saindo das orelhas
          if (t > b0) { const [hx, hy] = K.cabeca(); for (const s of [-1, 1]) for (let k = 0; k < 3; k++) { const u = ((t * 1.6 + k / 3) % 1); cloud(cc, hx + s * (70 + u * 120), hy - u * 90, 18 + u * 26, 'rgba(255,255,255,0.85)', { seed: k, alpha: 1 - u }); } }
        });
      },
    };
  },
};

// ================= 5. A EXPLICAÇÃO DO CÉREBRO =================
export const c5 = {
  inicio: B[4], fim: B[5],
  criar(st) {
    const K = kaua();
    return {
      desenhar(t) {
        const c = st.c, [a0, a1] = S('5a'), [b0, b1] = S('5b');
        const estresse = 1 - 0.55 * sstep(b0 + 1.0, b1, t), tensao = lerp(0.3, 0.95, sstep(a0, b0, t)) - 0.4 * sstep(b0 + 1.0, b1, t), vapor = sstep(b0 + 0.6, b0 + 1.0, t);
        st.setCam(540, lerp(1000, 1050, clamp((t - B[4]) / 6)), lerp(1.1, 1.0, clamp((t - B[4]) / 6)));
        centroControle(st, t, { estresse, tensao, vapor });
        st.mundo(cc => {
          const pux = Math.sin(t * 9), cansa = sstep(b0 + 1.0, b1, t);
          alavanca(cc, 380, 1360, -0.5 + pux * 0.4 * (1 - cansa));
          alavanca(cc, 700, 1360, 0.5 - pux * 0.4 * (1 - cansa), '#f4c430');
          detetive(cc, 540, 1180, 0.55, t, { olhar: [Math.sin(t * 6), 0.3], piscar: 0, boca: cansa > 0.5 ? 'sorriso' : 'grito', aflito: cansa < 0.5, suor: 1 - cansa, tam: 1.1, pernas: { walk: t * 14 * (1 - cansa) }, maoE: [-290 + pux * 30, 230 - pux * 60], maoD: [290 - pux * 30, 230 + pux * 60] });
        });
        // o corpo soltando a tensão em ondas (janelinha)
        if (t > b0) janelaCerebro(st, t, 820, 330, 190, sstep(b0, b0 + 0.3, t), cc => {
          const fake = { x: 0, y: 260 }; K.reset(); K.s = 0.6; K.x = 0; K.y = 240; K.semPernas = true; K.exp = 'feliz'; K.boca = 'aberta'; K.ik(-1, -70, -150); K.ik(1, 70, -150); K.draw(cc, t);
          for (let k = 0; k < 3; k++) { const u = (t * 0.9 + k / 3) % 1; circle(cc, 0, 80, 60 + u * 180, null, { stroke: `rgba(255,255,255,${0.7 * (1 - u)})`, lw: 6 }); }
        });
        // vermelho que vai suavizando
        c.save(); c.globalCompositeOperation = 'multiply'; c.globalAlpha = 0.25 * estresse; c.fillStyle = '#ff3a3a'; c.fillRect(0, 0, W, H); c.restore();
        // entrada: mergulho na cabeça
        const ent = 1 - easeOut(clamp((t - B[4]) / 0.5)); if (ent > 0) st.overlay('#ff9ec4', ent);
      },
    };
  },
};

// ================= 6. A DESCARGA DE TENSÃO =================
export const c6 = {
  inicio: B[5], fim: B[6],
  criar(st) {
    const K = kaua(), L = [lu(), beto(), ana(), leo()], V = [davi(), bia()];
    return {
      desenhar(t) {
        const [a0, a1] = S('6a');
        const cresce = sstep(a0, a0 + 2.0, t), ri = t > a0 + 2.1, desc = sstep(a0 + 2.1, a0 + 3.0, t);
        st.setCam(PX, lerp(1360, 1390, sstep(a0 + 3.4, a1, t)), lerp(1.45, 2.8, sstep(a0 + 3.4, a1 + 0.3, t)));
        salaAula(st, t, { tens: 0.6 });
        st.mundo(cc => {
          colegas(cc, t, L);
          [[V[0], 240], [V[1], 840]].forEach(([p, x], i) => { sentado(p, x); p.piscar = piscada(t, 3.1, i); p.boca = 'reta'; p.palp = 0.35; p.olhar = [x < PX ? 1 : -1, 0]; p.sobA = [0.15, -0.15]; p.draw(cc, t); carteira(cc, x, DESK); });
          sentado(K, PX); K.piscar = 0; K.suor = 1; K.boca = 'tremendo'; K.olhar = [0, 0.3]; K.vermelho = 0.5 + 0.5 * cresce;
          if (ri) { K.exp = 'feliz'; K.boca = Math.floor(t * 10) % 2 ? 'aberta' : 'sorriso'; K.jump = Math.abs(Math.sin(t * 12)) * 8 * (1 - sstep(a0 + 3.0, a0 + 3.4, t)); }
          if (t > a0 + 3.4) { K.exp = 'normal'; K.olhoTam = 1.2; K.pupila = 0.55; K.boca = 'bico'; K.olhar = [0, 0]; K.vermelho = 1; K.tremor = 0.3; }
          K.draw(cc, t);
          // a bola vermelha do estresse dentro dele
          const r = 40 + 110 * cresce * (1 - desc);
          if (r > 42) { cc.save(); cc.globalAlpha = 0.55; cc.globalCompositeOperation = 'source-over'; circle(cc, PX, SY - 190, r, '#ff3a3a', { lw: 5 }); glow(cc, PX, SY - 190, r * 1.5, '#ff2a2a', 0.5); cc.restore(); }
          if (desc > 0 && desc < 1) for (let k = 0; k < 18; k++) { const an = k / 18 * TAU, d = desc * 320; sparkle(cc, PX + Math.cos(an) * d, SY - 190 + Math.sin(an) * d * 0.7, 14, '#ffb0a0', 1 - desc); }
          carteira(cc, PX, DESK);
        });
        // o cérebro puxa a alavanca de emergência
        janelaCerebro(st, t, 820, 330, 190, win(t, a0 + 1.4, a0 + 1.7, a0 + 3.2, a0 + 3.5), cc => {
          const pu = sstep(a0 + 1.8, a0 + 2.0, t);
          alavanca(cc, 70, 150, lerp(-0.6, 0.6, pu));
          detetive(cc, -40, 40, 0.34, t, { olhar: [1, 0], piscar: 0, boca: 'grito', aflito: true, pernas: {}, maoE: [-200, 150], maoD: [lerp(220, 300, pu), lerp(-180, -40, pu)] });
          if (pu > 0) for (let k = 0; k < 4; k++) { const u = (t * 1.2 + k / 4) % 1; cloud(cc, -20 + Math.sin(k) * 60, 60 - u * 200, 40 + u * 40, 'rgba(255,255,255,0.9)', { seed: k, alpha: pu * (1 - u) }); }
        });
      },
    };
  },
};

// ================= 7. O FINAL CÔMICO =================
export const c7 = {
  inicio: B[6], fim: B[7],
  criar(st) {
    const K = kaua(), L = [lu(), beto(), ana(), leo()], V = [davi(), bia()], Pr = jorge();
    return {
      desenhar(t0) {
        const c = st.c, [a0, a1] = S('7a'), [b0, b1] = S('7b'), [c0, c1] = S('7c'), [d0, d1] = S('7d');
        const T_SOLTA = d1 + 0.0, T_FREEZE = B[7] - 1.6, T_CORTE = B[7] - 1.2;
        const t = t0 > T_FREEZE ? T_FREEZE : t0;
        if (t0 > T_CORTE) { c.fillStyle = '#0a0a12'; c.fillRect(0, 0, W, H); const k = easeBack(clamp((t0 - T_CORTE) / 0.2)); c.save(); c.translate(W / 2, H / 2); c.scale(k * 2.2, k * 2.2); buzina(c, -30, 0); c.restore(); for (let i = 0; i < 6; i++) { const an = i / 6 * TAU; line(c, [[W / 2 + Math.cos(an) * 200, H / 2 + Math.sin(an) * 200], [W / 2 + Math.cos(an) * 280, H / 2 + Math.sin(an) * 280]], '#f4c430', 10, k); } return; }
        const todosOlham = t > b0;
        let cam = [PX, 1380, 2.2];
        if (t > b0 && t < c0) cam = [540, 1260, 1.0];
        if (t >= c0) cam = [PX, 1385, lerp(2.0, 2.6, sstep(c0, c1, t))];
        if (t >= d0) cam = [PX, 1370, 1.8];
        if (t >= T_SOLTA) cam = [PX, 1375, lerp(2.0, 2.9, sstep(T_SOLTA, T_FREEZE, t))];
        st.setCam(cam[0], cam[1], cam[2], 0, t >= T_SOLTA && t0 < T_FREEZE ? [Math.sin(t * 40) * 0.4, 0] : [0, 0]);
        salaAula(st, t, { tens: 0.4 });
        st.mundo(cc => {
          Pr.reset(); Pr.x = 880; Pr.y = 1500; Pr.piscar = piscada(t, 3); Pr.olhar = todosOlham ? [-0.8, 0.5] : [-0.6, 0.3]; Pr.boca = todosOlham ? 'reta' : (Math.floor(t * 8) % 2 ? 'aberta' : 'meia'); Pr.sobA = [0.25, -0.25]; Pr.ik(-1, todosOlham ? -66 : -170, todosOlham ? -150 : -300); Pr.ik(1, 66, -150); Pr.draw(cc, t);
          colegas(cc, t, L, todosOlham ? PX : null);
          [[V[0], 240], [V[1], 840]].forEach(([p, x], i) => { sentado(p, x); p.piscar = piscada(t, 3.1, i); p.boca = 'reta'; p.palp = 0.35; p.olhar = todosOlham ? [x < PX ? 1 : -1, 0] : [0.3, -0.2]; p.sobA = [0.15, -0.15]; p.draw(cc, t); carteira(cc, x, DESK); });
          sentado(K, PX); K.piscar = 0; K.suor = 1; K.vermelho = 0.7; K.boca = 'tremendo'; K.olhar = [0, 0.4];
          if (t > a0 + 2.6 && t < b0) { K.bochecha = 1; K.boca = 'bico'; if (t > b0 - 0.4) { K.bochecha = 0; K.boca = 'aberta'; K.exp = 'feliz'; } }
          if (todosOlham && t < c0) { K.exp = 'normal'; K.boca = 'o'; K.olhoTam = 1.2; K.pupila = 0.45; K.olhar = [Math.sin(t * 6) > 0 ? -1 : 1, 0]; K.tremor = 0; }
          if (t >= c0 && t < c1 - 0.8) { const g = sstep(c0, c1 - 0.8, t); K.tremor = 0.5 + g * 1.5; K.boca = g > 0.5 ? 'sorriso' : 'bico'; K.aperta = 0.5; K.olhar = [0, 1]; K.lagrima = g; }
          if (t >= c1 - 0.8 && t < d0 + 1.2) { K.exp = 'fechado'; K.boca = 'o'; K.squash = -0.04; K.vermelho = 0.3; K.tremor = 0; K.suor = 0.5; }          // alívio
          if (t >= d0 + 1.2) { K.exp = 'normal'; K.boca = 'tremendo'; K.olhar = [0.6, -0.8]; K.tremor = 0.6; K.vermelho = 0.6; }
          if (t >= d0 + 2.6) { K.frente = [true, true]; K.ik(-1, -26, -306); K.ik(1, 26, -306); K.tremor = 1.2; K.exp = 'fechado'; }
          if (t >= T_SOLTA) { K.frente = [false, false]; K.exp = 'feliz'; K.boca = 'grito'; K.lagrima = 1; K.vermelho = 0.8; K.headTilt = Math.sin(t * 10) * 0.08; K.headY = -6; K.ik(-1, -110, -160 - Math.abs(Math.sin(t * 9)) * 60); K.ik(1, 110, -260); K.jump = Math.abs(Math.sin(t * 10)) * 14; K.tremor = 0; }
          K.draw(cc, t); carteira(cc, PX, DESK);
        });
        // o cérebro: válvula aberta na hora errada; depois, o modo palhaço
        janelaCerebro(st, t, 820, 330, 190, win(t, a0 + 1.0, a0 + 1.3, b0 - 0.2, b0), cc => {
          detetive(cc, -20, 30, 0.36, t, { olhar: [0.5, 0], piscar: piscada(t), boca: 'sorriso', pernas: { sentado: true, balanca: 1 }, maoE: [-200, 150], maoD: [260, -60] });
          for (let k = 0; k < 4; k++) { const u = (t * 1.2 + k / 4) % 1; cloud(cc, 90, 20 - u * 200, 30 + u * 40, 'rgba(255,255,255,0.9)', { seed: k, alpha: 1 - u }); }
        });
        janelaCerebro(st, t, 820, 330, 200, sstep(d0 + 0.6, d0 + 0.9, t), cc => {
          const dan = Math.sin(t * 8);
          cc.save(); cc.rotate(dan * 0.15);
          detetive(cc, 0, 10 - Math.abs(dan) * 30, 0.38, t, { olhar: [0, 0], piscar: piscada(t, 1.2), boca: 'sorriso', pernas: { walk: t * 16 }, maoE: [-260, -160 + dan * 80], maoD: [240, 60], segura: [null, (c, x, y) => buzina(c, x, y)] });
          narizPalhaco(cc, 0, 10 - Math.abs(dan) * 30 - 10 * 0.38, 0.38);
          cc.restore();
          if (Math.floor(t * 3) % 2) for (let i = 0; i < 3; i++) line(cc, [[120 + i * 20, 40 - i * 30], [150 + i * 24, 30 - i * 36]], '#f4c430', 6);
        });
        if (t0 > T_FREEZE) st.overlay('#ffffff', 0.08);
      },
    };
  },
};
