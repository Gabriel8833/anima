// "Misandria" — animação 2D explicativa
import { TAU, lerp, clamp, sstep, win, kf, easeInOut, easeIn, easeOut, easeBack, rng, impulse } from '../../../motor/base.js';
import { glow, sparkle, speedLines, circle, line, rrect, ellipse, shape, poly, vgrad } from '../../../motor/desenho.js';
import { teo, bia, ana, lu, davi, leo, jorge, beto, caio } from '../../../personagens/elenco.js';
import { CASA, casa, cidade, etiqueta, balaoTexto } from '../../../cenarios/casa.js';

const W = 1080, H = 1920;
const tempos = await (await fetch(new URL('../tempos.json', import.meta.url))).json();
const S = id => { const f = tempos.narracao.find(n => n.id === id); return [f.inicio, f.fim]; };
const piscada = (t, f = 3.2, o = 0) => (((t + o) % f) < 0.12 ? 1 : 0);
const respira = (P, t, o = 0) => { P.squash = Math.sin(t * 2.3 + o) * 0.012; };
const fala = (t, [a, b]) => (t > a && t < b ? ['aberta', 'meia', 'o', 'meia', 'aberta'][Math.floor(t * 11) % 5] : null);
const ini = id => S(id)[0] - 0.3;
const B = [0, ini('2a'), ini('3a'), ini('4a'), ini('5b'), ini('6a'), tempos.duracao];
const CH = CASA.chao;
const heroi = () => { const P = teo(); P.d.perna = '#16161c'; return P; };
function anda(P, t, vel = 10) { P.walk = t * vel; P.ik(-1, -64 + Math.sin(t * vel) * 26, -150); P.ik(1, 64 - Math.sin(t * vel) * 26, -150); }
const txt = (st, s, x, y, o) => st.text(s, x, y, o);
const celular = (c, s) => { c.save(); c.rotate(-0.3 * s); rrect(c, -18, -56, 36, 62, 6, '#1a1a22', { lw: 4 }); rrect(c, -13, -50, 26, 48, 3, '#7ac8ff', { stroke: null }); c.restore(); };

// ================= 1. A PERGUNTA =================
export const c1 = {
  inicio: B[0], fim: B[1],
  criar(st) {
    const T = heroi(), P = [davi(), bia(), jorge(), lu(), leo()];
    return {
      desenhar(t) {
        const c = st.c;
        if (t < 2.4) {
          c.fillStyle = '#0a0a12'; c.fillRect(0, 0, W, H);
          const k = easeBack(clamp((t - 0.5) / 0.35)), z = 1 + easeIn(clamp((t - 1.5) / 0.9)) * 7;
          glow(c, W / 2, H / 2, 500, '#e2473a', 0.3 * k);
          txt(st, 'MISANDRIA', W / 2, H / 2, { size: 150, fill: '#ffffff', scale: k * z, lw: 22, alpha: k });
          if (t > 0.5 && t < 0.8) st.setCam(540, 960, 1, 0, [Math.sin(t * 60), 0]);
          return;
        }
        // rua movimentada: ele caminha sorrindo, mexendo no celular
        const x = lerp(300, 700, clamp((t - 2.4) / (B[1] - 2.4)));
        st.setCam(x + 40, 1440, 1.5);
        cidade(st, t);
        st.mundo(cc => {
          P.forEach((p, i) => { p.reset(); const dir = i % 2 ? -1 : 1; p.x = ((t * 140 * dir + i * 380 + 2000) % 1800) - 400; p.y = CH + 30 - (i % 3) * 30; p.piscar = piscada(t, 3, i); anda(p, t + i, 10); p.olhar = [dir, 0]; p.boca = Math.sin(t * 2 + i) > 0.4 ? 'sorriso' : 'reta'; p.s = 0.95; p.draw(cc, t); });
          T.reset(); T.x = x; T.y = CH + 60; anda(T, t, 9); T.maoD = celular; T.ik(1, 50, -230); T.frente = [false, true]; T.olhar = [0.4, 0.8]; T.exp = 'feliz'; T.boca = 'sorriso'; T.piscar = piscada(t);
          T.draw(cc, t);
        });
      },
    };
  },
};

