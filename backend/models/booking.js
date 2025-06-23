const mongoose = require("mongoose");
const bookingSchema = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true,"Please give the user reference!"],
    },
    turf:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Turf",
        required:[true,"Please give the turf reference!"]
    },
    date:{
        type:Date,
        required:[true,"Please enter the date!"],
        default:Date.now,
    },
    timeSlot:{
        type:[String],
        required:[true,"Please enter the time slot!"]
    },
    status:{
       type:String,
       required:true,
       enum:["Confirmed","Pending","ReScheduled"],
    },
    totalPrice:{
       type:Number,
       required:true,
       min:200,
       max:2000,
    },
    paymentMode:{
        type:String,
        required:[true,"Please select the payment mode!"],
        enum:["Cash","Online"]
    }

},{timestamps:true});
module.exports = mongoose.model("Booking",bookingSchema);