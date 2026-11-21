// "E se você tivesse ego demais?" — 6 cenas. Metáfora visual: a coroa dourada do ego cresce a cada cena.
import { TAU, lerp, clamp, sstep, win, easeInOut, easeOut, easeBack, rng, mix } from '../../../motor/base.js';
import { glow, rrect, line, circle, ellipse, poly, vgrad, shape, sparkle } from '../../../motor/desenho.js';
import { ego, amigo, passante, celular, trofeu, folha, coroa } from '../../../personagens/elenco.js';
import { rua, mesaCafe, quarto, bairro, balaoFala, espelho, pia, banheiro, salaoVazio } from '../../../cenarios/lugares.js';

const W = 1080, H = 1920;
const piscada = (t, f = 3.7, o = 0) => (((t + o) % f) < 0.14 ? 1 : 0);
const fala = (t, ativo, f = 11) => (ativo && Math.sin(t * f) > 0 ? 'aberta' : null);
function confete(c, t, t0, x, y) { const r = rng(5); for (let i = 0; i < 40; i++) { const u = clamp((t - t0) / 3); if (u <= 0) return; const vx = (r() - 0.5) * 900, vy = -500 - r() * 600; const px = x + vx * u, py = y + vy * u + 900 * u * u; c.save(); c.translate(px, py); c.rotate(t * 6 + i); c.fillStyle = ['#ff5a7a', '#ffd23a', '#5ab0ff', '#6ad08a'][i % 4]; c.fillRect(-8, -4, 16, 8); c.restore(); } }
// cadeira de café vista de frente (atrás do personagem sentado)
const cadeira = (c, x, y, cor = '#3a3a3a') => { rrect(c, x - 70, y - 260, 140, 200, 18, cor, { lw: 5 }); };
// tela do celular com o grupo de amigos (sem resposta)
function chatTela(st, t, t0) {
  st.camada(0, c => {
    vgrad(c, 0, 0, W, H, [[0, '#0a0c16'], [1, '#141a2a']]); glow(c, 540, 960, 900, '#5a8aff', 0.25);
    c.save(); c.translate(540, 980); c.rotate(-0.03 + Math.sin(t * 0.8) * 0.01);
    rrect(c, -330, -640, 660, 1280, 60, '#111116', { lw: 8 }); rrect(c, -300, -600, 600, 1200, 30, '#ece6dc', { stroke: null });
    rrect(c, -300, -600, 600, 120, 30, '#2a6a5a', { stroke: null }); c.font = '800 40px Inter, sans-serif'; c.textAlign = 'left'; c.fillStyle = '#ffffff'; c.fillText('Galera 🍕', -200, -530); circle(c, -250, -544, 34, '#8ac8b0', { lw: 3 });
    const msg = (y, txt, minha, hora, a = 1) => { if (a <= 0) return; c.save(); c.globalAlpha *= a; c.font = '600 34px Inter, sans-serif'; const w = c.measureText(txt).width + 60; const x = minha ? 270 - w : -270; rrect(c, x, y, w, 76, 22, minha ? '#cdeec0' : '#ffffff', { lw: 3 }); c.fillStyle = '#2b1f2a'; c.fillText(txt, x + 30, y + 48); c.font = '500 22px Inter, sans-serif'; c.fillStyle = '#7a7a8a'; c.fillText(hora, minha ? x + w - 80 : x + w - 74, y + 100); c.restore(); };
    msg(-440, 'kkkkk bora sábado?', false, '3 sem.');
    msg(-320, 'não posso, tô ocupado', true, '3 sem.');
    msg(-200, 'eu avisei q ia dar errado', true, '2 sem.');
    msg(-80, 'vcs nunca me escutam', true, '1 sem.');
    msg(60, 'e aí, galera?', true, 'agora', sstep(t0 + 1.0, t0 + 1.3, t));
    if (t > t0 + 2.2) { c.font = '600 24px Inter, sans-serif'; c.fillStyle = '#4a8ad0'; c.textAlign = 'right'; c.fillText('visualizado', 270, 190); }
    const dig = win(t, t0 + 2.6, t0 + 2.8, t0 + 3.8, t0 + 4.0); if (dig > 0) { rrect(c, -270, 220, 130, 64, 22, '#ffffff', { lw: 3, alpha: dig }); for (let i = 0; i < 3; i++) circle(c, -232 + i * 28, 252 - Math.abs(Math.sin(t * 8 + i)) * 8, 8, '#9a9aaa', { stroke: null, alpha: dig }); }
    rrect(c, -280, 500, 560, 70, 35, '#ffffff', { lw: 3 });
    c.restore();
  });
}

