const nodemailer = require("nodemailer");
require("dotenv").config();
// Create a transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "kadarbishaikh56@gmail.com", // Your Gmail
    pass:"hqwunynrpljhrfhx", // Use an App Password, not your Gmail password
  },
});

// Function to send an email
const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: "kadarbishaikh56@gmail.com",
      to: to,
      subject: subject,
      html:html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
module.exports = sendEmail
