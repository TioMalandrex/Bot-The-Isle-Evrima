# Funcionalidades Avançadas - The Isle Manager Style

Este bot foi aprimorado com recursos inspirados no The Isle Manager, oferecendo um conjunto completo de ferramentas de gerenciamento de servidor e economia.

## 💰 Sistema de Economia

### Visão Geral
O sistema de economia permite que os jogadores ganhem, gastem e transfiram pontos virtuais. Estes pontos podem ser usados para comprar itens, dinossauros ou outras recompensas configuradas pelo servidor.

### Comandos

#### `/balance`
Visualiza seu saldo atual de pontos.

**Resposta:**
- Pontos disponíveis
- Total ganho
- Total gasto

#### `/daily`
Resgata a recompensa diária de 100 pontos.

**Limitações:**
- Pode ser usado apenas uma vez a cada 24 horas
- Mostra quanto tempo falta para o próximo resgate

#### `/transfer <usuário> <quantidade>`
Transfere pontos para outro jogador.

**Parâmetros:**
- `usuário`: Membro do Discord que receberá os pontos
- `quantidade`: Número de pontos a transferir

**Validações:**
- Quantidade deve ser maior que zero
- Você deve ter pontos suficientes
- Não pode transferir para si mesmo

#### `/leaderboard [tipo]`
Mostra o ranking dos melhores jogadores.

**Tipos disponíveis:**
- `points` (padrão): Ranking por pontos
- `kills`: Ranking por kills
- `playtime_minutes`: Ranking por tempo de jogo

**Exibe:**
- Top 10 jogadores
- Medalhas para os 3 primeiros 🥇🥈🥉
- Estatísticas relevantes de cada jogador

### Formas de Ganhar Pontos

1. **Recompensa Diária**: 100 pontos/dia via `/daily`
2. **Admin pode conceder**: Admins podem adicionar pontos manualmente
3. **Eventos futuros**: Kill rewards, objective completion, etc.

### Sistema de Transações

Todas as transações (ganhos e gastos) são registradas no banco de dados com:
- Tipo (earn/spend)
- Quantidade
- Descrição
- Data/hora

Isso permite auditoria completa e histórico de atividades.

## 📊 Estatísticas de Jogador

### `/stats`
Mostra estatísticas detalhadas do jogador.

**Informações exibidas:**
- **Tempo de Jogo**: Total de horas e minutos jogados
- **Kills**: Total de abates
- **Deaths**: Total de mortes
- **K/D Ratio**: Proporção kills/deaths calculada automaticamente
- **Pontos**: Saldo atual de pontos
- **Dinossauros Jogados**: Quantidade de espécies diferentes utilizadas
- **Último visto**: Data/hora da última atividade

### Rastreamento Automático

O sistema registra automaticamente:
- Tempo de conexão no servidor
- Kills e deaths em combate
- Distância percorrida no mapa
- Tipos de dinossauros utilizados

## 🛡️ Comandos de Admin

> ⚠️ **Nota**: Todos os comandos de admin requerem permissão de "Administrator" no Discord e servidor do jogo conectado via RCON.

### `/announce <mensagem>`
Envia um anúncio para todos os jogadores online no servidor.

**Exemplo:**
```
/announce mensagem:Servidor será reiniciado em 10 minutos!
```

**Uso:**
- Avisos de manutenção
- Eventos especiais
- Mudanças de regras
- Boas-vindas

### `/kick <steamid> [motivo]`
Remove um jogador do servidor.

**Parâmetros:**
- `steamid`: Steam ID do jogador (17 dígitos)
- `motivo` (opcional): Razão do kick

**Exemplo:**
```
/kick steamid:76561198012345678 motivo:Comportamento tóxico
```

**Registro:**
- Ação é logada no banco de dados
- Inclui admin, alvo, motivo e timestamp

### `/ban <nome> <steamid> [motivo] [duração]`
Bane um jogador do servidor.

**Parâmetros:**
- `nome`: Nome do jogador
- `steamid`: Steam ID do jogador
- `motivo` (opcional): Razão do ban
- `duração` (opcional): Horas de ban (0 = permanente)

**Exemplos:**
```
/ban nome:PlayerName steamid:76561198012345678 motivo:Cheating duração:0
/ban nome:Troll steamid:76561198012345678 motivo:Trolling duração:24
```

### `/players`
Lista todos os jogadores atualmente conectados ao servidor.

**Informações exibidas:**
- Nome dos jogadores
- Steam IDs
- Tempo de conexão
- Posição no mapa (se disponível)

### Logs de Admin

Todas as ações administrativas são registradas automaticamente:
- Comando executado
- Admin que executou
- Jogador alvo (se aplicável)
- Detalhes da ação
- Data/hora

**Acesso aos logs:**
Através do banco de dados, tabela `admin_logs`, para auditoria.

## 🎮 RCON - Comandos Avançados

### Comandos Disponíveis via GameServerManager

#### Comunicação
- `announce(message)` - Anúncio global
- `directMessage(steamId, message)` - Mensagem privada

#### Gerenciamento de Jogadores
- `kickPlayer(steamId, reason)` - Kickar
- `banPlayer(name, steamId, reason, duration)` - Banir
- `promoteAdmin(steamId)` - Promover a admin
- `demoteAdmin(steamId)` - Remover admin
- `getPlayerData(steamId)` - Obter dados do jogador
- `listPlayers()` - Listar online

#### Teleporte (Admin)
- `gotoPlayer(playerName)` - Ir até jogador
- `bringPlayer(playerName)` - Trazer jogador

