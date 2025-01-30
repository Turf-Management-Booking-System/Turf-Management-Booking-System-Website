const sendOTPEmail = ( otp) => {
    return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Password Update Confirmation</title>
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
                font-size:20px;
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
            <div class="message">OTP Sent Successfully!</div>
            <div class="body">
                <p>Hey User!,</p>
                <p>Your OTP is: <span class="highlight">${otp}</span></p>
                <p>If you did not request this OTP, please contact us immediately to secure your account.</p>
            </div>
            <div class="support">
                If you have any questions or need further assistance, feel free to reach us at 
                <a href="mailto:info@kickonturf.com">info@kickonturf.com</a>. We are here to help!
            </div>
        </div>
    </body>
    </html>`;
};

module.exports = { sendOTPEmail };
