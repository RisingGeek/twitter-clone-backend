require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const user = require('./routes/user');

const app = express();
app.use(bodyParser.json());
app.use('/user', user);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server started on port ${PORT}`));