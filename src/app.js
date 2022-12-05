require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const docs = require("./routes/docs");
const user = require("./routes/user");
const follower = require("./routes/follower");
const tweet = require("./routes/tweet");
const feed = require("./routes/feed");
const explore = require("./routes/explore");
const bookmarks = require("./routes/bookmarks");

const app = express();
app.use(cors())
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});
app.use("/", docs);
app.use("/user", user);
app.use("/follow", follower);
app.use("/tweet", tweet);
app.use("/feed", feed);
app.use("/explore", explore);
app.use("/bookmarks", bookmarks);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server started on port ${PORT}`));
