const mongoose = require('mongoose');
 
module.exports = mongoose.model(
    'Blacklist',
    new mongoose.Schema({
        list: { type: Array, default: [] },
    })
)