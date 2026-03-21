const express = require("express");
const router = express.Router();

const User = require("../Model/UserModule");

const UserController = require("../Controlers/userControl");

router.get("/",UserController.getAllUsers)

module.exports = router;