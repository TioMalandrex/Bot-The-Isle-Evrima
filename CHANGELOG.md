# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [1.2.0] - 2026-02-19

### Adicionado

#### Sistema de Vinculação Steam ID
- Comando `/link` para vincular Discord ID ao Steam ID
- Validação de formato Steam ID (17 dígitos)
- Verificação de unicidade (um Steam ID por conta)
- Endpoint API `POST /api/player/link`
- Documentação completa do sistema

#### Sistema de Detecção Automática via RCON
- Detecção automática do dinossauro atual do jogador
- Captura de estatísticas em tempo real:
  - ❤️ Vida (Health: 0-100)
  - 🍖 Fome (Hunger: 0-100)
  - 💧 Sede (Thirst: 0-100)
  - ⚡ Stamina (Stamina: 0-100)
  - 📍 Localização (coordenadas X, Y, Z)
  - 🧬 Mutações (características especiais)
- Parser inteligente para respostas RCON (JSON e texto)
- Método `getCurrentDinosaur()` no GameServerManager
- Método `parsePlayerData()` para extração de dados

#### Menu Interativo com Botões
- Novo comando `/menu` com interface de botões
- 💾 **Guardar Atual**: Detecta e armazena dino automaticamente
- 📦 **Ver Garagem**: Mostra todos os dinos com stats completas
- 🔄 **Recuperar Dino**: SelectMenu dropdown para escolher dino
- Sistema completo de interação com botões e select menus
- Confirmações antes de ações importantes

#### Sistema de Economia
- Pontos/moeda virtual para o servidor
- Comando `/balance` - Ver saldo de pontos
- Comando `/daily` - Resgatar recompensa diária (100 pontos/24h)
- Comando `/transfer` - Transferir pontos entre jogadores
- Comando `/leaderboard` - Rankings (pontos, kills, tempo de jogo)
- Histórico completo de transações
- Tabelas: `player_economy`, `transactions`
- Sistema de recompensas configurável

#### Estatísticas de Jogador
- Rastreamento de tempo de jogo (playtime)
- Contador de kills e deaths
- Cálculo automático de K/D ratio
- Distância percorrida
- Contador de dinossauros jogados
- Comando `/stats` para visualizar estatísticas
- Tabela `player_stats` no banco de dados

#### Comandos de Admin via RCON
- `/announce <mensagem>` - Anúncios para todo o servidor
- `/kick <steamid> [motivo]` - Remover jogador
- `/ban <nome> <steamid> [motivo] [duração]` - Banir jogador
- `/players` - Listar jogadores online
- 15+ comandos RCON disponíveis:
  - `directmessage` - Mensagem privada para jogador
  - `goto` / `bring` - Comandos de teleporte
  - `promote` / `demote` - Gerenciar admins
  - `settime` / `setweather` - Controles do ambiente
  - `save` - Salvar estado do servidor
- Logs automáticos de ações administrativas
- Tabela `admin_logs` para auditoria
- Requer permissões de "Administrator" no Discord

#### Melhorias na Garagem
- Armazenamento com estatísticas completas
- 9 novos campos no banco de dados:
  - `health`, `hunger`, `thirst`, `stamina` (REAL)
  - `location_x`, `location_y`, `location_z` (REAL)
  - `mutations` (TEXT/JSON)
  - `current_dino` (BOOLEAN)
- Visualização completa no Discord e Web
- Método `storeInGarageWithStats()` no DatabaseManager
- Interface web atualizada com todos os campos

#### Testes Automatizados
- `tests/auto-detect.test.js` - 9 testes de detecção automática
- `tests/economy.test.js` - 15 testes do sistema de economia
- `tests/steamid-link.test.js` - Testes de vinculação Steam ID
- `tests/integration.test.js` - Testes de integração
- `tests/database.test.js` - Testes de banco de dados
- Total: 46 testes automatizados
- Scripts individuais: `npm run test:db`, `test:economy`, etc.

#### Documentação
- Screenshots atualizados no README
- Consolidação de 6 arquivos .md em README.md único
- Seções expandidas:
  - Detecção Automática via RCON
  - Sistema de Economia
  - Comandos Admin
  - API REST completa
  - Vinculação Steam ID
  - 20 Dinossauros com habilidades
  - Configuração RCON detalhada
- README.md expandido de 461 para 853 linhas

### Modificado

#### Interface Discord
- Substituição de comandos tradicionais por interações com botões
- Sistema de confirmação para ações importantes
- Embeds melhorados com todas as estatísticas
- Formatação com emojis e ícones

#### Interface Web
- Exibição de health, hunger, thirst, stamina
- Coordenadas de localização no mapa
- Lista de mutações
- Cards de dinossauros mais informativos
- Design aprimorado com gradiente azul

#### Banco de Dados
- Schema `garage` expandido com 9 novos campos
- Novas tabelas:
  - `player_economy` - Pontos e transações
  - `player_stats` - Estatísticas de jogo
  - `transactions` - Histórico de transações
  - `admin_logs` - Registro de ações admin
  - `server_config` - Configurações do servidor
