---
title: "Máquinas Virtuais e Vagrant: do conceito ao ambiente como código"
description: "O que é virtualização, como o Vagrant automatiza VMs, e um lab prático reproduzível."
pubDate: 2026-06-01
category: devops
relatedVideo: "https://www.youtube.com/watch?v=n-IYGY9jlyY&t=11s"
mediumUrl: "https://medium.com/@jrfr21112000/m%C3%A1quinas-virtuais-e-vagrant-do-conceito-ao-ambiente-como-c%C3%B3digo-7ef7c3e41c38"
tags: ["vagrant", "virtualizacao", "vms", "devops", "infra"]
featured: true
---

Toda vez que você precisa testar algo sem bagunçar a própria máquina, rodar um
sistema diferente do seu, ou reproduzir um ambiente de servidor para validar uma
ideia, você está atrás de uma máquina virtual. Este artigo cobre o conceito, por
que o Vagrant existe, e um lab reproduzível que você pode subir com um comando.

Não há passo a passo de instalação aqui, a documentação oficial faz isso melhor,
e os links estão no fim. O foco é entender o que cada peça faz e ter um
`Vagrantfile` de referência que funciona.

## O que é uma máquina virtual

Uma máquina virtual (VM) é um computador completo simulado por software, rodando
dentro do seu computador real. Ela tem o próprio disco, a própria memória, o
próprio sistema operacional, tudo virtualizado. Para o software que roda lá
dentro, é como se fosse hardware de verdade; para o seu sistema, é só mais um
processo.

O isolamento é o ponto central. O que acontece dentro da VM fica dentro da VM: se
você quebrar o sistema lá, instalar algo problemático, ou testar uma configuração
destrutiva, a máquina real não sente. É um ambiente descartável e reproduzível.

## Hypervisor: a camada que torna isso possível

O hypervisor é o software que cria e gerencia as VMs, dividindo os recursos físicos
(CPU, memória, disco) entre elas. Existem dois tipos:

- **Tipo 1 (bare-metal):** roda direto sobre o hardware, sem um sistema operacional
  embaixo. É o modelo de servidores e nuvem. KVM (no Linux), VMware ESXi e Xen são
  exemplos. O Proxmox VE é a porta de entrada acessível para esse mundo: uma
  distribuição que entrega KVM com interface web, clustering e backups, muito
  usada em homelabs justamente por trazer virtualização de servidor para o
  hardware que você tem em casa.
- **Tipo 2 (hosted):** roda como uma aplicação em cima do seu sistema operacional.
  É o modelo de desktop. VirtualBox e VMware Workstation são exemplos.

A virtualização moderna depende de extensões do processador (Intel VT-x ou AMD-V)
que permitem rodar as VMs com performance próxima do nativo. Sem elas, a emulação
seria por software, lenta demais para uso prático.

## O problema que o Vagrant resolve

Criar uma VM na mão é repetitivo: baixar a ISO, instalar o sistema, configurar
rede, ajustar recursos, instalar dependências. Se você precisar de outra igual,
faz tudo de novo. Se precisar compartilhar esse ambiente com alguém, manda um
arquivo de vários gigabytes e torce para funcionar na máquina do outro.

O Vagrant ataca exatamente isso. Ele não é um virtualizador, é uma camada de
automação **sobre** os virtualizadores (VirtualBox, VMware, libvirt/KVM e outros).
Você descreve a VM que quer em um arquivo de texto, o `Vagrantfile`, e o Vagrant
cria tudo com um comando. O ambiente vira código: versionável, compartilhável, e
idêntico para qualquer pessoa que rode o mesmo arquivo.

## O Vagrantfile

O `Vagrantfile` é escrito em Ruby, mas você não precisa saber Ruby para usá-lo, a
estrutura é declarativa. Este é um exemplo funcional que sobe um Ubuntu, configura
rede e recursos, e instala o nginx automaticamente:

