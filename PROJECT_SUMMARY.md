# Resumo do Projeto - Bot The Isle Evrima

## 🎯 Visão Geral

Este é um bot completo e funcional para **The Isle Evrima** que integra três plataformas:

1. **Discord Bot** - Comandos interativos via Discord
2. **Interface Web** - Dashboard visual acessível pelo navegador
3. **Servidor do Jogo** - Integração RCON para comunicação com o servidor

## 📦 O que foi Implementado

### ✅ Sistema de Garagem de Dinossauros
- Armazenar dinossauros com informações completas (tipo, nome, crescimento, stats)
- Visualizar todos os dinossauros armazenados
- Recuperar dinossauros quando necessário
- Remover dinossauros da garagem
- Suporte a 7 tipos diferentes de dinossauros

### ✅ Sistema de Skins (Skin Changer)
- Desbloquear novas skins para dinossauros
- Aplicar skins via Discord ou Web
- Visualizar skins disponíveis
- Sistema de skins ativas por tipo de dinossauro
- Aplicação automática no servidor (quando conectado)

### ✅ Bot Discord
Comandos Slash disponíveis:
- `/garage` - Ver garagem
- `/store` - Armazenar dinossauro
- `/retrieve` - Recuperar dinossauro
- `/skins` - Ver skins
- `/changeskin` - Mudar skin
- `/profile` - Ver perfil

### ✅ Interface Web
- Dashboard moderno e responsivo
- Gerenciamento completo de garagem
- Sistema de skins visual
- Visualização de perfil do jogador
- Design com tema do jogo

### ✅ API REST
Endpoints implementados:
- **Jogadores**: GET `/api/player/:discordId`
- **Garagem**: GET/POST/DELETE `/api/garage/...`
- **Skins**: GET/POST `/api/skins/...`
- **Status**: GET `/api/status`

### ✅ Banco de Dados
- SQLite para armazenamento persistente
- 4 tabelas principais:
  - `players` - Informações dos jogadores
  - `garage` - Dinossauros armazenados
  - `skins` - Skins desbloqueadas
  - `active_skins` - Skins aplicadas
- Suporte async/await completo

### ✅ Integração com Servidor
- Conexão RCON
- Comandos para aplicar mudanças no servidor
- Sistema de fallback (funciona sem servidor conectado)

### ✅ Documentação
- README completo
- Guia de instalação rápida
- Documentação da API
- Exemplos de skins
- Guia de contribuição
- Changelog

## 🛠️ Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Discord.js v14** - Bot Discord
- **Express** - Servidor web
- **SQLite3** - Banco de dados
- **RCON Client** - Comunicação com servidor do jogo
- **HTML/CSS/JavaScript** - Interface web

## 📂 Estrutura do Projeto

```
Bot-The-Isle-Evrima/
├── src/
│   ├── database/
│   │   └── manager.js          # Sistema de banco de dados
│   ├── discord/
│   │   └── bot.js              # Bot Discord e comandos
│   ├── game/
│   │   └── server.js           # RCON e comunicação com servidor
│   ├── web/
│   │   └── server.js           # API e servidor web
│   ├── public/
│   │   └── index.html          # Interface web
│   └── index.js                # Entry point principal
├── tests/
│   └── database.test.js        # Testes automatizados
├── docs/
│   ├── README.md               # Documentação principal
│   ├── QUICKSTART.md           # Guia rápido
│   ├── API.md                  # Documentação API
│   ├── CONTRIBUTING.md         # Guia de contribuição
│   ├── CHANGELOG.md            # Histórico de mudanças
│   └── SKINS_EXAMPLES.md       # Exemplos de skins
├── .env.example                # Exemplo de configuração
├── package.json                # Dependências do projeto
└── LICENSE                     # Licença MIT
```

## 🚀 Como Usar

### Instalação Rápida
```bash
# 1. Clone o repositório
git clone https://github.com/TioMalandrex/Bot-The-Isle-Evrima.git
cd Bot-The-Isle-Evrima

# 2. Instale as dependências
npm install

# 3. Configure o .env
cp .env.example .env
# Edite .env com suas configurações

# 4. Inicie o bot
npm start
```

### Configuração Mínima
```env
DISCORD_TOKEN=seu_token
DISCORD_CLIENT_ID=seu_client_id
WEB_PORT=3000
```

### Acessar a Interface
```
http://localhost:3000
```

## ✨ Funcionalidades Principais

### Via Discord
1. Use `/profile` para ver seu perfil
2. Use `/store` para guardar um dinossauro
3. Use `/garage` para ver o que você tem
4. Use `/changeskin` para mudar a aparência

### Via Web
1. Acesse `http://localhost:3000`
2. Insira seu Discord ID
3. Navegue pelas abas (Garagem, Skins, Perfil)
4. Gerencie seus dinossauros e skins

### Via API
```javascript
// Exemplo: Obter garagem
fetch('http://localhost:3000/api/garage/SEU_DISCORD_ID')
  .then(res => res.json())
  .then(data => console.log(data));
```

## 🎮 Tipos de Dinossauros Suportados (Build 21811079)

### Carnívoros (10)
- Carnotaurus
- Omniraptor
- Ceratosaurus
- Troodon
- Dilophosaurus
- Pteranodon
- Herrerasaurus
- Deinosuchus
- Allosaurus ⭐
- Tyrannosaurus rex ⭐

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

**Total: 20 dinossauros jogáveis** compatíveis com a versão atual do jogo (Fevereiro 2026).

## 🔧 Requisitos do Sistema

- Node.js 16.x ou superior
- npm ou yarn
- (Opcional) Servidor The Isle Evrima com RCON

## 📝 Notas Importantes

1. **Servidor RCON é Opcional**: O bot funciona perfeitamente sem conexão com o servidor do jogo. A integração RCON é um plus.

2. **Discord Bot**: Você precisa criar um bot no Discord Developer Portal e obter o token.

3. **Banco de Dados**: Criado automaticamente na primeira execução em `./data/bot.db`

4. **Testes**: Execute `npm test` para validar o sistema de banco de dados.

## 🐛 Problemas Conhecidos

- A integração RCON usa comandos hipotéticos do The Isle Evrima que podem precisar ajustes
- Alguns comandos específicos do servidor podem variar dependendo da versão

## 🤝 Contribuindo

Consulte [CONTRIBUTING.md](CONTRIBUTING.md) para instruções sobre como contribuir.

## 📄 Licença

Este projeto está sob a licença MIT. Veja [LICENSE](LICENSE) para mais detalhes.

## 🎉 Status do Projeto

**Status**: ✅ Funcional e pronto para uso

**Última Atualização**: Janeiro 2024

**Versão**: 1.0.0

---

**Desenvolvido com ❤️ para a comunidade The Isle Evrima**
