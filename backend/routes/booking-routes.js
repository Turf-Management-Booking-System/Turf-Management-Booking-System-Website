const express= require("express");
const { bookingTurf, cancelBooking, rescheduleBooking, getUserBookingDetails, getAllBookingsOfUser, getUserFeedback, getAllBookings } = require("../controllers/booking-controller");
const {auth,isUser} = require("../middlewares/auth-middleware")
const router = express.Router();

router.post("/bookingTurf/:turfId/:userId",auth,isUser,bookingTurf);
router.delete("/cancelBooking/:bookingId",auth,isUser,cancelBooking);
router.post("/rescheduleBooking",auth,isUser,rescheduleBooking);
router.get("/getUserBookingDetails/:userId",auth,isUser,getUserBookingDetails);
router.get("/getAllBookings/:userId",auth,getAllBookingsOfUser);
router.post("/getUserFeedback",auth,isUser,getUserFeedback);
router.get("/getAllBookings",auth,getAllBookings)

module.exports = router;