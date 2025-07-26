const { EmbedBuilder } = require('discord.js');
const { logger, musicEvent, error, warn } = require('../../Logger');

async function Stop(interaction) {
  if (!interaction.isCommand()) return;

  const context = {
    command: 'stop',
    user: interaction.user.tag,
    guild: interaction.guild?.name
  };

  try {
    await interaction.deferReply({ ephemeral: true });
    musicEvent('STOP_COMMAND_START', `Comando stop iniciado por ${interaction.user.tag}`, context);

    // Obtém o player associado à guild
    let player = interaction.client.kazagumo.players.get(interaction.guildId);
    if (!player) {
      warn('Tentativa de parar reprodução sem player ativo', context);
      const notConnectedEmbed = new EmbedBuilder()
        .setColor("#DDBD86")
        .setDescription("<:error:1364257210745487422> Já fui desconectado. Use </play:1311787727754104862> para me fazer entrar no seu canal.");
      return interaction.editReply({ embeds: [notConnectedEmbed], ephemeral: true });
    }

    const voiceChannelId = player.voiceChannel?.id;
    
    // Destrói o player para desconectar o bot do canal de voz
    player.destroy();
    musicEvent('PLAYER_DESTROYED', `Player destruído e bot desconectado do canal ${voiceChannelId}`, context);

    const playedEmbed = new EmbedBuilder()
      .setColor("#DDBD86")
      .setDescription(`<:stop:1364257663613009930> Desconectado com sucesso de <#${interaction.member.voice.channel.id}>.`);
    await interaction.editReply({ embeds: [playedEmbed] });
    
    musicEvent('STOP_COMMAND_SUCCESS', 'Comando stop executado com sucesso', context);
    
  } catch (err) {
    error('Erro no comando stop', context, err);
    
    const errorEmbed = new EmbedBuilder()
      .setColor('#DDBD86')
      .setDescription('<:error:1364257210745487422> Ocorreu um erro ao tentar parar a reprodução.');
      
    await interaction.editReply({ embeds: [errorEmbed] }).catch(() => {});
  }
}

module.exports = { Stop };