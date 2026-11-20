// CENA 4 — A DESCOBERTA: templo abandonado sob o eclipse; Kael toca o mapa e os símbolos azuis acendem.
import { THREE, V, kf, lerp, sstep, win, easeInOut, easeOut, linear, rng, std, mesh, particles, updateParticles, lightShaft, mistSprites, animateMist, drawRune, shake } from '../../../motor/base.js';
import { resetPose, pose, walk, idle, expr, flutterCape, wp } from '../../../motor/rig.js';
import { HandGlow, RuneRing } from '../../../motor/fx.js';
import { makeKael } from '../../../personagens/magos.js';
import { buildHall } from '../../../cenarios/salao.js';
import { flickerCandles } from '../../../cenarios/objetos.js';

const TOUCH = 41.3;
const MAP_POS = V(0, 2.4, -9.2);
const STAR_UV = [0.66, 0.38]; // onde está o livro no mapa

function mapCanvases() {
  const S = 1024, r = rng(21);
  const lines = document.createElement('canvas'); lines.width = lines.height = S;
  const x = lines.getContext('2d');
  x.fillStyle = '#000'; x.fillRect(0, 0, S, S); x.strokeStyle = '#fff'; x.lineCap = 'round'; x.lineJoin = 'round';
  // continentes
  x.lineWidth = 5;
  for (const [cx, cy, R] of [[330, 420, 230], [720, 380, 170], [560, 760, 190]]) {
    x.beginPath();
    for (let i = 0; i <= 60; i++) { const a = i / 60 * 6.283; const rr = R * (0.75 + 0.25 * Math.sin(a * 3 + cx) + (r() - 0.5) * 0.12); x[i ? 'lineTo' : 'moveTo'](cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.8); }
    x.closePath(); x.stroke();
  }
  // montanhas, rios, cidades
  x.lineWidth = 3;
  for (let i = 0; i < 26; i++) { const px = 150 + r() * 720, py = 220 + r() * 640; x.beginPath(); x.moveTo(px - 14, py + 10); x.lineTo(px, py - 12); x.lineTo(px + 14, py + 10); x.stroke(); }
  for (let i = 0; i < 5; i++) { x.beginPath(); let px = 200 + r() * 600, py = 250 + r() * 500; x.moveTo(px, py); for (let k = 0; k < 8; k++) { px += (r() - 0.5) * 70; py += 25 + r() * 20; x.lineTo(px, py); } x.stroke(); }
  for (let i = 0; i < 12; i++) { const px = 180 + r() * 680, py = 230 + r() * 620; x.beginPath(); x.arc(px, py, 8, 0, 6.28); x.stroke(); }
  // trilha pontilhada até o local do livro
  x.setLineDash([10, 14]); x.lineWidth = 4; x.beginPath(); x.moveTo(260, 520); x.bezierCurveTo(420, 300, 560, 520, STAR_UV[0] * S, STAR_UV[1] * S); x.stroke(); x.setLineDash([]);
  // marca do livro: círculo rúnico + estrela
  const sx = STAR_UV[0] * S, sy = STAR_UV[1] * S;
  x.lineWidth = 6; x.beginPath(); x.arc(sx, sy, 46, 0, 6.28); x.stroke();
  x.beginPath(); for (let i = 0; i <= 10; i++) { const a = i / 10 * 6.283 - Math.PI / 2, rr = i % 2 ? 14 : 34; x.lineTo(sx + Math.cos(a) * rr, sy + Math.sin(a) * rr); } x.stroke();
  // borda de runas
  x.lineWidth = 4; x.strokeRect(60, 60, S - 120, S - 120); x.strokeRect(84, 84, S - 168, S - 168);
  for (let i = 0; i < 28; i++) { const k = i % 7, side = Math.floor(i / 7); const p = 130 + k * 128; const pos = [[p, 72], [S - 72, p], [p, S - 72], [72, p]][side]; drawRune(x, pos[0], pos[1], 9, r); }
  // pedra: mesma arte, entalhada (escura) sobre textura de pedra
  const stone = document.createElement('canvas'); stone.width = stone.height = S; const y = stone.getContext('2d');
  y.fillStyle = '#6a655e'; y.fillRect(0, 0, S, S);
  for (let i = 0; i < 9000; i++) { const v = 70 + r() * 60; y.fillStyle = `rgba(${v},${v - 4},${v - 10},0.25)`; y.fillRect(r() * S, r() * S, 2 + r() * 6, 2 + r() * 6); }
  y.globalAlpha = 0.55; y.globalCompositeOperation = 'multiply'; y.filter = 'invert(1)'; y.drawImage(lines, 0, 0); y.filter = 'none';
  y.globalCompositeOperation = 'source-over'; y.globalAlpha = 1;
  for (let i = 0; i < 18; i++) { y.strokeStyle = 'rgba(30,28,26,0.5)'; y.lineWidth = 2; y.beginPath(); let px = r() * S, py = r() * S; y.moveTo(px, py); for (let k = 0; k < 5; k++) { px += (r() - 0.5) * 120; py += (r() - 0.5) * 120; y.lineTo(px, py); } y.stroke(); }
  return { lines: new THREE.CanvasTexture(lines), stone: Object.assign(new THREE.CanvasTexture(stone), { colorSpace: THREE.SRGBColorSpace }) };
}

