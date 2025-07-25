const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  room: { type: String, required: true },           // Room name 
  sender: { type: String, required: true },         // Username of sender
  to: { type: String, default: null },              //  recipient username (for direct messages)
  text: { type: String, required: true },           // Message content
  timestamp: { type: Date, default: Date.now },     // Sent time
});

module.exports = mongoose.model("Message", MessageSchema);
