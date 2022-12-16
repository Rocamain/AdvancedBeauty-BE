const { isPast, isDate } = require('date-fns');
const { checkIsNum } = require('../../controllers/utils/index');

// controllers/utils/index.js
const throwDatesErrors = (req) => {
  const { updatedAt, createdAt } = req.query;

  const isUpdatedAtNum = updatedAt && Number(updatedAt);
  const isCreatedAtNum = createdAt && Number(createdAt);

  const err = new Error();
  err.status = 400;
  err.msg = 'Bad request: Invalid date';
  if (isCreatedAtNum || isUpdatedAtNum) {
    throw err;
  }

  return req;
};

const throwIsPastErr = (appointment) => {
  if (isPast(new Date(appointment))) {
    const err = new Error();
    err.status = 400;
    err.msg = `Bad request: cannot book a date in the past`;
    throw err;
  }
  return;
};
const throwIsDateErr = (appointment) => {
  const appointmentDate = new Date(appointment);
  const invalidDate = JSON.stringify(appointmentDate) === 'null';
  

  if (!isDate(appointmentDate) || invalidDate) {
    const err = new Error();
    err.status = 400;
    err.msg = `Bad request: Appointment is not a date`;
    throw err;
  }
  return;
};

const throwIsNumberErr = ({ appointment, customerName }) => {
  const { isNum, numErrors } = checkIsNum([{ customerName }, { appointment }]);
  if (isNum) {
    const err = new Error();
    err.msg = `Bad request: ${numErrors[0]} cannot be a number`;
    err.status = 400;

    throw err;
  }
  return;
};

const throwPutPostBookingErrors = (req) => {
  const { path } = req.route;
  const { appointment, customerName } = req.body;
  
  const postValidation =
    req.baseUrl === '/api/bookings' && req.method === 'POST';
  const putValidation =
    req.baseUrl + path === '/api/bookings/:id' && req.method === 'PUT';

  if ((postValidation || putValidation) && appointment) {
    throwIsDateErr(appointment);
    throwIsPastErr(appointment);
  }
  if ((postValidation || putValidation) && appointment && customerName) {
    throwIsNumberErr({ appointment, customerName });
  }

  return req;
};
module.exports = { throwDatesErrors, throwPutPostBookingErrors };
