const { Op } = require("sequelize");
const { User } = require("../sequelize");

module.exports = {
  searchUser: async (req, res) => {
    // query -> {search}
    const users = await User.findAll({
      attributes: ["id", "firstname", "lastname", "username", "avatar"],
      where: {
        [Op.or]: {
          firstname: {
            [Op.substring]: req.query.search,
          },
          lastname: {
            [Op.substring]: req.query.search,
          },
          username: {
            [Op.substring]: req.query.search,
          },
        },
      },
    });
    return res.status(200).json({ users });
  },
};
