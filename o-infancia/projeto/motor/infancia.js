// Personagens e cenários de "E se você pudesse voltar à sua infância?" (anos 2000, Brasil)
import { THREE, V, rng, lerp, mesh, skyDome, glowSprite, lightShaft } from './base.js';
import { M, pessoa } from './familia.js';

const caixa = (w, h, d, mat, x, y, z) => { const m = mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); return m; };
function texCanvas(w, h, fn) { const c = document.createElement('canvas'); c.width = w; c.height = h; fn(c.getContext('2d')); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; }

// ---------- personagens ----------
// o mesmo rapaz: cabelo castanho curto com franja, pele morena clara. Criança: camiseta listrada laranja e bermuda azul.
export function crianca() {
  const h = pessoa({ pele: 0xd8a47c, camisa: 0xf08a2a, calca: 0x2a5ab0, sapato: 0xf2eee6, shorts: true, cabelo: 'curto', corCabelo: 0x3a2214, cabeca: 1.6 });
  // listras na camiseta
  for (let i = 0; i < 3; i++) { const l = mesh(new THREE.CylinderGeometry(0.206 - i * 0.004, 0.2 - i * 0.004, 0.035, 24, 1, true), M(0xf6e8c8, { side: THREE.DoubleSide })); l.position.y = 0.38 - i * 0.12; l.scale.z = 0.74; h.torso.add(l); }
  h.root.scale.setScalar(0.62); h.escala = 0.62; return h;
}
export function adulto() {
  const h = pessoa({ pele: 0xd8a47c, camisa: 0x5a6070, calca: 0x2a2e3a, sapato: 0x3a3a3a, cabelo: 'curto', corCabelo: 0x3a2214, cabeca: 1.3 });
  const barba = mesh(new THREE.SphereGeometry(0.1, 16, 10, 0, Math.PI * 2, Math.PI * 0.5, Math.PI * 0.5), M(0x4a3020, { transparent: true, opacity: 0.35 })); barba.position.set(0, 0.1, 0.02); barba.scale.set(1.0, 0.8, 0.78); h.head.add(barba);
  return h;
}
export function amigo(i) {
  const cores = [[0x2aa060, 0x3a3a44, 0xc8906a, 0x1a1210], [0xe8c040, 0x5a4a3a, 0x8a5a3a, 0x1a1210], [0x3a6ad0, 0x2a2a30, 0xf2cdb0, 0x8a5a2a], [0xd84a6a, 0x3a4a6a, 0xe8b890, 0x2a1a10]][i % 4];
  const h = pessoa({ pele: cores[2], camisa: cores[0], calca: cores[1], sapato: 0xf2eee6, shorts: true, cabelo: i === 2 ? 'baguncado' : 'curto', corCabelo: cores[3], cabeca: 1.6 });
  h.root.scale.setScalar(0.6 + (i % 2) * 0.03); return h;
}
// ---------- objetos ----------
let texBola = null;
export function bola() { texBola ??= texCanvas(256, 128, x => { x.fillStyle = '#f6f2ea'; x.fillRect(0, 0, 256, 128); x.fillStyle = '#1a1a1e'; for (const [cx, cy] of [[40, 30], [120, 64], [200, 30], [80, 100], [170, 104], [250, 70], [0, 70]]) { x.beginPath(); for (let k = 0; k < 5; k++) { const a = k / 5 * Math.PI * 2; x.lineTo(cx + Math.cos(a) * 16, cy + Math.sin(a) * 16); } x.fill(); } }); return mesh(new THREE.SphereGeometry(0.11, 20, 14), M(0xffffff, { map: texBola, roughness: 0.5 })); }
export function controle() { const g = new THREE.Group(); const c = mesh(new THREE.BoxGeometry(0.16, 0.035, 0.08), M(0x5a5a62)); c.position.set(0, -0.04, 0.03); g.add(c); for (const s of [-1, 1]) { const a = mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.06, 10), M(0x5a5a62)); a.position.set(s * 0.07, -0.05, 0.0); a.rotation.x = Math.PI / 2; g.add(a); } const fio = mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.8, 4), M(0x1a1a1a)); fio.position.set(0, -0.04, -0.4); fio.rotation.x = Math.PI / 2; g.add(fio); return g; }
// TV de tubo (com tela que pode mostrar "jogo" ou "desenho")
export function tvTubo() {
  const g = new THREE.Group(); g.add(caixa(0.9, 0.7, 0.7, M(0x3a3a3e, { roughness: 0.6 }), 0, 0.35, 0)); const fundo = mesh(new THREE.BoxGeometry(0.6, 0.5, 0.35), M(0x2e2e32)); fundo.position.set(0, 0.35, -0.48); g.add(fundo);
  const c = document.createElement('canvas'); c.width = 256; c.height = 192; const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
  const tela = mesh(new THREE.PlaneGeometry(0.7, 0.52), new THREE.MeshBasicMaterial({ map: tex }), false); tela.position.set(-0.05, 0.38, 0.352); g.add(tela);
  for (let i = 0; i < 2; i++) { const b = mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.02, 10), M(0x9a9aa2)); b.rotation.x = Math.PI / 2; b.position.set(0.37, 0.5 - i * 0.12, 0.355); g.add(b); }
  const luz = new THREE.PointLight(0x8ab0ff, 0, 4); luz.position.set(0, 0.4, 0.8); g.add(luz);
  g.userData = { tex, ctx: c.getContext('2d'), luz, tela };
  return g;
}
// desenha um "videogame" estilo 2000 (plataforma 2D pixelada) ou estática
export function telaJogo(tv, t, modo = 'jogo') {
  const x = tv.userData.ctx;
  if (modo === 'desligada') { x.fillStyle = '#1a1e22'; x.fillRect(0, 0, 256, 192); }
  else if (modo === 'jogo') {
    x.fillStyle = '#5ab0ff'; x.fillRect(0, 0, 256, 192); x.fillStyle = '#fff'; for (let i = 0; i < 4; i++) { const cx = ((i * 90 - t * 30) % 330 + 330) % 330 - 40; x.fillRect(cx, 30 + (i % 2) * 20, 40, 12); x.fillRect(cx + 8, 22 + (i % 2) * 20, 24, 10); }
    x.fillStyle = '#3aa040'; x.fillRect(0, 150, 256, 42); x.fillStyle = '#8a5a2a'; for (let i = 0; i < 9; i++) { const bx = ((i * 50 - t * 60) % 450 + 450) % 450 - 40; x.fillRect(bx, 100 - (i % 3) * 22, 30, 12); }
    const j = Math.abs(Math.sin(t * 3)) * 40; x.fillStyle = '#e8302a'; x.fillRect(90, 126 - j, 16, 18); x.fillStyle = '#2a4ad0'; x.fillRect(90, 140 - j, 16, 10); x.fillStyle = '#f2c8a0'; x.fillRect(93, 118 - j, 10, 8);
    x.fillStyle = '#ffd23a'; for (let i = 0; i < 5; i++) { const mx = ((i * 60 + 30 - t * 60) % 300 + 300) % 300; x.beginPath(); x.arc(mx, 80 + Math.sin(i) * 10, 5, 0, 7); x.fill(); }
  }
  x.fillStyle = 'rgba(0,0,0,0.18)'; for (let y = 0; y < 192; y += 3) x.fillRect(0, y, 256, 1);
  tv.userData.tex.needsUpdate = true; tv.userData.luz.intensity = modo === 'desligada' ? 0 : 3 + Math.sin(t * 11) * 0.8;
}
function relogio(x0, y0, z0) { const g = new THREE.Group(); g.position.set(x0, y0, z0); const f = mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.05, 32), M(0x8a5a3a)); f.rotation.x = Math.PI / 2; g.add(f); const m = mesh(new THREE.CircleGeometry(0.19, 32), M(0xf6f2e6), false); m.position.z = 0.027; g.add(m); const ph = new THREE.Group(), pm = new THREE.Group(); ph.position.z = pm.position.z = 0.03; const hh = mesh(new THREE.BoxGeometry(0.02, 0.1, 0.005), M(0x1a1a1a), false); hh.position.y = 0.05; ph.add(hh); const mm = mesh(new THREE.BoxGeometry(0.012, 0.15, 0.005), M(0x1a1a1a), false); mm.position.y = 0.075; pm.add(mm); g.add(ph, pm); g.userData = { ph, pm }; return g; }
export function acertarRelogio(r, horas, minutos) { r.userData.ph.rotation.z = -((horas % 12) + minutos / 60) / 12 * Math.PI * 2; r.userData.pm.rotation.z = -minutos / 60 * Math.PI * 2; }

