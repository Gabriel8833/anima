// "Por que olhamos para cima quando tentamos lembrar?" — cenas 2D
import { TAU, lerp, clamp, sstep, win, kf, easeInOut, easeIn, easeOut, easeBack, rng, impulse } from '../../../motor/base.js';
import { glow, sparkle, speedLines, circle, line, rrect, ellipse, shape } from '../../../motor/desenho.js';
import { paginasVoando } from '../../../motor/efeitos.js';
import { rafa, davi, bia, jorge, leo, acessoriosJorge, copo, papel, pasta } from '../../../personagens/elenco.js';
import { sala, mesaFrente, simbolo, balaoPergunta, paredeGavetas, pisoBiblioteca, gavetaAberta, gavetaPos, escada, livro, conexao, lembranca, cerebro, BIB } from '../../../cenarios/lugares.js';

const W = 1080, H = 1920;
const piscada = (t, f = 3.4, o = 0) => (((t + o) % f) < 0.12 ? 1 : 0);
const respira = (P, t, o = 0) => { P.squash = Math.sin(t * 2.2 + o) * 0.012; };
const fala = (t, a, b) => (t > a && t < b ? ['aberta', 'meia', 'o', 'meia'][Math.floor(t * 9) % 4] : null);

// posições na sala
const RX = 520, DX = 840, CHAO = 1730;

function poseRafa(R, t) { R.reset(); R.x = RX; R.y = CHAO; R.maoD = copo(R.d.pele); R.piscar = piscada(t); respira(R, t); R.ik(1, 70, -140); R.ik(-1, -66, -128); return R; }
function poseDavi(D, t) { D.reset(); D.x = DX; D.y = CHAO + 8; D.piscar = piscada(t, 3.1, 1.3); respira(D, t, 1); D.olhar = [-0.9, 0]; D.ik(-1, -70, -130); D.ik(1, 66, -128); return D; }

// texto da "resposta" desfocada no teto
function palavraBorrada(c, x, y, txt, a, borr, t) {
  if (a <= 0.01) return;
  c.save(); c.font = '900 120px Inter, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
  const n = 10;
  for (let i = 0; i < n; i++) {
    const an = i / n * TAU + t, r = 6 + borr * 26;
    c.globalAlpha = a * (borr > 0.05 ? 0.16 : 1) * (i === 0 || borr > 0.05 ? 1 : 0);
    c.fillStyle = '#2f3a6a'; c.fillText(txt, x + Math.cos(an) * r * (borr > 0.05 ? 1 : 0), y + Math.sin(an) * r * 0.5 * (borr > 0.05 ? 1 : 0));
  }
  c.restore();
}

// desenha uma camada borrada (reduz e amplia de novo): barato e sem filtros
const BK = 7;
let off = null, oc = null;
function borrado(st, k, p, fn) {
  if (k <= 0.01) return;
  if (!off) { off = document.createElement('canvas'); off.width = Math.ceil(W / BK); off.height = Math.ceil(H / BK); oc = off.getContext('2d'); }
  const cam = st.cam, z = 1 + (cam.zoom - 1) * p;
  oc.setTransform(1, 0, 0, 1, 0, 0); oc.clearRect(0, 0, off.width, off.height);
  oc.setTransform(1 / BK, 0, 0, 1 / BK, 0, 0); oc.translate(W / 2, H / 2); oc.scale(z, z); oc.translate(-(540 + (cam.x - 540) * p), -(960 + (cam.y - 960) * p));
  fn(oc);
  const c = st.c; c.save(); c.globalAlpha = clamp(k); c.imageSmoothingEnabled = true; c.imageSmoothingQuality = 'high'; c.drawImage(off, 0, 0, W, H); c.restore();
}
const visivel = st => { const k = st.cam, hw = 560 / k.zoom, hh = 980 / k.zoom; return { x0: k.x - hw, x1: k.x + hw, y0: k.y - hh, y1: k.y + hh }; };

