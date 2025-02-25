const { model } = require("mongoose");
const Booking = require("../models/booking");
const Turf = require("../models/turf");
const User = require("../models/user");
const feedBack = require("../models/feedBack");

exports.bookingTurf = async (req, res) => {
    try {
        // Getting data from the user
        const { date, timeSlot, price, paymentMode } = req.body;
        console.log("Requested TimeSlot:", typeof timeSlot);
        const { userId, turfId } = req.params;

        // Validations
        if (!date || !timeSlot || !price || !paymentMode || !userId) {
            return res.status(401).json({
                success: false,
                message: "Please enter the date and Time slots",
            });
        }

        const timeSlotArray = Array.isArray(timeSlot) ? timeSlot : [timeSlot];

        // Find the turf by id
        const turf = await Turf.findById(turfId);
        if (!turf) {
            return res.status(404).json({
                success: false,
                message: "No turf found",
            });
        }

        // Check if the turf slots are available
        const slotInTurf = turf.slots.find(s =>
            timeSlotArray.some(slot => s.time?.trim().toLowerCase() === slot.trim().toLowerCase()) &&
            s.status === "available"
        );

        if (!slotInTurf) {
            return res.status(404).json({
                success: false,
                message: "Slot not found in slots collections",
            });
        }

        // If slot is available, create a booking
        let newBooking;
        try {
            newBooking = await Booking.create({
                user: userId,
                turf: turfId,
                date: date,
                timeSlot: timeSlotArray,
                status: "Confirmed",
                totalPrice: price,
                paymentMode: paymentMode,
            });

            console.log("Booking Created:", newBooking);
        } catch (error) {
            console.error("Error saving booking:", error);
        }

        // Update the turf model
        slotInTurf.status = "booked";
        await turf.save();

        // Update the user's previousBooked array with the new booking ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        // Add the new booking ID to the previousBooked array
        user.previousBooked.push(newBooking._id);
        await user.save();

        const newBookings = await Booking.findById(newBooking._id).populate({
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
  .exec();
        // Return the response
        return res.status(200).json({
            success: true,
            message: "User Booked a Slot!",
            newBookings,
        });
    } catch (error) {
        console.log("error", error);
        return res.status(500).json({
            success: false,
            message: "Error while Booking A Turf!",
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

      const booking = await Booking.findById(bookingId);
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
      
      return res.status(200).json({
        success: true,
        message: "Booking cancelled. Slot is now available.",
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

        const booking = await Booking.findById(bookingId);
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
      // Get user ID from params
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
