const env = process.env.NODE_ENV; // 'development' or 'production'
const development = {
  db: {
    // host: 'test1:test123@ds031895.mlab.com',
    // port: 31895,
    // name: 'projectgigstest'
    host: "localhost",
    port: 27017,
    name: "test"
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
  production
};

module.exports = config[env];
