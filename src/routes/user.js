const router = require('express').Router();
const { addUser, editUser } = require('../controllers/user');

router.post('/add-user', addUser);
router.post('/edit-user', editUser);

module.exports = router;