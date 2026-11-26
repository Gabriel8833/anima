// "Por que sentimos saudade de momentos que nem aproveitamos direito?" — curta 2D
import { TAU, lerp, clamp, sstep, win, kf, easeInOut, easeIn, easeOut, easeBack, rng, impulse } from '../../../motor/base.js';
import { glow, sparkle, circle, line, rrect, ellipse, shape, cloud, poly, limb, vgrad } from '../../../motor/desenho.js';
import { nico, nicoAdulto, costas, tiago, lucasK, bruno, maeN, avo, tio } from '../../../personagens/elenco.js';
import { RUA, CASA, bairro, ruaFrente, ruaChao, arvore, poeira, quartoInfancia, paredeJanela, ceuDourado, mesaDomingo, quadra, bolaVelha, foto, caixaLembrancas, carrinho, pulseira } from '../../../cenarios/lugares.js';

const W = 1080, H = 1920;
const tempos = await (await fetch(new URL('../tempos.json', import.meta.url))).json();
const S = id => { const f = tempos.narracao.find(n => n.id === id); return [f.inicio, f.fim]; };
const piscada = (t, f = 3.4, o = 0) => (((t + o) % f) < 0.12 ? 1 : 0);
const respira = (P, t, o = 0) => { P.squash = Math.sin(t * 2.2 + o) * 0.012; };
const ini = id => S(id)[0] - 0.3;
const B = [0, ini('2a'), ini('3a'), ini('4a'), ini('5a'), ini('6a'), ini('7a'), tempos.duracao];
const CH = RUA.chao;

// bordas de memória: luz quente e desfocada nas bordas
function memoria(st, a = 1, cor = '255,226,170') {
  const c = st.c, g = c.createRadialGradient(W / 2, H / 2, H * 0.22, W / 2, H / 2, H * 0.62);
  g.addColorStop(0, `rgba(${cor},0)`); g.addColorStop(1, `rgba(${cor},${0.75 * a})`); c.fillStyle = g; c.fillRect(0, 0, W, H);
  c.save(); c.globalCompositeOperation = 'soft-light'; c.globalAlpha = 0.35 * a; c.fillStyle = '#ffb060'; c.fillRect(0, 0, W, H); c.restore();
}
function frio(st, a) { if (a <= 0.01) return; const c = st.c; c.save(); c.globalCompositeOperation = 'saturation'; c.globalAlpha = 0.45 * a; c.fillStyle = '#808080'; c.fillRect(0, 0, W, H); c.restore(); c.save(); c.globalCompositeOperation = 'multiply'; c.globalAlpha = 0.35 * a; c.fillStyle = '#7a8ab8'; c.fillRect(0, 0, W, H); c.restore(); }
function corre(P, t, vel = 18, br = 1) { P.walk = t * vel; P.lean = 0.14; P.ik(-1, -60 + Math.sin(t * vel) * 50 * br, -170); P.ik(1, 60 - Math.sin(t * vel) * 50 * br, -170); }
function anda(P, t, vel = 8) { P.walk = t * vel; P.ik(-1, -66 + Math.sin(t * vel) * 18, -150); P.ik(1, 66 - Math.sin(t * vel) * 18, -150); }
function rua(st, t, sol, desenha, op = {}) { bairro(st, t, { sol }); ruaChao(st, t, sol); ruaFrente(st, t, { sol, traves: false, bike: false, casa: true, ...op }); st.mundo(desenha); }

