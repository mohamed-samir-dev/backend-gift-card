const router = require('express').Router();
const { getUsers, getUser, updateUser, deleteUser, updateProfile } = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');

router.get('/',          protect, admin, getUsers);
router.get('/:id',       protect, admin, getUser);
router.put('/:id',       protect, admin, updateUser);
router.delete('/:id',    protect, admin, deleteUser);
router.put('/me/profile', protect, updateProfile);

module.exports = router;