// ================= 1. A PERGUNTA (0 – 8.2) =================
export const c1 = {
  inicio: 0, fim: 8.2,
  criar(st) {
    const R = rafa(), D = davi();
    return {
      desenhar(t) {
        // câmera: plano geral -> desliza até os dois -> aproxima do rosto
        const u1 = easeInOut(clamp(t / 2.6)), u2 = easeInOut(clamp((t - 4.8) / 3.4));
        st.setCam(lerp(lerp(40, 680, u1), RX, u2), lerp(lerp(1250, 1330, u1), 1435, u2), lerp(lerp(1.02, 1.3, u1), 2.7, u2));
        sala(st, t);
        poseRafa(R, t); poseDavi(D, t);
        // Rafa conversa tranquilo, copo na mão
        R.olhar = [0.8, 0]; R.boca = fala(t, 0.3, 2.4) || 'sorriso';
        R.ik(-1, lerp(-70, -112, win(t, 0.4, 0.8, 1.8, 2.3)), lerp(-128, -200, win(t, 0.4, 0.8, 1.8, 2.3)));
        // ergue o copo e para no meio do caminho
        const sobe = easeOut(clamp((t - 2.9) / 0.6));
        R.ik(1, lerp(70, 52, sobe), lerp(-140, -205, sobe));
        if (t > 3.5) {
          R.boca = 'meia';
          // olhos correm de um lado para o outro (só os olhos)
          const dart = t < 4.7 ? [[-1, 0.1], [1, 0.1], [-1, -0.2], [1, 0], [-0.6, 0.2]][Math.floor((t - 3.5) / 0.24) % 5] : [0.2, 0];
          R.olhar = dart;
          R.sob = [lerp(0, -12, sstep(4.4, 4.6, t)), lerp(0, -16, sstep(4.55, 4.75, t))];
        }
        if (t > 4.9) {
          // inclina a cabeça para trás e olha para cima
          const k = easeOut(clamp((t - 4.9) / 0.5));
          R.olhar = [lerp(0.2, 0.35, k) + Math.sin(t * 2.5) * 0.08 * k, lerp(0, -1, k)];
          R.headY = -8 * k; R.rostoY = -9 * k; R.lean = -0.03 * k; R.headTilt = -0.05 * k;
          R.sob = [-12 - 4 * k, -22 * k - 6];
          R.boca = t > 6 ? 'lado' : 'o'; R.piscar = piscada(t, 2.7, 0.5);
        }
        // Davi escuta, vira o corpo para ele e pergunta
        D.boca = t < 2.6 ? (Math.sin(t * 3) > 0.6 ? 'sorriso' : 'reta') : (fala(t, 2.8, 3.9) || 'reta');
        D.headY = t < 2.6 ? Math.abs(Math.sin(t * 4)) * -4 : 0;
        const vira = easeOut(clamp((t - 2.5) / 0.45));
        D.x = lerp(DX, DX - 50, vira); D.lean = -0.07 * vira; D.walk = t > 2.5 && t < 2.95 ? t * 14 : null; D.rostoX = -6 * vira;
        if (t > 2.7) { const g = win(t, 2.75, 3.0, 4.2, 4.6); D.ik(-1, lerp(-70, -118, g), lerp(-130, -232, g)); D.ik(1, lerp(66, 100, g), lerp(-128, -190, g)); D.sob = [-10 * g, -10 * g]; }
        if (t > 4.6) { D.sob = [-6, -14]; D.boca = 'sorriso'; }
        st.mundo(c => {
          D.draw(c, t); R.draw(c, t);
          balaoPergunta(c, D.x - 70, 1180, win(t, 2.8, 3.1, 4.9, 5.2), t, 1);
          // "tchan!" quando olha para cima
          if (t > 5.0) { const a = win(t, 5.0, 5.15, 6.2, 6.6); for (let i = 0; i < 6; i++) { const an = -Math.PI / 2 + (i - 2.5) * 0.35, [hx, hy] = R.cabeca(); line(c, [[hx + Math.cos(an) * 105, hy + Math.sin(an) * 105], [hx + Math.cos(an) * (125 + 20 * a), hy + Math.sin(an) * (125 + 20 * a)]], '#2b1f2a', 6, a); } }
        });
        mesaFrente(st, t, 40);
      },
    };
  },
};

// ================= 2. A RESPOSTA NO TETO (8.2 – 13.8) =================
const SIMB = [[9.0, 360, -560, '?', '#e2575c'], [9.15, 860, -660, 'A', '#2f7fe0'], [9.3, 470, -800, '7', '#35a868'], [9.45, 780, -380, 'lamp'], [9.6, 260, -300, 'B', '#8a5cc7'],
  [9.75, 980, -330, '3', '#f29a2a'], [9.9, 640, -880, '?', '#2f7fe0'], [10.05, 200, -720, 'lamp'], [10.2, 980, -820, 'C', '#e2575c'], [10.3, 520, -300, '!', '#35a868']];
