const cloudinary= require("cloudinary").v2;
// load all the cloud detail from .env file
require("dotenv").config();

// configuration
exports.cloudinaryConnect=()=>{
    try {
        cloudinary.config({ 
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
            api_key:process.env.CLOUDINARY_API_KEY , 
            api_secret: process.env.CLOUDINARY_API_SECRET
          });
    } catch (error) {
         console.log(error);
    
    }
}



