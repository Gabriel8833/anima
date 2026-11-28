// "Como é perceber que seus pais também estão envelhecendo?" — curta 2D
import { TAU, lerp, clamp, sstep, win, kf, easeInOut, easeIn, easeOut, easeBack, rng, impulse } from '../../../motor/base.js';
import { glow, sparkle, circle, line, rrect, ellipse, shape, cloud, poly, limb, vgrad } from '../../../motor/desenho.js';
import { filhoCrianca, filhoJovem, filhoAdulto, paiFam as pai, maeFam as mae, pratoMao } from '../../../personagens/elenco.js';
import { quintal, salaCasa, sofaCasa, garagem, cozinhaCasa, banheiro, maoClose, caixaPesada, sacola, mesaDomingo, bicicleta } from '../../../cenarios/lugares.js';

const W = 1080, H = 1920;
const tempos = await (await fetch(new URL('../tempos.json', import.meta.url))).json();
const S = id => { const f = tempos.narracao.find(n => n.id === id); return [f.inicio, f.fim]; };
const piscada = (t, f = 3.6, o = 0) => (((t + o) % f) < 0.12 ? 1 : 0);
const respira = (P, t, o = 0, a = 0.012) => { P.squash = Math.sin(t * 2 + o) * a; };
const ini = id => S(id)[0] - 0.25;
const B = [0, ini('2a'), ini('3a'), ini('4a'), ini('5a'), ini('6a'), ini('7a'), tempos.duracao];
const CH = 1780;

function memoria(st, a = 1) { if (a <= 0.01) return; const c = st.c, g = c.createRadialGradient(W / 2, H / 2, H * 0.22, W / 2, H / 2, H * 0.62); g.addColorStop(0, 'rgba(255,226,170,0)'); g.addColorStop(1, `rgba(255,226,170,${0.7 * a})`); c.fillStyle = g; c.fillRect(0, 0, W, H); c.save(); c.globalCompositeOperation = 'soft-light'; c.globalAlpha = 0.35 * a; c.fillStyle = '#ffb060'; c.fillRect(0, 0, W, H); c.restore(); }
function suave(st, a) { if (a <= 0.01) return; const c = st.c; c.save(); c.globalCompositeOperation = 'saturation'; c.globalAlpha = 0.3 * a; c.fillStyle = '#808080'; c.fillRect(0, 0, W, H); c.restore(); c.save(); c.globalCompositeOperation = 'soft-light'; c.globalAlpha = 0.25 * a; c.fillStyle = '#8aa0c8'; c.fillRect(0, 0, W, H); c.restore(); }
function anda(P, t, vel = 9, br = 1) { P.walk = t * vel; P.ik(-1, -66 + Math.sin(t * vel) * 22 * br, -150); P.ik(1, 66 - Math.sin(t * vel) * 22 * br, -150); }
function corre(P, t, vel = 18) { P.walk = t * vel; P.lean = 0.14; P.ik(-1, -60 + Math.sin(t * vel) * 50, -170); P.ik(1, 60 - Math.sin(t * vel) * 50, -170); }
function sentado(P, x, yAss, s) { P.reset(); if (s) P.s = s; P.semPernas = true; P.x = x; P.y = yAss + 118 * P.s; P.ik(-1, -70, -150); P.ik(1, 70, -150); return P; }
// filho sobre os ombros do pai
function nosOmbros(cc, t, Pa, F, olhar = [0.3, -0.2]) {
  F.reset(); F.semPernas = true; F.x = Pa.x; F.y = Pa.y - 340 * Pa.s + 77; F.exp = 'feliz'; F.boca = 'aberta'; F.olhar = olhar; if (olhar[1] > 0.5) { F.exp = 'normal'; F.boca = 'sorriso'; F.blush = 0.6; } F.ik(-1, -90, -260 + Math.sin(t * 6) * 20); F.ik(1, 90, -260 - Math.sin(t * 6) * 20); F.vento = 1;
  F.draw(cc, t);
  Pa.ik(-1, -60, -300); Pa.ik(1, 60, -300); Pa.draw(cc, t);
  for (const s of [-1, 1]) { limb(cc, [[Pa.x + s * 26, Pa.y - 330 * Pa.s], [Pa.x + s * 44, Pa.y - 260 * Pa.s], [Pa.x + s * 40, Pa.y - 200 * Pa.s]], 18, F.d.pele); ellipse(cc, Pa.x + s * 44, Pa.y - 190 * Pa.s, 20, 12, F.d.sapato, { lw: 4 }); }
  Pa.drawArms(cc, t);
}

