const router = require("express").Router();
const { addTweet, likeTweet, unlikeTweet, addRetweet } = require("../controllers/tweet");

router.post("/add-tweet", addTweet);
router.post("/like", likeTweet);
router.delete("/unlike", unlikeTweet);
router.post("/retweet", addRetweet);

module.exports = router;
