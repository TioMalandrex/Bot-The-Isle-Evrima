# Sistema de Vinculação Steam ID

## Visão Geral

O sistema de vinculação Steam ID permite que jogadores associem suas contas Discord aos seus perfis Steam, possibilitando uma identificação precisa entre o Discord e o servidor do jogo The Isle Evrima.

## Como Funciona

### 1. Vinculação via Discord

Usuários podem vincular seu Steam ID usando o comando `/link`:

```
/link steamid:76561198012345678
```

**Processo:**
1. O usuário executa o comando `/link` com seu Steam ID
2. O bot valida o formato do Steam ID (deve ter 17 dígitos)
3. O bot verifica se o Steam ID já está vinculado a outra conta
4. Se válido, o Steam ID é armazenado no banco de dados
5. O usuário recebe uma confirmação

### 2. Vinculação via API REST

Aplicações externas ou o site podem vincular Steam IDs via API:

```http
POST /api/player/link
Content-Type: application/json

{
  "discordId": "123456789",
  "steamId": "76561198012345678"
}
```

**Resposta de sucesso:**
```json
{
  "success": true,
  "message": "Steam ID vinculado com sucesso",
  "player": {
    "id": 1,
    "discord_id": "123456789",
    "steam_id": "76561198012345678",
    "username": "PlayerName",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3. Identificação no Servidor do Jogo

Quando um jogador executa ações que requerem comunicação com o servidor (como trocar skins), o bot:

1. Busca o jogador no banco de dados
2. Usa o Steam ID como identificador, se disponível
3. Fallback para username caso não haja Steam ID vinculado
4. Envia o comando RCON com o identificador apropriado

**Exemplo de código (interno):**
```javascript
// Use Steam ID if available, otherwise fall back to username
const playerIdentifier = player.steam_id || player.username;
await gameServer.changeSkin(playerIdentifier, dinosaurType, skinId);
```

## Validações

### Formato do Steam ID

- Deve conter exatamente 17 dígitos numéricos
- Formato típico: `76561198012345678`
- Regex de validação: `/^\d{17}$/`

### Unicidade

- Cada Steam ID pode estar vinculado a apenas uma conta Discord
- Se um usuário tentar vincular um Steam ID já em uso, receberá erro
- Um usuário pode atualizar seu próprio Steam ID quantas vezes quiser

### Exemplo de Validação:

```javascript
// Validar formato
if (!/^\d{17}$/.test(steamId)) {
  return error('Steam ID inválido');
}

// Verificar duplicação
const existingPlayer = await db.getPlayerBySteamId(steamId);
if (existingPlayer && existingPlayer.discord_id !== discordId) {
  return error('Steam ID já vinculado a outra conta');
}
```

## Como Encontrar seu Steam ID

1. Acesse https://steamid.io/
2. Insira a URL do seu perfil Steam
3. Copie o valor "steamID64" (17 dígitos)
4. Use este valor no comando `/link`

**Exemplos de URL Steam válidas:**
- `https://steamcommunity.com/id/seuusername/`
- `https://steamcommunity.com/profiles/76561198012345678/`

## Visualização do Steam ID

### Via Discord
Use o comando `/profile` para ver suas informações:

```
/profile
```

**Resposta:**
```
👤 Perfil de NomeUsuario
Discord ID: 123456789
Steam ID: 76561198012345678
Dinossauros na Garagem: 3
Skins Desbloqueadas: 5
Membro desde: 01/01/2024
```

### Via API REST

```http
GET /api/player/123456789
```

