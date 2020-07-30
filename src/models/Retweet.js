const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Retweet', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        tweetId: {
            type: DataTypes.UUID,
            allowNull: false
        }
    });
};
