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
    module.exports.getMyFollowing(req.query.userId).then((res) => {
      const following = [];
      res.forEach((el) => following.push(el.id));
      Promise.all([
        module.exports.getTweets(following),
        // getRetweets(req.query.userId, following),
        // getLikes(req.query.userId, following),
      ]).then(values => {
        console.log(values)
      });
    });
  },
  whoFollow: async (req, res) => {
    // query -> userId
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
      offset: (req.query.page - 1) * 3,
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
    console.log(following)
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
      raw: true
    });
    return tweets;
  },
};
