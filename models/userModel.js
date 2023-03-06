const { string } = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  posts: [
    {
      postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    },
  ],
  followers: [
    {
      followerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
  ],
  following: [
    {
      followingId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
  ],
  notifications: [
    {
      senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      action: { type: String },
      viewProfile: { type: Boolean, default: false },
      created: { type: Date, default: Date.now() },
      read: { type: Boolean, default: false },
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
