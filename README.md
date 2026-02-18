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
- Servidor The Isle Evrima com RCON habilitado

### Passos de Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/TioMalandrex/Bot-The-Isle-Evrima.git
cd Bot-The-Isle-Evrima
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
# Discord Bot Configuration
DISCORD_TOKEN=seu_token_do_discord_aqui
DISCORD_CLIENT_ID=seu_client_id_aqui

# Web Server Configuration
WEB_PORT=3000
WEB_HOST=0.0.0.0

# Game Server Configuration (RCON)
GAME_SERVER_HOST=localhost
GAME_SERVER_PORT=8888
GAME_SERVER_PASSWORD=sua_senha_rcon_aqui

# Database
DATABASE_PATH=./data/bot.db
```

4. **Inicie o bot**
```bash
npm start
```

Para desenvolvimento com auto-reload:
```bash
npm run dev
```

## 🎮 Uso

### Discord Bot

Comandos disponíveis:

- `/garage` - Ver seus dinossauros armazenados na garagem
- `/store <tipo> [nome] [crescimento]` - Armazenar um dinossauro na garagem
- `/retrieve <id>` - Recuperar um dinossauro da garagem
- `/skins [tipo]` - Ver suas skins disponíveis
- `/changeskin <tipo> <skin>` - Mudar a skin de um dinossauro
- `/profile` - Ver seu perfil de jogador

**Exemplo de uso:**
```
/store tipo:Carnotaurus nome:Rex crescimento:1.0
/changeskin tipo:Carnotaurus skin:skin_001
```

### Interface Web

Acesse `http://localhost:3000` no seu navegador.

1. **Insira seu Discord ID** na barra superior
2. **Navegue pelas abas**:
   - **Garagem**: Armazene e gerencie dinossauros
   - **Skins**: Desbloqueie e aplique skins
   - **Perfil**: Visualize suas estatísticas

### API REST

O bot expõe uma API REST completa:

#### Endpoints de Garagem
- `GET /api/garage/:discordId` - Listar dinossauros na garagem
- `POST /api/garage` - Armazenar dinossauro
- `DELETE /api/garage/:id` - Remover dinossauro

#### Endpoints de Skins
- `GET /api/skins/:discordId` - Listar skins do jogador
- `POST /api/skins/unlock` - Desbloquear nova skin
- `POST /api/skins/apply` - Aplicar skin
- `GET /api/skins/active/:discordId/:dinosaurType` - Ver skin ativa

#### Outros
- `GET /api/player/:discordId` - Informações do jogador
- `GET /api/status` - Status da conexão com o servidor

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

## 🎨 Tipos de Dinossauros Suportados

- Carnotaurus
- Ceratosaurus
- Pachycephalosaurus
- Stegosaurus
- Tenontosaurus
- Triceratops
- Utahraptor

## 🗃️ Banco de Dados

O bot usa SQLite com as seguintes tabelas:

- **players**: Informações dos jogadores
- **garage**: Dinossauros armazenados
- **skins**: Skins desbloqueadas
- **active_skins**: Skins atualmente aplicadas

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abrir um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## ⚠️ Aviso

Este bot foi desenvolvido para fins educacionais e de comunidade. Certifique-se de seguir os Termos de Serviço do The Isle Evrima e do Discord ao usar este bot.

## 🐛 Problemas Conhecidos

- A integração RCON depende dos comandos específicos do servidor The Isle Evrima
- Alguns comandos podem precisar ser ajustados conforme a versão do servidor

## 📧 Suporte

Para reportar bugs ou sugerir melhorias, abra uma issue no GitHub.
