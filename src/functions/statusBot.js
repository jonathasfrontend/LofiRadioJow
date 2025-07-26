const { PresenceUpdateStatus, ActivityType  } = require('discord.js');
const { client } = require('../Client');
const { botEvent, error } = require('../Logger');

function Status () {
    try {
        client.user.setPresence({
            activities: [
                {
                    name: ' Lo-Fi Radio Jow',
                    type: ActivityType.Listening,
                    status: PresenceUpdateStatus.Online,
                }
            ]
        });
        botEvent('STATUS_SET', 'Status do bot configurado para "Listening to Lo-Fi Radio Jow"');
    } catch (err) {
        error('Erro ao configurar status do bot', { module: 'BOT_STATUS' }, err);
    }
}

module.exports = { Status }