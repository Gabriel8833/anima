// "E se você achasse que estava em um anime?" — imaginação (efeitos exagerados) x realidade (simples e constrangedora)
import { TAU, lerp, clamp, sstep, win, easeInOut, easeOut, easeIn, easeBack, rng, mix, shake, impulse } from '../../../motor/base.js';
import { glow, rrect, line, circle, ellipse, poly, vgrad, shape, sparkle, speedLines, rays, cloud } from '../../../motor/desenho.js';
import { aura, explosao, feixe, raio, poeira } from '../../../motor/efeitos.js';
import { tontura, avisoJogo } from '../../../motor/extras.js';
import { renan, bandido, assaltante, arma, garrafa, amigo, passante, vizinha, celular } from '../../../personagens/elenco.js';
import { quarto, cama, cobertor, rua, mesaCafe, banheiro, espelho, pia, balaoFala } from '../../../cenarios/lugares.js';
import { ruaChuva } from '../../../cenarios/cidade.js';

const W = 1080, H = 1920;
const piscada = (t, f = 3.4, o = 0) => (((t + o) % f) < 0.13 ? 1 : 0);
const fala = (t, ativo, f = 12) => (ativo && Math.sin(t * f) > 0 ? 'aberta' : null);

// ---------- linguagem visual de anime ----------
export function fundoAnime(st, t, c1, c2, { giro = 0.3, linhas = 1, cx = 540, cy = 900 } = {}) {
  st.camada(0, c => {
    const g = c.createRadialGradient(cx, cy, 50, cx, cy, 1300); g.addColorStop(0, c1); g.addColorStop(1, c2); c.fillStyle = g; c.fillRect(0, 0, W, H);
    c.save(); c.translate(cx, cy); c.rotate(t * giro); c.fillStyle = 'rgba(255,255,255,0.08)';
    for (let i = 0; i < 16; i++) { c.rotate(TAU / 16); c.beginPath(); c.moveTo(0, 0); c.lineTo(-90, -2200); c.lineTo(90, -2200); c.closePath(); c.fill(); }
    c.restore();
    if (linhas > 0) speedLines(c, cx, cy, 60, 420, 1500, 0.5 * linhas, t, '#ffffff', 3);
  });
}
export function grito(c, txt, x, y, size, fill, rot, a, { stroke = '#1a0a1a', lw = 14, escala = 1 } = {}) {
  if (a <= 0.01) return;
  c.save(); c.globalAlpha *= a; c.translate(x, y); c.rotate(rot); c.scale(escala, escala);
  c.font = `italic 900 ${size}px Inter, sans-serif`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const w = c.measureText(txt).width; if (w > 980) c.scale(980 / w, 980 / w);
  c.lineWidth = lw; c.strokeStyle = stroke; c.strokeText(txt, 0, 0); c.fillStyle = fill; c.fillText(txt, 0, 0);
  c.restore();
}
// logo de abertura do "anime" do Renan (desfaz = 0..1 quebra em pedaços que caem)
export function logoAnime(c, x, y, s, t, a, desfaz = 0) {
  if (a <= 0.01) return;
  const desenha = c => {
    c.save(); c.translate(x, y); c.scale(s, s);
    for (let i = 0; i < 12; i++) { const an = i / 12 * TAU + t * 0.4; poly(c, [[0, 0], [Math.cos(an - 0.12) * 420, Math.sin(an - 0.12) * 220], [Math.cos(an + 0.12) * 420, Math.sin(an + 0.12) * 220]], i % 2 ? '#ffd23a' : '#ff7a2a', { stroke: null, alpha: 0.5 }); }
    c.font = 'italic 900 170px Inter, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
    c.lineWidth = 26; c.strokeStyle = '#1a0a2a'; c.strokeText('RENAN', 0, -10); const g = c.createLinearGradient(0, -90, 0, 70); g.addColorStop(0, '#fff6a0'); g.addColorStop(0.5, '#ffb020'); g.addColorStop(1, '#e8402a'); c.fillStyle = g; c.fillText('RENAN', 0, -10);
    rrect(c, -260, 80, 520, 74, 12, '#d8202a', { lw: 6 }); c.font = '900 54px Inter, sans-serif'; c.fillStyle = '#ffffff'; c.fillText('O ESCOLHIDO', 0, 119);
    c.restore();
  };
  c.save(); c.globalAlpha *= a;
  if (desfaz <= 0) desenha(c);
  else { const r = rng(9); const bw = 560 * s, bh = 420 * s, nx = 10, ny = 8; for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) { const rx = x - bw / 2 + i * bw / nx, ry = y - bh / 2 + j * bh / ny; const d = clamp(desfaz * 1.6 - r() * 0.6); c.save(); c.globalAlpha *= 1 - d; c.translate((r() - 0.5) * 200 * d, d * d * 900); c.beginPath(); c.rect(rx, ry, bw / nx + 1, bh / ny + 1); c.clip(); desenha(c); c.restore(); } }
  c.restore();
}
// pétalas/brilhos voando no vento (abertura)
function petalas(c, t, a = 1) { const r = rng(4); for (let i = 0; i < 40; i++) { const x = ((r() * 1400 + t * 520 * (0.6 + r())) % 1500) - 200, y = (r() * 2000 + Math.sin(t * 2 + i) * 60) % 1920; c.save(); c.globalAlpha = a * 0.85; c.translate(x, y); c.rotate(t * 4 + i); ellipse(c, 0, 0, 12, 6, i % 3 ? '#ffb8d0' : '#ffffff', { stroke: null }); c.restore(); } }
// cópias fantasma (esquiva em câmera lenta)
function fantasmas(c, P, t, n, dx, a) { const x0 = P.x; for (let i = n; i >= 1; i--) { P.x = x0 - dx * i; P.alpha = a * (0.35 - i * 0.08); P.draw(c, t); } P.x = x0; P.alpha = 1; }

