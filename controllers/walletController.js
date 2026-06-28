const Wallet = require('../models/Wallet');
const WalletTransaction = require('../models/WalletTransaction');
const Payment = require('../models/Payment');

exports.getMyWallet = async (req, res) => {
  const wallet = await Wallet.findOne({ user: req.user._id });
  res.json(wallet);
};

exports.recharge = async (req, res) => {
  const { amount, gateway, transactionId, rawResponse } = req.body;

  const payment = await Payment.create({
    user: req.user._id, gateway, transactionId, amount, currency: 'USD', status: 'paid', rawResponse,
  });

  const wallet = await Wallet.findOne({ user: req.user._id });
  const balanceBefore = wallet.balance;
  wallet.balance += amount;
  wallet.totalRecharge += amount;
  await wallet.save();

  await WalletTransaction.create({
    user: req.user._id,
    wallet: wallet._id,
    type: 'deposit',
    amount,
    balanceBefore,
    balanceAfter: wallet.balance,
    payment: payment._id,
    status: 'completed',
  });

  res.json({ balance: wallet.balance });
};

exports.getTransactions = async (req, res) => {
  const txns = await WalletTransaction.find({ user: req.user._id }).sort('-createdAt');
  res.json(txns);
};

exports.adminAdjust = async (req, res) => {
  const { userId, amount, note } = req.body;
  const wallet = await Wallet.findOne({ user: userId });
  if (!wallet) return res.status(404).json({ message: 'Wallet not found' });
  const balanceBefore = wallet.balance;
  wallet.balance += amount;
  await wallet.save();

  await WalletTransaction.create({
    user: userId,
    wallet: wallet._id,
    type: 'adjustment',
    amount,
    balanceBefore,
    balanceAfter: wallet.balance,
    status: 'completed',
    note,
  });

  res.json({ balance: wallet.balance });
};
