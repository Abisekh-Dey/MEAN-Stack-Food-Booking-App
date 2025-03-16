// routes/wishlistRoutes.js
const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlist_controller');

router.get('/:userId', wishlistController.getWishlist);
router.post('/', wishlistController.addToWishlist);
router.delete('/:id', wishlistController.removeFromWishlist);
router.delete('/restaurant/:rid', wishlistController.removeFromWishlistByResId);

module.exports = router;
