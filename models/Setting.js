const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  siteName:        { type: String, default: 'Gift Card Store' },
  logo:            { type: String },
  currency:        { type: String, default: 'USD' },
  supportEmail:    { type: String },
  tax:             { type: Number, default: 0 },
  maintenanceMode: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Setting', settingSchema);
