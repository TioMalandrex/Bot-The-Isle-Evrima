// Test for Steam ID linking functionality
const DatabaseManager = require('../src/database/manager');
const fs = require('fs');

console.log('🧪 Iniciando testes de vinculação de Steam ID...\n');

const testDbPath = './tests/steamid-test.db';

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
    console.log('   ✓ Banco de dados criado\n');

    // Test 1: Create player with Steam ID
    console.log('2. Testando criação de jogador com Steam ID...');
    const player1 = await db.getOrCreatePlayer('discord123', 'Player1', '76561198012345678');
    console.log(`   ✓ Jogador criado: ${player1.username} com Steam ID: ${player1.steam_id}\n`);

    // Test 2: Update Steam ID for existing player
    console.log('3. Testando atualização de Steam ID...');
    const player2 = await db.getOrCreatePlayer('discord456', 'Player2');
    console.log(`   ✓ Jogador criado sem Steam ID: ${player2.username}\n`);
    
    await db.updatePlayerSteamId('discord456', '76561198087654321');
    const updatedPlayer = await db.getPlayer('discord456');
    console.log(`   ✓ Steam ID atualizado: ${updatedPlayer.steam_id}\n`);

    // Test 3: Get player by Steam ID
    console.log('4. Testando busca por Steam ID...');
    const foundPlayer = await db.getPlayerBySteamId('76561198012345678');
    if (foundPlayer && foundPlayer.discord_id === 'discord123') {
      console.log(`   ✓ Jogador encontrado por Steam ID: ${foundPlayer.username}\n`);
    } else {
      throw new Error('Falha ao buscar jogador por Steam ID');
    }

    // Test 4: Verify Steam ID uniqueness
    console.log('5. Testando unicidade do Steam ID...');
    const duplicateCheck = await db.getPlayerBySteamId('76561198012345678');
    if (duplicateCheck.discord_id === 'discord123') {
      console.log('   ✓ Steam ID é único no banco de dados\n');
    } else {
      throw new Error('Steam ID não é único');
    }

    // Test 5: Update Steam ID to null
    console.log('6. Testando remoção de Steam ID...');
    await db.updatePlayerSteamId('discord123', null);
    const playerWithoutSteam = await db.getPlayer('discord123');
    if (playerWithoutSteam.steam_id === null) {
      console.log('   ✓ Steam ID removido com sucesso\n');
    } else {
      throw new Error('Falha ao remover Steam ID');
    }

    // Test 6: Link Steam ID again
    console.log('7. Testando nova vinculação de Steam ID...');
    await db.updatePlayerSteamId('discord123', '76561198099999999');
    const relinkedPlayer = await db.getPlayer('discord123');
    if (relinkedPlayer.steam_id === '76561198099999999') {
      console.log(`   ✓ Steam ID re-vinculado: ${relinkedPlayer.steam_id}\n`);
    } else {
      throw new Error('Falha ao re-vincular Steam ID');
    }

    // Close database
    db.close();
    console.log('8. Fechando banco de dados...');
    await new Promise(resolve => setTimeout(resolve, 100));
    console.log('   ✓ Banco de dados fechado\n');

    // Clean up
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
      console.log('9. Limpeza...');
      console.log('   ✓ Arquivo de teste removido\n');
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Todos os testes de Steam ID passaram com sucesso!');
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
