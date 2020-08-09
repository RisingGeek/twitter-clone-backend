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
    const sql = `select Likes.tweetId from Likes inner join Users on Users.id=Likes.userId where Users.id='${id}'`;
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
    const sql = `select Retweets.tweetId from Retweets inner join Tweets on Tweets.id=Retweets.tweetId where Retweets.userId='${id}'`;
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
