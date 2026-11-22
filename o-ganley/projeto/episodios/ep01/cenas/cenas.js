// Homenagem: "Gabriel Ganley — um sonho que deixou sua marca". Representação estilizada e respeitosa,
// sem diálogos inventados, sem cenas médicas e sem encenar a morte.
import { TAU, lerp, clamp, sstep, win, easeInOut, easeOut, easeBack, rng, mix } from '../../../motor/base.js';
import { glow, rrect, line, circle, ellipse, poly, vgrad, shape, sparkle, cloud } from '../../../motor/desenho.js';
import { gabriel, halter, tenisMochila, passante, celular } from '../../../personagens/elenco.js';
import { academia, bancoSupino, anilhas, palco, rio, balaoFala } from '../../../cenarios/lugares.js';

const W = 1080, H = 1920;
const piscada = (t, f = 3.8, o = 0) => (((t + o) % f) < 0.14 ? 1 : 0);
function selo(st, txt, a, y = 220, cor = '#ffe2a0') { st.text(txt, W / 2, y, { size: 58, fill: cor, alpha: a, lw: 12 }); }
// poeira dourada no ar
function poeiraLuz(c, x, y, w, h, t, a = 1) { const r = rng(7); for (let i = 0; i < 40; i++) { const px = x + r() * w, py = y + ((r() * h + t * 20) % h); c.save(); c.globalAlpha = a * (0.3 + 0.5 * Math.sin(t * 2 + i) ** 2); c.fillStyle = '#fff2c8'; c.beginPath(); c.arc(px, py, 2 + r() * 3, 0, TAU); c.fill(); c.restore(); } }

// ---------- 1. O começo de um sonho ----------
export const c1 = {
  nome: 'O começo de um sonho', inicio: 0, fim: 14,
  criar(st) {
    const G0 = gabriel(0), G1 = gabriel(1);
    return {
      desenhar(t) {
        if (t < 4.2) {
          // entra na academia quase vazia e observa os pesos
          const entra = clamp(t / 2.4);
          G0.reset(); G0.s = 0.88; G0.x = lerp(-60, 420, easeOut(entra)); G0.y = 1700; if (entra < 1) G0.walk = t * 5; G0.exp = 'normal'; G0.boca = t > 2.8 ? 'sorriso' : 'reta'; G0.olhar = t > 2.4 ? [0.8, -0.3] : [0.8, 0]; G0.piscar = piscada(t); G0.bracos(0.2, 0.3, 0.2, 0.3);
          st.setCam(lerp(380, 560, entra), 1250, 1.2);
          academia(st, t, { luz: 0.6 });
          st.mundo(c => { G0.draw(c, t); });
          return;
        }
        if (t < 9) {
          // primeiros exercícios: rosca com halteres leves
          const rep = Math.max(0, Math.sin((t - 4.2) * 2.6));
          G0.reset(); G0.s = 0.88; G0.x = 540; G0.y = 1700; G0.maoE = halter(0.3); G0.maoD = halter(0.3); G0.bracos(0.25, lerp(0.2, 2.5, rep), 0.25, lerp(0.2, 2.5, rep)); G0.exp = rep > 0.7 ? 'fechado' : 'determinado'; G0.boca = rep > 0.7 ? 'dentes' : 'reta'; G0.olhar = [0.2, -0.2]; G0.suor = 0.3;
          st.setCam(560, lerp(1300, 1260, (t - 4.2) / 4.8), lerp(1.35, 1.5, (t - 4.2) / 4.8));
          academia(st, t, { luz: 0.6 });
          st.mundo(c => G0.draw(c, t));
          return;
        }
        // passagem do tempo: ele fica mais forte
        const u = clamp((t - 9) / 4.6);
        const marcos = ['1º MÊS', '6 MESES', '1 ANO', '2 ANOS', '3 ANOS'];
        const P = u < 0.4 ? G0 : G1;
        P.reset(); P.x = 540; P.y = 1700; P.s = lerp(0.88, 1.02, u); P.forca = u < 0.4 ? 0 : lerp(0.3, 0.9, (u - 0.4) / 0.6);
        const rep = Math.max(0, Math.sin(t * 5)); P.maoE = halter(lerp(0.3, 1.4, u)); P.maoD = halter(lerp(0.3, 1.4, u)); P.bracos(0.25, lerp(0.2, 2.5, rep), 0.25, lerp(0.2, 2.5, rep)); P.exp = 'determinado'; P.boca = 'reta'; P.olhar = [0.2, -0.2];
        st.setCam(560, 1270, 1.35);
        academia(st, t, { luz: 0.6 + u * 0.4 });
        st.mundo(c => P.draw(c, t));
        selo(st, marcos[Math.min(4, Math.floor(u * 5))], 1, 330);
        st.text('FISICULTURISMO', W / 2, 460, { size: 92, fill: '#ffd060', alpha: sstep(12.0, 12.4, t), scale: 0.8 + 0.2 * easeBack(clamp((t - 12.0) / 0.4)), lw: 18 });
      },
    };
  },
};

