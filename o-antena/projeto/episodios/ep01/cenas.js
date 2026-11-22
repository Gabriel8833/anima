// "Você já se perguntou por que o teto do carro tem uma antena?" — 5 cenas 3D estilizadas
import { THREE, V, lerp, clamp, sstep, win, kf, easeInOut, easeOut, rng, mesh, glowSprite, skyDome, impulse, shake } from '../../motor/base.js';
import { toon, peca, caixa, carro, rodar, topoAntena, cidade, torre, ondasAneis, ondaSeno, poof, placa, texTexto } from '../../motor/mundo.js';

const VEL = 9; // m/s
const P = (o, v) => V(o.x + v.x, o.y + v.y, o.z + v.z);

// ---------- 1. A pergunta ----------
export const c1 = {
  inicio: 0, fim: 9.0,
  criar(st) {
    const sc = new THREE.Scene(); cidade(sc, { hora: 'dia' });
    const car = carro({ cor: 0xe8402a, antena: 'mastro' }); sc.add(car); st.metal(car);
    // laço de "enfeite" (piada) no topo da antena
    const laco = new THREE.Group(); const rosa = toon(0xff5aa0);
    for (const s of [-1, 1]) { const l = mesh(new THREE.TorusGeometry(0.09, 0.035, 8, 20), rosa); l.position.set(0, 0, s * 0.09); l.rotation.y = Math.PI / 2; l.scale.set(1, 0.7, 1); laco.add(l); }
    laco.add(mesh(new THREE.SphereGeometry(0.05, 10, 8), rosa)); car.add(laco);
    const nuvemPos = V(); const nuvem = poof(sc, nuvemPos, 0xffd0e8);
    const sol = sc.userData.sol;
    return {
      atualizar(t) {
        const x = -30 + t * VEL; car.position.set(x, 0, -1.6); rodar(car, x); car.position.y = Math.sin(t * 18) * 0.01;
        sol.position.set(x + 24, 30, -36); sol.target.position.set(x, 0, 0);
        const tp = topoAntena(car);
        laco.position.copy(car.userData.antena.position).add(car.userData.antena.userData.topo).add(V(0.02, -0.06, 0));
        const apar = sstep(4.6, 5.0, t), some = t > 6.6; laco.scale.setScalar(some ? 0 : apar * (1 + Math.sin(t * 9) * 0.05)); if (t < 6.6) nuvemPos.copy(car.localToWorld(laco.position.clone())); else nuvemPos.x = car.localToWorld(laco.position.clone()).x; nuvem(t - 6.6);
        // câmera: lateral acompanhando → aproxima do teto → zoom na antena
        const k = easeInOut(clamp((t - 1.2) / 3.4));
        const pos = [lerp(x - 6, tp.x + 1.6, k), lerp(2.2, tp.y + 0.5, k), lerp(9, tp.z + 2.2, k)];
        const alvo = [lerp(x + 1, tp.x, k), lerp(1.0, tp.y - 0.25, k), lerp(-1.6, tp.z, k)];
        st.cam(pos, alvo, lerp(42, 30, k), 0, shake(t, 0.05));
        return sc;
      },
    };
  },
};

