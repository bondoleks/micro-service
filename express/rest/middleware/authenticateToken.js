const jwt = require('jsonwebtoken');
const config = require('../config');

function authenticateToken(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res
            .status(401)
            .json({ message: 'Unauthorized - Token not provided' });
    }

    jwt.verify(token, config.secretKey, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        req.user = decoded;
        next();
    });
}

module.exports = authenticateToken;