export const c2 = {
  inicio: 8.2, fim: 13.8,
  criar(st) {
    const R = rafa(), D = davi();
    return {
      desenhar(t) {
        if (t < 11.4) {
          // a câmera sobe seguindo o olhar até o teto
          const u = easeInOut(clamp((t - 8.2) / 0.9));
          st.setCam(lerp(RX, 620, u), lerp(1435, -560, u) - (t - 9.1) * 12 * sstep(9.1, 9.3, t), lerp(2.7, 1.05, easeOut(clamp((t - 8.2) / 0.9))) + (t - 9.1) * 0.03 * sstep(9.1, 9.3, t));
          sala(st, t);
          poseRafa(R, t); poseDavi(D, t); R.olhar = [0.35, -1]; R.headY = -8; R.rostoY = -9; R.sob = [-16, -28]; R.boca = 'lado'; R.ik(1, 52, -205);
          st.mundo(c => {
            D.draw(c, t); R.draw(c, t);
            for (const [t0, x, y, tp, cor] of SIMB) {
              const k = easeBack(clamp((t - t0) / 0.3)), sai = sstep(10.6, 11.1, t);
              simbolo(c, x + Math.sin(t * 1.7 + x) * 20 + (x - 600) * sai * 0.5, y + Math.cos(t * 1.3 + y) * 16, tp, k * (1 - sai * 0.4), 1 - sai, Math.sin(t * 2 + x) * 0.2, cor);
            }
            // a palavra surge desfocada e some antes de dar para ler
            const ap = win(t, 10.1, 10.5, 10.9, 11.35);
            palavraBorrada(c, 620, -580, 'RESPOSTA', ap, 1 - 0.55 * sstep(10.2, 10.7, t) + 0.6 * sstep(10.85, 11.3, t), t * 3);
          });
          if (t < 9.1) { const a = win(t, 8.2, 8.35, 8.8, 9.1); speedLines(st.c, W / 2, H / 2, 70, 260, 1300, a * 0.8, t, '#ffffff'); }
          return;
        }
        // corte para o rosto: aperta os olhos, mão na testa, inclina o pescoço... frustração
        poseRafa(R, t);
        const k = easeOut(clamp((t - 11.4) / 0.4)), fr = sstep(12.5, 12.7, t), dar = sstep(13.0, 13.3, t);
        R.olhar = [0.25, -1]; R.headY = -6; R.rostoY = -8 * (1 - fr) - 4; R.headTilt = 0.14 * k * (1 - fr * 0.6) + Math.sin(t * 2) * 0.02; R.lean = 0.04 * k;
        R.aperta = 0.75 * k * (1 - fr); R.palp = 0.35 * k * (1 - fr);
        R.sob = [lerp(-4, 4, fr), lerp(-10, 6, fr)]; R.sobA = [0.1 * k, -0.15 * k];
        R.boca = fr > 0.5 ? (t > 13.0 ? 'triste' : 'tremendo') : 'bico';
        R.frente = [true, false];
        const mao = 1 - sstep(12.6, 12.9, t);
        R.ik(-1, lerp(-66, -30, mao * k), lerp(-128, -372, mao * k));
        if (fr > 0.5) { R.exp = 'raiva'; R.olhar = [0, 0]; R.frente = [false, false]; R.ik(-1, lerp(-66, -116, dar), lerp(-128, -210, dar)); R.ik(1, lerp(52, 110, dar), lerp(-205, -215, dar)); if (dar > 0.2) { R.exp = 'preocupado'; R.sob = [-6, -6]; } }
        const [hx, hy] = R.cabeca();
        st.setCam(hx + 10, hy + 70 + Math.sin(t) * 6, 2.5 + (t - 11.4) * 0.06, 0, fr > 0 && t < 12.9 ? [Math.sin(t * 50) * 0.6, 0] : [0, 0]);
        sala(st, t);
        st.mundo(c => {
          R.draw(c, t);
          // fumacinha de frustração e o X de erro
          if (fr > 0) for (let i = 0; i < 3; i++) { const u = ((t - 12.5) * 1.4 + i / 3) % 1; c.save(); c.globalAlpha = (1 - u) * fr; circle(c, hx + (i - 1) * 40, hy - 100 - u * 80, 16 + u * 14, '#f6f2ea', { lw: 4 }); c.restore(); }
          const e = easeBack(clamp((t - 12.65) / 0.25)) * (1 - sstep(13.4, 13.7, t));
          if (e > 0.01) { c.save(); c.translate(hx + 150, hy - 120); c.scale(e, e); circle(c, 0, 0, 50, '#e2575c', { lw: 6 }); line(c, [[-20, -20], [20, 20]], '#ffffff', 12); line(c, [[20, -20], [-20, 20]], '#ffffff', 12); c.restore(); }
        });
      },
    };
  },
};

// ---------- biblioteca ----------
const GA = { i: 6, j: 1 };            // gaveta que se abre sozinha (cena 3)
const GT = { i: 11, j: 0 };           // gaveta com a lembrança (cena 4)
const CAMINHO = [[4, 4, 22.6], [6, 7, 23.1], [13, 5, 23.6], [12, 2, 24.1], [GT.i, GT.j, 24.6]];
function luzes(t) {
  const m = new Map();
  for (const [i, j, t0] of CAMINHO) m.set(i + ',' + j, sstep(t0, t0 + 0.25, t) * (t > 27.4 && !(i === GT.i && j === GT.j) ? 1 - 0.6 * sstep(27.4, 28, t) : 1));
  m.set('2,6', sstep(23.3, 23.6, t) * 0.8); m.set('15,3', sstep(23.9, 24.2, t) * 0.8);
  return m;
}
function fundoBib(st, t, opts) {
  const v = visivel(st);
  st.mundo(c => { paredeGavetas(c, t, { ...opts, vis: v }); pisoBiblioteca(c, t); escada(c, 60 + Math.sin(t * 0.5) * 180, -200, BIB.chao); });
}

// livros bagunçados no chão (cena 3) que voltam a se organizar (cena 4)
const LIVROS = [[120, 1690, 0.4, '#e2575c'], [230, 1700, -0.6, '#2f7fe0'], [640, 1696, 0.9, '#35a868'], [720, 1688, -0.2, '#f4c430'], [520, 1702, 2.6, '#8a5cc7']];
function livros(c, t) {
  LIVROS.forEach(([x, y, r, cor], i) => {
    const u = easeInOut(clamp((t - 21.0 - i * 0.12) / 0.8));
    const tx = -40 + i * 24, ty = 1620, px = lerp(x, tx + 700, u), py = lerp(y, 1380 - i * 34, u) - Math.sin(u * Math.PI) * 200;
    livro(c, px, py, lerp(r, 0, u), cor, u > 0.05 && u < 0.95 ? 1 : 0, t);
  });
}

