const mongoose = require("mongoose");

// load the env to the process object
require("dotenv").config();

// function database connection
const connectDB= async()=>{
    try{
     const connection = await mongoose.connect(process.env.DATABASE_URL);
     console.log(`Mongodb connected successfully to the host ${connection.connection.host}`);
    }catch(error){
      console.log("error",error);
      process.exit(1);
    }
}

// exports the function
module.exports = connectDB;