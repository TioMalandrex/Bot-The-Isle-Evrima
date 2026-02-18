# Guia de Contribuição

Obrigado por considerar contribuir para o Bot The Isle Evrima! 🦖

## Como Contribuir

### Reportar Bugs

Se você encontrar um bug, por favor:

1. Verifique se o bug já não foi reportado nas [Issues](https://github.com/TioMalandrex/Bot-The-Isle-Evrima/issues)
2. Crie uma nova issue com:
   - Descrição clara do problema
   - Passos para reproduzir
   - Comportamento esperado vs. comportamento atual
   - Screenshots (se aplicável)
   - Versão do Node.js e do bot
   - Logs de erro

### Sugerir Funcionalidades

Para sugerir novas funcionalidades:

1. Verifique se a funcionalidade já não foi sugerida
2. Crie uma issue descrevendo:
   - O problema que a funcionalidade resolve
   - Como ela deveria funcionar
   - Exemplos de uso

### Pull Requests

1. **Fork** o repositório
2. **Crie uma branch** para sua feature:
   ```bash
   git checkout -b feature/minha-nova-funcionalidade
   ```
3. **Faça suas alterações** seguindo o estilo do código existente
4. **Teste suas alterações**:
   ```bash
   npm test
   ```
5. **Commit suas mudanças** com mensagens descritivas:
   ```bash
   git commit -m "Adiciona funcionalidade X que faz Y"
   ```
6. **Push para sua branch**:
   ```bash
   git push origin feature/minha-nova-funcionalidade
   ```
7. **Abra um Pull Request** com:
   - Descrição clara das mudanças
   - Referência a issues relacionadas
   - Screenshots (se houver mudanças visuais)

## Padrões de Código

### JavaScript

- Use ES6+ features (async/await, arrow functions, etc.)
- Indentação: 2 espaços
- Sempre use ponto e vírgula
- Nomes de variáveis descritivos em camelCase
- Nomes de classes em PascalCase
- Constantes em UPPER_SNAKE_CASE

### Estrutura de Arquivos

```
src/
├── database/      # Gerenciamento de banco de dados
├── discord/       # Bot Discord e comandos
├── game/          # Integração com servidor do jogo
├── web/           # Servidor web e API
└── public/        # Frontend (HTML/CSS/JS)
```

### Commits

Use mensagens de commit descritivas:
- `feat:` para novas funcionalidades
- `fix:` para correções de bugs
- `docs:` para mudanças na documentação
- `refactor:` para refatorações
- `test:` para adição/modificação de testes
- `style:` para mudanças de formatação

Exemplos:
```
feat: Adiciona comando /trade para trocar dinossauros
fix: Corrige erro ao recuperar dinossauro da garagem
docs: Atualiza README com instruções de instalação
```

## Testando Localmente

1. Clone seu fork:
   ```bash
   git clone https://github.com/seu-usuario/Bot-The-Isle-Evrima.git
   cd Bot-The-Isle-Evrima
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o arquivo `.env`:
   ```bash
   cp .env.example .env
   # Edite .env com suas configurações
   ```

4. Execute os testes:
   ```bash
   npm test
   ```

5. Inicie o bot:
   ```bash
   npm start
   ```

## Adicionando Novos Comandos Discord

Para adicionar um novo comando:

1. Abra `src/discord/bot.js`
2. Adicione o comando em `setupCommands()`:
   ```javascript
   new SlashCommandBuilder()
     .setName('meucomando')
     .setDescription('Descrição do comando')
     .addStringOption(...)
   ```
3. Adicione o handler em `setupEvents()`:
   ```javascript
   case 'meucomando':
     await this.handleMeuComando(interaction);
     break;
   ```
4. Implemente o método:
   ```javascript
   async handleMeuComando(interaction) {
     await interaction.deferReply();
     // Sua lógica aqui
     await interaction.editReply('Resposta');
   }
   ```

## Adicionando Novos Endpoints API

Para adicionar um novo endpoint:

1. Abra `src/web/server.js`
2. Adicione o endpoint em `setupRoutes()`:
   ```javascript
   this.app.get('/api/meu-endpoint', async (req, res) => {
     try {
       // Sua lógica aqui
       res.json({ success: true });
     } catch (error) {
       res.status(500).json({ error: error.message });
     }
   });
   ```

## Adicionando Métodos ao Banco de Dados

Para adicionar novos métodos ao banco:

1. Abra `src/database/manager.js`
2. Adicione o método usando Promises:
   ```javascript
   meuMetodo(parametro) {
     return new Promise((resolve, reject) => {
       this.db.get('SELECT * FROM ...', [parametro], (err, row) => {
         if (err) reject(err);
         else resolve(row);
       });
     });
   }
   ```

## Áreas que Precisam de Contribuição

- [ ] Testes automatizados mais abrangentes
- [ ] Documentação de comandos específicos do servidor The Isle
- [ ] Interface web mobile-friendly
- [ ] Sistema de backup do banco de dados
- [ ] Logs mais detalhados
- [ ] Suporte a múltiplos servidores Discord
- [ ] Internacionalização (i18n)
- [ ] Dashboard de administração

## Código de Conduta

- Seja respeitoso com outros contribuidores
- Aceite críticas construtivas
- Foque no que é melhor para o projeto
- Mostre empatia com outros membros da comunidade

## Precisa de Ajuda?

Se você tiver dúvidas, pode:

- Abrir uma [issue](https://github.com/TioMalandrex/Bot-The-Isle-Evrima/issues)
- Entrar em contato via Discord (se disponível)

## Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a licença MIT do projeto.
