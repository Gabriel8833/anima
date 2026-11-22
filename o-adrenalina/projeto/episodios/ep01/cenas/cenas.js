// "Como controlar sua adrenalina em uma situação de perigo" — 8 cenas, seis reações (não são tipos fixos)
import { TAU, lerp, clamp, sstep, win, easeInOut, easeOut, easeBack, rng, mix, shake, impulse } from '../../../motor/base.js';
import { glow, rrect, line, circle, ellipse, poly, vgrad, shape, sparkle, cloud } from '../../../motor/desenho.js';
import { tipoChora, tipoPerdido, tipoAgressivo, tipoParalisada, tipoImpulsivo, tipoCalma, passante, celular, lagrima } from '../../../personagens/elenco.js';
import { cidadeBR, carro, fumacaCinza, cacos, cartaoDica, cartaoTipo, balaoFala, bairro } from '../../../cenarios/lugares.js';

const W = 1080, H = 1920;
const piscada = (t, f = 3.6, o = 0) => (((t + o) % f) < 0.14 ? 1 : 0);
const BATIDA = 3.4; // momento da batida
// cenário da emergência: rua com os dois carros batidos e fumaça
function emergencia(st, t, { cam = [540, 1270, 1.2], calmo = 0 } = {}) {
  st.setCam(cam[0], cam[1], cam[2], 0, cam[3] || [0, 0]);
  cidadeBR(st, t, { hora: 0.95, morro: 1 });
  st.camada(0.8, c => {
    carro(c, 900, 1500, 0.8, { cor: '#3a6ad0', amassado: 1 }); carro(c, 1290, 1500, 0.8, { cor: '#e8c040', flip: -1, amassado: 1 });
    fumacaCinza(c, 1090, 1380, t, 1 - calmo * 0.4);
    for (const x of [600, 1500]) { poly(c, [[x - 30, 1500], [x, 1420], [x + 30, 1500]], '#f07a2a', { lw: 4 }); rrect(c, x - 26, 1462, 52, 10, 2, '#ffffff', { stroke: null }); }
  });
}
// sinais da adrenalina no corpo
function sinais(P, t, k = 1) { P.tremor = 0.25 * k; P.suor = k; P.squash = Math.sin(t * 14) * 0.015 * k; }
function coracao(c, x, y, t, a = 1, bpm = 140) { if (a <= 0.01) return; const b = Math.pow(Math.max(0, Math.sin(t * bpm / 60 * Math.PI)), 8); c.save(); c.globalAlpha *= a; c.translate(x, y); c.scale(1 + b * 0.25, 1 + b * 0.25); shape(c, c => { c.moveTo(0, 26); c.bezierCurveTo(-56, -12, -30, -64, 0, -32); c.bezierCurveTo(30, -64, 56, -12, 0, 26); }, '#e83a4a', { lw: 5 }); c.restore(); }
// guia de respiração: inspira 4 s, solta 6 s
function guiaRespiracao(c, x, y, t, t0, a = 1) {
  if (a <= 0.01) return; const ciclo = (t - t0) % 10, ins = ciclo < 4, u = ins ? ciclo / 4 : 1 - (ciclo - 4) / 6, r = 70 + easeInOut(u) * 90;
  c.save(); c.globalAlpha *= a; circle(c, x, y, 170, 'rgba(10,20,20,0.55)', { stroke: 'rgba(255,255,255,0.6)', lw: 5 }); circle(c, x, y, r, 'rgba(90,200,180,0.75)', { stroke: '#bff4ea', lw: 7 });
  c.font = '900 40px Inter'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineWidth = 8; c.strokeStyle = '#0a1414'; const tx = ins ? 'PUXA (4s)' : 'SOLTA DEVAGAR (6s)'; c.strokeText(tx, x, y); c.fillStyle = '#ffffff'; c.fillText(tx, x, y); c.restore();
}

