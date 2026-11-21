# Como seria se você nascesse na era dos cavaleiros?

Vídeo narrado em **2D cartoon** para TikTok e YouTube Shorts: o narrador conta ao espectador como seria a vida dele na Idade Média,
do nascimento à primeira batalha. Vertical 1080×1920, 30 fps, **80 segundos**, **sem narração e sem som** (feitos em outro aplicativo).

## Arquivos

| Arquivo | O que é |
|---|---|
| `era_dos_cavaleiros_com_legenda.mp4` | Vídeo com legendas grandes palavra por palavra (no tempo previsto da narração) |
| `era_dos_cavaleiros_sem_legenda.mp4` | O mesmo vídeo limpo |
| `era_dos_cavaleiros.srt` | Legendas em frases curtas para o editor |
| `PROMPT_NARRACAO_E_SOM.md` | Prompt completo de narração, trilha, efeitos e mixagem, com os tempos |
| `projeto/` | Código para editar e renderizar de novo |

## Roteiro animado

| Cena | Tempo | O que acontece |
|---|---|---|
| 1 — Seu nascimento | 0–12 s | Título; vila medieval com aldeões, galinhas e fumaça nas chaminés; ícones de celular, carro e lâmpada são riscados; a mãe segura o bebê e uma seta mostra "VOCÊ" |
| 2 — Sua infância | 12–25 s | Você carrega baldes de água com esforço atrás do pai; varre a casa enquanto a mãe cozinha; brinca de espada de pau com um amigo |
| 3 — O sonho | 25–38 s | Na cerca, você vê um cavaleiro passar a cavalo, com os olhos brilhando; sonha consigo mesmo de armadura; o balão estoura e você ergue o punho, decidido |
| 4 — O treinamento | 38–51 s | Golpes no boneco de palha; luta com o mestre e uma queda cômica; cavalgada desajeitada; a armadura cai em você e pesa |
| 5 — A primeira batalha | 51–66 s | Você na linha de frente, com medo; o exército inimigo surge no morro; investida a cavalo; flechas e choque de espadas |
| 6 — O final | 66–80 s | Você diante do castelo ao pôr do sol, se vira para a câmera; "VOCÊ SOBREVIVERIA À IDADE MÉDIA?" |

Cada cena abre com uma faixa de capítulo ("SEU NASCIMENTO", "SUA INFÂNCIA", "SEU SONHO", "SEU TREINAMENTO", "SUA PRIMEIRA BATALHA", "SEU DESTINO").

O protagonista ("você") tem sempre o mesmo rosto, cabelo castanho com topete, sardas e lenço vermelho: bebê, criança, jovem e cavaleiro (armadura com sobreveste vermelha e pluma vermelha).

## Tempo de cada fala

| Fala | Começa | Termina até |
|---|---|---|
| 1 | 0,8 s | 11,4 s |
| 2 | 12,6 s | 24,4 s |
| 3 | 25,6 s | 37,4 s |
| 4 | 38,6 s | 50,4 s |
| 5 | 51,6 s | 65,4 s |
| 6 | 66,6 s | 76,0 s |
| Texto final na tela | 76,0–80 s | — |

Se a narração gravada ficar com outro ritmo, ajuste os tempos em `projeto/episodios/ep01/tempos.json` e renderize de novo a versão com legenda.

## Como renderizar

Requisitos: Node 18+ com Playwright (Chromium) e ffmpeg. Não há dependências npm.

```bash
cd projeto
node render.js --preview 5,20,30,45,60,78 --outdir previas --scale 0.5   # quadros soltos
node render.js --legendas 0     # build/ep01_sem_legenda.mp4
node render.js --legendas 1     # build/ep01_com_legenda.mp4
python3 legendas.py             # build/ep01.srt
```

Organização: `motor/` (mesmo motor 2D de "O Livro Proibido", com túnicas curtas, montaria, faixas de capítulo, seta "VOCÊ",
ícones riscados, balão de pensamento e flechas em `extras.js`), `personagens/pessoas.js` (você em cada fase, família, aldeões,
mestre de armas e cavaleiros), `personagens/cavalo.js` (cavalo animado ao passo ou a galope, com cavaleiro montado),
`cenarios/medieval.js` (vila, casa, estrada, pátio de treino, campo de batalha e castelo ao pôr do sol) e `episodios/ep01/` (cenas e tempos).

## Limitações

- Animação por poses e curvas programadas; os personagens ficam de frente para a câmera, no estilo cartoon de referência.
- Sem som, como pedido: use o prompt de `PROMPT_NARRACAO_E_SOM.md` no outro aplicativo.
- Legendas no tempo estimado da narração (ajustável em `tempos.json`).
