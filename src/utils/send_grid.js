const bookingMsg = require('./send_grid_templates/send_grid_booking');
const contactMsg = require('./send_grid_templates/send_grid_contact');
const bookingBOMsg = require('./send_grid_templates/send_grid_BO_booking');
const contactBOMsg = require('./send_grid_templates/send_grid_BO_contact.js');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.EMAIL_KEY);

const customerMsg = {
  booking: (props) => bookingMsg({ ...props }),
  contact: (props) => contactMsg({ ...props }),
};

const backOfficeMsg = {
  booking: (props) => bookingBOMsg({ ...props }),
  contact: (props) => contactBOMsg({ ...props }),
};

const sendMail = async ({ from, ...props }) => {
  const mailToCustomer = customerMsg[from](props);
  const mailToBackOffice = backOfficeMsg[from](props);
  if (process.NOD_ENV !== 'test') {
    sgMail
      .send(mailToCustomer)
      .then((res) => {
        sgMail.send(mailToBackOffice).catch((err) => console.log({ err }));
      })
      .catch((error) => {
        console.log(error.response);
      });
  }
};

module.exports = sendMail;