// ---------- 1. O perigo ----------
export const c1 = {
  nome: 'O perigo', inicio: 0, fim: 13.6,
  criar(st) {
    const G = [tipoChora(), tipoPerdido(), tipoAgressivo(), tipoParalisada(), tipoImpulsivo(), tipoCalma()];
    const P = [passante(110), passante(111), passante(112)];
    return {
      desenhar(t) {
        if (t < 3.9) {
          // rua normal... e a batida
          const sh = shake(t, impulse(t, BATIDA, 1.2));
          st.setCam(560, 1260, lerp(1.0, 1.1, t / 3.9), 0, sh);
          cidadeBR(st, t, { hora: 0.95 });
          st.mundo(c => {
            const pessoas = [...G.slice(0, 4), ...P];
            pessoas.forEach((p, i) => { p.reset(); p.x = ((i * 260 + t * (i % 2 ? -90 : 110)) % 1600 + 1600) % 1600 - 260; p.y = 1600 + (i % 3) * 30; p.s = 0.85; p.flip = i % 2 ? -1 : 1; p.walk = t * 5 + i; p.exp = t > BATIDA ? 'choque' : 'normal'; p.boca = t > BATIDA ? 'grito' : 'reta'; p.olhar = t > BATIDA ? [0.8 * (p.x < 640 ? 1 : -1), 0] : [p.flip * 0.6, 0]; if (t > BATIDA) { p.walk = null; p.bracos(2.2, 0.4, 2.2, 0.4); } p.draw(c, t); });
            const k = clamp(t / BATIDA);
            carro(c, lerp(-400, 470, easeIn2(k)), 1800, 0.9, { cor: '#3a6ad0', amassado: t > BATIDA ? 1 : 0 });
            carro(c, lerp(1500, 830, easeIn2(k)), 1800, 0.9, { cor: '#e8c040', flip: -1, amassado: t > BATIDA ? 1 : 0 });
            if (t > BATIDA) { glow(c, 650, 1700, 500, '#ffffff', Math.max(0, 1 - (t - BATIDA) / 0.3)); cacos(c, 650, 1660, t - BATIDA); fumacaCinza(c, 650, 1660, t, sstep(BATIDA, BATIDA + 0.4, t)); }
          });
          return;
        }
        if (t < 7.5) {
          // cortes rápidos: cada um reage de um jeito
          const i = Math.min(5, Math.floor((t - 3.9) / 0.6)), P2 = G[i];
          P2.reset(); P2.x = 540; P2.y = 1700;
          const reac = [['medo', 'tremendo'], ['choque', 'o'], ['raiva', 'grito'], ['choque', 'reta'], ['determinado', 'aberta'], ['preocupado', 'reta']][i];
          P2.exp = reac[0]; P2.boca = reac[1]; P2.olhar = [0.9, 0]; sinais(P2, t, 0.8); P2.bracos([1.9, 0.6, 1.0, 0.1, 0.9, 0.3][i], [2.4, 0.3, 0.2, 0.1, 0.2, 0.3][i]);
          const [hx, hy] = P2.cabeca();
          emergencia(st, t, { cam: [hx + 40, hy + 120, 2.2, shake(t, 0.15)] });
          st.mundo(c => { P2.draw(c, t); if (i === 0) lagrima(c, P2, t, 1, 1); });
          return;
        }
        // o corpo libera adrenalina: coração, mãos, mente
        const V = G[5]; V.reset(); V.x = 540; V.y = 1700; V.exp = 'medo'; V.boca = 'tremendo'; V.olhar = [0.8, 0]; sinais(V, t, 1); V.bracos(0.6, 1.4, 0.6, 1.4);
        const [hx, hy] = V.cabeca();
        emergencia(st, t, { cam: [hx + 20, lerp(hy + 260, hy + 160, (t - 7.5) / 6), lerp(1.5, 1.8, (t - 7.5) / 6)] });
        st.mundo(c => {
          V.draw(c, t);
          coracao(c, V.x - 4, V.y - 190, t, sstep(7.6, 7.9, t), 150);
          const [lx, ly] = V.mao(-1), [rx, ry] = V.mao(1); for (const [x, y] of [[lx, ly], [rx, ry]]) for (let i = 0; i < 3; i++) line(c, [[x - 34 - i * 8, y - 10 + i * 10], [x - 46 - i * 8, y - 10 + i * 10]], '#ffffff', 4, sstep(8.6, 8.9, t) * Math.abs(Math.sin(t * 30 + i)));
          for (let i = 0; i < 8; i++) { const a = t * 3 + i * 0.8; c.save(); c.globalAlpha = sstep(9.2, 9.6, t) * 0.8; c.font = '900 40px Inter'; c.fillStyle = ['#ffd23a', '#ff6a5a', '#ffffff'][i % 3]; c.fillText(['?', '!', '@', '#', '?', '!', '%', '?'][i], hx + Math.cos(a) * 120, hy - 60 + Math.sin(a) * 70); c.restore(); }
        });
      },
    };
  },
};
const easeIn2 = u => u * u;

