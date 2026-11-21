// Motor 2D — efeitos mágicos e de ação no estilo cartoon.
import { TAU, lerp, clamp, sstep, easeOut, rng, seeds, rgba } from './base.js';
import { OUT, shape, circle, ellipse, poly, line, glow, sparkle, star5, cloud, rune } from './desenho.js';

const S200 = seeds(200, 7);

// Faíscas que sobem/giram em volta de um ponto
export function aura(c, x, y, r, color, t, a = 1, n = 24, seed = 1) {
  if (a <= 0.01) return;
  for (let i = 0; i < n; i++) {
    const s = S200[(i + seed * 13) % 200], life = (t * (0.4 + s[3] * 0.6) + s[4]) % 1;
    const an = s[0] * TAU + t * (1 + s[1]);
    const rr = r * (0.5 + s[1] * 0.6);
    sparkle(c, x + Math.cos(an) * rr, y + Math.sin(an) * rr * 0.6 - life * r * 0.8, 6 + s[2] * 10, color, a * Math.sin(life * Math.PI));
  }
}
// Fumaça escura (Morvath)
export function fumaca(c, x, y, r, t, a = 1, color = '#120a18', seed = 3) {
  if (a <= 0.01) return;
  c.save(); c.globalAlpha *= a * 0.75;
  for (let i = 0; i < 14; i++) {
    const s = S200[(i + seed * 17) % 200], life = (t * (0.25 + s[3] * 0.3) + s[4]) % 1;
    const px = x + (s[0] - 0.5) * r * 1.6 + Math.sin(t + i) * 10, py = y - life * r * 1.6;
    c.globalAlpha = a * 0.6 * Math.sin(life * Math.PI);
    c.fillStyle = color; c.beginPath(); c.arc(px, py, r * (0.25 + s[1] * 0.25) * (0.6 + life), 0, TAU); c.fill();
  }
  c.restore();
}
// Esfera de energia negra com borda vermelha
export function orbeNegro(c, x, y, r, t, a = 1) {
  if (a <= 0.01 || r <= 1) return;
  c.save(); c.globalAlpha *= a;
  glow(c, x, y, r * 2.6, '#ff1040', 0.8);
  circle(c, x, y, r, '#0c0612', { stroke: '#ff2a4a', lw: Math.max(4, r * 0.08) });
  c.save(); c.beginPath(); c.arc(x, y, r * 0.95, 0, TAU); c.clip();
  c.strokeStyle = '#7a1aa8'; c.lineWidth = r * 0.08;
  for (let k = 0; k < 3; k++) { c.beginPath(); c.arc(x, y, r * (0.35 + k * 0.2), t * (3 - k) + k, t * (3 - k) + k + 2.2); c.stroke(); }
  c.restore();
  for (let i = 0; i < 10; i++) { const an = i / 10 * TAU + t * 2; line(c, [[x + Math.cos(an) * r * 1.05, y + Math.sin(an) * r * 1.05], [x + Math.cos(an + 0.2) * r * 1.35, y + Math.sin(an + 0.2) * r * 1.35]], '#ff4a6a', 4, 0.8); }
  c.restore();
}
// Escudo dourado em domo com padrão hexagonal e ondulação de impacto
export function escudo(c, x, y, r, t, a = 1, hitT = 99, hitAng = Math.PI) {
  if (a <= 0.01) return;
  const rr = r * easeOut(clamp(a));
  c.save(); c.globalAlpha *= clamp(a);
  c.beginPath(); c.ellipse(x, y, rr, rr * 1.05, 0, Math.PI, TAU); c.closePath();
  c.fillStyle = 'rgba(255,200,80,0.18)'; c.fill();
  c.save(); c.clip();
  c.strokeStyle = 'rgba(255,230,150,0.55)'; c.lineWidth = 3;
  const hs = 36;
  for (let gy = y - rr; gy < y; gy += hs * 0.87) for (let gx = x - rr, k = 0; gx < x + rr + hs; gx += hs * 1.5, k++) {
    const ox = (Math.round((gy - y) / (hs * 0.87)) % 2) * hs * 0.75;
    c.beginPath(); for (let i = 0; i <= 6; i++) { const an = i / 6 * TAU; c.lineTo(gx + ox + Math.cos(an) * hs * 0.5, gy + Math.sin(an) * hs * 0.5); } c.stroke();
  }
  if (hitT >= 0 && hitT < 1.2) {
    const hx = x + Math.cos(hitAng) * rr * 0.95, hy = y + Math.sin(hitAng) * rr * 0.95;
    for (let k = 0; k < 3; k++) { const R = (hitT * 3 - k * 0.25) * rr * 0.6; if (R > 0) { c.strokeStyle = `rgba(255,255,220,${Math.max(0, 1 - hitT) * 0.9})`; c.lineWidth = 10; c.beginPath(); c.arc(hx, hy, R, 0, TAU); c.stroke(); } }
  }
  c.restore();
  c.lineWidth = 10; c.strokeStyle = '#ffd860'; c.beginPath(); c.ellipse(x, y, rr, rr * 1.05, 0, Math.PI, TAU); c.stroke();
  c.lineWidth = 4; c.strokeStyle = '#fff6c8'; c.stroke();
  glow(c, x, y - rr * 0.5, rr * 1.2, '#ffc040', 0.35 + (hitT < 0.6 && hitT >= 0 ? (0.6 - hitT) : 0));
  c.restore();
}
// Portal roxo em espiral
export function portal(c, x, y, rx, ry, t, a = 1) {
  if (a <= 0.01) return;
  const k = easeOut(clamp(a)); rx *= k; ry *= k;
  c.save();
  glow(c, x, y, Math.max(rx, ry) * 2, '#a040ff', 0.7 * a);
  c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, TAU); c.fillStyle = '#1a0630'; c.fill();
  c.save(); c.clip();
  for (let i = 0; i < 9; i++) {
    c.strokeStyle = i % 2 ? '#c070ff' : '#6a20c0'; c.lineWidth = 10; c.beginPath();
    for (let j = 0; j <= 40; j++) { const u = j / 40, an = u * 5 + i / 9 * TAU - t * 3, R = (1 - u) * 1.1; c.lineTo(x + Math.cos(an) * rx * R, y + Math.sin(an) * ry * R); }
    c.stroke();
  }
  glow(c, x, y, Math.min(rx, ry) * 0.8, '#ffffff', 0.6);
  c.restore();
  c.lineWidth = 12; c.strokeStyle = '#e0b0ff'; c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, TAU); c.stroke();
  c.lineWidth = 6; c.strokeStyle = OUT; c.beginPath(); c.ellipse(x, y, rx + 9, ry + 9, 0, 0, TAU); c.stroke();
  aura(c, x, y + ry * 0.3, Math.max(rx, ry) * 1.2, '#d090ff', t, a, 16, 4);
  c.restore();
}
// Onda de energia (crescentes que avançam na direção ang)
export function onda(c, x, y, ang, dt, alcance, color = '#58b4ff', a = 1) {
  if (dt <= 0 || dt > 1.6) return;
  const fade = 1 - sstep(1.0, 1.6, dt);
  c.save(); c.translate(x, y); c.rotate(ang);
  for (let k = 0; k < 4; k++) {
    const u = clamp(dt * 1.4 - k * 0.12); if (u <= 0) continue;
    const d = easeOut(u) * alcance, R = 80 + d * 0.55;
    c.globalAlpha = a * fade * (1 - k * 0.2);
    glow(c, d, 0, R * 1.2, color, 0.5);
    c.lineCap = 'round';
    c.strokeStyle = OUT; c.lineWidth = 30; c.beginPath(); c.arc(d - R, 0, R, -0.9, 0.9); c.stroke();
    c.strokeStyle = color; c.lineWidth = 22; c.beginPath(); c.arc(d - R, 0, R, -0.9, 0.9); c.stroke();
    c.strokeStyle = '#ffffff'; c.lineWidth = 8; c.beginPath(); c.arc(d - R, 0, R, -0.7, 0.7); c.stroke();
  }
  c.globalAlpha = a * fade;
  for (let i = 0; i < 18; i++) { const s = S200[i], d = (dt * 1.4 - s[0] * 0.3) * alcance; if (d > 0) line(c, [[d - 160, (s[1] - 0.5) * 220], [d - 40, (s[1] - 0.5) * 200]], '#cfe8ff', 5, 0.7); }
  c.restore();
}
// Raio em zigue-zague
export function raio(c, x0, y0, x1, y1, seed, a = 1, color = '#cfe4ff') {
  if (a <= 0.01) return;
  const r = rng(seed), pts = [[x0, y0]], n = 10;
  for (let i = 1; i < n; i++) { const u = i / n; pts.push([lerp(x0, x1, u) + (r() - 0.5) * 120, lerp(y0, y1, u) + (r() - 0.5) * 30]); }
  pts.push([x1, y1]);
  c.save(); c.globalAlpha *= a;
  line(c, pts, color, 22, 0.35); line(c, pts, color, 12); line(c, pts, '#ffffff', 5);
  const b = pts[4], b2 = [b[0] + (r() - 0.5) * 300, b[1] + 200]; line(c, [b, [lerp(b[0], b2[0], 0.5) + 40, lerp(b[1], b2[1], 0.5)], b2], color, 6);
  glow(c, x1, y1, 160, color, 0.8);
  c.restore();
}
export const flashRaio = dt => (dt > 0 && dt < 0.35 ? (dt < 0.07 ? 1 : dt < 0.13 ? 0.25 : dt < 0.2 ? 1 : 1 - (dt - 0.2) / 0.15) : 0);
// Explosão cartoon: estrela de impacto + nuvens de fumaça + faíscas
export function explosao(c, x, y, s, dt, cores = ['#fff3b0', '#ffb340', '#ff5a2a'], { fumaca: comFumaca = true } = {}) {
  if (dt <= 0 || dt > 2.2) return;
  const u = clamp(dt / 0.35), fade = 1 - sstep(1.2, 2.2, dt);
  c.save();
  // fumaça
  if (comFumaca) for (let i = 0; i < 8; i++) { const an = i / 8 * TAU + 0.3, d = s * (0.4 + easeOut(clamp(dt / 1.2)) * 0.9); c.globalAlpha = fade * 0.9; cloud(c, x + Math.cos(an) * d, y + Math.sin(an) * d * 0.6 - dt * 40, s * 0.32, '#5a5060', { stroke: OUT, seed: i + 3 }); }
  c.globalAlpha = 1;
  if (dt < 0.6) {
    const k = easeOut(u) * (1 - sstep(0.35, 0.6, dt) * 0.5), R = s * 1.1 * k;
    shape(c, c => { for (let i = 0; i <= 24; i++) { const an = i / 24 * TAU, rr = i % 2 ? R * 0.55 : R; c.lineTo(x + Math.cos(an) * rr, y + Math.sin(an) * rr); } c.closePath(); }, cores[2]);
    shape(c, c => { for (let i = 0; i <= 20; i++) { const an = i / 20 * TAU + 0.2, rr = i % 2 ? R * 0.4 : R * 0.75; c.lineTo(x + Math.cos(an) * rr, y + Math.sin(an) * rr); } c.closePath(); }, cores[1], { lw: 4 });
    circle(c, x, y, R * 0.32, cores[0], { lw: 4 });
  }
  glow(c, x, y, s * 2.4, cores[1], Math.exp(-dt * 3));
  for (let i = 0; i < 16; i++) { const sd = S200[i + 40], an = sd[0] * TAU, d = s * (0.4 + sd[1] * 1.4) * easeOut(clamp(dt / 0.9)); sparkle(c, x + Math.cos(an) * d, y + Math.sin(an) * d - dt * dt * 60, 10 + sd[2] * 12, cores[0], fade * (1 - dt / 2.2)); }
  c.restore();
}
// Energia vermelha saindo do livro (espirais + fumaça + runas)
export function energiaVermelha(c, x, y, t, a = 1, h = 700) {
  if (a <= 0.01) return;
  c.save();
  glow(c, x, y - h * 0.3, h * 0.9, '#ff2010', 0.6 * a);
  fumaca(c, x, y - 20, h * 0.35, t * 1.5, a, '#1a0004', 9);
  for (let k = 0; k < 5; k++) {
    c.globalAlpha = a * 0.9; c.strokeStyle = k % 2 ? '#ff3a2a' : '#ff8a6a'; c.lineWidth = 14 - k * 2; c.lineCap = 'round'; c.beginPath();
    for (let j = 0; j <= 40; j++) { const u = j / 40, an = u * 9 + k * 1.3 + t * 4, R = 40 + u * 170; c.lineTo(x + Math.cos(an) * R * (0.4 + 0.6 * u), y - u * h * clamp(a * 1.4)); }
    c.stroke();
  }
  for (let i = 0; i < 10; i++) { const s = S200[i + 90], life = (t * (0.3 + s[3] * 0.3) + s[4]) % 1; rune(c, x + (s[0] - 0.5) * 300, y - life * h, 14, 60 + i, '#ff4a3a', a * Math.sin(life * Math.PI)); }
  c.restore();
}
// Poeira/estrelinhas flutuando (ambiente)
export function poeira(c, x0, y0, w, h, t, color = '#ffffff', a = 0.8, n = 40, seed = 5) {
  for (let i = 0; i < n; i++) { const s = S200[(i + seed * 7) % 200]; const px = x0 + s[0] * w + Math.sin(t * 0.5 + s[3] * 6) * 20, py = y0 + ((s[1] * h - t * 20 * (0.3 + s[2])) % h + h) % h; sparkle(c, px, py, 3 + s[2] * 7, color, a * (0.4 + 0.6 * Math.abs(Math.sin(t * (1 + s[4]) + i)))); }
}
// Feixe de energia entre dois pontos (tremulante)
export function feixe(c, x0, y0, x1, y1, color, a, t, w = 40) {
  if (a <= 0.01) return;
  const n = 14, pts = [];
  for (let i = 0; i <= n; i++) { const u = i / n, off = Math.sin(u * 20 - t * 30) * 10 * Math.sin(u * Math.PI); const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy); pts.push([x0 + dx * u - dy / L * off, y0 + dy * u + dx / L * off]); }
  c.save(); c.globalAlpha *= a;
  for (let i = 0; i <= n; i += 2) glow(c, pts[i][0], pts[i][1], w * 2.5, color, 0.5);
  c.lineCap = 'round'; c.lineJoin = 'round';
  c.beginPath(); pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y))); c.strokeStyle = color; c.lineWidth = w; c.stroke();
  c.beginPath(); pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y))); c.strokeStyle = '#ffffff'; c.lineWidth = w * 0.35; c.stroke();
  glow(c, x1, y1, w * 5, color, 0.9); glow(c, x0, y0, w * 2.5, color, 0.8);
  c.restore();
}
// Correntes de luz em anel (selo)
export function correntes(c, x, y, rx, ry, t, a, color = '#9fe8ff', voltas = 3) {
  if (a <= 0.01) return;
  c.save(); c.globalAlpha *= a;
  for (let k = 0; k < voltas; k++) {
    const yy = y + (k - (voltas - 1) / 2) * ry * 0.7, rot = t * (1.5 + k * 0.4) * (k % 2 ? -1 : 1);
    for (let i = 0; i < 22; i++) {
      const an = i / 22 * TAU + rot, px = x + Math.cos(an) * rx, py = yy + Math.sin(an) * ry * 0.25;
      if (Math.sin(an) < -0.2) continue;
      c.save(); c.translate(px, py); c.rotate(an + Math.PI / 2);
      ellipse(c, 0, 0, 20, 11, null, { stroke: '#2b1f2a', lw: 10 }); ellipse(c, 0, 0, 20, 11, null, { stroke: color, lw: 6 });
      c.restore();
    }
    glow(c, x, yy, rx * 1.1, color, 0.3);
  }
  c.restore();
}

// Páginas se soltando e voando em espiral (viram brilho)
export function paginasVoando(c, x, y, dt, n = 40, alcance = 900) {
  if (dt <= 0 || dt > 5) return;
  for (let i = 0; i < n; i++) {
    const s = S200[(i + 120) % 200], u = clamp(dt / (2.5 + s[3] * 2));
    const an = s[0] * TAU + dt * (1 + s[1]) * (s[2] > 0.5 ? 1 : -1), d = easeOut(u) * alcance * (0.4 + s[1] * 0.6);
    const px = x + Math.cos(an) * d, py = y + Math.sin(an) * d * 0.5 - u * 500 * (0.5 + s[4]);
    const a = 1 - sstep(0.6, 1, u);
    if (u < 0.75) { c.save(); c.globalAlpha *= a; c.translate(px, py); c.rotate(dt * 4 * (s[2] - 0.5) + i); c.scale(1, Math.abs(Math.sin(dt * 5 + i)) * 0.8 + 0.2); shape(c, c => c.rect(-26, -34, 52, 68), '#fff3d8', { lw: 4 }); c.restore(); }
    sparkle(c, px, py, 12 + s[2] * 10, '#fff6c8', sstep(0.4, 0.8, u) * a + 0.2 * a);
  }
}
