// backend/server/models/StudentMoving.js
const mongoose = require('mongoose');

const StudentMovingSchema = new mongoose.Schema({
    studentName: String,
    studentPhoneNumber: String,
    studentEmailAddress: String,
    currentAddress: String,
    newAddress: String,
    preferredMoveDate: Date,
    alternateMoveDate: Date,
    preferredTimeWindow: String,
    descriptionOfItems: String,
    specialHandlingRequirements: String,
    packingServicesRequired: Boolean,
    insuranceRequirement: String,
    vehicleTypePreferred: String,
    paymentMethodPreference: String,
    additionalServices: String,
    commentsSpecialInstructions: String,
    studentSignature: String,
    date: Date,
});

module.exports = mongoose.model('StudentMoving', StudentMovingSchema);