const mongoose = require("mongoose");
// create the schema 
const sportSchema = mongoose.Schema({
   turfId:{
     type:mongoose.Schema.Types.ObjectId,
     ref:"Turf",
     required:[true,"Please give the turf reference!"],
   },
   sports:{
    type:[String],
   }
},{timestamps:true})
// exports the module
module.exports = mongoose.model("Sport",sportSchema)
