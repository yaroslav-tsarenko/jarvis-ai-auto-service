// models/MotoEquipmentLoad.js
const mongoose = require('mongoose');

const MotoEquipmentLoadSchema = new mongoose.Schema({
    vehicleType: String,
    vehicleModel: String,
    vehicleYear: String,
    vehicleColor: String,
    vehicleLicensePlate: String,
    vehicleVin: String,
    pickupLocation: String,
    deliveryLocation: String,
    isConvertible: Boolean,
    isModified: Boolean,
    isInoperable: Boolean,
    serviceLevel: String,
    enclosedTransport: Boolean,
    termsAgreed: Boolean,
    deliveryDate: Date,
    userEndpoint: String, // Add this line to link the load to a user
});

module.exports = mongoose.model('MotoEquipmentLoad', MotoEquipmentLoadSchema);