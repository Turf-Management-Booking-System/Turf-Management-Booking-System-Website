const express = require("express");
const connectDB = require("./config/database");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser")
require("./cron/weatherCron");
const {getWeather} = require("./controllers/weather-controller")

// defines the ports
const PORT =  process.env.PORT || 4000;
  
// for json data to accept
app.use(express.json());
app.use(cors({ origin: [
    "http://localhost:5175",
    "http://localhost:5173"
], 
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials:true,
    allowedHeaders:["Content-Type","Authorization","withCredentials"]
}));
app.use(cookieParser());
const fileupload =require("express-fileupload");
app.use(fileupload({
    useTempFiles: true,       // Enable temp files
    tempFileDir: '/tmp/'}      // Directory for temp files
));
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const {cloudinaryConnect} =require("./config/cloudinary");
cloudinaryConnect();
require("dotenv").config();
// import the routes
const authRoutes = require("./routes/auth-routes");
const turfRoutes = require("./routes/turf-routes");
const notifyRoutes = require("./routes/notify-routes");
const chatBotRoutes =require("./routes/chatBot-routes");
const commentRoutes = require("./routes/comment-routes");
app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/turf",turfRoutes);
app.use("/api/v1/notify",notifyRoutes);
app.use("/api/v1/ai",chatBotRoutes);
app.use("/api/v1/comment",commentRoutes);
// root route
app.get("/",(req,res)=>{
       res.send("hello jee kaise ho")
})
app.get('/weather', getWeather);
// connection to db
connectDB();
// activate the server
app.listen(PORT,(req,res)=>{
    console.log(`server is running on port ${PORT}`)
});

// api think

