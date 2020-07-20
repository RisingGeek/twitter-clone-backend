const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Follower', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        followe: {
            type: DataTypes.UUID,
            allowNull: false
        },
        follower: {
            type: DataTypes.UUID,
            allowNull: false
        }
    });
}