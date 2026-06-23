---
title: "Linux: the kernel that moves the world"
description: "What Linux really is, where it runs, and why anyone working in tech needs to understand it."
pubDate: 2026-06-20
category: systems
tags: ["linux", "kernel", "devops", "opensource", "infrastructure"]
featured: true
---

In 1991, a Finnish student posted to a mailing list something along the lines of:
"I'm making an operating system, it probably won't be anything big." He released
the source code openly for anyone to use, modify, and contribute to. What happened
next is the largest collaborative software project in history.

Today that project has over 30 million lines of code, contributions from Google,
Intel, Red Hat, IBM, and thousands of independent developers. And it runs on 90%
of the world's servers, the phone in your pocket, the 500 fastest supercomputers
on the planet, and smart refrigerators.

No installation walkthrough here. That's for the next article. The focus now is
understanding what Linux really is and why it's everywhere.

## What Linux really is

Linux is not an operating system. Linux is a kernel, the core of the system, the
layer that sits between the hardware and the rest of the software. The kernel
decides how memory is allocated, how processes run, how the disk is accessed, how
the network functions. The hardware doesn't know how to execute a Python program
or open a browser. The kernel is the translator between what the software requests
and what the hardware does.

What most people call Linux (Ubuntu, Fedora, Arch, Debian) is actually a
distribution. A distro takes the Linux kernel and packages it together with a
graphical interface, command-line tools, a package manager, and everything else
that forms a usable system. The distro is the car. The kernel is the engine.

This distinction matters because it explains why there are hundreds of Linux
"versions", why Android is Linux but doesn't look like Linux, and why servers run
Linux with no graphical interface at all. The kernel is the common denominator.
What changes is everything built on top of it.

## Where Linux runs

### Servers and cloud

Over 90% of internet servers run Linux. AWS, Google Cloud, Azure, all major cloud
providers use Linux underneath. When you access any relevant web service, a Linux
server almost certainly responded.

It's the system of choice for infrastructure for concrete reasons: it's free (no
per-server license), it's stable (Linux systems running for years without rebooting
are common), it's lightweight (you control exactly what's installed, with no
unnecessary software consuming resources), and it has decades of battle-testing
in production.

### Android

Android is based on the Linux kernel. Every time you use your phone, the Linux
kernel is managing memory, processes, networking, and storage. It's not a
traditional Linux distro (it doesn't have the same commands, doesn't have the
same desktop environment), but the kernel underneath is the same 1991 project.

This means Linux is in the pocket of over 3 billion people, even if none of them
know it.

### Steam Deck and gaming

Valve bet on Linux to run Windows games via Proton, a compatibility layer that
translates Windows calls to Linux in real time. The Steam Deck runs SteamOS
(based on Arch Linux). AAA games that were previously Windows-exclusive run on
Linux via Proton with comparable performance.

This matters because gaming was historically the last barrier keeping users on
Windows. That barrier is being torn down.

### Supercomputers and scientific research

100% of the 500 fastest supercomputers in the world run Linux. From NASA to CERN,
through climate research centers and particle physics simulation. When you hear
about a scientific discovery that depended on massive computing, Linux is running
underneath.

The reason is the same as for servers: control, performance, and the ability to
customize the system down to the kernel level for specific use cases.

### Embedded systems and IoT

Routers, smart TVs, security cameras, industrial systems, cars, and smart
refrigerators. Linux runs on devices with minimal resources because it's modular
and can be compiled to include only what's needed for that specific hardware. An
embedded Linux can occupy less than 1MB.

### Personal desktop

The smallest market share of the five, but growing consistently. Developers,
sysadmins, and tech enthusiasts choose Linux as their primary system for control
over the system, privacy (no mandatory telemetry), proximity to development tools,
and because the terminal on Linux is a first-class citizen, not a secondary
feature.

## Why this matters for people working in tech

If you work with backend, DevOps, cloud, or security, you will inevitably interact
with Linux. It's not optional. Servers are Linux. Docker containers run on the
Linux kernel. CI pipelines run on Linux. Infrastructure tooling assumes Linux as
the default environment. Knowing how to navigate a Linux terminal is not a
differentiator, it's a requirement.

The point isn't that you need to abandon Windows or Mac. The point is that
understanding Linux makes you a more complete professional, regardless of where
you work. When something breaks on a server (and it will), you need to know what
you're looking at.

For desktop users, the proximity to tooling changes productivity. Everything
involving Docker, Vagrant, Kubernetes, and command-line tools in general is more
natural in a Linux environment because those tools were built for Linux first.

## The next step

Understanding what Linux is and where it runs is the first step. The second is
knowing how to use it: which distribution to choose, how to experiment without
risk, and the commands that show up in 90% of real situations. That's the subject
of the next article.

## References

- Official Linux kernel repository: <https://kernel.org>
- Distrowatch (distribution list): <https://distrowatch.com>
- Top500 (supercomputer rankings): <https://top500.org>
