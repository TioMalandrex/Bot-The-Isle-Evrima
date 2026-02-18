// Integration test for Steam ID linking system
const DatabaseManager = require('../src/database/manager');
const fs = require('fs');

console.log('🧪 Iniciando testes de integração do sistema de vinculação...\n');

const testDbPath = './tests/integration-test.db';

// Clean up test database if it exists
if (fs.existsSync(testDbPath)) {
  fs.unlinkSync(testDbPath);
}

async function runTests() {
  try {
    console.log('1. Inicializando banco de dados...');
    const db = new DatabaseManager(testDbPath);
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('   ✓ Banco de dados criado\n');

    // Scenario 1: User links Steam ID via Discord
    console.log('2. Cenário 1: Usuário vincula Steam ID via Discord');
    const discordUser1 = 'discord123456';
    const steamId1 = '76561198012345678';
    
    // Create player without Steam ID
    const player1 = await db.getOrCreatePlayer(discordUser1, 'TestPlayer1');
    console.log(`   ✓ Jogador criado: ${player1.username}`);
    
    // Link Steam ID
    await db.updatePlayerSteamId(discordUser1, steamId1);
    const linkedPlayer1 = await db.getPlayer(discordUser1);
    
    if (linkedPlayer1.steam_id === steamId1) {
      console.log(`   ✓ Steam ID vinculado: ${linkedPlayer1.steam_id}\n`);
    } else {
      throw new Error('Falha ao vincular Steam ID');
    }

    // Scenario 2: User tries to link already used Steam ID
    console.log('3. Cenário 2: Verificar Steam ID duplicado');
    const discordUser2 = 'discord789012';
    await db.getOrCreatePlayer(discordUser2, 'TestPlayer2');
    
    // Check if Steam ID is already in use
    const existingPlayer = await db.getPlayerBySteamId(steamId1);
    if (existingPlayer && existingPlayer.discord_id !== discordUser2) {
      console.log('   ✓ Steam ID já vinculado detectado corretamente\n');
    } else {
      throw new Error('Verificação de duplicação falhou');
    }

    // Scenario 3: Player unlocks and applies skin
    console.log('4. Cenário 3: Sistema de skins com Steam ID');
    
    // Unlock skin
    await db.unlockSkin(player1.id, 'Carnotaurus', 'carno_apex', 'Apex', {});
    const skins = await db.getPlayerSkins(player1.id);
    console.log(`   ✓ Skin desbloqueada: ${skins.length} skin(s)`);
    
    // Apply skin
    await db.setActiveSkin(player1.id, 'Carnotaurus', 'carno_apex');
    const activeSkin = await db.getActiveSkin(player1.id, 'Carnotaurus');
    
    if (activeSkin && activeSkin.skin_id === 'carno_apex') {
      console.log(`   ✓ Skin ativa aplicada: ${activeSkin.skin_name}\n`);
    } else {
      throw new Error('Falha ao aplicar skin');
    }

    // Scenario 4: Store and retrieve dinosaur
    console.log('5. Cenário 4: Sistema de garagem');
    
    // Store dinosaur
    await db.storeInGarage(player1.id, 'Carnotaurus', 'Rex', 1.0, { health: 100 });
    const garage = await db.getGarage(player1.id);
    console.log(`   ✓ Dinossauro armazenado: ${garage.length} item(s) na garagem`);
    
    // Retrieve dinosaur
    const retrieved = await db.retrieveFromGarage(garage[0].id);
    if (retrieved && retrieved.dinosaur_type === 'Carnotaurus') {
      console.log(`   ✓ Dinossauro recuperado: ${retrieved.dinosaur_type}\n`);
    } else {
      throw new Error('Falha ao recuperar dinossauro');
    }

    // Scenario 5: User profile with Steam ID
    console.log('6. Cenário 5: Perfil do jogador');
    const profile = await db.getPlayer(discordUser1);
    
    console.log(`   Discord ID: ${profile.discord_id}`);
    console.log(`   Steam ID: ${profile.steam_id}`);
    console.log(`   Username: ${profile.username}`);
    console.log(`   ✓ Perfil completo com Steam ID vinculado\n`);

    // Scenario 6: Update Steam ID (re-link)
    console.log('7. Cenário 6: Re-vinculação de Steam ID');
    const newSteamId = '76561198099999999';
    await db.updatePlayerSteamId(discordUser1, newSteamId);
    const relinkedPlayer = await db.getPlayer(discordUser1);
    
    if (relinkedPlayer.steam_id === newSteamId) {
      console.log(`   ✓ Steam ID atualizado: ${relinkedPlayer.steam_id}\n`);
    } else {
      throw new Error('Falha ao atualizar Steam ID');
    }

    // Scenario 7: Multiple players with different Steam IDs
    console.log('8. Cenário 7: Múltiplos jogadores');
    const player3 = await db.getOrCreatePlayer('discord999', 'TestPlayer3', '76561198011111111');
    const player4 = await db.getOrCreatePlayer('discord888', 'TestPlayer4', '76561198022222222');
    
    const foundPlayer3 = await db.getPlayerBySteamId('76561198011111111');
    const foundPlayer4 = await db.getPlayerBySteamId('76561198022222222');
    
    if (foundPlayer3.discord_id === 'discord999' && foundPlayer4.discord_id === 'discord888') {
      console.log('   ✓ Múltiplos jogadores com Steam IDs únicos\n');
    } else {
      throw new Error('Falha ao gerenciar múltiplos jogadores');
    }

    // Close database
    db.close();
    console.log('9. Fechando banco de dados...');
    await new Promise(resolve => setTimeout(resolve, 100));
    console.log('   ✓ Banco de dados fechado\n');

    // Clean up
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
      console.log('10. Limpeza...');
      console.log('    ✓ Arquivo de teste removido\n');
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Todos os testes de integração passaram!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📋 Resumo dos cenários testados:');
    console.log('   1. Vinculação de Steam ID via Discord');
    console.log('   2. Detecção de Steam ID duplicado');
    console.log('   3. Sistema de skins com Steam ID');
    console.log('   4. Sistema de garagem');
    console.log('   5. Perfil do jogador');
    console.log('   6. Re-vinculação de Steam ID');
    console.log('   7. Múltiplos jogadores');
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
