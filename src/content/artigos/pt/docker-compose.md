---
title: "Docker na prática: dockerizando uma aplicação real com Docker Compose"
description: "Como criar um Dockerfile, orquestrar serviços com Docker Compose, e subir uma aplicação Node.js com PostgreSQL com um comando."
pubDate: 2026-06-09
category: devops
tags: ["docker", "docker-compose", "nodejs", "postgres", "devops", "containers"]
featured: true
---

Entender o que é um container é o primeiro passo. O segundo é saber empacotar
sua própria aplicação e conectá-la com outros serviços, como um banco de dados,
sem instalar nada diretamente no seu sistema. É isso que o Dockerfile e o Docker
Compose resolvem, e é o que este artigo cobre.

O código da aplicação que vamos dockerizar está no GitHub (link nas referências).
É um servidor Node.js que cadastra nomes num banco PostgreSQL. O exercício é você
criar o Dockerfile e o docker-compose.yml do zero antes de olhar a solução no
repositório.

Sem passo a passo de instalação aqui. A documentação oficial cobre isso, e os
links estão no fim.

## O Dockerfile

O Dockerfile é um arquivo de texto que descreve, instrução por instrução, como
construir a imagem da sua aplicação. É a receita que o Docker segue pra montar
o ambiente onde seu código vai rodar.

Uma imagem Docker é feita de camadas. Cada instrução do Dockerfile adiciona uma
camada por cima da anterior, e o Docker cacheia essas camadas. Se você mudar
só o código da aplicação mas não as dependências, ele reutiliza o cache das
camadas anteriores e reconstrói só o que mudou. Isso acelera muito o build em
projetos reais.

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

EXPOSE 3000

CMD ["node", "src/index.js"]
```

Instrução por instrução:

**`FROM node:20-alpine`** define a imagem base. O ponto de partida de qualquer
Dockerfile é uma imagem existente. `node:20-alpine` usa o Node.js 20 sobre
Alpine Linux, uma distribuição minimalista de aproximadamente 5MB. A imagem
final fica muito menor do que usar `node:20` puro (cerca de 180MB vs 300MB+).

**`WORKDIR /app`** define o diretório de trabalho dentro do container. Todos
os comandos seguintes rodam a partir dali. É uma convenção usar `/app` para
aplicações.

**`COPY package*.json ./` seguido de `RUN npm install`** é o detalhe que mais
impacta a performance do build. Você copia primeiro só os arquivos de
dependência, instala, e só depois copia o resto do código. O motivo: o Docker
cacheia camada por camada. Se o `package.json` não mudou, ele pula o
`npm install` no próximo build e usa o cache. Se você copiasse tudo de uma vez,
qualquer mudança no código (mesmo uma vírgula) invalidaria o cache das
dependências e reinstalaria tudo.

**`COPY . .`** copia o restante do projeto. Como o código muda com frequência,
fica depois do `npm install` pra não invalidar o cache das dependências.

**`EXPOSE 3000`** documenta que a aplicação escuta na porta 3000. Não publica
a porta (isso é feito no Compose ou no `docker run -p`). É documentação,
não configuração de rede.

**`CMD ["node", "src/index.js"]`** é o comando que roda quando o container
sobe. No formato de array (exec form), que é o recomendado porque o processo
recebe os sinais do sistema operacional diretamente (como SIGTERM no shutdown).

Existe também o `.dockerignore`, que funciona igual ao `.gitignore` mas para o
contexto de build do Docker. Sem ele, o `COPY . .` copia o `node_modules` inteiro
pra dentro da imagem, que é o oposto do que você quer (as dependências já são
instaladas dentro do container pelo `npm install`).

```
node_modules/
.git/
*.md
.env
```

## O problema que o Docker Compose resolve

Você tem a imagem da sua aplicação Node. Mas ela precisa de um banco PostgreSQL
pra funcionar. Como você conecta os dois?

Você poderia subir o Postgres num container separado, descobrir o IP dele, passar
esse IP pra aplicação. Mas IP de container muda. É frágil, é manual, e não escala
pra projetos com três, quatro, cinco serviços.

O Docker Compose resolve isso de forma elegante: você descreve todos os serviços
do projeto num arquivo YAML (o `docker-compose.yml`). O Compose cria uma rede
interna pra esses serviços, e dentro dessa rede eles se encontram pelo nome do
serviço, não por IP. Seu serviço `app` acessa o banco simplesmente como `db`,
que é o nome que você deu ao serviço no arquivo. O Compose resolve o DNS
automaticamente.

Com `docker compose up`, todos os serviços sobem juntos, na ordem certa, na
mesma rede, prontos pra se comunicar.

## O docker-compose.yml

```yaml
services:

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB:       nomes
      POSTGRES_USER:     postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DB_HOST:     db
      DB_PORT:     5432
      DB_NAME:     nomes
      DB_USER:     postgres
      DB_PASSWORD: postgres
      PORT:        3000
    depends_on:
      db:
        condition: service_healthy

