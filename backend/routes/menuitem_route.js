const express = require('express');
const router = express.Router();
const menuItemController = require('../controllers/menuitem_controller');
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Multer Storage Config
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

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
