/*
  * PROJETO: Bot Jonalandia
  * AUTOR: Jonathas Oliveira
  * LICENÇA: JPL (Jonathas Proprietary License)
  * Veja mais em: LICENSE
*/

const { logger, botEvent, error, commandExecuted } = require('./Logger');
const { client } = require('./Client');

const { Oi } = require('./commands/Oi');
// Music
const { Play } = require('./commands/Music/Play')
const { StationCommand } = require('./commands/Music/station')
const { Stop } = require('./commands/Music/stop')
const { Song } = require('./commands/Music/song')
const { Volume } = require('./commands/Music/volume')
const { Sleep } = require('./commands/Music/sleep')
// Information
const { Ajuda } = require('./commands/Information/ajuda')
// profile
const { Collection } = require('./commands/profile/collection');
// Settings
const { ModeCommand } = require('./commands/Settings/mode');
const { DjModeAdd } = require('./commands/Settings/djmode add');
const { DjModeRemove } = require('./commands/Settings/djmode remove');
const { DjModeToggle } = require('./commands/Settings/djmode toggle');

const { Status } = require('./functions/statusBot')

const { kazagumoInstance } = require('./config/kazagumo');
const { bdServerConect } = require('./config/bdServerConect')

require('dotenv').config()

client.once('ready', async () => {
  try {
    Status();
    bdServerConect();
    client.kazagumo = kazagumoInstance;

    botEvent('BOT_READY', `Bot ${client.user.tag} está online!`);

    // Registrar comandos
    botEvent('COMMANDS_REGISTRATION', 'Iniciando registro de comandos...');

    client.application?.commands.create({
      name: 'ajuda',
      description: 'Mostra os comandos disponíveis.',
    });

    client.application?.commands.create({
      name: 'oi', description: 'Responde com oi!',
    });

    client.application?.commands.create({
      name: 'play',
      description: 'Entra no seu canal de voz e começa a tocar 24/7.',
    });

    client.application?.commands.create({
      name: 'station',
      description: 'Muda a estação/tema da rádio.',
    });

    client.application?.commands.create({
      name: 'stop',
      description: 'Sai do canal de voz.',
    });

    client.application?.commands.create({
      name: 'song',
      description: 'Mostra a música que está tocando no momento',
    });

    client.application?.commands.create({
      name: 'volume',
      description: 'Ajusta o volume da rádio.',
      options: [
        {
          name: 'amount',
          description: 'Novo valor do volume (0 a 100)',
          type: 10, // NUMBER
          required: true,
        },
      ],
    });

    client.application?.commands.create({
      name: 'sleep',
      description: 'Configura um temporizador de sono e muda a estação para Sleep lo-fi.',
    });

    client.application?.commands.create({
      name: 'collection',
      description: 'Mostra a coleção de músicas curtidas.',
    });

    client.application?.commands.create({
      name: 'mode',
      description: 'Alterna o modo da rádio (24/7, Auto Play, Session).',
    });

    client.application?.commands.create({
      name: 'djmode-add',
      description: 'Adiciona um cargo DJ autorizado para usar funções de DJ.',
      options: [
        {
          name: 'role',
          description: 'Mencione um cargo para adicionar como DJ.',
          type: 8, // TYPE: ROLE (v14+)
          required: true,
        },
      ],
    });

    client.application?.commands.create({
      name: 'djmode-remove',
      description: 'Remove todos os cargos DJ do servidor atual.',
    });

    client.application?.commands.create({
      name: 'djmode-toggle', 
      description: 'Alterna entre habilitar ou desabilitar o modo DJ no servidor.',
      options: [
        {
          name: 'toggledj',
          description: 'Habilitar ou desabilitar o modo DJ.',
          type: 3, // STRING
          required: true,
          choices: [
            {
              name: 'Habilitar',
              value: 'dj_on',
            },
            {
              name: 'Desabilitar',
              value: 'dj_off',
            },
          ],
        },
      ],
    });

    botEvent('COMMANDS_REGISTRATION', 'Comandos registrados com sucesso!');
  } catch (err) {
    error('Erro durante a inicialização do bot', { module: 'BOT_STARTUP' }, err);
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  try {
    let success = true;

    if (commandName === 'oi') {
      await Oi(interaction);
    } else if (commandName === 'play') {
      await Play(interaction);
    } else if (commandName === 'station') {
      await StationCommand(interaction);
    } else if (commandName === 'stop') {
      await Stop(interaction);
    } else if (commandName === 'song') {
      await Song(interaction);
    } else if (commandName === 'volume') {
      await Volume(interaction);
    } else if (commandName === 'sleep') {
      await Sleep(interaction);
    } else if (commandName === 'ajuda') {
      await Ajuda(interaction);
    } else if (commandName === 'collection') {
      await Collection(interaction);
    } else if (commandName === 'mode') {
      await ModeCommand(interaction);
    } else if (commandName === 'djmode-add') {
      await DjModeAdd(interaction);
    } else if (commandName === 'djmode-remove') {
      await DjModeRemove(interaction);
    } else if (commandName === 'djmode-toggle') {
      await DjModeToggle(interaction);
    } else {
      success = false;
    }

    commandExecuted(commandName, interaction.user, interaction.guild, success);

  } catch (err) {
    commandExecuted(commandName, interaction.user, interaction.guild, false);
    error(`Erro ao executar comando ${commandName}`, {
      module: 'COMMAND_HANDLER',
      command: commandName,
      user: interaction.user.tag,
      guild: interaction.guild?.name
    }, err);

    // Resposta de erro para o usuário se não foi respondida ainda
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({
        content: '<:error:1364257210745487422> Ocorreu um erro interno. Tente novamente em alguns momentos.',
        ephemeral: true
      }).catch(() => { });
    }
  }
});

client.login(process.env.TOKEN);
