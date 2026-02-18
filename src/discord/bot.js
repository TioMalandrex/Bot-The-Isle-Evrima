const { Client, GatewayIntentBits, EmbedBuilder, SlashCommandBuilder } = require('discord.js');

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
      if (!interaction.isChatInputCommand()) return;

      const { commandName } = interaction;

      try {
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
        }
      } catch (error) {
        console.error('Erro ao processar comando:', error);
        await interaction.reply({
          content: 'Erro ao processar comando. Tente novamente.',
          ephemeral: true
        });
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
            .setRequired(true))
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

  async start() {
    await this.client.login(this.token);
  }

  getCommands() {
    return this.commands.map(cmd => cmd.toJSON());
  }
}

module.exports = DiscordBot;
