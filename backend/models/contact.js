const mongoose = require("mongoose");
// create the schema
const contactSchema= mongoose.Schema({
    fullName:{
        type:String,
        required:[true,"Please provide the fullName"]
    },
     email:{
        type:String,
        required:[true,"Please provide the email!"]
     },
     message:{
        type:String,
        required:[true,"Please provide the message!"]
     }
     
},{timestamps:true})
// exports the module
module.exports = mongoose.model("Contact",contactSchema);