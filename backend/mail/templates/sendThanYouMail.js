const sendThankYouEmail = (fullName) => {
    return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Thank You for Contacting Us</title>
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
                border-radius: 10px; /* Optional: Add rounded corners to the container */
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
            <div class="message">Thank You for Contacting Us!</div>
            <div class="body">
                <p>Dear</p><span>${fullName}</span>
                <p>Thank you for reaching out to us. We appreciate your interest and will get back to you shortly.</p>
                <p>Your inquiry is important to us, and we are committed to providing you with the best possible assistance.</p>
                <p>In the meantime, feel free to explore our website or contact us for any urgent matters.</p>
            </div>
            <div class="support">
                If you have any questions or need further assistance, feel free to reach us at 
                <a href="mailto:info@kickonturf.com">info@kickonturf.com</a>. We are here to help!
            </div>
        </div>
    </body>
    </html>`;
};

module.exports = { sendThankYouEmail };
