---
title: "Brain Agriculture API"
description: "Backend API for managing agricultural production — farmers, properties, harvests, and crops — with a metrics dashboard."
repo: "JRonca/brain-agriculture-api"
featured: true
year: 2025
role: "author"
stack: ["NestJS", "TypeScript", "GraphQL", "Prisma", "PostgreSQL", "Docker", "Swagger"]
links:
  repo: "https://github.com/JRonca/brain-agriculture-api"
  demo: "https://brain-agriculture-api.onrender.com/api"
status: ativo
---

Backend API for managing rural production data: registering and viewing farmers,
rural properties, harvests, and planted crops, plus a dashboard with metrics and
reports over the registered areas.

The service exposes a REST API documented with Swagger and a GraphQL API for more
flexible, efficient queries. The dashboard is served via GraphQL.

## Architecture and technical decisions

- **Clean Architecture** with clear separation of layers.
- **NestJS** as the main framework and **Prisma** as the ORM over **PostgreSQL**.
- Input validation with **Zod**, plus NestJS interceptors and pipes.
- Global error handling and structured logging.
- **Docker / Docker Compose** to bring up the app and database consistently across
  dev and production.
- Isolated database for e2e tests and a test suite (unit + e2e) running in CI.
- Code-quality gate with **SonarCloud**.
