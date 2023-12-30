// backend/server/models/HeavyLiftingAndMovingOnly.js
const mongoose = require('mongoose');

const HeavyLiftingAndMovingOnlySchema = new mongoose.Schema({
    customerContactInformation: {
        name: String,
        email: String,
        phoneNumber: String
    },
    pickupLocation: String,
    deliveryLocation: String,
    itemDetails: String,
    serviceRequirements: String,
    dateAndTime: Date,
    specialInstructions: String,
    insuranceInformation: String,
    billingInformation: String,
});

module.exports = mongoose.model('HeavyLiftingAndMovingOnly', HeavyLiftingAndMovingOnlySchema);