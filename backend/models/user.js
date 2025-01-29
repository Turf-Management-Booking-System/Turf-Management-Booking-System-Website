const mongoose = require("mongoose");

// create the schema
const userSchema = mongoose.Schema({
       firstName:{
        type:String,
        required:[true,"Please enter the first name!"],
        maxLength:8,
        minLength:3,
        lowercase:true,
       },
       lastName:{
        type:String,
        required:[true,"Please enter the last name!"],
        maxLength:8,
        minLength:3,
        lowercase:true
       },
       password:{
        type:String,
        required:[true,"Please enter the Password!"],
        maxLength:1024,
        minLength:4,
        unique:true,
       },
       email:{
        type:String,
        required:[true,"Please enter the email!"],
        unique:true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 

},
       role:{
        type:String,
        required:[true,"Please select the role!"],
        enum:["Admin","Player"],
       },
       image:{
        type:String,
       },
       additionalFields:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Profile"
       },
        previousBooked:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Booking"
       }],
       isVerified:{
       //  after otp verification its become true
        type:Boolean,
        default:false
       }
       
}) 
module.exports = mongoose.model("User",userSchema);