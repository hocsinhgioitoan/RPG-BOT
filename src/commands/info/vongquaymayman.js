const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const Player = require('../../Game/Player.js');
module.exports = class GhachaCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'vongquaymayman',
            usage: 'vongquaymayman',
            aliases:["vqmm"],

            description: `Mini game`,
            type: client.types.INFO,
        });
    }

    async run(client, message, args) {
        const player = new Player(message.author.id, message.author.username);
        const data = await player.getDataPlayer();
        if (!args[0]) {
            const embed = new MessageEmbed()
                .setTitle('Vòng quay may mắn')
                .setDescription(
                    `
Luật chơi: 
- Sẽ có 1 vùng với 9 ô vuông, trong đó sẽ có 1 ô là ô mũi tên xoay, và sẽ có mặc định có 2 ô là ô đặt hình hình lucky block .
- Nhiệm vụ của bạn là dùng lệnh \` ${client.prefix}vongquaymayman play \` để chơi
- Phần thưởng sẽ là 1 Hộp random tiền (100 -> 200)
- Chúc may mắn heh
                `
                )
                .setColor(client.config.colors.default)
                .setTimestamp();
            message.channel.send({ embeds: [embed] });
        }
        if (args[0] == 'play') {
            message.channel
                .send(`${message.author} đang chơi vòng quay may mắn.`)
                .then(async (msg) => {
                    const circuit = client.utils.getRandomInt(2, 4);
                    let allBlock = `
            
:green_square::green_square::green_square::green_square::green_square:
:green_square:${initToUnicode(8)}${initToUnicode(1)}${initToUnicode(
                        2
                    )}:green_square:
:green_square:${initToUnicode(7)}<arrow>${initToUnicode(3)}:green_square:
:green_square:${initToUnicode(6)}${initToUnicode(5)}${initToUnicode(
                        4
                    )}:green_square:
:green_square::green_square::green_square::green_square::green_square:
            `;
                    let limitBlockhadGift = 2
                    let x = [0]
                    for ( let o = 0; o < limitBlockhadGift; o++) { 
                        let d = rd(x)
                        x.push(d)
                        allBlock = allBlock.replace(`${initToUnicode(d)}`, `${client.emoji.hoicham}`)
                    }
                    function rd(x) {
                        return client.utils.getRandomInt(1, 8, x)
                    }
                    // remove 0 form array
                    x = x.filter(function (item) {
                        return item !== 0;
                    })
                    let g = x
                    for (let t = 0; t < circuit; t++) {
                        let i = t + 1;
                        await sleep(2000);
                        if (i == circuit) {
                            const n = client.utils.getRandomInt(1, 8);
                            const m = client.utils.getRandomInt(1, n);

                            for (let j = 0; j < n; j++) {
                                let k = j + 1;
                                await sleep(1000);
                                if (g.includes(m) === true) {
                                    await msg.edit(
                                        allBlock.replace(
                                            '<arrow>',
                                            arrowToUnicode(m)
                                        )
                                    );
                                    const checkItem = await player.checkItem(1);
                                    if (checkItem) {
                                        data.inventory.items[1].quantity += 1;
                                    } else {
                                        data.inventory.items[1] = {
                                            id: 1,
                                            quantity: 1,
                                        };
                                    }
                                    player.setDataPlayer(data);
                                    return message.channel.send(
                                        'Chúc mừng bạn đã nhận được phần quà Item [Hộp random tiền (100 -> 200)]'
                                    );
                                } else if (k == n) {
                                    await msg.edit(
                                        allBlock.replace(
                                            '<arrow>',
                                            arrowToUnicode(n)
                                        )
                                    );
                                    return message.channel.send(
                                        'Bạn đã thua cuộc, hãy thử lại sau.'
                                    );
                                } else {
                                    await msg.edit(
                                        allBlock.replace(
                                            '<arrow>',
                                            arrowToUnicode(k)
                                        )
                                    );
                                }
                            }
                        } else {
                            await msg.edit(
                                allBlock.replace('<arrow>', arrowToUnicode(i))
                            );
                        }
                    }
                });
        }
    }
};

const e = require('../../Utils/emojis.json').so;
function initToUnicode(number) {
    if (number == 1) {
        return e.mot;
    } else if (number == 2) {
        return e.hai;
    } else if (number == 3) {
        return e.ba;
    } else if (number == 4) {
        return e.bon;
    } else if (number == 5) {
        return e.nam;
    } else if (number == 6) {
        return e.sau;
    } else if (number == 7) {
        return e.bay;
    } else if (number == 8) {
        return e.tam;
    }
}
function arrowToUnicode(number) {
    switch (number) {
        case 1:
            return ':arrow_up:';
        case 2:
            return ':arrow_upper_right:';
        case 3:
            return ':arrow_right:';
        case 4:
            return ':arrow_lower_right:';
        case 5:
            return ':arrow_down:';
        case 6:
            return ':arrow_lower_left:';
        case 7:
            return ':arrow_left:';
        case 8:
            return ':arrow_upper_left:';
    }
}
function alphabetToUnicode(alphabet) {
    return ':regional_indicator_' + alphabet + ':';
}
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
