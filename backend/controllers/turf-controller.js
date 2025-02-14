
const Turf = require("../models/turf")
// create turf
exports.createTurf=async(req,res)=>{
    try{
    // get the data from the admin
    const{turfName,turfDescription,turfTitle,turfOwner,turfPricePerHour,turfLocation,turfImages,turfAddress,turfAmentities,turfRules,turfSize,turfAvailability,turfOwnerPhoneNumber,token}= req.body;
    // validate the data from the admin
    if(!turfName||!turfDescription||!turfTitle||!turfOwner||!turfPricePerHour||!turfLocation||!turfImages||!turfAddress||!turfAmentities||!turfRules||!turfSize||!turfAvailability||!turfOwnerPhoneNumber||!token){
        return res.status(400).json({
            success:false,
            message:"please neter the turf details!"
        })
    }
    // store the data in the databse
    const turfDeatils = await Turf.create({
          turfName,turfDescription,turfTitle,turfOwner,turfPricePerHour,turfLocation,turfImages,turfAddress,turfAmentities,turfRules,turfSize,turfAvailability,turfOwnerPhoneNumber
    });
    console.log("turf details",turfDeatils);
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
// update turf
exports.updateTurf = async(req,res)=>{
    try{
    // get the turf id 
    const {turfId,...updateData} = req.body;
    if(!turfId){
        return res.status(400).json({
            success:false,
            message:"please enter the correct turfId"
        })
    }
    // find the turf in the databse
    const findTurf = await Turf.findById(turfId);
    if(!findTurf){
        return res.status(400).json({
            success:false,
            message:"turf not found in the database"
        })
    }
    // if find update the turf
    Object.keys(updateData).forEach((key) => {
        findTurf[key] = updateData[key];
    });

    // save in the databse
    const updatedData = await findTurf.save();
    // return the response
    return res.status(200).json({
        success:true,
        message:"Turf uPdated successfully!",
        turf:updateData,
    })

    }catch(error){
        console.log("error",error);
        return res.status(500).json({
            success:false,
            message:"error while updating the turf",
            error:error.message,
        })
    }
}
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
        const fetchAllTurf = await Turf.find();
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
// get turf by id,name,location,price
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