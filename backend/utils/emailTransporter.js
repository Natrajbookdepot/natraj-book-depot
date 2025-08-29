const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,        // 'smtp.ethereal.email'
    port: process.env.SMTP_PORT,        // 587
    auth: {
        user: process.env.SMTP_USER,    // Ethereal email
        pass: process.env.SMTP_PASS     // Ethereal password
    }
});

module.exports = transporter;
