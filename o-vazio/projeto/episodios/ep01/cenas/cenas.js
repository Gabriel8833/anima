// "E se você sentisse um vazio que não consegue explicar?" — 6 cenas
import { TAU, kf, lerp, clamp, sstep, win, easeInOut, easeOut, rng, mix } from '../../../motor/base.js';
import { glow, rrect, line, circle, ellipse, poly, vgrad, shape, cloud } from '../../../motor/desenho.js';
import { voce, amigo, passante, vizinha, celular, controle, copo, regador, caneta, xicara, pecaVazia } from '../../../personagens/elenco.js';
import { quarto, cama, cobertor, criadoMudo, escrivaninha, rua, mesaCafe, festa, sala, sofa, predio, JANELA, bairro, banco, colina } from '../../../cenarios/lugares.js';

const W = 1080, H = 1920;
// posição do peito de um personagem (para a peça vazia)
const peito = P => P.toWorld(-8, -180);
// piscar lento e natural
const piscada = (t, f = 3.7, o = 0) => (((t + o) % f) < 0.14 ? 1 : 0);
// relógio digital no canto (passagem do tempo)
function horaTela(st, t, txt, a) { st.text(txt, 860, 230, { size: 64, fill: '#9ad0ff', alpha: a, lw: 10, glow: 'rgba(80,160,255,0.8)' }); }

// deitado na cama, visto de cima (cabeça à esquerda)
function camaTopo(c, t, noite) {
  vgrad(c, -400, -200, 1900, 2400, [[0, mix('#a87a54', '#1a1a26', noite)], [1, mix('#8a5e3e', '#10101a', noite)]]);
  for (let y = -200; y < 2200; y += 120) line(c, [[-400, y], [1500, y]], mix('#8a5e3e', '#14141e', noite), 4);
  rrect(c, 130, 640, 820, 640, 20, mix('#8a5a3a', '#2a1e1a', noite), { lw: 6 });
  rrect(c, 150, 660, 780, 600, 14, mix('#e8e4dc', '#3a4058', noite), { lw: 5 });
  rrect(c, 170, 800, 200, 320, 40, mix('#f6f2ea', '#4a5070', noite), { lw: 5 });
  rrect(c, 140, 420, 200, 180, 10, mix('#8a6a4a', '#2a2018', noite), { lw: 6 });
}
function deitado(c, P, t, x, y) { c.save(); c.translate(x, y); c.rotate(-Math.PI / 2); P.x = 0; P.y = 0; P.draw(c, t); c.restore(); }
function cobertorTopo(c, noite) { shape(c, c => { c.moveTo(560, 660); c.quadraticCurveTo(540, 960, 560, 1260); c.lineTo(930, 1260); c.lineTo(930, 660); c.closePath(); }, mix('#4a7ac8', '#22305a', noite)); for (let i = 0; i < 3; i++) line(c, [[620 + i * 100, 680], [640 + i * 100, 1240]], mix('#3a6ab0', '#1a2648', noite), 4); }
function ventilador(c, t, a) { c.save(); c.globalAlpha = a; c.translate(560, 900); c.rotate(t * 2.4); c.fillStyle = '#000'; for (let i = 0; i < 4; i++) { c.rotate(TAU / 4); c.beginPath(); c.ellipse(0, -260, 60, 230, 0, 0, TAU); c.fill(); } c.restore(); }

