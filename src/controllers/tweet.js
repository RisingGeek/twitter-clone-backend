const { Tweet, Like } = require('../sequelize');
const { addTweetValidation } = require('../utils/validation');

module.exports = {
    addTweet: async (req, res) => {
        // Joi validation checks
        const validation = addTweetValidation(req.body)
        if (validation.error)
            return res.status(400).json({ data: validation.error.details });

        try {
            const data = await Tweet.create(req.body);
            return res.status(200).json(data);
        }
        catch (err) {
            return res.status(400).json({ data: err });
        }
    },
    likeTweet: async (req, res) => {
        const [like, created] = await Like.findOrCreate({
            where: req.body,
            defaults: req.body
        });
        // If user tries to like tweet more than once via POST request
        if (!created) {
            return res.status(403).json({ error: "Tweet is already liked by user" });
        }

        const tweet = await Tweet.findByPk(req.body.tweetId);
        await tweet.increment('likesCount');
        return res.status(200).json({ data: like });
    },
    unlikeTweet: async (req, res) => {
        const unlike = await Like.destroy({
            where: req.body
        });
        // If user tries to unlike tweet that is not liked via POST request 
        if (unlike == 0)
            return res.status(403).json({ error: "Tweet is already unliked by user" });

        const tweet = await Tweet.findByPk(req.body.tweetId);
        await tweet.decrement('likesCount');
        return res.status(200).json({ data: unlike });
    }
};