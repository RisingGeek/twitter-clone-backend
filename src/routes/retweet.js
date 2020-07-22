const router = require('express').Router();
const { addRetweet } = require('../controllers/retweet');

router.post('/add-retweet', addRetweet);

module.exports = router;