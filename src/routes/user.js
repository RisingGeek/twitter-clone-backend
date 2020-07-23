const router = require('express').Router();
const { addUser, editUser, loginUser, getLikesByUserId, getTweetsByUserId } = require('../controllers/user');

router.post('/add-user', addUser);
router.put('/edit-user', editUser);
router.post('/login-user', loginUser);
router.get('/get-tweets', getTweetsByUserId);
router.get('/get-likes', getLikesByUserId);

module.exports = router;