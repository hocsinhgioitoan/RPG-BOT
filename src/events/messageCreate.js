const { MessageEmbed } = require('discord.js');

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
    if (prefixRegex.test(message.content)) {
        const [, match] = message.content.match(prefixRegex);
        const args = message.content.slice(match.length).trim().split(/ +/g);
        const cmd = args.shift().toLowerCase();
        let command = client.commands.get(cmd) || client.aliases.get(cmd); // If command not found, check aliases
        if (command) {
            const dataPlayer = await client.db.getPlayer(message.author.id);
            if (command.name !== 'createdata') {
                if (!dataPlayer) {
                    return message.reply(`${client.emoji.thatbai} | Bạn chưa tạo data người chơi!
            - Vui lòng dùng lệnh bên dưới \`\`\` ${prefix}createdata \`\`\`  để tạo data người chơi.`);
                }
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
            return command.run(client, message, args); // Run command
        }
    }
};
