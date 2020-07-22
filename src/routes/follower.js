const router = require('express').Router();
const { followUser, getDetails } = require('../controllers/follower');

router.post('/', followUser);
router.get('/details', getDetails);

module.exports = router;