// ---------- 2. A verdade: as ondas chegam à antena e viram som ----------
export const c2 = {
  inicio: 9.0, fim: 20.4,
  criar(st) {
    const sc = new THREE.Scene(); cidade(sc, { hora: 'dia' });
    const tw = torre(sc, 70, -110, 45); const aneis = ondasAneis(sc, tw.userData.topo, { n: 6, raioMax: 160 });
    const car = carro({ cor: 0xe8402a, antena: 'mastro', transparente: 0.86 }); sc.add(car);
    // dentro do carro: cabo, rádio com visor e alto-falantes
    const roof = car.userData.roofY, base = V(-0.95, roof, 0);
    const caminho = new THREE.CatmullRomCurve3([base, V(-1.15, 1.35, 0.55), V(-0.6, 0.95, 0.7), V(0.6, 0.9, 0.5), V(1.25, 1.0, 0)]);
    const cabo = mesh(new THREE.TubeGeometry(caminho, 60, 0.025, 6), toon(0x2a2a2e), false); car.add(cabo);
    const pulsoMat = new THREE.MeshBasicMaterial({ color: 0x7af0ff, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
    const pulsos = [0, 1, 2].map(() => { const s = glowSprite(0x7af0ff, 0.25, 1); car.add(s); return s; });
    const radio = peca(caixa(0.18, 0.3, 0.6, 0.04), toon(0x2a2a30), { contorno: 0.02 }); radio.position.set(1.3, 1.02, 0); car.add(radio);
    const visor = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.14), new THREE.MeshBasicMaterial({ map: texTexto('FM 98.5  ♪', { w: 512, h: 140, cor: '#7af0ff', fundo: '#0a1a24', tam: 80 }), toneMapped: false })); visor.position.set(1.2, 1.07, 0); visor.rotation.y = -Math.PI / 2; car.add(visor);
    for (const s of [-1, 1]) { const al = peca(new THREE.CylinderGeometry(0.12, 0.12, 0.05, 20), toon(0x1a1a1e), { contorno: 0.015 }); al.position.set(0.6, 0.75, s * 0.86); al.rotation.x = Math.PI / 2; car.add(al); }
    // onda senoidal do céu até a antena (presa ao carro)
    const tpLocal = P(car.userData.antena.position, car.userData.antena.userData.topo);
    const ondas = [];
    for (let i = 0; i < 3; i++) { const g = new THREE.Group(); car.add(g); ondas.push({ g, f: ondaSeno(g, P(tpLocal, V(14 - i * 3, 9 + i * 2, -6 + i * 4)), tpLocal, { amp: 0.4, ciclos: 7, raio: 0.035 }) }); }
    // saídas: música, notícias e informações
    const saidas = [];
    const notas = [0, 1, 2, 3, 4].map(i => { const p = placa('♪', 0.35, { w: 128, h: 128, cor: '#ffd23a', tam: 110 }); car.add(p); return p; });
    const sol = sc.userData.sol;
    return {
      atualizar(t) {
        const x = -30 + t * VEL; car.position.set(x, 0, -1.6); rodar(car, x);
        sol.position.set(x + 24, 30, -36); sol.target.position.set(x, 0, 0);
        aneis(t, 0.3, 1); tw.userData.luz.material.opacity = Math.sin(t * 5) > 0 ? 1 : 0.2;
        const chega = sstep(10.2, 11.6, t); ondas.forEach(({ f }, i) => f(t + i * 0.3, chega));
        // pulso descendo pelo cabo até o rádio
        pulsos.forEach((s, i) => { const u = ((t - 11.8) * 0.7 + i / 3) % 1; s.visible = t > 11.8; s.position.copy(caminho.getPoint(Math.max(0, u))); });
        visor.material.opacity = 1; visor.visible = t > 12.4;
        notas.forEach((n, i) => { const u = ((t - 13) * 0.5 + i / 5) % 1; n.visible = t > 13; n.position.set(0.6 - u * 0.6, 0.9 + u * 1.6, (i % 2 ? 1 : -1) * (0.9 + u * 0.6)); n.material.opacity = Math.sin(u * Math.PI); });

        // câmera: desce sobre o teto, "atravessa" e mostra o interior
        const tp = car.localToWorld(tpLocal.clone());
        let pos, alvo, fov;
        if (t < 10.6) { const k = easeInOut(clamp((t - 9.0) / 1.6)); pos = [tp.x + lerp(1.6, 0.2, k), tp.y + lerp(0.6, -0.1, k), tp.z + lerp(2.2, 0.4, k)]; alvo = [tp.x, tp.y - lerp(0.3, 1.2, k), tp.z]; fov = lerp(30, 60, k); }
        else { const k = easeInOut(clamp((t - 10.6) / 9.8)); const a = lerp(0.9, 0.2, k); pos = [x + Math.sin(a) * lerp(4.2, 5.6, k), lerp(4.6, 3.2, k), -1.6 + Math.cos(a) * lerp(4.2, 5.6, k)]; alvo = [x + 0.2, lerp(1.3, 1.6, k), -1.6]; fov = 46; }
        st.cam(pos, alvo, fov);
        return sc;
      },
    };
  },
};

