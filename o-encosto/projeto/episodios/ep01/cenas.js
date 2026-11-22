// "Imagine ter um irmão que é um encosto profissional" — 4 cenas 3D. Bocas mexem nos intervalos reais da narração-guia.
import { THREE, V, lerp, clamp, sstep, win, easeInOut, easeOut, glowSprite, shake, impulse, rng, softTex } from '../../motor/base.js';
import { lucas, pedro, mae, rosto, resetPose, walk, idle, pose, P, sentar, segurar, vassoura, pilhaRoupa, sacoLixo, celular, balde, pano, salgadinho, M } from '../../motor/familia.js';
import { sala, cozinha, frente } from '../../motor/casa.js';

const TEMPOS = await (await fetch(new URL('./tempos.json', import.meta.url))).json();
const fala = (t, quem) => (TEMPOS.falas.some(f => f.quem === quem && t >= f.inicio && t < f.fim - 0.05) ? 1 : 0);
const pos = (h, x, z, ry = 0, y = 0) => { h.root.position.set(x, y, z); h.root.rotation.set(0, ry, 0); };
const cam = (st, p, a, fov = 40, roll = 0, shk = [0, 0]) => st.cam(p, a, fov, roll, shk);
const lerp3 = (a, b, k) => a.map((v, i) => lerp(v, b[i], k));
const cabeca = h => h.head.getWorldPosition(new THREE.Vector3());
function varrer(h, t, f = 3) { const v = Math.sin(t * f); pose(h, { shR: [-0.45 + v * 0.15, 0.3, 0.15], elR: [-0.6, 0, 0], shL: [-0.75 + v * 0.1, 0, 0.35], elL: [-0.5, 0, 0], torso: [0.18, v * 0.18, 0] }); return v; }
function deitadoNoSofa(h, t, x = 1.75) { h.root.position.set(x, 0.66, -1.95); h.root.rotation.set(0, 0, Math.PI / 2 - 0.05); h.hipL.rotation.x = -0.5; h.knL.rotation.x = 0.8; h.hipR.rotation.x = -1.4; h.knR.rotation.x = 0.1; h.head.rotation.set(0, 0.35, -1.25); }
function roupasNoChao(sc) { const r = rng(3), cores = [0xd84a4a, 0x4a8ad0, 0xf0d050, 0x5ab070, 0xe8e0d0, 0x9a5ab0], list = []; for (let i = 0; i < 9; i++) { const m = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.4), M(cores[i % 6], { side: THREE.DoubleSide })); m.rotation.set(-Math.PI / 2, 0, r() * 3); m.position.set(-2.8 + r() * 5, 0.012, -0.6 + r() * 2); sc.add(m); list.push(m); } return list; }
function poeira(sc, n = 40) { const list = []; for (let i = 0; i < n; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: softTex(), color: 0xb8a080, transparent: true, depthWrite: false })); sc.add(s); list.push(s); } return (t, c, a) => list.forEach((s, i) => { const u = ((t * 0.6 + i / n) % 1); s.visible = a > 0.01; s.position.set(c.x + Math.sin(i * 7.1) * (0.3 + u * 1.4), 0.1 + u * 1.6, c.z + Math.cos(i * 3.3) * (0.3 + u * 0.8)); s.scale.setScalar(0.3 + u * 0.9); s.material.opacity = a * 0.55 * (1 - u); }); }
function fita(sc) { const c = document.createElement('canvas'); c.width = 256; c.height = 32; const x = c.getContext('2d'); for (let i = 0; i < 8; i++) { x.fillStyle = i % 2 ? '#1a1a1a' : '#f6d02a'; x.beginPath(); x.moveTo(i * 32, 0); x.lineTo(i * 32 + 32, 0); x.lineTo(i * 32 + 16, 32); x.lineTo(i * 32 - 16, 32); x.fill(); } const tx = new THREE.CanvasTexture(c); tx.wrapS = THREE.RepeatWrapping; tx.repeat.set(4, 1); tx.colorSpace = THREE.SRGBColorSpace; const g = new THREE.Group(); for (const [x0, z0, ry, L] of [[-2.0, -2.15, 0, 1.4], [-2.7, -2.6, Math.PI / 2, 1.0], [-1.3, -2.6, Math.PI / 2, 1.0]]) { const f = new THREE.Mesh(new THREE.PlaneGeometry(L, 0.07), new THREE.MeshBasicMaterial({ map: tx, side: THREE.DoubleSide })); f.position.set(x0, 1.32, z0); f.rotation.y = ry; g.add(f); } sc.add(g); return g; }