- Métodos aprimorados no DatabaseManager

#### RCON Integration
- Parser mais robusto (JSON + texto)
- Suporte a 15+ comandos
- Tratamento de erros melhorado
- Métodos adicionais no GameServerManager

#### Configuração
- `.gitignore` expandido de 19 para 71 linhas
- Cobertura completa para:
  - Arquivos de OS (macOS, Windows, Linux)
  - Editores (VS Code, IntelliJ, Visual Studio)
  - Artifacts de testes (coverage, nyc, lcov)
  - Variantes de DB (*.sqlite, *.sqlite3)
  - Logs detalhados (npm, yarn, lerna)

#### Scripts de Teste
- `npm test` agora roda TODOS os 5 arquivos de teste
- Scripts individuais adicionados:
  - `test:db` - Testes de banco de dados
  - `test:economy` - Testes de economia
  - `test:auto` - Testes de auto-detecção
  - `test:steamid` - Testes de Steam ID
  - `test:integration` - Testes de integração

### Removido
- `ADVANCED_FEATURES.md` - Consolidado no README
- `API.md` - Consolidado no README
- `AUTO_DETECTION.md` - Consolidado no README
- `DINOSAURS_REFERENCE.md` - Consolidado no README
- `SERVER_COMMUNICATION.md` - Consolidado no README
- `STEAMID_LINKING.md` - Consolidado no README

### Melhorias Técnicas
- Redução de documentação de 3,191 para 1,403 linhas (56%)
- Redução de arquivos .md de 10 para 4 (60%)
- Repositório mais limpo e organizado
- Melhor manutenibilidade
- Documentação centralizada

### Notas de Atualização
- Todos os dados existentes são preservados
- Banco de dados é atualizado automaticamente
- Steam ID é opcional (funcionalidade backward compatible)
- RCON permanece opcional

## [1.1.0] - 2026-02-18

### Adicionado
- Suporte completo para Build 21811079 (Fevereiro 2026)
- 13 novos dinossauros adicionados:
  - **Carnívoros**: Omniraptor, Troodon, Dilophosaurus, Pteranodon, Herrerasaurus, Deinosuchus, Allosaurus, Tyrannosaurus rex
  - **Herbívoros**: Hypsilophodon, Diabloceratops, Dryosaurus, Maiasaura
  - **Onívoros**: Gallimimus, Beipiaosaurus
- Arquivo de referência completo de dinossauros (DINOSAURS_REFERENCE.md)
- Categorização por tipo (Carnívoros, Herbívoros, Onívoros)
- Exemplos de skins para todos os novos dinossauros

### Modificado
- Interface web atualizada com 20 dinossauros
- Seleção de dinossauros organizada por categoria
- SKINS_EXAMPLES.md expandido com todas as espécies
- README atualizado com lista completa
- PROJECT_SUMMARY.md atualizado

### Removido
- Utahraptor (não disponível na Build 21811079)

## [1.0.0] - 2024-01-01

### Adicionado
- Sistema completo de bot com integração Discord, Web e Servidor do Jogo
- Bot Discord com comandos slash
  - `/garage` - Visualizar dinossauros na garagem
  - `/store` - Armazenar dinossauro na garagem
  - `/retrieve` - Recuperar dinossauro da garagem
  - `/skins` - Ver skins disponíveis
  - `/changeskin` - Mudar skin de dinossauro
  - `/profile` - Ver perfil do jogador
- Interface Web completa
  - Dashboard interativo
  - Gerenciamento de garagem
  - Sistema de skins
  - Visualização de perfil
- API REST completa
  - Endpoints para jogadores
  - Endpoints para garagem
  - Endpoints para skins
- Sistema de banco de dados SQLite
  - Armazenamento de jogadores
  - Sistema de garagem
  - Sistema de skins
  - Skins ativas
- Integração RCON com servidor The Isle Evrima
  - Comunicação com servidor do jogo
  - Comandos de gerenciamento
  - Aplicação automática de skins
- Documentação completa
  - README detalhado
  - Guia rápido de instalação
  - Documentação da API
  - Exemplos de skins
  - Guia de contribuição
  - Licença MIT
- Testes automatizados
  - Testes de banco de dados
  - Validação de funcionalidades

### Características
- Suporte inicial a 7 tipos de dinossauros
  - Carnotaurus
  - Ceratosaurus
  - Pachycephalosaurus
  - Stegosaurus
  - Tenontosaurus
  - Triceratops
  - Utahraptor
- Sistema multi-plataforma
  - Discord Bot
  - Interface Web
  - Servidor do Jogo
- Banco de dados persistente
- Configuração via variáveis de ambiente
- Sistema de gerenciamento de skins
- Armazenamento de progresso de dinossauros

### Notas Técnicas
- Node.js 16.x ou superior
- Discord.js v14
- Express v4
- SQLite3 v5
- RCON Client v4
