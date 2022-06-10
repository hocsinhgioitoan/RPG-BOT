const Command = require('../Command.js');
const {
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    TextInputComponent,
    Modal,
} = require('discord.js');
var mongoose = require('mongoose');
require('../../../index');
const Player = file('./src/Game/Player.js');
module.exports = class MenuCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'menu',
            usage: 't',
            description: `Beta.`,
            type: client.types.GAME,
        });
    }

    async run(client, message, args, b, i, u, d) {
        if (!b) b = false;
        const player = new Player(
            b ? u : message.author.id,
            b ? d : message.author.username
        );
        const data = await player.getDataPlayer();
        const menu_embed = new MessageEmbed()
            .setColor(client.config.colors.default)
            .setTitle('Chào mừng bạn đến với menu')
            .setDescription('Bạn có muốn chọn một lựa chọn nào đó không?')
            .setAuthor({
                name: b ? d : message.author.username,
                url: b ? i.user.avatarURL() : message.author.avatarURL(),
            })
            .setTimestamp()
            .setFooter({ text: `Bot đang trong quá trình beta sẽ có lỗi` });
        const info_user_button = new MessageButton()
            .setLabel(' ')
            .setStyle('PRIMARY')
            .setEmoji('983385839323185152')
            .setCustomId('info_user_button');
        const shop_button = new MessageButton()
            .setLabel(' ')
            .setStyle('PRIMARY')
            .setEmoji('984761713062739988')
            .setCustomId('shop_button');
        const null_button_1 = new MessageButton()
            .setLabel(' ')
            .setStyle('SECONDARY')
            .setEmoji('983394775006851103')
            .setDisabled(true)
            .setCustomId('null_button_1');
        const null_button_2 = new MessageButton()
            .setLabel(' ')
            .setStyle('SECONDARY')
            .setEmoji('983394775006851103')
            .setDisabled(true)
            .setCustomId('null_button_2');
        const play_button = new MessageButton()
            .setLabel(' ')
            .setStyle('PRIMARY')
            .setEmoji('984761200095162428')
            .setCustomId('play_button');
        const code_button = new MessageButton()
            .setLabel(' ')
            .setStyle('PRIMARY')
            .setEmoji('984818253249523773')
            .setCustomId('code_button');
        const inventory_button = new MessageButton()
            .setLabel(' ')
            .setStyle('PRIMARY')
            .setEmoji('983313199199825931')
            .setCustomId('inventory_button');
        const row = new MessageActionRow().addComponents([
            code_button,
            info_user_button,
            play_button,
            shop_button,
            inventory_button
        ]);
        if (b) {
            return i.update({ embeds: [menu_embed], components: [row] });
        }
        message.channel.send({ embeds: [menu_embed], components: [row] });
    }
};
