const { createNotication, getNotifications, markAsRead, deleteNotification } = require("../controllers/notify-controller");
const express= require("express");
const router = express.Router();

router.post("/createNotification",createNotication);
router.get("/getNotifications/:userId",getNotifications);
router.patch("/markAsRead/:notificationId",markAsRead);
router.delete("/deleteNotification/:notificationId",deleteNotification);

module.exports = router;