// ---------- 1. Você é diferente ----------
export const c1 = {
  nome: 'Você é diferente', inicio: 0, fim: 15,
  criar(st) {
    const E = ego(), A = [amigo(0), amigo(1), amigo(2)], R = ego();
    const P = [0, 1, 2, 3, 4, 5].map(i => passante(i + 20));
    return {
      desenhar(t) {
        E.reset(); E.coroa = { s: 0.5 * easeBack(clamp((t - 3.6) / 0.6)) }; E.piscar = piscada(t, 3.2);
        if (t < 5) {
          E.x = lerp(140, 820, t / 5); E.y = 1700; E.walk = t * 5.5; E.exp = 'determinado'; E.boca = 'sorriso'; E.headTilt = -0.06; E.olhar = [Math.sin(t * 1.3) * 0.8, -0.1]; E.bracos(0.3 + Math.sin(t * 5.5) * 0.15, 0.4, 0.3 - Math.sin(t * 5.5) * 0.15, 0.4);
          st.setCam(E.x, 1260, 1.15);
          rua(st, t);
          st.mundo(c => {
            P.forEach((p, i) => { p.reset(); p.x = [260, 400, 980, 1110, 1500, 1640][i]; p.y = 1640; p.s = 0.92; p.flip = i % 2 ? -1 : 1; p.exp = 'feliz'; p.boca = Math.sin(t * 9 + i * 2) > 0 ? 'aberta' : 'sorriso'; p.olhar = [p.flip * 0.8, 0]; p.bracos(0.3, 0.5, 0.4 + Math.abs(Math.sin(t * 3 + i)) * 0.7, 1.0); p.draw(c, t); });
            E.draw(c, t);
            const [hx, hy] = E.cabeca(); if (t > 3.6 && t < 4.4) sparkle(c, hx + 40, hy - 150, 30, '#fff6c0', 1 - Math.abs(t - 4) / 0.4);
          });
          return;
        }
        if (t < 10) {
          // espelho: arruma o topete, sorri, aponta para o reflexo
          st.setCam(560, 1280, lerp(1.3, 1.5, (t - 5) / 5));
          banheiro(st, t, { frio: 0 });
          const pose = P2 => {
            P2.coroa = { s: 0.5 }; P2.exp = t > 7 ? 'feliz' : 'determinado'; P2.boca = t > 7 ? 'sorriso' : 'reta'; P2.olhar = [0.8, -0.1];
            if (t < 7) P2.bracos(0.2, 0.1, 2.6, 1.8 + Math.sin(t * 7) * 0.2);
            else if (t < 8.5) P2.bracos(0.2, 0.1, 0.2, 0.1);
            else P2.bracos(0.2, 0.1, 1.55, 0.05);
            if (t > 7.4 && t < 7.7) P2.piscar = 1;
          };
          st.mundo(c => {
            espelho(c, 600, 980, 360, 520, t, c => { R.reset(); pose(R); R.x = 780; R.y = 1500; R.s = 0.95; R.flip = -1; R.draw(c, t); });
            pia(c, 780, 1500);
            E.x = 340; E.y = 1700; E.s = 1.0; pose(E); E.draw(c, t);
            if (t > 8.6 && t < 9.6) { const [hx, hy] = E.cabeca(); sparkle(c, hx + 30, hy + 40, 24, '#ffffff', 1 - Math.abs(t - 9.1) / 0.5); }
          });
          return;
        }
        // com os amigos: ele fala, todos escutam por educação
        st.setCam(540, 1290, lerp(1.2, 1.3, (t - 10) / 5));
        rua(st, t);
        st.mundo(c => {
          const fim = t > 12.8;
          A[0].reset(); A[0].x = 190; A[0].y = 1700; A[0].semPernas = true; A[0].exp = 'normal'; A[0].boca = 'sorriso'; A[0].olhar = [0.8, 0]; A[0].piscar = piscada(t, 3.1); A[0].bracos(0.4, 1.5, 0.4, 1.5);
          A[1].reset(); A[1].x = 890; A[1].y = 1700; A[1].flip = -1; A[1].semPernas = true; A[1].exp = 'normal'; A[1].boca = 'reta'; A[1].olhar = t > 12 ? [0, 0.7] : [0.8, 0]; A[1].maoD = t > 12 ? celular(1) : null; A[1].bracos(0.4, 1.5, 0.7, 2.2);
          for (const a of A.slice(0, 2)) { cadeira(c, a.x, a.y - 40); a.draw(c, t); }
          E.x = 540; E.y = 1700; E.coroa = { s: 0.5 + 0.08 * sstep(13, 14, t) };
          if (!fim) { E.exp = 'determinado'; E.boca = fala(t, true) || 'sorriso'; E.olhar = [Math.sin(t * 1.8) * 0.9, 0]; E.bracos(0.6 + Math.sin(t * 4) * 0.4, 1.2, 1.2 + Math.sin(t * 4 + 1) * 0.5, 0.6); }
          else { E.exp = 'feliz'; E.boca = 'sorriso'; E.olhar = [0, -0.2]; E.bracos(0.5, 2.3, 0.5, 2.3); E.headTilt = -0.08; }
          E.draw(c, t);
          mesaCafe(c, 540, 1600);
        });
      },
    };
  },
};

