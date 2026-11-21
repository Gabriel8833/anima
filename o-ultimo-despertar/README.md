# O Último Despertar — Contos Épicos

Série animada em **2D cartoon** para TikTok, planejada para até 4 episódios de cerca de 1 minuto.

## Episódio 1 — O Garoto Sem Poder (pronto)

Vertical 1080×1920, 30 fps, **63 segundos**, **sem narração e sem som** (feitos em outro aplicativo).

| Arquivo | O que é |
|---|---|
| `ep01_com_legenda.mp4` | Episódio 1 com legendas grandes palavra por palavra (no tempo previsto da narração) |
| `ep01_sem_legenda.mp4` | O mesmo vídeo limpo |
| `ep01.srt` | Legendas em frases curtas para o editor |
| `PROMPT_NARRACAO_E_SOM.md` | Prompt de narração, voz misteriosa, trilha, efeitos e mixagem, com os tempos |
| `projeto/` | Código para editar, renderizar de novo e produzir os próximos episódios |

### Cenas

| Cena | Tempo | O que acontece |
|---|---|---|
| 1 — O mundo de Aether | 0–9 s | Gancho com cortes rápidos: cidade de ilhas flutuantes e torres de cristal; pessoas usando fogo, água, telecinese, velocidade, força e raio |
| 2 — O nascimento de Kael | 9–18 s | Kael criança fecha os olhos e aperta os punhos, a pedra só treme e sai um "puf"; outra criança faz uma flor brotar |
| 3 — O passar dos anos | 18–27 s | "8 ANOS": Lyra desperta o gelo; "12 ANOS": Tomi desperta o raio; Kael aplaude com sorriso forçado; "15 ANOS": os dois vão embora juntos |
| 4 — A humilhação | 27–37 s | No pátio da academia, Draven brinca com fogo, Mira arranca o livro de Kael com telecinese e todos riem; close na lágrima |
| 5 — O teste | 37–48 s | "A AVALIAÇÃO": Kael toca o grande cristal diante da academia; nada acontece; a plateia ri |
| 6 — O despertar misterioso | 48–63 s | O cristal racha em roxo, apagão, a chama de Draven some e as luzes dos poderes são puxadas para o escuro; Kael cai de joelhos; "Finalmente... encontrei você."; card "EPISÓDIO 2 EM BREVE" |

O poder de Kael **não é revelado**: só aparecem um anel escuro e leve ao redor dele, as partículas dos poderes sendo puxadas
e um brilho de um instante nos olhos e na pulseira. O nome "Vazio Absoluto" não aparece no episódio 1.

### Tempo de cada fala

| Fala | Começa | Termina até |
|---|---|---|
| 1 (narrador) | 0,4 s | 8,6 s |
| 2 | 9,4 s | 17,6 s |
| 3 | 18,4 s | 26,6 s |
| 4 | 27,4 s | 36,6 s |
| 5 | 37,4 s | 47,6 s |
| 6 | 48,2 s | 53,4 s |
| Voz misteriosa: "Finalmente... encontrei você." | 54,0 s | 57,0 s |
| 7 (narrador) | 57,6 s | 60,2 s |
| Card final | 60,6–63 s | — |

## Bíblia visual da série (manter igual nos episódios 2 a 4)

Todos os personagens estão em `projeto/personagens/elenco.js`. Nos próximos episódios, importe as mesmas funções.

| Personagem | Aparência fixa |
|---|---|
| **Kael** (16) | Cabelo preto bagunçado com **uma mecha branca** na frente; olhos cinza-azulados; **jaqueta cinza** com gola branca; calça cinza-escura; botas marrons; **pulseira preta** no pulso esquerdo. É o único de cinza entre os alunos. Quando criança: mesmo cabelo e mecha, camiseta cinza larga. |
| **Draven** | Valentão do fogo; cabelo laranja espetado; olhos vermelhos; pequena cicatriz na sobrancelha; uniforme azul da academia |
| **Lyra** | Antiga amiga; poder do gelo; cabelo azul-gelo em rabo de cavalo; uniforme azul |
| **Tomi** | Antigo amigo; poder do raio; cabelo loiro com topete; uniforme azul |
| **Mira** | Aluna da telecinese; cabelo roxo curto com franja; uniforme azul |
| **Examinadora** | Mestra da academia; cabelo grisalho em coque; túnica dourada |

Uniforme da academia: azul (#2f5ab8) com detalhes dourados. Cor do mistério de Kael: roxo-lilás (#b08aff).
Mistérios guardados para os próximos episódios: o nome e o funcionamento do poder, de quem é a voz e o significado da pulseira preta.

## Como renderizar

Requisitos: Node 18+ com Playwright (Chromium) e ffmpeg. Não há dependências npm.

```bash
cd projeto
node render.js --preview 2,14,23,34,45,55 --outdir previas --scale 0.5   # quadros soltos
node render.js --legendas 0     # build/ep01_sem_legenda.mp4
node render.js --legendas 1     # build/ep01_com_legenda.mp4
python3 legendas.py             # build/ep01.srt
```

Para o episódio 2: copie `projeto/episodios/ep01` para `projeto/episodios/ep02`, troque `tempos.json` e as cenas, e renderize
com `node render.js --ep ep02 --legendas 0` e `--legendas 1`.
