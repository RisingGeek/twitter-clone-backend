const { User } = require('../sequelize');
const bcrypt = require('bcrypt');
const { addUserValidation } = require('../utils/validation');

module.exports = {
    addUser: async (req, res) => {
        const validation = addUserValidation(req.body)
        // Joi validation checks
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
            console.log(err)
            err.errors.map(e => {
                if (e.path === 'users.username' && e.validatorKey === 'not_unique')
                    errors.push('Username is taken');
                if (e.path === 'users.Users_email_unique' && e.validatorKey === 'not_unique')
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
    }
}