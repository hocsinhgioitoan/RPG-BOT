const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const t = require('../../mongoose/Schema/PlayerSchema.js');
const Player = require('../../game/Player.js');
const moment = require('moment');
moment.locale('vi');
module.exports = class LeaderBroadCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'premium',
            usage: 'ping',
            aliases: ['p'],
            description: `Xem top người chơi.`,
            type: client.types.FUN,
        });
    }

    async run(client, message, args) {
        if (client.config.owners.includes(message.author.id)) {
            const type = args[0];
            if (type === 'add') {
                const checkUser = client.users.cache.get(args[1]);
                if (!checkUser)
                    return message.reply('Không tìm thấy người chơi.');
                const player = new Player(args[1], message.author.username);
                const data = await player.getDataPlayer();
                if (!data) {
                    message.reply('Không tìm thấy người chơi.');
                }
                const time = args[2] * 60 * 60 * 1000 * 24;
                data.info.premium.active = true;
                data.info.premium.time = Date.now() + time;
                await player.setDataPlayer(data);
                message.reply('Thêm thành công.');
                const embed = new MessageEmbed()
                    .setTitle(`${client.emoji.premium} Thông báo`)
                    .setDescription(
                        `Bạn đã được nhận premium ${args[2]} ngày. Cảm ơn bạn đã hộ trợ tui mình :>`
                    )
                    .setColor(client.config.colors.default)
                    .setFields([
                        { name: "Ngày bắt đầu", value: moment(Date.now()).format('LLLL') },
                        { name: 'Ngày hết hạn', value: moment(data.info.premium.time).format('LL') },
                    ])
                    .setTimestamp();
                client.users.cache.get(args[1]).send({embeds : [embed]});
            } else if (type === 'remove') {
                const checkUser = client.users.cache.get(args[1]);
                if (!checkUser)
                    return message.reply('Không tìm thấy người chơi.');
                const player = new Player(args[1], message.author.username);
                const data = await player.getPlayer();
                if (!data) {
                    message.reply('Không tìm thấy người chơi.');
                }
                data.info.premium.active = false;
                data.info.premium.time = 0;
                await data.save().catch((err) => console.log(err));
                message.reply('Xóa thành công.');
            } else if (type === 'list') {
                const players = await t
                    .find({})
                    .sort({ 'info.premium.active': -1 });
                let f = [];
                const embed = new MessageEmbed()
                    .setTitle('Top người chơi')
                    .setColor(client.config.colors.default)
                    .setTimestamp();

                for (let i = 0; i < players.length; i++) {
                    if (players[i].info.premium.active === true) {
                        f.push(
                            `${i + 1}. ${players[i].info.name} - ${
                                players[i].info.premium.time
                            }`
                        );
                    }
                    if (f.length === 0) {
                        embed.setDescription('Không có người dùng premium.');
                        return message.channel.send({ embeds: [embed] });
                    }
                    embed.setDescription(f.join('\n'));
                }

                message.channel.send({ embeds: [embed] });
            } else {
                message.reply('Sai cú pháp.');
            }
        }
    }
};
