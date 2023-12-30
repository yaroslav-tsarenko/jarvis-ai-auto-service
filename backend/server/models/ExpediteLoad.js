// backend/server/models/ExpediteLoad.js
const mongoose = require('mongoose');

const ExpediteLoadSchema = new mongoose.Schema({
    shipperName: String,
    shipperPhone: String,
    shipperEmail: String,
    pickupAddress: String,
    deliveryAddress: String,
    deliveryDateTime: Date,
    goodsDescription: String,
    totalWeight: Number,
    dimensions: String,
    vehicleType: String,
    serviceLevel: String,
    specialInstructions: String,
    payment: String,
});

const ExpediteLoad = mongoose.model('ExpediteLoad', ExpediteLoadSchema);

module.exports = ExpediteLoad;