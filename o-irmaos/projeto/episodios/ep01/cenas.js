// "O filho que faz tudo... e o que não faz nada" — 6 cenas 3D. Bocas mexem só nos intervalos de cada fala (tempos.json).
import { THREE, V, lerp, clamp, sstep, win, easeInOut, easeOut, glowSprite, shake, impulse, rng } from '../../motor/base.js';
import { lucas, pedro, mae, rosto, resetPose, walk, idle, pose, P, sentar, segurar, vassoura, pilhaRoupa, sacoLixo, celular, balde, pano, salgadinho, medalha, pao, M } from '../../motor/familia.js';
import { sala, cozinha, quintal, frente, palco } from '../../motor/casa.js';

const TEMPOS = await (await fetch(new URL('./tempos.json', import.meta.url))).json();
const fala = (t, quem) => (TEMPOS.falas.some(f => f.quem === quem && t >= f.inicio && t < f.fim - 0.05) ? 1 : 0);
const pos = (h, x, z, ry = 0, y = 0) => { h.root.position.set(x, y, z); h.root.rotation.set(0, ry, 0); };
const cam = (st, p, a, fov = 40, roll = 0, shk = [0, 0]) => st.cam(p, a, fov, roll, shk);
const lerp3 = (a, b, k) => a.map((v, i) => lerp(v, b[i], k));
function confete(sc, n = 80) { const r = rng(7), cores = [0xff4a6a, 0xffd23a, 0x4ab0ff, 0x6ad08a, 0xffffff]; const list = []; for (let i = 0; i < n; i++) { const m = new THREE.Mesh(new THREE.PlaneGeometry(0.05, 0.03), new THREE.MeshBasicMaterial({ color: cores[i % 5], side: THREE.DoubleSide })); m.userData = { x: (r() - 0.5) * 4, z: (r() - 0.5) * 2, v: 0.6 + r(), f: r() * 6 }; sc.add(m); list.push(m); } return (t, cx, cz, a = 1) => list.forEach(m => { const u = m.userData, y = 3.2 - ((t * u.v + u.f) % 3.4); m.visible = a > 0; m.position.set(cx + u.x + Math.sin(t * 2 + u.f) * 0.2, y, cz + u.z); m.rotation.set(t * 3 + u.f, t * 2, 0); }); }
function estrelas(sc, n = 10) { const list = []; for (let i = 0; i < n; i++) { const s = glowSprite(0xffe08a, 0.3, 1); sc.add(s); list.push(s); } return (t, c, a = 1) => list.forEach((s, i) => { const an = t * 1.5 + i * 0.63; s.visible = a > 0.01; s.position.set(c.x + Math.cos(an) * 0.7, c.y + Math.sin(an * 1.3) * 0.4, c.z + Math.sin(an) * 0.3); s.material.opacity = a * (0.6 + 0.4 * Math.sin(t * 8 + i)); }); }

// ---------- 1. Apresentação (tela dividida) ----------
export const c1 = {
  inicio: 0, fim: 20.9,
  criar(st) {
    const sc = new THREE.Scene(); const S = sala(sc, { migalhas: 1 });
    const L = lucas(), Pd = pedro(), Me = mae(); sc.add(L.root, Pd.root, Me.root);
    const vas = vassoura(), roupa = pilhaRoupa(), cel = celular(), chips = salgadinho();
    roupa.position.set(0, -0.05, 0.22); L.torso.add(roupa);
    return {
      atualizar(t) {
        // LUCAS (esquerda): varre cansado; depois carrega a pilha de roupas
        resetPose(L); const comRoupa = t > 15.8;
        pos(L, -1.9, -0.4, 0.25);
        if (!comRoupa) { segurar(L, 'R', vas); const v = Math.sin(t * 3.2); pose(L, { shR: [-0.45 + v * 0.1, 0.3, 0.15], elR: [-0.6, 0, 0], shL: [-0.75 + v * 0.1, 0, 0.35], elL: [-0.5, 0, 0], torso: [0.15, v * 0.12, 0] }); vas.rotation.set(0.5, 0, v * 0.15); roupa.visible = false; }
        else { segurar(L, 'R', null); roupa.visible = true; pose(L, P.carregar); walk(L, t * 6, sstep(15.8, 16.2, t) * (1 - sstep(16.9, 17.1, t)) * 0.6); }
        idle(L, t);
        const bocejo = win(t, 4.0, 4.4, 5.2, 5.6);
        rosto(L, t, { olhar: comRoupa && t > 17 ? [0.8, 0] : [0.2, -0.3], fala: fala(t, 'Lucas'), preoc: 0.5, fechado: bocejo * 0.8 });
        if (bocejo > 0) L.mouthOpen.scale.set(0.9, 0.12 + bocejo * 1.3, 0.4);
        // PEDRO (direita): deitado no sofá, celular e salgadinho
        resetPose(Pd); Pd.root.position.set(1.75, 0.66, -1.95); Pd.root.rotation.set(0, 0, Math.PI / 2 - 0.05);
        Pd.hipL.rotation.x = -0.5; Pd.knL.rotation.x = 0.8; Pd.hipR.rotation.x = -0.2; Pd.knR.rotation.x = 0.3;
        Pd.head.rotation.set(0, 0.35, -1.25);
        segurar(Pd, 'R', cel); segurar(Pd, 'L', chips);
        pose(Pd, { shR: [-1.3, 0, 0.6], elR: [-1.2, 0, 0], shL: [-0.9 - Math.max(0, Math.sin(t * 2.2)) * 0.6, 0, -0.2], elL: [-1.6, 0, 0] });
        const pergunta = fala(t, 'Pedro');
        rosto(Pd, t, { olhar: pergunta ? [0.6, 0.6] : [-0.2, -0.6], fala: pergunta, sorriso: pergunta ? 0 : 0.5 + 0.3 * Math.sin(t * 0.7) });
        // MÃE: aparece ao fundo, na porta da cozinha, só para responder
        const veMae = win(t, 14.3, 14.7, 16.9, 17.3); Me.root.visible = veMae > 0.01; resetPose(Me); pos(Me, 3.7, -2.7, -0.4); pose(Me, P.cintura); idle(Me, t);
        rosto(Me, t, { olhar: [-0.8, 0], fala: fala(t, 'Mãe') });
        S.tv.userData.tela.material.color.setHSL((t * 0.2) % 1, 0.6, 0.6);
        S.ventilador.userData.pas.rotation.z = t * 20;
        // câmera: tela dividida (cada irmão com sua câmera); depois do pedido de ajuda, fecha no Lucas
        const k = easeInOut(clamp(t / 12));
        if (t < 17.2) {
          // lado esquerdo: Lucas
          cam(st, lerp3([-1.4, 1.6, 3.4], [-1.6, 1.6, 2.4], k), [-1.85, 1.25, -0.4], 46);
          st.renderer.render(sc, st.camera);
          if (!st.metade) { st.metade = document.createElement('canvas'); }
          const src = st.renderer.domElement; st.metade.width = src.width / 2; st.metade.height = src.height;
          st.metade.getContext('2d').drawImage(src, src.width / 4, 0, src.width / 2, src.height, 0, 0, src.width / 2, src.height);
          st.metadeAte = 17.2;
          // lado direito: Pedro (renderizado pelo motor)
          cam(st, lerp3([1.25, 1.4, 1.6], [1.0, 1.25, 0.9], k), [0.95, 0.95, -2.1], 46);
        } else {
          const q = easeInOut(clamp((t - 17.2) / 3.2));
          cam(st, lerp3([-0.6, 1.6, 4.4], [-1.75, 1.85, 1.1], q), lerp3([-1.2, 1.3, -0.6], [-1.9, 1.85, -0.4], q), 44);
        }
        return sc;
      },
    };
  },
};

