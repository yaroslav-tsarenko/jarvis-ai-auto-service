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
    title: String, // Add this line
    chats: [ChatSchema]
});

const ChatHistory = mongoose.model('ChatHistory', ChatHistorySchema);

module.exports = ChatHistory;