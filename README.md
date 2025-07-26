# 🎵 Lo-Fi Radio Jow Bot

<div align="center">

![Lo-Fi Radio Jow](lofi.png)

**Um bot Discord especializado em música Lo-Fi com estações temáticas e experiência 24/7**

[![Version](https://img.shields.io/badge/version-1.0.1-blue.svg)](https://github.com/jonathasfrontend/lofiradiojow)
[![License](https://img.shields.io/badge/license-Custom-orange.svg)](LICENSE)
[![Discord.js](https://img.shields.io/badge/discord.js-v14.16.3-blue.svg)](https://discord.js.org/)
[![Node.js](https://img.shields.io/badge/node.js-v16+-green.svg)](https://nodejs.org/)

</div>

---

## 📋 **Sumário**

- [🎯 Introdução](#-introdução)
- [⚡ Recursos Principais](#-recursos-principais)
- [🛠️ Tecnologias](#️-tecnologias)
- [📦 Instalação](#-instalação)
- [⚙️ Configuração](#️-configuração)
- [🏗️ Estrutura do Projeto](#️-estrutura-do-projeto)
- [🤖 Comandos](#-comandos)
- [🎮 Funcionalidades Avançadas](#-funcionalidades-avançadas)
- [🔧 Modelos de Dados](#-modelos-de-dados)
- [📊 Sistema de Logs](#-sistema-de-logs)
- [🚀 Execução](#-execução)
- [🤝 Contribuição](#-contribuição)
- [📄 Licença](#-licença)

---

## 🎯 **Introdução**

O **Lo-Fi Radio Jow** é um bot Discord premium desenvolvido para proporcionar uma experiência musical imersiva e relaxante. Especializado em música Lo-Fi, oferece múltiplas estações temáticas, reprodução contínua 24/7 e recursos avançados de personalização, tornando-se a solução perfeita para criar ambientes sonoros únicos em servidores Discord.

---

## ⚡ **Recursos Principais**

### 🎵 **Sistema Musical Avançado**
- **14 Estações Temáticas**: Lo-Fi Default, Study, Anime, Gaming, Sleep, Jazz, Synthwave, K-pop, Gospel e mais
- **Reprodução 24/7**: Música contínua sem interrupções
- **Sistema de Favoritos**: Colecione suas músicas preferidas
- **Controle de Volume**: Ajuste fino de 0 a 100%
- **Sleep Timer**: Temporizador inteligente para relaxamento

### 🛡️ **Recursos de Gerenciamento**
- **Modo DJ**: Sistema de permissões avançado
- **Auto-Reconnect**: Reconexão automática após quedas
- **Sistema de Logs**: Monitoramento completo de atividades
- **Multi-Guild**: Suporte a múltiplos servidores

### 🎨 **Interface Intuitiva**
- **Embeds Responsivos**: Interface visual elegante
- **Menus Interativos**: Seleção fácil de estações
- **Feedback Visual**: Emojis e cores temáticas
- **Status Dinâmico**: Informações em tempo real

---

## 🛠️ **Tecnologias**

### **Core**
- **Node.js** v16+ - Runtime JavaScript
- **Discord.js** v14.16.3 - API Discord
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** v8.8.3 - ODM MongoDB

### **Áudio & Streaming**
- **Kazagumo** v3.2.1 - Gerenciador de áudio
- **Shoukaku** v4.1.1 - Wrapper Lavalink
- **Kazagumo-Spotify** v2.1.0 - Integração Spotify
- **Lavalink** v2.13.0 - Servidor de áudio

### **Utilitários**
- **Winston** v3.17.0 - Sistema de logs
- **Moment** v2.30.1 - Manipulação de datas
- **Chalk** v5.4.1 - Cores no terminal
- **Dotenv** v16.4.5 - Variáveis de ambiente

---

## 📦 **Instalação**

### **Pré-requisitos**
```bash
# Verifique as versões
node --version  # v16 ou superior
npm --version   # v8 ou superior
```

### **Clone o Repositório**
```bash
git clone https://github.com/jonathasfrontend/lofiradiojow.git
cd lofiradiojow
```

### **Instale as Dependências**
```bash
npm install
```

---

## ⚙️ **Configuração**

### **1. Variáveis de Ambiente**
Crie um arquivo `.env` na raiz do projeto:

```env
# Discord Bot
TOKEN=SEU_TOKEN_DO_BOT_DISCORD

# MongoDB
MONGO_URI=mongodb://localhost:27017/lofiradiojow

# Spotify (Opcional)
SPOTIFY_CLIENT_ID=SEU_CLIENT_ID_SPOTIFY
SPOTIFY_CLIENT_SECRET=SEU_CLIENT_SECRET_SPOTIFY

# Lavalink
NODE_URL=ws://localhost:2333
NODE_AUTH=youshallnotpass
NODE_SECURE=false
```

### **2. Configuração do Lavalink**
Certifique-se de ter um servidor Lavalink rodando:

```yaml
# application.yml (Lavalink)
server:
  port: 2333
  address: 0.0.0.0

lavalink:
  server:
    password: "youshallnotpass"
    sources:
      youtube: true
      bandcamp: true
      soundcloud: true
      twitch: true
      vimeo: true
      http: true
      local: false
```

### **3. MongoDB**
Configure uma instância MongoDB local ou remota. O bot criará automaticamente as coleções necessárias.

---

## 🏗️ **Estrutura do Projeto**

```plaintext
📁 Lo-Fi Radio Jow/
├── 📄 package.json              # Configurações do projeto
├── 📄 README.md                 # Documentação
├── 📄 LICENSE                   # Licença
├── 🖼️ lofi.png                  # Logo do bot
├── 🖼️ bg.png                    # Background
├── 📁 emote/                    # Emojis personalizados
│   ├── 🎵 radio.png
│   ├── ❤️ heart.png
│   ├── 🔊 loud.png
│   └── ...
├── 📁 src/
│   ├── 📄 index.js              # Arquivo principal
│   ├── 📄 Client.js             # Cliente Discord
│   ├── 📄 Logger.js             # Sistema de logs
│   ├── 📁 commands/             # Comandos do bot
│   │   ├── 📁 Music/            # Comandos musicais
│   │   │   ├── 🎵 Play.js       # Iniciar reprodução
│   │   │   ├── 📻 station.js    # Trocar estação
│   │   │   ├── ⏹️ stop.js       # Parar música
│   │   │   ├── 🎶 song.js       # Info da música
│   │   │   ├── 🔊 volume.js     # Controle de volume
│   │   │   └── 😴 sleep.js      # Timer de sono
│   │   ├── 📁 Information/      # Comandos informativos
│   │   │   └── ❓ ajuda.js      # Sistema de ajuda
│   │   ├── 📁 profile/          # Perfil do usuário
│   │   │   └── ⭐ collection.js # Músicas favoritas
│   │   ├── 📁 Settings/         # Configurações
│   │   │   └── ⚙️ mode.js       # Modos do bot
│   │   └── 👋 Oi.js             # Comando de saudação
│   ├── 📁 config/               # Configurações
│   │   ├── 🎵 kazagumo.js       # Config do player
│   │   └── 🗄️ bdServerConect.js # Conexão MongoDB
│   ├── 📁 functions/            # Funções utilitárias
│   │   └── 📊 statusBot.js      # Status do bot
│   ├── 📁 logs/                 # Arquivos de log
│   │   ├── 📄 bot.log
│   │   ├── 📄 error.log
│   │   └── ...
│   ├── 📁 models/               # Modelos MongoDB
│   │   ├── 📻 station.js        # Estações por servidor
│   │   ├── 🎧 dj.js             # Sistema DJ
│   │   ├── ⚙️ mode.js           # Modos do bot
│   │   ├── 🎵 playlist.js       # Playlists dos usuários
│   │   └── 🔄 autoReconnect.js  # Auto-reconexão
│   ├── 📁 songs/                # Estações musicais
│   │   ├── 🎵 default.json      # Lo-Fi Default
│   │   ├── 📚 study.json        # Study Lo-Fi
│   │   ├── 🌸 anime.json        # Anime Lo-Fi
│   │   ├── 🎮 gaming.json       # Gaming Lo-Fi
│   │   ├── 😴 sleep.json        # Sleep Lo-Fi
│   │   ├── 🌆 synthwave.json    # Synthwave
│   │   ├── ⛩️ japanese.json     # Japanese Lo-Fi
│   │   ├── 🇰🇷 kpop.json        # K-pop Lo-Fi
│   │   ├── 🎷 jazz.json         # Lo-Fi Jazz
│   │   ├── 🎤 covers.json       # Lo-Fi Covers
│   │   ├── 🎄 christmas.json    # Christmas Lo-Fi
│   │   ├── ✨ mix.json          # Lo-Fi Mix
│   │   ├── 🎃 halloween.json    # Halloween Lo-Fi
│   │   └── ✝️ gospel.json       # Gospel Lo-Fi
│   └── 📁 utils/                # Utilitários
│       └── ⚙️ options.js        # Opções do bot
```
---

## 🤖 **Comandos**

### 🎵 **Comandos Musicais**

| Comando | Descrição | Uso |
|---------|-----------|-----|
| `/play` | Inicia reprodução 24/7 no canal de voz | `/play` |
| `/station` | Abre menu para trocar estação | `/station` |
| `/stop` | Para a música e desconecta o bot | `/stop` |
| `/song` | Exibe informações da música atual | `/song` |
| `/volume` | Ajusta volume (0-100) | `/volume [valor]` |
| `/sleep` | Ativa timer de sono + estação Sleep | `/sleep [minutos]` |

### ℹ️ **Comandos Informativos**

| Comando | Descrição | Uso |
|---------|-----------|-----|
| `/ajuda` | Mostra lista completa de comandos | `/ajuda` |
| `/oi` | Saudação interativa do bot | `/oi` |

### 👤 **Comandos de Perfil**

| Comando | Descrição | Uso |
|---------|-----------|-----|
| `/collection` | Visualiza suas músicas favoritas | `/collection` |

### ⚙️ **Comandos de Configuração**

| Comando | Descrição | Uso |
|---------|-----------|-----|
| `/mode` | Configura modos do bot (Auto-reconnect, DJ) | `/mode` |
| `/djmode-add` |Adiciona um cargo DJ autorizado para usar funções de DJ.| `/djmode-add [role]` |
| `/djmode-remove` |Remove todos os cargos DJ do servidor atual.| `/djmode-remove` |
| `/djmode-toggle` |Alterna entre habilitar ou desabilitar o modo DJ no servidor.| `/djmode-toggle [djOn ou djOff]` |

---

## 🎮 **Funcionalidades Avançadas**

### 📻 **Estações Disponíveis**

| Estação | Emoji | Descrição |
|---------|-------|-----------|
| **Default** | 📻 | Lo-Fi clássico e relaxante |
| **Study** | 📚 | Foco e concentração para estudos |
| **Anime** | 🌸 | Lo-Fi com temas de anime |
| **Gaming** | 🎮 | Energético para sessões de jogos |
| **Sleep** | 😴 | Suave e calmante para dormir |
| **Jazz** | 🎷 | Fusão de jazz com Lo-Fi |
| **Synthwave** | 🌆 | Synthwave retrô atmosférico |
| **Japanese** | ⛩️ | Instrumentais japoneses Lo-Fi |
| **K-pop** | 🇰🇷 | K-pop remixado em estilo Lo-Fi |
| **Covers** | 🎤 | Covers acústicos e Lo-Fi |
| **Christmas** | 🎄 | Especial natalino (sazonal) |
| **Mix** | ✨ | Mixtape variada de estilos |
| **Halloween** | 🎃 | Atmosfera sombria (sazonal) |
| **Gospel** | ✝️ | Música gospel em estilo Lo-Fi |

### 🎛️ **Sistema de Modos**

#### **Modo DJ**
- **Funcionalidade**: Restringe comandos musicais a usuários com cargos específicos
- **Configuração**: Via comando `/mode`
- **Benefício**: Controle de permissões em servidores grandes

#### **Auto-Reconnect**
- **Funcionalidade**: Reconecta automaticamente após quedas de conexão
- **Configuração**: Ativação via comando `/mode`
- **Benefício**: Música ininterrupta mesmo com instabilidades

### ⭐ **Sistema de Favoritos**
- **Curtir Músicas**: Adicione músicas à sua coleção pessoal
- **Visualização**: Interface paginada para navegar pelos favoritos
- **Persistência**: Dados salvos permanentemente no MongoDB

---

## 🔧 **Modelos de Dados**

### **Station Model**
```javascript
{
  Guild: String,    // ID do servidor
  Radio: String,    // Estação atual
  oldradio: String  // Estação anterior
}
```

### **Playlist Model**
```javascript
{
  UserId: String,      // ID do usuário
  PlaylistName: String, // Nome da playlist
  Playlist: Array      // Lista de músicas
}
```

### **DJ Model**
```javascript
{
  Guild: String,   // ID do servidor
  Roles: Array,    // Cargos com permissão DJ
  Mode: Boolean    // Status do modo DJ
}
```

### **AutoReconnect Model**
```javascript
{
  Guild: String,     // ID do servidor
  TextChannel: String, // Canal de texto
  VoiceChannel: String, // Canal de voz
  Mode: Boolean      // Status auto-reconnect
}
```

---

## 📊 **Sistema de Logs**

### **Tipos de Log**

| Tipo | Arquivo | Descrição |
|------|---------|-----------|
| **Info** | `bot.log` | Atividades gerais do bot |
| **Error** | `error.log` | Erros e exceções |
| **Music** | `bot.log` | Eventos musicais específicos |
| **Warn** | `warn.log` | Avisos e alertas |

### **Estrutura dos Logs**
```javascript
{
  timestamp: "2025-07-09T15:30:45.123Z",
  level: "info",
  message: "Comando play executado",
  context: {
    command: "play",
    user: "usuario#1234",
    guild: "Meu Servidor"
  }
}
```

---

## 🚀 **Execução**

### **Desenvolvimento**
```bash
npm run dev
```
*Usa nodemon para hot-reload automático*

### **Produção**
```bash
npm start
```
*Inicia o bot com Node.js padrão*

### **Comandos Úteis**
```bash
# Verificar logs em tempo real
tail -f src/logs/bot.log

# Verificar status do MongoDB
mongo --eval "db.adminCommand('ismaster')"

# Testar conexão Lavalink
curl -H "Authorization: youshallnotpass" http://localhost:2333/v4/info
```

---

## 🤝 **Contribuição**

### **Como Contribuir**

1. **Fork** o repositório
2. **Clone** sua fork:
   ```bash
   git clone https://github.com/SEU_USUARIO/lofiradiojow.git
   ```
3. **Crie** uma branch para sua feature:
   ```bash
   git checkout -b feature/nova-funcionalidade
   ```
4. **Commit** suas mudanças:
   ```bash
   git commit -m "Adiciona nova funcionalidade X"
   ```
5. **Push** para sua branch:
   ```bash
   git push origin feature/nova-funcionalidade
   ```
6. **Abra** um Pull Request

### **Diretrizes**
- Mantenha o código limpo e documentado
- Siga os padrões existentes do projeto
- Teste suas mudanças antes de enviar
- Atualize a documentação se necessário

### **Áreas para Contribuição**
- 🎵 Novas estações musicais
- 🛠️ Melhorias de performance
- 🎨 Interface de usuário
- 📝 Documentação
- 🧪 Testes automatizados

---

## 📄 **Licença**

Este projeto está licenciado sob a **Licença JoSSO – Projetos de Jonathas Oliveira**.

### **Autor**
**Jonathas Oliveira**
- 📧 Email: jonathass56778@gmail.com
- 🌐 GitHub: [@jonathasfrontend](https://github.com/jonathasfrontend)

---

<div align="center">

**⭐ Se este projeto te ajudou, considere dar uma estrela!**

[![GitHub stars](https://img.shields.io/github/stars/jonathasfrontend/lofiradiojow.svg?style=social&label=Star)](https://github.com/jonathasfrontend/lofiradiojow)

---

**🎵 Feito com ❤️ para a comunidade Discord**

*"A música é a linguagem universal da humanidade"* - Henry Wadsworth Longfellow

</div>
