const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurant_controller');
const multer = require('multer');
const upload = require("../config/multer");

router.post('/', upload.single('image'), restaurantController.createRestaurant);
router.post('/nearest-restaurants', restaurantController.findNearestRestaurants);
router.post('/calculate-distance', restaurantController.calculateDistance);
router.post('/estimate-delivery-time', restaurantController.estimateDeliveryTime);
// router.post('/', restaurantController.createRestaurant);
router.post('/login', restaurantController.login);
router.post("/getRestaurantsByIds", restaurantController.getRestaurantsByIds);
router.post('/:restaurantId/message', restaurantController.sendUserMessage);
router.get('/', restaurantController.getRestaurants);
router.get('/:id', restaurantController.getRestaurantById);
router.put('/:id', restaurantController.updateRestaurant);
router.put('/:id/update-details', restaurantController.updateRestaurantDetails);
router.put('/approved/:id', restaurantController.approveRestaurant);
router.patch("/:id/change-name", restaurantController.changeRestaurantName);
router.patch("/:id/close-restaurant", restaurantController.closeRestaurant);
router.patch("/:id/reopen-restaurant", restaurantController.reOpenRestaurant);
router.patch("/:id/change-password", restaurantController.changeRestaurantPassword);
router.patch("/:id/change-address", restaurantController.changeRestaurantAddress);
// router.patch("/:id/add-images", restaurantController.addImagesToRestaurant);
router.patch("/:id/add-images", upload.single('image'), restaurantController.addImagesToRestaurant);
router.patch("/:id/delete-image", restaurantController.removeRestaurantImage);
router.patch('/:id/increment-image', restaurantController.incrementImageNumber);
router.patch('/:id/reset-image', restaurantController.resetImageNumber);
router.delete('/:id', restaurantController.deleteRestaurant);
router.patch("/closeRestaurant", restaurantController.closeAllRestaurants);


module.exports = router;
// const express = require("express");
// const router = express.Router();
// const restaurantController = require("../controllers/restaurant_controller");
// const upload = require("../config/multer"); // Cloudinary upload middleware

// // Restaurant Routes
// router.post("/", upload.single("image"), restaurantController.createRestaurant);
// router.post("/nearest-restaurants", restaurantController.findNearestRestaurants);
// router.post("/calculate-distance", restaurantController.calculateDistance);
// router.post("/estimate-delivery-time", restaurantController.estimateDeliveryTime);
// router.post("/login", restaurantController.login);
// router.post("/getRestaurantsByIds", restaurantController.getRestaurantsByIds);
// router.get("/", restaurantController.getRestaurants);
// router.get("/:id", restaurantController.getRestaurantById);
// router.put("/:id", restaurantController.updateRestaurant);
// router.put("/:id/update-details", restaurantController.updateRestaurantDetails);
// router.put("/approved/:id", restaurantController.approveRestaurant);
// router.patch("/:id/change-name", restaurantController.changeRestaurantName);
// router.patch("/:id/close-restaurant", restaurantController.closeRestaurant);
// router.patch("/:id/reopen-restaurant", restaurantController.reOpenRestaurant);
// router.patch("/:id/change-password", restaurantController.changeRestaurantPassword);
// router.patch("/:id/change-address", restaurantController.changeRestaurantAddress);
// router.patch("/:id/add-images", upload.single("image"), restaurantController.addImagesToRestaurant);
// router.patch("/:id/delete-image", restaurantController.removeRestaurantImage);
// router.patch("/:id/increment-image", restaurantController.incrementImageNumber);
// router.patch("/:id/reset-image", restaurantController.resetImageNumber);
// router.delete("/:id", restaurantController.deleteRestaurant);
// router.patch("/closeRestaurant", restaurantController.closeAllRestaurants);

// module.exports = router;
