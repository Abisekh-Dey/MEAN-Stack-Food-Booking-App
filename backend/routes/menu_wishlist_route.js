// routes/wishlistRoutes.js
const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/menu_wishlist_controller');

router.get('/:userId', wishlistController.getWishlist);
router.post('/', wishlistController.addToWishlist);
router.delete('/:id', wishlistController.removeFromWishlist);
router.delete('/menu/:mid', wishlistController.removeFromWishlistByMenuId);

module.exports = router;
