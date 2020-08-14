const router = require("express").Router();
const {
  addUser,
  editUser,
  loginUser,
  getUserByUsername,
  getLikesByUserId,
  getTweetsByUserId,
} = require("../controllers/user/user");
const { verifyJwt } = require("../authorization");

router.post("/add-user", addUser);
router.put("/edit-user", verifyJwt, editUser);
router.post("/login-user", loginUser);
router.get("/get-user", getUserByUsername);
router.get("/get-tweets", getTweetsByUserId);
router.get("/get-likes", getLikesByUserId);

module.exports = router;
