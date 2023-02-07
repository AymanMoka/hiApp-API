const express = require("express");
const postController = require("../controllers/postController");
const auth = require("../helpers/auth");

const router = express.Router();

router.post("/post/add-post",auth.ensureAuthenticated,postController.addPost );


module.exports = router;
