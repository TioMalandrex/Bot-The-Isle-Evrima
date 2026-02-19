# Sistema de Detecção Automática de Dinossauros

## Visão Geral

O sistema de detecção automática permite que o bot identifique e armazene automaticamente o dinossauro que o jogador está usando no servidor, incluindo todas as estatísticas detalhadas.

## Funcionalidades

### 1. Detecção Automática via RCON

O bot se conecta ao servidor via RCON e obtém automaticamente:
- **Tipo de Dinossauro** (ex: Carnotaurus, Tyrannosaurus, etc.)
- **Crescimento** (Growth: 0.0 a 1.0)
- **Vida** (Health: 0 a 100)
- **Fome** (Hunger: 0 a 100)
- **Sede** (Thirst: 0 a 100)
- **Stamina** (Stamina: 0 a 100)
- **Localização** (Coordenadas X, Y, Z no mapa)
- **Mutações** (Características especiais)

### 2. Interface Interativa (Botões)

Em vez de comandos tradicionais, o sistema usa **botões e menus interativos**:

#### Comando Principal: `/menu`

Abre um menu interativo com 3 opções:

**💾 Guardar Atual**
- Detecta automaticamente seu dinossauro atual
- Armazena com todas as estatísticas
- Não precisa digitar nada!

**📦 Ver Garagem**
- Mostra todos os dinossauros guardados
- Exibe informações completas de cada um
- Inclui vida, fome, sede, localização, mutações

**🔄 Recuperar Dino**
- Abre um menu dropdown
- Escolha qual dino recuperar
- Veja detalhes antes de confirmar
- Confirme com botão ✅

### 3. Informações Exibidas

Quando você visualiza seus dinossauros, o sistema mostra:

```
🦖 Carnotaurus
Nome: Rex
Crescimento: 85%
❤️ Vida: 95.5 | 🍖 Fome: 80
💧 Sede: 70.5 | ⚡ Stamina: 90
📍 Localização: X:1234, Y:5678, Z:100
🧬 Mutações: Albino, Strong Legs
Armazenado: 19/02/2026
```

## Como Usar

### Passo 1: Vincular Steam ID
```
/link steamid:76561198012345678
```

### Passo 2: Abrir Menu Interativo
```
/menu
```

### Passo 3: Escolher Ação

**Para Guardar:**
1. Esteja jogando no servidor
2. Clique em "💾 Guardar Atual"
3. O bot detecta automaticamente
4. Pronto! Dino armazenado

**Para Ver Garagem:**
1. Clique em "📦 Ver Garagem"
2. Veja lista completa com detalhes

**Para Recuperar:**
1. Clique em "🔄 Recuperar Dino"
2. Escolha o dino no menu dropdown
3. Veja os detalhes completos
4. Confirme com ✅
5. Dino recuperado!

## Web Interface

O site também foi atualizado para mostrar todas as informações:

### Garagem Online
Acesse `http://seu-servidor:3000` e veja:
- Lista de todos os dinos guardados
- Vida, fome, sede, stamina
- Localização no mapa
- Mutações
- Crescimento percentual
- Data de armazenamento

### Auto-Refresh
A interface web atualiza automaticamente quando você:
- Guarda um novo dino
- Recupera um dino
- Remove da garagem

## Requisitos Técnicos

### Para Funcionar:
1. **RCON Habilitado** no servidor The Isle
2. **Configuração correta** no arquivo `.env`:
   ```
   GAME_SERVER_HOST=seu-servidor.com
   GAME_SERVER_PORT=8888
   GAME_SERVER_PASSWORD=sua-senha-rcon
   ```
3. **Steam ID vinculado** via `/link`
4. **Jogador online** no servidor

### Comando RCON Usado:
O bot executa internamente:
```
getplayerdata <SteamID64>
```

## Parsing de Dados

O sistema é inteligente e consegue interpretar dois formatos:

### Formato 1: Texto
```
Dinosaur: Carnotaurus
Growth: 0.85
Health: 95.5
Hunger: 80.0
Thirst: 70.5
Location: (1234, 5678, 100)
```

### Formato 2: JSON
```json
{
  "dinosaur_type": "Carnotaurus",
  "growth": 0.85,
  "health": 95.5,
  "hunger": 80.0,
  "thirst": 70.5,
  "location": {"x": 1234, "y": 5678, "z": 100}
}
```

## Banco de Dados

### Estrutura Atualizada da Tabela `garage`:

```sql
CREATE TABLE garage (
  id INTEGER PRIMARY KEY,
  player_id INTEGER,
  dinosaur_type TEXT,        -- Ex: "Carnotaurus"
  dinosaur_name TEXT,        -- Ex: "Rex"
  growth_stage REAL,         -- 0.0 a 1.0
  stats TEXT,                -- JSON com dados extras
  health REAL,               -- 0 a 100
  hunger REAL,               -- 0 a 100
  thirst REAL,               -- 0 a 100
  stamina REAL,              -- 0 a 100
  location_x REAL,           -- Coordenada X
  location_y REAL,           -- Coordenada Y
  location_z REAL,           -- Coordenada Z
  mutations TEXT,            -- JSON array de mutações
  current_dino BOOLEAN,      -- Se está usando agora
  stored_at DATETIME         -- Data de armazenamento
)
```

