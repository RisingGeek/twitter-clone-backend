const router = require('express').Router();
const { addTweet } = require('../controllers/tweet');

router.post('/add-tweet', addTweet)

module.exports = router;