// ---------- 2. Vontade de chorar ----------
export const c2 = {
  nome: 'Vontade de chorar', inicio: 13.6, fim: 30.3,
  criar(st) {
    const J = tipoChora();
    const DICA = 20.8;
    return {
      desenhar(t) {
        J.reset(); J.piscar = piscada(t, 2.6);
        if (t < DICA) {
          J.x = 480; J.y = 1700; J.exp = 'medo'; J.boca = 'tremendo'; J.olhar = [0.8, 0.2]; sinais(J, t, 1); J.bracos(2.0, 2.5, 2.0, 2.5); J.headTilt = 0.08;
          const [hx, hy] = J.cabeca();
          emergencia(st, t, { cam: [hx + 60, hy + 200, lerp(1.5, 1.9, (t - 13.6) / 7.2)] });
          st.mundo(c => { J.draw(c, t); lagrima(c, J, t, 1, 1); lagrima(c, J, t + 0.4, 1, -1); });
          st.camada(0, c => { cartaoTipo(c, 1, 'VONTADE DE CHORAR', t, 13.8); });
          if (t > 16.6) st.camada(0, c => { const a = win(t, 16.6, 17.0, 20.2, 20.7); c.save(); c.globalAlpha = a; rrect(c, 70, 220, 940, 150, 24, 'rgba(255,255,255,0.92)', { lw: 4 }); c.font = '800 34px Inter'; c.textAlign = 'center'; c.fillStyle = '#2b1f2a'; c.fillText('⚠️ Não são tipos fixos de pessoa:', 540, 280); c.fillText('qualquer um pode reagir assim um dia.', 540, 330); c.restore(); });
          return;
        }
        // o que fazer: respiração com expiração longa, lugar seguro, uma tarefa
        const anda = clamp((t - 25.0) / 2.0);
        J.x = lerp(480, 240, easeInOut(anda)); J.y = 1700; if (anda > 0 && anda < 1) J.walk = t * 4.5; J.flip = anda > 0 && anda < 1 ? -1 : 1;
        const calma = sstep(DICA, 26, t); J.exp = calma > 0.6 ? 'normal' : 'preocupado'; J.boca = 'reta'; J.olhar = [0.2, -0.2]; sinais(J, t, 1 - calma);
        const resp = ((t - DICA) % 10) < 4 ? easeInOut(((t - DICA) % 10) / 4) : 1 - easeInOut((((t - DICA) % 10) - 4) / 6); J.squash = -resp * 0.03; J.bracos(0.4 + resp * 0.2, 2.2, 0.4 + resp * 0.2, 2.2);
        emergencia(st, t, { cam: [lerp(480, 360, anda), 1240, 1.15], calmo: 1 });
        st.mundo(c => { rrect(c, -40, 1360, 200, 340, 8, '#b8a890', { lw: 5 }); J.draw(c, t); lagrima(c, J, t, 1 - sstep(DICA, 23, t), 1); });
        st.camada(0, c => { guiaRespiracao(c, 540, 470, t, DICA, sstep(DICA, DICA + 0.4, t)); cartaoDica(c, 540, 700, 900, 'O QUE FAZER', [['Solte o ar mais devagar do que puxa', 21.6], ['Vá para um lugar seguro', 25.3], ['Uma tarefa simples por vez', 27.4]], t, 21.2); });
      },
    };
  },
};

