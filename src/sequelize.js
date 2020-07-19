const { Sequelize } = require('sequelize');

const { db, username, password } = process.env;
const sequelize = new Sequelize(db, username, password, {
    host: 'localhost',
    dialect: 'mysql'
});

(async function () {
    try {
        await sequelize.authenticate();
        console.log('connection established successfully');
    }
    catch (error) {
        console.log('some error occured', error);
    }
})();