**Resposta:**
```json
{
  "id": 1,
  "discord_id": "123456789",
  "steam_id": "76561198012345678",
  "username": "PlayerName",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

## Banco de Dados

### Estrutura da Tabela `players`

```sql
CREATE TABLE players (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  discord_id TEXT UNIQUE,
  steam_id TEXT UNIQUE,
  username TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

**Índices:**
- `discord_id` - UNIQUE (identificação primária via Discord)
- `steam_id` - UNIQUE (garante que cada Steam ID é usado uma vez)

## Métodos de Banco de Dados

### updatePlayerSteamId(discordId, steamId)
Atualiza o Steam ID de um jogador existente.

```javascript
await db.updatePlayerSteamId('123456789', '76561198012345678');
```

### getPlayerBySteamId(steamId)
Busca um jogador pelo Steam ID.

```javascript
const player = await db.getPlayerBySteamId('76561198012345678');
```

### getOrCreatePlayer(discordId, username, steamId)
Cria ou obtém um jogador, opcionalmente com Steam ID.

```javascript
const player = await db.getOrCreatePlayer(
  '123456789',
  'PlayerName',
  '76561198012345678'
);
```

## Casos de Uso

### 1. Novo Usuário
```
Usuário executa: /link steamid:76561198012345678
Bot responde: ✅ Steam ID vinculado com sucesso!
```

### 2. Steam ID Duplicado
```
Usuário A: /link steamid:76561198012345678
Bot: ✅ Vinculado!

Usuário B: /link steamid:76561198012345678
Bot: ❌ Este Steam ID já está vinculado a outra conta Discord.
```

### 3. Atualizar Steam ID
```
Usuário: /link steamid:76561198012345678
Bot: ✅ Vinculado!

Usuário: /link steamid:76561198099999999
Bot: ✅ Steam ID atualizado com sucesso!
```

### 4. Aplicar Skin com Steam ID
```
Usuário: /changeskin tipo:Carnotaurus skin:carno_apex
Bot busca Steam ID: 76561198012345678
Bot envia RCON: changeskin 76561198012345678 Carnotaurus carno_apex
Servidor: Skin aplicada!
```

## Segurança

### Considerações de Segurança

1. **Validação de Entrada**: Steam IDs são validados antes de armazenar
2. **Unicidade Garantida**: Constraints de banco impedem duplicações
3. **Mensagens Privadas**: Confirmação de link é enviada como mensagem efêmera (visível apenas para o usuário)
4. **Rate Limiting**: Considere implementar rate limiting na API para prevenir abuso

### Recomendações

- Não exponha listas completas de Steam IDs publicamente
- Use HTTPS para a API em produção
- Implemente autenticação adicional para endpoints sensíveis
- Monitore tentativas de vinculação de Steam IDs inválidos

## Troubleshooting

### Erro: "Steam ID inválido"
**Causa:** Steam ID não tem 17 dígitos ou contém caracteres não numéricos
**Solução:** Verifique se copiou o steamID64 corretamente

### Erro: "Steam ID já vinculado"
**Causa:** Steam ID já está em uso por outra conta Discord
**Solução:** Certifique-se de usar seu próprio Steam ID

### Erro: "Jogador não encontrado"
**Causa:** Tentativa de atualizar Steam ID de conta não existente
**Solução:** Execute um comando primeiro para criar o registro (como `/profile`)

## Migração de Dados

Se você já tem jogadores registrados sem Steam ID:

```javascript
// Script de exemplo para migração
const players = await db.getAllPlayers();

for (const player of players) {
  if (!player.steam_id) {
    // Solicite que jogadores vinculem via /link
    console.log(`Jogador ${player.username} precisa vincular Steam ID`);
  }
}
```

## Testes

Execute os testes para validar o sistema:

```bash
# Testes unitários de Steam ID
node tests/steamid-link.test.js

# Testes de integração completos
node tests/integration.test.js

# Todos os testes
npm test
```

## Futuras Melhorias

Possíveis melhorias para o sistema:

1. **Verificação Steam API**: Validar Steam IDs consultando a API oficial do Steam
2. **Auto-link**: Detecção automática de Steam ID quando jogador entra no servidor
3. **Histórico**: Registrar histórico de vinculações para auditoria
4. **Notificações**: Alertar usuários sobre mudanças em suas vinculações
5. **Bulk Import**: Importar múltiplas vinculações de um arquivo CSV

## Suporte

Para problemas ou dúvidas:
1. Verifique a documentação completa no README.md
2. Execute os testes para validar o sistema
3. Consulte os logs do bot para mensagens de erro detalhadas
4. Abra uma issue no GitHub com detalhes do problema
