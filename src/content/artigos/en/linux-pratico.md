---
title: "Linux in practice: which distro to choose and the commands you'll use every day"
description: "How to try Linux risk-free, which distribution to choose to get started, and the essential terminal commands."
pubDate: 2026-06-27
category: systems
tags: ["linux", "terminal", "commands", "devops", "beginner"]
featured: true
---

Understanding what Linux is and where it runs (the subject of the previous
article) is the first step. The second is knowing how to use it: which
distribution to choose without falling into analysis paralysis, how to try it
risk-free, and the commands that show up in 90% of real situations.

No detailed installation walkthrough here. The focus is the mental model and
the commands you'll actually use, not a list to memorize.

## Which distro to choose

For someone starting out, the most honest answer is Ubuntu or Linux Mint. Not
because they're the best on some absolute technical metric, but because they
have the largest community, the most help material available, and the lowest
initial friction. Whatever problem you run into, someone has already had it
and documented the fix.

This isn't a lifetime sentence. It's an entry point. Once you're comfortable
in the terminal, understand the package system, and know what you want from
an operating system, the distro discussion makes more sense. Before that,
it's noise.

A few options deserve mention for specific contexts:

**Pop!_OS** (Ubuntu-based) solves a common problem: NVIDIA GPU support. It
has an ISO with proprietary drivers already bundled, which eliminates the
main headache for anyone with an NVIDIA card who wants to install Linux
without manually configuring drivers.

**Manjaro** offers an Arch-like experience (AUR access, rolling release) with
a friendlier installation. Worth a caveat: the Linux community holds a mixed
view of Manjaro, mainly due to a history of delays syncing with Arch packages,
which has caused broken package issues in the past. It works, but it's good
to be aware of this.

**Arch Linux** is for when you already understand the system, want full
control over every installed component, and are willing to configure
everything manually. It's not the recommendation for someone starting out,
but it's where many end up after months of experience with other distros.

A note on the distro debate in general: it tends to turn into religion within
the community. The kernel is the same across all of them. What changes are
default choices, the package manager, and the update philosophy. Those
differences matter for specific use cases, not for someone choosing their
first distro.

## How to try it risk-free

Before installing anything, three ways to experiment with zero risk:

**Live USB.** You download the distro's ISO, write it to a USB drive with
Balena Etcher or Ventoy, and boot the computer from it. Linux runs entirely
in memory, without touching your disk. Shut down, remove the USB, and your
system is back exactly as it was.

**WSL (Windows Subsystem for Linux).** If you're on Windows, WSL runs a
Linux terminal inside Windows with no VM, no dual boot. It's the fastest way
to get a functional Linux terminal. It doesn't replace a full Linux
installation, but for learning commands and understanding the system, it
works well.

**Virtual machine.** Vagrant, VirtualBox, VMware, all let you run Linux in
an isolated environment without risking anything on your real system. It's
the most flexible path to try different distros without commitment.

## The system structure

Before the commands, it's worth understanding the mental model. There's no
`C:\` on Linux. There's `/`, the root of the system, and everything branches
from there. Devices, configuration files, programs, user data, everything is
a file and everything has a defined place in this hierarchy.

The most frequent directories:

```
/home    user home folders (equivalent to C:\Users)
/etc     system configuration files
/var     logs and data that change over time
/tmp     temporary files, cleared on reboot
/usr     installed programs
/bin     essential system commands
```

You don't need to memorize all of it at once. You need to know there's a
logic and where to look when you need to.

## Essential commands

The commands that show up in most real situations, organized by category.

### Navigation

```bash
pwd        # where am I right now
ls         # lists what's in the current directory
ls -la     # lists everything, including hidden, with permissions and sizes
cd folder  # enters the folder
cd ..      # goes up one level
cd ~       # goes to home, from anywhere
```

`ls -la` is one of the most commonly used commands day to day. The
permissions shown in the output (something like `rwxr-xr-x`) are Linux's
access control system, a topic worth diving into on its own later.

### Files and directories

```bash
mkdir name        # creates a folder
touch file        # creates an empty file
cp source dest    # copies
mv source dest    # moves or renames (same command does both)
rm file           # removes a file
rm -rf folder     # removes a folder and everything inside it
cat file          # shows the content in the terminal
less file         # shows it paginated (q to quit)
```

`rm -rf` deserves extra caution. There's no trash bin, no confirmation by
default, no undo. Whatever was deleted with `rm -rf` is gone, and that
becomes even more serious when combined with `sudo`.

### System

```bash
sudo command    # runs as administrator
apt update      # updates the package list (Ubuntu/Debian)
apt install     # installs a package
ps aux          # lists running processes
kill PID        # terminates a process by its ID
top             # real-time process monitor
df -h           # disk space
free -h         # memory usage
```

### Terminal productivity

```bash
man command     # full manual for the command
command --help  # quick help
history         # command history
Tab             # autocomplete (use it always)
Ctrl+C          # cancels the current process
clear           # clears the terminal
```

The `Ctrl+R` shortcut deserves special mention: it searches your command
history as you type any part of something you've run before. For long,
repeated commands, it's probably the most underrated feature of the
terminal and the one that most changes day-to-day productivity.

## What comes next

With the content above, you can navigate a Linux system, install software,
manipulate files, and understand what's happening. It's enough of a
foundation to work with the other topics already covered here, like Docker
and Vagrant.

The natural next steps include file permissions (`chmod`, `chown`),
redirection and pipes (where the terminal really becomes powerful), and
shell scripting to automate repetitive tasks. Each of those is enough subject
matter for its own article.

Linux feels intimidating at first because it's different from what most
people are used to, not because it's difficult. The mental model takes a
few days to settle in, and after that the terminal becomes the most used
tool in the workflow.

## References

- Ubuntu: https://ubuntu.com
- Linux Mint: https://linuxmint.com
- Pop!_OS: https://pop.system76.com
- Manjaro: https://manjaro.org
- Arch Wiki documentation (useful even for other distros): https://wiki.archlinux.org