// app.js

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var user = require('./routes/user.route');
var gig = require('./routes/gig.route');
var task = require('./routes/task.route');
var taskcategories = require('./routes/taskhashtag.route');

var app = express();

// Set up mongoose connection
require('./connection-db');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/admin-ui', express.static(path.join(__dirname, './public')));
app.use('/admin-ui/api/users', user);
app.use('/admin-ui/api/gigs', gig);
app.use('/admin-ui/api/tasks', task)
app.use('/admin-ui/api/task-categories', taskcategories);
app.get('/admin-ui/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

var appPort = 5000;

app.listen(appPort, () => {
    console.log('Server is up and running on port number ' + appPort);
});