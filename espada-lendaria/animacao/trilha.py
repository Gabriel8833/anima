#!/usr/bin/env python3
"""Trilha sonora sintetizada (música + efeitos) e mixagem com a narração.

Uso: python3 trilha.py <pasta_build>
Lê <pasta>/narracao.wav e events.json; grava <pasta>/trilha.wav (48 kHz estéreo).
"""
import json, os, sys, wave
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve

B = sys.argv[1] if len(sys.argv) > 1 else "build"
EV = json.load(open(os.path.join(os.path.dirname(__file__), "events.json")))
SR = 48000
TOTAL = 45.0
N = int(TOTAL * SR)
rng = np.random.default_rng(7)
t_all = np.arange(N) / SR


def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], btype="band", fs=SR, output="sos"), x)


def lp(x, f, order=2):
    return sosfilt(butter(order, f, btype="low", fs=SR, output="sos"), x)


def hp(x, f, order=2):
    return sosfilt(butter(order, f, btype="high", fs=SR, output="sos"), x)


def env_ad(n, a, d):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(a, 1e-4)) * np.exp(-np.maximum(0, t - a) / d)


def add(track, sig, at, gain=1.0):
    i = int(at * SR)
    if i >= len(track):
        return
    n = min(len(sig), len(track) - i)
    if sig.ndim == 1 and track.ndim == 2:
        sig = np.stack([sig, sig], 1)
    track[i:i + n] += sig[:n] * gain


def saw(f, t):
    return 2 * ((f * t) % 1) - 1


def curve(t, keys):
    ks = np.array(keys)
    return np.interp(t, ks[:, 0], ks[:, 1])


def reverb(x, secs=2.2, wet=0.3, damp=4000):
    n = int(secs * SR)
    ir = rng.standard_normal(n) * np.exp(-np.arange(n) / SR * 6.9 / secs)
    ir = lp(ir, damp)
    ir /= np.sqrt(np.sum(ir ** 2))
    return x * (1 - wet) + fftconvolve(x, ir)[:len(x)] * wet * 1.4


music = np.zeros(N)
sfx = np.zeros(N)

# ---------- Música ----------
D2 = 73.42
def note(semi, base=D2):
    return base * 2 ** (semi / 12)

# drone grave misterioso (Ré) ao longo do vídeo, com sobe-e-desce por cena
drone_amp = curve(t_all, [(0, 0), (0.6, 0.25), (6, 0.35), (13, 0.4), (21, 0.45), (28.8, 0.5), (29.0, 0), (30.0, 0),
                          (31, 0.25), (36, 0.5), (39, 0.45), (44.55, 0.6), (44.6, 0), (45, 0)])
drone = np.zeros(N)
for semi, g in [(0, 1), (7, 0.6), (12, 0.45), (-12, 0.5)]:
    f = note(semi)
    for det in (-0.12, 0.12):
        drone += saw(f * 2 ** (det / 12), t_all + rng.random()) * g
cut = 300 + 500 * (0.5 + 0.5 * np.sin(t_all * 0.4))
drone = lp(drone, 700) * 0.12
music += drone * drone_amp

# trompa grave na abertura
horn_t = np.arange(int(2.8 * SR)) / SR
horn = sum(saw(note(s) * (1 + 0.003 * np.sin(horn_t * 30)), horn_t) * g for s, g in [(0, 1), (7, 0.7), (12, 0.4)])
horn = lp(horn, 900) * np.minimum(1, horn_t / 0.35) * np.exp(-np.maximum(0, horn_t - 1.6) / 0.7)
add(music, horn * 0.25, 0.05)


