require('dotenv').config();
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.EMAIL_KEY);

const sendMail = async ({
  email,
  from,
  name,
  phone,
  shop,
  message,
  appointment,
  serviceName,
  price,
  time,
}) => {
  const emailToSend = {
    booking: {
      from: {
        email: process.env.FROM_EMAIL,
        name: '2U Reservations',
      },
      templateId: 'd-9b174fa524514f7db22ab764ebae4b5b',
      replyTo: {
        email: process.env.FROM_EMAIL,
        name: '2U Customer Service Team',
      },
      subject: 'Booking Confirmation',
      personalizations: [
        {
          to: [
            {
              email: email,
              name: name,
            },
          ],
          dynamicTemplateData: {
            name: name.toUpperCase(),
            service: serviceName.toUpperCase(),
            time: time.toUpperCase(),
            shop: shop.toUpperCase(),
            price: `${price}`.toUpperCase(),
            date: appointment.toUpperCase(),
          },
          bcc: [
            {
              email: process.env.FROM_EMAIL,
              name: '2U team',
            },
          ],
        },
      ],
    },
    contact: {
      to: email,
      from: process.env.FROM_EMAIL,
      subject: `2U Aesthetics booking confirmation`,
      text: `${name}, ${email}, ${phone}, ${shop}, ${message}`,
    },
  };

  sgMail
    .send(emailToSend[from])
    .then((res) => console.log('Mail sent successfully'))
    .catch((error) => {
      console.error(error, error.response.body.errors);
    });
};

module.exports = sendMail;
