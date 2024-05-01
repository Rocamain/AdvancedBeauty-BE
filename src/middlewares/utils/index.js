const { isPast } = require('date-fns');
const {
  checkIsNum,
  checkIsDate,
  filterDatesFields,
  msgGenerator,
} = require('../../controllers/utils/index');

const throwDatesErrors = (req) => {
  const keysArray = Object.entries(req.query).map(([key, value]) => ({
    [key]: value,
  }));

  const dateFieldsArray = filterDatesFields(keysArray);
  const datesQueryFields = dateFieldsArray.length > 0;

  if (datesQueryFields) {
    throwIsNumberErr(dateFieldsArray);
    throwIsDateErr(dateFieldsArray);
  }

  return req;
};

const throwParamsErrors = (req) => {
  if (req?.params?.id) {
    const { id } = req.params;

    const isNumber = Number(id);

    if (!isNumber) {
      const err = new Error();
      err.msg = 'Bad request: id has to be a number';
      err.status = 400;
      throw err;
    }
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
const throwIsDateErr = (keysArray) => {
  const { isDateErr, dateErrors } = checkIsDate(keysArray);

  if (isDateErr) {
    let msg = msgGenerator(dateErrors);
    const err = new Error();
    err.status = 400;
    err.msg = `Bad request: ${msg} is not a date`;
    throw err;
  }
  return;
};

const throwIsNumberErr = (keysArray) => {
  const { isNum, numErrors } = checkIsNum(keysArray);

  if (isNum) {
    let msg = msgGenerator(numErrors);

    const err = new Error();
    err.msg = `Bad request: ${msg} cannot be a number`;
    err.status = 400;

    throw err;
  }
  return;
};

const throwPostBookingErrors = (req) => {
  const { appointment } = req.body;

  const keysArray = Object.entries(req.body).map(([key, value]) => ({
    [key]: value,
  }));

  const postValidation =
    req.baseUrl === '/api/bookings' && req.method === 'POST';

  if (postValidation && appointment) {
    throwIsNumberErr(keysArray);
    throwIsDateErr([{ appointment }]);
    throwIsPastErr(appointment);
  }

  return req;
};
module.exports = {
  throwIsNumberErr,
  throwDatesErrors,
  throwPostBookingErrors,
  throwParamsErrors,
};
