const mongoose = require('mongoose/index.js');

const stsDataSchema = new mongoose.Schema({
    stsNumber: { type: Number, required: true },
    wasteWeight: { type: Number, required: true },
    startTime: { type: Date, required: true },
    landfillSelection: { type: String, required: false }, // Assuming selection might be optional
    distanceKm: { type: Number, required: false } // Changed to Number
});

const STSData = mongoose.model('STSData', stsDataSchema);

module.exports = STSData;
