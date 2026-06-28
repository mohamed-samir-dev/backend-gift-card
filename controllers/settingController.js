const Setting = require('../models/Setting');

exports.getSettings = async (req, res) => {
  let settings = await Setting.findOne();
  if (!settings) settings = await Setting.create({});
  res.json(settings);
};

exports.updateSettings = async (req, res) => {
  let settings = await Setting.findOne();
  if (!settings) settings = await Setting.create(req.body);
  else Object.assign(settings, req.body);
  await settings.save();
  res.json(settings);
};
