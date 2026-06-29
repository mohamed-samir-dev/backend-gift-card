const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  category:    { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  title:       { type: String, required: true, trim: true },
  brief:       { type: String },
  description: { type: String },
  details:     { type: Map, of: String },
  image:       { type: String },
  price:       { type: Number, required: true },
  currency:    { type: String, default: 'USD' },
  isActive:         { type: Boolean, default: true },
  unlimitedStock:   { type: Boolean, default: false },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

// stock is computed from available cards — no manual field needed
productSchema.virtual('stock', {
  ref:          'Card',
  localField:   '_id',
  foreignField: 'product',
  count:        true,
  match:        { status: 'available' },
});

module.exports = mongoose.model('Product', productSchema);
