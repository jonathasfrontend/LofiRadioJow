const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Playlist = require('../../models/playlist'); 
const { logger, botEvent, error, warn } = require('../../Logger');

async function Collection(interaction) {
  const context = {
    command: 'collection',
    user: interaction.user.tag,
    guild: interaction.guild?.name
  };

  try {
    logger.info('Comando collection iniciado', context);
    // Defer reply para permitir operações assíncronas
    await interaction.deferReply();

    const userId = interaction.user.id;
    const playlistName = 'Favorites';
    // Busca a playlist do usuário
    const data = await Playlist.findOne({ UserId: userId, PlaylistName: playlistName }).lean();

    if (!data || !data.Playlist?.length) {
      warn('Usuário tentou acessar collection sem músicas curtidas', context);
      const noSongsEmbed = new EmbedBuilder()
        .setColor('#DDBD86')
        .setDescription('Você ainda não curtiu nenhuma música!');

      return interaction.editReply({ embeds: [noSongsEmbed] });
    }

    // Paginação: divide em páginas de 10 músicas
    const tracks = data.Playlist.map(
      (x, i) =>
        `**${i + 1}**. ${`${x.title} - ${x.author}`}`
    );
    const chunk = (arr, size) => Array.from({ length: Math.ceil(arr.length / size) }, (_, i) => arr.slice(i * size, i * size + size));
    const pages = chunk(tracks, 10);
    let page = 0;

    const makeEmbed = (pageIndex) =>
      new EmbedBuilder()
        .setAuthor({ name: 'Coleção de Músicas Curtidas', iconURL: interaction.client.user.displayAvatarURL() })
        .setColor('#DDBD86')
        .setDescription(pages[pageIndex].join('\n'))
        .setFooter({ text: `Página ${pageIndex + 1}/${pages.length}` });

    let embed = makeEmbed(page);

    // Botões de navegação
    const prevButton = new ButtonBuilder()
      .setCustomId('prev_collection')
      .setEmoji('<:left:1392220787209011272>')
      .setLabel('Previous')
      .setStyle(ButtonStyle.Secondary);

    const prevButtonMenu = new ButtonBuilder()
      .setCustomId('prev_Menu_collection')
      .setEmoji('<:left:1392220787209011272>')
      .setStyle(ButtonStyle.Secondary);

    const nextButton = new ButtonBuilder()
      .setCustomId('next_collection')
      .setEmoji('<:right:1392220805894504571>')
      .setLabel('Next')
      .setStyle(ButtonStyle.Secondary);

    const settingsButton = new ButtonBuilder()
      .setCustomId('settings_collection')
      .setEmoji('<:config:1364257112506765425>')
      .setStyle(ButtonStyle.Secondary);

    const deleteButton = new ButtonBuilder()
      .setCustomId('delete_collection')
      .setEmoji('<:trash:1392572697686310942>')
      .setLabel('Deletar playlist')
      .setStyle(ButtonStyle.Secondary);


    // Se só tem uma página, exibe botões desabilitados
    if (pages.length === 1) {
      const disabledRow = new ActionRowBuilder().addComponents(
        prevButton.setDisabled(true),
        nextButton.setDisabled(true),
        settingsButton.setDisabled(false)
      );
      await interaction.editReply({ embeds: [embed], components: [disabledRow] });
      return;
    }

    let row = new ActionRowBuilder().addComponents(prevButton, nextButton, settingsButton);
    const message = await interaction.editReply({ embeds: [embed], components: [row] });

    // Coletor para interações do usuário
    const filter = i => ['prev_collection', 'next_collection', 'settings_collection', 'prev_Menu_collection', 'delete_collection'].includes(i.customId) && i.user.id === interaction.user.id;
    const collector = message.createMessageComponentCollector({ filter, time: 5 * 60 * 1000, idle: 2.5 * 60 * 1000 });

    collector.on('collect', async i => {
      if (i.customId === 'prev_collection') {
        page = page - 1 < 0 ? pages.length - 1 : page - 1;
        embed = makeEmbed(page);
        await i.update({ embeds: [embed], components: [row] });
      } else if (i.customId === 'next_collection') {
        page = page + 1 >= pages.length ? 0 : page + 1;
        embed = makeEmbed(page);
        await i.update({ embeds: [embed], components: [row] });
      } else if (i.customId === 'prev_Menu_collection') {
        row = new ActionRowBuilder().addComponents(
          prevButton.setDisabled(false),
          nextButton.setDisabled(false),
          settingsButton.setDisabled(false)
        );
        embed = makeEmbed(page);
        await i.update({ embeds: [embed], components: [row] });
      } else if (i.customId === 'settings_collection') {
        const NextButtonsRow = new ActionRowBuilder().addComponents(
          prevButtonMenu.setDisabled(false),
          deleteButton.setDisabled(false),
        );
        await i.update({ components: [NextButtonsRow] });
      } else if (i.customId === 'delete_collection') {
        try {
          // Deleta a playlist do banco de dados
          await Playlist.deleteOne({ UserId: userId, PlaylistName: playlistName });
          
          const deletedEmbed = new EmbedBuilder()
            .setColor('#DDBD86')
            .setDescription('<:trash:1392572697686310942> Sua playlist foi deletada com sucesso!');
          
          botEvent('PLAYLIST_DELETED', 'Playlist deletada', interaction.user.tag, interaction.guild?.name, playlistName);
          await i.update({ embeds: [deletedEmbed], components: [] });
          
          // Para o coletor após deletar
          collector.stop();
        } catch (deleteError) {
          error('Erro ao deletar playlist', context, deleteError);
          
          const errorEmbed = new EmbedBuilder()
            .setColor('#DDBD86')
            .setDescription('<:error:1364257210745487422> Erro ao deletar a playlist. Tente novamente.');

          await i.update({ embeds: [errorEmbed], components: [] });
        }
      }
    });

    collector.on('end', async () => {
      // Desabilita botões quando o tempo expira
      const disabledRow = new ActionRowBuilder().addComponents(
        prevButton.setDisabled(true),
        nextButton.setDisabled(true),
        settingsButton.setDisabled(true)
      );
      await message.edit({ components: [disabledRow] }).catch(() => { });
    });

  } catch (err) {
    error('Erro no comando collection', context, err);
    if (interaction.deferred) {
      await interaction.editReply({
        content: '<:error:1364257210745487422>  Ocorreu um erro ao mostrar sua coleção. Tente novamente mais tarde.',
        embeds: [],
        components: []
      });
    } else {
      await interaction.reply({
        content: '<:error:1364257210745487422>  Ocorreu um erro ao mostrar sua coleção. Tente novamente mais tarde.',
        ephemeral: true
      });
    }
  }
}

module.exports = { Collection };