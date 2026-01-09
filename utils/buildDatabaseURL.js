const buildDatabaseURL = (baseURL, username, password, databaseName) => {
  return baseURL
    .replace('<USERNAME>', username)
    .replace('<PASSWORD>', password)
    .replace('<DATABASE_NAME>', databaseName);
};

module.exports = buildDatabaseURL;
