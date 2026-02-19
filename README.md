# Bot The Isle Evrima 🦖

Um bot completo para o jogo **The Isle Evrima** com comunicação entre Servidor de Jogo, Discord e Interface Web. Inclui sistema de armazenamento/garagem de dinossauros e trocador de skins (skin changer) acessível tanto via Discord quanto via site.

## 🎯 Funcionalidades

### Sistema de Garagem
- **Armazenar dinossauros**: Guarde seus dinossauros com informações de tipo, nome, crescimento e stats
- **Visualizar garagem**: Veja todos os dinossauros armazenados
- **Recuperar dinossauros**: Remova dinossauros da garagem quando quiser usá-los
- **Gerenciamento completo**: Via Discord ou Interface Web

### Sistema de Skins
- **Desbloquear skins**: Adicione novas skins para seus dinossauros
- **Trocar skins**: Altere a aparência dos seus dinossauros
- **Aplicação automática**: Skins são aplicadas automaticamente no servidor (se conectado)
- **Acesso dual**: Gerencie skins pelo Discord ou pelo site

### 💰 Sistema de Economia
- **Pontos**: Sistema de moeda virtual para o servidor
- **Recompensas diárias**: Ganhe 100 pontos por dia
- **Transferências**: Envie pontos para outros jogadores
- **Histórico**: Acompanhe todas as transações
- **Leaderboards**: Rankings de pontos, kills e tempo de jogo

### 📊 Estatísticas de Jogador
- **Tempo de jogo**: Rastreamento automático de horas jogadas
- **Kills e Deaths**: Contador de abates e mortes
- **K/D Ratio**: Cálculo automático de eficiência
- **Distância percorrida**: Tracking de movimento no mapa
- **Dinossauros jogados**: Contador de espécies utilizadas

### 🛡️ Comandos de Admin (via RCON)
- **Anúncios**: Envie mensagens para todo o servidor
- **Kick/Ban**: Gerencie jogadores problemáticos
- **Lista de jogadores**: Veja quem está online
- **Mensagens diretas**: Envie DMs para jogadores no jogo
- **Teleporte**: Comandos goto/bring para admins
- **Controles do servidor**: Clima, hora do dia, save
- **Logs de admin**: Registro de todas as ações administrativas

### Comunicação Multi-Plataforma
- **Discord Bot**: Comandos slash interativos
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

# Database
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

### Discord Bot

Comandos disponíveis:

**🆕 Menu Interativo (Recomendado!):**
- `/menu` - 🦖 **Menu interativo com botões** para gerenciar dinossauros
  - **💾 Guardar Atual** - Detecta e guarda automaticamente seu dino atual via RCON
  - **📦 Ver Garagem** - Mostra todos os dinos com stats completas (vida, fome, sede, localização, mutações)
  - **🔄 Recuperar Dino** - Menu dropdown para escolher e recuperar dino

**Jogador:**
- `/link <steamid>` - Vincular seu Discord ao seu Steam ID
- `/garage` - Ver seus dinossauros armazenados na garagem
- `/store <tipo> [nome] [crescimento]` - Armazenar um dinossauro na garagem (manual)
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

### Sistema de Detecção Automática

O bot agora detecta automaticamente seu dinossauro atual via RCON, incluindo:
- **Tipo** (Carnotaurus, Tyrannosaurus, etc.)
- **Crescimento** (0-100%)
- **❤️ Vida** (Health)
- **🍖 Fome** (Hunger)
- **💧 Sede** (Thirst)
- **⚡ Stamina**
- **📍 Localização** (X, Y, Z no mapa)
- **🧬 Mutações** (características especiais)

Veja [AUTO_DETECTION.md](AUTO_DETECTION.md) para guia completo.

### Interface Web

Acesse `http://localhost:3000` no seu navegador.

1. **Insira seu Discord ID** na barra superior
2. **Navegue pelas abas**:
   - **Garagem**: Armazene e gerencie dinossauros
   - **Skins**: Desbloqueie e aplique skins
   - **Perfil**: Visualize suas estatísticas

