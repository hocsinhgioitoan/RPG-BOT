const Command = require('../Command.js');
const { MessageEmbed, Permissions } = require('discord.js');
const Guild = file('./src/mongoose/Schema/Guild.js');
module.exports = class PrefixCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'prefix',
            usage: 'prefix',
            description: `Prefix hiện tại của server.`,
            type: client.types.MISC,
        });
    }

    async run(client, message, args) {
        const data = await Guild.findOne({ id: message.guild.id });
        let prefix;
        if (!data) prefix = client.config.defaultPrefix;
        else prefix = data.info.prefix;
        if (!args[0]) {
            const embed = new MessageEmbed()
                .setColor(client.config.colors.default)
                .setTitle('Prefix hiện tại')
                .setTimestamp()
                .setDescription(`Prefix hiện tại của server là: \`${prefix}\`
- Đặt prefix mới: \`${prefix}prefix set <prefix>\`
- Xóa prefix hiện tại: \`${prefix}prefix remove\``);
            message.channel.send({ embeds: [embed] });
        } else if (args[0] === 'set') {
            if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return message.channel.send(`Bạn không có quyền để sử dụng tính năng này.`);
                if (!args[1]) return message.reply('Bạn chưa nhập prefix mới.');
            if (args[1].length > 10)
                return message.reply('Prefix không được dài hơn 10 ký tự.');
            message.reply(
                `Đã thay đổi prefix thành: ${prefix} -> ${args[1]} >.<`
            );
            data.info.prefix = args[1];
            await Guild.findOneAndUpdate({ id: message.guild.id }, data);
        } else if (args[0] === 'reset') {
        }
    }
};
