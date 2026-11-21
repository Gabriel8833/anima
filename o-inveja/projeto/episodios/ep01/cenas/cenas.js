// "A vitória do outro" — Lucas e Rafael: desigualdade, comparação e inveja (história original)
import { TAU, lerp, clamp, sstep, win, easeInOut, easeOut, easeBack, rng, mix } from '../../../motor/base.js';
import { glow, rrect, line, circle, ellipse, poly, vgrad, shape, sparkle, cloud } from '../../../motor/desenho.js';
import { lucasB, rafael, caixa, livro, capacete, passante, celular, caneta, xicara } from '../../../personagens/elenco.js';
import { cidadeBR, onibus, barraca, moto, quartoSimples, colchao, post, quarto, escritorio, mesaEscritorio, balaoFala } from '../../../cenarios/lugares.js';

const W = 1080, H = 1920;
const piscada = (t, f = 3.6, o = 0) => (((t + o) % f) < 0.14 ? 1 : 0);
const fala = (t, ativo, f = 11) => (ativo && Math.sin(t * f) > 0 ? 'aberta' : null);
// tela dividida: desenha uma metade (0 = de cima, 1 = de baixo)
function metade(st, qual, fn) { const c = st.c; c.save(); c.beginPath(); c.rect(0, qual ? 960 : 0, W, 960); c.clip(); c.translate(0, qual ? 480 : -480); fn(); c.restore(); }
function etiqueta(c, txt, x, y, cor) { c.save(); c.font = '900 40px Inter'; const w = c.measureText(txt).width + 44; rrect(c, x, y, w, 64, 32, 'rgba(20,20,30,0.8)', { stroke: cor, lw: 4 }); c.fillStyle = cor; c.textBaseline = 'middle'; c.fillText(txt, x + 22, y + 33); c.restore(); }
function horaTela(st, txt, y = 150) { st.text(txt, 880, y, { size: 54, fill: '#ffe8b0', lw: 10 }); }

// ---------- 1. A realidade brasileira ----------
export const c1 = {
  nome: 'A realidade brasileira', inicio: 0, fim: 15,
  criar(st) {
    const P = Array.from({ length: 8 }, (_, i) => passante(i + 90));
    const J = passante(99);
    return {
      desenhar(t) {
        if (t < 5) {
          // amanhecer no morro; ônibus lotado passando
          st.setCam(lerp(380, 700, t / 5), 1180, lerp(0.85, 1.0, t / 5));
          cidadeBR(st, t, { hora: lerp(0.3, 0.6, t / 5) });
          st.mundo(c => { onibus(c, lerp(-700, 1400, t / 5), 1700, 0.95, t, {}); });
          horaTela(st, '05:40');
          return;
        }
        if (t < 10) {
          // ponto de ônibus: trabalhadores esperando; o ônibus chega lotado
          st.setCam(560, 1280, 1.2);
          cidadeBR(st, t, { hora: 0.75, morro: 1 });
          st.mundo(c => {
            const chega = easeOut(clamp((t - 7.2) / 1.4));
            rrect(c, 60, 1180, 20, 520, 4, '#3a3a3a', { lw: 4 }); rrect(c, 20, 1140, 260, 60, 8, '#2a6ad0', { lw: 4 }); c.font = '900 30px Inter'; c.fillStyle = '#fff'; c.textAlign = 'center'; c.fillText('PONTO', 150, 1180);
            P.slice(0, 5).forEach((p, i) => { p.reset(); p.x = 160 + i * 150; p.y = 1700; p.s = 0.95; p.exp = i % 2 ? 'fechado' : 'normal'; p.boca = i === 2 ? 'o' : 'reta'; p.olhar = [-0.7, 0]; p.piscar = piscada(t, 3, i); p.maoD = i === 1 ? celular(1) : null; p.bracos(0.2, 0.2, i === 1 ? 0.8 : 0.2, i === 1 ? 2.2 : 0.2); p.squash = i === 2 ? win(t, 5.5, 5.8, 6.4, 6.8) * 0.04 : 0; if (chega > 0.95) { p.walk = t * 6; p.x += (t - 8.6) * 120; } p.draw(c, t); });
            onibus(c, lerp(1700, 640, chega), 1760, 1.0, t, { flip: -1 });
          });
          horaTela(st, '06:15');
          return;
        }
        // vendedor ambulante, trânsito e jovem procurando vaga no celular
        st.setCam(540, 1280, lerp(1.15, 1.3, (t - 10) / 5));
        cidadeBR(st, t, { hora: 0.9 });
        st.mundo(c => {
          barraca(c, 260, 1680, t);
          const V = P[5]; V.reset(); V.x = 420; V.y = 1700; V.flip = -1; V.exp = 'feliz'; V.boca = fala(t, true, 9) || 'sorriso'; V.olhar = [0.8, 0]; V.bracos(0.3, 0.2, 2.2 + Math.sin(t * 5) * 0.3, 0.4); V.draw(c, t);
          J.reset(); J.x = 800; J.y = 1700; J.flip = -1; J.maoD = celular(1); J.bracos(0.3, 0.2, 0.8, 2.2); J.olhar = [0, 0.8]; J.exp = 'preocupado'; J.boca = 'reta'; J.draw(c, t);
          const [hx, hy] = J.cabeca(); balaoFala(c, hx - 40, hy - 170, 340, 100, sstep(11.2, 11.5, t), { cauda: 1, texto: '🔎 vagas perto de mim', tam: 30, cor: '#e8f0ff' });
          for (let i = 0; i < 3; i++) { const x = ((t * 500 + i * 700) % 2400) - 800; rrect(c, x, 1760, 300, 90, 20, ['#e8c040', '#3a6ad0', '#d0d0d0'][i], { lw: 5 }); for (const wx of [x + 60, x + 240]) circle(c, wx, 1850, 26, '#1a1a1a', { lw: 4 }); }
        });
        horaTela(st, '07:30');
      },
    };
  },
};

