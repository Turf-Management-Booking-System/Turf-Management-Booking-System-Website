const express = require("express");
const connectDB = require("./config/database");
const cors = require("cors");
const app = express();
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
}))
require("dotenv").config();
// import the routes
const authRoutes = require("./routes/auth-routes");
const turfRoutes = require("./routes/turf-routes");
const notifyRoutes = require("./routes/notify-routes")
app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/turf",turfRoutes);
app.use("/api/v1/notify",notifyRoutes);
// root route
app.get("/",(req,res)=>{
       res.send("hello jee kaise ho")
})
// connection to db
connectDB();
// activate the server
app.listen(PORT,(req,res)=>{
    console.log(`server is running on port ${PORT}`)
});