```ruby
Vagrant.configure("2") do |config|
  # Imagem base do sistema (a "box"), baixada uma vez e reutilizada
  config.vm.box = "bento/ubuntu-22.04"
  config.vm.hostname = "lab-vm"

  # Rede privada com IP fixo, acessível a partir do host
  config.vm.network "private_network", ip: "192.168.56.10"

  # Recursos da VM
  config.vm.provider "virtualbox" do |vb|
    vb.memory = 2048
    vb.cpus = 2
  end

  # Provisionamento: comandos que rodam quando a VM é criada
  config.vm.provision "shell", inline: <<-SHELL
    apt-get update
    apt-get install -y nginx
    echo "Ambiente provisionado por Vagrant" > /var/www/html/index.html
  SHELL
end
```

Cada bloco tem um papel: `config.vm.box` define o sistema base; o bloco
`provider` ajusta CPU e memória; o `provision` executa comandos na criação, é
aqui que o "ambiente como código" acontece, instalando o que você precisa sem
interação manual.

## Ciclo de vida

Os comandos essenciais cobrem todo o ciclo da VM:

```bash
vagrant up        # cria e sobe a VM (lê o Vagrantfile)
vagrant status    # mostra o estado atual
vagrant ssh       # entra na VM
vagrant halt      # desliga sem destruir
vagrant destroy   # apaga a VM completamente
```

O par `destroy` / `up` é o que dá o poder de verdade: você joga o ambiente fora e
recria idêntico em segundos. Errou na configuração? Destrói e sobe de novo. Esse
descarte sem custo é o que torna a VM um ambiente de experimentação seguro.

## Notas sobre providers

O provider é o virtualizador que o Vagrant aciona por baixo. A escolha tem
implicações práticas que valem registrar:

- **VirtualBox**: gratuito e multiplataforma (Windows, macOS, Linux). É o provider
  padrão do Vagrant e o de menor atrito para começar.
- **VMware (Workstation/Fusion)**: exige o plugin `vagrant-vmware-desktop` e o
  VMware Utility. Tem melhor suporte a recursos gráficos e 3D, útil para VMs com
  desktop. Em versões recentes, o linked clone pode esbarrar em limitações de
  snapshot dependendo da edição/versão; quando isso ocorre, `linked_clone = false`
  força full clone e contorna.
- **libvirt/KVM**: o caminho nativo no Linux. Performance próxima do bare-metal,
  sem virtualizador de terceiros. Exige o plugin `vagrant-libvirt`. Requer as
  extensões de virtualização do processador (VT-x/AMD-V) habilitadas.
- **Proxmox VE**: para quem já roda um servidor Proxmox, há plugins de comunidade
  que permitem ao Vagrant provisionar VMs diretamente nele, levando o mesmo
  conceito de "ambiente como código" para o hypervisor do homelab em vez da máquina
  local. É o passo natural quando o lab cresce e sai do desktop para um servidor
  dedicado.

Uma observação sobre coexistência: VMware e KVM podem conviver instalados na mesma
máquina, com a ressalva de não disputarem a virtualização de hardware rodando
ambos os hypervisors pesados ao mesmo tempo. Rede não conflita, cada um usa suas
próprias interfaces. VirtualBox e KVM, por outro lado, competem pelos mesmos
módulos de kernel e não rodam VMs simultaneamente sem gerenciamento de módulo.

## Por que isso importa

Entender VM e automação de ambiente é a base de praticamente tudo em infra moderna:
containers (o próximo degrau, mais leve), CI/CD, provisionamento de servidores,
laboratórios reproduzíveis. O Vagrant é uma porta de entrada concreta para o
conceito de "infraestrutura como código", a ideia de que ambientes devem ser
descritos em arquivos versionáveis, não montados na mão.

O passo natural a partir daqui são os containers, que entregam isolamento sem
carregar um sistema operacional inteiro por VM, assunto para outro texto.

## Referências

- Documentação oficial do Vagrant: <https://developer.hashicorp.com/vagrant/docs>
- Catálogo de boxes: <https://portal.cloud.hashicorp.com/vagrant/discover>
- Documentação do libvirt: <https://libvirt.org/docs.html>
