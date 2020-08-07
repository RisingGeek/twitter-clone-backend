const router = require("express").Router();
const { getFeed, whoFollow } = require("../controllers/feed");

router.get("/", getFeed);
router.get("/who-follow", whoFollow);

module.exports = router;