// ================= 2. O JULGAMENTO =================
export const c2 = {
  inicio: B[1], fim: B[2],
  criar(st) {
    const T = heroi(), A = ana(), Bi = bia(), D = davi(), L = lu();
    return {
      desenhar(t) {
        const [a0, a1] = S('2a'), [b0, b1] = S('2b'), [c0, c1] = S('2c');
        const entra = easeOut(clamp((t - B[1] - 0.2) / 2.4)), x = lerp(-300, 330, entra);
        let cam = [lerp(250, 520, entra), 1400, 1.25];
        if (t > b0) cam = [600, 1380, 1.35];
        if (t > c1 - 0.2) cam = [330, 1440, lerp(1.8, 2.8, easeOut(clamp((t - c1 + 0.2) / 0.6)))];
        st.setCam(...cam);
        casa(st, t, { abre: 1, celular: false });
        st.mundo(cc => {
          const grupo = [[A, 760], [Bi, 920], [D, 1070], [L, 610]];
          grupo.forEach(([p, gx], i) => { p.reset(); p.x = gx; p.y = CH - 10 + (i % 2) * 14; p.piscar = piscada(t, 3, i); respira(p, t, i); p.ik(-1, -66, -150); p.ik(1, 66 + Math.sin(t * 4 + i) * 20, -170 - Math.abs(Math.sin(t * 4 + i)) * 40); p.boca = Math.floor(t * 6 + i) % 3 ? 'meia' : 'sorriso'; p.olhar = [i % 2 ? -1 : 1, 0]; p.exp = 'feliz'; });
          if (t > b0) { // a personagem olha, cruza os braços, desprezo
            A.olhar = [-1, 0]; A.exp = 'normal'; A.palp = 0.4; A.sobA = [0.3, -0.3]; A.boca = 'lado'; A.frente = [true, true]; A.ik(-1, 30, -190); A.ik(1, -30, -180); A.headTilt = -0.1;
            [Bi, D, L].forEach(p => { p.olhar = [-1, 0]; p.boca = 'reta'; p.exp = 'normal'; });
          }
          const fA = fala(t, [c0, c1]); if (fA) A.boca = fA;
          grupo.forEach(([p]) => p.draw(cc, t));
          T.reset(); T.x = x; T.y = CH + 20; T.piscar = piscada(t); respira(T, t);
          if (entra < 1) { anda(T, t, 9); T.exp = 'feliz'; T.boca = 'sorriso'; T.olhar = [1, 0]; } else { T.ik(-1, -66, -150); T.ik(1, 66, -150); T.olhar = [1, 0]; T.boca = 'sorriso'; }
          if (t > b0 + 0.5) { T.boca = 'reta'; T.olhar = [1, 0]; }
          if (t > c0) { T.exp = 'choque'; T.boca = 'o'; T.olhoTam = 1.1; T.sob = [-12, -12]; T.jump = impulse(t, c0 + 0.2, 16, 0.2); }
          if (t > c1) { T.exp = 'preocupado'; T.boca = 'torto'; T.suor = 1; T.olhar = [0.6, 0]; T.olhoTam = 1; }
          T.draw(cc, t);
          balaoTexto(cc, 720, 1080, 'Homem é tudo igual!', sstep(c0, c0 + 0.25, t), -1, 560);
        });
      },
    };
  },
};

