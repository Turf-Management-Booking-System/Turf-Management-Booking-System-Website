
const Turf = require("../models/turf");
const Sport = require("../models/sports")
const Booking = require("../models/booking");
const mongoose = require("mongoose");
const { ObjectId } = require('mongodb'); 
exports.createTurf = async (req, res) => {
  try {
    const {
      turfName,
      turfDescription,
      turfTitle,
      turfOwner,
      turfPricePerHour,
      turfLocation,
      turfImages,
      turfAddress,
      turfAmentities,
      turfRules,
      turfSize,
      turfAvailability,
      turfOwnerPhoneNumber,
      sports
    } = req.body;

    // Validation
    if (
      !turfName || !turfDescription || !turfTitle || !turfOwner ||
      !turfPricePerHour || !turfLocation || !turfImages || !turfAddress ||
      !turfAmentities || !turfRules || !turfSize || !turfOwnerPhoneNumber || !sports
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter all required turf details!"
      });
    }

    // Create Turf without slots
    const turfDetails = await Turf.create({
      turfName,
      turfDescription,
      turfTitle,
      turfOwner,
      turfPricePerHour,
      turfLocation,
      turfImages,
      turfAddress,
      turfAmentities,
      turfRules,
      turfSize,
      turfAvailability,
      turfOwnerPhoneNumber,
    });

    // Create sports entry (if needed)
    const createSports = await Sport.create({
      sports: sports,
      turfId: turfDetails._id,
    });

    turfDetails.sports.push(createSports._id);
    await turfDetails.save();

    return res.status(200).json({
      success: true,
      message: "Turf created successfully!",
      turf: turfDetails
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error while creating the turf",
      error: error.message,
    });
  }
};


