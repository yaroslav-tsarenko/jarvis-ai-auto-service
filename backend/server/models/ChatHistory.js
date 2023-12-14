const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    role: String,
    content: String
}, {
    timestamps: true
});

const ChatHistorySchema = new mongoose.Schema({
    userName: String,
    userEndpoint: String,
    chatEndpoint: { type: String, unique: true }, // New field for chat session endpoint
    chats: [ChatSchema]
});

const ChatHistory = mongoose.model('ChatHistory', ChatHistorySchema);

module.exports = ChatHistory;
