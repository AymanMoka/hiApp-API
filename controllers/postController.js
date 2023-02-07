const Joi = require("joi");
const Http = require("http-status-codes");
const Post = require("../models/postModel");
module.exports = {
  addPost(req, res) {
    console.log(req.body);
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
      .then((post) => {
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
};