// ================= 1. OS PAIS PARECIAM INVENCÍVEIS =================
export const c1 = {
  inicio: B[0], fim: B[1],
  criar(st) {
    const Pa = pai(false), Ma = mae(false), F = filhoCrianca();
    return {
      desenhar(t) {
        const pega = t > 1.5, px = lerp(470, 760, clamp((t - 2.0) / 2.4));
        st.setCam(t < 3.4 ? lerp(360, px, clamp((t - 1) / 2)) : px, t < 3.4 ? 1420 : lerp(1420, 1180, easeInOut(clamp((t - 3.4) / 0.8))), t < 3.4 ? 1.25 : lerp(1.25, 2.4, easeInOut(clamp((t - 3.4) / 0.8))));
        quintal(st, t, { sol: 1 });
        st.mundo(cc => {
          Ma.reset(); Ma.x = 600; Ma.y = 1500; Ma.piscar = piscada(t, 3); respira(Ma, t); Ma.exp = 'feliz'; Ma.boca = 'sorriso'; Ma.olhar = [0.4, 0.3]; Ma.maoD = pratoMao(3, 1); Ma.ik(1, 90, -200); Ma.ik(-1, -66, -150); Ma.s = 0.88; Ma.draw(cc, t);
          Pa.reset(); Pa.x = pega ? px : 470; Pa.y = CH; Pa.piscar = piscada(t, 3.3); respira(Pa, t); Pa.exp = 'feliz'; Pa.boca = 'aberta'; Pa.olhar = pega ? [0, -0.6] : [-1, 0];
          if (t > 2.0) anda(Pa, t, 8, 0);
          if (!pega) { Pa.ik(-1, -130, -220); Pa.ik(1, 130, -220); Pa.draw(cc, t); F.reset(); F.x = lerp(120, 400, clamp(t / 1.5)); F.y = CH + 20; corre(F, t, 18); F.exp = 'feliz'; F.boca = 'aberta'; F.olhar = [1, 0]; F.draw(cc, t); }
          else if (t < 2.0) { const u = easeOut(clamp((t - 1.5) / 0.5)); Pa.ik(-1, -60, lerp(-200, -300, u)); Pa.ik(1, 60, lerp(-200, -300, u)); Pa.draw(cc, t); F.reset(); F.x = 470; F.y = lerp(CH - 100, CH - 340 * 1.06 + 77 - 40, u); F.exp = 'feliz'; F.boca = 'grito'; F.ik(-1, -100, -280); F.ik(1, 100, -280); F.draw(cc, t); }
          else nosOmbros(cc, t, Pa, F, t > 3.4 ? [0, 1] : [0.3, -0.2]);
        });
        memoria(st, 0.9);
      },
    };
  },
};

