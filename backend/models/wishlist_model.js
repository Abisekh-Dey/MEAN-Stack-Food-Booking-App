// models/wishlist.js
const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  userId: { type: String, required: true }, 
  restaurantId: { type: String, required: true }, 
  name: { type: String, required: true }, 
  lowestPrice: { type: String, required: true },
  location: { type: String, required: true }, 
  cuisineType: { type: String, required: true },
  contactNumber: { type: String, required: true }, 
  image: { type: String, required: true }, 
  openingTime: { type: String, required: true }, 
  closingTime: { type: String, required: true }, 
  closingDay: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);
