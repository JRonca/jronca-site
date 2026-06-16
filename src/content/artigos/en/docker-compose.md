---
title: "Docker in practice: dockerizing a real application with Docker Compose"
description: "How to create a Dockerfile, orchestrate services with Docker Compose, and spin up a Node.js application with PostgreSQL using a single command."
pubDate: 2026-06-09
category: devops
tags: ["docker", "docker-compose", "nodejs", "postgres", "devops", "containers"]
featured: true
---

Understanding what a container is marks the first step. The second is knowing
how to package your own application and connect it with other services (like a
database) without installing anything directly on your system. That's what the
Dockerfile and Docker Compose solve, and that's what this article covers.

The application code we'll dockerize is on GitHub (link in the references). It's
a Node.js server that saves names to a PostgreSQL database. The exercise is for
you to create the Dockerfile and the docker-compose.yml from scratch before
looking at the solution in the repository.

No installation walkthrough here. The official documentation covers that, and
the links are at the end.

## The Dockerfile

The Dockerfile is a text file that describes, instruction by instruction, how to
build your application's image. It's the recipe Docker follows to assemble the
environment where your code will run.

A Docker image is made of layers. Each Dockerfile instruction adds a layer on top
of the previous one, and Docker caches those layers. If you change only the
application code but not the dependencies, it reuses the cache from earlier layers
and rebuilds only what changed. This significantly speeds up builds in real
projects.

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

EXPOSE 3000

CMD ["node", "src/index.js"]
```

Instruction by instruction:

**`FROM node:20-alpine`** defines the base image. Every Dockerfile starts from
an existing image. `node:20-alpine` uses Node.js 20 on Alpine Linux, a minimal
distribution of roughly 5MB. The final image ends up much smaller than using
plain `node:20` (around 180MB vs 300MB+).

**`WORKDIR /app`** sets the working directory inside the container. All
subsequent commands run from there. Using `/app` for applications is a common
convention.

**`COPY package*.json ./` followed by `RUN npm install`** is the detail that
most impacts build performance. You copy only the dependency files first, install
them, and only then copy the rest of the code. The reason: Docker caches layer
by layer. If `package.json` hasn't changed, it skips `npm install` on the next
build and uses the cache. If you copied everything at once, any change to the
code (even a single comma) would invalidate the dependency cache and reinstall
everything.

**`COPY . .`** copies the rest of the project. Since code changes frequently,
it comes after `npm install` to avoid invalidating the dependency cache.

**`EXPOSE 3000`** documents that the application listens on port 3000. It doesn't
publish the port (that's done in Compose or with `docker run -p`). It's
documentation, not network configuration.

**`CMD ["node", "src/index.js"]`** is the command that runs when the container
starts. In array format (exec form), which is recommended because the process
receives OS signals directly (like SIGTERM on shutdown).

There's also the `.dockerignore`, which works just like `.gitignore` but for the
Docker build context. Without it, `COPY . .` copies the entire `node_modules`
into the image, which is the opposite of what you want (dependencies are already
installed inside the container by `npm install`).

```
node_modules/
.git/
*.md
.env
```

## The problem Docker Compose solves

You have your Node application's image. But it needs a PostgreSQL database to
work. How do you connect the two?

You could start Postgres in a separate container, find its IP, pass that IP to
the application. But container IPs change. It's fragile, it's manual, and it
doesn't scale to projects with three, four, or five services.

Docker Compose solves this elegantly: you describe all the project's services in
a YAML file (the `docker-compose.yml`). Compose creates an internal network for
those services, and within that network they find each other by service name, not
by IP. Your `app` service accesses the database simply as `db` (the name you gave
the service in the file). Compose resolves the DNS automatically.

With `docker compose up`, all services start together, in the right order, on the
same network, ready to communicate.

## The docker-compose.yml

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

Section by section:

**`services`** is where you define each service. The project has two: `db`
(the database) and `app` (the Node application).

**The `db` service** uses the official Postgres image directly from Docker Hub,
with no custom Dockerfile (there's nothing to customize). Environment variables
configure the database on first initialization. The `healthcheck` is an important
detail: Compose will verify that Postgres is actually ready to accept connections
before considering the service healthy. Without it, `app` could try to connect
before the database is ready and fail.

**The `volumes` section** of the `db` service maps a named volume
(`postgres_data`) to the Postgres data directory inside the container. Without
it, destroying the container deletes all data. With the volume, data persists on
your system even after `docker compose down`.

**The `app` service** uses `build: .` instead of a ready-made image. This tells
Compose to read the Dockerfile in the current directory and build the image before
starting the container. `ports` publishes port 3000 of the container on port 3000
of the host (format `host:container`).

**`DB_HOST: db`** is the central point of inter-service communication. It's not
an IP address, it's not `localhost`. It's `db`, the service name defined in the
file. Compose creates an internal network where services resolve each other by
name, exactly like a DNS. Any service in the same file can access the database
using the hostname `db`.

**`depends_on` with `condition: service_healthy`** ensures the startup order.
`app` only starts after `db` passes the healthcheck. This combination (healthcheck
on the database + depends_on with condition) prevents the classic "connection
refused" error when the application tries to connect before the database is ready
to accept connections.

**`volumes` (root level)** declares the named volumes used by the services.
Docker creates and manages them automatically.

## Starting everything

```bash
# Start all services (foreground, shows logs)
docker compose up

# Access in the browser
# http://localhost:3000

# Stop and remove containers (keeps volumes, data preserved)
docker compose down

# Stop and remove everything, including database data
docker compose down -v
```

On the first run, Compose builds the `app` image from the Dockerfile and downloads
the Postgres image. On subsequent runs, it uses the cache, except when the
Dockerfile or `package.json` change.

## The exercise

The application code is on GitHub (link in the references). Clone the repository,
read `src/index.js` and `public/index.html` to understand what the application
does, and try to create the `Dockerfile` and `docker-compose.yml` from scratch
before looking at the solution files in the repository.

The points where most people get stuck: the order of `COPY` and `RUN` instructions
in the Dockerfile (the layer cache) and the value of `DB_HOST` in Compose (service
name, not `localhost`). These are the two concepts that confuse most people who
are just starting with Docker.

## References

- Code on GitHub: https://github.com/JRonca/docker-compose
- Dockerfile reference: https://docs.docker.com/engine/reference/builder
- Docker Compose documentation: https://docs.docker.com/compose
- docker-compose.yml reference: https://docs.docker.com/compose/compose-file