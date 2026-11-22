#!/usr/bin/env python3
"""Gera a narração-guia (MBROLA/espeak-ng), mede a duração de cada fala e monta a linha do tempo (tempos.json) + trilha de voz (audio/voz.wav).
As bocas dos personagens são animadas exatamente nesses intervalos."""
import json, subprocess, wave, os
VOZ = {  # voz, velocidade (palavras/min), tom (0-99), volume
  'N':     ('mb-br3', 172, 48, 180),
  'Lucas': ('mb-br1', 178, 58, 190),
  'Pedro': ('mb-br1', 150, 36, 170),
  'Mãe':   ('mb-br1', 168, 92, 190),
}
# (cena, quem, texto, pausa_antes)
L = [
 (1,'N',"Imagine ser aquele filho que faz tudo dentro de casa... Você lava louça, varre, limpa, arruma... Enquanto seu irmão tá no sofá há tanto tempo que já deveria ter escritura daquele lugar!",0.6),
 (2,'Mãe',"LUCAS! QUE PORRA É ESSA AQUI?",3.4),
 (2,'Lucas',"É um copo, mãe...",0.3),
 (2,'Mãe',"MAS CUSTAVA LAVAR?",0.3),
 (2,'N',"O desgraçado limpou até a alma da casa, mas deixou um copo! PRONTO! VIROU O MAIOR VAGABUNDO DO BRASIL!",1.2),
 (3,'Mãe',"Pedro, meu filho, tira o lixo pra mim?",1.0),
 (3,'Mãe',"MEU DEUS! QUE FILHO MARAVILHOSO! SEMPRE ME AJUDANDO!",7.0),
 (3,'Lucas',"AH, VAI SE FODER! ELE JOGOU UM SACO DE LIXO NA RUA, NÃO DESCOBRIU A CURA DO CÂNCER!",0.6),
 (3,'Pedro',"Tá com inveja porque eu sou o favorito.",0.3),
 (3,'Lucas',"FAVORITO É O CARALHO! TU É UM MÓVEL COM CPF!",0.3),
 (4,'Mãe',"LUCAS! QUEM VAI LIMPAR ESSA CASA?",2.4),
 (4,'Lucas',"Não sei, mãe. Contrata o Pedro. Pelo visto, ele é um funcionário exemplar.",0.3),
 (4,'Pedro',"EU? MAS EU NÃO SEI FAZER NADA!",0.3),
 (4,'Lucas',"ENTÃO APRENDE, PORRA! ATÉ UMA BARATA TRABALHA MAIS QUE VOCÊ!",0.3),
 (4,'N',"E naquele dia, Pedro descobriu que a vassoura não era um objeto de decoração.",0.8),
 (4,'Lucas',"ISSO! TÁ QUASE VIRANDO UM SER HUMANO!",1.6),
]
os.makedirs('audio', exist_ok=True)
SR = 22050
def dur(path):
    with wave.open(path) as w: return w.getnframes() / w.getframerate()
t = 0; falas = []
for i, (c, q, txt, pausa) in enumerate(L):
    v, s, p, a = VOZ[q]
    f = f'audio/f{i:02d}.wav'
    subprocess.run(['espeak-ng', '-v', v, '-s', str(s), '-p', str(p), '-a', str(a), '-w', f, txt.lower().capitalize() if txt.isupper() else txt], check=True)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f, '-ar', str(SR), '-ac', '1', f + '.n.wav'], check=True); os.replace(f + '.n.wav', f)
    t += pausa; d = dur(f)
    falas.append({'cena': c, 'quem': q, 'inicio': round(t, 2), 'fim': round(t + d, 2), 'texto': txt, 'arquivo': f}); t += d
fim = round(t + 3.6, 1)
# trilha de voz única com cada fala no seu tempo
filtros = ''.join(f"[{i}:a]adelay={int(f['inicio']*1000)}|{int(f['inicio']*1000)}[a{i}];" for i, f in enumerate(falas))
cmd = ['ffmpeg', '-v', 'error', '-y'] + sum([['-i', f['arquivo']] for f in falas], []) + ['-filter_complex', filtros + ''.join(f'[a{i}]' for i in range(len(falas))) + f'amix=inputs={len(falas)}:normalize=0,apad,atrim=0:{fim},volume=1.6[out]', '-map', '[out]', '-ar', '44100', 'audio/voz.wav']
subprocess.run(cmd, check=True)
narr = [{'inicio': f['inicio'], 'fim': f['fim'], 'texto': f['texto'] if f['quem'] == 'N' else '— ' + f['quem'] + ': ' + f['texto']} for f in falas]
json.dump({'titulo': 'Imagine ter um irmão que é um encosto profissional', 'duracao': fim, 'falas': falas, 'narracao': narr, 'texto_final_tela': [round(t + 0.2, 1), fim]}, open('episodios/ep01/tempos.json', 'w'), ensure_ascii=False, indent=1)
for f in falas: print(f"{f['cena']} {f['quem']:6s} {f['inicio']:6.2f}–{f['fim']:6.2f}  {f['texto'][:60]}")
print('duração', fim)
