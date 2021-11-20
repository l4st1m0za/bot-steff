const TelegramApi = require('node-telegram-bot-api');

const token = '2141203834:AAFbvttXTfrN8SlPkQxtW5XtgrjRNfxQiwM';

const bot = new TelegramApi(token, {polling: true})

bot.setMyCommands([
    { command: '/start', description: 'Приветствие' },
    { command: '/game', description: 'Начало игры' },
    { command: '/random', description: 'Нажми!'}
]);

const photosOfStef = [
    { path: '/Users/quer1k/Desktop/Stef/stef2.jpg', rightBtn: 'вкусна', wrongBtn: 'хочу на ручки' },
    { path: '/Users/quer1k/Desktop/Stef/madStef.jpg', rightBtn: 'я безумец', wrongBtn: 'мне бы поесть' },
    { path: '/Users/quer1k/Desktop/Stef/stef4.jpg', rightBtn: 'ох уж эти папараци', wrongBtn: 'хочу летать' },
    { path: '/Users/quer1k/Desktop/Stef/ stef6.jpg', rightBtn: 'бежал и уснул', wrongBtn: 'нужно укусить кого-то' },
    { path: '/Users/quer1k/Desktop/Stef/stef7.jpg', rightBtn: 'я вампир!', wrongBtn: 'сейчас бы на море' },
    { path: '/Users/quer1k/Desktop/Stef/stef8.jpg', rightBtn: 'я стесняюсь!', wrongBtn: 'хочу поиграть в гта5' },
    { path: '/Users/quer1k/Desktop/Stef/stef11.jpg', rightBtn: 'когда там уже кушац', wrongBtn: 'нужно к маме' },
    { path: '/Users/quer1k/Desktop/Stef/stef13.jpg', rightBtn: 'атстанти', wrongBtn: 'хочу внимания' },
    { path: '/Users/quer1k/Desktop/Stef/stef14.jpg', rightBtn: 'как же мне хорошоооо', wrongBtn: 'мне скучно' },
    { path: '/Users/quer1k/Desktop/Stef/stef15.jpg', rightBtn: 'когда на взлет?', wrongBtn: 'хочу в машинку' },
];

const gameOptions1 = (item) => {
    return {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: `${item.rightBtn}`, callback_data: 'correct' }, { text: `${item.wrongBtn}`, callback_data: 'incorrect' }],
            ]
        })
    }
}

const gameOptions2 = (item) => {
    return {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: `${item.wrongBtn}`, callback_data: 'incorrect' }, { text: `${item.rightBtn}`, callback_data: 'correct' }],
            ]
        })
    }
}

const againOption = {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: `Начать заново`, callback_data: '/again' }],
            ]
        })
    }

const startGame = async (chatId) => {
    const randomNumber = Math.floor(Math.random() * 10);
    await bot.sendPhoto(chatId, photosOfStef[randomNumber].path)
    return randomNumber % 2 === 0 ? bot.sendMessage(chatId,'Какое же у меня настроение?', gameOptions1(photosOfStef[randomNumber])) : bot.sendMessage(chatId,'Какое же у меня настроение?', gameOptions2(photosOfStef[randomNumber]))
}

const start = () => {
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        if (text === '/start') {
            await bot.sendMessage(chatId, 'Добро пожаловать! Смотри, это Стфан и здесь ты будешь угадывать его настроение!');
            await bot.sendPhoto(chatId, '/Users/quer1k/Desktop/Stef/stef.png')
            await bot.sendMessage(chatId, 'Для начала воспользуйся командой /game');
        }

        if (text === '/game') {
            return startGame(chatId)
        }

        if (text === '/random') {
            const randomNumber = Math.floor(Math.random() * 10);
            await bot.sendPhoto(chatId, photosOfStef[randomNumber].path)
        }
    })

    bot.on('callback_query', async msg => {
        const chatId = msg.message.chat.id;
        const data = msg.data;
        if (data === '/again') {
            return startGame(chatId)
        }
        if (data === 'correct') {
            await bot.sendMessage(chatId, 'Правильно, Вы угадали!', againOption)
        } else {
            await bot.sendMessage(chatId, 'К сожалению Вы проиграли :(', againOption)
        }
    })
}
start()

