require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const user = require('./routes/user');
const follower = require('./routes/follower');
const tweet = require('./routes/tweet');
const retweet = require('./routes/retweet');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/user', user);
app.use('/follow', follower);
app.use('/tweet', tweet)
app.use('/retweet', retweet);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server started on port ${PORT}`));