const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const Player = require('../../Game/Player.js');

module.exports = class CreateDataCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'createdata',
            usage: 'createdata',
            description: `Tạo data người chơi mới.`,
            type: client.types.INFO,
        });
    }

    async run(client, message, args) {
        const player = new Player(message.author.id, message.author.username);
        const createPlayer = await player.createData();
        if (createPlayer === true) {
            const dataPlayer = await player.getDataPlayer();
            let inv;
            let mat;
            if (dataPlayer.inventory.items.length === 0) {
                inv = "Trống.";
            } else {
                inv = dataPlayer.inventory.items.map(item => `${item.name} x${item.quantity}`).join("\n");
            }
            if (dataPlayer.inventory.materials.length === 0) {
                mat = "Trống.";
            } else {
                mat = dataPlayer.inventory.materials.map(item => `${item.name} x${item.quantity}`).join("\n");
            }
            const embed = new MessageEmbed()
                .setTitle(`${client.emoji.thanhcong} | Tạo data người chơi mới thành công!`)
                .setDescription(
                    `Bạn đã tạo data người chơi mới với ID: ${message.author.id}`
                )
                .addFields([
                    { name: 'Info', value: `- Name: ${dataPlayer.info.name}\n- Level: ${dataPlayer.info.level}` },
                    { name: 'Inventory', value: `- Money: ${dataPlayer.inventory.money}\n- Materials: ${mat}\n- Items: ${inv}` },
                    { name: 'Stats', value: `- HP: ${dataPlayer.stats.hp}\n- MP: ${dataPlayer.stats.mp}\n- ATK: ${dataPlayer.stats.atk}\n- DEF: ${dataPlayer.stats.def}\n- MATK: ${dataPlayer.stats.matk}\n- MDEF: ${dataPlayer.stats.mdef}` },
                ])
                .setColor(client.config.colors.default);
            message.channel.send({ embeds: [embed] });
        } else if (createPlayer === false) {
            const embed = new MessageEmbed()
                .setTitle(`${client.emoji.thatbai} | Tạo data người chơi mới thất bại!`)
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
