const express = require("express");
const connectDB = require("./config/database");
const cors = require("cors");
const app = express();
// defines the ports
const PORT =  process.env.PORT || 4000;
// for json data to accept
app.use(express.json());
app.use(cors({ origin: '*', 
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials:true,
}))
require("dotenv").config();
// import the routes
const authRoutes = require("./routes/auth-routes");
const turfRoutes = require("./routes/turf-routes")
app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/turf",turfRoutes);
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