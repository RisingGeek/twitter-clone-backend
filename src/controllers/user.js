const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const { User, Tweet, sequelize } = require('../sequelize');
const { addUserValidation } = require('../utils/validation');

module.exports = {
    addUser: async (req, res) => {
        // Joi validation checks
        const validation = addUserValidation(req.body)
        if (validation.error)
            return res.status(400).json({ data: validation.error.details });

        try {
            // Create password hash
            let saltRounds = 10;
            const hash = await bcrypt.hash(req.body.password, saltRounds);
            req.body.password = hash;

            // Add user to User model
            const user = await User.create(req.body);
            return res.status(200).json({ data: user });
        }
        catch (err) {
            let errors = [];
            console.log(err.errors)
            err.errors.map(e => {
                if (e.path === 'users.username' && e.validatorKey === 'not_unique')
                    errors.push('Username is taken');
                if (e.path === 'users.email' && e.validatorKey === 'not_unique')
                    errors.push('Email id is already registered');
            });
            return res.status(400).json({ data: errors });
        }
    },
    editUser: async (req, res) => {
        try {
            const user = await User.update(
                req.body,
                { where: { id: req.body.id } }
            );
            return res.status(200).json({ data: user });
        }
        catch (error) {
            return res.status(400).json({ data: error });
        }
    },
    loginUser: async (req, res) => {
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { username: req.body.user },
                    { email: req.body.user }
                ],
            }
        });
        if (!user)
            return res.status(401).json({ data: "Incorrect username/email" });

        const match = await bcrypt.compare(req.body.password, user.password);
        return match ? res.status(200).json({ data: user }) : res.status(401).json({ data: "Incorrect password" });
    },
    getTweetsByUserId: async (req, res) => {
        return res.status(200).json(await Tweet.findAll({
            where: {
                userId: req.query.userId
            }
        }));
    },
    getLikesByUserId: async (req, res) => {
        const sql = `select likes.tweetId from likes inner join users on users.id=likes.userId where users.id='${req.query.userId}'`;
        const tweets = await Tweet.findAll({
            where: {
                id: {
                    [Op.in]: sequelize.literal(`(${sql})`)
                }
            }
        });
        return res.status(200).json({ data: tweets })

    }
}
