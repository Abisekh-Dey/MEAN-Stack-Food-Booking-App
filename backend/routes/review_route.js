// routes/reviewRoutes.js
const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review_controller');

router.get('/:menuItemId', reviewController.getReviewsByMenuItem);
router.post('/', reviewController.addReview);

module.exports = router;