// ================= 1. O GANCHO =================
export const c1 = {
  inicio: B[0], fim: B[1],
  criar(st) {
    const N = nico(), K = [tiago(), lucasK(), bruno()];
    return {
      desenhar(t) {
        const frente = t > 2.6 && t < 4.3, ceu = t >= 4.3;
        const fora = (cc) => { ceuDourado(cc, -200, 300, 1500, 1100, t, 1); for (let i = 0; i < 5; i++) { const x = -100 + i * 260; rrect(cc, x, 900, 220, 300, 4, ['#f2c46a', '#e8a890', '#a8c8b0', '#f0d890', '#c8b0d8'][i], { lw: 5 }); poly(cc, [[x - 20, 910], [x + 110, 820], [x + 240, 910]], '#c8543a', { lw: 5 }); } vgrad(cc, -200, 1200, 1500, 200, [[0, '#c8a888'], [1, '#b8987a']]); K.forEach((k, i) => { k.reset(); k.s = 0.32; const ph = t * 0.8 + i * 0.6; k.x = 540 + Math.sin(ph) * 300; k.y = 1290; corre(k, t + i, 18); k.exp = 'feliz'; k.boca = 'aberta'; k.draw(cc, t); }); };
        if (!frente && !ceu) {
          st.setCam(540, lerp(1250, 1060, easeInOut(clamp(t / 2.6))), lerp(1.0, 1.45, easeInOut(clamp(t / 2.6))));
          st.mundo(c => {
            paredeJanela(c, t, fora, { quente: 1 });
            N.reset(); N.semPernas = true; N.x = 540; N.y = 1290 + 87; N.squash = Math.sin(t * 2) * 0.01; N.frente = [false, true]; N.ik(1, 8, -232); N.ik(-1, -50, -130);
            N.draw(c, t); costas(c, N);
          });
          return;
        }
        if (frente) {
          // de frente, pela janela: queixo apoiado na mão, entediado
          st.setCam(540, 1040, 2.3);
          st.mundo(c => {
            vgrad(c, -600, 0, 2300, 2000, [[0, '#7a5a4a'], [1, '#4a3a34']]);
            N.reset(); N.semPernas = true; N.x = 540; N.y = 1290 + 87; respira(N, t); N.frente = [false, true]; N.ik(1, 8, -232); N.ik(-1, -50, -130);
            N.palp = 0.45; N.boca = 'lado'; N.olhar = [0.4, 0.2]; N.headTilt = 0.1; N.piscar = piscada(t, 2.2);
            N.draw(c, t);
            c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha = 0.25; glow(c, 640, 940, 380, '#ffc070', 1); c.restore();
            // moldura da janela vista de fora
            c.save(); c.beginPath(); c.rect(-600, -600, 2400, 3200); c.rect(260, 760, 560, 560); c.clip('evenodd'); vgrad(c, -600, 0, 2300, 2000, [[0, '#f2c46a'], [1, '#e0a050']]); c.restore();
            rrect(c, 240, 740, 600, 600, 6, null, { stroke: '#8a5a3a', lw: 26 }); rrect(c, 200, 1330, 680, 50, 8, '#f6e6c8', { lw: 6 });
            for (let i = 0; i < 2; i++) circle(c, 300 + i * 30, 1300, 22, '#e2473a', { lw: 4 });
          });
          return;
        }
        // olha para o céu
        const u = easeInOut(clamp((t - 4.3) / 1.2));
        st.setCam(540, lerp(1040, 700, u), lerp(2.3, 1.4, u));
        st.mundo(c => {
          ceuDourado(c, -600, -300, 2300, 1700, t, 1);
          vgrad(c, -600, 1250, 2300, 800, [[0, '#7a5a4a'], [1, '#4a3a34']]);
          N.reset(); N.semPernas = true; N.x = 540; N.y = 1290 + 87; N.olhar = [0.2, -1]; N.headY = -6; N.rostoY = -8; N.boca = 'sorriso'; N.frente = [false, true]; N.ik(1, 8, -232); N.ik(-1, -50, -130);
          N.draw(c, t);
        });
      },
    };
  },
};