// ---------- 2. Dois caminhos (cresceram juntos → tela dividida) ----------
export const c2 = {
  nome: 'Dois caminhos', inicio: 15, fim: 30,
  criar(st) {
    const L = lucasB(), R = rafael(), l = lucasB(), r = rafael();
    return {
      desenhar(t) {
        if (t < 18.6) {
          // infância: futebol na rua (lembrança em sépia)
          st.setCam(540, 1300, 1.2);
          cidadeBR(st, t, { hora: 0.9, morro: 1 });
          st.mundo(c => {
            const bx = 540 + Math.sin(t * 3) * 220, by = 1680 - Math.abs(Math.sin(t * 6)) * 120;
            l.reset(); l.s = 0.72; l.x = 300; l.y = 1720; l.walk = t * 9; l.exp = 'feliz'; l.boca = 'aberta'; l.olhar = [0.8, 0]; l.bracos(0.8, 0.4, 0.8, 0.4); l.draw(c, t);
            r.reset(); r.s = 0.72; r.x = 780; r.y = 1720; r.flip = -1; r.walk = t * 9 + 1; r.exp = 'feliz'; r.boca = 'aberta'; r.olhar = [0.8, 0]; r.bracos(0.8, 0.4, 0.8, 0.4); r.draw(c, t);
            circle(c, bx, by, 26, '#f6f2ea', { lw: 4 }); for (let i = 0; i < 5; i++) { const a = i / 5 * TAU + t * 6; circle(c, bx + Math.cos(a) * 12, by + Math.sin(a) * 12, 6, '#2b1f2a', { stroke: null }); }
            for (const x of [80, 1000]) { rrect(c, x - 8, 1560, 16, 160, 2, '#e8e0d0', { lw: 3 }); }
          });
          st.camada(0, c => { c.save(); c.globalCompositeOperation = 'multiply'; c.globalAlpha = 0.45; c.fillStyle = '#c8a070'; c.fillRect(0, 0, W, H); c.restore(); });
          st.text('ANOS ATRÁS', W / 2, 260, { size: 64, fill: '#ffe8b0', lw: 12, alpha: 0.9 });
          return;
        }
        // tela dividida: LUCAS em cima, RAFAEL embaixo
        const fase = t < 22.6 ? 0 : t < 26.4 ? 1 : 2;
        metade(st, 0, () => {
          L.reset(); L.piscar = piscada(t); L.cracha = true;
          if (fase === 0) { st.setCam(560, 1300, 1.25); escritorio(st, t); st.mundo(c => { L.x = 540; L.y = 1700; L.exp = 'feliz'; L.boca = 'sorriso'; L.olhar = [0.6, 0]; L.bracos(0.3, 0.2, lerp(0.3, 2.4, win(t, 19, 19.3, 20.3, 20.6)), 0.2); L.draw(c, t); }); }
          else if (fase === 1) { st.setCam(560, 1320, 1.4); quarto(st, t, { luz: 0.15 }); st.mundo(c => { L.cracha = false; L.x = 540; L.y = 1760; L.semPernas = true; L.exp = 'determinado'; L.boca = 'reta'; L.olhar = [0, 0.8]; L.maoD = caneta(); L.bracos(0.6, 2.0, 0.8 + Math.sin(t * 7) * 0.05, 2.0); L.draw(c, t); rrect(c, 240, 1580, 600, 34, 6, '#8a6a4a', { lw: 5 }); c.save(); c.translate(440, 1580); livro()(c); c.restore(); glow(c, 760, 1460, 200, '#ffe0a0', 0.5); rrect(c, 740, 1430, 40, 150, 4, '#3a3a3a', { lw: 3 }); }); }
          else { st.setCam(560, 1320, 1.4); quarto(st, t, { luz: 0.7 }); st.mundo(c => { L.cracha = false; L.x = 480; L.y = 1700; L.exp = 'feliz'; L.boca = 'sorriso'; L.olhar = [0.6, 0.5]; L.bracos(0.3, 0.2, 1.0, 1.0); L.draw(c, t); shape(c, c => c.ellipse(720, 1560, 80, 60, 0, 0, TAU), '#ff9ab0', { lw: 5 }); const u = ((t - 26.4) * 1.5) % 1; circle(c, lerp(600, 720, u), lerp(1450, 1500, u), 14, '#ffd23a', { lw: 3 }); }); }
        });
        metade(st, 1, () => {
          R.reset(); R.piscar = piscada(t, 3.2);
          if (fase === 0) { st.setCam(560, 1300, 1.25); cidadeBR(st, t, { hora: 0.9, morro: 0 }); st.mundo(c => { R.x = lerp(200, 800, (t - 18.6) / 4); R.y = 1700; R.walk = t * 4.5; R.maoD = caixa(); R.bracos(1.0, 1.6, 1.0, 1.6); R.exp = 'preocupado'; R.boca = 'reta'; R.suor = 1; R.olhar = [0.8, 0]; R.lean = 0.08; R.draw(c, t); const [lx, ly] = R.mao(-1), [rx, ry] = R.mao(1); c.save(); c.translate((lx + rx) / 2, (ly + ry) / 2); caixa()(c); c.restore(); }); }
          else if (fase === 1) { st.setCam(560, 1320, 1.4); quartoSimples(st, t, { luz: 0.3 }); st.mundo(c => { R.x = 460; R.y = 1700; R.exp = 'preocupado'; R.boca = 'triste'; R.olhar = [0, 0.8]; R.bracos(0.8, 1.6, 0.8, 1.6); R.draw(c, t); const [lx, ly] = R.mao(-1); for (let i = 0; i < 4; i++) circle(c, lx + 30 + i * 14, ly - 4, 12, '#d8b040', { lw: 2 }); }); }
          else { st.setCam(560, 1320, 1.4); quartoSimples(st, t, { luz: 0.2 }); st.mundo(c => { colchao(c, 520, 0.8); R.x = 520; R.y = 1620; R.semPernas = true; R.maoD = celular(1); R.bracos(0.3, 0.3, 0.8, 2.2); R.exp = 'normal'; R.boca = 'reta'; R.olhar = [0, 0.8]; R.headTilt = 0.08; R.draw(c, t); }); }
        });
        st.camada(0, c => { rrect(c, 0, 954, W, 12, 0, '#111', { stroke: null }); etiqueta(c, 'LUCAS', 30, 30, '#6ab0ff'); etiqueta(c, 'RAFAEL', 30, 990, '#ff7a6a'); });
      },
    };
  },
};