// ---------- 1. A desgraça começa ----------
export const c1 = {
  inicio: 0, fim: 11.0,
  criar(st) {
    const sc = new THREE.Scene(); const S = sala(sc, { migalhas: 1 }); roupasNoChao(sc);
    const L = lucas(), Pd = pedro(); sc.add(L.root, Pd.root);
    const vas = vassoura(), pn = pano(), cel = celular(), chips = salgadinho();
    return {
      atualizar(t) {
        S.tv.userData.tela.material.color.setHSL((t * 0.2) % 1, 0.6, 0.6); S.ventilador.userData.pas.rotation.z = t * 20;
        // Lucas correndo pela casa com vassoura e pano (vai e volta)
        resetPose(L); const u = (t * 0.45) % 2, ida = u < 1; const x = ida ? lerp(-1.4, 2.4, u) : lerp(2.4, -1.4, u - 1);
        pos(L, x, 0.6, ida ? Math.PI / 2 : -Math.PI / 2); segurar(L, 'R', vas); segurar(L, 'L', pn); walk(L, t * 13, 1, 0.9);
        L.shL.rotation.x = -1.0 + Math.sin(t * 20) * 0.5; L.elL.rotation.x = -0.6; vas.rotation.set(0.9, 0, Math.sin(t * 13) * 0.3);
        rosto(L, t, { olhar: [0, 0], preoc: 0.7, suor: 1, fala: 0 }); L.mouthOpen.scale.set(1, 0.4 + 0.3 * Math.abs(Math.sin(t * 9)), 0.4);
        // Pedro deitado, perna pra cima, salgadinho e TV
        resetPose(Pd); deitadoNoSofa(Pd, t); segurar(Pd, 'L', chips);
        pose(Pd, { shL: [-0.9 - Math.max(0, Math.sin(t * 2.2)) * 0.6, 0, -0.2], elL: [-1.6, 0, 0], shR: [-0.2, 0, 1.4], elR: [-1.4, 0, 0] });
        rosto(Pd, t, { olhar: [-0.7, -0.4], sorriso: 0.6 });
        Pd.mouthOpen.scale.set(1, 0.12 + Math.abs(Math.sin(t * 7)) * 0.4, 0.4);
        const k = easeInOut(clamp(t / 11));
        cam(st, lerp3([0.2, 1.7, 6.4], [0.6, 1.4, 4.2], k), [lerp(0, 0.9, sstep(6, 9, t)), 1.0, -1.2], 46, 0, shake(t, 0.03));
        return sc;
      },
    };
  },
};

