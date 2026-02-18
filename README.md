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

### Comunicação Multi-Plataforma
- **Discord Bot**: Comandos slash interativos
- **Interface Web**: Dashboard completo e intuitivo
- **Servidor do Jogo**: Integração via RCON para aplicar mudanças em tempo real

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

- `/garage` - Ver seus dinossauros armazenados na garagem
- `/store <tipo> [nome] [crescimento]` - Armazenar um dinossauro na garagem
- `/retrieve <id>` - Recuperar um dinossauro da garagem
- `/skins [tipo]` - Ver suas skins disponíveis
- `/changeskin <tipo> <skin>` - Mudar a skin de um dinossauro
- `/profile` - Ver seu perfil de jogador

**Exemplos de uso:**
```
/store tipo:Tyrannosaurus nome:Rexy crescimento:1.0
/changeskin tipo:Tyrannosaurus skin:rex_apex
/garage
```

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
