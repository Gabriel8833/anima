// "Paralisia do sono" — curta de terror psicológico 2D
import { TAU, lerp, clamp, sstep, win, kf, easeInOut, easeIn, easeOut, rng, noise1 } from '../../../motor/base.js';
import { glow, circle, line, rrect, ellipse, shape, poly, limb } from '../../../motor/desenho.js';
import { italo, sombraRosto } from '../../../personagens/elenco.js';
import { Q, quarto, cama, cobertor, luar, nevoa, entidade, nervos, cerebroLinhas, silhueta } from '../../../cenarios/lugares.js';

const W = 1080, H = 1920;
const tempos = await (await fetch(new URL('../tempos.json', import.meta.url))).json();
const S = id => { const f = tempos.narracao.find(n => n.id === id); return [f.inicio, f.fim]; };
const ini = id => S(id)[0] - 0.3;
const B = [0, ini('2a'), ini('3a'), ini('4a'), ini('5a'), ini('6a'), ini('7a'), tempos.duracao];
const PIV = [520, 1425];                       // quadril deitado
const CAB = [PIV[0] - 157, PIV[1]];            // cabeça (deitado)
const ROT = Math.PI / 2;                       // câmera girada: rosto deitado aparece de pé

function deitado(c, P, t, a = -Math.PI / 2, px = PIV[0], py = PIV[1]) { c.save(); c.translate(px, py); c.rotate(a); c.translate(0, 126); P.x = 0; P.y = 0; P.draw(c, t); c.restore(); }
function baseItalo(P, t, resp = 0) { P.reset(); P.semPernas = true; P.ik(-1, -40, -130); P.ik(1, 40, -130); P.squash = Math.sin(t * (1.6 + resp * 4)) * (0.008 + resp * 0.02); return P; }
// braço por cima do cobertor: mão com dedos que tentam se mexer
function bracoFora(c, t, tenta = 0, mexe = 0, ergue = 0) {
  const hx = 690, hy = 1392 - ergue * 60, tr = tenta ? Math.sin(t * 40) * 1.5 * tenta : 0;
  limb(c, [[540, 1405], [610, 1398 - ergue * 20], [hx + tr, hy]], 26, '#121318', { outline: '#05060a', lw: 4 });
  circle(c, hx + 18 + tr, hy, 16, '#d8c2b4', { stroke: '#05060a', lw: 4 });
  for (let k = 0; k < 4; k++) {
    const tw = tenta ? Math.max(0, noise1(t * 9 + k * 3)) * 6 * tenta : 0, mv = mexe ? Math.sin(t * 5 + k * 0.9) * 8 * mexe : 0;
    ellipse(c, hx + 40 + tr, hy - 14 + k * 9 - tw - mv, 13, 4.5, '#d8c2b4', { stroke: '#05060a', lw: 3 }, -0.1 - (tw + mv) * 0.03);
  }
}
const resp = (t, a, b) => win(t, a, a + 0.6, b - 0.6, b);

// ================= 1. A FIGURA NO QUARTO =================
export const c1 = {
  inicio: B[0], fim: B[1],
  criar(st) {
    const P = sombraRosto(italo());
    return {
      desenhar(t) {
        const abre = t > 4.4, pov = t > 5.5;
        let cam;
        if (t < 3.6) cam = [lerp(820, 640, easeInOut(t / 3.6)), lerp(1560, 1470, easeInOut(t / 3.6)), lerp(1.05, 1.5, easeInOut(t / 3.6)), 0];
        else if (!pov) { const u = easeInOut(clamp((t - 3.6) / 1.6)); cam = [lerp(640, CAB[0], u), lerp(1470, CAB[1], u), lerp(1.5, 3.6, u), lerp(0, ROT, u)]; }
        else { const u = clamp((t - 5.5) / (B[1] - 5.5)); cam = [lerp(Q.fig - 60, Q.fig - 20, u), lerp(1260, 1200, u), lerp(1.5, 1.9, u), 0]; }
        st.setCam(cam[0], cam[1], cam[2], cam[3]);
        quarto(st, t);
        st.mundo(c => {
          entidade(c, Q.fig, Q.chao, t, { alpha: pov ? lerp(0.35, 0.6, clamp((t - 5.5) / 2)) : 0.25 });
          cama(c, t);
          baseItalo(P, t, abre ? 0.6 : 0);
          P.exp = abre ? 'normal' : 'fechado'; P.boca = 'reta';
          if (abre) { P.olhoTam = 0.9; P.pupila = 0.7; const v = (t - 4.4); P.olhar = [Math.sin(v * 1.3) * 0.8, Math.cos(v * 0.9) * 0.3]; P.sob = [-6, -6]; }
          deitado(c, P, t);
          cobertor(c, t, 470, abre ? 0.6 : 0);
          luar(c, 1); nevoa(c, t);
        });
      },
    };
  },
};

