const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const DjModel = require('../../models/dj'); // Renomeie o schema para models/dj.js para seguir o padrão
const { logger, botEvent, error, warn, info } = require('../../Logger');

async function DjModeAdd(interaction) {
    // Verificação rápida de permissão (antes do defer para feedback imediato)
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        warn('Usuário tentou usar comando /djmode-add sem permissão de administrador')
        return interaction.reply({
            content: '<:error:1364257210745487422> Você precisa ser administrador para usar este comando.',
            ephemeral: true,
        });
    }

    await interaction.deferReply();

    try {
        const guildId = interaction.guildId;
        const role = interaction.options.getRole('role');
        if (!role) {
            warn('Cargo não encontrado no comando /djmode-add', { guildId, user: interaction.user.tag });
            return interaction.editReply({
                content: '<:error:1364257210745487422> Cargo não encontrado. Por favor, mencione um cargo válido.',
                ephemeral: true,
            });
        }

        // Busca ou cria o documento para o servidor
        let data = await DjModel.findOne({ Guild: guildId });

        // Caso não exista, cria e já adiciona o cargo
        if (!data) {
            data = await DjModel.create({
                Guild: guildId,
                Roles: [role.id],
                Mode: true,
            });

            const embed = new EmbedBuilder()
                .setAuthor({ name: `${interaction.client.user.username} - DJRoles`, iconURL: interaction.client.user.displayAvatarURL(), url: 'https://discord.gg/aromax-development-708565122188312579' })
                .setDescription(`<:dj:1364257135873228835> **Cargo DJ adicionado com sucesso neste servidor!**\n<:blank:1364257084660650014><:star:1364257635464908901> **Cargo:** <@&${role.id}>.`)
                .setColor('#DDBD86');

            info(`DJ Mode: Cargo ${role.id} adicionado ao servidor ${guildId}`);
            return interaction.editReply({ embeds: [embed] });
        }

        // Se já existir, verifica se já está na lista
        if (data.Roles.includes(role.id)) {
            const embedExists = new EmbedBuilder()
                .setAuthor({ name: `${interaction.client.user.username} - DJRoles`, iconURL: interaction.client.user.displayAvatarURL(), url: 'https://discord.gg/aromax-development-708565122188312579' })
                .setDescription(`<:dj:1364257135873228835> **Este cargo já é DJ neste servidor.**\n<:blank:1364257084660650014><:star:1364257635464908901> **Cargo:** <@&${role.id}>.`)
                .setColor('#DDBD86');
            return interaction.editReply({ embeds: [embedExists] });
        }

        // Caso não exista, adiciona à lista e salva
        data.Roles.push(role.id);
        await data.save();

        const embedAdded = new EmbedBuilder()
            .setAuthor({ name: `${interaction.client.user.username} - DJRoles`, iconURL: interaction.client.user.displayAvatarURL(), url: 'https://discord.gg/aromax-development-708565122188312579' })
            .setDescription(`<:dj:1364257135873228835> **Cargo DJ adicionado com sucesso neste servidor!**\n<:blank:1364257084660650014><:star:1364257635464908901> **Cargo:** <@&${role.id}>.`)
            .setColor('#DDBD86');

        info(`DJ Mode: Cargo ${role.id} adicionado ao servidor ${guildId}`);
        return interaction.editReply({ embeds: [embedAdded] });

    } catch (error) {
        error('Erro no comando /djmode-add:', error);
        return interaction.editReply({
            content: '<:error:1364257210745487422> Ocorreu um erro ao adicionar o cargo DJ. Tente novamente mais tarde.',
            embeds: [],
            components: [],
        });
    }
}

module.exports = { DjModeAdd };