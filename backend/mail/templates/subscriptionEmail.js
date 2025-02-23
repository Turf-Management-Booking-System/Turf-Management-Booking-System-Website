const subscriptionEmail = (email) => {
    return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Subscription Confirmed</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.4;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                padding: 20px;
                background: #ffffff;
                border-radius: 10px;
                text-align: center;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
            .logo {
                max-width: 150px;
                margin-bottom: 20px;
            }
            .message {
                font-size: 22px;
                font-weight: bold;
                color: #333;
            }
            .content {
                font-size: 16px;
                margin-top: 10px;
                color: #555;
            }
            .footer {
                margin-top: 20px;
                font-size: 14px;
                color: #777;
            }
            .highlight {
                color: #007bff;
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <img class="logo" src="https://your-logo-url.com/logo.png" alt="Company Logo" />
            <div class="message">You're Subscribed!</div>
            <div> ${email}</div>
            <div class="content">
                <p>Dear Valued Subscriber,</p>
                <p>Thank you for subscribing to our updates! 🎉 You will now receive the latest news, exclusive offers, and exciting content directly in your inbox.</p>
                <p>We are committed to keeping you informed and engaged with everything happening at <span class="highlight">KickOnTurf</span>. Stay tuned for upcoming updates!</p>
                <p>If you ever wish to update your preferences or unsubscribe, you can do so at any time.</p>
            </div>
            <div class="footer">
                <p>For any questions, feel free to reach us at 
                <a href="mailto:info@kickonturf.com">info@kickonturf.com</a>. We’re happy to help!</p>
                <p>Follow us on <a href="https://twitter.com/kickonturf">Twitter</a> | <a href="https://facebook.com/kickonturf">Facebook</a> | <a href="https://instagram.com/kickonturf">Instagram</a></p>
            </div>
        </div>
    </body>
    </html>`;
};

module.exports = { subscriptionEmail };
