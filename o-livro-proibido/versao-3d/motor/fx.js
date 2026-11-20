// Motor — efeitos mágicos reutilizáveis (cada efeito tem .group e .update(...)).
import {
  THREE, V, rng, lerp, clamp, sstep, easeOut, glowSprite, particles, updateParticles, softTex, additive,
  taperTube, magicCircleTex, runeSheet,
} from './base.js';

// Brilho nas mãos (sprite + luz)
export class HandGlow {
  constructor(color, size = 0.35, light = 3) {
    this.group = new THREE.Group();
    this.sprite = glowSprite(color, size, 0); this.group.add(this.sprite);
    this.core = glowSprite(0xffffff, size * 0.25, 0); this.group.add(this.core);
    this.light = new THREE.PointLight(color, 0, 5, 1.5); this.group.add(this.light);
    this.size = size; this.lightMax = light;
  }
  update(k, t = 0) {
    const f = 1 + 0.12 * Math.sin(t * 23) + 0.08 * Math.sin(t * 37);
    this.sprite.material.opacity = clamp(k); this.core.material.opacity = clamp(k) * 0.8;
    this.sprite.scale.setScalar(this.size * (0.6 + 0.6 * k) * f);
    this.light.intensity = k * this.lightMax * f;
    this.group.visible = k > 0.001;
  }
}

// Partículas que orbitam / sobem a partir de um ponto (fumaça escura, faíscas, poeira mágica)
export class Aura {
  constructor(n, color, size, { additive: add = true, radius = 0.4, rise = 0.6, opacity = 1 } = {}) {
    this.p = particles(n, color, size, { additive: add, opacity }); this.group = this.p;
    this.radius = radius; this.rise = rise; this.opacity = opacity;
  }
  update(center, t, k = 1) {
    const R = this.radius, rise = this.rise;
    this.p.material.opacity = this.opacity * clamp(k);
    this.p.visible = k > 0.001;
    updateParticles(this.p, (s) => {
      const life = (t * (0.4 + s[3] * 0.6) + s[4]) % 1;
      const a = s[0] * 6.283 + t * (1 + s[1] * 2) * (s[2] > 0.5 ? 1 : -1);
      const r = R * (0.4 + s[1] * 0.6) * (1 - life * 0.5);
      return [center.x + Math.cos(a) * r, center.y + (life - 0.3) * rise + (s[2] - 0.5) * R * 0.5, center.z + Math.sin(a) * r];
    });
  }
}

// Esfera de energia negra (Morvath)
export class DarkOrb {
  constructor() {
    this.group = new THREE.Group();
    this.core = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 24), new THREE.MeshBasicMaterial({ color: 0x050008 }));
    this.group.add(this.core);
    this.rim = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 24), new THREE.ShaderMaterial({
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
      uniforms: { k: { value: 1 }, time: { value: 0 } },
      vertexShader: `varying vec3 vN; varying vec3 vV; varying vec3 vP; void main(){ vN = normalize(normalMatrix*normal); vec4 mv = modelViewMatrix*vec4(position,1.); vV = normalize(-mv.xyz); vP = position; gl_Position = projectionMatrix*mv; }`,
      fragmentShader: `uniform float k,time; varying vec3 vN; varying vec3 vV; varying vec3 vP;
        void main(){ float f = pow(1.0 - abs(dot(vN, vV)), 2.2);
          float n = sin(vP.x*9.0 + time*5.0)*sin(vP.y*7.0 - time*4.0)*sin(vP.z*8.0 + time*3.0);
          vec3 c = mix(vec3(0.9,0.05,0.1), vec3(0.5,0.0,0.6), 0.5+0.5*n) * (f*2.2 + max(n,0.0)*f*1.5);
          gl_FragColor = vec4(c*k, 1.0); }`,
    }));
    this.rim.scale.setScalar(1.08); this.group.add(this.rim);
    this.glow = glowSprite(0xff1030, 5, 0.6); this.group.add(this.glow);
    this.light = new THREE.PointLight(0xff2040, 0, 25, 1.3); this.group.add(this.light);
    this.smoke = new Aura(260, 0x120010, 0.35, { additive: false, radius: 1.6, rise: 2, opacity: 0.8 });
    this.sparks = new Aura(120, 0xff3050, 0.08, { radius: 1.3, rise: 1.5 });
  }
  addTo(scene) { scene.add(this.group, this.smoke.group, this.sparks.group); return this; }
  update(pos, radius, k, t) {
    this.group.visible = k > 0.001;
    this.group.position.copy(pos); this.group.scale.setScalar(Math.max(0.001, radius * k));
    this.core.rotation.y = t * 2; this.rim.material.uniforms.time.value = t; this.rim.material.uniforms.k.value = k;
    this.glow.material.opacity = 0.7 * k; this.light.intensity = 60 * k * radius;
    this.smoke.radius = radius * 1.5; this.smoke.update(pos, t, k);
    this.sparks.radius = radius * 1.3; this.sparks.update(pos, t * 1.5, k);
  }
}

