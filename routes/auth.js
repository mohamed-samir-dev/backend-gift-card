const router = require('express').Router();
const { register, login, googleAuth, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validateRegister } = require('../validators/authValidator');
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'محاولات كثيرة جداً، حاول بعد 15 دقيقة' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', validateRegister, register);
router.post('/login',    loginLimiter, login);
router.post('/google',   googleAuth);
router.get('/me',        protect, getMe);

module.exports = router;
