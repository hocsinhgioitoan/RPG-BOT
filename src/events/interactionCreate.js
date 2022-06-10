const {
    MessageEmbed,
    Modal,
    TextInputComponent,
    MessageButton,
    MessageActionRow,
    MessageSelectMenu,
} = require('discord.js');
const Player = file('./src/Game/Player');
const ButtonMenu = file('./src/commands/Button.js');
module.exports = async (client, i) => {
    const {
        Pagination
    } = require('pagination.djs');

    const interaction = i;
    if (i.isSelectMenu()) {
        if (i.customId === 'help_') {
            const type = client.types;
            let g;
            const cate = i.values.forEach((key) => {
                g = key.split('_')[1];
            });
            const cmd = client.commands.filter(
                (c) => c.type == type[g.toUpperCase()]
            );
            const f = [];
            cmd.forEach((c) => {
                f.push(`\`${c.name}\``);
            });
            let gw = [];
            const menu = new MessageSelectMenu()
                .setPlaceholder('Chọn loại lệnh')
                .setCustomId('help_');
            Object.keys(type).forEach((key) => {
                if (type[key] === client.types.OWNER && !client.isOwner(i.user))
                    return;

                const options = {
                    label: `${type[key]}`,
                    value: `ophelpmenu_${type[key]}`,
                    description: `Xem thông tin của lệnh ${type[key]}.`,
                };
                gw.push(options);
            });
            menu.addOptions(gw);
            const button = new MessageButton()
                .setLabel('Xem thông tin của lệnh')
                .setStyle('PRIMARY')
                .setCustomId('submitButton');
            const row = new MessageActionRow().addComponents([button]);
            const row2 = new MessageActionRow().addComponents([menu]);
            const embed = new MessageEmbed()
                .setColor(client.config.colors.default)
                .setTitle(`Danh sách các lệnh mục ${type[g.toUpperCase()]}`)
                .setDescription(
                    `
Để xem mô tả cũng như cách dùng của tất cả các lệnh trong 1 mục thì vui lòng sử dụng \`${await client.prefix(
                        i.guild.id
                    )}help cate <tên mục>\`.
${f.join(', ')}`
                )
                .setTimestamp();
            if (f.length === 0) {
                embed.setDescription('Không có lệnh nào trong mục này.');
                return i.update({
                    embeds: [embed],
                    components: [row2, row],
                    ephemeral: true,
                });
            }
            return i.update({
                embeds: [embed],
                ephemeral: true,
                components: [row2, row],
            });
        } else if (i.customId === 'shop_menu') {
            const pagination = new Pagination(i, {
                firstEmoji: '⏮', // First button emoji
                prevEmoji: '◀️', // Previous button emoji
                nextEmoji: '▶️', // Next button emoji
                lastEmoji: '⏭', // Last button emoji
                limit: 10, // number of entries per page
                idle: 30000, // idle time in ms before the pagination closes
                ephemeral: false, // ephemeral reply
                buttonStyle: 'SECONDARY',
                loop: false, // loop through the pages
            });
            let a = [];
            const page = i.values.forEach((key) => {
                const number = key.split('_')[1];
                const m = file('./src/Utils/item.js');
                const page = m.itemPage;
                const map = page[number].map((item, index) => {
                    if (!item || !item.name) {
                        return;
                    }
                    return a.push(
                        `\`\`\ ${index}\`\`| **ID: ${item.id}**. ${
                            item.emoji
                        } ${item.name} - ${item.price.formatMoney(
                            0,
                            ',',
                            '.'
                        )} ${client.emoji.coin}
                        `
                    );
                });
            });
            pagination.buttons = {
                ...pagination.buttons,
                extra: new MessageButton()
                    .setLabel(' ')
                    .setStyle('SUCCESS')
                    .setEmoji('984797070361784330')
                    .setCustomId('menu_home'),
            };
            pagination.setDescriptions(a);
            pagination.render();
        } else if (i.customId === 'inventory_menu') {
            const player = new Player(i.user.id, i.user.username);
            const data = await player.getDataPlayer();
            const inv = data.inventory;
            const menu_home = new MessageButton()
                .setLabel(' ')
                .setEmoji('984797070361784330')
                .setStyle('PRIMARY')
                .setCustomId('menu_home');
            const row = new MessageActionRow().addComponents([menu_home]);
            let f;
            i.values.forEach((key) => {
                if (key == 'inventory_items') {
                    f = 'item';
                } else if (key == 'inventory_materials') {
                    f = 'material';
                }
            });
            console.log('file: interactionCreate.js ~ line 135 ~ f ~ f', f);
            let o = [];
            if (f == 'item') {
                const item = inv.items.map((item, index) => {
                    if (!item) return;
                    const emoji = getEmojiItem(item.id);
                    const itemf = file('./src/Utils/item.js');
                    const itemPage = itemf.itemPage;
                    let v;
                    Object.keys(itemPage).forEach((key) => {
                        const map = itemPage[key].map((itemg, index) => {
                            if (!itemg || !itemg.name) {
                                return;
                            }
                            if (itemg.id == item.id) {
                                v = itemg.name;
                            }
                        });
                        o.push(
                            `\`\`\ ${index}\`\`| **ID: ${item.id}**. ${emoji.emoji} ${v} x ${item.quantity}`
                        );
                    });
                });
                if (o.length == 0) {
                    return i.update({
                        embeds: [
                            new MessageEmbed()
                            .setColor(client.config.colors.default)
                            .setTitle('Thông tin về tài khoản')
                            .setDescription(
                                'Bạn không có item nào trong kho.'
                            )
                            .setTimestamp(),
                        ],
                        components: [row],
                    });
                } else if (o.length > 5) {
                    const pagination = new Pagination(i, {
                        firstEmoji: '⏮', // First button emoji
                        prevEmoji: '◀️', // Previous button emoji
                        nextEmoji: '▶️', // Next button emoji
                        lastEmoji: '⏭', // Last button emoji
                        limit: 5, // number of entries per page
                        idle: 30000, // idle time in ms before the pagination closes
                        ephemeral: false, // ephemeral reply
                        buttonStyle: 'SECONDARY',
                        loop: false, // loop through the pages
                    });
                    pagination.buttons = {
                        ...pagination.buttons,
                        extra: menu_home,
                    };
                    pagination.setDescriptions(o);
                    pagination.render();
                } else {
                    i.update({
                        embeds: [
                            new MessageEmbed()
                            .setColor(client.config.colors.default)
                            .setTitle('Thông tin về tài khoản')
                            .setDescription(`${o.join('\n')}`)
                            .setTimestamp(),
                        ],
                        components: [row],
                    });
                }
            }
        }
    }
    if (i.isButton()) {
        if (i.customId === 'submitButton') {
            const modal = new Modal()
                .setCustomId('myModal')
                .setTitle('Hãy ghi bên dưới lệnh bạn muốn xem');
            const cmdModal = new TextInputComponent()
                .setCustomId('cmdModal')
                .setLabel('Lệnh')
                .setStyle('SHORT');
            const firstActionRow = new MessageActionRow().addComponents(
                cmdModal
            );
            modal.addComponents(firstActionRow);
            i.showModal(modal);
        } else if (i.customId === 'captcha') {
            const rd = client.utils.getRandomInt(1, 100);
            const rd2 = client.utils.getRandomInt(1, 100);
            const sum = rd + rd2;
            const modal = new Modal()
                .setCustomId('captchaModal')
                .setTitle(`Verify tài khoản cả bạn: `);
            const captcha = new TextInputComponent()
                .setCustomId('captcha_' + sum)
                .setLabel(`${rd} + ${rd2} = ?`)
                .setRequired(true)
                .setStyle('SHORT');
            const firstActionRow = new MessageActionRow().addComponents(
                captcha
            );
            modal.addComponents(firstActionRow);
            i.showModal(modal);
        } else if (i.customId === 'info_user_button') {
            const player = new Player(i.user.id, i.user.username);
            const data = await player.getDataPlayer();
            const stats = data.stats;
            const get = checkNumber(stats);
            const embed = new MessageEmbed()
                .setTitle(`Profile ${i.user.username}`)
                .setAuthor({
                    name: `${i.user.username}`,
                    iconURL: i.user.avatarURL,
                })
                .addFields([{
                        name: 'Tên',
                        value: `${data.info.name}`,
                    },
                    {
                        name: 'Level',
                        value: `${data.info.level}`,
                    },
                    {
                        name: 'Stats',
                        value: `${client.emoji.icon.HP} \`${get.hp}\` ${client.emoji.icon.MP} \`${get.mp}\` ${client.emoji.icon.ATK} \`${get.atk}\` \n ${client.emoji.icon.DEF} \`${get.def}\` ${client.emoji.icon.MATK} \`${get.matk}\` ${client.emoji.icon.MDEF} \`${get.mdef}\``,
                    },
                ])
                .setTimestamp()
                .setThumbnail(i.user.displayAvatarURL())
                .setColor(client.config.colors.default);

            i.update({
                embeds: [embed],
            });
        } else if (i.customId === 'shop_button') {
            const m = file('./src/Utils/item.js');
            const page = m.itemPage;
            const a = [];
            let g = [];
            let b;
            let c;
            let button = [];
            Object.keys(page).forEach(async (key, index) => {
                b = page[key];
                b.forEach((item, index) => {
                    if (!item.namePage) return;
                    c = item.namePage;
                });
                g.push({
                    name: c,
                });
                a.push(`\`\`\ ${index + 1}\`\` | ${c}`);
            });
            let iu = [];
            const menu = new MessageSelectMenu()
                .setPlaceholder('Chọn mục')
                .setCustomId('shop_menu');
            g.forEach((item, index) => {
                const options = {
                    label: `${item.name}`,
                    value: `shop_${index + 1}`,
                    description: `Xem sản phẩm của trang ${item.name}.`,
                };
                iu.push(options);
            });
            menu.addOptions(iu);
            const search_button = new MessageButton()
                .setLabel(' ')
                .setStyle('SECONDARY')
                .setCustomId('search_button')
                .setEmoji('984770635194597376');
            const buy_button = new MessageButton()
                .setLabel(' ')
                .setStyle('PRIMARY')
                .setCustomId('buy_button')
                .setEmoji('984761713062739988');
            const row = new MessageActionRow().addComponents([menu]);
            const row2 = new MessageActionRow().addComponents([
                search_button,
                buy_button,
            ]);
            const embed = new MessageEmbed()
                .setColor(client.config.colors.default)
                .setTitle('Danh sách các mục trong shop')
                .setDescription(`${a.join('\n')}`)
                .setTimestamp();
            return i.update({
                embeds: [embed],
                components: [row, row2],
            });
        } else if (i.customId === 'menu_home') {
            client.commands
                .get('menu')
                .run(client, null, null, true, i, i.user.id, i.user.username);
        } else if (i.customId === 'search_button') {
            const modal = new Modal()
                .setCustomId('searchModal')
                .setTitle('Hãy ghi bên dưới item bạn muốn kiếm');
            const cmdModal = new TextInputComponent()
                .setCustomId('searchModal')
                .setLabel('Id vật phẩm')
                .setRequired(true)

                .setStyle('SHORT');
            const firstActionRow = new MessageActionRow().addComponents(
                cmdModal
            );
            modal.addComponents(firstActionRow);
            i.showModal(modal);
        } else if (i.customId === 'buy_button') {
            const modal = new Modal()
                .setCustomId('buyModal')
                .setTitle('Hãy ghi bên dưới item bạn muốn mua');
            const id = new TextInputComponent()
                .setCustomId('buyModal_id')
                .setLabel('Id vật phẩm')
                .setRequired(true)

                .setStyle('SHORT');
            const amount = new TextInputComponent()
                .setCustomId('buyModal_amount')
                .setLabel('Số lượng')
                .setRequired(true)

                .setStyle('SHORT');
            const idRow = new MessageActionRow().addComponents(id);
            const amountRow = new MessageActionRow().addComponents(amount);
            modal.addComponents(idRow, amountRow);
            i.showModal(modal);
        } else if (i.customId === 'code_button_enter') {
            const modal = new Modal()
                .setCustomId('codeModal')
                .setTitle('Hãy nhập bên dưới code để nhận.');
            const code = new TextInputComponent()
                .setCustomId('codeModal_code')
                .setLabel('Mã code')
                .setRequired(true)

                .setStyle('SHORT');
            const codeRow = new MessageActionRow().addComponents(code);
            modal.addComponents(codeRow);
            i.showModal(modal);
        } else if (i.customId === 'code_button') {
            const code_button_enter = new MessageButton()
                .setLabel(' ')
                .setEmoji('984818253249523773')
                .setStyle('PRIMARY')
                .setCustomId('code_button_enter');
            const menu_home = new MessageButton()
                .setLabel(' ')
                .setEmoji('984797070361784330')
                .setStyle('PRIMARY')
                .setCustomId('menu_home');
            const row = new MessageActionRow().addComponents([
                code_button_enter,
                menu_home,
            ]);
            const embed = new MessageEmbed()
                .setTitle('Codes')
                .setDescription(
                    `
Ấn vào button bên dưới để nhập code và nhận thưởng
                `
                )
                .setTimestamp()
                .setColor(client.config.colors.default);
            i.update({
                embeds: [embed],
                components: [row],
            });
        } else if (i.customId === 'inventory_button') {
            const player = new Player(i.user.id, i.user.username);
            const data = await player.getDataPlayer();
            const menu_home = new MessageButton()
                .setLabel(' ')
                .setEmoji('984797070361784330')
                .setStyle('PRIMARY')
                .setCustomId('menu_home');
            const menu = new MessageSelectMenu()
                .setPlaceholder('Chọn mục')
                .setCustomId('inventory_menu')
                .addOptions([{
                        label: 'Items',
                        value: 'inventory_items',
                        description: 'Xem items của bạn.',
                    },
                    {
                        label: 'Nguyên liệu',
                        value: 'inventory_materials',
                        description: 'Xem nguyên liệu của bạn.',
                    },
                ]);
            const row2 = new MessageActionRow().addComponents(menu);
            const row = new MessageActionRow().addComponents([menu_home]);
            const embed = new MessageEmbed()
                .setTitle('Inventory')
                .setDescription(
                    `
Chọn bên dưới để xem item!`
                )
                .setTimestamp()
                .setColor(client.config.colors.default);
            i.update({
                embeds: [embed],
                components: [row2, row],
            });
        }
    }
    if (interaction.isModalSubmit()) {
        if (interaction.customId === 'myModal') {
            // array to string
            const name = i.fields.getTextInputValue('cmdModal');
            const cmd =
                client.commands.find((c) => c.name === name) ||
                client.aliases.find((a) => a.aliases.includes(name));
            if (!cmd) {
                const embed = new MessageEmbed()
                    .setColor(client.config.colors.default)
                    .setTitle('Không tìm thấy lệnh này.')
                    .setTimestamp();
                return interaction.update({
                    embeds: [embed],
                    ephemeral: true,
                });
            }

            const embed = new MessageEmbed()
                .setColor(client.config.colors.default)
                .setTitle(`Thông tin của lệnh ${cmd.name}`)
                .setDescription(
                    `\`${cmd.name}\`
${client.emoji.reply_count} ${cmd.description}
${client.emoji.reply_count} Cách dùng: ${cmd.usage}
${client.emoji.reply_count} Loại: ${cmd.type}
${client.emoji.reply_count} Viết tắt của lệnh: ${
                        cmd.aliases ? cmd.aliases.join(', ') : 'Không có'
                    }
${client.emoji.reply} Ví dụ: ${cmd.example || 'Không có'}`
                )
                .setTimestamp();
            return interaction.update({
                embeds: [embed],
                ephemeral: true,
            });
        } else if (interaction.customId === 'captchaModal') {
            const player = new Player(i.user.id, i.user.username);
            const data = await player.getDataPlayer();
            i.fields.components.forEach((c) => {
                const g = c.components;
                g.forEach(async (c) => {
                    const id = c.customId;
                    const sum = id.split('_')[1];
                    const answer = c.value;
                    if (answer === sum) {
                        data.captcha.active = false;
                        data.captcha.count = 0;
                        await player.setDataPlayer(data);
                        return i.update({
                            content: `${client.emoji.thanhcong}| Bạn đã xác minh thành công. 
-nếu vẫn không được thì tham gia server của bot ở profile của bot, cảm ơn`,
                            ephemeral: true,
                            components: [],
                        });
                    } else {
                        if (data.captcha.count > 5) {
                            return i.update({
                                content: `${client.emoji.thatbai} | Bạn đã xác minh sai quá nhiều lần
- Tham gia server support bot để được hỗ trợ`,
                                ephemeral: true,
                                components: [],
                            });
                        } else {
                            data.captcha.count += 1;
                            await player.setDataPlayer(data);
                            const verify = new MessageButton()
                                .customId('captcha')
                                .setLabel('Xác minh lại')
                                .setStyle('PRIMARY');
                            const row = new MessageActionRow().addComponents([
                                verify,
                            ]);
                            return i.update({
                                content: `${
                                    client.emoji.thatbai
                                } | Bạn đã xác minh sai.
- Bạn còn ${6 - data.captcha.count} lần xác minh
- Hãy thử lại sau`,
                                ephemeral: true,
                                components: [row],
                            });
                        }
                    }
                });
            });
        } else if (interaction.customId === 'searchModal') {
            const id = i.fields.getTextInputValue('searchModal');
            const m = file('./src/Utils/item.js');
            let d;
            const page = m.itemPage;
            Object.keys(page).forEach(async (key, index) => {
                const c = page[key];
                c.forEach(async (item1, index) => {
                    if (item1.id == id) {
                        d = item1;
                    }
                });
            });
            if (d) {
                const embed = new MessageEmbed()
                    .setTitle(`Item: ${d.name}`)
                    .addFields([{
                            name: 'Giá',
                            value: `${d.price} ${client.emoji.coin}`,
                            inline: true,
                        },
                        {
                            name: 'Loại',
                            value: `${d.type}`,
                            inline: true,
                        },
                        {
                            name: 'ID',
                            value: `${d.id}`,
                            inline: true,
                        },
                        {
                            name: 'Mô tả',
                            value: `${d.description}`,
                        },
                    ])
                    .setThumbnail(`${d.image}`)
                    .setTimestamp()
                    .setColor(client.config.colors.default);
                const search_button = new MessageButton()
                    .setLabel(' ')
                    .setStyle('SECONDARY')
                    .setEmoji('984770635194597376')
                    .setCustomId('search_button');
                const shop_button = new MessageButton()
                    .setLabel(' ')
                    .setStyle('PRIMARY')
                    .setEmoji('984761713062739988')
                    .setCustomId('shop_button');
                const menu_home = new MessageButton()
                    .setLabel(' ')
                    .setEmoji('984797070361784330')
                    .setStyle('PRIMARY')
                    .setCustomId('menu_home');
                const buy_button = new MessageButton()
                    .setLabel(' ')
                    .setStyle('PRIMARY')
                    .setEmoji('983313199199825931')
                    .setCustomId('buy_button');
                const row = new MessageActionRow().addComponents([
                    buy_button,
                    search_button,
                    shop_button,
                    menu_home,
                ]);
                return i.update({
                    embeds: [embed],
                    components: [row],
                });
            } else {
                const search_button = new MessageButton()
                    .setLabel(' ')
                    .setStyle('SECONDARY')
                    .setEmoji('984770635194597376')
                    .setCustomId('search_button');
                const shop_button = new MessageButton()
                    .setLabel(' ')
                    .setStyle('PRIMARY')
                    .setEmoji('984761713062739988')
                    .setCustomId('shop_button');
                const menu_home = new MessageButton()
                    .setLabel(' ')
                    .setEmoji('984797070361784330')
                    .setStyle('PRIMARY')
                    .setCustomId('menu_home');
                const row = new MessageActionRow().addComponents([
                    search_button,
                    shop_button,
                    menu_home,
                ]);
                const embed = new MessageEmbed()
                    .setTitle('Không tìm thấy item này.')
                    .setTimestamp();
                return interaction.update({
                    embeds: [embed],
                    components: [row],
                });
            }
        } else if (interaction.customId === 'buyModal') {
            const player = new Player(i.user.id, i.user.username);
            const data = await player.getDataPlayer();
            const id = i.fields.getTextInputValue('buyModal_id');
            const amount = Number(
                i.fields.getTextInputValue('buyModal_amount')
            );
            const search_button = new MessageButton()
                .setLabel(' ')
                .setStyle('SECONDARY')
                .setEmoji('984770635194597376')
                .setCustomId('search_button');
            const shop_button = new MessageButton()
                .setLabel(' ')
                .setStyle('PRIMARY')
                .setEmoji('984761713062739988')
                .setCustomId('shop_button');
            const menu_home = new MessageButton()
                .setLabel(' ')
                .setEmoji('984797070361784330')
                .setStyle('PRIMARY')
                .setCustomId('menu_home');
            const row = new MessageActionRow().addComponents([
                search_button,
                shop_button,
                menu_home,
            ]);
            if (isNumeric(amount) === false) {
                return i.update({
                    content: `${client.emoji.thatbai} | Giá trị nhập vào không hợp lệ.`,
                    ephemeral: true,
                    components: [row],
                });
            }

            const m = file('./src/Utils/item.js');
            let d;
            const page = m.itemPage;
            Object.keys(page).forEach(async (key, index) => {
                const c = page[key];
                c.forEach(async (item1, index) => {
                    if (item1.id == id) {
                        d = item1;
                    }
                });
            });
            if (d) {
                if (data.inventory.money >= d.price * amount) {
                    const embed = new MessageEmbed()
                        .setTitle(
                            `${client.emoji.thanhcong} | Bạn đã mua thành công ${d.name}`
                        )
                        .addFields([{
                                name: 'Giá',
                                value: `${d.price.formatMoney(0, ',', '.')} ${
                                    client.emoji.coin
                                }`,
                                inline: true,
                            },
                            {
                                name: 'Loại',
                                value: `${d.type}`,
                                inline: true,
                            },
                            {
                                name: 'ID',
                                value: `${d.id}`,
                                inline: true,
                            },
                            {
                                name: 'Mô tả',
                                value: `${d.description}`,
                            },
                            {
                                name: 'Số lượng',
                                value: `${amount}`,
                                inline: true,
                            },
                            {
                                name: 'Tổng tiền',
                                value: `${(d.price * amount).formatMoney(
                                    0,
                                    ',',
                                    '.'
                                )} ${client.emoji.coin}`,
                                inline: true,
                            },
                            {
                                name: 'Số dư',
                                value: `${(
                                    data.inventory.money -
                                    d.price * amount
                                ).formatMoney(0, ',', '.')}`,
                                inline: true,
                            },
                        ])
                        .setThumbnail(`${d.image}`)
                        .setTimestamp()
                        .setColor(client.config.colors.default);
                    data.inventory.money -= d.price * amount;
                    const checkItem = await player.checkItem(d.id);
                    if (checkItem) {
                        data.inventory.items[d.id].quantity += amount;
                    } else {
                        data.inventory.items[d.id] = {
                            id: d.id,
                            quantity: amount,
                        };
                    }
                    await player.setDataPlayer(data);
                    i.update({
                        embeds: [embed],
                        components: [row],
                    });
                } else {
                    return i.update({
                        content: `${client.emoji.thatbai} | Bạn không đủ tiền để mua.`,
                        ephemeral: true,
                        components: [row],
                    });
                }
            }
        } else if (interaction.customId === 'codeModal') {
            const player = new Player(i.user.id, i.user.username);
            const data = await player.getDataPlayer();
            const code = i.fields.getTextInputValue('codeModal_code');
            const Schema = file('./src/mongoose/Schema/Code.js');
            const codeData = await Schema.findOne({
                'list.code': code,
            });
            const menu_home = new MessageButton()
                .setLabel(' ')
                .setEmoji('984797070361784330')
                .setStyle('PRIMARY')
                .setCustomId('menu_home');
            const code_button_enter = new MessageButton()
                .setLabel(' ')
                .setEmoji('984818253249523773')
                .setStyle('PRIMARY')
                .setCustomId('code_button_enter');
            const row = new MessageActionRow().addComponents([
                code_button_enter,
                menu_home,
            ]);
            if (!codeData) {
                return i.update({
                    content: `${client.emoji.thatbai} | Mã không tồn tại.`,
                    ephemeral: true,
                    components: [row],
                });
            }
            if (data.code.includes(code))
                return i.update({
                    content: `${client.emoji.thatbai} | Bạn đã sử dụng mã này rồi.`,
                    ephemeral: true,
                    components: [row],
                });
            const award = codeData.list.award;
            if (!codeData.list.item) codeData.list.item = 'none';
            const item = Number(codeData.list.item);

            const amount = Number(codeData.list.amount);

            let y;
            if (award == 'money') {
                data.inventory.money += amount;
                await player.setDataPlayer(data);
                y = `${client.emoji.coin} ${amount}`;
            } else if (award == 'item') {
                const checkItem = await player.checkItem(item);
                if (checkItem) {
                    data.inventory.items[item].quantity += amount;
                } else {
                    data.inventory.items[item] = {
                        id: item,
                        quantity: amount,
                    };
                }
                await player.setDataPlayer(data);
                y = `Bạn đã nhận được vật phẩm, vui lòng kiểm tra inventory.`;
            }
            const embed = new MessageEmbed()
                .setTitle(`${client.emoji.thanhcong}| Nhập code thành công`)
                .setColor(client.config.colors.default)
                .addFields([{
                    name: 'Phần thưởng',
                    value: `${y}`,
                }, ])
                .setTimestamp();
            i.update({
                embeds: [embed],
                components: [row],
            });
            data.code.push(code);
            await player.setDataPlayer(data);
        }
    }
};

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

function isNumeric(value) {
    return /^-?\d+$/.test(value);
}

function getEmojiItem(id) {
    const emoji = file('src/Utils/emojis.json');
    const a = emoji.game.items;
    const b = a.find((item) => item.id == id);
    if (b) {
        return {
            emoji: b.emoji,
            image: b.url,
        };
    } else {
        return {
            emoji: emoji.unknown,
            image: null,
        };
    }
}