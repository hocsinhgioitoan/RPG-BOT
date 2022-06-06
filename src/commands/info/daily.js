const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const Player = require('../../Game/Player.js');
module.exports = class DailyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'daily',
            usage: 'daily',
            description: `Nhận daily hằng ngày`,
            type: client.types.INFO,
        });
    }

    async run(client, message, args) {
        const player = new Player(message.author.id, message.author.username);
        const data = await player.getDataPlayer();
        if (data) {
            if (data.daily.time > Date.now()) {
                const timeLeft = client.utils.duration(
                    data.daily.time - Date.now()
                );
                const embed = new MessageEmbed()
                    .setTitle(
                        `${client.emoji.thatbai} | Bạn đã nhận daily hôm nay rồi!`
                    )
                    .setDescription(
                        `- Bạn cần đợi ${client.emoji.alarm} __**${timeLeft}**__ nữa để nhận daily tiếp theo.
                        - Hiện tại bạn có **${data.daily.count}** lần nhận daily hôm nay.`
                    )
                    .setColor(client.config.colors.error)
                    .setTimestamp()
                    .setFooter({
                        text: `Daily càng nhiều thì nhận được số tiền tương ứng với streak!`,
                    });
                    

                message.channel.send({ embeds: [embed] });
            } else {
                let s = data.daily.count + 1
                const money = s * client.config.daily.money;
                const random = client.utils.getRandomInt(
                    money - 50,
                    money + 50
                );
                const embed = new MessageEmbed()
                    .setTitle(
                        `${client.emoji.thanhcong} | Bạn đã nhận daily hôm nay!`
                    )
                    .setDescription(
                        `- Bạn đã nhận được __**${random}**__ ${
                            client.emoji.coin
                        }!
                        - Hiện tại bạn có **${
                            data.daily.count + 1
                        }** lần nhận daily hôm nay.`
                    )
                    .setColor(client.config.colors.default)
                    .setTimestamp()
                    .setFooter({
                        text: `Daily càng nhiều thì nhận được số tiền tương ứng với streak!`,
                    });
                message.channel.send({ embeds: [embed] });
                data.daily.time = Date.now() + client.config.daily.time;
                data.daily.count++;
                data.inventory.money += random;
                await player.setDataPlayer(data);
            }
        }
    }
};
