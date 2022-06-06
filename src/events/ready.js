module.exports = async (client) => {
    client.logger.info('[READY] Ready to work!');
    client.user.setActivity(`${client.guilds.size} servers | ${client.users.size} user`, { type: 'WATCHING' });
};
