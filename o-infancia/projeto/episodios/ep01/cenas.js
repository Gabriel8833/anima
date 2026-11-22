// "E se você pudesse voltar à sua infância?" — 5 cenas 3D (sem falas de personagens; só narração)
import { THREE, V, lerp, clamp, sstep, win, easeInOut, easeOut, glowSprite, shake, impulse } from '../../motor/base.js';
import { rosto, resetPose, walk, idle, pose, P, sentar, segurar } from '../../motor/familia.js';
import { crianca, adulto, amigo, bola, controle, quartoInfancia, quartoAtual, casaManha, ruaBairro, telaJogo, acertarRelogio } from '../../motor/infancia.js';

const cam = (st, p, a, fov = 40, roll = 0, shk = [0, 0]) => st.cam(p, a, fov, roll, shk);
const lerp3 = (a, b, k) => a.map((v, i) => lerp(v, b[i], k));
const cabeca = h => h.head.getWorldPosition(new THREE.Vector3());
// deitado de barriga para cima (cabeça para -z)
function deitar(h, x, y, zPes) { h.root.position.set(x, y, zPes); h.root.rotation.set(-Math.PI / 2, 0, 0); }

// ---------- 1. O despertar ----------
export const c1 = {
  inicio: 0, fim: 10,
  criar(st) {
    const sc = new THREE.Scene(); const Q = quartoInfancia(sc);
    const A = adulto(), C = crianca(); sc.add(A.root, C.root);
    return {
      atualizar(t) {
        telaJogo(Q.tv, t, 'desligada'); acertarRelogio(Q.relogio, 7, 10 + t * 0.2);
        const adultoAtivo = t < 3.4;
        A.root.visible = adultoAtivo; C.root.visible = !adultoAtivo;
        if (adultoAtivo) {
          resetPose(A); A.root.scale.setScalar(0.9); deitar(A, -1.6, 0.52, -0.2);
          const abre = sstep(2.4, 2.8, t); rosto(A, t, { fechado: 1 - abre, piscar: abre > 0.9, olhar: [Math.sin(t * 4) * 0.6 * abre, 0], preoc: abre * 0.4 });
          Q.coberta.visible = true;
          const hp = cabeca(A); const k = easeInOut(clamp(t / 3)); cam(st, [hp.x + lerp(1.4, 0.45, k), hp.y + lerp(1.6, 0.95, k), hp.z + lerp(1.2, 0.35, k)], [hp.x, hp.y, hp.z], 40);
          return sc;
        }
        // criança sentada na cama: olha as próprias mãos, depois o quarto
        resetPose(C); C.root.position.set(-1.6, 0, -0.75); C.root.rotation.set(0, 0.15, 0); sentar(C, 1, 0.84);
        const maos = win(t, 3.5, 3.8, 5.4, 5.8);
        pose(C, { shL: [-1.25, 0, 0.35], shR: [-1.25, 0, -0.35], elL: [-1.2, 0, 0], elR: [-1.2, 0, 0], head: [0.35, 0, 0] }, maos);
        const descob = sstep(4.4, 4.8, t);
        rosto(C, t, { olhar: maos > 0.5 ? [0, 0.8] : [Math.sin((t - 5.6) * 1.2) * 0.9, -0.2], medo: maos > 0.5 ? 0.8 * (1 - descob * 0.5) : 0, sorriso: t > 5.8 ? 0.9 : (descob * 0.5) });
        let p, a, fov = 42;
        const hp = cabeca(C);
        if (t < 5.6) { p = [hp.x + 0.15, hp.y + 0.15, hp.z + 0.85]; a = [hp.x, hp.y - 0.18, hp.z + 0.1]; fov = 40; }
        else { const k = easeInOut(clamp((t - 5.6) / 4.4)); const ang = lerp(-1.45, 1.6, k); p = [-0.5 + Math.sin(ang) * 2.4, lerp(1.5, 1.25, k), 0.5 + Math.cos(ang) * 2.4]; a = [lerp(hp.x, 0.4, 0.4), 0.9, lerp(hp.z, -1.2, 0.4)]; fov = 52; }
        cam(st, p, a, fov);
        return sc;
      },
    };
  },
};

