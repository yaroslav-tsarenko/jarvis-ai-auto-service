const mongoose = require('mongoose');

const FreeConsultationSchema = new mongoose.Schema({
    problemDescription: String,
});

const FreeConsultation = mongoose.model('FreeConsultation', FreeConsultationSchema);

module.exports = FreeConsultation;