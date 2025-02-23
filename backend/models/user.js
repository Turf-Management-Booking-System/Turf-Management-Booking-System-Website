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

    // Populate the previousBooked field with the Turf details
    await user.populate({
        path: "previousBooked",
        populate: {
            path: "turf",
            model: "Turf"
        }
    });

    console.log("Populated previousBooked:", user.previousBooked);

    if (!user.previousBooked || user.previousBooked.length === 0) {
        return {
            recentBookings: [],
            previousBookings: []
        };
    }

    // Get the current date (without time)
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set time to 00:00:00 to compare only dates

    // Separate bookings into recent and previous based on the current date
    const recentBookings = user.previousBooked.filter(booking => {
        const bookingDate = new Date(booking.date);
        bookingDate.setHours(0, 0, 0, 0); // Set time to 00:00:00 to compare only dates
        return bookingDate.getTime() === currentDate.getTime(); // Check if the booking date is today
    });

    const previousBookings = user.previousBooked.filter(booking => {
        const bookingDate = new Date(booking.date);
        bookingDate.setHours(0, 0, 0, 0); // Set time to 00:00:00 to compare only dates
        return bookingDate.getTime() < currentDate.getTime(); // Check if the booking date is before today
    });

    return {
        recentBookings,
        previousBookings
    };
};
module.exports = mongoose.model("User", userSchema);
