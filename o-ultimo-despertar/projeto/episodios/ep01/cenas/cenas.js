// O ÚLTIMO DESPERTAR — Episódio 1: O Garoto Sem Poder (6 cenas)
import { kf, lerp, clamp, sstep, win, easeInOut, easeOut, easeIn, shake, impulse, rng } from '../../../motor/base.js';
import { glow, sparkle, rrect, line, circle, speedLines, rune, poly } from '../../../motor/desenho.js';
import { exclamacao } from '../../../motor/balao.js';
import { kael, pulseiraPreta, draven, lyra, tomi, mira, examinadora, morador, criancaAether } from '../../../personagens/elenco.js';
import { cidadeAether, quintal, patioAcademia, salaoTeste, cristal, chama, arcoAgua, gelo, raioMao, auraTele, flor, pedra } from '../../../cenarios/aether.js';

// risadas em quadrinhos ("HAHA") sobre a cabeça
function risada(c, x, y, t, a = 1, i = 0) { if (a <= 0) return; c.save(); c.globalAlpha *= a; c.translate(x, y + Math.sin(t * 12 + i) * 6); c.rotate(Math.sin(t * 9 + i) * 0.15); c.font = '900 44px Inter, sans-serif'; c.textAlign = 'center'; c.lineWidth = 10; c.strokeStyle = '#2b1f2a'; c.strokeText('HAHA', 0, 0); c.fillStyle = '#ffd23a'; c.fillText('HAHA', 0, 0); c.restore(); }
// livro flutuando (telecinese)
function livroFlutuante(c, x, y, t) { c.save(); c.translate(x, y); c.rotate(Math.sin(t * 2) * 0.3); rrect(c, -40, -30, 80, 60, 6, '#8a3a3a', { lw: 5 }); rrect(c, -34, -24, 68, 48, 4, '#f2e6c8', { lw: 3 }); c.restore(); }

// ---------- 1. O mundo de Aether ----------
export const c1 = {
  nome: 'O mundo de Aether', inicio: 0, fim: 9,
  criar(st) {
    const P = [morador(0), morador(1), morador(2), morador(3), morador(4)];
    return {
      desenhar(t) {
        // cortes rápidos nos primeiros segundos (gancho)
        const plano = t < 1.6 ? 0 : t < 3.0 ? 1 : t < 4.6 ? 2 : 3;
        const cam = [[[300, 1260, 1.6]], [[760, 1240, 1.6]], [[540, 1250, 1.5]], [[540, lerp(1150, 1000, (t - 4.6) / 4.4), lerp(1.05, 0.85, (t - 4.6) / 4.4)]]][plano][0];
        st.setCam(cam[0], cam[1], cam[2]);
        cidadeAether(st, t);
        st.mundo(c => {
          // fogo
          const f = P[0]; f.reset(); f.x = 300; f.y = 1600; f.s = 1.0; f.bracos(0.4, 1.3, 1.6, 0.6); f.exp = 'feliz'; f.boca = 'sorriso'; f.olhar = [0.6, -0.4]; f.draw(c, t);
          const [fx, fy] = f.mao(1); for (let i = 0; i < 3; i++) chama(c, fx + Math.cos(t * 4 + i * 2.1) * 60, fy - 60 + Math.sin(t * 4 + i * 2.1) * 30, 0.5, t, i);
          // água
          const a = P[1]; a.reset(); a.x = 760; a.y = 1600; a.s = 1.0; a.bracos(1.6, 0.3, 1.6, 0.3); a.exp = 'feliz'; a.boca = 'aberta'; a.draw(c, t);
          const [ax, ay] = a.mao(-1), [bx, by] = a.mao(1); arcoAgua(c, ax, ay, bx, by, t);
          // telecinese
          const m = P[2]; m.reset(); m.x = 540; m.y = 1640; m.s = 0.95; m.bracos(0.3, 0.2, 2.4, 0.3); m.exp = 'feliz'; m.boca = 'sorriso'; m.olhar = [0, -0.8]; m.draw(c, t);
          for (let i = 0; i < 3; i++) { const bx2 = 460 + i * 80, by2 = 1060 + Math.sin(t * 2 + i) * 30; rrect(c, bx2 - 30, by2 - 30, 60, 60, 6, '#c89a5a', { lw: 5 }); auraTele(c, bx2, by2, 50, t); }
          // velocidade e força ao fundo
          const v = P[3]; v.reset(); v.s = 0.85; v.y = 1560; v.x = ((t * 900) % 1800) - 300; v.walk = t * 20; v.lean = 0.25; v.exp = 'feliz'; v.boca = 'aberta';
          for (let k = 3; k > 0; k--) { c.save(); c.globalAlpha = 0.2 * k; c.translate(-k * 50, 0); v.draw(c, t); c.restore(); } v.draw(c, t);
          const s = P[4]; s.reset(); s.x = 980; s.y = 1580; s.s = 0.9; s.bracos(2.8, 0.2, 2.8, 0.2); s.exp = 'feliz'; s.boca = 'aberta'; s.draw(c, t);
          rrect(c, 900, 1050 + Math.sin(t * 3) * 10, 160, 90, 12, '#9a6a3a', { lw: 6 }); for (const wx of [930, 1030]) circle(c, wx, 1140 + Math.sin(t * 3) * 10, 22, '#4a3a2a', { lw: 5 });
          raioMao(c, 140, 900, 260, 1100, t, win(t, 6.2, 6.3, 6.6, 6.8));
        });
        if (plano === 1 || plano === 2) st.camada(0, c => speedLines(c, 540, 960, 30, 520, 1500, 0.25, t));
      },
    };
  },
};

