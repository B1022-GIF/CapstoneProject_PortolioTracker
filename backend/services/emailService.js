const nodemailer = require('nodemailer');

async function sendEmail({ to, subject, text, html, attachments }) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Portfolio Tracker" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
    attachments,
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
}

module.exports = { sendEmail };
