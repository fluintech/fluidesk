const TelegramBot = require('node-telegram-bot-api');
const token = '8256271043:AAE0n3DGVKAa4RP6Nc-nHRUYDsdJvVB2iGc';
const bot = new TelegramBot(token);

const chatId = '1649625201'; // ID do chat\n
bot.sendMessage(chatId, 'Bot configurado e funcionando!');