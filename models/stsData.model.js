const mongoose = require('mongoose');

const stsDataSchema = new mongoose.Schema({
    stsNumber: { type: Number, required: true },
    wasteWeight: { type: Number, required: true },
    startTime: { type: Date,required: true },
});

const STSData = mongoose.model('STSData', stsDataSchema);

module.exports = STSData;
