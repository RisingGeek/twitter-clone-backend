const router = require("express").Router();
const { getFeed, whoFollow } = require("../controllers/feed");
const { verifyJwt } = require("../authorization");

router.get("/", verifyJwt, getFeed);
router.get("/who-follow", verifyJwt, whoFollow);

module.exports = router;
