const router = require("express").Router();
const {
  addTweet,
  likeTweet,
  unlikeTweet,
  addRetweet,
  removeRetweet,
} = require("../controllers/tweet");

router.post("/add-tweet", addTweet);
router.post("/like/add", likeTweet);
router.delete("/like/remove", unlikeTweet);
router.post("/retweet/add", addRetweet);
router.delete("/retweet/remove", removeRetweet);

module.exports = router;