// ---------- 3. Não sabe o que fazer ----------
export const c3 = {
  nome: 'Não sabe o que fazer', inicio: 30.3, fim: 43.9,
  criar(st) {
    const T = tipoPerdido();
    const DICA = 36.9;
    return {
      desenhar(t) {
        T.reset(); T.piscar = piscada(t, 3);
        T.x = 540; T.y = 1700;
        if (t < DICA) {
          T.exp = 'choque'; T.boca = 'o'; T.olhar = [Math.sign(Math.sin(t * 5)) * 0.9, 0]; T.headTilt = Math.sin(t * 5) * 0.08; sinais(T, t, 0.7); T.bracos(1.2 + Math.sin(t * 4) * 0.4, 0.8, 1.2 - Math.sin(t * 4) * 0.4, 0.8); T.x = 540 + Math.sin(t * 2.5) * 40;
          emergencia(st, t, { cam: [560, 1260, 1.35] });
          st.mundo(c => {
            T.draw(c, t);
            const [hx, hy] = T.cabeca();
            ['CORRER?', 'AJUDAR?', 'ESCONDER?', 'LIGAR?', 'FILMAR?'].forEach((txt, i) => { const a = t * 1.6 + i * TAU / 5; balaoFala(c, hx + Math.cos(a) * 260, hy - 60 + Math.sin(a) * 160, 220, 74, sstep(30.6 + i * 0.3, 30.9 + i * 0.3, t), { cauda: Math.cos(a) > 0 ? -1 : 1, texto: txt, tam: 30, cor: '#fff6d8' }); });
          });
          st.camada(0, c => cartaoTipo(c, 2, 'NÃO SABE O QUE FAZER', t, 30.5));
          return;
        }
        // pare, observe, uma prioridade
        const varre = sstep(DICA + 0.4, DICA + 2.6, t), sai = clamp((t - 41.4) / 2.0);
        T.exp = sai > 0 ? 'determinado' : 'normal'; T.boca = 'reta'; T.olhar = [lerp(-0.9, 0.9, varre) * (sai > 0 ? 0 : 1) + (sai > 0 ? -0.9 : 0), 0]; T.bracos(0.3, 0.3, 0.3, 0.3); sinais(T, t, 0.3 * (1 - sstep(DICA, 39, t)));
        T.x = lerp(540, 60, easeInOut(sai)); if (sai > 0 && sai < 1) { T.walk = t * 6; T.flip = -1; }
        emergencia(st, t, { cam: [lerp(560, 360, sai), 1260, 1.25], calmo: 1 });
        st.mundo(c => {
          rrect(c, -160, 1220, 220, 90, 10, '#2aa060', { lw: 5 }); c.font = '900 40px Inter'; c.textAlign = 'center'; c.fillStyle = '#fff'; c.fillText('← SAÍDA', -50, 1278);
          T.draw(c, t);
          const [hx, hy] = T.cabeca(); if (varre > 0 && varre < 1) { c.save(); c.globalAlpha = 0.25; c.fillStyle = '#7ad8ff'; c.beginPath(); c.moveTo(hx, hy); const an = lerp(Math.PI, 0, varre); c.arc(hx, hy, 700, an - 0.3, an + 0.3); c.closePath(); c.fill(); c.restore(); }
        });
        st.camada(0, c => cartaoDica(c, 540, 230, 900, 'O QUE FAZER', [['Pare 3 segundos (se estiver seguro)', 37.2], ['Observe o ambiente', 39.4], ['Prioridade: sair do perigo', 41.4]], t, 37.0));
      },
    };
  },
};

