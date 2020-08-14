const router = require("express").Router();
const { followUser, getDetails } = require("../controllers/follower");
const { verifyJwt } = require("../authorization");

router.post("/", verifyJwt, followUser);
router.get("/details", getDetails);

module.exports = router;
