const mongoose = require('mongoose');

const InternationalMovingSchema = new mongoose.Schema({
    fullName: String,
    phoneNumber: String,
    emailAddress: String,
    currentAddress: String,
    destinationAddress: String,
    preferredMovingDate: Date,
    estimatedVolume: String,
    typeOfResidence: String,
    inventoryList: String,
    valuableItems: String,
    servicesRequired: String,
    insuranceCoverage: String,
    customsDocumentation: String,
    additionalServices: String,
    specialInstructions: String,
    customerSignature: String,
    date: Date,
});

module.exports = mongoose.model('InternationalMoving', InternationalMovingSchema);