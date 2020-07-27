const router = require('express').Router();
const { addTweet, likeTweet, unlikeTweet } = require('../controllers/tweet');

router.post('/add-tweet', addTweet);
router.post('/like', likeTweet);
router.delete('/unlike', unlikeTweet);

module.exports = router;
