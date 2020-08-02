const { getFeed } = require("../controllers/feed");

const router = require("express").Router();
const {} = require("../controllers/feed");

router.get("/", getFeed);

module.exports = router;
