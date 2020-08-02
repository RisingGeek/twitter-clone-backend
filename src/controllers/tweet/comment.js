const { Comment, Tweet } = require("../../sequelize");

module.exports = {
  addComment: async (req, res) => {
    // body -> {tweetId, userId, text}
    Promise.all([
      await Comment.create(req.body),
      await Tweet.increment("commentsCount", {
        by: 1,
        where: { id: req.body.tweetId },
      }),
    ]).then((values) => {
      console.log(values);
      return res.status(200).json({ comment: values[0] });
    });
  },
  removeComment: async (req, res) => {
    // body -> {tweetId, userId, id}
    Promise.all([
      await Comment.destroy({
        where: req.body,
      }),
      await Tweet.decrement("commentsCount", {
        by: 1,
        where: { id: req.body.tweetId },
      }),
    ]).then((values) => {
      console.log(values);
      return res.status(200).json({ comment: values[0] });
    });
  },
  getTweetComments: async (req, res) => {
    // body -> {tweetId}
    const comments = await Comment.findAll({
      where: req.body,
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).json({ comments });
  },
};