// ================= 3. A GENERALIZAÇÃO =================
export const c3 = {
  inicio: B[2], fim: B[3],
  criar(st) {
    const T = heroi(), A = ana(), sil = [beto(), davi(), leo(), jorge(), caio()];
    return {
      desenhar(t) {
        const c = st.c;
        const [a0, a1] = S('3a'), [b0, b1] = S('3b');
        const fase = t < a0 + 1.0 ? 0 : (t < b0 ? 1 : (t < b0 + 1.8 ? 2 : 3));
        const an = (t - B[2]) * 0.6;
        st.setCam(480 + Math.sin(an) * 80, 1420, lerp(1.6, 2.0, clamp((t - B[2]) / 6)), Math.sin(an * 1.3) * 0.06);
        casa(st, t, { abre: 1, celular: false });
        // silhuetas de homens recebendo a etiqueta, ao fundo
        st.mundo(cc => {
          cc.save(); cc.globalAlpha = 0.45;
          sil.forEach((p, i) => { p.reset(); p.x = -260 + i * 300; p.y = CH - 120; p.s = 0.85; p.exp = 'preocupado'; p.boca = 'reta'; p.ik(-1, -66, -150); p.ik(1, 66, -150); p.draw(cc, t); });
          cc.restore();
          cc.save(); cc.globalCompositeOperation = 'source-atop'; cc.restore();
          sil.forEach((p, i) => { const te = B[2] + 1.2 + i * 0.7; etiqueta(cc, -260 + i * 300, CH - 340, easeBack(clamp((t - te) / 0.25)), (i % 2 ? 0.12 : -0.12)); });
          // a pessoa que interrompe
          A.reset(); A.x = 700; A.y = CH; A.piscar = piscada(t, 3); respira(A, t); A.olhar = [-1, 0]; A.boca = 'reta'; A.exp = 'normal'; A.palp = 0.35; A.sobA = [0.25, -0.25];
          if (fase === 0 || fase === 2) { A.ik(-1, -150, -270); A.olhar = [-1, 0]; A.boca = 'meia'; }        // gesto de "pare"
          else { A.ik(-1, -66, -150); A.rostoX = 12; A.olhar = [1, -0.2]; A.headTilt = 0.15; A.frente = [true, true]; A.ik(-1, 30, -190); A.ik(1, -30, -180); }   // vira o rosto
          A.draw(cc, t);
          // o protagonista tentando explicar, cada vez mais frustrado
          T.reset(); T.x = 340; T.y = CH + 20; T.piscar = piscada(t); respira(T, t);
          const g = Math.sin(t * 8);
          T.ik(-1, -110 + g * 20, -260); T.ik(1, 110 - g * 20, -250); T.boca = Math.floor(t * 9) % 2 ? 'aberta' : 'meia'; T.olhar = [1, 0];
          const frust = clamp((t - B[2]) / (B[3] - B[2]));
          if (fase === 0 || fase === 2) { T.boca = 'o'; T.ik(-1, -80, -200); T.ik(1, 80, -200); T.exp = 'choque'; }
          if (frust > 0.5) { T.exp = 'preocupado'; T.sob = [6 * frust, 6 * frust]; T.sobA = [0.2, -0.2]; T.suor = 1; }
          if (fase === 3) { T.exp = 'raiva'; T.blush = 0.6; T.ik(-1, -72, -330); T.ik(1, 72, -330); T.frente = [true, true]; T.boca = 'tremendo'; }
          T.draw(cc, t);
        });
        const cut = [a0 + 1.0, b0, b0 + 1.8].some(a => t > a && t < a + 0.08);
        if (cut) st.overlay('#ffffff', 0.4);
      },
    };
  },
};

