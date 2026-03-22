const User = require("../Model/UserModule");

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

module.exports = {createUser}