// ---------- 2. O filho que faz tudo (montagem + o copo) ----------
export const c2 = {
  inicio: 20.9, fim: 51.6,
  criar(st) {
    const scC = new THREE.Scene(); const C = cozinha(scC, { louca: 1 });
    const scS = new THREE.Scene(); const S = sala(scS, { migalhas: 1 });
    const scQ = new THREE.Scene(); const Q = quintal(scQ);
    const LC = lucas(), LS = lucas(), LQ = lucas(), Me = mae(); scC.add(LC.root, Me.root); scS.add(LS.root); scQ.add(LQ.root);
    const clones = [lucas(), lucas(), lucas()]; clones.forEach(c => scC.add(c.root));
    const vas = vassoura(), saco = sacoLixo(), pn = pano(), pn2 = pano(), roupaPeca = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.5), M(0x4a8ad0, { side: THREE.DoubleSide }));
    const brilhos = [0, 1, 2, 3, 4, 5].map(() => { const s = glowSprite(0xffffff, 0.25, 1); scC.add(s); return s; });
    const T = [21.1, 22.75, 24.4, 26.05, 27.7, 29.35, 31.0];
    return {
      atualizar(t) {
        let tarefa = -1; for (let i = 0; i < 6; i++) if (t >= T[i] && t < T[i + 1]) tarefa = i;
        const rap = t * 2.4; // tudo acelerado
        if (tarefa === 1 || tarefa === 2 || tarefa === 3) {
          // sala: varrer, tirar o lixo, arrumar
          resetPose(LS); segurar(LS, 'R', null); segurar(LS, 'L', null);
          if (tarefa === 1) { pos(LS, 0.6 + Math.sin(rap * 3) * 1.2, -0.6, 0.3); segurar(LS, 'R', vas); const v = Math.sin(rap * 5); pose(LS, { shR: [-0.45 + v * 0.15, 0.3, 0.15], elR: [-0.6, 0, 0], shL: [-0.75, 0, 0.35], elL: [-0.5, 0, 0], torso: [0.18, v * 0.2, 0] }); walk(LS, rap * 4, 0.6); vas.rotation.set(0.5, 0, v * 0.25); S.migalhas.forEach((m, i) => m.visible = i / 40 > (t - T[1]) / 1.5); }
          if (tarefa === 2) { const u = (t - T[2]) / 1.65; pos(LS, lerp(-2.5, 3.8, u), -0.4, Math.PI / 2); segurar(LS, 'R', saco); walk(LS, rap * 5, 1, 0.8); }
          if (tarefa === 3) { pos(LS, 0.6, 0.2, Math.sin(rap * 2) * 0.6); pose(LS, { shL: [-1.2 - Math.sin(rap * 6) * 0.5, 0, -0.3], shR: [-1.2 + Math.sin(rap * 6) * 0.5, 0, 0.3], elL: [-0.5, 0, 0], elR: [-0.5, 0, 0], torso: [0.3, 0, 0] }); }
          rosto(LS, t, { olhar: [0, 0.2], preoc: 0.3, sorriso: 0.2 });
          S.ventilador.userData.pas.rotation.z = t * 20;
          cam(st, [0.6, 1.6, 5.4], [0.6, 1.0, -0.8], 44, 0, shake(t, 0.05));
          return scS;
        }
        if (tarefa === 5) {
          // quintal: estende roupas no varal (uma a uma)
          resetPose(LQ); const u = (t - T[5]) / 1.65; pos(LQ, lerp(-1.8, 1.6, u), -0.9, 0); walk(LQ, rap * 4, 0.5); pose(LQ, { shL: [-2.6, 0, -0.2], shR: [-2.6, 0, 0.2], elL: [-0.2, 0, 0], elR: [-0.2, 0, 0] });
          Q.varal.forEach((r, i) => r.visible = i < Math.floor(u * 7)); rosto(LQ, t, { olhar: [0, -0.6], preoc: 0.3 });
          cam(st, [0, 1.5, 4.6], [0, 1.4, -1.5], 44, 0, shake(t, 0.05));
          return scQ;
        }
        // cozinha: louça, limpeza, clones, mãe e o copo
        resetPose(LC); segurar(LC, 'R', null); segurar(LC, 'L', null);
        clones.forEach(c => c.root.visible = false); Me.root.visible = false;
        brilhos.forEach(b => b.visible = false);
        let p = [0.2, 1.6, 4.6], a = [-0.6, 1.1, -1.2], fov = 44, roll = 0, shk = [0, 0];
        if (tarefa === 0) {
          pos(LC, -2.0, -1.95, 0); LC.root.rotation.y = Math.PI; // de costas, na pia
          pose(LC, { shL: [-0.9 + Math.sin(rap * 8) * 0.3, 0, 0.3], shR: [-0.9 - Math.sin(rap * 8) * 0.3, 0, -0.3], elL: [-0.6, 0, 0], elR: [-0.6, 0, 0] });
          C.pratos.forEach((pr, i) => pr.visible = i < 16 * (1 - (t - T[0]) / 1.6));
          rosto(LC, t, {}); p = [-1.2, 1.7, 0.6]; a = [-2.0, 1.1, -2.6]; shk = shake(t, 0.04);
        } else if (tarefa === 4) {
          C.pratos.forEach(pr => pr.visible = false);
          pos(LC, lerp(-3.0, -0.4, (t - T[4]) / 1.65), -1.95, Math.PI); segurar(LC, 'R', pn); pose(LC, { shR: [-1.0, 0, -0.2 + Math.sin(rap * 9) * 0.4], elR: [-0.5, 0, 0] }); walk(LC, rap * 3, 0.4);
          brilhos.forEach((b, i) => { b.visible = true; b.position.set(-3.2 + i * 0.6, 1.0 + Math.sin(t * 6 + i) * 0.05, -2.5); b.material.opacity = 0.6 + 0.4 * Math.sin(t * 12 + i); });
          rosto(LC, t, {}); p = [-1.4, 1.7, 1.4]; a = [-1.6, 1.0, -2.6]; shk = shake(t, 0.04);
        } else {
          C.pratos.forEach(pr => pr.visible = false);
          // depois da montagem: 4 "Lucas" trabalhando ao mesmo tempo (cinco setores!)
          const multi = win(t, 31.0, 31.1, 31.8, 31.9);
          clones.forEach((c, i) => { c.root.visible = multi > 0.5; resetPose(c); pos(c, [-2.8, -1.2, 2.2][i], [-1.95, -1.2, -1.6][i], [Math.PI, 0.6, -0.6][i]); const v = Math.sin(t * 20 + i); pose(c, { shL: [-1.0 + v * 0.4, 0, 0.3], shR: [-1.0 - v * 0.4, 0, -0.3], elL: [-0.6, 0, 0], elR: [-0.6, 0, 0] }); rosto(c, t, { preoc: 0.4 }); });
          // Lucas satisfeito na casa limpa; mãe entra; o copo
          const mx = lerp(3.0, 0.75, easeOut(clamp((t - 32.3) / 1.2)));
          pos(LC, -0.55, 1.0, 0.35); idle(LC, t);
          const orgulho = sstep(31.9, 32.3, t) * (1 - sstep(41.0, 41.4, t));
          const indignado = t > 42.6;
          if (indignado) pose(LC, P.bracosAbertos, 0.6 + 0.4 * Math.abs(Math.sin(t * 2.5)));
          else pose(LC, P.cintura, orgulho);
          const olhaCopo = t > 41.0 && t < 42.6;
          rosto(LC, t, { olhar: olhaCopo ? [0.6, 0.5] : indignado ? [0, 0] : [0.8, 0], fala: fala(t, 'Lucas'), sorriso: indignado ? -0.6 : orgulho * 0.9, raiva: indignado ? 0.8 : 0, medo: olhaCopo ? 0.4 : 0 });
          if (indignado) LC.mouthOpen.scale.set(1, 0.6 + 0.5 * Math.abs(Math.sin(t * 9)), 0.4);
          Me.root.visible = t > 32.3; resetPose(Me); pos(Me, mx, 1.1, -0.6); if (t < 33.5) walk(Me, t * 6, 1);
          if (t > 37.6 && t < 41.0) pose(Me, { shR: [-1.3, 0.6, 0.1], elR: [-0.1, 0, 0] }); else pose(Me, P.maosJuntas, sstep(33.4, 33.8, t));
          idle(Me, t); rosto(Me, t, { olhar: t > 37.6 && t < 41.0 ? [-0.6, 0.4] : [-0.8, 0], fala: fala(t, 'Mãe'), sorriso: t < 36.7 ? 0.7 : -0.1, preoc: t > 36.7 ? 0.4 : 0 });
          brilhos.forEach((b, i) => { b.visible = t > 31.9 && t < 33.0; b.position.set(-2.5 + i * 0.9, 1.0 + (i % 2) * 0.8, -2.0 + (i % 3) * 0.6); b.material.opacity = Math.abs(Math.sin(t * 10 + i)); });
          const cp = C.copo.getWorldPosition(new THREE.Vector3());
          if (t < 36.7) { p = [0.1, 1.6, 5.2]; a = [0.1, 1.25, 0.6]; }
          else if (t < 40.9) { const k = easeInOut(clamp((t - 36.7) / 4)); p = lerp3([0.1, 1.6, 5.2], [0.3, 1.6, 4.4], k); a = [0.2, 1.2, 0.6]; }
          else if (t < 42.6) { const k = easeInOut(clamp((t - 40.9) / 1.6)); p = lerp3([0.3, 1.6, 4.4], [cp.x + 0.15, cp.y + 0.12, cp.z + 0.6], k); a = [cp.x, cp.y + 0.06, cp.z]; fov = lerp(44, 30, k); }
          else { const hp = LC.head.getWorldPosition(new THREE.Vector3()); p = [hp.x + 0.1, hp.y + 0.05, hp.z + 1.4]; a = [hp.x, hp.y, hp.z]; fov = 38; shk = shake(t, 0.15 + impulse(t, 43.9, 1)); }
        }
        cam(st, p, a, fov, roll, shk);
        return scC;
      },
    };
  },
};

