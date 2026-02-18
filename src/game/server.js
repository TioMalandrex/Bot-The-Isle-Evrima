const { Rcon } = require('rcon-client');

class GameServerManager {
  constructor(host, port, password) {
    this.host = host;
    this.port = port;
    this.password = password;
    this.rcon = null;
    this.connected = false;
  }

  async connect() {
    try {
      this.rcon = await Rcon.connect({
        host: this.host,
        port: this.port,
        password: this.password
      });
      this.connected = true;
      console.log('✓ Conectado ao servidor do jogo via RCON');
      return true;
    } catch (error) {
      console.error('✗ Erro ao conectar ao servidor do jogo:', error.message);
      this.connected = false;
      return false;
    }
  }

  async disconnect() {
    if (this.rcon) {
      await this.rcon.end();
      this.connected = false;
      console.log('✓ Desconectado do servidor do jogo');
    }
  }

  async sendCommand(command) {
    if (!this.connected || !this.rcon) {
      throw new Error('Não conectado ao servidor do jogo');
    }
    try {
      const response = await this.rcon.send(command);
      return response;
    } catch (error) {
      console.error('Erro ao enviar comando:', error.message);
      throw error;
    }
  }

  // Comandos específicos do The Isle Evrima
  async changeSkin(playerName, dinosaurType, skinId) {
    // Comando hipotético - ajustar conforme API real do servidor
    const command = `changeskin ${playerName} ${dinosaurType} ${skinId}`;
    return await this.sendCommand(command);
  }

  async spawnDinosaur(playerName, dinosaurType, growthStage = 1.0) {
    // Comando hipotético - ajustar conforme API real do servidor
    const command = `spawn ${playerName} ${dinosaurType} ${growthStage}`;
    return await this.sendCommand(command);
  }

  async getPlayerInfo(playerName) {
    // Comando hipotético - ajustar conforme API real do servidor
    const command = `playerinfo ${playerName}`;
    return await this.sendCommand(command);
  }

  async listPlayers() {
    // Comando hipotético - ajustar conforme API real do servidor
    const command = `listplayers`;
    return await this.sendCommand(command);
  }

  async savePlayer(playerName) {
    // Comando hipotético - ajustar conforme API real do servidor
    const command = `save ${playerName}`;
    return await this.sendCommand(command);
  }

  isConnected() {
    return this.connected;
  }
}

module.exports = GameServerManager;