// ---------- 2. As pequenas coisas ----------
export const c2 = {
  inicio: 10, fim: 20,
  criar(st) {
    const scC = new THREE.Scene(); casaManha(scC);
    const scR = new THREE.Scene(); const R = ruaBairro(scR);
    const C = crianca(), CR = crianca(); scC.add(C.root); scR.add(CR.root);
    const A = [0, 1, 2, 3].map(i => amigo(i)); A.forEach(a => scR.add(a.root));
    const bolaR = bola(); scR.add(bolaR);
    return {
      atualizar(t) {
        if (t < 15.0) {
          // corre pelo corredor, para na mesa do café, sai pela porta
          resetPose(C); const para = t > 11.9 && t < 13.5;
          let x; if (t < 11.9) x = lerp(-4.2, 1.7, (t - 10) / 1.9); else if (para) x = 1.7; else x = lerp(1.7, 6.6, (t - 13.5) / 1.5);
          C.root.position.set(x, 0, 0.1); C.root.rotation.set(0, Math.PI / 2, 0);
          if (!para) { walk(C, t * 15, 1, 1); } else { C.root.rotation.y = Math.PI / 2 - 0.9; pose(C, P.comer); C.elR.rotation.x = -1.6 - Math.abs(Math.sin(t * 6)) * 0.4; }
          rosto(C, t, { sorriso: 1, olhar: para ? [0.5, 0.3] : [0, 0] });
          const hp = cabeca(C); cam(st, [hp.x - 1.2, 1.3, 3.2], [hp.x + 0.6, 0.8, -0.3], 48);
          return scC;
        }
        // rua do bairro: corre na calçada até os amigos
        resetPose(CR); const u = clamp((t - 15) / 5); CR.root.position.set(lerp(-14, -2, u), 0.0, 2.6); CR.root.rotation.set(0, Math.PI / 2, 0); walk(CR, t * 14, 1, 1); rosto(CR, t, { sorriso: 1 });
        A.forEach((a, i) => { resetPose(a); const x = [0.5, 2.2, 3.4, 1.4][i], z = [1.0, 0.0, 1.6, -1.2][i]; a.root.position.set(x, 0, z); a.root.rotation.set(0, -1.2 + i * 0.4, 0); if (i === 1) { pose(a, { shR: [-2.7, 0, 0.2], elR: [-0.2, 0, 0] }); a.shR.rotation.z = 0.2 + Math.sin(t * 9) * 0.3; } else { walk(a, t * 8 + i, 0.6); } idle(a, t); rosto(a, t, { sorriso: 0.8, olhar: [-0.8, 0] }); });
        bolaR.position.set(1.2 + Math.sin(t * 2) * 0.8, 0.11 + Math.abs(Math.sin(t * 6)) * 0.4, 0.6); bolaR.rotation.z = -t * 6;
        const hp = cabeca(CR); cam(st, [hp.x - 1.6, 1.3, 5.0], [hp.x + 2.5, 0.8, hp.z - 1.2], 50);
        return scR;
      },
    };
  },
};

