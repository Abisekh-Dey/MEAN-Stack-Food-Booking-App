const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const restaurantSchema = new Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    coordinates: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], required: true } 
    },
    cuisine_type: { type: String, required: true },
    owner_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contact_number: { type: String, required: true },
    menu: [{ type: Schema.Types.ObjectId, ref: 'MenuItem' }],
    total_menu: { type: Number, default: 0 },
    images: [String],
    opening_time: { type: String, required: true },
    closing_time: { type: String, required: true },
    closing_day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'None'], default: 'None' },
    isApproved: { type: String, default: "false" },
    closeRestaurant: { type: Boolean, default: false},
    image_number: { type: Number, default:0}
}, { timestamps: true });

restaurantSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

restaurantSchema.index({ coordinates: "2dsphere" });

module.exports = mongoose.model('Restaurant', restaurantSchema);
