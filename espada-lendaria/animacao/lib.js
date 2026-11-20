// Utilitários: matemática, ruído, geometria procedural e personagens.
import * as THREE from 'three';

export const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, u) => a + (b - a) * u;
export const sstep = (a, b, x) => { const u = clamp((x - a) / (b - a)); return u * u * (3 - 2 * u); };
export const easeInOut = u => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
export const easeOut = u => 1 - Math.pow(1 - u, 3);
export const easeIn = u => u * u * u;
export const linear = u => u;

// Keyframes: kf(t, [[t0, v0], [t1, v1], ...]) — v pode ser número ou array.
export function kf(t, keys, ease = easeInOut) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [t0, v0] = keys[i], [t1, v1] = keys[i + 1];
    if (t < t1) {
      const u = ease((t - t0) / (t1 - t0));
      return Array.isArray(v0) ? v0.map((a, j) => lerp(a, v1[j], u)) : lerp(v0, v1, u);
    }
  }
  return keys[keys.length - 1][1];
}

export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash2(x, y) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}
export function noise2(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash2(xi, yi), b = hash2(xi + 1, yi), c = hash2(xi, yi + 1), d = hash2(xi + 1, yi + 1);
  return lerp(lerp(a, b, u), lerp(c, d, u), v) * 2 - 1;
}
export function fbm(x, y, oct = 4) {
  let s = 0, a = 0.5, f = 1;
  for (let i = 0; i < oct; i++) { s += a * noise2(x * f, y * f); f *= 2.03; a *= 0.5; }
  return s;
}
// tremor de câmera determinístico
export function shake(t, amp, freq = 18) {
  return [
    amp * (Math.sin(t * freq * 1.0) * 0.6 + Math.sin(t * freq * 2.31 + 1.3) * 0.4),
    amp * (Math.sin(t * freq * 1.17 + 2.1) * 0.6 + Math.sin(t * freq * 2.73 + 0.4) * 0.4),
  ];
}

// Tubo afunilado ao longo de uma curva (troncos, galhos, chifres).
export function taperTube(pts, r0, r1, rs = 7, ts = null) {
  const curve = new THREE.CatmullRomCurve3(pts);
  ts = ts || Math.max(6, pts.length * 4);
  const g = new THREE.TubeGeometry(curve, ts, 1, rs, false);
  const pos = g.attributes.position;
  const c = new THREE.Vector3(), p = new THREE.Vector3();
  for (let i = 0; i <= ts; i++) {
    const u = i / ts;
    curve.getPointAt(u, c);
    const r = lerp(r0, r1, Math.pow(u, 0.8));
    for (let j = 0; j <= rs; j++) {
      const k = i * (rs + 1) + j;
      p.fromBufferAttribute(pos, k).sub(c).multiplyScalar(r).add(c);
      pos.setXYZ(k, p.x, p.y, p.z);
    }
  }
  return g;
}

