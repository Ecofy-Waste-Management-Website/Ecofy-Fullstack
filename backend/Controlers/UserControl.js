const User = require("../Model/UserModule")

const getAllUsers = async(req, res , next) => {
    let Users;

    try{
        Users = await User.find();
    }catch(err){
        console.log(err);
    }

    if (!Users){
        return res.status(404).json({Users});
    }

exports.getAllUsers = getAllUsers;
}