const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        clerkId :{
            type:String,
            required:true,
            unique:true,
             index: true, 
        },

        role :{
            type:String,
            enum:['Customer','Staff','Admin'],
            default:'Customer',
             index: true, 
            
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
            index: true, 
        },

        preferences:{
            emailNotification: { type: Boolean, default: true },
            theme: { type: String, enum: ['light', 'dark'], default: 'light' },
        },

        status:{
            type:String,
            enum:['Activate','Suspended','Banned'],
            default:'Activate',
            index: true, 
        }
        ,
        availabilityStatus: {
            type: String,
            enum: ['Available', 'Busy', 'Off Duty'],
            default: 'Available',
        },

        bankDetails: {
            bankName: { type: String, default: '' },
            accountName: { type: String, default: '' },
            accountNumber: { type: String, default: '' },
            branch: { type: String, default: '' },
        }

    },

    {timestamps : true }
)
// ── Compound index for staff queries ─────────────────
// This speeds up queries like: "find all active staff members"
userSchema.index({ role: 1, status: 1 });

// ── Compound index for staff identity verification ───
// This speeds up login verification queries
userSchema.index({ clerkId: 1, role: 1 });

module.exports = mongoose.model( "UserModel" , userSchema )
