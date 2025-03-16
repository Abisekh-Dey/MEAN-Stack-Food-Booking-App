const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_controller');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
