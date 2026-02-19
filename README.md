# Bot The Isle Evrima 🦖

Um bot completo para o jogo **The Isle Evrima** com comunicação entre Servidor de Jogo, Discord e Interface Web. Inclui sistema de armazenamento/garagem de dinossauros, trocador de skins, economia, estatísticas e detecção automática via RCON.

## 📋 Índice

- [Funcionalidades](#-funcionalidades)
- [Interface Web](#-interface-web)
- [Instalação](#-instalação)
- [Uso](#-uso)
- [Detecção Automática](#-detecção-automática-via-rcon)
- [Sistema de Economia](#-sistema-de-economia)
- [Comandos Admin](#-comandos-de-admin)
- [API REST](#-api-rest)
- [Vinculação Steam ID](#-vinculação-steam-id)
- [Dinossauros](#-dinossauros-jogáveis)
- [Configuração RCON](#-configuração-rcon-servidor-the-isle)
- [Contribuindo](#-contribuindo)

## 🎯 Funcionalidades

### Sistema de Garagem
- **Armazenar dinossauros**: Guarde seus dinossauros com informações completas (tipo, nome, crescimento, vida, fome, sede, stamina, localização, mutações)
- **Visualizar garagem**: Veja todos os dinossauros armazenados com detalhes completos
- **Recuperar dinossauros**: Remova dinossauros da garagem quando quiser usá-los
- **Gerenciamento completo**: Via Discord (botões interativos) ou Interface Web
- **Detecção automática**: Sistema identifica automaticamente o dino atual via RCON

### Sistema de Skins
- **Desbloquear skins**: Adicione novas skins para seus dinossauros
- **Trocar skins**: Altere a aparência dos seus dinossauros
- **Aplicação automática**: Skins são aplicadas automaticamente no servidor (se conectado via RCON)
- **Acesso dual**: Gerencie skins pelo Discord ou pelo site

### 💰 Sistema de Economia
- **Pontos**: Sistema de moeda virtual para o servidor
- **Recompensas diárias**: Ganhe 100 pontos por dia (`/daily`)
- **Transferências**: Envie pontos para outros jogadores (`/transfer`)
- **Histórico**: Acompanhe todas as transações
- **Leaderboards**: Rankings de pontos, kills e tempo de jogo
- **Shop**: Use pontos para comprar itens (configurável)

### 📊 Estatísticas de Jogador
- **Tempo de jogo**: Rastreamento automático de horas jogadas
- **Kills e Deaths**: Contador de abates e mortes
- **K/D Ratio**: Cálculo automático de eficiência
- **Distância percorrida**: Tracking de movimento no mapa
- **Dinossauros jogados**: Contador de espécies utilizadas

### 🛡️ Comandos de Admin (via RCON)
- **Anúncios**: Envie mensagens para todo o servidor (`/announce`)
- **Kick/Ban**: Gerencie jogadores problemáticos (`/kick`, `/ban`)
- **Lista de jogadores**: Veja quem está online (`/players`)
- **Mensagens diretas**: Envie DMs para jogadores no jogo
- **Teleporte**: Comandos goto/bring para admins
- **Controles do servidor**: Clima, hora do dia, save
- **Logs de admin**: Registro de todas as ações administrativas

### Comunicação Multi-Plataforma
- **Discord Bot**: Comandos slash e interações com botões
- **Interface Web**: Dashboard completo e intuitivo
- **Servidor do Jogo**: Integração via RCON para aplicar mudanças em tempo real

## 📸 Interface Web

A interface web oferece uma experiência visual completa para gerenciar seus dinossauros e skins:

### 🏠 Garagem de Dinossauros
![Garagem de Dinossauros](https://github.com/user-attachments/assets/4d7bc981-f7a5-4ff5-a339-67d9b501826c)

Armazene e gerencie seus dinossauros com facilidade. Agora com informações completas: vida, fome, sede, stamina, localização no mapa e mutações!

### 🎨 Gerenciador de Skins
![Gerenciador de Skins](https://github.com/user-attachments/assets/53da7f14-8403-4fbe-83fa-97cde1e7a62c)

Desbloqueie e aplique skins personalizadas para seus dinossauros favoritos.

### 👤 Perfil do Jogador
![Perfil do Jogador](https://github.com/user-attachments/assets/e3eaa27c-f6ab-418d-bb5f-e6e4973209c2)

Visualize todas as suas informações, incluindo Discord ID, Steam ID vinculado, dinossauros na garagem e skins desbloqueadas.

## 📦 Instalação

### Pré-requisitos
- Node.js 16.x ou superior
- npm ou yarn
- Conta Discord para criar um bot
- (Opcional) Servidor The Isle Evrima com RCON habilitado

### 🚀 Guia Rápido de Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/TioMalandrex/Bot-The-Isle-Evrima.git
cd Bot-The-Isle-Evrima
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o Bot Discord**

Crie seu bot no Discord:
- Acesse https://discord.com/developers/applications
- Clique em "New Application" e dê um nome (ex: "The Isle Bot")
- Vá para "Bot" → "Add Bot"
- Em "Privileged Gateway Intents", habilite **MESSAGE CONTENT INTENT**
- Copie o **Token** do bot
- Em "OAuth2" → "General", copie o **Client ID**

Adicione o bot ao seu servidor:
- Vá para "OAuth2" → "URL Generator"
- Selecione scopes: `bot` e `applications.commands`
- Selecione permissões: "Send Messages", "Use Slash Commands", "Read Message History"
- Copie e abra a URL gerada no navegador
- Selecione seu servidor e autorize

4. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
# Discord Bot Configuration
DISCORD_TOKEN=seu_token_aqui
DISCORD_CLIENT_ID=seu_client_id_aqui

# Web Server Configuration
WEB_PORT=3000
WEB_HOST=0.0.0.0

# Game Server Configuration (RCON) - OPCIONAL
GAME_SERVER_HOST=localhost
GAME_SERVER_PORT=8888
GAME_SERVER_PASSWORD=sua_senha_rcon_aqui

# Database Configuration
DATABASE_PATH=./data/bot.db
```

**Nota:** O servidor do jogo (RCON) é opcional. O bot funciona perfeitamente sem ele!

5. **Inicie o bot**
```bash
npm start
```

Para desenvolvimento com auto-reload:
```bash
npm run dev
```

6. **Acesse a Interface Web**
```
http://localhost:3000
```

### ⚠️ Problemas Comuns

- **"Cannot find module"**: Execute `npm install` novamente
- **"Invalid token"**: Verifique se o token do Discord no `.env` está correto
- **"Connection refused" (servidor)**: Normal se não tiver servidor The Isle configurado. O bot funciona mesmo assim!

## 🎮 Uso

### Discord Bot - Menu Interativo

#### 🆕 Comando Principal: `/menu`
O bot agora usa **botões interativos** em vez de comandos tradicionais!

```
/menu
```

Abre um menu com 3 botões:
- **💾 Guardar Atual** - Detecta e guarda automaticamente seu dinossauro atual via RCON
- **📦 Ver Garagem** - Mostra todos os dinos com stats completas (vida, fome, sede, localização, mutações)
- **🔄 Recuperar Dino** - Menu dropdown para escolher e recuperar dino

### Comandos Discord

**Jogador:**
- `/menu` - 🦖 **Menu interativo com botões** (recomendado!)
- `/link <steamid>` - Vincular seu Discord ao seu Steam ID
- `/garage` - Ver seus dinossauros armazenados na garagem
- `/store <tipo> [nome] [crescimento]` - Armazenar um dinossauro manualmente
- `/retrieve <id>` - Recuperar um dinossauro da garagem
- `/skins [tipo]` - Ver suas skins disponíveis
- `/changeskin <tipo> <skin>` - Mudar a skin de um dinossauro
- `/profile` - Ver seu perfil de jogador
- `/stats` - Ver suas estatísticas de jogo

**Economia:**
- `/balance` - Ver seu saldo de pontos
- `/daily` - Resgatar recompensa diária (100 pontos)
- `/transfer <usuário> <quantidade>` - Transferir pontos para outro jogador
- `/leaderboard [tipo]` - Ver ranking (pontos, kills, tempo de jogo)

**Admin (requer permissões):**
- `/announce <mensagem>` - Enviar anúncio para o servidor
- `/kick <steamid> [motivo]` - Kickar jogador
- `/ban <nome> <steamid> [motivo] [duração]` - Banir jogador
- `/players` - Listar jogadores online

**Exemplos de uso:**
```
# Sistema Interativo (Recomendado)
/menu
[Clique em "💾 Guardar Atual" para detectar e guardar automaticamente]
[Clique em "📦 Ver Garagem" para ver todos com detalhes completos]
[Clique em "🔄 Recuperar Dino" para menu dropdown]

# Comandos tradicionais
/link steamid:76561198012345678
/balance
/daily
/transfer @amigo 50
/leaderboard tipo:kills
```

### Interface Web

Acesse `http://localhost:3000` no seu navegador.

1. **Insira seu Discord ID** na barra superior
2. **Navegue pelas abas**:
   - **Garagem**: Armazene e gerencie dinossauros
   - **Skins**: Desbloqueie e aplique skins
   - **Perfil**: Visualize suas estatísticas

## 🎯 Detecção Automática via RCON

O bot detecta automaticamente seu dinossauro atual via RCON quando conectado ao servidor The Isle Evrima.

### Informações Capturadas
- **Tipo de Dinossauro** (ex: Carnotaurus, Tyrannosaurus, etc.)
- **Crescimento** (Growth: 0.0 a 1.0)
- **❤️ Vida** (Health: 0 a 100)
- **🍖 Fome** (Hunger: 0 a 100)
- **💧 Sede** (Thirst: 0 a 100)
- **⚡ Stamina** (Stamina: 0 a 100)
- **📍 Localização** (Coordenadas X, Y, Z no mapa)
- **🧬 Mutações** (Características especiais)

### Como Funciona

1. **Jogador usa `/menu`** no Discord
2. **Clica em "💾 Guardar Atual"**
3. **Bot chama RCON**: `getplayerdata <SteamID>`
4. **Servidor retorna** todos os dados do dino atual
5. **Bot parseia** e armazena automaticamente
6. **Confirmação** mostrada com todas as stats

**Exemplo de resposta:**
```
✅ Dinossauro Armazenado!
Carnotaurus - Rex
Crescimento: 85%
❤️ Vida: 95.5 | 🍖 Fome: 80
💧 Sede: 70.5 | ⚡ Stamina: 90
📍 Localização: X:1234, Y:5678, Z:100
🧬 Mutações: Albino, Strong Legs
```

### Requisitos
- RCON habilitado no servidor
- Steam ID vinculado (`/link`)
- Jogador online no servidor

## 💰 Sistema de Economia

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

## 🛡️ Comandos de Admin

> ⚠️ **Nota**: Todos os comandos de admin requerem permissão de "Administrator" no Discord e servidor do jogo conectado via RCON.

### `/announce <mensagem>`
Envia um anúncio para todos os jogadores online no servidor.

**Exemplo:**
```
/announce mensagem:Servidor será reiniciado em 10 minutos!
```

### `/kick <steamid> [motivo]`
Remove um jogador do servidor.

**Exemplo:**
```
/kick steamid:76561198012345678 motivo:Comportamento tóxico
```

### `/ban <nome> <steamid> [motivo] [duração]`
Bane um jogador do servidor.

**Exemplos:**
```
/ban nome:PlayerName steamid:76561198012345678 motivo:Cheating duração:0
/ban nome:Troll steamid:76561198012345678 motivo:Trolling duração:24
```

### `/players`
Lista todos os jogadores atualmente conectados ao servidor.

### Logs de Admin

Todas as ações administrativas são registradas automaticamente no banco de dados para auditoria.

## 🔌 API REST

O bot expõe uma API REST completa para integração externa.

### Base URL
```
http://localhost:3000/api
```

### Endpoints Principais

#### Garagem

**Listar dinossauros**
```http
GET /api/garage/:discordId
```

**Armazenar dinossauro**
```http
POST /api/garage
Content-Type: application/json

{
  "discordId": "123456789",
  "dinosaurType": "Tyrannosaurus",
  "dinosaurName": "Rexy",
  "growthStage": 1.0
}
```

**Remover dinossauro**
```http
DELETE /api/garage/:id
```

#### Skins

**Listar skins do jogador**
```http
GET /api/skins/:discordId
```

**Desbloquear nova skin**
```http
POST /api/skins/unlock
Content-Type: application/json

{
  "discordId": "123456789",
  "dinosaurType": "Carnotaurus",
  "skinId": "carno_desert",
  "skinName": "Desert Camo"
}
```

**Aplicar skin**
```http
POST /api/skins/apply
Content-Type: application/json

{
  "discordId": "123456789",
  "dinosaurType": "Carnotaurus",
  "skinId": "carno_desert"
}
```

**Ver skin ativa**
```http
GET /api/skins/active/:discordId/:dinosaurType
```

#### Jogador

**Informações do jogador**
```http
GET /api/player/:discordId
```

**Vincular Steam ID**
```http
POST /api/player/link
Content-Type: application/json

{
  "discordId": "123456789",
  "steamId": "76561198012345678"
}
```

#### Status

**Status da conexão com o servidor**
```http
GET /api/status
```

### Exemplo JavaScript

```javascript
// Armazenar um T-Rex na garagem
const response = await fetch('http://localhost:3000/api/garage', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    discordId: 'SEU_DISCORD_ID',
    dinosaurType: 'Tyrannosaurus',
    dinosaurName: 'Rexy',
    growthStage: 1.0
  })
});

const data = await response.json();
console.log(data);
```

## 🔗 Vinculação Steam ID

O sistema de vinculação Steam ID permite que jogadores associem suas contas Discord aos seus perfis Steam, possibilitando uma identificação precisa entre o Discord e o servidor do jogo.

### Como Vincular

#### Via Discord
```
/link steamid:76561198012345678
```

**Processo:**
1. O bot valida o formato do Steam ID (deve ter 17 dígitos)
2. Verifica se o Steam ID já está vinculado a outra conta
3. Armazena no banco de dados
4. Confirma a vinculação

#### Via API
```http
POST /api/player/link
Content-Type: application/json

{
  "discordId": "123456789",
  "steamId": "76561198012345678"
}
```

### Como Encontrar seu Steam ID

1. Acesse https://steamid.io/
2. Insira sua URL do perfil Steam ou nome de usuário
3. Copie o **steamID64** (17 dígitos)

### Validações

- **Formato**: Deve conter exatamente 17 dígitos numéricos
- **Unicidade**: Cada Steam ID pode estar vinculado a apenas uma conta Discord
- **Atualização**: Um usuário pode atualizar seu próprio Steam ID quantas vezes quiser

### Por Que Vincular?

- **Identificação precisa** no servidor do jogo
- **Auto-detecção** do dinossauro atual via RCON
- **Aplicação automática** de skins no servidor
- **Comandos admin** funcionam corretamente
- **Estatísticas** sincronizadas com o jogo

## 🦖 Dinossauros Jogáveis

Build 21811079 - Fevereiro 2026 - **20 espécies disponíveis**

### 🥩 Carnívoros (10)

**👑 Tyrannosaurus rex** ⭐ Apex
- **Nicho**: Predador Apex Solitário
- **Habilidades**: Bone Break (quebra ossos), Deep Bleed (sangramento profundo)
- **Estilo**: Lento mas letal. Domina por força bruta

**⚔️ Allosaurus** ⭐ Novo
- **Nicho**: Caçador de Grandes Herbívoros
- **Habilidades**: Grapple (agarra presas), Shred (sangramento massivo)
- **Estilo**: Equilíbrio entre velocidade e força. Perigoso em grupos

**🦖 Carnotaurus**
- **Nicho**: Perseguidor de Campo Aberto
- **Habilidades**: Ram (investida que derruba)
- **Estilo**: Velocista dos grandes carnívoros

**🦎 Ceratosaurus**
- **Nicho**: Ladrão de Carcaças
- **Habilidades**: Chuffing (detecta carne), Charged Bite (causa vômito)
- **Estilo**: Resistente. Rouba comida de predadores maiores

**🐊 Deinosuchus**
- **Nicho**: Predador de Emboscada Aquático
- **Habilidades**: Lunging Grab (puxa para água), Death Roll
- **Estilo**: Terror dos rios e lagos

**💦 Dilophosaurus**
- **Nicho**: Caçador Noturno Psicológico
- **Habilidades**: Hallucination Venom (causa alucinações)
- **Estilo**: Ataca nas sombras, desorientando presas

**🦅 Omniraptor**
- **Nicho**: Caçador de Matilha
- **Habilidades**: Pounce (pula e rasga)
- **Estilo**: Ágil e tático. Depende de números

**🦴 Herrerasaurus**
- **Nicho**: Predador Arbóreo
- **Habilidades**: Climbing (escala árvores), Leap Attack
- **Estilo**: Ataca das copas das árvores

**🌙 Troodon**
- **Nicho**: Assediador de Grupo
- **Habilidades**: Pounce Venenoso (veneno acumulativo)
- **Estilo**: Requer coordenação perfeita

**🦇 Pteranodon**
- **Nicho**: Pescador Aéreo
- **Habilidades**: Skimming (pesca voando)
- **Estilo**: Frágil mas com mobilidade suprema

### 🌿 Herbívoros (8)

**🦏 Triceratops** ⭐ Apex
- **Nicho**: Tanque Defensivo
- **Habilidades**: Stomp, Gore (chifrada crítica)
- **Estilo**: Quase impossível de abater de frente

**🦕 Stegosaurus**
- **Nicho**: Defensor de Retaguarda
- **Habilidades**: Tail Lash (pode matar instantaneamente)
- **Estilo**: Protege mantendo cauda voltada para perigo

**🦌 Pachycephalosaurus**
- **Nicho**: Encrenqueiro de Manada
- **Habilidades**: Ram (cabeçada poderosa)
- **Estilo**: Agressivo e territorial

**🦛 Diabloceratops**
- **Nicho**: Guarda-Costas da Manada
- **Habilidades**: Horn Attack, Charge
- **Estilo**: Protetor mas menos tanque que Triceratops

**🦌 Tenontosaurus**
- **Nicho**: Vigia Ágil
- **Habilidades**: Kick (chute traseiro poderoso)
- **Estilo**: Rápido e alerta

**🐇 Dryosaurus**
- **Nicho**: Escapista Veloz
- **Habilidades**: Sprint (velocista supremo)
- **Estilo**: Sobrevive correndo

**🐦 Hypsilophodon**
- **Nicho**: Forrageador Discreto
- **Habilidades**: Small size (difícil de detectar)
- **Estilo**: Se esconde e foge

**👶 Maiasaura**
- **Nicho**: Matriarca Protetora
- **Habilidades**: Call (chama manada), Stomp
- **Estilo**: Proteção em grupo

### 🌾 Onívoros (2)

**🦩 Gallimimus**
- **Nicho**: Oportunista Veloz
- **Estilo**: Come de tudo, corre de todos

**🦜 Beipiaosaurus**
- **Nicho**: Coletor Versátil
- **Estilo**: Flexível na dieta, moderadamente rápido

## ⚙️ Configuração RCON (Servidor The Isle)

### Habilitar RCON no Servidor

1. Localize o arquivo `Game.ini` no servidor:
```
TheIsle/Saved/Config/WindowsServer/Game.ini
```

2. Adicione ou edite as seguintes linhas:
```ini
[/Script/TheIsle.TIGameMode]
bRCONEnabled=True
RCONPort=8888
RCONPassword=sua_senha_segura_aqui
```

3. Reinicie o servidor The Isle

### Comandos RCON Disponíveis

O bot suporta os seguintes comandos RCON:

**Jogador:**
- `getplayerdata <SteamID>` - Obtém dados detalhados do jogador/dino
- `playerlist` - Lista jogadores online
- `save` - Salva estado do servidor

**Admin:**
- `announce <mensagem>` - Anúncio global
- `kick <SteamID>,<motivo>` - Kick jogador
- `ban <nome>,<SteamID>,<motivo>,<horas>` - Ban jogador
- `directmessage <SteamID>,<mensagem>` - Mensagem privada
- `goto <nome>` - Teleportar para jogador
- `bring <nome>` - Trazer jogador
- `promote <SteamID>` - Promover a admin
- `demote <SteamID>` - Remover admin

**Ambiente:**
- `settime <hora>` - Mudar hora do dia
- `setweather <tipo>` - Mudar clima

### Segurança RCON

⚠️ **Importante**:
- Use senhas fortes e únicas
- RCON transmite em texto plano - use redes confiáveis
- Configure firewall para restringir acesso à porta RCON
- Não compartilhe credenciais RCON
- Mude senha regularmente

### Teste de Conexão RCON

```bash
# Via terminal (se tiver rcon-cli instalado)
rcon -H localhost -P 8888 -p sua_senha playerlist
```

## 🏗️ Estrutura do Projeto

```
Bot-The-Isle-Evrima/
├── src/
│   ├── database/
│   │   └── manager.js          # Gerenciamento SQLite
│   ├── discord/
│   │   └── bot.js              # Bot Discord e comandos
│   ├── game/
│   │   └── server.js           # Comunicação RCON
│   ├── web/
│   │   └── server.js           # Servidor web Express e API
│   ├── public/
│   │   └── index.html          # Interface web
│   └── index.js                # Ponto de entrada
├── data/
│   └── bot.db                  # Banco de dados (auto-criado)
├── tests/                      # Testes automatizados
├── package.json
├── .env.example
└── README.md
```

## 🗃️ Banco de Dados

O bot usa SQLite com as seguintes tabelas:

- **players**: Informações dos jogadores (Discord ID, Steam ID, username)
- **garage**: Dinossauros armazenados (com stats completas)
- **skins**: Skins desbloqueadas
- **active_skins**: Skins atualmente aplicadas
- **player_economy**: Pontos e transações
- **player_stats**: Estatísticas de jogo (kills, deaths, tempo)
- **transactions**: Histórico de transações de pontos
- **admin_logs**: Registro de ações administrativas
- **server_config**: Configurações do servidor (MOTD, etc.)

### Schema Garage (Atualizado)

```sql
CREATE TABLE garage (
  id INTEGER PRIMARY KEY,
  player_id INTEGER,
  dinosaur_type TEXT,
  dinosaur_name TEXT,
  growth_stage REAL,
  stats TEXT,
  health REAL,           -- Vida (0-100)
  hunger REAL,           -- Fome (0-100)
  thirst REAL,           -- Sede (0-100)
  stamina REAL,          -- Stamina (0-100)
  location_x REAL,       -- Coordenada X
  location_y REAL,       -- Coordenada Y
  location_z REAL,       -- Coordenada Z
  mutations TEXT,        -- JSON array
  current_dino BOOLEAN,  -- Flag
  stored_at DATETIME
)
```

## 🧪 Testes

Execute os testes do sistema:
```bash
npm test
```

Testes disponíveis:
- `database.test.js` - Testes do banco de dados
- `economy.test.js` - Testes do sistema de economia
- `auto-detect.test.js` - Testes de detecção automática
- `integration.test.js` - Testes de integração
- `steamid-link.test.js` - Testes de vinculação Steam ID

**Total**: 46 testes automatizados ✅

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Faça fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

### Diretrizes

- Escreva testes para novas funcionalidades
- Mantenha o código limpo e bem documentado
- Siga o estilo de código existente
- Atualize a documentação quando necessário

## 🔒 Segurança

### Boas Práticas

- **Nunca compartilhe** seu token Discord ou senha RCON
- Use **variáveis de ambiente** (`.env`) para credenciais
- Mantenha `.env` no `.gitignore`
- Use **senhas fortes** para RCON
- Atualize dependências regularmente: `npm audit fix`
- Configure **permissões mínimas** necessárias no Discord
- Use **HTTPS** em produção para a interface web

### Reportando Vulnerabilidades

Se encontrar uma vulnerabilidade de segurança:
1. **NÃO** abra uma issue pública
2. Envie detalhes privados para os mantenedores
3. Aguarde confirmação e correção
4. Divulgação responsável após o patch

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## ⚠️ Aviso Legal

Este bot foi desenvolvido para fins educacionais e de comunidade. Certifique-se de seguir:
- Termos de Serviço do The Isle Evrima
- Termos de Serviço do Discord
- Regras do seu servidor

O uso de bots pode estar sujeito a restrições. Use por sua própria conta e risco.

## 📝 Changelog

### [1.2.0] - 2026-02-19
- ✨ Sistema de detecção automática via RCON
- ✨ Menu interativo com botões
- ✨ Stats completas (vida, fome, sede, stamina, localização, mutações)
- ✨ Sistema de economia com pontos e leaderboards
- ✨ Comandos de admin via RCON
- ✨ Vinculação Steam ID
- 🔧 Interface web atualizada
- 📚 Documentação consolidada

### [1.1.0] - 2026-01-15
- ✨ Sistema de skins
- ✨ Garagem de dinossauros
- ✨ Interface web básica
- 🔧 Integração RCON inicial

### [1.0.0] - 2025-12-01
- 🎉 Lançamento inicial
- ✨ Bot Discord básico
- ✨ Banco de dados SQLite

## 🐛 Problemas Conhecidos

- A integração RCON depende dos comandos específicos do servidor The Isle Evrima
- Alguns comandos podem precisar ser ajustados conforme a versão do servidor
- Interface web não tem autenticação (use em redes confiáveis)

## 📧 Suporte

Para reportar bugs ou sugerir melhorias:
- Abra uma [issue no GitHub](https://github.com/TioMalandrex/Bot-The-Isle-Evrima/issues)
- Entre em contato com os mantenedores

---

**Desenvolvido com ❤️ para a comunidade The Isle Evrima**

🦖 Divirta-se gerenciando seus dinossauros!
