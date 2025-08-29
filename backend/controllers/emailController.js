const transporter = require('../utils/emailTransporter');

async function sendTestEmail(toEmail) {
    const mailOptions = {
        from: `"Natraj Book Depot" <${process.env.SMTP_USER}>`,
        to: toEmail,
        subject: 'Test Email from Natraj Book Depot',
        text: 'This is a test email sent using Ethereal SMTP server.',
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

module.exports = { sendTestEmail };
