const Notification = require('../models/Notification');

exports.getMyNotifications = async (req, res) => {
  const notifs = await Notification.find({ user: req.user._id }).sort('-createdAt');
  res.json(notifs);
};

exports.markRead = async (req, res) => {
  await Notification.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { isRead: true });
  res.json({ message: 'Marked as read' });
};

exports.markAllRead = async (req, res) => {
  await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true });
  res.json({ message: 'All marked as read' });
};

exports.deleteNotification = async (req, res) => {
  await Notification.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  res.json({ message: 'Deleted' });
};
