require('dotenv').config();

const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.EMAIL_KEY);

const sendMail = async ({
  email,
  appointment,
  time,
  serviceName,
  from,
  name,
  phone,
  shop,
  message,
}) => {
  const emailToSend = {
    booking: {
      to: email,
      from: process.env.FROM_EMAIL,
      subject: `2U Aesthetics booking confirmation`,
      text: `We are happy to confirm that your reservation`,
    },
    contact: {
      to: email,
      from: process.env.FROM_EMAIL,
      subject: `2U Aesthetics booking confirmation`,
      text: `${name}, ${email}, ${phone}, ${shop}, ${message}`,
    },
  };

  try {
    await sgMail.send(emailToSend[from]);
    const msg = 'Email sent';
    return { msg };
  } catch (err) {
    if (err) {
      if (err) {
        const error = {};
        error.msg = 'Something went wrong';
        return { err };
      }
    }
  }
};

module.exports = sendMail;
