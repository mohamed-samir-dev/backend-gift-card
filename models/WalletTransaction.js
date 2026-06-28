const mongoose = require('mongoose');

const walletTransactionSchema = new mongoose.Schema({
  user:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  wallet:        { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet', required: true },
  type:          { type: String, enum: ['deposit', 'purchase', 'refund', 'adjustment'], required: true },
  amount:        { type: Number, required: true },
  balanceBefore: { type: Number, required: true },
  balanceAfter:  { type: Number, required: true },
  payment:       { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
  order:         { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  status:        { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' },
  note:          { type: String },
}, { timestamps: true });

module.exports = mongoose.model('WalletTransaction', walletTransactionSchema);
