---
title: "Kubernetes Cluster Hardening"
description: "Hardening practices for production Kubernetes clusters."
pubDate: 2026-05-30
category: k8s
tags: ["kubernetes", "security", "devsecops"]
featured: true
---

## Introduction

This is a sample article demonstrating the format. Delete it and write your own.

The body is plain **Markdown**. You can use:

- lists
- `inline code`
- code blocks:

```bash
kubectl get pods -A
```

> Quotes, tables, images — everything works.

The frontmatter above (between the `---`) is validated by the Zod schema in
`content.config.ts`. If a required field is missing (`title`, `description`,
`pubDate`, `category`, `tags`), the build fails immediately — so you never ship
a malformed article.

## Bilingual setup

This file is the **EN** version. The **PT** version with the same filename
(`pt/kubernetes-hardening.md`) is its mirrored pair — the site's language
switcher toggles between them via the shared slug.