// ================= 2. AS LEMBRANÇAS =================
export const c2 = {
  inicio: B[1], fim: B[2],
  criar(st) {
    const N = nico(), K = [tiago(), lucasK(), bruno()], M = maeN(), A = avo(), P = tio();
    return {
      desenhar(t) {
        const c = st.c, d = (B[2] - B[1]) / 3, m = Math.min(2, Math.floor((t - B[1]) / d)), lt = t - B[1] - m * d;
        if (m === 0) {
          // pega-pega na rua
          const x0 = lerp(-200, 900, lt / d);
          st.setCam(x0 + 160, 1530, 1.35);
          rua(st, t, 0.75, cc => {
            [N, ...K].forEach((k, i) => { k.reset(); k.x = x0 + [0, -150, 140, 260][i] + Math.sin(t * 3 + i) * 30; k.y = CH + (i % 2) * 14; corre(k, t + i * 0.3, 20); k.exp = 'feliz'; k.boca = 'aberta'; k.olhar = [1, 0]; k.draw(cc, t); poeira(cc, k.x - 40, k.y, t, t - ((t * 3 + i) % 0.6), 0.6); });
          });
        } else if (m === 1) {
          // sentados na calçada rindo; um cai para trás
          st.setCam(560, 1480, 1.7);
          rua(st, t, 0.7, cc => {
            [K[0], N, K[1], K[2]].forEach((k, i) => {
              k.reset(); k.semPernas = true; k.x = 340 + i * 150; k.y = RUA.calcada + 87 * k.s / 0.75; k.piscar = piscada(t, 3, i);
              k.exp = 'feliz'; k.boca = Math.floor(t * 8 + i) % 2 ? 'aberta' : 'grito'; k.squash = Math.abs(Math.sin(t * 10 + i)) * 0.03; k.ik(-1, -60, -120); k.ik(1, 60, -120);
              if (i === 3 && lt > 0.8) { const q = easeOut(clamp((lt - 0.8) / 0.4)); cc.save(); cc.translate(k.x, RUA.calcada); cc.rotate(-1.3 * q); cc.translate(-k.x, -RUA.calcada); k.ik(-1, -100, -280); k.ik(1, 100, -280); k.draw(cc, t); cc.restore(); }
              else k.draw(cc, t);
              for (const s of [-1, 1]) limb(cc, [[k.x + s * 20, RUA.calcada + 6], [k.x + s * 28, RUA.calcada + 90]], 16, k.d.pele);
            });
          });
        } else {
          // almoço de domingo
          st.setCam(560, 1400, 1.5);
          st.mundo(cc => {
            vgrad(cc, -600, 0, 2300, 2400, [[0, '#f2c88a'], [1, '#e0a868']]);
            rrect(cc, 260, 640, 560, 380, 8, '#fff2d0', { lw: 8 }); ceuDourado(cc, 270, 650, 540, 360, t, 1); line(cc, [[540, 640], [540, 1020]], '#8a5a3a', 8);
            glow(cc, 540, 900, 600, '#ffd080', 0.35);
            const pessoas = [[A, 300], [N, 470], [P, 820]];
            pessoas.forEach(([k, x], i) => { k.reset(); k.semPernas = true; k.x = x; k.y = 1500 + 120; k.piscar = piscada(t, 3, i); respira(k, t, i); k.ik(-1, -70, -150); k.ik(1, 70, -150); k.exp = 'feliz'; k.boca = 'aberta'; k.olhar = [-0.6, 0]; });
            A.exp = 'normal'; A.boca = Math.floor(t * 8) % 2 ? 'aberta' : 'meia'; A.olhar = [1, 0]; A.ik(1, 150 + Math.sin(t * 5) * 30, -260 + Math.cos(t * 5) * 30);
            N.y = 1500 + 90; N.jump = Math.abs(Math.sin(t * 9)) * 8; N.olhar = [-1, 0];
            pessoas.forEach(([k]) => k.draw(cc, t));
            M.reset(); M.x = 640; M.y = 1720; M.piscar = piscada(t); M.exp = 'feliz'; M.boca = 'sorriso'; M.olhar = [-0.5, 0.4]; M.ik(-1, -150, -200 + Math.sin(t * 4) * 20); M.ik(1, 70, -150); M.draw(cc, t);
            mesaDomingo(cc, 560, 1520, t);
          });
        }
        memoria(st, 1);
        const tr = Math.min(Math.abs(t - (B[1] + d)), Math.abs(t - (B[1] + 2 * d)));
        st.overlay('#fff4dc', Math.max(0, 1 - tr / 0.25) * 0.6);
      },
    };
  },
};

