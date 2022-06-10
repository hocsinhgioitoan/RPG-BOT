const Client = require('./src/Client');
const config = require('./config.js');
global.__basedir = __dirname;
global.base_dir = __dirname;
global.abs_path = function (path) {
    return base_dir + path;
};
global.include = function (file) {
    return require(abs_path('/' + file));
};
global.file = function (file) {
    return require(abs_path('/' + file));
};

const mongoose = require('mongoose');
const client = new Client(config, {
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    allowedMentions: { parse: ['users', 'roles'], repliedUser: false },
});

client.connectMongo(config.connect.mongo.url, mongoose);
client.loadEvents('./src/events');
client.logger.info(`Đang khởi động`);
client.login(config.host ? config.maintoken : config.token).then(() => {
    client.loadCommands('./src/commands');
    client.logger.info('Đã đăng nhập thành công.');
});
Number.prototype.formatMoney = function (
    decPlaces,
    thouSeparator,
    decSeparator
) {
    var n = this,
        decPlaces = isNaN((decPlaces = Math.abs(decPlaces))) ? 2 : decPlaces,
        decSeparator = decSeparator == undefined ? '.' : decSeparator,
        thouSeparator = thouSeparator == undefined ? ',' : thouSeparator,
        sign = n < 0 ? '-' : '',
        i = parseInt((n = Math.abs(+n || 0).toFixed(decPlaces))) + '',
        j = (j = i.length) > 3 ? j % 3 : 0;
    return (
        sign +
        (j ? i.substr(0, j) + thouSeparator : '') +
        i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thouSeparator) +
        (decPlaces
            ? decSeparator +
              Math.abs(n - i)
                  .toFixed(decPlaces)
                  .slice(2)
            : '')
    );
};
