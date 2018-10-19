const User = require('../models/user.model');

//Simple version, without validation or sanitation
exports.test = function (req, res) {
    res.send('Greetings from the Test controller!');
};


exports.user_create = function (req, res) {
    let user = new User(
        {
            id: req.body.id,
            channelId:req.body.channelId,
            name: req.body.name,
            password: req.body.password,
            authToken: req.body.authToken
        }
    );

    user.save(function (err) {
        if (err) {
            return next(err);
        }
        res.send('User Created successfully')
    })
};