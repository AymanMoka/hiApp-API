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
    if (error) { //if error
      return res 
        .status(Http.StatusCodes.NOT_ACCEPTABLE)
        .json({ message: error.message }); //return error
    }

    const newPost = {
      post: req.body.post,
      username: req.user.username,
      userId: req.user._id,
    }; //create new post

    Post.create(newPost)  //create post
      .then(async (post) => { 
        await User.updateOne( 
          { _id: req.user._id }, //update user
          {
            $push: { //push post id to user
              posts: {
                postId: post._id, //get post id
              },
            },
          }
        );
        return res
          .status(Http.StatusCodes.CREATED)
          .json({ message: "post created", post: post }); //return success
      })
      .catch((err) => {
        return res
          .status(Http.StatusCodes.BAD_REQUEST)
          .json({ message: err.message }); //return error
      });
  },
  async getAllPosts(req, res) {
    try {
      const posts = await Post.find({}) //find all posts
        .populate("userId") //populate user
        .sort({ createdAt: -1 }); //sort by date
      return res.status(Http.StatusCodes.OK).json(posts); //return posts
    } catch (error) {
      return res
        .status(Http.StatusCodes.BAD_REQUEST)
        .json({ message: error.message }); //return error
    }
  },
  async addLike(req, res) {
    const id = req.body._id; //get post id
    await Post.updateOne( 
      { _id: id, "likes.username": { $ne: req.user.username } }, //check if user has already liked post
      {
        $push: {
          likes: {
            username: req.user.username, //get username from token
          },
        },
        $inc: {
          totalLikes: 1, //increment total likes
        },
      }
    )
      .then((result) => {
        return res.status(Http.StatusCodes.OK).json({ message: "liked" }); //return success
      })
      .catch((err) => {
        return res
          .status(Http.StatusCodes.BAD_REQUEST)
          .json({ message: err.message }); //return error
      });
  },

  async addComment(req, res) {
    const id = req.body.postId; //get post id
    const comment = req.body.comment; //get comment
    await Post.updateOne( //update post
      { _id: id },
      {
        $push: {
          comments: { //push comment
            userId: req.user._id, //get user id from token
            comment: req.body.comment, //get comment from req body
            username: req.user.username, //get username from token
          },
        },
      }
    )
      .then((result) => {
        return res
          .status(Http.StatusCodes.OK)
          .json({ message: "comment added" }); //return success
      })
      .catch((err) => {
        return res
          .status(Http.StatusCodes.BAD_REQUEST)
          .json({ message: err.message }); //return error
      });
  },

  getPost(req, res) {
    const id = req.params.id;
    Post.findOne({ _id: id }) //find post
      .populate("userId") //populate user
      .populate("comments.userId") //populate comments
      .then((result) => {
        return res.status(Http.StatusCodes.OK).json( result ); //return post
      })
      .catch((err) => {
        return res
          .status(Http.StatusCodes.BAD_REQUEST) //return error
          .json({ message: err.message });
      });
  },
};