// ---------- 1. Algo está faltando ----------
export const c1 = {
  nome: 'Algo está faltando', inicio: 0, fim: 15,
  criar(st) {
    const V = voce();
    return {
      desenhar(t) {
        V.reset();
        if (t < 9) {
          // vista de cima: despertador, celular, teto
          const perto = sstep(4.6, 8.8, t);
          st.setCam(lerp(520, 400, perto), lerp(940, 900, perto), lerp(1.0, 1.9, easeInOut(perto)));
          const noite = 0.75;
          st.mundo(c => {
            camaTopo(c, t, noite);
            const toca = t > 0.3 && t < 2.0;
            const sh = toca ? Math.sin(t * 70) * 3 : 0;
            if (t < 2.3) { rrect(c, 216 + sh, 480, 70, 40, 8, '#1a1a22', { lw: 4 }); rrect(c, 222 + sh, 486, 58, 28, 4, toca ? '#bfe0ff' : '#2a2a34', { stroke: null }); if (toca) { glow(c, 250, 500, 160, '#9ad0ff', 0.5); for (const s of [-1, 1]) line(c, [[250 + s * 50, 470], [250 + s * 66, 452]], '#bfe0ff', 4); } }
            V.s = 1.5; V.semPernas = false;
            V.exp = t < 1.3 ? 'fechado' : t > 4.6 ? 'normal' : 'normal'; V.piscar = t > 4.6 ? piscada(t, 2.6) : 0;
            V.boca = 'reta'; V.olhar = t < 2.3 ? [-0.6, 0.6] : t < 4.6 ? [0, -0.6] : [0, 0];
            if (t < 1.8) V.bracos(0.2, 0.1, 0.3, 0.1);
            else if (t < 2.4) { const k = sstep(1.8, 2.2, t); V.bracos(0.2, 0.1, lerp(0.3, 2.3, k), 0.2); }
            else if (t < 4.6) { V.bracos(0.2, 0.1, 0.9, 2.3); V.maoD = celular(1); }
            else { V.bracos(0.2, 0.1, 0.4, 1.6); V.maoD = celular(0); }
            deitado(c, V, t, 760, 960);
            cobertorTopo(c, noite);
            if (t > 2.4 && t < 4.6) { const [hx, hy] = [760 - 300 * 1.5, 960]; glow(c, hx + 40, hy, 260, '#9ad0ff', 0.35); for (let i = 0; i < 4; i++) { const u = ((t - 2.4) * 0.9 + i / 4) % 1; c.save(); c.globalAlpha = 1 - u; rrect(c, 480 + i * 30 - u * 60, 760 - u * 200, 110, 36, 10, ['#ff6a6a', '#6ab0ff', '#ffd23a', '#6ad08a'][i], { lw: 3 }); c.restore(); } }
            ventilador(c, t, 0.1 * perto);
            pecaVazia(c, 760 - 180 * 1.5, 960 + 10, 1.4, sstep(7.0, 8.0, t), 0, t);
          });
          return;
        }
        // senta na beira da cama, depois levanta e vai até a janela
        const noite = 0.7;
        const levanta = sstep(11.6, 12.2, t);
        st.setCam(lerp(440, 620, sstep(11.6, 14, t)), 1250, lerp(1.25, 1.4, (t - 9) / 6));
        quarto(st, t, { luz: 0.3 });
        st.mundo(c => {
          cama(c, noite); cobertor(c, noite, 420);
          criadoMudo(c, 900, t, noite, false, false);
          V.s = 1.0;
          if (t < 12.2) {
            V.x = 340; V.y = lerp(1600, 1690, levanta); V.semPernas = levanta < 0.5;
            V.bracos(0.4, 1.9, 0.4, 1.9); V.olhar = [0, 0.8]; V.headTilt = 0.08; V.exp = 'normal'; V.piscar = piscada(t, 2.9); V.boca = 'reta';
            V.lean = Math.sin(t * 0.8) * 0.02;
            V.draw(c, t);
            rrect(c, 120, 1560, 660, 60, 8, mix('#e8e4dc', '#3a4058', noite), { lw: 6 }); rrect(c, 120, 1610, 660, 40, 8, mix('#8a5a3a', '#2a1e1a', noite), { lw: 6 });
          } else {
            const ir = sstep(12.2, 13.8, t);
            V.x = lerp(340, 760, ir); V.y = 1700; if (ir > 0 && ir < 1) V.walk = t * 6;
            V.olhar = [0.6, -0.4]; V.exp = 'normal'; V.boca = 'reta'; V.piscar = piscada(t, 3.1);
            V.draw(c, t);
          }
          const [px, py] = peito(V); pecaVazia(c, px, py, 0.9, sstep(12.8, 13.6, t), 0, t);
        });
      },
    };
  },
};

