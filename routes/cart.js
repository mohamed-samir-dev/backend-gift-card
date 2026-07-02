const router = require('express').Router();
const { protect } = require('../middleware/auth');
const Cart = require('../models/Cart');

// POST /api/cart/merge — merge guest cart into user's saved cart
router.post('/merge', protect, async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) return res.json({ ok: true });

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = new Cart({ user: req.user._id, items: [] });

    for (const guestItem of items) {
      const existing = cart.items.find(i => i.productId.toString() === guestItem.productId);
      if (existing) {
        existing.qty += guestItem.qty;
      } else {
        cart.items.push(guestItem);
      }
    }

    await cart.save();
    res.json({ ok: true, cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/cart — get user's saved cart
router.get('/', protect, async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  res.json(cart?.items || []);
});

// PUT /api/cart — save/update full cart
router.put('/', protect, async (req, res) => {
  try {
    const { items } = req.body;
    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items },
      { upsert: true, new: true }
    );
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
