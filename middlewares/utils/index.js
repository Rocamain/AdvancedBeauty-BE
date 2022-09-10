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

module.exports = { throwDatesErrors };
