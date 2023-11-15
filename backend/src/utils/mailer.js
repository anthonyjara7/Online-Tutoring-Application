require("dotenv").config({ path: __dirname + "/../../.env" });
const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
  // Set up nodemailer transport (using a service like Gmail, Outlook, etc.)
  let transporter = nodemailer.createTransport({
    // Example with Gmail; replace with your email service details
    service: "gmail",
    auth: {
      user: process.env.MFA_EMAIL,
      pass: process.env.MFA_PASSWORD,
    },
  });

  // Email options

  let now = new Date();
  let formattedDateTime = now.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  let mailOptions = {
    from: process.env.MFA_EMAIL,
    to: email,
    subject: `${subject} - ${formattedDateTime}`,
    text: text,
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };
