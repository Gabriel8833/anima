# E se você sobrevivesse a uma guerra nuclear?

Vídeo narrado em **2D cartoon pós-apocalíptico** para TikTok e YouTube Shorts: o espectador é o protagonista, do último dia normal
até um sinal misterioso vindo de um abrigo abandonado. Vertical 1080×1920, 30 fps, **86 segundos**, **sem narração e sem som**
(feitos em outro aplicativo). Paleta de laranja, marrom, cinza e amarelo; personagens, cenários e elementos originais.

## Arquivos

| Arquivo | O que é |
|---|---|
| `guerra_nuclear_com_legenda.mp4` | Vídeo com legendas grandes palavra por palavra (no tempo previsto da narração) |
| `guerra_nuclear_sem_legenda.mp4` | O mesmo vídeo limpo |
| `guerra_nuclear.srt` | Legendas em frases curtas para o editor |
| `PROMPT_NARRACAO_E_SOM.md` | Prompt completo de narração, trilha, efeitos e mixagem, com os tempos |
| `projeto/` | Código para editar e renderizar de novo |

## Roteiro animado

| Cena | Tempo | O que acontece |
|---|---|---|
| 1 — O último dia normal | 0–12 s | Título; você se espreguiça, toma café e pega o celular; rua com pedestres, carros e crianças jogando bola; todos os celulares disparam o alerta de emergência e os carros freiam |
| 2 — O primeiro míssil | 12–24 s | Clarão no horizonte; o cogumelo nuclear cresce atrás dos prédios e o céu fica laranja; pessoas correm em pânico; você percebe que precisa fugir |
| 3 — A explosão | 24–35 s | Você corre com a onda de choque de poeira atrás; vidros caem e um carro capota; você se joga na escada do metrô; o abrigo treme, a luz pisca e apaga |
| 4 — 30 dias depois | 35–47 s | "30 DIAS DEPOIS..."; a escotilha abre e você sai de máscara de gás e mochila; ruínas, carros enferrujados, cinzas caindo; o contador Geiger dispara |
| 5 — A nova humanidade | 47–59 s | Comunidade de sobreviventes entre barracos de metal, luzes e fogueira; você troca uma lata por água; o mapa das zonas radioativas |
| 6 — O perigo | 59–70 s | Rua abandonada com poste piscando; barulho atrás de um carro enferrujado; uma figura de óculos brilhantes surge do escuro com um cano de ferro |
| 7 — O final | 70–86 s | Do alto da colina, você vê um sinal pulsando de um abrigo antigo na montanha; a porta começa a abrir; tela preta e "VOCÊ SOBREVIVERIA AO FIM DO MUNDO?" |

O protagonista ("você") tem sempre o cabelo escuro bagunçado e o moletom amarelo; depois da guerra, o moletom fica sujo e ele usa máscara de gás e mochila.

## Tempo de cada fala

| Fala | Começa | Termina até |
|---|---|---|
| 1 | 0,8 s | 11,2 s |
| 2 | 12,6 s | 23,6 s |
| 3 | 24,6 s | 34,0 s |
| 4 | 36,4 s | 46,6 s |
| 5 | 47,8 s | 58,6 s |
| 6 | 59,6 s | 69,4 s |
| 7 | 70,6 s | 78,0 s |
| 8 ("Mas quem ainda estaria vivo lá dentro?") | 79,4 s | 81,8 s |
| Tela preta + pergunta final | 82,2–86 s | — |

Se a narração gravada ficar com outro ritmo, ajuste os tempos em `projeto/episodios/ep01/tempos.json` e renderize de novo a versão com legenda.

## Como renderizar

Requisitos: Node 18+ com Playwright (Chromium) e ffmpeg. Não há dependências npm.

```bash
cd projeto
node render.js --preview 5,17,30,40,55,65,80 --outdir previas --scale 0.5   # quadros soltos
node render.js --legendas 0     # build/ep01_sem_legenda.mp4
node render.js --legendas 1     # build/ep01_com_legenda.mp4
python3 legendas.py             # build/ep01.srt
```

Organização: `motor/` (motor 2D compartilhado com os outros projetos), `personagens/pessoas.js` (você, pessoas da cidade,
crianças, sobreviventes e o estranho; celular, caneca, contador Geiger, lata, garrafa e cano), `cenarios/mundo.js`
(quarto, cidade, cogumelo nuclear, onda de choque, metrô, abrigo, ruínas, escotilha, acampamento, rua abandonada,
colina e carros) e `episodios/ep01/` (cenas e tempos).

## Limitações

- Animação por poses e curvas programadas; personagens de frente para a câmera, no estilo cartoon.
- Sem som, como pedido: use o prompt de `PROMPT_NARRACAO_E_SOM.md` no outro aplicativo.
- Legendas no tempo estimado da narração (ajustável em `tempos.json`).