// ---------- 2. O copo maldito ----------
export const c2 = {
  inicio: 11.0, fim: 23.9,
  criar(st) {
    const sc = new THREE.Scene(); const C = cozinha(sc, { louca: 0, copoNaMesa: true });
    C.copo.position.set(-2.35, 0.99, -2.45); // o copo agora está na pia
    const F = fita(sc); const luzCopo = new THREE.SpotLight(0xffffff, 40, 6, 0.25, 0.4); luzCopo.position.set(-2.0, 3.2, -1.6); luzCopo.target.position.set(-1.95, 0.99, -2.55); sc.add(luzCopo, luzCopo.target);
    const L = lucas(), Me = mae(); sc.add(L.root, Me.root);
    const brilhos = [0, 1, 2, 3, 4, 5].map(() => { const s = glowSprite(0xffffff, 0.25, 1); sc.add(s); return s; });
    return {
      atualizar(t) {
        resetPose(L); resetPose(Me);
        // Lucas termina de limpar, satisfeito
        pos(L, -0.4, 0.4, 0.3); idle(L, t);
        const satisfeito = sstep(11.2, 11.8, t) * (1 - sstep(13.0, 13.4, t)), arregala = t > 16.9;
        pose(L, satisfeito > 0.5 ? P.cintura : (arregala ? P.bracosAbertos : { shR: [-0.3, 0, 0.1] }), satisfeito > 0.5 ? satisfeito : 0.7);
        rosto(L, t, { olhar: arregala ? [0, 0] : [-0.6, 0], fala: fala(t, 'Lucas'), sorriso: satisfeito * 0.9 - (t > 15.5 ? 0.4 : 0), medo: arregala ? 1 : 0, preoc: t > 14 ? 0.6 : 0 });
        // mãe entra furiosa e aponta o copo
        const mx = lerp(3.4, 1.1, easeOut(clamp((t - 11.6) / 1.0))); pos(Me, mx, 0.2, -0.7); if (t < 12.6) walk(Me, t * 7, 1);
        pose(Me, t > 12.4 && t < 14.2 ? { shR: [-1.45, 0.7, 0.1], elR: [-0.1, 0, 0] } : P.cintura, 1); idle(Me, t);
        rosto(Me, t, { olhar: t > 12.4 && t < 14.2 ? [-0.8, 0.3] : [-0.8, 0], fala: fala(t, 'Mãe'), raiva: 1 });
        F.visible = t > 13.0; F.children.forEach(f => f.material.opacity = 1); luzCopo.intensity = t > 12.6 ? 40 : 0;
        brilhos.forEach((b, i) => { b.visible = t < 12.6; b.position.set(-3.0 + i * 0.7, 1.0 + (i % 2) * 0.7, -2.4); b.material.opacity = Math.abs(Math.sin(t * 10 + i)); });
        const cp = C.copo.getWorldPosition(new THREE.Vector3()); let p, a, fov = 44, shk = [0, 0];
        if (t < 12.4) { p = [0.4, 1.7, 4.6]; a = [0, 1.2, -0.6]; }
        else if (t < 14.3) { const k = easeInOut(clamp((t - 12.4) / 1.6)); p = lerp3([0.4, 1.7, 4.6], [cp.x + 0.15, cp.y + 0.12, cp.z + 0.75], k); a = lerp3([0, 1.2, -0.6], [cp.x, cp.y + 0.05, cp.z], k); fov = lerp(44, 32, k); }
        else if (t < 16.9) { p = [0.2, 1.6, 4.2]; a = [0.2, 1.3, 0]; }
        else { const hp = cabeca(L); const k = easeOut(clamp((t - 16.9) / 0.4)); p = [hp.x + 0.05, hp.y + 0.03, hp.z + lerp(2.4, 1.2, k)]; a = [hp.x, hp.y, hp.z]; fov = 36; shk = shake(t, t > 18.08 ? 0.25 : 0.05); }
        cam(st, p, a, fov, 0, shk);
        return sc;
      },
    };
  },
};

