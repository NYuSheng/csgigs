const env = process.env.NODE_ENV; // 'development' or 'production'
const development = {
    db: {
        // host: 'test1:test123@ds031895.mlab.com',
        // port: 31895,
        // name: 'projectgigstest'
        host: 'localhost',
        port: 27017,
        name: 'test'
    }
};

const production = {
    db: {
        host: '10.130.93.36',
        port: 27017,
        name: 'parties'
    }
};

const config = {
    development,
    production
};

module.exports = config[env];