## API Methods

### GameServerManager

**getCurrentDinosaur(steamId)**
```javascript
const dino = await gameServer.getCurrentDinosaur('76561198012345678');
// Retorna objeto com todas as stats
```

**parsePlayerData(response)**
```javascript
const parsed = gameServer.parsePlayerData(rconResponse);
// Converte resposta RCON em objeto estruturado
```

### DatabaseManager

**storeInGarageWithStats(playerId, dinoData)**
```javascript
await db.storeInGarageWithStats(player.id, {
  dinosaur_type: 'Carnotaurus',
  dinosaur_name: 'Rex',
  growth: 0.85,
  health: 95.5,
  hunger: 80.0,
  thirst: 70.5,
  stamina: 90.0,
  location: { x: 1234, y: 5678, z: 100 },
  mutations: ['Albino', 'Strong Legs']
});
```

## Exemplos de Uso

### Exemplo 1: Jogador Guarda Dino
```
Jogador: /menu
Bot: [Mostra menu com botões]
Jogador: [Clica em "💾 Guardar Atual"]
Bot: [Via RCON] getplayerdata 76561198012345678
Servidor: [Retorna dados]
Bot: [Parseia e armazena]
Bot: ✅ Carnotaurus armazenado!
      Growth: 85% | Vida: 95.5 | Fome: 80
      Localização: X:1234, Y:5678, Z:100
```

### Exemplo 2: Jogador Recupera Dino
```
Jogador: /menu
Bot: [Mostra menu]
Jogador: [Clica em "🔄 Recuperar Dino"]
Bot: [Mostra dropdown com lista]
Jogador: [Seleciona "Carnotaurus - Rex"]
Bot: [Mostra detalhes completos + botão confirmar]
Jogador: [Clica em "✅ Confirmar"]
Bot: ✅ Carnotaurus recuperado da garagem!
```

### Exemplo 3: Ver no Site
```
1. Acesse http://localhost:3000
2. Digite seu Discord ID
3. Clique em "Garagem"
4. Veja lista com:
   🦖 Carnotaurus
   Nome: Rex
   Crescimento: 85%
   ❤️ Vida: 95.5 | 🍖 Fome: 80
   💧 Sede: 70.5 | ⚡ Stamina: 90
   📍 X:1234, Y:5678, Z:100
   🧬 Mutações: Albino, Strong Legs
```

## Vantagens do Sistema

### ✅ Automático
- Não precisa digitar tipo de dino
- Não precisa informar stats manualmente
- Tudo detectado via RCON

### ✅ Completo
- Todas as informações importantes
- Localização para saber onde estava
- Mutações preservadas
- Stats precisas (vida, fome, sede)

### ✅ Interativo
- Botões intuitivos
- Menus dropdown
- Confirmação visual
- Feedback imediato

### ✅ Seguro
- Validação de Steam ID
- Confirmação antes de recuperar
- Logs de todas as ações
- Dados persistentes

## Troubleshooting

### "Servidor não conectado"
**Problema:** RCON não configurado
**Solução:** Configure RCON no `Game.ini` do servidor e no `.env` do bot

### "Steam ID não vinculado"
**Problema:** Jogador não usou `/link`
**Solução:** Execute `/link steamid:SEU_STEAM_ID`

### "Não foi possível detectar dinossauro"
**Problema:** Jogador não está online ou RCON não retornou dados
**Solução:** 
1. Confirme que está jogando no servidor
2. Verifique conexão RCON
3. Tente novamente

### "Dinossauro não encontrado"
**Problema:** Dino já foi recuperado ou ID inválido
**Solução:** Use `/menu` e "Ver Garagem" para confirmar

## Testes

Execute os testes:
```bash
# Teste de detecção automática
node tests/auto-detect.test.js

# Todos os testes
npm test
```

## Futuras Melhorias

Possíveis expansões:
1. **Auto-sync periódico** - Atualizar stats automaticamente a cada X minutos
2. **Alertas de baixa vida** - Notificar quando vida/fome/sede estão baixas
3. **Histórico de localização** - Rastrear onde o dino esteve
4. **Análise de mutações** - Identificar mutações raras
5. **Backup em nuvem** - Sincronizar com serviço externo
6. **Comparação de stats** - Ver evolução do dino ao longo do tempo

## Suporte

Para problemas:
1. Verifique logs do bot (`console.log`)
2. Confirme configuração RCON
3. Teste comando RCON manualmente
4. Verifique Steam ID vinculado
5. Consulte documentação do The Isle Evrima

---

**Desenvolvido com integração RCON real do The Isle Evrima**
**Sistema totalmente automático e interativo**
