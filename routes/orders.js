const router = require('express').Router();
const { createOrder, getMyOrders, getOrder, getAllOrders } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

router.post('/',      protect, createOrder);
router.get('/',       protect, admin, getAllOrders);
router.get('/mine',   protect, getMyOrders);
router.get('/:id',    protect, getOrder);

module.exports = router;
