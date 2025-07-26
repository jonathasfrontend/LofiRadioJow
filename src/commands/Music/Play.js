const { EmbedBuilder } = require('discord.js');
const Station = require('../../models/station');
const { logger, musicEvent, error, warn } = require('../../Logger');

// 1. Pré-carregamento dos dados de estação
const stations = {
    'default': require('../../songs/default.json').words,
    'study': require('../../songs/study.json').words,
    'anime': require('../../songs/anime.json').words,
    'halloween ': require('../../songs/halloween.json').words,
    'gaming': require('../../songs/gaming.json').words,
    'sleep': require('../../songs/sleep.json').words,
    'synthwave': require('../../songs/synthwave.json').words,
    'japanese ': require('../../songs/japanese.json').words,
    'kpop': require('../../songs/kpop.json').words,
    'jazz': require('../../songs/jazz.json').words,
    'covers': require('../../songs/covers.json').words,
    'christmas': require('../../songs/christmas.json').words,
    'mix': require('../../songs/mix.json').words,
    'gospel': require('../../songs/gospel.json').words,
};

async function Play(interaction) {
    if (!interaction.isCommand()) return;
    
    const context = {
        command: 'play',
        user: interaction.user.tag,
        guild: interaction.guild?.name
    };

    try {
        // 2. Verificações iniciais antes de defer
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            warn('Usuário tentou usar comando play sem estar em canal de voz', context);
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#DDBD86')
                        .setDescription('<:loud:1364257411115782144> Você precisa estar em um canal de voz para usar este comando!')
                ],
                ephemeral: true
            });
        }

        // 3. Checagem de player existente
        const guildId = interaction.guildId;
        let player = interaction.client.kazagumo.players.get(guildId);
        if (player?.voiceChannel) {
            const sameChannel = player.voiceChannel.id === voiceChannel.id;
            const embed = new EmbedBuilder()
                .setColor(sameChannel ? '#DDBD86' : '#FF0000')
                .setDescription(
                    sameChannel
                        ? '<:loud:1364257411115782144> O bot já está conectado neste canal de voz.'
                        : '<:error:1364257210745487422> O bot já está conectado em outro canal de voz.'
                );
            
            if (!sameChannel) {
                warn('Usuário tentou usar play com bot em outro canal', context);
            }
            
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        // 4. Defer agora
        await interaction.deferReply({ ephemeral: false });
        musicEvent('PLAY_COMMAND_START', `Iniciando reprodução para usuário ${interaction.user.tag}`, context);

        // 5. Consulta e upsert em uma única operação
        const res = await Station.findOneAndUpdate(
            { Guild: guildId },                              // filtro
            { $setOnInsert: { Guild: guildId } },            // upsert: define Guild apenas se novo
            { new: true, upsert: true, lean: true }           // retorna POJO e cria se não existir
        ).exec();                                          // lean() torna o objeto mais leve

        const station = res.Radio || 'default';
        musicEvent('STATION_SELECTED', `Estação selecionada: ${station}`, context);

        // 6. Seleção de query de forma eficiente (cache acima)
        const words = stations[station] || stations['default'];
        const query = words[Math.floor(Math.random() * words.length)];
        musicEvent('TRACK_SEARCH', `Buscando: ${query}`, context);

        // 7. Criação do player e busca simultâneas
        [player] = await Promise.all([
            (async () => {
                if (!player) {
                    musicEvent('PLAYER_CREATE', `Criando novo player para guild ${guildId}`, context);
                    return interaction.client.kazagumo.createPlayer({
                        guildId,
                        voiceId: voiceChannel.id,
                        textId: interaction.channelId,
                        deaf: true
                    });
                }
                // Se o player existia mas sem canal (remoção manual), recria-o
                musicEvent('PLAYER_RECREATE', `Recriando player existente para guild ${guildId}`, context);
                return interaction.client.kazagumo.createPlayer({
                    guildId,
                    voiceId: voiceChannel.id,
                    textId: interaction.channelId,
                    deaf: true
                });
            })(),
            // Poderíamos paralelizar outras operações aqui, se necessário
        ]);

        // 8. Busca e enfileiramento
        const result = await player.search(query, { requester: interaction.user });
        if (!result.tracks.length) {
            warn('Nenhuma faixa encontrada na busca', { ...context, query });
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#DDBD86')
                        .setDescription('<:error:1364257210745487422> Nenhum resultado encontrado. Tente novamente mais tarde.')
                ]
            });
        }
        
        if (result.type === 'PLAYLIST') {
            player.queue.add(result.tracks);
            player.setLoop('queue');
            musicEvent('PLAYLIST_ADDED', `Playlist adicionada com ${result.tracks.length} faixas`, context);
        } else {
            player.queue.add(result.tracks[0]);
            musicEvent('TRACK_ADDED', `Faixa adicionada: ${result.tracks[0].title}`, context);
        }

        // 9. Inicia reprodução se necessário
        if (!player.playing && !player.paused) {
            player.play();
            musicEvent('PLAYBACK_START', 'Reprodução iniciada', context);
        }
        await player.setLoop('queue');

        // 10. Embed final
        const playedEmbed = new EmbedBuilder()
            .setColor('#DDBD86')
            .setDescription(`
                <:notes:1364257513054146652> Conectado com sucesso no canal: <#${voiceChannel.id}>.
                <:blank:1364257084660650014><:dvd:1364257189887213628> **Entrou no canal de voz a tocar 24/7.**
            `);
        await interaction.editReply({ embeds: [playedEmbed] });
        
        musicEvent('PLAY_COMMAND_SUCCESS', `Comando play executado com sucesso`, context);
        
    } catch (err) {
        error('Erro no comando play', context, err);
        
        // Resposta de erro se ainda não foi respondida
        const errorEmbed = new EmbedBuilder()
            .setColor('#DDBD86')
            .setDescription('<:error:1364257210745487422> Ocorreu um erro interno. Tente novamente em alguns momentos.');
            
        if (interaction.deferred) {
            await interaction.editReply({ embeds: [errorEmbed] }).catch(() => {});
        } else if (!interaction.replied) {
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true }).catch(() => {});
        }
    }
}

module.exports = { Play };