// ================= 3. O TEMPO PASSA =================
export const c3 = {
  inicio: B[3 - 1], fim: B[3],
  criar(st) {
    const N = nico(), A = nicoAdulto();
    return {
      desenhar(t) {
        const [a0, a1] = S('3a'), [b0, b1] = S('3b');
        const idade = easeInOut(clamp((t - (b0 - 1.6)) / 2.0));
        const corrida = clamp((t - B[2]) / (b1 - 0.4 - B[2]));
        const x = lerp(-300, 1500, easeInOut(corrida) * 0.6 + corrida * 0.4);
        const para = t > b1 - 0.4;
        const sol = lerp(0.75, 0.22, idade);
        st.setCam(x + (para ? 0 : 140), 1500, lerp(1.35, 1.25, idade));
        rua(st, t, sol, cc => {
          // árvores crescendo com o tempo
          for (const [tx, s0] of [[250, 0.45], [1250, 0.4]]) { cc.save(); cc.translate(tx, 1520); const k = lerp(s0, 1.1, idade); cc.scale(k, k); cc.translate(-tx, -1520); arvore(cc, tx, 1520, t); cc.restore(); }
          // criança se transforma no adulto sem parar o movimento
          if (idade < 1) { N.reset(); N.x = x; N.y = CH; corre(N, t, 18); N.exp = 'feliz'; N.boca = 'aberta'; N.olhar = [1, 0]; N.alpha = 1 - sstep(0.3, 0.7, idade); N.draw(cc, t); }
          if (idade > 0) {
            A.reset(); A.x = x; A.y = CH; A.alpha = sstep(0.3, 0.7, idade); A.piscar = piscada(t);
            if (!para) { anda(A, t, 11); A.lean = 0.05; A.olhar = [1, 0]; A.boca = 'reta'; }
            else { A.olhar = [Math.sin((t - b1) * 2.5) * 0.9, 0]; A.rostoX = A.olhar[0] * 5; A.boca = 'reta'; A.palp = 0.25; respira(A, t); }
            A.draw(cc, t);
          }
        }, { arvoreX: null });
        frio(st, idade);
        if (idade < 0.6) memoria(st, 1 - idade / 0.6);
      },
    };
  },
};

// ================= 4. AS PESSOAS MUDARAM =================
export const c4 = {
  inicio: B[3], fim: B[4],
  criar(st) {
    const A = nicoAdulto(), K = [nico(), tiago(), lucasK(), bruno()];
    return {
      desenhar(t) {
        const c = st.c;
        const [a0, a1] = S('4a');
        const T_LEMB = a0 + 1.6, T_FOTO = a0 + 3.4;
        if (t < T_FOTO) {
          st.setCam(lerp(420, 560, (t - B[3]) / 3.6), 1460, lerp(1.25, 1.45, (t - B[3]) / 3.6));
          quadra(st, t, { frio: 1 });
          st.mundo(cc => {
            bolaVelha(cc, 700, 1500, 32);
            A.reset(); A.x = 300; A.y = CH; A.piscar = piscada(t); respira(A, t); A.olhar = [1, 0.1]; A.boca = 'reta'; A.palp = 0.3; A.ik(-1, -66, -150); A.ik(1, 66, -150);
            A.draw(cc, t);
            // lembrança rápida dos amigos correndo na quadra
            const lm = win(t, T_LEMB, T_LEMB + 0.3, T_FOTO - 0.6, T_FOTO - 0.1);
            if (lm > 0) { cc.save(); cc.globalAlpha = lm * 0.85; K.forEach((k, i) => { k.reset(); k.x = 450 + ((t - T_LEMB) * 260 + i * 120) % 800; k.y = CH + 40 + (i % 2) * 20; corre(k, t + i, 20); k.exp = 'feliz'; k.boca = 'aberta'; k.olhar = [1, 0]; k.draw(cc, t); }); cc.restore(); }
          });
          frio(st, 1 - win(t, T_LEMB, T_LEMB + 0.3, T_FOTO - 0.6, T_FOTO - 0.1));
          if (t > T_LEMB && t < T_FOTO - 0.1) memoria(st, win(t, T_LEMB, T_LEMB + 0.3, T_FOTO - 0.6, T_FOTO - 0.1));
          return;
        }
        // a fotografia antiga nas mãos; o dedo passa por ela e ele sorri
        const sorri = t > B[4] - 1.2;
        st.setCam(540, 960, 1);
        if (!sorri) {
          quadra(st, t, { frio: 1 }); st.overlay('#1a2030', 0.5);
          const u = clamp((t - T_FOTO) / 2.0);
          st.mundo(cc => {
            cc.save(); cc.translate(540, 1000); cc.rotate(-0.05 + Math.sin(t) * 0.01);
            for (const s of [-1, 1]) limb(cc, [[s * 260, 1100], [s * 230, 600], [s * 200, 300]], 80, '#4a5670');
            foto(cc, 0, 0, 1.6, t, { sepia: 0.5 });
            for (const s of [-1, 1]) { ellipse(cc, s * 205, 250, 62, 80, '#e6b48e', { lw: 6 }); for (let k = 0; k < 3; k++) ellipse(cc, s * 190, 190 + k * 34, 30, 15, '#e6b48e', { lw: 5 }); }
            const px = lerp(-170, 150, easeInOut(u)); ellipse(cc, px, 150 - Math.sin(u * Math.PI) * 20, 34, 58, '#e6b48e', { lw: 6 }, 0.5);
            cc.restore();
          });
          frio(st, 0.6);
        } else {
          quadra(st, t, { frio: 1 });
          st.setCam(300, 1330, 3.0);
          st.mundo(cc => { A.reset(); A.x = 300; A.y = CH; A.piscar = piscada(t, 4); respira(A, t); A.olhar = [0, 0.7]; A.boca = 'sorriso'; A.palp = 0.35; A.ik(-1, -30, -200); A.ik(1, 30, -200); A.draw(cc, t); });
          frio(st, 0.8);
        }
      },
    };
  },
};

