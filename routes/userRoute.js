const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.get("/all-users", userController.getAllUsers);
router.get("/user/:id", userController.getUser);

module.exports = router;
