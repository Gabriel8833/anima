// "Imagine ter um irmão que é um encosto profissional" — versão 2D (mesmos tempos da narração-guia)
import { TAU, lerp, clamp, sstep, win, easeInOut, easeOut, easeBack, rng, shake, impulse } from '../../../motor/base.js';
import { glow, rrect, line, circle, ellipse, poly, vgrad, shape, sparkle, cloud } from '../../../motor/desenho.js';
import { lucasE, pedroE, maeE, vassoura2, pano2, balde2, sacoLixo2, chips2, celular, lagrima } from '../../../personagens/elenco.js';
import { salaDia, sofaDia, roupasChao, cozinha2d, copoPia, raiosEpicos, lixeira, bairro } from '../../../cenarios/lugares.js';

const TEMPOS = await (await fetch(new URL('../tempos.json', import.meta.url))).json();
const falando = (t, quem) => TEMPOS.falas.some(f => f.quem === quem && t >= f.inicio && t < f.fim - 0.05);
const boca = (t, quem, base = 'reta') => (falando(t, quem) ? (Math.sin(t * 13) > -0.2 ? (quem === 'Pedro' ? 'aberta' : 'grito') : 'aberta') : base);
const piscada = (t, f = 3.5, o = 0) => (((t + o) % f) < 0.13 ? 1 : 0);
// deitado no sofá (cabeça à esquerda)
function deitado(c, P, t, x, y) { c.save(); c.translate(x, y); c.rotate(-Math.PI / 2); P.x = 0; P.y = 0; P.draw(c, t); c.restore(); }
function poeira(c, x, y, t, a) { if (a <= 0.01) return; for (let i = 0; i < 10; i++) { const u = (t * 0.7 + i / 10) % 1; cloud(c, x + Math.sin(i * 5.1) * (40 + u * 220), y - u * 260, 40 + u * 70, `rgba(190,160,120,${0.55 * a * (1 - u)})`, { seed: i }); } }

// ---------- 1. A desgraça começa ----------
export const c1 = {
  inicio: 0, fim: 11.0,
  criar(st) {
    const L = lucasE(), Pd = pedroE();
    return {
      desenhar(t) {
        const u = (t * 0.42) % 2, ida = u < 1, x = ida ? lerp(-150, 1150, u) : lerp(1150, -150, u - 1);
        st.setCam(lerp(420, 640, sstep(5, 10, t)), 1260, lerp(1.0, 1.15, t / 11), 0, shake(t, 0.08));
        salaDia(st, t);
        st.mundo(c => {
          roupasChao(c); sofaDia(c, 640);
          // Pedro deitado comendo salgadinho e vendo TV
          Pd.reset(); Pd.exp = 'feliz'; Pd.boca = Math.sin(t * 7) > 0 ? 'aberta' : 'sorriso'; Pd.olhar = [0.9, -0.3]; Pd.piscar = piscada(t); Pd.maoE = chips2(); Pd.bracos(0.3, 0.3, 1.0 + Math.max(0, Math.sin(t * 2.2)) * 0.6, 1.9); Pd.headTilt = 0.4;
          deitado(c, Pd, t, 880, 1415);
          // Lucas correndo com vassoura e pano
          L.reset(); L.x = x; L.y = 1720; L.flip = ida ? 1 : -1; L.walk = t * 15; L.lean = 0.12 * L.flip; L.maoD = vassoura2(); L.maoE = pano2(); L.bracos(1.0 + Math.sin(t * 18) * 0.5, 0.6, 0.5, 0.6); L.exp = 'preocupado'; L.boca = 'aberta'; L.suor = 1; L.olhar = [L.flip * 0.8, 0]; L.piscar = piscada(t, 3, 1);
          L.draw(c, t);
        });
      },
    };
  },
};