// ================= 3. ENTRANDO NO CÉREBRO (13.8 – 21.0) =================
export const c3 = {
  inicio: 13.8, fim: 21.0,
  criar(st) {
    const R = rafa(), m = rafa();
    return {
      desenhar(t) {
        const c = st.c;
        if (t < 15.9) {
          // mergulho no olho: o rosto olha para a câmera e a pupila vira uma passagem
          poseRafa(R, t); R.olhar = [0, 0]; R.exp = 'normal'; R.sob = [-8, -8]; R.pupila = lerp(1, 1.7, sstep(14.2, 15.0, t)); R.piscar = 0;
          const [ex, ey] = R.olhoMundo(1);
          const u = clamp((t - 13.8) / 1.9), z = lerp(2.6, 60, easeIn(u) ** 1.4);
          const [hx, hy] = R.cabeca();
          const cx = lerp(hx + 10, ex, easeInOut(clamp(u * 2.2))), cy = lerp(hy + 70, ey, easeInOut(clamp(u * 2.2)));
          st.setCam(cx, cy, z);
          sala(st, t);
          st.mundo(cc => R.draw(cc, t));
          const rpup = 6.5 * R.pupila * z * (1 + 3 * sstep(15.2, 15.9, t) ** 2);
          if (z > 12) {
            const sx = W / 2 + (ex - cx) * z, sy = H / 2 + (ey - cy) * z;
            c.save(); c.beginPath(); c.arc(sx, sy, rpup, 0, TAU); c.clip();
            st.setCam(520, 1250, lerp(1.0, 1.25, sstep(15.0, 15.9, t)));
            fundoBib(st, t, {}); st.mundo(cc => livros(cc, 0));
            c.restore();
            c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha = 0.5 * sstep(14.8, 15.3, t) * (1 - sstep(15.6, 15.9, t)); c.strokeStyle = '#ffe27a'; c.lineWidth = 18; c.beginPath(); c.arc(sx, sy, rpup, 0, TAU); c.stroke(); c.restore();
          }
          return;
        }
        // dentro da biblioteca
        m.reset(); m.s = 0.55; m.y = BIB.chao; m.piscar = piscada(t, 2.9); respira(m, t);
        const corre = clamp((t - 15.9) / 1.3);
        m.x = lerp(-120, 380, easeOut(corre));
        if (corre < 1) { m.walk = t * 18; m.lean = 0.16; m.ik(-1, -90 + Math.sin(t * 18) * 30, -170); m.ik(1, 90 - Math.sin(t * 18) * 30, -170); m.exp = 'normal'; m.boca = 'aberta'; m.olhar = [1, 0]; }
        else if (t < 18.3) {
          // olha os corredores
          const lado = Math.sin((t - 17.2) * 4.2);
          m.olhar = [lado, -0.3]; m.rostoX = lado * 8; m.boca = 'o'; m.sob = [-8, -8];
          m.frente = [false, true]; m.ik(1, 34, -330); m.ik(-1, -60, -130);
        } else {
          m.olhar = [-1, -0.4]; m.exp = t < 18.6 ? 'choque' : 'normal'; m.boca = t < 18.9 ? 'aberta' : 'reta'; m.ik(-1, -70, -130); m.ik(1, 66, -130);
          m.jump = impulse(t, 18.35, 40, 0.3);
        }
        // pega um papel, lê, se irrita e joga para cima
        const pega = t > 19.0, joga = t > 20.15;
        if (pega && !joga) {
          m.maoD = papel(0.1); m.frente = [false, true];
          const lendo = clamp((t - 19.0) / 0.25);
          m.ik(1, lerp(66, 26, lendo), lerp(-130, -250, lendo)); m.olhar = [0.3 + Math.sin(t * 12) * 0.5, 0.6]; m.boca = 'reta'; m.exp = 'normal';
          if (t > 19.75) { m.exp = 'raiva'; m.boca = 'tremendo'; m.olhar = [0, 0]; m.tremor = 1; }
          if (t > 19.95) m.ik(1, 70, -360);
        }
        if (joga) { m.exp = 'raiva'; m.boca = 'reta'; m.ik(1, 100, -330); m.ik(-1, -80, -120); m.olhar = [0.4, -1]; }
        const [px0, py0] = [m.x + 40, BIB.chao - 210];
        const dj = t - 20.15, papX = px0 + dj * 120, papY = py0 - dj * 1500 + dj * dj * 380;
        // câmera
        let cam;
        if (t < 16.6) cam = [lerp(520, 300, easeInOut(clamp((t - 15.9) / 0.7))), lerp(1250, 1470, easeInOut(clamp((t - 15.9) / 0.7))), lerp(1.25, 1.75, easeInOut(clamp((t - 15.9) / 0.7)))];
        else cam = [lerp(300, 330, clamp((t - 16.6) / 2)), 1470, 1.75];
        if (joga) { const f = easeInOut(clamp(dj / 0.6)); cam = [lerp(cam[0], papX, f * 0.6), lerp(cam[1], Math.min(1470, papY + 200), f), lerp(1.75, 1.45, f)]; }
        st.setCam(cam[0], cam[1], cam[2]);
        const abre = sstep(18.3, 18.45, t);
        fundoBib(st, t, { aberta: abre > 0 ? { ...GA, u: abre } : null, bagunca: win(t, 17.9, 18.0, 18.25, 18.35) * 3 });
        st.mundo(cc => {
          livros(cc, 0);
          const [gx, gy] = gavetaPos(GA.i, GA.j);
          paginasVoando(cc, gx, gy - 20, t - 18.35, 30, 520);
          m.draw(cc, t);
          if (joga) { cc.save(); cc.translate(papX, papY); cc.rotate(dj * 9); papel(0)(cc); cc.restore(); }
          if (t > 19.75 && t < 20.2) for (let i = 0; i < 3; i++) { const [hx, hy] = m.cabeca(); line(cc, [[hx - 50 + i * 50, hy - 60], [hx - 56 + i * 50, hy - 90]], '#ff5a5a', 6); }
        });
      },
    };
  },
};

