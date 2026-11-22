// "Por que existem bolas nos fios elétricos?" — 5 cenas 3D estilizadas
import { THREE, V, lerp, clamp, sstep, win, easeInOut, easeOut, mesh, glowSprite, impulse, shake } from '../../motor/base.js';
import { toon, peca, caixa, poof } from '../../motor/mundo.js';
import { paisagem, esfera, basquete, helicoptero, girarRotores } from '../../motor/linhas.js';

const back = u => { const k = 1.9; return 1 + (k + 1) * Math.pow(u - 1, 3) + k * Math.pow(u - 1, 2); };
const arr = v => [v.x, v.y, v.z];

// ---------- 1. A pergunta ----------
export const c1 = {
  inicio: 0, fim: 9.2,
  criar(st) {
    const sc = new THREE.Scene(); const P = paisagem(sc);
    const alvo = P.esferas[4]; // esfera no meio do vão central
    const bb = basquete(0.9); sc.add(bb);
    return {
      atualizar(t) {
        const e = alvo.position, tw = P.torres[2].position;
        let pos, look, fov = 45;
        if (t < 5.4) { const k = easeInOut(clamp(t / 5.4)); pos = [lerp(tw.x + 70, e.x + 14, k), lerp(95, e.y + 4, k), lerp(90, e.z + 26, k)]; look = [lerp(tw.x, e.x, k), lerp(20, e.y, k), lerp(0, e.z, k)]; fov = lerp(50, 42, k); }
        else { const k = easeOut(clamp((t - 5.4) / 0.35)); pos = [lerp(e.x + 14, e.x + 2.2, k), lerp(e.y + 4, e.y + 0.4, k), lerp(e.z + 26, e.z + 5.2, k)]; look = [e.x + 0.9 * sstep(5.9, 6.4, t), e.y, e.z]; fov = 40; }
        // bola de basquete surge ao lado, quicando
        const ap = easeOut(clamp((t - 6.0) / 0.3)); bb.visible = ap > 0; bb.scale.setScalar(ap); bb.position.set(e.x + 2.0, e.y - 0.2 + Math.abs(Math.sin((t - 6.0) * 5)) * 0.9, e.z); bb.rotation.z = -t * 3;
        st.cam(pos, look, fov, 0, shake(t, impulse(t, 5.45, 0.6)));
        return sc;
      },
    };
  },
};

// ---------- 2. A verdade ----------
export const c2 = {
  inicio: 9.2, fim: 15.8,
  criar(st) {
    const sc = new THREE.Scene(); const P = paisagem(sc);
    const alvo = P.esferas[4], e = alvo.position;
    const bb = basquete(0.9); sc.add(bb); const nuvem = poof(sc, V(e.x + 2.0, e.y + 0.4, e.z), 0xffe0c0);
    const brilho = glowSprite(0xffb060, 4.5, 0.5); brilho.position.copy(e); sc.add(brilho);
    const luz = new THREE.PointLight(0xfff0d0, 30, 12); luz.position.set(e.x + 2, e.y + 2, e.z + 3); sc.add(luz);
    return {
      atualizar(t) {
        bb.visible = t < 9.7; bb.position.set(e.x + 2.0, e.y + 0.3, e.z); nuvem(t - 9.7);
        brilho.material.opacity = 0.35 + 0.15 * Math.sin(t * 3);
        let pos, look, fov = 40;
        if (t < 14.0) { const k = clamp((t - 9.2) / 4.8); const a = lerp(0.2, 2.6, easeInOut(k)); const d = lerp(5.2, 6.4, k); pos = [e.x + Math.sin(a) * d, e.y + lerp(0.4, 1.6, k), e.z + Math.cos(a) * d]; look = arr(e); }
        else { const k = easeInOut(clamp((t - 14.0) / 1.8)); const a = 2.6; pos = [e.x + Math.sin(a) * lerp(6.4, 90, k), e.y + lerp(1.6, 30, k), e.z + Math.cos(a) * lerp(6.4, 90, k)]; look = [lerp(e.x, 0, k), lerp(e.y, 20, k), e.z]; fov = lerp(40, 50, k); }
        st.cam(pos, look, fov);
        return sc;
      },
    };
  },
};