// ---------- 2. A construção de uma história ----------
export const c2 = {
  nome: 'A construção de uma história', inicio: 14, fim: 37.9,
  criar(st) {
    const G = gabriel(1), Gj = gabriel(0), P = [0, 1, 2, 3, 4].map(i => passante(i + 130));
    return {
      desenhar(t) {
        G.reset(); G.piscar = piscada(t);
        if (t < 20.6) {
          // Rio de Janeiro: o adolescente a caminho do treino
          Gj.reset(); Gj.s = 0.9; Gj.x = lerp(120, 800, (t - 14) / 6.6); Gj.y = 1700; Gj.walk = t * 5; Gj.exp = 'feliz'; Gj.boca = 'sorriso'; Gj.olhar = [0.8, 0]; Gj.bracos(0.2, 0.3, 0.2, 0.3); Gj.piscar = piscada(t);
          st.setCam(Gj.x, 1220, 1.05);
          rio(st, t);
          st.mundo(c => { Gj.draw(c, t); const [hx, hy] = Gj.cabeca(); rrect(c, hx - 110, hy + 120, 70, 90, 16, '#2a3a5a', { lw: 4 }); });
          selo(st, 'RIO DE JANEIRO', sstep(14.4, 14.9, t) * (1 - sstep(19.6, 20.2, t)), 260, '#ffffff');
          selo(st, '15 ANOS', sstep(16.6, 17.0, t) * (1 - sstep(19.6, 20.2, t)), 350);
          return;
        }
        if (t < 26.6) {
          // grava os treinos com o celular apoiado
          st.setCam(600, 1280, 1.3);
          academia(st, t);
          st.mundo(c => {
            // celular no tripé gravando
            line(c, [[900, 1700], [930, 1460]], '#2a2a30', 6); line(c, [[960, 1700], [930, 1460]], '#2a2a30', 6); rrect(c, 904, 1380, 52, 90, 8, '#1a1a1e', { lw: 4 }); circle(c, 945, 1395, 6, Math.sin(t * 6) > 0 ? '#ff3a3a' : '#5a1a1a', { stroke: null });
            const fala = t > 23.6;
            G.x = 520; G.y = 1700; G.forca = 0.65;
            if (!fala) { const rep = Math.max(0, Math.sin((t - 20.6) * 2.4)); G.maoE = halter(1); G.maoD = halter(1); G.bracos(lerp(0.3, 2.6, rep), 0.4, lerp(0.3, 2.6, rep), 0.4); G.exp = 'determinado'; G.boca = rep > 0.8 ? 'dentes' : 'reta'; G.olhar = [0.3, -0.2]; }
            else { G.exp = 'feliz'; G.boca = Math.sin(t * 10) > 0 ? 'aberta' : 'sorriso'; G.olhar = [0.9, -0.1]; G.bracos(0.3, 0.3, lerp(0.3, 1.3, sstep(23.8, 24.2, t)), 0.8); }
            G.draw(c, t);
          });
          return;
        }
        if (t < 32.4) {
          // a tela do celular: comentários e corações (sem números inventados)
          st.setCam(540, 960, 1);
          st.camada(0, c => {
            vgrad(c, 0, 0, W, H, [[0, '#14182a'], [1, '#22284a']]); glow(c, 540, 860, 900, '#ff7a5a', 0.15);
            rrect(c, 230, 260, 620, 1060, 50, '#111116', { lw: 8 }); rrect(c, 254, 290, 572, 1000, 30, '#1e1e26', { stroke: null });
            c.save(); c.beginPath(); c.roundRect(254, 290, 572, 760, 30); c.clip(); vgrad(c, 254, 290, 572, 760, [[0, '#3a3e46'], [1, '#1a1c22']]); const Q = gabriel(1); Q.forca = 0.7; Q.x = 540; Q.y = 1080; Q.s = 0.95; Q.exp = 'feliz'; Q.boca = 'sorriso'; Q.bracos(2.6, 2.2, 2.6, 2.2); Q.draw(c, t); c.restore();
            const coms = ['Inspiração demais 🔥', 'Bora treinar! 💪', 'Que evolução, mano!', 'Me motivou hoje 🙏', 'Monstro! 💪💪'];
            coms.forEach((txt, i) => { const a0 = 26.9 + i * 0.9, u = clamp((t - a0) / 3); if (u <= 0 || u >= 1) return; c.save(); c.globalAlpha = Math.sin(u * Math.PI); rrect(c, 140 + (i % 2) * 260, 1500 - u * 500, 560, 80, 30, '#ffffff', { lw: 3 }); c.font = '700 32px Inter'; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillStyle = '#2b1f2a'; c.fillText(txt, 170 + (i % 2) * 260, 1541 - u * 500); c.restore(); });
            for (let i = 0; i < 14; i++) { const u = ((t - 26.6) * 0.5 + i / 14) % 1; c.save(); c.globalAlpha = Math.sin(u * Math.PI) * 0.9; c.font = '900 50px Inter'; c.fillText('❤', 780 + Math.sin(i * 3 + t) * 60, 1250 - u * 700); c.restore(); }
          });
          selo(st, 'MILHARES ACOMPANHANDO', sstep(27.2, 27.6, t), 180);
          return;
        }
        // a academia cheia: pessoas cumprimentando, treinando ao lado
        st.setCam(560, 1270, lerp(1.1, 1.25, (t - 32.4) / 5.5));
        academia(st, t);
        st.mundo(c => {
          P.forEach((p, i) => { p.reset(); p.x = [140, 320, 780, 960, 640][i]; p.y = i === 4 ? 1640 : 1690; p.s = 0.9; p.flip = i < 2 ? 1 : -1; const rep = Math.max(0, Math.sin(t * 2.4 + i)); p.maoE = halter(0.6); p.maoD = halter(0.6); p.bracos(0.25, lerp(0.2, 2.4, rep), 0.25, lerp(0.2, 2.4, rep)); p.exp = 'determinado'; p.boca = 'reta'; p.olhar = [0.2, -0.2]; if (i === 1 && t > 34.6 && t < 36.4) { p.maoE = p.maoD = null; p.bracos(0.3, 0.2, 2.5, 0.3); p.exp = 'feliz'; p.boca = 'sorriso'; p.olhar = [0.8, 0]; } if (i === 4) p.draw(c, t); });
          G.x = 540; G.y = 1700; G.forca = 0.75; G.exp = 'feliz'; G.boca = 'sorriso'; G.olhar = t > 34.6 && t < 36.4 ? [-0.8, 0] : [0.3, -0.2]; G.bracos(0.3, 0.3, t > 34.8 && t < 36.2 ? 2.5 : 0.3, 0.3);
          G.draw(c, t);
          P.slice(0, 4).forEach(p => p.draw(c, t));
        });
      },
    };
  },
};

