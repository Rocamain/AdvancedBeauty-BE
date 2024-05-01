module.exports = (date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const formattedMinutes =
    minutes.toString().length < 2 ? '0' + minutes : minutes;
  return `${hours}:${formattedMinutes}`;
};
