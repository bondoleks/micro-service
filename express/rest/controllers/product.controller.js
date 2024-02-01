const pool = require('../db');
const Product = require('../entity/product');
const Subscription = require('../entity/subscription');
const logger = require('../middleware/logger');

class ProductController {
    async createProduct(req, res) {
        try {
            const user = req.user;

            const activeSubscription = await pool.query(
                'SELECT * FROM "subscription" WHERE user_id = $1 AND expiration_time > NOW() AND available_ads > 0',
                [user.id]
            );

            if (activeSubscription.rows.length === 0) {
                logger.error('User has no active subscription' + user);
                return res
                    .status(401)
                    .json({ message: 'User has no active subscription' });
            }

            const { productName, productDescription, price, subscriptionType } =
                req.body;

            const newProduct = new Product(
                user.id,
                null,
                subscriptionType,
                productName,
                productDescription,
                price,
                false
            );

            await pool.query(
                'UPDATE "subscription" SET available_ads = available_ads - 1 WHERE id = $1',
                [activeSubscription.rows[0].id]
            );

            if (activeSubscription.rows[0].available_ads === 1) {
                await pool.query(
                    'UPDATE "subscription" SET expiration_time = NOW() WHERE id = $1',
                    [activeSubscription.rows[0].id]
                );
            }

            const insertedProduct = await pool.query(
                'INSERT INTO "product" (creator_user_id, subscription_type, product_name, product_description, price, sold, create_date) VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING id, creator_user_id, subscription_type, product_name, product_description, price, create_date',
                [
                    newProduct.creatorUserId,
                    newProduct.subscriptionType,
                    newProduct.productName,
                    newProduct.productDescription,
                    newProduct.price,
                    newProduct.sold,
                ]
            );

            logger.info(
                'Product created successfully' + insertedProduct.rows[0]
            );

            return res.status(201).json({
                message: 'Product created successfully',
                product: insertedProduct.rows[0],
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    }

    async createProductWithPhoto(req, res) {
        try {
            const user = req.user;

            console.log(req.file);

            const activeSubscription = await pool.query(
                'SELECT * FROM "subscription" WHERE user_id = $1 AND expiration_time > NOW() AND available_ads > 0',
                [user.id]
            );

            if (activeSubscription.rows.length === 0) {
                logger.error('User has no active subscription' + user);
                return res
                    .status(401)
                    .json({ message: 'User has no active subscription' });
            }

            const { productName, productDescription, price, subscriptionType } =
                req.body;

            const photoFilename = req.file.filename;

            const newProduct = new Product(
                user.id,
                null,
                subscriptionType,
                productName,
                productDescription,
                price,
                false,
                photoFilename
            );

            await pool.query(
                'UPDATE "subscription" SET available_ads = available_ads - 1 WHERE id = $1',
                [activeSubscription.rows[0].id]
            );

            if (activeSubscription.rows[0].available_ads === 1) {
                await pool.query(
                    'UPDATE "subscription" SET expiration_time = NOW() WHERE id = $1',
                    [activeSubscription.rows[0].id]
                );
            }

            const insertedProduct = await pool.query(
                'INSERT INTO "product" (creator_user_id, subscription_type, product_name, product_description, price, sold, create_date, photo) VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7) RETURNING id, creator_user_id, subscription_type, product_name, product_description, price, create_date, photo',
                [
                    newProduct.creatorUserId,
                    newProduct.subscriptionType,
                    newProduct.productName,
                    newProduct.productDescription,
                    newProduct.price,
                    newProduct.sold,
                    req.file.filename,
                ]
            );

            logger.info(
                'Product created successfully with photo' +
                    insertedProduct.rows[0]
            );

            return res.status(201).json({
                message: 'Product created successfully with photo',
                product: insertedProduct.rows[0],
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    }

    async purchaseProduct(req, res) {
        try {
            const user = req.user;
            const productId = req.query.productId;

            const productQueryResult = await pool.query(
                'SELECT * FROM "product" WHERE id = $1 AND sold = false AND buyer_user_id IS NULL',
                [productId]
            );

            if (productQueryResult.rows.length === 0) {
                logger.error('Product not found' + productId);
                return res.status(404).json({ message: 'Product not found' });
            }

            const product = productQueryResult.rows[0];

            const activeSubscriptionQueryResult = await pool.query(
                'SELECT * FROM "subscription" WHERE user_id = $1 AND expiration_time > NOW() AND available_ads > 0',
                [user.id]
            );

            if (activeSubscriptionQueryResult.rows.length === 0) {
                logger.error('User has no active subscription' + user);
                return res
                    .status(401)
                    .json({ message: 'User has no active subscription' });
            }

            const activeSubscription = activeSubscriptionQueryResult.rows[0];

            if (
                activeSubscription.subscription_type !==
                product.subscription_type
            ) {
                logger.error(
                    'User subscription type does not match the product subscription type' +
                        user
                );
                return res.status(403).json({
                    message:
                        'User subscription type does not match the product subscription type',
                });
            }

            const userBalanceResult = await pool.query(
                'SELECT "balance" FROM "user" WHERE id = $1',
                [user.id]
            );
            const userCreatorBalanceResult = await pool.query(
                'SELECT "balance" FROM "user" WHERE id = $1',
                [product.creator_user_id]
            );

            const userBalance = parseFloat(userBalanceResult.rows[0].balance);
            const userCreatorBalance = parseFloat(
                userCreatorBalanceResult.rows[0].balance
            );

            if (userBalance < product.price) {
                logger.error('Insufficient funds' + user);
                return res.status(400).json({ message: 'Insufficient funds' });
            }

            const newBalance = userBalance - product.price;
            const newCreatorBalance =
                parseFloat(userCreatorBalance) + parseFloat(product.price);

            await pool.query(
                'UPDATE "product" SET buyer_user_id = $1, sold = true, balance_before = $2, balance_after = $3, purchase_date = CURRENT_DATE WHERE id = $4',
                [user.id, userBalance, newBalance, productId]
            );

            await pool.query('UPDATE "user" SET balance = $1 WHERE id = $2', [
                newBalance,
                user.id,
            ]);

            await pool.query('UPDATE "user" SET balance = $1 WHERE id = $2', [
                newCreatorBalance,
                product.creator_user_id,
            ]);

            logger.info('Product purchased successfully' + product);

            return res.status(200).json({
                message: 'Product purchased successfully',
                product: {
                    ...product,
                    buyer_user_id: user.id,
                    sold: true,
                    balance_before: userBalance,
                    balance_after: newBalance,
                },
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    }

    async getProductsBySubscriptionType(req, res) {
        try {
            const user = req.user;

            const activeSubscriptionQueryResult = await pool.query(
                'SELECT * FROM "subscription" WHERE user_id = $1 AND expiration_time > NOW()',
                [user.id]
            );

            if (activeSubscriptionQueryResult.rows.length === 0) {
                logger.error('User has no active subscription' + user);
                return res
                    .status(401)
                    .json({ message: 'User has no active subscription' });
            }

            const activeSubscription = activeSubscriptionQueryResult.rows[0];

            const productsQueryResult = await pool.query(
                'SELECT id, creator_user_id, subscription_type, product_name, product_description, price, create_date, photo FROM "product" WHERE subscription_type = $1 AND sold = false ORDER BY create_date DESC',
                [activeSubscription.subscription_type]
            );

            const products = productsQueryResult.rows;

            logger.info('getProductsBySubscriptionType' + user);

            return res.status(200).json({ products });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    }

    async getProduct(req, res) {
        try {
            const user = req.user;
            const productId = req.query.productId;

            const activeSubscriptionQueryResult = await pool.query(
                'SELECT * FROM "subscription" WHERE user_id = $1 AND expiration_time > NOW()',
                [user.id]
            );

            if (activeSubscriptionQueryResult.rows.length === 0) {
                logger.error('User has no active subscription' + user);
                return res
                    .status(401)
                    .json({ message: 'User has no active subscription' });
            }

            const activeSubscription = activeSubscriptionQueryResult.rows[0];

            const productsQueryResult = await pool.query(
                'SELECT id, creator_user_id, subscription_type, product_name, product_description, price, create_date, photo FROM "product" WHERE id = $1 AND subscription_type = $2 AND sold = false ORDER BY create_date DESC',
                [productId, activeSubscription.subscription_type]
            );

            if (productsQueryResult.rows.length === 0) {
                logger.error(
                    'Product not found or subscription type does not match'
                );
                return res.status(404).json({
                    message:
                        'Product not found or subscription type does not match',
                });
            }

            const product = productsQueryResult.rows[0];

            logger.info('getProduct' + product);

            return res.status(200).json({ product });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    }
}

module.exports = new ProductController();