// ---------- 3. O garoto que queria ser imenso ----------
export const c3 = {
  nome: 'O garoto que queria ser imenso', inicio: 37.9, fim: 61.8,
  criar(st) {
    const G = gabriel(1), A = passante(140), R = gabriel(1);
    return {
      desenhar(t) {
        G.reset(); G.piscar = piscada(t); G.patch = true; G.forca = 0.85;
        if (t < 44.6) {
          // competição: pose no palco sob o refletor
          const pose = sstep(38.8, 39.4, t);
          G.x = 540; G.y = 1500; G.exp = 'determinado'; G.boca = pose > 0.5 ? 'sorriso' : 'reta'; G.olhar = [0, -0.1]; G.bracos(lerp(0.3, 1.6, pose), lerp(0.3, 2.3, pose), lerp(0.3, 1.6, pose), lerp(0.3, 2.3, pose));
          st.setCam(540, lerp(1240, 1180, (t - 37.9) / 6.7), lerp(1.0, 1.3, (t - 37.9) / 6.7));
          palco(st, t, { vazio: 0 });
          st.mundo(c => { G.draw(c, t); for (let i = 0; i < 4; i++) { const u = ((t * 1.3 + i * 0.25) % 1); if (u < 0.1) glow(c, -200 + i * 450, 1700, 120, '#ffffff', 1 - u * 10); } });
          selo(st, 'COMPETIÇÕES • PATROCÍNIO', sstep(40.6, 41.0, t), 220);
          return;
        }
        if (t < 50) {
          // treino forte com parceiro; esforço, mas também risadas
          st.setCam(580, 1280, 1.3);
          academia(st, t);
          st.mundo(c => {
            const rep = Math.max(0, Math.sin((t - 44.6) * 2.0));
            G.x = 500; G.y = 1700; G.bracos(lerp(1.6, 2.9, rep), lerp(2.2, 0.2, rep), lerp(1.6, 2.9, rep), lerp(2.2, 0.2, rep)); G.exp = t > 48.2 ? 'feliz' : 'determinado'; G.boca = t > 48.2 ? 'aberta' : (rep > 0.8 ? 'dentes' : 'reta'); G.olhar = [0.2, -0.3]; G.suor = 0.5;
            G.draw(c, t);
            const [lx, ly] = G.mao(-1), [rx, ry] = G.mao(1); line(c, [[lx - 160, ly], [rx + 160, ry]], '#9a9aa2', 10); anilhas(c, lx - 170, ly, 0.9); anilhas(c, rx + 140, ry, 0.9);
            A.reset(); A.x = 820; A.y = 1700; A.flip = -1; A.exp = t > 48.2 ? 'feliz' : 'determinado'; A.boca = t > 48.2 ? 'aberta' : 'aberta'; A.olhar = [0.8, -0.2]; A.bracos(0.4, 0.3, 1.3 + Math.sin(t * 4) * 0.2, 0.6); A.draw(c, t);
          });
          return;
        }
        if (t < 55.2) {
          // diante do espelho
          st.setCam(560, 1250, lerp(1.4, 1.6, (t - 50) / 5.2));
          academia(st, t, { luz: 0.8 });
          st.mundo(c => {
            rrect(c, 600, 900, 380, 640, 10, '#a8b8c4', { lw: 8 });
            c.save(); c.beginPath(); c.rect(600, 900, 380, 640); c.clip(); R.reset(); R.forca = 0.85; R.x = 790; R.y = 1520; R.s = 0.92; R.flip = -1; R.exp = 'normal'; R.boca = 'reta'; R.olhar = [0.9, 0]; R.bracos(0.3, 0.3, 0.3, 0.3); R.draw(c, t); c.globalAlpha = 0.2; c.fillStyle = '#fff'; c.fillRect(620, 900, 60, 640); c.restore();
            G.x = 360; G.y = 1700; G.exp = 'normal'; G.boca = 'reta'; G.olhar = [0.9, 0]; G.bracos(0.3, 0.3, 0.3, 0.3); G.draw(c, t);
          });
          return;
        }
        // o sonho: o grande palco dos grandes nomes
        const k = easeInOut(clamp((t - 55.2) / 6.6));
        st.setCam(540, lerp(1500, 1150, k), lerp(1.4, 0.75, k));
        palco(st, t, { vazio: 0, luzes: 1 });
        st.mundo(c => {
          // silhuetas de campeões no alto, sob as luzes
          c.save(); c.globalAlpha = 0.55; c.fillStyle = '#1a1018'; for (let i = 0; i < 3; i++) { const x = 300 + i * 240; c.beginPath(); c.arc(x, 1180, 46, 0, TAU); c.fill(); c.beginPath(); c.roundRect(x - 80, 1230, 160, 270, 40); c.fill(); for (const s of [-1, 1]) { c.save(); c.translate(x + s * 76, 1250); c.rotate(s * -2.4); c.fillRect(-18, 0, 36, 120); c.restore(); } } c.restore();
          glow(c, 540, 1300, 500, '#ffe0a0', 0.25);
          G.x = 540; G.y = 1900; G.s = 1.0; G.exp = 'determinado'; G.boca = 'sorriso'; G.olhar = [0, -0.9]; G.bracos(0.3, 0.3, 0.3, 0.3); G.draw(c, t);
        });
      },
    };
  },
};

