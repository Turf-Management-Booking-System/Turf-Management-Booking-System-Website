const sendAccountDeletionEmail = (firstName,lastName) => {
    return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Account Deleted Successfully</title>
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
                color: #d9534f; /* Red color for alert */
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
            <div class="message">Your Account Has Been Deleted</div>
            <div class="body">
                <p>Dear ${firstName} ${lastName},</p>
                <p>We want to inform you that your account on <strong>KickOnTurf</strong> has been successfully deleted.</p>
                <p>If you did not request this action, please contact us immediately to recover your account.</p>
                <p>We're sorry to see you go! If you change your mind, you’re always welcome to create a new account and rejoin us.</p>
                <p>Thank you for being a part of our community. We appreciate the time you spent with us.</p>
            </div>
            <div class="support">
                If you need any assistance, feel free to reach us at 
                <a href="mailto:info@kickonturf.com">info@kickonturf.com</a>. We are here to help!
            </div>
        </div>
    </body>
    </html>`;
};

module.exports = { sendAccountDeletionEmail };
