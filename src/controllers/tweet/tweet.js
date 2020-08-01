const { Tweet, User, Like } = require("../../sequelize");
const { addTweetValidation } = require("../../utils/validation");

module.exports = {
  addTweet: async (req, res) => {
    // Joi validation checks
    const validation = addTweetValidation(req.body);
    if (validation.error)
      return res.status(400).json({ errors: validation.error.details });

    try {
      const data = await Tweet.create(req.body);
      return res.status(200).json(data);
    } catch (err) {
      return res.status(400).json({ errors: err });
    }
  },
  getTweet: async (req, res) => {
    // body -> {tweetId, username, myId}
    Promise.all([
      module.exports.getUserTweet(req.query.tweetId, req.query.username),
      module.exports.isLikedByMe(req.query.tweetId, req.query.myId),
      module.exports.isRetweetedByMe(req.query.tweetId, req.query.myId),
    ]).then((values) => {
      let tweet = { ...values[0] };
      tweet = { ...tweet, selfLiked: values[1] ? true : false };
      tweet = { ...tweet, selfRetweeted: values[2] ? true : false };
      return res.status(200).json({ tweet });
    });
  },
  removeTweet: async (req, res) => {
    res.status(200).json({});
  },
  getUserTweet: async (tweetId, username) => {
    const tweet = await User.findOne({
      attributes: ["firstname", "lastname", "username", "avatar"],
      where: {
        username: username,
      },
      include: {
        model: Tweet,
        where: {
          id: tweetId,
        },
        required: true,
      },
      raw: true,
    });
    return tweet;
  },
  isLikedByMe: async (tweetId, id) => {
    const like = await Like.findOne({
      where: {
        tweetId,
        userId: id,
      },
    });
    return like;
  },
  isRetweetedByMe: async (tweetId, id) => {
    const like = await Like.findOne({
      where: {
        tweetId,
        userId: id,
      },
    });
    return like;
  },
};