// ---------- 3. O irmão que não faz nada (e a "missão heroica") ----------
export const c3 = {
  inicio: 51.6, fim: 84.6,
  criar(st) {
    const scS = new THREE.Scene(); const S = sala(scS, { migalhas: 1 });
    const scF = new THREE.Scene(); const F = frente(scF);
    const Pd = pedro(), PF = pedro(), Me = mae(), L = lucas(); scS.add(Pd.root, Me.root, L.root); scF.add(PF.root);
    const saco = sacoLixo(), saco2 = sacoLixo(), cel = celular(), med = medalha(), bal = balde(), pn = pano();
    const conf = confete(scS);
    return {
      atualizar(t) {
        S.tv.userData.tela.material.color.setHSL((t * 0.2) % 1, 0.6, 0.6); S.ventilador.userData.pas.rotation.z = t * 20;
        if (t >= 58.9 && t < 66.8) {
          // missão épica em câmera lenta: levar o lixo até a calçada
          resetPose(PF); const ida = clamp((t - 59.2) / 5.4), volta = sstep(65.0, 65.6, t);
          pos(PF, 0, lerp(-3.4, 3.0, ida), volta > 0.5 ? Math.PI : 0); if (ida > 0 && ida < 1) walk(PF, t * 2.2, 0.9);
          segurar(PF, 'R', ida < 1 ? saco2 : null); if (ida < 1) pose(PF, { shR: [0.1, 0, 0.15], torso: [-0.12, 0, 0], head: [-0.1, 0, 0] }); else pose(PF, P.heroi);
          rosto(PF, t, { olhar: [0, 0], sorriso: ida >= 1 ? 0.9 : 0.3, raiva: ida < 1 ? 0.3 : 0 });
          if (ida >= 1) { saco2.position.set(1.4, 0.95, 3.4); if (!saco2.parent || saco2.parent === PF.handR) {} }
          F.feixes.forEach((f, i) => { f.material.opacity = 0.14 + 0.06 * Math.sin(t * 2 + i); });
          const k = easeInOut(clamp((t - 58.9) / 7.9));
          const hp = PF.root.position;
          cam(st, [hp.x + lerp(-1.6, 1.4, k), lerp(0.4, 0.6, k), hp.z + 3.2], [hp.x, 1.5, hp.z], 46, Math.sin(t * 0.8) * 0.03);
          return scF;
        }
        // sala
        resetPose(Pd); resetPose(Me); resetPose(L); Me.root.visible = true; L.root.visible = t > 69.6;
        const levanta = sstep(57.9, 58.9, t), volta = t > 66.8;
        if (!volta) {
          Pd.root.position.set(1.75, 0.66, -1.95); Pd.root.rotation.set(0, 0, (Math.PI / 2 - 0.05) * (1 - levanta)); Pd.root.position.y = lerp(0.66, 0, levanta); Pd.root.position.x = lerp(1.75, 0.9, levanta);
          Pd.hipL.rotation.x = -0.5 * (1 - levanta); Pd.knL.rotation.x = 0.8 * (1 - levanta); Pd.head.rotation.set(0, 0.35 * (1 - levanta), -1.25 * (1 - levanta));
          segurar(Pd, 'R', levanta > 0.5 ? saco : cel); pose(Pd, levanta > 0.5 ? { shR: [0.1, 0, 0.15] } : { shR: [-1.3, 0, 0.6], elR: [-1.2, 0, 0] });
          const suspiro = win(t, 56.0, 56.3, 56.9, 57.2); Pd.torso.rotation.x -= suspiro * 0.25;
          rosto(Pd, t, { olhar: t > 52.2 && t < 58 ? [0.6, 0.5] : [-0.2, -0.6], fala: fala(t, 'Pedro'), preoc: suspiro + (t > 57 ? 0.6 : 0), fechado: suspiro * 0.7, sorriso: t < 52 ? 0.5 : 0 });
        } else {
          pos(Pd, 0.4, 0.4, 0.2); pose(Pd, P.heroi, 1); idle(Pd, t); segurar(Pd, 'R', null);
          const homen = t > 76.0; if (homen) { if (med.parent !== Pd.torso) { Pd.torso.add(med); med.position.set(0, 0.48, 0.16); } }
          rosto(Pd, t, { olhar: [-0.5, 0], sorriso: 1, fala: fala(t, 'Pedro') });
        }
        // mãe: entra com o saco de lixo; depois se emociona e aplaude
        segurar(Me, 'R', t < 58.4 ? saco : null);
        pos(Me, volta ? -0.9 : lerp(3.6, 2.6, sstep(51.6, 52.6, t)), volta ? 0.5 : -0.6, volta ? 0.5 : -0.5); if (t < 52.6) walk(Me, t * 6, 1);
        if (volta) { const palmas = t > 76.0 ? Math.abs(Math.sin(t * 14)) : 0; pose(Me, t > 74.4 && t < 75.9 ? { shR: [-1.45, -0.5, 0.1], elR: [-0.1, 0, 0] } : { shL: [-0.9, 0, 0.45 + palmas * 0.3], shR: [-0.9, 0, -0.45 - palmas * 0.3], elL: [-1.4, 0, 0], elR: [-1.4, 0, 0] }); }
        idle(Me, t); rosto(Me, t, { olhar: volta ? (t > 74.4 && t < 75.9 ? [-0.8, 0] : [0.7, 0]) : [-0.7, 0], fala: fala(t, 'Mãe'), sorriso: volta && t < 74.4 ? 1 : 0.2, raiva: t > 74.4 && t < 75.9 ? 0.6 : 0 });
        // Lucas ao fundo com balde e pano
        pos(L, -1.9, -1.4, 0.4); segurar(L, 'L', bal); segurar(L, 'R', pn); pose(L, { shR: [-0.6, 0, -0.1], elR: [-0.9, 0, 0] }); idle(L, t);
        rosto(L, t, { olhar: [0.8, 0], fala: fala(t, 'Lucas'), preoc: 0.6, raiva: t > 74.4 ? 0.3 : 0 });
        conf(t, 0.4, 0.3, t > 76.0 ? 1 : 0);
        let p, a, fov = 42;
        if (t < 58.9) { const k = easeInOut(clamp((t - 51.6) / 2)); p = lerp3([0.7, 1.15, 1.0], [0.9, 1.4, 2.8], k); a = [0.6, 0.85, -2.0]; }
        else if (t < 70.4) { p = [0.0, 1.55, 4.6]; a = [-0.2, 1.2, 0]; }
        else if (t < 76.0) { p = [-1.0, 1.6, 3.6]; a = [-1.6, 1.3, -0.8]; }
        else { const k = easeInOut(clamp((t - 76) / 7)); p = lerp3([0.6, 1.4, 3.0], [0.4, 1.7, 4.4], k); a = [0.3, 1.4, 0]; }
        cam(st, p, a, fov);
        return scS;
      },
    };
  },
};