// ---------- 2. Você nunca está errado ----------
export const c2 = {
  nome: 'Você nunca está errado', inicio: 15, fim: 30,
  criar(st) {
    const E = ego(), A = [amigo(0), amigo(1)];
    return {
      desenhar(t) {
        const close = t > 25 ? sstep(25, 26, t) : 0;
        st.setCam(lerp(540, 470, close), lerp(1290, 1230, close), lerp(1.25, 1.55, close));
        rua(st, t);
        st.mundo(c => {
          const [a0, a1] = A;
          a0.reset(); a0.x = 210; a0.y = 1700; a0.semPernas = true; a0.olhar = [0.8, 0]; a0.piscar = piscada(t, 3.3);
          a1.reset(); a1.x = 870; a1.y = 1700; a1.flip = -1; a1.semPernas = true; a1.olhar = [0.8, 0]; a1.piscar = piscada(t, 3.6);
          E.reset(); E.x = 540; E.y = 1700; E.semPernas = true; E.coroa = { s: lerp(0.6, 0.85, sstep(27.4, 28.2, t)) }; E.piscar = piscada(t, 2.9);
          // 15–20.5: o amigo fala, você interrompe apontando o dedo
          if (t < 20.5) {
            const inter = sstep(17, 17.2, t);
            a0.exp = inter > 0.5 ? 'choque' : 'normal'; a0.boca = inter > 0.5 ? 'o' : (fala(t, true) || 'reta'); a0.bracos(0.6, 1.2, 0.9 + Math.sin(t * 5) * 0.3, 0.8);
            a1.exp = inter > 0.5 ? 'preocupado' : 'normal'; a1.boca = 'reta'; a1.bracos(0.4, 1.5, 0.4, 1.5);
            E.exp = inter > 0.5 ? 'raiva' : 'normal'; E.boca = inter > 0.5 ? (fala(t, true, 14) || 'dentes') : 'reta'; E.olhar = [-0.9, 0];
            E.bracos(inter > 0.5 ? 1.55 : 0.4, inter > 0.5 ? 0.05 : 1.5, 0.4, 1.5); E.lean = -0.06 * inter;
          } else if (t < 25) {
            // a amiga mostra no celular que você errou; você culpa o outro
            const mostra = sstep(20.6, 21, t), culpa = sstep(22.6, 22.9, t);
            a1.maoD = celular(1); a1.bracos(0.4, 1.5, lerp(0.4, 1.5, mostra), lerp(1.5, 0.4, mostra)); a1.exp = 'normal'; a1.boca = fala(t, t < 22.4) || 'reta';
            a0.exp = culpa > 0.5 ? 'choque' : 'normal'; a0.boca = culpa > 0.5 ? 'o' : 'reta'; a0.bracos(0.4, 1.5, 0.4, 1.5);
            E.exp = culpa > 0.5 ? 'determinado' : 'choque'; E.boca = culpa > 0.5 ? (fala(t, true) || 'reta') : 'o'; E.olhar = culpa > 0.5 ? [-0.9, 0] : [0.9, 0.2];
            if (t < 22.6) E.bracos(1.2, -0.4, 1.2, -0.4); else E.bracos(1.55, 0.05, 0.3, 0.4);
          } else {
            // um "desculpa" quase sai... e você engole
            a0.exp = 'preocupado'; a0.boca = 'triste'; a0.bracos(0.4, 1.6, 0.4, 1.6); a1.exp = 'preocupado'; a1.boca = 'reta'; a1.bracos(0.4, 1.5, 0.4, 1.5);
            const vira = sstep(27.6, 28.0, t);
            E.exp = vira > 0.5 ? 'determinado' : 'preocupado'; E.boca = 'reta'; E.olhar = vira > 0.5 ? [0.9, -0.3] : [-0.6, 0.3]; E.headTilt = vira * 0.12; E.bracos(0.5, 2.3, 0.5, 2.3);
          }
          for (const a of A) { cadeira(c, a.x, a.y - 40); a.draw(c, t); }
          cadeira(c, E.x, E.y - 40); E.draw(c, t);
          mesaCafe(c, 540, 1600);
          const [hx, hy] = E.cabeca(), [ax, ay] = a0.cabeca();
          // balões
          balaoFala(c, ax + 60, ay - 170, 260, 110, sstep(15.5, 15.8, t) * (1 - sstep(17.4, 17.8, t)), { cauda: -1, cortes: sstep(17.1, 17.3, t) });
          balaoFala(c, hx - 30, hy - 190, 340, 130, win(t, 17.0, 17.2, 20.0, 20.3), { cauda: 1, texto: 'NÃO, ESCUTA!', tam: 38 });
          if (t > 20.5 && t < 25) { const [bx, by] = A[1].cabeca(); balaoFala(c, bx - 40, by - 180, 200, 110, win(t, 20.8, 21.1, 22.4, 22.7), { cauda: 1, texto: '❌', tam: 60 }); balaoFala(c, hx - 60, hy - 200, 380, 120, win(t, 22.7, 22.9, 24.6, 24.9), { cauda: -1, texto: 'A CULPA FOI DELE', tam: 34 }); }
          const desc = win(t, 26.2, 26.8, 27.4, 27.6); balaoFala(c, hx + 40, hy - 160, 220, 80, desc * 0.8, { cauda: -1, texto: 'desculpa...', tam: 28, cor: '#e8f0f8' });
          if (t > 27.4 && t < 27.9) { const u = (t - 27.4) / 0.5; for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; circle(c, hx + 40 + Math.cos(a) * 80 * u, hy - 160 + Math.sin(a) * 50 * u, 6, '#e8f0f8', { stroke: null, alpha: 1 - u }); } }
          if (t > 27.8 && t < 28.8) sparkle(c, hx, hy - 150, 30, '#fff6c0', 1 - Math.abs(t - 28.3) / 0.5);
        });
      },
    };
  },
};

