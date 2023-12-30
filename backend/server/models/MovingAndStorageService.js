// backend/server/models/MovingAndStorageService.js
const mongoose = require('mongoose');

const MovingAndStorageServiceSchema = new mongoose.Schema({
    customerName: String,
    contactPhoneNumber: String,
    emailAddress: String,
    currentAddress: String,
    destinationAddress: String,
    preferredMovingDate: Date,
    preferredDeliveryDate: Date,
    inventoryList: String,
    totalVolumeOrSizeOfMove: String,
    typeOfResidence: String,
    accessDetails: String,
    storageDurationRequired: String,
    specialHandlingInstructions: String,
    insuranceRequirement: Boolean,
    valuationOfGoods: Number,
    additionalServices: String,
    budget: Number,
    howDidYouHearAboutUs: String,
    customerSignature: String,
    dateOfRequest: Date,
});

module.exports = mongoose.model('MovingAndStorageService', MovingAndStorageServiceSchema);