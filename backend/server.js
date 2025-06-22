const express = require("express");
const connectDB = require("./config/database");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser")

const PORT =  process.env.PORT || 4000;
  
app.use(express.json());
app.use(cors({ origin: [
    "https://kick-on-turf.onrender.com",
    "http://localhost:5175",
    "http://localhost:5173"

], 
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials:true,
    allowedHeaders:["Content-Type","Authorization","withCredentials" ,"Accept"]
}));
app.use(cookieParser());
app.options("*", cors());
const fileupload =require("express-fileupload");
app.use(fileupload({
    useTempFiles: true,       
    tempFileDir: '/tmp/'}      
));
app.use(express.urlencoded({ extended: true })); 
require("./cron/updateSlotsStatus")
const {cloudinaryConnect} =require("./config/cloudinary");
cloudinaryConnect();
require("dotenv").config();
// import the routes
const authRoutes = require("./routes/auth-routes");
const turfRoutes = require("./routes/turf-routes");
const notifyRoutes = require("./routes/notify-routes");
const chatBotRoutes =require("./routes/chatBot-routes");
const commentRoutes = require("./routes/comment-routes");
const bookingRoutes = require("./routes/booking-routes");
app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/turf",turfRoutes);
app.use("/api/v1/notify",notifyRoutes);
app.use("/api/v1/ai",chatBotRoutes);
app.use("/api/v1/comment",commentRoutes);
app.use("/api/v1/booking",bookingRoutes)
app.get("/",(req,res)=>{
       res.send("hello jee kaise ho")
})
connectDB();
app.listen(PORT,(req,res)=>{
    console.log(`server is running on port ${PORT}`)
});


