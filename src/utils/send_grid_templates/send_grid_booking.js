require('dotenv').config();

const bookingMsg = ({
  email,
  name,
  serviceName,
  time,
  shop,
  appointment,
  price,
}) => {
  return {
    from: {
      email: process.env.FROM_EMAIL,
      name: 'Advanced Beauty Reservations',
    },
    templateId: 'd-94eb99a23bb742ebabd149644f3eec8f',
    replyTo: {
      email: process.env.FROM_EMAIL,
      name: 'Advanced Beauty Customer Service Team',
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
          price: `${price} €`.toUpperCase(),
          date: appointment.toUpperCase(),
        },
      },
    ],
  };
};

module.exports = bookingMsg;
