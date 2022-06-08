const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const Code = require('../../mongoose/Schema/Code.js');
const moment = require('moment');
const PLayer = file("./src/Game/Player.js")
moment.locale('vi');
module.exports = class CodeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'code',
            usage: 'code + <codenam>',
            description: `Nhập code.`,
            type: client.types.INFO,
        });
    }

    async run(client, message, args) {
        if (args[0] == 'nhap') {
            const player = new PLayer(
                message.author.id,
                message.author.username
            );
            const data = await player.getDataPlayer();
            if (!args[0]) return message.channel.send('Thiếu code cần nhập');
            const code = args[1];
            const c = data.code.includes(code);
            if (c) return message.channel.send('Bạn đã nhập code này rồi');
            const codeData = await Code.findOne({ 'list.code': code });
            if (!codeData) return message.channel.send('Code không tồn tại');
            const award = codeData.list.award;
            if (!codeData.list.item) codeData.list.item = 'none';
            const item = Number(codeData.list.item);
            
            const amount = Number(codeData.list.amount);
            
            let y;
            if (award == 'money') {
                data.inventory.money += amount;
                await player.setDataPlayer(data);
                y = `${client.emoji.coin} ${amount}`;
            } else if (award == 'item') {
                const checkItem = await player.checkItem(item);
                if (checkItem) {
                    data.inventory.items[item].quantity += amount;
                } else {
                    data.inventory.items[item] = {
                        id: item,
                        quantity: amount,
                    };
                }
                await player.setDataPlayer(data);
                y = `Bạn đã nhận được vật phẩm, vui lòng kiểm tra inventory.`;
            }

            if (!codeData)
                return message.channel.send('Không tìm thấy code này');
            const embed = new MessageEmbed()
                .setTitle(`${client.emoji.thanhcong}| Nhập code thành công`)
                .setColor(client.config.colors.default)
                .addFields([{ name: 'Phần thưởng', value: `${y}` }])
                .setTimestamp();
            message.channel.send({ embeds: [embed] });
            data.code.push(code);
            await player.setDataPlayer(data);
        }
        if (client.config.owners.includes(message.author.id)) {
            const type = args[0];
            if (type === 'add') {
                const code = args[1];
                const checkCode = await Code.findOne({ 'list.code': code });
                if (!args[1]) {
                    return message.reply('Không tìm thấy mã code.');
                }
                if (!args[2]) {
                    return message.reply('thời gian.');
                }
                const award = args[3];
                const amount = args[4];
                const item = args[5];

                if (checkCode) {
                    console.log("file: codemanager.js ~ line 80 ~ PingCommand ~ run ~ checkCode", checkCode)
                    return message.reply('Mã đã tồn tại.');
                }
                const newCode = new Code({
                    list: {
                        code: code,
                        time: Date.now() + 1000 * 60 * 60 * 24 * args[2],
                        award: award,
                        amount: amount,
                        item: item,
                    },
                });
                newCode.save();
                const embed = new MessageEmbed()
                    .setTitle('Thêm mã thành công')
                    .setColor(client.config.colors.default)
                    .addFields([
                        { name: 'Mã', value: `${code}` },
                        {
                            name: 'Ngày bắt đầu',
                            value: `${moment().format(
                                'DD/MM/YYYY HH:mm:ss'
                            )}`,
                        },
                        {
                            name: 'Ngày hết hạn',
                            value: `${moment(
                               
                            ).add(args[2], 'days').calendar()}`,
                        },
                    ]);

                message.reply({ embeds: [embed] });
            }
        }
    }
};
