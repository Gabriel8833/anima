// "E se você tivesse dependência emocional em um relacionamento tóxico?" — Lucas e Sofia
// Metáfora visual: a cor do suéter de Lucas vai se apagando conforme ele se perde; no fim volta só um pouco.
import { TAU, lerp, clamp, sstep, win, easeInOut, easeOut, rng, mix } from '../../../motor/base.js';
import { glow, rrect, line, circle, ellipse, poly, vgrad, shape, sparkle, cloud } from '../../../motor/desenho.js';
import { lucas, sofia, corLucas, lagrima, amigo, celular, xicara } from '../../../personagens/elenco.js';
import { quarto, cama, cobertor, escrivaninha, rua, mesaCafe, sala, sofa, bairro, banco, colina, balaoFala, espelho } from '../../../cenarios/lugares.js';

const W = 1080, H = 1920;
const piscada = (t, f = 3.6, o = 0) => (((t + o) % f) < 0.14 ? 1 : 0);
const fala = (t, ativo, f = 11) => (ativo && Math.sin(t * f) > 0 ? 'aberta' : null);
const cadeira = (c, x, y, cor = '#3a3a3a') => rrect(c, x - 70, y - 260, 140, 200, 18, cor, { lw: 5 });
function coracao(c, x, y, s, cor, a) { if (a <= 0.01) return; c.save(); c.globalAlpha *= a; c.translate(x, y); c.scale(s, s); shape(c, c => { c.moveTo(0, 12); c.bezierCurveTo(-26, -6, -14, -30, 0, -16); c.bezierCurveTo(14, -30, 26, -6, 0, 12); }, cor, { lw: 3 }); c.restore(); }
function relogioTela(st, txt, a, cor = '#bfe0ff') { st.text(txt, 870, 230, { size: 60, fill: cor, alpha: a, lw: 10 }); }
function chuvaJanela(st, t, a = 1) { st.camada(0.9, c => { c.save(); c.beginPath(); c.rect(560, 420, 420, 520); c.clip(); c.globalAlpha = 0.5 * a; c.strokeStyle = '#a8c0e0'; c.lineWidth = 3; const r = rng(3); for (let i = 0; i < 40; i++) { const x = 540 + r() * 460, y = 400 + ((r() * 600 + t * 700) % 600); c.beginPath(); c.moveTo(x, y); c.lineTo(x - 8, y + 34); c.stroke(); } c.restore(); }); }
// tela de conversa (Lucas manda mensagem longa, ela visualiza e demora; depois "ok")
function chatSofia(st, t, t0) {
  st.camada(0, c => {
    vgrad(c, 0, 0, W, H, [[0, '#0c1020'], [1, '#18203a']]); glow(c, 540, 960, 900, '#5a8aff', 0.2);
    c.save(); c.translate(540, 980);
    rrect(c, -330, -640, 660, 1280, 60, '#111116', { lw: 8 }); rrect(c, -300, -600, 600, 1200, 30, '#ece6dc', { stroke: null });
    rrect(c, -300, -600, 600, 120, 30, '#5a4a7a', { stroke: null }); circle(c, -240, -544, 34, '#e8705a', { lw: 3 }); c.font = '800 42px Inter, sans-serif'; c.textAlign = 'left'; c.fillStyle = '#fff'; c.fillText('Sofia', -190, -530);
    const st2 = t < t0 + 1.6 ? 'online' : 'visto por último hoje às 14:03'; c.font = '500 24px Inter, sans-serif'; c.fillText(st2, -190, -498);
    const msg = (y, linhas, minha, hora, a = 1) => { if (a <= 0) return; c.save(); c.globalAlpha *= a; c.font = '600 32px Inter, sans-serif'; const w = Math.max(...linhas.map(l => c.measureText(l).width)) + 56, h = 26 + linhas.length * 42; const x = minha ? 270 - w : -270; rrect(c, x, y, w, h, 22, minha ? '#d4c8f0' : '#ffffff', { lw: 3 }); c.fillStyle = '#2b1f2a'; linhas.forEach((l, i) => c.fillText(l, x + 28, y + 46 + i * 42)); c.font = '500 22px Inter, sans-serif'; c.fillStyle = '#7a7a8a'; c.fillText(hora, minha ? x + w - 90 : x + 16, y + h + 26); c.restore(); };
    msg(-440, ['bom dia ☀️ dormiu bem?'], true, '08:12');
    msg(-320, ['ei, tá tudo bem?', 'fiz alguma coisa?', 'se fiz me fala, por favor', 'não quero que fique', 'chateada comigo 🥺'], true, '14:02');
    if (t > t0 + 1.0) { c.font = '600 24px Inter, sans-serif'; c.fillStyle = '#4a8ad0'; c.textAlign = 'right'; c.fillText('✓✓ visualizado 14:03', 270, -60); c.textAlign = 'left'; }
    if (t > t0 + 1.6 && t < t0 + 2.6) { c.font = '700 30px Inter, sans-serif'; c.fillStyle = '#9a9aaa'; c.textAlign = 'center'; c.fillText('· · · 3 horas depois · · ·', 0, 20); c.textAlign = 'left'; }
    msg(80, ['ok'], false, '17:46', sstep(t0 + 2.7, t0 + 2.9, t));
    rrect(c, -280, 500, 560, 70, 35, '#ffffff', { lw: 3 });
    c.restore();
  });
}

