const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const User = require('../entity/user');
const config = require('../config');
const logger = require('../middleware/logger');

class AuthController {
    async register(req, res) {
        try {
            const {
                username,
                email,
                password,
                firstName,
                lastName,
                phoneNumber,
            } = req.body;

            const existingUser = await pool.query(
                'SELECT * FROM "user" WHERE email = $1',
                [email]
            );
            if (existingUser.rows.length > 0) {
                logger.error('User with this email already exists' + email);
                return res
                    .status(400)
                    .json({ message: 'User with this email already exists' });
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                logger.error('Invalid email format' + email);
                return res
                    .status(400)
                    .json({ message: 'Invalid email format' });
            }

            if (password.length < 8) {
                logger.error('Password must be at least 8 characters long');
                return res.status(400).json({
                    message: 'Password must be at least 8 characters long',
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new User(
                username,
                email,
                hashedPassword,
                firstName,
                lastName,
                phoneNumber
            );

            const insertedUser = await pool.query(
                'INSERT INTO "user" (username, email, password, first_name, last_name, phone_number) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                [
                    newUser.username,
                    newUser.email,
                    newUser.password,
                    newUser.firstName,
                    newUser.lastName,
                    newUser.phoneNumber,
                ]
            );

            const { accessToken, refreshToken } = generateTokens(insertedUser);

            logger.info('User registered ' + email);

            return res.status(201).json({ accessToken, refreshToken });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;

            const userQueryResult = await pool.query(
                'SELECT * FROM "user" WHERE email = $1',
                [email]
            );

            if (
                !userQueryResult.rows.length ||
                !(await bcrypt.compare(
                    password,
                    userQueryResult.rows[0].password
                ))
            ) {
                logger.error('Incorrect email or password');
                return res
                    .status(401)
                    .json({ message: 'Incorrect email or password' });
            }

            const user = userQueryResult.rows[0];

            const { accessToken, refreshToken } = generateTokens(user);

            logger.info('User login' + email);

            return res.status(200).json({ accessToken, refreshToken });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    }

    async refreshTokens(req, res) {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                logger.error('Refresh token not provided');
                return res
                    .status(401)
                    .json({ message: 'Refresh token not provided' });
            }

            jwt.verify(refreshToken, config.secretKey, (err, user) => {
                if (err) {
                    logger.error('Invalid refresh token');
                    return res
                        .status(403)
                        .json({ message: 'Invalid refresh token' });
                }

                const { accessToken, refreshToken } = generateTokens(user);

                logger.info('Refresh token');

                return res.status(200).json({ accessToken, refreshToken });
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    }
}

function generateTokens(user) {
    return {
        accessToken: jwt.sign(
            {
                id: user.id,
                email: user.email,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNumber: user.phoneNumber,
            },
            config.secretKey,
            { expiresIn: '15m' }
        ),
        refreshToken: jwt.sign(
            {
                id: user.id,
                email: user.email,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNumber: user.phoneNumber,
            },
            config.secretKey,
            { expiresIn: '1h' }
        ),
    };
}

module.exports = new AuthController();