// ---------- 3. Quando o sucesso incomoda ----------
export const c3 = {
  nome: 'Quando o sucesso incomoda', inicio: 30, fim: 48,
  criar(st) {
    const L = lucasB(), R = rafael();
    return {
      desenhar(t) {
        L.reset(); R.reset(); L.piscar = piscada(t); R.piscar = piscada(t, 3.3);
        if (t < 34.4) {
          // Lucas e a primeira moto: selfie
          st.setCam(560, 1280, lerp(1.15, 1.3, (t - 30) / 4.4));
          cidadeBR(st, t, { hora: 1, morro: 1 });
          st.mundo(c => {
            moto(c, 700, 1720, 1, { brilho: Math.abs(Math.sin(t * 4)) });
            const self = sstep(31.8, 32.2, t);
            L.x = 400; L.y = 1700; L.exp = 'feliz'; L.boca = self > 0.5 ? 'sorriso' : 'aberta'; L.olhar = self > 0.5 ? [0.5, -0.4] : [0.8, 0.2]; L.maoD = self > 0.5 ? celular(1) : null; L.bracos(0.3, 0.2, self > 0.5 ? 2.5 : 0.6, self > 0.5 ? 0.3 : 0.6); L.jump = (1 - self) * Math.abs(Math.sin(t * 8)) * 16;
            L.draw(c, t);
            if (t > 33.0 && t < 33.3) glow(c, 540, 1300, 800, '#ffffff', 1 - (t - 33.0) / 0.3);
          });
          return;
        }
        if (t < 38) {
          // Rafael vê o post: o sorriso some
          st.setCam(520, 1260, lerp(1.5, 1.9, (t - 34.4) / 3.6));
          quartoSimples(st, t, { luz: 0.25 });
          st.mundo(c => {
            colchao(c, 520, 0.75);
            const muda = sstep(35.8, 36.4, t);
            R.x = 520; R.y = 1620; R.semPernas = true; R.maoD = celular(1); R.bracos(0.3, 0.3, 0.8, 2.2); R.olhar = [0, 0.8]; R.exp = muda > 0.5 ? 'raiva' : 'feliz'; R.boca = muda > 0.5 ? 'reta' : 'sorriso'; R.headTilt = muda * 0.05;
            R.draw(c, t); const [hx, hy] = R.cabeca(); glow(c, hx + 20, hy + 40, 240, '#9ad0ff', 0.35);
          });
          return;
        }
        // a tela do celular: post e comentários aparecendo; Rafael comenta também
        st.setCam(540, 960, 1);
        st.camada(0, c => {
          vgrad(c, 0, 0, W, H, [[0, '#14182a'], [1, '#202842']]); glow(c, 540, 900, 900, '#5a8aff', 0.2);
          post(c, 540, 600, 700, 'moto', { nome: 'lucas.oliveira', texto: '1ª moto! Muito trabalho 🙏', curtidas: 127 });
          const coms = [['joao_rj', 'Quero ver manter 😏', 38.6], ['dani.s', 'Deve ter conseguido por alguém', 39.8], ['mc_th', 'Tá se achando agora', 41.0], ['rafael_rr', 'nem é tudo isso kkk', 43.6]];
          coms.forEach(([u, txt, a0], i) => { const a = easeBack(clamp((t - a0) / 0.35)); if (a <= 0) return; c.save(); c.translate(540, 1170 + i * 120); c.scale(a, a); const meu = u === 'rafael_rr'; rrect(c, -440, -48, 880, 96, 20, meu ? '#ffe0dc' : '#ffffff', { lw: 4, stroke: meu ? '#d03a34' : '#2b1f2a' }); circle(c, -390, 0, 28, meu ? '#c8906a' : ['#e8b890', '#f2cfae', '#6a4a3a'][i % 3], { lw: 3 }); c.font = '800 30px Inter'; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillStyle = '#2b1f2a'; c.fillText(u, -345, -16); c.font = '600 34px Inter'; c.fillStyle = meu ? '#a02020' : '#4a4a5a'; c.fillText(txt, -345, 20); c.restore(); });
          if (t > 42.2 && t < 43.6) { const txt = 'nem é tudo isso kkk', n = Math.ceil(clamp((t - 42.3) / 1.0) * txt.length); rrect(c, 100, 1780, 880, 80, 40, '#ffffff', { lw: 4 }); c.font = '600 34px Inter'; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillStyle = '#2b1f2a'; c.fillText(txt.slice(0, n) + (Math.sin(t * 12) > 0 ? '|' : ''), 140, 1820); }
        });
        if (t > 45.4) {
          // close no rosto do Rafael depois de enviar: um incômodo
          st.setCam(520, 1260, 2.1);
          quartoSimples(st, t, { luz: 0.2 });
          st.mundo(c => { R.x = 520; R.y = 1620; R.semPernas = true; R.maoD = celular(1); R.bracos(0.3, 0.3, 0.8, 2.2); R.olhar = [0.6, 0.3]; R.exp = 'preocupado'; R.boca = 'reta'; R.draw(c, t); });
        }
      },
    };
  },
};

