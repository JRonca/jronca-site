---
title: "Linux na prática: qual distro escolher e os comandos que você vai usar todo dia"
description: "Como experimentar Linux sem risco, qual distribuição escolher pra começar, e os comandos essenciais do terminal."
pubDate: 2026-06-27
category: systems
tags: ["linux", "terminal", "comandos", "devops", "iniciante"]
featured: true
---

Entender o que Linux é e onde ele está (assunto do artigo anterior) é o primeiro
passo. O segundo é saber usar: qual distribuição escolher sem entrar em
paralisia de análise, como experimentar sem risco, e os comandos que aparecem
em 90% das situações reais.

Sem passo a passo de instalação detalhado aqui. O foco é o modelo mental e os
comandos que você vai usar de verdade, não uma lista pra decorar.

## Qual distro escolher

Pra quem está começando, a resposta mais honesta é Ubuntu ou Linux Mint. Não
porque sejam as melhores em alguma métrica técnica absoluta, mas porque têm a
maior comunidade, o maior volume de material de ajuda, e o menor atrito
inicial. Qualquer problema que você tiver, alguém já teve e documentou.

Isso não é uma sentença vitalícia. É um ponto de entrada. Depois que você
estiver confortável no terminal, entender o sistema de pacotes, e saber o que
quer de um sistema operacional, a discussão de distro faz mais sentido. Antes
disso é ruído.

Algumas opções valem menção pra contextos específicos:

**Pop!_OS** (baseado em Ubuntu) resolve um problema comum: suporte a placas
NVIDIA. Tem uma ISO com os drivers proprietários já embutidos, o que elimina
a principal dor de cabeça de quem tem placa NVIDIA e quer instalar Linux sem
configurar driver na mão.

**Manjaro** oferece uma experiência próxima do Arch (acesso ao AUR, rolling
release) com instalação mais amigável. Vale a ressalva: a comunidade Linux
tem uma visão dividida sobre o Manjaro, principalmente por atrasos históricos
em sincronizar com os pacotes do Arch, o que já causou problemas de pacotes
quebrados. Funciona, mas é bom estar ciente disso.

**Arch Linux** é pra quando você já entende o sistema, quer controle total
sobre cada componente instalado, e está disposto a configurar tudo manualmente.
Não é a recomendação pra quem está começando, mas é onde muitos acabam
chegando depois de meses de experiência com outras distros.

Uma observação sobre a discussão de distro em geral: ela tem uma tendência de
virar religião na comunidade. O kernel é o mesmo em todas. O que muda são as
escolhas de padrão, o gerenciador de pacotes, e a filosofia de atualização.
Essas diferenças importam pra casos de uso específicos, não pra quem está
escolhendo a primeira distro.

## Como experimentar sem risco

Antes de instalar qualquer coisa, três formas de experimentar com risco zero:

**Live USB.** Você baixa a ISO da distro, grava num pendrive com o Balena
Etcher ou o Ventoy, e boota o computador a partir dele. O Linux roda inteiro
na memória, sem tocar no seu disco. Desliga, tira o pendrive, seu sistema
volta exatamente como estava.

**WSL (Windows Subsystem for Linux).** Se você está no Windows, o WSL roda
um terminal Linux dentro do Windows sem VM, sem dual boot. É a forma mais
rápida de ter um terminal Linux funcional. Não substitui um Linux completo,
mas pra aprender os comandos e entender o sistema, funciona bem.

**Máquina virtual.** Vagrant, VirtualBox, VMware, todos permitem rodar um
Linux num ambiente isolado sem arriscar nada no sistema real. É o caminho
mais flexível pra experimentar diferentes distros sem compromisso.

## A estrutura do sistema

Antes dos comandos, vale entender o modelo mental. No Linux não existe
`C:\`. Existe `/`, a raiz do sistema, e tudo parte daí. Dispositivos,
arquivos de configuração, programas, dados do usuário, tudo é arquivo e
tudo tem um lugar definido nessa hierarquia.

Os diretórios mais frequentes:

```
/home    pastas pessoais dos usuários (equivalente ao C:\Users)
/etc     arquivos de configuração do sistema
/var     logs e dados que mudam com o tempo
/tmp     arquivos temporários, somem no reboot
/usr     programas instalados
/bin     comandos essenciais do sistema
```

Não precisa memorizar tudo de uma vez. Precisa saber que existe uma lógica
e onde procurar quando precisar.

## Comandos essenciais

Os comandos que aparecem na maioria das situações reais, organizados por
categoria.

### Navegação

```bash
pwd        # onde estou agora
ls         # lista o que tem na pasta atual
ls -la     # lista tudo, incluindo ocultos, com permissões e tamanhos
cd pasta   # entra na pasta
cd ..      # volta um nível
cd ~       # vai pra home, de qualquer lugar
```

O `ls -la` é um dos comandos mais usados no dia a dia. As permissões que
aparecem na saída (algo como `rwxr-xr-x`) são o sistema de controle de
acesso do Linux, um tópico em si que vale aprofundar depois.

### Arquivos e diretórios

```bash
mkdir nome         # cria pasta
touch arquivo      # cria arquivo vazio
cp origem destino  # copia
mv origem destino  # move ou renomeia (o mesmo comando faz os dois)
rm arquivo         # remove arquivo
rm -rf pasta       # remove pasta e todo o conteúdo
cat arquivo        # mostra o conteúdo no terminal
less arquivo       # mostra paginado (q para sair)
```

O `rm -rf` merece atenção redobrada. Não existe lixeira, não existe
confirmação por padrão, não existe desfazer. O que foi apagado com
`rm -rf` está apagado, e isso fica ainda mais sério quando combinado com
`sudo`.

### Sistema

```bash
sudo comando    # executa como administrador
apt update      # atualiza a lista de pacotes (Ubuntu/Debian)
apt install     # instala um pacote
ps aux          # lista os processos em execução
kill PID        # encerra um processo pelo ID
top             # monitor de processos em tempo real
df -h           # espaço em disco
free -h         # uso de memória
```

### Produtividade no terminal

```bash
man comando     # manual completo do comando
comando --help  # ajuda rápida
history         # histórico de comandos
Tab             # autocomplete (use sempre)
Ctrl+C          # cancela o processo atual
clear           # limpa o terminal
```

O atalho `Ctrl+R` merece destaque à parte: ele busca no histórico de
comandos conforme você digita qualquer parte do que já rodou antes. Pra
comandos longos que se repetem, é provavelmente o recurso mais subestimado
do terminal e o que mais muda a produtividade no dia a dia.

## O que vem depois

Com o conteúdo acima, dá pra navegar um sistema Linux, instalar software,
manipular arquivos, e entender o que está acontecendo. É a base suficiente
pra trabalhar com os outros tópicos já cobertos aqui, como Docker e Vagrant.

Os próximos passos naturais incluem permissões de arquivo (`chmod`,
`chown`), redirecionamento e pipes (onde o terminal realmente se torna
poderoso), e shell scripting pra automatizar tarefas repetitivas. Cada um
desses é assunto suficiente pra um artigo próprio.

Linux parece intimidador no começo porque é diferente do que a maioria
está acostumada, não porque é difícil. O modelo mental leva alguns dias
pra assentar, e depois o terminal se torna a ferramenta mais usada no
fluxo de trabalho.

## Referências

- Ubuntu: https://ubuntu.com
- Linux Mint: https://linuxmint.com
- Pop!_OS: https://pop.system76.com
- Manjaro: https://manjaro.org
- Documentação do Arch Wiki (útil mesmo para outras distros): https://wiki.archlinux.org
