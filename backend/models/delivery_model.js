const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deliverySchema = new Schema({
    order_id: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    delivery_driver_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    delivery_status: { type: String, enum: ['assigned','in-progress','out_for_delivery', 'completed'], default: 'assigned' },
    delivery_date: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Delivery', deliverySchema);
