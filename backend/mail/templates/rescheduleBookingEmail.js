const rescheduleBookingEmail = (
    firstName,
    lastName,
    turfName,
    oldTimeSlot,
    newTimeSlot,
    oldDate,
    newDate
) => {
    return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Booking Rescheduled</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.6;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
                text-align: center;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                padding: 20px;
                background: white;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
                font-size: 22px;
                font-weight: bold;
                color: #0275d8;
            }
            .details {
                font-size: 18px;
                font-weight: bold;
                color: #333;
            }
            .highlight {
                font-weight: bold;
                color: #d9534f;
            }
            .footer {
                margin-top: 20px;
                font-size: 14px;
                color: #555;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">Your Turf Booking Has Been Rescheduled</div>
            <p>Dear <span class="highlight">${firstName} ${lastName}</span>,</p>
            <p>Your turf booking has been successfully rescheduled.</p>
            <div class="details">
                <p><strong>Turf Name:</strong> ${turfName}</p>
                <p><strong>Previous Slots:</strong> ${Array.isArray(oldTimeSlot) ? oldTimeSlot.join(", ") : oldTimeSlot}</p>
                <p><strong>New Slots:</strong> ${Array.isArray(newTimeSlot) ? newTimeSlot.join(", ") : newTimeSlot}</p>
                <p><strong>Previous Date:</strong> ${oldDate}</p>
                <p><strong>New Date:</strong> ${newDate}</p>
            </div>
            <p>If you need further changes, please contact us.</p>
            <div class="footer">
                If you have any questions, feel free to contact us at 
                <a href="mailto:info@kickonturf.com">info@kickonturf.com</a>.
            </div>
        </div>
    </body>
    </html>`;
};

module.exports = { rescheduleBookingEmail };
