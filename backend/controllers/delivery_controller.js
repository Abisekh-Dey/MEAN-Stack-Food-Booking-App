const Delivery = require('../models/delivery_model');
const Order = require('../models/order_model');

// Create Delivery (make initial button1)
exports.createDelivery = async (req, res) => {
    try {
        const newDelivery = new Delivery(req.body);
        await newDelivery.save();
        res.status(201).json(newDelivery);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get All Deliveries
//Default Delivery_Partner Page for Admin
exports.getDeliveries = async (req, res) => {
    try {
        const deliveries = await Delivery.find().populate('order_id delivery_driver_id');
        res.status(200).json(deliveries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Delivery by Order ID
//This is for Admin use
exports.getDeliveryByOrderId = async (req, res) => {
    try {
        const delivery = await Delivery.find({"order_id":req.params.id}).populate('order_id delivery_driver_id');
        if (!delivery) return res.status(404).json({ message: 'Order not found' });
        res.status(200).json(delivery);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get Delivery by ID
//This is for Admin interface
exports.getDeliveryById = async (req, res) => {
    try {
        const delivery = await Delivery.findById(req.params.id).populate('order_id delivery_driver_id');
        if (!delivery) return res.status(404).json({ message: 'Delivery not found' });
        res.status(200).json(delivery);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Get Delivery by Partner ID 
//This is for Delivery_Partner interface and Admin interfase 
//(if we find the length of the array then we can find total numbers of order of a partner)
//(we need to store the delivery object into an array in frontend part then to find the length)
exports.getDeliveryByPartnerId = async (req, res) => {
    try {
        const delivery = await Delivery.find({"delivery_driver_id":req.params.id}).populate('order_id delivery_driver_id');
        if (!delivery) return res.status(404).json({ message: 'Delivery not found' });
        res.status(200).json(delivery);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
//update delivery processing (make another button2)
exports.processingDelivery = async (req, res) => {
    try {
        const updatedDelivery = await Delivery.findByIdAndUpdate(req.params.id, { delivery_status: 'in-progress' }, { new: true });
        if (!updatedDelivery) return res.status(404).json({ message: 'Delivery not found' });
        res.status(200).json(updatedDelivery);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
//update delivery out_for_delivery (make another button3)
exports.outforDelivery = async (req, res) => {
    try {
        const updatedDelivery = await Delivery.findByIdAndUpdate(req.params.id, { delivery_status: 'out_for_delivery' }, { new: true });
        if (!updatedDelivery) return res.status(404).json({ message: 'Delivery not found' });
        const orderId = updatedDelivery.order_id;
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { order_status: 'out_for_delivery' },
            { new: true } // Return the updated document
        );
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found.' });
        }
        res.status(200).json(updatedDelivery);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
//update delivery complete (make another button4)
exports.completeDelivery = async (req, res) => {
    try {
        const updatedDelivery = await Delivery.findByIdAndUpdate(req.params.id, { delivery_status: 'completed' }, { new: true });
        if (!updatedDelivery) return res.status(404).json({ message: 'Delivery not found' });

        const orderId = updatedDelivery.order_id;
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { order_status: 'delivered' },
            { new: true } // Return the updated document
        );
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found.' });
        }
        res.status(200).json(updatedDelivery);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update Delivery
exports.updateDelivery = async (req, res) => {
    try {
        const updatedDelivery = await Delivery.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedDelivery) return res.status(404).json({ message: 'Delivery not found' });
        res.status(200).json(updatedDelivery);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete Delivery
exports.deleteDelivery = async (req, res) => {
    try {
        const deletedDelivery = await Delivery.findByIdAndDelete(req.params.id);
        if (!deletedDelivery) return res.status(404).json({ message: 'Delivery not found' });
        res.status(200).json({ message: 'Delivery deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
