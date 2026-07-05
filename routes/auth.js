const router = require('express').Router();
const { register, login, googleAuth, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validateRegister } = require('../validators/authValidator');

router.post('/register', validateRegister, register);
router.post('/login',    login);
router.post('/google',   googleAuth);
router.get('/me',        protect, getMe);

module.exports = router;