// ================= 2. O CORPO NÃO RESPONDE =================
export const c2 = {
  inicio: B[1], fim: B[2],
  criar(st) {
    const P = sombraRosto(italo());
    return {
      desenhar(t) {
        const [a0, a1] = S('2a');
        const fase = t < a0 + 2.2 ? 'braco' : 'rosto';
        let cam;
        if (fase === 'braco') cam = [lerp(600, 650, (t - B[1]) / 2.5), 1400, 3.0, 0];
        else { const u = clamp((t - a0 - 2.2) / (B[2] - a0 - 2.2)); cam = [CAB[0] + 4, CAB[1], lerp(3.6, 6.5, easeIn(u)), ROT]; }
        st.setCam(...cam);
        quarto(st, t);
        st.mundo(c => {
          entidade(c, Q.fig, Q.chao, t, { alpha: 0.5 });
          cama(c, t);
          baseItalo(P, t, 1);
          P.exp = 'medo'; P.olhoTam = 0.95; P.pupila = 0.5; P.olhar = [0.4 + noise1(t * 3) * 0.2, 0.2]; P.boca = 'reta';
          if (fase === 'rosto') { const g = sstep(a0 + 2.4, a0 + 3.0, t); P.boca = g > 0.5 ? 'grito' : 'o'; P.sob = [-10 - g * 6, -10 - g * 6]; P.tremor = 0.25; P.suor = 1; }
          deitado(c, P, t);
          cobertor(c, t, 470, 1);
          bracoFora(c, t, fase === 'braco' ? 1 : 0.4);
          // gota de suor escorrendo pela lateral do rosto
          if (fase === 'rosto') { const u = ((t - a0 - 2.2) * 0.35) % 1; ellipse(c, CAB[0] - 40 + u * 60, CAB[1] - 62, 6, 9, 'rgba(200,220,255,0.8)', { stroke: '#05060a', lw: 2 }, Math.PI / 2); }
          luar(c, 1); nevoa(c, t);
        });
        // escurece entrando no olho
        st.overlay('#000', sstep(B[2] - 0.6, B[2], t));
      },
    };
  },
};

