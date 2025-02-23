const { createTurf, updateTurf, deleteTurf, getAllTurf, viewAllUsers, getAllTurfLocations,getTurfSelectedLocation,getTurfById, getTurfSlots, getAllSports, } = require("../controllers/turf-controller");
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
router.get("/:turfId/slots",getTurfSlots);
router.get("/getAllSports",getAllSports)
module.exports = router;