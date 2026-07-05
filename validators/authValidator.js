const User = require('../models/User');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^(\+?\d{7,15})$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

exports.validateRegister = async (req, res, next) => {
  const { name, email, phone, password } = req.body;
  const errors = [];

  if (!name || name.trim().length < 2)
    errors.push('الاسم يجب أن يكون حرفين على الأقل');

  if (!email || !emailRegex.test(email))
    errors.push('البريد الإلكتروني غير صحيح');

  if (!password || !passwordRegex.test(password))
    errors.push('كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل وتشمل حرف كبير وصغير ورقم');

  if (phone && !phoneRegex.test(phone))
    errors.push('رقم الهاتف غير صحيح');

  if (errors.length) return res.status(400).json({ message: errors[0], errors });

  // Check uniqueness
  const [emailExists, phoneExists] = await Promise.all([
    User.findOne({ email: email.toLowerCase().trim() }).lean(),
    phone ? User.findOne({ phone: phone.trim() }).lean() : null,
  ]);

  if (emailExists) return res.status(409).json({ message: 'البريد الإلكتروني مسجل مسبقاً' });
  if (phoneExists) return res.status(409).json({ message: 'رقم الهاتف مسجل مسبقاً' });

  next();
};
