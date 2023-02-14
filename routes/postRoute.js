const express = require("express");
const postController = require("../controllers/postController");
const auth = require("../helpers/auth");

const router = express.Router();

router.post("/post/add-post", auth.ensureAuthenticated, postController.addPost);
router.post(
  "/post/add-comment",
  auth.ensureAuthenticated,
  postController.addComment
);
router.post(
  "/post/like-post",
  auth.ensureAuthenticated,
  postController.addLike
);
router.get("/post/all", auth.ensureAuthenticated, postController.getAllPosts);
router.get("/post/:id", auth.ensureAuthenticated, postController.getPost);

module.exports = router;
