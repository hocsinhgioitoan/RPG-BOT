const logSchema = require('./Schema/Log.js');
const PlayerSchema = require('./Schema/PlayerSchema.js');
const Blacklist = require('./Schema/Blacklist.js');
const Guild = require('./Schema/Guild.js');
module.exports.createLog = async function (message, data) {
    let logDB = new logSchema({
        commandName: data.cmd.name,
        author: {
            username: message.author.username,
            discriminator: message.author.discriminator,
            id: message.author.id,
        },
        guild: {
            name: message.guild ? message.guild.name : 'dm',
            id: message.guild ? message.guild.id : 'dm',
            channel: message.channel ? message.channel.id : 'unknown',
        },
        date: Date.now(),
    });
    await logDB.save().catch((err) => console.log(err));
    return;
};
function randomStats() {
    return {
        hp: 100,
        mp: Math.floor(Math.random() * 50),
        atk: Math.floor(Math.random() * 50),
        def: Math.floor(Math.random() * 50),
        matk: Math.floor(Math.random() * 20),
        mdef: Math.floor(Math.random() * 20),
    };
}
module.exports.createPlayer = async function (PlayerID, PlayerName) {
    const data = await this.getPlayer(PlayerID);
    if (!data) {
        const player = new PlayerSchema({
            id: PlayerID,
            banned: false,
            captcha: {
                active: false,
                count: 0,
            },
            info: {
                name: PlayerName,
                level: 1,
                xp: 0,
                premium: {
                    active: false,
                    time: 0,
                },
            },
            inventory: {
                items: [],
                materials: [],
                money: 0,
            },
            stats: randomStats(),
            daily: {
                time: null,
                count: 0,
            },
            zoo: {
                pet: []
            },
            history: {
                log: []
            }
        });
        await player.save().catch((err) => console.log(err));
        return true;
    } else {
        return false;
    }
};
module.exports.getPlayer = async function (PlayerID) {
    const player = await PlayerSchema.findOne({ id: PlayerID });
    return player;
};
module.exports.setPlayer = async function (PlayerID, data) {
    const player = await PlayerSchema.findOneAndUpdate({ id: PlayerID }, data);
    return player;
};

module.exports.getGuild = async function (GuildID) {
    const guild = await logSchema.findOne({ id: GuildID });
    return guild;
};
module.exports.addItem = async function (PlayerID, item) {
    const player = await PlayerSchema.findOne({ id: PlayerID });
    player.inventory.items.push(item);
    await player.save().catch((err) => console.log(err));
    return;
};
module.exports.addMaterial = async function (PlayerID, material) {
    const player = await PlayerSchema.findOne({ id: PlayerID });
    player.inventory.materials.push(material);
    await player.save().catch((err) => console.log(err));
    return;
};
module.exports.addMoney = async function (PlayerID, money) {
    const player = await PlayerSchema.findOne({ id: PlayerID });
    player.inventory.money += money;
    await player.save().catch((err) => console.log(err));
    return;
};
module.exports.removeItem = async function (PlayerID, item) {
    const player = await PlayerSchema.findOne({ id: PlayerID });
    player.inventory.items = player.inventory.items.filter(
        (i) => i.name !== item.name
    );
    await player.save().catch((err) => console.log(err));
    return;
};
module.exports.removeMaterial = async function (PlayerID, material) {
    const player = await PlayerSchema.findOne({ id: PlayerID });
    player.inventory.materials = player.inventory.materials.filter(
        (i) => i.name !== material.name
    );
    await player.save().catch((err) => console.log(err));
    return;
};
module.exports.removeMoney = async function (PlayerID, money) {
    const player = await PlayerSchema.findOne({ id: PlayerID });
    player.inventory.money -= money;
    await player.save().catch((err) => console.log(err));
    return;
};
module.exports.getPlayerInventory = async function (PlayerID) {
    const player = await PlayerSchema.findOne({ id: PlayerID });
    return player.inventory;
};
module.exports.getPlayerStats = async function (PlayerID) {
    const player = await PlayerSchema.findOne({ id: PlayerID });
    return player.stats;
};
module.exports.checkItem = async function (PlayerID, item) {
    const player = await PlayerSchema.findOne({ id: PlayerID });
    return player.inventory.items.find((i) => {
        if (!i) return false;
        else return i.id === item;
    });
};
module.exports.User = async function () {
    return PlayerSchema.find({}).sort({ inventory: { money: -1 } }).limit(10);
}

module.exports.checkBlacklist = async function (PlayerID) {
    const list = await Blacklist.find({})
    const c = list.includes(PlayerID);
    return c;
}
module.exports.getPrefixGuild = async function (GuildID) {
    const guild = await Guild.findOne({ id: GuildID });
    return guild.info.prefix;
}