# O Livro Proibido

| Episódio | Arquivos |
|---|---|
| 1 — A Guerra dos Magos | `ep01_com_legenda.mp4`, `ep01_sem_legenda.mp4`, `ep01.srt` (nesta pasta) |
| 2 — A Página Arrancada | pasta `ep02/` (vídeos, `.srt` e `PROMPT_NARRACAO_E_SOM.md`) |

---

# Episódio 1: A Guerra dos Magos

Animação **2D cartoon** gerada por código (Canvas 2D): personagens de cabeça redonda grande, braços "macarrão",
contorno escuro e cores chapadas, fundos ilustrados com raios de luz e brilhos, e legenda grande palavra por palavra.

Formato vertical 9:16, 1080×1920, 30 fps, **76 segundos**, **sem narração e sem som**
(a voz e a trilha serão feitas em outro aplicativo).

## Arquivos entregues

| Arquivo | O que é |
|---|---|
| `ep01_sem_legenda.mp4` | Vídeo limpo: animação, transições, título do episódio e "CONTINUA..." no final |
| `ep01_com_legenda.mp4` | O mesmo vídeo com legendas grandes palavra por palavra, no tempo previsto da narração |
| `ep01.srt` | Legendas em frases curtas, para importar no seu editor (CapCut, Premiere etc.) |
| `projeto/` | Código-fonte para editar, renderizar de novo e criar os próximos episódios |
| `versao-3d/` | Primeira versão do projeto em 3D (Three.js), mantida só como referência |

## Tempo de cada fala (para gravar a narração)

| Cena | Imagem | Fala começa | Termina até |
|---|---|---|---|
| 1 — A era da magia | 0–11 s | 0,8 s | 10,4 s |
| 2 — O livro sagrado | 11–22 s | 11,6 s | 21,4 s |
| 3 — Os quatro magos | 22–34 s | 22,4 s | 33,6 s |
| 4 — A descoberta | 34–46 s | 34,6 s | 45,6 s |
| 5 — A guerra dos magos | 46–61 s | 46,8 s | 58,8 s |
| 6 — O final (parte 1) | 61–73 s | 63,0 s | 68,4 s |
| 6 — O final (parte 2, depois da pausa) | | 70,4 s | 72,8 s |
| Tela preta + "CONTINUA..." | 73–76 s | — | — |

"...alguém havia acabado de ler a última página." cai durante a aproximação dos olhos de Kael (70,6–73 s).

Se a narração gravada ficar com outro ritmo, ajuste `inicio`/`fim` das falas em
`projeto/episodios/ep01/tempos.json` e renderize de novo a versão com legenda (`node render.js --legendas 1`)
e o `.srt` (`python3 legendas.py`).

## O que acontece em cada cena

1. **A era da magia** — sobrevoo do reino ao entardecer: castelo no morro, torres de magos com cristais flutuando, pássaros, nuvens. Título do episódio.
2. **O livro sagrado** — a câmera desce pela biblioteca subterrânea (estantes, velas flutuando, luz da janela) até o livro aberto flutuando sobre o altar, com runas girando.
3. **Os quatro magos** — 4 planos de 3 s com transição colorida: Kael lê um pergaminho que brilha (e leva um susto), Morvath vê o livro na bola de cristal e sorri, Eldrin ergue o cajado e as estrelas formam o livro, Zareth abre um portal e pisca para a câmera.
4. **A descoberta** — eclipse visto pelo teto quebrado do templo; Kael entra com uma luz na mão, toca o mapa na parede, os símbolos azuis se espalham e a marca do livro acende.
5. **A guerra dos magos** — Morvath carrega e lança a esfera negra, Eldrin ergue o escudo dourado (impacto e explosão), Zareth sai do portal roxo e ataca, Kael lança a onda azul que derruba a torre, raios e explosões.
6. **O final misterioso** — a porta de pedra se abre com Kael na luz, ele se aproxima do livro, a página vira sozinha, a energia vermelha sobe, close nos olhos assustados, tela preta e "CONTINUA...".

## Como o projeto é organizado