// ---------- 2. O nascimento de Kael (infância) ----------
export const c2 = {
  nome: 'O nascimento de Kael', inicio: 9, fim: 18,
  criar(st) {
    const K = kael('crianca'), O = criancaAether(0);
    return {
      desenhar(t) {
        const tenta = (t > 10.4 && t < 12.6) || (t > 13.6 && t < 15.6);
        let cam;
        if (t < 13.2) cam = [440, 1300, lerp(1.4, 1.6, (t - 9) / 4)];
        else if (t < 15.8) { const [hx, hy] = K.cabeca(); cam = [hx, hy + 80, 2.2]; }
        else cam = [560, 1300, 1.25];
        st.setCam(cam[0], cam[1], cam[2], 0, tenta ? [Math.sin(t * 50) * 0.08, 0] : [0, 0]);
        quintal(st, t);
        st.mundo(c => {
          pedra(c, 640, 1650, 1.1, tenta ? 0.3 : 0, t);
          O.reset(); O.x = 900; O.y = 1640; O.s = 0.72; O.bracos(0.3, 0.2, 1.5, 0.1); O.exp = 'feliz'; O.boca = 'aberta'; O.olhar = [0, 0.6]; O.flip = -1; O.draw(c, t);
          flor(c, 790, 1660, sstep(15.8, 17, t), t);
          K.reset(); K.x = 440; K.y = 1660; K.s = 0.74;
          if (tenta) { K.exp = 'fechado'; K.boca = 'tremendo'; K.squash = 0.06; K.tremor = 0.6; K.bracos(0.5, 1.7, 0.5, 1.7); }
          else if (t > 12.6 && t < 13.6) { K.exp = 'normal'; K.boca = 'reta'; K.olhar = [0.7, 0.4]; K.bracos(0.2, 0.1, 1.4, 0); }
          else if (t >= 15.6) { K.exp = 'preocupado'; K.boca = 'triste'; K.olhar = [0.9, 0]; K.headTilt = 0.1; }
          else { K.exp = 'determinado'; K.boca = 'reta'; K.bracos(0.3, 0.3, 1.4, 0); K.olhar = [0.7, 0.4]; }
          if (t > 16.8) { K.olhar = [0, 0.7]; K.exp = 'preocupado'; }
          K.draw(c, t);
          if (t > 12.3 && t < 12.8) for (let i = 0; i < 3; i++) circle(c, 640 + i * 16, 1590 - (t - 12.3) * 80, 6, '#c8c8c8', { stroke: null, alpha: 0.6 });
        });
      },
    };
  },
};

