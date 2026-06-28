const router = require('express').Router();
const { getMyWallet, recharge, getTransactions, adminAdjust } = require('../controllers/walletController');
const { protect, admin } = require('../middleware/auth');

router.get('/',            protect, getMyWallet);
router.post('/recharge',   protect, recharge);
router.get('/transactions', protect, getTransactions);
router.post('/adjust',     protect, admin, adminAdjust);

module.exports = router;
