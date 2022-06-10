const Command = require('../Command.js');
const { MessageEmbed, MessageAttachment } = require('discord.js');
var mongoose = require('mongoose');
const Player = file('./src/Game/Player');
require('../../../index');
module.exports = class ProfileCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'profile',
            usage: 'pofile',
            description: `Xem profile.`,
            type: client.types.GAME,
        });
    }

    async run(client, message, args) {
        if (args[0]) {
            const checkUser = client.users.cache.get(args[0]);
            if (!checkUser) return message.reply(`Không tìm thấy người dùng.`);
            const playerr = new Player(args[0], checkUser.username);
            const datar = await playerr.getDataPlayer();
            if (!datar) return message.reply(`Không tìm thấy người dùng.`);
            const stats = datar.stats;
            const get = checkNumber(stats);
            const embed = new MessageEmbed()
                .setTitle(`Profile ${checkUser.username}`)
                .addFields([
                    { name: 'Tên', value: `${datar.info.name}` },
                    { name: 'Level', value: `${datar.info.level}` },
                    {
                        name: 'Stats',
                        value: `${client.emoji.icon.HP} \`${get.hp}\` ${client.emoji.icon.MP} \`${get.mp}\` ${client.emoji.icon.ATK} \`${get.atk}\` \n ${client.emoji.icon.DEF} \`${get.def}\` ${client.emoji.icon.MATK} \`${get.matk}\` ${client.emoji.icon.MDEF} \`${get.mdef}\``,
                    },
                ])
                .setTimestamp()
                .setThumbnail(checkUser.displayAvatarURL())
                .setColor(client.config.colors.default);

            message.channel.send({ embeds: [embed] });
        } else {
            const playerr = new Player(
                message.author.id,
                message.author.username
            );
            const datar = await playerr.getDataPlayer();
            if (!datar) return message.reply(`Không tìm thấy người dùng.`);
            const stats = datar.stats;
            const get = checkNumber(stats);
            const embed = new MessageEmbed()
                .setTitle(`Profile ${message.author.username}`)
                .addFields([
                    { name: 'Tên', value: `${datar.info.name}` },
                    { name: 'Level', value: `${datar.info.level}` },
                    {
                        name: 'Stats',
                        value: `${client.emoji.icon.HP} \`${get.hp}\` ${client.emoji.icon.MP} \`${get.mp}\` ${client.emoji.icon.ATK} \`${get.atk}\` \n ${client.emoji.icon.DEF} \`${get.def}\` ${client.emoji.icon.MATK} \`${get.matk}\` ${client.emoji.icon.MDEF} \`${get.mdef}\``,
                    },
                ])
                .setTimestamp()
                .setThumbnail(message.author.displayAvatarURL())
                .setColor(client.config.colors.default);

            message.channel.send({ embeds: [embed] });
        }
    }
};

function checkArray(obj) {
    let g = 0;
    for (let i in obj) {
        if (obj[i].toString().length > g) {
            g = obj[i].toString().length;
        }
    }
    return g;
}
function checkNumber(stats) {
    const g = checkArray(stats);
    for (let i in stats) {
        if (stats[i].toString().length < g) {
            stats[i] = `${stats[i]}`.padStart(g, '0');
        } else {
            stats[i] = `${stats[i]}`;
        }
    }
    return stats;
}
