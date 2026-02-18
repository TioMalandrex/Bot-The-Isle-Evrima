// Simple test to validate database functionality
const DatabaseManager = require('../src/database/manager');
const fs = require('fs');
const path = require('path');

console.log('🧪 Iniciando testes do banco de dados...\n');

const testDbPath = './tests/test.db';

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

    // Test player creation
    console.log('2. Testando criação de jogador...');
    const player = await db.getOrCreatePlayer('123456789', 'TestPlayer', 'steam123');
    console.log(`   ✓ Jogador criado: ${player.username} (ID: ${player.id})\n`);

    // Test garage functionality
    console.log('3. Testando sistema de garagem...');
    await db.storeInGarage(player.id, 'Carnotaurus', 'Rex', 1.0, { health: 100 });
    await db.storeInGarage(player.id, 'Stegosaurus', 'Spike', 0.8, { health: 95 });
    const garage = await db.getGarage(player.id);
    console.log(`   ✓ ${garage.length} dinossauros armazenados na garagem\n`);

    // Test skin functionality
    console.log('4. Testando sistema de skins...');
    await db.unlockSkin(player.id, 'Carnotaurus', 'carno_desert', 'Deserto', { color: '#FFD700' });
    await db.unlockSkin(player.id, 'Carnotaurus', 'carno_jungle', 'Selva', { color: '#228B22' });
    const skins = await db.getPlayerSkins(player.id);
    console.log(`   ✓ ${skins.length} skins desbloqueadas\n`);

    // Test active skin
    console.log('5. Testando aplicação de skin...');
    await db.setActiveSkin(player.id, 'Carnotaurus', 'carno_desert');
    const activeSkin = await db.getActiveSkin(player.id, 'Carnotaurus');
    console.log(`   ✓ Skin ativa: ${activeSkin.skin_name}\n`);

    // Test retrieval
    console.log('6. Testando recuperação da garagem...');
    const item = await db.retrieveFromGarage(garage[0].id);
    console.log(`   ✓ ${item.dinosaur_type} recuperado da garagem\n`);

    // Verify garage after retrieval
    const garageAfter = await db.getGarage(player.id);
    console.log(`   ✓ Garagem agora tem ${garageAfter.length} dinossauros\n`);

    // Close database
    db.close();
    console.log('7. Fechando banco de dados...');
    await new Promise(resolve => setTimeout(resolve, 100));
    console.log('   ✓ Banco de dados fechado\n');

    // Clean up
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
      console.log('8. Limpeza...');
      console.log('   ✓ Arquivo de teste removido\n');
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Todos os testes passaram com sucesso!');
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
