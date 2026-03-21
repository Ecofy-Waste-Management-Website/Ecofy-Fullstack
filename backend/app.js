const express = require('express');
const mongoose = require('mongoose');

const app = express();

//Middleware 
app.use("/",(req, res , next) => {
  res.send('its working');
})

mongoose.connect("mongodb+srv://admin:3N19UCsBAoynTdFt@cluster0.samnfgm.mongodb.net/")
.then(()=> console.log("connected to MongoDB"))
.then(()=> {
  app.listen(5000);
})
.catch((err)=> console.log((err)));