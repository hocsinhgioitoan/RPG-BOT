const mongoose = require('mongoose');

module.exports = mongoose.model(
    'code',
    new mongoose.Schema({
        list: { type: Object, default: {
            code: { type: String, default: null },
            time: { type: Number, default: 0 },
            award: { type: String, default: null },
            amount: { type: Number, default: 0 },
            item: { type: String, default: null },
        } },
    })
);
