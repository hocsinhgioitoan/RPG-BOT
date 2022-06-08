const Command = require('../Command.js');
const {MessageEmbed} = require('discord.js');
const Player = file("./src/Game/Player.js");

module.exports = class HuntCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'hunt',
            usage: 'hunt',
            description: `Săn bắt thú`,
            type: client.types.INFO,
        });
    }

    async run(client, message, args) {
        const player = new Player(message.author.id, message.author.username);
        const data = await player.getDataPlayer();
    }
}; 
