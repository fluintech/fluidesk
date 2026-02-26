const TelegramBot = require('node-telegram-bot-api');

const token = '8256271043:AAE0n3DGVKAa4RP6Nc-nHRUYDsdJvVB2iGc';
const bot = new TelegramBot(token, {polling: true});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    console.log('Mensagem recebida:', msg);
    // Responda aqui ou adicione lógica de processamento
    bot.sendMessage(chatId, 'Recebi sua mensagem!');
});

console.log('Bot Telegram está escutando...');