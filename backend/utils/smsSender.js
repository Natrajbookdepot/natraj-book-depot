const twilio = require("twilio");

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

async function sendSMS(to, body) {
  try {
    const message = await client.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to, // The user phone number including country code, e.g. +919876543210
    });
    return message.sid;
  } catch (error) {
    console.error("Twilio SMS error:", error);
    throw error;
  }
}

module.exports = sendSMS;