// ================= 3. PRESO DENTRO DO PRÓPRIO CORPO =================
export const c3 = {
  inicio: B[2], fim: B[3],
  criar(st) {
    return {
      desenhar(t) {
        const c = st.c;
        const [a0, a1] = S('3a'), [b0, b1] = S('3b');
        const u = clamp((t - B[2]) / (B[3] - B[2]));
        st.setCam(540, lerp(820, 1000, easeInOut(u)), lerp(1.6, 1.0, easeOut(u)));
        st.mundo(cc => {
          nervos(cc, t);
          cerebroLinhas(cc, 540, 620, 1.2, t);
          // sinais motores descendo pela medula e parando no bloqueio
          const bx = 540, by0 = 760, byB = 930;
          line(cc, [[bx, by0], [bx, 1180]], 'rgba(120,170,240,0.4)', 6);
          for (let k = 0; k < 4; k++) { const q = ((t * 0.7 + k / 4) % 1), y = lerp(by0, byB, q); glow(cc, bx, y, 40, '#9ad0ff', 1 - q * 0.6); }
          const pul = 0.5 + 0.5 * Math.sin(t * 3);
          for (let r = 0; r < 2; r++) circle(cc, bx, byB, 34 + r * 16 + pul * 6, null, { stroke: `rgba(140,20,30,${0.7 - r * 0.3})`, lw: 6 });
          glow(cc, bx, byB, 90, '#7a1018', 0.5 * pul);
          silhueta(cc, 540, 1820, 0.95, { musculos: 0.08 });
          // consciência acesa (olhos da silhueta) x músculos inibidos
          for (const s of [-1, 1]) glow(cc, 540 + s * 22, 1820 - 565 * 0.95, 26, '#cfe4ff', 0.6 + 0.3 * Math.sin(t * 4));
        });
        // título discreto
        const ta = sstep(b0 + 0.2, b0 + 1.0, t);
        if (ta > 0) { c.save(); c.globalAlpha = ta * 0.9; c.font = 'italic 400 76px Georgia, "Times New Roman", serif'; c.textAlign = 'center'; c.letterSpacing = '10px'; c.fillStyle = '#c8d4ea'; c.shadowColor = 'rgba(122,180,255,0.6)'; c.shadowBlur = 24; c.fillText('PARALISIA DO SONO', W / 2, 360); c.restore(); }
        st.overlay('#000', 1 - sstep(B[2], B[2] + 0.8, t));
      },
    };
  },
};

// ================= 4. O QUE ACONTECE NO SONO REM? =================
export const c4 = {
  inicio: B[3], fim: B[4],
  criar(st) {
    const P = sombraRosto(italo());
    return {
      desenhar(t) {
        const [a0, a1] = S('4a'), [b0, b1] = S('4b');
        const acorda = t > b0 + 1.2;
        let cam = [600, 1380, lerp(1.6, 1.85, sstep(a0, a1, t)), 0];
        if (t > b0 + 0.8) { const u = easeInOut(clamp((t - b0 - 0.8) / 1.4)); cam = [lerp(600, CAB[0], u), lerp(1380, CAB[1], u), lerp(1.85, 3.4, u), lerp(0, ROT, u)]; }
        st.setCam(...cam);
        quarto(st, t);
        const ov = sstep(a0 + 1.6, a0 + 2.6, t);
        st.mundo(c => {
          cama(c, t);
          baseItalo(P, t, acorda ? 0.7 : 0);
          P.exp = acorda ? 'medo' : 'fechado'; P.boca = 'reta';
          if (!acorda) P.rostoX = noise1(t * 6) * 3;  // olhos se mexendo sob as pálpebras (REM)
          else { P.olhar = [0.6, 0]; P.pupila = 0.6; }
          deitado(c, P, t);
          cobertor(c, t, 470, acorda ? 0.7 : 0);
          luar(c, 1);
          // corpo transparente: comandos do cérebro não chegam aos músculos
          if (ov > 0) {
            c.save(); c.globalAlpha = ov;
            const hx = CAB[0], hy = CAB[1];
            glow(c, hx, hy, 120, acorda ? '#cfe4ff' : '#5a8ae0', acorda ? 0.9 : 0.5);
            const bar = hx + 110;
            line(c, [[hx + 40, hy], [Q.pe - 40, hy + 10]], 'rgba(120,170,240,0.35)', 6);
            for (const [ex, ey] of [[700, 1330], [720, 1470], [880, 1360], [880, 1470]]) line(c, [[bar + 60, hy + 4], [ex, ey]], 'rgba(60,90,140,0.35)', 4);
            for (let k = 0; k < 3; k++) { const q = ((t * 0.8 + k / 3) % 1); glow(c, lerp(hx + 40, bar, q), hy, 34, '#9ad0ff', 1 - q * 0.5); }
            const pul = 0.5 + 0.5 * Math.sin(t * 3);
            circle(c, bar, hy, 30 + pul * 5, null, { stroke: 'rgba(140,20,30,0.75)', lw: 6 }); glow(c, bar, hy, 70, '#7a1018', 0.5 * pul);
            c.restore();
          }
        });
      },
    };
  },
};

