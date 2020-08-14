const { User, Follower } = require("../sequelize");

module.exports = {
  followUser: async (req, res) => {
    // body -> {followedId, followerId}
    const body = {
      followed: req.body.followedId,
      follower: req.body.followerId,
    };
    const alreadyFollowing = await Follower.findOne({
      where: body,
    });

    return alreadyFollowing
      ? res.status(200).json(await Follower.destroy({ where: body }))
      : res.status(200).json(await Follower.create(body));
  },
  getDetails: async (req, res) => {
    // body -> {id, myId}
    // Get Followers and Following
    const values = await Promise.all([
      module.exports.getFollowers(req.query.id),
      module.exports.getFollowing(req.query.id),
      module.exports.getFollowers(req.query.myId),
      module.exports.getFollowing(req.query.myId),
    ]);
    let followers = values[0];
    let following = values[1];
    const followersSet = new Set();
    const followingSet = new Set();
    values[2].map((item) => followersSet.add(item.id));
    values[3].map((item) => followingSet.add(item.id));
    followers = followers.map((item) => {
      let deepCopy = { ...item };
      if (followersSet.has(item.id)) deepCopy.isFollower = true;
      if (followingSet.has(item.id)) deepCopy.isFollowing = true;
      return deepCopy;
    });
    following = following.map((item) => {
      let deepCopy = { ...item };
      if (followersSet.has(item.id)) deepCopy.isFollower = true;
      if (followingSet.has(item.id)) deepCopy.isFollowing = true;
      return deepCopy;
    });
    return res.status(200).json({
      followers,
      following,
    });
  },
  getFollowers: async (id) => {
    const followers = await User.findAll({
      attributes: [
        "id",
        "firstname",
        "lastname",
        "username",
        "email",
        "avatar",
        "bio",
      ],
      include: {
        model: Follower,
        as: "Followers",
        required: true,
        attributes: [],
        where: {
          followed: id,
        },
      },
      raw: true,
    });
    return followers;
  },
  getFollowing: async (id) => {
    const following = await User.findAll({
      attributes: [
        "id",
        "firstname",
        "lastname",
        "username",
        "email",
        "avatar",
        "bio",
      ],
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
    return following;
  },
};