### API REST

O bot expõe uma API REST completa. [Veja documentação completa da API](API.md)

#### Endpoints Principais
- `GET /api/garage/:discordId` - Listar dinossauros na garagem
- `POST /api/garage` - Armazenar dinossauro
- `DELETE /api/garage/:id` - Remover dinossauro
- `GET /api/skins/:discordId` - Listar skins do jogador
- `POST /api/skins/unlock` - Desbloquear nova skin
- `POST /api/skins/apply` - Aplicar skin
- `GET /api/skins/active/:discordId/:dinosaurType` - Ver skin ativa
- `GET /api/player/:discordId` - Informações do jogador
- `GET /api/status` - Status da conexão com o servidor

**Exemplo JavaScript:**
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
```

## 🏗️ Estrutura do Projeto

```
Bot-The-Isle-Evrima/
├── src/
│   ├── database/
│   │   └── manager.js          # Gerenciamento do banco de dados SQLite
│   ├── discord/
│   │   └── bot.js              # Bot Discord e comandos
│   ├── game/
│   │   └── server.js           # Comunicação RCON com servidor
│   ├── web/
│   │   └── server.js           # Servidor web Express e API
│   ├── public/
│   │   └── index.html          # Interface web
│   └── index.js                # Ponto de entrada principal
├── data/
│   └── bot.db                  # Banco de dados (criado automaticamente)
├── package.json
├── .env.example
└── README.md
```

## 🎮 Integração com Servidor do Jogo (RCON)

O bot pode se conectar ao servidor The Isle Evrima via RCON para aplicar mudanças em tempo real.

### Como Funciona

1. **Usuário solicita mudança** (Discord/Web) → `/changeskin tipo:Tyrannosaurus skin:rex_apex`
2. **Bot valida permissões** → Verifica se o jogador possui a skin no banco de dados
3. **Atualiza banco de dados** → Marca a skin como ativa
4. **Envia comando RCON** → Se conectado, aplica no servidor: `changeskin username Tyrannosaurus rex_apex`

### Identificação de Jogadores

O bot identifica jogadores no servidor usando o **Steam ID** vinculado ao Discord.

**Como vincular:**
1. Use o comando `/link` no Discord com seu Steam ID
2. O bot armazena a associação entre seu Discord e Steam ID
3. Agora você pode ser identificado corretamente no servidor

**Para encontrar seu Steam ID:**
- Acesse https://steamid.io/
- Insira sua URL do perfil Steam
- Use o Steam ID 64 (17 dígitos)

Para que a skin seja aplicada corretamente:
- Você deve ter vinculado seu Steam ID usando `/link`
- O jogador deve estar online no servidor
- RCON deve estar configurado e conectado

> 📖 **Para detalhes completos sobre comunicação bot-servidor, veja:** [SERVER_COMMUNICATION.md](SERVER_COMMUNICATION.md)

### Configuração RCON (Opcional)

No arquivo `.env`:
```env
GAME_SERVER_HOST=seu_servidor.com  # IP ou hostname do servidor
GAME_SERVER_PORT=8888              # Porta RCON (padrão 8888)
GAME_SERVER_PASSWORD=senha_secreta # Senha RCON do servidor
```

**Nota:** O bot funciona normalmente mesmo sem RCON configurado. As skins ficam salvas no banco de dados e podem ser aplicadas quando o servidor estiver disponível.

## 🔧 Configuração do Discord Bot

1. Acesse o [Discord Developer Portal](https://discord.com/developers/applications)
2. Crie uma nova aplicação
3. Vá para a seção "Bot" e crie um bot
4. Copie o token e adicione ao `.env`
5. Em "OAuth2" > "URL Generator":
   - Selecione scope `bot` e `applications.commands`
   - Selecione permissões: "Send Messages", "Use Slash Commands"
   - Use a URL gerada para adicionar o bot ao seu servidor

## 🎨 Tipos de Dinossauros Suportados (Build 21811079 - Fev 2026)

### Carnívoros (10)
- Carnotaurus
- Omniraptor
- Ceratosaurus
- Troodon
- Dilophosaurus
- Pteranodon
- Herrerasaurus
- Deinosuchus
- **Allosaurus** ⭐ (Recém adicionado)
- **Tyrannosaurus rex** ⭐ (Recém adicionado)

### Herbívoros (8)
- Stegosaurus
- Tenontosaurus
- Hypsilophodon
- Pachycephalosaurus
- Diabloceratops
- Dryosaurus
- Maiasaura
- Triceratops

### Onívoros (2)
- Gallimimus
- Beipiaosaurus

**Total: 20 dinossauros jogáveis**

> 📖 Para informações detalhadas sobre habilidades e estratégias de cada dinossauro, consulte [DINOSAURS_REFERENCE.md](DINOSAURS_REFERENCE.md)

## 🎨 Exemplos de Skins

O sistema suporta skins personalizadas para todos os dinossauros. Aqui estão alguns exemplos:

### Tyrannosaurus rex
- `rex_default` - Padrão
- `rex_apex` - Apex (pele escura dominante)
- `rex_king` - Rei (dourado majestoso)
- `rex_alpha` - Alpha (listras vermelhas)
- `rex_nightmare` - Pesadelo (preto com detalhes vermelhos)

### Allosaurus
- `allo_default` - Padrão
- `allo_apex` - Apex
- `allo_hunter` - Caçador
- `allo_alpha` - Alpha

### Carnotaurus
- `carno_default` - Padrão
- `carno_desert` - Deserto
- `carno_jungle` - Selva
- `carno_night` - Noturno

**Como usar:**
```
# Via Discord
/changeskin tipo:Tyrannosaurus skin:rex_apex