// ================= 5. O PESADELO ACORDA COM VOCÊ =================
export const c5 = {
  inicio: B[4], fim: B[5],
  criar(st) {
    const P = sombraRosto(italo());
    return {
      desenhar(t) {
        const [a0, a1] = S('5a'), [b0, b1] = S('5b');
        const T_ANDA = b0 + 3.0, T_PARA = b0 + 5.9, T_INC = T_PARA, T_CLOSE = T_PARA + 1.2, T_DIST = T_PARA + 2.1;
        const anda = easeInOut(clamp((t - T_ANDA) / (T_PARA - T_ANDA)));
        const fx = lerp(Q.fig, 720, anda);
        let cam;
        if (t < b0) cam = [lerp(Q.fig - 40, Q.fig - 20, (t - B[4]) / 3), 1240, lerp(1.4, 1.7, (t - B[4]) / 3), 0];
        else if (t < T_CLOSE) cam = [lerp(820, 640, easeInOut(clamp((t - b0) / 6))), 1300, lerp(1.0, 1.25, clamp((t - b0) / 6)), 0];
        else if (t < T_DIST) cam = [CAB[0] + 4, CAB[1], 4.2, ROT];
        else cam = [fx, 1020, 2.4, 0.03];
        st.setCam(...cam);
        quarto(st, t, { porta: 0.18 + 0.1 * sstep(b0 + 1.6, b0 + 2.6, t) });
        st.mundo(c => {
          // presença: sombras ficam mais densas
          const pres = sstep(b0 + 0.6, b0 + 1.6, t);
          if (pres > 0) { c.save(); c.globalAlpha = 0.3 * pres; const g = c.createRadialGradient(Q.fig, 1300, 50, Q.fig, 1300, 700); g.addColorStop(0, '#000000'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(Q.fig - 800, 500, 1600, 1300); c.restore(); }
          // ruídos: a porta range (ondas discretas)
          if (t > b0 + 1.6 && t < b0 + 2.8) for (let k = 0; k < 3; k++) { const u = ((t - b0 - 1.6) * 1.2 + k / 3) % 1; c.save(); c.globalAlpha = (1 - u) * 0.25; circle(c, Q.porta - 120, 1100, 40 + u * 200, null, { stroke: '#8aa0d0', lw: 3 }); c.restore(); }
          entidade(c, fx, Q.chao, t, { alpha: 0.85, passo: anda > 0 && anda < 1 ? t * 1.7 : 0, inclina: lerp(0, 1.15, easeInOut(clamp((t - T_INC) / 1.2))), distorce: sstep(T_DIST, T_DIST + 0.4, t), braco: 0.2 });
          cama(c, t);
          baseItalo(P, t, 1);
          P.exp = 'medo'; P.pupila = 0.45; P.olhoTam = 0.95; P.boca = 'o'; P.suor = 1;
          P.olhar = [clamp(lerp(1, -0.2, anda), -1, 1), -0.3 + anda * 0.3];
          deitado(c, P, t);
          cobertor(c, t, 470, 1);
          luar(c, 0.8); nevoa(c, t, 1.5);
        });
      },
    };
  },
};

// ================= 6. O DESPERTAR =================
export const c6 = {
  inicio: B[5], fim: B[6],
  criar(st) {
    const P = sombraRosto(italo());
    return {
      desenhar(t) {
        const [a0, a1] = S('6a'), [b0, b1] = S('6b');
        const T_VIRA = b0 + 1.3, T_VAZIO = b0 + 2.3;
        let cam;
        if (t < b0) cam = [650, 1400, 3.0, 0];
        else if (t < T_VIRA + 0.6) cam = [CAB[0] + 60, CAB[1], 2.8, ROT];
        else if (t < b1 - 0.5) { const u = easeInOut(clamp((t - T_VIRA - 0.6) / 1.2)); cam = [lerp(820, Q.fig - 40, u), 1260, lerp(1.2, 1.6, u), 0]; }
        else cam = [CAB[0] + 4, CAB[1], 3.8, ROT];
        st.setCam(...cam);
        const luz = sstep(b0, B[6], t) * 0.4;
        quarto(st, t, { luz });
        st.mundo(c => {
          cama(c, t);
          baseItalo(P, t, 0.8);
          P.exp = 'medo'; P.pupila = 0.6; P.boca = 'reta'; P.suor = 1; P.olhar = [0.3, 0];
          if (t > T_VIRA) { const k = easeInOut(clamp((t - T_VIRA) / 0.8)); P.headTilt = 0.35 * k; P.olhar = [1, 0]; }
          if (t > b1 - 0.5) { P.exp = 'preocupado'; P.olhar = [0.9, -0.2]; P.pupila = 0.75; P.boca = 'o'; }
          deitado(c, P, t);
          cobertor(c, t, 470, 0.8);
          bracoFora(c, t, 0, sstep(a0, a0 + 1.0, t), sstep(b0, b0 + 1.0, t) * 0.8);
          luar(c, 1 + luz); nevoa(c, t, 0.6);
        });
      },
    };
  },
};

// ================= 7. O ÚLTIMO SEGUNDO =================
export const c7 = {
  inicio: B[6], fim: B[7],
  criar(st) {
    const P = sombraRosto(italo());
    return {
      desenhar(t) {
        const [a0, a1] = S('7a'), [b0, b1] = S('7b');
        const senta = easeInOut(clamp((t - B[6] - 0.2) / 1.4));
        let cam;
        if (t < b0 + 0.6) cam = [lerp(560, 640, senta), lerp(1360, 1300, senta), lerp(2.0, 1.6, senta), 0];
        else if (t < b1 - 0.4) { const u = easeInOut(clamp((t - b0 - 0.6) / 2.4)); cam = [lerp(640, 800, u), lerp(1300, 1250, u), lerp(1.6, 0.85, u), 0]; }
        else { const u = easeInOut(clamp((t - (b1 - 0.4)) / (B[7] - b1))); cam = [lerp(800, Q.porta, u), lerp(1250, 1250, u), lerp(0.85, 2.0, u), 0]; }
        st.setCam(...cam);
        quarto(st, t, { luz: 0.4 });
        st.mundo(c => {
          // sombra que parece atravessar a parede, junto à porta (por uma fração de segundo)
          const sx = lerp(Q.porta - 300, Q.porta + 260, clamp((t - (B[7] - 1.5)) / 0.35));
          if (t > B[7] - 1.5 && t < B[7] - 1.15) { c.save(); c.globalAlpha = 0.5; c.fillStyle = '#000000'; c.beginPath(); c.ellipse(sx, 1180, 70, 330, 0.1, 0, TAU); c.fill(); c.restore(); }
          cama(c, t);
          baseItalo(P, t, 1);
          P.exp = 'preocupado'; P.boca = Math.floor(t * 3) % 2 ? 'o' : 'meia'; P.olhar = [0.5, 0.3]; P.suor = 1; P.squash = Math.sin(t * 5) * 0.03;
          P.ik(-1, -60, -150); P.ik(1, 60, -150);
          deitado(c, P, t, -Math.PI / 2 * (1 - senta), lerp(PIV[0], 560, senta), lerp(PIV[1], Q.colchao, senta));
          cobertor(c, t, lerp(470, 520, senta), 1);
          luar(c, 1.3); nevoa(c, t, 0.6);
        });
        if (t > B[7] - 0.55) st.overlay('#000', 1);
      },
    };
  },
};