// ---------- 2. No meio de todo mundo ----------
export const c2 = {
  nome: 'No meio de todo mundo', inicio: 15, fim: 30,
  criar(st) {
    const V = voce(), A = [amigo(0), amigo(1)];
    const P = Array.from({ length: 10 }, (_, i) => passante(i));
    const r = rng(77); const conf = P.map((_, i) => ({ dir: i % 2 ? -1 : 1, x0: -600 + r() * 2200, y: 1600 + r() * 200, v: 70 + r() * 60, rindo: r() < 0.5, cel: r() < 0.3 }));
    return {
      desenhar(t) {
        let cinza = 0, fantasma = 0, vel = 1;
        if (t < 20.2) {
          V.reset(); V.x = lerp(200, 760, (t - 15) / 5.2); V.y = 1700; V.walk = t * 6; V.exp = 'normal'; V.boca = 'reta'; V.olhar = [Math.sin(t * 0.9) * 0.7, 0]; V.piscar = piscada(t, 3.3);
          st.setCam(V.x + 40, 1260, 1.15);
        } else if (t < 24.6) {
          st.setCam(540, 1230, 1.3);
        } else {
          cinza = sstep(24.6, 27, t); fantasma = cinza; vel = lerp(1, 4, cinza);
          V.reset(); V.x = 540; V.y = 1700; V.exp = 'normal'; V.boca = 'reta'; V.olhar = [0, 0.1]; V.piscar = piscada(t, 3.6); V.bracos(0.15, 0.1, 0.15, 0.1);
          st.setCam(540, lerp(1260, 1330, (t - 24.6) / 5.4), lerp(1.1, 1.65, easeInOut((t - 24.6) / 5.4)));
        }
        rua(st, t, { cinza });
        st.mundo(c => {
          if (t >= 20.2 && t < 24.6) {
            // café com os amigos
            const piada = win(t, 20.6, 21.0, 23.0, 23.4);
            A[0].reset(); A[0].x = 260; A[0].y = 1720; A[0].s = 1; A[0].semPernas = true; A[0].exp = piada > 0.5 ? 'feliz' : 'normal'; A[0].boca = piada > 0.5 ? 'aberta' : (Math.sin(t * 12) > 0 ? 'aberta' : 'reta'); A[0].bracos(0.6, 1.4, lerp(0.6, 2.2, piada * Math.abs(Math.sin(t * 4))), 1.0); A[0].jump = piada * Math.abs(Math.sin(t * 9)) * 10; A[0].olhar = [0.8, 0]; A[0].draw(c, t);
            A[1].reset(); A[1].x = 820; A[1].y = 1720; A[1].s = 1; A[1].flip = -1; A[1].semPernas = true; A[1].exp = piada > 0.5 ? 'feliz' : 'normal'; A[1].boca = piada > 0.5 ? 'aberta' : 'sorriso'; A[1].bracos(0.4, 1.6, 0.4, 1.6); A[1].jump = piada * Math.abs(Math.sin(t * 9 + 1)) * 10; A[1].olhar = [0.8, 0]; A[1].draw(c, t);
            V.reset(); V.x = 540; V.y = 1690; V.semPernas = true; const ri = win(t, 20.8, 21.1, 23.2, 23.8);
            V.exp = ri > 0.5 ? 'feliz' : 'normal'; V.boca = ri > 0.5 ? 'aberta' : 'reta'; V.jump = ri * Math.abs(Math.sin(t * 9 + 2)) * 8; V.olhar = t > 23.6 ? [0, 0.6] : [Math.sin(t * 2) * 0.8, 0]; V.bracos(0.5, 1.5, 0.5, 1.5); V.piscar = piscada(t, 3.0);
            V.draw(c, t);
            mesaCafe(c, 540, 1560);
            return;
          }
          const lista = conf.map((k, i) => ({ k, p: P[i] })).sort((a, b) => a.k.y - b.k.y);
          let vDesenhado = false;
          for (const { k, p } of lista) {
            if (!vDesenhado && k.y > V.y) { V.draw(c, t); vDesenhado = true; }
            p.reset(); p.s = 0.95; p.y = k.y; p.flip = k.dir;
            const span = 3200; p.x = ((k.x0 + k.dir * k.v * vel * (t - 15) * 2.2) % span + span) % span - 1000;
            p.walk = t * 6 * vel + k.x0; p.alpha = 1 - fantasma * 0.7;
            if (k.cel) { p.maoD = celular(1); p.bracos(0.2, 0.1, 0.8, 2.2); p.olhar = [0, 0.7]; p.exp = 'normal'; p.boca = 'reta'; }
            else if (k.rindo) { p.exp = 'feliz'; p.boca = Math.sin(t * 10 + k.x0) > 0 ? 'aberta' : 'sorriso'; p.bracos(0.3, 0.6, 0.3 + Math.abs(Math.sin(t * 4 + k.x0)) * 0.6, 0.8); p.olhar = [k.dir * 0.8, 0]; }
            else { p.exp = 'normal'; p.boca = 'sorriso'; p.olhar = [k.dir * 0.8, 0]; }
            p.draw(c, t);
          }
          if (!vDesenhado) V.draw(c, t);
          const [px, py] = peito(V); pecaVazia(c, px, py, 0.9, sstep(26.5, 27.5, t), 0, t);
        });
        if (fantasma > 0) st.camada(0, c => { const g = c.createRadialGradient(540, 960, 200, 540, 960, 1000); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(10,14,30,${0.5 * fantasma})`); c.fillStyle = g; c.fillRect(0, 0, W, H); });
      },
    };
  },
};

// ---------- 3. A busca por algo (montagem rápida) ----------
export const c3 = {
  nome: 'A busca por algo', inicio: 30, fim: 45,
  criar(st) {
    const V = voce(), F = amigo(2);
    const rostoVazio = (t) => { V.exp = 'normal'; V.boca = 'reta'; V.piscar = piscada(t, 2.2); };
    return {
      desenhar(t) {
        V.reset(); rostoVazio(t);
        if (t < 32.6 || (t >= 40.4 && t < 45)) {
          // celular na cama (madrugada)
          const fim = t >= 40.4, larga = t >= 42.6;
          st.setCam(fim && !larga ? 400 : 420, 1260, larga ? lerp(1.4, 1.6, (t - 42.6) / 2.4) : 1.7);
          quarto(st, t, { luz: 0.05 });
          st.mundo(c => {
            cama(c, 1);
            V.x = 400; V.y = 1610; V.semPernas = true; V.olhar = larga ? [0.2, -0.5] : [0, 0.8];
            if (!larga) { V.maoD = celular(1); V.bracos(0.2, 0.1, 0.7, 2.3); }
            else { V.bracos(0.3, 1.6, 0.3, 1.6); }
            V.draw(c, t); cobertor(c, 1, 300);
            if (!larga) { const [hx, hy] = V.cabeca(); glow(c, hx + 20, hy + 40, 240, '#9ad0ff', 0.35); }
            else { rrect(c, 330, 1470, 60, 36, 6, '#1a1a22', { lw: 4 }); const [px, py] = peito(V); pecaVazia(c, px, py, 0.9, sstep(43.0, 43.8, t), 0, t); }
          });
          horaTela(st, t, t < 32.6 ? '23:47' : t < 42.6 ? '02:58' : '03:41', 1);
          return;
        }
        if (t < 35) {
          // videogame na escrivaninha
          st.setCam(560, 1300, 1.45);
          quarto(st, t, { luz: 0.05 });
          st.mundo(c => {
            const flash = Math.abs(Math.sin(t * 9)) > 0.8 ? 1 : 0;
            escrivaninha(c, 520, t, { tela: 1, flash });
            V.x = 600; V.y = 1760; V.semPernas = true; V.flip = 1; V.olhar = [0, -0.5]; V.maoD = controle(); V.bracos(0.6, 2.0, 0.6, 2.0); V.tremor = 0.15;
            V.draw(c, t);
            const [hx, hy] = V.cabeca(); glow(c, hx, hy, 260, flash ? '#ff6aa0' : '#6ab0ff', 0.3);
          });
          horaTela(st, t, '00:52', 1);
          return;
        }
        if (t < 37.8) {
          // festa: luzes e música, rosto igual
          st.setCam(540, 1280, 1.35);
          festa(st, t);
          st.mundo(c => {
            F.reset(); F.x = 800; F.y = 1700; F.flip = -1; F.exp = 'feliz'; F.boca = 'aberta'; F.jump = Math.abs(Math.sin(t * 7)) * 26; F.bracos(2.6 + Math.sin(t * 7) * 0.3, 0.3, 2.6 - Math.sin(t * 7) * 0.3, 0.3); F.draw(c, t);
            V.x = 440; V.y = 1700; V.maoD = copo(); V.bracos(0.2, 0.1, 0.8, 1.8); V.olhar = [0.3, 0]; V.lean = Math.sin(t * 3.5) * 0.02;
            V.draw(c, t);
          });
          return;
        }
        // sofá e TV
        st.setCam(500, 1300, 1.4);
        sala(st, t);
        st.mundo(c => {
          sofa(c, 420);
          V.x = 420; V.y = 1540; V.semPernas = true; V.olhar = [0.9, -0.1]; V.bracos(0.4, 1.7, 0.6, 2.2);
          V.draw(c, t);
          rrect(c, 140, 1470, 560, 60, 20, '#4a4a6a', { lw: 6 });
          const [hx, hy] = V.cabeca(); glow(c, hx + 80, hy, 260, ['#5a8aff', '#ff6a5a', '#6ad08a', '#ffd23a'][Math.floor(t * 2.5) % 4], 0.3);
        });
        horaTela(st, t, '01:36', 1);
      },
    };
  },
};

// ---------- 4. A pergunta ----------
export const c4 = {
  nome: 'A pergunta', inicio: 45, fim: 62,
  criar(st) {
    const V = voce(), Vp = voce();
    return {
      desenhar(t) {
        V.reset(); V.exp = 'preocupado'; V.boca = 'reta'; V.piscar = piscada(t, 4.1); V.olhar = [-0.7, -0.5]; V.headTilt = -0.05;
        if (t < 55.5) {
          const close = sstep(50.3, 51.3, t);
          V.x = 760; V.y = 1640; V.semPernas = true; V.bracos(0.4, 1.8, 0.4, 1.8);
          const [hx, hy] = V.cabeca();
          st.setCam(lerp(lerp(700, 740, (t - 45) / 5.5), hx - 60, close), lerp(lerp(1120, 1180, (t - 45) / 5.5), hy + 40, close), lerp(lerp(1.15, 1.35, (t - 45) / 5.5), lerp(2.3, 2.6, (t - 50.3) / 5.2), close));
          quarto(st, t, { luz: 0, cidade: 1 });
          st.mundo(c => {
            // cadeira
            rrect(c, 650, 1300, 220, 240, 14, '#1e2232', { lw: 6 }); rrect(c, 630, 1520, 260, 40, 8, '#262a3c', { lw: 6 });
            V.draw(c, t);
            rrect(c, 630, 1520, 260, 40, 8, '#262a3c', { lw: 6 }); for (const x of [650, 850]) rrect(c, x, 1560, 20, 130, 4, '#1e2232', { lw: 5 });
            // luz azul da cidade no rosto e reflexo
            glow(c, hx, hy - 60, 300, '#6a9aff', 0.3);
            const pisca = 0.6 + 0.4 * Math.sin(t * 1.3);
            for (let i = 0; i < 7; i++) glow(c, 600 + (i * 53) % 340, 560 + (i * 97) % 380, 30 + (i % 3) * 14, ['#ffd890', '#bfe0ff', '#ff9a6a'][i % 3], 0.3 * pisca);
          });
          return;
        }
        // de fora: a única janela escura no prédio iluminado
        const k = easeInOut(clamp((t - 55.5) / 6.5));
        st.setCam(JANELA.x, lerp(JANELA.y + 20, JANELA.y + 300, k), lerp(2.6, 0.55, k));
        predio(st, t, {
          dentro: c => {
            vgrad(c, JANELA.x - 150, JANELA.y - 180, 300, 360, [[0, '#0a0e1a'], [1, '#141a2c']]);
            Vp.reset(); Vp.x = JANELA.x - 20; Vp.y = JANELA.y + 210; Vp.s = 0.7; Vp.semPernas = true; Vp.exp = 'preocupado'; Vp.boca = 'reta'; Vp.olhar = [0.2, -0.3]; Vp.piscar = piscada(t, 4.1); Vp.bracos(0.4, 1.8, 0.4, 1.8);
            Vp.draw(c, t); glow(c, JANELA.x - 20, JANELA.y, 200, '#6a9aff', 0.25);
          },
        });
      },
    };
  },
};

// ---------- 5. Uma pequena descoberta ----------
export const c5 = {
  nome: 'Uma pequena descoberta', inicio: 62, fim: 78,
  criar(st) {
    const V = voce(), Z = vizinha(), A = amigo(1);
    return {
      desenhar(t) {
        V.reset(); V.piscar = piscada(t, 3.4);
        if (t < 66.5) {
          // sai de casa e respira fundo
          st.setCam(lerp(520, 480, (t - 62) / 4.5), 1270, lerp(1.2, 1.45, easeInOut((t - 62) / 4.5)));
          bairro(st, t, { sol: lerp(0.1, 0.3, (t - 62) / 4.5) });
          st.mundo(c => {
            const porta = sstep(62.2, 62.8, t);
            rrect(c, 300, 1180, 260, 330, 6, '#3a2a3a', { lw: 6 }); rrect(c, 300, 1180, lerp(260, 60, porta), 330, 6, '#6a4a5a', { lw: 6 }); glow(c, 430, 1340, 200, '#ffd890', 0.25 * porta);
            const sai = sstep(62.6, 63.8, t);
            V.x = lerp(430, 480, sai); V.y = lerp(1600, 1700, sai); V.s = lerp(0.9, 1.0, sai); if (sai > 0 && sai < 1) V.walk = t * 6;
            const resp = win(t, 64.0, 64.9, 65.6, 66.3);
            V.exp = resp > 0.4 ? 'fechado' : 'normal'; V.boca = resp > 0.6 ? 'o' : 'reta'; V.olhar = [0.3, -0.5]; V.squash = -resp * 0.04; V.bracos(0.2 + resp * 0.3, 0.1, 0.2 + resp * 0.3, 0.1); V.headTilt = -resp * 0.1;
            V.draw(c, t);
            // vapor da respiração no frio
            const sopro = clamp((t - 65.7) / 1.0);
            if (sopro > 0 && sopro < 1) { const [hx, hy] = V.cabeca(); cloud(c, hx + 60 + sopro * 80, hy + 40 - sopro * 30, 30 + sopro * 30, `rgba(255,255,255,${0.5 * (1 - sopro)})`, { seed: 4 }); }
          });
          return;
        }
        if (t < 70.5) {
          // caminha e cumprimenta a vizinha
          V.x = lerp(160, 600, clamp((t - 66.5) / 2.4)); V.y = 1700; if (t < 68.9) V.walk = t * 6;
          st.setCam(lerp(380, 600, clamp((t - 66.5) / 2.8)), 1260, 1.25);
          bairro(st, t, { sol: lerp(0.35, 0.55, (t - 66.5) / 4) });
          st.mundo(c => {
            const ola = sstep(68.6, 69.0, t);
            Z.reset(); Z.x = 880; Z.y = 1690; Z.flip = -1; Z.maoD = ola < 0.5 ? regador() : null; Z.bracos(0.3, 0.2, ola < 0.5 ? 1.0 : 2.6 + Math.sin(t * 9) * 0.2, ola < 0.5 ? 1.0 : 0.3); Z.exp = ola > 0.5 ? 'feliz' : 'normal'; Z.boca = ola > 0.5 ? 'sorriso' : 'reta'; Z.olhar = ola > 0.5 ? [0.8, 0] : [-0.3, 0.6]; Z.draw(c, t);
            V.exp = 'normal'; V.olhar = [0.8, 0]; V.boca = ola > 0.5 ? 'sorriso' : 'reta'; V.bracos(0.2, 0.1, lerp(0.2, 2.5 + Math.sin(t * 8) * 0.2, win(t, 68.8, 69.1, 70.0, 70.3)), 0.3);
            V.draw(c, t);
          });
          return;
        }
        if (t < 74) {
          // escreve um objetivo no caderno, café, sol na janela
          st.setCam(560, 1320, 1.5);
          quarto(st, t, { luz: 1 });
          st.mundo(c => {
            V.x = 480; V.y = 1690; V.semPernas = true; V.olhar = [0.3, 0.9]; V.exp = 'determinado'; V.boca = 'reta'; V.maoD = caneta(); V.bracos(0.4, 1.6, 0.8 + Math.sin(t * 7) * 0.05, 1.9);
            V.draw(c, t);
            rrect(c, 160, 1540, 760, 40, 8, '#c8925a', { lw: 6 });
            rrect(c, 380, 1480, 240, 64, 6, '#f6f2ea', { lw: 4 });
            const n = clamp((t - 70.6) / 3); for (let i = 0; i < 3; i++) { const u = clamp(n * 3 - i); rrect(c, 396, 1490 + i * 18, 10, 10, 2, '#ffffff', { lw: 2 }); if (u > 0) line(c, [[414, 1495 + i * 18], [414 + 180 * u, 1495 + i * 18]], '#2a4ab0', 3); }
            c.save(); c.translate(720, 1540); xicara()(c, 1, t); c.restore();
          });
          return;
        }
        // conversa verdadeira no banco
        st.setCam(540, 1290, lerp(1.3, 1.45, (t - 74) / 4));
        bairro(st, t, { sol: 0.8 });
        st.mundo(c => {
          banco(c, 540, 1660, 1);
          const fala = Math.floor((t - 74) / 1.2) % 2;
          A.reset(); A.x = 380; A.y = 1640; A.semPernas = true; A.exp = 'normal'; A.boca = fala === 0 && Math.sin(t * 12) > 0 ? 'aberta' : 'sorriso'; A.olhar = [0.8, 0]; A.bracos(0.4, 1.5, lerp(0.4, 1.4, sstep(76, 76.4, t)), lerp(1.5, 0.2, sstep(76, 76.4, t))); A.draw(c, t);
          V.x = 700; V.y = 1640; V.flip = -1; V.semPernas = true; V.exp = 'normal'; V.boca = fala === 1 && Math.sin(t * 11) > 0 ? 'aberta' : (t > 76.4 ? 'sorriso' : 'reta'); V.olhar = [0.8, 0]; V.headTilt = Math.sin(t * 3) * 0.04; V.bracos(0.5, 1.6, 0.5, 1.6);
          V.draw(c, t);
          rrect(c, 340, 1580, 400, 30, 6, '#9a6a3a', { lw: 5 });
        });
      },
    };
  },
};

// ---------- 6. Final reflexivo ----------
export const c6 = {
  nome: 'Final reflexivo', inicio: 78, fim: 90,
  criar(st) {
    const V = voce();
    return {
      desenhar(t) {
        V.reset(); V.x = 380; V.y = 1580; V.semPernas = true; V.olhar = [0.9, -0.3]; V.exp = 'normal'; V.boca = t > 82.5 ? 'sorriso' : 'reta'; V.piscar = piscada(t, 4.3); V.bracos(0.5, 1.3, 0.5, 1.3); V.squash = Math.sin(t * 1.2) * 0.012;
        const [hx, hy] = V.cabeca();
        const k = easeInOut(clamp((t - 78) / 11));
        st.setCam(lerp(hx + 120, 540, k), lerp(hy + 60, 1080, k), lerp(2.4, 0.62, k));
        const sol = lerp(0.35, 1, clamp((t - 78) / 10));
        colina(st, t, { sol, sx: 820 });
        st.mundo(c => {
          V.draw(c, t);
          // pedra onde está sentado
          shape(c, c => { c.moveTo(220, 1640); c.quadraticCurveTo(230, 1500, 380, 1490); c.quadraticCurveTo(540, 1500, 550, 1640); c.closePath(); }, '#7a7280');
          glow(c, hx + 60, hy, 220, '#ffcf80', 0.35 * sol);
          const [px, py] = peito(V); pecaVazia(c, px, py, 0.9, 1, sstep(80, 86, t) * 0.8, t);
        });
      },
    };
  },
};