// ================= 5. A SAUDADE =================
export const c5 = {
  inicio: B[4], fim: B[5],
  criar(st) {
    const A = nicoAdulto(), K = [nico(), tiago(), lucasK(), bruno()];
    return {
      desenhar(t) {
        const [a0, a1] = S('5a');
        const abre = easeOut(clamp((t - a0 - 0.2) / 0.6)), item = t - a0 - 0.9;
        const T_ZOOM = a0 + 2.7, T_VIVO = a0 + 3.8;
        if (t < T_VIVO) {
          const z = easeIn(clamp((t - T_ZOOM) / 1.1));
          st.setCam(lerp(160, 250, z), lerp(1330, 1250, z), lerp(1.7, 6.5, z));
          quartoInfancia(st, t, { noite: 0.55, hora: [21, 40] });
          st.mundo(cc => {
            A.reset(); A.semPernas = true; A.x = 60; A.y = 1480 + 118; A.piscar = piscada(t, 4); respira(A, t); A.olhar = [1, 0.7]; A.boca = 'reta'; A.palp = 0.3;
            A.ik(-1, -70, -140); A.ik(1, 110, -150);
            if (item > 0) { A.ik(1, 150, -230); A.olhar = [0.9, 0.2]; A.boca = 'sorriso'; }
            A.draw(cc, t);
            for (const s of [-1, 1]) limb(cc, [[60 + s * 30, 1490], [60 + s * 50, 1560], [60 + s * 50, 1700]], 30, A.d.perna);
            caixaLembrancas(cc, 300, 1490, abre);
            // objetos saindo da caixa
            if (item > 0) foto(cc, 250, 1260 - easeOut(clamp(item / 0.4)) * 20, 0.38, t, { rot: -0.08, sepia: 0.4, vivo: sstep(T_ZOOM + 0.6, T_VIVO, t), brilho: sstep(T_ZOOM, T_VIVO, t) * 0.6 });
            if (item > 0.5) carrinho(cc, 390, 1420 - easeBack(clamp((item - 0.5) / 0.3)) * 60, 0.8);
            if (item > 1.0) pulseira(cc, 330, 1340 - easeBack(clamp((item - 1.0) / 0.3)) * 40, 0.8);
          });
          frio(st, 1 - sstep(T_ZOOM + 0.5, T_VIVO, t));
          return;
        }
        // a foto vira uma lembrança viva
        const x0 = lerp(0, 700, (t - T_VIVO) / 3);
        st.setCam(x0 + 300, 1530, 1.4);
        rua(st, t, 0.75, cc => { K.forEach((k, i) => { k.reset(); k.x = x0 + 120 + i * 140 + Math.sin(t * 3 + i) * 30; k.y = CH + (i % 2) * 14; corre(k, t + i * 0.3, 20); k.exp = 'feliz'; k.boca = 'aberta'; k.olhar = [1, 0]; k.draw(cc, t); }); });
        memoria(st, 1);
        st.overlay('#fff4dc', 1 - sstep(T_VIVO, T_VIVO + 0.5, t));
      },
    };
  },
};