// ---------- 1. Quando tudo começa (quente) ----------
export const c1 = {
  nome: 'Quando tudo começa', inicio: 0, fim: 14.2,
  criar(st) {
    const L = lucas(), S = sofia();
    return {
      desenhar(t) {
        L.reset(); S.reset(); corLucas(L, 0); L.piscar = piscada(t); S.piscar = piscada(t, 4.1, 1);
        if (t < 4.2) {
          // café: se conhecem, conversam e riem
          st.setCam(540, 1290, lerp(1.2, 1.35, t / 4.2));
          rua(st, t);
          st.mundo(c => {
            const ri = win(t, 1.8, 2.1, 3.0, 3.4);
            S.x = 760; S.y = 1700; S.flip = -1; S.semPernas = true; S.exp = ri > 0.5 ? 'feliz' : 'normal'; S.boca = ri > 0.5 ? 'aberta' : (fala(t, t < 1.8) || 'sorriso'); S.olhar = [0.8, 0]; S.bracos(0.4, 1.5, 0.6 + Math.sin(t * 3) * 0.2, 1.4); S.jump = ri * Math.abs(Math.sin(t * 9)) * 8;
            L.x = 320; L.y = 1700; L.semPernas = true; L.exp = ri > 0.5 ? 'feliz' : 'normal'; L.boca = ri > 0.5 ? 'aberta' : (fala(t, t > 3.4) || 'sorriso'); L.olhar = [0.8, 0]; L.bracos(0.4, 1.5, 0.4, 1.5); L.blush = 0.8;
            cadeira(c, S.x, 1660); S.draw(c, t); cadeira(c, L.x, 1660); L.draw(c, t);
            mesaCafe(c, 540, 1600);
          });
          return;
        }
        if (t < 7.6) {
          // passeio ao pôr do sol
          const u = (t - 4.2) / 3.4;
          L.x = lerp(160, 560, u); S.x = L.x + 180; L.y = S.y = 1700; L.walk = S.walk = t * 5; L.exp = 'feliz'; L.boca = 'sorriso'; L.olhar = [0.8, -0.1]; S.exp = 'feliz'; S.boca = Math.sin(t * 2) > 0 ? 'aberta' : 'sorriso'; S.olhar = [-0.6, 0]; S.flip = 1;
          L.bracos(0.3, 0.3, 0.6, 0.6); S.bracos(0.6, 0.6, 0.3, 0.3);
          st.setCam(L.x + 100, 1270, 1.2);
          bairro(st, t, { sol: 1 });
          st.mundo(c => { L.draw(c, t); S.draw(c, t); const [a, b] = L.mao(1), [d, e] = S.mao(-1); circle(c, (a + d) / 2, (b + e) / 2, 14, '#e8b894', { lw: 3 }); coracao(c, (a + d) / 2, (b + e) / 2 - 200 - ((t * 60) % 120), 1.6, '#ff7a8a', 0.7); });
          return;
        }
        if (t < 11) {
          // de madrugada trocando mensagens
          st.setCam(420, 1270, 1.55);
          quarto(st, t, { luz: 0.1 });
          st.mundo(c => {
            cama(c, 0.6);
            L.x = 400; L.y = 1610; L.semPernas = true; L.maoD = celular(1); L.bracos(0.2, 0.1, 0.7, 2.3); L.olhar = [0, 0.8]; L.exp = 'feliz'; L.boca = Math.sin(t * 1.5) > 0.3 ? 'aberta' : 'sorriso'; L.blush = 0.8;
            L.draw(c, t); cobertor(c, 0.6, 300);
            const [hx, hy] = L.cabeca(); glow(c, hx + 20, hy + 40, 240, '#ffd0a0', 0.35);
            const emo = ['😂', '❤️', 'kkkkk', '🥰', 'boa noite?', 'não, fala mais!']; for (let i = 0; i < 6; i++) { const u = ((t - 7.6) * 0.45 + i / 6) % 1; balaoFala(c, 260 + (i % 2) * 280, 1420 - u * 520, 180 + (i % 3) * 40, 74, Math.sin(u * Math.PI), { cauda: i % 2 ? 1 : -1, texto: emo[i], tam: 34, cor: i % 2 ? '#ffe0e8' : '#e8f0ff' }); }
          });
          relogioTela(st, '02:14', 1, '#ffd0a0');
          return;
        }
        // banco ao pôr do sol, um fone para cada, sonhando planos
        st.setCam(540, 1300, lerp(1.3, 1.45, (t - 11) / 3.2));
        bairro(st, t, { sol: 0.95 });
        st.mundo(c => {
          banco(c, 540, 1660, 1);
          L.x = 400; L.y = 1640; L.semPernas = true; L.exp = 'feliz'; L.boca = 'sorriso'; L.olhar = [0.6, -0.5]; L.bracos(0.3, 1.3, 0.3, 1.3);
          S.x = 680; S.y = 1640; S.flip = -1; S.semPernas = true; S.exp = 'fechado'; S.boca = 'sorriso'; S.headTilt = -0.15; S.bracos(0.3, 1.3, 0.3, 1.3);
          L.draw(c, t); S.draw(c, t);
          const [a, b] = L.cabeca(), [d, e] = S.cabeca(); shape(c, c => { c.moveTo(a + 70, b + 10); c.quadraticCurveTo(540, b + 220, d - 70, e + 10); }, null, { stroke: '#f6f2ea', lw: 4 });
          for (let i = 0; i < 3; i++) { const u = ((t - 11) * 0.6 + i / 3) % 1; c.save(); c.globalAlpha = Math.sin(u * Math.PI); c.font = '900 44px Inter'; c.fillStyle = '#ffffff'; c.fillText('♪', 500 + i * 30, b - 60 - u * 160); c.restore(); }
          // balão de pensamento: uma casinha, os dois juntos
          const a2 = sstep(12.0, 12.4, t); if (a2 > 0) { c.save(); c.globalAlpha = a2; for (const [x, y, r] of [[560, b - 140, 12], [590, b - 190, 20]]) circle(c, x, y, r, '#ffffff', { lw: 4 }); ellipse(c, 640, b - 330, 170, 110, '#ffffff', { lw: 5 }); poly(c, [[580, b - 320], [640, b - 380], [700, b - 320]], '#e8705a', { lw: 4 }); rrect(c, 590, b - 320, 100, 70, 4, '#f0d890', { lw: 4 }); coracao(c, 640, b - 290, 1, '#ff7a8a', 1); c.restore(); }
        });
      },
    };
  },
};