# Via API
POST /api/skins/apply
{
  "discordId": "SEU_ID",
  "dinosaurType": "Tyrannosaurus",
  "skinId": "rex_apex"
}
```

> 💡 **Nota:** Os IDs de skin devem corresponder aos configurados no servidor The Isle Evrima.

## 🗃️ Banco de Dados

O bot usa SQLite com as seguintes tabelas:

- **players**: Informações dos jogadores
- **garage**: Dinossauros armazenados
- **skins**: Skins desbloqueadas
- **active_skins**: Skins atualmente aplicadas

## 📚 Documentação Adicional

- 📖 [DINOSAURS_REFERENCE.md](DINOSAURS_REFERENCE.md) - Guia completo de dinossauros com habilidades e estratégias
- 🔌 [API.md](API.md) - Documentação completa da API REST
- 🔗 [SERVER_COMMUNICATION.md](SERVER_COMMUNICATION.md) - Como o bot se comunica com o servidor do jogo
- 🤝 [CONTRIBUTING.md](CONTRIBUTING.md) - Guia de contribuição para desenvolvedores
- 🔒 [SECURITY.md](SECURITY.md) - Informações de segurança e melhores práticas
- 📝 [CHANGELOG.md](CHANGELOG.md) - Histórico de versões e mudanças

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Faça fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

Para mais detalhes, consulte [CONTRIBUTING.md](CONTRIBUTING.md)

## 🧪 Testes

Execute os testes do sistema:
```bash
npm test
```

Os testes validam:
- ✅ Criação e manipulação do banco de dados
- ✅ Sistema de garagem (armazenar/recuperar)
- ✅ Sistema de skins (desbloquear/aplicar)
- ✅ Gerenciamento de jogadores

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## ⚠️ Aviso

Este bot foi desenvolvido para fins educacionais e de comunidade. Certifique-se de seguir os Termos de Serviço do The Isle Evrima e do Discord ao usar este bot.

## 🐛 Problemas Conhecidos

- A integração RCON depende dos comandos específicos do servidor The Isle Evrima
- Alguns comandos podem precisar ser ajustados conforme a versão do servidor

## 📧 Suporte

Para reportar bugs ou sugerir melhorias, abra uma issue no GitHub.
