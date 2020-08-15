const router = require("express").Router();
const {
  getBookmarks,
  addBookmark,
  removeBookmark,
} = require("../controllers/bookmarks");

router.get("/", getBookmarks);
router.post("/add", addBookmark);
router.delete("/remove", removeBookmark);

module.exports = router;
