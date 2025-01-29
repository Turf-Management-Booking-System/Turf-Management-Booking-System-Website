require("dotenv").config();
const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD,
            },
            logger: true, // Enable logging
            debug:true
        });

        await transporter.sendMail({
            from: '"StudyNotion || CodeHelp - by Sabina"',
            to: email,
            subject: title,
            html: body,
        });
        console.log("Mail sent successfully!");
    } catch (error) {
        console.error("Error sending email:", error);
        throw error; // Optional: rethrow for further handling
    }
};
module.exports = mailSender;
