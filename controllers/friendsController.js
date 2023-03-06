const Http = require("http-status-codes");
const User = require("../models/userModel");
module.exports = {
  followUser(req, res) {
    User.updateOne(
      {
        _id: req.user._id, // the user who is logged in
        "following.followingId": { $ne: req.body.followingId }, //req.body.followingId is the user who is being followed
      },
      {
        $push: {
          following: {
            //push the followingId into the following array
            followingId: req.body.followingId,
          },
        },
      }
    )
      .then(async (result) => {
        if (result) {
          await User.updateOne(
            {
              _id: req.body.followingId, //the user who is being followed
              "followers.followerId": { $ne: req.user._id }, //the user who is logged in
            },
            {
              $push: {
                followers: {
                  followerId: req.user._id, //the user who is logged in
                },
                notifications: {
                  senderId: req.user._id,
                  action: `${req.user.username} started following you`,
                },
              },
            }
          );
        }
        return res.status(Http.StatusCodes.OK).json({ message: "success" });
      })
      .catch((err) => {
        return res
          .status(Http.StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: err });
      });
  },
  unfollowUser(req, res) {
    User.updateOne(
      {
        _id: req.user._id, // the user who is logged in
      },
      {
        $pull: {
          following: {
            //pull the followingId into the following array
            followingId: req.body.followingId,
          },
        },
      }
    )
      .then(async (result) => {
        if (result) {
          await User.updateOne(
            {
              _id: req.body.followingId, //the user who is being followed
            },
            {
              $pull: { //pull the followerId from the followers array
                followers: {
                  followerId: req.user._id, //the user who is logged in
                },
              },
            }
          );
        }
        return res.status(Http.StatusCodes.OK).json({ message: "success unfollowed" });
      })
      .catch((err) => {
        return res
          .status(Http.StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: err });
      });
  },
};