// ---------- 1. O protagonista ----------
export const c1 = {
  nome: 'O protagonista', inicio: 0, fim: 15,
  criar(st) {
    const R = renan();
    return {
      desenhar(t) {
        R.reset(); R.cachecol = false; R.bolsos = false; R.piscar = piscada(t);
        if (t < 6.5) {
          const anda = sstep(3.0, 5.6, t);
          st.setCam(lerp(420, 720, anda), 1260, 1.3);
          quarto(st, t, { luz: 0.85 });
          st.mundo(c => {
            cama(c, 0.15); cobertor(c, 0.15, 400);
            if (t < 3.0) {
              const acorda = sstep(0.7, 1.0, t);
              R.x = 330; R.y = lerp(1700, 1610, acorda); R.semPernas = true; R.jump = impulse(t, 0.8, 30, 0.3);
              R.exp = acorda > 0.5 ? 'determinado' : 'fechado'; R.boca = acorda > 0.5 ? 'reta' : 'reta'; R.olhar = [0.3, -0.4]; R.headTilt = acorda < 0.5 ? 0.3 : 0;
              R.bracos(0.3, 0.2, 0.3, 0.2); R.draw(c, t);
              rrect(c, 120, 1560, 660, 60, 8, '#e8e4dc', { lw: 6 }); rrect(c, 120, 1610, 660, 40, 8, '#8a5a3a', { lw: 6 });
              if (t > 1.1 && t < 2.6) grito(c, '!', 440, 1220, 120, '#ffd23a', 0.15, 1 - sstep(2.2, 2.6, t));
            } else {
              R.x = lerp(330, 760, anda); R.y = 1700; if (anda > 0 && anda < 1) R.walk = t * 6.5; R.exp = 'determinado'; R.boca = 'reta'; R.olhar = [0.6, -0.5];
              R.bracos(0.2, 0.3, 0.2, 0.3); R.draw(c, t);
            }
          });
          return;
        }
        if (t < 11.6) {
          // IMAGINAÇÃO: abertura de anime — vento, câmera girando, pose
          const u = (t - 6.5) / 5.1;
          R.x = 540; R.y = 1700; R.cachecol = true; R.brilhoOlhos = 0.6; R.exp = 'determinado'; R.boca = 'sorriso'; R.olhar = [0.4, -0.6];
          R.bracos(0.4, 1.9, lerp(0.3, 2.75, sstep(7.2, 7.8, t)), 0.1); R.headTilt = -0.08;
          st.setCam(540, lerp(1300, 1250, u), lerp(1.2, 1.55, easeInOut(u)), Math.sin(t * 1.4) * 0.12);
          fundoAnime(st, t, '#ffcf6a', '#d8406a', { giro: 0.5 });
          st.mundo(c => { aura(c, 540, 1500, 260, '#ffffff', t, 0.9, 30, 2); glow(c, 540, 1450, 400, '#fff0a0', 0.4); R.draw(c, t); });
          st.camada(0, c => { petalas(c, t); logoAnime(c, 540, 380, 1.0, t, sstep(8.6, 9.2, t), 0); });
          return;
        }
        // REALIDADE: quarto bagunçado, bolsos vazios, saldo de R$ 3,47
        st.setCam(560, 1290, 1.4);
        quarto(st, t, { luz: 0.8 });
        st.mundo(c => {
          for (let i = 0; i < 5; i++) rrect(c, 150 + i * 150, 1650 + (i % 2) * 30, 90, 26, 6, ['#3a6ab0', '#d0603a', '#e8e0d0', '#5aa070', '#3a3a44'][i], { lw: 4 });
          const bols = sstep(12.0, 12.3, t);
          R.x = 560; R.y = 1700; R.bolsos = bols > 0.5; R.exp = bols > 0.5 ? 'preocupado' : 'determinado'; R.boca = bols > 0.5 ? 'triste' : 'reta'; R.olhar = bols > 0.5 ? [0, 0.8] : [0.6, -0.5];
          R.bracos(bols > 0.5 ? 0.6 : 0.4, bols > 0.5 ? 0.4 : 1.9, bols > 0.5 ? 0.6 : 2.75, bols > 0.5 ? 0.4 : 0.1);
          R.draw(c, t);
          // mariposa saindo do bolso
          if (t > 12.3) { const u = t - 12.3, mx = 640 + u * 60 + Math.sin(u * 9) * 20, my = 1590 - u * 90; for (const s of [-1, 1]) ellipse(c, mx + s * 10, my, 10, 6 + Math.abs(Math.sin(t * 30)) * 6, '#b8a890', { lw: 2 }); }
          balaoFala(c, 760, 1150, 340, 110, win(t, 13.2, 13.4, 14.8, 15.0), { cauda: -1, texto: 'Saldo: R$ 3,47', tam: 38, cor: '#ffe8e8' });
        });
      },
    };
  },
};

