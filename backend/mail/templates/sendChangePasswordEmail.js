const sendChangePasswordEmail = (firstName,lastName) => {
    return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Password Changed Successfully</title>
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
                border-radius: 10px; /* Optional: Add rounded corners */
            }
            .logo {
                max-width: 200px;
                margin-bottom: 20px;
            }
            .message {
                font-size: 20px;
                font-weight: bold;
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
            <div class="message">Password Changed Successfully!</div>
            <div class="body">
                <p>Dear ${firstName} ${lastName},</p>
                <p>We wanted to inform you that your password has been successfully changed.</p>
                <p>If you did not request this change, please contact us immediately to secure your account.</p>
                <p>For enhanced security, we recommend using a strong and unique password that you do not use for other accounts.</p>
                <p>Thank you for choosing our service. Your security is our priority!</p>
            </div>
            <div class="support">
                If you have any questions or need further assistance, feel free to reach us at 
                <a href="mailto:info@kickonturf.com">info@kickonturf.com</a>. We are here to help!
            </div>
        </div>
    </body>
    </html>`;
};

module.exports = { sendChangePasswordEmail };
