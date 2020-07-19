const router = require('express').Router();
const { editUser } = require('../controllers/user');

router.get('/edit-user', editUser);

module.exports = router;