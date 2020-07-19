require('dotenv').config();
const express = require('express');
const app = express();
const user = require('./routes/user');
require('./sequelize')

app.use('/user', user);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server started on port ${PORT}`));