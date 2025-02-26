const mongoose = require("mongoose");

// create the schema
const userSchema = mongoose.Schema({
       firstName:{
        type:String,
        required:[true,"Please enter the first name!"],
        maxLength:8,
        minLength:3,
        lowercase:true,
       },
       lastName:{
        type:String,
        required:[true,"Please enter the last name!"],
        maxLength:8,
        minLength:3,
        lowercase:true
       },
       password:{
        type:String,
        required:[true,"Please enter the Password!"],
        maxLength:1024,
        minLength:4,
        unique:true,
       },
       email:{
        type:String,
        required:[true,"Please enter the email!"],
        unique:true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 

},
       role:{
        type:String,
        required:[true,"Please select the role!"],
        enum:["Admin","Player"],
       },
       image:{
        type:String,
       },
       additionalFields:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Profile"
       },
        previousBooked:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Booking"
       }],
       isVerified:{
       //  after otp verification its become true
        type:Boolean,
        default:false
       },
       lastLogin:{
        type:Date,
       },
       recentActivity:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"UserActivity"
       }],
       
},{timestamps:true}) 
userSchema.methods.getRecentAndPreviousBookings = async function () {
  const user = this;

  await user.populate({
      path: "previousBooked",
      model: "Booking",
      populate: [
          {
              path: "turf",
              model: "Turf",
              populate: [
                  {
                      path: "sports",
                      model: "Sport",
                  },
                  {
                      path: "comments",
                      model: "Comment",
                      select: "rating",
                  },
              ],
          },
      ],
  });

  if (!user.previousBooked || user.previousBooked.length === 0) {
      return {
          recentBookings: [],
          previousBookings: []
      };
  }

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const recentBookings = user.previousBooked.filter(booking => {
      const bookingDate = new Date(booking.date);
      bookingDate.setHours(0, 0, 0, 0);
      return bookingDate.getTime() >= currentDate.getTime();
  });

  const previousBookings = user.previousBooked.filter(booking => {
      const bookingDate = new Date(booking.date);
      bookingDate.setHours(0, 0, 0, 0);
      return bookingDate.getTime() < currentDate.getTime(); 
  });

  return {
      recentBookings,
      previousBookings
  };
};
module.exports = mongoose.model("User", userSchema);
