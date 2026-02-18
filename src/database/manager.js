const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

class DatabaseManager {
  constructor(dbPath) {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    this.db = new sqlite3.Database(dbPath);
    this.initTables();
  }

  initTables() {
    this.db.serialize(() => {
      this.db.run(`
        CREATE TABLE IF NOT EXISTS players (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          discord_id TEXT UNIQUE,
          steam_id TEXT UNIQUE,
          username TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      this.db.run(`
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

      this.db.run(`
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

      this.db.run(`
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
    });
  }

  getPlayer(discordId) {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM players WHERE discord_id = ?', [discordId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  createPlayer(discordId, username, steamId = null) {
    return new Promise((resolve, reject) => {
      this.db.run('INSERT INTO players (discord_id, username, steam_id) VALUES (?, ?, ?)', 
        [discordId, username, steamId], function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
    });
  }

  async getOrCreatePlayer(discordId, username, steamId = null) {
    let player = await this.getPlayer(discordId);
    if (!player) {
      const playerId = await this.createPlayer(discordId, username, steamId);
      player = await new Promise((resolve, reject) => {
        this.db.get('SELECT * FROM players WHERE id = ?', [playerId], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });
    }
    return player;
  }

  storeInGarage(playerId, dinosaurType, dinosaurName, growthStage, stats) {
    return new Promise((resolve, reject) => {
      this.db.run(`
        INSERT INTO garage (player_id, dinosaur_type, dinosaur_name, growth_stage, stats) 
        VALUES (?, ?, ?, ?, ?)
      `, [playerId, dinosaurType, dinosaurName, growthStage, JSON.stringify(stats)], function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
    });
  }

  getGarage(playerId) {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM garage WHERE player_id = ? ORDER BY stored_at DESC', [playerId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }

  retrieveFromGarage(garageId) {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM garage WHERE id = ?', [garageId], (err, row) => {
        if (err) {
          reject(err);
        } else if (row) {
          this.db.run('DELETE FROM garage WHERE id = ?', [garageId], (delErr) => {
            if (delErr) reject(delErr);
            else resolve(row);
          });
        } else {
          resolve(null);
        }
      });
    });
  }

  deleteFromGarage(garageId) {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM garage WHERE id = ?', [garageId], function(err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });
  }

  unlockSkin(playerId, dinosaurType, skinId, skinName, skinData) {
    return new Promise((resolve, reject) => {
      this.db.run(`
        INSERT OR IGNORE INTO skins (player_id, dinosaur_type, skin_id, skin_name, skin_data) 
        VALUES (?, ?, ?, ?, ?)
      `, [playerId, dinosaurType, skinId, skinName, JSON.stringify(skinData)], function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
    });
  }

  getPlayerSkins(playerId, dinosaurType = null) {
    return new Promise((resolve, reject) => {
      if (dinosaurType) {
        this.db.all('SELECT * FROM skins WHERE player_id = ? AND dinosaur_type = ?', 
          [playerId, dinosaurType], (err, rows) => {
          if (err) reject(err);
          else resolve(rows || []);
        });
      } else {
        this.db.all('SELECT * FROM skins WHERE player_id = ?', [playerId], (err, rows) => {
          if (err) reject(err);
          else resolve(rows || []);
        });
      }
    });
  }

  setActiveSkin(playerId, dinosaurType, skinId) {
    return new Promise((resolve, reject) => {
      this.db.run(`
        INSERT OR REPLACE INTO active_skins (player_id, dinosaur_type, skin_id, applied_at) 
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      `, [playerId, dinosaurType, skinId], function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
    });
  }

  getActiveSkin(playerId, dinosaurType) {
    return new Promise((resolve, reject) => {
      this.db.get(`
        SELECT s.*, a.applied_at 
        FROM active_skins a 
        JOIN skins s ON a.skin_id = s.skin_id 
          AND a.player_id = s.player_id 
          AND a.dinosaur_type = s.dinosaur_type
        WHERE a.player_id = ? AND a.dinosaur_type = ?
      `, [playerId, dinosaurType], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  close() {
    this.db.close();
  }
}

module.exports = DatabaseManager;
