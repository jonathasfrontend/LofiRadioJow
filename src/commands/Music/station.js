const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const Station = require('../../models/station');
const { logger, musicEvent, error, warn } = require('../../Logger');

// 1. Pré-definição das opções de estação em memória
const STATION_OPTIONS = [
  { label: 'Lofi Radio (Default)', value: 'default', emoji: '📻' },
  { label: 'Study lo-fi', value: 'study', emoji: '📚' },
  { label: 'Anime lo-fi', value: 'anime', emoji: '🌸' },
  { label: 'Halloween lo-fi', value: 'halloween', emoji: '🎃' },
  { label: 'Gaming lo-fi', value: 'gaming', emoji: '🎮' },
  { label: 'Sleep lo-fi', value: 'sleep', emoji: '😴' },
  { label: 'Lo-fi Synthwave', value: 'synthwave', emoji: '🌆' },
  { label: 'Japanese lo-fi', value: 'japanese', emoji: '⛩️' },
  { label: 'Kpop lo-fi', value: 'kpop', emoji: '🇰🇷' },
  { label: 'Lo-fi Jazz', value: 'jazz', emoji: '🎷' },
  { label: 'Lo-fi Covers', value: 'covers', emoji: '🎤' },
  { label: 'Christmas lo-fi', value: 'christmas', emoji: '🎄' },
  { label: 'Lo-fi Mix', value: 'mix', emoji: '✨' },
  { label: 'Lo-fi Gospel', value: 'gospel', emoji: '✝️' }
];

async function StationCommand(interaction) {
  try {
    // 1. Checagem rápida antes de defer (evita “Unknown interaction”)
    const guildId = interaction.guildId;

    // 2. Defer reply para poder editar depois
    await interaction.deferReply();

    // 3. Upsert único: busca e cria se não existir, retornando sempre o documento mais novo
    const doc = await Station.findOneAndUpdate(
      { Guild: guildId },
      { $setOnInsert: { Guild: guildId, Radio: 'default', oldradio: '' } },
      { upsert: true, new: true, lean: true }
    ).exec();

    // 4. Determinar estação atual (valor armazenado ou default)
    const current = doc.Radio || 'default';

    // 5. Montar embed e menu já com label amigável
    const embed = new EmbedBuilder()
      .setColor('#DDBD86')
      .setDescription(`📻 Estação Atual: **${current}**`);

    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('station')
        .setPlaceholder('Selecione uma estação de Rádio Lofi')
        .addOptions(STATION_OPTIONS)
    );

    // 6. Envia mensagem inicial
    const message = await interaction.editReply({
      embeds: [embed],
      components: [row],
    });

    // 7. Coletor limitado a 60s e ao usuário autor
    const filter = i => i.customId === 'station' && i.user.id === interaction.user.id;
    const collector = message.createMessageComponentCollector({ filter, time: 60_000 });

    collector.on('collect', async i => {
      const newStation = i.values[0];

      // 8. Atualização rápida via findOneAndUpdate
      const updated = await Station.findOneAndUpdate(
        { Guild: guildId },
        {
          $set: {
            oldradio: doc.Radio,
            Radio: newStation
          }
        },
        { new: true, lean: true }
      ).exec();

      // 9. Atualiza embed com feedback imediato
      const updatedEmbed = new EmbedBuilder()
        .setColor('#DDBD86')
        .setDescription(`✅ Estação atualizada para: **${updated.Radio}**`);

      await i.update({ embeds: [updatedEmbed], components: [] });
      musicEvent('STATION_CHANGED', `Estação alterada para ${newStation}`);
    });

    collector.on('end', async (_, reason) => {
      if (reason === 'time') {
        // 10. Desativa menu após expirar
        await message.edit({ components: [] }).catch(() => { });
      }
    });

  } catch (error) {
    error('Erro no comando /station:', error);
    // Em caso de falha, tenta notificar o usuário de erro
    if (interaction.deferred) {
      error('Erro ao processar comando /station', { module: 'STATION_COMMAND', user: interaction.user.tag, guild: interaction.guild?.name }, error);
      await interaction.editReply({
        content: '<:error:1364257210745487422> Falha ao processar o comando, tente novamente mais tarde.',
        embeds: [],
        components: []
      });
    } else {
      error('Erro ao processar comando /station antes de defer', { module: 'STATION_COMMAND', user: interaction.user.tag, guild: interaction.guild?.name }, error);
      await interaction.reply({
        content: '<:error:1364257210745487422> Falha ao processar o comando, tente novamente mais tarde.',
        ephemeral: true
      });
    }
  }
}

module.exports = { StationCommand };
