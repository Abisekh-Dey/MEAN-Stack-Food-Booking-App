// controllers/trending.controller.js
const Trending = require('../models/trending_model'); 

// Add a restaurant to trending
exports.addToTrending = async (req, res) => {
  try {
    const { restaurant_id, addedBy } = req.body;

    // Prevent duplicate entries
    const exists = await Trending.findOne({ restaurant_id });
    if (exists) {
      return res.status(400).json({ message: 'Restaurant already in trending' });
    }

    const trendingEntry = new Trending({ restaurant_id, addedBy });
    await trendingEntry.save();

    res.status(201).json({ message: 'Restaurant added to trending', trendingEntry });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add to trending', error: err.message });
  }
};

// Delete a restaurant from trending
exports.deleteFromTrending = async (req, res) => {
  try {
    const { tid } = req.params;

    const deletedEntry = await Trending.findByIdAndDelete(tid);
    if (!deletedEntry) {
      return res.status(404).json({ message: 'Trending entry not found' });
    }

    res.status(200).json({ message: 'Removed from trending', deletedEntry });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete from trending', error: err.message });
  }
};

// controllers/trending.controller.js
exports.deleteByRestaurantId = async (req, res) => {
    try {
      const { rid } = req.params;
  
      const deletedEntry = await Trending.findOneAndDelete({restaurant_id: rid });
      if (!deletedEntry) {
        return res.status(404).json({ message: 'Trending entry not found for this restaurant' });
      }
  
      res.status(200).json({ message: 'Trending entry deleted by restaurant ID', deletedEntry });
    } catch (err) {
      res.status(500).json({ message: 'Failed to delete trending entry', error: err.message });
    }
  };
  
// Get all trending restaurants
exports.getTrending = async (req, res) => {
  try {
    const trendingList = await Trending.find().populate({
      path: 'restaurant_id',
      populate: {
        path: 'menu'
      }
    });
    res.status(200).json(trendingList);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get trending data', error: err.message });
  }
};