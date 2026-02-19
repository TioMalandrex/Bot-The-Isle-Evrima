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

      // Nova tabela para economia/pontos
      this.db.run(`
        CREATE TABLE IF NOT EXISTS player_economy (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          player_id INTEGER NOT NULL,
          points INTEGER DEFAULT 0,
          total_earned INTEGER DEFAULT 0,
          total_spent INTEGER DEFAULT 0,
          last_daily DATETIME,
          FOREIGN KEY (player_id) REFERENCES players(id),
          UNIQUE(player_id)
        )
      `);

      // Nova tabela para estatísticas de jogador
      this.db.run(`
        CREATE TABLE IF NOT EXISTS player_stats (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          player_id INTEGER NOT NULL,
          playtime_minutes INTEGER DEFAULT 0,
          kills INTEGER DEFAULT 0,
          deaths INTEGER DEFAULT 0,
          distance_traveled REAL DEFAULT 0,
          dinosaurs_played INTEGER DEFAULT 0,
          last_seen DATETIME,
          FOREIGN KEY (player_id) REFERENCES players(id),
          UNIQUE(player_id)
        )
      `);

      // Nova tabela para histórico de transações
      this.db.run(`
        CREATE TABLE IF NOT EXISTS transactions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          player_id INTEGER NOT NULL,
          type TEXT NOT NULL,
          amount INTEGER NOT NULL,
          description TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (player_id) REFERENCES players(id)
        )
      `);

      // Nova tabela para logs de admin
      this.db.run(`
        CREATE TABLE IF NOT EXISTS admin_logs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          admin_id INTEGER NOT NULL,
          action TEXT NOT NULL,
          target_player TEXT,
          details TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (admin_id) REFERENCES players(id)
        )
      `);

      // Nova tabela para servidor MOTD
      this.db.run(`
        CREATE TABLE IF NOT EXISTS server_config (
          key TEXT PRIMARY KEY,
          value TEXT,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
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

  updatePlayerSteamId(discordId, steamId) {
    return new Promise((resolve, reject) => {
      this.db.run('UPDATE players SET steam_id = ? WHERE discord_id = ?', 
        [steamId, discordId], function(err) {
        if (err) reject(err);
        else if (this.changes === 0) {
          reject(new Error('Player not found'));
        } else {
          resolve(this.changes);
        }
      });
    });
  }

  getPlayerBySteamId(steamId) {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM players WHERE steam_id = ?', [steamId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  // ===== Métodos de Economia =====

  getPlayerEconomy(playerId) {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM player_economy WHERE player_id = ?', [playerId], (err, row) => {
        if (err) reject(err);
        else if (!row) {
          // Criar registro se não existir
          this.db.run('INSERT INTO player_economy (player_id, points) VALUES (?, 0)', [playerId], function(err) {
            if (err) reject(err);
            else resolve({ player_id: playerId, points: 0, total_earned: 0, total_spent: 0 });
          });
        } else {
          resolve(row);
        }
      });
    });
  }

  addPoints(playerId, amount, description = '') {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run(`
          INSERT INTO player_economy (player_id, points, total_earned) 
          VALUES (?, ?, ?)
          ON CONFLICT(player_id) DO UPDATE SET 
            points = points + ?,
            total_earned = total_earned + ?
        `, [playerId, amount, amount, amount, amount], (err) => {
          if (err) return reject(err);
        });

        this.db.run(`
          INSERT INTO transactions (player_id, type, amount, description) 
          VALUES (?, 'earn', ?, ?)
        `, [playerId, amount, description], function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        });
      });
    });
  }

  removePoints(playerId, amount, description = '') {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run(`
          UPDATE player_economy 
          SET points = points - ?, total_spent = total_spent + ?
          WHERE player_id = ? AND points >= ?
        `, [amount, amount, playerId, amount], function(err) {
          if (err) return reject(err);
          if (this.changes === 0) return reject(new Error('Pontos insuficientes'));
        });

        this.db.run(`
          INSERT INTO transactions (player_id, type, amount, description) 
          VALUES (?, 'spend', ?, ?)
        `, [playerId, amount, description], function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        });
      });
    });
  }

  transferPoints(fromPlayerId, toPlayerId, amount) {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run('BEGIN TRANSACTION');
        
        this.removePoints(fromPlayerId, amount, `Transferido para player ${toPlayerId}`)
          .then(() => this.addPoints(toPlayerId, amount, `Recebido de player ${fromPlayerId}`))
          .then(() => {
            this.db.run('COMMIT');
            resolve();
          })
          .catch((err) => {
            this.db.run('ROLLBACK');
            reject(err);
          });
      });
    });
  }

  getTransactionHistory(playerId, limit = 20) {
    return new Promise((resolve, reject) => {
      this.db.all(`
        SELECT * FROM transactions 
        WHERE player_id = ? 
        ORDER BY created_at DESC 
        LIMIT ?
      `, [playerId, limit], (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }

  // ===== Métodos de Estatísticas =====

  getPlayerStats(playerId) {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM player_stats WHERE player_id = ?', [playerId], (err, row) => {
        if (err) reject(err);
        else if (!row) {
          // Criar registro se não existir
          this.db.run(`
            INSERT INTO player_stats (player_id, playtime_minutes, kills, deaths) 
            VALUES (?, 0, 0, 0)
          `, [playerId], function(err) {
            if (err) reject(err);
            else resolve({ player_id: playerId, playtime_minutes: 0, kills: 0, deaths: 0 });
          });
        } else {
          resolve(row);
        }
      });
    });
  }

  updatePlayerStats(playerId, stats) {
    return new Promise((resolve, reject) => {
      const fields = [];
      const values = [];
      
      if (stats.playtime_minutes !== undefined) {
        fields.push('playtime_minutes = playtime_minutes + ?');
        values.push(stats.playtime_minutes);
      }
      if (stats.kills !== undefined) {
        fields.push('kills = kills + ?');
        values.push(stats.kills);
      }
      if (stats.deaths !== undefined) {
        fields.push('deaths = deaths + ?');
        values.push(stats.deaths);
      }
      if (stats.distance_traveled !== undefined) {
        fields.push('distance_traveled = distance_traveled + ?');
        values.push(stats.distance_traveled);
      }
      if (stats.dinosaurs_played !== undefined) {
        fields.push('dinosaurs_played = dinosaurs_played + ?');
        values.push(stats.dinosaurs_played);
      }
      
      fields.push('last_seen = CURRENT_TIMESTAMP');
      values.push(playerId);

      this.db.run(`
        INSERT INTO player_stats (player_id) VALUES (?)
        ON CONFLICT(player_id) DO UPDATE SET ${fields.join(', ')}
        WHERE player_id = ?
      `, [...values, playerId], function(err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });
  }

  getLeaderboard(type = 'kills', limit = 10) {
    return new Promise((resolve, reject) => {
      const validTypes = ['kills', 'deaths', 'playtime_minutes', 'points'];
      if (!validTypes.includes(type)) {
        return reject(new Error('Tipo de leaderboard inválido'));
      }

      let query = '';
      if (type === 'points') {
        query = `
          SELECT p.username, p.discord_id, e.points, e.total_earned, e.total_spent
          FROM players p
          JOIN player_economy e ON p.id = e.player_id
          ORDER BY e.points DESC
          LIMIT ?
        `;
      } else {
        query = `
          SELECT p.username, p.discord_id, s.${type}, s.kills, s.deaths, s.playtime_minutes
          FROM players p
          JOIN player_stats s ON p.id = s.player_id
          ORDER BY s.${type} DESC
          LIMIT ?
        `;
      }

      this.db.all(query, [limit], (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }

  // ===== Métodos de Log de Admin =====

  logAdminAction(adminId, action, targetPlayer = null, details = null) {
    return new Promise((resolve, reject) => {
      this.db.run(`
        INSERT INTO admin_logs (admin_id, action, target_player, details) 
        VALUES (?, ?, ?, ?)
      `, [adminId, action, targetPlayer, details], function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
    });
  }

  getAdminLogs(limit = 50) {
    return new Promise((resolve, reject) => {
      this.db.all(`
        SELECT a.*, p.username as admin_username
        FROM admin_logs a
        JOIN players p ON a.admin_id = p.id
        ORDER BY a.created_at DESC
        LIMIT ?
      `, [limit], (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }

  // ===== Métodos de Configuração do Servidor =====

  getServerConfig(key) {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT value FROM server_config WHERE key = ?', [key], (err, row) => {
        if (err) reject(err);
        else resolve(row ? row.value : null);
      });
    });
  }

  setServerConfig(key, value) {
    return new Promise((resolve, reject) => {
      this.db.run(`
        INSERT INTO server_config (key, value, updated_at) 
        VALUES (?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(key) DO UPDATE SET 
          value = ?,
          updated_at = CURRENT_TIMESTAMP
      `, [key, value, value], function(err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });
  }

  close() {
    this.db.close();
  }
}

module.exports = DatabaseManager;
