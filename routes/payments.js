const router = require('express').Router();
const { getMyPayments, getAllPayments, getPayment } = require('../controllers/paymentController');
const { protect, admin } = require('../middleware/auth');

router.get('/',       protect, admin, getAllPayments);
router.get('/mine',   protect, getMyPayments);
router.get('/:id',    protect, getPayment);

module.exports = router;