// ---------- 3. Por que no teto? antena escondida x antena no teto ----------
function texBarras(n, cor) { const c = document.createElement('canvas'); c.width = 256; c.height = 160; const x = c.getContext('2d'); for (let i = 0; i < 4; i++) { x.fillStyle = i < n ? cor : 'rgba(255,255,255,0.25)'; x.beginPath(); x.roundRect(30 + i * 52, 130 - (i + 1) * 28, 36, (i + 1) * 28, 6); x.fill(); } const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; }
export const c3 = {
  inicio: 20.4, fim: 31.0,
  criar(st) {
    const sc = new THREE.Scene(); cidade(sc, { hora: 'dia', x0: -120, x1: 120, lados: [-1] });
    const A = carro({ cor: 0x3a6ad0, antena: 'escondida' }), B = carro({ cor: 0xe8402a, antena: 'mastro' });
    A.position.set(-3.0, 0, -1.6); B.position.set(3.0, 0, -1.6); A.scale.setScalar(0.62); B.scale.setScalar(0.62); sc.add(A, B);
    // antena escondida visível pelo vidro (brilho fraco)
    const tA = topoAntena(A), tB = topoAntena(B);
    const ceuA = [V(-8, 10, -4), V(-3, 12, -6), V(2, 11, -3)].map(p => P(tA, p)), ceuB = [V(-4, 11, -5), V(2, 12, -4), V(6, 10, -3)].map(p => P(tB, p));
    const tetoA = P(A.position, V(-0.3, 1.69 * 0.62, 0));
    const wA = ceuA.map(p => ondaSeno(sc, p, tetoA, { amp: 0.35, raio: 0.03 })), wB = ceuB.map(p => ondaSeno(sc, p, tB, { amp: 0.35, raio: 0.03 }));
    const fracaA = ondaSeno(sc, tetoA, tA, { amp: 0.05, ciclos: 2, raio: 0.02, cor: 0x7af0ff });
    const choque = glowSprite(0xffffff, 1.2, 0.8); choque.position.copy(tetoA); sc.add(choque);
    const brilhoB = glowSprite(0x7af0ff, 0.8, 1); brilhoB.position.copy(tB); sc.add(brilhoB);
    const rotA = placa('ANTENA ESCONDIDA', 2.6, { w: 720, h: 150, fundo: '#1a1e2a', borda: '#ff6a5a', tam: 64 }), rotB = placa('ANTENA NO TETO', 2.6, { w: 720, h: 150, fundo: '#1a1e2a', borda: '#5ad08a', tam: 64 });
    rotA.position.set(-3.0, 2.9, -1.6); rotB.position.set(3.0, 2.9, -1.6); sc.add(rotA, rotB);
    const barA = new THREE.Sprite(new THREE.SpriteMaterial({ map: texBarras(1, '#ff6a5a'), transparent: true })), barB = new THREE.Sprite(new THREE.SpriteMaterial({ map: texBarras(4, '#5ad08a'), transparent: true }));
    barA.scale.set(1.1, 0.7, 1); barB.scale.set(1.1, 0.7, 1); barA.position.set(-3.0, 2.2, -1.6); barB.position.set(3.0, 2.2, -1.6); sc.add(barA, barB);
    const marcaA = placa('✖', 0.8, { w: 200, h: 200, cor: '#ff5a4a', tam: 170 }), marcaB = placa('✔', 0.8, { w: 200, h: 200, cor: '#5ad08a', tam: 170 }); marcaA.position.set(-1.4, 2.2, -1.6); marcaB.position.set(4.6, 2.2, -1.6); sc.add(marcaA, marcaB);
    const interroga = placa('?', 1.6, { w: 256, h: 256, cor: '#ffd23a', tam: 230 }); sc.add(interroga);
    const sol = sc.userData.sol; sol.position.set(20, 30, -20); sol.target.position.set(0, 0, 0);
    return {
      atualizar(t) {
        const a = sstep(23.6, 24.4, t);
        wA.forEach((f, i) => f(t + i * 0.4, a)); fracaA(t, a * 0.25); choque.material.opacity = a * (0.4 + 0.4 * Math.abs(Math.sin(t * 9))); choque.scale.setScalar(0.8 + Math.abs(Math.sin(t * 9)) * 0.5);
        const b = sstep(25.6, 26.4, t); wB.forEach((f, i) => f(t + i * 0.4, b)); brilhoB.material.opacity = b * (0.6 + 0.4 * Math.sin(t * 8)); brilhoB.scale.setScalar(0.6 + 0.3 * Math.abs(Math.sin(t * 8)));
        rotA.visible = barA.visible = t > 23.4; rotB.visible = barB.visible = t > 25.6; marcaA.visible = marcaB.visible = t > 28.2;
        interroga.visible = t < 23.2; interroga.position.set(0, 3.2 + Math.sin(t * 4) * 0.15, -1.6); interroga.material.rotation = Math.sin(t * 3) * 0.2;
        let pos, alvo;
        if (t < 23.4) { const k = easeInOut(clamp((t - 20.4) / 3)); pos = [lerp(-1, 0, k), lerp(7, 4.4, k), lerp(19, 15.5, k)]; alvo = [0, 1.6, -1.6]; }
        else if (t < 25.6) { const k = easeInOut(clamp((t - 23.4) / 0.8)); pos = [lerp(0, -3.0, k), lerp(4.4, 2.6, k), lerp(15.5, 6.4, k)]; alvo = [lerp(0, -3.0, k), lerp(1.6, 1.4, k), -1.6]; }
        else if (t < 28.0) { const k = easeInOut(clamp((t - 25.6) / 0.8)); pos = [lerp(-3.0, 3.0, k), 2.6, 6.4]; alvo = [lerp(-3.0, 3.0, k), 1.4, -1.6]; }
        else { const k = easeInOut(clamp((t - 28.0) / 1.2)); pos = [lerp(3.0, 0, k), lerp(2.6, 4.4, k), lerp(6.4, 16, k)]; alvo = [lerp(3.0, 0, k), 1.6, -1.6]; }
        st.cam(pos, alvo, 46);
        return sc;
      },
    };
  },
};

