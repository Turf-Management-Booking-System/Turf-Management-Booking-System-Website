const cron = require("node-cron");
const Turf = require("../models/turf");
cron.schedule("0 * * * *", async () => {
    try {
        const now = new Date();
        console.log("Cron job running at:", now);
        const turfs = await Turf.find({
            "slots.bookingEndTime": { $lte: now }, 
            "slots.status": "booked", 
        });
        for (const turf of turfs) {
            turf.slots.forEach((slot) => {
                if (slot.bookingEndTime && slot.bookingEndTime <= now && slot.status === "booked") {
                    console.log("Updating slot:", slot.time, "to available");
                    slot.status = "available";
                    slot.bookingEndTime = null; 
                }
            });

            await turf.save();
        }

        console.log(`Updated slots to "available" for ${turfs.length} turfs.`);
    } catch (error) {
        console.error("Error updating slot statuses:", error);
    }
});