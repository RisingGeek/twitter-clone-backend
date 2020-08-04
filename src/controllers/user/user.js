const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const { User, Tweet, sequelize } = require("../../sequelize");
const { addUserValidation } = require("../../utils/validation");
const {
  getMyRetweets,
  getMyLikes,
  getLikedTweets,
  getUserTweets,
  getUserRetweets,
} = require("./globals");

module.exports = {
  tweetAttributes: [
    "id",
    "text",
    "commentsCount",
    "retweetsCount",
    "likesCount",
    "createdAt",
  ],
  addUser: async (req, res) => {
    // Joi validation checks
    const validation = addUserValidation(req.body);
    if (validation.error)
      return res.status(400).json({ errors: validation.error.details });

    try {
      // Create password hash
      let saltRounds = 10;
      const hash = await bcrypt.hash(req.body.password, saltRounds);
      req.body.password = hash;

      // Add user to User model
      const user = await User.create(req.body);
      return res.status(200).json({ user });
    } catch (err) {
      let errors = {};
      console.log(err.errors);
      err.errors.map((e) => {
        if (e.path === "users.username" && e.validatorKey === "not_unique")
          errors.username = "Username is taken";
        if (e.path === "users.email" && e.validatorKey === "not_unique")
          errors.email = "Email id is already registered";
      });
      return res.status(400).json({ errors });
    }
  },
  editUser: async (req, res) => {
    try {
      const user = await User.update(req.body, { where: { id: req.body.id } });
      return res.status(200).json({ user });
    } catch (error) {
      return res.status(400).json({ errors: error });
    }
  },
  loginUser: async (req, res) => {
    const user = await User.findOne({
      where: {
        [Op.or]: [{ username: req.body.user }, { email: req.body.user }],
      },
    });
    if (!user)
      return res.status(401).json({ user: "Incorrect username/email" });

    const match = await bcrypt.compare(req.body.password, user.password);
    return match
      ? res.status(200).json({ user })
      : res.status(401).json({ password: "Incorrect password" });
  },
  getUserByUsername: async (req, res) => {
    const user = await User.findOne({
      where: {
        username: req.query.username,
      },
    });
    return res.status(200).json(user);
  },
  getTweetsByUserId: async (req, res) => {
    // body -> {userId, myId}
    /* 
      1. Get tweets, retweets made by user. Get tweetIds retweeted and liked by me
      2. Add tweetIds of retweets and likes in 2 Sets
      3. Map over all tweets to add selfRetweeted -> true and selfLiked -> true
    */
    Promise.all([
      getUserTweets(req.query.userId, module.exports.tweetAttributes),
      getUserRetweets(req.query.userId, module.exports.tweetAttributes),
      getMyLikes(req.query.myId),
      getMyRetweets(req.query.myId),
    ]).then((values) => {
      const likeSet = new Set();
      const retweetSet = new Set();
      values[2].map((tweet) => likeSet.add(tweet.tweetId));
      values[3].map((tweet) => retweetSet.add(tweet.tweetId));
      let retweets = values[1].map((retweet) => ({
        ...retweet,
        isRetweet: true,
      }));
      let tweets = values[0]
        .concat(retweets)
        .sort((a, b) => b["Tweets.createdAt"] - a["Tweets.createdAt"]);

      console.log(tweets);
      tweets = tweets.map((tweet) => {
        let deepCopy = { ...tweet };
        if (retweetSet.has(tweet["Tweets.id"])) deepCopy.selfRetweeted = true;
        if (likeSet.has(tweet["Tweets.id"])) deepCopy.selfLiked = true;
        return deepCopy;
      });
      res.status(200).json({ tweets });
    });
  },
  getLikesByUserId: async (req, res) => {
    // body -> {userId, myId}
    /* 
      1. Get tweets liked by user and tweetIds retweeted and liked by me
      2. Add tweetIds of retweets and likes (and retweets by user) in 3 Sets
      3. Map over liked tweets to add selfRetweeted -> true and selfLiked -> true and isRetweet -> true
    */

    Promise.all([
      getLikedTweets(req.query.userId, module.exports.tweetAttributes),
      getMyRetweets(req.query.myId),
      getMyLikes(req.query.myId),
      getMyRetweets(req.query.userId),
    ]).then((values) => {
      let likedTweets = values[0];
      const retweetSet = new Set();
      const likeSet = new Set();
      const userRetweetSet = new Set();
      values[1].map((tweet) => retweetSet.add(tweet.tweetId));
      values[2].map((tweet) => likeSet.add(tweet.tweetId));
      values[3].map((tweet) => userRetweetSet.add(tweet.tweetId));
      likedTweets = likedTweets.map((tweet) => {
        let deepCopy = { ...tweet };
        if (retweetSet.has(tweet["Tweets.id"])) deepCopy.selfRetweeted = true;
        if (likeSet.has(tweet["Tweets.id"])) deepCopy.selfLiked = true;
        if (userRetweetSet.has(tweet["Tweets.id"])) deepCopy.isRetweet = true;
        return deepCopy;
      });
      return res.status(200).json({ tweets: likedTweets });
    });
  },
};