// Textura radial suave (névoa, partículas, brilhos).
let _soft;
export function softTex() {
  if (_soft) return _soft;
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const x = c.getContext('2d');
  const g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.35, 'rgba(255,255,255,0.55)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g; x.fillRect(0, 0, 128, 128);
  _soft = new THREE.CanvasTexture(c);
  return _soft;
}
let _cloud;
export function cloudTex() {
  if (_cloud) return _cloud;
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const x = c.getContext('2d');
  const r = rng(7);
  for (let i = 0; i < 40; i++) {
    const px = 128 + (r() - 0.5) * 140, py = 128 + (r() - 0.5) * 70, rad = 30 + r() * 50;
    const g = x.createRadialGradient(px, py, 0, px, py, rad);
    g.addColorStop(0, 'rgba(255,255,255,0.35)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g; x.fillRect(0, 0, 256, 256);
  }
  _cloud = new THREE.CanvasTexture(c);
  return _cloud;
}

export function glowSprite(color, size, opacity = 1) {
  const m = new THREE.SpriteMaterial({ map: softTex(), color, transparent: true, opacity,
    blending: THREE.AdditiveBlending, depthWrite: false });
  const s = new THREE.Sprite(m); s.scale.set(size, size, 1);
  return s;
}

// Céu em gradiente com brilho do sol.
export function skyDome({ top, mid, horizon, bottom, sunDir, sunColor, sunSize = 0.03, glow = 0.35, radius = 3000 }) {
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: {
      top: { value: new THREE.Color(top) }, mid: { value: new THREE.Color(mid) },
      horizon: { value: new THREE.Color(horizon) }, bottom: { value: new THREE.Color(bottom) },
      sunDir: { value: sunDir.clone().normalize() }, sunColor: { value: new THREE.Color(sunColor) },
      sunSize: { value: sunSize }, glow: { value: glow },
    },
    vertexShader: `varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);} `,
    fragmentShader: `uniform vec3 top,mid,horizon,bottom,sunDir,sunColor; uniform float sunSize,glow; varying vec3 vDir;
      void main(){ float h = vDir.y; vec3 c;
        if(h>0.0){ c = mix(horizon, mid, smoothstep(0.0,0.18,h)); c = mix(c, top, smoothstep(0.15,0.7,h)); }
        else { c = mix(horizon, bottom, smoothstep(0.0,0.12,-h)); }
        float d = max(dot(normalize(vDir), sunDir), 0.0);
        c += sunColor * (pow(d, 8.0)*glow + pow(d, 64.0)*0.6) ;
        c += sunColor * smoothstep(1.0 - sunSize*0.02, 1.0 - sunSize*0.012, d) * 2.0;
        gl_FragColor = vec4(c,1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  });
  const m = new THREE.Mesh(new THREE.SphereGeometry(radius, 32, 16), mat);
  m.renderOrder = -10;
  return m;
}

// ---------- Personagens ----------
const matCache = {};
export function std(color, rough = 0.85, metal = 0, extra = {}) {
  const key = [color, rough, metal, JSON.stringify(extra)].join('|');
  if (!matCache[key]) matCache[key] = new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal, ...extra });
  return matCache[key];
}

function cap(r, len, mat, seg = 10) {
  const m = new THREE.Mesh(new THREE.CapsuleGeometry(r, len, 4, seg), mat);
  m.castShadow = true;
  return m;
}
function mesh(geo, mat) { const m = new THREE.Mesh(geo, mat); m.castShadow = true; return m; }

// Esqueleto humanoide simples (frente = +z, altura ~1,75).
export function humanoid({ skin, top, sleeve, legs, boots, hands }) {
  const root = new THREE.Group();
  const pivot = new THREE.Group(); pivot.position.y = 0.55; root.add(pivot); // para rolar/inclinar
  const body = new THREE.Group(); body.position.y = -0.55; pivot.add(body);
  const hips = new THREE.Group(); hips.position.y = 0.95; body.add(hips);
  const torso = new THREE.Group(); hips.add(torso);
  const h = { root, pivot, body, hips, torso };

  const prof = [[0.235, -0.27], [0.215, -0.05], [0.19, 0.15], [0.205, 0.38], [0.175, 0.5], [0.07, 0.56]]
    .map(([r, y]) => new THREE.Vector2(r, y));
  const tunic = mesh(new THREE.LatheGeometry(prof, 20), top);
  tunic.scale.z = 0.72; torso.add(tunic); h.tunic = tunic;

  const head = new THREE.Group(); head.position.y = 0.6; torso.add(head); h.head = head;
  const neck = cap(0.05, 0.08, skin); neck.position.y = 0.0; head.add(neck);
  const skull = mesh(new THREE.SphereGeometry(0.12, 28, 20), skin);
  skull.position.y = 0.15; skull.scale.set(0.95, 1.1, 1.0); head.add(skull); h.skull = skull;

  for (const s of [-1, 1]) {
    const sh = new THREE.Group(); sh.position.set(0.215 * s, 0.47, 0); torso.add(sh);
    const up = cap(0.055, 0.2, sleeve); up.position.y = -0.15; sh.add(up);
    const el = new THREE.Group(); el.position.y = -0.31; sh.add(el);
    const fo = cap(0.045, 0.18, skin === hands ? skin : sleeve); fo.position.y = -0.13; el.add(fo);
    const hand = new THREE.Group(); hand.position.y = -0.29; el.add(hand);
    const hm = mesh(new THREE.SphereGeometry(0.05, 12, 10), hands); hm.scale.set(0.85, 1.1, 0.7); hand.add(hm);
    const hip = new THREE.Group(); hip.position.set(0.105 * s, -0.04, 0); hips.add(hip);
    const ul = cap(0.072, 0.3, legs); ul.position.y = -0.22; hip.add(ul);
    const kn = new THREE.Group(); kn.position.y = -0.45; hip.add(kn);
    const ll = cap(0.062, 0.28, legs); ll.position.y = -0.2; kn.add(ll);
    const boot = new THREE.Group(); boot.position.y = -0.43; kn.add(boot);
    const bm = mesh(new THREE.BoxGeometry(0.12, 0.13, 0.25), boots); bm.position.set(0, -0.005, 0.045); boot.add(bm);
    const bt = cap(0.068, 0.12, boots); bt.position.y = 0.09; boot.add(bt);
    const side = s < 0 ? 'L' : 'R';
    h['sh' + side] = sh; h['el' + side] = el; h['hand' + side] = hand;
    h['hip' + side] = hip; h['kn' + side] = kn; h['boot' + side] = boot;
  }
  h.tunic.material = top;
  return h;
}

// Zera e aplica uma pose básica de caminhada / corrida.
export function resetPose(h) {
  for (const k of ['pivot', 'body', 'hips', 'torso', 'head', 'shL', 'shR', 'elL', 'elR', 'hipL', 'hipR', 'knL', 'knR', 'bootL', 'bootR', 'handL', 'handR'])
    if (h[k]) h[k].rotation.set(0, 0, 0);
  h.body.position.y = -0.55;
  h.shL.rotation.z = -0.08; h.shR.rotation.z = 0.08;
}
export function walk(h, phase, amt = 1, run = 0) {
  const s = Math.sin(phase), c = Math.cos(phase);
  const legA = (0.45 + run * 0.35) * amt;
  h.hipL.rotation.x = -s * legA; h.hipR.rotation.x = s * legA;
  h.knL.rotation.x = Math.max(0, Math.sin(phase - 1.2)) * (0.7 + run * 0.6) * amt;
  h.knR.rotation.x = Math.max(0, Math.sin(phase + Math.PI - 1.2)) * (0.7 + run * 0.6) * amt;
  h.bootL.rotation.x = -h.knL.rotation.x * 0.3; h.bootR.rotation.x = -h.knR.rotation.x * 0.3;
  h.shL.rotation.x = s * (0.4 + run * 0.4) * amt; h.shR.rotation.x = -s * (0.4 + run * 0.4) * amt;
  h.elL.rotation.x = -(0.25 + run * 0.9) * amt; h.elR.rotation.x = -(0.25 + run * 0.9) * amt;
  h.body.position.y = -0.55 + Math.abs(c) * 0.035 * amt;
  h.hips.rotation.y = s * 0.08 * amt;
  h.torso.rotation.y = -s * 0.12 * amt;
  h.torso.rotation.x = run * 0.25 * amt;
}

// ---------- Arthur ----------
export function makeArthur() {
  const skin = std(0xeec29b, 0.7);
  const tunic = std(0xe6dbc0, 0.95);
  const h = humanoid({ skin, top: tunic, sleeve: tunic, legs: std(0x5b4a3a, 0.95), boots: std(0x4a2f1b, 0.8), hands: skin });
  const head = h.head;
  // cinto + fivela
  const belt = mesh(new THREE.TorusGeometry(0.205, 0.028, 8, 28), std(0x5a3518, 0.7));
  belt.rotation.x = Math.PI / 2; belt.scale.set(1, 0.74, 1); belt.position.y = 0.0; h.torso.add(belt);
  const buckle = mesh(new THREE.BoxGeometry(0.06, 0.05, 0.02), std(0x8a8070, 0.4, 0.8)); buckle.position.set(0, 0, 0.155); h.torso.add(buckle);
  // cachecol verde
  const green = std(0x2f6e3c, 0.9);
  const scarf = mesh(new THREE.TorusGeometry(0.1, 0.055, 10, 20), green);
  scarf.rotation.x = Math.PI / 2; scarf.position.y = 0.55; h.torso.add(scarf);
  const tail = new THREE.Group(); tail.position.set(-0.07, 0.53, 0.09); h.torso.add(tail);
  const tm = mesh(new THREE.BoxGeometry(0.075, 0.26, 0.03), green); tm.position.y = -0.13; tail.add(tm);
  h.scarfTail = tail;
  // cabelo castanho bagunçado
  const hair = std(0x6a4222, 0.9);
  const cap1 = mesh(new THREE.SphereGeometry(0.128, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.55), hair);
  cap1.position.set(0, 0.17, -0.012); cap1.rotation.x = -0.35; cap1.scale.set(1.0, 1.05, 1.06); head.add(cap1);
  const r = rng(11);
  for (let i = 0; i < 16; i++) {
    const a = r() * Math.PI * 2, el = 0.35 + r() * 0.75;
    const tuft = mesh(new THREE.SphereGeometry(0.026 + r() * 0.016, 8, 6), hair);
    tuft.position.set(Math.cos(a) * Math.sin(el) * 0.125, 0.17 + Math.cos(el) * 0.13, Math.sin(a) * Math.sin(el) * 0.125 - 0.01);
    if (tuft.position.z > 0.06 && tuft.position.y < 0.25) tuft.position.y += 0.03;
    head.add(tuft);
  }
  const fringe = mesh(new THREE.SphereGeometry(0.06, 10, 8), hair); fringe.position.set(0.035, 0.265, 0.075); fringe.scale.set(1.4, 0.55, 0.8); head.add(fringe);
  // rosto
  const face = new THREE.Group(); face.position.y = 0.15; head.add(face); h.face = face;
  const white = std(0xf6f2ea, 0.4), iris = std(0x3d2a17, 0.3);
  h.pupils = []; h.lids = [];
  for (const s of [-1, 1]) {
    const e = mesh(new THREE.SphereGeometry(0.021, 14, 10), white); e.position.set(0.042 * s, 0.012, 0.1); e.scale.z = 0.6; face.add(e);
    const p = mesh(new THREE.SphereGeometry(0.0125, 12, 8), iris); p.position.set(0.042 * s, 0.012, 0.113); face.add(p); h.pupils.push(p);
    const lid = mesh(new THREE.SphereGeometry(0.023, 14, 8, 0, Math.PI * 2, 0, Math.PI * 0.5), skin);
    lid.position.set(0.042 * s, 0.012, 0.099); lid.scale.set(1, 0.4, 0.75); face.add(lid); h.lids.push(lid);
    const brow = mesh(new THREE.BoxGeometry(0.048, 0.011, 0.012), hair); brow.position.set(0.045 * s, 0.05, 0.108); face.add(brow);
    brow.userData.side = s; (h.brows = h.brows || []).push(brow);
    const ear = mesh(new THREE.SphereGeometry(0.028, 10, 8), skin); ear.position.set(0.112 * s, 0.0, 0.0); ear.scale.set(0.5, 1, 0.8); face.add(ear);
  }
  const nose = mesh(new THREE.SphereGeometry(0.017, 10, 8), std(0xe8b48c, 0.7)); nose.position.set(0, -0.015, 0.123); nose.scale.set(0.9, 1.2, 1); face.add(nose);
  const mouth = mesh(new THREE.BoxGeometry(0.04, 0.008, 0.01), std(0x9c5048, 0.6)); mouth.position.set(0, -0.055, 0.112); face.add(mouth); h.mouth = mouth;
  // sardas
  const fr = std(0xc98258, 0.8);
  const rr = rng(21);
  for (let i = 0; i < 22; i++) {
    const s = i % 2 ? 1 : -1;
    const a = (0.25 + rr() * 0.35) * s, el = 0.05 + rr() * 0.22;
    const n = V(Math.sin(a) * Math.cos(el), -Math.sin(el) * 0.6 + 0.02, Math.cos(a) * Math.cos(el)).normalize();
    const dot = new THREE.Mesh(new THREE.CircleGeometry(0.0022 + rr() * 0.0014, 6), fr);
    dot.position.copy(n.clone().multiplyScalar(0.121)).multiply(V(0.95, 1.1, 1.0));
    dot.position.y -= 0.0; dot.lookAt(dot.position.clone().add(n));
    face.add(dot);
  }
  h.root.traverse(o => { if (o.isMesh) o.castShadow = true; });
  return h;
}

export function arthurFace(h, { look = [0, 0], blink = 0, worry = 0.5, awe = 0 }) {
  h.pupils.forEach((p, i) => { const s = i ? 1 : -1; p.position.x = 0.042 * s + look[0] * 0.008; p.position.y = 0.012 + look[1] * 0.006; p.scale.setScalar(1 - awe * 0.25); });
  h.lids.forEach(l => { l.scale.y = 0.4 + blink * 0.62 - awe * 0.2; l.position.y = 0.012 + 0.006 - blink * 0.004 + awe * 0.006; });
  h.brows.forEach(b => { const s = b.userData.side; b.rotation.z = -s * (worry * 0.35 + awe * 0.1); b.position.y = 0.05 + awe * 0.012 + worry * 0.003; });
  h.mouth.scale.set(1 - awe * 0.3, 1 + awe * 3.5, 1);
}

// ---------- Soldados ----------
export function makeSoldier(seed = 1, { cape = 0x8a1c22 } = {}) {
  const r = rng(seed);
  const metal = std(0x9aa0a8, 0.38, 0.85);
  const dark = std(0x3a3430, 0.9);
  const skin = std(0xd9a37e, 0.7);
  const h = humanoid({ skin, top: metal, sleeve: dark, legs: dark, boots: std(0x2a1f18, 0.8), hands: std(0x3a2a20, 0.8) });
  const helm = mesh(new THREE.SphereGeometry(0.135, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.62), metal);
  helm.position.y = 0.16; h.head.add(helm);
  const guard = mesh(new THREE.BoxGeometry(0.02, 0.1, 0.03), metal); guard.position.set(0, 0.12, 0.125); h.head.add(guard);
  const rim = mesh(new THREE.TorusGeometry(0.135, 0.012, 6, 20), metal); rim.rotation.x = Math.PI / 2; rim.position.y = 0.12; h.head.add(rim);
  for (const s of [-1, 1]) {
    const pa = mesh(new THREE.SphereGeometry(0.09, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.5), metal);
    pa.position.set(0.22 * s, 0.5, 0); pa.scale.set(1.1, 0.8, 1.1); h.torso.add(pa);
  }
  const capeM = mesh(new THREE.PlaneGeometry(0.42, 0.95, 1, 6), std(cape, 0.95, 0, { side: THREE.DoubleSide }));
  capeM.position.set(0, 0.05, -0.13); capeM.rotation.x = 0.12; h.torso.add(capeM); h.cape = capeM;
  // lança
  const spear = new THREE.Group();
  const shaft = mesh(new THREE.CylinderGeometry(0.014, 0.014, 2.4, 6), std(0x5b3d22, 0.8)); shaft.position.y = 0.6; spear.add(shaft);
  const tip = mesh(new THREE.ConeGeometry(0.035, 0.2, 6), metal); tip.position.y = 1.9; spear.add(tip);
  h.handR.add(spear); h.spear = spear;
  // escudo
  const shield = mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.03, 18), std(0x23365e, 0.6, 0.2));
  shield.rotation.z = Math.PI / 2; shield.position.set(-0.05, 0.12, 0.02); h.elL.add(shield);
  const boss = mesh(new THREE.SphereGeometry(0.05, 10, 8), metal); boss.position.set(-0.07, 0.12, 0.02); h.elL.add(boss);
  h.phaseOff = r() * 0.4;
  return h;
}
export function soldierPose(h, phase, amt = 1) {
  resetPose(h); walk(h, phase + h.phaseOff, amt);
  h.shR.rotation.x = -0.35; h.elR.rotation.x = -0.9; h.handR.rotation.x = 1.25;
  h.shL.rotation.x = -0.25; h.elL.rotation.x = -1.2; h.shL.rotation.z = -0.25;
}

// ---------- Cavaleiro guardião ----------
export function makeKnight() {
  const armor = std(0x15161a, 0.32, 0.92);
  const cloth = std(0x0c0c0e, 0.95, 0, { side: THREE.DoubleSide });
  const h = humanoid({ skin: armor, top: armor, sleeve: armor, legs: armor, boots: armor, hands: armor });
  h.armorMats = [armor, cloth];
  h.skull.visible = false;
  const helm = mesh(new THREE.CylinderGeometry(0.15, 0.14, 0.26, 12), armor); helm.position.y = 0.15; h.head.add(helm);
  const dome = mesh(new THREE.SphereGeometry(0.15, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), armor); dome.position.y = 0.28; h.head.add(dome);
  const slit = mesh(new THREE.BoxGeometry(0.2, 0.025, 0.02), std(0x000000, 1)); slit.position.set(0, 0.17, 0.14); h.head.add(slit);
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff1a10 });
  const eye = new THREE.Mesh(new THREE.SphereGeometry(0.022, 10, 8), eyeMat); eye.position.set(0.05, 0.17, 0.148); h.head.add(eye);
  const eyeGlow = glowSprite(0xff2010, 0.35, 0.9); eyeGlow.position.copy(eye.position); eyeGlow.position.z += 0.02; h.head.add(eyeGlow);
  h.eye = eye; h.eyeGlow = eyeGlow; h.eyeMat = eyeMat;
  for (const s of [-1, 1]) {
    const pts = [V(0.13 * s, 0.24, 0), V(0.28 * s, 0.33, 0.02), V(0.36 * s, 0.5, 0.06), V(0.33 * s, 0.68, 0.14)];
    h.head.add(mesh(taperTube(pts, 0.05, 0.004, 8, 20), std(0x2a2622, 0.6, 0.3)));
    const pa = mesh(new THREE.SphereGeometry(0.13, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.55), armor);
    pa.position.set(0.24 * s, 0.5, 0); pa.scale.set(1.25, 0.9, 1.15); h.torso.add(pa);
    const spike = mesh(new THREE.ConeGeometry(0.03, 0.14, 6), armor); spike.position.set(0.3 * s, 0.6, 0); spike.rotation.z = -0.5 * s; h.torso.add(spike);
  }
  h.tunic.scale.set(1.15, 1, 0.85);
  const capeM = mesh(new THREE.PlaneGeometry(0.62, 1.25, 4, 10), cloth);
  capeM.position.set(0, -0.12, -0.2); capeM.rotation.x = 0.1; h.torso.add(capeM); h.cape = capeM;
  // espada larga
  const sword = new THREE.Group();
  const blade = mesh(new THREE.BoxGeometry(0.11, 1.35, 0.025), std(0x2b2d33, 0.25, 0.95)); blade.position.y = 0.8; sword.add(blade);
  const guard = mesh(new THREE.BoxGeometry(0.42, 0.05, 0.06), armor); guard.position.y = 0.11; sword.add(guard);
  const grip = mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.24, 8), cloth); sword.add(grip);
  sword.rotation.x = Math.PI / 2; h.handR.add(sword); h.sword = sword; h.blade = blade;
  h.root.scale.setScalar(1.9);
  return h;
}

// ---------- Espada Excalion ----------
export function makeExcalion() {
  const g = new THREE.Group();
  const shape = new THREE.Shape();
  shape.moveTo(-0.032, 0); shape.lineTo(-0.028, 0.72); shape.lineTo(0, 0.84); shape.lineTo(0.028, 0.72); shape.lineTo(0.032, 0); shape.lineTo(-0.032, 0);
  const bladeGeo = new THREE.ExtrudeGeometry(shape, { depth: 0.008, bevelEnabled: true, bevelThickness: 0.005, bevelSize: 0.006, bevelSegments: 1 });
  bladeGeo.translate(0, 0, -0.004);
  const bladeMat = new THREE.MeshStandardMaterial({ color: 0xe8edf2, metalness: 1, roughness: 0.18, emissive: 0xffc04a, emissiveIntensity: 0 });
  const blade = mesh(bladeGeo, bladeMat); blade.position.y = 0.04; g.add(blade);
  const fuller = mesh(new THREE.BoxGeometry(0.008, 0.6, 0.02), std(0xb8c0c8, 0.2, 1)); fuller.position.y = 0.38; g.add(fuller);
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xd8a633, metalness: 1, roughness: 0.28, emissive: 0xffb02e, emissiveIntensity: 0 });
  const guard = mesh(new THREE.BoxGeometry(0.22, 0.03, 0.04), goldMat); guard.position.y = 0.03; g.add(guard);
  for (const s of [-1, 1]) { const e = mesh(new THREE.SphereGeometry(0.022, 10, 8), goldMat); e.position.set(0.115 * s, 0.03, 0); g.add(e); }
  const grip = mesh(new THREE.CylinderGeometry(0.017, 0.019, 0.17, 10), std(0x4a2a14, 0.8)); grip.position.y = -0.07; g.add(grip);
  const pommel = mesh(new THREE.SphereGeometry(0.03, 12, 10), goldMat); pommel.position.y = -0.17; g.add(pommel);
  const gem = mesh(new THREE.OctahedronGeometry(0.014), new THREE.MeshStandardMaterial({ color: 0x3ad6c8, emissive: 0x1a8f86, emissiveIntensity: 0.6, roughness: 0.1 }));
  gem.position.set(0, 0.03, 0.024); g.add(gem);
  const light = new THREE.PointLight(0xffc35a, 0, 6, 1.6); light.position.y = 0.45; g.add(light);
  const glow = glowSprite(0xffcf6a, 1.1, 0); glow.position.y = 0.45; g.add(glow);
  const glow2 = glowSprite(0xffe4a0, 0.35, 0); glow2.position.y = 0.04; g.add(glow2);
  g.userData = { bladeMat, goldMat, light, glow, glow2 };
  return g;
}
export function swordGlow(s, k, flicker = 0) {
  const u = s.userData;
  u.bladeMat.emissiveIntensity = k * 2.2;
  u.goldMat.emissiveIntensity = k * 1.2;
  u.light.intensity = k * 2.5 * (1 + flicker);
  u.glow.material.opacity = Math.min(1, k * 0.9);
  u.glow.scale.setScalar(0.6 + k * 0.9 + flicker * 0.2);
  u.glow2.material.opacity = Math.min(1, k);
}

// Pontos de partículas com posições recalculadas a cada quadro.
export function particles(n, color, size, { additive = true, opacity = 1 } = {}) {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
  const mat = new THREE.PointsMaterial({ color, size, map: softTex(), transparent: true, opacity,
    depthWrite: false, blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending, sizeAttenuation: true });
  const p = new THREE.Points(geo, mat); p.frustumCulled = false;
  return p;
}
