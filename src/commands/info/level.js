const Command = require('../Command.js');
const {MessageEmbed} = require('discord.js');
const Player = file("./src/Game/Player.js");
module.exports = class LevelCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'level',
            usage: 'lv',
            description: `Xem level của bạn`,
            type: client.types.GAME,
        });
    }

    async run(client, message, args) {
        const player = new Player(message.author.id, message.author.username);
        const dataPlayer = await player.getDataPlayer();
        const level = dataPlayer.info.level;

        let xp = dataPlayer.info.xp;
        const xpNext = (level + 1) * 64 *2;
        if (xp >= xpNext) {
            xp = xpNext;
        }
        const c = percentage(xp, xpNext)
        const embed = new MessageEmbed()
            .setColor(client.config.colors.default)
            .setTitle(`Level của ${message.author.username}`)
            .addFields([
                {name: 'Level', value: `${level}`, inline: true},
                {name: 'XP', value: `${xp} / ${xpNext}`, inline: true},
                {name: "Progress", value: `${percentageBar(c)} ${c}%`}
            ])
            .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
            .setTimestamp()
        message.channel.send({embeds: [embed]});
    }
};
function percentageBar(percentage) {
    const small = percentage / 10;
    let bar = '';
    for (let i = 0; i < small; i++) {
        bar += '█';
    }
    for (let i = 0; i < (10 - small); i++) {
        bar += '░';
    }
    return bar;
}
function percentage(current, total) {
    return Math.floor((current / total) * 100);
}

