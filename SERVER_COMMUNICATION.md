# 🔌 Comunicação Bot-Servidor - The Isle Evrima

Este documento explica como o bot se comunica com o servidor The Isle Evrima, identifica jogadores e aplica skins corretamente.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Arquitetura de Comunicação](#arquitetura-de-comunicação)
- [Identificação de Jogadores](#identificação-de-jogadores)
- [Fluxo de Aplicação de Skins](#fluxo-de-aplicação-de-skins)
- [Protocolo RCON](#protocolo-rcon)
- [Limitações Atuais](#limitações-atuais)
- [Melhorias Sugeridas](#melhorias-sugeridas)

---

## 🎯 Visão Geral

O bot utiliza três componentes principais para gerenciar a comunicação com o servidor:

1. **Discord Bot** - Interface do usuário via Discord
2. **Web Interface** - Dashboard web para gerenciamento
3. **RCON Manager** - Comunicação com o servidor do jogo via RCON

```
┌─────────────┐      ┌──────────────┐      ┌─────────────────┐
│   Discord   │──────│              │      │   The Isle      │
│     Bot     │      │   Bot Core   │──────│  Evrima Server  │
└─────────────┘      │   (Node.js)  │      │    (RCON)       │
                     │              │      └─────────────────┘
┌─────────────┐      │   Database   │
│     Web     │──────│   (SQLite)   │
│  Interface  │      └──────────────┘
└─────────────┘
```

---

## 🏗️ Arquitetura de Comunicação

### Componentes

#### 1. Database Manager (`src/database/manager.js`)
Gerencia o banco de dados SQLite com as seguintes tabelas:

- **`players`** - Informações dos jogadores
  - `discord_id` - ID único do Discord
  - `steam_id` - ID do Steam (opcional, não utilizado atualmente)
  - `username` - Nome do usuário Discord

- **`garage`** - Dinossauros armazenados

- **`skins`** - Skins desbloqueadas por jogador

- **`active_skins`** - Skins atualmente ativas por tipo de dinossauro

#### 2. Game Server Manager (`src/game/server.js`)
Gerencia a conexão RCON com o servidor The Isle Evrima:

```javascript
class GameServerManager {
  async connect()              // Conecta ao servidor via RCON
  async sendCommand(command)   // Envia comando RCON genérico
  async changeSkin(playerName, dinosaurType, skinId)  // Aplica skin
  async spawnDinosaur(...)     // Spawna dinossauro
  async getPlayerInfo(...)     // Obtém info do jogador
}
```

#### 3. Discord Bot (`src/discord/bot.js`)
Processa comandos Discord e coordena ações:

```javascript
/changeskin tipo:Tyrannosaurus skin:rex_apex
```

#### 4. Web Server (`src/web/server.js`)
Expõe API REST para gerenciamento via web:

```javascript
POST /api/skins/apply
{
  "discordId": "123456789",
  "dinosaurType": "Tyrannosaurus",
  "skinId": "rex_apex"
}
```

---

## 👤 Identificação de Jogadores

### Fluxo de Identificação

```
1. Usuário usa Discord/Web
   ↓
2. Bot obtém Discord ID do usuário
   ↓
3. Busca/Cria registro no banco de dados
   ↓
4. Identifica jogador no servidor via USERNAME
```

### Código de Identificação

**Discord Bot:**
```javascript
const player = await this.database.getOrCreatePlayer(
  interaction.user.id,        // Discord ID único
  interaction.user.username   // Username do Discord
);
```

**Comunicação com Servidor:**
```javascript
// Usa o USERNAME para identificar no servidor
await this.gameServer.changeSkin(
  interaction.user.username,  // ⚠️ USERNAME, não Steam ID
  tipo, 
  skinId
);
```

### ⚠️ Problema Atual

**O bot identifica jogadores por USERNAME, não por identificador único do jogo!**

Isso significa:
- ✅ Funciona se o jogador usar o mesmo username no Discord e no jogo
- ❌ Falha se os usernames forem diferentes
- ❌ Não há validação se o player está online
- ❌ Steam ID não é utilizado

---

## 🎨 Fluxo de Aplicação de Skins

### Passo a Passo Completo

#### 1. Usuário Solicita Mudança de Skin

**Via Discord:**
```
/changeskin tipo:Tyrannosaurus skin:rex_apex
```

**Via Web API:**
```javascript
POST /api/skins/apply
{
  "discordId": "123456789",
  "dinosaurType": "Tyrannosaurus",
  "skinId": "rex_apex"
}
```

#### 2. Bot Valida Permissões

```javascript
// 1. Identifica o jogador pelo Discord ID
const player = await this.database.getPlayer(discordId);

// 2. Verifica se possui a skin
const skins = await this.database.getPlayerSkins(player.id, dinosaurType);
const hasSkin = skins.some(s => s.skin_id === skinId);

if (!hasSkin) {
  return error('Você não possui essa skin');
}
```

#### 3. Atualiza Banco de Dados

```javascript
// Marca a skin como ativa no banco
await this.database.setActiveSkin(player.id, dinosaurType, skinId);
```

#### 4. Aplica no Servidor (se conectado)

```javascript
if (this.gameServer.isConnected()) {
  try {
    // Envia comando RCON para o servidor
    await this.gameServer.changeSkin(
      player.username,    // Username do Discord
      dinosaurType,       // Ex: "Tyrannosaurus"
      skinId              // Ex: "rex_apex"
    );
  } catch (error) {
    console.error('Erro ao aplicar skin no servidor:', error);
    // ⚠️ Skin fica salva no banco, mas não aplicada no jogo
  }
}
```

#### 5. Confirma ao Usuário

```javascript
// Responde ao usuário
return success('Skin aplicada com sucesso!');
```

### Diagrama do Fluxo

```
Usuário
  │
  ├─ Discord Command /changeskin
  │  ou
  └─ Web POST /api/skins/apply
       │
       ▼
  ┌─────────────────────────────────┐
  │  1. Valida Discord ID           │
  │  2. Busca player no banco       │
  │  3. Verifica posse da skin      │
  └──────────────┬──────────────────┘
                 │
                 ▼
  ┌─────────────────────────────────┐
  │  4. Atualiza active_skins       │
  │     (banco de dados)            │
  └──────────────┬──────────────────┘
                 │
                 ▼
          [RCON Conectado?]
                 │
        ┌────────┴────────┐
        │                 │
       SIM               NÃO
        │                 │
        ▼                 ▼
  ┌──────────────┐   [Fim - skin
  │ Envia RCON:  │    salva apenas
  │ changeskin   │    no banco]
  │ username     │
  │ tipo skinid  │
  └──────┬───────┘
         │
         ▼
  ┌─────────────────┐
  │ Servidor aplica │
  │ skin no player  │
  └─────────────────┘
```

---

## 🔧 Protocolo RCON

### O que é RCON?

RCON (Remote Console) é um protocolo que permite enviar comandos administrativos para servidores de jogos remotamente.

### Configuração

**No arquivo `.env`:**
```env
GAME_SERVER_HOST=seu_servidor.com
GAME_SERVER_PORT=8888
GAME_SERVER_PASSWORD=sua_senha_rcon
```

### Conexão RCON

**Código (`src/game/server.js`):**
```javascript
const { Rcon } = require('rcon-client');

async connect() {
  this.rcon = await Rcon.connect({
    host: this.host,
    port: this.port,
    password: this.password
  });
  this.connected = true;
}
```

### Comandos RCON Implementados

⚠️ **IMPORTANTE:** Os comandos abaixo são **HIPOTÉTICOS**. O The Isle Evrima pode usar comandos diferentes.

```javascript
// Mudar skin de um jogador
changeskin <playerName> <dinosaurType> <skinId>

// Spawnar dinossauro
spawn <playerName> <dinosaurType> <growthStage>

// Informações do jogador
playerinfo <playerName>

// Listar jogadores online
listplayers

// Salvar progresso
save <playerName>
```

### Exemplo de Uso

```javascript
// No código
await this.gameServer.changeSkin(
  "JoaoGamer123",    // Nome do jogador
  "Tyrannosaurus",   // Tipo de dinossauro
  "rex_apex"         // ID da skin
);

// Comando RCON enviado
"changeskin JoaoGamer123 Tyrannosaurus rex_apex"
```

---

## ⚠️ Limitações Atuais

### 1. Identificação por Username

**Problema:** O bot usa o username do Discord para identificar o jogador no servidor.

**Riscos:**
- Username do Discord pode ser diferente do nome in-game
- Não há garantia de que o player correto receberá a skin
- Possível aplicar skin no player errado se houver nomes similares

**Exemplo de Falha:**
```
Discord Username: "JoaoGamer"
In-game Name: "JG_Pro_2024"
❌ Bot tentará aplicar em "JoaoGamer" que não existe no servidor
```

### 2. Comandos RCON Hipotéticos

**Problema:** Os comandos RCON implementados são hipotéticos.

```javascript
// Este comando pode não existir no The Isle Evrima
await this.gameServer.changeSkin(playerName, dinosaurType, skinId);
```

**Necessário:**
- Documentação oficial dos comandos RCON do The Isle Evrima
- Testes reais com servidor do jogo
- Ajustes nos comandos conforme API real

### 3. Sem Validação de Sessão

**Problema:** O bot não verifica se o player está online no servidor.

**Consequências:**
- Comando pode falhar silenciosamente
- Skin fica salva no banco mas não aplicada
- Usuário pode achar que funcionou

### 4. Steam ID Não Utilizado

**Problema:** O campo `steam_id` existe no banco mas não é usado.

**Oportunidade:**
- Steam ID é identificador único confiável
- The Isle Evrima pode suportar comandos via Steam ID
- Seria mais robusto que username

---

## 💡 Melhorias Sugeridas

### 1. Implementar Identificação por Steam ID

**Modificar Database:**
```javascript
// Capturar Steam ID quando jogador se registra
async linkSteamAccount(discordId, steamId) {
  await this.db.run(
    'UPDATE players SET steam_id = ? WHERE discord_id = ?',
    [steamId, discordId]
  );
}
```

**Modificar Game Server:**
```javascript
// Usar Steam ID se disponível
async changeSkin(player, dinosaurType, skinId) {
  const identifier = player.steam_id || player.username;
  const command = `changeskin ${identifier} ${dinosaurType} ${skinId}`;
  return await this.sendCommand(command);
}
```

**Novo Comando Discord:**
```javascript
/linksteam steam_id:76561198XXXXXX
```

### 2. Validar Player Online

```javascript
async changeSkin(player, dinosaurType, skinId) {
  // 1. Verificar se player está online
  const onlinePlayers = await this.listPlayers();
  const isOnline = onlinePlayers.includes(player.steam_id);
  
  if (!isOnline) {
    throw new Error('Jogador não está online no servidor');
  }
  
  // 2. Aplicar skin
  return await this.sendCommand(...);
}
```

### 3. Implementar Fila de Comandos

Para players offline, guardar comandos pendentes:

```sql
CREATE TABLE pending_commands (
  id INTEGER PRIMARY KEY,
  player_id INTEGER,
  command TEXT,
  created_at DATETIME,
  executed_at DATETIME
);
```

```javascript
// Quando player conectar, executar comandos pendentes
async onPlayerConnect(playerId) {
  const pending = await this.getPendingCommands(playerId);
  for (const cmd of pending) {
    await this.sendCommand(cmd.command);
    await this.markCommandExecuted(cmd.id);
  }
}
```

### 4. Adicionar Feedback Detalhado

```javascript
async changeSkin(player, dinosaurType, skinId) {
  try {
    const response = await this.sendCommand(...);
    
    // Parsear resposta do servidor
    if (response.includes('success')) {
      return { 
        success: true, 
        message: 'Skin aplicada com sucesso' 
      };
    } else {
      return { 
        success: false, 
        message: 'Falha ao aplicar skin', 
        details: response 
      };
    }
  } catch (error) {
    return { 
      success: false, 
      error: error.message 
    };
  }
}
```

### 5. Documentar Comandos Reais

Criar arquivo de referência com comandos RCON reais do The Isle Evrima:

```markdown
# RCON_COMMANDS.md

## Comandos Verificados

### ChangeSkin
- Comando: `SetSkin <SteamID64> <DinosaurClass> <SkinIndex>`
- Exemplo: `SetSkin 76561198012345678 BP_Tyrannosaurus 3`
- Retorno: `Skin changed successfully for player X`

### ListPlayers
- Comando: `ListPlayers`
- Retorno: Lista de players online com Steam IDs
```

### 6. Adicionar Sistema de Logs

```javascript
class GameServerManager {
  async changeSkin(player, dinosaurType, skinId) {
    const logEntry = {
      timestamp: new Date(),
      player: player.username,
      steamId: player.steam_id,
      action: 'changeSkin',
      dinosaurType,
      skinId
    };
    
    try {
      const result = await this.sendCommand(...);
      logEntry.result = 'success';
      logEntry.response = result;
    } catch (error) {
      logEntry.result = 'error';
      logEntry.error = error.message;
    }
    
    await this.saveLog(logEntry);
    return logEntry;
  }
}
```

---

## 🔍 Como Testar

### 1. Testar Conexão RCON

```bash
# Via código
npm start

# Verificar logs
✓ Conectado ao servidor do jogo via RCON
```

### 2. Testar Comando Manual

```javascript
// No console do Node.js
const gameServer = require('./src/game/server');
const server = new gameServer('host', 8888, 'password');
await server.connect();
await server.sendCommand('help');  // Ver comandos disponíveis
```

### 3. Testar Aplicação de Skin

```bash
# Via Discord
/changeskin tipo:Tyrannosaurus skin:rex_apex

# Verificar:
1. Skin salva no banco? (active_skins table)
2. Comando RCON enviado? (server logs)
3. Skin aplicada no jogo? (verificar in-game)
```

### 4. Debug Mode

Adicionar logs detalhados:

```javascript
// src/game/server.js
async changeSkin(playerName, dinosaurType, skinId) {
  const command = `changeskin ${playerName} ${dinosaurType} ${skinId}`;
  console.log('[DEBUG] Sending RCON command:', command);
  
  const response = await this.sendCommand(command);
  console.log('[DEBUG] Server response:', response);
  
  return response;
}
```

---

## 📚 Recursos Adicionais

### Documentação Relacionada
- [README.md](README.md) - Documentação principal do projeto
- [API.md](API.md) - Documentação da API REST
- [CONTRIBUTING.md](CONTRIBUTING.md) - Guia de contribuição

### Referências Externas
- [The Isle Evrima RCON Documentation](https://theisle.fandom.com/wiki/Server_Commands) *(verificar se existe)*
- [RCON Protocol](https://developer.valvesoftware.com/wiki/Source_RCON_Protocol)
- [rcon-client npm package](https://www.npmjs.com/package/rcon-client)

### Suporte
Para questões sobre a comunicação bot-servidor:
1. Verifique os logs do bot e do servidor
2. Teste os comandos RCON manualmente
3. Abra uma issue no GitHub com logs detalhados

---

**Última atualização:** Fevereiro 2026  
**Versão:** 1.1.0  
**Status:** Documentação técnica da implementação atual
