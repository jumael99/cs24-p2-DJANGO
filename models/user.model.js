const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Added name field
    email: { type: String, required: true, unique: true }, // Added email field
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] }, // Added gender field
    role: { type: String, required: true, enum: ['admin', 'stsManager', 'landfillManager', 'unassigned'] },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
