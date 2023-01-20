require('dotenv').config();

const contactBEMsg = ({ name, email, shop, message, ...props }) => {
  return {
    from: {
      email: process.env.FROM_EMAIL,
      name: 'Advanced Beauty Contact Back Office',
    },
    templateId: 'd-eeb5419dd0324b79baddf02c60d7a493',
    replyTo: {
      email: email,
      name: name,
    },
    subject: 'Email contact confirmation resend',
    personalizations: [
      {
        to: [
          {
            email: '2u.customer.service.contact@gmail.com',
            name: 'Back Office Team',
          },
        ],
        dynamicTemplateData: {
          name: name.toUpperCase(),
          email: email,
          shop: shop,
          message: message,
        },
      },
    ],
  };
};
module.exports = contactBEMsg;