// ---------- 2. O medo de perder (esfria) ----------
export const c2 = {
  nome: 'O medo de perder', inicio: 14.2, fim: 26.4,
  criar(st) {
    const L = lucas();
    return {
      desenhar(t) {
        L.reset(); corLucas(L, 0.12); L.piscar = piscada(t, 2.8);
        if (t < 18.6) {
          // olha o celular de novo e de novo
          st.setCam(560, 1320, 1.45);
          quarto(st, t, { luz: 0.55 });
          const ciclo = [[14.6, 15.6], [16.0, 17.0], [17.4, 18.4]];
          const pega = ciclo.reduce((m, [a, b]) => Math.max(m, win(t, a, a + 0.2, b - 0.2, b)), 0);
          st.mundo(c => {
            escrivaninha(c, 520, t, { tela: 0.3 });
            L.x = 580; L.y = 1760; L.semPernas = true; L.olhar = pega > 0.5 ? [0, 0.8] : [-0.5, 0.6]; L.exp = pega > 0.5 ? 'preocupado' : 'normal'; L.boca = 'reta';
            L.maoD = pega > 0.3 ? celular(1) : null; L.bracos(0.6, 2.0, lerp(0.5, 0.8, pega), lerp(1.8, 2.3, pega));
            L.draw(c, t);
            if (pega < 0.3) { rrect(c, 640, 1560, 44, 24, 6, '#1a1a22', { lw: 3 }); }
          });
          const hora = t < 16 ? '14:03' : t < 17.4 ? '15:20' : '17:46'; relogioTela(st, hora, 1);
          return;
        }
        if (t < 22.4) { chatSofia(st, t, 18.6); return; }
        // no chão, abraçando os joelhos, pensamentos ansiosos; chuva na janela
        st.setCam(560, 1300, lerp(1.4, 1.65, (t - 22.4) / 4));
        quarto(st, t, { luz: 0.3 }); chuvaJanela(st, t);
        st.mundo(c => {
          cama(c, 0.7);
          L.x = 560; L.y = 1780; L.semPernas = true; L.exp = 'preocupado'; L.boca = 'tremendo'; L.olhar = [Math.sin(t * 2.2) * 0.8, -0.2]; L.bracos(0.5, 2.4, 0.5, 2.4); L.squash = 0.08 + Math.sin(t * 6) * 0.01; L.suor = 0.6;
          L.draw(c, t);
          rrect(c, 440, 1600, 240, 120, 40, '#3a4a6a', { lw: 5 }); // joelhos
          const [hx, hy] = L.cabeca();
          const pens = ['fiz algo errado?', 'ela cansou de mim?', "por que só 'ok'?"];
          pens.forEach((p, i) => { const a0 = 22.7 + i * 1.0; balaoFala(c, hx + [-140, 140, 0][i], hy - [150, 250, 360][i], 300, 86, sstep(a0, a0 + 0.3, t), { cauda: [1, -1, 1][i], texto: p, tam: 27, cor: '#e8eef8' }); });
        });
      },
    };
  },
};