// ---------- 2. O copo maldito ----------
export const c2 = {
  inicio: 11.0, fim: 23.9,
  criar(st) {
    const L = lucasE(), Me = maeE();
    return {
      desenhar(t) {
        const crime = sstep(12.6, 13.0, t);
        let cam = [540, 1250, 1.1], shk = [0, 0];
        if (t > 12.4 && t < 14.3) { const k = easeInOut(clamp((t - 12.4) / 1.4)); cam = [lerp(540, 270, k), lerp(1250, 1180, k), lerp(1.1, 2.8, k)]; }
        L.reset(); L.x = 520; L.y = 1720; L.piscar = piscada(t);
        if (t > 16.9) { const [hx, hy] = L.cabeca(); cam = [hx, hy + 120, 2.3]; shk = shake(t, t > 18.1 ? 0.45 : 0.1); }
        st.setCam(cam[0], cam[1], cam[2], 0, shk);
        cozinha2d(st, t);
        st.mundo(c => {
          const sat = sstep(11.1, 11.5, t) * (1 - sstep(12.5, 12.8, t));
          if (t < 12.6) for (let i = 0; i < 6; i++) sparkle(c, -100 + i * 180, 1150 + (i % 2) * 120, 26, '#ffffff', Math.abs(Math.sin(t * 9 + i)));
          copoPia(c, 270, 1238, crime * (1 - sstep(14.2, 14.6, t)), t);
          // mãe entra brava
          Me.reset(); Me.x = lerp(1250, 800, easeOut(clamp((t - 11.6) / 1.0))); Me.y = 1720; Me.flip = -1; if (t < 12.6) Me.walk = t * 8;
          const aponta = t > 12.4 && t < 14.2; Me.bracos(aponta ? 0.3 : 0.6, aponta ? 0.2 : 2.2, aponta ? 1.55 : 0.6, aponta ? 0.05 : 2.2); Me.exp = 'raiva'; Me.boca = boca(t, 'Mãe', 'reta'); Me.olhar = [0.9, aponta ? 0.4 : 0]; Me.piscar = piscada(t, 4, 1);
          Me.draw(c, t);
          // Lucas: orgulhoso, depois "é um copo", depois olhos arregalados
          const arregala = t > 16.9;
          L.exp = arregala ? 'choque' : (sat > 0.5 ? 'feliz' : 'preocupado'); L.boca = boca(t, 'Lucas', arregala ? 'tremendo' : (sat > 0.5 ? 'sorriso' : 'reta')); L.olhar = arregala ? [0, 0] : [0.8, 0];
          L.bracos(sat > 0.5 ? 0.3 : 0.3, sat > 0.5 ? 2.3 : 0.2, arregala ? 2.4 : 0.3, arregala ? 0.3 : 0.2); if (arregala) L.bracoE = { a: 2.4, b: 0.3 }; L.tremor = arregala ? 0.3 : 0;
          L.draw(c, t);
        });
      },
    };
  },
};

