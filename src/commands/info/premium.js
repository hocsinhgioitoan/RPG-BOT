const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const t = require('../../mongoose/Schema/PlayerSchema.js');
const Player = file("./src/Game/Player.js");
const moment = require('moment');
moment.locale('vi');
module.exports = class LeaderBroadCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'premium',
            usage: 'ping',
            aliases: ['pre'],
            description: `Xem top người chơi.`,
            type: client.types.FUN,
        });
    }

    async run(client, message, args) {
        if (!args[0]) {
            const player = new Player(
                message.author.id,
                message.author.username
            );
            const data = await player.getDataPlayer();
            const embed = new MessageEmbed()
                .setTitle('Quyền lợi của premium')
                .setColor(client.config.colors.default)
                .setDescription(
                    `
${client.emoji.premium} Khi bạn sở hữu premium, bạn sẽ có quyền lợi này ${client.emoji.premium}
- Khi chơi vongquaymayman, vòng quay của bạn sẽ được thêm 1 ô lucky block! (Mặc định là 2)
- Daily sẽ được cộng thêm 20% số tiền đã tính streak
- Nhận role premium ở server support của bot (yêu cầu phải ở trong server từ trước)
- Coming soon...
                    `
                )
                .addFields([
                    {
                        name: 'Trạng thái premium',
                        value: `${
                            data.info.premium.active
                                ? 'Đã kích hoạt'
                                : 'Chưa được kích hoạt'
                        }`,
                    },
                ]);
            message.channel.send({ embeds: [embed] });
        }
        if (client.config.owners.includes(message.author.id)) {
            const type = args[0];
            if (type === 'add') {
                const checkUser = await client.users.cache.get(args[1]);
                var guild = message.client.guilds.cache.get(
                    client.config.info.guild
                );
                if (!checkUser)
                    return message.reply('Không tìm thấy người chơi.');
                const player = new Player(args[1], checkUser.username);
                const data = await player.getDataPlayer();
                if (!data) {
                    message.reply('Không tìm thấy người chơi..');
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
                        {
                            name: 'Ngày bắt đầu',
                            value: moment(Date.now()).format('LLLL'),
                        },
                        {
                            name: 'Ngày hết hạn',
                            value: moment(data.info.premium.time).format('LL'),
                        },
                    ])
                    .setTimestamp();
                client.users.cache.get(args[1]).send({ embeds: [embed] });
                var guild = message.client.guilds.cache.get(
                    client.config.info.guild
                );
                const member = await guild.members.fetch(args[1]);
                if (!member) {
                    return client.logger.error(
                        'User được add premium không ở trong server support của bot.'
                    );
                }
                const role = await guild.roles.fetch(client.config.info.role);
                member.roles.add(role);
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
            }
        }
    }
};
