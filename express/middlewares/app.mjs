import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

const app = express();

app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use((req, res) => {
    const data = {
        name: 'Oleg',
        number: '098235999',
    };
    console.log(req.body);
    return res.json(data);
});

app.listen(5000, () => console.log('Start on port 5000'));
