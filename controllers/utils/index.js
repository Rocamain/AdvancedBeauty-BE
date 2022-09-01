// eslint-disable-next-line array-callback-return

const checkIsNum = (propertiesArray) => {
  const isNum = [];

  propertiesArray.forEach((obj) => {
    const key = Object.keys(obj)[0];

    if (typeof obj[key] === 'number') {
      isNum.push(key);
    }
  });

  return { isNum: Boolean(isNum.length > 0), errors: isNum };
};

module.exports = { checkIsNum };