// ================= 2. ELES PARECIAM SABER DE TUDO =================
export const c2 = {
  inicio: B[1], fim: B[2],
  criar(st) {
    const Pa = pai(false), Ma = mae(false), F = filhoCrianca();
    return {
      desenhar(t) {
        const d = (B[2] - B[1]) / 4, m = Math.min(3, Math.floor((t - B[1]) / d)), q = (t - B[1] - m * d) / d;
        if (m === 0) { // conserta a bicicleta
          st.setCam(560, 1440, 1.5); garagem(st, t);
          st.mundo(cc => { bicicleta(cc, 640, CH - 10, t, { gira: t * 3, cor: '#e2473a' }); Pa.reset(); Pa.x = 480; Pa.y = CH; Pa.lean = 0.25; Pa.piscar = piscada(t); Pa.olhar = [1, 0.8]; Pa.boca = 'reta'; Pa.ik(1, 140 + Math.sin(t * 10) * 14, -150); Pa.ik(-1, 100, -120); Pa.draw(cc, t); F.reset(); F.x = 820; F.y = CH + 10; F.exp = 'feliz'; F.boca = 'sorriso'; F.olhar = [-1, 0.3]; F.ik(-1, -40, -220); F.frente = [true, false]; F.draw(cc, t); });
        } else if (m === 1) { // mãe cozinhando, filho fazendo lição
          st.setCam(640, 1400, 1.45); cozinhaCasa(st, t, { quente: 1 });
          st.mundo(cc => { Ma.reset(); Ma.x = 820; Ma.y = CH - 20; Ma.piscar = piscada(t, 3); Ma.exp = 'feliz'; Ma.boca = 'sorriso'; Ma.olhar = [-0.6, 0.4]; Ma.ik(1, 60 + Math.cos(t * 6) * 18, -210 + Math.sin(t * 6) * 10); Ma.draw(cc, t); sentado(F, 380, 1560); F.exp = 'normal'; F.boca = 'bico'; F.olhar = [0.2, 0.8]; F.ik(1, 50 + Math.sin(t * 9) * 8, -150); F.draw(cc, t); rrect(cc, 160, 1560, 460, 30, 6, '#c89a5a', { lw: 5 }); rrect(cc, 330, 1544, 120, 20, 3, '#fffaf0', { lw: 3 }); F.drawArms(cc, t); });
        } else if (m === 2) { // carrega as sacolas do mercado
          const x = lerp(200, 700, q); st.setCam(x + 60, 1420, 1.45); quintal(st, t, { sol: 1 });
          st.mundo(cc => { Pa.reset(); Pa.x = x; Pa.y = CH; Pa.piscar = piscada(t); Pa.exp = 'feliz'; Pa.boca = 'sorriso'; Pa.olhar = [1, 0]; Pa.walk = t * 9; Pa.ik(-1, -80, -110); Pa.ik(1, 80, -110); Pa.draw(cc, t); const [lx, ly] = Pa.mao(-1), [rx, ry] = Pa.mao(1); sacola(cc, lx, ly + 10); sacola(cc, rx, ry + 10); F.reset(); F.x = x - 200; F.y = CH + 20; anda(F, t, 14); F.exp = 'feliz'; F.boca = 'aberta'; F.olhar = [1, -0.4]; F.draw(cc, t); });
        } else { // abraço depois do machucado
          st.setCam(560, 1480, 1.7); quintal(st, t, { sol: 1 });
          st.mundo(cc => { Ma.reset(); Ma.x = 600; Ma.y = CH; Ma.lean = 0.2; Ma.piscar = piscada(t, 3); Ma.exp = 'feliz'; Ma.boca = 'sorriso'; Ma.olhar = [-1, 0.6]; Ma.frente = [true, true]; Ma.ik(-1, -150, -95); Ma.ik(1, -40, -120); Ma.semBracos = true; Ma.draw(cc, t); Ma.semBracos = false; F.reset(); F.x = 470; F.y = CH + 20; F.exp = q < 0.4 ? 'preocupado' : 'feliz'; F.boca = q < 0.4 ? 'triste' : 'sorriso'; F.olhar = [1, -0.6]; F.draw(cc, t); rrect(cc, 456, CH - 60, 26, 14, 4, '#f2d6b0', { lw: 3 }); Ma.drawArms(cc, t); });
        }
        memoria(st, 1);
        const tr = Math.min(...[1, 2, 3].map(k => Math.abs(t - (B[1] + k * d))));
        st.overlay('#fff4dc', Math.max(0, 1 - tr / 0.25) * 0.6);
      },
    };
  },
};