// ================= 4. EXPLICAÇÃO DO CONCEITO =================
const FRASES = [['HOMEM É TUDO IGUAL', -140, 520, -0.12], ['TODO HOMEM É ASSIM', 150, 700, 0.1], ['NENHUM PRESTA', -170, 1180, 0.08], ['CULPADO POR SER HOMEM', 120, 1380, -0.06]];
const DEF = ['AVERSÃO', 'OU', 'PRECONCEITO', 'CONTRA', 'HOMENS.'];
export const c4 = {
  inicio: B[3], fim: B[4],
  criar(st) {
    const T = heroi();
    return {
      desenhar(t) {
        const c = st.c;
        const [a0, a1] = S('4a'), [b0, b1] = S('4b');
        const [d0, d1] = S('5a'); const some = sstep(b0 - 0.4, b0 + 0.4, t), titulo = easeBack(clamp((t - b1 + 1.0) / 0.35));
        st.setCam(540, lerp(1100, 1000, clamp((t - B[3]) / 14)), lerp(1.0, 1.12, clamp((t - B[3]) / 14)));
        st.mundo(cc => {
          vgrad(cc, -600, -600, 2300, 3200, [[0, '#14101e'], [1, '#2a1424']]);
          glow(cc, 540, 1100, 700, '#e2473a', 0.18 + 0.05 * Math.sin(t * 3));
          // holofote
          cc.save(); cc.globalCompositeOperation = 'lighter'; cc.globalAlpha = 0.18; cc.fillStyle = '#ffe8c0'; cc.beginPath(); cc.moveTo(500, -100); cc.lineTo(580, -100); cc.lineTo(860, 1780); cc.lineTo(220, 1780); cc.closePath(); cc.fill(); cc.restore();
          ellipse(cc, 540, 1790, 300, 50, 'rgba(255,232,192,0.2)', { stroke: null });
          T.reset(); T.x = 540; T.y = 1780; T.piscar = piscada(t, 2.6); respira(T, t);
          T.exp = 'preocupado'; T.boca = 'triste'; T.olhar = [Math.sin(t * 1.5), -0.3]; T.ik(-1, -50, -110); T.ik(1, 50, -110); T.squash = 0.03; T.lean = Math.sin(t) * 0.02;
          if (some > 0.5) { T.olhar = [0, -0.6]; T.exp = 'normal'; T.boca = 'reta'; }
          if (t > d0) { T.olhar = [Math.sin(t * 0.9) * 0.5, -0.8]; T.headY = -4; }
          T.draw(cc, t);
        });
        FRASES.forEach(([s, dx, y, r], i) => {
          const ap = easeBack(clamp((t - B[3] - 0.3 - i * 0.9) / 0.3)), a = ap * (1 - some);
          if (a <= 0.01) return;
          c.save(); c.translate(W / 2 + dx + Math.sin(t * 2 + i) * 10, y); c.rotate(r + Math.sin(t * 1.5 + i) * 0.03); txt(st, s, 0, 0, { size: 50, fill: '#ff6a5a', alpha: a, scale: ap, lw: 12 }); c.restore();
        });
        if (titulo > 0) {
          txt(st, 'MISANDRIA', W / 2, 560, { size: 150, fill: '#ffffff', scale: titulo, lw: 22, glow: 'rgba(226,71,58,0.9)' });
          DEF.forEach((w, i) => { const k = easeBack(clamp((t - d0 - 0.3 - i * 0.5) / 0.3)); if (k <= 0) return; txt(st, w, W / 2 + [-90, 190, 0, -165, 175][i], [740, 740, 830, 920, 920][i] - (1 - k) * 80, { size: 62, fill: '#ffe14a', scale: k, lw: 14 }); });
        }
      },
    };
  },
};