// ---------- 3. Você começa a se perder ----------
export const c3 = {
  nome: 'Você começa a se perder', inicio: 26.4, fim: 42,
  criar(st) {
    const L = lucas(), S = sofia(), A = [amigo(0), amigo(2)];
    return {
      desenhar(t) {
        L.reset(); S.reset(); corLucas(L, lerp(0.2, 0.45, (t - 26.4) / 15.6)); L.piscar = piscada(t, 3.1); S.piscar = piscada(t, 4.3);
        if (t < 31) {
          // pronto pra sair com os amigos... a mensagem chega e ele desiste
          st.setCam(520, 1290, 1.4);
          quarto(st, t, { luz: 0.5 });
          st.mundo(c => {
            rrect(c, 150, 1100, 230, 580, 8, '#7a5a3a', { lw: 6 }); circle(c, 340, 1420, 10, '#d8b040', { lw: 3 }); // porta
            const msg = sstep(27.6, 27.8, t), desiste = sstep(29.0, 29.6, t);
            L.x = 520; L.y = 1700; L.olhar = msg > 0.5 ? [0, 0.8] : [-0.8, 0]; L.exp = desiste > 0.5 ? 'preocupado' : (msg > 0.5 ? 'choque' : 'feliz'); L.boca = desiste > 0.5 ? 'triste' : (msg > 0.5 ? 'reta' : 'sorriso');
            L.maoD = msg > 0.5 ? celular(1) : null; L.bracos(0.3, 0.3, msg > 0.5 ? 0.8 : 0.3, msg > 0.5 ? 2.2 : 0.3);
            // jaqueta jeans por cima que ele tira
            L.d.capa = desiste < 0.5 ? null : null;
            L.draw(c, t);
            if (desiste < 1) { c.save(); c.globalAlpha = 1 - desiste; const jx = 520 + desiste * 120, jy = 1700 + desiste * 60; for (const s of [-1, 1]) shape(c, cc => { cc.moveTo(jx + s * 30, jy - 236); cc.lineTo(jx + s * 66, jy - 220); cc.lineTo(jx + s * 74, jy - 110); cc.lineTo(jx + s * 40, jy - 110); cc.closePath(); }, '#4a6a9a', { lw: 4 }); c.restore(); }
            const [hx, hy] = L.cabeca();
            balaoFala(c, hx + 40, hy - 190, 420, 100, win(t, 27.7, 27.9, 29.2, 29.4), { cauda: -1, texto: 'Sofia: vai sair de novo?', tam: 30, cor: '#e8e0f8' });
            balaoFala(c, hx - 20, hy - 190, 460, 100, win(t, 29.6, 29.8, 30.8, 31.0), { cauda: -1, texto: 'galera, hoje não vou 😕', tam: 30, cor: '#d4ecc8' });
          });
          return;
        }
        if (t < 33.4) {
          // os amigos com uma cadeira vazia
          st.setCam(540, 1290, 1.3);
          rua(st, t, { cinza: 0.3 });
          st.mundo(c => {
            A[0].reset(); A[0].x = 230; A[0].y = 1700; A[0].semPernas = true; A[0].exp = 'preocupado'; A[0].boca = 'reta'; A[0].maoD = celular(1); A[0].bracos(0.3, 0.3, 0.8, 2.2); A[0].olhar = [0, 0.7];
            A[1].reset(); A[1].x = 850; A[1].y = 1700; A[1].flip = -1; A[1].semPernas = true; A[1].exp = 'normal'; A[1].boca = 'reta'; A[1].olhar = [-0.9, 0.2];
            for (const a of A) { cadeira(c, a.x, 1660); a.draw(c, t); }
            cadeira(c, 540, 1660, '#4a4a4a'); mesaCafe(c, 540, 1600);
            c.save(); c.font = '900 30px Inter'; c.textAlign = 'center'; c.fillStyle = '#ffffff'; c.globalAlpha = 0.8; c.fillText('(cadeira do Lucas)', 540, 1380); c.restore();
          });
          return;
        }
        // jantar: ele quer falar, desiste; depois a discussão e ele pede desculpa
        const disc = t > 37.4;
        st.setCam(540, 1280, disc ? lerp(1.3, 1.55, (t - 37.4) / 4.6) : 1.3);
        sala(st, t);
        st.mundo(c => {
          glow(c, 540, 1350, 500, '#ffd8a0', disc ? 0.12 : 0.25);
          S.x = 780; S.y = 1700; S.flip = -1; S.semPernas = true; S.olhar = [0.8, 0];
          L.x = 300; L.y = 1700; L.semPernas = true; L.olhar = [0.8, 0];
          if (!disc) {
            const tenta = win(t, 33.8, 34.0, 35.6, 35.9);
            S.exp = 'normal'; S.boca = 'reta'; S.maoD = celular(1); S.bracos(0.3, 0.3, 0.8, 2.2); S.olhar = [0, 0.7];
            L.exp = tenta > 0.5 ? 'preocupado' : 'normal'; L.boca = tenta > 0.5 ? (fala(t, t < 35) || 'reta') : (t > 36.2 ? 'sorriso' : 'reta'); L.bracos(0.4, 1.4, 0.4, 1.4);
          } else {
            const desc = t > 40.0;
            S.exp = desc ? 'normal' : 'raiva'; S.boca = desc ? 'reta' : (fala(t, true, 13) || 'reta'); S.bracos(desc ? 0.5 : 0.9 + Math.sin(t * 5) * 0.3, desc ? 2.3 : 0.6, desc ? 0.5 : 1.0, desc ? 2.3 : 0.8);
            L.exp = 'preocupado'; L.boca = desc ? (fala(t, t < 41) || 'triste') : 'triste'; L.bracos(0.3, 1.6, 0.3, 1.6); L.headTilt = 0.06;
          }
          cadeira(c, S.x, 1660); S.draw(c, t); cadeira(c, L.x, 1660); L.draw(c, t);
          rrect(c, 140, 1560, 800, 40, 10, '#5a3a2a', { lw: 6 }); c.save(); c.translate(400, 1560); xicara()(c, 1, t); c.restore();
          const [hx, hy] = L.cabeca(), [sx, sy] = S.cabeca();
          if (!disc) { const tenta = win(t, 33.8, 34.0, 35.6, 35.9); balaoFala(c, hx + 60, hy - 190, 440, 100, tenta, { cauda: -1, texto: 'eu fiquei chateado quando...', tam: 28 }); if (t > 35.6 && t < 36.2) for (let i = 0; i < 6; i++) { const u = (t - 35.6) / 0.6; circle(c, hx + 60 + Math.cos(i) * 140 * u, hy - 190 + Math.sin(i) * 60 * u, 6, '#ffffff', { stroke: null, alpha: 1 - u }); } }
          else {
            balaoFala(c, sx - 40, sy - 190, 300, 110, win(t, 37.6, 37.8, 39.8, 40.0), { cauda: 1, cor: '#ffd8d0' });
            balaoFala(c, hx + 40, hy - 170, 230, 90, sstep(40.4, 40.6, t), { cauda: -1, texto: 'desculpa...', tam: 32, cor: '#e8eef8' });
            lagrima(c, L, t, sstep(39.0, 39.6, t), 1);
          }
        });
      },
    };
  },
};

