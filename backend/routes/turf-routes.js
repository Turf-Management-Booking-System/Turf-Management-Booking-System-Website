const { createTurf, updateTurf, deleteTurf, getAllTurf, viewAllUsers, getAllTurfLocations,getTurfSelectedLocation,getTurfById, getTurfSlots, getAllSports, getFutureWeatherData} = require("../controllers/turf-controller");
const{auth,isAdmin,isUser} = require("../middlewares/auth-middleware");
// importing the controllers for routing

const express= require("express");
const router = express.Router();
router.post("/createTurf",auth,createTurf);
router.post("/updateTurf",auth,updateTurf);
router.delete("/deleteTurf",auth,deleteTurf);
router.get("/getAllTurf",getAllTurf);
router.get("/viewAllUser",auth,isAdmin,viewAllUsers);
router.get("/getAllTurfLocations",auth,getAllTurfLocations);
router.get("/getAllTurfLocations/:location",auth,getTurfSelectedLocation);
router.get("/getTurfById/:id",auth,getTurfById);
router.get("/:turfId/slots",auth,isUser,getTurfSlots);
router.get("/getAllSports",auth,isUser,getAllSports)
module.exports = router;