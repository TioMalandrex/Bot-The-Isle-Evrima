# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

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
