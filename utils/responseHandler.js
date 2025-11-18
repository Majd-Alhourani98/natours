const sendSuccess = (
  res,
  {
    statusCode = 200,
    message = 'Success',
    data = null,
    meta = null,
    results = null,
    token = null,
  } = {}
) => {
  const response = { status: 'success', message };

  if (results !== null) response.results = results;
  if (data !== null) response.data = data;
  if (meta !== null) response.meta = meta;
  if (token !== null) response.token = token;

  return res.status(statusCode).json(response);
};

module.exports = sendSuccess;
