# Linha do tempo: (cena, quem, texto, pausa_antes, extra_depois)  — ritmo natural, sem acelerar
import json
R=2.85  # palavras/seg (narração natural, descontraída)
D=2.9   # diálogos (fala natural)
L=[
(1,'N',"Imagine nascer numa família onde existem dois tipos de filhos... O primeiro faz praticamente tudo dentro de casa. O segundo... bom, o segundo parece que paga aluguel só pra ocupar o sofá.",0.6,0.4),
(1,'Pedro',"Ô mãe, cadê meu carregador?",0,0.2),
(1,'Mãe',"Tá na mesa, meu filho!",0,0.4),
(1,'Lucas',"Alguém pode me ajudar aqui?",0,1.6),
(2,'N',"Lucas é aquele filho que faz de tudo. Lava louça, limpa a casa, tira o lixo, arruma a cozinha... O desgraçado praticamente virou funcionário terceirizado da própria família.",0.4,1.6),
(2,'Mãe',"Lucas! Você limpou a casa inteira?",0,0.2),
(2,'Lucas',"Limpei, mãe!",0,0.5),
(2,'Mãe',"Tá... mas por que deixou aquele copo em cima da mesa?",0,3.0),
(2,'N',"PORRA! O CARA LIMPOU UMA CASA INTEIRA E O JULGAMENTO FINAL FOI POR CAUSA DE UM COPO!",0,0.6),
(3,'Mãe',"Pedro, meu filho, você pode tirar o lixo pra mim?",1.6,1.2),
(3,'Pedro',"Ah, mãe... justo agora?",0,8.0),
(3,'Mãe',"MEU DEUS! QUE MENINO PRESTATIVO! OBRIGADA, MEU FILHO!",0,0.6),
(3,'Lucas',"Eu tirei o lixo ontem, anteontem e a semana inteira...",0,0.2),
(3,'Mãe',"Lucas, não começa!",0,0.4),
(3,'N',"Pedro realizou uma tarefa de aproximadamente quarenta segundos e recebeu uma homenagem digna de quem voltou da Segunda Guerra Mundial.",0,1.0),
(4,'Mãe',"Come, meu filho. Você é tão esforçado!",1.2,1.2),
(4,'Lucas',"Então quer dizer que, quando eu faço dez coisas, ninguém percebe... Mas quando ele faz uma, vira funcionário do mês?",0,0.3),
(4,'Pedro',"É porque eu sou diferenciado.",0,0.4),
(4,'Lucas',"Diferenciado é teu nível de preguiça, seu filho da...",0,2.0),
(5,'N',"Mas sabe por que isso acontece? Existe uma coisa chamada adaptação às expectativas. Quando você faz algo constantemente, as pessoas começam a enxergar aquilo como sua obrigação. Seu esforço deixa de ser novidade e passa a ser considerado o mínimo. Já quando alguém que nunca ajuda faz alguma coisa, aquilo parece uma conquista extraordinária. E tem outro detalhe: muitas famílias acabam criando papéis sem perceber. Um vira o responsável, o outro vira o preguiçoso que sempre precisa ser lembrado. Mas cuidado: isso não significa que toda família faz isso de propósito. Às vezes, as pessoas simplesmente se acostumam tanto com a ajuda de alguém que esquecem de reconhecer o esforço.",0.8,0.8),
(6,'Mãe',"Lucas, você não vai limpar a cozinha?",2.4,0.3),
(6,'Lucas',"Hoje não, mãe. Hoje eu sou um ser humano em período de experiência.",0,0.4),
(6,'Pedro',"Ué, então quem vai fazer?",0,0.3),
(6,'Lucas',"Parabéns, filho favorito. Sua promoção chegou.",0,2.4),
(6,'N',"E fica a reflexão: ajudar dentro de casa é responsabilidade de todos. Mas ninguém deveria precisar fazer tudo para só ser lembrado quando comete um erro. Porque, às vezes, o filho que parece não fazer nada não é o mais valorizado... É simplesmente aquele de quem menos se espera.",0.3,0.6),
]
t=0; out=[]; cenas={}
for c,q,txt,a,b in L:
    t+=a; n=len(txt.split()); d=n/(R if q=="N" else D)+(0.3 if q!="N" else 0.2)
    out.append({"cena":c,"quem":q,"inicio":round(t,2),"fim":round(t+d,2),"texto":txt}); cenas.setdefault(c,[out[-1]['inicio'],0]); t+=d+b; cenas[c][1]=round(t,2)
fim=round(t+3.4,1)
print(json.dumps(out,ensure_ascii=False,indent=0)[:0]); 
for o in out: print(o['cena'],o['quem'],o['inicio'],o['fim'])
print('cenas',cenas,'fim',fim)
narr=[{"inicio":o["inicio"],"fim":o["fim"],"texto":(o["texto"] if o["quem"]=="N" else "— "+o["quem"]+": "+o["texto"])} for o in out]
json.dump({"titulo":"O filho que faz tudo e o que não faz nada","duracao":fim,"falas":out,"narracao":narr,"cenas":cenas,"texto_final_tela":[round(t,1),fim]},open('episodios/ep01/tempos.json','w'),ensure_ascii=False,indent=1)
