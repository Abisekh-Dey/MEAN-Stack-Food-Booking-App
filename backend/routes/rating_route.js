// routes/ratingRoutes.js
const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/rating_controller');

router.get('/:menuItemId', ratingController.getRatingsByMenuItem);
router.post('/', ratingController.addRating);

module.exports = router;
