const router = require("express").Router();
const multer = require("multer");
const upload = multer();
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

router.post("/add-tweet", upload.single("media"), addTweet);
router.get("/get-tweet", getTweet);
router.delete("/remove", removeTweet);
router.delete("/remove-tweet", removeTweet);
router.post("/like/add", likeTweet);
router.delete("/like/remove", unlikeTweet);
router.get("/like/get-likes", getTweetLikes);
router.post("/retweet/add", addRetweet);
router.delete("/retweet/remove", removeRetweet);
router.get("/retweet/get-retweets", getTweetRetweets);
router.post("/comment/add", upload.single("media"), addComment);
router.delete("/comment/remove", removeComment);
router.get("/comment/get-comments", getTweetComments);

module.exports = router;
