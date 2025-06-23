const mongoose = require("mongoose");
const otpSchema = mongoose.Schema({
     email:{
        type:String,
        required:[true,"Please provide the email!"]
     },
     otpCode:{
        type:String,
        required:[true,"Please provide the otp!"],
        maxLength:6,
        minLength:6
     },
     expiresAt:{
        type:Date,
        required:true,
        default:()=>new Date(Date.now()+ 5*60*1000)
     }
},{timestamps:true})
module.exports = mongoose.model("Otp",otpSchema);