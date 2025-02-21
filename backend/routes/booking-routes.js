const express= require("express");
const { bookingTurf, cancelBooking, rescheduleBooking } = require("../controllers/booking-controller");
const {auth,isUser} = require("../middlewares/auth-middleware")
const router = express.Router();

router.post("/bookingTurf/:turfId/:userId",auth,isUser,bookingTurf);
router.delete("/cancelBooking/:bookingId",auth,isUser,cancelBooking);
router.post("/rescheduleBooking",auth,isUser,rescheduleBooking);
module.exports = router;