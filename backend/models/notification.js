const mongoose = require("mongoose");
// create the schema
const notificationSchema = mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:[true,"Please provide the user refernce!"]
  },
  message:{
    type:String,
    required:[true,"Please Provide the message!"],
    maxLength:30,
    minLength:10
  },
  isRead:{
    type:Boolean,
    default:false,
  },
  messageType:{
    type:String,
    enum:["Info","Warning","Alert"],
    default:"Info",
  }
},{timestamps:true})
// exports the model
module.exports = mongoose.model("Notification",notificationSchema);