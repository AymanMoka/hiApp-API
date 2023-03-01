const Http = require("http-status-codes");
const User = require("../models/userModel");
module.exports = {
  async followUser(req, res) {
    const followUser = async () => {
      await User.updateOne(
        {
          _id: req.user._id, //update user
          "following.followingId": { $ne: req.body.followingId }, //if following id is not equal to following id
        },
        {
          $push: {
            following: {
              followingId: req.body.followingId, //push following id to following
            },
          },
        }
      ),
        await User.updateOne(
          {
            _id: req.body.followingId, //update sec user
            "followers.followerId": { $ne: req.user._id }, //if follower id is not equal to user id
          },
          {
            $push: {
              followers: {
                followerId: req.user._id, //push user id to followers
              },
            },
          }
        );
    };
    followUser()
      .then(() => {
        res.status(Http.StatusCodes.OK).json({ message: "User followed" }); //return success
      })
      .catch((err) => {
        res
          .status(Http.StatusCodes.INTERNAL_SERVER_ERROR) //return error
          .json({ message: err });
      });
  },
};