// ================= 6. A EXPLICAÇÃO =================
const FOTOS = Array.from({ length: 9 }, (_, i) => { const r = rng(i + 30); return { x: 120 + (i % 3) * 420 + (r() - 0.5) * 60, y: 380 + Math.floor(i / 3) * 420 + (r() - 0.5) * 60, rot: (r() - 0.5) * 0.3, s: 0.62 + r() * 0.1, cor: ['#ffb060', '#ff8fb1', '#7ac8ff', '#ffd36a', '#8fe0a0'][i % 5] }; });
export const c6 = {
  inicio: B[5], fim: B[6],
  criar(st) {
    const A = nicoAdulto();
    return {
      desenhar(t) {
        const [a0, a1] = S('6a'), [b0, b1] = S('6b');
        const folheia = (t - B[5]) * 70, linhas = sstep(b0, b0 + 1.2, t), destaque = sstep(b0 + 1.6, b0 + 2.4, t);
        st.setCam(540, 1000, 1.0);
        st.mundo(cc => {
          vgrad(cc, -600, -600, 2300, 3200, [[0, '#2a1a3a'], [0.6, '#4a2a4a'], [1, '#6a3a3a']]);
          for (let i = 0; i < 40; i++) { const r = rng(i); sparkle(cc, r() * 1080, r() * 1920, 4 + r() * 4, '#ffe8c0', 0.3 + 0.4 * Math.sin(t * 2 + i)); }
          // emoções (luzes coloridas) ligadas às fotos
          const orbs = [[200, 1500, '#ffb060'], [540, 1620, '#ff8fb1'], [880, 1500, '#7ac8ff']];
          orbs.forEach(([ox, oy, cor], k) => { glow(cc, ox, oy, 120, cor, 0.8 + 0.2 * Math.sin(t * 3 + k)); circle(cc, ox, oy, 26, cor, { stroke: null }); });
          FOTOS.forEach((f, i) => {
            const fx = ((f.x - folheia + 1500) % 1500) - 210, fy = f.y + Math.sin(t * 0.8 + i) * 14;
            const alvo = orbs[i % 3];
            if (linhas > 0) { cc.save(); cc.globalCompositeOperation = 'lighter'; cc.globalAlpha = linhas * 0.6; line(cc, [[fx, fy], [(fx + alvo[0]) / 2, (fy + alvo[1]) / 2 - 80], [alvo[0], alvo[1]]], alvo[2], 5); cc.restore(); }
            const especial = i === 4;
            // a memória se reconstrói: detalhes mudam um pouco com o tempo
            foto(cc, fx, fy, f.s * (especial ? 1 + destaque * 0.25 : 1), t, { rot: f.rot + Math.sin(t * 0.7 + i) * 0.03, sepia: 0.25 + 0.2 * Math.sin(t * 0.9 + i), vivo: especial ? destaque : 0.15, brilho: especial ? destaque * 0.9 : 0.15 });
          });
          A.reset(); A.x = 540; A.y = 1960; A.piscar = piscada(t, 4); respira(A, t); A.olhar = [Math.sin(t * 0.8) * 0.6, -0.8]; A.headY = -4; A.boca = destaque > 0.5 ? 'sorriso' : 'reta';
          A.ik(1, 150 + Math.sin(t * 2) * 30, -300); A.ik(-1, -70, -150);
          A.draw(cc, t);
        });
        memoria(st, 0.4, '255,200,170');
      },
    };
  },
};