// ================= 3. O TEMPO PASSA =================
export const c3 = {
  inicio: B[2], fim: B[3],
  criar(st) {
    const F = filhoCrianca(), Fj = filhoJovem(), Fa = filhoAdulto(), Pv = pai(true), Mv = mae(true);
    return {
      desenhar(t) {
        const [a0, a1] = S('3a'), [b0, b1] = S('3b'), [c0, c1] = S('3c');
        if (t < b0) {
          // o filho cresce enquanto corre pelo quintal
          const u = clamp((t - B[2]) / (b0 - B[2])), x = lerp(100, 900, u), id = u;
          st.setCam(x + 80, 1440, 1.35);
          quintal(st, t, { sol: lerp(1, 0.55, u) });
          st.mundo(cc => {
            const fase = id < 0.35 ? 0 : id < 0.7 ? 1 : 2, mixA = (a, b) => sstep(a, b, id);
            [[F, 1 - mixA(0.25, 0.4)], [Fj, mixA(0.25, 0.4) * (1 - mixA(0.6, 0.75))], [Fa, mixA(0.6, 0.75)]].forEach(([P, al]) => { if (al <= 0.01) return; P.reset(); P.x = x; P.y = CH + 20; P.alpha = al; P === Fa ? anda(P, t, 11) : corre(P, t, 16); P.exp = P === Fa ? 'normal' : 'feliz'; P.boca = P === Fa ? 'reta' : 'aberta'; P.olhar = [1, 0]; P.draw(cc, t); });
          });
          memoria(st, 1 - u); suave(st, u);
          return;
        }
        if (t < c0) {
          // o pai para no meio do esforço com a caixa
          st.setCam(lerp(520, 560, (t - b0) / 5), 1420, 1.45);
          garagem(st, t);
          st.mundo(cc => {
            const q = t - b0, ergue = win(q, 0.4, 1.2, 2.2, 2.8);
            Pv.reset(); Pv.x = 420; Pv.y = CH; Pv.piscar = piscada(t, 3); respira(Pv, t, 0, 0.02);
            Pv.lean = 0.28 * ergue; Pv.ik(-1, -90, lerp(-120, -60, ergue)); Pv.ik(1, 90, lerp(-120, -60, ergue)); Pv.exp = 'normal'; Pv.boca = 'reta'; Pv.olhar = [0, 1];
            if (q > 2.3) { Pv.lean = 0; Pv.frente = [true, false]; Pv.ik(-1, -50, -150); Pv.ik(1, 30, -330); Pv.exp = 'preocupado'; Pv.boca = 'o'; Pv.olhar = [0.4, 0]; Pv.squash = Math.sin(t * 4) * 0.025; }
            Pv.draw(cc, t);
            caixaPesada(cc, 420, CH - 20 - ergue * 30);
            Fa.reset(); Fa.x = 820; Fa.y = CH + 10; Fa.piscar = piscada(t, 3.4); respira(Fa, t); Fa.olhar = [-1, 0]; Fa.boca = q > 2.3 ? 'o' : 'reta'; Fa.exp = q > 3.0 ? 'preocupado' : 'normal'; Fa.ik(-1, -66, -150); Fa.ik(1, 66, -150); Fa.draw(cc, t);
          });
          suave(st, 1);
          return;
        }
        // a mãe massageando as costas no sofá
        st.setCam(560, 1400, 1.5);
        salaCasa(st, t, { quente: 0 });
        st.mundo(cc => {
          sofaCasa(cc, 480);
          sentado(Mv, 420, 1400); Mv.piscar = piscada(t, 3); respira(Mv, t); Mv.exp = 'preocupado'; Mv.boca = 'reta'; Mv.palp = 0.3; Mv.olhar = [0, 0.4]; Mv.frente = [false, false]; Mv.ik(1, 96 + Math.sin(t * 5) * 6, -180 + Math.cos(t * 5) * 8); Mv.headTilt = 0.08; Mv.draw(cc, t);
          Fa.reset(); Fa.x = 880; Fa.y = CH; Fa.piscar = piscada(t, 3.4); respira(Fa, t); Fa.olhar = [-1, 0.2]; Fa.exp = 'preocupado'; Fa.boca = 'reta'; Fa.ik(-1, -66, -150); Fa.ik(1, 66, -150); Fa.draw(cc, t);
        });
        suave(st, 1);
      },
    };
  },
};

