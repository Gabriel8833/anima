# ABRIGO 47 — E se você nascesse no fim do mundo?

Vídeo narrado em **2D cartoon** (cerca de 1min54s) para TikTok e YouTube Shorts, no clima de jogos pós-apocalípticos
retrô-futuristas: um futuro que parou nos anos 50, abrigos subterrâneos, aparelho de pulso, o Ermo radioativo, mutantes,
cidades de sucata e escolhas com consequências. Vertical 1080×1920, 30 fps, **114 s**, **sem narração e sem som**.

Todos os nomes, personagens e elementos são **originais**: AtomLar, Atomito, Abrigo 47, PulsoTec, Porto Sucata, o xerife robô
e o escorpião-caranguejo mutante. Não usamos marcas nem personagens de jogos existentes.

## Arquivos

| Arquivo | O que é |
|---|---|
| `abrigo47_com_legenda.mp4` | Vídeo com legendas grandes palavra por palavra |
| `abrigo47_sem_legenda.mp4` | O mesmo vídeo limpo |
| `abrigo47.srt` | Legendas em frases curtas para o editor |
| `PROMPT_NARRACAO_E_SOM.md` | Prompt completo de narração, trilha, efeitos e mixagem, com os tempos |
| `projeto/` | Código para editar e renderizar de novo |

## Roteiro animado

| Cena | Tempo | O que acontece |
|---|---|---|
| 1 — O mundo do amanhã | 0–14 s | Título; cidade dos anos 50 com carros rabo de peixe, monotrilho, lanchonete-disco voador e o robô Atomito; comercial de TV da AtomLar: "O futuro é subterrâneo!" |
| 2 — As sirenes | 14–28 s | Sirenes; você criança com os pais corre até o Abrigo 47; a porta blindada fecha; clarão e cogumelo no horizonte |
| 3 — A vida no abrigo | 28–44 s | "ANO 1": corredores; "ANO 6": aula com o robô professor ("Regra nº 1: ninguém sai"); "ANO 10": aniversário e você ganha o PulsoTec; "ANO 20": a caixa d'água esvazia e o alarme toca |
| 4 — Lá fora | 44–58 s | A supervisora escolhe você; "NOVA MISSÃO: consertar a bomba d'água"; a porta abre para a luz; pela primeira vez você vê o sol e o Ermo em ruínas |
| 5 — O Ermo | 58–74 s | Barra de vida na tela; você acha a pistola laser num carro enferrujado; o escorpião-caranguejo sai da areia; tiros, dano na tela, "+50 XP" e "NÍVEL 2!" |
| 6 — Porto Sucata | 74–94 s | Cidade de sucata com xerife robô; você troca e ganha a peça; saqueadores atacam; o jogo pausa com a escolha "FUGIR COM A PEÇA / FICAR E LUTAR"; você fica e luta; "+100 XP" e "REPUTAÇÃO: HERÓI" |
| 7 — O sinal | 94–114 s | Ao pôr do sol, a porta do abrigo não abre mais; o PulsoTec capta o "SINAL: ABRIGO 12"; "NOVA MISSÃO: encontrar o Abrigo 12"; "VOCÊ SAIRIA DO ABRIGO?" |

O protagonista ("você") tem sempre o cabelo ruivo com topete e os óculos redondos: criança de camisa listrada e adulto
de macacão verde-água e laranja com o número 47.

## Tempo de cada fala

| Fala | Começa | Termina até |
|---|---|---|
| 1 | 0,8 s | 13,4 s |
| 2 | 14,6 s | 27,4 s |
| 3 | 28,6 s | 43,4 s |
| 4 | 44,6 s | 57,4 s |
| 5 | 58,6 s | 73,4 s |
| 6 | 74,6 s | 93,4 s |
| 7 | 94,6 s | 105,6 s |
| 8 ("Sua aventura no Ermo estava só começando.") | 107,0 s | 110,0 s |
| Tela preta + pergunta final | 110,6–114 s | — |

Se a narração gravada ficar com outro ritmo, ajuste os tempos em `projeto/episodios/ep01/tempos.json` e renderize de novo a versão com legenda.

## Como renderizar

Requisitos: Node 18+ com Playwright (Chromium) e ffmpeg. Não há dependências npm.

```bash
cd projeto
node render.js --preview 3,20,36,50,67,86,101 --outdir previas --scale 0.5   # quadros soltos
node render.js --legendas 0     # build/ep01_sem_legenda.mp4
node render.js --legendas 1     # build/ep01_com_legenda.mp4
python3 legendas.py             # build/ep01.srt
```

Organização: `motor/` (motor 2D compartilhado), `personagens/abrigo.js` (você, pais, supervisora, Atomito, robô professor,
xerife robô, saqueadores, mutante e itens), `personagens/sobreviventes.js` (sobreviventes reaproveitados), `cenarios/retro.js`
(cidade retrô, comercial de TV, porta do abrigo, interior, Ermo, Porto Sucata, HUD de jogo e tela do PulsoTec),
`cenarios/mundo.js` (cogumelo nuclear e peças reaproveitadas) e `episodios/ep01/` (cenas e tempos).

## Limitações

- Animação por poses e curvas programadas; personagens de frente para a câmera, no estilo cartoon.
- Sem som, como pedido: use o prompt de `PROMPT_NARRACAO_E_SOM.md` no outro aplicativo.
- Legendas no tempo estimado da narração (ajustável em `tempos.json`).
