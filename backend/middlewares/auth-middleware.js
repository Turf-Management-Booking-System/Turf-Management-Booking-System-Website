// import model
require("dotenv").config();
const jwt = require("jsonwebtoken");
exports.auth=async(req,res,next)=>{
    try {
        const token = req.cookies.token || req.header("Authorization").replace("Bearer ", "") 
       

        if(!token || token === 'undefined'){
            return res.status(400).json({
                success:false,
                message:"Token missing!"
            })
        }
        try{
         const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY);
         req.user = decoded;
         console.log("user data from decoded",req.user);
         next();
        }catch(err){
            return res.status(401).json({
                success:false,
                message:"invalid token",
                error:err.message
            })
        }
       
    } catch (error) {
        console.log("Error",error)
        return res.status(500).json({
            success:false,
            message:"error while fetching  token",
            error:error.message
        })
    }
}
exports.isUser= async(req,res,next)=>{
    try {
        if(req.user.role!=='Player'){
            return res.status(401).json({
                success:false,
                message:'this is protected route for player'
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"error while fetching  the player protected route"
        })
    }
}
exports.isAdmin =async (req,res,next) => {
    try {
        if(req.user.role!=='Admin'){
            return res.status(401).json({
                success:false,
                message:'this is protected route for Admin'
            });
        }
        
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"error while fetching  the Admin protected route"
        })
    }
}
exports.isUserOrAdmin = async (req, res, next) => {
    try {
        if (req.user.role === "Player" || req.user.role === "Admin") {
            next(); // Allow access
        } else {
            return res.status(403).json({
                success: false,
                message: "Access denied. You are not authorized."
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error while checking user role",
            error: error.message
        });
    }
};