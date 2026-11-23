// Motor 2D — matemática, curvas de animação e números aleatórios determinísticos.
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, u) => a + (b - a) * u;
export const sstep = (a, b, x) => { const u = clamp((x - a) / (b - a)); return u * u * (3 - 2 * u); };
export const win = (x, a, b, c, d) => sstep(a, b, x) * (1 - sstep(c, d, x)); // sobe em [a,b], desce em [c,d]
export const easeInOut = u => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
export const easeOut = u => 1 - Math.pow(1 - u, 3);
export const easeIn = u => u * u * u;
export const linear = u => u;
// "salto" elástico para entradas cartunescas
export const easeBack = u => { const c = 1.9; return 1 + (c + 1) * Math.pow(u - 1, 3) + c * Math.pow(u - 1, 2); };
export const TAU = Math.PI * 2;

// Keyframes: kf(t, [[t0, v0], [t1, v1], ...]); v pode ser número ou array.
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
// lista fixa de sementes [0..1) para partículas
export const seeds = (n, seed = 1, k = 5) => { const r = rng(seed); return Array.from({ length: n }, () => Array.from({ length: k }, r)); };
export function noise1(x) { const i = Math.floor(x), f = x - i; const h = n => { const s = Math.sin(n * 127.1) * 43758.5453; return s - Math.floor(s); }; const u = f * f * (3 - 2 * f); return lerp(h(i), h(i + 1), u) * 2 - 1; }
export const shake = (t, amp, f = 22) => [amp * (Math.sin(t * f) * 0.6 + Math.sin(t * f * 2.3 + 1.3) * 0.4), amp * (Math.sin(t * f * 1.17 + 2.1) * 0.6 + Math.sin(t * f * 2.7 + 0.4) * 0.4)];
export const impulse = (t, te, amp, dur = 0.5) => (t > te ? amp * Math.exp(-(t - te) / dur * 3) : 0);

// cores (aceita #rgb e #rrggbb)
const full = h => (h.length === 4 ? '#' + h[1] + h[1] + h[2] + h[2] + h[3] + h[3] : h);
export function mix(c1, c2, u) {
  c1 = full(c1); c2 = full(c2);
  const p = c => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
  const a = p(c1), b = p(c2);
  return '#' + a.map((v, i) => Math.round(lerp(v, b[i], u)).toString(16).padStart(2, '0')).join('');
}
export const rgba = (hex, a) => (hex = full(hex), `rgba(${parseInt(hex.slice(1, 3), 16)},${parseInt(hex.slice(3, 5), 16)},${parseInt(hex.slice(5, 7), 16)},${a})`);
