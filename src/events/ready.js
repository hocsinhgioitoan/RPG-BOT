//const t = file("./src/Game/Player.js")
const Player = file('./src/Game/Player.js');
const { MessageEmbed } = require('discord.js');
const Code = file('./src/mongoose/Schema/Code.js');
const t = require('../mongoose/Schema/PlayerSchema.js');
module.exports = async (client) => {
    client.logger.info('[READY] Ready to work!');
    client.user.setActivity(
        `${client.guilds.size} servers | ${client.users.size} user`,
        { type: 'WATCHING' }
    );

    const players = await t.find({}).sort({ 'info.premium.active': -1 });
    check();
    var cron = require('node-cron');
    checkCode();
    cron.schedule('*/60 * * * *', () => {
        check();
        checkCode();
    });
    async function checkCode() {
        const codes = await Code.find({}).sort({ 'list.time': -1 });
        if (codes.length) {
            for (let i = 0; i < codes.length; i++) {
                if (codes[i].list.time == NaN) {
                    await Code.deleteOne({ 'list.code': codes[i].list.code });
                    client.logger.info(
                        `[CODE] Code ${codes[i].list.code} đã hết hạn, đã xóa`
                    );
                } else if (codes[i].list.time < Date.now()) {
                    await Code.deleteOne({ 'list.code': codes[i].list.code });
                    client.logger.info(
                        `[CODE] Code ${codes[i].list.code} đã hết hạn, đã xóa`
                    );
                } else {
                    console.log(
                        `[CODE] Code ${codes[i].list.code} chưa hết hạn`
                    );
                }
            }
        }
    }
    async function check() {
        client.logger.info('[PREMIUM] Check trạng thái premium của user...');
        for (let i = 0; i < players.length; i++) {
            if (players[i].info.premium.active === true) {
                if (players[i].info.premium.time < Date.now()) {
                    const player = new Player(
                        players[i].id,
                        players[i].info.name
                    );
                    const data = await player.getDataPlayer();
                    if (!data) {
                        client.logger.error(
                            `[PREMIUM] Không thể lấy được data. của ${players[i].info.name}`
                        );
                        continue;
                    } else {
                        data.info.premium.active = false;
                        data.info.premium.time = 0;
                        await player.setDataPlayer(data);
                        const embed = new MessageEmbed()
                            .setTitle(`${client.emoji.premium} Thông báo`)
                            .setDescription(
                                `${client.emoji.premium} ${players[i].info.name} bạn đã hết thời gian sử dụng premium, nếu muốn gia hạn thì vui lòng tham gia server hỗ trợ để gia hạn.`
                            )
                            .setColor(client.config.colors.error)
                            .setTimestamp();

                        client.users
                            .fetch(`${players[i].id}`, false)
                            .then((user) => {
                                user.send({ embeds: [embed] });
                            });
                        client.logger.info(
                            `[PREMIUM] ${players[i].info.name} đã hết premium.`
                        );
                        var guild = client.guilds.cache.get(
                            client.config.info.guild
                        );
                        const member = await guild.members.fetch(data.id);
                        if (!member) {
                            return client.logger.error(
                                'User được add premium không ở trong server support của bot.'
                            );
                        }
                        const role = await guild.roles.fetch(
                            client.config.info.role
                        );
                        member.roles.remove(role);
                    }
                } else {
                    client.logger.info(
                        `[PREMIUM] ${players[i].info.name} vẫn còn premium.`
                    );
                }
            }
        }
        client.logger.info('[PREMIUM] Đã hoàn tất check.');
    }
};
