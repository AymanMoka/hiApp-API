const Http = require("http-status-codes");
const User = require("../models/userModel");
module.exports = {
  getAllUsers(req, res) {
    User.find({}) //find all users
      .populate("posts.postId") //populate posts
      .populate("following.followingId") //populate following
      .populate("followers.followerId") //populate followers
      .then((result) => {
        return res.status(Http.StatusCodes.OK).json( result ); //return all users
      })
      .catch((err) => {
        return res
          .status(Http.StatusCodes.BAD_REQUEST) //return error
          .json({ message: err.message });
      });
  },
  getUser(req, res) {
    const userId = req.params.id;
    User.findOne({_id: userId}) //find user
      .populate("posts.postId") //populate posts
      .populate("following.followingId") //populate following
      .populate("followers.followerId") //populate followers
      .then((result) => {
        return res.status(Http.StatusCodes.OK).json( result); //return user
      })
      .catch((err) => {
        return res
          .status(Http.StatusCodes.BAD_REQUEST) //return error
          .json({ message: err.message });
      });
  },
};
