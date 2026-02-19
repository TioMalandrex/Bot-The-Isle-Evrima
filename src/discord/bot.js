const { Client, GatewayIntentBits, EmbedBuilder, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');

class DiscordBot {
  constructor(token, database, gameServer) {
    this.token = token;
    this.database = database;
    this.gameServer = gameServer;
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
      ]
    });

    this.setupCommands();
    this.setupEvents();
  }

  setupEvents() {
    this.client.once('ready', () => {
      console.log(`✓ Bot Discord conectado como ${this.client.user.tag}`);
    });

    this.client.on('interactionCreate', async interaction => {
      try {
        // Handle button interactions
        if (interaction.isButton()) {
          await this.handleButtonInteraction(interaction);
          return;
        }

        // Handle select menu interactions
        if (interaction.isStringSelectMenu()) {
          await this.handleSelectMenuInteraction(interaction);
          return;
        }

        // Handle slash commands
        if (!interaction.isChatInputCommand()) return;

        const { commandName } = interaction;

        switch (commandName) {
          case 'garage':
            await this.handleGarageCommand(interaction);
            break;
          case 'store':
            await this.handleStoreCommand(interaction);
            break;
          case 'retrieve':
            await this.handleRetrieveCommand(interaction);
            break;
          case 'skins':
            await this.handleSkinsCommand(interaction);
            break;
          case 'changeskin':
            await this.handleChangeSkinCommand(interaction);
            break;
          case 'profile':
            await this.handleProfileCommand(interaction);
            break;
          case 'link':
            await this.handleLinkCommand(interaction);
            break;
          // Novos comandos de economia
          case 'balance':
            await this.handleBalanceCommand(interaction);
            break;
          case 'daily':
            await this.handleDailyCommand(interaction);
            break;
          case 'transfer':
            await this.handleTransferCommand(interaction);
            break;
          case 'leaderboard':
            await this.handleLeaderboardCommand(interaction);
            break;
          // Novos comandos de admin
          case 'announce':
            await this.handleAnnounceCommand(interaction);
            break;
          case 'kick':
            await this.handleKickCommand(interaction);
            break;
          case 'ban':
            await this.handleBanCommand(interaction);
            break;
          case 'players':
            await this.handlePlayersCommand(interaction);
            break;
          case 'stats':
            await this.handleStatsCommand(interaction);
            break;
          // Novo comando de menu interativo
          case 'menu':
            await this.handleMenuCommand(interaction);
            break;
        }
      } catch (error) {
        console.error('Erro ao processar interação:', error);
        const errorMsg = {
          content: 'Erro ao processar interação. Tente novamente.',
          ephemeral: true
        };
        if (interaction.replied || interaction.deferred) {
          await interaction.editReply(errorMsg);
        } else {
          await interaction.reply(errorMsg);
        }
      }
    });
  }

  setupCommands() {
    // Comandos serão registrados via REST API separadamente
    this.commands = [
      new SlashCommandBuilder()
        .setName('garage')
        .setDescription('Ver seus dinossauros armazenados na garagem'),
      
      new SlashCommandBuilder()
        .setName('store')
        .setDescription('Armazenar um dinossauro na garagem')
        .addStringOption(option =>
          option.setName('tipo')
            .setDescription('Tipo do dinossauro')
            .setRequired(true))
        .addStringOption(option =>
          option.setName('nome')
            .setDescription('Nome do dinossauro')
            .setRequired(false))
        .addNumberOption(option =>
          option.setName('crescimento')
            .setDescription('Estágio de crescimento (0.0 a 1.0)')
            .setRequired(false)),
      
      new SlashCommandBuilder()
        .setName('retrieve')
        .setDescription('Recuperar um dinossauro da garagem')
        .addIntegerOption(option =>
          option.setName('id')
            .setDescription('ID do dinossauro na garagem')
            .setRequired(true)),
      
      new SlashCommandBuilder()
        .setName('skins')
        .setDescription('Ver suas skins disponíveis')
        .addStringOption(option =>
          option.setName('tipo')
            .setDescription('Tipo do dinossauro')
            .setRequired(false)),
      
      new SlashCommandBuilder()
        .setName('changeskin')
        .setDescription('Mudar a skin de um dinossauro')
        .addStringOption(option =>
          option.setName('tipo')
            .setDescription('Tipo do dinossauro')
            .setRequired(true))
        .addStringOption(option =>
          option.setName('skin')
            .setDescription('ID da skin')
            .setRequired(true)),
      
      new SlashCommandBuilder()
        .setName('profile')
        .setDescription('Ver seu perfil de jogador'),
      
      new SlashCommandBuilder()
        .setName('link')
        .setDescription('Vincular seu Discord ao seu Steam ID')
        .addStringOption(option =>
          option.setName('steamid')
            .setDescription('Seu Steam ID (ex: 76561198012345678)')
            .setRequired(true)),
      
      // Comandos de Economia
      new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Ver seu saldo de pontos'),
      
      new SlashCommandBuilder()
        .setName('daily')
        .setDescription('Resgatar recompensa diária de pontos'),
      
      new SlashCommandBuilder()
        .setName('transfer')
        .setDescription('Transferir pontos para outro jogador')
        .addUserOption(option =>
          option.setName('usuario')
            .setDescription('Usuário que receberá os pontos')
            .setRequired(true))
        .addIntegerOption(option =>
          option.setName('quantidade')
            .setDescription('Quantidade de pontos a transferir')
            .setRequired(true)),
      
      new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Ver ranking de jogadores')
        .addStringOption(option =>
          option.setName('tipo')
            .setDescription('Tipo de ranking')
            .setRequired(false)
            .addChoices(
              { name: 'Pontos', value: 'points' },
              { name: 'Kills', value: 'kills' },
              { name: 'Tempo de Jogo', value: 'playtime_minutes' }
            )),
      
      // Comandos de Admin
      new SlashCommandBuilder()
        .setName('announce')
        .setDescription('[Admin] Enviar anúncio para o servidor do jogo')
        .addStringOption(option =>
          option.setName('mensagem')
            .setDescription('Mensagem a ser anunciada')
            .setRequired(true)),
      
      new SlashCommandBuilder()
        .setName('kick')
        .setDescription('[Admin] Kickar um jogador do servidor')
        .addStringOption(option =>
          option.setName('steamid')
            .setDescription('Steam ID do jogador')
            .setRequired(true))
        .addStringOption(option =>
          option.setName('motivo')
            .setDescription('Motivo do kick')
            .setRequired(false)),
      
      new SlashCommandBuilder()
        .setName('ban')
        .setDescription('[Admin] Banir um jogador do servidor')
        .addStringOption(option =>
          option.setName('nome')
            .setDescription('Nome do jogador')
            .setRequired(true))
        .addStringOption(option =>
          option.setName('steamid')
            .setDescription('Steam ID do jogador')
            .setRequired(true))
        .addStringOption(option =>
          option.setName('motivo')
            .setDescription('Motivo do ban')
            .setRequired(false))
        .addIntegerOption(option =>
          option.setName('duracao')
            .setDescription('Duração em horas (0 = permanente)')
            .setRequired(false)),
      
      new SlashCommandBuilder()
        .setName('players')
        .setDescription('[Admin] Listar jogadores online no servidor'),
      
      new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Ver suas estatísticas de jogo'),
      
      new SlashCommandBuilder()
        .setName('menu')
        .setDescription('🦖 Menu interativo de gerenciamento de dinossauros')
    ];
  }

  async handleGarageCommand(interaction) {
    await interaction.deferReply();
    
    const player = await this.database.getOrCreatePlayer(
      interaction.user.id,
      interaction.user.username
    );
    
    const garage = await this.database.getGarage(player.id);
    
    const embed = new EmbedBuilder()
      .setTitle('🦖 Sua Garagem')
      .setColor('#00ff00')
      .setDescription(garage.length > 0 
        ? 'Dinossauros armazenados:' 
        : 'Sua garagem está vazia.');

    if (garage.length > 0) {
      garage.forEach(dino => {
        const stats = dino.stats ? JSON.parse(dino.stats) : {};
        embed.addFields({
          name: `#${dino.id} - ${dino.dinosaur_type}`,
          value: `**Nome:** ${dino.dinosaur_name || 'Sem nome'}\n**Crescimento:** ${(dino.growth_stage * 100).toFixed(0)}%\n**Armazenado:** ${new Date(dino.stored_at).toLocaleDateString('pt-BR')}`,
          inline: true
        });
      });
    }

    await interaction.editReply({ embeds: [embed] });
  }

  async handleStoreCommand(interaction) {
    await interaction.deferReply();
    
    const tipo = interaction.options.getString('tipo');
    const nome = interaction.options.getString('nome') || 'Sem nome';
    const crescimento = interaction.options.getNumber('crescimento') || 1.0;
    
    const player = await this.database.getOrCreatePlayer(
      interaction.user.id,
      interaction.user.username
    );
    
    await this.database.storeInGarage(player.id, tipo, nome, crescimento, {});
    
    const embed = new EmbedBuilder()
      .setTitle('✅ Dinossauro Armazenado')
      .setColor('#00ff00')
      .setDescription(`**${tipo}** (${nome}) foi armazenado na garagem com sucesso!`);
    
    await interaction.editReply({ embeds: [embed] });
  }

  async handleRetrieveCommand(interaction) {
    await interaction.deferReply();
    
    const id = interaction.options.getInteger('id');
    const item = await this.database.retrieveFromGarage(id);
    
    if (!item) {
      await interaction.editReply('❌ Dinossauro não encontrado na garagem.');
      return;
    }
    
    const embed = new EmbedBuilder()
      .setTitle('✅ Dinossauro Recuperado')
      .setColor('#00ff00')
      .setDescription(`**${item.dinosaur_type}** (${item.dinosaur_name}) foi recuperado da garagem!`);
    
    await interaction.editReply({ embeds: [embed] });
  }

  async handleSkinsCommand(interaction) {
    await interaction.deferReply();
    
    const tipo = interaction.options.getString('tipo');
    const player = await this.database.getOrCreatePlayer(
      interaction.user.id,
      interaction.user.username
    );
    
    const skins = await this.database.getPlayerSkins(player.id, tipo);
    
    const embed = new EmbedBuilder()
      .setTitle('🎨 Suas Skins')
      .setColor('#ff00ff')
      .setDescription(skins.length > 0 
        ? `Skins disponíveis${tipo ? ` para ${tipo}` : ''}:` 
        : 'Você não possui skins desbloqueadas.');

    if (skins.length > 0) {
      skins.forEach(skin => {
        embed.addFields({
          name: `${skin.skin_name || skin.skin_id}`,
          value: `**Tipo:** ${skin.dinosaur_type}\n**ID:** ${skin.skin_id}`,
          inline: true
        });
      });
    }

    await interaction.editReply({ embeds: [embed] });
  }

  async handleChangeSkinCommand(interaction) {
    await interaction.deferReply();
    
    const tipo = interaction.options.getString('tipo');
    const skinId = interaction.options.getString('skin');
    
    const player = await this.database.getOrCreatePlayer(
      interaction.user.id,
      interaction.user.username
    );
    
    // Verificar se o jogador possui a skin
    const skins = await this.database.getPlayerSkins(player.id, tipo);
    const hasSkin = skins.some(s => s.skin_id === skinId);
    
    if (!hasSkin) {
      await interaction.editReply('❌ Você não possui essa skin.');
      return;
    }
    
    // Aplicar a skin
    await this.database.setActiveSkin(player.id, tipo, skinId);
    
    // Tentar aplicar no servidor (se conectado)
    if (this.gameServer.isConnected()) {
      try {
        // Use Steam ID if available, otherwise fall back to username
        const playerIdentifier = player.steam_id || interaction.user.username;
        await this.gameServer.changeSkin(playerIdentifier, tipo, skinId);
      } catch (error) {
        console.error('Erro ao aplicar skin no servidor:', error);
      }
    }
    
    const embed = new EmbedBuilder()
      .setTitle('✅ Skin Alterada')
      .setColor('#00ff00')
      .setDescription(`Skin **${skinId}** aplicada para **${tipo}**!`);
    
    await interaction.editReply({ embeds: [embed] });
  }

  async handleProfileCommand(interaction) {
    await interaction.deferReply();
    
    const player = await this.database.getOrCreatePlayer(
      interaction.user.id,
      interaction.user.username
    );
    
    const garage = await this.database.getGarage(player.id);
    const skins = await this.database.getPlayerSkins(player.id);
    
    const embed = new EmbedBuilder()
      .setTitle(`👤 Perfil de ${player.username}`)
      .setColor('#0099ff')
      .addFields(
        { name: 'Discord ID', value: player.discord_id, inline: true },
        { name: 'Steam ID', value: player.steam_id || 'Não vinculado', inline: true },
        { name: 'Dinossauros na Garagem', value: garage.length.toString(), inline: true },
        { name: 'Skins Desbloqueadas', value: skins.length.toString(), inline: true },
        { name: 'Membro desde', value: new Date(player.created_at).toLocaleDateString('pt-BR'), inline: true }
      );
    
    await interaction.editReply({ embeds: [embed] });
  }

  async handleLinkCommand(interaction) {
    await interaction.deferReply({ ephemeral: true });
    
    const steamId = interaction.options.getString('steamid');
    
    // Validate Steam ID format (basic validation)
    if (!/^\d{17}$/.test(steamId)) {
      await interaction.editReply({
        content: '❌ Steam ID inválido. Deve conter 17 dígitos numéricos (ex: 76561198012345678).'
      });
      return;
    }
    
    try {
      // Check if Steam ID is already linked to another account
      const existingPlayer = await this.database.getPlayerBySteamId(steamId);
      if (existingPlayer && existingPlayer.discord_id !== interaction.user.id) {
        await interaction.editReply({
          content: '❌ Este Steam ID já está vinculado a outra conta Discord.'
        });
        return;
      }
      
      // Create or get player
      const player = await this.database.getOrCreatePlayer(
        interaction.user.id,
        interaction.user.username
      );
      
      // Update Steam ID
      await this.database.updatePlayerSteamId(interaction.user.id, steamId);
      
      const embed = new EmbedBuilder()
        .setTitle('✅ Steam ID Vinculado')
        .setColor('#00ff00')
        .setDescription(`Seu Discord foi vinculado ao Steam ID: **${steamId}**`)
        .addFields(
          { name: 'Discord', value: interaction.user.username, inline: true },
          { name: 'Steam ID', value: steamId, inline: true }
        )
        .setFooter({ text: 'Agora você pode ser identificado no servidor do jogo!' });
      
      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Erro ao vincular Steam ID:', error);
      await interaction.editReply({
        content: '❌ Erro ao vincular Steam ID. Tente novamente.'
      });
    }
  }

  // ===== Handlers de Economia =====

  async handleBalanceCommand(interaction) {
    await interaction.deferReply();
    
    const player = await this.database.getOrCreatePlayer(
      interaction.user.id,
      interaction.user.username
    );
    
    const economy = await this.database.getPlayerEconomy(player.id);
    
    const embed = new EmbedBuilder()
      .setTitle('💰 Seu Saldo')
      .setColor('#ffd700')
      .addFields(
        { name: 'Pontos Disponíveis', value: economy.points.toString(), inline: true },
        { name: 'Total Ganho', value: economy.total_earned.toString(), inline: true },
        { name: 'Total Gasto', value: economy.total_spent.toString(), inline: true }
      );
    
    await interaction.editReply({ embeds: [embed] });
  }

  async handleDailyCommand(interaction) {
    await interaction.deferReply();
    
    const player = await this.database.getOrCreatePlayer(
      interaction.user.id,
      interaction.user.username
    );
    
    const economy = await this.database.getPlayerEconomy(player.id);
    
    // Verificar se já resgatou hoje
    if (economy.last_daily) {
      const lastDaily = new Date(economy.last_daily);
      const now = new Date();
      const diffHours = (now - lastDaily) / (1000 * 60 * 60);
      
      if (diffHours < 24) {
        const hoursLeft = Math.ceil(24 - diffHours);
        await interaction.editReply(`❌ Você já resgatou sua recompensa diária! Volte em ${hoursLeft} horas.`);
        return;
      }
    }
    
    const dailyAmount = 100;
    await this.database.addPoints(player.id, dailyAmount, 'Recompensa diária');
    
    // Atualizar last_daily
    await this.database.db.run('UPDATE player_economy SET last_daily = CURRENT_TIMESTAMP WHERE player_id = ?', [player.id]);
    
    const embed = new EmbedBuilder()
      .setTitle('🎁 Recompensa Diária')
      .setColor('#00ff00')
      .setDescription(`Você recebeu **${dailyAmount} pontos**!`);
    
    await interaction.editReply({ embeds: [embed] });
  }

  async handleTransferCommand(interaction) {
    await interaction.deferReply();
    
    const targetUser = interaction.options.getUser('usuario');
    const amount = interaction.options.getInteger('quantidade');
    
    if (amount <= 0) {
      await interaction.editReply('❌ A quantidade deve ser maior que zero.');
      return;
    }
    
    if (targetUser.id === interaction.user.id) {
      await interaction.editReply('❌ Você não pode transferir pontos para si mesmo.');
      return;
    }
    
    const fromPlayer = await this.database.getOrCreatePlayer(
      interaction.user.id,
      interaction.user.username
    );
    
    const toPlayer = await this.database.getOrCreatePlayer(
      targetUser.id,
      targetUser.username
    );
    
    try {
      await this.database.transferPoints(fromPlayer.id, toPlayer.id, amount);
      
      const embed = new EmbedBuilder()
        .setTitle('✅ Transferência Realizada')
        .setColor('#00ff00')
        .setDescription(`Você transferiu **${amount} pontos** para ${targetUser.username}`);
      
      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      await interaction.editReply('❌ Pontos insuficientes para transferência.');
    }
  }

  async handleLeaderboardCommand(interaction) {
    await interaction.deferReply();
    
    const type = interaction.options.getString('tipo') || 'points';
    const leaderboard = await this.database.getLeaderboard(type, 10);
    
    if (leaderboard.length === 0) {
      await interaction.editReply('Nenhum dado disponível para o ranking.');
      return;
    }
    
    const typeNames = {
      points: 'Pontos',
      kills: 'Kills',
      playtime_minutes: 'Tempo de Jogo'
    };
    
    const embed = new EmbedBuilder()
      .setTitle(`🏆 Ranking - ${typeNames[type]}`)
      .setColor('#ffd700');
    
    let description = '';
    leaderboard.forEach((entry, index) => {
      const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
      let value = '';
      
      if (type === 'points') {
        value = `${entry.points} pontos`;
      } else if (type === 'kills') {
        value = `${entry.kills} kills`;
      } else if (type === 'playtime_minutes') {
        const hours = Math.floor(entry.playtime_minutes / 60);
        value = `${hours}h`;
      }
      
      description += `${medal} **${entry.username}** - ${value}\n`;
    });
    
    embed.setDescription(description);
    await interaction.editReply({ embeds: [embed] });
  }

  // ===== Handlers de Admin =====

  async handleAnnounceCommand(interaction) {
    await interaction.deferReply({ ephemeral: true });
    
    // Verificar se é admin (pode adicionar verificação de roles aqui)
    if (!interaction.memberPermissions.has('Administrator')) {
      await interaction.editReply('❌ Você não tem permissão para usar este comando.');
      return;
    }
    
    if (!this.gameServer.isConnected()) {
      await interaction.editReply('❌ Servidor do jogo não está conectado.');
      return;
    }
    
    const message = interaction.options.getString('mensagem');
    
    try {
      await this.gameServer.announce(message);
      
      // Log admin action
      const player = await this.database.getOrCreatePlayer(
        interaction.user.id,
        interaction.user.username
      );
      await this.database.logAdminAction(player.id, 'announce', null, message);
      
      await interaction.editReply('✅ Anúncio enviado para o servidor!');
    } catch (error) {
      console.error('Erro ao enviar anúncio:', error);
      await interaction.editReply('❌ Erro ao enviar anúncio.');
    }
  }

  async handleKickCommand(interaction) {
    await interaction.deferReply({ ephemeral: true });
    
    if (!interaction.memberPermissions.has('Administrator')) {
      await interaction.editReply('❌ Você não tem permissão para usar este comando.');
      return;
    }
    
    if (!this.gameServer.isConnected()) {
      await interaction.editReply('❌ Servidor do jogo não está conectado.');
      return;
    }
    
    const steamId = interaction.options.getString('steamid');
    const reason = interaction.options.getString('motivo') || 'Kicked by admin';
    
    try {
      await this.gameServer.kickPlayer(steamId, reason);
      
      // Log admin action
      const player = await this.database.getOrCreatePlayer(
        interaction.user.id,
        interaction.user.username
      );
      await this.database.logAdminAction(player.id, 'kick', steamId, reason);
      
      await interaction.editReply(`✅ Jogador kickado do servidor.\nMotivo: ${reason}`);
    } catch (error) {
      console.error('Erro ao kickar jogador:', error);
      await interaction.editReply('❌ Erro ao kickar jogador.');
    }
  }

  async handleBanCommand(interaction) {
    await interaction.deferReply({ ephemeral: true });
    
    if (!interaction.memberPermissions.has('Administrator')) {
      await interaction.editReply('❌ Você não tem permissão para usar este comando.');
      return;
    }
    
    if (!this.gameServer.isConnected()) {
      await interaction.editReply('❌ Servidor do jogo não está conectado.');
      return;
    }
    
    const playerName = interaction.options.getString('nome');
    const steamId = interaction.options.getString('steamid');
    const reason = interaction.options.getString('motivo') || 'Banned by admin';
    const duration = interaction.options.getInteger('duracao') || 0;
    
    try {
      await this.gameServer.banPlayer(playerName, steamId, reason, duration);
      
      // Log admin action
      const player = await this.database.getOrCreatePlayer(
        interaction.user.id,
        interaction.user.username
      );
      await this.database.logAdminAction(player.id, 'ban', steamId, `${reason} - ${duration}h`);
      
      const durationText = duration === 0 ? 'permanentemente' : `por ${duration} horas`;
      await interaction.editReply(`✅ Jogador banido ${durationText}.\nMotivo: ${reason}`);
    } catch (error) {
      console.error('Erro ao banir jogador:', error);
      await interaction.editReply('❌ Erro ao banir jogador.');
    }
  }

  async handlePlayersCommand(interaction) {
    await interaction.deferReply();
    
    if (!this.gameServer.isConnected()) {
      await interaction.editReply('❌ Servidor do jogo não está conectado.');
      return;
    }
    
    try {
      const response = await this.gameServer.listPlayers();
      
      const embed = new EmbedBuilder()
        .setTitle('👥 Jogadores Online')
        .setColor('#0099ff')
        .setDescription(response || 'Nenhum jogador online');
      
      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Erro ao listar jogadores:', error);
      await interaction.editReply('❌ Erro ao listar jogadores.');
    }
  }

  async handleStatsCommand(interaction) {
    await interaction.deferReply();
    
    const player = await this.database.getOrCreatePlayer(
      interaction.user.id,
      interaction.user.username
    );
    
    const stats = await this.database.getPlayerStats(player.id);
    const economy = await this.database.getPlayerEconomy(player.id);
    
    const hours = Math.floor(stats.playtime_minutes / 60);
    const minutes = stats.playtime_minutes % 60;
    const kd = stats.deaths > 0 ? (stats.kills / stats.deaths).toFixed(2) : stats.kills;
    
    const embed = new EmbedBuilder()
      .setTitle(`📊 Estatísticas de ${player.username}`)
      .setColor('#0099ff')
      .addFields(
        { name: 'Tempo de Jogo', value: `${hours}h ${minutes}m`, inline: true },
        { name: 'Kills', value: stats.kills.toString(), inline: true },
        { name: 'Deaths', value: stats.deaths.toString(), inline: true },
        { name: 'K/D Ratio', value: kd.toString(), inline: true },
        { name: 'Pontos', value: economy.points.toString(), inline: true },
        { name: 'Dinossauros Jogados', value: stats.dinosaurs_played.toString(), inline: true }
      );
    
    if (stats.last_seen) {
      embed.setFooter({ text: `Último visto: ${new Date(stats.last_seen).toLocaleString('pt-BR')}` });
    }
    
    await interaction.editReply({ embeds: [embed] });
  }

  // ===== Novo Menu Interativo =====

  async handleMenuCommand(interaction) {
    await interaction.deferReply();

    const player = await this.database.getOrCreatePlayer(
      interaction.user.id,
      interaction.user.username
    );

    const embed = new EmbedBuilder()
      .setTitle('🦖 Menu de Gerenciamento de Dinossauros')
      .setColor('#00ff00')
      .setDescription('Escolha uma ação abaixo para gerenciar seus dinossauros:')
      .addFields(
        { name: '💾 Guardar', value: 'Guarda automaticamente seu dinossauro atual', inline: true },
        { name: '📦 Ver Garagem', value: 'Veja todos os seus dinos guardados', inline: true },
        { name: '🔄 Recuperar', value: 'Escolha um dino para recuperar', inline: true }
      );

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('store_current_dino')
          .setLabel('💾 Guardar Atual')
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId('view_garage')
          .setLabel('📦 Ver Garagem')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId('retrieve_dino')
          .setLabel('🔄 Recuperar Dino')
          .setStyle(ButtonStyle.Secondary)
      );

    await interaction.editReply({ embeds: [embed], components: [row] });
  }

  async handleButtonInteraction(interaction) {
    const customId = interaction.customId;

    if (customId === 'store_current_dino') {
      await this.handleStoreCurrentDino(interaction);
    } else if (customId === 'view_garage') {
      await this.handleViewGarageInteraction(interaction);
    } else if (customId === 'retrieve_dino') {
      await this.handleRetrieveDinoInteraction(interaction);
    } else if (customId.startsWith('retrieve_')) {
      await this.handleConfirmRetrieve(interaction);
    }
  }

  async handleSelectMenuInteraction(interaction) {
    if (interaction.customId === 'select_dino_retrieve') {
      await this.handleDinoSelection(interaction);
    }
  }

  async handleStoreCurrentDino(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const player = await this.database.getOrCreatePlayer(
      interaction.user.id,
      interaction.user.username
    );

    if (!player.steam_id) {
      await interaction.editReply({
        content: '❌ Você precisa vincular seu Steam ID primeiro usando `/link`'
      });
      return;
    }

    if (!this.gameServer.isConnected()) {
      await interaction.editReply({
        content: '❌ Servidor do jogo não está conectado. Não é possível detectar seu dinossauro atual.'
      });
      return;
    }

    try {
      // Obter dados do dinossauro atual via RCON
      const dinoData = await this.gameServer.getCurrentDinosaur(player.steam_id);

      if (!dinoData || !dinoData.dinosaur_type) {
        await interaction.editReply({
          content: '❌ Não foi possível detectar seu dinossauro atual. Você está jogando no servidor?'
        });
        return;
      }

      // Armazenar com todas as informações
      await this.database.storeInGarageWithStats(player.id, dinoData);

      const embed = new EmbedBuilder()
        .setTitle('✅ Dinossauro Armazenado')
        .setColor('#00ff00')
        .setDescription(`Seu **${dinoData.dinosaur_type}** foi guardado com sucesso!`)
        .addFields(
          { name: 'Crescimento', value: `${(dinoData.growth * 100).toFixed(0)}%`, inline: true },
          { name: 'Vida', value: `${dinoData.health?.toFixed(0) || 'N/A'}`, inline: true },
          { name: 'Fome', value: `${dinoData.hunger?.toFixed(0) || 'N/A'}`, inline: true },
          { name: 'Sede', value: `${dinoData.thirst?.toFixed(0) || 'N/A'}`, inline: true },
          { name: 'Stamina', value: `${dinoData.stamina?.toFixed(0) || 'N/A'}`, inline: true }
        );

      if (dinoData.location && dinoData.location.x !== null) {
        embed.addFields({
          name: 'Localização',
          value: `X: ${dinoData.location.x.toFixed(0)}, Y: ${dinoData.location.y.toFixed(0)}, Z: ${dinoData.location.z.toFixed(0)}`,
          inline: false
        });
      }

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Erro ao guardar dinossauro:', error);
      await interaction.editReply({
        content: '❌ Erro ao guardar dinossauro. Tente novamente.'
      });
    }
  }

  async handleViewGarageInteraction(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const player = await this.database.getOrCreatePlayer(
      interaction.user.id,
      interaction.user.username
    );

    const garage = await this.database.getGarage(player.id);

    if (garage.length === 0) {
      await interaction.editReply({
        content: '📦 Sua garagem está vazia. Use o botão "Guardar Atual" para salvar um dinossauro.'
      });
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle('🦖 Sua Garagem')
      .setColor('#00ff00')
      .setDescription(`Você tem ${garage.length} dinossauro(s) armazenado(s):`);

    garage.forEach((dino, index) => {
      const mutationsArray = dino.mutations ? JSON.parse(dino.mutations) : [];
      const mutationsText = mutationsArray.length > 0 ? mutationsArray.join(', ') : 'Nenhuma';
      
      embed.addFields({
        name: `#${dino.id} - ${dino.dinosaur_type}`,
        value: [
          `**Nome:** ${dino.dinosaur_name || 'Sem nome'}`,
          `**Crescimento:** ${(dino.growth_stage * 100).toFixed(0)}%`,
          `**Vida:** ${dino.health?.toFixed(0) || 'N/A'} | **Fome:** ${dino.hunger?.toFixed(0) || 'N/A'} | **Sede:** ${dino.thirst?.toFixed(0) || 'N/A'}`,
          `**Localização:** X:${dino.location_x?.toFixed(0) || 0}, Y:${dino.location_y?.toFixed(0) || 0}, Z:${dino.location_z?.toFixed(0) || 0}`,
          `**Mutações:** ${mutationsText}`,
          `**Armazenado:** ${new Date(dino.stored_at).toLocaleDateString('pt-BR')}`
        ].join('\n'),
        inline: false
      });
    });

    await interaction.editReply({ embeds: [embed] });
  }

  async handleRetrieveDinoInteraction(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const player = await this.database.getOrCreatePlayer(
      interaction.user.id,
      interaction.user.username
    );

    const garage = await this.database.getGarage(player.id);

    if (garage.length === 0) {
      await interaction.editReply({
        content: '📦 Sua garagem está vazia. Não há dinossauros para recuperar.'
      });
      return;
    }

    // Criar select menu com os dinos disponíveis
    const options = garage.map(dino => ({
      label: `${dino.dinosaur_type} - ${dino.dinosaur_name || 'Sem nome'}`,
      description: `Growth: ${(dino.growth_stage * 100).toFixed(0)}% | HP: ${dino.health?.toFixed(0) || 'N/A'} | ID: ${dino.id}`,
      value: `dino_${dino.id}`
    }));

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('select_dino_retrieve')
      .setPlaceholder('Escolha um dinossauro para recuperar')
      .addOptions(options.slice(0, 25)); // Discord limit: 25 options

    const row = new ActionRowBuilder()
      .addComponents(selectMenu);

    const embed = new EmbedBuilder()
      .setTitle('🔄 Recuperar Dinossauro')
      .setColor('#ffa500')
      .setDescription('Selecione o dinossauro que deseja recuperar da garagem:');

    await interaction.editReply({ embeds: [embed], components: [row] });
  }

  async handleDinoSelection(interaction) {
    await interaction.deferUpdate();

    const dinoId = parseInt(interaction.values[0].replace('dino_', ''));
    
    // Buscar informações do dino
    const garage = await this.database.getGarage(interaction.user.id);
    const dino = garage.find(d => d.id === dinoId);

    if (!dino) {
      await interaction.editReply({
        content: '❌ Dinossauro não encontrado.',
        components: []
      });
      return;
    }

    const mutationsArray = dino.mutations ? JSON.parse(dino.mutations) : [];
    const mutationsText = mutationsArray.length > 0 ? mutationsArray.join(', ') : 'Nenhuma';

    const embed = new EmbedBuilder()
      .setTitle(`🦖 ${dino.dinosaur_type}`)
      .setColor('#ffa500')
      .setDescription(`**${dino.dinosaur_name || 'Sem nome'}**`)
      .addFields(
        { name: 'Crescimento', value: `${(dino.growth_stage * 100).toFixed(0)}%`, inline: true },
        { name: 'Vida', value: `${dino.health?.toFixed(0) || 'N/A'}`, inline: true },
        { name: 'Stamina', value: `${dino.stamina?.toFixed(0) || 'N/A'}`, inline: true },
        { name: 'Fome', value: `${dino.hunger?.toFixed(0) || 'N/A'}`, inline: true },
        { name: 'Sede', value: `${dino.thirst?.toFixed(0) || 'N/A'}`, inline: true },
        { name: 'Localização', value: `X:${dino.location_x?.toFixed(0) || 0}, Y:${dino.location_y?.toFixed(0) || 0}, Z:${dino.location_z?.toFixed(0) || 0}`, inline: false },
        { name: 'Mutações', value: mutationsText, inline: false },
        { name: 'Armazenado em', value: new Date(dino.stored_at).toLocaleString('pt-BR'), inline: false }
      );

    const confirmButton = new ButtonBuilder()
      .setCustomId(`retrieve_confirm_${dinoId}`)
      .setLabel('✅ Confirmar Recuperação')
      .setStyle(ButtonStyle.Success);

    const cancelButton = new ButtonBuilder()
      .setCustomId('retrieve_cancel')
      .setLabel('❌ Cancelar')
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder()
      .addComponents(confirmButton, cancelButton);

    await interaction.editReply({ embeds: [embed], components: [row] });
  }

  async handleConfirmRetrieve(interaction) {
    if (interaction.customId === 'retrieve_cancel') {
      await interaction.update({
        content: '❌ Recuperação cancelada.',
        embeds: [],
        components: []
      });
      return;
    }

    const dinoId = parseInt(interaction.customId.replace('retrieve_confirm_', ''));
    
    await interaction.deferUpdate();

    try {
      const item = await this.database.retrieveFromGarage(dinoId);

      if (!item) {
        await interaction.editReply({
          content: '❌ Dinossauro não encontrado.',
          embeds: [],
          components: []
        });
        return;
      }

      const embed = new EmbedBuilder()
        .setTitle('✅ Dinossauro Recuperado')
        .setColor('#00ff00')
        .setDescription(`**${item.dinosaur_type}** (${item.dinosaur_name}) foi recuperado da garagem!`)
        .addFields(
          { name: 'Crescimento', value: `${(item.growth_stage * 100).toFixed(0)}%`, inline: true },
          { name: 'Vida', value: `${item.health?.toFixed(0) || 'N/A'}`, inline: true },
          { name: 'Fome', value: `${item.hunger?.toFixed(0) || 'N/A'}`, inline: true }
        );

      await interaction.editReply({ embeds: [embed], components: [] });
    } catch (error) {
      console.error('Erro ao recuperar dinossauro:', error);
      await interaction.editReply({
        content: '❌ Erro ao recuperar dinossauro.',
        embeds: [],
        components: []
      });
    }
  }

  async start() {
    await this.client.login(this.token);
  }

  getCommands() {
    return this.commands.map(cmd => cmd.toJSON());
  }
}

module.exports = DiscordBot;
