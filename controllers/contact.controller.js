const sendEmail = require('../services/send_grid');

const sendQueryEmail = (req, res, next) => {
  const { name, email, phone, shop, message } = req.body;

  sendEmail({
    name,
    email,
    phone,
    shop,
    message,
    from: 'contact',
  })
    .then((data) => res.status(200).json(data))
    .catch(next);
};

module.exports = sendQueryEmail;
