import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
    const secretKey = 'jwtappdemo'; // Замініть це на свій секретний ключ

    // Генерація токену, який дійсний протягом 1 хвилини
    const token = jwt.sign({ userId }, secretKey, { expiresIn: '1m' });

    return token;
};

const userId = '6232285273';

// Генерація та виведення токену
const token = generateToken(userId);
console.log(token);
