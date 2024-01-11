import express from 'express';

const app = express();

const logger = (req, res, next) => {
    console.log(req.method, req.path);
    next();
};

// app.use(logger);

app.use(logger, (req, res) => res.send('Server'));

app.listen(5000, () => console.log('Start on port 5000'));
