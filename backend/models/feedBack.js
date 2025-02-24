const mongoose = require("mongoose");
// create the schema
const feedBackSchema= mongoose.Schema({
    user:{
       type:mongoose.Schema.Types.ObjectId,
       ref:"User"
    },
     thought:{
        type:String,
        required:[true,"Please provide the message!"]
     }
     
},{timestamps:true})
// exports the module
module.exports = mongoose.model("FeedBack",feedBackSchema);