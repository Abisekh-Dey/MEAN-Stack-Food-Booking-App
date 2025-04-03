const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    // restaurant_id: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    menu_items: [{
        menu_item_id: { type: Schema.Types.ObjectId, ref: 'MenuItem', required: true },
        quantity: { type: Number, required: true },
    }],
    total_price: { type: Number, required: true },
    order_status: { type: String, enum: ['pending', 'preparing', 'out_for_delivery', 'delivered'], default: 'pending' },
    delivery_address: { type: String, required: true },
    payment_status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
    order_date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
