const env = process.env.NODE_ENV; // 'development' or 'production'
const development = {
    db: {
        host: 'localhost',
        port: 27017,
        name: 'db'
    }
};

const production = {
    db: {
        host: 'localhost',
        port: 27017,
        name: 'csgigs-admin'
    }
};

const config = {
    development,
    production
};

module.exports = config[env];