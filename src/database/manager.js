const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

class DatabaseManager {
  constructor(dbPath) {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    this.db = new Database(dbPath);
    this.initTables();
  }

  initTables() {
    // Tabela de jogadores
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS players (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        discord_id TEXT UNIQUE,
        steam_id TEXT UNIQUE,
        username TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de garagem/armazenamento de dinossauros
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS garage (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        player_id INTEGER NOT NULL,
        dinosaur_type TEXT NOT NULL,
        dinosaur_name TEXT,
        growth_stage REAL DEFAULT 0.0,
        stats TEXT,
        stored_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (player_id) REFERENCES players(id)
      )
    `);

    // Tabela de skins
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS skins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        player_id INTEGER NOT NULL,
        dinosaur_type TEXT NOT NULL,
        skin_id TEXT NOT NULL,
        skin_name TEXT,
        skin_data TEXT,
        unlocked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (player_id) REFERENCES players(id)
      )
    `);

    // Tabela de configurações de skin ativas
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS active_skins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        player_id INTEGER NOT NULL,
        dinosaur_type TEXT NOT NULL,
        skin_id TEXT NOT NULL,
        applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (player_id) REFERENCES players(id),
        UNIQUE(player_id, dinosaur_type)
      )
    `);
  }

  // Métodos de jogadores
  getPlayer(discordId) {
    return this.db.prepare('SELECT * FROM players WHERE discord_id = ?').get(discordId);
  }

  createPlayer(discordId, username, steamId = null) {
    const stmt = this.db.prepare('INSERT INTO players (discord_id, username, steam_id) VALUES (?, ?, ?)');
    const result = stmt.run(discordId, username, steamId);
    return result.lastInsertRowid;
  }

  getOrCreatePlayer(discordId, username, steamId = null) {
    let player = this.getPlayer(discordId);
    if (!player) {
      const playerId = this.createPlayer(discordId, username, steamId);
      player = this.db.prepare('SELECT * FROM players WHERE id = ?').get(playerId);
    }
    return player;
  }

  // Métodos de garagem
  storeInGarage(playerId, dinosaurType, dinosaurName, growthStage, stats) {
    const stmt = this.db.prepare(`
      INSERT INTO garage (player_id, dinosaur_type, dinosaur_name, growth_stage, stats) 
      VALUES (?, ?, ?, ?, ?)
    `);
    return stmt.run(playerId, dinosaurType, dinosaurName, growthStage, JSON.stringify(stats));
  }

  getGarage(playerId) {
    return this.db.prepare('SELECT * FROM garage WHERE player_id = ? ORDER BY stored_at DESC').all(playerId);
  }

  retrieveFromGarage(garageId) {
    const item = this.db.prepare('SELECT * FROM garage WHERE id = ?').get(garageId);
    if (item) {
      this.db.prepare('DELETE FROM garage WHERE id = ?').run(garageId);
    }
    return item;
  }

  deleteFromGarage(garageId) {
    return this.db.prepare('DELETE FROM garage WHERE id = ?').run(garageId);
  }

  // Métodos de skins
  unlockSkin(playerId, dinosaurType, skinId, skinName, skinData) {
    const stmt = this.db.prepare(`
      INSERT OR IGNORE INTO skins (player_id, dinosaur_type, skin_id, skin_name, skin_data) 
      VALUES (?, ?, ?, ?, ?)
    `);
    return stmt.run(playerId, dinosaurType, skinId, skinName, JSON.stringify(skinData));
  }

  getPlayerSkins(playerId, dinosaurType = null) {
    if (dinosaurType) {
      return this.db.prepare('SELECT * FROM skins WHERE player_id = ? AND dinosaur_type = ?')
        .all(playerId, dinosaurType);
    }
    return this.db.prepare('SELECT * FROM skins WHERE player_id = ?').all(playerId);
  }

  setActiveSkin(playerId, dinosaurType, skinId) {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO active_skins (player_id, dinosaur_type, skin_id, applied_at) 
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    `);
    return stmt.run(playerId, dinosaurType, skinId);
  }

  getActiveSkin(playerId, dinosaurType) {
    return this.db.prepare(`
      SELECT s.*, a.applied_at 
      FROM active_skins a 
      JOIN skins s ON a.skin_id = s.skin_id 
        AND a.player_id = s.player_id 
        AND a.dinosaur_type = s.dinosaur_type
      WHERE a.player_id = ? AND a.dinosaur_type = ?
    `).get(playerId, dinosaurType);
  }

  close() {
    this.db.close();
  }
}

module.exports = DatabaseManager;
