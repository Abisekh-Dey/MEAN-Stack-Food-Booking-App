const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); 

const userRoutes = require('./routes/user_route');
const restaurantRoutes = require('./routes/restaurant_route');
const menuItemRoutes = require('./routes/menuitem_route');
const orderRoutes = require('./routes/order_route');
const paymentRoutes = require('./routes/payment_route');
const deliveryRoutes = require('./routes/delivery_route');
const adminRoutes = require('./routes/admin_route');
const cartRoutes = require('./routes/cart_route'); 
const wishlistRoutes = require('./routes/wishlist_route');  
const reviewRoutes = require('./routes/review_route');    
const ratingRoutes = require('./routes/rating_route'); 
const menuwishlistRoutes = require('./routes/menu_wishlist_route');
const trendingRoutes = require('./routes/trending_route');

const app = express();

// Middleware
// app.use(bodyParser.json());
app.use(express.json({ limit: '50mb' })); // Increase JSON payload limit
app.use(express.urlencoded({ limit: '50mb', extended: true })); // Increase URL-encoded payload limit

app.use(cors());
// app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menuitems', menuItemRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes); 
app.use('/api/menu-wishlist', menuwishlistRoutes);   
app.use('/api/reviews', reviewRoutes);    
app.use('/api/ratings', ratingRoutes); 
app.use('/api/trending', trendingRoutes); 

const axios = require("axios"); // Ensure axios is installed

const url = "https://mean-stack-food-booking-app.onrender.com/api/restaurants"; // Replace with your Render backend URL
const interval = 30000; // Ping every 30 seconds

function keepAlive() {
  axios
    .get(url)
    .then(() => console.log("Server pinged successfully"))
    .catch((error) => console.error(`Error: ${error.message}`));
}

setInterval(keepAlive, interval); // Automatically pings every 30 seconds


// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to Database'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start the server
const PORT = process.env.PORT || 5000;
// const HOST = '192.168.108.25'; //For Development When Laptop is connected with mobile Hotspot (ipV4 address 192.168.200.25 : port number of backend 5000) we can see the live changes
  //To get the ipv4 address we have to type ipconfic command in command prompt
// app.listen(PORT, HOST,() => console.log(`Server running on port ${HOST}, ${PORT}`));
app.listen(PORT,() => console.log(`Server running on port, ${PORT}`));
