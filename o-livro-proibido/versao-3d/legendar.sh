#!/bin/bash
# Gera a versão com legendas queimadas a partir do vídeo limpo.
# Uso: ./legendar.sh [ep01]
set -e
EP=${1:-ep01}
cd "$(dirname "$0")"
python3 legendas.py "$EP" build > /dev/null
ffmpeg -y -loglevel error -i "build/${EP}_sem_legenda.mp4" -vf "ass=build/${EP}.ass" \
  -c:v libx264 -preset slow -crf 19 -pix_fmt yuv420p -movflags +faststart "build/${EP}_com_legenda.mp4"
echo "pronto: build/${EP}_com_legenda.mp4 e build/${EP}.srt"
