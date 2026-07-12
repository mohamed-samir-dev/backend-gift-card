const User = require('../models/User');
const Wallet = require('../models/Wallet');
const generateToken = require('../utils/generateToken');

exports.register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const user = await User.create({ name, email: email.toLowerCase().trim(), phone: phone?.trim(), password });
    await Wallet.create({ user: user._id });
    res.status(201).json({ token: generateToken(user._id), user: { _id: user._id, name, email: user.email, role: user.role } });
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      const msg = field === 'email' ? 'البريد الإلكتروني مسجل مسبقاً' : 'رقم الهاتف مسجل مسبقاً';
      return res.status(409).json({ message: msg });
    }
    res.status(500).json({ message: 'حدث خطأ، حاول مرة أخرى' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password +loginAttempts +lockUntil');
  if (!user || !user.password) return res.status(401).json({ message: 'بيانات غير صحيحة' });
  if (user.isBlocked) return res.status(403).json({ message: 'الحساب محظور' });

  // Check lock
  if (user.lockUntil && user.lockUntil > Date.now()) {
    const mins = Math.ceil((user.lockUntil - Date.now()) / 60000);
    return res.status(429).json({ message: `الحساب مقفل مؤقتاً، حاول بعد ${mins} دقيقة` });
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    user.loginAttempts += 1;
    if (user.loginAttempts >= 5) {
      user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 min
      user.loginAttempts = 0;
      await user.save();
      return res.status(429).json({ message: 'تم قفل الحساب لمدة 15 دقيقة بسبب كثرة المحاولات الخاطئة' });
    }
    await user.save();
    return res.status(401).json({ message: `بيانات غير صحيحة، تبقى ${5 - user.loginAttempts} محاولات` });
  }

  // Success - reset attempts
  user.loginAttempts = 0;
  user.lockUntil = undefined;
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
