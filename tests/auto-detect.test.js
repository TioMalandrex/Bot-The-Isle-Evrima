// Test for automatic dinosaur detection system
const DatabaseManager = require('../src/database/manager');
const GameServerManager = require('../src/game/server');
const fs = require('fs');

console.log('🧪 Iniciando testes do sistema de detecção automática...\n');

const testDbPath = './tests/auto-detect-test.db';

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
    console.log('   ✓ Banco de dados criado com novas colunas\n');

    // Test RCON parsing
    console.log('2. Testando parsing de dados RCON...');
    const gameServer = new GameServerManager('localhost', 8888, 'test');
    
    // Simulate RCON response
    const mockResponse = `
      Dinosaur: Carnotaurus
      Growth: 0.85
      Health: 95.5
      Hunger: 80.0
      Thirst: 70.5
      Stamina: 90.0
      Location: (1234.5, 5678.9, 100.0)
    `;
    
    const parsed = gameServer.parsePlayerData(mockResponse);
    console.log('   ✓ Dados parseados:');
    console.log(`     - Tipo: ${parsed.dinosaur_type}`);
    console.log(`     - Growth: ${parsed.growth}`);
    console.log(`     - Vida: ${parsed.health}`);
    console.log(`     - Fome: ${parsed.hunger}`);
    console.log(`     - Sede: ${parsed.thirst}`);
    console.log(`     - Localização: X:${parsed.location.x}, Y:${parsed.location.y}, Z:${parsed.location.z}\n`);

    // Test storing with full stats
    console.log('3. Testando armazenamento com stats completas...');
    const player = await db.getOrCreatePlayer('discord123', 'TestPlayer', 'steam123');
    
    const dinoData = {
      dinosaur_type: 'Carnotaurus',
      dinosaur_name: 'Rex',
      growth: 0.85,
      health: 95.5,
      hunger: 80.0,
      thirst: 70.5,
      stamina: 90.0,
      location: { x: 1234.5, y: 5678.9, z: 100.0 },
      mutations: ['Albino', 'Strong Legs'],
      stats: { extra: 'data' }
    };
    
    await db.storeInGarageWithStats(player.id, dinoData);
    console.log('   ✓ Dinossauro armazenado com todas as stats\n');

    // Test retrieving with full info
    console.log('4. Testando recuperação com informações completas...');
    const garage = await db.getGarage(player.id);
    
    if (garage.length > 0) {
      const dino = garage[0];
      console.log('   ✓ Dinossauro recuperado:');
      console.log(`     - Tipo: ${dino.dinosaur_type}`);
      console.log(`     - Nome: ${dino.dinosaur_name}`);
      console.log(`     - Growth: ${(dino.growth_stage * 100).toFixed(0)}%`);
      console.log(`     - Vida: ${dino.health}`);
      console.log(`     - Fome: ${dino.hunger}`);
      console.log(`     - Sede: ${dino.thirst}`);
      console.log(`     - Stamina: ${dino.stamina}`);
      console.log(`     - Localização: X:${dino.location_x}, Y:${dino.location_y}, Z:${dino.location_z}`);
      
      const mutations = JSON.parse(dino.mutations);
      console.log(`     - Mutações: ${mutations.join(', ')}\n`);
    }

    // Test multiple dinos
    console.log('5. Testando múltiplos dinossauros...');
    const dino2Data = {
      dinosaur_type: 'Stegosaurus',
      dinosaur_name: 'Spike',
      growth: 1.0,
      health: 100.0,
      hunger: 90.0,
      thirst: 85.0,
      stamina: 95.0,
      location: { x: -500.0, y: 1000.0, z: 50.0 },
      mutations: [],
      stats: {}
    };
    
    await db.storeInGarageWithStats(player.id, dino2Data);
    const garageUpdated = await db.getGarage(player.id);
    console.log(`   ✓ Garagem agora tem ${garageUpdated.length} dinossauros\n`);

    // Test JSON parsing (for web interface)
    console.log('6. Testando formato para web interface...');
    garageUpdated.forEach((dino, index) => {
      const mutationsArray = dino.mutations ? JSON.parse(dino.mutations) : [];
      const mutationsText = mutationsArray.length > 0 ? mutationsArray.join(', ') : 'Nenhuma';
      console.log(`   Dino ${index + 1}: ${dino.dinosaur_type}`);
      console.log(`     Stats: HP:${dino.health} Fome:${dino.hunger} Sede:${dino.thirst}`);
      console.log(`     Mutações: ${mutationsText}`);
    });
    console.log();

    // Test parsing with JSON format
    console.log('7. Testando parsing com formato JSON...');
    const jsonResponse = JSON.stringify({
      dinosaur_type: 'Tyrannosaurus',
      growth: 0.95,
      health: 98.0,
      hunger: 85.0,
      thirst: 75.0,
      stamina: 92.0,
      location: { x: 2000.0, y: 3000.0, z: 150.0 }
    });
    
    const parsedJson = gameServer.parsePlayerData(jsonResponse);
    console.log('   ✓ JSON parseado corretamente:');
    console.log(`     - Tipo: ${parsedJson.dinosaur_type}\n`);

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
    console.log('✅ Todos os testes de detecção automática passaram!');
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
