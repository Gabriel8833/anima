#!/usr/bin/env python3
"""Gera a narração-guia (voz sintética pt-BR) e a linha do tempo das falas.

Uso: python3 narracao.py <pasta_saida>
Saída: <pasta>/narracao.wav (48 kHz mono) e <pasta>/timeline.json

Requer: espeak-ng + mbrola-br3, ffmpeg, numpy.
"""
import json, os, subprocess, sys, wave
import numpy as np

OUT = sys.argv[1] if len(sys.argv) > 1 else "build"
os.makedirs(OUT, exist_ok=True)
SR = 48000
TOTAL = 45.0

VOICE = "mb-br3"      # masculina, pt-BR
SPEED = 138           # palavras/min antes do ajuste fino
PITCH = 22            # 0-99 (grave)
PITCH_SHIFT = 0.90    # <1 deixa a voz mais grave

# Cada cena: (início, fim máximo, [alinhamento], [blocos]); "fim" encosta a fala no fim da janela
# (na cena 5, para que haja exatamente 1 s de silêncio antes de "digno").
# Um bloco é ("id", "texto") ou ("pausa", segundos)
SCENES = [
    (0.25, 5.85, [("s1a", "Há mil anos, uma espada lendária desapareceu"), ("pausa", 0.5),
                  ("s1b", "e todos os reinos queriam encontrá-la.")]),
    (6.20, 12.80, [("s2a", "Diziam que seu poder poderia transformar qualquer homem no senhor de todos os reinos.")]),
    (13.20, 20.80, [("s3a", "Mas enquanto os maiores guerreiros fracassavam"), ("pausa", 0.5),
                    ("s3b", "um simples camponês decidiu tentar.")]),
    (21.25, 28.60, [("s4a", "Depois de enfrentar o guardião da floresta, ele finalmente encontrou a espada.")]),
    (30.00, 35.00, "fim", [("s5a", "Mas a espada não escolhia o mais forte"), ("pausa", 0.5),
                    ("s5b", "ela escolhia aquele que era")]),
    (36.00, 37.20, [("s5c", "digno.")]),
    (39.15, 44.45, [("s6a", "O que Arthur não sabia"), ("pausa", 0.5),
                    ("s6b", "era que retirar aquela espada havia despertado algo que deveria permanecer adormecido.")]),
]


def run(cmd):
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def read_wav(path):
    with wave.open(path) as w:
        data = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
        return data, w.getframerate()


def trim(x, thr=0.01):
    idx = np.where(np.abs(x) > thr)[0]
    if len(idx) == 0:
        return x
    a = max(0, idx[0] - int(0.01 * SR))
    b = min(len(x), idx[-1] + int(0.04 * SR))
    return x[a:b]


def synth(cid, text, tempo):
    raw = os.path.join(OUT, f"{cid}_raw.wav")
    proc = os.path.join(OUT, f"{cid}.wav")
    run(["espeak-ng", "-v", VOICE, "-s", str(SPEED), "-p", str(PITCH), "-w", raw, text])
    # Voz mais grave (asetrate) mantendo o andamento (atempo), com EQ de "voz de trailer".
    at = tempo / PITCH_SHIFT
    af = (f"aresample={SR},asetrate={int(SR * PITCH_SHIFT)},aresample={SR},atempo={at:.4f},"
          "highpass=f=60,equalizer=f=140:t=q:w=1.2:g=5,equalizer=f=2800:t=q:w=1:g=3,"
          "equalizer=f=6500:t=q:w=1:g=-4,acompressor=threshold=-20dB:ratio=4:attack=5:release=80")
    run(["ffmpeg", "-y", "-i", raw, "-af", af, "-ac", "1", "-ar", str(SR), proc])
    x, _ = read_wav(proc)
    return trim(x)


track = np.zeros(int(TOTAL * SR), dtype=np.float32)
timeline = []
for scene in SCENES:
    start, end, blocks = scene[0], scene[1], scene[-1]
    align = scene[2] if len(scene) == 4 else "inicio"
    speech = [b for b in blocks if b[0] != "pausa"]
    pauses = sum(b[1] for b in blocks if b[0] == "pausa")
    clips = {cid: synth(cid, txt, 1.0) for cid, txt in speech}
    need = sum(len(c) for c in clips.values()) / SR
    avail = end - start - pauses
    tempo = 1.0
    if need > avail:
        tempo = min(1.45, need / avail * 1.01)
        clips = {cid: synth(cid, txt, tempo) for cid, txt in speech}
    t = start
    if align == "fim":
        t = max(start, end - pauses - sum(len(c) for c in clips.values()) / SR)
    for b in blocks:
        if b[0] == "pausa":
            t += b[1]
            continue
        cid, txt = b
        c = clips[cid]
        i = int(t * SR)
        n = min(len(c), len(track) - i)
        track[i:i + n] += c[:n]
        timeline.append({"id": cid, "text": txt, "start": round(t, 3), "end": round(t + n / SR, 3),
                         "tempo": round(tempo, 3)})
        t += n / SR

peak = np.max(np.abs(track)) or 1
track = track / peak * 0.89
with wave.open(os.path.join(OUT, "narracao.wav"), "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((track * 32767).astype(np.int16).tobytes())
with open(os.path.join(OUT, "timeline.json"), "w") as f:
    json.dump(timeline, f, ensure_ascii=False, indent=1)
for e in timeline:
    print(f'{e["start"]:6.2f}-{e["end"]:6.2f} x{e["tempo"]}  {e["text"]}')