```
projeto/
  index.html              abre o episódio no navegador (?ep=ep01, ?play=1 para assistir ao vivo, ?legendas=0)
  render.js               renderiza quadro a quadro (Chromium + Playwright) e codifica com ffmpeg
  legendas.py             gera o .srt a partir de tempos.json
  motor/
    base.js               matemática, curvas de animação, números aleatórios fixos
    desenho.js            formas com contorno, membros "macarrão", brilhos, raios de luz, runas, círculo mágico
    personagem.js         personagem cartoon: poses de braço, caminhada, pulo, expressões (feliz, choque, medo, raiva, malícia…)
    efeitos.js            esfera negra, escudo, portal, onda de energia, raio, explosão, energia vermelha, fumaça, poeira
    balao.js              "!" e "?" sobre a cabeça
    estudio.js            tela, câmera com paralaxe, transições, textos e o laço de quadros
  personagens/magos.js    Kael, Morvath, Eldrin, Zareth, cajado e pergaminho (aparência fixa em todas as cenas)
  cenarios/
    fundos.js             reino, biblioteca, floresta, cripta, observatório, círculo de pedras, templo, batalha, câmara
    objetos.js            o Livro Proibido, altar, velas, estantes, porta de pedra, bola de cristal
  episodios/ep01/
    episodio.js           lista de cenas, transições, título, legendas e "CONTINUA..."
    tempos.json           tempos das cenas e das falas
    cenas/*.js            uma cena por arquivo
```

### Para criar o episódio 2

1. Copie `episodios/ep01` para `episodios/ep02`.
2. Edite `tempos.json` (título, duração, falas) e reescreva as cenas em `cenas/`. Personagens, cenários e efeitos são reaproveitados com `import`.
3. Renderize: `node render.js --ep ep02 --legendas 0` e `--legendas 1`.

## Como renderizar

Requisitos: Node 18+ com Playwright (Chromium) e ffmpeg. Não há dependências npm.

```bash
cd projeto
node render.js --preview 3,15,24,40,50,70 --outdir previas --scale 0.5   # quadros soltos (rápido)
node render.js --legendas 0      # build/ep01_sem_legenda.mp4
node render.js --legendas 1      # build/ep01_com_legenda.mp4
python3 legendas.py              # build/ep01.srt
```

Para assistir no navegador sem renderizar: sirva a pasta `projeto` com qualquer servidor estático
(por exemplo `python3 -m http.server`) e abra `index.html?play=1`.

## Limitações

- **Animação por poses e curvas.** Os movimentos (caminhada, braços, pulos, expressões) são programados por código, não desenhados à mão quadro a quadro. Os personagens ficam sempre de frente para a câmera, como no estilo de referência.
- **Sem som.** Como pedido, não há narração, música nem efeitos sonoros.
- **Legendas estimadas.** As legendas seguem o tempo previsto em `tempos.json`; se a narração gravada tiver outro ritmo, ajuste os tempos e renderize de novo a versão com legenda.
- **Personagens e cenários originais.** O estilo segue a referência enviada (cartoon 2D de cabeças grandes), mas os personagens, cenários e a arte são próprios desta série.

---

# Episódio 2: A Página Arrancada

76 s, mesmo formato e estilo. Arquivos em `ep02/`. O prompt completo de narração, música e efeitos está em
`ep02/PROMPT_NARRACAO_E_SOM.md`.

| Cena | Imagem | Fala começa | Termina até |
|---|---|---|---|
| 1 — O rastro | 0–12 s | 0,8 s | 11,2 s |
| 2 — O confronto | 12–24 s | 12,6 s | 23,2 s |
| 3 — O céu vermelho | 24–36 s | 24,6 s | 35,2 s |
| 4 — A criatura | 36–52 s | 36,8 s | 51,0 s |
| 5 — O selo | 52–64 s | 52,6 s | 63,2 s |
| 6 — A página arrancada (parte 1) | 64–73 s | 64,6 s | 68,4 s |
| 6 — A página arrancada (parte 2) | | 70,0 s | 72,8 s |
| Tela preta + "CONTINUA..." | 73–76 s | — | — |

Código: `projeto/episodios/ep02/` (usa `motor/serie.js` para legendas, título e "CONTINUA...").
Novos recursos reaproveitáveis: a criatura de sombra (`personagens/criatura.js`), livro fechado e página arrancada
(`cenarios/objetos.js`), céu vermelho do reino e penhasco (`cenarios/fundos.js`), feixes e correntes de luz (`motor/efeitos.js`).
