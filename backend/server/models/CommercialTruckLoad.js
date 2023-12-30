// backend/server/models/CommercialTruckLoad.js
const mongoose = require('mongoose');

const CommercialTruckLoadSchema = new mongoose.Schema({
    // Define the fields for Commercial Truck load here
    // You can use the same fields as in MotoEquipmentLoad and CarOrLightTruckLoad
    // For example:
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
    userEndpoint: String, // Link the load to a user
});

module.exports = mongoose.model('CommercialTruckLoad', CommercialTruckLoadSchema);