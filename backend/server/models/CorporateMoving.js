const mongoose = require('mongoose');

const CorporateMovingSchema = new mongoose.Schema({
    companyName: String,
    primaryContactName: String,
    contactPhoneNumber: String,
    contactEmailAddress: String,
    currentAddress: String,
    newAddress: String,
    preferredMovingDate: Date,
    alternateMovingDate: Date,
    estimatedVolumeOrSizeOfMove: String,
    numberOfEmployeesDesksToMove: Number,
    specialEquipmentToMove: String,
    accessRestrictions: String,
    insuranceRequirements: String,
    specialHandlingInstructions: String,
    packingServicesNeeded: Boolean,
    storageRequirements: String,
    budgetRange: String,
    decisionMakerName: String,
    decisionMakerContactInformation: String,
    additionalServicesRequested: String,
    commentsAdditionalInstructions: String,
    confirmationOfTermsAndConditions: Boolean,
    formSubmissionDate: Date,
});

module.exports = mongoose.model('CorporateMoving', CorporateMovingSchema);