// ================= 4. AS MUDANÇAS QUE VOCÊ COMEÇA A NOTAR =================
export const c4 = {
  inicio: B[3], fim: B[4],
  criar(st) {
    const Pv = pai(true), Mv = mae(true), Fa = filhoAdulto();
    return {
      desenhar(t) {
        const c = st.c, [a0, a1] = S('4a');
        const T_OCUL = a0 + 2.0, T_SALA = a0 + 3.8;
        if (t < T_OCUL) {
          // o pai no espelho (o espectador é o espelho)
          const q = t - B[3];
          st.setCam(540, 1290, lerp(2.1, 2.6, clamp(q / 2.2)));
          banheiro(st, t);
          st.mundo(cc => {
            Pv.reset(); Pv.x = 540; Pv.y = CH - 200; Pv.piscar = piscada(t, 3); respira(Pv, t); Pv.olhar = [0, -0.5]; Pv.exp = 'normal'; Pv.boca = 'reta'; Pv.palp = 0.15;
            if (q > 0.6) { Pv.frente = [false, true]; Pv.ik(1, lerp(30, -40, clamp((q - 0.6) / 1.0)), -360); }
            if (q > 1.4) { Pv.boca = 'sorriso'; Pv.olhar = [0, -0.2]; }
            Pv.draw(cc, t);
            const [hx, hy] = Pv.cabeca(); for (let k = 0; k < 4; k++) sparkle(cc, hx - 40 + k * 26, hy - 60 + (k % 2) * 8, 8, '#ffffff', 0.4 + 0.5 * Math.sin(t * 4 + k));
          });
          rrect(c, 40, 40, W - 80, H - 80, 40, null, { stroke: '#d8dce4', lw: 60 }); rrect(c, 40, 40, W - 80, H - 80, 40, null, { stroke: '#8a94a4', lw: 6 });
          c.save(); c.globalAlpha = 0.08; c.fillStyle = '#ffffff'; c.beginPath(); c.moveTo(100, 300); c.lineTo(400, 100); c.lineTo(460, 160); c.lineTo(160, 360); c.closePath(); c.fill(); c.restore();
          suave(st, 0.8);
          return;
        }
        if (t < T_SALA) {
          // a mãe coloca os óculos para ler a mensagem
          const q = t - T_OCUL, oc = sstep(0.8, 1.1, q);
          st.setCam(520, 1250, 2.5);
          salaCasa(st, t, { quente: 0 });
          st.mundo(cc => {
            sofaCasa(cc, 480);
            sentado(Mv, 520, 1400); Mv.piscar = piscada(t, 3); respira(Mv, t); Mv.olhar = [0.4, 0.8]; Mv.aperta = oc > 0.5 ? 0 : 0.6; Mv.boca = oc > 0.5 ? 'sorriso' : 'bico'; Mv.frente = [false, true];
            Mv.ik(1, 30, -250); Mv.maoD = (c2, s) => { c2.save(); c2.rotate(-0.2); rrect(c2, -18, -58, 36, 64, 6, '#1a1a22', { lw: 4 }); rrect(c2, -13, -52, 26, 50, 3, '#9ad0ff', { stroke: null }); c2.restore(); };
            if (q < 0.9) { Mv.frente = [true, true]; Mv.ik(-1, -40, lerp(-150, -300, sstep(0.2, 0.8, q))); }
            Mv.draw(cc, t);
            if (oc > 0) { const [hx, hy] = Mv.cabeca(), k = 0.74 * Mv.s; cc.save(); cc.globalAlpha = oc; for (const s of [-1, 1]) rrect(cc, hx + s * 28 * k - 24 * k, hy - 26 * k, 48 * k, 36 * k, 8, null, { stroke: '#5a3a2a', lw: 4 }); line(cc, [[hx - 4 * k, hy - 10 * k], [hx + 4 * k, hy - 10 * k]], '#5a3a2a', 4); cc.restore(); }
          });
          suave(st, 0.8);
          return;
        }
        // o filho observa os dois na sala — silêncio
        const u = easeInOut(clamp((t - T_SALA) / (B[4] - T_SALA)));
        st.setCam(lerp(620, 860, u), lerp(1360, 1250, u), lerp(1.2, 2.6, u));
        salaCasa(st, t, { quente: 0 });
        st.mundo(cc => {
          sofaCasa(cc, 440);
          sentado(Pv, 330, 1400); Pv.piscar = piscada(t, 3); respira(Pv, t); Pv.olhar = [1, 0.2]; Pv.exp = 'feliz'; Pv.boca = 'sorriso'; Pv.draw(cc, t);
          sentado(Mv, 540, 1400); Mv.piscar = piscada(t, 3.4, 1); respira(Mv, t, 1); Mv.olhar = [-1, 0.2]; Mv.boca = 'sorriso'; Mv.draw(cc, t);
          Fa.reset(); Fa.x = 880; Fa.y = CH; Fa.piscar = piscada(t, 4); respira(Fa, t); Fa.olhar = [-1, 0.2]; Fa.exp = 'normal'; Fa.boca = 'reta'; Fa.palp = 0.2; Fa.ik(-1, -66, -150); Fa.ik(1, 66, -150); Fa.draw(cc, t);
        });
        suave(st, 0.8);
      },
    };
  },
};

