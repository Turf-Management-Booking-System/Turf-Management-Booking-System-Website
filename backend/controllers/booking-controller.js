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

exports.bookingTurf = async (req, res) => {
  try {
    const { date, timeSlot, price, paymentMode } = req.body;
    const { userId, turfId } = req.params;

    // Validation
    if (!date || !timeSlot || !price || !paymentMode || !userId) {
      return res.status(401).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const timeSlotArray = Array.isArray(timeSlot) ? timeSlot : [timeSlot];
    const bookingDate = new Date(date);

    // Convert each time slot to full Date object
    const formattedTimeSlots = timeSlotArray.map(ts => new Date(`${date} ${ts}`));

    // Find turf
    const turf = await Turf.findById(turfId);
    if (!turf) {
      return res.status(404).json({
        success: false,
        message: "No turf found",
      });
    }

    // Find available slots by comparing exact datetime
    const availableSlots = turf.slots.filter(slot =>
      formattedTimeSlots.some(ts =>
        new Date(slot.time).getTime() === ts.getTime()
      ) &&
      slot.status === "available" &&
      new Date(slot.date).toISOString().slice(0, 10) === bookingDate.toISOString().slice(0, 10)
    );

    if (availableSlots.length !== timeSlotArray.length) {
      return res.status(400).json({
        success: false,
        message: "Some slots are already booked or don't exist",
      });
    }

    // Calculate booking end time (assuming 1 hour per slot)
    const bookingEndTime = new Date(formattedTimeSlots[formattedTimeSlots.length - 1].getTime() + 60 * 60 * 1000);

    // Create booking
    const newBooking = await Booking.create({
      user: userId,
      turf: turfId,
      date: bookingDate,
      timeSlot: formattedTimeSlots, // store full datetime
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
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          previousBooked: newBooking._id,
          recentActivity: (await UserActivity.create({
            userId: userId,
            action: "Booked Turf",
          }))._id
        }
      },
      { new: true }
    );

    // Send notification and email
    await Notification.create({
      user: user._id,
      message: `Booked ${turf.turfName} Turf`,
    });

    try {
      const emailContent = bookedTurfEmail(
        user.firstName,
        user.lastName,
        turf.turfName,
        newBooking.timeSlot,
        newBooking.date
      );
      await sendEmail(user.email, "Turf Booked Successfully!", emailContent);
    } catch (emailError) {
      console.error("Email error:", emailError);
    }

    // Return populated booking
    const populatedBooking = await Booking.findById(newBooking._id)
      .populate({
        path: "turf",
        populate: [
          { path: "sports", model: "Sport" },
          {
            path: "comments",
            model: "Comment",
            populate: {
              path: "rating",
              model: "Rating",
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
      newBookings: populatedBooking,
    });

  } catch (error) {
    console.error("Booking error:", error);
    return res.status(500).json({
      success: false,
      message: "Error while processing booking",
      error: error.message,
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
      if (!userId) {
          return res.status(400).json({
              success: false,
              message: "Please check the data"
          });
      }
      const user = await User.findById(userId).populate({
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
                populate:{
                    path:"rating",
                    model:"Rating",
                    select:"rating"
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
              message: "Error! No user found."
          });
      }
      return res.status(200).json({
          success: true,
          message: "User bookings found",
          bookings: user.previousBooked 
      });
  } catch (error) {
      console.log("Error:", error);
      return res.status(500).json({
          success: false,
          message: "Error while getting user's all bookings",
          error: error.message
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