// ---------- 3. Você começa a desprezar os outros ----------
export const c3 = {
  nome: 'Você começa a desprezar os outros', inicio: 30, fim: 45,
  criar(st) {
    const E = ego(), A = [amigo(0), amigo(1), amigo(2)], P = passante(31);
    return {
      desenhar(t) {
        E.reset(); E.piscar = piscada(t, 3.0); E.coroa = { s: lerp(0.9, 1.25, sstep(30, 45, t)) };
        if (t < 34.4) {
          // alguém cumprimenta; você passa olhando o celular
          E.x = lerp(160, 900, (t - 30) / 4.4); E.y = 1700; E.walk = t * 5.5; E.maoD = celular(1); E.bracos(0.3, 0.3, 0.8, 2.2); E.olhar = [0, 0.7]; E.exp = 'normal'; E.boca = 'reta';
          st.setCam(E.x, 1270, 1.2);
          rua(st, t, { cinza: 0.1 });
          st.mundo(c => {
            const passou = sstep(32.3, 32.8, t);
            P.reset(); P.x = 620; P.y = 1660; P.s = 0.95; P.flip = -1; P.exp = passou > 0.5 ? 'preocupado' : 'feliz'; P.boca = passou > 0.5 ? 'reta' : 'aberta'; P.olhar = [passou > 0.5 ? -0.8 : 0.8, 0];
            P.bracos(0.3, 0.2, lerp(2.6 + Math.sin(t * 10) * 0.2, 0.3, passou), 0.3); P.draw(c, t);
            E.draw(c, t);
            const [px, py] = P.cabeca(); balaoFala(c, px + 30, py - 170, 180, 100, win(t, 30.8, 31.1, 32.2, 32.5), { cauda: 1, texto: 'Oi! 👋', tam: 36 });
          });
          return;
        }
        if (t < 38.6) {
          // o amigo ganha um prêmio; você aplaude com inveja
          st.setCam(560, 1280, 1.25);
          quarto(st, t, { luz: 1 });
          st.mundo(c => {
            const [a0, a1, a2] = A;
            a2.reset(); a2.x = 560; a2.y = 1700; a2.maoD = trofeu(); a2.bracos(0.4, 0.2, 2.6, 0.4); a2.exp = 'feliz'; a2.boca = 'aberta'; a2.jump = Math.abs(Math.sin(t * 6)) * 18; a2.draw(c, t);
            a1.reset(); a1.x = 820; a1.y = 1700; a1.flip = -1; a1.exp = 'feliz'; a1.boca = 'aberta'; const pal = Math.abs(Math.sin(t * 12)); a1.bracos(1.0, 1.6 + pal * 0.4, 1.0, 1.6 + pal * 0.4); a1.olhar = [0.8, 0]; a1.draw(c, t);
            E.x = 260; E.y = 1700; E.exp = 'normal'; E.boca = 'sorriso'; E.olhar = [0.9, 0.1]; const pe = Math.abs(Math.sin(t * 3)); E.bracos(1.0, 1.6 + pe * 0.4, 1.0, 1.6 + pe * 0.4); E.piscar = 0;
            E.draw(c, t);
            const [hx, hy] = E.cabeca(); glow(c, hx, hy + 60, 260, '#6aff6a', 0.25 + 0.1 * Math.sin(t * 4)); for (let i = 0; i < 6; i++) { const u = (t * 0.6 + i / 6) % 1; circle(c, hx - 100 + i * 40, hy + 120 - u * 260, 6, '#7ae07a', { stroke: null, alpha: 0.6 * (1 - u) }); }
            confete(c, t, 34.5, 560, 1200);
          });
          return;
        }
        // alguém discorda (você revira os olhos) e alguém tenta ajudar (você se afasta)
        st.setCam(lerp(540, 600, (t - 38.6) / 6.4), 1280, 1.28);
        rua(st, t, { cinza: 0.2 });
        st.mundo(c => {
          const [a0, a1] = A;
          const ajuda = t > 41.8;
          a1.reset(); a1.x = 860; a1.y = 1700; a1.flip = -1; a1.exp = ajuda ? 'preocupado' : 'normal'; a1.boca = ajuda ? 'reta' : (fala(t, t < 40) || 'reta'); a1.olhar = [0.8, 0]; a1.bracos(0.4, 1.0, 0.8 + Math.sin(t * 4) * 0.3, 0.8); a1.draw(c, t);
          const recua = sstep(43.2, 43.6, t);
          E.x = lerp(540, 680, recua); E.y = 1700; E.flip = recua > 0.5 ? 1 : 1; if (recua > 0 && recua < 1) E.walk = t * 6;
          if (!ajuda) { const revira = win(t, 39.8, 40.1, 40.8, 41.1); E.exp = 'normal'; E.boca = revira > 0.5 ? 'reta' : (fala(t, t > 40.9) || 'reta'); E.olhar = revira > 0.5 ? [0.3, -1] : [0.8, 0]; E.bracos(0.3, 0.3, lerp(0.4, 1.4, win(t, 40.9, 41.1, 41.5, 41.7)), lerp(0.4, -0.3, win(t, 40.9, 41.1, 41.5, 41.7))); }
          else { E.exp = recua > 0.5 ? 'raiva' : 'normal'; E.boca = recua > 0.5 ? 'reta' : 'reta'; E.olhar = [-0.9, 0]; E.bracos(recua > 0.5 ? 0.5 : 0.3, recua > 0.5 ? 2.3 : 0.3, recua > 0.5 ? 0.5 : 0.3, recua > 0.5 ? 2.3 : 0.3); E.lean = recua * 0.08; }
          E.draw(c, t);
          if (ajuda) {
            const chega = sstep(41.8, 42.6, t);
            a0.reset(); a0.x = lerp(120, 380, chega); a0.y = 1700; if (chega > 0 && chega < 1) a0.walk = t * 6; a0.exp = recua > 0.5 ? 'triste' : 'feliz'; a0.boca = recua > 0.5 ? 'triste' : 'sorriso'; a0.olhar = [0.8, 0];
            a0.maoD = folha(); a0.bracos(0.3, 0.2, lerp(0.3, 1.3, chega * (1 - recua)), 0.3); a0.draw(c, t);
          }
          const [bx, by] = a1.cabeca(), [hx, hy] = E.cabeca();
          balaoFala(c, bx - 40, by - 180, 300, 110, win(t, 38.8, 39.1, 40.4, 40.7), { cauda: 1, texto: 'Acho que não...', tam: 32 });
          balaoFala(c, hx + 20, hy - 220, 360, 110, win(t, 40.9, 41.1, 41.7, 42.0), { cauda: -1, texto: 'Você não entende.', tam: 32 });
        });
      },
    };
  },
};

