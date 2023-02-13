const Joi = require("joi");
const Http = require("http-status-codes");
const Post = require("../models/postModel");
const User = require("../models/userModel");
module.exports = {
  addPost(req, res) {
    const schema = Joi.object({
      post: Joi.string().required(),
    }); //joi object schema

    const { value, error } = schema.validate(req.body); //validate schema with req body
    if (error) {
      return res
        .status(Http.StatusCodes.NOT_ACCEPTABLE)
        .json({ message: error.message });
    }

    const newPost = {
      post: req.body.post,
      username: req.user.username,
      userId: req.user._id,
    };

    Post.create(newPost)
      .then(async (post) => {
        await User.updateOne(
          { _id: req.user._id },
          {
            $push: {
              posts: {
                postId: post._id,
              },
            },
          }
        );
        return res
          .status(Http.StatusCodes.CREATED)
          .json({ message: "post created", post: post });
      })
      .catch((err) => {
        return res
          .status(Http.StatusCodes.BAD_REQUEST)
          .json({ message: err.message });
      });
  },
  async getAllPosts(req, res) {
    try {
      const posts = await Post.find({})
        .populate("userId")
        .sort({ createdAt: -1 });
      return res.status(Http.StatusCodes.OK).json(posts);
    } catch (error) {
      return res
        .status(Http.StatusCodes.BAD_REQUEST)
        .json({ message: error.message });
    }
  },

  async addLike(req, res) {
    const id = req.body._id;
    await Post.updateOne(
      { _id: id, "likes.username": { $ne: req.user.username } },
      {
        $push: {
          likes: {
            username: req.user.username,
          }
        },
        $inc: {
          totalLikes: 1
        }
      }
    ).then((result) => {
      return res.status(Http.StatusCodes.OK).json({ message: "liked" });
      
    }).catch((err) => {
      return res.status(Http.StatusCodes.BAD_REQUEST).json({ message: err.message });
    });;
  },
};
