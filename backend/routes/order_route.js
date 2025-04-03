const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order_controller');

router.post('/', orderController.createOrder);
router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrderById);
router.get('/user/:id', orderController.getOrdersByUserId);
router.put('/:id', orderController.updateOrder);
router.delete('/:id', orderController.deleteOrder);

module.exports = router;
