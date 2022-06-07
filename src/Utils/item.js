const emoji = require('./emojis.json');
const itemPage = {
    1: [
        { namePage: 'Hộp' },
        renderItem(
            `Hộp random tiền (100 -> 200)`,
            1,
            'box',
            'Khi sử dụng bạn sẽ nhận 1 số tiền random trong khoản 100 đến 200',
            150
        ),
        renderItem(
            `Hộp random tiền (500 -> 700)`,
            2,
            'box',
            'Khi sử dụng bạn sẽ nhận 1 số tiền random trong khoản 500 đến 700',
            600
        ),
    ],
    
}
module.exports = {
    itemPage
}
function renderItem(name, id, type, description, price) {
    const emoji = getEmojiItem(id);
    return {
        name: name,
        id: id,
        type: type,
        description: description,
        price: price,
        emoji: emoji.emoji,
        image: emoji.image,
    };
}
function getEmojiItem(id) {
    const emoji = require('./emojis.json');
    const a = emoji.game.items;
    const b = a.find((item) => item.id == id);
    if (b) {
        return {
            emoji: b.emoji,
            image: b.url,
        };
    } else {
        return {
            emoji: emoji.unknown,
            image: null,
        };
    }
}