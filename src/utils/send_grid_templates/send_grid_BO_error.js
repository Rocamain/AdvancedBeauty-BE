require('dotenv').config();

const errorMsg = ({ email, name, route }) => {
  return {
    from: {
      email: process.env.FROM_EMAIL,
      name: 'Advanced Beauty Back Office Error',
    },
    templateId: 'd-46ea8ebbc3fd4b95b032267c49c1fd78',
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
          email: email.toUpperCase(),
          error: route,
        },
      },
    ],
  };
};

module.exports = errorMsg;
