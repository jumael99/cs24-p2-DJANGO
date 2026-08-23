const mongoose = require('mongoose/index.js');

const roleSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('Role', roleSchema);
