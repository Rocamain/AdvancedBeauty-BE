require('dotenv').config();

const bookingBEMsg = ({
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
      name: 'Advanced Beauty Reservations <no reply>',
    },
    templateId: 'd-d857fea8e34842c3b6f4b4e43a2cf1df',
    replyTo: {
      email: 'fjrocavazquez@gmail.com',
      name: 'Advanced Beauty Customer Service Team',
    },
    subject: 'Booking Confirmation',
    personalizations: [
      {
        to: [
          {
            email: '2u.customer.service.contact@gmail.com',
            name: 'JBack Office Team',
          },
        ],

        dynamicTemplateData: {
          name: name.toUpperCase(),
          email: email.toUpperCase(),
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

module.exports = bookingBEMsg;
