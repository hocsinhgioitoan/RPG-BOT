class Enemy {
    constructor(name, lv, stats) {
        this.name = name
        this.lv = lv
        this.stats = stats
    }
    getName() {
        return this.name
    }
    getLv() {
        return this.lv
    }
    attack(target) {
        const hp = this.stats.hp
        const atk = this.stats.atk
        const def = target.stats.def
        const damage = Math.floor(atk - def)
        target.stats.hp -= damage
        return damage
    }
}