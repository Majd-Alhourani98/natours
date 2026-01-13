const buildDatabaseURL = (username, password, dbname, baseURL) => {
  return baseURL
    .replace("USERNAME", username)
    .replace("PASSWORD", password)
    .replace("DATABASE_NAME", dbname);
};

module.exports = buildDatabaseURL;