// ---------- 3. A partida de futebol ----------
export const c3 = {
  inicio: 20, fim: 32,
  criar(st) {
    const sc = new THREE.Scene(); const R = ruaBairro(sc);
    const C = crianca(); sc.add(C.root);
    const A = [0, 1, 2, 3].map(i => amigo(i)); A.forEach(a => sc.add(a.root));
    const bl = bola(); sc.add(bl);
    const portao = R.casas.find(c => c.g.position.z < 0 && Math.abs(c.g.position.x - 3.2) < 3.3) || R.casas[16];
    const pg = portao.portao.getWorldPosition(new THREE.Vector3());
    const CHUTE = 29.4, BATE = 29.9;
    return {
      atualizar(t) {
        const kids = [C, ...A];
        kids.forEach(k => resetPose(k));
        // posições base em roda na rua
        const base = [[-1.0, 1.2], [1.2, -0.4], [2.6, 1.0], [-2.4, -0.6], [0.4, 2.2]];
        const susto = t > BATE + 0.1;
        kids.forEach((k, i) => { const [x, z] = base[i]; k.root.position.set(x + Math.sin(t * 1.5 + i) * (t < 22 ? 0.6 : 0.15), 0, z); k.root.rotation.set(0, Math.atan2(0.4 - x, 0.6 - z), 0); if (t < 22 || (t > 27.8 && t < CHUTE)) walk(k, t * 9 + i, 0.8, 0.5); });
        // bola: troca de passes, depois vai no portão
        let bp;
        if (t < 22) { const seg = Math.floor((t - 20) / 0.7) % 5, u = ((t - 20) / 0.7) % 1; const a = kids[seg].root.position, b = kids[(seg + 2) % 5].root.position; bp = V(lerp(a.x, b.x, u), 0.11 + Math.sin(u * Math.PI) * 0.3, lerp(a.z, b.z, u)); }
        else if (t < CHUTE) { const a = kids[0].root.position; bp = V(a.x + 0.35, 0.11 + Math.abs(Math.sin(t * 5)) * 0.15, a.z + 0.2); }
        else { const u = clamp((t - CHUTE) / (BATE - CHUTE)); const a = kids[0].root.position; const voltaU = clamp((t - BATE) / 0.8); bp = V(lerp(a.x + 0.35, pg.x, u) + voltaU * 0.6, 0.11 + Math.sin(u * Math.PI) * 1.2 + (t > BATE ? Math.abs(Math.sin(voltaU * 6)) * 0.4 * (1 - voltaU) : 0), lerp(a.z + 0.2, pg.z + 0.15, u) + voltaU * 1.2); }
        bl.position.copy(bp); bl.rotation.z = -t * 8;
        // portão balança com a pancada
        portao.portao.rotation.y = impulse(t, BATE, 0.25, 0.6) * Math.sin((t - BATE) * 30);
        // humor do goleiro: o amigo 1 aponta para o amigo 3, que foge; depois todos apontam um pro outro
        const escolha = t > 22.2 && t < 26.4, ninguem = t > 26.6 && t < CHUTE;
        if (escolha) { pose(A[0], P.apontar); A[0].root.rotation.y = -2.4; rosto(A[0], t, { sorriso: 0.6, olhar: [0.6, 0] }); const foge = sstep(23.2, 23.8, t); A[2].root.position.x += foge * 2.2; A[2].root.rotation.y = foge > 0.5 ? Math.PI / 2 : A[2].root.rotation.y; if (foge > 0 && t < 25) walk(A[2], t * 14, 1, 1); pose(A[2], { shL: [-1.2, 0, -0.6], shR: [-1.2, 0, 0.6] }, foge); A[2].shL.rotation.z -= Math.sin(t * 20) * 0.3 * foge; rosto(A[2], t, { medo: 1, olhar: [-0.8, 0] }); }
        if (ninguem) kids.forEach((k, i) => { if (i === 0) return; pose(k, P.apontar); k.root.rotation.y += Math.sin(t * 3 + i) * 0.6; rosto(k, t, { sorriso: 0.7, olhar: [Math.sin(t * 3 + i) * 0.8, 0] }); });
        if (ninguem) { pose(C, { shL: [-0.3, 0, -0.6], shR: [-0.3, 0, 0.6], elL: [-0.4, 0, 0], elR: [-0.4, 0, 0] }); C.head.rotation.y = Math.sin(t * 6) * 0.3; }
        // chute e susto geral
        if (t > CHUTE - 0.3 && t < BATE) { C.hipR.rotation.x = lerp(0.6, -1.2, clamp((t - CHUTE + 0.3) / 0.35)); }
        if (susto) kids.forEach((k, i) => { pose(k, P.maosNaCabeca, sstep(BATE + 0.1, BATE + 0.3, t)); k.root.rotation.y = Math.atan2(pg.x - k.root.position.x, pg.z - k.root.position.z); rosto(k, t, { medo: 1, olhar: [0, 0], piscar: false }); k.mouthOpen.scale.set(1, 1.2, 0.4); });
        else kids.forEach((k, i) => { if (!(escolha && (i === 1 || i === 3)) && !ninguem) rosto(k, t, { sorriso: 0.9, olhar: [0, 0] }); if (ninguem && i === 0) rosto(k, t, { sorriso: 1 }); });
        let p, a, fov = 46, shk = [0, 0];
        if (t < 22.2) { const k = (t - 20) / 2.2; p = [lerp(-4, -2, k), 1.6, 6.5]; a = [0.4, 0.6, 0.6]; }
        else if (t < 26.4) { const hp = cabeca(A[2]); p = [hp.x - 0.8, 1.2, hp.z + 3.2]; a = [hp.x, 0.7, hp.z]; fov = 44; }
        else if (t < CHUTE) { p = [0.4, 2.0, 6.6]; a = [0.4, 0.6, 0.8]; }
        else if (t < BATE + 0.6) { p = [pg.x + 2.5, 1.2, pg.z + 4.0]; a = [pg.x, 0.7, pg.z]; fov = 40; shk = shake(t, impulse(t, BATE, 0.8)); }
        else { const k = easeOut(clamp((t - BATE - 0.6) / 0.8)); p = lerp3([pg.x + 2.5, 1.2, pg.z + 4.0], [0.4, 1.1, 4.4], k); a = [0.4, 0.8, 0.6]; fov = 44; }
        cam(st, p, a, fov, 0, shk);
        return sc;
      },
    };
  },
};

