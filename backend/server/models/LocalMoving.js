const mongoose = require('mongoose');

const LocalMovingSchema = new mongoose.Schema({
    customerName: String,
    phoneNumber: String,
    email: String,
    currentAddress: String,
    newAddress: String,
    preferredMoveDate: Date,
    alternativeMoveDate: Date,
    preferredTimeWindow: String,
    propertyTypeCurrent: String,
    propertyTypeNew: String,
    numberOfBedrooms: Number,
    floorNumber: Number,
    elevatorAvailability: Boolean,
    itemsToMove: String,
    fullPacking: Boolean,
    partialPacking: Boolean,
    noPacking: Boolean,
    specialHandling: String,
    insuranceNeeded: Boolean,
    storageRequired: Boolean,
    assemblyServices: Boolean,
    parkingAvailability: Boolean,
    obstructions: String,
    paymentMethod: String,
    additionalNotes: String,
    customerSignature: String,
    date: Date,
});

module.exports = mongoose.model('LocalMoving', LocalMovingSchema);