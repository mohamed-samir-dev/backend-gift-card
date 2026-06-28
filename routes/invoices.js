const router = require('express').Router();
const { getMyInvoices, getInvoice, getAllInvoices } = require('../controllers/invoiceController');
const { protect, admin } = require('../middleware/auth');

router.get('/',      protect, admin, getAllInvoices);
router.get('/mine',  protect, getMyInvoices);
router.get('/:id',   protect, getInvoice);

module.exports = router;
