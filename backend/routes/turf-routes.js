const { createTurf, updateTurf, deleteTurf, getAllTurf, viewAllUsers, getAllTurfLocations } = require("../controllers/turf-controller");
const{auth,isAdmin} = require("../middlewares/auth-middleware");
// importing the controllers for routing

const express= require("express");
const router = express.Router();
router.post("/createTurf",auth,isAdmin,createTurf);
router.post("/updateTurf",auth,isAdmin,updateTurf);
router.post("/deleteTurf",auth,isAdmin,deleteTurf);
router.get("/getAllTurf",auth,isAdmin,getAllTurf);
router.get("/viewAllUser",auth,isAdmin,viewAllUsers);
router.get("/getAllTurfLocations",getAllTurfLocations);

module.exports = router;