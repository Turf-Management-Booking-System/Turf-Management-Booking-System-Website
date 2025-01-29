const  mongoose = require("mongoose");
// create the schema
const paymentSchema =mongoose.Schema({
    user:{
     type:mongoose.Schema.Types.ObjectId,
     ref:"User",
     required:[true,"Please give the user reference!"],
    },
    booking:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Booking",
      required:[true,"Please provide the booking reference!"]
    },
    amount:{
       type:Number,
       required:[true,"Please give the amount!"],
       min:200,
       max:2000
    },
    paymentStatus:{
        type:String,
        required:true,
        enum:["Paid","Pending","Failed"]
    },
    paymentDate:{
         type:Date,
         required:true,
         default:Date.now,
    }
},{timestamps:true})
// exprts the model
module.exports = mongoose.model("Payment",paymentSchema);