def choir(dur, chord, amp, vib=5.0, bright=1.0):
    tt = np.arange(int(dur * SR)) / SR
    sig = np.zeros_like(tt)
    for s in chord:
        f = note(s, base=146.83)
        for v in range(3):
            fv = f * (1 + 0.004 * np.sin(2 * np.pi * vib * tt + v * 2.1)) * 2 ** ((v - 1) * 0.08 / 12)
            sig += saw(fv, tt + v * 0.13)
    # formantes de "ah"
    out = bp(sig, 600, 900) * 1.0 + bp(sig, 1000, 1400) * 0.6 * bright + bp(sig, 2400, 2900) * 0.25 * bright
    return out * amp


# coro suave na cena 3
c3 = choir(8.0, [0, 3, 7], 0.08)
c3 *= np.minimum(1, np.arange(len(c3)) / SR / 2.0) * np.minimum(1, (len(c3) - np.arange(len(c3))) / SR / 0.05)
add(music, c3, 13.0)
# percussão tensa (cenas 2 e 4)
for k, tt in enumerate(np.arange(6.5, 12.8, 0.75)):
    n = int(0.5 * SR); x = np.arange(n) / SR
    add(music, np.sin(2 * np.pi * (60 - 20 * x) * x) * np.exp(-x * 9) * 0.35, tt)
for tt in np.arange(21.2, 28.6, 0.5):
    n = int(0.5 * SR); x = np.arange(n) / SR
    hit = np.sin(2 * np.pi * (70 - 30 * x) * x) * np.exp(-x * 10) + lp(rng.standard_normal(n), 1500) * np.exp(-x * 25) * 0.4
    add(music, hit * 0.4, tt)
# zumbido mágico (cena 5)
hum_d = EV["burst"] - 30.0
ht = np.arange(int(hum_d * SR)) / SR
rise = (ht / hum_d) ** 2
hum = sum(np.sin(2 * np.pi * f * (1 + 0.4 * rise) * ht) * g for f, g in [(220, 1), (330, 0.6), (440, 0.4), (660, 0.25), (880, 0.18)])
hum *= (0.15 + 0.85 * rise) * (1 + 0.3 * np.sin(2 * np.pi * (3 + 9 * rise) * ht))
add(music, hum * 0.07, 30.0)
# coro épico na explosão
epic = choir(3.2, [0, 7, 12, 15, 19], 0.22, bright=1.3)
et = np.arange(len(epic)) / SR
epic *= np.minimum(1, et / 0.08) * np.minimum(1, (len(epic) - np.arange(len(epic))) / SR / 0.5)
add(music, epic, EV["burst"])
br = choir(2.6, [-2, 5, 10, 14], 0.16, bright=1.2)
add(music, br * np.minimum(1, (len(br) - np.arange(len(br))) / SR / 0.4), EV["burst"] + 1.4)
# acorde sustentado no gancho
hold = choir(5.4, [-12, -5, 0, 3], 0.12, vib=3.0, bright=0.6)
ht2 = np.arange(len(hold)) / SR
hold *= np.minimum(1, ht2 / 1.5)
add(music, hold, 39.2)

# ---------- Efeitos ----------
def noise(d):
    return rng.standard_normal(int(d * SR))

# vento contínuo na cena 1
w = lp(noise(6.2), 600) * (0.6 + 0.4 * np.sin(np.arange(int(6.2 * SR)) / SR * 1.3))
add(sfx, w * 0.12, 0)
# passos do exército
for k, tt in enumerate(np.arange(0.2, 6.0, 0.5)):
    n = int(0.25 * SR); x = np.arange(n) / SR
    step = lp(rng.standard_normal(n), 400) * np.exp(-x * 30) * 1.5 + np.sin(2 * np.pi * 55 * x) * np.exp(-x * 25)
    jingle = sum(np.sin(2 * np.pi * f * x) for f in (2900, 3700, 5100)) * np.exp(-x * 18) * 0.05
    add(sfx, step * 0.22 + jingle, tt + rng.random() * 0.03)
