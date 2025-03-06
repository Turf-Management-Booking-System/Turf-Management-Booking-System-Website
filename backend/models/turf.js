const mongoose = require("mongoose");
const SlotSchema = new mongoose.Schema({
        turfId:{
           type:mongoose.Schema.Types.ObjectId,
           ref:"Turf"
        },
        time: { type: String, required: true }, 
        status: { type: String, enum: ["available", "booked"], default: "available" },
        bookingEndTime: {
                type: Date, 
                default:null,
            },
      });
// create the schema
const turfSchema = mongoose.Schema({
  turfName :{
    type:String,
    required:[true,"Please enter the turf name!"],
    unique:true,
  },
  turfDescription:{
      type:String,
      required:[true,"Please enter the turf description!"],
      
  },
  turfTitle:{
      type:String,
      required:[true,"Please enter the turf title!"],
  },
  turfOwner:{
       type:String,
       required:[true,"Please enter the turf owner!"],
       unique:true,
  },
  turfPricePerHour:{
         type:Number,
         required:[true,"Please enter the turf price per hour!"],

  },
  turfLocation:{
          type:String,
          required:[true,"Please enter the tirf location!"],
  },
  turfImages:{
          type:[String],
          required:[true,"Please enter the turf image!"]
  },
  turfAddress:{
          type:String,
          required:[true,"Please enter the turf description"],
  },
  turfAmentities:{
            type:[String],
            required:[true,"Please enter the turf amentities!"],
            
  },
  turfRules:{
           type:[String],
           required:[true,"Please enter the turf rules!"],

  },
  turfSize:{
           type:Number,
           required:[true,"Please enter the turf size!"],
  },
  turfAvailability:{
          type:Boolean,
          // be default all turf are available
          default:true, 

  },
  turfOwnerPhoneNumber:{
        type:Number,
        required:[true,"Please enter the phone number!"],
        match: [/^\d{10}$/, "Please enter a valid 10-digit phone number!"], 

  },
  comments:[{
     type:mongoose.Schema.Types.ObjectId,
     ref:"Comment"
  }],
  slots:[SlotSchema],

  ratings:[{
    type:mongoose.Schema.Types.ObjectId,
     ref:"Rating",
  }],
  sports:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Sport"
  }]
})
// export the module
module.exports = mongoose.model("Turf",turfSchema)