const Payment = require('../models/payment_model');
const Order = require('../models/order_model');

// Create Payment
exports.createPayment = async (req, res) => {
    try {
        const newPayment = new Payment(req.body);
        await newPayment.save();
        const orderId = req.body.order_id; // Assuming the payment body includes the order ID
        if (!orderId) {
            return res.status(400).json({ message: 'Order ID is required.' });
        }
        // Update the payment_status in the Payment model
        const paymentId = newPayment._id;
        const updatedPayment = await Payment.findByIdAndUpdate(
            paymentId,
            { payment_status: 'completed' },
            { new: true } // Return the updated document
        );
        if (!updatedPayment) {
            return res.status(404).json({ message: 'Payment not found.' });
        }
        // Update the payment_status in the Oder model
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { order_status: "processing", payment_status: 'completed' },
            { new: true } // Return the updated document
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found.' });
        }
        res.status(201).json({
            payment: newPayment,
            order: updatedOrder,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get All Payments
exports.getPayments = async (req, res) => {
    try {
        const payments = await Payment.find().populate('order_id');
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Payment by ID
exports.getPaymentById = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id).populate('order_id user_id');
        if (!payment) return res.status(404).json({ message: 'Payment not found' });
        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Payment
exports.updatePayment = async (req, res) => {
    try {
        const updatedPayment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPayment) return res.status(404).json({ message: 'Payment not found' });
        res.status(200).json(updatedPayment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete Payment
exports.deletePayment = async (req, res) => {
    try {
        const deletedPayment = await Payment.findByIdAndDelete(req.params.id);
        if (!deletedPayment) return res.status(404).json({ message: 'Payment not found' });
        res.status(200).json({ message: 'Payment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
