const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart_controller');

router.get('/:userId', cartController.getCart);
router.post('/', cartController.addToCart);
router.put('/', cartController.updateCartItem);
router.delete('/:userId', cartController.clearCart);
router.put('/increaseQuantity', cartController.increaseQuantity);
router.put('/decreaseQuantity', cartController.decreaseQuantity);
router.delete('/delete/:id', cartController.deleteCartById);

module.exports = router;