// ================= 5. DIFERENÇA IMPORTANTE =================
export const c5 = {
  inicio: B[4], fim: B[5],
  criar(st) {
    const Ch = beto(), Mu = lu(), Cr = ana(), Ge = bia(), multidao = [davi(), leo(), jorge(), caio(), heroi()];
    return {
      desenhar(t) {
        const c = st.c;
        const [a0, a1] = S('5a'), [b0, b1] = S('5b');
        const foco = sstep(b0 + 1.4, b0 + 1.9, t);     // 0: destaca o painel de baixo (generalização), 1: o de cima (crítica)
        // título de cada painel e marcas
        const painel = (k, desenha) => { c.save(); c.beginPath(); c.rect(0, k * 960, W, 960); c.clip(); c.translate(0, k * 960 + 480 - 960); st.setCam(540, 1430, 1.25); desenha(); c.restore(); };
        // painel de cima: criticar uma atitude machista específica
        painel(0, () => {
          casa(st, t, { abre: 1, celular: false });
          st.mundo(cc => {
            Mu.reset(); Mu.x = 360; Mu.y = CH; Mu.piscar = piscada(t, 3); Mu.olhar = [1, 0]; Mu.exp = 'preocupado'; Mu.boca = 'o'; Mu.ik(-1, -66, -150); Mu.ik(1, 110, -250);
            Ch.reset(); Ch.x = 600; Ch.y = CH; Ch.piscar = piscada(t, 2.8); Ch.olhar = [-1, 0]; Ch.boca = Math.floor(t * 9) % 2 ? 'aberta' : 'meia'; Ch.exp = 'normal'; Ch.palp = 0.3; Ch.ik(-1, -170, -260 + Math.sin(t * 8) * 20); Ch.ik(1, 66, -150);
            Cr.reset(); Cr.x = 880; Cr.y = CH; Cr.piscar = piscada(t, 3.3); Cr.olhar = [-1, 0.1]; Cr.exp = 'normal'; Cr.boca = 'meia'; Cr.ik(-1, -170, -250); Cr.ik(1, 66, -150);
            Mu.draw(cc, t); Ch.draw(cc, t); Cr.draw(cc, t);
            // o balão enorme dele atropelando o dela (a atitude)
            shape(cc, c => { c.roundRect(300, 1040, 380, 150, 60); }, '#ffffff', { lw: 6 }); for (let k = 0; k < 3; k++) rrect(cc, 340, 1080 + k * 30, 300 - k * 60, 14, 6, '#9aa0b8', { stroke: null });
            shape(cc, c => c.roundRect(180, 1170, 140, 70, 30), '#ffffff', { lw: 5, alpha: 0.6 });
            circle(cc, 490, 1115, 150 + Math.sin(t * 6) * 6, null, { stroke: '#35a868', lw: 10 });
          });
        });
        // painel de baixo: apontar para todos os homens
        painel(1, () => {
          casa(st, t, { abre: 1, celular: false });
          st.mundo(cc => {
            multidao.forEach((p, i) => { p.reset(); p.x = 420 + i * 120; p.y = CH + (i % 2) * 20; p.s = 0.8; p.piscar = piscada(t, 3, i); p.exp = 'preocupado'; p.boca = 'reta'; p.olhar = [-1, 0]; p.ik(-1, -60, -140); p.ik(1, 60, -140); p.draw(cc, t); });
            Ge.reset(); Ge.x = 220; Ge.y = CH; Ge.piscar = piscada(t, 3); Ge.olhar = [1, 0]; Ge.exp = 'raiva'; Ge.boca = Math.floor(t * 8) % 2 ? 'aberta' : 'grito'; Ge.ik(1, 170, -240 + Math.sin(t * 2) * 60); Ge.ik(-1, -66, -150); Ge.draw(cc, t);
            for (let i = 0; i < 5; i++) etiqueta(cc, 420 + i * 120, CH - 330, 0.55, i % 2 ? 0.1 : -0.1);
            line(cc, [[380, 1200], [1000, 1200]], '#e2473a', 6); shape(cc, c => c.roundRect(360, 1180, 660, 600, 40), null, { stroke: '#e2473a', lw: 10 });
          });
        });
        // escurece o painel fora de foco
        c.save(); c.globalAlpha = 0.5 * (1 - foco); c.fillStyle = '#0a0a12'; c.fillRect(0, 0, W, 960); c.restore();
        c.save(); c.globalAlpha = 0.45 * foco; c.fillStyle = '#0a0a12'; c.fillRect(0, 960, W, 960); c.restore();
        rrect(c, -10, 952, W + 20, 16, 0, '#ffffff', { lw: 5 });
        // rótulos
        txt(st, 'CRITICAR UMA ATITUDE', W / 2, 110, { size: 58, fill: '#ffffff', lw: 12, alpha: 0.6 + 0.4 * foco });
        txt(st, 'ATACAR UM GRUPO INTEIRO', W / 2, 1070, { size: 58, fill: '#ffffff', lw: 12, alpha: 1 - 0.4 * foco });
        const ok = easeBack(clamp((t - b0 - 2.1) / 0.3)), no = easeBack(clamp((t - b0 - 0.2) / 0.3));
        if (ok > 0) { c.save(); c.translate(940, 820); c.scale(ok, ok); circle(c, 0, 0, 70, '#35a868', { lw: 7 }); line(c, [[-32, 0], [-8, 26], [34, -28]], '#ffffff', 14); c.restore(); }
        if (no > 0) { c.save(); c.translate(940, 1780); c.scale(no, no); circle(c, 0, 0, 70, '#e2473a', { lw: 7 }); line(c, [[-28, -28], [28, 28]], '#ffffff', 14); line(c, [[28, -28], [-28, 28]], '#ffffff', 14); c.restore(); }
      },
    };
  },
};