// ---------- 4. O preço do seu ego ----------
export const c4 = {
  nome: 'O preço do seu ego', inicio: 45, fim: 62,
  criar(st) {
    const E = ego(), A = [amigo(0), amigo(1), amigo(2)];
    return {
      desenhar(t) {
        E.reset(); E.piscar = piscada(t, 3.8);
        if (t < 50.5) {
          st.setCam(540, 1290, lerp(1.15, 1.3, (t - 45) / 5.5));
          rua(st, t, { cinza: 0.4 });
          st.mundo(c => {
            const xs = [190, 870, 1080], saidas = [45.6, 46.8, 48.0];
            A.forEach((a, i) => {
              const s = clamp((t - saidas[i]) / 1.8);
              a.reset(); a.y = 1700; a.flip = i === 0 ? -1 : 1; a.olhar = [0.8, 0]; a.exp = 'preocupado'; a.boca = 'reta';
              if (s <= 0) { a.x = xs[i]; a.semPernas = true; a.flip = i === 0 ? 1 : -1; cadeira(c, xs[i], 1660); }
              else { a.x = xs[i] + (i === 0 ? -1 : 1) * 900 * easeInOut(s); a.walk = t * 6; cadeira(c, xs[i], 1660); }
              if (i < 2 || s > 0) a.draw(c, t);
            });
            E.x = 540; E.y = 1700; E.semPernas = true; E.coroa = { s: 1.35 };
            const olha = t > 49; E.exp = olha ? 'preocupado' : 'determinado'; E.boca = 'reta'; E.olhar = olha ? [Math.sin(t * 3) * 0.9, 0] : [0, -0.2]; E.bracos(0.5, 2.3, 0.5, 2.3); E.headTilt = olha ? 0 : -0.08;
            cadeira(c, 540, 1660); E.draw(c, t);
            mesaCafe(c, 540, 1600);
          });
          return;
        }
        if (t < 55.5) { chatTela(st, t, 50.5); return; }
        // sozinho num salão enorme e vazio; a coroa pesa
        const k = easeInOut(clamp((t - 55.5) / 6.5));
        E.x = 540; E.y = 1700; E.coroa = { s: 1.7, brilho: 0.5 }; E.squash = 0.05; E.headTilt = t > 59.4 ? 0 : 0.12; E.lean = 0.02;
        E.exp = 'preocupado'; E.boca = t > 59.4 ? 'reta' : 'triste'; E.olhar = t > 59.4 ? [0, -0.6] : [0, 0.7]; E.bracos(0.1, 0.1, 0.1, 0.1);
        const [hx, hy] = E.cabeca();
        st.setCam(540, lerp(hy + 60, 1250, k), lerp(1.9, 0.5, k));
        salaoVazio(st, t);
        st.mundo(c => {
          c.save(); c.globalAlpha = 0.3; c.fillStyle = '#000'; c.beginPath(); c.moveTo(500, 1700); c.lineTo(580, 1700); c.lineTo(1100, 2400); c.lineTo(900, 2400); c.closePath(); c.fill(); c.restore();
          E.draw(c, t);
        });
      },
    };
  },
};

