const path = require("path");

const express = require("express");

const userController = require("../controllers/user-controller");

const router = express.Router();

// /users => POST
router.post("/signUp", userController.postUsers);

module.exports = router;
