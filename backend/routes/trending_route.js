// routes/ratingRoutes.js
const express = require('express');
const router = express.Router();
const trendingController = require('../controllers/trending_controller');

router.get('/', trendingController.getTrending);
router.post('/', trendingController.addToTrending);
router.delete('/:tid', trendingController.deleteFromTrending);
router.delete('/restaurants/:rid', trendingController.deleteByRestaurantId);

module.exports = router;
