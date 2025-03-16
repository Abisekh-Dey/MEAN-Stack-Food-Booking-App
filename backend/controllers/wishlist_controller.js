// controllers/wishlistController.js
const Wishlist = require('../models/wishlist_model');

exports.getWishlist = async (req, res) => {
  const userId = req.params.userId; 
  let wishlist;

  try {
    wishlist = await Wishlist.find({ userId: userId });
  } catch (err) {
    return next(new HttpError('Fetching wishlist failed, please try again later.', 500));
  }

  res.status(200).json({ wishlist });
};

exports.addToWishlist = async (req, res) => {
  const { userId, restaurantId, name, lowestPrice, location, cuisineType, contactNumber, image, openingTime, closingTime, closingDay } = req.body;

  try {
    const existingWishlistItem = await Wishlist.findOne({ userId, restaurantId });

    if (existingWishlistItem) {
      return res.status(400).json({ message: "Restaurant is already in the wishlist." });
    }

    const newWishlistItem = new Wishlist({
      userId,
      restaurantId,
      name,
      lowestPrice,
      location,
      cuisineType,
      contactNumber,
      image,
      openingTime,
      closingTime,
      closingDay
    });

    await newWishlistItem.save();
    res.status(201).json({ message: "Restaurant added to wishlist.", wishlistItem: newWishlistItem });
  } catch (error) {
    res.status(500).json({ message: "Adding restaurant to wishlist failed, please try again." });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const deletedItem = await Wishlist.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: "Restaurant not found in wishlist." });
    }
    res.status(200).json({ message: "Restaurant removed from wishlist.", deletedItem });
  } catch (error) {
    res.status(500).json({ message: "Deleting restaurant from wishlist failed, please try again." });
  }
};


exports.removeFromWishlistByResId = async (req, res) => {
  try {
    const deletedItem = await Wishlist.findOneAndDelete({ restaurantId: req.params.rid });
    if (!deletedItem) {
      return res.status(404).json({ message: "Restaurant not found in wishlist." });
    }
    res.status(200).json({ message: "Restaurant removed from wishlist.", deletedItem });
  } catch (error) {
    res.status(500).json({ message: "Deleting restaurant from wishlist failed, please try again." });
  }
};