// ---------- 3. O verdadeiro motivo: helicóptero e cabine ----------
export const c3 = {
  inicio: 15.8, fim: 30.8,
  criar(st) {
    const sc = new THREE.Scene(); const P = paisagem(sc, { nevoa: 0.0035 });
    const H = helicoptero(); sc.add(H);
    const destaques = P.esferas.map(e => { const g = glowSprite(0xffa040, 5, 0); g.position.copy(e.position); sc.add(g); return g; });
    return {
      atualizar(t) {
        girarRotores(H, t);
        // o helicóptero voa em direção à linha (ao longo de -z), um pouco abaixo dos cabos
        const z = lerp(260, -10, clamp((t - 15.8) / 15)), subida = sstep(29.8, 30.8, t);
        H.position.set(10, 18 + Math.sin(t * 1.3) * 0.6 + subida * 16, z); H.rotation.set(0, Math.PI / 2, -0.08 - subida * 0.25);
        // nas cenas de cabine, as esferas somem (para mostrar o perigo de não vê-las)
        const cabine = t >= 23.8;
        P.esferas.forEach(e => e.visible = !cabine); H.visible = !cabine;
        const real = win(t, 20.6, 21.2, 23.4, 23.8); destaques.forEach(g => { g.material.opacity = real * (0.5 + 0.4 * Math.sin(t * 6)); g.scale.setScalar(5 + Math.sin(t * 6) * 1.5); });
        let pos, look, fov = 45, roll = 0;
        if (t < 20.6) { pos = [H.position.x + 30, H.position.y + 4, H.position.z - 2]; look = [H.position.x, H.position.y, H.position.z - 2]; fov = 42; }
        else if (t < 23.8) { const k = easeInOut(clamp((t - 20.6) / 1.2)); const e = P.esferas[4].position; pos = [lerp(H.position.x + 30, e.x + 10, k), lerp(H.position.y + 4, e.y + 2, k), lerp(H.position.z - 2, e.z + 36, k)]; look = [lerp(H.position.x, e.x, k), lerp(H.position.y, e.y, k), lerp(H.position.z - 2, e.z, k)]; fov = lerp(42, 36, k); }
        else { pos = [H.position.x + 0.8, H.position.y + 0.4, H.position.z]; look = [H.position.x + 0.8, H.position.y + 0.4 + subida * 30, H.position.z - 40]; fov = 62; roll = Math.sin(t * 1.3) * 0.02; }
        st.cam(pos, look, fov, roll, shake(t, cabine ? 0.06 + impulse(t, 29.8, 0.8) : 0.02));
        return sc;
      },
    };
  },
};

