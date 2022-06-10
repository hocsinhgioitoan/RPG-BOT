const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const db = require('../../mongoose/mongoose.js');
const t = require('../../mongoose/Schema/PlayerSchema.js');
module.exports = class LeaderBroadCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'leaderboard',
            usage: 'ping',
            aliases: ['lb', 'top'],
            description: `Xem top người chơi.`,
            type: client.types.GAME,
        });
    }

    async run(client, message, args) {
        let f = []
        let embed = new MessageEmbed()
            .setColor(client.config.colors.default)
            .setTitle('Leaderboard')
            .setDescription('Đang cập nhật...')
            .setTimestamp();
        const e =  await message.channel.send({embeds: [embed]});
        let data = await t.find({}).sort({ 'inventory.money': -1 }).limit(10);
        let embed2 = new MessageEmbed()
            .setColor(client.config.colors.default)
            .setTitle('Leaderboard')
            .setTimestamp();
        for (let i = 0; i < data.length; i++) {
            let g;
            if (i + 1 === 1) {
                g = client.emoji.rank.superpro
            } else if (i + 1 === 2) {
                g = client.emoji.rank.pro
            } else if (i + 1 === 3) {
                g = client.emoji.rank.trum
            } else if (i + 1 === 4) {
                g = client.emoji.rank.bacthay
            } else if (i + 1 === 5) {
                g = client.emoji.rank.vang
            } else if (i + 1 === 6) {
                g = client.emoji.rank.bac
            } else if (i + 1 === 7) {
                g = client.emoji.rank.dong
            } else {
                g = ` \`${i + 1}\``
            }
            f.push(`${g} ${data[i].info.name} - ${data[i].inventory.money}`)
            embed2.setDescription(f.join('\n'));
        }
        e.delete()
        message.channel.send({embeds: [embed2]});

    }
};