exports.updateTurf = async (req, res) => {
  try {
    const { turfId, sports, ...updateData } = req.body;
    if (!turfId) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid turfId",
      });
    }
    const findTurf = await Turf.findById(turfId);
    if (!findTurf) {
      return res.status(404).json({
        success: false,
        message: "Turf not found in the database",
      });
    }
    Object.keys(updateData).forEach((key) => {
      findTurf[key] = updateData[key];
    });
    const updatedTurf = await findTurf.save();
    if (sports && Array.isArray(sports)) {
      let sportDoc = await Sport.findOne({ turfId });

      if (!sportDoc) {
        sportDoc = new Sport({
          turfId,
          sports,
        });
      } else {
        sportDoc.sports = sports;
      }
      await sportDoc.save();
    }
    return res.status(200).json({
      success: true,
      message: "Turf and associated sports updated successfully!",
      turf: updatedTurf,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error while updating the turf and sports",
      error: error.message,
    });
  }
};
exports.deleteTurf = async(req,res)=>{
    try{
        const {turfId}= req.body;
        if(!turfId){
            return res.status(400).json({
                success:false,
                message:"please enter the turfId properly"
            })
        }
        const findTurfId = await Turf.findById(turfId);
        if(!findTurfId){
            return res.status(400).json({
                success:false,
                message:"error while finding the find by id"
            })
        }
        const deleteTurf = await Turf.findByIdAndDelete(turfId);
        return res.status(200).json({
            success:true,
            message:"deleted the turf !",
           turf: deleteTurf,
        })

    }catch(error){
        console.log("error",error);
        return res.status(500).json({
            success:false,
            message:"error while deleting the turf!",
            error:error.message
        })
    }
}
exports.getAllTurf = async(req,res)=>{
    try{
        const fetchAllTurf = await Turf.find().populate("sports")
        if(fetchAllTurf.length===0){
            return res.status(400).json({
                success:false,
                message:"no turf found in the database"
            })
        }
        return res.status(200).json({
            success:true,
            message:"fetch the turf",
            fetchAllTurf,
        })

    }catch(error){
        console.log("error",error);
        return res.status(500).json({
            success:false,
            message:"error while fetching all turf!",
            error:error.message
        })
    }
}
exports.getTurfSelectedLocation = async(req,res)=>{
    try{
      const {location} = req.params;
      if(!location){
        return res.status(401).json({
            success:false,
            message:"PLease Enter the Location!"
       } )
      }
      const fetchAllTurf = await Turf.find({
        turfLocation:location
      }).populate("comments").populate({
        path:"sports",
        select:"sports"
      });
      return res.status(200).json({
        success:true,
        message:"Turf Fetch by Location",
        fetchAllTurf,
      })
    }catch(error){
        console.log("error",error);
        return res.status(500).json({
            success:false,
            message:"error while fetching selected location turf!",
            error:error.message
        })
    }
}
exports.getTurfById =async (req,res)=>{
    try{
     const {id} = req.params;
     if(!id){
        return res.status(400).json({
            success:false,
            message:"Couldn't Find Id"
        })
     }
     const fetchTurfById = await Turf.findById(id)
     .populate({
        path:"comments",
        populate:{
            path:"userId",
            select:"firstName lastName image"
        },
        populate:{
            path:"rating",
            select:"rating"
        }
     })
     .populate({
        path: "ratings",
        populate: {
            path: "user",
            select: "firstName lastName"
        }
    }).populate({
        path:"sports"
    })
     .exec();
     if(!fetchTurfById){
        return res.status(404).json({
            success:false,
            message:"Not Found With The Particular Id"
        })
     }
      const ratings = fetchTurfById.ratings;
      const averageRating = ratings.length
          ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length
          : 0;

     return res.status(200).json({
        success:true,
        message:"Fetch The Turf By Id",
        fetchTurfById,
        averageRating:averageRating.toFixed(1),
     })
    }catch(error){
        console.log("error",error);
        return res.status(500).json({
            success:false,
            message:"error while fetching turf By Id!",
            error:error.message
        })
    }
}
exports.viewAllUsers= async(req,res)=>{
    try{
        const fetchAllUsers= await User.find();
        if(fetchAllUsers.length===0){
            return res.status(400).json({
                success:false,
                message:"no user find in the database"
            })
        }
        return res.status(200).json({
            success:true,
            message:"all user fetch",
            users:fetchAllUsers.email
        })

    }catch(error){
      console.log("error",error);
      return res.status(500).json({
        success:false,
        message:"error while fetching all users",
        error:error.message,
      })
    }
}
exports.allBookings = async(req,res)=>{
    try{

    }catch(error){

    }
}
exports.viewBookingById = async(req,res)=>{
    try{

    }catch(error){

    }
}
exports.getAllTurfLocations = async(req,res)=>{
    try{
      const turfLocations = await Turf.aggregate([
        { 
            $group: { 
                _id: "$turfLocation", // Group by turfLocation
                docId: { $first: "$_id" } // Get first _id for each unique location
         } 
        }
      ]);
      console.log("turf locations",turfLocations);
      return res.status(200).json({
        success:true,
        message:"Fetch the Turf Locations",
        turf:turfLocations,
      })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Failed to Fetch Turf Locations",
            error:error.message
        })
    }
}
exports.getTurfSlots = async(req,res)=>{
    try{
        const {turfId}= req.params;
        if(!turfId){
            return res.status(404).json({
                success:false,
                message:"Please enter the data proeprly"
            })
        }
        const fetchTurfSlots = await Turf.findById(turfId);
        if(!fetchTurfSlots){
            return res.status(404).json({
                success:false,
                message:"Couldn't Find Turf"
            })
        }
        return res.status(200).json({
            success:true,
            message:"Fetch the Turf Slots",
            turf :fetchTurfSlots,
          })
        
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Failed to Fetch Turf Slots",
            error:error.message
        })
    }
}
exports.getTurfSlotsByDate = async (req, res) => {
  try {
    const { turfId, date } = req.params;

    // Validate date format (ensure it follows yyyy-mm-dd format)
    const queryDate = new Date(date);
    if (isNaN(queryDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format"
      });
    }

    const turf = await Turf.findById(turfId).select('+slots');

    if (!turf) {
      return res.status(404).json({
        success: false,
        message: "Turf not found"
      });
    }

    // Check if slots exist
    if (!turf.slots || !Array.isArray(turf.slots)) {
      turf.slots = []; // Ensure it's an array
    }

    // Filter slots for specific date
    const slotsForDate = turf.slots.filter(slot => {
      if (!slot.date) return false;
      return new Date(slot.date).toDateString() === queryDate.toDateString();
    });

    // If no slots found for that date, return default ones and update the database
    if (slotsForDate.length === 0) {
      const defaultSlots = [
        "6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM",
        "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM",
        "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM"
      ].map(time => {
        const timeString = `${queryDate.toISOString().split('T')[0]} ${time}`;
        const timeDate = new Date(timeString);
         console.log("date",queryDate)
        return {
          time: timeDate,
          date: queryDate, // Set the date properly
          status: "available",
          bookingEndTime: null,
          bookingId: null
        };
      });

      // Update the turf with new slots for the selected date
      turf.slots.push(...defaultSlots);
      await turf.save();

      return res.status(200).json({
        success: true,
        slots: defaultSlots,
        turfDetails: {
          turfName: turf.turfName,
          turfPricePerHour: turf.turfPricePerHour,
          turfLocation:turf.turfLocation

        }
      });
    }
    
    // Return existing slots for the specific date
    return res.status(200).json({
      success: true,
      slots: slotsForDate,
      turfDetails: {
        turfName: turf.turfName,
        turfPricePerHour: turf.turfPricePerHour,
        turfLocation:turf.turfLocation
      }
    });

  } catch (error) {
    console.error("Error in getTurfSlotsByDate:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching slots",
      error: error.message
    });
  }
};