// ---------- 4. Fica agressivo ----------
export const c4 = {
  nome: 'Fica agressivo', inicio: 43.9, fim: 58.1,
  criar(st) {
    const M = tipoAgressivo(), X = passante(115);
    const DICA = 50.2;
    return {
      desenhar(t) {
        M.reset(); X.reset(); M.piscar = piscada(t, 3.5);
        X.x = 820; X.y = 1700; X.flip = -1; X.olhar = [0.8, 0];
        if (t < DICA) {
          M.x = 460; M.y = 1700; M.exp = 'raiva'; M.boca = Math.sin(t * 12) > 0 ? 'grito' : 'dentes'; M.olhar = [0.9, 0]; sinais(M, t, 0.6); M.bracos(0.9, 2.0 + Math.sin(t * 9) * 0.3, 1.2 + Math.sin(t * 7) * 0.3, 1.6); M.lean = 0.08;
          X.exp = 'choque'; X.boca = 'reta'; X.bracos(1.4, 0.2, 1.4, 0.2); X.lean = -0.06;
          emergencia(st, t, { cam: [620, 1260, lerp(1.3, 1.5, (t - 43.9) / 6), shake(t, 0.12)] });
          st.mundo(c => { X.draw(c, t); M.draw(c, t); const [hx, hy] = M.cabeca(); balaoFala(c, hx + 60, hy - 180, 260, 110, sstep(45.2, 45.4, t), { cauda: -1, texto: '#@%&!', tam: 52, cor: '#ffd8d0' }); glow(c, hx, hy, 160, '#ff3a2a', 0.3); });
          st.camada(0, c => cartaoTipo(c, 3, 'FICA AGRESSIVO', t, 44.1));
          return;
        }
        // afasta-se, mãos livres, procura saída
        const recua = clamp((t - 51.2) / 1.6), sai = clamp((t - 54.6) / 3.0);
        M.x = lerp(460, 300, easeOut(recua)) - sai * 500; M.y = 1700; if ((recua > 0 && recua < 1) || (sai > 0 && sai < 1)) M.walk = t * 5; M.flip = sai > 0 ? -1 : 1;
        M.exp = recua > 0.5 ? 'normal' : 'raiva'; M.boca = 'reta'; M.olhar = sai > 0 ? [0.9, 0] : [0.9, 0]; sinais(M, t, 0.3 * (1 - recua));
        M.bracos(lerp(0.9, 1.1, recua), lerp(2.0, 0.1, recua), lerp(1.2, 1.1, recua), lerp(1.6, 0.1, recua));
        X.exp = 'normal'; X.boca = 'reta'; X.bracos(0.3, 0.2, 0.3, 0.2);
        emergencia(st, t, { cam: [lerp(620, 420, sai), 1260, 1.3], calmo: 1 });
        st.mundo(c => { X.draw(c, t); M.draw(c, t); if (recua > 0.5 && sai < 0.3) { const [lx, ly] = M.mao(-1), [rx, ry] = M.mao(1); for (const [x, y] of [[lx, ly], [rx, ry]]) glow(c, x, y, 60, '#ffffff', 0.4); } });
        st.camada(0, c => cartaoDica(c, 540, 230, 920, 'O QUE FAZER', [['Não procure briga', 51.0], ['Não banque o herói', 52.0], ['Afaste-se, mãos livres', 55.2], ['Procure uma saída segura', 56.8]], t, 50.4));
      },
    };
  },
};

