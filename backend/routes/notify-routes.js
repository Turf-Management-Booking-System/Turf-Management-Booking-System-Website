const { createNotication, getNotifications, markAsRead, deleteNotification } = require("../controllers/notify-controller");
const express= require("express");
const router = express.Router();

router.post("/createNotification",createNotication);
router.get("/getNotifications",getNotifications);
router.patch("/markAsRead",markAsRead);
router.delete("/deleteNotication",deleteNotification);

module.exports = router;