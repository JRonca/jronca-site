---
title: "Docker: why you'll never want to install anything on your computer again"
description: "What containers are, how Docker works, and why this technology changes the way you develop."
pubDate: 2026-06-09
category: devops
relatedVideo: "https://youtu.be/2jGVV_9tvC4?si=NWsWK_zicbf9zw7m"
mediumUrl: "https://medium.com/@jrfr21112000/docker-por-que-voc%C3%AA-nunca-mais-vai-querer-instalar-nada-no-seu-computador-aac5dff962d0?postPublishedType=initial"
tags: ["docker", "containers", "devops", "development", "infrastructure"]
featured: true
---

You've installed Postgres, broken your system, and spent hours trying to fix it?
Or heard "it works on my machine" and nearly lost your mind? Both problems share
the same root: dependencies installed directly on your operating system, mixed
together, conflicting, and impossible to reproduce exactly on another machine.
Docker solves this, and once you understand how, you'll wonder why it took so
long to learn it.

No installation walkthrough here, the official documentation handles that better,
and the links are at the end. The focus is understanding what each piece does.

## The problem Docker solves

When you install Postgres 14 for one project and the next one needs version 15,
both coexist on the same operating system competing over configurations, ports,
and environment variables. When you install Node 18 globally and a legacy project
needs Node 16, you're in a version management game that burns hours without
producing anything. When you configure everything perfectly on your machine and
send the code to a colleague, they spend the afternoon trying to reproduce the
same environment.

The problem isn't incompetence, it's architectural. Installing software directly
on the operating system means accumulating global state that grows, conflicts, and
becomes impossible to control with precision.

## What a container is

A container is an isolated process that carries everything it needs to run:
the runtime, the libraries, the dependencies, the configuration variables. From
the perspective of the software inside it, there's a dedicated operating system.
From your system's perspective, it's just another running process.

Isolation is the central point. What happens inside the container stays inside the
container. If you install something in there, mess up the configuration, or crash
the process, your real system doesn't feel it. And when you no longer need the
container, destroy it and everything's gone. No residue, no manual cleanup.

## Container vs Virtual Machine

The distinction matters because the isolation looks similar, but the mechanism
is completely different.

A virtual machine virtualizes the entire hardware and loads a complete operating
system inside. Each VM has its own kernel, its own drivers, its own memory
allocation (heavy, slow to start, expensive in resources). An Ubuntu VM takes
up ~2GB just for the base system.

A container shares the host system's kernel and isolates only the process and
its environment. There's no duplicated OS, no boot, no hardware virtualization
overhead. A Node.js image takes up ~180MB. A container starts in under a second.

The analogy: a VM is an entire house (foundation, walls, roof, plumbing, its own
electrical system). A container is an apartment in a building (each isolated, with
its own door, but sharing the building's structure). You don't rebuild the building
for each apartment.

## Minimum vocabulary

Three concepts that appear in everything Docker-related:

**Image:** the read-only template that describes the environment. Contains the
base system, installed dependencies, and configurations. It's immutable, you
don't modify a running image. The code analogy: image is the class, container is
the instantiated object.

**Container:** the running instance of an image. You can create dozens of
containers from the same image (each isolated, each with its own runtime state).
When the container stops, the ephemeral state disappears; the image remains intact.

**Registry:** the image repository. Docker Hub is the main one, it's where the
official images for Postgres, Node, Nginx, Redis, and practically everything you'll
need live. You don't need to build images from scratch for common dependencies:
you pull from the registry and use them.

## The first commands

Three commands that prove the concept without needing to understand everything
first:

```bash
# Confirms Docker is working
docker run hello-world

# Starts an Nginx server without installing Nginx
docker run --rm -p 8080:80 nginx

# Enters an Ubuntu without installing Ubuntu
docker run -it --rm ubuntu bash
```

The second command is the most revealing: you have a web server responding at
`localhost:8080` without having installed anything on the system. When you end
the process, everything's gone, no uninstalling, no residue. That's what changes
the way you think about dependencies.

The third closes the loop with the VM comparison: you're inside an Ubuntu in
under a second, no boot, no ISO, no configured hypervisor. Exit with `exit` and
the container is automatically destroyed by `--rm`.

Two context commands that show Docker's state:

```bash
docker images    # locally cached images (they persist)
docker ps -a     # all containers, including stopped ones
```

The second time you run Nginx, it starts instantly, the image is already in the
local cache. This illustrates the separation between image (persistent, reusable)
and container (ephemeral, disposable).

## Why this changes the way you develop

Each dependency of your project (database, cache, message broker, web server)
becomes a container. You define the environment in code, version it alongside the
project, and anyone who clones the repository spins up the same environment with
one command. No "how to set up the local environment" documentation, no "works
on my machine", no conflict between projects that need different versions of the
same dependency.

It's the infrastructure-as-code concept applied to the development environment,
the same principle as Vagrant covered before, but without the weight of a full VM
per dependency.

The natural next step is Docker Compose: orchestrating multiple containers
(application + database + cache) with a single file, where each service has its
isolated environment and they communicate over a network you define. That's the
subject of the next article and video, with a hands-on exercise for you to
dockerize a real application.

## References

- Official Docker documentation: https://docs.docker.com
- Docker Hub (image registry): https://hub.docker.com
- Command reference: https://docs.docker.com/engine/reference/commandline/cli