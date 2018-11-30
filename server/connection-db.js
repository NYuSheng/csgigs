var mongoose = require('mongoose');
const config = require('./config.js');
const {db: { host, port, name }} = config;

const connectionString = `mongodb://${host}:${port}/${name}`;
mongoose.connect(connectionString, {useNewUrlParser: true});
mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false); //to prevent DeprecationWarning in findOneAndUpdate method
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));