// ---------- 3. O milagre de Pedro ----------
export const c3 = {
  inicio: 23.9, fim: 48.6,
  criar(st) {
    const Pd = pedroE(), Me = maeE(), L = lucasE();
    return {
      desenhar(t) {
        if (t < 30.4) {
          // levanta como um idoso de 300 anos
          const lev = sstep(26.6, 28.6, t), anda = clamp((t - 28.8) / 1.6);
          st.setCam(lerp(700, 520, anda), 1270, 1.2);
          salaDia(st, t);
          st.mundo(c => {
            sofaDia(c, 640);
            Me.reset(); Me.x = 1000; Me.y = 1720; Me.flip = -1; Me.maoD = t < 27 ? sacoLixo2() : null; Me.bracos(0.6, 2.2, t < 27 ? 0.3 : 0.6, t < 27 ? 0.3 : 2.2); Me.exp = 'normal'; Me.boca = boca(t, 'Mãe'); Me.olhar = [0.9, 0.3]; Me.draw(c, t);
            Pd.reset(); Pd.piscar = piscada(t); Pd.exp = 'preocupado'; Pd.boca = lev > 0 && lev < 1 ? 'tremendo' : 'reta'; Pd.olhar = [0.6, 0.3];
            if (lev <= 0) { Pd.maoE = chips2(); Pd.bracos(0.3, 0.3, 1.0, 1.9); deitado(c, Pd, t, 880, 1415); }
            else { Pd.x = lerp(700, lerp(700, -100, anda), lev); Pd.y = lerp(1450, 1720, lev); Pd.lean = 0.35 * lev; Pd.tremor = lev < 1 ? 0.5 : 0.2; Pd.squash = 0.05; Pd.maoD = t > 27.6 ? sacoLixo2() : null; Pd.bracos(0.6, 1.5, 0.2, 0.2); if (anda > 0 && anda < 1) { Pd.walk = t * 3; Pd.flip = -1; } Pd.draw(c, t); }
          });
          return;
        }
        // lá fora: joga o lixo e vira herói (raios, câmera girando)
        const joga = sstep(30.9, 31.3, t);
        let cam = [540, 1260, 1.15], rot = 0, shk = [0, 0];
        if (t < 33.4) { rot = Math.sin((t - 30.4) / 3 * TAU) * 0.25; cam = [540, 1300, 1.25 + Math.sin((t - 30.4) * 2) * 0.1]; }
        else if (t < 37.4) cam = [380, 1270, 1.5];
        else if (t > 42.0 && t < 44.6) cam = [620, 1290, 1.5];
        else { cam = [460, 1280, 1.25]; shk = shake(t, falando(t, 'Lucas') ? 0.2 : 0); }
        st.setCam(cam[0], cam[1], cam[2], rot, shk);
        bairro(st, t, { sol: 0.7 });
        st.camada(0, c => raiosEpicos(c, 540, 820, t, win(t, 30.9, 31.2, 36.8, 37.3)));
        st.mundo(c => {
          lixeira(c, 820, 1700);
          if (joga > 0.5) { c.save(); c.translate(lerp(700, 820, joga), lerp(1450, 1540, joga)); sacoLixo2()(c); c.restore(); }
          // mãe emocionada na porta
          Me.reset(); Me.x = 180; Me.y = 1700; Me.flip = 1; Me.bracos(0.9, 2.0, 0.9, 2.0); Me.exp = 'feliz'; Me.boca = boca(t, 'Mãe', 'sorriso'); Me.olhar = [0.8, 0]; Me.piscar = piscada(t, 3.6); if (t > 33.2 && t < 37.2) { Me.draw(c, t); if (t > 33.6 && t < 37) { lagrima(c, Me, t, 1, 1); lagrima(c, Me, t + 0.3, 1, -1); } }
          // Pedro herói
          Pd.reset(); Pd.x = 600; Pd.y = 1720; Pd.piscar = piscada(t, 3.2); Pd.maoD = joga < 0.5 ? sacoLixo2() : null;
          if (joga < 0.5) Pd.bracos(0.3, 0.3, lerp(0.3, 1.8, sstep(30.5, 30.9, t)), 0.2); else Pd.bracos(0.3, 2.4, 0.3, 2.4);
          Pd.exp = t > 42 ? 'determinado' : 'feliz'; Pd.boca = boca(t, 'Pedro', 'sorriso'); Pd.olhar = t > 37.4 ? [-0.8, 0] : [0, -0.1]; Pd.headTilt = -0.08;
          Pd.draw(c, t); if (joga > 0.5 && t < 37) for (let i = 0; i < 5; i++) sparkle(c, 600 + Math.cos(t * 2 + i) * 170, 1380 + Math.sin(t * 2 + i * 1.3) * 120, 24, '#fff6c0', Math.abs(Math.sin(t * 5 + i)));
          // Lucas chega com três baldes (um na cabeça) e grita
          if (t > 36.8) { L.reset(); L.x = lerp(-200, 260, clamp((t - 36.8) / 0.8)); L.y = 1720; if (t < 37.6) L.walk = t * 9; L.maoE = balde2(); L.maoD = balde2(); const g = falando(t, 'Lucas'); L.bracos(0.5 + (g ? Math.abs(Math.sin(t * 6)) * 0.5 : 0), 0.4, 0.5 + (g ? Math.abs(Math.sin(t * 6 + 1)) * 0.5 : 0), 0.4); L.exp = 'raiva'; L.boca = boca(t, 'Lucas', 'dentes'); L.olhar = [0.9, 0]; L.draw(c, t); const [hx, hy] = L.cabeca(); c.save(); c.translate(hx, hy - 90); c.rotate(Math.PI + 0.15); balde2()(c); c.restore(); }
        });
      },
    };
  },
};

