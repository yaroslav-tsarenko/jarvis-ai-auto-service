const mongoose = require('mongoose');

const OfficeMovingSchema = new mongoose.Schema({
    companyName: String,
    primaryContactName: String,
    primaryContactPhone: String,
    primaryContactEmail: String,
    currentOfficeAddress: String,
    newOfficeAddress: String,
    preferredMovingDate: Date,
    preferredMovingTime: String,
    sizeOfOffice: String,
    numberOfEmployees: Number,
    detailedInventoryList: String,
    specialHandlingItems: String,
    packingServicesRequired: Boolean,
    insuranceRequired: Boolean,
});

module.exports = mongoose.model('OfficeMoving', OfficeMovingSchema);