exports.getAllSports = async (req, res) => {
        try {
          const turfs = await Turf.find({}).populate({
            path: 'sports',
            select: 'sports' 
          });
          const allSports = [...new Set(turfs.flatMap(turf => turf.sports.flatMap(sport => sport.sports)))];
      
          res.status(200).json({ success: true, sports: allSports });
        } catch (error) {
          res.status(500).json({ success: false, message: "Error fetching sports" });
        }
      
      
      
};
exports.getTotalRevenue = async (req, res) => {
  try {
  
       const totalRevenue = await Booking.aggregate
       ([
     { $group: { _id: null, total: { $sum: "$totalPrice" } } }
        ]); 

    res.status(200).json({ total: totalRevenue[0]?.total  });
  } catch (error) {
    console.error("Error fetching total revenue:", error);
    res.status(500).json({ message: "Failed to fetch total revenue" });
  }
};
exports.getMonthlyRevenue = async (req, res) => {
  try {
    const monthlyRevenue = await Booking.aggregate([
      {
        $group: {
          _id: { $month: "$date" }, 
          revenue: { $sum: "$totalPrice" }
        }
      },
      { $sort: { _id: 1 } }, 
      {
        $project: {
          _id: 0, 
          month: {
            $let: {
              vars: {
                months: [
                  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                ]
              },
              in: {
                $arrayElemAt: ["$$months", { $subtract: ["$_id", 1] }]
              }
            }
          },
          revenue: 1
        }
      }
    ]);

    res.status(200).json(monthlyRevenue);
  } catch (error) {
    console.error("Error fetching monthly revenue:", error);
    res.status(500).json({ message: "Failed to fetch monthly revenue" });
  }
};



