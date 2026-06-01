---
title: "Virtual Machines and Vagrant: from concept to environment as code"
description: "What virtualization is, how Vagrant automates VMs, and a reproducible hands-on lab."
pubDate: 2026-06-01
category: devops
tags: ["vagrant", "virtualization", "vms", "devops", "infra"]
featured: true
---

Every time you need to test something without messing up your own machine, run a
system different from yours, or reproduce a server environment to validate an idea,
what you're after is a virtual machine. This article covers the concept, why
Vagrant exists, and a reproducible lab you can spin up with a single command.

There's no installation walkthrough here — the official documentation does that
better, and the links are at the end. The focus is understanding what each piece
does and having a working `Vagrantfile` for reference.

## What a virtual machine is

A virtual machine (VM) is a complete computer simulated in software, running inside
your real computer. It has its own disk, its own memory, its own operating system —
all virtualized. To the software running inside it, it's like real hardware; to
your system, it's just another process.

Isolation is the central point. Whatever happens inside the VM stays inside the VM:
if you break the system in there, install something problematic, or test a
destructive configuration, the real machine doesn't feel it. It's a disposable,
reproducible environment.

## Hypervisor: the layer that makes it possible

The hypervisor is the software that creates and manages VMs, splitting the physical
resources (CPU, memory, disk) among them. There are two types:

- **Type 1 (bare-metal):** runs directly on the hardware, with no operating system
  underneath. It's the server and cloud model. KVM (on Linux), VMware ESXi, and Xen
  are examples. Proxmox VE is the accessible entry point to this world: a
  distribution that delivers KVM with a web interface, clustering, and backups —
  widely used in homelabs precisely because it brings server-grade virtualization
  to the hardware you already have at home.
- **Type 2 (hosted):** runs as an application on top of your operating system. It's
  the desktop model. VirtualBox and VMware Workstation are examples.

Modern virtualization relies on processor extensions (Intel VT-x or AMD-V) that
allow VMs to run with near-native performance. Without them, emulation would be
software-based — far too slow for practical use.

## The problem Vagrant solves

Creating a VM by hand is repetitive: download the ISO, install the system,
configure networking, adjust resources, install dependencies. If you need another
identical one, you do it all over again. If you need to share that environment with
someone, you send a multi-gigabyte file and hope it works on the other machine.

Vagrant tackles exactly this. It's not a virtualizer — it's an automation layer
**on top of** the virtualizers (VirtualBox, VMware, libvirt/KVM, and others). You
describe the VM you want in a text file, the `Vagrantfile`, and Vagrant creates
everything with one command. The environment becomes code: versionable, shareable,
and identical for anyone who runs the same file.

## The Vagrantfile

The `Vagrantfile` is written in Ruby, but you don't need to know Ruby to use it —
the structure is declarative. This is a working example that boots an Ubuntu,
configures networking and resources, and installs nginx automatically:

```ruby
Vagrant.configure("2") do |config|
  # Base system image (the "box"), downloaded once and reused
  config.vm.box = "bento/ubuntu-22.04"
  config.vm.hostname = "lab-vm"

  # Private network with a fixed IP, reachable from the host
  config.vm.network "private_network", ip: "192.168.56.10"

  # VM resources
  config.vm.provider "virtualbox" do |vb|
    vb.memory = 2048
    vb.cpus = 2
  end

  # Provisioning: commands that run when the VM is created
  config.vm.provision "shell", inline: <<-SHELL
    apt-get update
    apt-get install -y nginx
    echo "Environment provisioned by Vagrant" > /var/www/html/index.html
  SHELL
end
```

Each block has a role: `config.vm.box` defines the base system; the `provider`
block sets CPU and memory; the `provision` block runs commands on creation — this
is where "environment as code" happens, installing what you need without manual
interaction.

## Lifecycle

The essential commands cover the VM's full lifecycle:

```bash
vagrant up        # creates and boots the VM (reads the Vagrantfile)
vagrant status    # shows the current state
vagrant ssh       # enters the VM
vagrant halt      # shuts down without destroying
vagrant destroy   # deletes the VM completely
```

The `destroy` / `up` pair is what gives the real power: you throw the environment
away and recreate it identically in seconds. Misconfigured something? Destroy and
boot again. That zero-cost disposal is what makes a VM a safe experimentation
environment.

## Notes on providers

The provider is the virtualizer Vagrant drives underneath. The choice has practical
implications worth noting:

- **VirtualBox** — free and cross-platform (Windows, macOS, Linux). It's Vagrant's
  default provider and the lowest-friction one to start with.
- **VMware (Workstation/Fusion)** — requires the `vagrant-vmware-desktop` plugin and
  the VMware Utility. It has better support for graphical and 3D features, useful
  for VMs with a desktop. In recent versions, linked clone may run into snapshot
  limitations depending on the edition/version; when that happens,
  `linked_clone = false` forces a full clone and works around it.
- **libvirt/KVM** — the native path on Linux. Near bare-metal performance, with no
  third-party virtualizer. Requires the `vagrant-libvirt` plugin. Needs the
  processor's virtualization extensions (VT-x/AMD-V) enabled.
- **Proxmox VE** — if you already run a Proxmox server, community plugins let
  Vagrant provision VMs directly on it, taking the same "environment as code"
  concept to the homelab hypervisor instead of the local machine. It's the natural
  step when the lab grows and moves off the desktop to a dedicated server.

A note on coexistence: VMware and KVM can live installed on the same machine, with
the caveat of not competing for hardware virtualization by running both heavy
hypervisors at the same time. Networking doesn't conflict — each uses its own
interfaces. VirtualBox and KVM, on the other hand, compete for the same kernel
modules and won't run VMs simultaneously without module management.

## Why this matters

Understanding VMs and environment automation is the foundation of nearly everything
in modern infrastructure: containers (the next step, lighter), CI/CD, server
provisioning, reproducible labs. Vagrant is a concrete entry point to the concept
of "infrastructure as code" — the idea that environments should be described in
versionable files, not assembled by hand.

The natural next step from here is containers, which deliver isolation without
carrying a full operating system per VM — a topic for another article.

## References

- Official Vagrant documentation: <https://developer.hashicorp.com/vagrant/docs>
- Box catalog: <https://portal.cloud.hashicorp.com/vagrant/discover>
- libvirt documentation: <https://libvirt.org/docs.html>
