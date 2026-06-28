const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code:      { type: String, required: true, unique: true, uppercase: true },
  type:      { type: String, enum: ['percentage', 'fixed'], required: true },
  value:     { type: Number, required: true },
  maxUses:   { type: Number, default: null },
  usedCount: { type: Number, default: 0 },
  expiresAt: { type: Date },
  isActive:  { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);
