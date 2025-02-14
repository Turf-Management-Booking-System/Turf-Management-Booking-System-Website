const mongoose= require("mongoose");

// create the schema
const profileSchema = mongoose.Schema({
   user:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
   },
    phoneNumber:{
       type:String,
       match: [/^\d{10}$/, "Please enter a valid 10-digit phone number!"], 
       default:null,
    },
    gender:{
       type:String,
       default:null,
       enum:["Male","Female","TransGender"],
    },
    about:{
        type:String,
        default:null,
        maxLength:30,
        minLength:10
    },
    dateOfBirth:{
      type:String,
      default:null
    },
    description:{
       type:String,
       default:null,
       maxLength:30,
       minLength:10,
    },
    location:{
       type:String,
       default:null
    },
},{timestamps:true});
// exports the model
module.exports = mongoose.model("Profile",profileSchema);