const Command = require('../Command.js');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const Player = require('../../Game/Player.js');
const ButtonMenu = require('../Button');
const moment = require('moment');
moment.locale('vi');
module.exports = class PingCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'shop',
            usage: 'shop [page]',
            description: `Xem shop.`,
            type: client.types.INFO,
        });
    }

    async run(client, message, args) {
        const player = new Player(message.author.id, message.author.username);
        const data = await player.getDataPlayer();

        const m = require('../../Utils/item.js');
        const page = m.itemPage;
        if (!args[0]) {
            const a = [];
            let g = [];
            let b;
            let c;
            let button = [];
            Object.keys(page).forEach(async (key, index) => {
                b = page[key];
                b.forEach((item, index) => {
                    if (!item.namePage) return;
                    c = item.namePage;
                });
                g.push({ name: c });
                a.push(`\`\`\ ${index + 1}\`\` | ${c}`);
            });
            g.map((item, index) => {
                const buttonf = new MessageButton()
                    .setLabel(item.name)
                    .setCustomId('shop_' + (index + 1))
                    .setStyle('PRIMARY');
                button.push(buttonf);
            });
            const chunks = 4; //tweak this to add more items per line
            let rows = new Array(Math.ceil(button.length / chunks))
                .fill()
                .map(() => {
                    const row = new MessageActionRow();
                    const buttons = button.splice(0, chunks);
                    buttons.forEach((b) => {
                        row.addComponents(b);
                    });
                    return row;
                });
            const embed = new MessageEmbed()
                .setTitle('Shop')
                .setDescription(
                    `Dưới đây là mục lục của shop, để xem từng trang, sử dụng \`${client.prefix}shop [page]\`.
                    - \`${client.prefix}shop show [item Id]\` để xem chi tiết item
                    - \`${client.prefix}shop buy [item Id] [amount]\` để mua item
                    `
                )
                .addFields([{ name: 'Mục lục', value: `${a.join(`\n`)}` }])
                .setTimestamp()
                .setColor(client.config.colors.default);

            let msg = await message.channel.send({
                embeds: [embed],
                components: rows,
            });
            const filter = (button) => button.user.id === message.author.id;
            const collector = msg.createMessageComponentCollector({
                filter,
                componentType: 'BUTTON',
                time: 60000,
                dispose: true,
            });
            const t_embed = new MessageEmbed()
                .setColor(client.config.colors.default)
                .setTitle(`Shopping`)
                .setFooter({ text: `ID: ${message.author.id}` });
            collector.on('collect', async (c) => {
                const id = c.component.customId.split('_')[1];
                let rr = [];
                const item = page[id];
                if (item.length === 0) {
                    t_embed.setDescription(
                        `Không có item nào trong mục lục này.`
                    );
                    return message.reply({
                        embeds: [t_embed]
                    });
                }
                let max = page[id].length;
                const map = page[id].map((item, index) => {
                    if (!item || !item.name) {
                        return;
                    }
                    return rr.push(
                        `\`\`\ ${index}\`\`| **ID: ${item.id}**. ${
                            item.emoji
                        } ${item.name} - ${item.price.formatMoney(
                            0,
                            ',',
                            '.'
                        )} ${client.emoji.coin}
                        `
                    );
                });
                if (max > 10) {
                    new ButtonMenu(
                        message.client,
                        message,
                        message.member,
                        t_embed,
                        rr,
                        10,

                    ); //tweak this to add more items per line
                } else {
                    t_embed.setDescription(`${rr.join(`\n`)}`);
                    return message.reply({
                        embeds: [t_embed],
                    });
                }
            });
            collector.on('end', (collected, reason) => {
                if (reason === 'time') {
                    t_embed.setDescription(`Bạn đã hết thời gian.`);
                    return message.reply({
                        embeds: [t_embed],
                    });
                }
            })
        }
        if (args[0] == 'show') {
            const item = args[1];
            let d;
            if (!item || isNumeric(item) === false) {
                return message.channel
                    .send(`${client.emoji.thatbai} | Sai định dạng.
                - Bạn đã nhập sai id item, vui lòng kiểm tra lại
                - \`Xem mục lục shop ${client.prefix}shop \`
                - \`${client.prefix}shop show [item Id]\`
                -  Ví dụ: \`${client.prefix}shop show 1\``);
            }
            Object.keys(page).forEach(async (key, index) => {
                const c = page[key];
                c.forEach(async (item1, index) => {
                    if (item1.id == item) {
                        d = item1;
                    }
                });
            });
            if (d) {
                const embed = new MessageEmbed()
                    .setTitle(`Item: ${d.name}`)
                    .addFields([
                        {
                            name: 'Giá',
                            value: `${d.price} ${client.emoji.coin}`,
                            inline: true,
                        },
                        { name: 'Loại', value: `${d.type}`, inline: true },
                        { name: 'ID', value: `${d.id}`, inline: true },
                        { name: 'Mô tả', value: `${d.description}` },
                    ])
                    .setThumbnail(`${d.image}`)
                    .setTimestamp()
                    .setColor(client.config.colors.default);
                return message.channel.send({ embeds: [embed] });
            } else {
                return message.channel.send(`
                ${client.emoji.thatbai} | Không tìm thấy item.
                - Xem mục lục shop \`${client.prefix}shop \`
                - \`${client.prefix}shop show [item Id]\`
                -  Ví dụ: \`${client.prefix}shop show 1\``);
            }
        } else if (args[0] == 'buy') {
            const money = data.inventory.money;
            const item = args[1];
            let quantity = args[2];
            if (!quantity) {
                quantity = 1;
            }
            if (isNumeric(quantity) === false) {
                return message.channel
                    .send(`${client.emoji.thatbai} | Sai định dạng.
                - Bạn đã nhập sai số lượng item, vui lòng kiểm tra lại
                - Xem mục lục shop \`${client.prefix}shop \`
                - \`${client.prefix}shop buy [item Id] [amount]\`
                -  Ví dụ: \`${client.prefix}shop buy 1 1\`
                - Lưu ý : 
                            + \`amount\` phải là số nguyên dương.
                            + \`item Id\` phải là số nguyên dương.
                            + \`amount\` nếu không đề cập thì mặc định là 1
    `);
            }

            if (quantity) quantity = Number(quantity);
            let d;
            if (isNumeric(item) === false) {
                return message.channel
                    .send(`${client.emoji.thatbai} | Sai định dạng.
                - Bạn đã nhập sai id item, vui lòng kiểm tra lại
                - Xem mục lục shop \`${client.prefix}shop \`
                - \`${client.prefix}shop buy [item Id] [amount]\`
                -  Ví dụ: \`${client.prefix}shop buy 1 1\`
                - Lưu ý : 
                            + \`amount\` phải là số nguyên dương.
                            + \`item Id\` phải là số nguyên dương.
                            + \`amount\` nếu không đề cập thì mặc định là 1
    `);
            }
            Object.keys(page).forEach(async (key, index) => {
                const c = page[key];
                c.forEach(async (item1, index) => {
                    if (!item1.id) {
                        return;
                    }
                    if (item1.id == item) {
                        d = item1;
                    }
                });
            });
            if (d) {
                if (money >= d.price * quantity) {
                    const embed = new MessageEmbed()
                        .setTitle(
                            `${client.emoji.thanhcong} | Bạn đã mua thành công ${d.name}`
                        )
                        .addFields([
                            {
                                name: 'Giá',
                                value: `${d.price.formatMoney(0, ',', '.')} ${
                                    client.emoji.coin
                                }`,
                                inline: true,
                            },
                            { name: 'Loại', value: `${d.type}`, inline: true },
                            { name: 'ID', value: `${d.id}`, inline: true },
                            { name: 'Mô tả', value: `${d.description}` },
                            {
                                name: 'Số lượng',
                                value: `${quantity}`,
                                inline: true,
                            },
                            {
                                name: 'Tổng tiền',
                                value: `${(d.price * quantity).formatMoney(
                                    0,
                                    ',',
                                    '.'
                                )} ${client.emoji.coin}`,
                                inline: true,
                            },
                            {
                                name: 'Số dư',
                                value: `${(
                                    money -
                                    d.price * quantity
                                ).formatMoney(0, ',', '.')}`,
                                inline: true,
                            },
                        ])
                        .setThumbnail(`${d.image}`)
                        .setTimestamp()
                        .setColor(client.config.colors.default);
                    message.channel.send({ embeds: [embed] });
                    data.inventory.money -= d.price * quantity;
                    const checkItem = await player.checkItem(d.id);
                    if (checkItem) {
                        data.inventory.items[d.id].quantity += quantity;
                    } else {
                        data.inventory.items[d.id] = {
                            id: d.id,
                            quantity: quantity,
                        };
                    }
                    player.setDataPlayer(data);
                    client.logger.info(
                        `${message.author.tag} đã mua ${d.name} | ${d.id} | ${quantity}`
                    );
                } else {
                    return message.channel.send(
                        `${client.emoji.thatbai} | Bạn không đủ tiền.
- Bạn cần __**${(d.price * quantity - data.inventory.money).formatMoney(
                            0,
                            ',',
                            '.'
                        )}**__ ${client.emoji.coin} nữa để mua ${
                            d.name
                        } x${quantity}
- Hiện tại bạn có __**${data.inventory.money.formatMoney(0, ',', '.')}**__ ${
                            client.emoji.coin
                        }
                        `
                    );
                }
            } else {
                message.channel
                    .send(`${client.emoji.thatbai} | Không tìm thấy item.
                - \`Xem mục lục shop ${client.prefix}shop \`
                - \`${client.prefix}shop buy [item Id] [amount]\`
                -  Ví dụ: \`${client.prefix}shop buy 1 1\`
                - Lưu ý : + \`amount\` phải là số nguyên dương.
                            + \`item Id\` phải là số nguyên dương.
                            + amount nếu không đề cập thì mặc định là 1
                            
                            `);
            }
        } else if (args[0] && page[args[0]]) {
            const embed = new MessageEmbed()
                .setColor(client.config.colors.default)
                .setTitle(`Shopping`)
                .setFooter({ text: `ID: ${message.author.id}` });
            let max = page[args[0]].length;
            let a = [];
            const map = page[args[0]].map((item, index) => {
                if (!item || !item.name) {
                    return;
                }
                return a.push(
                    `\`\`\ ${index}\`\`| **ID: ${item.id}**. ${item.emoji} ${
                        item.name
                    } - ${item.price.formatMoney(0, ',', '.')} ${
                        client.emoji.coin
                    }
                    `
                );
            });
            if (max > 10) {
                new ButtonMenu(
                    message.client,
                    message,
                    message.member,
                    embed,
                    a,
                    10
                );
            } else {
                embed.setDescription(a.join('\n'));
                message.channel.send({ embeds: [embed] });
            }
        } else if (args[0] > Object.keys(page).length ) {
            message.channel.send(`${client.emoji.thatbai} | Sai định dạng.
            - Bạn đã ghi trang không tồn tại
            - Xem mục lục shop \`${client.prefix}shop \`
            - \`${client.prefix}shop buy [item Id] [amount]\`
            -  Ví dụ: \`${client.prefix}shop buy 1 1\`
            - Lưu ý : 
                        + \`amount\` phải là số nguyên dương.
                        + \`item Id\` phải là số nguyên dương.
                        + \`amount\` nếu không đề cập thì mặc định là 1
`);
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
