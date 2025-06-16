const nodemailer = require("nodemailer");
require("dotenv").config();
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "kadarbishaikh56@gmail.com", 
    pass:"hqwunynrpljhrfhx", 
  },
});
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