// ---------- 2. O primeiro teste ----------
export const c2 = {
  nome: 'O primeiro teste', inicio: 15, fim: 30,
  criar(st) {
    const R = renan(), M = passante(3), V = vizinha(), A = amigo(0);
    const BATE = 16.2;
    return {
      desenhar(t) {
        R.reset(); R.cachecol = false; R.bolsos = false; R.piscar = piscada(t);
        if (t < 20.2) {
          const imag = t > BATE + 0.1 && t < 18.6;
          if (imag) {
            // IMAGINAÇÃO: câmera lenta, rival com aura vermelha, esquiva dramática
            const u = (t - BATE - 0.1) / 2.3;
            st.setCam(560, 1300, lerp(1.4, 1.6, u), -0.08);
            fundoAnime(st, t * 0.2, '#b06aff', '#2a0a4a', { giro: 0.1 });
            st.mundo(c => {
              M.reset(); M.x = 780; M.y = 1700; M.flip = -1; M.exp = 'raiva'; M.boca = 'dentes'; M.brilhoOlhos = 0.9; M.olhar = [0.8, 0]; M.bracos(0.6, 1.6, 1.5, 0.1); M.lean = -0.1;
              aura(c, 780, 1500, 240, '#ff3a3a', t, 1, 24, 4); M.draw(c, t);
              R.x = 420; R.y = 1700; R.lean = -0.55 * easeOut(clamp(u * 2)); R.exp = 'determinado'; R.boca = 'sorriso'; R.brilhoOlhos = 0.7; R.cachecol = true; R.bracos(1.6, 0.2, 1.4, 0.4); R.olhar = [0.8, -0.3];
              fantasmas(c, R, t, 3, 50, 1); R.draw(c, t);
            });
            st.camada(0, c => grito(c, 'ESQUIVA DO VENTO SOMBRIO!', 540, 420, 86, '#ffe14a', -0.08, sstep(16.6, 16.9, t), { escala: 1 + 0.05 * Math.sin(t * 10) }));
            return;
          }
          st.setCam(lerp(420, 600, clamp((t - 15) / 4)), 1270, 1.3);
          rua(st, t);
          st.mundo(c => {
            const tropeco = t > 18.6 ? clamp((t - 18.6) / 1.6) : 0;
            M.reset(); M.y = 1700; M.flip = -1; M.walk = t * 6; M.x = t < BATE ? lerp(1100, 600, (t - 15) / 1.2) : 600 - (t - BATE) * 220; M.olhar = t > 19 ? [0.9, 0] : [-0.5, 0]; M.exp = 'normal'; M.boca = 'reta';
            if (t > 18.8) { M.flip = -1; M.olhar = [-0.9, 0]; }
            R.x = t < BATE ? lerp(300, 470, (t - 15) / 1.2) : 470 + tropeco * 70; R.y = 1700 + Math.sin(tropeco * Math.PI) * 30; R.walk = t < BATE ? t * 6 : null;
            if (tropeco > 0) { R.lean = Math.sin(tropeco * 14) * 0.35 * (1 - tropeco * 0.6); R.exp = 'choque'; R.boca = 'grito'; R.bracos(2.2 + Math.sin(t * 22) * 0.6, 0.3, 2.2 + Math.cos(t * 22) * 0.6, 0.3); }
            else { R.exp = 'normal'; R.boca = 'reta'; R.olhar = [0.6, 0]; }
            M.draw(c, t); R.draw(c, t);
            rrect(c, -800, 1790, 3000, 24, 0, '#8a8478', { stroke: null });
            const [mx, my] = M.cabeca(); if (t > 19.2) grito(c, '?', mx, my - 140, 90, '#ffffff', 0.1, 1);
          });
          return;
        }
        if (t < 22.6) {
          // olhar torto da senhora = rivalidade
          const imag = t > 20.9;
          st.setCam(540, 1270, 1.35);
          if (imag) fundoAnime(st, t, '#ff5a3a', '#2a3a9a', { giro: 0.2, cx: 540, cy: 1000 }); else rua(st, t);
          st.mundo(c => {
            V.reset(); V.x = 800; V.y = 1700; V.flip = -1; V.exp = 'raiva'; V.boca = 'reta'; V.olhar = [0.9, 0]; V.brilhoOlhos = imag ? 0.8 : 0; V.draw(c, t);
            R.x = 280; R.y = 1700; R.exp = imag ? 'raiva' : 'normal'; R.boca = 'dentes'; R.olhar = [0.9, 0]; R.brilhoOlhos = imag ? 0.8 : 0;
            R.draw(c, t);
            if (imag) { const [a, b] = R.cabeca(), [d, e] = V.cabeca(); raio(c, a + 40, b, d - 40, e, Math.floor(t * 20), 1, '#ffe14a'); grito(c, 'RIVAL!', 540, 1000, 150, '#ff3a3a', -0.1, sstep(21.0, 21.2, t)); }
          });
          return;
        }
        if (t < 25.6) {
          // desafio = arco de treinamento
          const imag = t > 23.8;
          if (!imag) {
            st.setCam(540, 1270, 1.35); rua(st, t);
            st.mundo(c => { A.reset(); A.x = 780; A.y = 1700; A.flip = -1; A.exp = 'feliz'; A.boca = fala(t, true) || 'sorriso'; A.olhar = [0.9, 0]; A.bracos(0.3, 0.2, 1.2, 0.6); A.draw(c, t); R.x = 320; R.y = 1700; R.exp = 'choque'; R.boca = 'o'; R.olhar = [0.9, 0]; R.draw(c, t); const [ax, ay] = A.cabeca(); balaoFala(c, ax - 60, ay - 170, 400, 110, sstep(22.7, 22.9, t), { cauda: 1, texto: 'Duvido tu fazer 50!', tam: 36 }); });
            return;
          }
          st.setCam(540, 1300, 1.4, 0, shake(t, impulse(t, 24.6, 0.8)));
          fundoAnime(st, t, '#6affd0', '#0a3a5a', { giro: 0.4 });
          st.mundo(c => {
            // pedra gigante que racha com o soco
            const racha = sstep(24.5, 24.7, t);
            shape(c, c => { c.moveTo(640, 1700); c.lineTo(660, 1300); c.lineTo(820, 1200); c.lineTo(1000, 1280); c.lineTo(1040, 1700); c.closePath(); }, '#7a7280');
            if (racha > 0) line(c, [[700, 1260], [780, 1400], [740, 1500], [840, 1620]], '#2a2030', 8);
            aura(c, 360, 1500, 260, '#6affd0', t, 1, 30, 5);
            R.x = 360; R.y = 1700; R.brilhoOlhos = 0.9; R.cachecol = true; R.exp = 'raiva'; R.boca = 'grito'; R.olhar = [0.9, 0]; R.bracos(0.4, 2.0, racha > 0 ? 1.55 : 0.8, racha > 0 ? 0 : 2.2); R.lean = racha * 0.1; R.draw(c, t);
            if (racha > 0) explosao(c, 660, 1440, 1.2, t - 24.6);
          });
          st.camada(0, c => { rrect(c, 90, 300, 900, 170, 20, '#1a0a2a', { stroke: '#6affd0', lw: 8, alpha: 0.9 }); grito(c, 'ARCO DE TREINAMENTO', 540, 385, 78, '#6affd0', 0, 1, { lw: 10 }); });
          return;
        }
        // REALIDADE: uma garrafinha de água de "peso", e o braço tremendo
        st.setCam(560, 1250, 1.5);
        banheiro(st, t, { frio: 0 });
        st.mundo(c => {
          const flex = t > 28.2;
          espelho(c, 640, 960, 340, 540, t, c => { const Q = renan(); Q.x = 800; Q.y = 1520; Q.s = 0.92; Q.flip = -1; Q.exp = flex ? 'feliz' : 'raiva'; Q.boca = flex ? 'sorriso' : 'dentes'; Q.bracos(flex ? 2.4 : 0.2, flex ? 2.4 : 0.1, flex ? 0.2 : 0.8, flex ? 0.1 : 2.2 + Math.sin(t * 6) * 0.3); Q.maoE = null; Q.draw(c, t); });
          pia(c, 820, 1500);
          R.x = 380; R.y = 1700; R.olhar = [0.8, -0.1];
          if (!flex) { R.maoD = garrafa(); R.bracos(0.2, 0.1, 0.8, 2.2 + Math.sin(t * 6) * 0.3); R.tremor = 0.4; R.suor = 1; R.exp = 'raiva'; R.boca = 'dentes'; }
          else { R.bracos(0.2, 0.1, 2.4, 2.4); R.exp = 'feliz'; R.boca = 'sorriso'; }
          R.draw(c, t);
          const [hx, hy] = R.cabeca();
          balaoFala(c, hx + 40, hy - 170, 200, 100, win(t, 25.9, 26.1, 26.9, 27.1), { cauda: -1, texto: '1...', tam: 44 });
          balaoFala(c, hx + 40, hy - 170, 200, 100, win(t, 27.1, 27.3, 28.0, 28.2), { cauda: -1, texto: '2... 😮‍💨', tam: 40 });
          if (flex) { const [mx, my] = R.mao(1); sparkle(c, mx - 20, my + 50, 24, '#ffffff', Math.abs(Math.sin(t * 6))); }
        });
      },
    };
  },
};

