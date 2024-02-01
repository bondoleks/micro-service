const Subscription = require('../entity/subscription');
const pool = require('../db');
const logger = require('../middleware/logger');

class SubscriptionController {
    async getAvailableSubscriptions(req, res) {
        try {
            const subscriptionQueryResult = await pool.query(
                'SELECT * FROM subscription_types'
            );

            logger.info('getAvailableSubscriptions');

            return res.status(200).json([subscriptionQueryResult.rows]);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    }

    async chooseSubscription(req, res) {
        try {
            const user = req.user;
            const { subscriptionType } = req.body;

            const subscriptionQueryResult = await pool.query(
                'SELECT * FROM subscription_types WHERE type = $1',
                [subscriptionType]
            );

            if (subscriptionQueryResult.rows.length === 0) {
                logger.error('Invalid subscription type' + subscriptionType);
                return res
                    .status(400)
                    .json({ message: 'Invalid subscription type' });
            }

            const selectedSubscription = subscriptionQueryResult.rows[0];

            const existingSubscription = await pool.query(
                'SELECT * FROM "subscription" WHERE user_id = $1 AND expiration_time > NOW()',
                [user.id]
            );

            if (existingSubscription.rows.length > 0) {
                logger.error('User already has an active subscription' + user);
                return res.status(400).json({
                    message: 'User already has an active subscription',
                });
            }

            const userBalanceResult = await pool.query(
                'SELECT "balance" FROM "user" WHERE id = $1',
                [user.id]
            );

            const userBalance = parseFloat(userBalanceResult.rows[0].balance);

            if (userBalance < selectedSubscription.price) {
                logger.error('Insufficient funds' + user);
                return res.status(400).json({ message: 'Insufficient funds' });
            }

            const newBalance = userBalance - selectedSubscription.price;

            pool.query('UPDATE "user" SET balance = $1 WHERE id = $2', [
                newBalance,
                user.id,
            ]);

            const expirationTime = new Date();
            expirationTime.setDate(expirationTime.getDate() + 7);

            const newSubscription = new Subscription(
                user.id,
                selectedSubscription.type,
                selectedSubscription.description,
                selectedSubscription.price,
                expirationTime.toISOString(),
                selectedSubscription.available_ads,
                userBalance,
                newBalance
            );

            const insertedSubscription = await pool.query(
                'INSERT INTO "subscription" (user_id, subscription_type, subscription_description, price, expiration_time, available_ads, balance_before, balance_after) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
                [
                    newSubscription.userId,
                    newSubscription.subscriptionType,
                    newSubscription.subscriptionDescription,
                    newSubscription.price,
                    newSubscription.expirationTime,
                    newSubscription.availableAds,
                    newSubscription.balanceBefore,
                    newSubscription.balanceAfter,
                ]
            );

            logger.info(
                'Subscription chosen successfully' + user + insertedSubscription
            );

            return res
                .status(201)
                .json({ message: 'Subscription chosen successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    }
}

module.exports = new SubscriptionController();
