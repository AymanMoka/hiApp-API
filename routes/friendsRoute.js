const express = require("express");
const friendsRoute = require("../controllers/friendsController");
const auth = require("../helpers/auth");

const router = express.Router();

router.post("/follow-user", auth.ensureAuthenticated,friendsRoute.followUser);
router.post("/unfollow-user", auth.ensureAuthenticated,friendsRoute.unfollowUser);

module.exports = router;
