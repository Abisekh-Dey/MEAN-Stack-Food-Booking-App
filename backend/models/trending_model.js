// models/rating.js
const mongoose = require('mongoose');

const trendingSchema = new mongoose.Schema({
    restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    addedBy: { type: String, required: true},
}, { timestamps: true });

module.exports = mongoose.model('Trending', trendingSchema);
