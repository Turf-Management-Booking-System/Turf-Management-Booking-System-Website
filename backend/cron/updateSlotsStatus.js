const cron = require("node-cron");
const Turf = require("../models/turf");

// Schedule a cron job to run every hour
cron.schedule("0 * * * *", async () => {
    try {
        const now = new Date();
        console.log("Cron job running at:", now);

        // Find all turfs with slots that have passed their bookingEndTime
        const turfs = await Turf.find({
            "slots.bookingEndTime": { $lte: now }, // Slots where bookingEndTime has passed
            "slots.status": "booked", // Only update slots that are still "booked"
        });

        // Update slot status to "available"
        for (const turf of turfs) {
            turf.slots.forEach((slot) => {
                if (slot.bookingEndTime && slot.bookingEndTime <= now && slot.status === "booked") {
                    console.log("Updating slot:", slot.time, "to available");
                    slot.status = "available";
                    slot.bookingEndTime = null; // Clear the bookingEndTime
                }
            });

            await turf.save();
        }

        console.log(`Updated slots to "available" for ${turfs.length} turfs.`);
    } catch (error) {
        console.error("Error updating slot statuses:", error);
    }
});