// Escudo dourado em domo hexagonal (Eldrin), com ondulação no ponto de impacto
export class Shield {
  constructor(color = 0xffc040) {
    this.mat = new THREE.ShaderMaterial({
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
      uniforms: { k: { value: 0 }, color: { value: new THREE.Color(color) }, hitDir: { value: V(0, 0, 1) }, hitT: { value: 99 }, time: { value: 0 } },
      vertexShader: `varying vec3 vN; varying vec3 vV; varying vec3 vP; varying vec2 vUv; void main(){ vUv = uv; vP = normalize(position); vN = normalize(normalMatrix*normal); vec4 mv = modelViewMatrix*vec4(position,1.); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }`,
      fragmentShader: `uniform float k,hitT,time; uniform vec3 color,hitDir; varying vec3 vN; varying vec3 vV; varying vec3 vP; varying vec2 vUv;
        float hexD(vec2 p){ vec2 r = vec2(1.0,1.732); vec2 h = r*0.5; vec2 a = mod(p,r)-h; vec2 b = mod(p-h,r)-h; vec2 g = dot(a,a)<dot(b,b)?a:b; g = abs(g); return max(dot(g, normalize(vec2(1.0,1.732))), g.x); }
        void main(){ float f = pow(1.0 - abs(dot(vN, vV)), 2.0);
          float hx = smoothstep(0.40, 0.48, hexD(vUv*vec2(28.0,14.0)));
          float d = acos(clamp(dot(vP, normalize(hitDir)), -1.0, 1.0));
          float rip = exp(-pow((d - hitT*2.2)*5.0, 2.0)) * exp(-hitT*1.5);
          float flick = 0.85 + 0.15*sin(time*20.0 + vP.y*10.0);
          float a = (f*0.9 + hx*(0.25 + rip*2.0) + rip*1.2 + 0.05) * k * flick;
          gl_FragColor = vec4(color*a, 1.0); }`,
    });
    this.group = new THREE.Group();
    this.dome = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 24, 0, Math.PI * 2, 0, Math.PI * 0.55), this.mat);
    this.dome.renderOrder = 6; this.group.add(this.dome);
    this.light = new THREE.PointLight(color, 0, 18, 1.4); this.light.position.y = 1; this.group.add(this.light);
    this.ring = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 2.4), additive(color, 0, magicCircleTex(4)));
    this.ring.rotation.x = -Math.PI / 2; this.ring.position.y = 0.05; this.group.add(this.ring);
  }
  update(center, radius, k, t, hitDir = null, hitT = 99) {
    this.group.visible = k > 0.001; this.group.position.copy(center); this.group.scale.setScalar(radius * (0.3 + 0.7 * easeOut(clamp(k))));
    const u = this.mat.uniforms; u.k.value = k; u.time.value = t; u.hitT.value = hitT; if (hitDir) u.hitDir.value.copy(hitDir);
    this.light.intensity = k * 30 + (hitT < 1 ? (1 - hitT) * 120 : 0);
    this.ring.material.opacity = k * 0.8; this.ring.rotation.z = t * 0.5;
  }
}

// Portal roxo em espiral (Zareth)
export class Portal {
  constructor(color = 0xa040ff) {
    this.mat = new THREE.ShaderMaterial({
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
      uniforms: { k: { value: 0 }, time: { value: 0 }, color: { value: new THREE.Color(color) } },
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
      fragmentShader: `uniform float k,time; uniform vec3 color; varying vec2 vUv;
        void main(){ vec2 p = vUv*2.0-1.0; float r = length(p); float a = atan(p.y,p.x);
          float sw = 0.5+0.5*sin(a*5.0 + r*16.0 - time*7.0);
          float sw2 = 0.5+0.5*sin(a*3.0 - r*9.0 + time*4.0);
          float core = smoothstep(1.0, 0.0, r);
          float edge = smoothstep(0.78,0.94,r)*smoothstep(1.0,0.94,r);
          vec3 c = color*(sw*core*0.9 + sw2*core*0.5 + edge*2.5) + vec3(1.0,0.85,1.0)*pow(core,8.0)*0.9;
          float m = step(r, 1.0);
          gl_FragColor = vec4(c*k*m*(0.6+0.4*core), 1.0); }`,
    });
    this.group = new THREE.Group();
    this.disk = new THREE.Mesh(new THREE.CircleGeometry(1, 64), this.mat); this.group.add(this.disk);
    this.rim = new THREE.Mesh(new THREE.TorusGeometry(1, 0.035, 8, 64), new THREE.MeshBasicMaterial({ color: 0xe2b8ff }));
    this.group.add(this.rim);
    this.light = new THREE.PointLight(color, 0, 14, 1.4); this.light.position.z = 0.5; this.group.add(this.light);
    this.motes = new Aura(200, color, 0.07, { radius: 1.4, rise: 0.2 });
  }
  addTo(scene) { scene.add(this.group, this.motes.group); return this; }
  update(pos, rotY, radius, k, t) {
    this.group.visible = k > 0.001; this.group.position.copy(pos); this.group.rotation.y = rotY;
    const s = radius * easeOut(clamp(k)); this.group.scale.set(s, s * 1.25, s);
    this.mat.uniforms.k.value = k; this.mat.uniforms.time.value = t; this.disk.rotation.z = -t * 0.8;
    this.light.intensity = 25 * k; this.motes.radius = s * 1.2; this.motes.update(pos, -t * 2, k);
  }
}

