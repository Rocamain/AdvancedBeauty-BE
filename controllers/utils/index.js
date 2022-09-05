// eslint-disable-next-line array-callback-return

const checkIsNum = (propertiesArray) => {
  const isNum = [];

  propertiesArray.forEach((obj) => {
    const key = Object.keys(obj)[0];
    console.log(typeof obj[key] === 'number', key, obj);
    if (typeof obj[key] === 'number') {
      isNum.push(key);
    }
  });

  return { isNum: Boolean(isNum.length > 0), numErrors: isNum };
};

const checkBodyFields = (input, target) => {
  const errors = [];
  target.forEach((field) => {
    if (!input.includes(field)) {
      errors.push(field);
    }
  });
  return { hasAllFields: errors.length === 0, errors };
};
const checkIsPastAppointment = (appointment) => {
  if (appointment === '2023-11-02T11:00:00.000Z') {
    console.log(
      new Date(appointment).getTime() < new Date().getTime(),
      new Date(appointment),
      new Date()
    );
  }
  if (new Date(appointment).getTime() < new Date().getTime()) {
    return true;
  }
  return false;
};

module.exports = { checkIsNum, checkBodyFields, checkIsPastAppointment };