// ---------- 3. Os bandidos ----------
export const c3 = {
  nome: 'Os bandidos', inicio: 30, fim: 48,
  criar(st) {
    const R = renan(), B = [bandido(0), bandido(1), bandido(2)];
    const posB = [[760, 1700], [180, 1700], [930, 1650]];
    return {
      desenhar(t) {
        R.reset(); R.cachecol = false; R.bolsos = false; R.piscar = piscada(t);
        if (t < 33.4 || (t >= 39.4 && t < 44.4)) {
          // REALIDADE (noite, rua comum)
          st.setCam(t < 33.4 ? 540 : 620, 1270, t < 33.4 ? 1.2 : 1.15);
          ruaChuva(st, t);
          st.mundo(c => {
            glow(c, 540, 1500, 700, '#ffe8b0', 0.35);
            const cerca = sstep(31.0, 32.0, t);
            const trope = sstep(40.0, 40.4, t), cai = sstep(40.4, 40.9, t), domino = [sstep(40.8, 41.2, t), sstep(41.1, 41.5, t), sstep(41.4, 41.8, t)], foge = clamp((t - 42.4) / 2.0);
            B.forEach((b, i) => {
              b.reset(); const [x, y] = posB[i]; b.x = lerp(x + (i === 1 ? -500 : 500), x, cerca); b.y = y; b.flip = i === 1 ? 1 : -1; if (cerca > 0 && cerca < 1) b.walk = t * 6;
              b.exp = 'raiva'; b.boca = 'reta'; b.olhar = [0.9, 0]; b.bracos(0.5, 1.2, 0.9, 0.4);
              if (t > 39.4) { const d = domino[i]; b.lean = (i === 1 ? -1 : 1) * d * 1.3; b.y = y + d * 40; b.exp = d > 0.5 ? 'choque' : 'raiva'; b.boca = d > 0.5 ? 'o' : 'reta'; b.bracos(lerp(0.5, 2.6, d), 0.3, lerp(0.9, 2.6, d), 0.3); }
              b.draw(c, t);
              if (t > 41.8) { const [hx, hy] = b.cabeca(); tontura(c, hx, hy - 60, t, sstep(41.8, 42.2, t)); }
            });
            R.y = 1700;
            if (t < 33.4) { R.x = lerp(300, 520, clamp((t - 30) / 1.6)); if (t < 31.6) R.walk = t * 6; R.exp = cerca > 0.5 ? 'choque' : 'normal'; R.boca = cerca > 0.5 ? 'o' : 'reta'; R.olhar = [Math.sin(t * 4) * 0.9, 0]; }
            else if (foge <= 0) { R.x = 520 + trope * 80; R.exp = trope > 0.5 ? 'choque' : 'determinado'; R.boca = trope > 0.5 ? 'grito' : 'sorriso'; R.bracos(trope > 0 ? 2.4 : 1.6, 0.2, trope > 0 ? 2.4 : 0.6, 0.2); R.lean = cai * 1.25; R.y = 1700 + cai * 60; }
            else { R.x = 600 + foge * 700; R.walk = t * 14; R.exp = 'medo'; R.boca = 'grito'; R.lean = 0.25; R.bracos(2.4 + Math.sin(t * 20) * 0.5, 0.2, 2.4 + Math.cos(t * 20) * 0.5, 0.2); }
            R.draw(c, t);
            if (cai > 0.5 && t < 42.4) { cloud(c, 620, 1640, 120, 'rgba(230,220,200,0.8)', { seed: Math.floor(t * 6) }); }
            const [bx, by] = B[0].cabeca();
            balaoFala(c, bx - 100, by - 170, 440, 110, win(t, 32.0, 32.2, 33.2, 33.4), { cauda: 1, texto: 'PERDEU, PERDEU!', tam: 42 });
            if (foge > 0) { const [hx, hy] = R.cabeca(); grito(c, 'AAAAAAH!', hx, hy - 160, 70, '#ffffff', -0.1, 1); }
          });
          return;
        }
        if (t < 39.4) {
          // IMAGINAÇÃO: cabeça baixa, olhos brilhando, PUNHO DO DESTINO ETERNO
          const brilha = sstep(34.6, 35.0, t), golpe = sstep(36.6, 36.9, t);
          st.setCam(540, lerp(1240, 1300, golpe), lerp(1.6, 1.2, golpe), 0, shake(t, impulse(t, 37.0, 1.2)));
          fundoAnime(st, t, '#4a8aff', '#0a0a2a', { giro: 0.6 });
          st.mundo(c => {
            B.forEach((b, i) => {
              const [x, y] = posB[i]; const voa = clamp((t - 37.1) / 1.2);
              b.reset(); b.x = x + (i === 1 ? -1 : 1) * voa * 900; b.y = y - voa * 500; b.s = 1.15; b.flip = i === 1 ? 1 : -1; b.lean = (i === 1 ? -1 : 1) * voa * 3; b.brilhoOlhos = 1; b.exp = voa > 0 ? 'medo' : 'raiva'; b.boca = voa > 0 ? 'grito' : 'dentes'; b.bracos(0.8, 1.0, 1.2, 0.4);
              b.draw(c, t);
            });
            R.x = 540; R.y = 1700; R.cachecol = true; R.brilhoOlhos = brilha; R.headTilt = 0.15 * (1 - brilha); R.olhar = brilha > 0.5 ? [0, -0.1] : [0, 0.8];
            R.exp = brilha > 0.5 ? 'determinado' : 'normal'; R.boca = golpe > 0 ? 'grito' : 'sorriso';
            R.bracos(golpe > 0 ? 1.55 : 0.4, golpe > 0 ? 0 : 1.9, golpe > 0 ? 1.55 : 0.4, golpe > 0 ? 0 : 1.9);
            aura(c, 540, 1480, 300, '#9ad0ff', t, 0.6 + brilha * 0.6, 36, 6); glow(c, 540, 1450, 460, '#6ab0ff', 0.35 * brilha);
            R.draw(c, t);
            if (golpe > 0) { feixe(c, 540, 1480, 1300, 1480, '#bfe4ff', 1 - sstep(38.4, 39.2, t), t, 120); feixe(c, 540, 1480, -260, 1480, '#bfe4ff', 1 - sstep(38.4, 39.2, t), t, 120); explosao(c, 900, 1500, 2, t - 37.1); explosao(c, 160, 1500, 2, t - 37.2); }
          });
          st.camada(0, c => { grito(c, 'PUNHO DO DESTINO', 540, 380, 96, '#ffe14a', -0.06, sstep(36.4, 36.6, t), { escala: 1 + impulse(t, 36.5, 0.3) }); grito(c, 'ETERNO!!!', 540, 500, 120, '#ff5a3a', -0.06, sstep(36.7, 36.9, t), { escala: 1 + impulse(t, 36.8, 0.3) }); });
          return;
        }
        // ofegante... e convencido da "proteção de roteiro"
        st.setCam(560, 1270, 1.35);
        ruaChuva(st, t);
        st.mundo(c => {
          const conv = sstep(45.6, 46.0, t);
          R.x = 560; R.y = 1700; R.lean = 0.25 * (1 - conv); R.bracos(0.6, 1.4, 0.6, 1.4); R.suor = 1 - conv; R.exp = conv > 0.5 ? 'feliz' : 'fechado'; R.boca = conv > 0.5 ? 'sorriso' : 'aberta'; R.squash = Math.sin(t * 9) * 0.02 * (1 - conv);
          if (conv > 0.5) { R.bracos(0.4, 2.3, 0.4, 2.3); glow(c, 560, 1450, 380, '#ffd86a', 0.35); shape(c, c => c.arc(560, 1500, 300, 0, TAU), null, { stroke: '#ffd86a', lw: 6, alpha: 0.6 + 0.3 * Math.sin(t * 6) }); }
          R.draw(c, t);
        });
        avisoJogo(st, t, 45.9, 'HABILIDADE DESBLOQUEADA', '🛡️ PROTEÇÃO DE PROTAGONISTA', 2.1, 380);
      },
    };
  },
};

