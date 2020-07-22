const { Tweet } = require('../sequelize');
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
    }
};