// ================= 5. VOCÊ AINDA OS ENXERGA COMO ANTES =================
export const c5 = {
  inicio: B[4], fim: B[5],
  criar(st) {
    const Pv = pai(true), Pj = pai(false), Mv = mae(true), Mj = mae(false), F = filhoCrianca(), Fa = filhoAdulto();
    return {
      desenhar(t) {
        const c = st.c, [a0, a1] = S('5a');
        const meio = a0 + 3.2;
        if (t < meio) {
          // o pai de hoje vira o pai de antes, com o filho nos ombros
          const k = sstep(a0 + 0.8, a0 + 2.0, t);
          st.setCam(460, 1300, 1.6);
          salaCasa(st, t, { quente: k });
          st.mundo(cc => {
            sofaCasa(cc, 440);
            cc.save(); cc.globalAlpha = 1 - k * 0.65; sentado(Pv, 420, 1400); Pv.piscar = piscada(t, 3); respira(Pv, t); Pv.olhar = [0.6, 0]; Pv.boca = 'sorriso'; Pv.draw(cc, t); cc.restore();
            if (k > 0.01) { cc.save(); cc.globalAlpha = k * 0.85; Pj.reset(); Pj.x = 480; Pj.y = CH; Pj.piscar = piscada(t, 3.3); Pj.exp = 'feliz'; Pj.boca = 'aberta'; Pj.olhar = [0, -0.6]; nosOmbros(cc, t, Pj, F); cc.restore(); }
          });
          memoria(st, k); suave(st, 1 - k);
          return;
        }
        if (t < a1 + 0.2) {
          // a mãe de hoje sorrindo na cozinha vira a lembrança do abraço
          const k = sstep(meio + 0.6, meio + 1.6, t);
          st.setCam(640, 1400, 1.55);
          cozinhaCasa(st, t, { quente: k });
          st.mundo(cc => {
            cc.save(); cc.globalAlpha = 1 - k * 0.6; Mv.reset(); Mv.x = 760; Mv.y = CH - 20; Mv.piscar = piscada(t, 3); respira(Mv, t); Mv.exp = 'feliz'; Mv.boca = 'sorriso'; Mv.olhar = [-0.6, 0]; Mv.draw(cc, t); cc.restore();
            if (k > 0.01) { cc.save(); cc.globalAlpha = k * 0.85; Mj.reset(); Mj.x = 640; Mj.y = CH; Mj.lean = 0.2; Mj.exp = 'feliz'; Mj.boca = 'sorriso'; Mj.olhar = [-1, 0.6]; Mj.frente = [true, true]; Mj.ik(-1, -150, -95); Mj.ik(1, -40, -120); Mj.semBracos = true; Mj.draw(cc, t); Mj.semBracos = false; F.reset(); F.x = 510; F.y = CH + 20; F.exp = 'feliz'; F.boca = 'sorriso'; F.olhar = [1, -0.6]; F.draw(cc, t); Mj.drawArms(cc, t); cc.restore(); }
          });
          memoria(st, k); suave(st, 1 - k);
          return;
        }
        // o filho adulto, emocionado
        st.setCam(540, 1290, 2.8);
        salaCasa(st, t, { quente: 0.3 });
        st.mundo(cc => { Fa.reset(); Fa.x = 540; Fa.y = CH; Fa.piscar = piscada(t, 4); respira(Fa, t); Fa.olhar = [0.2, -0.1]; Fa.exp = 'normal'; Fa.boca = 'sorriso'; Fa.palp = 0.25; Fa.ik(-1, -66, -150); Fa.ik(1, 66, -150); Fa.draw(cc, t); const [hx, hy] = Fa.cabeca(); for (const s of [-1, 1]) sparkle(cc, hx + s * 24, hy - 2, 6, '#ffffff', 0.5 + 0.4 * Math.sin(t * 3 + s)); });
        suave(st, 0.5);
      },
    };
  },
};

