// backend/server/models/Other.js
const mongoose = require('mongoose');

const OtherSchema = new mongoose.Schema({
    issueDescription: String,
});

const Other = mongoose.model('Other', OtherSchema);

module.exports = Other;