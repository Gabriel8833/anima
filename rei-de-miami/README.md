# E se você fosse o rei de Miami?

Vídeo narrado em **2D cartoon** para TikTok e YouTube Shorts: a ascensão e a queda de um imigrante que chega a Miami nos anos 80
e vira chefão, contada com o espectador como protagonista. Vertical 1080×1920, 30 fps, **88 segundos**, **sem narração e sem som**.

**História, personagens e falas originais.** O vídeo é do mesmo gênero dos dramas de gângster dos anos 80, mas não adapta nenhum
filme: não usa personagens, cenas, falas, nomes nem a aparência de atores de obras existentes. O crime fica implícito, e a queda
é mostrada como uma batida policial, sem violência explícita.

## Arquivos

| Arquivo | O que é |
|---|---|
| `rei_de_miami_com_legenda.mp4` | Vídeo com legendas grandes palavra por palavra |
| `rei_de_miami_sem_legenda.mp4` | O mesmo vídeo limpo |
| `rei_de_miami.srt` | Legendas em frases curtas para o editor |
| `PROMPT_NARRACAO_E_SOM.md` | Prompt completo de narração, trilha, efeitos e mixagem, com os tempos |
| `projeto/` | Código para editar e renderizar de novo |

## Roteiro animado

| Cena | Tempo | O que acontece |
|---|---|---|
| 1 — Chegada a Miami | 0–13 s | Título; você chega pela avenida da praia ao pôr do sol com uma mala pequena (palmeiras, prédios art déco com neon, patinadora, esportivo passando); olha para cima e sonha |
| 2 — O começo | 13–27 s | Lavando pratos na cozinha de uma lanchonete; à noite, no beco, uma limusine para e um homem de chapéu oferece um envelope; você hesita e aceita |
| 3 — A ascensão | 27–41 s | Terno branco e óculos escuros saindo da limusine entre flashes; dirigindo um esportivo vermelho; aperto de mão no clube neon; pilhas de dinheiro e notas voando |
| 4 — O império | 41–55 s | A mansão com colunas, piscina, chafariz e portão com a inicial "R"; seguranças; você no escritório de luxo, ao telefone, rindo, com dinheiro na mesa |
| 5 — A paranoia | 55–69 s | Noite; sozinho diante das câmeras de segurança, espiando pela persiana, o telefone tocando sem resposta; o segurança abre a porta e você leva um susto |
| 6 — A queda | 69–88 s | Sirenes, helicóptero e luzes vermelhas e azuis; os seguranças fogem; você empurra a mesa contra a porta; a porta é arrombada; você termina sentado sozinho; "VALEU A PENA?" |

O protagonista ("você") tem sempre o cabelo preto penteado para trás, o cavanhaque e a corrente de ouro: começa de camisa florida
e passa a usar terno branco com camisa verde-água.

## Tempo de cada fala

| Fala | Começa | Termina até |
|---|---|---|
| 1 | 0,8 s | 12,4 s |
| 2 | 13,6 s | 26,4 s |
| 3 | 27,6 s | 40,4 s |
| 4 | 41,6 s | 54,4 s |
| 5 | 55,6 s | 68,4 s |
| 6 | 69,6 s | 79,4 s |
| 7 ("No fim, sobrou só uma pergunta: valeu a pena?") | 80,6 s | 84,0 s |
| Tela preta + pergunta final | 84,4–88 s | — |

## Como renderizar

Requisitos: Node 18+ com Playwright (Chromium) e ffmpeg. Não há dependências npm.

```bash
cd projeto
node render.js --preview 5,22,35,50,63,78 --outdir previas --scale 0.5   # quadros soltos
node render.js --legendas 0     # build/ep01_sem_legenda.mp4
node render.js --legendas 1     # build/ep01_com_legenda.mp4
python3 legendas.py             # build/ep01.srt
```

Organização: `motor/` (motor 2D compartilhado), `personagens/miami.js` (você, pessoas da cidade, o contato, chefões, policiais
e objetos), `cenarios/miami80.js` (avenida, cozinha, beco, clube neon, mansão, escritório, carros esportivo e limusine, câmeras de
segurança e dinheiro) e `episodios/ep01/` (cenas e tempos).
