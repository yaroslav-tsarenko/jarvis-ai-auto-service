// backend/server/models/AutoMotoBoatEquipment.js
const mongoose = require('mongoose');

const AutoMotoBoatEquipmentSchema = new mongoose.Schema({
    customerName: String,
    contactPhone: String,
    emailAddress: String,
    vehicleEquipmentType: String,
    make: String,
    model: String,
    year: Number,
    vinSerialNumber: String,
    color: String,
    condition: String,
    serviceTypeRequested: String,
    specificServiceRequests: String,
    preferredServiceDate: Date,
    alternateServiceDate: Date,
    pickUpRequired: Boolean,
    deliveryRequired: Boolean,
    pickUpDeliveryAddress: String,
    insuranceProvider: String,
    policyNumber: String,
    preferredPaymentMethod: String,
    additionalCommentsInstructions: String,
    signature: String,
    date: Date,
});

module.exports = mongoose.model('AutoMotoBoatEquipment', AutoMotoBoatEquipmentSchema);