// ---------- 3. O passar dos anos ----------
export const c3 = {
  nome: 'O passar dos anos', inicio: 18, fim: 27,
  criar(st) {
    const K = kael('jovem'), L = lyra(), T = tomi();
    return {
      desenhar(t) {
        const fase = t < 21 ? 0 : t < 24 ? 1 : 2;
        st.setCam(540, 1290, [1.3, 1.3, 1.2][fase]);
        quintal(st, t);
        st.mundo(c => {
          const s = [0.8, 0.9, 1.0][fase];
          if (fase < 2) {
            // um amigo desperta, Kael aplaude com sorriso forçado
            const F = fase === 0 ? L : T, t0 = fase === 0 ? 18.6 : 21.6;
            F.reset(); F.x = 720; F.y = 1650; F.s = s; F.bracos(0.3, 0.2, lerp(0.3, 2.6, sstep(t0, t0 + 0.4, t)), 0.2); F.exp = 'feliz'; F.boca = 'aberta'; F.jump = win(t, t0 + 0.4, t0 + 0.6, t0 + 0.8, t0 + 1.0) * 40; F.draw(c, t);
            const [hx, hy] = F.mao(1);
            if (fase === 0) gelo(c, hx, hy - 20, 0.9, sstep(t0, t0 + 0.4, t)); else raioMao(c, hx, hy - 10, hx + 60, hy - 260, t, sstep(t0, t0 + 0.2, t) * (0.6 + 0.4 * Math.sin(t * 30)));
            K.reset(); K.x = 330; K.y = 1660; K.s = s; const palma = Math.abs(Math.sin(t * 9)); K.bracos(0.5, 1.7 + palma * 0.3, 0.5, 1.7 + palma * 0.3); K.exp = 'feliz'; K.boca = 'sorriso'; K.olhar = [0.8, 0];
            if (t > t0 + 1.6) { K.exp = 'preocupado'; K.boca = 'reta'; K.bracos(0.2, 0.1, 0.2, 0.1); }
            K.draw(c, t);
          } else {
            // os amigos vão embora juntos
            const u = clamp((t - 24.2) / 2.4);
            for (const [F, dx] of [[L, 0], [T, 140]]) { F.reset(); F.x = lerp(560, 1300, u) + dx; F.y = 1650; F.s = 1.0; F.walk = t * 6; F.exp = 'feliz'; F.boca = 'aberta'; F.olhar = [0.8, 0]; F.draw(c, t); }
            K.reset(); K.x = 330; K.y = 1660; K.s = 1.0; K.olhar = [0.9, 0]; K.exp = 'preocupado'; K.boca = 'triste'; K.bracoD = { a: lerp(1.2, 0.2, sstep(25.4, 26.2, t)), b: 0.2 }; K.maoE = pulseiraPreta(); K.draw(c, t);
          }
        });
      },
    };
  },
};

// ---------- 4. A humilhação ----------
export const c4 = {
  nome: 'A humilhação', inicio: 27, fim: 37,
  criar(st) {
    const K = kael('jovem'), D = draven(), M = mira(), X = [lyra(), tomi()];
    return {
      desenhar(t) {
        let cam;
        if (t < 30.5) cam = [lerp(420, 600, (t - 27) / 3.5), 1280, 1.15];
        else if (t < 33.5) cam = [640, 1260, 1.35];
        else { const [hx, hy] = K.cabeca(); cam = [hx, hy + 110, lerp(2.0, 2.3, (t - 33.5) / 3.5)]; }
        st.setCam(cam[0], cam[1], cam[2], 0, shake(t, impulse(t, 31.2, 0.6)));
        patioAcademia(st, t);
        st.mundo(c => {
          X.forEach((x, i) => { x.reset(); x.x = i ? 120 : -40; x.y = 1640; x.s = 0.95; x.exp = 'feliz'; x.boca = 'aberta'; x.olhar = [0.8, 0]; x.draw(c, t); risada(c, x.cabeca()[0], x.cabeca()[1] - 130, t, sstep(31.4, 31.8, t), i); });
          M.reset(); M.x = 960; M.y = 1640; M.s = 1.0; M.flip = -1; M.bracos(0.3, 0.2, 1.8, 0.2); M.exp = 'malicia'; M.boca = 'sorrisoMal'; M.olhar = [0.6, -0.4]; M.draw(c, t);
          D.reset(); D.x = 760; D.y = 1650; D.s = 1.05; D.flip = -1; D.bracos(0.4, 1.4, 1.5, 0.4); D.exp = 'malicia'; D.boca = t > 31.4 ? 'dentes' : 'sorrisoMal'; D.olhar = [0.8, 0]; D.draw(c, t);
          const [dx, dy] = D.mao(1); chama(c, dx - 20, dy - 20, 0.7, t, 1);
          // o livro de Kael é tirado da mão dele e flutua
          K.reset(); K.x = 400; K.y = 1660; K.s = 1.05; K.maoE = pulseiraPreta();
          const rouba = sstep(29.4, 30.2, t);
          K.bracoD = { a: lerp(0.9, lerp(0.2, 2.2, win(t, 30.4, 30.8, 31.2, 31.8)), rouba), b: lerp(1.3, 0.2, rouba) };
          K.exp = t < 29.4 ? 'normal' : (t < 33.5 ? 'preocupado' : 'triste'); K.boca = t < 33.5 ? 'reta' : 'tremendo'; K.olhar = t < 33.5 ? [0.6, -0.5] : [0, 0.7];
          if (t > 33.5) { K.headTilt = 0.12; K.exp = 'preocupado'; }
          K.draw(c, t);
          const [kx, ky] = K.mao(1);
          const lx = lerp(kx - 40, 800, rouba), ly = lerp(ky - 20, 1080 + Math.sin(t * 2) * 20, rouba);
          if (t < 31.2) { livroFlutuante(c, lx, ly, t); if (rouba > 0) auraTele(c, lx, ly, 60, t, rouba); }
          else { const q = clamp((t - 31.2) / 0.5); livroFlutuante(c, lerp(800, 560, q), lerp(1080, 1640, q * q), t * 0.2); }
          // lágrima
          if (t > 34.6) { const [hx, hy] = K.cabeca(); const u = ((t - 34.6) * 0.6) % 1; circle(c, hx + 26 * K.s, hy + 12 * K.s + u * 50, 8, '#8ad8ff', { lw: 3, alpha: 1 - u }); }
        });
      },
    };
  },
};

