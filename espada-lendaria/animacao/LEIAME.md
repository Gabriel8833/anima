# Animação — como gerar o vídeo

Tudo é procedural: cenários, personagens, câmeras, partículas, legendas, música e efeitos são gerados por código.
Não há imagens nem sons externos.

| Arquivo | O que faz |
|---|---|
| `narracao.py` | Gera a narração-guia (voz sintética pt-BR via espeak-ng + MBROLA br3), com as pausas de 0,5 s e 1 s, e grava `build/timeline.json` com o tempo de cada fala |
| `events.json` | Momentos-chave (cortes, golpes, explosão…) compartilhados entre a imagem e o som |
| `lib.js` | Utilitários, personagens (Arthur, soldados, cavaleiro) e a espada Excalion |
| `world.js` | Cenários: reino de Eldoria, floresta, clareira do altar, cume com as montanhas e a sombra |
| `main.js` | As 6 cenas, câmeras, transições, vinheta e legendas |
| `render.js` | Renderiza quadro a quadro no Chromium (Playwright) e codifica com ffmpeg |
| `trilha.py` | Sintetiza música e efeitos e mixa com a narração |

## Passo a passo

```bash
# dependências: node 18+, playwright com chromium, ffmpeg, python3 + numpy + scipy, espeak-ng + mbrola-br3
npm install
python3 narracao.py build
node render.js --build build --out build/video_sem_audio.mp4        # ~18 min em CPU
python3 trilha.py build
ffmpeg -i build/video_sem_audio.mp4 -i build/trilha.wav -c:v copy -c:a aac -b:a 192k -shortest ../espada_lendaria.mp4
```

Prévia de quadros soltos (rápido, meia resolução):

```bash
node render.js --build build --preview 3,10,25,36,42 --outdir previews --scale 0.5
```

## Trocar a narração por uma voz gravada

A voz sintética é só uma guia. Para usar uma gravação real, substitua `build/narracao.wav` (48 kHz, mono, 45 s,
com cada fala no tempo de `build/timeline.json`) e rode de novo `trilha.py` e o `ffmpeg` final.
As legendas seguem `timeline.json`; se mudar os tempos das falas, renderize o vídeo de novo.
