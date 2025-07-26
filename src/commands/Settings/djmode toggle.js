const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const DjModel = require('../../models/dj'); // Siga o padrão de models/dj.js
const { logger, botEvent, error, warn, info } = require('../../Logger');

async function DjModeToggle(interaction) {
    // Verificação de permissão
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
        warn('Usuário tentou usar comando /djmode-toggle sem permissão de gerenciar servidor', { user: interaction.user.tag });
        return interaction.reply({
            content: '<:error:1364257210745487422> Você precisa de permissão de **Gerenciar Servidor** para usar este comando.',
            ephemeral: true,
        });
    }

    await interaction.deferReply();

    try {
        const guildId = interaction.guildId;
        const input = interaction.options.getString('toggledj');
        let data = await DjModel.findOne({ Guild: guildId });

        if (!data) {
            warn('djmode-toggle: Nenhum registro de DJ encontrado.', { guildId });
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription('<:dj:1364257135873228835> Nenhum DJ configurado neste servidor.')
                        .setColor('#DDBD86')
                ]
            });
        }

        let respostaEmbed;
        if (input === 'dj_on') {
            data.Mode = true;
            await data.save();

            respostaEmbed = new EmbedBuilder()
                .setColor('#DDBD86') // Verde para "habilitado"
                .setDescription('<:dj:1364257135873228835> **Modo DJ habilitado com sucesso!**');
                info(`Modo DJ habilitado no servidor ${guildId}`);
        } else if (input === 'dj_off') {
            data.Mode = false;
            await data.save();

            respostaEmbed = new EmbedBuilder()
                .setColor('#DDBD86') // Vermelho para "desabilitado"
                .setDescription('<:dj:1364257135873228835> **Modo DJ desabilitado com sucesso!**');
                info(`Modo DJ desabilitado no servidor ${guildId}`);
        } else {
            warn('Valor inválido para toggledj', { input });
            return interaction.editReply({
                content: '<:error:1364257210745487422> Valor inválido! Use `dj_on` ou `dj_off`.',
                ephemeral: true,
            });
        }

        return interaction.editReply({ embeds: [respostaEmbed] });

    } catch (err) {
        error('Erro no comando /djmode-toggle:', err);
        return interaction.editReply({
            content: '<:error:1364257210745487422> Ocorreu um erro ao alternar o modo DJ. Tente novamente mais tarde.',
            embeds: [],
            components: [],
        });
    }
}

// Exporta usando a sintaxe padrão dos comandos do seu novo bot
module.exports = { DjModeToggle };