// ---------- 4. A armadilha da comparação ----------
export const c4 = {
  nome: 'A armadilha da comparação', inicio: 48, fim: 64.4,
  criar(st) {
    const R = rafael();
    const tipos = ['viagem', 'casa', 'formatura', 'carro', 'viagem', 'casa', 'carro', 'formatura', 'viagem', 'casa', 'formatura', 'carro', 'viagem', 'casa'];
    const textos = ['Cancún ✈️ merecido!', 'CASA PRÓPRIA 🏠🔑', 'FORMADA! 🎓', '0km, sonho realizado', 'Férias em família 🌴', 'Mudança nova 🏡', 'Meu primeiro carro!', 'Pós concluída 📚', 'Paris 🇫🇷', 'Reforma pronta ✨', 'Aprovado! 🎉', 'Carro novo 🚗', 'Viagem dos sonhos', 'Apê decorado'];
    const nomes = ['bia.costa', 'tio_marcos', 'carol.f', 'pedrinho', 'aline_s', 'gui.m', 'jessica', 'vini.rr', 'ana.b', 'leo_pk', 'mari', 'beto', 'lu.lima', 'kaique'];
    const R0 = rng(31); const pos = tipos.map(() => [140 + R0() * 800, 300 + R0() * 1300, (R0() - 0.5) * 0.4]);
    return {
      desenhar(t) {
        R.reset(); R.piscar = piscada(t, 3);
        if (t < 56) {
          // o feed vai enchendo a tela, cada vez mais rápido
          st.setCam(540, 960, 1);
          st.camada(0, c => {
            vgrad(c, 0, 0, W, H, [[0, '#101424'], [1, '#1a2036']]);
            const n = Math.floor(lerp(1, tipos.length, Math.pow(clamp((t - 48) / 7.6), 1.6)));
            for (let i = 0; i < n; i++) { const [x, y, rot] = pos[i]; const a0 = 48 + 7.6 * Math.pow(i / tipos.length, 1 / 1.6); post(c, x, y - (t - a0) * 40, 420, tipos[i], { nome: nomes[i], texto: textos[i], curtidas: 80 + i * 37, rot, a: sstep(a0, a0 + 0.2, t) }); }
            // o polegar rolando
            const u = (t * 2.2) % 1; c.save(); c.globalAlpha = 0.6; ellipse(c, 900, 1500 - u * 300, 60, 80, '#c8906a', { lw: 4 }); c.restore();
          });
          return;
        }
        // e a própria realidade
        const k = clamp((t - 56) / 8.4);
        st.setCam(lerp(520, 540, k), lerp(1240, 1230, k), lerp(2.0, 1.1, easeInOut(k)));
        quartoSimples(st, t, { luz: 0.2 });
        st.mundo(c => {
          colchao(c, 520, 0.8);
          const larga = sstep(58.6, 59.0, t), critica = win(t, 60.4, 60.6, 62.8, 63.2);
          R.x = 520; R.y = 1620; R.semPernas = true; R.olhar = larga > 0.5 && critica < 0.5 ? [Math.sin(t * 1.3) * 0.9, -0.2] : [0, 0.8];
          R.exp = critica > 0.5 ? 'raiva' : (larga > 0.5 ? 'preocupado' : 'raiva'); R.boca = critica > 0.5 ? 'dentes' : 'triste';
          R.maoD = (larga < 0.5 || critica > 0.3) ? celular(1) : null; R.bracos(0.3, 0.3, (larga < 0.5 || critica > 0.3) ? 0.8 : 0.4, (larga < 0.5 || critica > 0.3) ? 2.2 : 1.5);
          R.draw(c, t);
          if (larga > 0.5 && critica < 0.3) rrect(c, 640, 1530, 50, 28, 6, '#1a1a22', { lw: 3 });
          const [hx, hy] = R.cabeca();
          ['que inveja nada...', 'até parece', 'comprou parcelado kkk'].forEach((txt, i) => balaoFala(c, hx + [-120, 160, 0][i], hy - [160, 230, 330][i], 330, 84, win(t, 60.6 + i * 0.6, 60.8 + i * 0.6, 63.0, 63.3), { cauda: [1, -1, 1][i], texto: txt, tam: 28, cor: '#ffe0dc' }));
        });
      },
    };
  },
};