// ---------- 4. O ciclo ----------
function cenaFria(st, t, L, S) {
  st.setCam(540, 1300, 1.35);
  sala(st, t);
  st.mundo(c => {
    sofa(c, 540);
    S.reset(); S.x = 700; S.y = 1540; S.semPernas = true; S.flip = -1; S.maoD = celular(1); S.bracos(0.3, 0.3, 0.8, 2.2); S.olhar = [0, 0.8]; S.exp = 'normal'; S.boca = 'reta'; S.headTilt = 0.1; S.piscar = piscada(t, 4.4);
    L.x = 380; L.y = 1540; L.semPernas = true; L.olhar = [0.8, 0]; L.exp = 'preocupado'; L.boca = 'reta'; L.bracos(0.3, 1.5, lerp(0.3, 1.2, win(t % 6, 1, 1.3, 2.4, 2.8)), 0.4);
    S.draw(c, t); L.draw(c, t);
    rrect(c, 200, 1470, 680, 60, 20, '#4a4a6a', { lw: 6 });
  });
}
function cenaQuente(st, t, L, S, t0) {
  st.setCam(540, 1290, 1.3 + (t - t0) * 0.03);
  bairro(st, t, { sol: 1 });
  st.mundo(c => {
    const abraco = sstep(t0 + 0.6, t0 + 1.2, t);
    S.reset(); S.x = lerp(860, 640, abraco); S.y = 1700; S.flip = -1; S.exp = 'feliz'; S.boca = 'sorriso'; S.olhar = [0.8, 0]; S.bracos(0.3, 0.3, lerp(0.3, 1.4, abraco), lerp(0.3, 1.0, abraco)); if (abraco > 0 && abraco < 1) S.walk = t * 6; S.piscar = piscada(t, 4.0);
    L.x = 440; L.y = 1700; L.exp = abraco > 0.5 ? 'fechado' : 'choque'; L.boca = abraco > 0.5 ? 'sorriso' : 'o'; L.olhar = [0.8, 0]; L.bracos(lerp(0.2, 1.3, abraco), lerp(0.1, 0.9, abraco), 0.2, 0.1); L.blush = 0.9;
    L.draw(c, t); S.draw(c, t);
    glow(c, 540, 1400, 460, '#ffd890', 0.3 * abraco); for (let i = 0; i < 3; i++) coracao(c, 540 + (i - 1) * 60, 1180 - ((t * 50 + i * 40) % 120), 1.2, '#ff8a9a', abraco * 0.8);
  });
}
export const c4 = {
  nome: 'O ciclo', inicio: 42, fim: 57.2,
  criar(st) {
    const L = lucas(), S = sofia();
    // trechos: frio, quente, e depois alternância cada vez mais rápida (o ciclo)
    const cortes = [[42, 'f'], [46.6, 'q'], [51.6, 'f'], [52.9, 'q'], [54.0, 'f'], [54.9, 'q'], [55.6, 'f'], [56.15, 'q'], [56.6, 'f']];
    return {
      desenhar(t) {
        L.reset(); L.piscar = piscada(t, 3.3);
        let idx = 0; for (let i = 0; i < cortes.length; i++) if (t >= cortes[i][0]) idx = i;
        const [t0, tipo] = cortes[idx];
        corLucas(L, tipo === 'q' ? 0.2 : 0.5);
        if (tipo === 'f') cenaFria(st, t, L, S); else cenaQuente(st, t, L, S, t0);
        if (t < 46.6) st.camada(0.9, c => { rrect(c, 110, 560, 220, 240, 8, '#e8e4dc', { lw: 5 }); rrect(c, 110, 560, 220, 60, 8, '#c84a4a', { lw: 5 }); const dias = ['SEG', 'TER', 'QUA', 'QUI', 'SEX']; const d = Math.min(4, Math.floor((t - 42) / 0.9)); c.font = '900 64px Inter'; c.textAlign = 'center'; c.fillStyle = '#2b1f2a'; c.fillText(dias[d], 220, 730); c.font = '900 26px Inter'; c.fillStyle = '#fff'; c.fillText('FRIEZA', 220, 600); });
        if (tipo === 'f' && t < 46.6) st.mundo(c => { const [sx, sy] = S.cabeca(); balaoFala(c, sx - 20, sy - 170, 230, 90, win(t, 43.2, 43.4, 44.6, 44.8), { cauda: 1, texto: 'agora não.', tam: 32 }); });
        if (t > 51.6) st.camada(0, c => { const a = sstep(51.6, 52.0, t); c.save(); c.globalAlpha = a * 0.85; c.translate(540, 470); c.rotate(-t * 3); c.lineWidth = 16; c.strokeStyle = '#ffffff'; c.beginPath(); c.arc(0, 0, 110, 0.3, TAU - 0.3); c.stroke(); c.rotate(TAU - 0.3); poly(c, [[110, -40], [150, 10], [70, 10]].map(([x, y]) => [x, y]), '#ffffff', { stroke: null }); c.restore(); });
      },
    };
  },
};

