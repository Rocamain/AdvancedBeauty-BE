module.exports = async (request, url) => {
  const bodyKey = {
    '/api/customers': 'customers',
    '/api/services': 'services',
    '/api/bookings': 'bookings',
  };

  const { body } = await request.get(url);

  const maxIndex = body[bodyKey[url]].length - 1;
  const randomIndex = Math.floor(Math.random() * maxIndex + 1);
  const randomElement = body[bodyKey[url]][randomIndex];
  return randomElement;
};
