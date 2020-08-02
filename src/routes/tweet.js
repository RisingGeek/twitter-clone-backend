const router = require("express").Router();
const {
  addTweet,
  getTweet,
  removeTweet,
} = require("../controllers/tweet/tweet");
const {
  likeTweet,
  unlikeTweet,
  getTweetLikes,
} = require("../controllers/tweet/like");
const {
  addRetweet,
  removeRetweet,
  getTweetRetweets,
} = require("../controllers/tweet/retweet");
const {
  addComment,
  removeComment,
  getTweetComments,
} = require("../controllers/tweet/comment");

router.post("/add-tweet", addTweet);
router.get("/get-tweet", getTweet);
router.delete("/remove", removeTweet);
router.delete("/remove-tweet", removeTweet);
router.post("/like/add", likeTweet);
router.delete("/like/remove", unlikeTweet);
router.get("/like/get-likes", getTweetLikes);
router.post("/retweet/add", addRetweet);
router.delete("/retweet/remove", removeRetweet);
router.get("/retweet/get-retweets", getTweetRetweets);
router.post("/comment/add", addComment);
router.delete("/comment/remove", removeComment);
router.get("/comment/get-comments", getTweetComments);

module.exports = router;
