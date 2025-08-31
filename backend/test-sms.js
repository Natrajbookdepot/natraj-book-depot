require('dotenv').config();
const sendSMS = require('./utils/smsSender');

const testPhone = "+919909075988";

sendSMS(testPhone, 'Test SMS for phone verification')
  .then(sid => console.log('SMS sent with SID:', sid))
  .catch(console.error);
// Run with: node test-sms.js