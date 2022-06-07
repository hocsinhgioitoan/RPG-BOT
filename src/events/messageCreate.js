const { MessageEmbed } = require('discord.js');
const { MessageActionRow, MessageButton } = require('discord.js');
const { plugin } = require('mongoose');

module.exports = async (client, message) => {
    if (
        message.channel.type === 'DM' ||
        !message.channel.viewable ||
        message.author.bot
    )
        return;
    const prefix = client.config.defaultPrefix;
    const prefixRegex = new RegExp(
        `^(<@!?${client.user.id}>|${prefix.replace(
            /[.*+?^${}()|[\]\\]/g,
            '\\$&'
        )})\\s*`
    );
    const Player = require('../Game/Player');
    const dataPlayer = await client.db.getPlayer(message.author.id);
    const player = new Player(message.author.id, message.author.username);
    const data = await player.getDataPlayer();
    if (dataPlayer) {
        let messageLength = message.content.length;
        if (messageLength > 15) messageLength = 15;
        console.log(typeof message.content);
        const h = message.content
        const rdxp = client.utils.getRandomInt(messageLength, 30);
        const nextLevel = data.info.level + 1;
        const exNeed = nextLevel * 64 *2;
        const exHave = data.info.xp;
        const exLeft = exNeed - exHave;
        if (exLeft <= 0) {
            let f = data.info.level + 1;
            data.info.level = data.info.level + 1;
            data.info.xp = exLeft + exLeft * -2;
            let content = `${client.emoji.thanhcong} | Bạn đã đạt đến level ${data.info.level}! `
            const levelRewardItem = 5
            if (f % levelRewardItem == 0) {
                const g = f / levelRewardItem;
                content += `\nBạn đã nhận được ${g} [Hộp random tiền (100 -> 200)]! Check in inventory!`
                const checkItem = await player.checkItem(1);
                if (checkItem) {
                    data.inventory.items[1].quantity += g;
                } else {
                    data.inventory.items[1] = {
                        id: 1,
                        quantity: g,
                    };
                }
            }
            message.reply(
                content
            );
            
        } else {
            data.info.xp = data.info.xp + rdxp;
        }
        await player.setDataPlayer(data);
    }
    if (prefixRegex.test(message.content)) {
        const [, match] = message.content.match(prefixRegex);
        const args = message.content.slice(match.length).trim().split(/ +/g);
        const cmd = args.shift().toLowerCase();
        let command = client.commands.get(cmd) || client.aliases.get(cmd); // If command not found, check aliases
        if (command) {
            const blacklist = await client.db.checkBlacklist(message.author.id);
            if (blacklist === true) {
                return message.channel.send(
                    `<@${message.author.id}> Bạn đã bị chặn khỏi sử dụng các lệnh của bot :((. 
Hãy liên hệ với admin để biết thêm chi tiết.
`
                );
            }
            if ((command.name !== 'createdata') === true) {
                if (!dataPlayer) {
                    return message.reply(`${client.emoji.thatbai} | Bạn chưa tạo data người chơi!
            - Vui lòng dùng lệnh bên dưới \`\`\` ${prefix}createdata \`\`\`  để tạo data người chơi.`);
                }
            } else {
            }

            const cooldown = await command.isOnCooldown(message.author.id);
            if (cooldown)
                return message
                    .reply({
                        embeds: [
                            new MessageEmbed().setDescription(
                                `${fail} You are on a cooldown. Try again in **${cooldown}** seconds.`
                            ),
                        ],
                    })
                    .then((msg) => {
                        setTimeout(() => msg.delete(), 3000);
                    });
            const permissionErrors = command.checkPermissionErrors(
                message.member,
                message.channel,
                message.guild
            );

            if (!permissionErrors) return;
            if (permissionErrors instanceof MessageEmbed)
                return message.reply({
                    embeds: [permissionErrors],
                });
            // check nsfw channel
            if (!command.checkNSFW(message.channel))
                return message.reply({
                    embeds: [
                        new MessageEmbed()
                            .setAuthor({
                                name: `${message.author.username}#${message.author.discriminator}`,
                                iconURL: message.author.displayAvatarURL(),
                            })
                            .setDescription(
                                `${nsfw} NSFW Commands can only be run in NSFW channels.`
                            )
                            .setTimestamp()
                            .setColor('RED'),
                    ],
                });

            // Check if command is voice channel only
            if (!command.checkVoiceChannel(message))
                return message.reply({
                    embeds: [
                        new MessageEmbed()
                            .setAuthor({
                                name: `${message.author.username}#${message.author.discriminator}`,
                                iconURL: message.author.displayAvatarURL(),
                            })
                            .setDescription(
                                `${fail} This command can only be run if you are in a voice channel.`
                            )
                            .setTimestamp()
                            .setColor('RED'),
                    ],
                });
            message.command = true; // Add flag for messageUpdate event
            message.channel.sendTyping();
            command.run(client, message, args); // Run command
        } // -44 + (-44 * -2 ) =
    }
};