// ---------- 5. O teste ----------
export const c5 = {
  nome: 'O teste', inicio: 37, fim: 48,
  criar(st) {
    const K = kael('jovem'), E = examinadora(), A = [draven(), mira(), lyra(), tomi()];
    const TOCA = 42.0;
    return {
      desenhar(t) {
        let cam;
        if (t < 40) cam = [540, lerp(1050, 1200, (t - 37) / 3), lerp(0.85, 1.0, (t - 37) / 3)];
        else if (t < 42.6) cam = [600, 1220, lerp(1.2, 1.5, (t - 40) / 2.6)];
        else if (t < 44.2) { cam = [640, 1180, 2.2]; }
        else if (t < 46.2) cam = [540, 1260, 1.0];
        else { const [hx, hy] = K.cabeca(); cam = [hx, hy + 110, 2.2]; }
        st.setCam(cam[0], cam[1], cam[2]);
        salaoTeste(st, t);
        st.mundo(c => {
          // plateia na arquibancada
          A.forEach((a, i) => { a.reset(); a.x = [80, 260, 820, 1000][i]; a.y = 1440; a.s = 0.75; a.semPernas = true; const ri = sstep(44.3, 44.6, t); a.exp = ri > 0.5 ? 'feliz' : 'normal'; a.boca = ri > 0.5 ? 'aberta' : 'reta'; a.olhar = [i < 2 ? 0.8 : -0.8, 0]; a.jump = ri * Math.abs(Math.sin(t * 10 + i)) * 10; a.draw(c, t); risada(c, a.x, 1440 - 320, t, ri, i); });
          cristal(c, 640, 1560, 0.9, t, { brilho: 0.35 });
          E.reset(); E.x = 900; E.y = 1660; E.s = 1.0; E.flip = -1; E.olhar = [0.8, 0]; E.exp = t > 44 ? 'preocupado' : 'normal'; E.boca = 'reta'; E.draw(c, t);
          K.reset(); K.s = 1.05; K.y = 1680; K.x = lerp(260, 470, clamp((t - 38.6) / 2.4)); if (t > 38.6 && t < 41) K.walk = t * 5; K.maoE = pulseiraPreta();
          K.bracoD = { a: lerp(0.2, 1.35, sstep(41.3, TOCA, t)), b: lerp(0.1, -0.05, sstep(41.3, TOCA, t)) };
          K.exp = t < TOCA ? 'determinado' : (t < 44.3 ? 'preocupado' : 'triste'); K.boca = 'reta'; K.olhar = [0.7, -0.3];
          if (t > 45.4) { K.olhar = [0, 0.7]; K.exp = 'preocupado'; K.boca = 'triste'; K.headTilt = 0.1; }
          K.draw(c, t);
          if (t > TOCA && t < 44.2) { const [hx, hy] = K.mao(1); glow(c, hx, hy, 60, '#cfe8ff', 0.3); }
        });
      },
    };
  },
};

