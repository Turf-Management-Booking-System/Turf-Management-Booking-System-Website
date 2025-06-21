const { createTurf, updateTurf, deleteTurf, getAllTurf, viewAllUsers, getAllTurfLocations,getTurfSelectedLocation,getTurfById, getTurfSlots, getAllSports, getTotalRevenue, getMonthlyRevenue, getMonthlyBookings,  getSportsUtilization, getMonthlyBookingsForUser,getMonthlyBookingsTrend, getTurfSlotsByDate,getTopBookedTurfs } = require("../controllers/turf-controller");
const{auth,isAdmin,isUser} = require("../middlewares/auth-middleware");
// importing the controllers for routing

const express= require("express");
const router = express.Router();
router.post("/createTurf",auth,createTurf);
router.put("/updateTurf",auth,updateTurf);
router.delete("/deleteTurf",auth,deleteTurf);
router.get("/getAllTurf",getAllTurf);
router.get("/viewAllUser",auth,isAdmin,viewAllUsers);
router.get("/getAllTurfLocations",getAllTurfLocations);
router.get("/getAllTurfLocations/:location",getTurfSelectedLocation);
router.get("/getTurfById/:id",getTurfById);
router.get("/getAllSports",getAllSports);
router.get("/getTotalRevenue",auth,getTotalRevenue);
router.get("/getMonthlyRevenue",auth,getMonthlyRevenue);
router.get("/getMonthlyBookings",auth,getMonthlyBookings);
router.get("/getSportsUtilization",auth,getSportsUtilization);
router.get("/getMonthlyBookingForUser/:userId",auth,getMonthlyBookingsForUser);
router.get("/getMonthlyBookingsTrend/:userId",auth,getMonthlyBookingsTrend);
router.get("/getTurfSlotByDate/:turfId/:date",getTurfSlotsByDate)
router.get("/getTopBookedTurfs",getTopBookedTurfs)
// Only allow turfId to be numbers
router.get("/:turfId(\\d+)/slots", getTurfSlots);

module.exports = router;