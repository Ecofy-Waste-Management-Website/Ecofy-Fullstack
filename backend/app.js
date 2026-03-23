require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRouter = require("./Route/UserRoute")
const app = express();

//Middleware 
app.use(cors());
app.use(express.json());
app.use("/users",userRouter);


mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log("connected to MongoDB"))
.catch((err)=> console.log((err)));

const PORT = process.env.PORT || 5000;
app.listen(PORT , () =>{
  console.log(`Server is running ! ${PORT}`);
});