// ---------- 6. O despertar misterioso ----------
export const c6 = {
  nome: 'O despertar misterioso', inicio: 48, fim: 60.4,
  criar(st) {
    const K = kael('jovem'), E = examinadora(), A = [draven(), mira(), lyra(), tomi()];
    const RACHA = 48.0, APAGAO = 49.6, JOELHOS = 50.4, VOZ = 54.0;
    return {
      desenhar(t) {
        const apagao = sstep(APAGAO, APAGAO + 0.15, t) * (1 - sstep(56.8, 57.6, t) * 0.4);
        const racha = clamp((t - RACHA) / 1.8);
        let cam;
        if (t < 49.6) cam = [640, 1180, lerp(1.6, 2.0, (t - 48) / 1.6)];
        else if (t < 53.5) cam = [560, 1260, lerp(1.0, 1.2, (t - 49.6) / 3.9)];
        else if (t < 57.6) { const [hx, hy] = K.cabeca(); cam = [hx, hy + 40, lerp(2.2, 3.4, easeIn((t - 53.5) / 4.1))]; }
        else cam = [560, 1250, lerp(0.95, 0.85, (t - 57.6) / 2.8)];
        st.setCam(cam[0], cam[1], cam[2], 0, shake(t, win(t, RACHA, RACHA + 0.3, 49.4, 49.7) * 0.5 + impulse(t, APAGAO, 1.6)));
        salaoTeste(st, t, { apagao });
        st.mundo(c => {
          A.forEach((a, i) => { a.reset(); a.x = [80, 260, 820, 1000][i]; a.y = 1440; a.s = 0.75; a.semPernas = true; a.exp = t > APAGAO ? 'medo' : 'choque'; a.boca = 'o'; a.olhar = [i < 2 ? 0.8 : -0.8, 0]; c.save(); c.globalAlpha = 1 - apagao * 0.75; a.draw(c, t); c.restore(); });
          // a chama de Draven se apaga no apagão
          if (t < APAGAO) chama(c, 120 + 20, 1300, 0.4, t, 2);
          cristal(c, 640, 1560, 0.9, t, { brilho: t < APAGAO ? 0.35 + racha * 0.4 : 0.05, racha, cor: t < APAGAO ? '#8af0ff' : '#5a3aa8' });
          E.reset(); E.x = 900; E.y = 1660; E.s = 1.0; E.flip = -1; E.olhar = [0.8, 0]; E.exp = 'medo'; E.boca = 'o'; c.save(); c.globalAlpha = 1 - apagao * 0.7; E.draw(c, t); c.restore();
          // Kael cai de joelhos
          K.reset(); K.s = 1.05; K.x = 470; K.y = 1680; K.maoE = pulseiraPreta(sstep(VOZ, VOZ + 1, t) * 0.8);
          const joelho = sstep(JOELHOS, JOELHOS + 0.4, t);
          K.squash = joelho * 0.2; K.y += joelho * 30; K.bracoD = { a: lerp(1.35, 0.5, joelho), b: lerp(-0.05, 1.4, joelho) }; K.bracoE = { a: lerp(0.2, 0.5, joelho), b: lerp(0.1, 1.4, joelho) };
          K.exp = t < VOZ ? 'choque' : 'medo'; K.boca = t < VOZ ? 'o' : 'tremendo'; K.olhar = t < VOZ ? [0.5, -0.4] : [0, 0]; K.suor = sstep(51, 51.5, t); K.tremor = sstep(52, 53, t) * 0.4;
          K.draw(c, t);
          // um leve vazio escuro ao redor de Kael (mistério, sem revelar o poder)
          if (t > 51) { const k = sstep(51, 53, t) * (1 - sstep(58.5, 60, t) * 0.5); c.save(); c.globalAlpha = 0.5 * k; c.strokeStyle = '#b08aff'; c.lineWidth = 4; for (let i = 0; i < 3; i++) { c.beginPath(); c.ellipse(470, 1500, 160 + i * 40 + Math.sin(t * 2 + i) * 10, 40 + i * 10, 0, t * (i % 2 ? 1 : -1), t * (i % 2 ? 1 : -1) + 4); c.stroke(); } c.restore(); const [hx, hy] = K.cabeca(); for (const s of [-1, 1]) glow(c, hx + s * 26 * K.s, hy - 4 * K.s, 30, '#d8c8ff', win(t, 55.6, 55.8, 56.0, 56.3)); }
          // partículas de poder sendo puxadas para o escuro
          if (t > APAGAO) { const r = rng(4); for (let i = 0; i < 14; i++) { const u = ((t - APAGAO) * 0.5 + r()) % 1; const x0 = r() * 1080, y0 = 800 + r() * 800; sparkle(c, lerp(x0, 470, u), lerp(y0, 1450, u), 10, ['#ff8a2a', '#3ab0f0', '#fff060', '#b06aff'][i % 4], (1 - u) * 0.8 * (1 - sstep(57, 58, t))); } }
        });
        // a voz misteriosa
        if (t > VOZ && t < 57.4) st.text('"Finalmente... encontrei você."', 540, 420, { size: 62, fill: '#e6dcff', alpha: win(t, VOZ, VOZ + 0.4, 56.8, 57.4), glow: 'rgba(150,110,255,0.9)', weight: 700, lw: 10 });
      },
    };
  },
};