// ---------- 5. A reflexão ----------
export const c5 = {
  nome: 'A reflexão', inicio: 64.4, fim: 79.2,
  criar(st) {
    const L = lucasB(), R = rafael(), Rr = rafael();
    return {
      desenhar(t) {
        L.reset(); R.reset(); L.piscar = piscada(t); R.piscar = piscada(t, 3.4);
        if (t < 71.2) {
          // Lucas chega de moto e pergunta por que o amigo sumiu
          const chega = easeOut(clamp((t - 64.4) / 1.6)), desce = sstep(66.2, 66.8, t);
          st.setCam(lerp(600, 560, chega), 1280, lerp(1.15, 1.35, sstep(67, 69, t)));
          cidadeBR(st, t, { hora: 0.55, morro: 1 });
          st.mundo(c => {
            R.x = 320; R.y = 1700; R.exp = sstep(68.4, 68.8, t) > 0.5 ? 'preocupado' : 'normal'; R.boca = 'reta'; R.olhar = sstep(69.6, 70.0, t) > 0.5 ? [0, 0.8] : [0.8, 0]; R.bracos(0.2, 0.2, 0.2, 0.2);
            const mx = lerp(1400, 820, chega);
            moto(c, mx, 1720, 1, { flip: -1 });
            L.x = desce > 0.5 ? lerp(800, 620, clamp((t - 66.8) / 0.8)) : mx - 40; L.y = desce > 0.5 ? 1700 : 1600; L.semPernas = desce < 0.5; L.flip = -1; if (t > 66.8 && t < 67.6) L.walk = t * 6;
            L.exp = 'feliz'; L.boca = fala(t, t > 67.6 && t < 69.4) || 'sorriso'; L.olhar = [0.8, 0]; L.maoD = desce > 0.5 ? capacete() : null; L.bracos(0.3, 0.2, desce > 0.5 ? 0.8 : 1.3, desce > 0.5 ? 1.6 : 0.4);
            if (desce < 0.5) { L.d.capa = null; }
            R.draw(c, t); L.draw(c, t);
            if (desce < 0.5) { const [hx, hy] = L.cabeca(); c.save(); c.translate(hx, hy + 30); capacete()(c); c.restore(); }
            const [lx, ly] = L.cabeca(), [rx, ry] = R.cabeca();
            balaoFala(c, lx + 20, ly - 180, 420, 110, win(t, 67.6, 67.8, 69.6, 69.9), { cauda: 1, texto: 'E aí, mano? Sumiu...', tam: 34 });
            balaoFala(c, rx + 40, ry - 170, 160, 90, win(t, 70.0, 70.2, 71.0, 71.2), { cauda: -1, texto: '...', tam: 44 });
          });
          return;
        }
        // Rafael sozinho, o reflexo na janela; a câmera se afasta
        const k = easeInOut(clamp((t - 71.2) / 8));
        st.setCam(lerp(680, 600, k), lerp(1050, 1150, k), lerp(2.0, 0.9, k));
        quartoSimples(st, t, { luz: 0.05 });
        st.camada(0.9, c => {
          c.save(); c.beginPath(); c.rect(600, 460, 300, 340); c.clip();
          vgrad(c, 600, 460, 300, 340, [[0, '#0a1020'], [1, '#1a2440']]); for (let i = 0; i < 20; i++) { c.fillStyle = 'rgba(255,216,144,0.8)'; c.fillRect(610 + (i * 47) % 280, 620 + (i * 31) % 160, 6, 8); }
          Rr.reset(); Rr.x = 760; Rr.y = 900; Rr.s = 0.7; Rr.flip = -1; Rr.alpha = 0.3; Rr.exp = 'preocupado'; Rr.boca = 'reta'; Rr.olhar = [0, 0.1]; Rr.draw(c, t);
          c.restore(); line(c, [[750, 460], [750, 800]], '#2b1f2a', 6);
        });
        st.mundo(c => { R.x = 640; R.y = 1700; R.exp = 'preocupado'; R.boca = 'reta'; R.olhar = [0.6, -0.6]; R.bracos(0.2, 0.2, 0.2, 0.2); R.draw(c, t); });
      },
    };
  },
};

