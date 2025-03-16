// controllers/ratingController.js
const Rating = require('../models/rating_model');

exports.getRatingsByMenuItem = async (req, res) => {
  try {
    const ratings = await Rating.find({ menuItem: req.params.menuItemId }).populate('user');
    res.status(200).json(ratings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addRating = async (req, res) => {
  const { userId, menuItemId, rating } = req.body;

  try {
    const existingRating = await Rating.findOne({ user: userId, menuItem: menuItemId });

    if (existingRating) {
      existingRating.rating = rating;
      await existingRating.save();
      res.status(200).json(existingRating);
    } else {
      const newRating = new Rating({ user: userId, menuItem: menuItemId, rating });
      await newRating.save();
      res.status(200).json(newRating);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