// ---------- 4. A noite ----------
export const c4 = {
  inicio: 32, fim: 44,
  criar(st) {
    const scR = new THREE.Scene(); ruaBairro(scR, { entardecer: 1 });
    const scQ = new THREE.Scene(); const Q = quartoInfancia(scQ, { noite: 1 });
    const CR = crianca(), C = crianca(); scR.add(CR.root); scQ.add(C.root);
    const ctrl = controle();
    return {
      atualizar(t) {
        if (t < 35.6) {
          // volta para casa ao entardecer, cansado mas feliz
          resetPose(CR); const u = clamp((t - 32) / 3.4); CR.root.position.set(lerp(-3, 1.2, u), 0.0, lerp(1.2, -3.2, u)); CR.root.rotation.set(0, Math.atan2(4.2, -4.4), 0); walk(CR, t * 7, 0.8); CR.torso.rotation.x += 0.1;
          rosto(CR, t, { sorriso: 0.8, fechado: 0.3, olhar: [0, 0.3] });
          const hp = cabeca(CR); cam(st, [hp.x - 1.2, 1.4, hp.z + 3.4], [hp.x, 0.8, hp.z - 1], 46);
          return scR;
        }
        // sentado no chão jogando videogame; depois o desenho favorito
        const desenho = t > 39.2;
        telaJogo(Q.tv, t, desenho ? 'jogo' : 'jogo'); acertarRelogio(Q.relogio, 21, 38 + (t - 35.6) * 0.6);
        resetPose(C); C.root.position.set(1.25, 0, -0.55); C.root.rotation.set(0, Math.PI - 0.35, 0); sentar(C, 1, 0.35);
        segurar(C, 'R', desenho ? null : ctrl); pose(C, desenho ? { shL: [-0.3, 0, -0.3], shR: [-0.3, 0, 0.3], torso: [-0.1, 0, 0] } : { shL: [-0.8, 0, 0.3], shR: [-0.8, 0, -0.3], elL: [-1.0, 0, 0], elR: [-1.0, 0, 0] });
        if (!desenho) { C.shL.rotation.x += Math.sin(t * 11) * 0.05; C.torso.rotation.z = Math.sin(t * 1.7) * 0.08; }
        rosto(C, t, { sorriso: desenho ? 1 : 0.6, olhar: [0, -0.1], piscar: true });
        let p, a, fov = 44;
        const hp = cabeca(C);
        if (t < 38.4) { const k = easeInOut(clamp((t - 35.6) / 2.8)); p = lerp3([0.2, 1.5, 1.8], [0.6, 1.1, 0.9], k); a = [1.4, 0.6, -1.0]; }
        else if (t < 39.8) { const rp = Q.relogio.getWorldPosition(new THREE.Vector3()); p = [rp.x + 0.3, rp.y - 0.1, rp.z + 1.4]; a = [rp.x, rp.y, rp.z]; fov = 36; }
        else { p = [hp.x + 0.15, hp.y + 0.05, hp.z - 0.9]; a = [hp.x, hp.y - 0.02, hp.z]; fov = 40; }
        cam(st, p, a, fov);
        return scQ;
      },
    };
  },
};

