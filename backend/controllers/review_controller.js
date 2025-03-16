// controllers/reviewController.js
const Review = require('../models/review_model');

exports.getReviewsByMenuItem = async (req, res) => {
  try {
    const reviews = await Review.find({ menuItem: req.params.menuItemId }).populate('user');
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addReview = async (req, res) => {
  const { userId, menuItemId, rating, comment } = req.body;

  try {
    const review = new Review({ user: userId, menuItem: menuItemId, rating, comment });
    await review.save();
    res.status(200).json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
