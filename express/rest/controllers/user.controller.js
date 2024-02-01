const pool = require('../db');
const logger = require('../middleware/logger');

class UserController {
    async getUserSubscriptions(req, res) {
        try {
            const user = req.user;

            const subscriptionsQueryResult = await pool.query(
                'SELECT * FROM "subscription" WHERE user_id = $1 ORDER BY purchase_time DESC',
                [user.id]
            );

            const subscriptions = subscriptionsQueryResult.rows;

            logger.info('getUserSubscriptions' + user);

            return res.status(200).json({ subscriptions });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    }

    async getUserBuyProducts(req, res) {
        try {
            const user = req.user;

            const productsQueryResult = await pool.query(
                'SELECT * FROM "product" WHERE buyer_user_id = $1 ORDER BY purchase_date DESC',
                [user.id]
            );

            const products = productsQueryResult.rows;

            logger.info('getUserProducts' + user);

            return res.status(200).json({ products });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    }

    async getUserSellProducts(req, res) {
        try {
            const user = req.user;

            const productsQueryResult = await pool.query(
                'SELECT id, creator_user_id, buyer_user_id, subscription_type, product_name, product_description, price, sold, create_date, purchase_date, photo FROM "product" WHERE creator_user_id = $1 AND sold = true ORDER BY purchase_date DESC;',
                [user.id]
            );
            const products = productsQueryResult.rows;

            logger.info('getUserProducts' + user);

            return res.status(200).json({ products });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    }
}

module.exports = new UserController();
