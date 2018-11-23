var mongoose = require('mongoose');
const config = require('./config.js');
const {db: { host, port, name }} = config;

const connectionString = `mongodb://${host}:${port}/${name}`;
mongoose.connect(connectionString, {useNewUrlParser: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));