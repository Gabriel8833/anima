#!/usr/bin/env python3
"""Gera as legendas do episódio em .srt (frases curtas) a partir de episodios/<ep>/tempos.json.

O vídeo "com legenda" já traz as legendas queimadas palavra por palavra (desenhadas pelo episodio.js);
este .srt serve para importar no seu editor de vídeo.

Uso: python3 legendas.py [ep01] [pasta_saida]

O tempo de cada legenda é distribuído pelo número de letras dentro da janela de cada fala.
Se a narração gravada ficar diferente, ajuste "inicio"/"fim" das falas em tempos.json e rode de novo.
"""
import json, os, re, sys

EP = sys.argv[1] if len(sys.argv) > 1 else "ep01"
OUT = sys.argv[2] if len(sys.argv) > 2 else "build"
BASE = os.path.dirname(os.path.abspath(__file__))
tempos = json.load(open(os.path.join(BASE, "episodios", EP, "tempos.json"), encoding="utf-8"))
os.makedirs(OUT, exist_ok=True)
MAX = 40  # caracteres por legenda (no máximo 2 linhas curtas)


def dividir(frase):
    """Divide uma frase longa em partes de tamanho parecido (sem deixar palavra sozinha)."""
    import math
    palavras = frase.split()
    k = math.ceil(len(frase) / MAX)
    if k <= 1:
        return [frase]
    alvo, out, atual = len(frase) / k, [], ""
    for w in palavras:
        if atual and len(atual) + len(w) / 2 > alvo and len(out) < k - 1:
            out.append(atual); atual = w
        else:
            atual = (atual + " " + w).strip()
    out.append(atual)
    return out


def pedacos(texto):
    frases = [p.strip() for p in re.split(r"(?<=[.,:;?!…])\s+", texto) if p.strip()]
    juntas = []
    for f in frases:  # junta trechos curtos ("Até que,") com o seguinte
        if juntas and len(juntas[-1]) < 14 and len(juntas[-1]) + len(f) + 1 <= MAX + 4:
            juntas[-1] += " " + f
        else:
            juntas.append(f)
    out = []
    for f in juntas:
        out += dividir(f)
    return out


def quebra(s, n=24):
    if len(s) <= n:
        return [s]
    meio = len(s) // 2
    esp = [i for i, c in enumerate(s) if c == " "]
    i = min(esp, key=lambda k: abs(k - meio))
    return [s[:i], s[i + 1:]]


itens = []
for fala in tempos["narracao"]:
    ps = pedacos(fala["texto"])
    total = sum(len(p) for p in ps)
    t = fala["inicio"]
    dur = fala["fim"] - fala["inicio"]
    for p in ps:
        d = dur * len(p) / total
        itens.append((t, t + d - 0.04, p))
        t += d


def srt_t(s):
    ms = int(round(s * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); sec, ms = divmod(ms, 1000)
    return f"{h:02}:{m:02}:{sec:02},{ms:03}"


def ass_t(s):
    cs = int(round(s * 100)); h, cs = divmod(cs, 360000); m, cs = divmod(cs, 6000); sec, cs = divmod(cs, 100)
    return f"{h}:{m:02}:{sec:02}.{cs:02}"


with open(os.path.join(OUT, f"{EP}.srt"), "w", encoding="utf-8") as f:
    for i, (a, b, txt) in enumerate(itens, 1):
        f.write(f"{i}\n{srt_t(a)} --> {srt_t(b)}\n" + "\n".join(quebra(txt)) + "\n\n")

for a, b, txt in itens:
    print(f"{a:6.2f}-{b:6.2f}  {txt}")