// ---------- 5. O espelho ----------
export const c5 = {
  nome: 'O espelho', inicio: 62, fim: 75.4,
  criar(st) {
    const E = ego(), R = ego();
    const TIRA = 70.6, NA_PIA = 73.0;
    return {
      desenhar(t) {
        const tira = sstep(TIRA, TIRA + 0.8, t), naPia = sstep(NA_PIA, NA_PIA + 0.6, t);
        const muda = sstep(66.8, 67.6, t); // o reflexo muda primeiro
        E.reset(); R.reset();
        E.piscar = piscada(t, 4.0);
        const chega = clamp((t - 62) / 2.6);
        E.x = lerp(80, 360, easeOut(chega)); E.y = 1700; if (chega < 1) E.walk = t * 4.5;
        E.coroa = tira > 0.01 ? null : { s: 1.75, brilho: 0.4 };
        E.desarrumado = t > NA_PIA;
        if (t < 66) { E.exp = 'normal'; E.boca = 'reta'; E.olhar = [0.9, 0]; E.squash = 0.04; E.bracos(0.1, 0.1, 0.1, 0.1); }
        else if (t < TIRA) { E.exp = muda > 0.5 ? 'choque' : 'normal'; E.boca = muda > 0.5 ? 'o' : 'reta'; E.olhar = [0.9, -0.1]; E.bracos(0.2, 0.1, 0.2, 0.1); E.tremor = muda * 0.1; }
        else { const u = sstep(TIRA - 0.3, TIRA + 0.2, t) * (1 - naPia); E.bracos(lerp(0.2, 2.7, u), lerp(0.1, 1.9, u), lerp(0.2, 2.7, u), lerp(0.1, 1.9, u)); E.exp = 'normal'; E.boca = naPia > 0.5 ? 'triste' : 'reta'; E.olhar = naPia > 0.5 ? [0.9, 0.3] : [0.2, -0.8]; E.headTilt = naPia * 0.08; }
        // câmera: entra, fecha nos dois rostos
        const fecha = sstep(65, 66.5, t);
        st.setCam(lerp(520, 580, fecha), lerp(1280, 1260, fecha), lerp(1.25, 1.6, fecha) + (t > 72 ? (t - 72) * 0.04 : 0));
        banheiro(st, t, { frio: 1 });
        st.mundo(c => {
          espelho(c, 560, 940, 380, 560, t, c => {
            R.x = 760; R.y = 1520; R.s = 0.95; R.flip = -1; R.piscar = E.piscar; R.desarrumado = E.desarrumado;
            if (t < VIRA_REF) { R.exp = E.exp; R.boca = E.boca; R.olhar = E.olhar; R.bracos(E.bracoE.a, E.bracoE.b, E.bracoD.a, E.bracoD.b); R.coroa = E.coroa; }
            else if (t < TIRA) { R.exp = 'triste'; R.boca = 'triste'; R.olhar = [0.9, 0.2]; R.bracos(0.1, 0.1, 0.1, 0.1); R.squash = 0.08; R.coroa = { s: 1.75, rachada: sstep(66.8, 68, t), brilho: 0, opaca: 0.7 }; }
            else { R.exp = E.exp; R.boca = E.boca; R.olhar = E.olhar; R.bracos(E.bracoE.a, E.bracoE.b, E.bracoD.a, E.bracoD.b); R.coroa = null; }
            R.draw(c, t);
            if (tira > 0.01 && naPia < 0.01) { const [lx, ly] = R.mao(-1), [rx, ry] = R.mao(1); coroa(c, (lx + rx) / 2, (ly + ry) / 2 - 20, 1.3, { rachada: sstep(TIRA + 0.4, TIRA + 1.6, t), brilho: 0, opaca: sstep(TIRA, TIRA + 1.6, t) * 0.8 }); }
          }, { frio: 1 });
          pia(c, 760, 1500, 1);
          if (naPia > 0) coroa(c, lerp(400, 800, naPia), lerp(1260, 1490, naPia), lerp(1.4, 1.0, naPia), { rachada: 1, brilho: 0, opaca: 0.8 });
          E.draw(c, t);
          if (tira > 0.01 && naPia < 0.01) { const [lx, ly] = E.mao(-1), [rx, ry] = E.mao(1); coroa(c, (lx + rx) / 2, (ly + ry) / 2 - 20, 1.4, { rachada: sstep(TIRA + 0.4, TIRA + 1.6, t), brilho: 0, opaca: sstep(TIRA, TIRA + 1.6, t) * 0.8 }); }
        });
      },
    };
  },
};
const VIRA_REF = 66.8;

