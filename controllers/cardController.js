const Card = require('../models/Card');

exports.getCardsByProduct = async (req, res) => {
  const cards = await Card.find({ product: req.params.productId });
  res.json(cards);
};

exports.addCard = async (req, res) => {
  const card = await Card.create(req.body);
  res.status(201).json(card);
};

exports.bulkAddCards = async (req, res) => {
  // req.body.cards = array of card objects
  const cards = await Card.insertMany(req.body.cards);
  res.status(201).json({ inserted: cards.length });
};

exports.updateCard = async (req, res) => {
  const card = await Card.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!card) return res.status(404).json({ message: 'Card not found' });
  res.json(card);
};

exports.deleteCard = async (req, res) => {
  await Card.findByIdAndDelete(req.params.id);
  res.json({ message: 'Card deleted' });
};
