---
title: "Docker: por que você nunca mais vai querer instalar nada no seu computador"
description: "O que são containers, como o Docker funciona, e por que essa tecnologia muda a forma como você desenvolve."
pubDate: 2026-06-09
category: devops
relatedVideo: "https://youtu.be/2jGVV_9tvC4?si=NWsWK_zicbf9zw7m"
mediumUrl: "https://medium.com/@jrfr21112000/docker-por-que-voc%C3%AA-nunca-mais-vai-querer-instalar-nada-no-seu-computador-aac5dff962d0?postPublishedType=initial"
tags: ["docker", "containers", "devops", "desenvolvimento", "infraestrutura"]
featured: true
---

Você já instalou o Postgres, bagunçou o sistema, e passou horas tentando
consertar? Ou ouviu "funcionou na minha máquina" e quase perdeu a cabeça?
Esses dois problemas têm a mesma raiz: dependências instaladas diretamente no
seu sistema operacional, misturadas, conflitando, e impossíveis de reproduzir
com exatidão em outra máquina. O Docker resolve isso, e quando você entender
como, vai se perguntar por que demorou tanto pra aprender.

Sem instalação passo a passo aqui, a documentação oficial cobre isso melhor,
e os links estão no fim. O foco é entender o que cada peça faz.

## O problema que o Docker resolve

Quando você instala o Postgres 14 pra um projeto e o próximo precisa do 15,
os dois coexistem no mesmo sistema operacional disputando configurações, portas
e variáveis de ambiente. Quando você instala o Node 18 globalmente e um projeto
legado precisa do 16, você entra num jogo de versões que consome horas sem
produzir nada. Quando você configura tudo certinho na sua máquina e manda o
código pro colega, ele passa a tarde tentando reproduzir o mesmo ambiente.

O problema não é incompetência, é arquitetural. Instalar software diretamente
no sistema operacional é acumular estado global que cresce, conflita e se torna
impossível de controlar com precisão.

## O que é um container

Um container é um processo isolado que carrega tudo que precisa pra rodar:
o runtime, as bibliotecas, as dependências, as variáveis de configuração.
Do ponto de vista do software dentro dele, existe um sistema operacional inteiro
dedicado. Do ponto de vista do seu sistema, é só mais um processo rodando.

O isolamento é o ponto central. O que acontece dentro do container fica dentro
do container. Se você instalar algo lá dentro, bagunçar as configurações, ou
travar o processo, seu sistema real não sente. E quando você não precisa mais
do container, destrói e some tudo. Sem resíduo, sem limpeza manual.

## Container vs Máquina Virtual

A distinção importa porque o isolamento parece similar, mas o mecanismo é
completamente diferente.

Uma máquina virtual virtualiza o hardware inteiro e carrega um sistema
operacional completo por dentro. Cada VM tem seu próprio kernel, seus próprios
drivers, sua própria alocação de memória (pesada, lenta pra iniciar, cara em
recursos). Uma VM com Ubuntu ocupa ~2GB só do sistema base.

Um container compartilha o kernel do sistema host e isola apenas o processo e
seu ambiente. Não há SO duplicado, não há boot, não há overhead de
virtualização de hardware. Uma imagem de Node.js ocupa ~180MB. Um container
sobe em menos de um segundo.

A analogia: VM é uma casa inteira (fundação, paredes, teto, encanamento,
sistema elétrico próprio). Container é um apartamento num prédio (cada um
isolado, com sua própria porta, mas compartilhando a estrutura do prédio).
Você não reconstrói o prédio pra cada apartamento.

## Vocabulário mínimo

Três conceitos que aparecem em tudo relacionado ao Docker:

**Imagem:** o template read-only que descreve o ambiente. Contém o sistema
base, as dependências instaladas, as configurações. É imutável, você não
modifica uma imagem em execução. A analogia de código: imagem é a classe,
container é o objeto instanciado.

**Container:** a instância em execução de uma imagem. Você pode criar dezenas
de containers a partir da mesma imagem (cada um isolado, cada um com seu
próprio estado em execução). Quando o container para, o estado efêmero some;
a imagem permanece intacta.

**Registry:** o repositório de imagens. O Docker Hub é o principal, é onde
ficam as imagens oficiais do Postgres, Node, Nginx, Redis, e praticamente
tudo que você vai precisar. Você não precisa criar imagens do zero pra
dependências comuns: você puxa do registry e usa.

## Os primeiros comandos

Três comandos que provam o conceito sem precisar entender tudo primeiro:

```bash
# Confirma que o Docker está funcionando
docker run hello-world

# Sobe um servidor Nginx sem instalar o Nginx
docker run --rm -p 8080:80 nginx

# Entra num Ubuntu sem instalar o Ubuntu
docker run -it --rm ubuntu bash
```

O segundo comando é o mais revelador: você tem um servidor web respondendo em
`localhost:8080` sem ter instalado nada no sistema. Quando você encerra o
processo, some tudo, sem desinstalar, sem resíduo. Isso é o que muda a forma
de pensar sobre dependências.

O terceiro fecha o loop com a comparação de VMs: você está dentro de um Ubuntu
em menos de um segundo, sem boot, sem ISO, sem hypervisor configurado. Sai
com `exit` e o container é destruído automaticamente pelo `--rm`.

Dois comandos de contexto que mostram o estado do Docker:

```bash
docker images    # imagens baixadas localmente (ficam em cache)
docker ps -a     # todos os containers, incluindo os parados
```

Na segunda vez que você rodar o Nginx, sobe instantaneamente, a imagem já
está no cache local. Isso ilustra a separação entre imagem (persistente,
reutilizável) e container (efêmero, descartável).

## Por que isso muda a forma de desenvolver

Cada dependência do seu projeto (banco de dados, cache, message broker,
servidor web) vira um container. Você define o ambiente em código, versiona
junto com o projeto, e qualquer pessoa que clonar o repositório sobe o mesmo
ambiente com um comando. Sem documentação de "como configurar o ambiente
local", sem "funcionou na minha máquina", sem conflito entre projetos que
precisam de versões diferentes da mesma dependência.

É o conceito de infraestrutura como código aplicado ao ambiente de
desenvolvimento, o mesmo princípio do Vagrant que vimos antes, mas sem o
peso de uma VM completa por dependência.

O próximo passo natural é o Docker Compose: orquestrar múltiplos containers
(aplicação + banco + cache) com um arquivo só, onde cada serviço tem seu
ambiente isolado e eles se comunicam numa rede definida por você.
Esse é o assunto do próximo artigo e vídeo, com um exercício prático pra
você dockerizar uma aplicação real.

## Referências

- Documentação oficial do Docker: https://docs.docker.com
- Docker Hub (registry de imagens): https://hub.docker.com
- Referência de comandos: https://docs.docker.com/engine/reference/commandline/cli