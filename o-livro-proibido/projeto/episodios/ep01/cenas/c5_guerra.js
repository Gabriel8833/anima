// CENA 5 — A GUERRA DOS MAGOS (46–61 s): esfera negra × escudo dourado, portal roxo, onda azul derruba a torre.
import { kf, lerp, clamp, sstep, win, easeInOut, easeOut, easeIn, shake, impulse } from '../../../motor/base.js';
import { glow, sparkle, speedLines } from '../../../motor/desenho.js';
import { aura, fumaca, orbeNegro, escudo, portal, onda, raio, flashRaio, explosao, poeira } from '../../../motor/efeitos.js';
import { kael, morvath, eldrin, zareth, cajado } from '../../../personagens/magos.js';
import { batalha, torreCaindo, fogo } from '../../../cenarios/fundos.js';

const EV = { carga: 46.3, lanca: 48.8, escudo: 48.4, impacto: 49.65, portal: 51.0, sai: 51.9, raioZ: 52.9, expZ: 53.25, kael: 53.6, onda: 54.6, torre: 55.4, orbe2: 57.0, exp2: 57.6, exp3: 58.4, exp4: 59.3 };
const RAIOS = [[46.25, 820, 1480], [51.3, 160, 1500], [57.2, 300, 1520], [58.75, 900, 1510], [59.9, 560, 1500]];
const MX = 230, EX = 880, GY = 1580, TORRE = 70;