// ---------- 4. A arrogância ----------
export const c4 = {
  nome: 'A arrogância', inicio: 48, fim: 65,
  criar(st) {
    const R = renan(), A = [amigo(0), amigo(1), amigo(2)];
    return {
      desenhar(t) {
        R.reset(); R.cachecol = false; R.bolsos = false; R.piscar = piscada(t);
        if (t < 55) {
          st.setCam(540, 1280, 1.25);
          rua(st, t);
          st.mundo(c => {
            const [a0, a1, a2] = A;
            a0.reset(); a0.x = 200; a0.y = 1700; a0.semPernas = true; a0.maoD = celular(1); a0.bracos(0.3, 0.3, 0.8, 2.2); a0.olhar = [0, 0.7]; a0.exp = 'normal'; a0.boca = 'reta'; a0.draw(c, t);
            a1.reset(); a1.x = 880; a1.y = 1700; a1.flip = -1; a1.semPernas = true; const boc = win(t, 51.2, 51.5, 52.6, 52.9); a1.exp = boc > 0.5 ? 'fechado' : 'normal'; a1.boca = boc > 0.5 ? 'o' : 'reta'; a1.bracos(0.4, 1.5, lerp(0.4, 2.4, boc), lerp(1.5, 2.2, boc)); a1.olhar = [0.8, 0]; a1.draw(c, t);
            mesaCafe(c, 540, 1600);
            // Renan em pé, reencenando a "luta"
            R.x = 540; R.y = 1640; R.s = 1.0; R.exp = 'feliz'; R.boca = fala(t, true, 14) || 'sorriso'; R.olhar = [Math.sin(t * 2) * 0.9, 0];
            const soco = Math.sin(t * 7); R.bracos(1.0 + soco * 0.6, 0.6 - soco * 0.6, 1.0 - soco * 0.6, 0.6 + soco * 0.6); R.jump = Math.abs(Math.sin(t * 7)) * 12; R.lean = soco * 0.06;
            R.draw(c, t);
            const [hx, hy] = R.cabeca();
            balaoFala(c, hx + 60, hy - 200, 380, 110, win(t, 48.9, 49.1, 50.6, 50.8), { cauda: -1, texto: 'ERAM TRÊS!', tam: 46 });
            balaoFala(c, hx + 60, hy - 200, 380, 110, win(t, 50.8, 51.0, 52.6, 52.8), { cauda: -1, texto: 'ERAM DEZ!!', tam: 46 });
            balaoFala(c, hx + 40, hy - 200, 460, 110, win(t, 52.8, 53.0, 54.8, 55.0), { cauda: -1, texto: 'E EU NEM SUEI!', tam: 44 });
          });
          return;
        }
        if (t < 61) {
          // treinando golpes no espelho
          st.setCam(560, 1250, 1.45);
          banheiro(st, t, { frio: 0.2 });
          st.mundo(c => {
            const g1 = win(t, 55.3, 55.5, 56.8, 57.0), g2 = win(t, 57.3, 57.5, 58.8, 59.0), mae = t > 59.3;
            const chute = g2 > 0.5;
            espelho(c, 640, 960, 340, 540, t, c => { const Q = renan(); Q.x = 800; Q.y = 1520; Q.s = 0.92; Q.flip = -1; Q.exp = mae ? 'choque' : 'raiva'; Q.boca = mae ? 'o' : 'grito'; Q.bracos(0.4, 1.8, g1 > 0.5 ? 1.55 : 0.6, g1 > 0.5 ? 0 : 1.8); Q.lean = chute ? -0.3 : 0; Q.draw(c, t); });
            pia(c, 820, 1500);
            // copo das escovas que cai no chute
            const cai = clamp((t - 58.0) / 0.5); c.save(); c.translate(920 + cai * 40, 1470 + cai * cai * 230); c.rotate(cai * 1.6); rrect(c, -18, -50, 36, 50, 6, '#5ab0e8', { lw: 4 }); line(c, [[-6, -50], [-12, -84]], '#ff6a6a', 6); line(c, [[6, -50], [10, -86]], '#6ad08a', 6); c.restore();
            R.x = 380; R.y = 1700; R.olhar = [0.9, 0];
            R.exp = mae ? 'choque' : 'raiva'; R.boca = mae ? 'o' : 'grito';
            R.bracos(0.4, 1.8, g1 > 0.5 ? 1.55 : 0.6, g1 > 0.5 ? 0 : 1.8); R.lean = chute ? -0.35 : 0; R.jump = chute ? 20 : 0;
            R.draw(c, t);
            if (chute) { c.save(); c.translate(R.x + 60, R.y - 120); c.rotate(-0.5); rrect(c, 0, -14, 150, 30, 14, '#22222c', { lw: 5 }); ellipse(c, 160, 0, 30, 18, '#d8302a', { lw: 4 }); c.restore(); }
            const [hx, hy] = R.cabeca();
            balaoFala(c, hx + 80, hy - 220, 520, 120, g1, { cauda: -1, texto: 'RAJADA DO TROVÃO SUPREMO!', tam: 34 });
            balaoFala(c, hx + 80, hy - 220, 540, 120, g2, { cauda: -1, texto: 'CHUTE DO DRAGÃO DE GUARULHOS!', tam: 31 });
          });
          if (t > 59.3) st.camada(0, c => { balaoFala(c, 300, 360, 480, 120, sstep(59.3, 59.5, t), { cauda: -1, texto: 'RENAN, CALA A BOCA!', tam: 40, cor: '#ffe0e0' }); grito(c, '(mãe)', 160, 470, 34, '#ffffff', 0, sstep(59.3, 59.5, t), { lw: 6 }); });
          return;
        }
        // IMAGINAÇÃO: o escolhido
        st.setCam(540, lerp(1320, 1260, (t - 61) / 4), lerp(1.1, 1.35, (t - 61) / 4));
        fundoAnime(st, t, '#ffe9a0', '#e8602a', { giro: 0.25, cy: 700 });
        st.mundo(c => {
          c.save(); c.globalCompositeOperation = 'lighter'; const g = c.createLinearGradient(0, 0, 0, 1700); g.addColorStop(0, 'rgba(255,250,200,0)'); g.addColorStop(1, 'rgba(255,250,200,0.5)'); c.fillStyle = g; c.beginPath(); c.moveTo(440, -400); c.lineTo(640, -400); c.lineTo(760, 1720); c.lineTo(320, 1720); c.closePath(); c.fill(); c.restore();
          aura(c, 540, 1480, 300, '#fff6c0', t, 1, 36, 8);
          R.x = 540; R.y = 1700; R.cachecol = true; R.brilhoOlhos = 0.8; R.exp = 'determinado'; R.boca = 'sorriso'; R.olhar = [0, -0.5]; R.bracos(0.4, 1.9, 2.75, 0.1); R.headTilt = -0.1;
          R.draw(c, t);
        });
        st.camada(0, c => grito(c, 'O ESCOLHIDO', 540, 400, 130, '#ffffff', -0.05, sstep(61.6, 62.0, t), { stroke: '#e8402a', lw: 18 }));
      },
    };
  },
};

