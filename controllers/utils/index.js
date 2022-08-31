const checkIsNum = (propertiesArray) => {
  const isNum = [];

  // eslint-disable-next-line array-callback-return
  propertiesArray.find((obj) => {
    const key = Object.keys(obj)[0];

    if (typeof obj[key] === 'number') {
      isNum.push(key);

      return key;
    }
  });
  return isNum;
};

module.exports = { checkIsNum };