// ---------- quarto de infância (anos 2000) ----------
export function quartoInfancia(sc, { noite = 0 } = {}) {
  sc.background = new THREE.Color(0x2a2018);
  sc.add(new THREE.HemisphereLight(noite ? 0x6a7ab0 : 0xffe8c8, 0x5a4030, noite ? 0.35 : 1.0));
  const sol = new THREE.DirectionalLight(noite ? 0x8aa0ff : 0xffc878, noite ? 0.25 : 2.6); sol.position.set(-3, 3.5, -1); sol.castShadow = true; sol.shadow.mapSize.set(2048, 2048); Object.assign(sol.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6 }); sc.add(sol);
  const abajur = new THREE.PointLight(0xffc070, noite ? 3 : 0.6, 6); abajur.position.set(-1.6, 1.1, -1.6); sc.add(abajur);
  const piso = mesh(new THREE.PlaneGeometry(8, 8), M(0xb07a4a)); piso.rotation.x = -Math.PI / 2; sc.add(piso);
  const pm = M(0x8ac0d8); sc.add(caixa(8, 3, 0.1, pm, 0, 1.5, -2.5)); sc.add(caixa(0.1, 3, 8, pm, -3.2, 1.5, 0.5)); sc.add(caixa(0.1, 3, 8, pm, 3.2, 1.5, 0.5));
  // janela com raios dourados
  const jan = mesh(new THREE.PlaneGeometry(1.1, 1.0), new THREE.MeshBasicMaterial({ color: noite ? 0x1a2448 : 0xfff0c8 }), false); jan.position.set(-3.14, 1.7, -0.6); jan.rotation.y = Math.PI / 2; sc.add(jan);
  const raio = lightShaft(0.5, 1.4, 4, 0xffd890, noite ? 0 : 0.14); raio.position.set(-2.2, 1.2, -0.6); raio.rotation.z = -1.0; sc.add(raio);
  // cama
  const cama = new THREE.Group(); cama.position.set(-1.6, 0, -1.2); sc.add(cama);
  cama.add(caixa(1.0, 0.35, 2.0, M(0x8a5a3a), 0, 0.17, 0)); cama.add(caixa(0.95, 0.15, 1.95, M(0xf6f2ea), 0, 0.42, 0)); cama.add(caixa(1.0, 0.7, 0.08, M(0x8a5a3a), 0, 0.5, -1.0));
  const coberta = caixa(0.98, 0.08, 1.2, M(0x3a7ad0), 0, 0.52, 0.35); cama.add(coberta); const trav = caixa(0.6, 0.12, 0.35, M(0xf6f2ea), 0, 0.55, -0.72); cama.add(trav);
  // pôsteres (sem texto): carro de corrida, foguete, jogador
  const poster = (cor, fn, x, y, z, ry) => { const t = texCanvas(128, 180, x2 => { x2.fillStyle = cor; x2.fillRect(0, 0, 128, 180); fn(x2); }); const m = mesh(new THREE.PlaneGeometry(0.6, 0.85), M(0xffffff, { map: t }), false); m.position.set(x, y, z); m.rotation.y = ry; sc.add(m); };
  poster('#d8302a', x => { x.fillStyle = '#ffd23a'; x.beginPath(); x.moveTo(20, 120); x.lineTo(108, 120); x.lineTo(96, 96); x.lineTo(40, 96); x.fill(); x.fillStyle = '#111'; x.beginPath(); x.arc(40, 124, 12, 0, 7); x.arc(96, 124, 12, 0, 7); x.fill(); }, 0.2, 1.9, -2.44, 0);
  poster('#1a2a6a', x => { x.fillStyle = '#fff'; for (let i = 0; i < 20; i++) x.fillRect((i * 37) % 128, (i * 53) % 180, 2, 2); x.fillStyle = '#e8e8f0'; x.beginPath(); x.moveTo(64, 30); x.lineTo(80, 110); x.lineTo(48, 110); x.fill(); x.fillStyle = '#ff7a2a'; x.beginPath(); x.moveTo(52, 110); x.lineTo(64, 150); x.lineTo(76, 110); x.fill(); }, 1.0, 1.85, -2.44, 0);
  poster('#2aa060', x => { x.fillStyle = '#ffd23a'; x.fillRect(44, 60, 40, 60); x.fillStyle = '#e8b890'; x.beginPath(); x.arc(64, 44, 16, 0, 7); x.fill(); x.fillStyle = '#fff'; x.beginPath(); x.arc(64, 150, 12, 0, 7); x.fill(); }, 3.14, 1.8, -0.8, -Math.PI / 2);
  // TV de tubo num rack, videogame, brinquedos
  const tv = tvTubo(); tv.position.set(1.6, 0.45, -1.9); tv.rotation.y = -0.35; sc.add(tv); sc.add(caixa(1.2, 0.45, 0.6, M(0x6a4a30), 1.6, 0.225, -1.9));
  const vg = caixa(0.32, 0.08, 0.25, M(0x4a4a52), 1.4, 0.06, -1.1); sc.add(vg);
  const r = rng(6), cores = [0xd8302a, 0x2a6ad0, 0xf0c030, 0x2aa060, 0x9a5ab0];
  for (let i = 0; i < 9; i++) { const b = caixa(0.14, 0.14, 0.14, M(cores[i % 5]), -0.6 + r() * 2.2, 0.07, 0.2 + r() * 1.4); b.rotation.y = r() * 3; sc.add(b); }
  const carrinho = new THREE.Group(); carrinho.add(caixa(0.3, 0.1, 0.15, M(0xd8302a), 0, 0.09, 0)); for (const [x, z] of [[-0.1, 0.08], [0.1, 0.08], [-0.1, -0.08], [0.1, -0.08]]) { const w = mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.03, 10), M(0x1a1a1a)); w.rotation.x = Math.PI / 2; w.position.set(x, 0.04, z); carrinho.add(w); } carrinho.position.set(0.6, 0, 0.9); carrinho.rotation.y = 0.6; sc.add(carrinho);
  const bolaQ = bola(); bolaQ.position.set(-0.4, 0.11, 0.6); sc.add(bolaQ);
  const rel = relogio(-0.4, 2.2, -2.43); sc.add(rel);
  return { tv, relogio: rel, cama, coberta, abajur };
}
// ---------- quarto atual (adulto): escuro, frio, organizado demais ----------
export function quartoAtual(sc) {
  sc.background = new THREE.Color(0x0e1018);
  sc.add(new THREE.HemisphereLight(0x8a9ad0, 0x2a2a34, 0.9));
  const abaj = new THREE.PointLight(0xa8c0ff, 4, 6); abaj.position.set(-0.2, 1.2, -1.4); sc.add(abaj);
  const lua = new THREE.DirectionalLight(0x9ab8ff, 1.4); lua.position.set(-3, 3, 1); lua.castShadow = true; sc.add(lua);
  const piso = mesh(new THREE.PlaneGeometry(8, 8), M(0x3a3a44)); piso.rotation.x = -Math.PI / 2; sc.add(piso);
  const pm = M(0x6a7088); sc.add(caixa(8, 3, 0.1, pm, 0, 1.5, -2.5)); sc.add(caixa(0.1, 3, 8, pm, -3.2, 1.5, 0.5)); sc.add(caixa(0.1, 3, 8, pm, 3.2, 1.5, 0.5));
  const jan = mesh(new THREE.PlaneGeometry(1.4, 1.2), new THREE.MeshBasicMaterial({ color: 0x1a2448 }), false); jan.position.set(-3.14, 1.7, -0.6); jan.rotation.y = Math.PI / 2; sc.add(jan);
  const cama = new THREE.Group(); cama.position.set(-1.4, 0, -1.0); sc.add(cama);
  cama.add(caixa(1.7, 0.35, 2.1, M(0x2a2a30), 0, 0.17, 0)); cama.add(caixa(1.65, 0.15, 2.05, M(0xc8ccd4), 0, 0.42, 0)); cama.add(caixa(1.7, 0.9, 0.08, M(0x2a2a30), 0, 0.6, -1.05));
  const coberta = caixa(1.66, 0.08, 1.2, M(0x3a4a6a), 0, 0.52, 0.4); cama.add(coberta); cama.add(caixa(0.6, 0.12, 0.35, M(0xc8ccd4), 0, 0.55, -0.75));
  const cel = mesh(new THREE.BoxGeometry(0.08, 0.01, 0.16), M(0x1a1a1e)); cel.position.set(-0.2, 0.62, -1.7); sc.add(cel); sc.add(caixa(0.45, 0.55, 0.4, M(0x2a2a30), -0.2, 0.28, -1.7));
  const notif = glowSprite(0x8ac8ff, 0.3, 0.6); notif.position.set(-0.2, 0.65, -1.7); sc.add(notif);
  sc.add(caixa(1.2, 0.75, 0.6, M(0x2a2a30), 1.8, 0.375, -2.0)); const note = caixa(0.5, 0.02, 0.35, M(0x6a6a72), 1.8, 0.76, -2.0); sc.add(note);
  return { cama, coberta, notif };
}
// ---------- casa: corredor/cozinha (manhã) ----------
export function casaManha(sc) {
  sc.background = new THREE.Color(0x2a2018);
  sc.add(new THREE.HemisphereLight(0xfff0d8, 0x5a4030, 1.1));
  const sol = new THREE.DirectionalLight(0xffd8a0, 2.4); sol.position.set(3, 4, 3); sol.castShadow = true; sol.shadow.mapSize.set(2048, 2048); Object.assign(sol.shadow.camera, { left: -10, right: 10, top: 6, bottom: -6 }); sc.add(sol);
  const piso = mesh(new THREE.PlaneGeometry(20, 6), M(0xd8c8b0)); piso.rotation.x = -Math.PI / 2; piso.position.x = 4; sc.add(piso);
  sc.add(caixa(20, 3, 0.1, M(0xf0e0c0), 4, 1.5, -2)); // parede do fundo
  // corredor com quadros, cozinha com mesa e café, porta aberta para a rua
  for (const x of [-3, -1.5]) { sc.add(caixa(0.5, 0.4, 0.03, M(0xc8a060), x, 1.8, -1.95)); sc.add(caixa(0.42, 0.32, 0.02, M(0x8ac0e0), x, 1.8, -1.93)); }
  sc.add(caixa(1.4, 0.06, 0.8, M(0xa8784a), 2.2, 0.76, -0.8)); for (const [x, z] of [[1.6, -1.1], [2.8, -1.1], [1.6, -0.5], [2.8, -0.5]]) sc.add(caixa(0.06, 0.76, 0.06, M(0x8a5a3a), x, 0.38, z));
  const xic = mesh(new THREE.CylinderGeometry(0.05, 0.04, 0.09, 14), M(0xf6f2ea)); xic.position.set(2.0, 0.84, -0.7); sc.add(xic); const pao = mesh(new THREE.CapsuleGeometry(0.04, 0.12, 4, 8), M(0xd8a050)); pao.rotation.z = Math.PI / 2; pao.position.set(2.4, 0.83, -0.8); sc.add(pao);
  sc.add(caixa(1.8, 0.9, 0.6, M(0x9a7a5a), 2.6, 0.45, -1.7)); sc.add(caixa(0.7, 1.9, 0.65, M(0xf2f2f4), 4.2, 0.95, -1.65));
  sc.add(caixa(0.1, 3, 6, M(0xf0e0c0), 6.2, 1.5, 0)); // parede com a porta
  const luzPorta = mesh(new THREE.PlaneGeometry(1.0, 2.1), new THREE.MeshBasicMaterial({ color: 0xfff4d8 }), false); luzPorta.position.set(6.14, 1.05, -0.2); luzPorta.rotation.y = -Math.PI / 2; sc.add(luzPorta);
  const feixe = lightShaft(0.5, 1.4, 4, 0xffe0a0, 0.15); feixe.position.set(5.2, 1.0, -0.2); feixe.rotation.z = Math.PI / 2 - 0.25; sc.add(feixe);
}
// ---------- rua de bairro brasileiro ----------
export function ruaBairro(sc, { entardecer = 0, noite = 0 } = {}) {
  const top = noite ? 0x0e1430 : entardecer ? 0x3a3a7a : 0x3a8ae0, mid = noite ? 0x2a2a50 : entardecer ? 0xe08a5a : 0x8ac0f0, hor = noite ? 0x3a3050 : entardecer ? 0xffc080 : 0xfff2d0;
  sc.add(skyDome({ top, mid, horizon: hor, bottom: 0x5a5a5a, sunColor: noite ? 0 : 0xffe0a0, sunDir: V(-0.3, entardecer ? 0.08 : 0.5, -0.9), sunSize: 3, glow: 0.5, stars: noite ? 1 : 0 }));
  sc.fog = new THREE.Fog(hor, 30, 120);
  sc.add(new THREE.HemisphereLight(noite ? 0x6a7ab0 : 0xfff0d8, 0x5a5040, noite ? 0.4 : 1.1));
  const sol = new THREE.DirectionalLight(noite ? 0x8aa0ff : entardecer ? 0xffa060 : 0xfff0d0, noite ? 0.4 : 2.4); sol.position.set(-12, entardecer ? 5 : 16, -14); sol.castShadow = true; sol.shadow.mapSize.set(2048, 2048); Object.assign(sol.shadow.camera, { left: -20, right: 20, top: 20, bottom: -20, near: 1, far: 80 }); sc.add(sol);
  sc.add(caixa(120, 0.02, 7, M(0x4a4a52), 0, 0.01, 0)); for (const s of [-1, 1]) sc.add(caixa(120, 0.16, 2.2, M(0xb8b0a4), 0, 0.08, s * 4.6));
  const r = rng(8), cores = [0xf0c890, 0x9ad0b0, 0xf6e08a, 0xd8b0e0, 0xf0a090, 0xa8c8f0, 0xf2eee6];
  const casas = [];
  for (let i = 0; i < 16; i++) for (const s of [-1, 1]) {
    const x = -48 + i * 6.4 + (s > 0 ? 3 : 0), w = 5.8, h = 3.2 + r() * 1.2, cor = cores[Math.floor(r() * cores.length)];
    const g = new THREE.Group(); g.position.set(x, 0, s * 9); g.rotation.y = s > 0 ? Math.PI : 0; sc.add(g);
    g.add(caixa(w, h, 4, M(cor), 0, h / 2, 0)); const tel = mesh(new THREE.ConeGeometry(w * 0.72, 1.4, 4), M(0xb0563a)); tel.rotation.y = Math.PI / 4; tel.position.y = h + 0.7; tel.scale.z = 0.7; g.add(tel);
    const jl = noite ? 0xffd890 : 0x8ab0d0; g.add(caixa(1.0, 0.9, 0.05, M(jl, noite ? { emissive: 0xffc070, emissiveIntensity: 0.8 } : {}), -1.4, 1.7, 2.02)); g.add(caixa(0.9, 2.0, 0.05, M(0x7a4a2a), 1.2, 1.0, 2.02));
    // muro baixo e portão de grade
    g.add(caixa(w, 1.1, 0.15, M(0xe8e0d4), 0, 0.55, 3.6));
    const portao = new THREE.Group(); portao.position.set(1.2, 0, 3.62); for (let k = 0; k < 9; k++) portao.add(caixa(0.04, 1.3, 0.04, M(0x2a2a30, { metalness: 0.6, roughness: 0.4 }), -0.6 + k * 0.15, 0.65, 0)); portao.add(caixa(1.3, 0.05, 0.05, M(0x2a2a30), 0, 1.25, 0)); portao.add(caixa(1.3, 0.05, 0.05, M(0x2a2a30), 0, 0.1, 0)); g.add(portao); casas.push({ g, portao });
    if (r() < 0.5) { const tr = new THREE.Group(); tr.position.set(x + 2.6, 0, s * 5.2); tr.add(caixa(0.25, 2.2, 0.25, M(0x6a4a2a), 0, 1.1, 0)); const copa = mesh(new THREE.SphereGeometry(1.3, 12, 10), M(0x4a8a3a)); copa.position.y = 2.9; tr.add(copa); sc.add(tr); }
  }
  // bicicletas encostadas
  for (const [x, z] of [[-6, -4.2], [7, 4.2]]) { const b = new THREE.Group(); b.position.set(x, 0, z); for (const dx of [-0.45, 0.45]) { const w = mesh(new THREE.TorusGeometry(0.32, 0.03, 6, 20), M(0x1a1a1a)); w.position.set(dx, 0.34, 0); b.add(w); } b.add(caixa(0.9, 0.04, 0.04, M(0xd8302a), 0, 0.55, 0)); b.add(caixa(0.04, 0.4, 0.04, M(0xd8302a), 0.3, 0.7, 0)); sc.add(b); }
  // postes com lâmpada
  const lampadas = []; for (let x = -40; x < 40; x += 14) { sc.add(caixa(0.12, 5, 0.12, M(0x8a8a90), x, 2.5, -5.4)); const l = glowSprite(0xffd890, 1.4, noite ? 0.9 : 0); l.position.set(x, 5, -5.0); sc.add(l); lampadas.push(l); }
  // chinelos como traves do gol
  const chinelos = []; for (const x of [-1.2, -0.4]) { const c = caixa(0.25, 0.03, 0.1, M(0x2a8ad0), x, 0.03, 2.4); sc.add(c); chinelos.push(c); }
  return { casas, sol, lampadas };
}
