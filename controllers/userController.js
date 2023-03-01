const Http = require("http-status-codes");
const User = require("../models/userModel");
module.exports = {
  getAllUsers(req, res) {
    User.find({}) //find all users
      .populate("posts.postId") //populate posts
      .then((result) => {
        return res.status(Http.StatusCodes.OK).json( result ); //return all users
      })
      .catch((err) => {
        return res
          .status(Http.StatusCodes.BAD_REQUEST) //return error
          .json({ message: err.message });
      });
  },
};