// ================= 4. O CÉREBRO PROCURANDO (21.0 – 33.0) =================
export const c4 = {
  inicio: 21.0, fim: 33.0,
  criar(st) {
    const m = rafa();
    const [tx, ty] = gavetaPos(GT.i, GT.j);
    return {
      desenhar(t) {
        const c = st.c;
        m.reset(); m.s = 0.55; m.y = BIB.chao; m.piscar = piscada(t, 2.9); respira(m, t);
        // caminha entre as estantes enquanto as gavetas acendem
        const anda = clamp((t - 22.2) / 2.8);
        m.x = lerp(380, tx - 130, easeInOut(anda));
        const andando = t > 22.2 && t < 25.0;
        if (andando) { m.walk = t * 13; m.ik(-1, -80 + Math.sin(t * 13) * 24, -140); m.ik(1, 80 - Math.sin(t * 13) * 24, -140); }
        else { m.ik(-1, -66, -128); m.ik(1, 66, -128); }
        m.exp = 'normal'; m.boca = andando ? 'o' : 'reta';
        // segue com os olhos as luzes que se acendem
        let alvoOlhar = [0.6, -0.4];
        for (const [i, j, t0] of CAMINHO) if (t > t0) { const [gx, gy] = gavetaPos(i, j); alvoOlhar = [clamp((gx - m.x) / 300, -1, 1), clamp((gy - (BIB.chao - 170)) / 300, -1, 1)]; }
        m.olhar = t < 22.2 ? [0, -0.6] : alvoOlhar;
        if (t > 25.0 && t < 27.6) { m.olhar = [1, 0.2]; m.sob = [-6, -10]; m.exp = 'normal'; m.boca = 'bico'; m.ik(-1, -20, -250); m.frente = [true, false]; }
        // abre a gaveta, pega a pasta e encontra a lembrança
        const abre = sstep(30.6, 30.9, t);
        if (t > 30.4) { m.olhar = [1, 0.4]; m.ik(1, 120, -150); m.exp = 'normal'; m.boca = 'o'; }
        if (t > 31.0) { m.maoD = pasta(); m.ik(1, 70, -230); m.ik(-1, -60, -230); m.olhar = [0.2, -0.9]; m.exp = 'choque'; m.boca = 'aberta'; m.jump = impulse(t, 31.3, 30, 0.3); }
        if (t > 31.9) { m.exp = 'feliz'; m.boca = 'aberta'; m.ik(-1, -110, -330); }
        // câmera
        let cam;
        if (t < 22.2) { const u = easeInOut(clamp((t - 21.0) / 1.0)); cam = [lerp(560, 360, u), lerp(900, 1450, u), lerp(1.45, 1.6, u)]; }
        else if (t < 27.6) { cam = [lerp(360, tx - 60, easeInOut(anda)), 1460, lerp(1.6, 1.9, sstep(25.0, 27.4, t))]; }
        else if (t < 30.1) { const u = easeInOut(clamp((t - 27.6) / 1.6)); cam = [lerp(tx - 60, 520, u), lerp(1460, -330, u), lerp(1.9, 0.43, easeOut(u))]; }
        else { const u = easeInOut(clamp((t - 30.1) / 0.6)); cam = [lerp(520, tx - 40, u), lerp(-330, 1430, u), lerp(0.43, 1.75, easeIn(u))]; }
        st.setCam(cam[0], cam[1], cam[2]);
        const L = luzes(t), bl = win(t, 25.0, 25.7, 27.5, 28.0);
        const fundo = cc => { paredeGavetas(cc, t, { acesas: L, bagunca: 0, aberta: abre > 0 ? { ...GT, u: abre } : null, vis: visivel(st) }); pisoBiblioteca(cc, t); escada(cc, 60 + Math.sin(t * 0.5) * 180 + (t > 27.6 ? (t - 27.6) * 500 : 0), -200, BIB.chao); };
        st.mundo(fundo);
        // gaveta gigantesca: um degradê escuro destaca a gaveta acesa
        st.mundo(cc => {
          livros(cc, t);
          for (let k = 0; k < CAMINHO.length - 1; k++) { const [a, b, t0] = CAMINHO[k], [c2i, c2j, t1] = CAMINHO[k + 1]; conexao(cc, gavetaPos(a, b), gavetaPos(c2i, c2j), clamp((t - t0) / (t1 - t0)) * (1 - 0.7 * bl), t, k % 2 ? '#ff8fd8' : '#7af0ff'); }
          conexao(cc, gavetaPos(4, 4), gavetaPos(2, 6), clamp((t - 23.1) / 0.4) * (1 - 0.7 * bl), t, '#ffe27a', -80);
          conexao(cc, gavetaPos(13, 5), gavetaPos(15, 3), clamp((t - 23.7) / 0.4) * (1 - 0.7 * bl), t, '#ffe27a', -80);
        });
        // menos distrações: tudo em volta desfoca e escurece
        borrado(st, bl, 1, fundo);
        if (bl > 0.01 || (t > 27.6 && t < 30.6)) {
          const sc = st.cam, sx = W / 2 + (tx - sc.x) * sc.zoom, sy = H / 2 + (ty - sc.y) * sc.zoom;
          const a = Math.max(bl * 0.75, win(t, 27.8, 28.6, 29.9, 30.4) * 0.6);
          const g = c.createRadialGradient(sx - 120 * sc.zoom, sy, 60 * sc.zoom, sx - 120 * sc.zoom, sy, 420 * sc.zoom);
          g.addColorStop(0, 'rgba(10,4,20,0)'); g.addColorStop(1, `rgba(10,4,20,${a})`); c.fillStyle = g; c.fillRect(0, 0, W, H);
        }
        st.mundo(cc => {
          if (bl > 0.01 || t > 27.6) gavetaAberta(cc, GT.i, GT.j, abre, t, '#ffe27a');
          glow(cc, tx, ty, 260, '#ffe27a', 0.6 + 0.3 * Math.sin(t * 6));
          if (t > 27.6 && t < 30.4) { const a = win(t, 28.0, 28.4, 29.8, 30.2); for (let k = 0; k < 3; k++) { const r = 200 + ((t * 300 + k * 160) % 480); cc.save(); cc.globalAlpha = a * (1 - r / 680); circle(cc, tx, ty, r, null, { stroke: '#ffe27a', lw: 14 }); cc.restore(); } }
          m.draw(cc, t);
          const pop = easeBack(clamp((t - 31.2) / 0.4));
          if (pop > 0) { lembranca(cc, m.x + 30, BIB.chao - 400, 0.62 * pop, 1, t); for (let k = 0; k < 6; k++) { const an = k / 6 * TAU + t * 1.5; sparkle(cc, m.x + 30 + Math.cos(an) * 190, BIB.chao - 400 + Math.sin(an) * 140, 16, '#fff6c8', pop); } }
        });
      },
    };
  },
};

