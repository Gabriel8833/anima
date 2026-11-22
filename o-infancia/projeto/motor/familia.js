// Personagens 3D (Lucas, Pedro e a Mãe) sobre o esqueleto humanoide, com roupas, cabelo, rosto e objetos de casa.
import { THREE, V, lerp, clamp, mesh } from './base.js';
import { humanoid, face, expr, resetPose, walk, idle, pose } from './rig.js';

export const M = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.75, ...o });

// ---------- pessoa ----------
export function pessoa({ pele, camisa, calca, sapato, shorts = false, cabelo, corCabelo, cabeca = 1.32, olheira = false, iris = 0x4a2e1a, labios = 0xa85a50, saia = null, avental = null }) {
  const mats = { pele: M(pele), camisa: M(camisa), calca: M(calca), sapato: M(sapato, { roughness: 0.5 }), cab: M(corCabelo, { roughness: 0.6 }) };
  const h = humanoid({ skin: mats.pele, legs: mats.calca, boots: mats.sapato, sleeve: mats.pele, hands: mats.pele });
  h.mats = mats;
  if (shorts) for (const s of ['L', 'R']) h['kn' + s].children[0].material = mats.pele;
  // camiseta (tronco) + mangas curtas
  const top = [[0.1, 0.57], [0.16, 0.55], [0.215, 0.47], [0.205, 0.3], [0.185, 0.1], [0.19, -0.07]].map(([r, y]) => new THREE.Vector2(r, y));
  const tr = mesh(new THREE.LatheGeometry(top, 28), mats.camisa); tr.scale.z = 0.74; h.torso.add(tr);
  for (const s of ['L', 'R']) { const sl = mesh(new THREE.CylinderGeometry(0.072, 0.078, 0.18, 14), mats.camisa); sl.position.y = -0.07; h['sh' + s].add(sl); }
  // quadril (calça/bermuda)
  const pv = [[0.19, 0.02], [0.2, -0.07], [0.18, -0.17], [0.12, -0.2]].map(([r, y]) => new THREE.Vector2(r, y));
  const pm = mesh(new THREE.LatheGeometry(pv, 24), mats.calca); pm.scale.z = 0.78; h.hips.add(pm);
  if (shorts) for (const s of ['L', 'R']) { const b = mesh(new THREE.CylinderGeometry(0.095, 0.085, 0.3, 14), mats.calca); b.position.y = -0.17; h['hip' + s].add(b); }
  if (saia) { const sk = [[0.19, 0], [0.24, -0.2], [0.3, -0.48]].map(([r, y]) => new THREE.Vector2(r, y)); const sm = mesh(new THREE.LatheGeometry(sk, 24), M(saia, { side: THREE.DoubleSide })); sm.scale.z = 0.8; h.hips.add(sm); h.skirt = new THREE.Group(); h.hips.add(h.skirt); }
  if (avental) { const av = mesh(new THREE.BoxGeometry(0.3, 0.5, 0.01), M(avental)); av.position.set(0, -0.1, 0.165); h.torso.add(av); }
  // cabeça maior (visual de animação)
  h.head.scale.setScalar(cabeca);
  face(h, { iris, brow: corCabelo, browSize: 1.15, lips: labios });
  // sorriso / boca triste (arco)
  const arco = mesh(new THREE.TorusGeometry(0.022, 0.0045, 6, 16, Math.PI), M(0x6a2a2a), false); arco.position.set(0, -0.052, 0.112); arco.rotation.z = Math.PI; h.face.add(arco); h.sorriso = arco;
  if (olheira) for (const s of [-1, 1]) { const o = mesh(new THREE.TorusGeometry(0.018, 0.0025, 4, 12, Math.PI), M(0x9a6a7a, { transparent: true, opacity: 0.28 }), false); o.position.set(0.042 * s, -0.008, 0.104); o.rotation.z = Math.PI; h.face.add(o); }
  // cabelo
  const capa = (r = 0.132, cor = mats.cab) => { const c = mesh(new THREE.SphereGeometry(r, 28, 18, 0, Math.PI * 2, 0, Math.PI * 0.55), cor); c.position.set(0, 0.165, -0.005); c.scale.set(0.98, 1.08, 1.04); c.rotation.x = -0.32; h.head.add(c); return c; };
  if (cabelo === 'curto') { capa(); const f = mesh(new THREE.SphereGeometry(0.06, 12, 8), mats.cab); f.position.set(0.02, 0.26, 0.085); f.scale.set(1.8, 0.5, 0.8); h.head.add(f); }
  else if (cabelo === 'baguncado') { capa(0.136); for (let i = 0; i < 11; i++) { const a = i / 11 * Math.PI * 2; const c = mesh(new THREE.ConeGeometry(0.035, 0.11, 6), mats.cab); c.position.set(Math.cos(a) * 0.08, 0.27 + Math.sin(i * 2.3) * 0.02, Math.sin(a) * 0.08 - 0.01); c.rotation.set(Math.sin(a) * 0.9, i, -Math.cos(a) * 0.9); h.head.add(c); } for (const s of [-1, 1]) { const m = mesh(new THREE.ConeGeometry(0.03, 0.1, 6), mats.cab); m.position.set(0.05 * s, 0.22, 0.1); m.rotation.set(1.2, 0, s * 0.3); h.head.add(m); } }
  else if (cabelo === 'coque') { capa(0.134); const b = mesh(new THREE.SphereGeometry(0.06, 16, 12), mats.cab); b.position.set(0, 0.29, -0.09); h.head.add(b); for (const s of [-1, 1]) { const l = mesh(new THREE.CapsuleGeometry(0.03, 0.1, 4, 8), mats.cab); l.position.set(0.11 * s, 0.12, -0.02); h.head.add(l); } }
  h.objMao = { L: null, R: null };
  return h;
}
export const lucas = () => pessoa({ pele: 0xe2b08a, camisa: 0x2a6ad0, calca: 0x2a2e3a, sapato: 0x3a3a3a, cabelo: 'curto', corCabelo: 0x4a2c18, olheira: true });
export const pedro = () => pessoa({ pele: 0xe8b890, camisa: 0xd8302a, calca: 0x6a6e78, sapato: 0xf2eee6, shorts: true, cabelo: 'baguncado', corCabelo: 0x2a1a10 });
export const mae = () => pessoa({ pele: 0xd8a07a, camisa: 0x8a5ab0, calca: 0x3a4a6a, sapato: 0x5a3a2a, cabelo: 'coque', corCabelo: 0x3a2418, iris: 0x3a2a1a, labios: 0xb04a5a });

