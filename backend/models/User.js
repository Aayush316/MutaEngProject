const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  otp: String, 
  otpExpires: Date, 
});

module.exports = mongoose.model('User', UserSchema);