// ================= 7. O FINAL EMOCIONAL =================
export const c7 = {
  inicio: B[6], fim: B[7],
  criar(st) {
    const A = nicoAdulto(), K = [nico(), tiago(), lucasK(), bruno()];
    return {
      desenhar(t) {
        const [a0, a1] = S('7a'), [b0, b1] = S('7b');
        const chega = clamp((t - B[6]) / 3.4), ax = lerp(700, 1500, easeOut(chega));
        const T_LEMB = a0 + 3.6, T_FIM_LEMB = b0 + 3.4, T_CEU = b0 + 3.8, T_AFASTA = b0 + 4.6, T_SAI = b1 + 0.4;
        const sol = lerp(0.42, 0.22, clamp((t - B[6]) / (B[7] - B[6])));
        let cam;
        if (t < T_CEU) cam = [lerp(ax + 120, 1560, sstep(T_LEMB - 1, T_LEMB, t)), 1470, lerp(1.35, 1.25, sstep(T_LEMB - 1, T_LEMB, t))];
        else { const u = easeInOut(clamp((t - T_AFASTA) / (T_SAI - T_AFASTA + 1))); cam = [lerp(1560, 1200, u), lerp(1440, 1200, u), lerp(1.4, 0.62, u)]; }
        st.setCam(...cam);
        rua(st, t, sol, cc => {
          // a criança e os amigos correm pelo mesmo lugar (lembrança)
          const lm = win(t, T_LEMB, T_LEMB + 0.8, T_FIM_LEMB - 0.8, T_FIM_LEMB);
          if (lm > 0) {
            cc.save(); cc.globalAlpha = lm * 0.88;
            const x0 = lerp(900, 2300, clamp((t - T_LEMB) / (T_FIM_LEMB - T_LEMB)));
            K.forEach((k, i) => { k.reset(); k.x = x0 - i * 150 - (i ? 60 : 0); k.y = CH + 50 + (i % 2) * 16; corre(k, t + i * 0.3, 20); k.exp = 'feliz'; k.boca = 'aberta'; k.olhar = [1, 0]; if (i === 0 && t > T_LEMB + 2.0 && t < T_LEMB + 2.8) { k.olhar = [0, 0]; k.boca = 'sorriso'; } k.draw(cc, t); poeira(cc, k.x - 40, k.y, t, t - ((t * 3 + i) % 0.6), 0.6); });
            cc.restore(); glow(cc, x0 - 200, CH - 200, 400, '#ffd080', lm * 0.4);
          }
          // o adulto caminha devagar e para diante da antiga casa
          A.reset(); A.x = ax; A.y = CH; A.piscar = piscada(t, 4); respira(A, t);
          if (chega < 1) { anda(A, t, 7); A.olhar = [1, 0]; A.boca = 'reta'; A.palp = 0.25; }
          else { A.ik(-1, -66, -150); A.ik(1, 66, -150); A.olhar = [0.9, -0.4]; A.boca = 'reta'; A.palp = 0.2; }
          if (lm > 0.2) { A.olhar = [0.5, 0.3]; A.boca = 'sorriso'; A.palp = 0.3; }
          if (t > T_CEU) { A.olhar = [0.2, -1]; A.headY = -6; A.rostoY = -8; A.boca = 'sorriso'; A.palp = 0.15; }
          if (t > T_SAI) { const u = clamp((t - T_SAI) / 2.4); A.x = lerp(1500, 2400, u); anda(A, t, 7); A.olhar = [1, 0]; A.headY = 0; A.rostoY = 0; A.alpha = 1 - sstep(0.6, 1, u); }
          A.draw(cc, t);
        });
        frio(st, 0.35 * (1 - sstep(T_LEMB, T_LEMB + 1, t)));
        if (t > T_LEMB && t < T_FIM_LEMB) memoria(st, win(t, T_LEMB, T_LEMB + 0.8, T_FIM_LEMB - 0.8, T_FIM_LEMB) * 0.8);
        const c = st.c; c.save(); c.globalCompositeOperation = 'soft-light'; c.globalAlpha = 0.45; c.fillStyle = '#ff8a3a'; c.fillRect(0, 0, W, H); c.restore();
        st.overlay('#000', sstep(B[7] - 1.3, B[7], t));
      },
    };
  },
};
