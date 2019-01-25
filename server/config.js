const env = process.env.NODE_ENV; // 'development' or 'production' or 'test'
const development = {
  db: {
    host: "localhost",
    port: 27017,
    name: "csgigs-admin"
  }
};

const test = {
  db: {
    host: "localhost",
    port: 27017,
    name: "csgigs-test"
  }
};

const production = {
  db: {
    host: "localhost",
    port: 27017,
    name: "csgigs-admin"
  }
};

const config = {
  development,
  production,
  test
};

module.exports = config[env];
