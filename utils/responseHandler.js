const sendSuccess = (
  res,
  { statusCode = 200, message = 'Success', data = null, meta = null, results = null } = {}
) => {
  const response = { status: 'success', message };

  if (results !== null) response.results = results;
  if (data !== null) response.data = data;
  if (meta !== null) response.meta = meta;

  return res.status(statusCode).json(response);
};

module.exports = sendSuccess;