export default {
  nome: 'A guerra dos magos', inicio: 46, fim: 61,
  criar(st) {
    const K = kael(), M = morvath(), E = eldrin(), Z = zareth();
    return {
      desenhar(t) {
        let clarao = 0; RAIOS.forEach(([te]) => (clarao = Math.max(clarao, flashRaio(t - te))));
        const sh = impulse(t, EV.impacto, 2.2) + impulse(t, EV.expZ, 1.0) + impulse(t, EV.torre, 2.0) + impulse(t, EV.exp2, 1.6) + impulse(t, EV.exp3, 1.2) + impulse(t, EV.exp4, 1.2) + clarao * 0.5;
        // câmeras
        let cam;
        if (t < 48.6) cam = kf(t, [[46, [300, 1220, 1.45]], [48.6, [330, 1180, 1.3]]], easeInOut);
        else if (t < 51) cam = kf(t, [[48.6, [560, 1260, 0.95]], [51, [560, 1240, 1.0]]], easeInOut);
        else if (t < 53.6) cam = kf(t, [[51, [540, 1260, 1.0]], [53.6, [560, 1300, 1.18]]], easeInOut);
        else if (t < 56.6) cam = kf(t, [[53.6, [620, 1250, 1.15]], [54.6, [560, 1240, 1.05]], [56.6, [380, 1180, 0.95]]], easeInOut);
        else cam = kf(t, [[56.6, [540, 1260, 0.92]], [61, [540, 1180, 0.8]]], easeInOut);
        st.setCam(cam[0], cam[1], cam[2], 0, shake(t, sh, 24));
        batalha(st, t, clarao);
        st.mundo(c => {
          RAIOS.forEach(([te, x, y], i) => raio(c, x + 100, -200, x, y, i + 5, flashRaio(t - te)));
          torreCaindo(c, TORRE, 1560, clamp((t - EV.torre) / 1.4), t);
          explosao(c, TORRE + 40, 1250, 180, t - EV.torre);
          for (const [x, i] of [[-200, 0], [1250, 1], [640, 2]]) fogo(c, x, 1600, 1.2, t, i);
          // MORVATH
          M.reset(); M.x = MX; M.y = GY; M.s = 1.15; M.flip = 1;
          const carga = sstep(EV.carga, EV.carga + 0.5, t) * (1 - sstep(EV.lanca, EV.lanca + 0.2, t));
          const lan = win(t, EV.lanca - 0.1, EV.lanca + 0.05, EV.lanca + 0.6, EV.lanca + 1.0) + win(t, EV.orbe2 - 0.3, EV.orbe2, EV.orbe2 + 0.4, EV.orbe2 + 0.8);
          M.bracos(lerp(lerp(0.2, 2.8, carga), 1.5, lan), lerp(0.1, 0, carga), lerp(lerp(0.2, 2.8, carga), 1.5, lan), lerp(0.1, 3.0, lan));
          const empurra = win(t, EV.torre, EV.torre + 0.2, EV.torre + 0.8, EV.torre + 1.4);
          M.lean = -empurra * 0.35; M.jump = empurra * 40;
          M.exp = empurra > 0.3 ? 'choque' : 'raiva'; M.boca = empurra > 0.3 ? 'grito' : (carga > 0.3 ? 'dentes' : 'sorrisoMal'); M.brilhoOlhos = 1; M.capaVento = 1;
          fumaca(c, MX, GY - 40, 220, t, 0.8);
          M.draw(c, t);
          const top = [MX, GY - 560];
          const voo = clamp((t - EV.lanca) / (EV.impacto - EV.lanca));
          const alvo = [EX - 230, GY - 330];
          if (t < EV.lanca) orbeNegro(c, top[0], top[1] + 40, lerp(20, 110, sstep(EV.carga, EV.lanca, t)), t, sstep(EV.carga, EV.carga + 0.3, t));
          else if (t < EV.impacto) orbeNegro(c, lerp(top[0], alvo[0], easeIn(voo)), lerp(top[1], alvo[1], voo) - Math.sin(voo * Math.PI) * 120, 110, t, 1);
          const v2 = clamp((t - EV.orbe2) / (EV.exp2 - EV.orbe2));
          if (t > EV.orbe2 && t < EV.exp2) orbeNegro(c, lerp(MX + 150, 820, v2), lerp(GY - 380, GY - 120, v2), 70, t, 1);
          // ELDRIN
          E.reset(); E.x = EX; E.y = GY; E.s = 1.15;
          const sUp = sstep(EV.escudo - 0.4, EV.escudo, t);
          E.bracos(0.2, 0.3, lerp(0.4, 1.9, sUp), lerp(0.8, 0.2, sUp)); E.maoD = cajado(0.6 + sUp * 0.6);
          const rec = win(t, EV.impacto, EV.impacto + 0.1, EV.impacto + 0.4, EV.impacto + 1.0);
          E.lean = rec * 0.18; E.exp = rec > 0.2 ? 'raiva' : 'determinado'; E.boca = rec > 0.2 ? 'dentes' : 'reta'; E.olhar = [-0.8, 0]; E.capaVento = 0.8;
          E.draw(c, t);
          const shK = sUp * (1 - sstep(55.8, 56.4, t)) + sstep(57.6, 58.0, t);
          escudo(c, EX, GY + 10, 330, t, shK, t - EV.impacto, Math.PI * 1.15);
          explosao(c, alvo[0], alvo[1], 200, t - EV.impacto, ['#ffd6f0', '#ff3a6a', '#7a1aa8']);
          // ZARETH sai do portal
          const pk = sstep(EV.portal, EV.portal + 0.7, t) * (1 - sstep(55, 55.6, t));
          portal(c, 560, 1300, 170, 260, t, pk);
          const sai = clamp((t - EV.sai) / 0.7);
          if (t > EV.sai) {
            Z.reset(); Z.x = 560; Z.y = lerp(1420, GY + 60, easeOut(sai)); Z.s = lerp(0.6, 1.2, easeOut(sai));
            const land = win(t, EV.sai + 0.6, EV.sai + 0.7, EV.sai + 0.8, EV.sai + 1.0); Z.squash = land * 0.12;
            const zc = win(t, EV.raioZ - 0.4, EV.raioZ, EV.raioZ + 0.4, EV.raioZ + 0.9);
            Z.bracos(0.25, 0.3, lerp(0.3, 1.5, zc), lerp(0.3, 0, zc)); Z.olhar = [0.8, 0]; Z.exp = 'malicia'; Z.boca = 'sorrisoMal'; Z.capaVento = 1;
            if (t > 57) { Z.alpha = 1 - win(t, 58.2, 58.4, 58.7, 58.9) * 0.9; }
            Z.draw(c, t);
            const [hx, hy] = Z.mao(1); glow(c, hx, hy, 90, '#c070ff', 0.5 + zc * 0.5);
            const bz = clamp((t - EV.raioZ) / (EV.expZ - EV.raioZ));
            if (t > EV.raioZ && t < EV.expZ) { const bx = lerp(hx, EX - 120, bz), by = lerp(hy, GY - 200, bz); glow(c, bx, by, 120, '#c070ff', 1); sparkle(c, bx, by, 40, '#fff', 1); }
          }
          explosao(c, EX - 120, GY - 200, 150, t - EV.expZ, ['#f6e0ff', '#c070ff', '#6a20c0']);
          // KAEL entra e lança a onda azul
          if (t > EV.kael) {
            K.reset(); K.flip = -1; K.s = 1.35; K.y = GY + 80;
            K.x = lerp(1150, 820, easeOut(clamp((t - EV.kael) / 0.6)));
            if (t < EV.kael + 0.6) K.walk = t * 12;
            const ch = sstep(54.0, EV.onda, t) * (1 - sstep(EV.onda, EV.onda + 0.1, t));
            const pu = win(t, EV.onda - 0.05, EV.onda + 0.1, 56.0, 56.6);
            K.bracos(lerp(lerp(0.2, 0.9, ch), 1.3, pu), lerp(lerp(0.1, 1.6, ch), 1.6, pu), lerp(lerp(0.2, 0.9, ch), 1.55, pu), lerp(lerp(0.1, 1.6, ch), 0, pu));
            const des = win(t, EV.exp2 - 0.2, EV.exp2, EV.exp2 + 0.5, EV.exp2 + 1.0);
            K.squash = des * 0.15; K.lean = des * 0.2;
            K.exp = des > 0.3 ? 'medo' : 'determinado'; K.boca = pu > 0.3 ? 'grito' : (des > 0.3 ? 'aberta' : 'reta'); K.olhar = [0.8, -0.2]; K.capaVento = 1;
            K.draw(c, t);
            const [hx, hy] = K.mao(1);
            glow(c, hx, hy, 130, '#58b4ff', 0.6 + ch * 0.4 + pu * 0.4); aura(c, hx, hy, 80, '#9fd8ff', t, ch);
            onda(c, hx, hy, Math.atan2(1260 - hy, TORRE + 40 - hx), t - EV.onda, Math.hypot(TORRE + 40 - hx, 1260 - hy));
          }
          explosao(c, 820, GY - 120, 190, t - EV.exp2);
          explosao(c, 360, GY - 60, 170, t - EV.exp3, ['#fff3b0', '#ffc040', '#ff7a2a']);
          explosao(c, 640, GY - 260, 160, t - EV.exp4, ['#e6f6ff', '#58b4ff', '#2a5ad6']);
          poeira(c, -300, 400, 1700, 1300, t, '#ffb070', 0.6, 30, 8);
        });
        if (t > EV.onda && t < EV.onda + 0.7) st.camada(0, c => speedLines(c, 540, 960, 60, 420, 1400, 0.5 * (1 - (t - EV.onda) / 0.7), t));
      },
    };
  },
};
