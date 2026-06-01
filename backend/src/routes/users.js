const router = require('express').Router();
const { getUserById, createUser, updateUser } = require('../controllers/userController');

router.get('/:id', getUserById);
router.post('/', createUser);
router.patch('/:id', updateUser);

module.exports = router;
