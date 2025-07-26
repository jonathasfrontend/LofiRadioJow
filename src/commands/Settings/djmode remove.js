const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const DjModel = require('../../models/dj'); // Certifique-se que o schema está em models/dj.js
const { logger, botEvent, error, warn, info } = require('../../Logger');

async function DjModeRemove(interaction) {
    // Verificação de permissão ANTES do defer para feedback imediato
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        warn('Usuário tentou usar comando /djmode-remove sem permissão de administrador');
        return interaction.reply({
            content: '<:error:1364257210745487422> Você precisa ser administrador para usar este comando.',
            ephemeral: true,
        });
    }

    await interaction.deferReply();

    try {
        const guildId = interaction.guildId;
        const djData = await DjModel.findOne({ Guild: guildId });

        if (djData) {
            await djData.deleteOne();

            const embed = new EmbedBuilder()
                .setAuthor({
                    name: `${interaction.client.user.username} - DJRoles`,
                    iconURL: interaction.client.user.displayAvatarURL(),
                    url: 'https://discord.gg/aromax-development-708565122188312579'
                })
                .setDescription(`
                    <:dj:1364257135873228835> **Todos os cargos DJ foram removidos com sucesso deste servidor!**
                    <:blank:1364257084660650014><:star:1364257635464908901> Use **/djmode-add** para adicionar cargos DJ para a Lo-fi Radio.
                `)
                .setColor('#DDBD86');

            info(`DJ Mode: Todos os cargos DJ removidos do servidor ${guildId}`);
            return interaction.editReply({ embeds: [embed] });

        } else {
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: `${interaction.client.user.username} - DJRoles`,
                    iconURL: interaction.client.user.displayAvatarURL(),
                    url: 'https://discord.gg/aromax-development-708565122188312579'
                })
                .setDescription(`
                    <:dj:1364257135873228835> **Nenhum cargo DJ configurado neste servidor.**
                    <:blank:1364257084660650014><:star:1364257635464908901> Use **/djmode-add** para adicionar cargos DJ para a Lo-fi Radio.
                `)
                .setColor('#DDBD86');

            warn('Tentativa de remover DJ roles sem configuração prévia', { guildId, user: interaction.user.tag });
            return interaction.editReply({ embeds: [embed] });
        }
    } catch (err) {
        error('Erro no comando /djmode-remove:', err);
        return interaction.editReply({
            content: '<:error:1364257210745487422> Ocorreu um erro ao remover os cargos DJ. Tente novamente mais tarde.',
            embeds: [],
            components: [],
        });
    }
}

module.exports = { DjModeRemove };