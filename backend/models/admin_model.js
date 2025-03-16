const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({
    name: {type: String,required: true,trim: true},
    email: {type: String,required: true,unique: true,lowercase: true,trim: true},
    password: {type: String,required: true,minlength: 6},
    role: {type: String,default: 'admin'},
    address: { type: String },
    contact_number: { type: String, required: true },
}, { timestamps: true });

// Hash password before saving
adminSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

module.exports = mongoose.model('Admin', adminSchema);
