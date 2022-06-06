const mongoose = require('mongoose');

module.exports = mongoose.model(
    'Player',
    new mongoose.Schema({
        id: { type: Number, required: true },
        info: {
            type: Object,
            default: {
                name: { type: String, default: null },
                level: { type: Number, default: 1 },
            },
        },
        inventory: {
            type: Object,
            default: {
                items: { type: Array, default: [] },
                materials: { type: Array, default: [] },
                money: { type: Number, default: 0 },
            },
        },
        stats: {
            type: Object,
            default: {
                hp: { type: Number, default: 100 },
                mp: { type: Number, default: 100 },
                atk: { type: Number, default: 10 },
                def: { type: Number, default: 10 },
                matk: { type: Number, default: 10 },
                mdef: { type: Number, default: 10 },
            },
        },
        daily: {
            type: Object,
            default: {
                time: { type: Number, default: null },
                count: { type: Number, default: 0 },
            },
        },
        zoo: {
            pet: { type: Array, default: [] },
        },
        history: {
            log: { type: Array, default: [] }
        }
    })
);
