const express = require('express');
const cors = require('cors');
const path = require('path');

class WebServer {
  constructor(port, host, database, gameServer) {
    this.port = port;
    this.host = host;
    this.database = database;
    this.gameServer = gameServer;
    this.app = express();
    
    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.static(path.join(__dirname, '../public')));
  }

  setupRoutes() {
    // API Routes
    
    // Players
    this.app.get('/api/player/:discordId', async (req, res) => {
      try {
        const player = await this.database.getPlayer(req.params.discordId);
        if (!player) {
          return res.status(404).json({ error: 'Jogador não encontrado' });
        }
        res.json(player);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Garage
    this.app.get('/api/garage/:discordId', async (req, res) => {
      try {
        const player = await this.database.getPlayer(req.params.discordId);
        if (!player) {
          return res.status(404).json({ error: 'Jogador não encontrado' });
        }
        const garage = await this.database.getGarage(player.id);
        res.json(garage);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    this.app.post('/api/garage', async (req, res) => {
      try {
        const { discordId, dinosaurType, dinosaurName, growthStage, stats } = req.body;
        
        const player = await this.database.getOrCreatePlayer(discordId, 'WebUser');
        await this.database.storeInGarage(player.id, dinosaurType, dinosaurName, growthStage || 1.0, stats || {});
        
        res.json({ success: true, message: 'Dinossauro armazenado com sucesso' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    this.app.delete('/api/garage/:id', async (req, res) => {
      try {
        await this.database.deleteFromGarage(req.params.id);
        res.json({ success: true, message: 'Dinossauro removido da garagem' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Skins
    this.app.get('/api/skins/:discordId', async (req, res) => {
      try {
        const player = await this.database.getPlayer(req.params.discordId);
        if (!player) {
          return res.status(404).json({ error: 'Jogador não encontrado' });
        }
        const dinosaurType = req.query.type;
        const skins = await this.database.getPlayerSkins(player.id, dinosaurType);
        res.json(skins);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    this.app.post('/api/skins/unlock', async (req, res) => {
      try {
        const { discordId, dinosaurType, skinId, skinName, skinData } = req.body;
        
        const player = await this.database.getOrCreatePlayer(discordId, 'WebUser');
        await this.database.unlockSkin(player.id, dinosaurType, skinId, skinName, skinData || {});
        
        res.json({ success: true, message: 'Skin desbloqueada com sucesso' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    this.app.post('/api/skins/apply', async (req, res) => {
      try {
        const { discordId, dinosaurType, skinId } = req.body;
        
        const player = await this.database.getPlayer(discordId);
        if (!player) {
          return res.status(404).json({ error: 'Jogador não encontrado' });
        }
        
        // Verificar se o jogador possui a skin
        const skins = await this.database.getPlayerSkins(player.id, dinosaurType);
        const hasSkin = skins.some(s => s.skin_id === skinId);
        
        if (!hasSkin) {
          return res.status(400).json({ error: 'Você não possui essa skin' });
        }
        
        // Aplicar a skin
        await this.database.setActiveSkin(player.id, dinosaurType, skinId);
        
        // Tentar aplicar no servidor
        if (this.gameServer.isConnected()) {
          try {
            await this.gameServer.changeSkin(player.username, dinosaurType, skinId);
          } catch (error) {
            console.error('Erro ao aplicar skin no servidor:', error);
          }
        }
        
        res.json({ success: true, message: 'Skin aplicada com sucesso' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    this.app.get('/api/skins/active/:discordId/:dinosaurType', async (req, res) => {
      try {
        const player = await this.database.getPlayer(req.params.discordId);
        if (!player) {
          return res.status(404).json({ error: 'Jogador não encontrado' });
        }
        const activeSkin = await this.database.getActiveSkin(player.id, req.params.dinosaurType);
        res.json(activeSkin || {});
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Server status
    this.app.get('/api/status', (req, res) => {
      res.json({
        gameServerConnected: this.gameServer.isConnected(),
        timestamp: new Date().toISOString()
      });
    });

    // Home page
    this.app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, '../public/index.html'));
    });
  }

  start() {
    this.app.listen(this.port, this.host, () => {
      console.log(`✓ Servidor web rodando em http://${this.host}:${this.port}`);
    });
  }
}

module.exports = WebServer;
