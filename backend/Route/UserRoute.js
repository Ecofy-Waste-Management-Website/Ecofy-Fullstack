const express = require("express");
const router = express.Router();
const {createUser} = require("../Controllers/UserControl");

router.post("/signup",createUser);



module.exports = router;