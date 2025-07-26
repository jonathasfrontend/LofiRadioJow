const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, } = require('discord.js');
const AutoReconnect = require('../../models/autoReconnect');
const Mode = require('../../models/mode');
const { client } = require('../../Client');
const { logger, botEvent, error, warn } = require('../../Logger');

async function ModeCommand(interaction) {
  const context = {
    command: 'mode',
    user: interaction.user.tag,
    guild: interaction.guild?.name
  };

  try {
    logger.info('Comando mode iniciado', context);
    const guildId = interaction.guildId;
    await interaction.deferReply();

    // Busca o modo atual
    let mode = 'None';
    const modeDoc = await Mode.findOne({ Guild: guildId });
    if (modeDoc?.mode) mode = modeDoc.mode;

    // Busca o player
    const player = client.kazagumo?.players.get(guildId);

    // Embed inicial
    const embed = new EmbedBuilder()
      .setColor('#DDBD86')
      .setAuthor({
        name: `${client.user.username} - Mode`,
        iconURL: client.user.displayAvatarURL(),
      })
      .setDescription(`<:mode:1364257442883436615> Modo atual da rádio: **${mode}**`);

    // Botões principais (um desabilitado conforme modo atual)
    const buttons = [
      new ButtonBuilder()
        .setCustomId('mode-24-7')
        .setLabel('24/7')
        .setEmoji('<:timer:1364257700656976014>')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(mode === '24/7'),

      new ButtonBuilder()
        .setCustomId('mode-autoplay')
        .setLabel('Auto Play')
        .setEmoji('<:dvd:1364257189887213628>')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(mode === 'Auto Play'),

      new ButtonBuilder()
        .setCustomId('mode-session')
        .setLabel('Session')
        .setEmoji('<:am:1364257057145884715>')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(mode === 'Session'),

      new ButtonBuilder()
        .setCustomId('mode-info')
        .setLabel('Info')
        .setEmoji('<:info:1364257347970797700>')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false),
    ];
    const row = new ActionRowBuilder().addComponents(buttons);

    // Mensagem principal
    const message = await interaction.editReply({
      embeds: [embed],
      components: [row],
    });

    // Filtro: apenas quem executou pode interagir
    const filter = (i) => i.user.id === interaction.user.id;
    const collector = message.createMessageComponentCollector({
      filter,
      componentType: 2, // BUTTON
      time: 30_000,
      idle: 15_000,
    });

    collector.on('collect', async (i) => {
      await i.deferUpdate();

      // 24/7 MODE
      if (i.customId === 'mode-24-7') {
        if (!player) {
          return await interaction.followUp({
            content: '<:notes:1364257513054146652> Toque uma música antes para ativar o modo 24/7.',
            ephemeral: true,
          });
        }

        // Atualiza ou cria registro de autoReconnect
        let autoRec = await AutoReconnect.findOne({ Guild: guildId });
        if (!autoRec) {
          autoRec = new AutoReconnect({
            Guild: player.guildId,
            TextId: player.textId,
            VoiceId: player.voiceId,
          });
          await autoRec.save();
        }

        // Atualiza modo na DB
        if (modeDoc) {
          modeDoc.oldmode = mode;
          modeDoc.mode = '24/7';
          await modeDoc.save();
        } else {
          await Mode.create({
            Guild: guildId,
            mode: '24/7',
            oldmode: mode,
          });
        }

        // Feedback
        const embed247 = new EmbedBuilder()
          .setColor('#DDBD86')
          .setAuthor({
            name: `${client.user.username} - Modos`,
            iconURL: client.user.displayAvatarURL()
          })
          .setDescription('<:timer:1364257700656976014> Modo atual da rádio: **24/7**');
        await interaction.editReply({
          embeds: [embed247],
          components: [
            new ActionRowBuilder().addComponents(
              ...buttons.map((btn, idx) =>
                idx === 0 ? btn.setDisabled(true) : btn.setDisabled(false)
              )
            ),
          ],
        });
        botEvent('MODE_247_ACTIVATED', 'Modo 24/7 ativado', interaction.user.tag, interaction.guild?.name);
      }

      // AUTO PLAY MODE
      if (i.customId === 'mode-autoplay') {
        if (!player) {
          return await interaction.followUp({
            content: '<:notes:1364257513054146652> Toque uma música antes para ativar o Auto Play.',
            ephemeral: true,
          });
        }

        // Alterna o autoplay do player (Kazagumo/Lavalink custom)
        player.data.set('autoplay', !player.data.get('autoplay'));
        player.data.set('requester', interaction.user);

        // Remove autoReconnect se existir
        let autoRec = await AutoReconnect.findOne({ Guild: guildId });
        if (autoRec) await autoRec.deleteOne();

        // Atualiza modo na DB
        if (modeDoc) {
          modeDoc.oldmode = mode;
          modeDoc.mode = 'Auto Play';
          await modeDoc.save();
        } else {
          await Mode.create({
            Guild: guildId,
            mode: 'Auto Play',
            oldmode: mode,
          });
        }

        // Feedback
        const embedAuto = new EmbedBuilder()
          .setColor('#DDBD86')
          .setAuthor({
            name: `${client.user.username} - Modos`,
            iconURL: client.user.displayAvatarURL(),
          })
          .setDescription('<:dvd:1364257189887213628> Modo atual da rádio: **Auto Play**');
        await interaction.editReply({
          embeds: [embedAuto],
          components: [
            new ActionRowBuilder().addComponents(
              ...buttons.map((btn, idx) =>
                idx === 1 ? btn.setDisabled(true) : btn.setDisabled(false)
              )
            ),
          ],
        });
        botEvent('MODE_AUTOPLAY_ACTIVATED', 'Modo Auto Play ativado', interaction.user.tag, interaction.guild?.name);
      }

      // SESSION MODE
      if (i.customId === 'mode-session') {
        if (!player) {
          return await interaction.followUp({
            content: '<:notes:1364257513054146652> Toque uma música antes para ativar o modo Session.',
            ephemeral: true,
          });
        }

        // Remove autoReconnect se existir
        let autoRec = await AutoReconnect.findOne({ Guild: guildId });
        if (autoRec) await autoRec.deleteOne();

        // Atualiza modo na DB
        if (modeDoc) {
          modeDoc.oldmode = mode;
          modeDoc.mode = 'Session';
          await modeDoc.save();
        } else {
          await Mode.create({
            Guild: guildId,
            mode: 'Session',
            oldmode: mode,
          });
        }

        const embedSession = new EmbedBuilder()
          .setColor('#DDBD86')
          .setAuthor({
            name: `${client.user.username} - Modos`,
            iconURL: client.user.displayAvatarURL(),
          })
          .setDescription('<:am:1364257057145884715> Modo atual da rádio: **Session**');
        await interaction.editReply({
          embeds: [embedSession],
          components: [
            new ActionRowBuilder().addComponents(
              ...buttons.map((btn, idx) =>
                idx === 2 ? btn.setDisabled(true) : btn.setDisabled(false)
              )
            ),
          ],
        });
        botEvent('MODE_SESSION_ACTIVATED', 'Modo Session ativado', interaction.user.tag, interaction.guild?.name);
        
      }

      // INFO
      if (i.customId === 'mode-info') {
        const embedInfo = new EmbedBuilder()
          .setColor('#DDBD86')
          .setAuthor({
            name: `${client.user.username} - Ajuda Modos`,
            iconURL: client.user.displayAvatarURL(),
          })
          .setDescription(
            [
              '<:mode:1364257442883436615> **Modos de Rádio:**',
              '• <:am:1364257057145884715> **Session:** Temporário, desconecta ao sair.',
              '• <:dvd:1364257189887213628> **Auto Play:** Toca músicas automaticamente.',
              '• <:timer:1364257700656976014> **24/7:** Rádio sempre conectada no canal.',
            ].join('\n')
          );
        await interaction.followUp({ embeds: [embedInfo], ephemeral: true });
      }
    });

    collector.on('end', async () => {
      // Desabilita todos os botões ao finalizar
      await message.edit({
        components: [
          new ActionRowBuilder().addComponents(
            ...buttons.map((btn) => btn.setDisabled(true))
          ),
        ],
      }).catch(() => { });
    });
  } catch (err) {
    error('Erro no comando mode', context, err);
    if (interaction.deferred || interaction.replied) {
      await interaction.editReply({
        content: '<:error:1364257210745487422> Falha ao processar o comando, tente novamente.',
        embeds: [],
        components: [],
      });
    } else {
      await interaction.reply({
        content: '<:error:1364257210745487422> Falha ao processar o comando, tente novamente.',
        ephemeral: true,
      });
    }
  }
}

module.exports = { ModeCommand };