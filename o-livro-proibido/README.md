# O Livro Proibido — Episódio 1: A Guerra dos Magos

Animação 3D procedural em Three.js. Formato vertical 9:16, 1080×1920, 30 fps, **76 segundos**, **sem narração e sem som**
(a voz e a trilha serão feitas em outro aplicativo).

## Arquivos entregues

| Arquivo | O que é |
|---|---|
| `ep01_sem_legenda.mp4` | Vídeo limpo: imagem, transições, título do episódio e "CONTINUA..." no final |
| `ep01_com_legenda.mp4` | O mesmo vídeo com as legendas queimadas, sincronizadas com o tempo previsto da narração |
| `ep01.srt` | Legendas em arquivo separado, para importar no seu editor (CapCut, Premiere etc.) |
| `projeto/` | Código-fonte para editar e renderizar de novo e para criar os próximos episódios |

## Tempo de cada fala (para gravar a narração)

O vídeo foi cronometrado para estas janelas. Grave cada fala para caber no seu espaço:

| Cena | Imagem | Fala começa | Termina até |
|---|---|---|---|
| 1 — A era da magia | 0–11 s | 0,8 s | 10,4 s |
| 2 — O livro sagrado | 11–22 s | 11,6 s | 21,4 s |
| 3 — Os quatro magos | 22–34 s | 22,4 s | 33,6 s |
| 4 — A descoberta | 34–46 s | 34,6 s | 45,6 s |
| 5 — A guerra dos magos | 46–61 s | 46,8 s | 58,8 s |
| 6 — O final (parte 1) | 61–73 s | 63,0 s | 68,4 s |
| 6 — O final (parte 2, após a pausa) | | 70,4 s | 72,8 s |
| Tela preta + "CONTINUA..." | 73–76 s | — | — |

Na cena 6, "...alguém havia acabado de ler a última página." deve cair durante a aproximação dos olhos de Kael (70,6–73 s).
A tela fica preta em 73,0 s.

Se a sua narração ficar com tempos diferentes, ajuste `inicio`/`fim` em `projeto/episodios/ep01/tempos.json`
e rode `./legendar.sh` para refazer as legendas (não é preciso renderizar o vídeo de novo).

## Como o projeto é organizado

```
projeto/
  index.html              abre o episódio no navegador (?ep=ep01, ?play=1 para assistir ao vivo)
  render.js               renderiza quadro a quadro (Chromium + Playwright) e codifica com ffmpeg
  legendas.py             gera .srt e .ass a partir de tempos.json
  legendar.sh             queima as legendas no vídeo
  motor/
    base.js               matemática, ruído, texturas procedurais, céu, partículas, feixes de luz
    rig.js                esqueleto humanoide, túnicas, rostos com expressões, poses de feitiço
    fx.js                 efeitos: esfera negra, escudo dourado, portal, onda de energia, explosões, raios, runas
    estudio.js            renderizador, câmera, transições, vinheta, granulação, textos
  personagens/magos.js    Kael, Morvath, Eldrin, Zareth e o cajado (aparência fixa, igual em todas as cenas)
  cenarios/
    exterior.js           reino, floresta, círculo de pedras, observatório, campo de batalha
    salao.js              salões de pedra (biblioteca, cripta, templo, câmara) e a porta de pedra
    objetos.js            o Livro Proibido, altar, colunas, estantes, velas
  episodios/ep01/
    episodio.js           lista de cenas, transições, título e "CONTINUA..."
    tempos.json           tempos das cenas e das falas
    cenas/c1…c6_*.js      uma cena por arquivo (personagens, câmeras e efeitos daquela cena)
```

### Para criar o episódio 2

1. Copie `episodios/ep01` para `episodios/ep02`.
2. Edite `tempos.json` (título, duração, falas) e reescreva os arquivos em `cenas/`.
   Os personagens, cenários e efeitos já existentes podem ser importados direto.
3. Renderize com `node render.js --ep ep02`.

## Como renderizar

Requisitos: Node 18+, Playwright com Chromium, ffmpeg (com libass para as legendas) e Python 3.

```bash
cd projeto
npm install
npm run previa                  # quadros soltos em previas/ (rápido, meia resolução)
node render.js                  # vídeo limpo em build/ep01_sem_legenda.mp4 (~40 min em CPU)
./legendar.sh                   # build/ep01_com_legenda.mp4 + build/ep01.srt
```

Para assistir no navegador sem renderizar: sirva a pasta `projeto` com qualquer servidor estático que também sirva
`/node_modules` e abra `index.html?play=1`. A renderização em tempo real depende do computador; o vídeo final sai sempre
do `render.js`, quadro a quadro.

## Limitações

- **Visual estilizado.** Personagens e cenários são feitos de formas geométricas geradas por código (sem modelos
  esculpidos nem texturas fotográficas). O resultado lembra uma animação 3D estilizada/low-poly, não um filme de estúdio.
- **Animação por poses.** Os movimentos são poses e ciclos de caminhada programados, sem captura de movimento.
  Rostos têm olhos, pálpebras, sobrancelhas e boca animados, mas não há sincronia labial (não há falas na tela).
- **Sem som.** Como pedido, o vídeo não tem narração, música nem efeitos sonoros.
- **Legendas estimadas.** As legendas seguem o tempo previsto em `tempos.json`. Se a narração gravada tiver outro ritmo,
  ajuste os tempos e gere as legendas de novo (instruções acima).
- **Renderização lenta em CPU.** No ambiente usado (sem GPU), cada quadro leva cerca de 1 s.
