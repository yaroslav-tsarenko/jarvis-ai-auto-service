const mongoose = require('mongoose');

const HeavyEquipmentLoadSchema = new mongoose.Schema({
    makeAndModel: String,
    serialNumber: String,
    weight: Number,
    operatorName: String,
    pickupLocation: String,
    deliveryLocation: String,
    serviceLevel: String,
    termsAgreed: Boolean,
    deliveryDate: Date,
    userEndpoint: String, // Add this line to link the load to a user
});

module.exports = mongoose.model('HeavyEquipmentLoad', HeavyEquipmentLoadSchema);