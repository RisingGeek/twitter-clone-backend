const { getFeed } = require("../controllers/feed");

const router = require("express").Router();
const { whoFollow } = require("../controllers/feed");

router.get("/", getFeed);
router.get("/who-follow", whoFollow);

module.exports = router;