// ================= 6. O TEMPO TAMBÉM PASSA POR ELES =================
export const c6 = {
  inicio: B[5], fim: B[6],
  criar(st) {
    const Pv = pai(true), Mv = mae(true), Fa = filhoAdulto();
    return {
      desenhar(t) {
        const c = st.c, [a0, a1] = S('6a'), [b0, b1] = S('6b');
        const close = t > b0 + 1.4;
        if (!close) {
          st.setCam(560, 1360, lerp(1.25, 1.5, clamp((t - B[5]) / 5)));
          salaCasa(st, t, { quente: 0.45 });
          st.mundo(cc => {
            sentado(Pv, 300, 1420); Pv.piscar = piscada(t, 3); respira(Pv, t); Pv.exp = 'feliz'; Pv.boca = Math.floor(t * 7) % 2 ? 'aberta' : 'meia'; Pv.olhar = [1, 0]; Pv.ik(1, 140 + Math.sin(t * 2.6) * 30, -260 + Math.cos(t * 2.6) * 30); Pv.draw(cc, t);
            sentado(Mv, 560, 1420); Mv.piscar = piscada(t, 3.4, 1); respira(Mv, t, 1); Mv.exp = 'feliz'; Mv.boca = 'sorriso'; Mv.olhar = [-1, 0]; Mv.draw(cc, t);
            sentado(Fa, 820, 1420); Fa.piscar = piscada(t, 4); respira(Fa, t, 2); Fa.olhar = [Math.sin(t * 0.8) > 0 ? -1 : -0.4, 0.2]; Fa.boca = 'sorriso'; Fa.palp = 0.2; Fa.draw(cc, t);
            mesaDomingo(cc, 560, 1520, t);
            Pv.drawArms(cc, t);
          });
          suave(st, 0.5);
          return;
        }
        // close nas mãos: o pai coloca comida no prato do filho, como fazia antes
        st.setCam(560, 1150, 1.75);
        st.mundo(cc => {
          vgrad(cc, -200, 0, 1500, 1920, [[0, '#e8c8a0'], [1, '#c8986a']]);
          glow(cc, 540, 700, 700, '#ffd890', 0.4);
          ellipse(cc, 540, 1240, 320, 90, '#f6f2ea', { lw: 7 }); ellipse(cc, 540, 1240, 250, 64, '#ffffff', { stroke: null });
          const u = clamp((t - b0 - 1.6) / 2.2), cai = easeOut(clamp((u - 0.4) / 0.4));
          for (let k = 0; k < 2; k++) rrect(cc, 460 + k * 70, 1200, 70, 40, 12, '#8a4a2a', { lw: 4 });
          if (cai > 0) rrect(cc, 560, lerp(1040, 1196, cai), 70, 40, 12, '#8a4a2a', { lw: 4 });
          ellipse(cc, 650, 1236, 70, 18, '#e0b060', { stroke: null });
          // colher na mão do pai (enrugada)
          const mx = lerp(760, 620, easeInOut(clamp(u / 0.4))), my = lerp(900, 980, easeInOut(clamp(u / 0.4))) - Math.sin(u * Math.PI) * 30;
          maoClose(cc, mx, my, 1.1, -0.9, '#d9a37a', 1); line(cc, [[mx - 30, my - 20], [mx - 170, my + 50]], '#c8c8d0', 14); ellipse(cc, mx - 190, my + 58, 46, 22, '#c8c8d0', { lw: 4 });
          for (let k = 0; k < 4; k++) shape(cc, c => c.roundRect(mx - 60 + k * 26 * Math.cos(-0.9), my - 50 + k * 26 * Math.sin(-0.9) + 30, 24, 50, 12), '#d9a37a', { lw: 5 });
          // a mão do filho segurando o prato
          maoClose(cc, 300, 1330, 1.0, 1.1, '#e8b892', 0);
        });
        memoria(st, 0.5);
      },
    };
  },
};