volumes:
  postgres_data:
```

Seção por seção:

**`services`** é onde você define cada serviço. No projeto são dois: `db`
(o banco) e `app` (a aplicação Node).

**O serviço `db`** usa a imagem oficial do Postgres direto do Docker Hub, sem
Dockerfile próprio (não precisamos customizar nada). As variáveis de ambiente
configuram o banco na primeira inicialização. O `healthcheck` é um detalhe
importante: o Compose vai verificar se o Postgres está realmente pronto para
aceitar conexões antes de considerar o serviço saudável. Sem ele, o `app`
poderia tentar conectar antes do banco estar pronto e falhar.

**O `volumes`** do serviço `db` mapeia um volume nomeado (`postgres_data`) para
o diretório de dados do Postgres dentro do container. Sem isso, destruir o
container apaga todos os dados. Com o volume, os dados persistem no seu sistema
mesmo após `docker compose down`.

**O serviço `app`** usa `build: .` em vez de uma imagem pronta. Isso instrui
o Compose a ler o Dockerfile na pasta atual e construir a imagem antes de subir
o container. O `ports` publica a porta 3000 do container na porta 3000 do host
(formato `host:container`).

**`DB_HOST: db`** é o ponto central da comunicação entre serviços. Não é um
endereço IP, não é `localhost`. É `db`, o nome do serviço definido no arquivo.
O Compose cria uma rede interna onde os serviços se resolvem pelo nome,
exatamente como um DNS. Qualquer serviço no mesmo arquivo pode acessar o banco
pelo hostname `db`.

**`depends_on` com `condition: service_healthy`** garante a ordem de
inicialização. O `app` só sobe depois que o `db` passar no healthcheck. Essa
combinação (healthcheck no banco + depends_on com condition) evita o erro
clássico de "connection refused" quando a aplicação tenta conectar antes do
banco estar pronto para aceitar conexões.

**`volumes` (nível raiz)** declara os volumes nomeados usados pelos serviços.
O Docker cria e gerencia automaticamente.

## Subindo tudo

```bash
# Sobe todos os serviços (foreground, mostra os logs)
docker compose up

# Acesse no navegador
# http://localhost:3000

# Parar e remover os containers (mantém os volumes, dados preservados)
docker compose down

# Parar e remover tudo, incluindo os dados do banco
docker compose down -v
```

Na primeira execução, o Compose constrói a imagem do `app` a partir do
Dockerfile e baixa a imagem do Postgres. Nas próximas execuções, usa o cache,
exceto se o Dockerfile ou o `package.json` mudarem.

## O exercício

O código da aplicação está no GitHub (link nas referências). Clone o repositório,
leia o `src/index.js` e o `public/index.html` pra entender o que a aplicação faz,
e tente criar o `Dockerfile` e o `docker-compose.yml` do zero antes de olhar os
arquivos de solução que estão no repositório.

Os pontos onde a maioria trava: a ordem das instruções `COPY` e `RUN` no
Dockerfile (o cache de camadas) e o valor de `DB_HOST` no Compose (nome do
serviço, não `localhost`). São os dois conceitos que mais confundem quem está
começando com Docker.

## Referências

- Código no GitHub: https://github.com/JRonca/docker-compose
- Documentação do Dockerfile: https://docs.docker.com/engine/reference/builder
- Documentação do Docker Compose: https://docs.docker.com/compose
- Referência do docker-compose.yml: https://docs.docker.com/compose/compose-file