// Onda de energia azul (Kael): anel vertical que avança e cresce + rastro de partículas
export class EnergyWave {
  constructor(color = 0x58b4ff) {
    this.group = new THREE.Group();
    const tex = (() => { const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d');
      const g = x.createRadialGradient(128, 128, 60, 128, 128, 128); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.7, 'rgba(255,255,255,0.25)'); g.addColorStop(0.88, 'rgba(255,255,255,1)'); g.addColorStop(1, 'rgba(255,255,255,0)');
      x.fillStyle = g; x.fillRect(0, 0, 256, 256); return new THREE.CanvasTexture(c); })();
    this.rings = [0, 1, 2].map(i => { const m = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), additive(i ? 0xbfe6ff : color, 0, tex)); this.group.add(m); return m; });
    this.light = new THREE.PointLight(color, 0, 20, 1.3); this.group.add(this.light);
    this.trail = particles(500, color, 0.09);
    this.color = color;
  }
  addTo(scene) { scene.add(this.group, this.trail); return this; }
  // origem, direção (normalizada), tempo desde o disparo, alcance
  update(origin, dir, dt, k = 1, range = 18) {
    const on = dt > 0 && dt < 2.2;
    this.group.visible = on; this.trail.visible = on;
    if (!on) return;
    const d = easeOut(clamp(dt / 1.6)) * range;
    const pos = origin.clone().add(dir.clone().multiplyScalar(d));
    this.group.position.copy(pos); this.group.lookAt(pos.clone().add(dir));
    this.rings.forEach((r, i) => { const s = 0.6 + d * 0.35 + i * 0.25; r.scale.setScalar(s); r.position.z = -i * 0.6; r.material.opacity = (1 - sstep(1.2, 2.2, dt)) * k * (i ? 0.6 : 1); });
    this.light.intensity = 60 * (1 - sstep(1.0, 2.2, dt)) * k;
    const side = new THREE.Vector3().crossVectors(dir, V(0, 1, 0)).normalize();
    updateParticles(this.trail, (s) => {
      const u = s[0]; if (u * range > d) return null;
      const spread = (0.3 + u * range * 0.35) * Math.sqrt(s[1]);
      const a = s[2] * 6.283 + dt * 3;
      const p = origin.clone().add(dir.clone().multiplyScalar(u * d));
      return [p.x + side.x * Math.cos(a) * spread, p.y + Math.sin(a) * spread * 0.6, p.z + side.z * Math.cos(a) * spread];
    });
    this.trail.material.opacity = (1 - sstep(1.0, 2.2, dt)) * k;
  }
}