// ---------- 6. A reflexão ----------
export const c6 = {
  nome: 'A reflexão', inicio: 75.4, fim: 87.6,
  criar(st) {
    const E = ego();
    return {
      desenhar(t) {
        E.reset(); E.piscar = piscada(t, 3.9); E.desarrumado = true;
        const sol = lerp(0.12, 0.35, (t - 75.4) / 12);
        if (t < 80.4) {
          E.x = lerp(120, 640, (t - 75.4) / 5); E.y = 1700; E.walk = t * 4.2; E.exp = 'preocupado'; E.boca = 'reta'; E.olhar = [0.2, 0.6]; E.headTilt = 0.06; E.bracos(0.12, 0.5, 0.12, 0.5);
          st.setCam(E.x + 40, 1270, 1.25);
          bairro(st, t, { sol });
          st.mundo(c => E.draw(c, t));
          return;
        }
        if (t < 84.4) {
          // para, pega o celular e escreve
          E.x = 640; E.y = 1700; E.maoD = celular(1); E.bracos(0.3, 0.6, 0.8, 2.3); E.olhar = [0, 0.7]; E.exp = 'determinado'; E.boca = 'reta';
          const [hx, hy] = E.cabeca();
          st.setCam(hx + 40, hy + 120, 1.9);
          bairro(st, t, { sol });
          st.mundo(c => {
            E.draw(c, t);
            const txt = 'me desculpa por tudo.'; const n = Math.ceil(clamp((t - 80.8) / 2.2) * txt.length);
            const env = sstep(83.4, 83.6, t);
            if (t > 80.7) balaoFala(c, hx + 40, hy - 170 - env * 60, 420, 100, (1 - env * 0.5) * sstep(80.7, 80.9, t) * (1 - sstep(84.0, 84.3, t)), { cauda: -1, texto: txt.slice(0, n) + (n < txt.length && Math.sin(t * 12) > 0 ? '|' : ''), tam: 32, cor: '#cdeec0' });
            if (env > 0 && t < 84.2) { const u = (t - 83.4) / 0.8; for (let i = 0; i < 6; i++) line(c, [[hx + 260 + u * 200, hy - 240 - i * 10], [hx + 200 + u * 200, hy - 240 - i * 10]], '#ffffff', 3, 1 - u); }
          });
          return;
        }
        // segue caminhando; a câmera se afasta (sem resposta: final aberto)
        const k = easeInOut(clamp((t - 84.4) / 3.2));
        E.x = lerp(640, 900, (t - 84.4) / 3.2); E.y = 1700; E.walk = t * 4.2; E.exp = 'normal'; E.boca = 'reta'; E.olhar = [0.6, -0.2]; E.bracos(0.12, 0.5, 0.12, 0.5);
        st.setCam(lerp(680, 760, k), lerp(1260, 1150, k), lerp(1.25, 0.75, k));
        bairro(st, t, { sol });
        st.mundo(c => E.draw(c, t));
      },
    };
  },
};
