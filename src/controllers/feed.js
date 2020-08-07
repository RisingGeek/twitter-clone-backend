const { Op } = require("sequelize");
const {
  User,
  Tweet,
  Retweet,
  Like,
  Follower,
  sequelize,
} = require("../sequelize");

module.exports = {
  getFeed: async (req, res) => {
    module.exports.getMyFollowing(req.query.userId).then((response) => {
      const following = [];
      response.forEach((el) => following.push(el.id));
      Promise.all([
        module.exports.getTweets(following),
        module.exports.getRetweets(following),
        module.exports.getLikes(following),
      ]).then((values) => {
        let tweets = values[0].concat(values[1]).concat(values[2]);
        const uniqueSet = new Set();
        tweets = tweets.filter((tweet) => {
          if (uniqueSet.has(tweet["Tweets.id"])) return false;
          uniqueSet.add(tweet["Tweets.id"]);
          return true;
        });

        return res.status(200).json({ tweets: tweets });
      });
    });
  },
  whoFollow: async (req, res) => {
    console.log("follow");
    // query -> {userId}
    // Get my following and don't select
    const following = `SELECT users.id FROM users INNER JOIN followers ON users.id = followers.followed WHERE follower = '${req.query.userId}'`;
    const whoFollow = await User.findAll({
      attributes: ["id", "firstname", "lastname", "username", "avatar"],
      where: {
        id: {
          [Op.not]: req.query.userId,
          [Op.notIn]: sequelize.literal(`(${following})`),
        },
      },
      limit: 3,
    });
    return res.status(200).json({ whoFollow });
  },
  getMyFollowing: async (id) => {
    const users = await User.findAll({
      attributes: ["id"],
      include: {
        model: Follower,
        as: "Following",
        required: true,
        attributes: [],
        where: {
          follower: id,
        },
      },
      raw: true,
    });
    return users;
  },
  getTweets: async (following) => {
    const tweets = await User.findAll({
      attributes: ["firstname", "lastname", "username", "avatar"],
      include: {
        model: Tweet,
        required: true,
        where: {
          userId: {
            [Op.in]: following,
          },
        },
      },
      raw: true,
    });
    return tweets;
  },
  getRetweets: async (following) => {
    const tweetIds = `SELECT tweets.id from tweets INNER JOIN retweets ON tweets.id = retweets.tweetId WHERE retweets.userId IN (${following
      .map((el) => "'" + el + "'")
      .toString()})`;
    const tweets = await User.findAll({
      attributes: ["firstname", "lastname", "username", "avatar"],
      include: {
        model: Tweet,
        required: true,
        where: {
          id: {
            [Op.in]: sequelize.literal(`(${tweetIds})`),
          },
        },
      },
      raw: true,
    });
    return tweets;
  },
  getLikes: async (following) => {
    const tweetIds = `SELECT tweets.id from tweets INNER JOIN likes ON tweets.id = likes.tweetId WHERE likes.userId IN (${following
      .map((el) => "'" + el + "'")
      .toString()})`;
    const tweets = await User.findAll({
      attributes: ["firstname", "lastname", "username", "avatar"],
      include: {
        model: Tweet,
        required: true,
        where: {
          id: {
            [Op.in]: sequelize.literal(`(${tweetIds})`),
          },
        },
      },
      raw: true,
    });
    return tweets;
  },
};