// ---------- 4. A injustiça (jantar) ----------
export const c4 = {
  inicio: 84.6, fim: 105.2,
  criar(st) {
    const sc = new THREE.Scene(); const C = cozinha(sc, { louca: 0, copoNaMesa: false });
    const L = lucas(), Pd = pedro(), Me = mae(); sc.add(L.root, Pd.root, Me.root);
    const conc = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 8), M(0xe8d0a0)); // comida
    const pratoP = new THREE.Group(); const prL = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.12, 0.03, 20), M(0xf6f2ea)); pratoP.add(prL); const pratoL = pratoP.clone();
    const montanha = new THREE.Mesh(new THREE.SphereGeometry(0.12, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2), M(0xe8c070)); pratoP.add(montanha); montanha.position.y = 0.01;
    const mesa = C.mesa; mesa.add(pratoP, pratoL); pratoP.position.set(0.55, 0.8, -0.2); pratoL.position.set(-0.55, 0.8, -0.2);
    const concha = new THREE.Group(); const cc = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.3, 6), M(0xc8ccd4)); cc.position.y = -0.12; concha.add(cc);
    return {
      atualizar(t) {
        resetPose(L); resetPose(Pd); resetPose(Me);
        const m = mesa.position;
        pos(L, m.x - 0.55, m.z - 0.85, 0); sentar(L, 1); pos(Pd, m.x + 0.55, m.z - 0.85, 0); sentar(Pd, 1);
        L.root.position.y = 0; Pd.root.position.y = 0; L.root.position.set(m.x - 0.55, 0, m.z - 0.95); Pd.root.position.set(m.x + 0.55, 0, m.z - 0.95);
        // Pedro come feliz; Lucas cansado
        const fPedro = fala(t, 'Pedro'); pose(Pd, P.comer, 1); Pd.elR.rotation.x = -1.6 - Math.abs(Math.sin(t * 3)) * 0.5;
        rosto(Pd, t, { olhar: fPedro ? [-0.6, 0] : [0.3, 0.4], fala: fPedro, sorriso: 0.8 });
        if (!fPedro) Pd.mouthOpen.scale.set(1, 0.12 + Math.abs(Math.sin(t * 7)) * 0.5, 0.4);
        const lFala = fala(t, 'Lucas'); const olhaCam = t > 88.4 && t < 89.5;
        pose(L, lFala ? { shR: [-0.9 + Math.sin(t * 4) * 0.3, 0, -0.1], elR: [-1.0, 0, 0], shL: [-0.6, 0, 0.2], elL: [-1.2, 0, 0] } : { shL: [-0.5, 0, 0.2], shR: [-0.5, 0, -0.2], elL: [-1.3, 0, 0], elR: [-1.3, 0, 0] });
        L.torso.rotation.x = lFala ? 0 : 0.15; L.head.rotation.y = olhaCam ? 0.0 : (lFala ? (t > 92 && t < 96.8 ? -0.4 : 0.1) : 0.5);
        rosto(L, t, { olhar: olhaCam || (lFala && t < 92) ? [0, 0] : [0.7, 0], fala: lFala, preoc: 0.6, raiva: t > 99.4 ? 0.7 : 0.2, sorriso: t > 103.2 ? -0.5 : 0 });
        // mãe serve o Pedro
        pos(Me, m.x + 1.4, m.z - 0.5, -0.9); segurar(Me, 'R', concha); const serve = win(t, 85.3, 85.8, 87.6, 88.0); pose(Me, { shR: [-1.1 - serve * 0.3, 0, -0.1], elR: [-0.4, 0, 0] }); idle(Me, t);
        montanha.scale.setScalar(1 + sstep(86.2, 87.6, t) * 0.8);
        rosto(Me, t, { olhar: t > 101 ? [-0.8, 0] : [-0.5, 0.4], fala: fala(t, 'Mãe'), sorriso: t < 100 ? 0.8 : -0.3, raiva: t > 103 ? 0.6 : 0 });
        let p = [0.4, 1.5, 2.4], a = [0.4, 1.1, -1.1], fov = 42, shk = [0, 0];
        if (olhaCam || (lFala && t < 92)) { const hp = L.head.getWorldPosition(new THREE.Vector3()); p = [hp.x + 0.05, hp.y + 0.02, hp.z + 1.3]; a = [hp.x, hp.y, hp.z]; fov = 36; }
        else if (fPedro) { const hp = Pd.head.getWorldPosition(new THREE.Vector3()); p = [hp.x - 0.2, hp.y + 0.05, hp.z + 1.4]; a = [hp.x, hp.y, hp.z]; fov = 38; }
        else if (t > 99.4 && t < 102.9) { const hp = L.head.getWorldPosition(new THREE.Vector3()); const k = easeInOut(clamp((t - 99.4) / 3.4)); p = [hp.x + 0.1, hp.y + 0.05, hp.z + lerp(2.0, 1.0, k)]; a = [hp.x, hp.y, hp.z]; fov = 38; shk = shake(t, k * 0.2); }
        cam(st, p, a, fov, 0, shk);
        return sc;
      },
    };
  },
};