// ---------- 5. Você já não se reconhece ----------
export const c5 = {
  nome: 'Você já não se reconhece', inicio: 57.2, fim: 70.4,
  criar(st) {
    const L = lucas(), R = lucas();
    return {
      desenhar(t) {
        L.reset(); corLucas(L, 0.75); L.piscar = piscada(t, 4.2);
        if (t < 61.6) {
          // fotos antigas e o violão parado
          st.setCam(lerp(500, 560, (t - 57.2) / 4.4), 1260, 1.4);
          quarto(st, t, { luz: 0.15 });
          st.mundo(c => {
            // mural de fotos
            const fotos = [[180, 1060, 'violão + amigos'], [380, 1020, 'skate'], [180, 1260, 'praia c/ galera'], [380, 1230, 'show']];
            fotos.forEach(([x, y, txt], i) => { c.save(); c.translate(x, y); c.rotate((i % 2 ? 0.06 : -0.05)); rrect(c, -80, -90, 160, 170, 4, '#f6f2ea', { lw: 4 }); vgrad(c, -68, -78, 136, 120, [[0, ['#8ac0e8', '#e8a060', '#6ac0d0', '#a06ad0'][i]], [1, ['#e8d0a0', '#a05a3a', '#e8d8a0', '#3a2a5a'][i]]]); circle(c, -20, -10, 16, '#e8b894', { stroke: null }); circle(c, 24, -6, 14, '#c89070', { stroke: null }); c.font = '700 18px Inter'; c.textAlign = 'center'; c.fillStyle = '#5a5a6a'; c.fillText(txt, 0, 66); c.restore(); });
            // violão empoeirado com teia
            c.save(); c.translate(900, 1680); c.rotate(-0.2); ellipse(c, 0, -60, 70, 80, '#b8763a', { lw: 5 }); ellipse(c, 0, -170, 52, 60, '#b8763a', { lw: 5 }); circle(c, 0, -90, 20, '#3a2418', { lw: 3 }); rrect(c, -10, -460, 20, 260, 4, '#5a3a22', { lw: 4 }); c.restore();
            c.save(); c.globalAlpha = 0.5; c.strokeStyle = '#ffffff'; c.lineWidth = 2; for (let i = 0; i < 5; i++) { c.beginPath(); c.moveTo(940, 1250); c.lineTo(940 + Math.cos(i * 0.4) * 120, 1250 + Math.sin(i * 0.4) * 120); c.stroke(); } c.restore();
            const pega = sstep(59.0, 59.5, t);
            L.x = lerp(640, 420, sstep(57.2, 58.6, t)); L.y = 1720; if (t < 58.6) L.walk = t * 4; L.olhar = pega > 0.5 ? [0, 0.6] : [-0.7, -0.4]; L.exp = 'preocupado'; L.boca = 'triste'; L.bracos(0.3, 0.3, lerp(0.3, 1.0, pega), lerp(0.3, 2.0, pega));
            L.maoD = pega > 0.5 ? (c => { rrect(c, -50, -110, 100, 110, 4, '#f6f2ea', { lw: 4 }); vgrad(c, -40, -100, 80, 70, [[0, '#8ac0e8'], [1, '#e8d0a0']]); }) : null;
            L.draw(c, t);
          });
          return;
        }
        if (t < 66.4) {
          // espelho: o reflexo apagado, quase sem cor
          st.setCam(580, 1250, lerp(1.45, 1.7, (t - 61.6) / 4.8));
          quarto(st, t, { luz: 0.08 });
          st.mundo(c => {
            espelho(c, 620, 960, 340, 560, t, c => { R.reset(); corLucas(R, 1); R.x = 790; R.y = 1520; R.s = 0.92; R.flip = -1; R.alpha = 0.55; R.exp = 'preocupado'; R.boca = 'reta'; R.olhar = [0.9, 0]; R.bracos(0.2, 0.1, lerp(0.2, 1.4, sstep(64, 64.6, t)), lerp(0.1, 0.4, sstep(64, 64.6, t))); R.draw(c, t); }, { frio: 1 });
            L.x = 400; L.y = 1700; L.exp = 'preocupado'; L.boca = 'reta'; L.olhar = [0.9, 0]; L.bracos(0.2, 0.1, lerp(0.2, 1.4, sstep(64, 64.6, t)), lerp(0.1, 0.4, sstep(64, 64.6, t)));
            L.draw(c, t); lagrima(c, L, t, sstep(64.8, 65.4, t), -1);
          });
          return;
        }
        // uma mensagem e ele agarra o celular na hora... e para
        st.setCam(460, 1240, 1.7);
        quarto(st, t, { luz: 0.08 });
        st.mundo(c => {
          cama(c, 0.85);
          const chega = sstep(66.8, 66.9, t), agarra = sstep(67.0, 67.2, t), para = sstep(68.6, 69.2, t);
          L.x = 420; L.y = 1610; L.semPernas = true; L.maoD = agarra > 0.5 ? celular(1) : null; L.bracos(0.3, 0.3, lerp(0.3, 0.8, agarra), lerp(0.3, 2.3, agarra));
          L.exp = agarra > 0.5 ? (para > 0.5 ? 'preocupado' : 'feliz') : 'normal'; L.boca = para > 0.5 ? 'reta' : (agarra > 0.5 ? 'sorriso' : 'reta'); L.olhar = [0, 0.8];
          L.draw(c, t); cobertor(c, 0.85, 300);
          if (agarra < 0.5) { rrect(c, 620, 1474, 50, 28, 6, '#1a1a22', { lw: 3 }); if (chega) { rrect(c, 625, 1478, 40, 20, 3, '#bfe0ff', { stroke: null }); glow(c, 645, 1480, 160, '#9ad0ff', 0.6); } }
          else { const [hx, hy] = L.cabeca(); glow(c, hx + 20, hy + 40, 240, '#9ad0ff', 0.35); }
          const [hx, hy] = L.cabeca(); balaoFala(c, hx + 60, hy - 180, 300, 90, win(t, 67.0, 67.2, 68.6, 68.9), { cauda: -1, texto: 'Sofia: tá aí?', tam: 32, cor: '#e8e0f8' });
        });
      },
    };
  },
};

