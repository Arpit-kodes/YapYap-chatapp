const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String }, // optional for guest
  password: { type: String }, // optional for guest
  isGuest: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", UserSchema);
