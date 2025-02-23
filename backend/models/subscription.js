const mongoose = require("mongoose");
// create the schema 
const subscriptionSchema = mongoose.Schema({
      email:{
        type:String,
        required:[true,"Please enter the email!"]
      },
      user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
      }
},{timestamps:true})
// exports the module
module.exports = mongoose.model("Subscription",subscriptionSchema)
