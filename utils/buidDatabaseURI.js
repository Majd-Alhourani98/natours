const buildDatabaseURI = (username, password, dbname, databaseURL) => {
  return databaseURL
    .replace('<USERNAME>', username)
    .replace('<PASSWORD>', password)
    .replace('<DATABASE_NAME>', dbname);
};

module.exports = buildDatabaseURI;
