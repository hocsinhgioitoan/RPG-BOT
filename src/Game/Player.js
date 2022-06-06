const Game = require('./Game');
const PlayerSchema = require('../mongoose/mongoose.js');
class Player extends Game {
    constructor(PLayerId, PlayerName) {
        super();
        this.playerId = PLayerId;
        this.playerName = PlayerName;
        this.playerStats = {}
    }
    async createData() {
        const create = await PlayerSchema.createPlayer(this.playerId, this.playerName);
        return create;
    }
    async getDataPlayer() {
        return await PlayerSchema.getPlayer(this.playerId);
    }
    async updateDataPlayer(data) {
        return await PlayerSchema.updatePlayer(this.playerId, data);
    }
    async setDataPlayer(data) {
        return await PlayerSchema.setPlayer(this.playerId, data);
    }
    async addItem(item) {
        return await PlayerSchema.addItem(this.playerId, item);
    }
    async addMaterial(material) {
        return await PlayerSchema.addMaterial(this.playerId, material);
    }
    async addMoney(money) {
        return await PlayerSchema.addMoney(this.playerId, money);
    }
    async removeItem(item) {
        return await PlayerSchema.removeItem(this.playerId, item);
    }
    async removeMaterial(material) {
        return await PlayerSchema.removeMaterial(this.playerId, material);
    }
    async removeMoney(money) {
        return await PlayerSchema.removeMoney(this.playerId, money);
    }
    async checkItem(item) {
        return await PlayerSchema.checkItem(this.playerId, item);
    }

}
module.exports = Player;
