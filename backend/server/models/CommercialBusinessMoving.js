const mongoose = require('mongoose');

const CommercialBusinessMovingSchema = new mongoose.Schema({
    businessName: String,
    contactPerson: String,
    contactPhoneNumber: String,
    contactEmailAddress: String,
    currentAddress: String,
    newAddress: String,
    preferredMovingDate: Date,
    preferredMovingTime: String,
    typeOfBusiness: String,
    numberOfEmployees: Number,
    inventoryList: String,
    specialEquipment: String,
    squareFootage: Number,
    accessDetails: String,
    insuranceRequirements: String,
    additionalServicesNeeded: String,
    budgetRange: String,
    previousMovingExperience: String,
    specialInstructions: String,
    confirmationOfTerms: Boolean,
});

module.exports = mongoose.model('CommercialBusinessMoving', CommercialBusinessMovingSchema);