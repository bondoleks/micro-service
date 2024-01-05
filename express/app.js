const express = require('express');

const app = express();

const firstHandler = (req, res, next) => {
    console.log('Successful');
    next();
};
const secondHandler = (req, res) => res.send('Server');

app.get('/', firstHandler, secondHandler);

app.listen(5000, () => console.log('Start on port 5000'));
