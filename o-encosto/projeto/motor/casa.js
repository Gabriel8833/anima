// Cenários domésticos 3D: sala, cozinha/sala de jantar, quintal com varal, frente da casa e palco escuro.
import { THREE, V, rng, lerp, mesh, skyDome, glowSprite, lightShaft } from './base.js';
import { M, copo, prato } from './familia.js';

const caixa = (w, h, d, mat, x, y, z) => { const m = mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); return m; };
function texPiso(c1, c2, tipo) { const c = document.createElement('canvas'); c.width = c.height = 512; const x = c.getContext('2d'); x.fillStyle = c1; x.fillRect(0, 0, 512, 512); x.strokeStyle = c2; x.lineWidth = 4; if (tipo === 'madeira') { for (let i = 0; i < 8; i++) { x.beginPath(); x.moveTo(0, i * 64); x.lineTo(512, i * 64); x.stroke(); x.beginPath(); x.moveTo((i * 137) % 512, i * 64); x.lineTo((i * 137) % 512, i * 64 + 64); x.stroke(); } } else { for (let i = 0; i <= 8; i++) { x.beginPath(); x.moveTo(i * 64, 0); x.lineTo(i * 64, 512); x.stroke(); x.beginPath(); x.moveTo(0, i * 64); x.lineTo(512, i * 64); x.stroke(); } } const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 3); t.colorSpace = THREE.SRGBColorSpace; return t; }
function luzes(sc, { quente = 1, noite = 0 } = {}) {
  sc.add(new THREE.HemisphereLight(noite ? 0x8a9ad8 : 0xfff2e0, 0x5a4a40, noite ? 0.5 : 1.0));
  const sol = new THREE.DirectionalLight(noite ? 0x9ab0ff : 0xffe6c0, noite ? 0.6 : 2.0); sol.position.set(3, 6, 5); sol.castShadow = true; sol.shadow.mapSize.set(2048, 2048); Object.assign(sol.shadow.camera, { left: -8, right: 8, top: 8, bottom: -8, near: 0.5, far: 30 }); sol.shadow.bias = -0.0006; sc.add(sol);
  const teto = new THREE.PointLight(noite ? 0xffc88a : 0xfff0d8, noite ? 8 : 4 * quente, 12); teto.position.set(0, 2.6, 0.5); sc.add(teto);
  return { sol, teto };
}
function sofa(cor = 0x5a6a8a) { const g = new THREE.Group(), m = M(cor), a = M(0x4a5a78); g.add(caixa(2.2, 0.42, 0.9, m, 0, 0.21, 0)); g.add(caixa(2.2, 0.7, 0.25, m, 0, 0.6, -0.36)); for (const s of [-1, 1]) g.add(caixa(0.22, 0.62, 0.9, a, s * 1.1, 0.31, 0)); for (const s of [-0.5, 0.5]) { const c = mesh(new THREE.BoxGeometry(0.95, 0.14, 0.7), M(0x6a7a9a)); c.position.set(s * 1.05, 0.48, 0.05); g.add(c); } return g; }
function tv(t0 = 0) { const g = new THREE.Group(); g.add(caixa(1.4, 0.5, 0.45, M(0x5a3a2a), 0, 0.25, 0)); g.add(caixa(1.25, 0.72, 0.06, M(0x1a1a1e), 0, 0.88, 0)); const tela = mesh(new THREE.PlaneGeometry(1.16, 0.64), new THREE.MeshBasicMaterial({ color: 0x5a8aff })); tela.position.set(0, 0.88, 0.035); g.add(tela); g.userData.tela = tela; return g; }
function ventilador() { const g = new THREE.Group(); g.add(caixa(0.3, 0.04, 0.3, M(0xe8e8ea), 0, 0.02, 0)); const haste = mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.0, 8), M(0xe8e8ea)); haste.position.y = 0.5; g.add(haste); const cab = new THREE.Group(); cab.position.y = 1.05; g.add(cab); const grade = mesh(new THREE.TorusGeometry(0.22, 0.012, 6, 30), M(0xe8e8ea)); cab.add(grade); const pas = new THREE.Group(); for (let i = 0; i < 3; i++) { const p = mesh(new THREE.BoxGeometry(0.06, 0.18, 0.01), M(0x8ac8ff)); p.position.y = 0.09; const h = new THREE.Group(); h.rotation.z = i * 2.09; h.add(p); pas.add(h); } cab.add(pas); g.userData = { cab, pas }; return g; }
function janela(w = 1.4, h = 1.2, noite = 0) { const g = new THREE.Group(); const vidro = mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: noite ? 0x1a2448 : 0xbfe4f8 })); g.add(vidro); const mf = M(0xf2eee6); g.add(caixa(w + 0.12, 0.08, 0.08, mf, 0, h / 2, 0.02), caixa(w + 0.12, 0.08, 0.08, mf, 0, -h / 2, 0.02), caixa(0.08, h, 0.08, mf, -w / 2, 0, 0.02), caixa(0.08, h, 0.08, mf, w / 2, 0, 0.02), caixa(0.05, h, 0.05, mf, 0, 0, 0.02)); if (noite) { const r = rng(4); for (let i = 0; i < 14; i++) { const l = mesh(new THREE.PlaneGeometry(0.05, 0.07), new THREE.MeshBasicMaterial({ color: 0xffd890 })); l.position.set((r() - 0.5) * w * 0.9, -h * 0.2 + r() * h * 0.5, 0.005); g.add(l); } } return g; }
// paredes e piso de um cômodo (largura 9, profundidade 7), centrado em x0
function comodo(sc, x0, { parede = 0xe8dcc8, piso = ['#b88a5a', '#9a6a42', 'madeira'], rodape = 0xf6f2ea } = {}) {
  const chao = mesh(new THREE.PlaneGeometry(9, 8), M(0xffffff, { map: texPiso(...piso) })); chao.rotation.x = -Math.PI / 2; chao.position.set(x0, 0, 0.5); sc.add(chao);
  const pm = M(parede); sc.add(caixa(9, 3.2, 0.1, pm, x0, 1.6, -3)); sc.add(caixa(0.1, 3.2, 8, pm, x0 - 4.5, 1.6, 0.5)); sc.add(caixa(0.1, 3.2, 8, pm, x0 + 4.5, 1.6, 0.5));
  sc.add(caixa(9, 0.12, 0.04, M(rodape), x0, 0.06, -2.94));
}
export function sala(sc, { noite = 0, migalhas = 0 } = {}) {
  sc.background = new THREE.Color(0x2a2420); const L = luzes(sc, { noite });
  comodo(sc, 0, {});
  const s = sofa(); s.position.set(0.6, 0, -2.2); sc.add(s);
  const t = tv(); t.position.set(-3.4, 0, -2.3); t.rotation.y = 0.7; sc.add(t);
  const v = ventilador(); v.position.set(2.5, 0, -1.4); v.rotation.y = -0.7; sc.add(v);
  const j = janela(1.6, 1.2, noite); j.position.set(-1.6, 1.7, -2.94); sc.add(j);
  // mesa de centro, tapete, quadro, planta
  const tap = mesh(new THREE.CircleGeometry(1.6, 40), M(0xb05a4a)); tap.rotation.x = -Math.PI / 2; tap.position.set(0.6, 0.005, -0.8); tap.scale.y = 0.6; sc.add(tap);
  sc.add(caixa(1.0, 0.36, 0.55, M(0x8a5a3a), 0.6, 0.18, -0.9));
  sc.add(caixa(0.9, 0.6, 0.04, M(0xf0c060), 1.9, 2.0, -2.9)); sc.add(caixa(0.8, 0.5, 0.02, M(0x5aa0d0), 1.9, 2.0, -2.87));
  const vaso = mesh(new THREE.CylinderGeometry(0.16, 0.12, 0.35, 12), M(0xc86a3a)); vaso.position.set(3.6, 0.18, -2.4); sc.add(vaso); const pl = mesh(new THREE.SphereGeometry(0.35, 12, 10), M(0x4a8a3a)); pl.position.set(3.6, 0.6, -2.4); sc.add(pl);
  // porta da cozinha ao fundo à direita
  sc.add(caixa(1.0, 2.2, 0.06, M(0x3a2a22), 3.7, 1.1, -2.97));
  // migalhas
  const mig = []; const r = rng(9); for (let i = 0; i < 40; i++) { const m2 = mesh(new THREE.SphereGeometry(0.012, 5, 4), M(0xe0a030)); m2.position.set(0.6 + (r() - 0.5) * 2.4, 0.02, -1.4 + (r() - 0.5) * 1.6); m2.visible = i < migalhas * 40; sc.add(m2); mig.push(m2); }
  return { sofa: s, tv: t, ventilador: v, migalhas: mig, luzes: L };
}
export function cozinha(sc, { noite = 0, louca = 1, copoNaMesa = true, limpa = 0 } = {}) {
  sc.background = new THREE.Color(0x2a2420); const L = luzes(sc, { noite });
  comodo(sc, 0, { parede: 0xf0e6d0, piso: ['#e8e4dc', '#c8c0b4', 'azulejo'] });
  // bancada com pia e armários
  const bm = M(0x8a6a4a), tampo = M(0xd8d4cc, { roughness: 0.4 });
  sc.add(caixa(4.4, 0.9, 0.65, bm, -1.6, 0.45, -2.6)); sc.add(caixa(4.5, 0.06, 0.7, tampo, -1.6, 0.93, -2.6));
  const cuba = caixa(0.8, 0.05, 0.5, M(0x9aa0a8, { metalness: 0.6, roughness: 0.3 }), -2.0, 0.965, -2.6); sc.add(cuba);
  const torn = mesh(new THREE.TorusGeometry(0.12, 0.02, 6, 12, Math.PI), M(0xc8ccd4, { metalness: 0.8, roughness: 0.2 })); torn.position.set(-2.0, 1.1, -2.85); sc.add(torn);
  sc.add(caixa(4.4, 0.8, 0.4, bm, -1.6, 2.3, -2.75));
  const gel = caixa(0.8, 2.0, 0.7, M(0xf2f2f4, { roughness: 0.3 }), 2.4, 1.0, -2.6); sc.add(gel);
  // montanha de louça
  const pratos = []; for (let i = 0; i < 16; i++) { const p = prato(); p.position.set(-2.0 + ((i * 37) % 7 - 3) * 0.04, 1.0 + i * 0.035, -2.6 + ((i * 13) % 5 - 2) * 0.03); p.rotation.set((i % 3 - 1) * 0.15, i, (i % 2) * 0.2); p.visible = i < louca * 16; sc.add(p); pratos.push(p); }
  // mesa de jantar + cadeiras + copo
  const mesa = new THREE.Group(); mesa.position.set(0.4, 0, -0.1); sc.add(mesa);
  mesa.add(caixa(2.0, 0.06, 1.0, M(0xa8784a), 0, 0.76, 0)); for (const [x, z] of [[-0.9, -0.4], [0.9, -0.4], [-0.9, 0.4], [0.9, 0.4]]) mesa.add(caixa(0.07, 0.76, 0.07, M(0x8a5a3a), x, 0.38, z));
  const toalha = mesh(new THREE.PlaneGeometry(1.6, 0.6), M(0xe8d0a0)); toalha.rotation.x = -Math.PI / 2; toalha.position.y = 0.795; mesa.add(toalha);
  const cadeiras = [[-0.55, -0.85, 0], [0.55, -0.85, 0], [0, 0.85, Math.PI]].map(([x, z, r]) => { const c = new THREE.Group(); c.position.set(x, 0, z); c.rotation.y = r; c.add(caixa(0.45, 0.05, 0.45, M(0x8a5a3a), 0, 0.46, 0)); c.add(caixa(0.45, 0.5, 0.05, M(0x8a5a3a), 0, 0.72, -0.21)); for (const [a, b] of [[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]]) c.add(caixa(0.04, 0.46, 0.04, M(0x6a4a2a), a, 0.23, b)); mesa.add(c); return c; });
  const cp = copo(); cp.position.set(0.55, 0.8, 0.15); cp.visible = copoNaMesa; mesa.add(cp);
  const j = janela(1.2, 1.0, noite); j.position.set(1.0, 1.9, -2.94); sc.add(j);
  return { pratos, mesa, copo: cp, cadeiras, luzes: L };
}
export function quintal(sc) {
  sc.add(skyDome({ top: 0x3a8ae0, mid: 0x8ac0f0, horizon: 0xe0f0f8, bottom: 0x6a8a5a, sunColor: 0xfff2c8, sunDir: V(0.4, 0.6, -0.6), sunSize: 3, glow: 0.4 }));
  sc.add(new THREE.HemisphereLight(0xe0f0ff, 0x5a7a4a, 1.3)); const sol = new THREE.DirectionalLight(0xfff4e0, 2.4); sol.position.set(4, 8, 5); sol.castShadow = true; sol.shadow.mapSize.set(2048, 2048); Object.assign(sol.shadow.camera, { left: -8, right: 8, top: 8, bottom: -8 }); sc.add(sol);
  const gr = mesh(new THREE.PlaneGeometry(30, 30), M(0x6aa84a)); gr.rotation.x = -Math.PI / 2; sc.add(gr);
  sc.add(caixa(16, 1.8, 0.15, M(0xe8d8c0), 0, 0.9, -3.5));
  const varal = []; for (const x of [-2.2, 2.2]) sc.add(caixa(0.06, 1.9, 0.06, M(0x9a9aa2), x, 0.95, -1.5));
  const corda = mesh(new THREE.CylinderGeometry(0.008, 0.008, 4.4, 6), M(0xf2eee6)); corda.rotation.z = Math.PI / 2; corda.position.set(0, 1.85, -1.5); sc.add(corda);
  const cores = [0xd84a4a, 0x4a8ad0, 0xf0d050, 0x5ab070, 0xe8e0d0, 0x9a5ab0];
  for (let i = 0; i < 6; i++) { const r = mesh(new THREE.PlaneGeometry(0.45, 0.6), M(cores[i], { side: THREE.DoubleSide })); r.position.set(-1.8 + i * 0.7, 1.55, -1.5); r.visible = false; sc.add(r); varal.push(r); }
  return { varal, sol };
}
export function frente(sc, { entardecer = 1 } = {}) {
  sc.add(skyDome({ top: 0x2a3a7a, mid: 0xd87a5a, horizon: 0xffc080, bottom: 0x4a4a52, sunColor: 0xffb060, sunDir: V(-0.6, 0.1, -0.8), sunSize: 4, glow: 0.6 }));
  sc.add(new THREE.HemisphereLight(0xffd0a0, 0x3a3040, 0.9)); const sol = new THREE.DirectionalLight(0xffb070, 2.4); sol.position.set(-6, 4, -6); sol.castShadow = true; sol.shadow.mapSize.set(2048, 2048); Object.assign(sol.shadow.camera, { left: -10, right: 10, top: 10, bottom: -10 }); sc.add(sol);
  const gr = mesh(new THREE.PlaneGeometry(40, 40), M(0x5a8a4a)); gr.rotation.x = -Math.PI / 2; sc.add(gr);
  // casa (fachada) com porta
  sc.add(caixa(10, 3.6, 0.3, M(0xe8c8a0), 0, 1.8, -4)); sc.add(caixa(1.1, 2.2, 0.1, M(0x6a3a22), 0, 1.1, -3.82)); const luzPorta = glowSprite(0xffd890, 1.4, 0.6); luzPorta.position.set(0, 2.5, -3.6); sc.add(luzPorta);
  for (const x of [-3, 3]) { const j = janela(1.2, 1.0, 1); j.position.set(x, 1.8, -3.84); sc.add(j); }
  // caminho até a calçada, calçada e rua
  sc.add(caixa(1.2, 0.04, 6.5, M(0xb8b0a4), 0, 0.02, -0.6)); sc.add(caixa(20, 0.12, 1.6, M(0xc8c0b4), 0, 0.06, 3.4)); sc.add(caixa(20, 0.02, 6, M(0x3a3c44), 0, 0.01, 7.2));
  const lixeira = new THREE.Group(); lixeira.position.set(1.4, 0, 3.4); lixeira.add(caixa(0.6, 0.8, 0.5, M(0x3a7a3a), 0, 0.52, 0)); sc.add(lixeira);
  // feixes de luz épicos
  const feixes = [-2, 0, 2].map(x => { const f = lightShaft(0.3, 1.4, 9, 0xffe0a0, 0.18); f.position.set(x, 4.5, 1.5); f.rotation.z = x * 0.08; sc.add(f); return f; });
  return { lixeira, feixes, sol };
}
export function palco(sc) {
  sc.background = new THREE.Color(0x14141e); sc.fog = new THREE.Fog(0x14141e, 10, 30);
  sc.add(new THREE.HemisphereLight(0x9aaad0, 0x202030, 1.1));
  const chao = mesh(new THREE.CircleGeometry(8, 60), M(0x1a1a24, { roughness: 0.3 })); chao.rotation.x = -Math.PI / 2; sc.add(chao);
  const spots = [-1.6, 1.6].map(x => { const s = new THREE.SpotLight(0xfff0d8, 160, 16, 0.42, 0.5); s.position.set(x, 7, 2); s.target.position.set(x, 0, 0); s.castShadow = true; sc.add(s); sc.add(s.target); const cone = lightShaft(0.15, 1.6, 7, 0xfff0d0, 0.12); cone.position.set(x, 3.5, 0.6); sc.add(cone); return { s, cone }; });
  return { spots };
}