export default {
  nome: 'A descoberta', inicio: 34, fim: 46,
  criar(st) {
    const sunDir = V(0.15, 0.85, -0.5).normalize();
    const T = buildHall({ radius: 10, height: 9, columns: 10, broken: 0.5, hole: 1, vines: 26, fog: 0x0c1220, fogD: 0.03, ambient: [0x4a5a8a, 0x0a0a10, 0.6], candles: 0, seed: 4, doorGap: 0.3, colOffset: Math.PI / 10,
      sky: { top: 0x020308, mid: 0x0c1228, horizon: 0x2a2a4a, bottom: 0x05060c, sunDir, sunColor: 0xfff0d0, sunSize: 2.2, glow: 0.35, stars: 1.2 } });
    const S = T.scene;
    const moon = new THREE.DirectionalLight(0xb8c8ff, 1.6); moon.position.copy(sunDir).multiplyScalar(30); moon.castShadow = true; moon.shadow.mapSize.set(2048, 2048);
    const mc = moon.shadow.camera; mc.left = mc.bottom = -12; mc.right = mc.top = 12; S.add(moon);
    const shaft = lightShaft(3.2, 4.2, 14, 0xc8d4ff, 0.22); shaft.position.copy(sunDir.clone().multiplyScalar(6)); shaft.position.y = 6; shaft.lookAt(0, 20, 0); shaft.rotateX(Math.PI / 2); S.add(shaft);
    // porta de entrada (abertura na parede, lado +z)
    const doorLight = new THREE.PointLight(0x8aa8ff, 30, 12, 1.5); doorLight.position.set(0, 2, 11); S.add(doorLight);
    const doorFrame = new THREE.Group(); S.add(doorFrame);
    for (const s of [-1, 1]) { const p = mesh(new THREE.BoxGeometry(0.9, 4.5, 1.2), std(0x4e4a46, 0.95)); p.position.set(s * 1.6, 2.25, 9.6); doorFrame.add(p); }
    const lintel = mesh(new THREE.BoxGeometry(4.2, 0.9, 1.3), std(0x4e4a46, 0.95)); lintel.position.set(0, 4.9, 9.6); doorFrame.add(lintel);
    const hole = mesh(new THREE.PlaneGeometry(2.3, 4.5), new THREE.MeshBasicMaterial({ color: 0x1a2440 }), false); hole.position.set(0, 2.25, 10.05); hole.rotation.y = Math.PI; doorFrame.add(hole);
    // parede do mapa
    const tex = mapCanvases();
    const slab = mesh(new THREE.BoxGeometry(4.6, 4.2, 0.5), [std(0x5a5650, 0.95), std(0x5a5650, 0.95), std(0x5a5650, 0.95), std(0x5a5650, 0.95), new THREE.MeshStandardMaterial({ map: tex.stone, roughness: 0.95 }), std(0x5a5650, 0.95)]);
    slab.position.copy(MAP_POS); S.add(slab);
    const glowMat = new THREE.ShaderMaterial({
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
      uniforms: { map: { value: tex.lines }, touch: { value: new THREE.Vector2(0.5, 0.45) }, rad: { value: 0 }, star: { value: new THREE.Vector2(STAR_UV[0], 1 - STAR_UV[1]) }, starK: { value: 0 }, time: { value: 0 } },
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
      fragmentShader: `uniform sampler2D map; uniform vec2 touch, star; uniform float rad, starK, time; varying vec2 vUv;
        void main(){ float l = texture2D(map, vUv).r; float d = distance(vUv, touch);
          float on = smoothstep(rad, rad - 0.12, d);
          float front = exp(-pow((d - rad)*18.0, 2.0)) * step(0.001, rad) * (1.0 - smoothstep(0.9,1.3,rad));
          float sd = distance(vUv, star); float sg = exp(-sd*sd*400.0) * starK * (0.8 + 0.2*sin(time*8.0));
          float ring = exp(-pow((sd - fract(time*0.6)*0.2)*60.0, 2.0)) * starK;
          vec3 c = vec3(0.35,0.75,1.0) * (l * on * (0.9 + 0.1*sin(time*6.0 + d*30.0)) + front*0.6 + l*front*1.5) + vec3(0.7,0.9,1.0)*(sg*1.6 + ring*0.8);
          gl_FragColor = vec4(c, 1.0); }`,
    });
    const glow = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 4.2), glowMat); glow.position.copy(MAP_POS).add(V(0, 0, 0.26)); S.add(glow);
    const mapLight = new THREE.PointLight(0x58b4ff, 0, 9, 1.4); mapLight.position.copy(MAP_POS).add(V(0, -0.4, 0.75)); S.add(mapLight);
    const kael = makeKael(); S.add(kael.root); st.metal(kael.root, 0.6);
    const orb = new HandGlow(0x58b4ff, 0.5, 4); S.add(orb.group);
    const touchFx = new HandGlow(0x9fe0ff, 1.2, 10); S.add(touchFx.group);
    const runes = new RuneRing(10, 0x8fd8ff, 1.6, 0.22, 6); S.add(runes.group);
    const sparks = particles(260, 0x8fd8ff, 0.05); S.add(sparks);
    const mist = mistSprites(S, 30, [-9, 9, -9, 9], { color: 0x4a5a8a, y: [0.2, 1.4], seed: 6, opacity: [0.06, 0.14] });
    const dust = particles(200, 0xc8d4ff, 0.035, { opacity: 0.7 }); S.add(dust);

    return {
      atualizar(t) {
        const tau = t - 34;
        animateMist(mist, t);
        // eclipse avança
        const ecl = sstep(0.3, 3.0, tau);
        T.sky.material.uniforms.eclipse.value = ecl;
        T.sky.material.uniforms.sunColor.value.setRGB(1, lerp(0.94, 0.45, ecl), lerp(0.82, 0.3, ecl));
        moon.intensity = lerp(1.6, 0.55, ecl); moon.color.setRGB(lerp(0.72, 0.9, ecl), lerp(0.78, 0.5, ecl), lerp(1, 0.55, ecl));
        shaft.material.opacity = lerp(0.22, 0.12, ecl);
        // Kael: entra, caminha, toca o mapa
        resetPose(kael);
        const path = [[36.0, [0, 0, 10.6]], [39.8, [0.3, 0, 0.0]], [41.0, [0, 0, -7.95]]];
        const p = kf(t, path, linear);
        kael.root.position.set(p[0], p[1], p[2]); kael.root.rotation.y = Math.PI;
        const moving = t > 36 && t < 40.9;
        if (moving) walk(kael, (t - 36) * Math.PI * 2 * 0.85, 1 - sstep(40.5, 40.9, t));
        // orbe de luz na mão esquerda durante a caminhada
        const orbK = win(t, 36.2, 36.8, 40.6, 41.0);
        if (orbK > 0) pose(kael, { shL: [-0.8, 0, -0.3], elL: [-1.0, 0, 0], handL: [0.6, 0, 0] }, orbK);
        const reach = sstep(40.6, TOUCH, t);
        pose(kael, 'reachR', reach * (1 - sstep(44.2, 45, t) * 0.4));
        kael.head.rotation.y = Math.sin(t * 0.9) * 0.4 * (moving ? 1 : 0) * (1 - reach);
        kael.head.rotation.x = -0.12 + reach * 0.05;
        flutterCape(kael, t, moving ? 1 : 0.4);
        const awe = sstep(TOUCH + 0.2, TOUCH + 1.2, t);
        expr(kael, { look: [Math.sin(t * 0.9) * 0.5 * (1 - reach), 0.1], worry: 0.4 * (1 - awe), fear: awe * 0.6, open: awe * 0.25, blink: win(tau, 3.0, 3.05, 3.1, 3.16) });
        kael.root.updateMatrixWorld(true);
        orb.group.position.copy(wp(kael.handL)).add(V(0, 0.08, 0.05)); orb.update(orbK, t);
        // revelação do mapa
        const dt = t - TOUCH;
        const tp = dt > 0 ? 1 : 0;
        glowMat.uniforms.touch.value.set(0.5 + (kael.root.position.x - MAP_POS.x) / 4.6, 0.45);
        glowMat.uniforms.rad.value = dt > 0 ? easeOut(Math.min(1, dt / 2.2)) * 1.25 : 0;
        glowMat.uniforms.starK.value = sstep(TOUCH + 1.6, TOUCH + 2.3, t);
        glowMat.uniforms.time.value = t;
        mapLight.intensity = tp * (3.5 + 1.5 * Math.sin(t * 6)) * sstep(0, 0.6, dt);
        touchFx.group.position.copy(wp(kael.handR)).add(V(0, 0, -0.05)); touchFx.update(win(dt, 0, 0.1, 0.6, 1.6) * 1.2, t);
        runes.update(MAP_POS.clone().add(V(0, 0.2, 1.0)), t, sstep(TOUCH + 0.4, TOUCH + 1.4, t) * 0.9, st.camera, { speed: 0.5, bob: 0.3, tilt: 0.6 });
        updateParticles(sparks, (s) => { if (dt < 0) return null; const life = (dt * (0.3 + s[3] * 0.4) + s[4]) % 1; return [MAP_POS.x + (s[0] - 0.5) * 4.4, MAP_POS.y - 2 + s[1] * 4 + life * 1.2, MAP_POS.z + 0.3 + life * (0.5 + s[2])]; });
        sparks.material.opacity = sstep(0, 1, dt) * 0.9;
        updateParticles(dust, (s) => { const y = (s[1] * 9 + t * 0.12 * (0.5 + s[3])) % 9; return [Math.sin(s[0] * 40) * 3.5 * s[2] + Math.sin(t * 0.2 + s[4] * 6) * 0.3, y, Math.cos(s[0] * 40) * 3.5 * s[2]]; });
        // câmeras
        const head = wp(kael.head);
        if (t < 37) {
          const u = tau / 3;
          st.cam([0.8, 1.0, -3.2], kf(u, [[0, [0, 30, -14]], [0.55, [0, 26, -12]], [1, [0, 2.4, 9.6]]], easeInOut), 52, 0.02, [0, 0], 0.05, 4000);
        } else if (t < 40) {
          const u = (t - 37) / 3;
          st.cam([kael.root.position.x + 2.6, 1.25, kael.root.position.z - 1.4], [kael.root.position.x, 1.35, kael.root.position.z - 0.2], 48, 0.0, shake(t, 0.12, 2.5), 0.05, 4000);
        } else if (t < 43) {
          const u = (t - 40) / 3;
          st.cam(kf(u, [[0, [2.2, 1.9, -4.6]], [1, [1.5, 1.85, -5.6]]], easeInOut), [kf(u, [[0, -0.3], [1, 0]]), 1.85, -8.4], 46, 0.03, [0, 0], 0.05, 4000);
        } else {
          const u = (t - 43) / 3;
          const faceT = [head.x, head.y + 0.13, head.z];
          if (u < 0.5) st.cam([head.x - 0.35, head.y + 0.16, head.z - 0.75 + u * 0.3], faceT, 34, -0.02, [0, 0], 0.02, 4000);
          else {
            const sp = [MAP_POS.x + (STAR_UV[0] - 0.5) * 4.6, MAP_POS.y + (0.5 - STAR_UV[1]) * 4.2, MAP_POS.z + 0.26];
            const v = (u - 0.5) / 0.5;
            st.cam([sp[0] + lerp(0.6, 0.15, v), sp[1] + 0.05, sp[2] + lerp(1.6, 0.55, easeOut(v))], sp, 40, 0, [0, 0], 0.02, 4000);
          }
        }
        return S;
      },
    };
  },
};
