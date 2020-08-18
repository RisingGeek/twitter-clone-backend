const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('User', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        firstname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        avatar: {
            type: DataTypes.STRING,
            defaultValue: 'https://res.cloudinary.com/twitter-clone-media/image/upload/v1597737557/user_wt3nrc.png'
        },
        cover: {
            type: DataTypes.STRING
        },
        bio: {
            type: DataTypes.STRING
        },
        location: {
            type: DataTypes.STRING
        },
        dob: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
    });
};