// expressão estendida: sorriso (>0) ou tristeza (<0), boca falando, piscadas
export function rosto(h, t, { olhar = [0, 0], fala = 0, sorriso = 0, raiva = 0, medo = 0, preoc = 0, piscar = true, fechado = 0 } = {}) {
  const pisca = piscar && ((t * 0.9 + h.root.id * 0.37) % 3.2) < 0.13 ? 1 : 0;
  const boca = fala > 0 ? fala * (0.25 + 0.6 * Math.abs(Math.sin(t * 13.5) * Math.sin(t * 5.3 + 1))) : 0;
  expr(h, { look: olhar, blink: Math.max(pisca, fechado), worry: preoc, anger: raiva, fear: medo, open: boca });
  const s = h.sorriso; s.visible = Math.abs(sorriso) > 0.05 && boca < 0.35; s.rotation.z = sorriso >= 0 ? Math.PI : 0; s.position.y = sorriso >= 0 ? -0.05 : -0.068; s.scale.set(1 + Math.abs(sorriso) * 0.5, 0.7 + Math.abs(sorriso) * 0.5, 1);
  h.lip.visible = !s.visible || boca > 0.05;
}
export { resetPose, walk, idle, pose };
// segura um objeto na mão (side 'L'/'R')
export function segurar(h, side, obj) { const atual = h.objMao[side]; if (atual === obj) return; if (atual) h['hand' + side].remove(atual); if (obj) h['hand' + side].add(obj); h.objMao[side] = obj; }
// posições prontas (rotações em radianos das juntas)
export const P = {
  carregar: { shL: [-0.75, 0, 0.25], shR: [-0.75, 0, -0.25], elL: [-0.95, 0, 0], elR: [-0.95, 0, 0] },
  bracosCruzados: { shL: [-0.55, 0, 0.55], shR: [-0.55, 0, -0.55], elL: [-1.9, -0.5, 0], elR: [-1.9, 0.5, 0] },
  cintura: { shL: [0.1, 0, -0.55], shR: [0.1, 0, 0.55], elL: [-1.3, 0, -0.6], elR: [-1.3, 0, 0.6] },
  apontar: { shR: [-1.45, 0.2, 0.1], elR: [-0.1, 0, 0], handR: [0.2, 0, 0] },
  maosNaCabeca: { shL: [-2.6, 0, -0.5], shR: [-2.6, 0, 0.5], elL: [-1.6, 0, 0], elR: [-1.6, 0, 0] },
  bracosAbertos: { shL: [-0.5, 0, -1.1], shR: [-0.5, 0, 1.1], elL: [-0.3, 0, 0], elR: [-0.3, 0, 0] },
  maosJuntas: { shL: [-0.9, 0, 0.45], shR: [-0.9, 0, -0.45], elL: [-1.4, 0, 0], elR: [-1.4, 0, 0] },
  heroi: { shL: [0.1, 0, -0.5], shR: [0.1, 0, 0.5], elL: [-1.3, 0, -0.6], elR: [-1.3, 0, 0.6], torso: [-0.12, 0, 0], head: [-0.15, 0, 0] },
  celular: { shL: [-0.2, 0, -0.1], shR: [-1.0, 0, -0.15], elR: [-1.5, 0, 0], handR: [0.4, 0, 0] },
  comer: { shR: [-1.1, 0, -0.25], elR: [-1.9, 0, 0] },
};
// sentar: abaixa o quadril e dobra pernas (altura do assento ~0,45)
export function sentar(h, k = 1, alturaAssento = 0.47) { h.hipL.rotation.x = -1.5 * k; h.hipR.rotation.x = -1.5 * k; h.knL.rotation.x = 1.5 * k; h.knR.rotation.x = 1.5 * k; h.pivot.position.y = lerp(0.95, alturaAssento + 0.05, k); h.pivot.position.z = lerp(0, -0.05, k); }

