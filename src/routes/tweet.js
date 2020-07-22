const router = require('express').Router();
const { addTweet, getTweetByUserId, likeTweet, unlikeTweet } = require('../controllers/tweet');

router.post('/add-tweet', addTweet);
router.get('/get-tweet', getTweetByUserId);
router.post('/like', likeTweet);
router.post('/unlike', unlikeTweet);

module.exports = router;