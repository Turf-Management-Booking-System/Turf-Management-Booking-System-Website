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
       }
       
}) 
userSchema.methods.getRecentAndPreviousBookings = async function () {
       const user = this;
       await user.populate('previousBooked');
       console.log("Populated previousBooked:", user.previousBooked);
       if (!user.previousBooked || user.previousBooked.length === 0) {
           return {
               recentBookings: [],
               previousBookings: []
           };
       }
       const bookingsByDate = user.previousBooked.reduce((acc, booking) => {
           const dateKey = booking.date.toISOString().split('T')[0]; // Extract date part only
           if (!acc[dateKey]) {
               acc[dateKey] = [];
           }
           acc[dateKey].push(booking);
           return acc;
       }, {});

       const sortedDates = Object.keys(bookingsByDate).sort((a, b) => new Date(b) - new Date(a));
       console.log("Sorted dates:", sortedDates);
       const recentBookings = bookingsByDate[sortedDates[0]];
       const previousBookings = sortedDates.slice(1).flatMap(date => bookingsByDate[date]);
   
       return {
           recentBookings,
           previousBookings
       };
   };
module.exports = mongoose.model("User",userSchema);