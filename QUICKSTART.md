# Guia Rápido de Instalação

## 1. Instalação das Dependências

```bash
npm install
```

## 2. Configuração do Bot Discord

### Criar o Bot:
1. Acesse https://discord.com/developers/applications
2. Clique em "New Application"
3. Dê um nome para sua aplicação (ex: "The Isle Bot")
4. Vá para a seção "Bot"
5. Clique em "Add Bot"
6. Em "Privileged Gateway Intents", habilite:
   - MESSAGE CONTENT INTENT
7. Copie o Token do Bot

### Obter o Client ID:
1. Na mesma página, vá para "OAuth2" > "General"
2. Copie o "Client ID"

### Adicionar o Bot ao Servidor:
1. Vá para "OAuth2" > "URL Generator"
2. Selecione os scopes:
   - `bot`
   - `applications.commands`
3. Selecione as permissões:
   - Send Messages
   - Use Slash Commands
   - Read Message History
4. Copie a URL gerada e abra no navegador
5. Selecione seu servidor e autorize

## 3. Configuração do Arquivo .env

Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

Edite o arquivo `.env` e preencha:

```env
DISCORD_TOKEN=seu_token_aqui
DISCORD_CLIENT_ID=seu_client_id_aqui

WEB_PORT=3000
WEB_HOST=0.0.0.0

GAME_SERVER_HOST=seu_servidor_the_isle
GAME_SERVER_PORT=8888
GAME_SERVER_PASSWORD=senha_rcon
```

**Nota:** Se você não tem um servidor The Isle Evrima, deixe as configurações do servidor do jogo como estão. O bot funcionará normalmente sem a integração RCON.

## 4. Iniciar o Bot

```bash
npm start
```

Ou para desenvolvimento:
```bash
npm run dev
```

## 5. Acessar a Interface Web

Abra seu navegador em:
```
http://localhost:3000
```

## 6. Testar no Discord

No seu servidor Discord, use os comandos:
- `/profile` - Ver seu perfil
- `/garage` - Ver sua garagem
- `/skins` - Ver suas skins

## Problemas Comuns

### "Cannot find module"
Execute `npm install` novamente.

### "Invalid token"
Verifique se o token do Discord no arquivo `.env` está correto.

### "Connection refused" (servidor do jogo)
Verifique se:
- O servidor The Isle está rodando
- RCON está habilitado
- Host e porta estão corretos
- Senha RCON está correta

**Nota:** O bot funciona normalmente mesmo sem conexão com o servidor do jogo. A integração RCON é opcional.
