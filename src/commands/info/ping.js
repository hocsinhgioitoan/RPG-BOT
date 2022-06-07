const Command = require('../Command.js');
const {MessageEmbed} = require('discord.js');
var mongoose = require('mongoose');
require("../../../index")
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
        let r;
        const mongo = mongoose.connection.readyState;
        if (mongo === 1) {
            r = 'Đã kết nối';
        } else if (mongo === 0) {
            r = 'Ngắt kết nối';
        } else if (mongo === 2) {
            r = 'Đang kết nối';
        } else if (mongo === 3) {
            r = 'Ngắt kết nối';
        } else if (mongo === 4) {
            r = 'Chưa cài đặt';
        } else {
            r = 'Không xác định';
        }
        const pingEmbed = new MessageEmbed()
            .setColor(client.config.colors.default)
            .setTitle('Ping')
            .setDescription(`Pong!\n**Latency:** ${ping.createdTimestamp - message.createdTimestamp}ms\n**API Latency:** ${Math.round(client.ws.ping)}ms
Mongo Status: ${r}`);
        return ping.edit({embeds: [pingEmbed], content: " "});

    }
};
