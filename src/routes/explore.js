const router = require("express").Router();
const { searchUser } = require("../controllers/explore");

router.get("/", searchUser);

module.exports = router;
