const router = require('express').Router();
const { getSettings, updateSettings } = require('../controllers/settingController');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/',  getSettings);
router.put('/',  protect, admin, upload.single('logo'), updateSettings);

module.exports = router;
