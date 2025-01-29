const mongoose = require("mongoose");
// create the schema
const ratingSchema = mongoose.Schema({
     rating:{
      type:Number,
      required:[true,"Please enter the rating value"],
      min:1,
      max:5
     },
     turf:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Turf",
      required:[true,"Please enter the turf reference!"]
     },
     user:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
      required:[true,"Please enter the user reference!"]
     }
})
// export the model
module.exports = mongoose.model("Rating",ratingSchema);
