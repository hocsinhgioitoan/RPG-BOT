const mongoose = require('mongoose');
const c = file("./config.js");
module.exports = mongoose.model(
    'Guild',
    new mongoose.Schema({
        id: { type: Number, required: true },
        info: {
            type: Object,
            default: {
                prefix: { type: String, default: `${c.defaultPrefix}` },
            },
        },
    })
);
