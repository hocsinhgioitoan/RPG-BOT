const Discord = require('discord.js');
const { allIntents, enabledIntents } = require('./Utils/constant.js');
const logger = require('./Utils/Logger.js');
const { readdir, readdirSync } = require('fs');
const { join, resolve } = require('path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Collection } = require('discord.js');
const AsciiTable = require('ascii-table');

class Client extends Discord.Client {
    constructor(config, options) {
        super({ ...options, intents: enabledIntents });
        this.intents = allIntents;
        this.enabledIntents = enabledIntents;
        this.config = config;
        this.types = {
            INFO: "Info",
            GAME: "Game",
            MISC: "Misc",
            OWNER: "Owner",
        };
        this.logger = require("./Utils/LoggerWebhook.js");
        this.whLogger = require("./Utils/LoggerWebhook.js");
        this.utils = require('./Utils/Utils.js');
        this.logger.info(`Bắt đầu khởi tạo.`);
        this.commands = new Discord.Collection();
        this.aliases = new Discord.Collection();
        this.slashCommands = new Discord.Collection();
        this.db = require("./mongoose/mongoose.js");
        this.prefix = async function (guild) {
            return await this.db.getPrefixGuild(guild);
        }.bind(this);
        this.emoji = require('./Utils/emojis.json');
    }
    loadEvents(path) {
        readdir(path, (err, files) => {
            if (err) this.logger.error(err);
            files = files.filter((f) => f.split('.').pop() === 'js');
            if (files.length === 0)
                return this.logger.warn('Không tìm thấy event nào.');
            this.logger.info(`${files.length} event đã tìm thấy.`);
            files.forEach((f) => {
                const eventName = f.substring(0, f.indexOf('.'));
                const event = require(resolve(__basedir, join(path, f)));
                super.on(eventName, event.bind(null, this));
                delete require.cache[
                    require.resolve(resolve(__basedir, join(path, f)))
                ]; // Clear cache
                this.logger.info(`Đang tải: ${eventName}`);
            });
        });
        return this;
    }
    loadCommands(path) {
        this.logger.info('Loading commands...');
        let table = new AsciiTable('Commands');
        table.setHeading('File', 'Aliases', 'Type', 'Status');

        readdirSync(path)
            .filter((f) => !f.endsWith('.js'))
            .forEach((dir) => {
                const commands = readdirSync(
                    resolve(__basedir, join(path, dir))
                ).filter((file) => file.endsWith('js'));

                commands.forEach((f) => {
                    const Command = require(resolve(
                        __basedir,
                        join(path, dir, f)
                    ));
                    const command = new Command(this); // Instantiate the specific command
                    if (command.name && !command.disabled) {
                        // Map command
                        this.commands.set(command.name, command);

                        // Map command aliases
                        let aliases = '';
                        if (command.aliases) {
                            command.aliases.forEach((alias) => {
                                this.aliases.set(alias, command);
                            });
                            aliases = command.aliases.join(', ');
                        }

                        table.addRow(f, aliases, command.type, 'pass');
                    } else {
                        this.logger.warn(`${f} failed to load`);
                        table.addRow(f, '', '', 'fail');
                    }
                });
            });
        this.logger.info(`\n${table.toString()}`);
        return this;
    }
    /**
     * Registers all slash commands across all the guilds
     * @param id client id
     * @returns {Promise<void>}
     */
    registerAllSlashCommands(id) {
        this.logger.info('Bắt đầu đăng kí slash (/).');
        const data = this.commands.filter(
            (c) => c.slashCommand && c.disabled !== true
        );
        const promises = [];
        this.guilds.cache.forEach((g) => {
            promises.push(this.registerSlashCommands(g, data, id));
        });
        Promise.all(promises)
            .then(() => {
                this.logger.info('Hoàn tất đăng kí (/).');
            })
            .catch((error) => {
                const guild = error.url
                    .toString()
                    .match(/(guilds\/)(\S*)(\/commands)/)[2];
                if (error.code === 50001)
                    return this.logger.error(
                        `Thất bại trong việc đăng kí slash cho : ${guild}. Thiếu quyền.`
                    );
            });
    }

    /**
     * Registes all slash commands in the provided guild
     * @param guild guild to register commands in
     * @param commands array of commands
     * @param id client id
     * @returns {Promise<unknown>}
     */
    registerSlashCommands(guild, commands, id) {
        return new Promise((resolve, reject) => {
            const rest = new REST({ version: '9' }).setToken(this.config.token);
            try {
                const slashCommands = commands.map((c) => {
                    if (c.userPermissions && c.userPermissions.length > 0)
                        c.slashCommand.setDefaultPermission(false);

                    return c.slashCommand.toJSON();
                });

                rest.put(Routes.applicationGuildCommands(id, guild.id), {
                    body: slashCommands,
                });

                guild.commands.fetch().then((registeredCommands) => {
                    let fullPermissions = registeredCommands
                        .filter((c) => c.applicationId === this.application.id)
                        .map((c) => {
                            // if the command is removed, remove it from the guild
                            if (
                                !slashCommands.find((sc) => sc.name === c.name)
                            ) {
                                return rest.delete(
                                    Routes.applicationGuildCommand(
                                        id,
                                        guild.id,
                                        c.id
                                    )
                                );
                            }

                            // Create permissions for the commands
                            return this.constructFullPermissions(
                                commands,
                                c,
                                guild
                            );
                        });

                    Promise.all(fullPermissions).then((permissions) => {
                        permissions = permissions.filter(
                            (p) => p !== undefined && p !== null
                        ); // filter out undefined and null values

                        if (permissions.length) {
                            guild.commands?.permissions.set({
                                fullPermissions: permissions,
                            });
                            console.log(
                                `Đã cập nhật quyền lệnh cho ${guild.name}`
                            );
                        }
                    });
                });

                resolve('Đăng kí slash cho ' + guild.name);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Constructs the full permissions object for a slash command
     * @param allCommands
     * @param slashCommand
     * @param guild
     * @return {{permissions: *, id}|null}
     */
    constructFullPermissions(allCommands, slashCommand, guild) {
        const perms_required = allCommands.find(
            (command) => command.name === slashCommand.name
        ).userPermissions;
        if (!perms_required || perms_required.length === 0) return;

        let matching_roles = guild.roles.cache.filter((r) =>
            r.permissions.has(perms_required)
        );
        if (!matching_roles || matching_roles.length === 0) return null;

        return {
            id: slashCommand.id,
            permissions: matching_roles.last(10).map((r) => {
                return {
                    id: r.id,
                    type: 'ROLE',
                    permission: true,
                };
            }),
        };
    }
    /**
     * Checks if user is the bot owner
     * @param {User} user
     */
    isOwner(user) {
        return this.config.owners.includes(user.id);
    }

    /**
     * Checks if user is a bot manager
     * @param user
     * @return {*}
     */
    isManager(user) {
        return this.config.managers.includes(user.id) || this.isOwner(user);
    }
    connectMongo(link, mongoose) {
        return new Promise((resolve, reject) => {
            mongoose.connect(this.config.host ? this.config.connect.mongo.main : this.config.connect.mongo.url, {

                useNewUrlParser: true,
                useUnifiedTopology: true
            }).then(() => {
                this.logger.info('Đã kết nối đến MongoDB')
            }).catch((err) => {
                this.logger.error('Không thể kết nói đến MongoDB.\nError: ' + err)
            });
            mongoose.connection.on('error', (error) => {
                reject(error);
            });
            mongoose.connection.once('open', () => {
                resolve();
            });
        });
    }
    test() {
        this.whLogger.warn('test');
    }
}
module.exports = Client;
