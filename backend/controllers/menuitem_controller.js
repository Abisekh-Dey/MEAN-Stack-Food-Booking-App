const MenuItem = require('../models/menuitem_model');
const Restaurant = require('../models/restaurant_model');
const fs = require("fs");
const path = require("path");
const cloudinary = require("../config/cloudinary");
const upload = require("../config/multer");


// Create MenuItem
// exports.createMenuItem = async (req, res) => {
//     try {
//         const newMenuItem = new MenuItem(req.body);
//         await newMenuItem.save();
//         await Restaurant.findByIdAndUpdate(newMenuItem.restaurant_id, { $push: { menu: newMenuItem._id }, $inc: { total_menu: 1 } });
//         res.status(201).json(newMenuItem);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };

exports.createMenuItem = async (req, res) => {
    try {
        const { name, description, price, category, restaurant_id } = req.body;

        // let imageUrl = "";
        // if (req.file) {
        //     imageUrl = `/uploads/${req.file.filename}`; // Save only the image path
        // }
        // const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
        //     folder: "menuItems"
        // });
        // imageUrl = uploadedImage.secure_url;

        let imageUrl = req.file ? req.file.path : "";
        

        const newMenuItem = new MenuItem({
            name,
            description,
            price,
            category,
            image: imageUrl,
            restaurant_id
        });

        await newMenuItem.save();
        await Restaurant.findByIdAndUpdate(
            restaurant_id,
            { $push: { menu: newMenuItem._id }, $inc: { total_menu: 1 } }
        );

        res.status(201).json({ message: "Menu item added successfully", menuItem: newMenuItem });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// Get All MenuItems
exports.getMenuItems = async (req, res) => {
    try {
        const menuItems = await MenuItem.find().populate('restaurant_id');
        res.status(200).json(menuItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.findRestaurantByCategory = async (req, res) => {
    try {
        const { name } = req.params; // Get category name from request params
        const regex = new RegExp(name, 'i'); 
        const menuItems = await MenuItem.find({ category: regex });

        if (!menuItems.length) { // Check if array is empty
            return res.status(404).json({ message: 'No matching restaurant found' });
        }

        const restaurantIds = [...new Set(menuItems.map(item => item.restaurant_id.toString()))]; // Get unique restaurant IDs
        
        return res.status(200).json({ restaurantIds });
    } catch (error) {
        console.error('Error finding restaurant:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


// Get MenuItem by ID
exports.getMenuItemById = async (req, res) => {
    try {
        const menuItem = await MenuItem.findById(req.params.id).populate('restaurant_id');
        if (!menuItem) return res.status(404).json({ message: 'MenuItem not found' });
        res.status(200).json(menuItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update MenuItem
// exports.updateMenuItem = async (req, res) => {
//     try {
//         const updatedMenuItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         if (!updatedMenuItem) return res.status(404).json({ message: 'MenuItem not found' });
//         res.status(200).json(updatedMenuItem);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };

// exports.updateMenuItem = async (req, res) => {
//     try {
//         let updateData = { ...req.body };

//         // Check if a new image is uploaded
//         if (req.file) {
//             const newImageUrl = `/uploads/${req.file.filename}`;

//             // Find the existing menu item to delete the old image
//             const existingMenuItem = await MenuItem.findById(req.params.id);
//             if (!existingMenuItem) {
//                 return res.status(404).json({ message: "MenuItem not found" });
//             }

//             // Delete the old image if it exists
//             if (existingMenuItem.image) {
//                 const oldImagePath = path.join(__dirname, "..", existingMenuItem.image);
//                 if (fs.existsSync(oldImagePath)) {
//                     fs.unlinkSync(oldImagePath);
//                 }
//             }

//             // Update with the new image URL
//             updateData.image = newImageUrl;
//         }

//         // Update the menu item with new data
//         const updatedMenuItem = await MenuItem.findByIdAndUpdate(req.params.id, updateData, { new: true });

//         if (!updatedMenuItem) {
//             return res.status(404).json({ message: "MenuItem not found" });
//         }

//         res.status(200).json(updatedMenuItem);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };

// exports.updateMenuItem = async (req, res) => {
//     try {
//         let updateData = { ...req.body };

//         // Find the existing menu item before trying to use its image
//         const existingMenuItem = await MenuItem.findById(req.params.id);
//         if (!existingMenuItem) {
//             return res.status(404).json({ message: "MenuItem not found" });
//         }

//         // Check if a new image is uploaded
//         if (req.file) {
//             // Upload new image to Cloudinary
//             const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
//                 folder: "restaurants"
//             });
//             const newImageUrl = uploadedImage.secure_url;

//             // If the menu item already has an image, delete it from Cloudinary
//             if (existingMenuItem.image) {
//                 const publicId = existingMenuItem.image.split('/').pop().split('.')[0];
//                 await cloudinary.uploader.destroy(`restaurants/${publicId}`);
//             }

//             // Update with the new image URL
//             updateData.image = newImageUrl;
//         }

//         // Update the menu item with new data
//         const updatedMenuItem = await MenuItem.findByIdAndUpdate(req.params.id, updateData, { new: true });

//         if (!updatedMenuItem) {
//             return res.status(404).json({ message: "MenuItem not found" });
//         }

//         res.status(200).json(updatedMenuItem);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };

exports.updateMenuItem = async (req, res) => {
    try {
        let updateData = { ...req.body };

        // Find the existing menu item
        const existingMenuItem = await MenuItem.findById(req.params.id);
        if (!existingMenuItem) {
            return res.status(404).json({ message: "MenuItem not found" });
        }

        // If a new image is uploaded via Multer, use it directly
        if (req.file) {
            // Delete the old image from Cloudinary
            if (existingMenuItem.image) {
                const getPublicIdFromUrl = (url) => {
                    const parts = url.split("/restaurants/"); 
                    return parts.length > 1 ? `restaurants/${parts[1].split(".")[0]}` : null;
                };

                const publicId = getPublicIdFromUrl(existingMenuItem.image);
                
                if (publicId) {
                    await cloudinary.uploader.destroy(publicId);
                }
            }

            // Use the new uploaded image URL directly from Multer
            updateData.image = req.file.path;  
        }

        // Update the menu item with new data
        const updatedMenuItem = await MenuItem.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!updatedMenuItem) {
            return res.status(404).json({ message: "MenuItem not found" });
        }

        res.status(200).json(updatedMenuItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};



// Delete MenuItem
// exports.deleteMenuItem = async (req, res) => {
//     try {
//         const deletedMenuItem = await MenuItem.findByIdAndDelete(req.params.id);
//         if (!deletedMenuItem) return res.status(404).json({ message: 'MenuItem not found' });
//         await Restaurant.findByIdAndUpdate(deletedMenuItem.restaurant_id, { $pull: { menu: deletedMenuItem._id }, $inc: { total_menu: -1 } });
//         res.status(200).json({ message: 'MenuItem deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// exports.deleteMenuItem = async (req, res) => {
//     try {
//         const deletedMenuItem = await MenuItem.findByIdAndDelete(req.params.id);
//         if (!deletedMenuItem) {
//             return res.status(404).json({ message: 'MenuItem not found' });
//         }

//         // Delete image file from uploads folder
//         if (deletedMenuItem.image) {
//             const imagePath = path.join(__dirname, "../uploads", path.basename(deletedMenuItem.image));
//             if (fs.existsSync(imagePath)) {
//                 fs.unlinkSync(imagePath);
//             }
//         }

//         // Remove the menu item reference from the restaurant and decrease total_menu count
//         await Restaurant.findByIdAndUpdate(deletedMenuItem.restaurant_id, {
//             $pull: { menu: deletedMenuItem._id },
//             $inc: { total_menu: -1 }
//         });

//         res.status(200).json({ message: 'MenuItem deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

exports.deleteMenuItem = async (req, res) => {
    try {
        // Find the menu item before deleting
        const deletedMenuItem = await MenuItem.findByIdAndDelete(req.params.id);
        if (!deletedMenuItem) {
            return res.status(404).json({ message: "MenuItem not found" });
        }

        // Delete the image from Cloudinary if it exists
        if (deletedMenuItem.image) {
            const getPublicIdFromUrl = (url) => {
                const parts = url.split("/restaurants/"); 
                return parts.length > 1 ? `restaurants/${parts[1].split(".")[0]}` : null;
            };

            const publicId = getPublicIdFromUrl(deletedMenuItem.image);

            if (publicId) {
                await cloudinary.uploader.destroy(publicId);
            }
        }

        // Remove the menu item reference from the restaurant and decrease total_menu count
        await Restaurant.findByIdAndUpdate(deletedMenuItem.restaurant_id, {
            $pull: { menu: deletedMenuItem._id },
            $inc: { total_menu: -1 }
        });

        res.status(200).json({ message: "MenuItem deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
