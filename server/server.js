// app.js

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var product = require('./routes/product');
var user = require('./routes/user.route');
var gig = require('./routes/gig.route');
var task = require('./routes/task.route');

var app = express();


// Set up mongoose connection
var mongoose = require('mongoose');
var dev_db_url = 'mongodb://test1:test123@ds031895.mlab.com:31895/projectgigstest';
var mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/products', product);

app.use('/tasks', task)

app.use('/admin-ui', express.static(path.join(__dirname, './public')));
app.use('/admin-ui/users', user);
app.use('/admin-ui/gigs', gig);
app.get('/admin-ui/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

var port = 5000;

app.listen(port, () => {
    console.log('Server is up and running on port numner ' + port);
});