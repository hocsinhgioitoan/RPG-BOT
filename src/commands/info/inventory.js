const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const Player = require('../../Game/Player.js');
module.exports = class InventoryCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'inventory',
            usage: 'inventory',
            aliases:["inv"],

            description: `Xem inventory của bạn.`,
            type: client.types.INFO,
        });
    }

    async run(client, message, args) {
        const player = new Player(message.author.id, message.author.username);
        const data = await player.getDataPlayer();
        let inv = data.inventory;
        if (args[0] == 'show') {
            const itemId = args[1];
            if (!itemId) {
                message.channel.send('Sai định dạng');
                return;
            }
            if (Number(itemId) === NaN) {
                message.channel.send('Sai định dạng');
                return;
            }
            let c;
            const item = inv.items.find(item => {
                if (!item) return;
                c = item.id;
                return c == itemId;
            });
            console.log(item)
            if (!item) {
                message.channel.send('Không có item này trong inventory');
                return;
            }
            const emoji = getEmojiItem(item.id);
            const embed = new MessageEmbed()
                .setTitle(`Inventory - ${item.name}`)
                .setDescription(`${emoji.emoji} | ${item.description}`)
                .addFields([
                    {
                        name: 'Số lượng',
                        value: `${item.quantity}`,
                    },
                    {
                        name: 'Giá',
                        value: `${item.price} ${client.emoji.coin}`,
                    },
                ])
                .setTimestamp()
                .setThumbnail(emoji.image)
                .setColor(client.config.colors.default);
            return message.channel.send({ embeds: [embed] });
        }
                
        let item = inv.items;
        let material = inv.materials;
        if (item.length === 0) {
            item = 'Trống.';
        } else {
            item = item
                .map((item) => {
                    if (!item) return
                    const emoji = getEmojiItem(item.id);
                    return `${emoji.emoji} x${item.quantity}`;
                })
                .join('\n');
        }
        if (material.length === 0) {
            material = 'Trống.';
        } else {
            material = material
                .map((item) => `${item.name} x${item.quantity}`)
                .join('\n');
        }
        const embed = new MessageEmbed()
            .setColor(client.config.colors.default)
            .setTitle(`Inventory của ${message.author.username}`)
            .addFields([
                { name: 'Item', value: item, inline: true },
                {
                    name: 'Tiền',
                    value:
                        data.inventory.money.formatMoney(0, ',', '.') +
                        ' ' +
                        client.emoji.coin,
                    inline: true,
                },
                { name: 'Material', value: material, inline: true },
            ])
            .setFooter({ text: `ID: ${message.author.id}` });
        message.channel.send({ embeds: [embed] });
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