// ---------- 5. A realidade (sem música, sem efeitos) ----------
export const c5 = {
  nome: 'A realidade', inicio: 65, fim: 77.4,
  criar(st) {
    const R = renan(), X = assaltante();
    return {
      desenhar(t) {
        R.reset(); R.cachecol = false; R.bolsos = false; R.piscar = piscada(t, 3.0);
        X.reset(); X.flip = -1; X.exp = 'determinado'; X.boca = 'reta'; X.olhar = [0.9, 0]; X.piscar = piscada(t, 5.1);
        const chega = clamp((t - 65.6) / 2.6), aponta = sstep(68.3, 68.6, t), pose = win(t, 69.6, 69.9, 72.0, 72.4), medo = sstep(73.8, 74.6, t);
        X.x = lerp(1250, 760, easeOut(chega)) - sstep(76.6, 77.3, t) * 40; X.y = 1700; if (chega > 0 && chega < 1) X.walk = t * 5;
        X.maoD = aponta > 0.5 ? arma() : null; X.bracos(0.2, 0.2, lerp(0.2, 1.5, aponta), lerp(0.2, 0.05, aponta));
        R.x = lerp(140, 360, clamp((t - 65) / 2.2)); R.y = 1700; if (t < 67.2) R.walk = t * 5.5;
        if (t < 68.3) { R.exp = 'feliz'; R.boca = 'sorriso'; R.olhar = [0.4, 0]; }
        else if (t < 69.6) { R.exp = 'choque'; R.boca = 'o'; R.olhar = [0.9, 0]; }
        else if (medo < 0.5) { R.exp = 'determinado'; R.boca = fala(t, t > 70 && t < 71.6) || 'sorriso'; R.olhar = [0.9, 0]; R.bracos(0.4, 1.9, lerp(0.2, 2.75, pose), 0.1); }
        else { R.exp = 'medo'; R.boca = 'tremendo'; R.olhar = [0.9, 0.2]; R.suor = 1; R.tremor = 0.3; R.bracos(lerp(0.4, 2.3, medo), 0.3, lerp(0.4, 2.3, medo), 0.3); }
        // câmera parada e seca; closes nos rostos
        let cam;
        if (t < 72.4) cam = [560, 1280, 1.25];
        else if (t < 74.0) { const [hx, hy] = X.cabeca(); cam = [hx - 40, hy + 40, 2.6]; }
        else { const [hx, hy] = R.cabeca(); cam = [hx + 40, hy + 40, 2.4 + (t - 74) * 0.08]; }
        st.setCam(cam[0], cam[1], cam[2]);
        rua(st, t, { cinza: 0.85 });
        st.mundo(c => {
          X.draw(c, t); R.draw(c, t);
          const [hx, hy] = R.cabeca(), [xx, xy] = X.cabeca();
          balaoFala(c, xx - 40, xy - 160, 340, 100, win(t, 68.6, 68.8, 69.6, 69.8), { cauda: 1, texto: 'Passa o celular.', tam: 32 });
          balaoFala(c, hx + 60, hy - 180, 480, 110, win(t, 70.0, 70.2, 71.6, 71.8), { cauda: -1, texto: 'Eu não tenho medo de você.', tam: 30 });
          // o "poder" tenta aparecer... e falha
          const tenta = win(t, 71.4, 71.55, 71.7, 71.9);
          if (tenta > 0) { glow(c, hx - 26, hy - 4, 30, '#6ab0ff', tenta * 0.5); glow(c, hx + 26, hy - 4, 30, '#6ab0ff', tenta * 0.5); }
          if (t > 71.9 && t < 72.6) cloud(c, hx + 90, hy - 90 - (t - 71.9) * 60, 26, 'rgba(160,160,170,0.7)', { seed: 2 });
        });
      },
    };
  },
};

// ---------- 6. O fim do anime ----------
export const c6 = {
  nome: 'O fim do anime', inicio: 77.4, fim: 90,
  criar(st) {
    return {
      desenhar(t) {
        st.setCam(540, 960, 1);
        st.camada(0, c => {
          c.fillStyle = '#000'; c.fillRect(0, 0, W, H);
          const a = sstep(79.2, 80.0, t) * (1 - sstep(85.6, 86.2, t));
          const piscaFita = 0.75 + 0.25 * Math.sin(t * 37) * Math.sin(t * 11);
          logoAnime(c, 540, 860, 1.25, t * 0.2, a * piscaFita, sstep(82.0, 85.4, t)); c.save(); c.globalCompositeOperation = 'saturation'; c.globalAlpha = 0.65; c.fillStyle = '#808080'; c.fillRect(0, 0, W, H); c.globalCompositeOperation = 'multiply'; c.globalAlpha = 0.25; c.fillRect(0, 0, W, H); c.restore();
          if (a > 0) { c.save(); c.globalAlpha = 0.12 * a; c.fillStyle = '#ffffff'; for (let y = (t * 300) % 8; y < H; y += 8) c.fillRect(0, y, W, 2); c.restore(); }
        });
      },
    };
  },
};
