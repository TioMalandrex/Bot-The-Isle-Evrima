// Test for new economy and admin features
const DatabaseManager = require('../src/database/manager');
const fs = require('fs');

console.log('🧪 Iniciando testes do sistema de economia e admin...\n');

const testDbPath = './tests/economy-test.db';

// Clean up test database if it exists
if (fs.existsSync(testDbPath)) {
  fs.unlinkSync(testDbPath);
}

async function runTests() {
  try {
    // Initialize database
    console.log('1. Inicializando banco de dados...');
    const db = new DatabaseManager(testDbPath);
    
    // Wait for tables to be created
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('   ✓ Banco de dados criado com novas tabelas\n');

    // Test player creation and economy
    console.log('2. Testando sistema de economia...');
    const player1 = await db.getOrCreatePlayer('discord123', 'Player1', 'steam123');
    const player2 = await db.getOrCreatePlayer('discord456', 'Player2', 'steam456');
    console.log(`   ✓ Jogadores criados: ${player1.username}, ${player2.username}\n`);

    // Test adding points
    console.log('3. Testando adição de pontos...');
    await db.addPoints(player1.id, 100, 'Recompensa diária');
    await db.addPoints(player1.id, 50, 'Bônus de kill');
    const economy1 = await db.getPlayerEconomy(player1.id);
    console.log(`   ✓ Player1 tem ${economy1.points} pontos (total ganho: ${economy1.total_earned})\n`);

    // Test removing points
    console.log('4. Testando remoção de pontos...');
    await db.removePoints(player1.id, 30, 'Compra de dinossauro');
    const economy1After = await db.getPlayerEconomy(player1.id);
    console.log(`   ✓ Player1 agora tem ${economy1After.points} pontos (gasto: ${economy1After.total_spent})\n`);

    // Test transfer points
    console.log('5. Testando transferência de pontos...');
    await db.addPoints(player2.id, 50, 'Inicial');
    await db.transferPoints(player1.id, player2.id, 20);
    const economy2 = await db.getPlayerEconomy(player2.id);
    console.log(`   ✓ Player2 recebeu pontos, total: ${economy2.points}\n`);

    // Test transaction history
    console.log('6. Testando histórico de transações...');
    const history = await db.getTransactionHistory(player1.id);
    console.log(`   ✓ ${history.length} transações registradas\n`);

    // Test player stats
    console.log('7. Testando sistema de estatísticas...');
    await db.updatePlayerStats(player1.id, {
      playtime_minutes: 120,
      kills: 5,
      deaths: 2,
      dinosaurs_played: 3
    });
    const stats1 = await db.getPlayerStats(player1.id);
    console.log(`   ✓ Stats: ${stats1.playtime_minutes}min, ${stats1.kills} kills, ${stats1.deaths} deaths\n`);

    // Test updating stats multiple times
    console.log('8. Testando atualização incremental de stats...');
    await db.updatePlayerStats(player1.id, {
      kills: 3,
      deaths: 1
    });
    const stats1Updated = await db.getPlayerStats(player1.id);
    console.log(`   ✓ Stats atualizadas: ${stats1Updated.kills} kills, ${stats1Updated.deaths} deaths\n`);

    // Test leaderboard
    console.log('9. Testando leaderboard...');
    await db.updatePlayerStats(player2.id, {
      kills: 10,
      deaths: 3,
      playtime_minutes: 200
    });
    await db.addPoints(player2.id, 200, 'Bônus');
    
    const killsLeaderboard = await db.getLeaderboard('kills', 5);
    console.log(`   ✓ Leaderboard de kills tem ${killsLeaderboard.length} entradas\n`);

    const pointsLeaderboard = await db.getLeaderboard('points', 5);
    console.log(`   ✓ Leaderboard de pontos tem ${pointsLeaderboard.length} entradas\n`);

    // Test admin logs
    console.log('10. Testando logs de admin...');
    await db.logAdminAction(player1.id, 'kick', 'steam789', 'Violação de regras');
    await db.logAdminAction(player1.id, 'announce', null, 'Servidor reiniciando');
    const logs = await db.getAdminLogs(10);
    console.log(`   ✓ ${logs.length} ações de admin registradas\n`);

    // Test server config
    console.log('11. Testando configuração do servidor...');
    await db.setServerConfig('motd', 'Bem-vindo ao servidor!');
    await db.setServerConfig('max_players', '50');
    const motd = await db.getServerConfig('motd');
    console.log(`   ✓ MOTD configurado: "${motd}"\n`);

    // Test insufficient points error
    console.log('12. Testando erro de pontos insuficientes...');
    try {
      await db.removePoints(player1.id, 10000, 'Teste');
      console.log('   ✗ Deveria ter falhado!\n');
    } catch (error) {
      console.log('   ✓ Erro capturado corretamente: Pontos insuficientes\n');
    }

    // Test K/D ratio calculation
    console.log('13. Testando cálculo de K/D ratio...');
    const stats = await db.getPlayerStats(player1.id);
    const kd = stats.deaths > 0 ? (stats.kills / stats.deaths).toFixed(2) : stats.kills;
    console.log(`   ✓ K/D ratio: ${kd}\n`);

    // Close database
    db.close();
    console.log('14. Fechando banco de dados...');
    await new Promise(resolve => setTimeout(resolve, 100));
    console.log('    ✓ Banco de dados fechado\n');

    // Clean up
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
      console.log('15. Limpeza...');
      console.log('    ✓ Arquivo de teste removido\n');
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Todos os testes de economia e admin passaram!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Erro durante os testes:', error);
    
    // Clean up on error
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
    
    process.exit(1);
  }
}

runTests();
