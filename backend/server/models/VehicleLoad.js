// models/VehicleLoad.js
const mongoose = require('mongoose');

const VehicleLoadSchema = new mongoose.Schema({
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
});

module.exports = mongoose.model('VehicleLoad', VehicleLoadSchema);