// ---------- 4. Uma despedida precoce ----------
export const c4 = {
  nome: 'Uma despedida precoce', inicio: 61.8, fim: 85.3,
  criar(st) {
    const P = [0, 1, 2, 3].map(i => passante(i + 150));
    return {
      desenhar(t) {
        if (t < 68.4) {
          // a notícia: celulares acendendo, pessoas param o treino
          st.setCam(540, 1280, lerp(1.15, 1.3, (t - 61.8) / 6.6));
          academia(st, t, { luz: 0.7 });
          st.mundo(c => {
            P.forEach((p, i) => { p.reset(); p.x = 180 + i * 240; p.y = 1700 - (i % 2) * 30; p.s = 0.92; p.flip = i < 2 ? 1 : -1; const viu = sstep(63.2 + i * 0.4, 63.6 + i * 0.4, t); p.maoD = celular(viu > 0.5 ? 1 : 0); p.bracos(0.2, 0.2, lerp(0.2, 0.8, viu), lerp(0.2, 2.2, viu)); p.olhar = [0, lerp(0, 0.8, viu)]; p.exp = viu > 0.5 ? (t > 66.4 ? 'preocupado' : 'choque') : 'normal'; p.boca = viu > 0.5 ? 'o' : 'reta'; p.piscar = piscada(t, 4, i); p.draw(c, t); });
          });
          return;
        }
        if (t < 75.4) {
          // academia vazia, à noite; tênis e mochila no banco
          st.setCam(lerp(600, 560, (t - 68.4) / 7), lerp(1380, 1420, (t - 68.4) / 7), lerp(1.35, 1.6, (t - 68.4) / 7));
          academia(st, t, { noite: 1 });
          st.mundo(c => { bancoSupino(c, 560, 1700); tenisMochila(c, 520, 1580); poeiraLuz(c, 300, 900, 500, 700, t, 0.6); });
          return;
        }
        // o palco iluminado, vazio
        st.setCam(540, lerp(1300, 1250, (t - 75.4) / 10), lerp(1.0, 1.25, (t - 75.4) / 10));
        palco(st, t, { vazio: 1, luzes: 0.4 });
        st.mundo(c => poeiraLuz(c, 300, 600, 480, 900, t, 0.8));
      },
    };
  },
};