// ---------- objetos ----------
export function vassoura() { const g = new THREE.Group(); const cabo = mesh(new THREE.CylinderGeometry(0.014, 0.014, 1.3, 8), M(0xc8a060)); cabo.position.y = -0.45; g.add(cabo); const esc = mesh(new THREE.BoxGeometry(0.32, 0.09, 0.07), M(0xd8302a)); esc.position.y = -1.12; g.add(esc); const cerdas = mesh(new THREE.BoxGeometry(0.34, 0.08, 0.06), M(0xe8c040)); cerdas.position.y = -1.2; g.add(cerdas); g.rotation.x = 0.4; return g; }
export function pilhaRoupa() { const g = new THREE.Group(); const cores = [0xd84a4a, 0x4a8ad0, 0xf0d050, 0x5ab070, 0xe8e0d0, 0x9a5ab0]; cores.forEach((c, i) => { const b = mesh(new THREE.BoxGeometry(0.42 - (i % 2) * 0.04, 0.07, 0.3), M(c)); b.position.set((i % 2 - 0.5) * 0.03, i * 0.07, 0); b.rotation.y = (i % 3 - 1) * 0.12; g.add(b); }); return g; }
export function sacoLixo() { const g = new THREE.Group(); const s = mesh(new THREE.SphereGeometry(0.2, 14, 12), M(0x1a1a1e, { roughness: 0.3 })); s.scale.set(1, 1.2, 0.9); s.position.y = -0.27; g.add(s); const n = mesh(new THREE.ConeGeometry(0.05, 0.1, 8), M(0x1a1a1e, { roughness: 0.3 })); n.position.y = -0.04; g.add(n); return g; }
export function celular() { const g = new THREE.Group(); const c = mesh(new THREE.BoxGeometry(0.075, 0.15, 0.012), M(0x1a1a1e)); c.position.set(0, -0.06, 0.03); g.add(c); const tela = mesh(new THREE.PlaneGeometry(0.065, 0.135), new THREE.MeshBasicMaterial({ color: 0x8ac8ff })); tela.position.set(0, -0.06, 0.037); g.add(tela); return g; }
export function balde() { const g = new THREE.Group(); const b = mesh(new THREE.CylinderGeometry(0.15, 0.12, 0.26, 18, 1, true), M(0x3a8ad0, { side: THREE.DoubleSide })); b.position.y = -0.2; g.add(b); const a = mesh(new THREE.TorusGeometry(0.15, 0.008, 6, 20, Math.PI), M(0x9a9aa2)); a.position.y = -0.07; g.add(a); return g; }
export function pano() { const p = mesh(new THREE.BoxGeometry(0.16, 0.02, 0.14), M(0xf0d050)); p.position.y = -0.06; return p; }
export function prato() { const g = new THREE.Group(); const p = mesh(new THREE.CylinderGeometry(0.13, 0.1, 0.02, 24), M(0xf6f2ea, { roughness: 0.3 })); g.add(p); return g; }
export function copo() { const g = new THREE.Group(); const c = mesh(new THREE.CylinderGeometry(0.045, 0.038, 0.13, 20, 1, true), new THREE.MeshPhysicalMaterial({ color: 0xdff4ff, roughness: 0.05, transmission: 0.6, transparent: true, opacity: 0.55, side: THREE.DoubleSide })); c.position.y = 0.065; g.add(c); const fundo = mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.012, 20), M(0xdff4ff, { transparent: true, opacity: 0.6 })); fundo.position.y = 0.006; g.add(fundo); const agua = mesh(new THREE.CylinderGeometry(0.04, 0.037, 0.03, 20), M(0xa8d8ff, { transparent: true, opacity: 0.6 })); agua.position.y = 0.025; g.add(agua); return g; }
export function salgadinho() { const g = new THREE.Group(); const s = mesh(new THREE.BoxGeometry(0.16, 0.22, 0.06), M(0xf0b020)); s.position.y = -0.08; g.add(s); const f = mesh(new THREE.BoxGeometry(0.162, 0.05, 0.062), M(0xd8302a)); f.position.y = -0.02; g.add(f); return g; }
export function pao() { const p = mesh(new THREE.CapsuleGeometry(0.035, 0.09, 4, 8), M(0xd8a050)); p.rotation.z = Math.PI / 2; return p; }
export function medalha() { const g = new THREE.Group(); const fita = mesh(new THREE.TorusGeometry(0.11, 0.012, 6, 20, Math.PI), M(0x2a5ad0)); fita.rotation.z = Math.PI; fita.position.y = 0.0; g.add(fita); const m = mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.012, 24), M(0xf0c040, { metalness: 0.7, roughness: 0.3 })); m.rotation.x = Math.PI / 2; m.position.y = -0.12; g.add(m); return g; }