#### Ambiente
- `setTime(time)` - Mudar hora do dia
- `setWeather(weather)` - Mudar clima
- `saveServer()` - Salvar estado

### Exemplos de Uso (JavaScript)

```javascript
// Enviar anúncio
await gameServer.announce('Bem-vindos ao servidor!');

// Kickar jogador
await gameServer.kickPlayer('76561198012345678', 'AFK');

// Banir permanentemente
await gameServer.banPlayer('Cheater', '76561198012345678', 'Uso de hacks', 0);

// Banir por 24 horas
await gameServer.banPlayer('Troll', '76561198012345678', 'Trolling', 24);

// Mensagem privada
await gameServer.directMessage('76561198012345678', 'Cuidado com as regras!');

// Teleportar admin até jogador
await gameServer.gotoPlayer('PlayerName');

// Mudar para noite
await gameServer.setTime('night');

// Iniciar chuva
await gameServer.setWeather('rain');
```

## 🗄️ Banco de Dados

### Novas Tabelas

#### `player_economy`
Armazena informações econômicas dos jogadores.

**Colunas:**
- `player_id`: ID do jogador
- `points`: Pontos atuais
- `total_earned`: Total ganho historicamente
- `total_spent`: Total gasto historicamente
- `last_daily`: Data do último resgate diário

#### `player_stats`
Estatísticas de jogo dos jogadores.

**Colunas:**
- `player_id`: ID do jogador
- `playtime_minutes`: Tempo de jogo em minutos
- `kills`: Total de kills
- `deaths`: Total de deaths
- `distance_traveled`: Distância percorrida
- `dinosaurs_played`: Tipos de dinossauros jogados
- `last_seen`: Última atividade

#### `transactions`
Histórico de todas as transações de pontos.

**Colunas:**
- `player_id`: ID do jogador
- `type`: 'earn' ou 'spend'
- `amount`: Quantidade de pontos
- `description`: Descrição da transação
- `created_at`: Data/hora

#### `admin_logs`
Registro de ações administrativas.

**Colunas:**
- `admin_id`: ID do admin
- `action`: Tipo de ação (kick, ban, announce, etc.)
- `target_player`: Jogador alvo (se aplicável)
- `details`: Detalhes adicionais
- `created_at`: Data/hora

#### `server_config`
Configurações do servidor (MOTD, regras, etc.).

**Colunas:**
- `key`: Chave da configuração
- `value`: Valor da configuração
- `updated_at`: Última atualização

## 🔧 Métodos da API

### DatabaseManager - Novos Métodos

#### Economia
```javascript
// Obter economia do jogador
const economy = await db.getPlayerEconomy(playerId);

// Adicionar pontos
await db.addPoints(playerId, amount, description);

// Remover pontos
await db.removePoints(playerId, amount, description);

// Transferir pontos
await db.transferPoints(fromPlayerId, toPlayerId, amount);

// Histórico de transações
const history = await db.getTransactionHistory(playerId, limit);
```

#### Estatísticas
```javascript
// Obter estatísticas
const stats = await db.getPlayerStats(playerId);

// Atualizar estatísticas
await db.updatePlayerStats(playerId, {
  playtime_minutes: 60,
  kills: 5,
  deaths: 2,
  dinosaurs_played: 1
});

// Leaderboard
const leaderboard = await db.getLeaderboard('kills', 10);
```

#### Admin
```javascript
// Registrar ação de admin
await db.logAdminAction(adminId, 'kick', targetSteamId, 'motivo');

// Obter logs
const logs = await db.getAdminLogs(50);
```

#### Configuração
```javascript
// Definir configuração
await db.setServerConfig('motd', 'Bem-vindo!');

// Obter configuração
const motd = await db.getServerConfig('motd');
```

## 🚀 Próximas Funcionalidades

Baseado no The Isle Manager, futuras implementações podem incluir:

1. **Shop System**: Comprar dinossauros com pontos
2. **Wager Games**: Apostas entre jogadores
3. **Breeding Tracking**: Rastreamento de ninhadas
4. **Whitelist/Blacklist**: Gerenciamento de acesso
5. **Automated Rewards**: Recompensas por achievements
6. **API REST Expandida**: Mais endpoints para integração
7. **WebSocket**: Updates em tempo real
8. **Player Notifications**: Notificações via DM
9. **Scheduled Events**: Eventos programados
10. **Backup System**: Backup automático de dados

## 📚 Referências

Este sistema foi inspirado em:
- [The Isle Manager](https://theislemanager.com/)
- [The Isle Manager Docs](https://docs.theislemanager.com/)
- [Evrima RCON GitHub](https://github.com/Theislemanager/evrima-rcon)

## ⚙️ Configuração

Para usar todos os recursos:

1. Configure o RCON no servidor do jogo
2. Ajuste permissões de Discord (roles de admin)
3. Configure recompensas de pontos
4. Personalize mensagens e valores
5. Monitore logs regularmente

## 🐛 Troubleshooting

### "Servidor não conectado"
- Verifique configuração RCON no `.env`
- Confirme que RCON está habilitado no servidor
- Teste conexão com ferramentas RCON externas

### "Pontos insuficientes"
- Use `/balance` para verificar saldo
- Resgaste recompensa diária com `/daily`
- Peça admin para adicionar pontos

### "Permissão negada"
- Comandos de admin requerem role de Administrator no Discord
- Verifique configuração de permissões no servidor Discord

## 📞 Suporte

Para problemas ou sugestões:
1. Verifique os logs do bot
2. Consulte esta documentação
3. Abra uma issue no GitHub
4. Entre em contato com o desenvolvedor
