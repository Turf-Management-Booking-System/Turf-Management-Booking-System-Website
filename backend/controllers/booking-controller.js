const { model } = require("mongoose");
const Booking = require("../models/booking");
const Turf = require("../models/turf");
const User = require("../models/user");
const feedBack = require("../models/feedBack");
const UserActivity = require("../models/userActivity");
const { bookedTurfEmail } = require("../mail/templates/bookedTurfEmail");
const sendEmail = require("../config/nodeMailer");
const Notification = require("../models/notification");
const {cancelBookingEmail} = require("../mail/templates/cancelBookingEmail");
const {rescheduleBookingEmail} = require("../mail/templates/rescheduleBookingEmail")
const mongoose = require('mongoose'); // Add this line at the top


exports.bookingTurf = async (req, res) => {
  try {
    const { date, timeSlot, price, paymentMode } = req.body;
    const { userId, turfId } = req.params;

    // Validation
    if (!date || !timeSlot || !price || !paymentMode || !userId) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const timeSlotArray = Array.isArray(timeSlot) ? timeSlot : [timeSlot];
    const bookingDate = new Date(date);

    // Debug logs
    console.log("Booking request received:", {
      userId,
      turfId,
      date,
      timeSlotArray,
      price,
      paymentMode
    });

    // Find turf by ID only first
    const turf = await Turf.findOne({ _id: turfId })
      .populate('sports')
      .populate({
        path: 'comments',
        populate: {
          path: 'rating',
          model: 'Rating'
        }
      });

    if (!turf) {
      console.error("Turf not found with ID:", turfId);
      return res.status(404).json({
        success: false,
        message: "Turf not found",
      });
    }

    // Format time helper
    const formatTime = (time) => {
      try {
        const dateObj = new Date(time);
        let hours = dateObj.getHours();
        const minutes = dateObj.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        return `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
      } catch (error) {
        console.error("Error formatting time:", time, error);
        return null;
      }
    };

    // Find available slots for the exact date
    const availableSlots = turf.slots.filter(slot => {
      try {
        const slotDate = new Date(slot.time);
        const slotDay = slotDate.toDateString();
        const bookingDay = bookingDate.toDateString();
        
        if (slotDay !== bookingDay) return false;
        
        const slotTimeStr = formatTime(slot.time);
        return timeSlotArray.includes(slotTimeStr) && slot.status === "available";
      } catch (error) {
        console.error("Error processing slot:", slot, error);
        return false;
      }
    });

    console.log("Available slots found:", availableSlots.map(s => formatTime(s.time)));

    if (availableSlots.length !== timeSlotArray.length) {
      const availableTimes = turf.slots
        .filter(slot => {
          try {
            const slotDate = new Date(slot.time);
            return (
              slotDate.toDateString() === bookingDate.toDateString() && 
              slot.status === "available"
            );
          } catch (error) {
            return false;
          }
        })
        .map(slot => formatTime(slot.time))
        .filter(time => time !== null);

      return res.status(400).json({
        success: false,
        message: `Requested slots not available. Only ${availableSlots.length} of ${timeSlotArray.length} slots are available`,
        availableSlots: availableTimes,
        requestedSlots: timeSlotArray
      });
    }

    // Calculate booking end time (assuming 1 hour per slot)
    const lastSlot = availableSlots[availableSlots.length - 1];
    const bookingEndTime = new Date(lastSlot.time);
    bookingEndTime.setHours(bookingEndTime.getHours() + 1);

    // Create booking
    const newBooking = await Booking.create({
      user: userId,
      turf: turfId,
      date: bookingDate,
      timeSlot: availableSlots.map(slot => slot.time),
      status: "Confirmed",
      totalPrice: price,
      paymentMode: paymentMode,
    });

    // Update each booked slot
    for (const slot of availableSlots) {
      slot.status = "booked";
      slot.bookingEndTime = bookingEndTime;
      slot.bookingId = newBooking._id;
    }

    await turf.save();

    // Update user's history
    const userActivity = await UserActivity.create({
      userId: userId,
      action: "Booked Turf",
      details: {
        turfName: turf.turfName,
        date: bookingDate,
        timeSlots: timeSlotArray,
        price: price
      }
    });

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          previousBooked: newBooking._id,
          recentActivity: userActivity._id
        }
      },
      { new: true }
    );

    // Send notification
    await Notification.create({
      user: user._id,
      message: `Your booking for ${turf.turfName} on ${bookingDate.toDateString()} at ${timeSlotArray.join(', ')} was successful!`,
      type: "booking_confirmation",
      relatedBooking: newBooking._id
    });

    // Send email
    try {
      const emailContent = bookedTurfEmail(
        user.firstName,
        user.lastName,
        turf.turfName,
        timeSlotArray,
        date,
        price,
        paymentMode
      );
      await sendEmail(user.email, "Turf Booking Confirmation", emailContent);
      console.log("Confirmation email sent to:", user.email);
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
    }

    // Return populated booking
    const populatedBooking = await Booking.findById(newBooking._id)
      .populate({
        path: "turf",
        populate: [
          { path: "sports" },
          {
            path: "comments",
            populate: {
              path: "rating",
              select: "rating",
            },
          },
        ],
      })
      .populate("user")
      .exec();

    return res.status(200).json({
      success: true,
      message: "Booking successful!",
      booking: populatedBooking,
      availableSlots: availableSlots.map(s => formatTime(s.time))
    });

  } catch (error) {
    console.error("Booking processing error:", {
      message: error.message,
      stack: error.stack,
      requestBody: req.body,
      params: req.params
    });

    return res.status(500).json({
      success: false,
      message: "An error occurred while processing your booking",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

exports.cancelBooking = async (req, res) => {
    try {
      const { bookingId } = req.params;
      if (!bookingId) {
        return res.status(404).json({
          success: false,
          message: "Please enter the Booking ID!",
        });
      }
      const booking = await Booking.findById(bookingId).populate("user")
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "No Booking Found By This ID!",
        });
      }
    
      const bookingTime = new Date(booking.createdAt);
      const currentTime = new Date();
      const timeDiff = (currentTime - bookingTime) / (1000 * 60 * 60);
  
      if (timeDiff > 24) {
        return res.status(400).json({
          success: false,
          message: "Cancellation not allowed after 24 hours!",
        });
      }
  
      const turf = await Turf.findById(booking.turf);
      if (!turf) {
        return res.status(404).json({
          success: false,
          message: "No Turf Found!",
        });
      }
  
      if (Array.isArray(booking.timeSlot)) {
        booking.timeSlot.forEach((slotTime) => {
          const slotInTurf = turf.slots.find((s) => s.time === slotTime);
          if (slotInTurf) {
            slotInTurf.status = "available";
          }
        });
      } else {
        const slotInTurf = turf.slots.find((s) => s.time === booking.timeSlot);
        if (slotInTurf) {
          slotInTurf.status = "available";
        }
      }
   
      await turf.save();
      await Booking.findByIdAndDelete(bookingId);
      const activity = await UserActivity.create({
        userId: booking.user._id,
        action: "Cancelled Turf"
    });
    await User.findByIdAndUpdate(
        booking.user._id,
        { $push: { recentActivity: activity._id } },
        { new: true, useFindAndModify: false }
    );
    
      const message = await Notification.create({
        user:booking.user._id,
        message:`Cancel ${turf.turfName} Turf `
    })
    try{
      const emailContent = cancelBookingEmail(
        booking.user.firstName,
        booking.user.lastName,
        turf.turfName,
        booking.timeSlot,
        booking.date
    );
    
     await sendEmail(booking.user.email,"Turf Cancel Successfully!",emailContent);
    }catch(error){
    console.log("error",error);
    return res.status(500).json({
        success:false,
        message:error.message
    })
    }
      const user = booking.user;
      return res.status(200).json({
        success: true,
        message: "Booking cancelled. Slot is now available.",
        user,
      });
    } catch (error) {
      console.log("Error:", error);
      return res.status(500).json({
        success: false,
        message: "Error while canceling the booking!",
        error: error.message,
      });
    }
  };
  exports.rescheduleBooking = async (req, res) => {
    try {
        const { bookingId, newTimeSlot } = req.body;

        if (!bookingId || !newTimeSlot || !Array.isArray(newTimeSlot)) {
            return res.status(400).json({
                success: false,
                message: "Please provide booking ID and new time slots as an array!",
            });
        }

        const booking = await Booking.findById(bookingId).populate("user")
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "No booking found!",
            });
        }

        const turf = await Turf.findById(booking.turf);
        if (!turf) {
            return res.status(404).json({
                success: false,
                message: "Turf not found!",
            });
          }
        const firstOldTimeSlot = booking.timeSlot[0]; 
        if (!firstOldTimeSlot || typeof firstOldTimeSlot !== "string") {
            return res.status(400).json({
                success: false,
                message: "Invalid time slot format!",
            });
        }
        const bookingDate = booking.date;
        const currentTime = new Date();
        const bookingDateAndTime = new Date(`${bookingDate}T${firstOldTimeSlot.split(" - ")[0]}:00`);
        const timeDiff = (bookingDateAndTime - currentTime) / (1000 * 60 * 60);

        if (timeDiff <= 5) {
            return res.status(400).json({
                success: false,
                message: "Rescheduling is allowed only before 5 hours of the booking time!",
            });
        }
        for (const slot of newTimeSlot) {
            const newSlot = turf.slots.find(s => s.time === slot);
            if (!newSlot || newSlot.status === "booked") {
                return res.status(400).json({
                    success: false,
                    message: `Time slot ${slot} is not available!`,
                });
            }
        }

        for (const oldSlot of booking.timeSlot) {
            const slotToFree = turf.slots.find(s => s.time === oldSlot);
            if (slotToFree) {
                slotToFree.status = "available";
            }
        }
        for (const slot of newTimeSlot) {
            const newSlot = turf.slots.find(s => s.time === slot);
            if (newSlot) {
                newSlot.status = "booked";
            }
        }
        await turf.save();
        booking.timeSlot = newTimeSlot; 
        await booking.save();
        const activity = await UserActivity.create({
          userId: booking.user._id,
          action: "Reschedule Turf"
      });
      await User.findByIdAndUpdate(
          booking.user._id,
          { $push: { recentActivity: activity._id } },
          { new: true, useFindAndModify: false }
      );
      
        const message = await Notification.create({
          user:booking.user._id,
          message:`Rescheduled ${turf.turfName} Turf `
      })
      try{
        const emailContent = rescheduleBookingEmail(
          booking.user.firstName,
          booking.user.lastName,
          turf.turfName,
          booking.oldTimeSlot,
          booking.newTimeSlot,
          booking.oldDate,
          booking.newDate
      );      
       await sendEmail(booking.user.email,"Turf Rescheduled Successfully!",emailContent);
      }catch(error){
      console.log("error",error);
      return res.status(500).json({
          success:false,
          message:error.message
      })
      }
        return res.status(200).json({
            success: true,
            message: "Rescheduling done successfully!",
            booking,
        });
    } catch (error) {
        console.error("Error in rescheduleBooking:", error);
        return res.status(500).json({
            success: false,
            message: "Error while rescheduling the booking!",
            error: error.message,
        });
    }
};

exports.getUserBookingDetails = async (req, res) => {
  try {
      const userId = req.params.userId;
      const user = await User.findById(userId);

      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      const { recentBookings, previousBookings } = await user.getRecentAndPreviousBookings();

      res.status(200).json({
          recentBookings,
          previousBookings
      });

  } catch (error) {
      res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};
exports.getAllBookingsOfUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Validate userId exists and is a valid ObjectId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format"
      });
    }

    // Clean the userId by removing any non-hex characters
    const cleanedUserId = userId.replace(/[^a-f0-9]/g, '');

    // Verify the cleaned ID is exactly 24 characters
    if (cleanedUserId.length !== 24) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID length"
      });
    }

    const user = await User.findById(cleanedUserId).populate({
      path: "previousBooked",
      model: "Booking",
      populate: [
        {
          path: "turf",
          model: "Turf",
          populate: [
            {
              path: "comments", 
              model: "Comment",
              populate: {
                path: "rating",
                model: "Rating",
                select: "rating"
              }
            },
            {
              path: "sports", 
              model: "Sport",
            },
          ],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "User bookings found",
      bookings: user.previousBooked 
    });

  } catch (error) {
    console.error("Error in getAllBookingsOfUser:", error);
    return res.status(500).json({
      success: false,
      message: "Error while getting user's all bookings",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
exports.getUserFeedback =async (req,res)=>{
    try{
     const {userId,thought} = req.body;
     if(!userId|| !thought){
        return res.status(404).json({
            success:false,
            message:"Please Enter The Data!"
        })
     }
     const user = await User.findById(userId);
     if(!user){
        return res.status(404).json({
            success:false,
            message:"No User Found By Id!"
        })
     }
     const userThought = await feedBack.create({
        user:userId,
        thought:thought
     });
     return res.status(200).json({
        success:true,
        message:"Thanks For FeedBack!",
        userThought
     })
    }catch(error){
        console.log("Error:", error);
        return res.status(500).json({
            success: false,
            message: "Error while getting user's feedback",
            error: error.message
        });
    }
}
exports.getAllBooking = async(req,res)=>{
  try{
     const allBookings = await Booking.find({}).populate("user").populate("turf")

     return res.status(200).json({
      success:true,
      message:"Fetch All Bookings",
      allBookings,
     })
  }catch(error){
    console.log("error",error);
    return res.status(500).json({
      success:false,
      message:"Error while fectching all bookings",
      error:error.message
    })
  }
}