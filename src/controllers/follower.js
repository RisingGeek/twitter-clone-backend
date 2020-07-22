const { User, Follower } = require('../sequelize');

module.exports = {
    followUser: async (req, res) => {
        // body -> {followeId, followerId}
        const body = {
            followed: req.body.followedId,
            follower: req.body.followerId
        }
        const alreadyFollowing = await Follower.findOne({
            where: body
        });

        return alreadyFollowing ?
            res.status(200).json(await Follower.destroy({ where: body })) :
            res.status(200).json(await Follower.create(body));
    },
    getDetails: async (req, res) => {
        // body -> {id}
        // Get Followers and Following
        const data = await Promise.all([
            await User.findAll({
                attributes: ['id', 'firstname', 'lastname', 'username', 'email', 'avatar', 'bio'],
                include: {
                    model: Follower,
                    as: 'Followers',
                    required: true,
                    attributes: [],
                    where: {
                        followed: req.query.id
                    }
                }
            }),
            await User.findAll({
                attributes: ['id', 'firstname', 'lastname', 'username', 'email', 'avatar', 'bio'],
                include: {
                    model: Follower,
                    as: 'Following',
                    required: true,
                    attributes: [],
                    where: {
                        follower: req.query.id
                    }
                }
            })
        ]);
        return res.status(200).json(data);
    }
}