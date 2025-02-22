
const Turf = require("../models/turf");
const Sport = require("../models/sports")

// create turf
exports.createTurf=async(req,res)=>{
    try{
    // get the data from the admin
    const slots = [
        { time: "9:00 AM", status: "available" },
        { time: "10:00 AM", status: "available" },
        { time: "11:00 AM", status: "available" },
        { time: "12:00 PM", status: "available" },
        { time: "1:00 PM", status: "available" },
        { time: "2:00 PM", status: "available" },
        { time: "3:00 PM", status: "available" },
        { time: "4:00 PM", status: "available" },
        { time: "5:00 PM", status: "available" },
        { time: "6:00 PM", status: "available" },
        { time: "7:00 PM", status: "available" },
        { time: "8:00 PM", status: "available" },
        { time: "9:00 PM", status: "available" },
        { time: "10:00 PM", status: "available" }
      ];
    const{turfName,turfDescription,turfTitle,turfOwner,turfPricePerHour,turfLocation,turfImages,turfAddress,turfAmentities,turfRules,turfSize,turfAvailability,turfOwnerPhoneNumber,sports}= req.body;
    // validate the data from the admin
    if(!turfName||!turfDescription||!turfTitle||!turfOwner||!turfPricePerHour||!turfLocation||!turfImages||!turfAddress||!turfAmentities||!turfRules||!turfSize||!turfAvailability||!turfOwnerPhoneNumber||!sports){
        return res.status(400).json({
            success:false,
            message:"please neter the turf details!"
        })
    }
   
    // store the data in the databse
    const turfDeatils = await Turf.create({
          turfName,turfDescription,turfTitle,turfOwner,turfPricePerHour,turfLocation,turfImages,turfAddress,turfAmentities,turfRules,turfSize,turfAvailability,turfOwnerPhoneNumber,slots,
    });
    console.log("turf details",turfDeatils);
    const createSports = await Sport.create({
        sports:sports,
        turfId:turfDeatils._id,
    })
    turfDeatils.sports.push(createSports._id);
    await turfDeatils.save()
    // send email to the turf owner
    // return the response
    return res.status(200).json({
        success:true,
        message:"turf created successfully!",
        turf:turfDeatils
    })

    }catch(error){
        console.log(error);
         return res.status(500).json({
            success:false,
            message:"error while creating the turf",
            error:error.message,
        })
    }
}

exports.updateTurf = async (req, res) => {
  try {
    const { turfId, sports, ...updateData } = req.body;

    // Validate turfId
    if (!turfId) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid turfId",
      });
    }

    // Find the turf in the database
    const findTurf = await Turf.findById(turfId);
    if (!findTurf) {
      return res.status(404).json({
        success: false,
        message: "Turf not found in the database",
      });
    }

    // Update the turf fields (excluding sports)
    Object.keys(updateData).forEach((key) => {
      findTurf[key] = updateData[key];
    });

    // Save the updated turf in the database
    const updatedTurf = await findTurf.save();

    // Update the sports field in the Sport model
    if (sports && Array.isArray(sports)) {
      // Find the Sport document associated with the turfId
      let sportDoc = await Sport.findOne({ turfId });

      if (!sportDoc) {
        // If no Sport document exists, create a new one
        sportDoc = new Sport({
          turfId,
          sports,
        });
      } else {
        // If a Sport document exists, update the sports field
        sportDoc.sports = sports;
      }

      // Save the updated Sport document
      await sportDoc.save();
    }

    // Return the response
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
// delete turf
exports.deleteTurf = async(req,res)=>{
    try{
        // get the turf id from the user
        const {turfId}= req.body;
        if(!turfId){
            return res.status(400).json({
                success:false,
                message:"please enter the turfId properly"
            })
        }
        // check if user exits in the databse
        const findTurfId = await Turf.findById(turfId);
        if(!findTurfId){
            return res.status(400).json({
                success:false,
                message:"error while finding the find by id"
            })
        }
        // if exits delete the turf 
        const deleteTurf = await Turf.findByIdAndDelete(turfId);
        // return the response
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
// get all turf
exports.getAllTurf = async(req,res)=>{
    try{
        // get all turf from the databse
        const fetchAllTurf = await Turf.find().populate("sports")
        if(fetchAllTurf.length===0){
            return res.status(400).json({
                success:false,
                message:"no turf found in the database"
            })
        }
        // return the response
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
// get turf by ,location
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
      }).populate("comments");
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
// get turf by id 
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
      // Calculate average rating
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
// view all users
exports.viewAllUsers= async(req,res)=>{
    try{
        // get all users from the databse
        const fetchAllUsers= await User.find();
        if(fetchAllUsers.length===0){
            return res.status(400).json({
                success:false,
                message:"no user find in the database"
            })
        }
        // return the response
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

// view all bookings details and search particular turf bookings
exports.allBookings = async(req,res)=>{
    try{

    }catch(error){

    }
}
// view particular search bookings with the booking id
exports.viewBookingById = async(req,res)=>{
    try{

    }catch(error){

    }
}
// cancel booking
// confirmation booking
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
// getTurfSlots
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
