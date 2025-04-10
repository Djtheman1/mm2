const mongoose = require("mongoose");

// Define the Mongoose schema for a Message
const MessageSchema = new mongoose.Schema({
  user: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

// Export the Mongoose model
const Message = mongoose.models.Message || mongoose.model("Message", MessageSchema);

module.exports = Message;