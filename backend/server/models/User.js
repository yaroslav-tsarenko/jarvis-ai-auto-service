const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: String,
    secondName: String,
    phoneNumber: String,
    email: String,
    password: String,
    personalEndpoint: { type: String, unique: true, required: true }, // Add this field to store the personal endpoint
})

const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;