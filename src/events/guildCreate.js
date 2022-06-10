const Guild = file("./src/mongoose/Schema/Guild.js");
module.exports = (client, guild) => {
    const setData = async () => {
        const data = await Guild.findOne({ id: guild.id });
        if (!data) {
            const newData = new Guild({
                id: guild.id,
                info: {
                    prefix: `${client.config.defaultPrefix}`,
                },
            });
            await newData.save();
        }
    }
    setData();
    client.logger.log(`[GUILD CREATE] ${guild.name}: (${guild.id})`);
}