// ---------- 4. Três modelos e a barbatana de tubarão ----------
export const c4 = {
  inicio: 31.0, fim: 42.4,
  criar(st) {
    const sc = new THREE.Scene();
    sc.add(skyDome({ top: 0x0a1030, mid: 0x1a2a5a, horizon: 0x3a4a8a, bottom: 0x0a0c18, sunColor: 0x000000 }));
    sc.add(new THREE.HemisphereLight(0xcfe0ff, 0x202040, 1.2)); const key = new THREE.SpotLight(0xffffff, 300, 40, 0.6, 0.5); key.position.set(0, 12, 8); key.castShadow = true; sc.add(key); sc.add(key.target);
    const piso = mesh(new THREE.CylinderGeometry(9, 9, 0.3, 64), toon(0x2a2e48)); piso.position.y = -0.15; sc.add(piso);
    const tipos = ['mastro', 'curta', 'barbatana'], nomes = ['COMPRIDA', 'CURTA', 'BARBATANA DE TUBARÃO'];
    const peds = tipos.map((tp, i) => {
      const g = new THREE.Group(); g.position.set((i - 1) * 3.2, 0, 0); sc.add(g);
      const ped = peca(new THREE.CylinderGeometry(0.9, 1.0, 1.0, 32), toon(0x3a3e5a), { contorno: 0.03 }); ped.position.y = 0.5; g.add(ped);
      const teto = peca(caixa(1.6, 0.18, 1.2, 0.08), toon(0xe8402a), { contorno: 0.03 }); teto.position.y = 1.1; g.add(teto);
      const c = carro({ antena: tp }); const a = c.userData.antena; c.remove(a); a.position.set(0, 1.19, 0); a.scale.setScalar(tp === 'mastro' ? 1.6 : 2.4); g.add(a);
      const rot = placa(nomes[i], 2.8, { w: 900, h: 150, fundo: '#141830', borda: '#7af0ff', tam: 62 }); rot.position.set(0, -0.2, 1.6); g.add(rot);
      return { g, a, rot };
    });
    const fin = peds[2].a.userData.fin; const finMat = fin.userData.malha.material.clone(); finMat.transparent = true; fin.userData.malha.material = finMat;
    // água (piada do tubarão)
    const agua = mesh(new THREE.CircleGeometry(2.2, 48), new THREE.MeshBasicMaterial({ color: 0x2a7ad0, transparent: true, opacity: 0.9 }), false); agua.rotation.x = -Math.PI / 2; agua.position.set(3.2, 1.22, 0); sc.add(agua);
    const ondasAgua = [0, 1, 2].map(() => { const r = new THREE.Mesh(new THREE.RingGeometry(0.9, 0.95, 48), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true })); r.rotation.x = -Math.PI / 2; r.position.set(3.2, 1.24, 0); sc.add(r); return r; });
    // dentro da barbatana: três "chips" com as funções
    const chips = [['📻 RÁDIO', 0xff9a3a, 36.0], ['📍 GPS', 0x5ad08a, 37.0], ['🛰️ SATÉLITE', 0x7aa8ff, 38.2]].map(([txt, cor, a0], i) => {
      const ch = glowSprite(cor, 0.5, 1); ch.position.set(3.2 + (i - 1) * 0.28, 1.5, 0); sc.add(ch);
      return { ch, a0, i };
    });
    // satélite no alto
    const sat = new THREE.Group(); sat.add(peca(caixa(0.6, 0.6, 0.6, 0.06), toon(0xd8d8e0), { contorno: 0.02 })); for (const s of [-1, 1]) { const pa = mesh(new THREE.BoxGeometry(1.4, 0.04, 0.6), toon(0x3a5ad0)); pa.position.x = s * 1.05; sat.add(pa); } sat.position.set(5.6, 6.6, -2); sc.add(sat);
    const feixe = ondaSeno(sc, V(5.6, 6.3, -2), V(3.2, 1.6, 0), { amp: 0.15, ciclos: 8, raio: 0.03, cor: 0x7aa8ff });
    const nota = placa('* depende do modelo do veículo', 3.2, { w: 1000, h: 110, cor: '#cfd8ff', tam: 52 }); nota.position.set(3.2, 0.25, 1.7); sc.add(nota);
    return {
      atualizar(t) {
        peds.forEach(({ g }, i) => { g.rotation.y = t * 0.6 + i; });
        // água e "tubarão": a barbatana dá voltas antes de revelar que está no teto
        const shark = win(t, 33.2, 33.5, 35.0, 35.4);
        agua.material.opacity = 0.9 * shark; agua.visible = shark > 0.01; ondasAgua.forEach((r, i) => { const u = ((t * 0.8) + i / 3) % 1; r.scale.setScalar(0.2 + u * 2); r.material.opacity = shark * (1 - u) * 0.8; r.visible = shark > 0.01; });
        if (shark > 0) { peds[2].g.rotation.y = t * 2.4; }
        const revela = sstep(35.6, 36.2, t); finMat.opacity = 1 - revela * 0.72;
        chips.forEach(({ ch, a0, i }) => { const k = easeOut(clamp((t - a0) / 0.4)); ch.visible = k > 0; ch.material.opacity = k * (0.7 + 0.3 * Math.sin(t * 6 + i)); });
        feixe(t, sstep(38.4, 38.9, t)); sat.visible = t > 38.2; sat.rotation.y = t * 0.5;
        nota.visible = t > 39.8;
        let pos, alvo, fov = 42;
        if (t < 33.2) { const k = easeInOut(clamp((t - 31.0) / 2.2)); pos = [lerp(-2, 0, k), lerp(4.5, 3.4, k), lerp(12, 9.5, k)]; alvo = [0, 1.4, 0]; peds.forEach(({ rot }) => rot.visible = true); }
        else { const k = easeInOut(clamp((t - 33.2) / 1.4)); pos = [lerp(0, 3.4, k), lerp(3.4, lerp(2.6, 3.2, sstep(36, 39, t)), k), lerp(9.5, lerp(4.4, 6.6, sstep(36, 39, t)), k)]; alvo = [lerp(0, 3.2, k), lerp(1.4, lerp(1.4, 2.6, sstep(36, 39, t)), k), 0]; fov = lerp(42, 40, k); peds.forEach(({ rot }, i) => rot.visible = i === 2 && t < 35.6); }
        st.cam(pos, alvo, fov);
        return sc;
      },
    };
  },
};

// ---------- 5. Final: o carro segue pela estrada ao pôr do sol ----------
export const c5 = {
  inicio: 42.4, fim: 55,
  criar(st) {
    const sc = new THREE.Scene(); cidade(sc, { hora: 'tarde', x0: -40, x1: 260, lados: [-1] });
    const car = carro({ cor: 0xe8402a, antena: 'barbatana' }); sc.add(car);
    const brilho = glowSprite(0x7af0ff, 0.6, 0.8); sc.add(brilho);
    const sol = sc.userData.sol;
    return {
      atualizar(t) {
        const x = (t - 42.4) * VEL; car.position.set(x, 0, -1.6); rodar(car, x);
        sol.position.set(x + 40, 8, -40); sol.target.position.set(x, 0, 0);
        const tp = topoAntena(car); brilho.position.copy(tp); brilho.material.opacity = 0.4 + 0.4 * Math.sin(t * 5);
        const k = easeInOut(clamp((t - 42.4) / 12.6));
        st.cam([x - lerp(6, 24, k), lerp(2.0, 18, k), lerp(5, 22, k)], [x + lerp(0, 6, k), lerp(1.2, 0, k), -1.6], lerp(40, 46, k));
        return sc;
      },
    };
  },
};
