---
title: "Brain Agriculture API"
description: "API backend para gestão de produção rural — produtores, propriedades, safras e culturas — com dashboard de métricas."
repo: "JRonca/brain-agriculture-api"
featured: true
year: 2025
role: "autor"
stack: ["NestJS", "TypeScript", "GraphQL", "Prisma", "PostgreSQL", "Docker", "Swagger"]
links:
  repo: "https://github.com/JRonca/brain-agriculture-api"
  demo: "https://brain-agriculture-api.onrender.com/api"
status: ativo
---

API backend para gerenciar informações de produção rural: cadastro e visualização
de produtores, propriedades, safras e culturas plantadas, mais um dashboard com
métricas e relatórios sobre as áreas cadastradas.

O serviço expõe uma API REST documentada com Swagger e também uma API GraphQL, para
consultas mais flexíveis e eficientes. O dashboard é servido via GraphQL.

## Arquitetura e decisões técnicas

- **Clean Architecture** com separação clara de camadas.
- **NestJS** como framework principal e **Prisma** como ORM sobre **PostgreSQL**.
- Validação de entrada com **Zod**, além de interceptadores e pipes do NestJS.
- Tratamento de erros global e logs estruturados.
- **Docker / Docker Compose** para subir aplicação e banco de forma consistente em
  dev e produção.
- Banco isolado para os testes e2e e suíte de testes (unitários + e2e) rodando no CI.
- Gate de qualidade de código com **SonarCloud**.