// ---------- 3. O milagre de Pedro ----------
export const c3 = {
  inicio: 23.9, fim: 48.6,
  criar(st) {
    const scS = new THREE.Scene(); const S = sala(scS, { migalhas: 1 });
    const scF = new THREE.Scene(); const F = frente(scF);
    const Pd = pedro(), Me = mae(); scS.add(Pd.root, Me.root);
    const PF = pedro(), MF = mae(), LF = lucas(); scF.add(PF.root, MF.root, LF.root);
    const saco = sacoLixo(), saco2 = sacoLixo(), sacoMae = sacoLixo(), cel = celular(); scF.add(saco2);
    const b1 = balde(), b2 = balde(), b3 = balde();
    return {
      atualizar(t) {
        S.tv.userData.tela.material.color.setHSL((t * 0.2) % 1, 0.6, 0.6); S.ventilador.userData.pas.rotation.z = t * 20;
        if (t < 30.4) {
          // levanta como um idoso de 300 anos e vai até a porta
          resetPose(Pd); resetPose(Me);
          const lev = sstep(26.6, 28.6, t), anda = clamp((t - 28.8) / 1.6);
          if (lev < 1) { deitadoNoSofa(Pd, t); Pd.root.rotation.z *= (1 - lev); Pd.root.position.y = lerp(0.66, 0, lev); Pd.root.position.x = lerp(1.75, 1.0, lev); Pd.hipR.rotation.x *= (1 - lev); Pd.hipL.rotation.x *= (1 - lev); Pd.knL.rotation.x *= (1 - lev); Pd.head.rotation.set(Pd.head.rotation.x * (1 - lev), Pd.head.rotation.y * (1 - lev), Pd.head.rotation.z * (1 - lev)); Pd.torso.rotation.x = lev * 0.45; Pd.tremor = 1; }
          else { pos(Pd, lerp(1.0, 3.7, anda), lerp(-1.2, -2.4, anda), Math.PI * 0.7); walk(Pd, t * 4, 0.6); Pd.torso.rotation.x += 0.45; }
          segurar(Pd, 'R', lev > 0.6 ? saco : cel);
          pose(Pd, { shL: [0.4, 0, -0.3], elL: [-0.9, 0, 0] }); Pd.shL.rotation.z -= Math.sin(t * 30) * 0.03 * lev;
          rosto(Pd, t, { olhar: [0.5, 0.4], preoc: 1, fechado: lev > 0 && lev < 1 ? 0.5 : 0 });
          Pd.mouthOpen.scale.set(1, 0.3 + 0.2 * Math.abs(Math.sin(t * 6)) * lev, 0.4);
          pos(Me, 2.6, -0.4, -0.6); segurar(Me, 'R', t < 27.0 ? sacoMae : null); pose(Me, P.cintura, t > 27.0 ? 1 : 0); idle(Me, t); rosto(Me, t, { olhar: [-0.7, 0], fala: fala(t, 'Mãe'), sorriso: 0.2 });
          const k = easeInOut(clamp((t - 23.9) / 6.5)); cam(st, lerp3([0.9, 1.3, 2.4], [1.6, 1.6, 4.0], k), [1.4, 0.9, -1.6], 44);
          return scS;
        }
        // lá fora: joga o lixo, música épica, raios de luz, câmera 360
        resetPose(PF); resetPose(MF); resetPose(LF);
        const joga = sstep(30.9, 31.3, t);
        pos(PF, 0, 2.6, 0); segurar(PF, 'R', joga < 0.5 ? saco : null);
        if (joga < 0.5) pose(PF, { shR: [-1.6 * sstep(30.5, 30.9, t), 0, 0.2] });
        else pose(PF, P.heroi);
        saco2.visible = joga > 0.5; saco2.position.set(lerp(0.5, 1.4, joga), lerp(1.2, 0.95, joga), 3.4);
        rosto(PF, t, { olhar: [0, -0.1], sorriso: joga > 0.5 ? 1 : 0, fala: fala(t, 'Pedro') });
        F.feixes.forEach((f, i) => f.material.opacity = 0.16 + 0.08 * Math.sin(t * 2 + i));
        // mãe chorando de emoção na porta; Lucas chega com três baldes
        pos(MF, -1.2, 0.3, 0.4); pose(MF, P.maosJuntas); idle(MF, t); MF.root.visible = t > 33.2;
        rosto(MF, t, { olhar: [0.7, 0], fala: fala(t, 'Mãe'), sorriso: 1, fechado: t > 33.6 && t < 37 ? 0.5 : 0 });
        LF.root.visible = t > 36.8; pos(LF, lerp(-3.5, -1.0, clamp((t - 36.8) / 0.8)), 1.6, 0.4); if (t < 37.6) walk(LF, t * 8, 1);
        segurar(LF, 'L', b1); segurar(LF, 'R', b2); if (b3.parent !== LF.head) { LF.head.add(b3); b3.position.set(0, 0.48, 0); b3.rotation.set(Math.PI, 0, 0.2); }
        const grita = fala(t, 'Lucas'); pose(LF, grita ? { shL: [-0.3 - Math.abs(Math.sin(t * 5)) * 0.6, 0, -0.5], shR: [-0.3 - Math.abs(Math.sin(t * 5 + 1)) * 0.6, 0, 0.5] } : {});
        rosto(LF, t, { olhar: [0.8, 0], fala: grita, raiva: 1 });
        let p, a, fov = 44;
        if (t < 33.4) { const ang = (t - 30.4) / 3.0 * Math.PI * 2; p = [Math.sin(ang) * 3.0, 1.0, 2.6 + Math.cos(ang) * 3.0]; a = [0, 1.5, 2.6]; fov = 46; }
        else if (t < 37.4) { const hp = cabeca(MF); p = [hp.x + 0.2, hp.y + 0.05, hp.z + 1.6]; a = [hp.x, hp.y, hp.z]; fov = 38; }
        else if (t < 42.0 || t > 44.6) { const hp = cabeca(LF); p = [hp.x + 0.5, hp.y + 0.1, hp.z + 2.6]; a = [hp.x + 0.2, hp.y - 0.1, hp.z]; fov = 42; }
        else { const hp = cabeca(PF); p = [hp.x - 0.3, hp.y + 0.05, hp.z + 1.6]; a = [hp.x, hp.y, hp.z]; fov = 38; }
        cam(st, p, a, fov, 0, shake(t, fala(t, 'Lucas') ? 0.12 : 0));
        return scF;
      },
    };
  },
};