// ---------- 5. Por que isso acontece? ----------
export const c5 = {
  inicio: 105.2, fim: 146.4,
  criar(st) {
    const scS = new THREE.Scene(); sala(scS, { noite: 1 });
    const scP = new THREE.Scene(); const Pl = palco(scP);
    const scC = new THREE.Scene(); cozinha(scC, { noite: 1, louca: 0, copoNaMesa: false });
    const LJ = lucas(); scS.add(LJ.root);
    const LP = lucas(), PP = pedro(), MP = mae(); scP.add(LP.root, PP.root, MP.root);
    const fantasmas = [lucas(), lucas()]; fantasmas.forEach(f => scP.add(f.root));
    const MC = mae(); scC.add(MC.root);
    const transp = (h, a) => h.root.traverse(o => { if (o.isMesh) { o.material = o.material.clone ? o.material : o.material; o.material.transparent = a < 0.999; o.material.opacity = a; o.material.depthWrite = a > 0.5; } });
    // materiais exclusivos do Lucas do palco (para ficar transparente sem afetar os outros)
    [LP, ...fantasmas].forEach(h => h.root.traverse(o => { if (o.isMesh) o.material = o.material.clone(); }));
    const vas = vassoura(), saco = sacoLixo(), bal = balde(), pilha = pilhaRoupa(), cel = celular();
    const est = estrelas(scP, 12), conf = confete(scP, 60);
    const sino = glowSprite(0xffd23a, 0.5, 1); scP.add(sino);
    return {
      atualizar(t) {
        if (t < 110) {
          resetPose(LJ); pos(LJ, -1.6, -2.3, Math.PI); idle(LJ, t, 0.6); rosto(LJ, t, { preoc: 0.5 });
          const k = easeInOut(clamp((t - 105.2) / 4.8)); cam(st, lerp3([-0.6, 1.7, 1.6], [-1.3, 1.85, -0.6], k), [-1.6, 1.8, -2.9], 40);
          return scS;
        }
        if (t >= 133.8) {
          // a mãe também se cansa: sozinha, de noite, encontra a cozinha limpa e sorri (ela só se acostumou)
          resetPose(MC); pos(MC, lerp(1.8, 0.4, sstep(134, 137, t)), -1.0, -0.3); if (t < 137) walk(MC, t * 4, 0.7); idle(MC, t);
          const sorri = sstep(139.5, 140.5, t); pose(MC, P.maosJuntas, sorri);
          rosto(MC, t, { olhar: t < 139.5 ? [-0.7, 0] : [0, 0.2], preoc: 0.4 * (1 - sorri), sorriso: sorri * 0.8 });
          const k = easeInOut(clamp((t - 133.8) / 12.6)); cam(st, lerp3([1.6, 1.6, 4.2], [0.6, 1.55, 2.4], k), [0.4, 1.3, -1.0], 42);
          return scC;
        }
        // palco: a psicologia por trás
        [LP, PP, MP, ...fantasmas].forEach(h => { resetPose(h); h.root.visible = true; });
        Pl.spots[0].s.intensity = 160; Pl.spots[1].s.intensity = 160; Pl.spots.forEach(s => s.cone.visible = true);
        if (t < 120.6) {
          // Lucas repete tarefas; vai ficando transparente ("vira o mínimo")
          PP.root.visible = MP.root.visible = false;
          const ciclo = Math.floor((t - 110) / 1.7) % 3; const a = lerp(1, 0.15, sstep(111.5, 120, t));
          pos(LP, 0, 0, 0); segurar(LP, 'R', ciclo === 0 ? vas : ciclo === 1 ? saco : null); if (ciclo === 2) { segurar(LP, 'R', null); LP.torso.add(pilha); pilha.position.set(0, -0.05, 0.22); pose(LP, P.carregar); } else { if (pilha.parent) pilha.parent.remove(pilha); const v = Math.sin(t * 6); pose(LP, { shR: [-0.45 + v * 0.15, 0.3, 0.15], elR: [-0.6, 0, 0], torso: [0.1, v * 0.1, 0] }); }
          transp(LP, a); rosto(LP, t, { preoc: 0.5 });
          fantasmas.forEach((f, i) => { pos(f, (i ? 1 : -1) * 0.9, -0.4, 0); pose(f, P.carregar); transp(f, a * 0.25); rosto(f, t, {}); });
          Pl.spots[1].s.intensity = 0; Pl.spots[1].cone.visible = false; Pl.spots[0].s.position.x = 0; Pl.spots[0].s.target.position.x = 0; Pl.spots[0].cone.position.x = 0;
          est(t, V(), 0); conf(t, 0, 0, 0); sino.visible = false;
          cam(st, [0, 1.6, 5.6 - (t - 110) * 0.08], [0, 1.1, 0], 42);
          return scP;
        }
        LP.root.traverse(o => { if (o.isMesh) { o.material.transparent = false; o.material.opacity = 1; o.material.depthWrite = true; } }); fantasmas.forEach(f => f.root.visible = false);
        if (t < 125.7) {
          // Pedro levanta UM saco de lixo: holofote, estrelas, aplausos
          LP.root.visible = MP.root.visible = false;
          pos(PP, 0, 0, 0); segurar(PP, 'R', saco); pose(PP, { shR: [-2.8, 0, 0.2], elR: [-0.1, 0, 0], shL: [-0.3, 0, -0.6] }); rosto(PP, t, { sorriso: 1, olhar: [0, -0.3] });
          Pl.spots[0].s.position.x = 0; Pl.spots[0].s.target.position.x = 0; Pl.spots[0].cone.position.x = 0; Pl.spots[1].s.intensity = 0; Pl.spots[1].cone.visible = false;
          est(t, V(0, 2.3, 0.2), 1); conf(t, 0, 0, 1); sino.visible = false;
          cam(st, [0, lerp(1.0, 1.4, (t - 120.6) / 5), 4.2], [0, 1.5, 0], 44, 0, shake(t, 0.03));
          return scP;
        }
        // papéis: o "responsável" carregando tudo; o "preguiçoso" sendo lembrado
        Pl.spots[0].s.position.x = -1.0; Pl.spots[0].s.target.position.x = -1.0; Pl.spots[0].cone.position.x = -1.0; Pl.spots[1].s.position.x = 1.0; Pl.spots[1].s.target.position.x = 1.0; Pl.spots[1].cone.position.x = 1.0;
        pos(LP, -1.0, 0, 0.2); segurar(LP, 'R', vas); segurar(LP, 'L', bal); LP.torso.add(pilha); pilha.position.set(0, 0.62, -0.05); pilha.scale.setScalar(1.3); pose(LP, { shR: [-0.3, 0, 0.1], shL: [-0.2, 0, -0.1] }); LP.torso.rotation.x = 0.15 + Math.sin(t * 2) * 0.03; rosto(LP, t, { preoc: 0.7, olhar: [0, 0.3] });
        pos(PP, 1.0, 0, -0.2); segurar(PP, 'R', cel); pose(PP, P.celular); rosto(PP, t, { olhar: [0, 0.6], sorriso: 0.4 });
        pos(MP, 1.9, -1.0, -0.8); pose(MP, P.apontar); idle(MP, t); rosto(MP, t, { olhar: [-0.7, 0], fala: Math.sin(t * 2) > 0 ? 0.6 : 0 });
        sino.visible = true; sino.position.set(1.0, 2.5 + Math.sin(t * 6) * 0.05, 0); sino.material.opacity = 0.5 + 0.5 * Math.abs(Math.sin(t * 5));
        est(t, V(), 0); conf(t, 0, 0, 0);
        cam(st, [0.2, 1.7, 7.6], [0.2, 1.3, -0.2], 44);
        return scP;
      },
    };
  },
};

