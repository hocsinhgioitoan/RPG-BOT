const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const Player = file("./src/Game/Player.js")
const { MessageButton, MessageActionRow } = require('discord.js');
module.exports = class CreateDataCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'createdata',
            usage: 'createdata',
            aliases: ['cd'],
            description: `Tạo data người chơi mới.`,
            type: client.types.GAME,
        });
    }

    async run(client, message, args) {
        const player = new Player(message.author.id, message.author.username);
        const createPlayer = await player.createData();
        if (createPlayer === true) {
            const ruleEmbed = new MessageEmbed()
                .setTitle('Đồng ý trước khi tạo tài khoản')
                .setColor(client.config.colors.default)
                .setTimestamp()
                .setDescription(`Rule coming soon`)
                .setFooter({
                    text: `${client.user.username}`,
                    iconURL: client.user.displayAvatarURL({
                        format: 'png',
                        dynamic: true,
                    }),
                });
            const button = new MessageButton()
                .setLabel('Đồng Ý')
                .setCustomId('accept')
                .setEmoji('✅')
                .setStyle('PRIMARY');
            const row = new MessageActionRow().addComponents([button]);
            const m = await message.channel.send({
                embeds: [ruleEmbed],
                components: [row],
            });
            const filter = (button) => button.user.id === message.author.id;

            const collector = m.createMessageComponentCollector({
                filter,
                componentType: 'BUTTON',
                time: 60000,
                dispose: true,
            });
            collector.on('collect', async (c) => {
                m.delete();
                const id = c.component.customId;
                if (id === 'accept') {
                    const dataPlayer = await player.getDataPlayer();
                    let inv;
                    let mat;
                    const stats = dataPlayer.stats;
                    const get = checkNumber(stats);
                    if (dataPlayer.inventory.items.length === 0) {
                        inv = 'Trống.';
                    } else {
                        inv = dataPlayer.inventory.items
                            .map((item) => `${item.name} x${item.quantity}`)
                            .join('\n');
                    }
                    if (dataPlayer.inventory.materials.length === 0) {
                        mat = 'Trống.';
                    } else {
                        mat = dataPlayer.inventory.materials
                            .map((item) => `${item.name} x${item.quantity}`)
                            .join('\n');
                    }
                    const embed = new MessageEmbed()
                        .setTitle(
                            `${client.emoji.thanhcong} | Tạo data người chơi mới thành công!`
                        )
                        .setDescription(
                            `Bạn đã tạo data người chơi mới với ID: ${message.author.id}`
                        )
                        .addFields([
                            {
                                name: 'Info',
                                value: `- Name: ${dataPlayer.info.name}\n- Level: ${dataPlayer.info.level}`,
                            },
                            {
                                name: 'Inventory',
                                value: `- Money: ${dataPlayer.inventory.money}\n- Materials: ${mat}\n- Items: ${inv}`,
                                inline: true,
                            },
                            {
                                name: 'Stats',
                                value: `${client.emoji.icon.HP} \`${get.hp}\` ${client.emoji.icon.MP} \`${get.mp}\` ${client.emoji.icon.ATK} \`${get.atk}\` \n ${client.emoji.icon.DEF} \`${get.def}\` ${client.emoji.icon.MATK} \`${get.matk}\` ${client.emoji.icon.MDEF} \`${get.mdef}\``,
                                inline: true,
                            },
                        ])
                        .setColor(client.config.colors.default);
                    message.channel.send({ embeds: [embed] });
                }
            });
            collector.on('end', (collected) => {
                if (collected.size === 0) {
                    m.delete()
                    const embed = new MessageEmbed()
                        .setTitle(
                            `${client.emoji.thatbai} | Tạo data người chơi mới thất bại!`
                        )
                        .setDescription(`Bạn đã hủy tạo data người chơi mới.`)
                        .setColor(client.config.colors.default);
                    message.channel.send({ embeds: [embed] });
                }
            });
        } else if (createPlayer === false) {
            const embed = new MessageEmbed()
                .setTitle(
                    `${client.emoji.thatbai} | Tạo data người chơi mới thất bại!`
                )
                .setDescription(
                    `Đã có lỗi trong quá trình tạo data người chơi mới.
                - 1: Bạn đã tạo data người chơi mới rồi.
                - 2: Hệ thống database của bot có lỗi nên không thể tạo data người chơi mới.`
                )
                .setColor(client.config.colors.error);
            message.channel.send({ embeds: [embed] });
        }
    }
};

// function check a array which number have biggest length
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