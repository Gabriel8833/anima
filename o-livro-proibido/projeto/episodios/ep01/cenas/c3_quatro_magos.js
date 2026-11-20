// CENA 3 — OS QUATRO MAGOS (22–34 s): cada um descobre uma pista em um lugar diferente (4 planos de 3 s).
import { kf, lerp, clamp, sstep, win, easeInOut, easeOut, easeBack } from '../../../motor/base.js';
import { glow, sparkle, rune } from '../../../motor/desenho.js';
import { aura, fumaca, portal } from '../../../motor/efeitos.js';
import { exclamacao } from '../../../motor/balao.js';
import { kael, morvath, eldrin, zareth, cajado, pergaminho } from '../../../personagens/magos.js';
import { floresta, cripta, observatorio, circuloPedras } from '../../../cenarios/fundos.js';
import { bolaCristal, livro } from '../../../cenarios/objetos.js';

export const PLANOS = [22, 25, 28, 31, 34];

export default {
  nome: 'Os quatro magos', inicio: 22, fim: 34,
  criar(st) {
    const K = kael(), M = morvath(), E = eldrin(), Z = zareth();
    return {
      desenhar(t) {
        // ---- Kael lê um pergaminho na floresta ----
        if (t < PLANOS[1]) {
          const tau = t - 22, rev = sstep(1.0, 1.6, tau);
          st.setCam(540, lerp(1260, 1180, easeInOut(tau / 3)), lerp(1.5, 1.8, easeInOut(tau / 3)));
          floresta(st, t);
          st.mundo(c => {
            K.reset(); K.x = 540; K.y = 1560; K.s = 1.3;
            K.bracos(0.35, 1.55, 0.35, 1.55); K.maoD = pergaminho(rev);
            K.olhar = [0, lerp(0.7, -0.2, sstep(1.3, 1.6, tau))]; K.headTilt = 0.08 * (1 - rev);
            K.exp = tau < 1.3 ? (tau > 0.9 && tau < 1.0 ? 'fechado' : 'normal') : 'choque'; K.boca = tau < 1.3 ? 'reta' : 'o';
            const hop = win(tau, 1.3, 1.45, 1.55, 1.8); K.jump = hop * 40; K.squash = -hop * 0.06;
            K.draw(c, t);
            const [hx, hy] = K.mao(1);
            for (let i = 0; i < 6; i++) { const u = (tau * 0.6 + i / 6) % 1; rune(c, hx - 60 + Math.sin(i * 2 + t) * 70, hy - 40 - u * 380, 14, 70 + i, '#8fd0ff', rev * Math.sin(u * Math.PI)); }
            glow(c, hx - 60, hy - 30, 300, '#58b4ff', rev * 0.6);
            const [cx, cy] = K.cabeca(); exclamacao(c, cx + 110, cy - 60, tau - 1.35);
          });
          return;
        }
        // ---- Morvath vê o livro na bola de cristal ----
        if (t < PLANOS[2]) {
          const tau = t - 25, k = sstep(0.3, 1.3, tau);
          st.setCam(540, lerp(1250, 1270, tau / 3), lerp(1.5, 1.75, easeInOut(tau / 3)), -0.03);
          cripta(st, t);
          st.mundo(c => {
            fumaca(c, 540, 1500, 260, t, 0.8);
            M.reset(); M.x = 540; M.y = 1560; M.s = 1.3; M.bracos(1.0, 0.9, 1.0, 0.9);
            M.exp = tau < 1.6 ? 'raiva' : 'malicia'; M.boca = tau < 1.6 ? 'reta' : (tau < 2.2 ? 'sorrisoMal' : 'dentes');
            M.brilhoOlhos = 0.3 + k * 0.7; M.olhar = [0, lerp(0.8, 0, sstep(1.4, 1.8, tau))];
            M.draw(c, t);
            bolaCristal(c, 540, 1330, 110, t, k, '#ff2a3a');
            glow(c, 540, 1180, 360, '#ff2030', k * 0.35);
          });
          return;
        }
        // ---- Eldrin ergue o cajado; as estrelas formam o livro ----
        if (t < PLANOS[3]) {
          const tau = t - 28, up = sstep(0.2, 0.9, tau);
          st.setCam(540, lerp(1300, 1000, easeInOut(tau / 3)), lerp(1.4, 1.0, easeInOut(tau / 3)));
          observatorio(st, t, sstep(0.7, 2.4, tau));
          st.mundo(c => {
            E.reset(); E.x = 470; E.y = 1560; E.s = 1.3;
            E.bracos(0.2, 0.3, lerp(0.35, 2.75, up), lerp(0.6, 0.05, up)); E.maoD = cajado(0.5 + up * 0.8);
            E.olhar = [0.2, lerp(0, -1, up)]; E.headTilt = -0.08 * up;
            E.exp = tau > 2.0 ? 'choque' : 'normal'; E.boca = tau > 2.0 ? 'o' : 'reta';
            E.capaVento = 0.6; E.draw(c, t);
            const [hx, hy] = E.mao(1); aura(c, hx, hy - 180, 90, '#ffe08a', t, up);
          });
          return;
        }
        // ---- Zareth abre um pequeno portal e vê o livro ----
        const tau = t - 31, op = sstep(0.4, 1.1, tau), wink = sstep(2.0, 2.3, tau);
        st.setCam(lerp(650, 610, tau / 3), 1240, lerp(1.35, 1.55, easeInOut(tau / 3)));
        circuloPedras(st, t, op);
        st.mundo(c => {
          Z.reset(); Z.x = 420; Z.y = 1580; Z.s = 1.3;
          Z.bracos(0.25, 0.4, lerp(0.3, 1.45, op), lerp(0.2, 0.0, op));
          Z.olhar = [lerp(0.8, -0.3, wink), 0]; Z.exp = wink > 0.5 ? 'malicia' : 'normal'; Z.boca = wink > 0.5 ? 'sorrisoMal' : 'reta';
          Z.capaVento = 0.5; Z.draw(c, t);
          const [hx, hy] = Z.mao(1);
          glow(c, hx, hy, 80, '#c070ff', op);
          portal(c, 820, 1200, 110, 160, t, op);
          c.save(); c.beginPath(); c.ellipse(820, 1200, 100 * op, 150 * op, 0, 0, Math.PI * 2); c.clip(); c.globalAlpha = sstep(0.9, 1.4, tau); livro(c, 820, 1215, 0.42, t, { brilho: 1, cor: '#7fd8ff' }); c.restore();
        });
      },
    };
  },
};
