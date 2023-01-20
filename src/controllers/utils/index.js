const { isDate } = require('date-fns');

const DATE_FIELDS = [
  'appointment',
  'appointmentFrom',
  'appointmentTo',
  'createdAt',
  'createdFrom',
  'createdTo',
  'updatedAt',
  'updatedFrom',
  'updatedTo',
];

const filterDatesFields = (keysArray) =>
  keysArray.filter((queryField) => {
    const queryFieldKey = Object.keys(queryField)[0];
    return DATE_FIELDS.includes(queryFieldKey);
  });

const checkIsDate = (propertiesArray) => {
  const dateErrorArray = [];

  propertiesArray.forEach((obj) => {
    const key = Object.keys(obj)[0];
    const appointmentDate = new Date(obj[key]);
    const invalidDate = JSON.stringify(appointmentDate) === 'null';

    if (!isDate(appointmentDate) || invalidDate) {
      dateErrorArray.push(key);
    }
  });

  return {
    isDateErr: Boolean(dateErrorArray.length > 0),
    dateErrors: dateErrorArray,
  };
};

const checkIsNum = (propertiesArray) => {
  const isNum = [];

  propertiesArray.forEach((obj) => {
    const key = Object.keys(obj)[0];
    const isNumber = Number(obj[key]);

    if (isNumber) {
      isNum.push(key);
    }
  });

  return { isNum: Boolean(isNum.length > 0), numErrors: isNum };
};

const msgGenerator = (errors) => {
  let msg = '';
  const lastIndex = errors.length - 1;
  errors.forEach((error, index) => {
    if (index === 0) {
      msg = error;
      return msg;
    }
    if (index === lastIndex) {
      msg = msg + ' and ' + error;
      return msg;
    }
    msg = msg + ', ' + error;

    return msg;
  });

  return msg;
};
const checkFields = (input, target) => {
  const errors = [];
  target.forEach((field) => {
    if (!input.includes(field)) {
      errors.push(field);
    }
  });
  return { hasAllFields: errors.length === 0, errors };
};

module.exports = {
  filterDatesFields,
  checkIsNum,
  checkIsDate,
  checkFields,
  msgGenerator,
};