// ---------- 5. O que fica ----------
export const c5 = {
  nome: 'O que fica', inicio: 85.3, fim: 116.2,
  criar(st) {
    const P = [0, 1, 2, 3].map(i => passante(i + 160)), J = passante(170), F = passante(171);
    return {
      desenhar(t) {
        if (t < 92.4) {
          // a vida continua na academia; um jovem amarra o tênis
          const close = t > 89.2;
          if (close) {
            // close: mãos amarrando o cadarço do tênis
            st.setCam(540, 960, 1);
            st.camada(0, c => {
              vgrad(c, 0, 0, W, H, [[0, '#2a2a30'], [1, '#141418']]);
              c.save(); c.translate(540, 1150); c.scale(3, 3);
              shape(c, cc => { cc.moveTo(-150, 40); cc.lineTo(-150, -40); cc.quadraticCurveTo(-60, -90, 10, -60); cc.lineTo(120, -30); cc.quadraticCurveTo(160, -10, 150, 40); cc.closePath(); }, '#f2eee6', { lw: 3 });
              rrect(c, -154, 30, 308, 16, 4, '#d0302a', { stroke: null });
              for (let i = 0; i < 4; i++) line(c, [[-60 + i * 22, -66 + i * 8], [-40 + i * 22, -56 + i * 8]], '#2a2a30', 2);
              const u = (t * 1.6) % 1, f = Math.sin(u * TAU);
              shape(c, cc => { cc.moveTo(-20, -50); cc.quadraticCurveTo(-60 - f * 10, -100, -30, -110); cc.quadraticCurveTo(-10, -100, -20, -50); }, null, { stroke: '#2a2a30', lw: 3 });
              shape(c, cc => { cc.moveTo(-20, -50); cc.quadraticCurveTo(20 + f * 10, -100, 0, -112); cc.quadraticCurveTo(-30, -96, -20, -50); }, null, { stroke: '#2a2a30', lw: 3 });
              circle(c, -50 - f * 8, -100, 16, '#c89070', { lw: 2.5 }); circle(c, 10 + f * 8, -104, 16, '#c89070', { lw: 2.5 });
              c.restore();
            });
            return;
          }
          st.setCam(540, 1270, 1.15);
          academia(st, t, { luz: 1 });
          st.mundo(c => {
            P.forEach((p, i) => { p.reset(); p.x = [140, 340, 760, 960][i]; p.y = 1690; p.s = 0.9; p.flip = i < 2 ? 1 : -1; const rep = Math.max(0, Math.sin(t * 2.2 + i)); p.maoE = halter(0.6); p.maoD = halter(0.6); p.bracos(0.25, lerp(0.2, 2.4, rep), 0.25, lerp(0.2, 2.4, rep)); p.exp = 'determinado'; p.boca = 'reta'; p.olhar = [0.2, -0.2]; p.draw(c, t); });
            J.reset(); J.x = 560; J.y = 1700; J.exp = 'feliz'; J.boca = 'sorriso'; J.olhar = [0.6, 0]; J.bracos(0.3, 0.3, 0.3, 0.3); J.walk = null; J.draw(c, t);
          });
          return;
        }
        if (t < 101) {
          // alguém olha uma foto dele no celular; depois, a linha calma de um coração
          const fotoT = t < 97.4;
          if (fotoT) {
            st.setCam(540, 960, 1);
            st.camada(0, c => {
              vgrad(c, 0, 0, W, H, [[0, '#1a1c24'], [1, '#2a2c36']]);
              rrect(c, 250, 320, 580, 1000, 46, '#111116', { lw: 8 }); c.save(); c.beginPath(); c.roundRect(274, 350, 532, 940, 26); c.clip(); vgrad(c, 274, 350, 532, 940, [[0, '#4a3a2a'], [1, '#1e1a16']]); glow(c, 540, 700, 400, '#ffd8a0', 0.4); const Q = gabriel(1); Q.forca = 0.8; Q.x = 540; Q.y = 1300; Q.s = 1.05; Q.exp = 'feliz'; Q.boca = 'sorriso'; Q.olhar = [0, 0]; Q.bracos(0.3, 0.3, 0.3, 0.3); Q.draw(c, t); c.restore();
              c.save(); c.globalAlpha = 0.85; ellipse(c, 300, 1450, 70, 90, '#e8b890', { lw: 4 }); c.restore();
            });
          } else {
            st.setCam(540, 960, 1);
            st.camada(0, c => {
              vgrad(c, 0, 0, W, H, [[0, '#0e1a16'], [1, '#14241e']]);
              const u = clamp((t - 97.4) / 3.4); c.save(); c.strokeStyle = '#7ae0b0'; c.lineWidth = 8; c.lineJoin = 'round'; c.shadowColor = '#7ae0b0'; c.shadowBlur = 20; c.beginPath();
              for (let x = 0; x <= W * u; x += 6) { const ph = (x % 360) / 360; const y = 900 + (ph > 0.42 && ph < 0.46 ? -160 : ph > 0.46 && ph < 0.5 ? 120 : ph > 0.5 && ph < 0.52 ? -40 : 0); x === 0 ? c.moveTo(x, y) : c.lineTo(x, y); }
              c.stroke(); c.restore();
              c.font = '900 64px Inter'; c.textAlign = 'center'; c.fillStyle = '#ffffff'; c.globalAlpha = sstep(98.4, 98.8, t); c.fillText('A SAÚDE VEM PRIMEIRO', 540, 640); c.globalAlpha = 1;
            });
          }
          return;
        }
        if (t < 108.6) {
          // treino em grupo, ao amanhecer: o esporte que une
          st.setCam(540, lerp(1300, 1240, (t - 101) / 7.6), lerp(1.1, 1.25, (t - 101) / 7.6));
          academia(st, t, { luz: 1 });
          st.mundo(c => {
            [...P, F].forEach((p, i) => { p.reset(); p.x = 100 + i * 220; p.y = 1700 - (i % 2) * 30; p.s = 0.9; p.flip = i < 2 ? 1 : -1; p.exp = 'feliz'; p.boca = 'sorriso'; p.olhar = [p.flip * 0.5, 0]; p.bracos(0.3, 0.3, 0.3, 0.3); if (t > 104.6) { p.bracos(2.5, 0.3, 2.5, 0.3); p.olhar = [0, -0.6]; } p.draw(c, t); });
          });
          return;
        }
        // o palco vazio com uma única luz acesa e o nome
        st.setCam(540, lerp(1250, 1200, (t - 108.6) / 7.6), lerp(1.0, 1.15, (t - 108.6) / 7.6));
        palco(st, t, { vazio: 1, luzes: 0 });
        st.mundo(c => poeiraLuz(c, 320, 500, 440, 1000, t, 0.9));
        st.text('GABRIEL GANLEY', W / 2, 420, { size: 110, fill: '#fff2d0', alpha: sstep(110.6, 111.6, t), lw: 18, glow: 'rgba(255,220,150,0.6)' });
        st.text('Descanse em paz', W / 2, 540, { size: 54, fill: '#ffffff', alpha: sstep(111.6, 112.4, t), lw: 10 });
      },
    };
  },
};