# floresta: folhas, galhos, grunhidos
fd = 15.0
leaves = hp(noise(fd), 2500) * (0.3 + 0.7 * np.clip(lp(rng.standard_normal(int(fd * SR)), 2) * 40, 0, 1))
add(sfx, leaves * 0.05, 6.0)
for tt in [7.1, 8.6, 9.9, 11.3, 12.4, 14.8, 18.9]:
    n = int(0.08 * SR); x = np.arange(n) / SR
    add(sfx, hp(rng.standard_normal(n), 1500) * np.exp(-x * 60) * 0.35, tt)


def roar(dur, f0, f1, amp, rough=1.0):
    n = int(dur * SR); x = np.arange(n) / SR
    f = np.linspace(f0, f1, n)
    ph = 2 * np.pi * np.cumsum(f) / SR
    tone = saw(1, ph / (2 * np.pi)) * (1 + rough * 0.6 * np.sin(2 * np.pi * 31 * x))
    nz = bp(rng.standard_normal(n), 120, 900) * rough
    e = np.minimum(1, x / 0.15) * np.minimum(1, (n - np.arange(n)) / SR / (dur * 0.5))
    return lp(tone * 0.6 + nz, 1200) * e * amp


for tt in [8.2, 10.1, 11.6]:
    add(sfx, lp(roar(1.2, 70, 50, 0.25), 500), tt)
# passos de Arthur e respiração
for tt in np.arange(13.25, 21.0, 0.555):
    n = int(0.15 * SR); x = np.arange(n) / SR
    add(sfx, lp(rng.standard_normal(n), 900) * np.exp(-x * 40) * 0.25, tt)
for tt in np.arange(13.4, 21.0, 1.6):
    n = int(1.2 * SR); x = np.arange(n) / SR
    add(sfx, bp(rng.standard_normal(n), 900, 2500) * np.sin(np.pi * x / 1.2) ** 2 * 0.06, tt)
# cena 4: rugido, passos pesados, aço, impactos
add(sfx, roar(1.6, 55, 42, 0.5), EV["growl"])
n = int(0.6 * SR); x = np.arange(n) / SR
add(sfx, np.sin(2 * np.pi * (900 + 600 * x) * x) * np.exp(-x * 5) * 0.08, EV["eyeOn"])
for tt in EV["knightSteps"]:
    n = int(0.6 * SR); x = np.arange(n) / SR
    add(sfx, (np.sin(2 * np.pi * 45 * x) * np.exp(-x * 9) + lp(rng.standard_normal(n), 300) * np.exp(-x * 20)) * 0.6, tt)


def whoosh(dur, amp, lo=300, hi=2500):
    n = int(dur * SR); x = np.arange(n) / SR
    return bp(rng.standard_normal(n), lo, hi) * np.sin(np.pi * x / dur) ** 2 * amp


def clash(amp):
    n = int(1.6 * SR); x = np.arange(n) / SR
    s = sum(np.sin(2 * np.pi * f * x + rng.random() * 6) * np.exp(-x * d) for f, d in
            [(1240, 3), (1873, 4), (2541, 5), (3417, 6), (4790, 8), (6120, 10)])
    s += hp(rng.standard_normal(n), 2000) * np.exp(-x * 40) * 2
    return s * amp


def impact(amp, dur=1.5):
    n = int(dur * SR); x = np.arange(n) / SR
    sub = np.sin(2 * np.pi * (70 * np.exp(-x * 3) + 28) * x) * np.exp(-x * 3)
    crack = lp(rng.standard_normal(n), 2500) * np.exp(-x * 12)
    return (sub * 1.2 + crack * 0.8) * amp


