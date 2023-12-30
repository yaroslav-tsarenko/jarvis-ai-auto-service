// backend/server/models/MilitaryMoving.js
const mongoose = require('mongoose');

const MilitaryMovingSchema = new mongoose.Schema({
    serviceMemberFullName: String,
    rank: String,
    serviceNumber: String,
    branchOfService: String,
    contactPhone: String,
    contactEmail: String,
    ordersNumber: String,
    pcsDate: Date,
    currentAddress: String,
    newAssignmentLocation: String,
    preferredPackOutDate: Date,
    preferredDeliveryDate: Date,
    estimatedWeightOfHouseholdGoods: Number,
    needForTemporaryStorage: Boolean,
    emergencyContactName: String,
    emergencyContactPhone: String,
    signatureOfServiceMember: String,
    date: Date,
});

module.exports = mongoose.model('MilitaryMoving', MilitaryMovingSchema);