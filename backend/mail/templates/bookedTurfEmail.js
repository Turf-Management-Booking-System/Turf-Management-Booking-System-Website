const bookedTurfEmail = (firstName, lastName,turfName, slots, date) => {
    return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Turf Booking Confirmation</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.4;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                text-align: center;
                border-radius: 10px;
            }
            .logo {
                max-width: 200px;
                margin-bottom: 20px;
            }
            .message {
                font-size: 20px;
                font-weight: bold;
            }
            .highlight {
                font-weight: bold;
                padding: 2px;
                border-radius: 5px;
            }
            .support {
                font-size: 16px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <a href="https://images.vexels.com/media/users/3/197720/raw/fc507e66f92633eb77d54a6000aa7829-online-learning-logo-template.jpg">
                <img class="logo" src="" alt="kickonturf logo" />
            </a>
            <div class="message">Turf Booking Confirmed!</div>
            <div class="body">
                <p>Dear <span class="highlight">${firstName} ${lastName}</span>,</p>
                <p>Your booking has been confirmed for <span class="highlight">${turfName}</span>.</p>
                <p><strong>Date:</strong> ${date}</p>
                <p><strong>Booked Slots:</strong> ${slots.join(", ")}</p>
                <p>We appreciate your booking and look forward to hosting you. Please arrive on time and enjoy your game!</p>
            </div>
            <div class="support">
                If you have any questions or need to reschedule, contact us at 
                <a href="mailto:info@kickonturf.com">info@kickonturf.com</a>. We are here to assist you!
            </div>
        </div>
    </body>
    </html>`;
};

module.exports = { bookedTurfEmail };