// ---------- 6. A reflexão (amanhecer) ----------
export const c6 = {
  nome: 'A reflexão', inicio: 70.4, fim: 87.6,
  criar(st) {
    const L = lucas();
    return {
      desenhar(t) {
        L.reset(); L.piscar = piscada(t, 4.0);
        const volta = sstep(80, 87, t); corLucas(L, lerp(0.75, 0.4, volta)); // a cor volta só um pouco: é um processo
        const sol = lerp(0.3, 0.85, clamp((t - 70.4) / 17));
        if (t < 80.6) {
          // sentado sozinho; desliga o celular; respira fundo
          const desliga = sstep(76.0, 76.3, t), guarda = sstep(77.2, 77.8, t), resp = win(t, 78.3, 79.0, 79.6, 80.2);
          L.x = 380; L.y = 1580; L.semPernas = true; L.olhar = desliga < 0.5 ? [0, 0.8] : (resp > 0.3 ? [0.3, -0.6] : [0.9, -0.3]);
          L.exp = resp > 0.4 ? 'fechado' : 'preocupado'; L.boca = resp > 0.6 ? 'o' : 'triste'; L.squash = -resp * 0.04;
          L.maoD = guarda < 0.5 ? celular(desliga > 0.5 ? 0 : 1) : null; L.bracos(0.5, 1.3, guarda < 0.5 ? 0.8 : 0.5, guarda < 0.5 ? 2.2 : 1.3);
          const [hx, hy] = L.cabeca();
          st.setCam(lerp(hx + 140, hx + 100, (t - 70.4) / 10), hy + 120, lerp(1.9, 1.7, (t - 70.4) / 10));
          colina(st, t, { sol, sx: 820 });
          st.mundo(c => {
            L.draw(c, t);
            shape(c, c => { c.moveTo(220, 1640); c.quadraticCurveTo(230, 1500, 380, 1490); c.quadraticCurveTo(540, 1500, 550, 1640); c.closePath(); }, '#7a7280');
            if (desliga > 0 && desliga < 1) { const [mx, my] = L.mao(1); glow(c, mx, my - 30, 80, '#ffffff', 1 - desliga); }
            lagrima(c, L, t, win(t, 72.5, 73.2, 75.5, 76.2), 1);
            if (resp > 0.5) { cloud(c, hx + 80, hy + 40 - (t - 79.6) * 40, 24, 'rgba(255,255,255,0.4)', { seed: 3 }); }
          });
          return;
        }
        // levanta e caminha devagar em direção ao sol; a câmera se afasta
        const k = easeInOut(clamp((t - 80.6) / 7));
        const levanta = sstep(80.6, 81.4, t);
        L.x = lerp(380, 820, clamp((t - 81.2) / 6.4)); L.y = lerp(1580, 1700, levanta); L.semPernas = levanta < 0.5; if (t > 81.4) L.walk = t * 3.6;
        L.exp = 'normal'; L.boca = 'reta'; L.olhar = [0.9, -0.2]; L.bracos(0.15, 0.3, 0.15, 0.3); L.s = lerp(1, 0.85, k);
        st.setCam(lerp(500, 620, k), lerp(1300, 1120, k), lerp(1.35, 0.7, k));
        colina(st, t, { sol, sx: 820 });
        st.mundo(c => { shape(c, c => { c.moveTo(220, 1640); c.quadraticCurveTo(230, 1500, 380, 1490); c.quadraticCurveTo(540, 1500, 550, 1640); c.closePath(); }, '#7a7280'); L.draw(c, t); glow(c, L.x + 60, 1450, 260, '#ffd890', 0.25 * sol); });
      },
    };
  },
};
