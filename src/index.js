require('dotenv').config();
const DatabaseManager = require('./database/manager');
const GameServerManager = require('./game/server');
const DiscordBot = require('./discord/bot');
const WebServer = require('./web/server');
const { REST, Routes } = require('discord.js');

// Configurações
const config = {
  discord: {
    token: process.env.DISCORD_TOKEN,
    clientId: process.env.DISCORD_CLIENT_ID
  },
  web: {
    port: process.env.WEB_PORT || 3000,
    host: process.env.WEB_HOST || '0.0.0.0'
  },
  game: {
    host: process.env.GAME_SERVER_HOST || 'localhost',
    port: parseInt(process.env.GAME_SERVER_PORT) || 8888,
    password: process.env.GAME_SERVER_PASSWORD
  },
  database: {
    path: process.env.DATABASE_PATH || './data/bot.db'
  }
};

async function main() {
  console.log('🦖 Iniciando Bot The Isle Evrima...\n');

  // Inicializar banco de dados
  console.log('📦 Inicializando banco de dados...');
  const database = new DatabaseManager(config.database.path);
  console.log('✓ Banco de dados inicializado\n');

  // Inicializar servidor do jogo
  console.log('🎮 Conectando ao servidor do jogo...');
  const gameServer = new GameServerManager(
    config.game.host,
    config.game.port,
    config.game.password
  );
  
  // Tentar conectar (não crítico se falhar)
  await gameServer.connect().catch(err => {
    console.log('⚠ Servidor do jogo não está disponível (continuando sem ele)\n');
  });

  // Inicializar bot Discord
  if (config.discord.token && config.discord.clientId) {
    console.log('🤖 Iniciando bot Discord...');
    const discordBot = new DiscordBot(config.discord.token, database, gameServer);
    
    // Registrar comandos slash
    try {
      const rest = new REST({ version: '10' }).setToken(config.discord.token);
      console.log('📝 Registrando comandos slash do Discord...');
      
      await rest.put(
        Routes.applicationCommands(config.discord.clientId),
        { body: discordBot.getCommands() }
      );
      
      console.log('✓ Comandos slash registrados\n');
    } catch (error) {
      console.error('✗ Erro ao registrar comandos:', error.message);
    }
    
    await discordBot.start();
    console.log('');
  } else {
    console.log('⚠ Token Discord não configurado. Bot Discord não iniciado.\n');
  }

  // Inicializar servidor web
  console.log('🌐 Iniciando servidor web...');
  const webServer = new WebServer(
    config.web.port,
    config.web.host,
    database,
    gameServer
  );
  webServer.start();
  console.log('');

  console.log('✓ Todos os sistemas inicializados!\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 Informações:');
  console.log(`   Web Interface: http://${config.web.host}:${config.web.port}`);
  console.log(`   Database: ${config.database.path}`);
  console.log(`   Game Server: ${gameServer.isConnected() ? '✓ Conectado' : '✗ Desconectado'}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n🛑 Desligando o bot...');
    await gameServer.disconnect();
    database.close();
    process.exit(0);
  });
}

// Tratamento de erros não capturados
process.on('unhandledRejection', (error) => {
  console.error('Erro não tratado:', error);
});

main().catch(error => {
  console.error('Erro ao iniciar o bot:', error);
  process.exit(1);
});