// Explosão (bola de luz + anel + faíscas + fumaça)
export class Explosion {
  constructor(color = 0xffaa55, size = 4) {
    this.group = new THREE.Group();
    this.ball = glowSprite(color, 1, 0); this.group.add(this.ball);
    this.flash = glowSprite(0xffffff, 1, 0); this.group.add(this.flash);
    this.ring = new THREE.Mesh(new THREE.RingGeometry(0.85, 1, 48), additive(color, 0, null)); this.ring.rotation.x = -Math.PI / 2; this.group.add(this.ring);
    this.light = new THREE.PointLight(color, 0, size * 8, 1.3); this.group.add(this.light);
    this.sparks = particles(220, color, 0.12);
    this.smoke = particles(140, 0x1a1414, size * 0.35, { additive: false, opacity: 0.7 });
    this.size = size;
  }
  addTo(scene) { scene.add(this.group, this.sparks, this.smoke); return this; }
  update(pos, dt) {
    const on = dt > 0 && dt < 3.0;
    this.group.visible = this.sparks.visible = this.smoke.visible = on;
    if (!on) return;
    const S = this.size;
    this.group.position.copy(pos);
    this.ball.scale.setScalar(S * (0.5 + easeOut(clamp(dt / 0.5)) * 2)); this.ball.material.opacity = Math.exp(-dt * 3);
    this.flash.scale.setScalar(S * 1.5); this.flash.material.opacity = Math.exp(-dt * 10);
    this.ring.scale.setScalar(S * (0.3 + dt * 3)); this.ring.material.opacity = Math.max(0, 0.9 - dt * 1.2);
    this.light.intensity = 400 * Math.exp(-dt * 4) * S / 4;
    updateParticles(this.sparks, (s) => { const th = s[0] * 6.283, ph = Math.acos(2 * s[1] - 1); const v = S * (1 + s[2] * 2.5) * (1 - Math.exp(-dt * 2.5)) / 2.5 * 2;
      return [pos.x + Math.sin(ph) * Math.cos(th) * v, Math.max(0.05, pos.y + Math.abs(Math.cos(ph)) * v - 2 * dt * dt), pos.z + Math.sin(ph) * Math.sin(th) * v]; });
    this.sparks.material.opacity = 1 - sstep(0.8, 2, dt);
    updateParticles(this.smoke, (s) => { const th = s[0] * 6.283; const v = S * 0.6 * (0.3 + s[2]) * (1 - Math.exp(-dt * 1.5));
      return [pos.x + Math.cos(th) * v, pos.y + s[1] * S * 0.4 + dt * (0.5 + s[3]), pos.z + Math.sin(th) * v]; });
    this.smoke.material.opacity = 0.7 * (1 - sstep(1.5, 3, dt)) * sstep(0.05, 0.3, dt);
  }
}

// Raio: geometria em zigue-zague pré-gerada; visível por um instante
export class Lightning {
  constructor(from, to, seed = 1, color = 0xcfe0ff) {
    const r = rng(seed), pts = [];
    const n = 14;
    for (let i = 0; i <= n; i++) {
      const p = from.clone().lerp(to, i / n);
      if (i > 0 && i < n) p.add(V((r() - 0.5) * 3, (r() - 0.5) * 1.5, (r() - 0.5) * 3));
      pts.push(p);
    }
    const geos = [taperTube(pts, 0.18, 0.08, 5, 60)];
    for (let b = 0; b < 3; b++) {
      const i = 3 + Math.floor(r() * 8); const p = pts[i];
      geos.push(taperTube([p, p.clone().add(V((r() - 0.5) * 6, -3 - r() * 3, (r() - 0.5) * 6)), p.clone().add(V((r() - 0.5) * 10, -7 - r() * 4, (r() - 0.5) * 10))], 0.08, 0.02, 4, 12));
    }
    this.group = new THREE.Group();
    this.mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, fog: false });
    geos.forEach(g => this.group.add(new THREE.Mesh(g, this.mat)));
    this.glow = glowSprite(color, 18, 0); this.glow.position.copy(to); this.group.add(this.glow);
    this.light = new THREE.PointLight(color, 0, 120, 1.0); this.light.position.copy(from.clone().lerp(to, 0.6)); this.group.add(this.light);
  }
  update(dt) {
    const k = dt > 0 && dt < 0.35 ? (dt < 0.08 ? 1 : dt < 0.14 ? 0.3 : dt < 0.2 ? 1 : 1 - (dt - 0.2) / 0.15) : 0;
    this.group.visible = k > 0; this.mat.opacity = k; this.glow.material.opacity = k * 0.8; this.light.intensity = k * 600;
    return k;
  }
}

// Anel de runas flutuantes (para livro, mapa, pistas)
export class RuneRing {
  constructor(n, color, radius = 1, size = 0.25, seed = 1) {
    this.group = new THREE.Group(); this.items = [];
    const tex = runeSheet(seed);
    for (let i = 0; i < n; i++) {
      const t = tex.clone(); t.repeat.set(0.25, 0.25); t.offset.set((i % 4) * 0.25, Math.floor(i / 4 % 4) * 0.25); t.needsUpdate = true;
      const m = new THREE.Mesh(new THREE.PlaneGeometry(size, size), additive(color, 0, t));
      this.group.add(m); this.items.push(m);
    }
    this.radius = radius;
  }
  update(center, t, k, camera, { speed = 0.4, bob = 0.15, tilt = 0 } = {}) {
    this.group.visible = k > 0.001; this.group.position.copy(center);
    const n = this.items.length;
    this.items.forEach((m, i) => {
      const a = i / n * 6.283 + t * speed;
      m.position.set(Math.cos(a) * this.radius, Math.sin(t * 1.3 + i) * bob + Math.sin(a) * tilt, Math.sin(a) * this.radius);
      if (camera) m.quaternion.copy(camera.quaternion);
      m.material.opacity = k * (0.65 + 0.35 * Math.sin(t * 3 + i * 1.7));
    });
  }
}
