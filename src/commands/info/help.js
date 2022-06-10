const Command = require('../Command.js');
const ButtonMenu = file('./src/commands/Button.js');

const {
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    MessageSelectMenu,
    Modal,
    TextInputComponent,
} = require('discord.js');
var mongoose = require('mongoose');
require('../../../index');
module.exports = class PingCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'help',
            usage: 'help [command]',
            description: `Xem thông tin của lệnh.`,
            type: client.types.INFO,
        });
    }

    async run(client, message, args) {
        const type = client.types;
        let allType = [];
        Object.keys(type).forEach((key) => {
            if (
                type[key] === client.types.OWNER &&
                !client.isOwner(message.author)
            )
                return;
            allType.push(type[key]);
        });
        let g = [];
        const menu = new MessageSelectMenu()
            .setPlaceholder('Chọn loại lệnh')
            .setCustomId('help_');
        Object.keys(type).forEach((key) => {
            if (
                type[key] === client.types.OWNER &&
                !client.isOwner(message.author)
            )
                return;

            const options = {
                label: `${type[key]}`,
                value: `ophelpmenu_${type[key]}`,
                description: `Xem thông tin của lệnh ${type[key]}.`,
            };
            g.push(options);
        });
        menu.addOptions(g);
        const button = new MessageButton()
            .setLabel('Xem thông tin của lệnh')
            .setStyle('PRIMARY')
            .setCustomId('submitButton');
        const row = new MessageActionRow().addComponents([button]);
        const row2 = new MessageActionRow().addComponents([menu]);
        const embed = new MessageEmbed()
            .setColor(client.config.colors.default)
            .setTitle('Danh sách các lệnh')
            .setDescription(`${allType.map((t) => `\`${t}\``).join('\n')}`);
        message.channel.send({ embeds: [embed], components: [row2, row] });
    }
};
