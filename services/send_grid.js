require('dotenv').config();

const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.EMAIL_KEY);

const sendMail = async ({ email, appointment, time, serviceName }) => {
  const msg = {
    to: 'process.env.FROM_EMAIL',
    from: process.env.FROM_EMAIL,
    subject: `2U Aesthetics booking confirmation`,
    text: `we are happy to confirm that your reservation`,
  };

  try {
    // await sgMail.send(msg);
    console.log('email sent');
  } catch (err) {
    if (err.response) {
      console.log(err.response.body);
    }
  }
};

module.exports = sendMail;
