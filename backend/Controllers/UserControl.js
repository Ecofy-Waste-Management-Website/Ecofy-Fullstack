const User = require("../Model/UserModule");
const jwt = require("jsonwebtoken");

const createUser = async(req, res) => {
    try{
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json({ message : "User created Successfully !" , user : newUser });
    }catch(err){
        console.log(err);
        res.status(500).json({message : "Internal server Error"});
    }
};

const login = async(req , res) =>{
    try{
        //read the id 
        const {email} = req.body;

        //check the guest list 
        const user = await User.findOne({ email : email });

        //check the user is in the database 
        if(!user){
            return res.status(404).json({ message : "user not found !"}) ; 
        }

    }catch(err){

    }
};

module.exports = {createUser , login}