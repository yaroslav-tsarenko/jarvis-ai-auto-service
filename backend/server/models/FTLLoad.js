const mongoose = require('mongoose');

const FTLLoadSchema = new mongoose.Schema({
    shipperName: String,
    shipperPhone: String,
    shipperEmail: String,
    pickupAddress: String,
    pickupDateTime: Date,
    yourName: String,
    yourPhone: String,
    yourEmail: String,
    deliveryAddress: String,
    deliveryDateTime: Date,
    freightDescription: String,
    totalWeight: Number,
    equipmentType: String,
    billingAddress: String,
    billingContactName: String,
    paymentTerms: String,
    specialInstructions: String,
    shipperSignature: String,
    requestDate: Date,
});

const FTLLoad = mongoose.model('FTLLoad', FTLLoadSchema);

module.exports = FTLLoad;