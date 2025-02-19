const mongoose = require("mongoose");
// create the schema 
const commentSchema = mongoose.Schema({
   commentText:{
      type:String,
      required:[true,"Please enter the comment!"],
   },
   userId:{
     type:mongoose.Schema.Types.ObjectId,
     ref:"User",
     required:[true,"Please give the user reference!"],
   },
   turfId:{
     type:mongoose.Schema.Types.ObjectId,
     ref:"Turf",
     required:[true,"Please give the turf reference!"],
   },
   rating:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Rating",

   }
},{timestamps:true})
// exports the module
module.exports = mongoose.model("Comment",commentSchema)