// ---------- 5. Paralisada ----------
export const c5 = {
  nome: 'Paralisada', inicio: 58.1, fim: 73.8,
  criar(st) {
    const C = tipoParalisada(), F = [passante(116), passante(117), passante(118)];
    const DICA = 64.1;
    return {
      desenhar(t) {
        C.reset(); C.piscar = 0; C.x = 540; C.y = 1700;
        if (t < DICA) {
          // tudo se move rápido ao redor; ela não
          C.exp = 'choque'; C.boca = 'reta'; C.olhar = [0.9, 0]; C.tremor = 0.08; C.bracos(0.15, 0.1, 0.15, 0.1);
          const [hx, hy] = C.cabeca();
          emergencia(st, t, { cam: [hx, lerp(1260, hy + 140, sstep(58.1, 63, t)), lerp(1.2, 2.0, sstep(58.1, 63.5, t))] });
          st.mundo(c => {
            F.forEach((p, i) => { p.reset(); p.y = 1720 + i * 20; p.s = 0.9; p.flip = i % 2 ? -1 : 1; p.walk = t * 14; p.lean = 0.2 * p.flip; p.exp = 'medo'; p.boca = 'grito'; p.x = (((t * 900 * p.flip + i * 600) % 2200) + 2200) % 2200 - 600; p.alpha = 0.7; p.bracos(2.2, 0.3, 2.2, 0.3); });
            F.filter((_, i) => i === 2).forEach(p => p.draw(c, t));
            C.draw(c, t);
            F.filter((_, i) => i < 2).forEach(p => p.draw(c, t));
          });
          st.camada(0, c => cartaoTipo(c, 4, 'TRAVA (PARALISA)', t, 58.3));
          return;
        }
        // movimentos pequenos: dedos, pés no chão, próxima ação em voz baixa
        const dedos = win(t, 65.4, 65.8, 67.6, 68.0), pes = win(t, 67.8, 68.2, 69.8, 70.2), fala = win(t, 70.0, 70.3, 72.6, 73.0), passo = clamp((t - 72.4) / 1.4);
        C.exp = 'preocupado'; C.boca = fala > 0.5 && Math.sin(t * 10) > 0 ? 'o' : 'reta'; C.olhar = dedos > 0.5 ? [0, 0.9] : (pes > 0.5 ? [0, 1] : [-0.8, 0]); C.tremor = 0.04;
        C.bracos(0.6, lerp(0.4, 1.6, dedos), 0.6, lerp(0.4, 1.6, dedos)); C.x = 540 - passo * 120; if (passo > 0 && passo < 1) { C.walk = t * 3.5; C.flip = -1; }
        let cam = [540, 1260, 1.3];
        if (dedos > 0.3) { const [lx, ly] = C.mao(-1); cam = [540, ly, 2.4]; }
        else if (pes > 0.3) cam = [540, 1640, 2.2];
        emergencia(st, t, { cam, calmo: 1 });
        st.mundo(c => {
          C.draw(c, t);
          if (dedos > 0) for (const s of [-1, 1]) { const [x, y] = C.mao(s); for (let i = 0; i < 4; i++) line(c, [[x - 12 + i * 8, y + 10], [x - 14 + i * 8 + Math.sin(t * 14 + i) * 5, y + 30]], '#f2d2b6', 7, dedos); }
          if (pes > 0) for (const s of [-1, 1]) { glow(c, 540 + s * 24, 1700, 70, '#7ad8c8', pes * 0.8); }
          const [hx, hy] = C.cabeca(); balaoFala(c, hx + 40, hy - 170, 460, 96, fala, { cauda: -1, texto: '(próximo passo: a calçada)', tam: 30, cor: '#e8f8f4' });
        });
        st.camada(0, c => cartaoDica(c, 540, 230, 900, 'O QUE FAZER', [['Mexa os dedos', 65.4], ['Sinta os pés no chão', 67.8], ['Diga baixinho a próxima ação', 70.0], ['Uma coisa de cada vez', 72.0]], t, 64.3));
      },
    };
  },
};

