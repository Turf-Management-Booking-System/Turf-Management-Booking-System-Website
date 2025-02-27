const cancelBookingEmail = (firstName, lastName, turfName, timeSlot, date) => {
    return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Booking Cancellation</title>
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
                color: #d9534f;
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
            <div class="header">Your Turf Booking Has Been Cancelled</div>
            <p>Dear <span class="highlight">${firstName} ${lastName}</span>,</p>
            <p>We regret to inform you that your booking has been cancelled.</p>
            <div class="details">
                <p><strong>Turf Name:</strong> ${turfName}</p>
                <p><strong>Booked Slots:</strong> ${Array.isArray(timeSlot) ? timeSlot.join(", ") : timeSlot}</p>
                <p><strong>Date:</strong> ${date}</p>
            </div>
            <p>If this cancellation was a mistake or you wish to rebook, please visit our website.</p>
            <div class="footer">
                If you have any questions, feel free to contact us at 
                <a href="mailto:info@kickonturf.com">info@kickonturf.com</a>.
            </div>
        </div>
    </body>
    </html>`;
};

module.exports = { cancelBookingEmail };
