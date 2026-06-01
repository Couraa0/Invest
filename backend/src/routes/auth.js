const router = require('express').Router();
const { register, login, getMe, googleLogin } = require('../controllers/authController');
const authMiddleware = require('../middlewares/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.get('/me', authMiddleware, getMe);

module.exports = router;