// ---------- 6. A reflexão final ----------
const FREEZE = 160.6;
export const c6 = {
  inicio: 146.4, fim: 184.6,
  criar(st) {
    const sc = new THREE.Scene(); const S = sala(sc, { migalhas: 1 });
    const scF = new THREE.Scene(); frente(scF);
    const L = lucas(), Pd = pedro(), Me = mae(); sc.add(L.root, Pd.root, Me.root);
    const vas = vassoura(), pn = pano();
    return {
      atualizar(t0) {
        if (t0 > 172.7) {
          // fim: a casa por fora, ao entardecer; a câmera se afasta devagar
          const k = easeInOut(clamp((t0 - 172.7) / 8.5)); cam(st, lerp3([0, 1.9, 2.2], [0, 6.0, 13.0], k), [0, lerp(1.8, 1.4, k), -4], 44);
          return scF;
        }
        const congelado = t0 >= FREEZE && t0 < 163.2; const t = congelado ? FREEZE : t0;
        resetPose(L); resetPose(Pd); resetPose(Me);
        S.tv.userData.tela.material.color.setHSL((t * 0.2) % 1, 0.6, 0.6); S.ventilador.userData.pas.rotation.z = t * 20;
        if (t < 163.2) {
          // Lucas larga a vassoura e senta de braços cruzados
          const senta = sstep(146.6, 147.6, t);
          pos(L, lerp(-0.8, 0.0, senta), lerp(-0.6, -2.05, senta), 0); sentar(L, senta); pose(L, P.bracosCruzados, senta); L.torso.rotation.x = -0.12 * senta;
          rosto(L, t, { olhar: t > 158 ? [0.8, 0] : t > 150.6 && t < 155.5 ? [-0.6, 0] : [0, 0], fala: fala(t, 'Lucas'), sorriso: t > 150.6 ? 0.5 : 0, fechado: t > 151 && t < 152 ? 0.6 : 0 });
          // vassoura: no chão, depois o Lucas entrega para o Pedro
          const entrega = t > 159.4;
          if (!entrega) { if (vas.parent !== sc) { if (vas.parent) vas.parent.remove(vas); sc.add(vas); } vas.position.set(-0.4, 0.05, -1.2); vas.rotation.set(Math.PI / 2, 0, 0.4); }
          else { segurar(Pd, 'R', vas); segurar(Pd, 'L', null); vas.position.set(0, 0, 0); vas.rotation.set(0.3, 0, 0); }
          pos(Pd, 1.2, -2.0, -0.2); sentar(Pd, 1 - sstep(156.0, 156.8, t)); if (t > 156.8) pos(Pd, 1.3, -1.2, -0.3);
          pose(Pd, entrega ? P.maosNaCabeca : { shR: [-1.0, 0, -0.15], elR: [-1.5, 0, 0] }, entrega ? 0.5 : 1); if (entrega) { Pd.shR.rotation.set(-0.7, 0, -0.1); Pd.elR.rotation.x = -0.6; }
          rosto(Pd, t, { olhar: t > 155.5 ? [-0.7, 0] : [0, 0.6], fala: fala(t, 'Pedro'), medo: t > 155.5 ? 1 : 0, preoc: t > 155.5 ? 0.8 : 0 });
          if (congelado) Pd.mouthOpen.scale.set(1, 1.0, 0.4);
          pos(Me, 2.6, -0.4, -0.7); pose(Me, P.cintura); idle(Me, t); rosto(Me, t, { olhar: [-0.8, 0], fala: fala(t, 'Mãe'), preoc: t > 150.6 ? 0.6 : 0, medo: t > 150.6 && t < 155 ? 0.4 : 0 });
          let p = [0.6, 1.5, 3.8], a = [0.6, 1.1, -1.6], fov = 42;
          if (fala(t, 'Lucas') && t < 156) { const hp = L.head.getWorldPosition(new THREE.Vector3()); p = [hp.x + 0.4, hp.y + 0.1, hp.z + 1.8]; a = [hp.x, hp.y - 0.05, hp.z]; fov = 38; }
          if (t > 155.8 && t < 158.1) { const hp = Pd.head.getWorldPosition(new THREE.Vector3()); p = [hp.x - 0.1, hp.y + 0.05, hp.z + 1.5]; a = [hp.x, hp.y, hp.z]; fov = 38; }
          if (congelado) { const hp = Pd.head.getWorldPosition(new THREE.Vector3()); const k = easeOut(clamp((t0 - FREEZE) / 2.4)); p = [hp.x - 0.1, hp.y, hp.z + lerp(2.2, 1.3, k)]; a = [hp.x, hp.y - 0.2, hp.z]; fov = 40; }
          cam(st, p, a, fov);
          return sc;
        }
        // depois: os dois limpando juntos (Pedro desajeitado), a mãe observa
        pos(Pd, 0.4 + Math.sin(t * 1.5) * 0.5, -0.4, 0.3); segurar(Pd, 'R', vas); const v = Math.sin(t * 3); pose(Pd, { shR: [-0.45 + v * 0.15, 0.3, 0.15], elR: [-0.6, 0, 0], shL: [-0.75, 0, 0.35], elL: [-0.5, 0, 0], torso: [0.2, v * 0.15, 0] }); vas.rotation.set(0.5, 0, v * 0.2); walk(Pd, t * 3, 0.3);
        rosto(Pd, t, { olhar: [0, 0.6], preoc: 0.5, sorriso: -0.2 });
        pos(L, -1.4, -1.6, 0.5); segurar(L, 'R', pn); pose(L, { shR: [-1.0, 0, -0.2 + Math.sin(t * 4) * 0.3], elR: [-0.5, 0, 0] }); idle(L, t); rosto(L, t, { olhar: [0.8, 0], sorriso: 0.5 });
        pos(Me, 2.4, -0.6, -0.6); pose(Me, P.maosJuntas); idle(Me, t); rosto(Me, t, { olhar: [-0.7, 0], sorriso: 0.7 });
        S.migalhas.forEach((m, i) => m.visible = i / 40 > (t - 163.2) / 8);
        const k = easeInOut(clamp((t - 163.2) / 9.5)); cam(st, lerp3([0.2, 1.6, 4.4], [0.2, 2.4, 6.6], k), [0, 1.1, -1], 42);
        return sc;
      },
    };
  },
};
