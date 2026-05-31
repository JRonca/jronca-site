---
title: "Hardening de Clusters Kubernetes"
description: "Práticas de hardening pra clusters Kubernetes em produção."
pubDate: 2026-05-30
category: k8s
tags: ["kubernetes", "security", "devsecops"]
featured: true
---

## Introdução

Este é um artigo de exemplo pra demonstrar o formato. Apague e escreva o seu.

O corpo é **Markdown** normal. Você pode usar:

- listas
- `código inline`
- blocos de código:

```bash
kubectl get pods -A
```

> Citações, tabelas, imagens — tudo funciona.

O frontmatter lá em cima (entre os `---`) é validado pelo schema Zod no
`content.config.ts`. Se faltar um campo obrigatório (`title`, `description`,
`pubDate`, `category`, `tags`), o build reclama na hora — então você nunca
publica um artigo mal-formado.

## Versão bilíngue

Este arquivo é a versão **PT**. A versão **EN** com o mesmo nome
(`en/kubernetes-hardening.md`) é o par espelhado — o seletor de idioma do site
troca entre as duas pelo slug compartilhado.
