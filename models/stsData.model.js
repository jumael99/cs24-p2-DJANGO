// models/stsData.model.js
const mongoose = require('mongoose');

const stsDataSchema = new mongoose.Schema({
    stsNumber: { type: Number, required: true },
    vehicleNumber: { type: String, required: true },
    arrivalTime: { type: Date, required: true },
    departureTime: { type: Date, required: true },
    wasteWeight: { type: Number, required: true },
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Reference to the STS manager who submitted the data
});

const STSData = mongoose.model('STSData', stsDataSchema);

module.exports = STSData;
