const express = require('express');
const mongoose = require('mongoose');
const router = require("./Route/UserRoute")
const app = express();

//Middleware 
app.use("/users",router);

mongoose.connect("mongodb+srv://admin:3N19UCsBAoynTdFt@cluster0.samnfgm.mongodb.net/")
.then(()=> console.log("connected to MongoDB"))
.then(()=> {
  app.listen(5000);
})
.catch((err)=> console.log((err)));