// ---------- 4. A revolução ----------
export const c4 = {
  inicio: 48.6, fim: 74,
  criar(st) {
    const L = lucasE(), Pd = pedroE(), Me = maeE();
    return {
      desenhar(t) {
        const varrendo = t > 62.9, jogou = sstep(48.7, 49.4, t);
        let cam = [600, 1290, 1.2], shk = [0, 0];
        if (falando(t, 'Lucas') && t < 63) { cam = [470, 1240, 1.6]; shk = shake(t, t > 59 ? 0.3 : 0); }
        else if (falando(t, 'Pedro')) cam = [760, 1240, 1.6];
        else if (varrendo) cam = [lerp(600, 560, (t - 63) / 11), 1300, lerp(1.2, 1.05, (t - 63) / 11)];
        st.setCam(cam[0], cam[1], cam[2], 0, shk);
        salaDia(st, t);
        st.mundo(c => {
          sofaDia(c, 640);
          if (jogou >= 1) { c.save(); c.translate(300, 1700); balde2()(c); c.restore(); c.save(); c.translate(380, 1720); pano2()(c); c.restore(); }
          // Pedro: sentado no sofá; depois varre levantando poeira
          Pd.reset(); Pd.piscar = piscada(t, 3.1);
          if (!varrendo) { Pd.x = 800; Pd.y = 1560; Pd.semPernas = true; Pd.maoD = t > 56.5 && t < 59 ? null : celular(1); Pd.bracos(t > 56.5 && t < 59 ? 2.6 : 0.3, t > 56.5 && t < 59 ? 1.8 : 0.3, t > 56.5 && t < 59 ? 2.6 : 0.8, t > 56.5 && t < 59 ? 1.8 : 2.2); Pd.exp = t > 52 ? 'medo' : 'normal'; Pd.boca = boca(t, 'Pedro', t > 52 ? 'tremendo' : 'reta'); Pd.olhar = t > 52 ? [-0.8, 0] : [0, 0.6]; Pd.suor = t > 56 ? 1 : 0; Pd.jump = impulse(t, 56.5, 40, 0.3); }
          else { Pd.x = 560 + Math.sin(t * 1.5) * 260; Pd.y = 1720; Pd.flip = Math.cos(t * 1.5) > 0 ? 1 : -1; Pd.walk = t * 6; Pd.maoD = vassoura2(); const v = Math.sin(t * 9); Pd.bracos(0.6 + v * 0.3, 0.8, 0.6 - v * 0.3, 0.8); Pd.exp = 'preocupado'; Pd.boca = 'tremendo'; Pd.suor = 1; Pd.olhar = [0, 0.7]; }
          // Lucas: larga tudo, se joga no sofá, come o salgadinho; no fim, comemora
          L.reset(); L.piscar = piscada(t, 3.4);
          if (jogou < 1) { L.x = lerp(300, 480, jogou); L.y = lerp(1720, 1560, jogou) - Math.sin(jogou * Math.PI) * 120; L.maoE = jogou < 0.3 ? balde2() : null; L.maoD = jogou < 0.3 ? pano2() : null; L.bracos(2.4, 0.3, 2.4, 0.3); }
          else { L.x = 480; L.y = 1560; L.semPernas = true; L.maoD = t > 52 ? chips2() : null; if (varrendo) L.bracos(2.5, 0.4, 2.5, 0.4); else L.bracos(0.5, 2.3, t > 52 ? 1.0 : 0.5, t > 52 ? 1.9 : 2.3); }
          const grito = falando(t, 'Lucas') && t > 59;
          L.exp = grito ? 'raiva' : (varrendo || (t > 52 && t < 56.3) ? 'feliz' : 'determinado'); L.boca = boca(t, 'Lucas', varrendo ? 'sorriso' : (t > 52 ? 'sorrisoMal' : 'reta')); L.olhar = t > 56.5 ? [0.9, 0] : [0.7, 0];
          L.draw(c, t);
          poeira(c, Pd.x, 1700, t, varrendo ? 1 : 0);
          if (varrendo) Pd.draw(c, t);
          else { /* Pedro no sofá desenhado antes do Lucas para ficar ao lado */ }
          if (!varrendo) Pd.draw(c, t);
          // mãe furiosa
          if (t < 63) { Me.reset(); Me.x = 1080; Me.y = 1720; Me.flip = -1; Me.bracos(0.6, 2.2, 0.6, 2.2); Me.exp = 'raiva'; Me.boca = boca(t, 'Mãe'); Me.olhar = [0.9, 0]; Me.piscar = piscada(t, 4); Me.draw(c, t); }
        });
      },
    };
  },
};
