const { getYear, getMonth, getDate } = require('date-fns');

const LOCATIONS = {
  3: 'es-b',
  1: 'es-ct',
  2: 'es-ct',
};

const checkIsHolidays = async ({ appointmentDate, shopId }) => {
  const year = getYear(appointmentDate);
  const month = getMonth(appointmentDate) + 1;

  const day = getDate(appointmentDate);

  try {
    const nationalHolsData = await fetch(
      `${process.env.HOLS_API}?&api_key=${process.env.HOLS_KEY}&country=es&type=national&year=${year}&month=${month}&day=${day}`
    );
    const localHolsData = await fetch(
      `${process.env.HOLS_API}?&api_key=${process.env.HOLS_KEY}&country=es&location=${LOCATIONS[shopId]}&type=national&year=${year}&month=${month}&day=${day}`
    );

    const nationalHolsParsed = await nationalHolsData.json();
    const nationalHols = nationalHolsParsed.response.holidays;
    const localHolsParsed = await localHolsData.json();
    const localHols = localHolsParsed.response.holidays;
    const isHoliday = localHols.length > 0 || nationalHols.length > 0;
    return { isHoliday };
  } catch (err) {
    throw err;
  }
};

module.exports = checkIsHolidays;
