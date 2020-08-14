const router = require("express").Router();
const { addRetweet } = require("../controllers/retweet");
const { verifyJwt } = require("../authorization");

router.post("/add-retweet", verifyJwt, addRetweet);

module.exports = router;