// ---------- 4. A revolução ----------
export const c4 = {
  inicio: 48.6, fim: 74,
  criar(st) {
    const sc = new THREE.Scene(); const S = sala(sc, { migalhas: 1 });
    const L = lucas(), Pd = pedro(), Me = mae(); sc.add(L.root, Pd.root, Me.root);
    const vas = vassoura(), chips = salgadinho(), cel = celular(), bal = balde(), pn = pano();
    const po = poeira(sc, 50);
    return {
      atualizar(t) {
        resetPose(L); resetPose(Pd); resetPose(Me);
        S.tv.userData.tela.material.color.setHSL((t * 0.2) % 1, 0.6, 0.6); S.ventilador.userData.pas.rotation.z = t * 20;
        const varrendo = t > 62.9;
        // Lucas larga tudo e se joga no sofá
        const jogou = sstep(48.7, 49.4, t);
        if (jogou < 1) { pos(L, lerp(-0.6, -0.1, jogou), lerp(-0.4, -2.0, jogou), 0); L.root.position.y = Math.sin(jogou * Math.PI) * 0.4; segurar(L, 'L', bal); segurar(L, 'R', pn); }
        else { pos(L, -0.1, -2.0, 0); sentar(L, 1); segurar(L, 'L', null); segurar(L, 'R', t > 52.0 ? chips : null); L.torso.rotation.x = -0.25; }
        if (jogou > 0.5) { if (!varrendo) pose(L, t > 52.0 ? { shR: [-0.45, 0, -0.1], elR: [-0.9, 0, 0], shL: [-0.2, 0, -0.4] } : P.bracosCruzados); else pose(L, { shL: [-2.6, 0, -0.5], shR: [-2.6, 0, 0.5], elL: [-1.6, 0, 0], elR: [-1.6, 0, 0] }); }
        const gritando = fala(t, 'Lucas') && (t > 59 || t > 68);
        rosto(L, t, { olhar: t > 56.5 && t < 63 ? [0.8, 0] : t > 63 ? [0.8, 0.2] : [0.6, 0], fala: fala(t, 'Lucas'), sorriso: t > 52 && t < 56.3 ? 0.6 : (varrendo ? 0.8 : 0), raiva: t > 59.1 && t < 62.3 ? 1 : 0 });
        // produtos de limpeza no chão
        if (jogou >= 1) { if (bal.parent !== sc) { sc.add(bal); bal.position.set(-0.6, 0.27, -0.4); } if (pn.parent !== sc) { sc.add(pn); pn.position.set(-0.3, 0.07, -0.2); } }
        // Pedro: no sofá; depois varre levantando poeira
        if (!varrendo) { pos(Pd, 1.2, -2.0, -0.15); sentar(Pd, 1); segurar(Pd, 'R', cel); pose(Pd, t > 56.5 && t < 59 ? P.maosNaCabeca : P.celular, 1); rosto(Pd, t, { olhar: t > 52 ? [-0.8, 0] : [0, 0.6], fala: fala(t, 'Pedro'), medo: t > 52.0 ? 1 : 0, preoc: t > 52 ? 1 : 0 }); if (t > 56.4 && t < 56.6) Pd.jump = 0.2; }
        else { const xv = 0.6 + Math.sin(t * 1.4) * 1.0; pos(Pd, xv, -0.2, Math.cos(t * 1.4) > 0 ? 0.6 : -0.6); segurar(Pd, 'R', vas); const v = varrer(Pd, t, 9); vas.rotation.set(0.5, 0, v * 0.5); walk(Pd, t * 5, 0.4); rosto(Pd, t, { olhar: [0, 0.7], preoc: 1, medo: 0.5 }); }
        po(t, Pd.root.position, varrendo ? 1 : 0);
        // mãe furiosa
        pos(Me, 2.6, -0.3, -0.7); pose(Me, P.cintura); idle(Me, t); Me.root.visible = t < 63;
        rosto(Me, t, { olhar: [-0.8, 0], fala: fala(t, 'Mãe'), raiva: 1 });
        let p = [0.6, 1.5, 4.4], a = [0.5, 1.0, -1.4], fov = 44, shk = [0, 0];
        if (fala(t, 'Lucas') && t < 63) { const hp = cabeca(L); p = [hp.x + 0.5, hp.y + 0.05, hp.z + 2.0]; a = [hp.x + 0.3, hp.y - 0.15, hp.z]; fov = 40; shk = shake(t, t > 59 ? 0.2 : 0); }
        else if (fala(t, 'Pedro')) { const hp = cabeca(Pd); p = [hp.x - 0.1, hp.y + 0.05, hp.z + 1.5]; a = [hp.x, hp.y, hp.z]; fov = 38; }
        else if (varrendo) { const k = easeInOut(clamp((t - 63) / 8)); p = lerp3([0.6, 1.5, 4.6], [0.2, 1.9, 5.6], k); a = [0.4, 0.9, -0.8]; }
        cam(st, p, a, fov, 0, shk);
        return sc;
      },
    };
  },
};
