// eslint-disable-next-line array-callback-return

const checkIsNum = (propertiesArray) => {
  const isNum = [];

  propertiesArray.forEach((obj) => {
    const key = Object.keys(obj)[0];

    if (typeof obj[key] === 'number') {
      isNum.push(key);
    }
  });

  return { isNum: Boolean(isNum.length > 0), numErrors: isNum };
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

module.exports = { checkIsNum, checkFields };
