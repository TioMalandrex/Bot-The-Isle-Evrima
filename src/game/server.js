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
    const command = `playerlist`;
    return await this.sendCommand(command);
  }

  async savePlayer(playerName) {
    const command = `save`;
    return await this.sendCommand(command);
  }

  // ===== Novos Comandos RCON do The Isle Evrima =====
  
  /**
   * Envia uma mensagem de anúncio para todos os jogadores no servidor
   * @param {string} message - Mensagem a ser anunciada
   */
  async announce(message) {
    const command = `announce ${message}`;
    return await this.sendCommand(command);
  }

  /**
   * Kicka um jogador do servidor
   * @param {string} steamId - Steam ID do jogador
   * @param {string} reason - Motivo do kick
   */
  async kickPlayer(steamId, reason = 'Kicked by admin') {
    const command = `kick ${steamId},${reason}`;
    return await this.sendCommand(command);
  }

  /**
   * Bane um jogador do servidor
   * @param {string} playerName - Nome do jogador
   * @param {string} steamId - Steam ID do jogador
   * @param {string} reason - Motivo do ban
   * @param {number} duration - Duração em horas (0 = permanente)
   */
  async banPlayer(playerName, steamId, reason = 'Banned by admin', duration = 0) {
    const command = `ban ${playerName},${steamId},${reason},${duration}`;
    return await this.sendCommand(command);
  }

  /**
   * Obtém dados de um jogador específico ou todos os jogadores
   * @param {string} steamId - Steam ID do jogador (opcional)
   */
  async getPlayerData(steamId = '') {
    const command = steamId ? `getplayerdata ${steamId}` : `getplayerdata`;
    return await this.sendCommand(command);
  }

  /**
   * Envia uma mensagem direta para um jogador
   * @param {string} steamId - Steam ID do jogador
   * @param {string} message - Mensagem a ser enviada
   */
  async directMessage(steamId, message) {
    const command = `directmessage ${steamId},${message}`;
    return await this.sendCommand(command);
  }

  /**
   * Teleporta o admin para a localização de um jogador
   * @param {string} playerName - Nome do jogador
   */
  async gotoPlayer(playerName) {
    const command = `goto ${playerName}`;
    return await this.sendCommand(command);
  }

  /**
   * Teleporta um jogador para a localização do admin
   * @param {string} playerName - Nome do jogador
   */
  async bringPlayer(playerName) {
    const command = `bring ${playerName}`;
    return await this.sendCommand(command);
  }

  /**
   * Salva o estado atual do servidor
   */
  async saveServer() {
    const command = `save`;
    return await this.sendCommand(command);
  }

  /**
   * Muda o tempo do dia no servidor
   * @param {string} time - Horário (ex: "12:00", "night", "day")
   */
  async setTime(time) {
    const command = `settime ${time}`;
    return await this.sendCommand(command);
  }

  /**
   * Muda o clima no servidor
   * @param {string} weather - Tipo de clima (clear, rain, fog, storm)
   */
  async setWeather(weather) {
    const command = `setweather ${weather}`;
    return await this.sendCommand(command);
  }

  /**
   * Promove um jogador a admin
   * @param {string} steamId - Steam ID do jogador
   */
  async promoteAdmin(steamId) {
    const command = `promote ${steamId}`;
    return await this.sendCommand(command);
  }

  /**
   * Remove privilégios de admin de um jogador
   * @param {string} steamId - Steam ID do jogador
   */
  async demoteAdmin(steamId) {
    const command = `demote ${steamId}`;
    return await this.sendCommand(command);
  }

  isConnected() {
    return this.connected;
  }
}

module.exports = GameServerManager;
