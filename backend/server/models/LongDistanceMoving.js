const mongoose = require('mongoose');

const LongDistanceMovingSchema = new mongoose.Schema({
    customerFullName: String,
    contactPhoneNumber: String,
    emailAddress: String,
    currentAddress: String,
    destinationAddress: String,
    preferredMovingDate: Date,
    flexibleMovingDate: Boolean,
    sizeOfMove: String,
    listOfLargeItems: String,
    additionalServicesRequired: String,
    specialHandlingInstructions: String,
    insuranceRequirements: String,
    estimateOfBoxesAndBags: Number,
    accessInformationCurrent: String,
    accessInformationDestination: String,
    preferredContactMethod: String,
    commentsOrAdditionalInformation: String,
    acknowledgment: Boolean,
});

module.exports = mongoose.model('LongDistanceMoving', LongDistanceMovingSchema);