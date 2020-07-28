const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const { User, Tweet, sequelize } = require('../sequelize');
const { addUserValidation } = require('../utils/validation');

module.exports = {
    addUser: async (req, res) => {
        // Joi validation checks
        const validation = addUserValidation(req.body)
        if (validation.error)
            return res.status(400).json({ errors: validation.error.details });

        try {
            // Create password hash
            let saltRounds = 10;
            const hash = await bcrypt.hash(req.body.password, saltRounds);
            req.body.password = hash;

            // Add user to User model
            const user = await User.create(req.body);
            return res.status(200).json({ user });
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
            return res.status(400).json({ errors });
        }
    },
    editUser: async (req, res) => {
        try {
            const user = await User.update(
                req.body,
                { where: { id: req.body.id } }
            );
            return res.status(200).json({ user });
        }
        catch (error) {
            return res.status(400).json({ errors: error });
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
            return res.status(401).json({ user: "Incorrect username/email" });

        const match = await bcrypt.compare(req.body.password, user.password);
        return match ? res.status(200).json({ user }) : res.status(401).json({ password: "Incorrect password" });
    },
    getUserByUsername: async (req, res) => {
        const user = await User.findOne({
            where: {
                username: req.query.username
            }
        });
        return res.status(200).json(user);
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
        return res.status(200).json({ tweets })

    }
}