exports.getMonthlyBookings = async (req, res) => {
  try {
    const monthlyBookings = await Booking.aggregate([
      {
        $group: {
          _id: { $month: "$date" },
          bookings: { $sum: 1 }, 
        },
      },
      {
        $project: {
          _id: 0, 
          name: {
            $let: {
              vars: {
                monthsInString: [
                  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
                ],
              },
              in: {
                $arrayElemAt: ["$$monthsInString", { $subtract: ["$_id", 1] }],
              },
            },
          },
          bookings: 1, 
          monthIndex: { $subtract: ["$_id", 1] },
        },
      },
      { $sort: { monthIndex: 1 } }, 
      { $project: { monthIndex: 0 } }, 
    ]);

    res.status(200).json(monthlyBookings);
  } catch (error) {
    console.error("Error fetching monthly bookings:", error);
    res.status(500).json({ message: "Failed to fetch monthly bookings" });
  }
};
exports.getSportsUtilization = async (req, res) => {
  try {
    const result = await Turf.aggregate([
      {
        $unwind: "$sports" // Split sports array into separate documents
      },
      {
        $lookup: {
          from: "sports", // Collection name in lowercase
          localField: "sports",
          foreignField: "_id",
          as: "sportDetails"
        }
      },
      {
        $unwind: "$sportDetails" 
      },
      {
        $unwind: "$sportDetails.sports" // Get sport names from sports array
      },
      {
        $group: {
          _id: "$sportDetails.sports",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          sport: "$_id",
          count: 1,
          _id: 0
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching sports utilization:", error);
    res.status(500).json({ message: "Failed to fetch sports utilization" });
  }
};
exports.getMonthlyBookingsForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const objectUserId = new mongoose.Types.ObjectId(userId);
    const statusBookings = await Booking.aggregate([
      {
        $match: { user: objectUserId }, 
      },
      {
        $group: {
          _id: "$status", 
          bookings: { $sum: 1 }, 
        },
      },
      {
        $project: {
          _id: 0, 
          name: "$_id", 
          bookings: 1, 
        },
      },
    ]);
    res.status(200).json(statusBookings);
  } catch (error) {
    console.error("Error fetching monthly bookings for user:", error);
    res.status(500).json({ message: "Failed to fetch monthly bookings for user" });
  }
};

exports.getMonthlyBookingsTrend = async (req, res) => {
  try {
    const { userId } = req.params;
    const objectUserId = new mongoose.Types.ObjectId(userId);

    const monthlyBookings = await Booking.aggregate([
      {
        $match: { user: objectUserId }, 
      },
      {
        $group: {
          _id: { month: { $month: "$date" }, year: { $year: "$date" } },
          bookings: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          name: {
            $let: {
              vars: {
                monthsInString: [
                  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
                ],
              },
              in: {
                $arrayElemAt: ["$$monthsInString", { $subtract: ["$_id.month", 1] }],
              },
            },
          },
          bookings: 1,
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.status(200).json(monthlyBookings);
  } catch (error) {
    console.error("Error fetching monthly bookings for user:", error);
    res.status(500).json({ message: "Failed to fetch monthly bookings for user" });
  }
};

exports.getTopBookedTurfs = async (req, res) => {
  try {
    const bookings = await Booking.find().limit(5).populate("turf");
console.log("Sample Bookings:", bookings.map(b => ({
  bookingId: b._id,
  turfId: b.turf?._id,
  turfName: b.turf?.turfName
})));
    const topTurfs = await Booking.aggregate([
      { $group: { _id: "$turf", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 3 },
      {
        $lookup: {
          from: "turves", // CONFIRM THIS NAME!
          localField: "_id",
          foreignField: "_id",
          as: "turfDetails"
        }
      },
      { $unwind: "$turfDetails" },
      {
        $project: {
          turfId: "$_id",
          bookingsCount: "$count",
          turfName: "$turfDetails.turfName",
          location: "$turfDetails.turfLocation",
          pricePerHour:"$turfDetails.turfPricePerHour",
          image:"$turfDetails.turfImages",
          _id: 0
        }
      }
    ]);

    if (topTurfs.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No booking data available or no matching turfs found."
      });
    }

    res.status(200).json({ success: true, data: topTurfs });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};