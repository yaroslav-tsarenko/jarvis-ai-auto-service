// backend/server/models/ConstructionEquipmentLoad.js
const mongoose = require('mongoose');

const ConstructionEquipmentLoadSchema = new mongoose.Schema({
    equipmentType: String,
    equipmentModel: String,
    equipmentYear: String,
    equipmentColor: String,
    equipmentLicensePlate: String,
    equipmentVin: String,
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

module.exports = mongoose.model('ConstructionEquipmentLoad', ConstructionEquipmentLoadSchema);