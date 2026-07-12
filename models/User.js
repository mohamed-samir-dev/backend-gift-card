const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:       { type: String, required: true, trim: true },
  email:      { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone:      { type: String, unique: true, sparse: true, trim: true },
  password:   { type: String, select: false },
  googleId:   { type: String },
  authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
  role:       { type: String, enum: ['admin', 'customer'], default: 'customer' },
  isVerified: { type: Boolean, default: false },
  isBlocked:  { type: Boolean, default: false },
  avatar:     { type: String },
  lastLogin:  { type: Date },
  loginAttempts: { type: Number, default: 0 },
  lockUntil:     { type: Date },
}, { timestamps: true });

userSchema.virtual('isLocked').get(function () {
  return this.lockUntil && this.lockUntil > Date.now();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model('User', userSchema);
