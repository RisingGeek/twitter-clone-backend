const { Sequelize } = require('sequelize');
const UserModel = require('./models/User');
const FollowerModel = require('./models/Follower');
const TweetModel = require('./models/Tweet');
const RetweetModel = require('./models/Retweet');
const LikeModel = require('./models/Like');

// Connect to database
const { db, username, password } = process.env;
const sequelize = new Sequelize(db, username, password, {
    host: 'localhost',
    dialect: 'mysql'
});
(async () => await sequelize.sync())();

const User = UserModel(sequelize);
const Follower = FollowerModel(sequelize);
const Tweet = TweetModel(sequelize);
const Retweet = RetweetModel(sequelize);
const Like = LikeModel(sequelize);

// User -> Follower association
User.hasMany(Follower, { as: 'Followers', foreignKey: 'follower' });
User.hasMany(Follower, { as: 'Following', foreignKey: 'followed' });

// User -> Tweet association
User.hasMany(Tweet, { foreignKey: 'userId' });

// User -> Like association
User.hasMany(Like, { foreignKey: 'userId' });

module.exports = {
    User,
    Follower,
    Tweet,
    Retweet,
    Like,
    sequelize
}
