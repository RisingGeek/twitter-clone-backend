const { Op } = require("sequelize");
const { Tweet, Bookmark, User, sequelize } = require("../sequelize");
const { bookmarkValidation } = require("../utils/validation");

module.exports = {
  tweetAttributes: [
    "id",
    "text",
    "media",
    "commentsCount",
    "retweetsCount",
    "likesCount",
    "createdAt",
  ],
  getBookmarks: async (req, res) => {
    // query -> {userId}
    const tweetIds = `SELECT tweetId from Bookmarks where userId='${req.query.userId}'`;
    const tweets = await User.findAll({
      attributes: ["firstname", "lastname", "username", "avatar"],
      include: {
        model: Tweet,
        required: true,
        attributes: module.exports.tweetAttributes,
        where: {
          id: {
            [Op.in]: sequelize.literal(`(${tweetIds})`),
          },
        },
      },
      order: [[Tweet, "createdAt", "DESC"]],
      raw: true,
    });
    return res.status(200).json({ tweets });
  },
  addBookmark: async (req, res) => {
    // body -> {userId, tweetId}
    const validation = bookmarkValidation(req.body);
    if (validation.error)
      return res.status(400).json({ errors: validation.error.details });

    const [bookmark, created] = await Bookmark.findOrCreate({
      where: req.body,
      defaults: req.body,
    });
    // If user tries to add bookmark more than once
    if (!created)
      return res
        .status(403)
        .json({ errors: "Tweet is already in the bookmark list" });

    return res.status(200).json({ bookmark });
  },
  removeBookmark: async (req, res) => {
    // body -> {userId, tweetId}
    const validation = bookmarkValidation(req.body);
    if (validation.error)
      return res.status(400).json({ errors: validation.error.details });
    const remBookmark = await Bookmark.destroy({
      where: req.body,
    });
    // If user tries to remove tweet from bookmark that is not added to bookmark
    if (remBookmark == 0)
      return res
        .status(403)
        .json({ errors: "Tweet is already not in the boomark list" });

    return res.status(200).json({ remBookmark });
  },
};