// ================= 5. CADA PESSOA TEM UM JEITO (33.0 – 42.4) =================
export const c5 = {
  inicio: 33.0, fim: 42.4,
  criar(st) {
    const B = bia(), J = acessoriosJorge(jorge()), L = leo();
    const XS = [210, 540, 870];
    return {
      desenhar(t) {
        // câmera: geral -> Bia -> Jorge -> Léo
        const pts = [[33.0, 540, 1400, 1.2], [34.4, 540, 1390, 1.28], [35.0, XS[0], 1450, 2.1], [36.6, XS[0] + 20, 1450, 2.2], [37.1, XS[1], 1450, 2.1], [39.4, XS[1] + 20, 1450, 2.2], [39.9, XS[2], 1450, 2.1], [42.4, XS[2], 1440, 2.6]];
        st.setCam(...kf(t, pts.map(([a, ...v]) => [a, v])));
        sala(st, t);
        // BIA: olha para cima, coça o queixo, aperta os olhos
        B.reset(); B.x = XS[0]; B.y = CHAO; B.s = 0.95; respira(B, t); B.piscar = piscada(t, 3.3, 0.7);
        B.olhar = [0.3 + Math.sin(t * 1.3) * 0.25, -1]; B.headY = -6; B.rostoY = -8; B.headTilt = 0.08 + Math.sin(t * 1.1) * 0.03; B.aperta = 0.55 + 0.2 * Math.sin(t * 2); B.sob = [-4, -18]; B.sobA = [0, 0.15]; B.boca = 'lado';
        B.frente = [false, true]; B.ik(1, 12 + Math.sin(t * 16) * 7, -238); B.ik(-1, -40, -170); B.lean = -0.02;
        // SEU JORGE: olha para os lados, fecha os olhos, mexe os lábios
        J.reset(); J.x = XS[1]; J.y = CHAO; J.s = 0.95; respira(J, t, 2);
        const fase = (t - 33) % 4.2;
        if (fase < 2.0) { J.olhar = [Math.sin(t * 2.6) > 0 ? 1 : -1, 0.1]; J.rostoX = J.olhar[0] * 5; J.boca = 'reta'; J.piscar = piscada(t, 2.1, 0.3); }
        else { J.exp = 'fechado'; J.boca = ['o', 'meia', 'reta', 'meia', 'bico'][Math.floor(t * 10) % 5]; J.headTilt = Math.sin(t * 3) * 0.04; }
        J.ik(-1, -20, -180); J.ik(1, 30 + Math.sin(t * 2) * 6, -186); J.sob = [-6, -6];
        // LÉO: completamente parado, encarando o nada
        L.reset(); L.x = XS[2]; L.y = CHAO; L.s = 0.95;
        L.olhar = [0, 0.05]; L.pupila = 0.45; L.olhoTam = 1.12; L.boca = 'o'; L.sob = [-14, 2]; L.sobA = [0.12, -0.1]; L.ik(-1, -54, -110); L.ik(1, 54, -110); L.blush = 0;
        st.mundo(c => {
          B.draw(c, t); J.draw(c, t); L.draw(c, t);
          // uma mosca passeia pelo rosto do Léo e ele nem pisca
          const [hx, hy] = L.cabeca();
          const fx = hx + Math.sin(t * 2.3) * 110 + Math.sin(t * 7) * 14, fy = hy - 40 + Math.sin(t * 3.1) * 70;
          const pousa = sstep(41.0, 41.3, t), mx = lerp(fx, hx + 2, pousa), my = lerp(fy, hy + 10, pousa);
          circle(c, mx, my, 7, '#2a2a30', { stroke: null });
          for (const s of [-1, 1]) ellipse(c, mx + s * 7, my - 7, 8, 4 + Math.abs(Math.sin(t * 60)) * 3, 'rgba(220,240,255,0.8)', { lw: 2 }, s * 0.5);
          if (pousa < 0.9) for (let k = 0; k < 3; k++) line(c, [[mx - 20 - k * 8, my + Math.sin(t * 20 + k) * 6], [mx - 26 - k * 8, my + Math.sin(t * 20 + k) * 6]], '#2a2a30', 2, 0.5);
          // grilos / reticências do vazio
          const v = sstep(40.0, 40.4, t); if (v > 0) for (let k = 0; k < 3; k++) circle(c, hx - 40 + k * 40, hy - 140 - Math.abs(Math.sin(t * 3 + k)) * 10, 9, '#2b1f2a', { stroke: null, alpha: v * win((t - 40 + k * 0.3) % 1.4, 0, 0.1, 1.0, 1.3) });
          // "?" sobre a Bia, "..." do Jorge
          const [bx, by] = B.cabeca(); const bq = easeBack(clamp((t - 35.2) / 0.3)); if (t > 35.2) simbolo(c, bx + 90, by - 130 + Math.sin(t * 4) * 8, '?', 0.6 * bq, 1, 0.2, '#e2575c');
        });
        mesaFrente(st, t, -80);
      },
    };
  },
};

