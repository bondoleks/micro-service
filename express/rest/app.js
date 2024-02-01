const express = require('express');
const authRouter = require('./routes/auth.routes');
const subscriptionRouter = require('./routes/subscription.routes');
const productRouter = require('./routes/product.routes');
const userRouter = require('./routes/user.routes');

const PORT = process.env.PORT || 8080;

const app = express();
app.use(express.json());

app.use('/api', authRouter);
app.use('/api', subscriptionRouter);
app.use('/api', productRouter);
app.use('/api', userRouter);

app.listen(PORT, () => console.log(`Server start on port : ${PORT}`));
