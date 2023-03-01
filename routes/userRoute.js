const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.get("/all-users", userController.getAllUsers);

module.exports = router;
