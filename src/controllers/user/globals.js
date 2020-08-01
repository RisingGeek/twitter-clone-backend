const { Op } = require("sequelize");
const { Retweet, Like, User, Tweet, sequelize } = require("../../sequelize");

module.exports = {
  getMyRetweets: async (id) => {
    const retweets = await Retweet.findAll({
      attributes: ["tweetId"],
      where: {
        userId: id,
      },
      raw: true,
    });
    return retweets;
  },
  getMyLikes: async (id) => {
    const likes = await Like.findAll({
      attributes: ["tweetId"],
      where: {
        userId: id,
      },
      raw: true,
    });
    return likes;
  },
  getLikedTweets: async (id, tweetAttributes) => {
    const sql = `select likes.tweetId from likes inner join users on users.id=likes.userId where users.id='${id}'`;
    const tweets = await User.findAll({
      attributes: ["firstname", "lastname", "username", "avatar"],
      include: {
        model: Tweet,
        required: true,
        attributes: tweetAttributes,
        where: {
          id: {
            [Op.in]: sequelize.literal(`(${sql})`),
          },
        },
      },
      raw: true,
    });
    return tweets;
  },
  getUserTweets: async (id, tweetAttributes) => {
    let tweets = await User.findAll({
      attributes: ["firstname", "lastname", "username", "avatar"],
      include: {
        model: Tweet,
        required: true,
        attributes: tweetAttributes,
        where: {
          userId: id,
        },
      },
      raw: true,
    });
    return tweets;
  },
  getUserRetweets: async (id, tweetAttributes) => {
    const sql = `select retweets.tweetId from retweets inner join tweets on tweets.id=retweets.tweetId where retweets.userId='${id}'`;
    let retweets = await User.findAll({
      attributes: ["firstname", "lastname", "username", "avatar"],
      include: {
        model: Tweet,
        required: true,
        attributes: tweetAttributes,
        where: {
          id: {
            [Op.in]: sequelize.literal(`(${sql})`),
          },
        },
      },
      raw: true,
    });
    return retweets;
  }
};