// ================= 6. CONCLUSÃO =================
export const c6 = {
  inicio: B[5], fim: B[6],
  criar(st) {
    const T = heroi(), G = [bia(), davi(), ana(), leo(), lu(), jorge()];
    return {
      desenhar(t) {
        const c = st.c;
        const [a0, a1] = S('6a'), [b0, b1] = S('6b'), [c0, c1] = S('6c');
        const luz = sstep(B[5], B[5] + 4, t), z = lerp(1.25, 2.1, easeInOut(clamp((t - B[5]) / (B[6] - B[5]))));
        st.setCam(540, lerp(1380, 1340, luz), z);
        casa(st, t, { abre: 1, celular: false });
        st.mundo(cc => {
          // homens e mulheres convivendo: conversam, trabalham juntos, se cumprimentam
          G.forEach((p, i) => { p.reset(); p.x = [60, 210, 860, 1010, 1150, -80][i]; p.y = CH - 40 - (i % 2) * 20; p.s = 0.85; p.piscar = piscada(t, 3, i); respira(p, t, i); p.exp = 'feliz'; p.boca = Math.floor(t * 5 + i) % 3 ? 'sorriso' : 'aberta'; p.olhar = [i % 2 ? -1 : 1, 0]; p.ik(-1, -66, -150); p.ik(1, 90 + Math.sin(t * 3 + i) * 20, -230); });
          G[0].ik(1, 150, -300); G[1].ik(-1, -150, -300);        // toca aqui
          G.forEach(p => p.draw(cc, t));
          if (Math.sin(t * 3) > 0.95) sparkle(cc, 135, 1430, 18, '#ffe14a', 1);
          T.reset(); T.x = 540; T.y = CH + 30; T.piscar = piscada(t, 3.4); respira(T, t); T.olhar = [0, 0]; T.exp = 'normal'; T.boca = 'reta'; T.ik(-1, -66, -150); T.ik(1, 66, -150);
          if (t > c0) { T.boca = 'sorriso'; T.blush = 0.3; }
          T.draw(cc, t);
        });
        st.overlay('#0a0a14', 0.65 * (1 - luz));
        const fr = easeBack(clamp((t - c0 - 0.3) / 0.4));
        if (fr > 0) { txt(st, 'RESPEITO', W / 2, 360, { size: 120, fill: '#ffffff', scale: fr, lw: 20 }); txt(st, 'NÃO TEM GÊNERO.', W / 2, 500, { size: 96, fill: '#ffe14a', scale: fr, lw: 18 }); }
        st.overlay('#000', sstep(B[6] - 1.0, B[6], t));
      },
    };
  },
};