// ================= 7. O FINAL EMOCIONAL =================
export const c7 = {
  inicio: B[6], fim: B[7],
  criar(st) {
    const Pv = pai(true), Mv = mae(true), Fa = filhoAdulto(), Pj = pai(false), Mj = mae(false), F = filhoCrianca();
    return {
      desenhar(t) {
        const [a0, a1] = S('7a'), [b0, b1] = S('7b');
        const levanta = easeInOut(clamp((t - a0 - 0.2) / 1.6)), abraca = sstep(a0 + 1.6, a0 + 2.4, t);
        const T_PASS = b1 - 2.6, T_VOLTA = b1 - 0.6;
        const passado = win(t, T_PASS, T_PASS + 0.6, T_VOLTA - 0.4, T_VOLTA + 0.3);
        const u = easeInOut(clamp((t - b0) / (B[7] - b0)));
        st.setCam(540, lerp(1350, 1300, u), lerp(1.6, 0.95, u));
        salaCasa(st, t, { quente: lerp(0.45, 0.85, u) });
        const grupo = (P, M, Fi, adultoF, alpha) => {
          st.mundo(cc => {
            cc.save(); cc.globalAlpha = alpha;
            sofaCasa(cc, 540);
            P.reset(); P.x = 400; P.y = CH - 20; P.piscar = piscada(t, 3); respira(P, t); P.exp = abraca > 0.5 ? 'fechado' : 'feliz'; P.boca = 'sorriso'; P.olhar = [1, 0];
            M.reset(); M.x = 690; M.y = CH - 20; M.piscar = piscada(t, 3.4, 1); respira(M, t, 1); M.exp = 'feliz'; M.boca = 'sorriso'; M.olhar = [-1, 0.2];
            if (abraca > 0) { const hy = adultoF ? -125 : -80; P.frente = [true, true]; P.ik(1, lerp(66, 105, abraca), lerp(-150, hy, abraca)); M.frente = [true, true]; M.ik(-1, lerp(-66, -110, abraca), lerp(-150, hy - 10, abraca) + Math.sin(t * 3) * 6 * abraca); P.semBracos = M.semBracos = true; }
            P.draw(cc, t); M.draw(cc, t); P.semBracos = M.semBracos = false;
            Fi.reset(); Fi.x = 545; Fi.y = adultoF ? lerp(CH - 60, CH + 20, levanta) : CH + 30; Fi.piscar = piscada(t, 4); Fi.exp = abraca > 0.5 ? 'fechado' : 'feliz'; Fi.boca = 'sorriso';
            if (abraca > 0) { Fi.frente = [true, true]; Fi.ik(-1, lerp(-66, -130, abraca), lerp(-150, -195, abraca)); Fi.ik(1, lerp(66, 130, abraca), lerp(-150, -195, abraca)); }
            Fi.draw(cc, t);
            if (abraca > 0) { P.drawArms(cc, t); M.drawArms(cc, t); }
            cc.restore();
          });
        };
        grupo(Pv, Mv, Fa, true, 1 - passado * 0.7);
        if (passado > 0.01) grupo(Pj, Mj, F, false, passado * 0.85);
        memoria(st, passado + 0.3 * u);
        st.overlay('#000', sstep(B[7] - 1.6, B[7], t));
      },
    };
  },
};
