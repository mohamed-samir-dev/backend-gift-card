const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  product:    { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  cardNumber: { type: String },
  expiry:     { type: String },
  cvv:        { type: String },
  pin:        { type: String },
  serial:     { type: String },
  status:     { type: String, enum: ['available', 'reserved', 'sold'], default: 'available' },
  soldTo:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  soldAt:     { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Card', cardSchema);
