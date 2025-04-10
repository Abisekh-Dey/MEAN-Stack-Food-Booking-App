// models/menu-wishlist.js
const mongoose = require('mongoose');

const menu_wishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  menuId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true }, 
}, { timestamps: true });

module.exports = mongoose.model('Menu-Wishlist', menu_wishlistSchema);