add(sfx, whoosh(0.4, 0.5), EV["swing"])
add(sfx, clash(0.35), EV["clash"])
add(sfx, whoosh(0.35, 0.45), EV["slam"] - 0.3)
add(sfx, impact(0.9), EV["slam"])
add(sfx, whoosh(0.6, 0.25, 200, 1200), EV["roll"])
add(sfx, impact(0.8), EV["crash"])
add(sfx, clash(0.15), EV["crash"] + 0.03)
add(sfx, roar(1.4, 65, 35, 0.7, 1.4), EV["roar"])
add(sfx, whoosh(1.5, 0.3, 150, 900), EV["dissolve"])
# cortes com "swish"
for c in EV["cuts"]:
    add(sfx, whoosh(0.3, 0.12, 800, 5000), c - 0.15)
# cena 5: pedra raspando, explosão
n = int(1.4 * SR); x = np.arange(n) / SR
scrape = bp(rng.standard_normal(n), 200, 1800) * (0.4 + 0.6 * np.abs(np.sin(2 * np.pi * 7 * x))) * np.minimum(1, x / 0.3)
add(sfx, scrape * 0.15, EV["pull"])
n = int(3.5 * SR); x = np.arange(n) / SR
boom = lp(rng.standard_normal(n), 3000) * np.exp(-x * 2.2) * 0.9 + np.sin(2 * np.pi * (90 * np.exp(-x * 2) + 25) * x) * np.exp(-x * 1.2) * 1.4
shimmer = sum(np.sin(2 * np.pi * f * x) for f in (1760, 2217, 2637, 3520)) * np.exp(-x * 1.0) * 0.06
add(sfx, boom * 0.8 + shimmer, EV["burst"])
# cena 6: batimentos, rugido distante
beat_t = 39.3
period = 0.95
while beat_t < EV["end"] - 0.1:
    for off, g in ((0, 1.0), (0.24, 0.7)):
        n = int(0.35 * SR); x = np.arange(n) / SR
        add(sfx, np.sin(2 * np.pi * (52 - 12 * x) * x) * np.exp(-x * 14) * 0.9 * g, beat_t + off)
    beat_t += period
    period = max(0.62, period * 0.94)
add(sfx, lp(roar(2.6, 48, 30, 0.6, 1.2), 400), EV["eyesOpen"])

# ---------- Mixagem ----------
with wave.open(os.path.join(B, "narracao.wav")) as wv:
    narr = np.frombuffer(wv.readframes(wv.getnframes()), dtype=np.int16).astype(np.float64) / 32768
narr = np.pad(narr, (0, max(0, N - len(narr))))[:N]
narr = reverb(narr, 1.4, 0.18, 5000)
# ducking da música e dos efeitos sob a voz
envn = lp(np.abs(narr), 8)
duck = 1 - 0.55 * np.clip(envn / (envn.max() * 0.25 + 1e-9), 0, 1)
music_w = reverb(music, 2.8, 0.35)
sfx_w = reverb(sfx, 1.6, 0.18)
# silêncio de 1 s antes da cena 5 e corte seco no fim
gate = np.ones(N)
gate[(t_all >= 29.0) & (t_all < 30.0)] = 0.0
gate[t_all >= EV["end"]] = 0.0
ramp = int(0.03 * SR)
i29 = int(29.0 * SR); gate[i29 - ramp:i29] = np.linspace(1, 0, ramp)
bed = (music_w * 0.9 + sfx_w) * duck * gate
L = bed * 0.95 + narr * 1.15
R = bed * 0.95 + narr * 1.15
# leve espacialização dos efeitos (atraso no canal direito)
d = int(0.012 * SR)
R[d:] = R[d:] * 0.85 + np.concatenate([np.zeros(0), bed[:-d]])[: N - d] * 0.12
mix = np.stack([L, R], 1)
mix = np.tanh(mix * 1.1) / np.tanh(1.1)
mix *= 0.95 / np.max(np.abs(mix))
mix[t_all >= EV["end"]] = 0
with wave.open(os.path.join(B, "trilha.wav"), "wb") as wv:
    wv.setnchannels(2); wv.setsampwidth(2); wv.setframerate(SR)
    wv.writeframes((mix * 32767).astype(np.int16).tobytes())
print("ok", mix.shape)
