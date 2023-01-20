require('dotenv').config();

const contactTemplate = ({ name, email, ...props }) => {
  return {
    from: {
      email: process.env.FROM_EMAIL,
      name: 'Advanced Beauty Reservations',
    },
    templateId: 'd-9b174fa524514f7db22ab764ebae4b5b',
    replyTo: {
      email: 'fjrocavazquez@gmail.com',
      name: 'Javier Roca',
    },
    subject: 'Email contact confirmation',
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
        },
      },
    ],
  };
};

module.exports = contactTemplate;