// ---------- 6. O primeiro passo ----------
export const c6 = {
  nome: 'O primeiro passo', inicio: 79.2, fim: 87.8,
  criar(st) {
    const R = rafael();
    return {
      desenhar(t) {
        R.reset(); R.piscar = piscada(t, 3.8);
        const guarda = sstep(79.8, 80.6, t), abre = sstep(81.4, 82.0, t), escreve = t > 82.4;
        st.setCam(lerp(520, 560, (t - 79.2) / 8.6), 1320, lerp(1.6, 1.45, (t - 79.2) / 8.6));
        quartoSimples(st, t, { luz: 0.35 });
        st.mundo(c => {
          glow(c, 760, 1440, 300, '#ffe0a0', 0.6); rrect(c, 740, 1420, 40, 160, 4, '#3a3a3a', { lw: 3 });
          R.x = 520; R.y = 1760; R.semPernas = true; R.olhar = escreve ? [0, 0.9] : [0.4, 0.6]; R.exp = escreve ? 'determinado' : 'preocupado'; R.boca = 'reta';
          R.maoD = guarda < 0.5 ? celular(1) : (escreve ? caneta() : null); R.bracos(0.6, 2.0, guarda < 0.5 ? lerp(0.8, 1.4, guarda * 2) : (escreve ? 0.8 + Math.sin(t * 7) * 0.05 : 0.6), guarda < 0.5 ? 2.2 : (escreve ? 1.9 : 1.8));
          R.draw(c, t);
          rrect(c, 200, 1580, 680, 34, 6, '#8a6a4a', { lw: 5 });
          // gaveta onde o celular fica
          rrect(c, 640, 1614, 200, 70, 4, '#7a5a3a', { lw: 4 });
          // caderno abrindo
          c.save(); c.translate(460, 1574); const w = lerp(90, 200, abre); rrect(c, -w / 2, -50, w, 56, 4, '#f6f2ea', { lw: 4 }); if (abre > 0.5) line(c, [[0, -50], [0, 6]], '#c8c0b0', 3); if (escreve) { const n = clamp((t - 82.4) / 4); for (let i = 0; i < 3; i++) { const u = clamp(n * 3 - i); if (u > 0) line(c, [[-w / 2 + 16, -36 + i * 14], [-w / 2 + 16 + (w / 2 - 30) * u, -36 + i * 14]], '#2a4ab0', 3); } } c.restore();
        });
      },
    };
  },
};