// ---------- 6. Age por impulso ----------
export const c6 = {
  nome: 'Age por impulso', inicio: 73.8, fim: 85.6,
  criar(st) {
    const P = tipoImpulsivo();
    const DICA = 81.0, FREIA = 76.2;
    return {
      desenhar(t) {
        P.reset(); P.piscar = piscada(t, 3.2);
        if (t < DICA) {
          const corre = clamp((t - 74.2) / 6.2);
          P.x = lerp(100, 1000, corre); P.y = 1760; P.walk = t * 13; P.lean = 0.2; P.exp = 'determinado'; P.boca = 'aberta'; P.olhar = [0.9, 0]; P.bracos(2.2 + Math.sin(t * 13) * 0.5, 0.3, 2.2 - Math.sin(t * 13) * 0.5, 0.3);
          emergencia(st, t, { cam: [lerp(400, 820, corre), 1300, 1.2, shake(t, impulse(t, FREIA, 0.6))] });
          st.mundo(c => {
            // carro que freia em cima (quase atropela)
            const cx = t < FREIA ? lerp(-800, 300 + (P.x - 300) * 0, clamp((t - 74.6) / 1.6)) : 380;
            P.draw(c, t);
            carro(c, Math.min(cx, P.x - 320), 1900, 1, { cor: '#c83a3a' });
            if (t > FREIA - 0.1 && t < FREIA + 1.2) { balaoFala(c, P.x - 380, 1500, 240, 100, 1 - (t - FREIA) / 1.3, { cauda: 1, texto: 'BÉÉÉ!', tam: 50, cor: '#ffe0dc' }); for (let i = 0; i < 4; i++) line(c, [[P.x - 560 - i * 30, 1860], [P.x - 680 - i * 30, 1860]], '#2b1f2a', 5); }
            if (corre > 0.8) glow(c, 1050, 1500, 300, '#ff5a2a', 0.4);
          });
          st.camada(0, c => cartaoTipo(c, 5, 'AGE POR IMPULSO', t, 74.0));
          return;
        }
        // pausa, volta: olha os riscos antes de agir
        const congela = t < 81.5, volta = clamp((t - 81.5) / 0.8);
        P.x = lerp(1000, 640, easeOut(volta)); P.y = 1700; P.exp = volta > 0.5 ? 'normal' : 'choque'; P.boca = 'reta'; P.olhar = [Math.sin(t * 2) * 0.9, 0]; P.bracos(0.3, 0.3, 0.3, 0.3);
        emergencia(st, t, { cam: [700, 1260, 1.3], calmo: 1 });
        st.mundo(c => {
          P.draw(c, t);
          if (congela) { line(c, [[P.x - 120, 1300], [P.x + 120, 1560]], '#e83a2a', 18); line(c, [[P.x + 120, 1300], [P.x - 120, 1560]], '#e83a2a', 18); }
          [['🔥 fogo / fumaça', 880, 1150], ['🚗 trânsito', 470, 1280], ['⚡ fios / vidro', 900, 1520]].forEach(([txt, x, y], i) => balaoFala(c, x, y, 300, 80, sstep(82.0 + i * 0.4, 82.3 + i * 0.4, t), { cauda: 1, texto: txt, tam: 30, cor: '#fff0d0' }));
        });
        st.camada(0, c => cartaoDica(c, 540, 230, 920, 'O QUE FAZER', [['Antes de agir, veja os riscos', 81.8], ['Não vire outra vítima', 83.6]], t, 81.2));
      },
    };
  },
};