// ---------- 4. Por que essa cor? ----------
function texFundo(tipo) {
  const c = document.createElement('canvas'); c.width = 512; c.height = 512; const x = c.getContext('2d');
  if (tipo === 'ceu') { const g = x.createLinearGradient(0, 0, 0, 512); g.addColorStop(0, '#2a78d8'); g.addColorStop(1, '#bfe0f6'); x.fillStyle = g; x.fillRect(0, 0, 512, 512); x.fillStyle = 'rgba(255,255,255,0.85)'; for (const [cx, cy, r] of [[120, 160, 50], [170, 150, 60], [220, 170, 45], [360, 300, 40], [400, 290, 52]]) { x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill(); } }
  else if (tipo === 'mata') { x.fillStyle = '#3a6a3a'; x.fillRect(0, 0, 512, 512); for (let i = 0; i < 140; i++) { x.fillStyle = ['#2a5a2a', '#4a8a3a', '#356a30'][i % 3]; x.beginPath(); x.arc(Math.random() * 512, Math.random() * 512, 30 + Math.random() * 40, 0, 7); x.fill(); } }
  else { const g = x.createLinearGradient(0, 0, 0, 512); g.addColorStop(0, '#e8d8b8'); g.addColorStop(0.45, '#c8b08a'); g.addColorStop(1, '#8a7a5a'); x.fillStyle = g; x.fillRect(0, 0, 512, 512); x.fillStyle = '#9a8a6a'; x.beginPath(); x.moveTo(0, 300); x.lineTo(120, 200); x.lineTo(260, 280); x.lineTo(380, 180); x.lineTo(512, 260); x.lineTo(512, 512); x.lineTo(0, 512); x.fill(); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
export const c4 = {
  inicio: 30.8, fim: 42.6,
  criar(st) {
    const sc = new THREE.Scene();
    sc.add(new THREE.HemisphereLight(0xffffff, 0x404050, 1.4)); const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(4, 8, 10); sc.add(key);
    const fundos = ['ceu', 'mata', 'paisagem'].map(tp => { const m = mesh(new THREE.PlaneGeometry(40, 60), new THREE.MeshBasicMaterial({ map: texFundo(tp), transparent: true }), false); m.position.set(0, 0, -12); sc.add(m); return m; });
    const cabo = mesh(new THREE.CylinderGeometry(0.05, 0.05, 30, 6), toon(0x2a2a30), false); cabo.rotation.z = Math.PI / 2; cabo.position.set(0, 2.6, 0); sc.add(cabo);
    const bolas = ['#ff7a1a', '#f4f4f0', '#d8302a'].map((cor, i) => { const b = esfera(cor, 1.1); b.position.set((i - 1) * 3.1, 1.3, 0); sc.add(b); return b; });
    const aro = glowSprite(0xffd080, 4.2, 0.4); sc.add(aro);
    return {
      atualizar(t) {
        const idx = t < 34.6 ? 0 : t < 38.4 ? 1 : 2;
        fundos.forEach((f, i) => { f.material.opacity = i === idx ? 1 : 0; f.visible = i === idx; });
        bolas.forEach((b, i) => { b.rotation.y = t * 0.8 + i; b.position.y = 1.3 + Math.sin(t * 2 + i) * 0.06; });
        aro.position.copy(bolas[0].position); aro.material.opacity = 0.35 + 0.25 * Math.sin(t * 5);
        const k = easeInOut(clamp((t - 30.8) / 11.8));
        st.cam([Math.sin(t * 0.25) * 1.2, lerp(2.4, 1.8, k), lerp(23, 21, k)], [0, 1.4, 0], 42);
        return sc;
      },
    };
  },
};

// ---------- 5. Final ----------
export const c5 = {
  inicio: 42.6, fim: 58,
  criar(st) {
    const sc = new THREE.Scene(); const P = paisagem(sc);
    const alvo = P.esferas[4], e = alvo.position;
    const bb = basquete(0.9); sc.add(bb); const nuvem = poof(sc, V(e.x + 2.0, e.y + 0.4, e.z), 0xffe0c0);
    return {
      atualizar(t) {
        const ap = easeOut(clamp((t - 47.6) / 0.25)); bb.visible = t > 47.6 && t < 48.8; bb.scale.setScalar(ap); bb.position.set(e.x + 2.0, e.y - 0.2 + Math.abs(Math.sin((t - 47.6) * 6)) * 0.7, e.z); nuvem(t - 48.8);
        let pos, look, fov = 45;
        const tw = P.torres[2].position;
        if (t < 46.6) { const k = easeInOut(clamp((t - 42.6) / 4)); pos = [lerp(tw.x + 70, e.x + 6, k), lerp(95, e.y + 1.2, k), lerp(90, e.z + 12, k)]; look = [lerp(tw.x, e.x + 0.6, k), lerp(20, e.y, k), e.z]; fov = lerp(50, 40, k); }
        else if (t < 49.4) { pos = [e.x + 6, e.y + 1.2, e.z + 12]; look = [e.x + 0.6, e.y, e.z]; fov = 40; }
        else { const k = easeInOut(clamp((t - 49.4) / 8.6)); pos = [lerp(e.x + 6, 60, k), lerp(e.y + 1.2, 150, k), lerp(e.z + 12, 260, k)]; look = [lerp(e.x + 0.6, 0, k), lerp(e.y, 10, k), lerp(e.z, -20, k)]; fov = lerp(40, 50, k); }
        st.cam(pos, look, fov);
        return sc;
      },
    };
  },
};
