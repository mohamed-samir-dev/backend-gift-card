const router = require('express').Router();
const { getCardsByProduct, addCard, bulkAddCards, updateCard, deleteCard } = require('../controllers/cardController');
const { protect, admin } = require('../middleware/auth');

router.get('/product/:productId', protect, admin, getCardsByProduct);
router.post('/',                  protect, admin, addCard);
router.post('/bulk',              protect, admin, bulkAddCards);
router.put('/:id',                protect, admin, updateCard);
router.delete('/:id',             protect, admin, deleteCard);

module.exports = router;