// ================= 6. FINAL HUMORÍSTICO (42.4 – 60) =================
export const c6 = {
  inicio: 42.4, fim: 60,
  criar(st) {
    const R = rafa(), D = davi();
    return {
      desenhar(t) {
        const c = st.c;
        if (t >= 57.2) {
          // tela final: o cérebro piscando
          const g = c.createRadialGradient(W / 2, H / 2 - 100, 100, W / 2, H / 2, 1100); g.addColorStop(0, '#7a4ac0'); g.addColorStop(1, '#2a1450'); c.fillStyle = g; c.fillRect(0, 0, W, H);
          c.save(); c.translate(W / 2, H / 2 - 120); c.rotate(t * 0.2); c.globalAlpha = 0.15; c.fillStyle = '#ffffff'; for (let i = 0; i < 12; i++) { c.rotate(TAU / 12); c.beginPath(); c.moveTo(0, 0); c.lineTo(-60, -1400); c.lineTo(60, -1400); c.closePath(); c.fill(); } c.restore();
          const pop = easeBack(clamp((t - 57.2) / 0.4));
          const pis = (t > 57.9 && t < 58.05) || (t > 58.9 && t < 59.05) || (t > 59.15 && t < 59.3) ? 1 : 0;
          cerebro(c, W / 2, H / 2 - 120 + Math.sin(t * 3) * 14, 1.5 * pop, t, { piscar: pis, olhar: t > 59.3 ? [0.4, -1] : [Math.sin(t * 2) * 0.4, 0] });
          for (let k = 0; k < 8; k++) { const an = k / 8 * TAU + t; sparkle(c, W / 2 + Math.cos(an) * 470, H / 2 - 120 + Math.sin(an) * 380, 20, '#fff6c8', pop * (0.5 + 0.5 * Math.sin(t * 5 + k))); }
          return;
        }
        poseRafa(R, t); poseDavi(D, t);
        // Davi pergunta de novo
        D.olhar = [-0.9, 0]; D.boca = fala(t, 43.0, 44.0) || 'reta';
        const g = win(t, 42.9, 43.2, 44.3, 44.7); D.ik(-1, lerp(-70, -118, g), lerp(-130, -232, g)); D.lean = -0.04; D.x = DX - 40;
        if (t > 44.7) { D.sob = [-6, -12]; D.boca = 'reta'; D.olhar = [-0.9, 0.1]; D.ik(1, 40, -150); D.squash = Math.max(0, Math.sin(t * 9)) * 0.01; }
        // Rafa olha para cima, pausa dramática, abaixa a cabeça...
        const sobe = easeOut(clamp((t - 44.5) / 0.4)), desce = easeInOut(clamp((t - 47.4) / 0.5));
        R.olhar = [lerp(0.8, 0.3, sobe), lerp(0, -1, sobe)];
        R.headY = -8 * sobe; R.rostoY = -9 * sobe; R.sob = [-10 * sobe, -20 * sobe]; R.boca = 'lado';
        R.ik(1, 52, -205);
        if (t > 47.4) { R.olhar = [lerp(0.3, 0.6, desce), lerp(-1, 0.1, desce)]; R.headY = -8 * (1 - desce); R.rostoY = -9 * (1 - desce); }
        // ...abre a boca como quem achou a resposta (e aponta para a cabeça)
        if (t > 48.2) {
          const ach = easeBack(clamp((t - 48.2) / 0.3));
          R.boca = 'aberta'; R.exp = 'normal'; R.olhar = [0.9, 0]; R.sob = [-16, -16]; R.pupila = 1.25; R.jump = impulse(t, 48.2, 24, 0.25);
          R.frente = [true, false]; R.ik(-1, lerp(-66, -70, ach), lerp(-128, -340, ach));
          if (t > 50.4) { const tq = Math.abs(Math.sin((t - 50.4) * 9)) * 6; R.ik(-1, -74 + tq, -318); }
        }
        // ...mas fica em silêncio: os olhos andam devagar de um lado para o outro
        if (t > 52.0) { R.olhar = [Math.sin((t - 52.0) * 2.4) * 0.9, 0]; R.boca = 'meia'; R.pupila = 1; R.sob = [-8, -8]; R.suor = sstep(52.2, 52.6, t); R.ik(-1, lerp(-74, -66, sstep(52.2, 52.6, t)), lerp(-318, -128, sstep(52.2, 52.6, t))); R.frente = [false, false]; }
        // ...e olha para o teto de novo
        if (t > 53.2) { const k = easeOut(clamp((t - 53.2) / 0.4)); R.olhar = [0.3, -k]; R.headY = -8 * k; R.rostoY = -9 * k; R.boca = 'lado'; R.sob = [-12, -22]; }
        // Davi põe a mão no rosto
        if (t > 53.7) { const k = easeOut(clamp((t - 53.7) / 0.35)); D.frente = [false, true]; D.ik(1, lerp(66, 6, k), lerp(-128, -300, k)); D.exp = 'fechado'; D.boca = 'triste'; D.headTilt = Math.sin(t * 5) * 0.06 * k; D.lean = 0.02; D.sob = [4, 4]; }
        // sorriso sem graça, câmera no rosto
        if (t > 55.2) { R.olhar = [0, 0.1]; R.headY = 0; R.rostoY = 0; R.boca = 'torto'; R.exp = 'preocupado'; R.blush = 0.6; R.suor = 1; R.sob = [-4, -10]; }
        // câmera
        const [hx, hy] = [RX, CHAO - 300];
        const pts = [[42.4, [660, 1360, 1.55]], [44.4, [660, 1380, 1.65]], [47.4, [640, 1400, 1.9]], [48.2, [600, 1420, 2.1]], [53.0, [640, 1400, 1.9]], [55.2, [660, 1390, 1.75]], [57.2, [hx, hy + 60, 3.0]]];
        const whip = 1 - sstep(42.4, 42.75, t);
        const cm = kf(t, pts);
        st.setCam(cm[0] + whip * 500, cm[1], cm[2], 0, t > 48.2 && t < 48.5 ? [Math.sin(t * 60) * 0.4, 0] : [0, 0]);
        sala(st, t);
        st.mundo(cc => {
          D.draw(cc, t); R.draw(cc, t);
          balaoPergunta(cc, D.x - 70, 1180, win(t, 42.9, 43.2, 44.6, 44.9), t, 1);
          // pausa dramática: tique-taque
          if (t > 45.0 && t < 47.4) { const a = win(t, 45.0, 45.3, 47.0, 47.4); cc.save(); cc.globalAlpha = a; cc.font = '900 54px Inter, sans-serif'; cc.textAlign = 'center'; cc.fillStyle = '#2b1f2a'; cc.fillText(Math.floor(t * 2) % 2 ? 'tic' : 'tac', RX + (Math.floor(t * 2) % 2 ? -60 : 60), 1250); cc.restore(); }
          // brilho de "achei!"
          if (t > 48.2 && t < 52.0) { const a = win(t, 48.2, 48.35, 51.6, 52.0); const [x, y] = R.cabeca(); for (let k = 0; k < 5; k++) sparkle(cc, x - 120 + k * 60, y - 140 - Math.abs(Math.sin(t * 6 + k)) * 20, 14, '#ffe46a', a); glow(cc, x, y - 150, 120, '#fff2a0', a * 0.6); }
        });
        if (whip > 0.01) speedLines(c, W / 2, H / 2, 60, 200, 1300, whip * 0.7, t, '#ffffff');
        mesaFrente(st, t, 40);
      },
    };
  },
};