// ---------- 7. Mantém a calma (o que ela faz) ----------
export const c7 = {
  nome: 'Mantém a calma', inicio: 85.6, fim: 106.2,
  criar(st) {
    const A = tipoCalma();
    const DICA = 96.2;
    return {
      desenhar(t) {
        A.reset(); A.piscar = piscada(t, 3.8);
        if (t < DICA) {
          // observa, respira, vai para o lugar seguro
          const anda = clamp((t - 91.6) / 3.0);
          A.x = lerp(620, 260, easeInOut(anda)); A.y = 1700; if (anda > 0 && anda < 1) { A.walk = t * 5; A.flip = -1; }
          A.exp = 'determinado'; A.boca = 'reta'; A.olhar = anda > 0 ? [-0.9, 0] : [Math.sin(t * 1.2) * 0.9, -0.1]; A.tremor = 0.05; A.suor = 0.4; A.bracos(0.3, 0.3, 0.3, 0.3);
          const resp = ((t - 85.6) % 6) < 2.5 ? ((t - 85.6) % 6) / 2.5 : 1 - (((t - 85.6) % 6) - 2.5) / 3.5; A.squash = -resp * 0.025;
          emergencia(st, t, { cam: [lerp(620, 420, anda), 1260, 1.3] });
          st.mundo(c => { rrect(c, -40, 1360, 200, 340, 8, '#b8a890', { lw: 5 }); A.draw(c, t); });
          st.camada(0, c => { cartaoTipo(c, 6, 'CONSEGUE SE ORGANIZAR', t, 85.8, '#2aa060'); if (t > 89.6) { const a = sstep(89.6, 90, t); c.save(); c.globalAlpha = a; c.font = '900 44px Inter'; c.textAlign = 'center'; c.fillStyle = '#ffffff'; c.lineWidth = 10; c.strokeStyle = '#111'; c.strokeText('MEDO → UMA AÇÃO DE CADA VEZ', 540, 330); c.fillText('MEDO → UMA AÇÃO DE CADA VEZ', 540, 330); c.restore(); } });
          return;
        }
        // liga para a emergência: 190 / 192 / 193
        A.x = 260; A.y = 1700; A.flip = 1; A.exp = 'determinado'; A.boca = Math.sin(t * 10) > 0.2 ? 'aberta' : 'reta'; A.olhar = [0.6, 0]; A.maoD = celular(1); A.bracos(0.3, 0.3, 1.0, 2.6);
        emergencia(st, t, { cam: [460, 1300, 1.3], calmo: 1 });
        st.mundo(c => { rrect(c, -40, 1360, 200, 340, 8, '#b8a890', { lw: 5 }); A.draw(c, t); });
        st.camada(0, c => {
          [['190', 'POLÍCIA', '#3a6ad0', 99.0], ['192', 'SAMU', '#e83a3a', 101.6], ['193', 'BOMBEIROS', '#f07a2a', 103.4]].forEach(([n, nome, cor, a0], i) => {
            const a = easeBack(clamp((t - a0) / 0.35)); if (a <= 0) return;
            c.save(); c.translate(540, 300 + i * 220); c.scale(a, a); rrect(c, -400, -90, 800, 180, 30, '#ffffff', { stroke: cor, lw: 8 }); rrect(c, -400, -90, 300, 180, 30, cor, { stroke: null });
            c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = '900 96px Inter'; c.fillStyle = '#ffffff'; c.fillText(n, -250, 4); c.font = '900 58px Inter'; c.fillStyle = cor; c.fillText(nome, 150, 4); c.restore();
          });
          if (t < 99.2) { c.save(); c.globalAlpha = 1 - sstep(98.6, 99.2, t); cartaoDica(c, 540, 300, 860, 'O QUE FAZER', [['Procure segurança', 96.4], ['Peça ajuda', 97.6]], t, 96.3); c.restore(); }
        });
      },
    };
  },
};

// ---------- 8. A grande lição ----------
export const c8 = {
  nome: 'A grande lição', inicio: 106.2, fim: 117.6,
  criar(st) {
    const G = [tipoChora(), tipoPerdido(), tipoAgressivo(), tipoParalisada(), tipoImpulsivo(), tipoCalma()];
    return {
      desenhar(t) {
        const k = easeInOut(clamp((t - 106.2) / 11.4));
        st.setCam(540, lerp(1240, 1330, k), lerp(0.95, 1.35, k));
        bairro(st, t, { sol: 0.85 });
        st.mundo(c => {
          G.forEach((p, i) => {
            p.reset(); p.x = 90 + i * 180; p.y = 1700 - (i % 2) * 30; p.s = 0.9; p.piscar = piscada(t, 3.5, i);
            const resp = Math.sin(t * 1.1 + i) * 0.5 + 0.5; p.squash = -resp * 0.015;
            p.exp = i === 5 ? 'normal' : (resp > 0.7 ? 'fechado' : 'normal'); p.boca = 'reta'; p.olhar = [0, -0.1]; p.bracos(0.2, 0.2, 0.2, 0.2);
          });
          [...G].sort((a, b) => a.y - b.y).forEach(p => p.draw(c, t));
        });
      },
    };
  },
};
