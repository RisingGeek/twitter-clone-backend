const { Sequelize } = require('sequelize');
const UserModel = require('./models/User');
const FollowerModel = require('./models/Follower');

// Connect to database
const { db, username, password } = process.env;
const sequelize = new Sequelize(db, username, password, {
    host: 'localhost',
    dialect: 'mysql'
});
(async () => await sequelize.sync())();

const User = UserModel(sequelize);
const Follower = FollowerModel(sequelize);

// Follower association
User.belongsToMany(User, {through: Follower, as: 'Followers', foreignKey: 'followe'});
User.belongsToMany(User, {through: Follower, as: 'Following', foreignKey: 'follower'});

module.exports = {
    User,
    Follower
}