const Router = require('express');
const router = new Router();
const userController = require('../controllers/user.controller');

router.post('/user', userController.createUser);
router.get('/user/:id', userController.getUser);
router.get('/users', userController.getUsers);
router.put('/user', userController.updateUser);
router.delete('/user/:id', userController.deleteUser);

module.exports = router;
