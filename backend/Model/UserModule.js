const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        clerkId :{
            type:String,
            required:true,
            unique:true,
        },

        role :{
            type:String,
            enum:['Customer','Staff','Admin'],
            default:'Customer'
            
        },

        firstName:{
            type:String,
            required:true,
        },

        lastName:{
            type:String,
        },

        email:{
            type:String,
            required:true,
            unique:true,
        },

        preferences:{
            emailNotification: { type: Boolean, default: true },
            theme: { type: String, enum: ['light', 'dark'], default: 'light' },
        },

        status:{
            type:String,
            enum:['Activate','Suspended','Banned'],
            default:'Active',
        }

    },

    {timestamps : true }
)

module.exports = mongoose.model( "UserModel" , userSchema )
