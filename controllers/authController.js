const User = require('../models/User');
const Wallet = require('../models/Wallet');
const generateToken = require('../utils/generateToken');

exports.register = async (req, res) => {
  const { name, email, phone, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Email already in use' });

  const user = await User.create({ name, email, phone, password });
  await Wallet.create({ user: user._id });

  res.status(201).json({ token: generateToken(user._id), user: { _id: user._id, name, email, role: user.role } });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !user.password) return res.status(401).json({ message: 'Invalid credentials' });
  if (!(await user.matchPassword(password))) return res.status(401).json({ message: 'Invalid credentials' });
  if (user.isBlocked) return res.status(403).json({ message: 'Account blocked' });

  user.lastLogin = new Date();
  await user.save();

  res.json({ token: generateToken(user._id), user: { _id: user._id, name: user.name, email, role: user.role } });
};

exports.googleAuth = async (req, res) => {
  const { googleId, email, name, avatar } = req.body;
  if (!googleId || !email) return res.status(400).json({ message: 'Missing Google data' });

  let user = await User.findOne({ email });

  if (user) {
    if (user.isBlocked) return res.status(403).json({ message: 'Account blocked' });
    if (!user.googleId) {
      user.googleId = googleId;
      user.authProvider = 'google';
      if (!user.avatar && avatar) user.avatar = avatar;
    }
  } else {
    user = await User.create({ name, email, googleId, avatar, authProvider: 'google', isVerified: true });
    await Wallet.create({ user: user._id });
  }

  user.lastLogin = new Date();
  await user.save();

  res.json({ token: generateToken(user._id), user: { _id: user._id, name: user.name, email, role: user.role } });
};

exports.getMe = async (req, res) => {
  res.json(req.user);
};
