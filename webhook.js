const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000; // Porta que o webhook vai escutar

app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
    console.log('Mensagem recebida:', req.body);
    res.status(200).send('Webhook recebido!'); // Resposta para o servidor que chamou o webhook
});

app.listen(port, () => {
    console.log(`Webhook escutando na porta ${port}`);
});
