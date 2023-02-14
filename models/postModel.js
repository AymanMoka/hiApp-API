const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  post: { type: String, required: true },
  usernmae: { type: String, default: "" },
  comments: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      comment: { type: String, required: true },
      username: { type: String, default: "" },
      createdAt: { type: Date, default: Date.now() },
    },
  ],
  totalLikes: { type: Number, default: 0 },
  likes: [
    {
      username: { type: String, default: "" },
    },
  ],
  createdAt: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("Post", postSchema);
