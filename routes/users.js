const router = require('express').Router();
const { updateProfile, getCurrentUser } = require('../controllers/users');
const { updateProfileValidate } = require('../middlewares/validation');

router.get('/me', getCurrentUser);
router.patch('/me', updateProfileValidate, updateProfile);

module.exports = router;
