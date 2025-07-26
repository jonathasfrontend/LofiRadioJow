const { EmbedBuilder } = require('discord.js');
const { logger, musicEvent, error, warn } = require('../../Logger');

async function Volume(interaction) {
  if (!interaction.isCommand()) return;

  const context = {
    command: 'volume',
    user: interaction.user.tag,
    guild: interaction.guild?.name
  };

  try {
    // 2. Validar canal de voz
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
      warn('Usuário tentou alterar volume sem estar em canal de voz', context);
      const embed = new EmbedBuilder()
        .setColor('#DDBD86')
        .setDescription('<:error:1364257210745487422> Você precisa estar em um canal de voz para usar este comando!');

      return interaction.reply({ embeds: [embed], ephemeral: true});
    }

    // 3. Validar estado de reprodução
    const player = interaction.client.kazagumo.players.get(interaction.guildId);
    if (!player?.queue?.current) {
      warn('Usuário tentou alterar volume sem música tocando', context);
      const embed = new EmbedBuilder()
        .setColor('#DDBD86')
        .setDescription('<:error:1364257210745487422> Não há nenhuma música tocando no momento.')
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    // 4. Validar valor do volume
    const volume = interaction.options.getNumber('amount');
    if (volume == null || volume < 0 || volume > 100) {
      warn(`Usuário inseriu volume inválido: ${volume}`, context);
      const embed = new EmbedBuilder()
        .setColor('#DDBD86')
        .setDescription('<:error:1364257210745487422> Volume inválido! Use `/volume <0-100>`')
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const oldVolume = player.volume;
    
    // 5. Ajustar volume (síncrono, inlineVolume desabilitado por padrão) 
    await player.setVolume(volume);
    musicEvent('VOLUME_CHANGED', `Volume alterado de ${oldVolume}% para ${volume}%`, context);
    
    // 6. Resposta de sucesso
    const embed = new EmbedBuilder()
      .setColor('#DDBD86')
      .setDescription(`
        <:dvd:1364257189887213628> O volume foi alterado com sucesso
        <:blank:1364257084660650014><:loud:1364257411115782144> **Volume atual: ${volume}%**
      `)
    return interaction.reply({ embeds: [embed] });
    
  } catch (err) {
    error('Erro no comando volume', context, err);
    
    const errorEmbed = new EmbedBuilder()
      .setColor('#DDBD86')
      .setDescription('<:error:1364257210745487422> Ocorreu um erro ao alterar o volume.');
      
    if (!interaction.replied) {
      await interaction.reply({ embeds: [errorEmbed], ephemeral: true }).catch(() => {});
    }
  }
}

module.exports = { Volume };