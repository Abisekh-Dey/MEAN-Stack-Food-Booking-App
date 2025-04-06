const Restaurant = require('../models/restaurant_model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require("fs");
const path = require("path");
const cloudinary = require("../config/cloudinary");
const upload = require("../config/multer");

// Create Restaurant
// exports.createRestaurant = async (req, res) => {
//     const { email, contact_number } = req.body;
//     const email_id = await Restaurant.findOne({ email });
//     if (email_id) return res.status(404).json({ message: 'Email already exists' });
//     const contact = await Restaurant.findOne({ contact_number });
//     if (contact) return res.status(404).json({ message: 'Contact number already exits' });
//     try {
//         const newRestaurant = new Restaurant(req.body);
//         newRestaurant.password = req.body.contact_number;
//         await newRestaurant.save();
//         res.status(201).json(newRestaurant);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };
exports.createRestaurant = async (req, res) => {
    // console.log(req.body);
    try {
        const { name, number, street, city, post, pin, state, country, cuisine_type, owner_name, email, password, contact_number, menu, opening_time, closing_time, closing_day, lng, lat } = req.body;

        // const getPublicIdFromUrl = (url) => {
        //     const parts = url.split("/");
        //     return parts[parts.length - 1].split(".")[0]; // Extracts filename without extension
        // };
        const getPublicIdFromUrl = (url) => {
            const parts = url.split("/restaurants/");
            return parts.length > 1 ? `restaurants/${parts[1].split(".")[0]}` : null;
        };

        const emailExists = await Restaurant.findOne({ email });
        if (emailExists){
            if (req.file) {
                const publicId = getPublicIdFromUrl(req.file.path);
                await cloudinary.uploader.destroy(publicId);
            }
            return res.status(400).json({ message: 'Email already exists' });
        } 

        const contactExists = await Restaurant.findOne({ contact_number });
        if (contactExists){
            if (req.file) {
                const publicId = getPublicIdFromUrl(req.file.path);
                await cloudinary.uploader.destroy(publicId);
            }
            return res.status(400).json({ message: 'Contact number already exists' });
        }

        // let imageUrl = '';
        // if (req.file) {
        //     imageUrl = `/uploads/${req.file.filename}`;
        // }
        // let imageUrl = '';
        // if (req.file) {
        //     const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
        //         folder: "restaurants"
        //     });
        //     imageUrl = uploadedImage.secure_url;
        // }

        let imageUrl = req.file ? req.file.path : "";



        // console.log(imageUrl);

        const location = `${number}, ${street}, ${city}, ${post}, ${pin}, ${state}, ${country}`;

        const newRestaurant = new Restaurant({
            name,
            location,
            coordinates: { type: "Point", coordinates: [Number(lng), Number(lat)] },
            cuisine_type,
            owner_name,
            email,
            password: contact_number,
            contact_number,
            menu,
            images: imageUrl ? [imageUrl] : [],
            opening_time,
            closing_time,
            closing_day
        });

        // console.log(newRestaurant);

        await newRestaurant.save();
        res.status(201).json(newRestaurant);
    } catch (error) {
        console.error("Error creating restaurant:", error);
        res.status(500).json({ message: error.message });
    }
};

// exports.createRestaurant = async (req, res) => {
//     console.log(req.body);
//     try {
//         const { name, location, cuisine_type, owner_name, email, password, contact_number, menu, images, opening_time, closing_time, closing_day } = req.body;

//         // Check if email or contact number already exists
//         const emailExists = await Restaurant.findOne({ email });
//         if (emailExists) return res.status(400).json({ message: 'Email already exists' });

//         const contactExists = await Restaurant.findOne({ contact_number });
//         if (contactExists) return res.status(400).json({ message: 'Contact number already exists' });

//         // Handle Image Upload
//         let imageUrl = '';
//         if (req.file) {
//             imageUrl = `/uploads/${req.file.filename}`; // Save only the image path
//         }

//         console.log(imageUrl);

//         // Create Restaurant Object
//         const newRestaurant = new Restaurant({
//             name, 
//             location, 
//             cuisine_type, 
//             owner_name, 
//             email, 
//             password: contact_number, 
//             contact_number, 
//             menu, 
//             images: imageUrl ? [imageUrl] : [], 
//             opening_time, 
//             closing_time, 
//             closing_day
//         });
//         console.log(newRestaurant);
//         await newRestaurant.save();
//         res.status(201).json(newRestaurant);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// Find the nearest restaurants based on user's location
exports.findNearestRestaurants = async (req, res) => {
    try {
        const { latitude, longitude } = req.body;
        console.log(req.body)

        if (!latitude || !longitude) {
            return res.status(400).json({ message: "Latitude and Longitude are required" });
        }

        const restaurants = await Restaurant.find({
            coordinates: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [longitude, latitude] // MongoDB stores [longitude, latitude]
                    },
                    $maxDistance: 50000 // 15000 meters (15 km)
                }
            }
        }).populate('menu');

        res.json(restaurants);
    } catch (error) {
        console.error("Error finding nearest restaurants:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Calculate the distance between the user & restaurants
exports.calculateDistance = (req, res) => {
    try {
        const { userLat, userLng, restLat, restLng } = req.body;

        if (!userLat || !userLng || !restLat || !restLng) {
            return res.status(400).json({ message: "All coordinates are required" });
        }

        const toRadians = (degrees) => degrees * (Math.PI / 180);

        const R = 6371; // Earth's radius in km
        const dLat = toRadians(restLat - userLat);
        const dLng = toRadians(restLng - userLng);

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(toRadians(userLat)) * Math.cos(toRadians(restLat)) *
                  Math.sin(dLng / 2) * Math.sin(dLng / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in km

        res.json({ success: true, distance: `${distance.toFixed(2)} km` });
    } catch (error) {
        console.error("Error calculating distance:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Estimate delivery time
exports.estimateDeliveryTime = (req, res) => {
    try {
        const { distance } = req.body;

        // if (!distance) {
        //     return res.status(400).json({ message: "Distance is required" });
        // }

        const speed = 40; // Average delivery speed in km/h
        if(distance===0){
            res.json({ success: true, estimatedTime: `0 minutes` });
        }
        else{
            const estimatedTime = (distance / speed) * 60; // Time in minutes
            res.json({ success: true, estimatedTime: `${Math.ceil(estimatedTime)} minutes` });
        }
    } catch (error) {
        console.error("Error estimating delivery time:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Get All Restaurants
exports.getRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find().populate('menu');
        res.status(200).json(restaurants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Restaurant by ID
exports.getRestaurantById = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id).populate('menu');
        if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
        res.status(200).json(restaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getRestaurantsByIds = async (req, res) => {
    try {
      const { restaurantIds } = req.body; 
      if (!restaurantIds || !Array.isArray(restaurantIds)) {
        return res.status(400).json({ message: "Invalid restaurant IDs" });
      }
  
      const restaurants = await Restaurant.find({ _id: { $in: restaurantIds } }).populate('menu');
  
      res.json(restaurants);
    } catch (error) {
      res.status(500).json({ message: "Server Error", error });
    }
  };

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Restaurant.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, owner_name: user.owner_name, name: user.name }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({ message: 'Login successful',user, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Restaurant
exports.updateRestaurant = async (req, res) => {
    try {
        const updatedRestaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedRestaurant) return res.status(404).json({ message: 'Restaurant not found' });
        res.status(200).json(updatedRestaurant);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Approve a restaurant
exports.approveRestaurant = async (req, res) => {
    try {
        const updatedRestaurant = await Restaurant.findByIdAndUpdate(req.params.id,{ isApproved: "true" },{ new: true });
        if (!updatedRestaurant) return res.status(404).json({ message: "Restaurant not found" });
        res.status(200).json({ message: "Restaurant approved successfully", restaurant: updatedRestaurant });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Close Restaurant
exports.closeRestaurant = async(req, res) => {
    try {
        const closeNow = await Restaurant.findByIdAndUpdate(req.params.id,{ closeRestaurant: true },{ new: true });
        if (!closeNow) return res.status(404).json({message: 'Restaurant not found' });
        res.status(200).json({ message: 'Restaurant closed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Re-open Restaurant
exports.reOpenRestaurant = async(req, res) => {
    try {
        const reOpenNow = await Restaurant.findByIdAndUpdate(req.params.id,{ closeRestaurant: false },{ new: true });
        if (!reOpenNow) return res.status(404).json({message: 'Restaurant not found' });
        res.status(200).json({ message: 'Restaurant closed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// // Delete Restaurant
// exports.deleteRestaurant = async (req, res) => {
//     try {
//         const deletedRestaurant = await Restaurant.findByIdAndDelete(req.params.id);
//         if (!deletedRestaurant) return res.status(404).json({ message: 'Restaurant not found' });
//         res.status(200).json({ message: 'Restaurant deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// Delete Restaurant
exports.deleteRestaurant = async (req, res) => {
    try {
        const deletedRestaurant = await Restaurant.findByIdAndDelete(req.params.id);
        if (!deletedRestaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        // Function to extract public_id from Cloudinary URLs
        const getPublicIdFromUrl = (url) => {
            const parts = url.split("/restaurants/");
            return parts.length > 1 ? `restaurants/${parts[1].split(".")[0]}` : null;
        };

        // Delete all images from Cloudinary
        if (deletedRestaurant.images && deletedRestaurant.images.length > 0) {
            for (const imageUrl of deletedRestaurant.images) {
                const publicId = getPublicIdFromUrl(imageUrl);
                if (publicId) {
                    await cloudinary.uploader.destroy(publicId);
                }
            }
        }

        res.status(200).json({ message: "Restaurant and its images deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// Increment image_number by 1
exports.incrementImageNumber = async (req, res) => {
    try {
        const updatedRestaurant = await Restaurant.findByIdAndUpdate(
            req.params.id,
            { $inc: { image_number: 1 } }, // Increment by 1
            { new: true }
        );

        if (!updatedRestaurant) return res.status(404).json({ message: "Restaurant not found" });

        res.status(200).json({ message: "Image number incremented", restaurant: updatedRestaurant });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Reset image_number to 0
exports.resetImageNumber = async (req, res) => {
    try {
        const updatedRestaurant = await Restaurant.findByIdAndUpdate(
            req.params.id,
            { image_number: 0 }, // Reset to 0
            { new: true }
        );

        if (!updatedRestaurant) return res.status(404).json({ message: "Restaurant not found" });

        res.status(200).json({ message: "Image number reset", restaurant: updatedRestaurant });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Restaurant Address
exports.changeRestaurantAddress = async (req, res) => {
    try {
        const updatedRestaurant = await Restaurant.findByIdAndUpdate(
            req.params.id,
            { location: req.body.location }, // Update the address
            { new: true }
        );
        
        if (!updatedRestaurant) return res.status(404).json({ message: "Restaurant not found" });
        
        res.status(200).json({ message: "Restaurant address updated", restaurant: updatedRestaurant });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Update Restaurant Name
exports.changeRestaurantName = async (req, res) => {
    try {
        const updatedRestaurant = await Restaurant.findByIdAndUpdate(
            req.params.id,
            { name: req.body.name }, // Update the name
            { new: true }
        );
        
        if (!updatedRestaurant) return res.status(404).json({ message: "Restaurant not found" });
        
        res.status(200).json({ message: "Restaurant name updated", restaurant: updatedRestaurant });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Update Password
exports.changeRestaurantPassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "Old and new passwords are required" });
        }

        // Find the restaurant by ID
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        // Check if old password matches contact_number
        // if (oldPassword === restaurant.contact_number) {
        //     // Directly update with new hashed password
        //     const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        //     const updatedRestaurant = await Restaurant.findByIdAndUpdate(
        //         req.params.id,
        //         { password: hashedNewPassword },
        //         { new: true }
        //     );
        //     return res.status(200).json({ message: "Password updated successfully", restaurant: updatedRestaurant });
        // }

        // If old password does not match contact_number, compare it with hashed password
        const isMatch = await bcrypt.compare(oldPassword, restaurant.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Old password is incorrect" });
        }

        // If valid, update with new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        const updatedRestaurant = await Restaurant.findByIdAndUpdate(
            req.params.id,
            { password: hashedNewPassword },
            { new: true }
        );

        res.status(200).json({ message: "Password updated successfully", restaurant: updatedRestaurant });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add Images to Restaurant
// exports.addImagesToRestaurant = async (req, res) => {
//     try {
//         const updatedRestaurant = await Restaurant.findByIdAndUpdate(
//             req.params.id,
//             { $push: { images: req.body.images  } }, // Add multiple images
//             { new: true }
//         );

//         if (!updatedRestaurant) return res.status(404).json({ message: "Restaurant not found" });

//         res.status(200).json({ message: "Images added successfully", restaurant: updatedRestaurant });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

exports.addImagesToRestaurant = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No image uploaded" });
        }

        // const imageUrl = `/uploads/${req.file.filename}`; // Store relative image path
        // const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
        //     folder: "restaurants"
        // });
        // const imageUrl = uploadedImage.secure_url;

        const imageUrl = req.file.path; 
        

        const updatedRestaurant = await Restaurant.findByIdAndUpdate(
            req.params.id,
            { $push: { images: imageUrl } }, // Push new image URL to images array
            { new: true }
        );

        if (!updatedRestaurant) return res.status(404).json({ message: "Restaurant not found" });

        res.status(200).json({ message: "Image added successfully", restaurant: updatedRestaurant });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// Update Restaurant Details
exports.updateRestaurantDetails = async (req, res) => {
    try {
        const updatedRestaurant = await Restaurant.findByIdAndUpdate(
            req.params.id,
            {
                owner_name: req.body.owner_name,
                contact_number: req.body.contact_number,
                opening_time: req.body.opening_time,
                closing_time: req.body.closing_time,
                closing_day: req.body.closing_day,
                cuisine_type: req.body.cuisine_type,
                email: req.body.email
            },
            { new: true } // Return the updated document
        );

        if (!updatedRestaurant) return res.status(404).json({ message: "Restaurant not found" });

        res.status(200).json({ message: "Restaurant details updated", restaurant: updatedRestaurant });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.removeRestaurantImage = async (req, res) => {
    try {
        const { imageUrl } = req.body;

        if (!imageUrl) {
            return res.status(400).json({ message: "Image URL is required" });
        }

        const restaurant = await Restaurant.findById(req.params.id);

        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        // Extract public ID correctly from Cloudinary URL
        const publicId = imageUrl.split("/restaurants/")[1].split(".")[0];

        // Delete image from Cloudinary
        await cloudinary.uploader.destroy(`restaurants/${publicId}`);

        // Remove image from restaurant's images array
        const updatedImages = restaurant.images.filter(img => img !== imageUrl);

        // Update the restaurant document
        const updatedRestaurant = await Restaurant.findByIdAndUpdate(
            req.params.id, 
            { images: updatedImages },
            { new: true } // Return updated document
        );

        res.status(200).json({
            message: "Image removed successfully",
            images: updatedRestaurant.images,
        });

    } catch (error) {
        console.error("Error removing image:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


// exports.removeRestaurantImage = async (req, res) => {
//     try {
//         const { imageUrl } = req.body;

//         if (!imageUrl) {
//             return res.status(400).json({ message: "Image URL is required" });
//         }

//         const restaurant = await Restaurant.findById(req.params.id);

//         if (!restaurant) {
//             return res.status(404).json({ message: "Restaurant not found" });
//         }

//         // // Remove image from array
//         // const updatedImages = restaurant.images.filter(img => img !== imageUrl);

//         // // Delete image file from the server
//         // const imagePath = path.join(__dirname, "..", imageUrl); // Adjust path if needed
//         // fs.unlink(imagePath, (err) => {
//         //     if (err && err.code !== "ENOENT") { // Ignore "file not found" errors
//         //         console.error("Error deleting file:", err);
//         //     } else {
//         //         console.log("File deleted successfully");
//         //     }
//         // });
//         // Extract public_id from Cloudinary URL
//     const publicId = imageUrl.split("/").pop().split(".")[0];

//     // Delete image from Cloudinary
//     await cloudinary.uploader.destroy(`restaurants/${publicId}`, (error, result) => {
//       if (error) {
//         console.error("Error deleting from Cloudinary:", error);
//       } else {
//         console.log("Cloudinary response:", result);
//       }
//     });

//         // Update the restaurant document
//         const updatedRestaurant = await Restaurant.findByIdAndUpdate(
//             req.params.id, 
//             { images: updatedImages },
//             { new: true } // Return updated document
//         );

//         res.status(200).json({
//             message: "Image removed successfully",
//             images: updatedRestaurant.images,
//         });

//     } catch (error) {
//         console.error("Error removing image:", error);
//         res.status(500).json({ message: "Internal Server Error", error: error.message });
//     }
// };

exports.closeAllRestaurants = async (req, res) => {
    try {
        const result = await Restaurant.updateMany(
            { closeRestaurant: { $exists: false } }, // Only update if the field doesn't exist
            { $set: { closeRestaurant: false } }
        );

        res.status(200).json({
            message: "All restaurants updated successfully",
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