// ---------- 5. O retorno ----------
export const c5 = {
  inicio: 44, fim: 60,
  criar(st) {
    const scQ = new THREE.Scene(); const Q = quartoInfancia(scQ, { noite: 1 });
    const scA = new THREE.Scene(); const QA = quartoAtual(scA);
    const C = crianca(), A = adulto(); scQ.add(C.root); scA.add(A.root);
    return {
      atualizar(t) {
        if (t < 48.4) {
          telaJogo(Q.tv, t, 'desligada'); acertarRelogio(Q.relogio, 22, 10);
          resetPose(C); deitar(C, -1.6, 0.52, -0.75);
          const fecha = sstep(45.6, 46.6, t); rosto(C, t, { fechado: fecha, piscar: false, sorriso: 0.5 });
          const hp = cabeca(C); const k = easeInOut(clamp((t - 44) / 4.4)); cam(st, [hp.x + lerp(1.2, 0.2, k), hp.y + lerp(1.4, 0.5, k), hp.z + lerp(1.4, 0.15, k)], [hp.x, hp.y, hp.z], 40);
          return scQ;
        }
        // presente: o mesmo personagem, adulto, acorda no quarto escuro e fica pensativo
        resetPose(A); A.root.scale.setScalar(0.95);
        const senta = sstep(50.0, 51.4, t);
        if (senta < 0.01) { deitar(A, -1.4, 0.52, 0.0); rosto(A, t, { fechado: 1 - sstep(48.8, 49.4, t), piscar: false, preoc: 0.3 }); }
        else { A.root.position.set(-1.4, lerp(0.52, 0.0, senta), lerp(0.0, -0.4, senta)); A.root.rotation.set(-Math.PI / 2 * (1 - senta), 0.3 * senta, 0); sentar(A, senta, 0.47 / 0.95); pose(A, { shL: [-0.5, 0, 0.3], shR: [-0.5, 0, -0.3], elL: [-1.2, 0, 0], elR: [-1.2, 0, 0], torso: [0.25, 0, 0], head: [0.15, 0, 0] }, senta); rosto(A, t, { olhar: t < 53.4 ? [Math.sin(t * 0.9) * 0.8, 0] : [0.2, 0.4], preoc: 0.6, sorriso: -0.4 }); }
        QA.notif.material.opacity = 0.3 + 0.3 * Math.abs(Math.sin(t * 1.5));
        const hp = cabeca(A); let p, a, fov = 40;
        if (t < 53.6) { const k = easeInOut(clamp((t - 48.4) / 5)); p = [hp.x + lerp(0.3, 0.9, k), hp.y + lerp(0.6, 0.15, k), hp.z + lerp(0.3, 1.5, k)]; a = [hp.x, hp.y, hp.z]; }
        else { const k = easeInOut(clamp((t - 53.6) / 6.4)); p = lerp3([hp.x + 0.9, hp.y + 0.15, hp.z + 1.5], [1.6, 2.2, 3.4], k); a = lerp3([hp.x, hp.y, hp.z], [-0.8, 0.7, -1.2], k); fov = lerp(40, 50, k); }
        cam(st, p, a, fov);
        return scA;
      },
    };
  },
};
