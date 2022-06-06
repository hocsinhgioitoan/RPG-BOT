const Command = require('../Command.js');
const {MessageEmbed} = require('discord.js');

module.exports = class PingCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'ping',
            usage: 'ping',
            description: `Gets ${client.name}'s current latency and API latency.`,
            type: client.types.INFO,
        });
    }

    async run(client, message, args) {
        const ping = await message.channel.send(`Ping?`);
        const pingEmbed = new MessageEmbed()
            .setColor(client.config.colors.default)
            .setTitle('Ping')
            .setDescription(`Pong!\n**Latency:** ${ping.createdTimestamp - message.createdTimestamp}ms\n**API Latency:** ${Math.round(client.ws.ping)}ms`);
        return ping.edit({embeds: [pingEmbed], content: " "});

    }
};
