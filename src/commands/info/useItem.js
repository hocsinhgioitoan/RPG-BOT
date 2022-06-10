const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const Player = file("./src/Game/Player.js");
module.exports = class UseCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'use',
            usage: 'use <item> <amount>',
            description: `.`,
            type: client.types.GAME,
        });
    }

    async run(client, message, args) {
        const player = new Player(message.author.id, message.author.username);
        const data = await player.getDataPlayer();
        let inv = data.inventory;

        let item = args[0];
        let amount = args[1];
        if (!item) {
            message.channel.send(`
            ${client.emoji.thatbai} | Sai định dạng.
            - Bạn cần nhập tên item và số lượng muốn sử dụng.
            - Sử dụng item: ${await client.prefix(message.guild.id)}use <item> <amount>
            - Lưu ý: <item> phải là tên item, <amount> là số lượng muốn sử dụng.
            `);
            return;
        }
        if (isNumeric(item) === false) {
            message.channel.send(`
            ${client.emoji.thatbai} | Sai định dạng.
            - Bạn đã nhập sai Id của item.
            - Sử dụng item: ${await client.prefix(message.guild.id)}use <item> <amount>
            - Lưu ý: <item> phải là tên item, <amount> là số lượng muốn sử dụng.`);
            return;
        }
        if (!amount) {
            amount = 1;
        }

        if (isNumeric(amount) === false) {
            if (
                amount.toLowerCase() == 'all' ||
                amount.toLowerCase() == 'max'
            ) {
                amount = 200;
            } else {
                message.channel.send(`
            ${client.emoji.thatbai} | Sai định dạng.
            - Bạn đã nhập sai số lượng muốn sử dụng.
            - Sử dụng item: ${await client.prefix(message.guild.id)}use <item> <amount>
            - Lưu ý: <item> phải là tên item, <amount> là số lượng muốn sử dụng.`);

                return;
            }
        }

        let c;
        const itemFind = inv.items.find((itemr) => {
            if (!itemr) return;
            c = itemr.id;
            return c == item;
        });
        if (!itemFind) {
            message.channel.send(`
            ${client.emoji.thatbai} | Không có item này trong inventory.
            - Sử dụng item: ${await client.prefix(message.guild.id)}use <item> <amount>
            - Lưu ý: <item> phải là tên item, <amount> là số lượng muốn sử dụng.`);

            return;
        }

        if (itemFind.quantity < amount) {
            if (amount == 200) {
                if (itemFind.quantity == 0) {
                    message.channel.send(`
                    ${client.emoji.thatbai} | Không đủ số lượng item này trong inventory.
                    - Sử dụng item: ${await client.prefix(message.guild.id)}use <item> <amount>
                    - Lưu ý: <item> phải là tên item, <amount> là số lượng muốn sử dụng.`);
                    return;
                }
                amount = itemFind.quantity;
            } else {
                message.channel.send(`
            ${client.emoji.thatbai} | Không đủ số lượng item này trong inventory.
            - Sử dụng item: ${await client.prefix(message.guild.id)}use <item> <amount>
            - Lưu ý: <item> phải là tên item, <amount> là số lượng muốn sử dụng.`);
                return;
            }
        }
        const itemInfo = require('../../Utils/item.js').itemPage;
        let d;
        Object.keys(itemInfo).forEach((key) => {
            const c = itemInfo[key];
            c.forEach((item) => {
                if (item.id == itemFind.id) {
                    d = item;
                }
            });
        });

        const emoji = getEmojiItem(itemFind.id);
        if (itemFind.id == 1) {
            let a = 0;
            let b = [];
            for (let i = 0; i < amount; i++) {
                const random = client.utils.getRandomInt(100, 200);
                b.push(random);
                a += random;
            }

            let content = `
${client.emoji.thanhcong} | Bạn đã dùng **__${amount}__** ${d.name} ${
                emoji.emoji
            }để đổi **${a.formatMoney(0, ',', '.')}** ${client.emoji.coin}
${client.emoji.coin} | Số tiền lần lược của từng hộp: ${b.join(', ')}
            `;
            if (content.length > 1024) {
                content.substring(0, 1020);
                content = content + '...dài quái :))';
            }
            message.channel.send(content);
            data.inventory.money += a;
            data.inventory.items[itemFind.id].quantity -= amount;
            await player.setDataPlayer(data);
        } else if (itemFind.id == 2) {
            let a = 0;
            let b = [];
            for (let i = 0; i < amount; i++) {
                const random = client.utils.getRandomInt(500, 700);
                b.push(random);
                a += random;
            }
            let content = `
${client.emoji.thanhcong} | Bạn đã dùng **__${amount}__** ${d.name} ${
                emoji.emoji
            }để đổi **${a.formatMoney(0, ',', '.')}** ${client.emoji.coin}
${client.emoji.coin} | Số tiền lần lược của từng hộp: ${b.join(', ')}
            `;
            if (content.length > 1024) {
                content.substring(0, 1020);
                content = content + '...dài quái :))';
            }
            message.channel.send(content);
            data.inventory.money += a;
            data.inventory.items[itemFind.id].quantity -= amount;
            await player.setDataPlayer(data);
        }
    }
};
function getEmojiItem(id) {
    const emoji = require('../../Utils/emojis.json');
    const a = emoji.game.items;
    const b = a.find((item) => item.id == id);
    if (b) {
        return {
            emoji: b.emoji,
            image: b.url,
        };
    } else {
        return {
            emoji: emoji.unknown,
            image: null,
        };
    }
}
function isNumeric(value) {
    return /^-?\d+$/.test(value);
}
