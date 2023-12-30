// backend/server/models/LTLDelivery.js
const mongoose = require('mongoose');

const LTLDeliverySchema = new mongoose.Schema({
    serviceNeeded: String,
    companyName: String,
    yourName: String,
    email: String,
    phoneNumber: String,
    shipmentDate: Date,
    origin: String,
    destination: String,
    commodityDescription: String,
    commodityClass: String,
    commodityDimensions: String,
    totalWeight: Number,
    additionalComments: String,
});

const LTLDelivery = mongoose.model('LTLDelivery', LTLDeliverySchema);

module.exports = LTLDelivery;