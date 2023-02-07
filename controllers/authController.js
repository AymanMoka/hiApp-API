const Joi = require("joi");
const Http = require("http-status-codes");
const User = require("../models/userModel");
const Helper = require("../helpers/helper");
const Bcrypt = require("bcryptjs");
const Jwt = require("jsonwebtoken");
module.exports = {
  async createUser(req, res) {
    const schema = Joi.object({
      username: Joi.string().required().min(3),
      email: Joi.string()
        .required()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .messages({
          "string.email": "email must be a valid email",
        }),
      password: Joi.string().required().min(6).max(30).messages({
        "string.min": "password can't be less than 6 char ",
        "string.max": "password must be less than or equal to 30 char",
      }),
      repeatPassword: Joi.string()
        .required()
        .valid(Joi.ref("password"))
        .messages({ "any.only": "Password must matching" }),
    }); //joi object schema

    const { value, error } = schema.validate(req.body); //validate schema with req body
    if (error) {
      return res
        .status(Http.StatusCodes.NOT_ACCEPTABLE)
        .json({ message: error.message });
    }

    const userName = await User.findOne({
      username: Helper.capitalize(req.body.username),
    });
    if (userName) {
      return res
        .status(Http.StatusCodes.CONFLICT)
        .json({ message: "Username already exsit" });
    }
    const emailAddress = await User.findOne({
      email: req.body.email.toLowerCase(),
    });
    if (emailAddress) {
      return res
        .status(Http.StatusCodes.CONFLICT)
        .json({ message: "Email already exsit" });
    }

    return Bcrypt.hash(value.password, 10, (err, hash) => {
      if (err) {
        return res
          .status(Http.StatusCodes.BAD_REQUEST)
          .json({ message: err.message });
      }
      const newUser = {
        username: Helper.capitalize(req.body.username),
        email: req.body.email.toLowerCase(),
        password: hash,
      };

      User.create(newUser)
        .then((user) => {
          const token = Jwt.sign({ user: user }, process.env.secret_for_token, {
            expiresIn: "1d",
          });
          res.cookie("token", token);
          return res
            .status(Http.StatusCodes.CREATED)
            .json({ message: "user created", user: user, token: token });
        })
        .catch((err) => {
          return res
            .status(Http.StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: err.message });
        });
    });
  },

  loginUser(req, res) {
    if (!req.body.username || !req.body.password) {
      return res
        .status(Http.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Username and password is a must !!" });
    }

    User.findOne({ username: Helper.capitalize(req.body.username) })
      .then((user) => {
        if (!user) {
          return res
            .status(Http.StatusCodes.NOT_FOUND)
            .json({ message: "Username not found" });
        }
        return Bcrypt.compare(req.body.password, user.password)
          .then((result) => {
            if (!result) {
              return res
                .status(Http.StatusCodes.NOT_ACCEPTABLE)
                .json({ message: "Password not correct !!" });
            }
            const token = Jwt.sign(
              { user: user },
              process.env.secret_for_token,
              { expiresIn: "1d" }
            );
             res.cookie("token", token);
            return res
              .status(Http.StatusCodes.OK)
              .json({ message: "logged in", token: token });
          })
          .catch((err) => {
            return res
              .status(Http.StatusCodes.INTERNAL_SERVER_ERROR)
              .json({ err: err.message });
          });
      })
      .catch((err) => {
        return res
          .status(Http.StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ err: err.message });
      });
  },
};
