const express = require('express');
const router = express.Router();
const menuItemController = require('../controllers/menuitem_controller');
const multer = require("multer");
const upload = require("../config/multer"); // Cloudinary upload middleware

// Routes
router.post("/", upload.single("image"), menuItemController.createMenuItem);
// router.post('/', menuItemController.createMenuItem);
router.get('/', menuItemController.getMenuItems);
router.get('/:name', menuItemController.findRestaurantByCategory)
router.get('/:id', menuItemController.getMenuItemById);
router.put("/:id", upload.single("image"), menuItemController.updateMenuItem);
// router.put('/:id', menuItemController.updateMenuItem);
router.delete('/:id', menuItemController.deleteMenuItem);

module.exports = router;

// const express = require("express");
// const router = express.Router();
// const menuItemController = require("../controllers/menuitem_controller");
// const upload = require("../config/multer"); // Cloudinary upload middleware

// // Menu Item Routes
// router.post("/", upload.single("image"), menuItemController.createMenuItem);
// router.get("/", menuItemController.getMenuItems);
// router.get("/:name", menuItemController.findRestaurantByCategory);
// router.get("/:id", menuItemController.getMenuItemById);
// router.put("/:id", upload.single("image"), menuItemController.updateMenuItem);
// router.delete("/:id", menuItemController.deleteMenuItem);

// module.exports = router;

