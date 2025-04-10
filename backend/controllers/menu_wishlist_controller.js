// controllers/wishlistController.js
const Wishlist = require('../models/menu_wishlist_model');

exports.getWishlist = async (req, res) => {
  const userId = req.params.userId; 
  let wishlist;

  try {
    wishlist = await Wishlist.find({ userId: userId }).populate('menuId');
  } catch (err) {
    return next(new HttpError('Fetching wishlist failed, please try again later.', 500));
  }

  res.status(200).json({ wishlist });
};

exports.addToWishlist = async (req, res) => {
  const { userId, menuId } = req.body;

  try {
    const existingWishlistItem = await Wishlist.findOne({ userId, menuId });

    if (existingWishlistItem) {
      return res.status(400).json({ message: "Menu is already in the wishlist." });
    }

    const newWishlistItem = new Wishlist({
      userId,
      menuId
    });

    await newWishlistItem.save();
    res.status(201).json({ message: "Menu added to wishlist.", wishlistItem: newWishlistItem });
  } catch (error) {
    res.status(500).json({ message: "Adding Menu to wishlist failed, please try again." });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const deletedItem = await Wishlist.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: "Menu not found in wishlist." });
    }
    res.status(200).json({ message: "Menu removed from wishlist.", deletedItem });
  } catch (error) {
    res.status(500).json({ message: "Deleting menu from wishlist failed, please try again." });
  }
};


exports.removeFromWishlistByMenuId = async (req, res) => {
  try {
    const deletedItem = await Wishlist.findOneAndDelete({ menuId: req.params.mid });
    if (!deletedItem) {
      return res.status(404).json({ message: "Menu not found in wishlist." });
    }
    res.status(200).json({ message: "Menu removed from wishlist.", deletedItem });
  } catch (error) {
    res.status(500).json({ message: "Deleting menu from wishlist failed, please try again." });
  }
};
