const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
    order_id: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    payment_amount: { type: Number, required: true},
    payment_method: { type: String, required: true }, // Example: 'Card', 'Cash', 'UPI'
    payment_status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
    transaction_id: { type: String },
    payment_date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
